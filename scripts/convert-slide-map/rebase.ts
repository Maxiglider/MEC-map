/**
 * Step 4 of the conversion of an old slide map to MEC (see .claude/skills/convert-slide-map/SKILL.md).
 *
 * yarn convert-slide-map:rebase "<map file name in original-maps/>" [--remove-doodads DTg5,DTg7] [--keep-base-core]
 *
 * Without --remove-doodads, the doodads removed are the spec's gate types (conversion.json, gates.doodadTypes)
 * and its removeDoodadTypes.
 *
 * Starts from the MEC base map (MEC_BASE_MAP_LOCATION) and brings the old map's world into it:
 * - the terrain, doodads, pathing, shadows, minimap and preview, unchanged (the game reads their old versions),
 *   except the doodads of the types given to --remove-doodads: what MEC recreates as its own objects (gates
 *   become monsters) must not stay in the map as well,
 * - the map info: name, author, description, players text through the strings they point to, camera bounds,
 *   playable size, tileset and the fog and waves flags, patched in place in the base map's own format,
 * - the upkeep text: the old one when the old map changed it, else the old author's name,
 * - the generated main and config of war3map.lua: camera bounds, lighting, ambient sounds, music, start locations,
 * - the base map's start locations, moved to the old map's first one,
 * - the old unit types (standard ones changed and custom ones, heroes and items aside), merged into the object data,
 * - the MEC core built from this repo by `yarn release` (bin/MEC_core.lua), in the converted map's war3map.lua
 *   and war3map.wct, in place of the core the base map was saved with, between the markers releaseTest.ts uses
 *   (--keep-base-core keeps that one). The base map itself is only read, never written,
 * - the old hero's appearance (its skin fields: model, scale…) on MEC's hero units E000 and D001,
 * - "Powered by Max Escape Creation v…" in the map description, as mec-core-upgrade writes it.
 *
 * The gameplay (game data, custom triggers) comes with the game data step (gamedata.ts).
 *
 * The result goes to <MAPS_OUTPUT_DIR_FOR_AI_CONVERSION_TO_MEC>/convert-in-progress-maps/<name>--mec<version>_<date>.<ext>
 * (the name without "protected", the version and date of the MEC core it holds), until the user says the map is
 * converted; its path goes to conversion-work/<map>/rebase.json, and what was done to rebase.md.
 */
import 'dotenv/config'
import * as fs from 'fs'
import War3MapDoo from 'mdx-m3-viewer-th/dist/cjs/parsers/w3x/doo/file'
import War3Map from 'mdx-m3-viewer-th/dist/cjs/parsers/w3x/map'
import War3MapW3u from 'mdx-m3-viewer-th/dist/cjs/parsers/w3x/w3u/file'
import Modification from 'mdx-m3-viewer-th/dist/cjs/parsers/w3x/w3u/modification'
import ModifiedObject from 'mdx-m3-viewer-th/dist/cjs/parsers/w3x/w3u/modifiedobject'
import * as path from 'path'
import { normalizeScript } from './jass'
import {
    isWar3FilePath,
    KNOWN_MAP_FILES,
    mecMapName,
    parseW3iHead,
    parseWts,
    readArchive,
    saveArchiveWhole,
    withoutProtectedMarks,
} from './mapFiles'
import { rescueModelTextures } from './modelTextures'
import { fixObjectDataWriter, isSkinField, variableTypeOf } from './objectData'
import { TERRAIN_TEXTURE_PATHS } from './terrainTextures'

/** A standard unit's default values in the World Editor (war3-objectdata-th), by the names of its fields */
const unitDefaults = (id: string): { [field: string]: string | number } | undefined =>
    (
        JSON.parse(
            fs.readFileSync(require.resolve('war3-objectdata-th/dist/cjs/generated/unitsdata.json'), 'utf8')
        ) as { [id: string]: { [field: string]: string | number } }
    )[id]

fixObjectDataWriter()

const outputRoot = process.env.MAPS_OUTPUT_DIR_FOR_AI_CONVERSION_TO_MEC
const baseMapPath = process.env.MEC_BASE_MAP_LOCATION
const args = process.argv.slice(2)
const mapFileName = args[0] && !args[0].startsWith('--') ? path.basename(args[0]) : undefined

if (!outputRoot || !baseMapPath) {
    throw new Error('MAPS_OUTPUT_DIR_FOR_AI_CONVERSION_TO_MEC and MEC_BASE_MAP_LOCATION must be set in .env')
}

const oldMapPath = mapFileName && path.join(outputRoot, 'original-maps', mapFileName)
if (!oldMapPath || !fs.existsSync(oldMapPath)) {
    throw new Error(
        'Usage: yarn convert-slide-map:rebase "<map file name in original-maps/>" (run the extraction first)'
    )
}

const mapName = mapFileName!.replace(/\.w3[mx]$/i, '')
const workDir = path.join(outputRoot, 'conversion-work', mapName)

// the doodads MEC recreates as its own objects: --remove-doodads, else the spec's gate types and removeDoodadTypes
const specPath = path.join(workDir, 'conversion.json')
const spec = fs.existsSync(specPath) ? JSON.parse(fs.readFileSync(specPath, 'utf8')) : {}
const removeDoodadsArg = args.includes('--remove-doodads') ? args[args.indexOf('--remove-doodads') + 1] : undefined
const removedDoodadTypes = new Set<string>(
    removeDoodadsArg !== undefined
        ? removeDoodadsArg.split(',').filter(Boolean)
        : [...Object.keys(spec.gates?.doodadTypes ?? {}), ...(spec.removeDoodadTypes ?? [])]
)
const log: string[] = []

const old = readArchive(fs.readFileSync(oldMapPath)).files
const oldText = (name: string) => {
    const bytes = old.get(name)
    return bytes ? Buffer.from(bytes).toString('utf8') : undefined
}

const map = new War3Map()
map.load(new Uint8Array(fs.readFileSync(baseMapPath)), false)
const base = map.archive

