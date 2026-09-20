/**
 * Step 1 of the conversion of an old slide map to MEC (see .claude/skills/convert-slide-map/SKILL.md).
 *
 * yarn convert-slide-map:extract "<path to the old map>" [--force]
 *
 * - copies the map into <MAPS_OUTPUT_DIR_FOR_AI_CONVERSION_TO_MEC>/original-maps/, and reads that copy only,
 * - makes a cheated copy of it, <name>--cheated, in cheated-original-maps/ (-t teleports the hero at the next right-click, -s cancels),
 * - extracts its files into <MAPS_OUTPUT_DIR_FOR_AI_CONVERSION_TO_MEC>/conversion-work/<map>/extracted/,
 * - writes there facts.json (everything a conversion needs, as data) and summary.md (the same, to read).
 *
 * --force replaces a copy in original-maps/ that differs from the given map.
 */
import 'dotenv/config'
import * as fs from 'fs'
import War3MapDoo from 'mdx-m3-viewer-th/dist/cjs/parsers/w3x/doo/file'
import War3MapW3d from 'mdx-m3-viewer-th/dist/cjs/parsers/w3x/w3d/file'
import War3MapW3e from 'mdx-m3-viewer-th/dist/cjs/parsers/w3x/w3e/file'
import War3MapW3u from 'mdx-m3-viewer-th/dist/cjs/parsers/w3x/w3u/file'
import * as path from 'path'
import { makeCheatedMap } from './cheat'
import {
    functionOwners,
    normalizeScript,
    parseFunctions,
    parseGlobals,
    parseOrders,
    parseRects,
    parseScriptItems,
    parseScriptUnits,
    parseTriggers,
    parseVisibility,
} from './jass'
import { KNOWN_MAP_FILES, parseW3iHead, parseWts, readArchive } from './mapFiles'
import { detectMapKind, mecOneInventory } from './mecOne'

const outputRoot = process.env.MAPS_OUTPUT_DIR_FOR_AI_CONVERSION_TO_MEC
const args = process.argv.slice(2)
const force = args.includes('--force')
const source = args.find(a => !a.startsWith('--'))

if (!outputRoot) {
    throw new Error('MAPS_OUTPUT_DIR_FOR_AI_CONVERSION_TO_MEC is not set in .env')
}

if (!source || !fs.existsSync(source)) {
    throw new Error('Usage: yarn convert-slide-map:extract "<path to the old map>" [--force]')
}

const mapFileName = path.basename(source)
const mapName = mapFileName.replace(/\.w3[mx]$/i, '')

// 1. the copy, which is the only file read from now on
const originalsDir = path.join(outputRoot, 'original-maps')
const copy = path.join(originalsDir, mapFileName)
fs.mkdirSync(originalsDir, { recursive: true })
fs.mkdirSync(path.join(outputRoot, 'converted-to-MEC-maps'), { recursive: true })

const sourceBytes = fs.readFileSync(source)
if (path.resolve(source) !== path.resolve(copy)) {
    if (fs.existsSync(copy) && !fs.readFileSync(copy).equals(sourceBytes) && !force) {
        throw new Error(`${copy} already exists and differs from ${source}: pass --force to replace it`)
    }
    fs.writeFileSync(copy, sourceBytes)
}

// 2. the files
const workDir = path.join(outputRoot, 'conversion-work', mapName)
const extractedDir = path.join(workDir, 'extracted')
fs.rmSync(extractedDir, { recursive: true, force: true })
fs.mkdirSync(extractedDir, { recursive: true })

const { files, unreadable, unnamed } = readArchive(fs.readFileSync(copy))
const imports = [...files.keys()].filter(n => !KNOWN_MAP_FILES.some(k => k.toLowerCase() === n.toLowerCase()))
for (const [name, bytes] of files) {
    const target = path.join(extractedDir, ...name.split('\\'))
    fs.mkdirSync(path.dirname(target), { recursive: true })
    fs.writeFileSync(target, bytes)
}

// the cheated copy, to play the old map through while converting it
const cheatedDir = path.join(outputRoot, 'cheated-original-maps')
fs.mkdirSync(cheatedDir, { recursive: true })
const cheated = makeCheatedMap(fs.readFileSync(copy), [...files.keys()])
const cheatedPath = path.join(cheatedDir, `${mapName}--cheated${path.extname(mapFileName)}`)
fs.writeFileSync(cheatedPath, cheated.bytes)

const file = (name: string) => files.get(name)
const text = (name: string) => {
    const bytes = file(name)
    return bytes ? Buffer.from(bytes).toString('utf8') : undefined
}

