import * as fs from 'fs'
import MpqArchive from 'mdx-m3-viewer-th/dist/cjs/parsers/mpq/archive'
import * as path from 'path'

/**
 * Every file path Warcraft III ships with, from the `(listfile)` of its own MPQs
 * (`yarn convert-slide-map:war3-paths`). A map replaces a game asset by importing a file at the game's path for
 * it, and nothing in the map points at that import: the game goes by the path alone. Trying them all is what finds
 * those imports on a protected map, and a hit is proof, an MPQ being keyed by the hash of the path.
 */
const war3FilePaths = (): string[] =>
    fs
        .readFileSync(path.join(__dirname, 'war3FilePaths.txt'), 'latin1')
        .split('\n')
        .filter(line => line !== '')

/** The files a map may hold, for protected maps whose (listfile) is emptied */
export const KNOWN_MAP_FILES = [
    'war3map.j',
    'scripts\\war3map.j',
    'war3map.lua',
    'war3map.w3e',
    'war3map.w3i',
    'war3map.wts',
    'war3map.doo',
    'war3mapUnits.doo',
    'war3map.w3r',
    'war3map.w3c',
    'war3map.w3s',
    'war3map.wtg',
    'war3map.wct',
    'war3map.w3u',
    'war3map.w3t',
    'war3map.w3a',
    'war3map.w3b',
    'war3map.w3d',
    'war3map.w3h',
    'war3map.w3q',
    'war3mapSkin.w3u',
    'war3mapSkin.w3t',
    'war3mapSkin.w3a',
    'war3mapSkin.w3b',
    'war3mapSkin.w3d',
    'war3mapSkin.w3h',
    'war3mapSkin.w3q',
    'war3map.shd',
    'war3map.wpm',
    'war3map.mmp',
    'war3map.imp',
    'war3mapMap.blp',
    'war3mapMap.b00',
    'war3mapMap.tga',
    'war3mapPreview.tga',
    'war3mapPath.tga',
    'war3mapMisc.txt',
    'war3mapSkin.txt',
    'war3mapExtra.txt',
    '(listfile)',
    '(attributes)',
]

