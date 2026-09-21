/**
 * The art an old map's imported models draw with, and that Warcraft III no longer ships.
 *
 * Model authors of the day borrowed textures from wherever the game had them, the campaign glue screens included.
 * Reforged redid those screens and dropped their files, so a model that draws its body with one of them now shows
 * nothing at all - only the shadow, which is a ground decal of the unit, not of the model. Slide Is Magic's
 * footman (`Frost_Fury_v1.1.mdx`, on `UI\Glues\SinglePlayer\HumanCampaign3D\HumanCampaignFootman.blp`) and its
 * crow (`Raven.mdx`) are in that case: they worked for years, then stopped, without the map changing.
 *
 * What the game still ships cannot be known from here - its files are in CASC, not in an MPQ we can read - and
 * guessing at which folders Reforged rebuilt only fixed some of them: the footman also draws with
 * `Textures\Ice3b.blp`, at the root of the old generic art, and stayed invisible. So every texture a model draws
 * with and the map does not hold is taken from a Warcraft III Legacy install and imported at its own path.
 *
 * It costs about 2 MB on Slide Is Magic, and it pins those textures to their classic version. For a map converted
 * as SD only, which is what a map made before Reforged gets, that is what it would be served anyway.
 */
import * as fs from 'fs'
import MpqArchive from 'mdx-m3-viewer-th/dist/cjs/parsers/mpq/archive'
import * as path from 'path'

const MdlxModel = require('mdx-m3-viewer-th/dist/cjs/parsers/mdlx/model').default

/** The archives of Warcraft III The Frozen Throne (Legacy), in the order the game reads them */
const MPQS = ['War3.mpq', 'War3x.mpq', 'War3Local.mpq', 'War3xLocal.mpq', 'Deprecated.mpq']

/** The textures a model really draws with: the ones its materials name, not the ones merely listed in the file */
export const texturesDrawnBy = (modelBytes: Uint8Array): string[] => {
    const model = new MdlxModel()
    model.load(modelBytes)

    const drawn = new Set<number>()
    for (const material of model.materials) {
        for (const layer of material.layers) drawn.add(layer.textureId)
    }

    const paths: string[] = []
    for (const id of drawn) {
        const texture = model.textures[id]
        // an empty path is a replaceable texture: team colour, team glow, the game's own
        if (texture && texture.path !== '') paths.push(texture.path)
    }

    return paths
}

export type RescuedTextures = { taken: Map<string, Uint8Array>; wanted: string[]; missing: string[] }

/**
 * The textures the old map's models draw with, that the map does not hold and that Reforged may have dropped.
 *
 * @param models the imported model files of the old map, by path
 * @param mapHas whether the old map itself holds a path
 * @param legacyLocation a Warcraft III Legacy install, or undefined to only report what is wanted
 */
export const rescueModelTextures = (
    models: Map<string, Uint8Array>,
    mapHas: (path: string) => boolean,
    legacyLocation: string | undefined
): RescuedTextures => {
    const wanted = new Set<string>()

    for (const [name, bytes] of models) {
        if (!/\.mdx$/i.test(name)) continue

        let drawn: string[]
        try {
            drawn = texturesDrawnBy(bytes)
        } catch {
            // a model this parser cannot read is left alone: it is no worse off than before
            continue
        }

        for (const texture of drawn) {
            if (!mapHas(texture)) wanted.add(texture)
        }
    }

    const taken = new Map<string, Uint8Array>()
    if (wanted.size === 0 || !legacyLocation) {
        return { taken, wanted: [...wanted], missing: legacyLocation ? [] : [...wanted] }
    }

    // one archive at a time, and only until everything is found: these files are hundreds of megabytes each
    for (const mpq of MPQS) {
        if (taken.size === wanted.size) break

        const file = path.join(legacyLocation, mpq)
        if (!fs.existsSync(file)) continue

        const archive = new MpqArchive()
        archive.load(new Uint8Array(fs.readFileSync(file)), true)

        for (const texture of wanted) {
            if (taken.has(texture)) continue
            const found = archive.get(texture)
            const bytes = found?.bytes()
            bytes && taken.set(texture, bytes)
        }
    }

    return { taken, wanted: [...wanted], missing: [...wanted].filter(w => !taken.has(w)) }
}

/**
 * A model whose animation tracks list their keys out of order, put back in order.
 *
 * Old editors wrote a track's keys in the order they were made, not by frame, and the old engine read them anyway.
 * Slide Is Magic's footman (`Frost_Fury_v1.1.mdx`) has 27 tracks of 94 so, among them the visibility of every one
 * of its 15 geosets - `1000, 2500, 5800, 7650, 8000, 0, 8251…` - and it shows nothing in game but its shadow,
 * with every texture it draws present and opaque. A key lookup that searches the frames as sorted, which is what
 * a current engine can be expected to do, reads such a track wrong.
 *
 * Sorting changes nothing to what a well-made track says, keys at the same frame keep their order, and a model
 * with no such track is given back as undefined so that its file stays byte for byte the same. Parsing then saving
 * drops nothing but empty chunks (checked on that footman: identical once its empty `PREM` is left out).
 */
export const sortModelTracks = (modelBytes: Uint8Array): { bytes: Uint8Array; sorted: number } | undefined => {
    const model = new MdlxModel()
    model.load(modelBytes)

    let sorted = 0
    const seen = new Set<object>()

    const walk = (node: any) => {
        if (!node || typeof node !== 'object' || seen.has(node)) return
        seen.add(node)

        // a track: its keys' frames, their values, and the tangents of a curved one
        if (node.frames && node.values && typeof node.name === 'string') {
            const frames: number[] = Array.from(node.frames as ArrayLike<number>)
            if (frames.every((frame, i) => i === 0 || frame >= frames[i - 1])) return

            const order = frames.map((_, i) => i).sort((a, b) => frames[a] - frames[b] || a - b)
            node.frames = new Uint32Array(order.map(i => frames[i]))
            node.values = order.map(i => node.values[i])
            if (node.inTans?.length) node.inTans = order.map(i => node.inTans[i])
            if (node.outTans?.length) node.outTans = order.map(i => node.outTans[i])
            sorted++
            return
        }

        for (const key of Object.keys(node)) walk(node[key])
    }

    walk(model)

    return sorted > 0 ? { bytes: model.saveMdx(), sorted } : undefined
}