// 3. the facts
const wts = parseWts(text('war3map.wts') ?? '')
const resolveString = (s: string) => s.replace(/TRIGSTR_\d+/g, key => wts[key] ?? key)

const w3iBytes = file('war3map.w3i')
const info = w3iBytes ? parseW3iHead(w3iBytes) : undefined
if (info) {
    info.name = resolveString(info.name)
    info.author = resolveString(info.author)
    info.description = resolveString(info.description)
    info.recommendedPlayers = resolveString(info.recommendedPlayers)
}

// the game interface strings (war3mapSkin.txt); the upkeep text shows at the top right of the screen
const gameInterface: { [key: string]: string } = {}
for (const line of (text('war3mapSkin.txt') ?? '').split(/\r?\n/)) {
    const m = /^\s*(\w+)\s*=\s*(.*?)\s*$/.exec(line)
    if (m) gameInterface[m[1]] = resolveString(m[2].replace(/^"(.*)"$/, '$1'))
}
const upkeepKeys = Object.keys(gameInterface).filter(k => k.startsWith('UPKEEP_'))
const upkeep = {
    isDefault: upkeepKeys.length === 0,
    strings: Object.fromEntries(upkeepKeys.map(k => [k, gameInterface[k]])),
}

const rawScript = text('scripts\\war3map.j') ?? text('war3map.j')
const luaScript = text('war3map.lua')
const script = rawScript ? normalizeScript(rawScript) : ''
script && fs.writeFileSync(path.join(workDir, 'war3map.j'), script)

// MEC 1 (the vJass MEC of the v1-jass tag) or a map made by hand: what the map holds is read differently
const mapKind = detectMapKind(script)
const mecOne = mapKind === 'mec1' ? mecOneInventory(script) : undefined

const functions = parseFunctions(script)
const triggers = parseTriggers(script, functions)
const owners = functionOwners(triggers)
const rects = parseRects(script)
const units = parseScriptUnits(functions)
const items = parseScriptItems(functions)
const orders = parseOrders(functions).map(o => ({ ...o, triggers: owners[o.fn] ?? [] }))
const visibility = parseVisibility(functions).map(v => ({ ...v, triggers: owners[v.fn] ?? [] }))

// terrain
const w3eBytes = file('war3map.w3e')
const w3e = new War3MapW3e()
w3eBytes && w3e.load(w3eBytes)
const [offsetX, offsetY] = w3eBytes ? w3e.centerOffset : [0, 0]

/** The ground tile of the corner nearest to a point, what GetTerrainType answers there */
const tileAt = (x: number, y: number) => {
    const corner = w3e.corners[Math.round((y - offsetY) / 128)]?.[Math.round((x - offsetX) / 128)]
    return corner ? w3e.groundTilesets[corner.groundTexture] : undefined
}

const tileCounts = (minX: number, minY: number, maxX: number, maxY: number) => {
    const counts: { [tile: string]: number } = {}
    for (let x = Math.ceil((minX - offsetX) / 128) * 128 + offsetX; x <= maxX; x += 128) {
        for (let y = Math.ceil((minY - offsetY) / 128) * 128 + offsetY; y <= maxY; y += 128) {
            const tile = tileAt(x, y)
            if (tile) counts[tile] = (counts[tile] ?? 0) + 1
        }
    }
    return counts
}

const allTiles: { [tile: string]: number } = {}
for (const row of w3eBytes ? w3e.corners : []) {
    for (const corner of row) {
        const tile = w3e.groundTilesets[corner.groundTexture]
        allTiles[tile] = (allTiles[tile] ?? 0) + 1
    }
}

const rectUsage: { [rect: string]: { events: string[]; actions: string[] } } = {}
for (const name of Object.keys(rects)) rectUsage[name] = { events: [], actions: [] }
for (const trigger of triggers) {
    for (const event of trigger.events) {
        for (const arg of event.args) rectUsage[arg]?.events.push(`${trigger.name} (${event.kind})`)
    }
}
for (const fn of functions.values()) {
    for (const line of fn.body) {
        for (const m of line.matchAll(/\b(gg_rct_\w+)\b/g)) {
            const usage = rectUsage[m[1]]
            if (!usage) continue
            for (const t of owners[fn.name] ?? [`(function ${fn.name})`]) {
                !usage.actions.includes(t) && usage.actions.push(t)
            }
        }
    }
}

