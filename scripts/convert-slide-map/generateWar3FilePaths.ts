/**
 * Writes the list of every file path Warcraft III ships with, from the `(listfile)` each of its MPQs carries.
 *
 * yarn convert-slide-map:war3-paths
 *
 * A map replaces a game asset - a terrain texture, a model, an icon, a sound, a data table - by importing a file at
 * the game's own path for it. Nothing in the map points at that import: the game finds it by the path alone. So on
 * a protected map, whose `war3map.imp` is gone and whose `(listfile)` is emptied, the extraction has nothing to
 * follow. Trying every path the game has is what finds them, and a hit is proof: an MPQ is keyed by the hash of the
 * path, so there are no false positives.
 *
 * The result is written into the repo rather than read from a Warcraft III install, so a conversion needs no game
 * installed. Rerun this only if the game's files ever change (WAR3_LEGACY_MPQS_LOCATION in .env).
 */
import 'dotenv/config'
import * as fs from 'fs'
import MpqArchive from 'mdx-m3-viewer-th/dist/cjs/parsers/mpq/archive'
import * as path from 'path'

const location = process.env.WAR3_LEGACY_MPQS_LOCATION
if (!location) throw new Error('WAR3_LEGACY_MPQS_LOCATION is not set in .env')

/** The archives of Warcraft III The Frozen Throne (Legacy), in the order the game reads them */
const MPQS = ['War3.mpq', 'War3x.mpq', 'War3Local.mpq', 'War3xLocal.mpq', 'Deprecated.mpq']

const paths = new Set<string>()
const counts: string[] = []

for (const mpq of MPQS) {
    const file = path.join(location, mpq)
    if (!fs.existsSync(file)) throw new Error(`${file} does not exist`)

    const archive = new MpqArchive()
    archive.load(new Uint8Array(fs.readFileSync(file)), true)

    const listfile = archive.get('(listfile)')
    if (!listfile) throw new Error(`${mpq} has no (listfile)`)

    let added = 0
    for (const line of Buffer.from(listfile.bytes()!).toString('latin1').split(/\r?\n/)) {
        const name = line.trim()
        // the archive's own bookkeeping is not a file a map can replace
        if (name === '' || name.startsWith('(')) continue
        if (!paths.has(name)) added++
        paths.add(name)
    }
    counts.push(`${mpq}: ${added} new`)
}

const sorted = [...paths].sort((a, b) => (a.toLowerCase() < b.toLowerCase() ? -1 : 1))
const output = path.join(__dirname, 'war3FilePaths.txt')
fs.writeFileSync(output, sorted.join('\n') + '\n')

console.log(`${sorted.length} paths (${counts.join(', ')})`)
console.log(`written ${output} (${Math.round(fs.statSync(output).size / 1024)} KB)`)