const baseBytes = (name: string) => {
    const bytes = base.get(name)?.bytes()
    if (!bytes) throw new Error(`The base map has no ${name}`)
    return Buffer.from(bytes)
}
const set = (name: string, bytes: Uint8Array | string, why: string) => {
    base.set(name, typeof bytes === 'string' ? Buffer.from(bytes, 'utf8') : bytes)
    log.push(`- \`${name}\`: ${why}`)
}

// 1. the world, unchanged but for the doodads MEC recreates
const oldDoo = old.get('war3map.doo')
if (oldDoo) {
    const doo = new War3MapDoo()
    // format 7 and 8 doodads before 1.32 have no skin: read as such
    doo.load(oldDoo, 1)
    const before = doo.doodads.length
    const removed: { [type: string]: number } = {}
    doo.doodads = doo.doodads.filter(d => {
        if (!removedDoodadTypes.has(d.id)) return true
        removed[d.id] = (removed[d.id] ?? 0) + 1
        return false
    })
    const detail = Object.entries(removed)
        .map(([t, n]) => `${n} ${t}`)
        .join(', ')

    // The destructables an old map's triggers use are created by its script (set gg_dest_<type>_<editor id> =
    // CreateDestructable in main), their doodad entries flagged 0 so that the game leaves them out. The World Editor
    // turns such entries into placed doodads (flag 2) when it saves the map, and the game then placed them twice
    // (Polar Escape 3's bridges: one collapsing, one never). So either (spec.scriptDestructables):
    // - "script" (default): their entries are removed, and the game data step creates them by script as the old map
    //   did (Polar Escape 3's bridges rise and collapse with their animations); they don't show in the editor;
    // - "file": they are placed from the file, as the editor would, and not created by script again.
    const oldScriptForDoodads = normalizeScript(oldText('scripts\\war3map.j') ?? oldText('war3map.j') ?? '')
    const scriptPlaced = new Set(
        [...oldScriptForDoodads.matchAll(/gg_dest_(\w{4})_(\d+)\s*=\s*CreateDestructableZ?\(/g)].map(
            m => `${m[1]}_${Number(m[2])}`
        )
    )
    const byScript = (spec.scriptDestructables ?? 'script') === 'script'
    let madePlaced = 0
    let leftToScript = 0
    doo.doodads = doo.doodads.filter(doodad => {
        if (doodad.flags !== 0 || !scriptPlaced.has(`${doodad.id}_${doodad.editorId}`)) return true
        if (byScript) {
            leftToScript++
            return false
        }
        doodad.flags = 2
        madePlaced++
        return true
    })

    // The current editor reads the doodads of a 3.0 map with skins whatever the file's own format says, and
    // misreads an older one (invalid object ids, no doodad shown). So they are written in the 1.32 format:
    // format 8, subversion 11, each doodad with its own type as skin and no item table.
    const oldFormat = `${doo.version}.${doo.u1[0]}`
    doo.version = 8
    doo.u1 = new Uint8Array([11, 0, 0, 0])
    for (const doodad of doo.doodads) {
        doodad.skin = doodad.id
        if (oldFormat.startsWith('7.')) {
            doodad.itemTable = -1
            doodad.itemSets = []
        }
    }

    set(
        'war3map.doo',
        doo.save(132),
        `the old map’s (format ${oldFormat} → 8.11 with skins)` +
            (removedDoodadTypes.size
                ? `, ${before - doo.doodads.length} removed (${detail || 'none found'}), recreated by MEC`
                : '') +
            (madePlaced ? `, ${madePlaced} created by the old script placed from the file instead (flag 0 → 2)` : '') +
            (leftToScript ? `, ${leftToScript} created by the old script removed (created by script again)` : '')
    )
}

/**
 * The tiles an old map renamed, by re-skinning them (spec terrainTypeIdRemap: old id -> the id whose texture it
 * imported). Writing the real id instead carries the look without carrying the file: a corner of the terrain holds
 * an index into the w3e's own tileset list, so rewriting that list moves every corner at once. It is a permutation
 * - Slide Is Magic's `Ndrt` becomes `Nice` while its `Nice` becomes `Isnw` - so it is applied in one pass.
 */
const terrainTypeIdRemap: { [oldId: string]: string } = Object.fromEntries(
    Object.entries((spec.terrainTypeIdRemap ?? {}) as { [k: string]: string }).filter(([from]) => !from.startsWith('$'))
)

const remapW3eTilesets = (bytes: Buffer) => {
    const entries = Object.entries(terrainTypeIdRemap)
    if (entries.length === 0) return bytes

    // W3E!, version, tileset char, custom tilesets flag, then the ground tileset ids
    const nbGround = bytes.readUInt32LE(13)
    const done: string[] = []

    for (let i = 0; i < nbGround; i++) {
        const at = 17 + i * 4
        const id = bytes.toString('latin1', at, at + 4)
        const to = terrainTypeIdRemap[id]
        if (to) {
            bytes.write(to, at, 'latin1')
            done.push(`${id} → ${to}`)
        }
    }

    const missed = entries.filter(([from]) => !done.some(d => d.startsWith(from + ' ')))
    if (missed.length > 0)
        throw new Error(`terrainTypeIdRemap: ${missed.map(([f]) => f).join(', ')} is not a tile of the old terrain`)

    log.push(`- \`war3map.w3e\`: tiles renamed to the ones whose texture the old map imported: ${done.join(', ')}`)
    return bytes
}

for (const name of [
    'war3map.w3e',
    'war3map.wpm',
    'war3map.shd',
    'war3map.mmp',
    'war3mapMap.blp',
    'war3mapPreview.tga',
]) {
    const bytes = old.get(name)
    if (bytes) {
        set(name, name === 'war3map.w3e' ? remapW3eTilesets(Buffer.from(bytes)) : bytes, 'the old map’s')
    } else if (base.has(name) && ['war3mapMap.blp', 'war3mapPreview.tga', 'war3map.mmp'].includes(name)) {
        base.delete(name)
        log.push(`- \`${name}\`: removed, the old map has none and the base map’s shows its own terrain`)
    }
}

// 2. the strings: the map info and the upkeep text point to them
const oldWts = parseWts(oldText('war3map.wts') ?? '')
const resolveOld = (s: string) => s.replace(/TRIGSTR_\d+/g, key => oldWts[key] ?? key)
const oldInfo = parseW3iHead(old.get('war3map.w3i')!)
const baseInfo = parseW3iHead(baseBytes('war3map.w3i'))

let wts = baseBytes('war3map.wts').toString('utf8')
const setString = (reference: string, text: string, what: string) => {
    const id = /^TRIGSTR_(\d+)$/.exec(reference)?.[1]
    if (!id) return false

    const block = new RegExp(`(STRING ${Number(id)}\\r?\\n(?://[^\\r\\n]*\\r?\\n)?\\{\\r?\\n)([\\s\\S]*?)(\\r?\\n\\})`)
    if (!block.test(wts)) return false

    wts = wts.replace(block, (_, start, _text, end) => start + text + end)
    log.push(`- \`war3map.wts\` ${reference} (${what}): ${JSON.stringify(text)}`)
    return true
}

const author = resolveOld(oldInfo.author)
// the name in the game: its version replaced by [M2], within what Warcraft III takes
const oldGameName = resolveOld(oldInfo.name)
const gameName = mecMapName(oldGameName)
if (!setString(baseInfo.name, gameName, `map name, from ${JSON.stringify(oldGameName)}`)) {
    throw new Error('The base map’s map name is not a TRIGSTR reference: patching it in the map info is not supported')
}
// "Powered by" the MEC core the map holds, in the description, as mec-core-upgrade does: a version already
// there is replaced, else the line goes after the description (or is the description when there is none)
const MEC_VERSION = /(Max Escape Creation v.+? \d\d:\d\d:\d\d)/i
const coreSource = args.includes('--keep-base-core')
    ? baseBytes('war3map.lua').toString('utf8')
    : fs.readFileSync(path.join(__dirname, '..', '..', 'bin', 'MEC_core.lua'), 'utf8')
const mecVersion = MEC_VERSION.exec(coreSource)?.[1]
if (!mecVersion) throw new Error('No "Max Escape Creation v… hh:mm:ss" version in the MEC core')
// the line has no color of its own, as mec-core-upgrade writes it: a color the description leaves open (a |c code
// with no |r after it) would run on over it, so it is closed first
const closesColor = (text: string) => {
    const lastColor = text.search(/\|c[0-9a-f]{8}(?![\s\S]*\|c[0-9a-f]{8})/i)
    return lastColor !== -1 && !/\|r/i.test(text.substring(lastColor)) ? '|r' : ''
}
const poweredBy = (description: string) =>
    MEC_VERSION.test(description)
        ? description.replace(MEC_VERSION, mecVersion)
        : description.length > 0
          ? `${description}${closesColor(description)}\r\nPowered by ${mecVersion}`
          : `Powered by ${mecVersion}`

for (const [field, what] of [
    ['author', 'author'],
    ['description', 'description'],
    ['recommendedPlayers', 'recommended players'],
] as const) {
    const text = field === 'description' ? poweredBy(resolveOld(oldInfo[field])) : resolveOld(oldInfo[field])
    if (!setString(baseInfo[field], text, what)) {
        throw new Error(
            `The base map’s ${what} is not a TRIGSTR reference: patching it in the map info is not supported`
        )
    }
}

// the upkeep text: the old one if the old map changed it, else the old author
const skinLines = (text?: string) =>
    Object.fromEntries(
        (text ?? '')
            .split(/\r?\n/)
            .map(l => /^\s*(\w+)\s*=\s*(.*?)\s*$/.exec(l))
            .filter((m): m is RegExpExecArray => !!m)
            .map(m => [m[1], m[2]])
    )
const oldSkin = skinLines(oldText('war3mapSkin.txt'))
const oldUpkeep = Object.keys(oldSkin).filter(k => k.startsWith('UPKEEP_'))
let baseSkinText = baseBytes('war3mapSkin.txt').toString('utf8')
const baseSkin = skinLines(baseSkinText)

if (oldUpkeep.length === 0) {
    const reference = baseSkin['UPKEEP_NONE']
    const current = /^TRIGSTR_(\d+)$/.test(reference) ? (parseWts(wts)[reference] ?? '') : ''
    const color = /^\|c[0-9a-fA-F]{8}/.exec(current)?.[0] ?? ''
    if (!setString(reference, color + author, 'upkeep text, the old map keeps the default')) {
        throw new Error('The base map’s UPKEEP_NONE is not a TRIGSTR reference')
    }
} else {
    for (const key of oldUpkeep) {
        const value = resolveOld(oldSkin[key].replace(/^"(.*)"$/, '$1'))
        const line = new RegExp(`^${key}=.*$`, 'm')
        baseSkinText = line.test(baseSkinText)
            ? baseSkinText.replace(line, `${key}=${value}`)
            : baseSkinText.replace(/(\[FrameDef\][^\n]*\n)/, `$1${key}=${value}\r\n`)
    }
    set('war3mapSkin.txt', baseSkinText, `the old map’s upkeep text: ${oldUpkeep.join(', ')}`)
}

// the base map's other placeholders, such as its welcome message ("Welcome to: Your map", "Created by: You"):
// replaced inside their own color codes, the old name without its own
const plainName = gameName
    .replace(/\|c[0-9a-fA-F]{8}|\|r/gi, '')
    .replace(/\s+/g, ' ')
    .trim()
for (const [placeholder, value] of [
    ['Your map', plainName],
    ['You', author],
] as const) {
    const pattern = new RegExp(`(\\|c[0-9a-fA-F]{8})${placeholder}(\\|r)`, 'g')
    const count = (wts.match(pattern) ?? []).length
    if (count > 0) {
        wts = wts.replace(pattern, `$1${value}$2`)
        log.push(`- \`war3map.wts\`: "${placeholder}" → ${JSON.stringify(value)} (${count}×, in its color)`)
    }
}

// MEC's own quest says the map was converted to MEC with help of AI (user's rule); its other lines (and links) stay.
// A MEC 1 map is left out of it: it was already made with MEC, in the World Editor, by its author's own hand - what
// happens here is its engine going from MEC 1 to MEC 2, not a conversion to MEC - so it keeps the base map's "made
// with" wording, which is simply true of it.
const MADE_WITH_MEC = 'This map was made with Max Escape Creation 2.'
const CONVERTED_TO_MEC = 'This map was converted to Max Escape Creation 2 with help of AI.'
// that quest's title, a whole string of its own
const MEC_QUEST_TITLE = 'MapDescription'
const CONVERSION_QUEST_TITLE = 'To MEC conversion'

if (spec.mecOne) {
    log.push(`- \`war3map.wts\`: MEC's own quest left as it is (MEC 1 map: it was already made with MEC)`)
} else {
    const madeWithCount = wts.split(MADE_WITH_MEC).length - 1
    wts = wts.split(MADE_WITH_MEC).join(CONVERTED_TO_MEC)
    log.push(
        madeWithCount
            ? `- \`war3map.wts\`: "${MADE_WITH_MEC}" → "${CONVERTED_TO_MEC}" (${madeWithCount}×, MEC's quest)`
            : `- \`war3map.wts\`: **"${MADE_WITH_MEC}" not found** in the base map's strings: MEC's quest not changed, check it`
    )
    const questTitle = new RegExp(`(STRING \\d+\\r?\\n(?://[^\\n]*\\n)?\\{\\r?\\n)${MEC_QUEST_TITLE}(\\r?\\n\\})`, 'g')
    const questTitleCount = (wts.match(questTitle) ?? []).length
    wts = wts.replace(questTitle, `$1${CONVERSION_QUEST_TITLE}$2`)
    log.push(
        questTitleCount
            ? `- \`war3map.wts\`: MEC's quest title "${MEC_QUEST_TITLE}" → "${CONVERSION_QUEST_TITLE}" (${questTitleCount}×)`
            : `- \`war3map.wts\`: **MEC's quest title "${MEC_QUEST_TITLE}" not found**: not changed, check it`
    )
}

set('war3map.wts', wts, 'the strings above')

// 3. the map info: fixed-size fields patched in place, the rest of the base map's own format kept
const w3i = baseBytes('war3map.w3i')
let offset = 12 + (baseInfo.version >= 28 ? 16 : 0)
for (let i = 0; i < 4; i++) offset = w3i.indexOf(0, offset) + 1
oldInfo.cameraBounds.forEach((v, i) => w3i.writeFloatLE(v, offset + i * 4))
offset += 32
oldInfo.cameraBoundsComplements.forEach((v, i) => w3i.writeInt32LE(v, offset + i * 4))
offset += 16
w3i.writeInt32LE(oldInfo.playableWidth, offset)
w3i.writeInt32LE(oldInfo.playableHeight, offset + 4)
offset += 8
// masked areas partially visible, waves on cliff and rolling shores: how the old world looks
const worldFlags = 0x0010 | 0x0800 | 0x1000
const flags = (w3i.readUInt32LE(offset) & ~worldFlags) | (parseInt(oldInfo.flags, 16) & worldFlags)
w3i.writeUInt32LE(flags >>> 0, offset)

// the graphics modes the map supports (format 29+: after the Lua flag, 1 SD, 2 HD, 3 both), and the game data
// version after it. A map made before Reforged only knew SD, and its models may play differently in HD (Polar Escape
// 3's bridges rise and collapse in SD, toggle in HD): SD only, unless the spec says otherwise (graphicsModes).
const MODES: { [name: string]: number } = { SD: 1, HD: 2, both: 3 }
const modes = spec.graphicsModes !== undefined ? MODES[spec.graphicsModes] : oldInfo.version < 31 ? MODES.SD : undefined
if (spec.graphicsModes !== undefined && modes === undefined)
    throw new Error(`spec.graphicsModes: SD, HD or both, not ${spec.graphicsModes}`)
if (modes !== undefined) {
    let at = -1
    for (let i = offset + 5; i + 12 <= w3i.length; i++) {
        const [lua, supported, dataVersion] = [w3i.readUInt32LE(i), w3i.readUInt32LE(i + 4), w3i.readUInt32LE(i + 8)]
        if (lua === 1 && supported >= 1 && supported <= 3 && dataVersion <= 1) {
            at = i + 4
            break
        }
    }
    if (at === -1) throw new Error('No Lua flag / supported modes / game data version in the base map’s war3map.w3i')
    const before = w3i.readUInt32LE(at)
    w3i.writeUInt32LE(modes, at)
    log.push(`- \`war3map.w3i\`: supported graphics modes ${before} → ${modes} (1 SD, 2 HD, 3 both)`)
}
w3i[offset + 4] = oldInfo.tileset.charCodeAt(0)

// the old map's loading screen (user's rule: its custom things are kept): its number (a campaign screen, or -1 with
// the imported model), model, title, subtitle and text, their old strings resolved. Its strings change length, so the
// map info is rebuilt around them, last.
let w3iOut: Buffer = w3i
const oldScreen = oldInfo.loadingScreen
const oldString = (s: string) => (/^TRIGSTR_\d+$/.test(s) ? (oldWts[s] ?? '') : s)
if (oldScreen.number !== -1 || oldScreen.model || oldScreen.text || oldScreen.title || oldScreen.subtitle) {
    const baseScreen = parseW3iHead(w3i).loadingScreen
    const screen = [
        oldScreen.model,
        oldString(oldScreen.text),
        oldString(oldScreen.title),
        oldString(oldScreen.subtitle),
    ]
    if (baseInfo.version < 25)
        throw new Error(`The base map's map info (format ${baseInfo.version}) has no loading screen model`)
    w3i.writeInt32LE(oldScreen.number, baseScreen.numberAt)
    w3iOut = Buffer.concat([
        w3i.subarray(0, baseScreen.stringsAt),
        ...screen.map(v => Buffer.concat([Buffer.from(v, 'utf8'), Buffer.from([0])])),
        w3i.subarray(baseScreen.stringsEnd),
    ])
    log.push(
        `- \`war3map.w3i\`: the old loading screen: number ${oldScreen.number}${oldScreen.model ? `, model ${oldScreen.model}` : ''}${screen[2] ? `, title ${JSON.stringify(screen[2])}` : ''}${screen[3] ? `, subtitle ${JSON.stringify(screen[3])}` : ''}${screen[1] ? `, text ${JSON.stringify(screen[1])}` : ''}`
    )
}
set(
    'war3map.w3i',
    w3iOut,
    `camera bounds, playable size ${oldInfo.playableWidth}×${oldInfo.playableHeight}, tileset ${oldInfo.tileset}, flags 0x${(flags >>> 0).toString(16)} (fog and waves from the old map)`
)

// 4. the MEC core: the one built from this repo, not the one the base map was saved with
const CORE_START = '-- Max Escape Creation'
const CORE_END = 'onGlobalInit(initMEC_core)'
const corePath = path.join(__dirname, '..', '..', 'bin', 'MEC_core.lua')
let newCore = args.includes('--keep-base-core') ? undefined : fs.readFileSync(corePath, 'utf8')
if (newCore && (!newCore.startsWith(CORE_START) || !newCore.trimEnd().endsWith(CORE_END))) {
    throw new Error(`${corePath} does not run from "${CORE_START}" to "${CORE_END}": run yarn release`)
}

// the conversion noted in MEC's own version quest (user's rule), as a second paragraph under the core's own lines:
// that quest is the one a player opens to know what the map runs, so the note stands where it is looked for, and
// the old map's own quests are left as their author wrote them. A MEC 1 map says what really happened to it - its
// engine went from MEC 1 to MEC 2 - rather than claiming a conversion to MEC it never needed.
const today = new Date()
const buildDate = [today.getFullYear(), today.getMonth() + 1, today.getDate()]
    .map(n => String(n).padStart(2, '0'))
    .join('-')
const conversionNote = spec.mecOne
    ? `${buildDate} Map brought from MEC 1 to MEC 2 by Maximaxou with help of AI`
    : `${buildDate} Map converted to MEC by Maximaxou with help of AI`
if (newCore) {
    const description = /(QuestSetDescription\(q, ")([^"]*)(")/
    if (!description.test(newCore)) throw new Error(`No MEC version quest to note the conversion in: ${corePath}`)
    // two \n in the Lua string the core hands the quest, which makes one blank line between the paragraphs
    newCore = newCore.replace(description, `$1$2\\n\\n${conversionNote}$3`)
    log.push(`- MEC's version quest: "${conversionNote}" added under its description`)
}
const spliceCore = (text: string, where: string) => {
    const start = text.indexOf(CORE_START)
    const end = text.indexOf(CORE_END, start)
    if (start === -1 || end === -1) throw new Error(`No MEC core markers in the base map’s ${where}`)
    return text.substring(0, start) + newCore!.trimEnd() + text.substring(end + CORE_END.length)
}
const coreVersion = newCore?.split('\n')[0].replace(CORE_START, '').trim()

// 5. the generated main and config of the script
const oldScript = normalizeScript(oldText('scripts\\war3map.j') ?? oldText('war3map.j') ?? '')
const oldLine = (native: string) => {
    const m = new RegExp(`^\\s*call\\s+(${native}\\(.*\\))\\s*$`, 'm').exec(oldScript)
    return m?.[1]
}

let lua = baseBytes('war3map.lua').toString('utf8')
if (newCore) lua = spliceCore(lua, 'war3map.lua')
const mainStart = lua.indexOf('\nfunction main()')
const mainEnd = lua.indexOf('\nend', mainStart)
let main = lua.substring(mainStart, mainEnd)
for (const native of [
    'SetCameraBounds',
    'SetDayNightModels',
    'NewSoundEnvironment',
    'SetAmbientDaySound',
    'SetAmbientNightSound',
    'SetMapMusic',
]) {
    const replacement = oldLine(native)
    if (replacement && new RegExp(`\\n${native}\\(`).test(main)) {
        main = main.replace(new RegExp(`\\n${native}\\(.*`), '\n' + replacement)
    }
}
lua = lua.substring(0, mainStart) + main + lua.substring(mainEnd)

// every start location (where the camera starts) at the centre of level 1's start when the spec names an old region
// for it (Sliding Bunnys' player 1 start stood in the middle of the map, its script panning to the heroes at once),
// else at the old player 1 start
const levelOneStart = typeof spec.levels?.[0]?.start === 'string' ? spec.levels[0].start : undefined
const levelOneRect =
    levelOneStart &&
    new RegExp(`gg_rct_${levelOneStart}=Rect\\(([-\\d.]+),([-\\d.]+),([-\\d.]+),([-\\d.]+)\\)`).exec(oldScript)
const start = /DefineStartLocation\(0,\s*([-\d.]+),\s*([-\d.]+)\)/.exec(oldScript)
if (!levelOneRect && !start) throw new Error('No start location for player 1 in the old map')
const startX = levelOneRect ? (Number(levelOneRect[1]) + Number(levelOneRect[3])) / 2 : Number(start![1])
const startY = levelOneRect ? (Number(levelOneRect[2]) + Number(levelOneRect[4])) / 2 : Number(start![2])
lua = lua.replace(
    /DefineStartLocation\((\d+), [-\d.]+, [-\d.]+\)/g,
    (_, i) => `DefineStartLocation(${i}, ${startX.toFixed(1)}, ${startY.toFixed(1)})`
)
set(
    'war3map.lua',
    lua,
    `${newCore ? `MEC core ${coreVersion}, ` : ''}main (camera bounds, lighting, ambient sounds, music from the old map) and config (every start location at ${startX}, ${startY})`
)

// the core in war3map.wct: its own custom text block, prefixed by its length with the final null
if (newCore) {
    const wct = baseBytes('war3map.wct')
    const at = wct.indexOf(CORE_START)
    if (at === -1) throw new Error('No MEC core in the base map’s war3map.wct')
    const blockLength = wct.readUInt32LE(at - 4)
    const block = Buffer.from(spliceCore(wct.toString('utf8', at, at + blockLength - 1), 'war3map.wct'), 'utf8')
    const length = Buffer.alloc(4)
    length.writeUInt32LE(block.length + 1)
    set(
        'war3map.wct',
        Buffer.concat([wct.subarray(0, at - 4), length, block, wct.subarray(at + blockLength - 1)]),
        `MEC core ${coreVersion}`
    )
}

// 6. the start locations of the editor, where the old map's first one is
const unitsDoo = baseBytes('war3mapUnits.doo')
let moved = 0
for (let at = unitsDoo.indexOf('sloc'); at !== -1; at = unitsDoo.indexOf('sloc', at + 4)) {
    // a record starts with its id and holds its skin 36 bytes later: id, variation, x y z, angle, scale x y z
    if (unitsDoo.toString('latin1', at + 36, at + 40) !== 'sloc') continue
    unitsDoo.writeFloatLE(startX, at + 8)
    unitsDoo.writeFloatLE(startY, at + 12)
    moved++
    at += 36
}
set('war3mapUnits.doo', unitsDoo, `${moved} start locations moved to ${startX}, ${startY}`)

// 7. the unit types: standard ones changed and custom ones, into the base map's object data and skin
const idsOf = (file: string) =>
    new Set(
        [
            ...fs
                .readFileSync(require.resolve(`war3-objectdata-th/dist/cjs/generated/constants/${file}.d.ts`), 'utf8')
                .matchAll(/= "(\w{4})"/g),
        ].map(m => m[1])
    )
const standardUnits = idsOf('units')
const standardHeroes = new Set([...standardUnits].filter(id => /^[A-Z]/.test(id)))

const oldW3uBytes = old.get('war3map.w3u')
if (oldW3uBytes) {
    const oldW3u = new War3MapW3u()
    oldW3u.load(oldW3uBytes)
    const baseW3u = new War3MapW3u()
    baseW3u.load(baseBytes('war3map.w3u'))
    const baseSkinW3u = new War3MapW3u()
    baseSkinW3u.load(baseBytes('war3mapSkin.w3u'))

    const taken = new Set(
        [baseW3u, baseSkinW3u]
            .flatMap(f => f.customTable.objects.map(o => o.newId))
            .concat(baseW3u.originalTable.objects.map(o => o.oldId))
    )
    const merged: string[] = []
    const skipped: string[] = []
    const modelsRepointed = new Set<string>()

    /**
     * The object data of a map made in the World Editor names a model `.mdl` while the file imported beside it is
     * `.mdx`, and the game is expected to swap the extension. It does - unless the name holds a dot of its own,
     * `Frost_Fury_v1.1.mdl`, where the swap has nothing sound to cut on. So the name of the file that is really
     * there is written instead, which is what it meant all along.
     */
    const pointAtTheFileThatExists = (source: ModifiedObject) => {
        for (const modification of source.modifications) {
            const value = modification.value
            if (typeof value !== 'string' || !/\.mdl$/i.test(value)) continue
            if (old.has(value)) continue

            const mdx = value.replace(/\.mdl$/i, '.mdx')
            if (!old.has(mdx)) continue

            modification.value = mdx
            modelsRepointed.add(`${value} → ${mdx}`)
        }
    }

    const add = (table: 'originalTable' | 'customTable', source: ModifiedObject) => {
        const id = table === 'customTable' ? source.newId : source.oldId
        const baseId = source.oldId

        pointAtTheFileThatExists(source)

        if (!standardUnits.has(baseId)) {
            skipped.push(`${id} (not a unit: an item or else)`)
            return
        }
        if (standardHeroes.has(baseId) && table === 'originalTable') {
            skipped.push(`${id} (a hero: MEC has its own)`)
            return
        }
        if (taken.has(id)) {
            skipped.push(`${id} (the base map already uses this id)`)
            return
        }

        for (const [file, keep] of [
            [baseW3u, (m: any) => !isSkinField(m.id)],
            [baseSkinW3u, (m: any) => isSkinField(m.id)],
        ] as const) {
            const object = new ModifiedObject()
            object.oldId = source.oldId
            object.newId = source.newId
            object.sets = 1
            object.setsFlag = [0]
            object.modifications = source.modifications.filter(keep)
            if (object.modifications.length > 0 || (table === 'customTable' && file === baseW3u)) {
                file[table].objects.push(object)
            }
        }
        merged.push(table === 'customTable' ? `${id}<${baseId}` : id)
    }

    oldW3u.originalTable.objects.forEach(o => add('originalTable', o))
    oldW3u.customTable.objects.forEach(o => add('customTable', o))

    if (modelsRepointed.size > 0)
        log.push(`- models named after a file that is not there, repointed: ${[...modelsRepointed].join(', ')}`)

    // the old hero's looks on MEC's heroes: its skin fields, over theirs
    const facts = JSON.parse(fs.readFileSync(path.join(workDir, 'facts.json'), 'utf8'))
    const heroCounts: { [type: string]: number } = {}
    for (const u of facts.units as { typeId: string; owner: string }[]) {
        const player = /^Player\((\d+)\)$/.exec(u.owner)
        if (/^[A-Z]/.test(u.typeId) && player && Number(player[1]) < 12)
            heroCounts[u.typeId] = (heroCounts[u.typeId] ?? 0) + 1
    }
    // the players' unit: a hero type, the most common among players 1 to 12, or the spec's hero.unitType (an old map
    // whose players move a plain unit, such as Sliding Bunnys' n000)
    const heroType: string | undefined =
        spec.hero?.unitType ?? Object.entries(heroCounts).sort((a, b) => b[1] - a[1])[0]?.[0]
    const oldHero =
        heroType &&
        (oldW3u.customTable.objects.find(o => o.newId === heroType) ??
            oldW3u.originalTable.objects.find(o => o.oldId === heroType))
    const heroBase = oldHero ? oldHero.oldId : heroType
    const looks = oldHero ? oldHero.modifications.filter(m => isSkinField(m.id)) : []
    const addLook = (id: string, value: string | number) => {
        if (looks.some(m => m.id === id)) return
        const look = new Modification()
        look.id = id
        look.value = value
        look.variableType = variableTypeOf(id, value)
        looks.push(look)
    }
    // the model the spec gives (hero.model), over the base unit's
    spec.hero?.model && addLook('umdl', spec.hero.model)
    // a hero based on another unit than MEC's Demon Hunter: that unit's own looks, where the old map keeps them
    // (Sliding Bunnys' Bunny, a Rabbit): its model, scale, selection circle and shadow, from the World Editor's defaults
    if (heroBase && heroBase !== 'Edem') {
        const defaults = unitDefaults(heroBase)
        if (defaults) {
            const fromDefaults: [string, string][] = [
                ['umdl', 'modelFile'],
                ['usca', 'scalingValueundefined'],
                ['ussc', 'selectionScale'],
                ['ushu', 'shadowImageUnit'],
                ['ushw', 'shadowImageWidth'],
                ['ushh', 'shadowImageHeight'],
                ['ushx', 'shadowImageCenterX'],
                ['ushy', 'shadowImageCenterY'],
            ]
            for (const [id, key] of fromDefaults) {
                const value = defaults[key]
                if (value !== undefined && value !== '') addLook(id, value)
            }
        }
    }

    if (heroType) {
        for (const mecHero of ['E000', 'D001']) {
            const object = baseSkinW3u.customTable.objects.find(o => o.newId === mecHero)
            if (!object) continue
            object.modifications = object.modifications.filter(m => !looks.some(l => l.id === m.id)).concat(looks)
        }
        log.push(
            `- MEC heroes E000 and D001: the old hero ${heroType}'s looks (${looks.map(m => `${m.id}=${m.value}`).join(', ') || 'none changed'})`
        )
        if (heroBase !== 'Edem' && !looks.some(m => m.id === 'umdl')) {
            log.push(
                `  - **the old hero is based on ${heroBase}, not the Demon Hunter: set its model (umdl) on E000 and D001 by hand**`
            )
        }
    }

    set('war3map.w3u', baseW3u.save(), `merged ${merged.join(' ')}`)
    set('war3mapSkin.w3u', baseSkinW3u.save(), 'their looks (name, model, scale…)')
    skipped.length && log.push(`  - not merged: ${skipped.join(', ')}`)
}

for (const name of ['war3map.w3t', 'war3map.w3a', 'war3map.w3b', 'war3map.w3d', 'war3map.w3h', 'war3map.w3q']) {
    old.has(name) && log.push(`- \`${name}\`: **the old map has one, not merged yet**`)
}

// 7b. the old map's imported files (user's rule: its custom things are kept, a loading screen say), at their paths,
// listed in war3map.imp so that the World Editor keeps them (13: a path of its own). A file the base map already
// has at that path stays the base map's.
// a re-skinned tile that was renamed carries its look through its new id: its texture file is not imported
const remappedTextures = new Set(
    Object.keys(terrainTypeIdRemap)
        .map(id => TERRAIN_TEXTURE_PATHS[id]?.toLowerCase())
        .filter(Boolean)
)

/**
 * What a MEC 1 map carries that MEC 2 has no use for (user's rule, 2026-09-21).
 *
 * The three tables are the game's own, put in the map by the World Editor of the day. They are of an old patch -
 * the ability one is a quarter the size of the game's today - and importing one puts that old version back over
 * the current one, MEC's own immolation abilities (`ANpi`) included.
 *
 * `triple_kill.wav` is MEC 1's own: its `gg_snd_multisquish`, which MEC 2 no longer plays. Its `Noob.wav` is still
 * used and the base map ships it, so that one is not listed here.
 */
const MEC_ONE_LEGACY_IMPORTS = [
    'Units\\AbilityData.slk',
    'Units\\CommandStrings.txt',
    'Units\\CommandFunc.txt',
    'war3mapImported\\triple_kill.wav',
]

const excludedImports = new Set(
    [...(spec.mecOne ? MEC_ONE_LEGACY_IMPORTS : []), ...((spec.excludeImports ?? []) as string[])].map(p =>
        p.toLowerCase()
    )
)

const imports = [...old.keys()].filter(
    n =>
        !KNOWN_MAP_FILES.some(k => k.toLowerCase() === n.toLowerCase()) &&
        !remappedTextures.has(n.toLowerCase()) &&
        !excludedImports.has(n.toLowerCase())
)

const dropped = [...old.keys()].filter(n => excludedImports.has(n.toLowerCase()))
if (dropped.length > 0) log.push(`- imports left out, of no use to MEC 2: ${dropped.join(', ')}`)

if (remappedTextures.size > 0)
    log.push(
        `- the terrain textures of the renamed tiles are not imported, their new ids carry the look: ${[...remappedTextures].join(', ')}`
    )
if (imports.length) {
    const baseImp = base.get('war3map.imp')?.bytes()
    const entries: { flag: number; path: string }[] = []
    if (baseImp) {
        const b = Buffer.from(baseImp)
        let o = 8
        for (let i = 0; i < b.readInt32LE(4); i++) {
            const flag = b[o]
            const end = b.indexOf(0, o + 1)
            entries.push({ flag, path: b.toString('utf8', o + 1, end) })
            o = end + 1
        }
    }
    const listed = (p: string) =>
        entries.some(e => (e.flag === 13 ? e.path : 'war3mapImported\\' + e.path).toLowerCase() === p.toLowerCase())
    const added: string[] = []
    const kept: string[] = []

    // art the old map's models borrowed from the game and that Reforged dropped: without it a model shows nothing
    // at all, only the shadow, and the map looks broken through no fault of its own
    const models = new Map(imports.filter(n => /\.mdx$/i.test(n)).map(n => [n, old.get(n)!]))
    const rescued = rescueModelTextures(models, p => old.has(p), process.env.WAR3_LEGACY_MPQS_LOCATION)

    if (rescued.wanted.length > 0 && !process.env.WAR3_LEGACY_MPQS_LOCATION)
        log.push(
            `- **the imported models draw with ${rescued.wanted.length} texture(s) of the game, and WAR3_LEGACY_MPQS_LOCATION is not set**: a model whose texture the current game dropped will show nothing but its shadow`
        )
    else if (rescued.missing.length > 0)
        log.push(`- **art the models draw with and the legacy game has not either**: ${rescued.missing.join(', ')}`)

    // An MPQ's hash table has a fixed number of slots, and the base map's is full at 64. Every set() past that
    // silently answers false, which is how the first builds lost most of the old map's imports. Room is made
    // first, for everything already there plus everything about to come.
    //
    // Growing it needs every name in the archive to be known, and the base map's `(attributes)` is in no listfile:
    // asking for it by name is what resolves it.
    base.get('(attributes)')
    if (base.countUnresolved() > 0)
        throw new Error(
            `the base map holds ${base.countUnresolved()} file(s) whose name is unknown, so its hashtable cannot be grown`
        )
    // twice what will be in it: an MPQ looks a name up by probing from its hash, so a table filled to the brim
    // has no empty slot to end a failed search on, and every lookup that should miss goes wrong instead
    if (!base.resizeHashtable((base.getFileNames().length + imports.length + rescued.taken.size) * 2))
        throw new Error('the base map’s hashtable could not be grown to hold the old map’s imports')

    for (const name of imports) {
        if (base.get(name) || listed(name)) {
            kept.push(name)
            continue
        }
        if (!base.set(name, old.get(name)!)) throw new Error(`${name} could not be added to the converted map`)
        entries.push({ flag: 13, path: name })
        added.push(name)
    }
    for (const [texture, bytes] of rescued.taken) {
        if (base.get(texture) || listed(texture)) continue
        if (!base.set(texture, bytes)) throw new Error(`${texture} could not be added to the converted map`)
        entries.push({ flag: 13, path: texture })
        added.push(texture)
    }
    if (rescued.taken.size > 0)
        log.push(
            `- ${rescued.taken.size} texture(s) the imported models draw with, taken from the legacy game so they render whatever the current one still ships: ${[...rescued.taken.keys()].join(', ')}`
        )

    const imp = Buffer.concat([
        Buffer.from(Int32Array.of(1, entries.length).buffer),
        ...entries.map(e => Buffer.concat([Buffer.from([e.flag]), Buffer.from(e.path, 'utf8'), Buffer.from([0])])),
    ])
    // what the map really puts over a file of the game: worth a look, since an out of date copy of one puts that old
    // version back over the current one (a MEC 1 map's ability table did)
    const replacingGame = added.filter(isWar3FilePath)
    if (replacingGame.length > 0)
        log.push(
            `- **imports replacing a file of the game**, kept - check they are meant to: ${replacingGame.join(', ')}`
        )

    set(
        'war3map.imp',
        imp,
        `the old map's imports added: ${added.join(', ') || 'none'}${kept.length ? `; kept the base map's own: ${kept.join(', ')}` : ''}`
    )
}

// 8. the map file
// the 512-byte HM3W header before the archive, when the base map has one (maps saved by the current editor
// have none). War3Map.save would read the map info again, which its parser cannot for the base map's format,
// so it is written here from the base map's own header.
const archiveBytes = saveArchiveWhole(base)
const baseHasHeader = fs.readFileSync(baseMapPath).toString('latin1', 0, 4) === 'HM3W'
const header = Buffer.alloc(baseHasHeader ? 512 : 0)
if (baseHasHeader) {
    header.write('HM3W', 0, 'latin1')
    header.writeUInt32LE(map.u1, 4)
    const headerName = Buffer.from(gameName.replace(/\|c[0-9a-fA-F]{8}|\|r/gi, '').trim(), 'utf8').subarray(0, 400)
    headerName.copy(header, 8)
    header.writeUInt32LE(map.flags >>> 0, 8 + headerName.length + 1)
    header.writeUInt32LE(map.maxPlayers, 8 + headerName.length + 5)
}

// the name: no "protected" in it, and the version and date of the MEC core it holds
const coreHeader = (newCore ?? lua.substring(lua.indexOf(CORE_START))).split('\n')[0]
const coreMatch = /v\.?\s*([\w.]+)\s*-\s*(\d{4}-\d{2}-\d{2})/.exec(coreHeader)
if (!coreMatch) throw new Error(`No version and date in the MEC core header: ${coreHeader}`)
const cleanName = withoutProtectedMarks(mapName)
const outputDir = path.join(outputRoot, 'convert-in-progress-maps')
fs.mkdirSync(outputDir, { recursive: true })
const output = path.join(outputDir, `${cleanName}--mec${coreMatch[1]}_${coreMatch[2]}${path.extname(baseMapPath)}`)
// the base map is only read: every change goes to the converted map
if (path.resolve(output) === path.resolve(baseMapPath))
    throw new Error('The converted map cannot be the base map: the base map is only read')
fs.writeFileSync(output, Buffer.concat([header, Buffer.from(archiveBytes)]))
fs.writeFileSync(
    path.join(workDir, 'rebase.json'),
    JSON.stringify({ output, core: coreHeader.replace(CORE_START, '').trim() }, null, 2)
)

fs.writeFileSync(
    path.join(workDir, 'rebase.md'),
    [
        `# ${mapName}: rebase on the MEC base map`,
        '',
        `Base map: \`${baseMapPath}\``,
        `Output: \`${output}\``,
        '',
        ...log,
        '',
        'Not done yet: the game data (the base map’s own still runs), the custom triggers.',
        '',
    ].join('\n')
)

console.info(log.join('\n'))
console.info(`\n${output}`)