// doodads and destructables
const dooBytes = file('war3map.doo')
const doodads: any[] = []
if (dooBytes) {
    const doo = new War3MapDoo()
    doo.load(dooBytes, 1)
    for (const d of doo.doodads) {
        const scriptName = `gg_dest_${d.id}_${String(d.editorId).padStart(4, '0')}`
        doodads.push({
            id: d.id,
            editorId: d.editorId,
            scriptName: script.includes(scriptName) ? scriptName : undefined,
            x: Math.round(d.location[0] * 10) / 10,
            y: Math.round(d.location[1] * 10) / 10,
            z: Math.round(d.location[2] * 10) / 10,
            angleDeg: Math.round((d.angle * 180) / Math.PI),
            scale: [...d.scale].map(s => Math.round(s * 1000) / 1000),
            variation: d.variation,
            life: d.life,
        })
    }
}

// object data
const objectData: { [file: string]: any } = {}
for (const [name, Parser] of [
    ['war3map.w3u', War3MapW3u],
    ['war3map.w3t', War3MapW3u],
    ['war3map.w3b', War3MapW3u],
    ['war3map.w3h', War3MapW3u],
    ['war3map.w3a', War3MapW3d],
    ['war3map.w3d', War3MapW3d],
    ['war3map.w3q', War3MapW3d],
] as const) {
    const bytes = file(name)
    if (!bytes) continue

    try {
        const parsed = new Parser()
        parsed.load(bytes)
        const describe = (o: any) => ({
            oldId: o.oldId,
            newId: o.newId || undefined,
            modifications: Object.fromEntries(
                o.modifications.map((m: any) => [m.id + (m.levelOrVariation ? '@' + m.levelOrVariation : ''), m.value])
            ),
        })
        objectData[name] = {
            changedStandard: parsed.originalTable.objects.map(describe),
            custom: parsed.customTable.objects.map(describe),
        }
    } catch (e) {
        objectData[name] = { error: (e as Error).message }
    }
}

const facts = {
    map: { file: mapFileName, copy, workDir },
    archive: { files: [...files.keys()], unreadable },
    info,
    gameInterface,
    upkeep,
    mapKind,
    mecOne: mecOne && {
        counts: mecOne.counts,
        dataTriggers: mecOne.dataTriggers,
        ownTriggers: mecOne.ownTriggers,
        calls: mecOne.calls,
    },
    scriptLanguage: rawScript ? 'jass' : luaScript ? 'lua' : 'none',
    terrain: w3eBytes
        ? {
              tileset: w3e.tileset,
              groundTiles: w3e.groundTilesets,
              cliffTiles: w3e.cliffTilesets,
              corners: [...w3e.mapSize],
              centerOffset: [offsetX, offsetY],
              tileCounts: allTiles,
          }
        : undefined,
    globals: parseGlobals(script),
    rects: Object.fromEntries(
        Object.entries(rects).map(([name, r]) => [
            name,
            { ...r, tiles: tileCounts(r.minX, r.minY, r.maxX, r.maxY), usedBy: rectUsage[name] },
        ])
    ),
    units,
    items,
    doodads,
    objectData,
    triggers: triggers.map(t => ({
        ...t,
        code: t.reachedFunctions.map(f => {
            const fn = functions.get(f)!
            return [`function ${fn.name} takes ${fn.takes} returns ${fn.returns}`, ...fn.body, 'endfunction'].join('\n')
        }),
    })),
    orders,
    visibility,
}

fs.writeFileSync(path.join(workDir, 'facts.json'), JSON.stringify(facts, null, 2))

// the heroes: their type, and what sets their speed (the walk terrains take it)
const heroTypes = [
    ...new Set(units.filter(u => /^[A-Z]/.test(u.typeId) && /^Player\((\d|1[01])\)$/.test(u.owner)).map(u => u.typeId)),
]
const heroLines = heroTypes.map(type => {
    const objects = Object.values(objectData).flatMap((d: any) => [...(d.changedStandard ?? []), ...(d.custom ?? [])])
    const own = objects.find((o: any) => o.newId === type || (!o.newId && o.oldId === type))
    const speed = own?.modifications?.umvs
    const heroVariables = units.filter(u => u.typeId === type && u.variable).map(u => u.variable!)
    const scriptSpeeds = [...script.matchAll(/SetUnitMoveSpeed\((\w+),\s*([-\d.]+)\)/g)]
        .filter(m => heroVariables.includes(m[1]) || /GetTriggerUnit|GetEnumUnit/.test(m[1]))
        .map(m => `${m[1]} ${Number(m[2])}`)
    const looks = own
        ? Object.entries(own.modifications).filter(([id]) =>
              ['umdl', 'usca', 'ussc', 'unam', 'uclr', 'uclg', 'uclb'].includes(id.split('@')[0])
          )
        : []
    return [
        `- ${type}${own?.newId ? ` (custom, based on ${own.oldId})` : ''}: ${units.filter(u => u.typeId === type).length} in the script.`,
        `  - Speed: ${speed !== undefined ? `${speed} (object editor)` : 'its default: look it up in the World Editor (Demon Hunter: 300)'}${scriptSpeeds.length ? `; set by the script: ${scriptSpeeds.join(', ')}` : ''}.`,
        `  - Looks changed: ${looks.map(([id, v]) => `${id}=${v}`).join(', ') || 'none'}.`,
    ].join('\n')
})
cheated.warnings.forEach(w => heroLines.push(`\n(cheated map: ${w})`))

