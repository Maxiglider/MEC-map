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

/** The nodes of a model, every list whose members carry an objectId, a parentId and a pivot of that index */
const NODE_LISTS = [
    'bones',
    'lights',
    'helpers',
    'attachments',
    'particleEmitters',
    'particleEmitters2',
    'ribbonEmitters',
    'eventObjects',
    'collisionShapes',
    'cameras',
    'faceEffects',
] as const

/**
 * Puts a model's animation tracks back in key order: old editors wrote a track's keys in the order they were made,
 * not by frame, and the old engine read them anyway. Slide Is Magic's footman has 27 of its 94 so. Keys at the same
 * frame keep their order, so a well-made track says the same.
 */
const sortTracks = (model: any) => {
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
    return sorted
}

/**
 * Takes out the lights that cannot light anything: no intensity and no track to give them one, or an attenuation
 * that ends where it starts.
 *
 * Slide Is Magic's footman (`Frost_Fury_v1.1.mdx`) carries one such light - omni, attenuation 0 to 0, intensity 0 -
 * and shows nothing in game but its shadow, every texture it draws present and opaque, every track sorted. It is the
 * only one of the map's 23 imported models with a light, and the only one that is invisible. An attenuation of 0 to
 * 0 divides by zero in a lighting shader, which the old fixed pipeline never ran. What such a light gave the old
 * game is nothing, so nothing is lost.
 *
 * A node's id is its index among all the model's nodes, and it names its pivot, its children's parent and the bones
 * a geoset is skinned to: every one of those is moved down past each node taken out.
 */
const removeDeadLights = (model: any) => {
    const dead = (model.lights as any[]).filter(light => {
        const animated = (light.animations as any[]).some(t => ['KLAI', 'KLBI', 'KLAE', 'KLAS'].includes(t.name))
        if (animated) return false
        const [start, end] = Array.from(light.attenuation as ArrayLike<number>)
        return (light.intensity <= 0 && light.ambientIntensity <= 0) || end <= start
    })
    if (dead.length === 0) return 0

    const removed = dead.map(light => light.objectId as number).sort((a, b) => a - b)
    if (removed.some(id => id < 0)) throw new Error('a light without an object id')
    const shift = (id: number) => (id < 0 ? id : id - removed.filter(r => r < id).length)

    for (const id of removed) {
        for (const list of NODE_LISTS) {
            for (const node of model[list] ?? []) if (node.parentId === id) throw new Error(`light ${id} has children`)
        }
    }

    model.lights = (model.lights as any[]).filter(light => !dead.includes(light))
    model.pivotPoints = (model.pivotPoints as any[]).filter((_, i) => !removed.includes(i))

    for (const list of NODE_LISTS) {
        for (const node of model[list] ?? []) {
            node.objectId = shift(node.objectId)
            node.parentId = shift(node.parentId)
        }
    }
    for (const geoset of model.geosets) {
        const indices = Array.from(geoset.matrixIndices as ArrayLike<number>)
        if (indices.some(id => removed.includes(id))) throw new Error('a geoset skinned to a light')
        geoset.matrixIndices = new Uint32Array(indices.map(shift))
    }

    return dead.length
}

/**
 * An imported model repaired of what the current game reads wrong (`sortTracks`, `removeDeadLights`), or undefined
 * when it has none of it, so that its file stays byte for byte the same. Parsing then saving drops nothing but empty
 * chunks (checked on Slide Is Magic's footman: identical once its empty `PREM` is left out).
 */
export const repairModel = (modelBytes: Uint8Array): { bytes: Uint8Array; repairs: string[] } | undefined => {
    const model = new MdlxModel()
    model.load(modelBytes)

    const repairs: string[] = []
    const sorted = sortTracks(model)
    if (sorted > 0) repairs.push(`${sorted} tracks put back in key order`)
    const lights = removeDeadLights(model)
    if (lights > 0) repairs.push(`${lights} light(s) that light nothing taken out`)

    return repairs.length > 0 ? { bytes: model.saveMdx(), repairs } : undefined
}
