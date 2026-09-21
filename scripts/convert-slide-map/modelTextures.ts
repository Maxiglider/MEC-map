/**
 * The art an old map's imported models draw with, and that Warcraft III no longer ships.
 *
 * Model authors of the day borrowed textures from wherever the game had them, the campaign glue screens included.
 * Reforged redid those screens and dropped their files, so a model that draws its body with one of them now shows
 * nothing at all - only the shadow, which is a ground decal of the unit, not of the model. Slide Is Magic's
 * footman (`Frost_Fury_v1.1.mdx`, on `UI\Glues\SinglePlayer\HumanCampaign3D\HumanCampaignFootman.blp`) and its
 * crow (`Raven.mdx`) are in that case: they worked for years, then stopped, without the map changing.
 *
 * What the game dropped cannot be known from here, so the rule is on where the art comes from: `UI\` is the glue
 * and campaign art, the part Reforged rebuilt. Those textures are taken from a Warcraft III Legacy install and
 * imported into the converted map at their own paths, where the model looks for them.
 */
import * as fs from 'fs'
import MpqArchive from 'mdx-m3-viewer-th/dist/cjs/parsers/mpq/archive'
import * as path from 'path'

const MdlxModel = require('mdx-m3-viewer-th/dist/cjs/parsers/mdlx/model').default

/** The archives of Warcraft III The Frozen Throne (Legacy), in the order the game reads them */
const MPQS = ['War3.mpq', 'War3x.mpq', 'War3Local.mpq', 'War3xLocal.mpq', 'Deprecated.mpq']

/**
 * Where Reforged rebuilt the art, and so where a texture a model borrowed may be gone. Everything else the game
 * ships is left where it is: carrying it would only make the map heavier.
 */
const AT_RISK = /^UI\\/i

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
            if (AT_RISK.test(texture) && !mapHas(texture)) wanted.add(texture)
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