// 4. the summary, to read before the report
const count = <T>(list: T[], key: (t: T) => string) => {
    const counts: { [k: string]: number } = {}
    list.forEach(t => (counts[key(t)] = (counts[key(t)] ?? 0) + 1))
    return Object.entries(counts).sort((a, b) => b[1] - a[1])
}
const table = (rows: string[][]) => {
    const line = (r: string[]) => '| ' + r.map(c => c.replace(/\|/g, '\\|').replace(/\n/g, ' ')).join(' | ') + ' |'
    return [line(rows[0]), line(rows[0].map(() => '---')), ...rows.slice(1).map(line)].join('\n')
}
const tiles = (counts: { [tile: string]: number }) =>
    Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .map(([t, n]) => `${t} ${n}`)
        .join(', ')

const variableOf = (t: { name: string }) => 'gg_trg_' + t.name

const triggerRows = triggers.map(t => {
    const eventTiles: { [tile: string]: number } = {}
    for (const e of t.events) {
        const r = e.args.map(a => rects[a]).find(Boolean)
        if (r)
            for (const [tile, n] of Object.entries(tileCounts(r.minX, r.minY, r.maxX, r.maxY)))
                eventTiles[tile] = (eventTiles[tile] ?? 0) + n
    }
    const kinds = count(t.events, e => e.kind)
        .map(([k, n]) => (n > 1 ? `${k} ×${n}` : k))
        .join(', ')
    return [
        t.name,
        (t.initiallyDisabled ? 'disabled, ' : '') + (kinds || '—'),
        tiles(eventTiles) || '',
        t.referencedBy
            .map(
                r =>
                    `${(owners[r.fn] ?? [r.fn]).join('/')}: ${r.line.replace(/^call\s+/, '').replace(variableOf(t), '')}`
            )
            .join('; '),
    ]
})

// personal data of the author or others (real names, ages, towns, emails, phone numbers) in the old strings: the
// user decides what the MEC map keeps of it (the skill asks)
const PERSONAL_DATA = [
    /[\w.+-]+@[\w-]+\.[\w.]+/,
    /\bmy (real )?name is\b/i,
    /\b\d{1,2} years? old\b/i,
    /\b(I|he|she) (live|lives) in\b/i,
    /\b(phone|msn|icq|aim|skype)\b/i,
    /\+?\d[\d .-]{8,}\d/,
]
const personalData = [
    ...new Set([...script.matchAll(/"((?:[^"\\]|\\.)*)"/g)].map(m => resolveString(m[1])).concat(Object.values(wts))),
].filter(s => PERSONAL_DATA.some(p => p.test(s)))