export const readArchive = (buffer: Buffer) => {
    const archive = new MpqArchive()
    archive.load(new Uint8Array(buffer), true)

    const names = new Set<string>(KNOWN_MAP_FILES)

    // the game's own paths, which the walk below cannot reach: what the map replaces of the game is found by
    // trying them, not by following anything the map writes down
    war3FilePaths().forEach(p => names.add(p))
    const listfile = archive.get('(listfile)')?.text()
    listfile?.split(/\r?\n/).forEach(n => n.trim() !== '' && names.add(n.trim()))

    // the imports file names what a protector left out of the listfile
    const imp = archive.get('war3map.imp')?.bytes()
    if (imp) {
        for (const m of Buffer.from(imp)
            .toString('latin1')
            .matchAll(/[\x20-\x7e]{4,}/g)) {
            names.add(m[0])
            names.add('war3mapImported\\' + m[0])
        }
    }

    const files = new Map<string, Uint8Array>()
    const unreadable: string[] = []
    const tried = new Set<string>()

    const tryNames = () => {
        let found = 0
        for (const name of names) {
            if (tried.has(name.toLowerCase())) continue
            tried.add(name.toLowerCase())
            const file = archive.get(name)
            if (!file) continue

            try {
                const bytes = file.bytes()
                if (bytes) {
                    files.set(name, bytes)
                    found++
                } else unreadable.push(name)
            } catch {
                unreadable.push(name)
            }
        }
        return found
    }

    // A map without a listfile (Sliding Bunnys) names its imports nowhere: they are found by the paths that use
    // them, in the map info (the loading screen model), the scripts, the object data, the text files and the
    // imported models (their textures), until no new file turns up
    for (let round = 0; round < 10 && tryNames() > 0; round++) {
        for (const [name, bytes] of files) {
            if (!/\.(w3i|j|lua|w3u|w3t|w3a|w3b|w3d|w3h|w3q|txt|slk|mdx|mdl|fdf|toc|imp)$/i.test(name)) continue
            if (name === 'war3map.w3i') {
                const model = parseW3iHead(bytes).loadingScreen.model
                model && pathCandidates(model).forEach(c => names.add(c))
            }
            for (const m of Buffer.from(bytes)
                .toString('latin1')
                .matchAll(/[\x21-\x7e][\x20-\x7e]{2,259}/g)) {
                const text = m[0].replace(/\\\\/g, '\\').replace(/\//g, '\\')
                for (const part of text.split(/["|,;]/)) {
                    const p = part.trim()
                    if (/\\|\.(mdx|mdl|blp|tga|dds|wav|mp3|flac|txt|slk|fdf|toc)$/i.test(p))
                        pathCandidates(p).forEach(c => names.add(c))
                }
            }
        }
    }

    return { files, unreadable, unnamed: Math.max(0, archive.files.length - files.size - unreadable.length) }
}

/** The names a path can stand for in an archive: as written, a .mdl as the .mdx the game loads, and with an extension */
const pathCandidates = (path: string) => {
    const p = path.replace(/\//g, '\\')
    const out = [p]
    if (/\.mdl$/i.test(p)) out.push(p.replace(/\.mdl$/i, '.mdx'))
    if (!/\.[a-z0-9]{2,4}$/i.test(p)) out.push(p + '.mdx', p + '.mdl', p + '.blp', p + '_portrait.mdx')
    return out
}

/** TRIGSTR_n → its text */
export const parseWts = (text: string) => {
    const strings: { [key: string]: string } = {}

    for (const m of text
        .replace(/\r\n?/g, '\n')
        .matchAll(/STRING\s+(\d+)[^\n]*\n(?:\/\/[^\n]*\n)?\{\n([\s\S]*?)\n\}/g)) {
        strings['TRIGSTR_' + m[1].padStart(3, '0')] = m[2]
        strings['TRIGSTR_' + m[1]] = m[2]
    }

    return strings
}

/**
 * The start of war3map.w3i, which every version shares from Reign of Chaos (18) on: enough to rebuild the
 * map info of the MEC map. The library parser stops on the Reign of Chaos format.
 */
export const parseW3iHead = (bytes: Uint8Array) => {
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
    let offset = 0
    const int = () => {
        const v = view.getInt32(offset, true)
        offset += 4
        return v
    }
    const float = () => {
        const v = view.getFloat32(offset, true)
        offset += 4
        return v
    }
    const string = () => {
        const end = bytes.indexOf(0, offset)
        const s = Buffer.from(bytes.subarray(offset, end)).toString('utf8')
        offset = end + 1
        return s
    }

    const version = int()
    const saves = int()
    const editorVersion = int()
    if (version >= 28) offset += 16 // game version major, minor, patch, build
    const name = string()
    const author = string()
    const description = string()
    const recommendedPlayers = string()
    const cameraBounds = Array.from({ length: 8 }, float)
    const cameraBoundsComplements = Array.from({ length: 4 }, int)
    const playableWidth = int()
    const playableHeight = int()
    const flags = int()
    const tileset = String.fromCharCode(bytes[offset])
    offset += 1

    // the loading screen: its number (-1 none, else a campaign screen or the imported model), then its model (from
    // format 25 on), text, title and subtitle. Format 39 (the current editor's) has an int of its own between the
    // number and the strings (0x80 in MEC's base map, 0x40 in another), found in the bytes, not documented.
    const loadingScreenNumberAt = offset
    const loadingScreenNumber = int()
    if (version >= 39) offset += 4
    const loadingScreenStringsAt = offset
    const loadingScreenModel = version >= 25 ? string() : ''
    const loadingScreenText = string()
    const loadingScreenTitle = string()
    const loadingScreenSubtitle = string()
    const loadingScreenStringsEnd = offset

    return {
        version,
        saves,
        editorVersion,
        name,
        author,
        description,
        recommendedPlayers,
        cameraBounds,
        cameraBoundsComplements,
        playableWidth,
        playableHeight,
        flags: '0x' + (flags >>> 0).toString(16),
        tileset,
        loadingScreen: {
            number: loadingScreenNumber,
            model: loadingScreenModel,
            text: loadingScreenText,
            title: loadingScreenTitle,
            subtitle: loadingScreenSubtitle,
            numberAt: loadingScreenNumberAt,
            stringsAt: loadingScreenStringsAt,
            stringsEnd: loadingScreenStringsEnd,
        },
    }
}

/**
 * The longest map name Warcraft III takes, as stored (color codes included): the longest among 51 old maps the
 * World Editor saved is 36, and the editor is said to stop at about 35.
 */
export const MAP_NAME_MAX_LENGTH = 36

/** A name without its "protected" marks ("-Protected-", "(Prot)", "[P]"…) and what they leave behind */
export const withoutProtectedMarks = (name: string) =>
    name
        .replace(/\[p\]|protected|\bprot\b/gi, '')
        .replace(/[\s-]+([\])])/g, '$1')
        .replace(/\[\s*\]|\(\s*\)/g, '')
        .replace(/(^|\s)-+(?=\s|$)/g, ' ')
        .replace(/[\s-]+$|^[\s-]+/g, '')
        .replace(/\s+/g, ' ')
        .trim()

const COLOR = /\|c[0-9a-fA-F]{8}|\|r/gi

/**
 * The name of the converted map in the game: the old one without its "protected" marks, its version replaced by
 * [M2] (or M2), or [M2] added when it has none, within MAP_NAME_MAX_LENGTH. When it doesn't fit, the color codes
 * after the first go first, then the visible text before the tag is shortened, color codes kept whole.
 */
export const mecMapName = (oldName: string, maxLength = MAP_NAME_MAX_LENGTH) => {
    const fits = (s: string) => s.length <= maxLength
    // trailing spaces, also before a final |r
    const trimEnd = (s: string) => s.replace(/\s+(\|r)?$/i, '$1').replace(/\s+$/, '')
    // protection marks go with their color codes' content only: the codes themselves stay
    const name = oldName
        .replace(/[^|]+/g, part => (/\bprot|protected|\[p\]/i.test(part) ? ` ${withoutProtectedMarks(part)} ` : part))
        .replace(/ {2,}/g, ' ')
        .trim()

    const bracketed = /\[[^\]]*\d[^\]]*\]/
    const prefixed = /\b[vV]\s?\d+(\.\d+)+[a-z]?\b/
    const bare = /\b\d+\.\d+[a-z]?\b/
    const versioned = [bracketed, prefixed, bare].find(pattern => pattern.test(name))
    const withTag = (tag: string) => trimEnd(versioned ? name.replace(versioned, tag) : `${trimEnd(name)} ${tag}`)

    for (const tag of ['[M2]', 'M2']) {
        const s = withTag(tag)
        if (fits(s)) return s
        if (fits(s.replace(/ {2,}/g, ' '))) return s.replace(/ {2,}/g, ' ')
    }

    // the color codes after the first one, from the last
    let s = withTag('M2').replace(/ {2,}/g, ' ')
    const codes = [...s.matchAll(COLOR)]
    for (let k = codes.length - 1; k >= 1 && !fits(s); k--) {
        const code = codes[k]
        s = s.substring(0, code.index!) + s.substring(code.index! + code[0].length)
        codes.splice(k, 1)
    }
    if (fits(s)) return s.replace(/ {2,}/g, ' ')

    // then the visible text before the tag, from its end, leaving color codes whole
    const tag = s.lastIndexOf('M2')
    let before = s.substring(0, tag).replace(/\s+$/, '')
    const after = s.substring(tag + 2)
    while (before.length > 0 && !fits(`${before} M2${after}`)) {
        before = /(\|c[0-9a-fA-F]{8}|\|r)$/i.test(before)
            ? before.replace(/(\|c[0-9a-fA-F]{8}|\|r)$/i, '')
            : before.slice(0, -1)
        before = before.replace(/\s+$/, '')
    }
    return `${before} M2${after}`
}