const summary = [
    `# ${mapName}: extraction summary`,
    '',
    `Generated by \`yarn convert-slide-map:extract\`. The data is in \`facts.json\`, the readable script in \`war3map.j\`.`,
    '',
    '## Map',
    '',
    info
        ? table([
              ['Name', 'Author', 'Players', 'Tileset', 'Playable', 'Map info format'],
              [
                  info.name,
                  info.author,
                  info.recommendedPlayers,
                  info.tileset,
                  `${info.playableWidth}×${info.playableHeight}`,
                  String(info.version),
              ],
          ])
        : 'No war3map.w3i.',
    '',
    'Upkeep text: ' +
        (upkeep.isDefault
            ? `default, so the MEC map shows the author's name (${info?.author || '?'}).`
            : `changed, copied to the MEC map: ${Object.entries(upkeep.strings)
                  .map(([k, v]) => `${k} = "${v}"`)
                  .join(', ')}.`),
    '',
    `Script: ${facts.scriptLanguage}. Files: ${[...files.keys()].join(', ')}.` +
        (unreadable.length ? ` Unreadable: ${unreadable.join(', ')}.` : ''),
    '',
    `Imports (carried over by the rebase): ${imports.join(', ') || 'none'}.` +
        (unnamed
            ? ` **${unnamed} file(s) no path in the map names**: not carried over (nothing uses them, or a path to find).`
            : '') +
        (info?.loadingScreen && (info.loadingScreen.number !== -1 || info.loadingScreen.model)
            ? ` Loading screen: ${info.loadingScreen.model || 'campaign screen ' + info.loadingScreen.number}.`
            : ''),
    '',
    '## Personal data',
    '',
    ...(personalData.length
        ? [
              '**?** These strings look like personal data (names, ages, towns, emails): ask the user what the MEC map keeps of them.',
              '',
              ...personalData.map(s => `- ${s.replace(/\n/g, ' ')}`),
          ]
        : ['None found (emails, "my name is", ages, towns, phone numbers).']),
    '',
    ...(mecOne
        ? [
              '## MEC 1',
              '',
              'This map was made with MEC 1 (the vJass MEC): its data is written in its own calls, which a MEC 2 game data takes over, and the triggers of its own are the features to look at.',
              '',
              `Data triggers: ${mecOne.dataTriggers.join(', ') || 'none'}.`,
              '',
              table([
                  ['MEC 1 call', 'Times'],
                  ...Object.entries(mecOne.counts)
                      .sort((a, b) => b[1] - a[1])
                      .map(([fn, n]) => [fn, String(n)]),
              ]),
              '',
              'Types (as the map writes them):',
              '',
              '```',
              ...mecOne.calls
                  .filter(c =>
                      /^(TerrainTypeArray|MonsterTypeArray|CasterTypeArray|MonsterType|CasterType)\./.test(c.fn)
                  )
                  .map(c => c.line),
              '```',
              '',
              `The map's own triggers (its features, to look at): ${mecOne.ownTriggers.join(', ') || 'none'}.`,
              '',
              `MEC 1 and its template: ${mecOne.coreTriggers.join(', ') || 'none'}.`,
              '',
          ]
        : []),
    '## Terrain',
    '',
    facts.terrain
        ? `Tileset ${facts.terrain.tileset}, ${facts.terrain.corners.join('×')} corners. Tiles: ${tiles(allTiles)}.`
        : 'No war3map.w3e.',
    '',
    '## Heroes',
    '',
    ...heroLines,
    '',
    '## Units created by the script',
    '',
    table([
        ['Type', 'Owner', 'Count'],
        ...count(units, u => u.typeId + '|' + u.owner).map(([k, n]) => [...k.split('|'), String(n)]),
    ]),
    '',
    '## Items',
    '',
    table([['Type', 'Count'], ...count(items, i => i.typeId).map(([k, n]) => [k, String(n)])]),
    '',
    '## Doodads and destructables',
    '',
    table([
        ['Type', 'Count', 'Named in the script'],
        ...count(doodads, d => d.id).map(([k, n]) => [
            k,
            String(n),
            String(doodads.filter(d => d.id === k && d.scriptName).length),
        ]),
    ]),
    '',
    '## Object data',
    '',
    ...Object.entries(objectData).map(([name, data]) =>
        data.error
            ? `- ${name}: could not be read (${data.error})`
            : `- ${name}: standard changed ${data.changedStandard.map((o: any) => o.oldId).join(' ') || '—'}; custom ${data.custom.map((o: any) => `${o.newId}<${o.oldId}`).join(' ') || '—'}`
    ),
    '',
    '## Triggers',
    '',
    'Tiles: the ground tiles under the regions of its events, which is how kill, safe and slide regions show.',
    '',
    table([['Trigger', 'Events', 'Tiles under its event regions', 'Referenced by'], ...triggerRows]),
    '',
    '## Orders',
    '',
    table([['Order', 'Count'], ...count(orders, o => o.order).map(([k, n]) => [k, String(n)])]),
    '',
    '## Visibility',
    '',
    table([['Triggers', 'Call'], ...visibility.map(v => [v.triggers.join(', ') || `(function ${v.fn})`, v.line])]),
    '',
].join('\n')

fs.writeFileSync(path.join(workDir, 'summary.md'), summary)

console.info(`Copy: ${copy}`)
console.info(`Cheated copy (-t, -s): ${cheatedPath}`)
console.info(`Work folder: ${workDir}`)
console.info(
    `${files.size} files, ${triggers.length} triggers, ${Object.keys(rects).length} regions, ${units.length} units, ${doodads.length} doodads`
)
