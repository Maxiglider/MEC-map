import { Constants } from '../../01_libraries/Constants'

export type BrushShape = 'square' | 'circle'

/**
 * Whether a tile of the brush's square is actually painted, which is what tells a circle brush from a square one.
 *
 * Extracted as it stood from MakeTerrainCreateBrush so the visibility brush rounds exactly the same way - a brush
 * that drew a different circle depending on what it paints would be its own little surprise.
 *
 * @param offset half the brush's width, in world units
 */
export const isInBrushShape = (
    shape: BrushShape,
    x: number,
    y: number,
    centerX: number,
    centerY: number,
    offset: number,
    size: number
) => {
    if (shape !== 'circle') {
        return true
    }

    const diffXcenter = RAbsBJ(centerX - x)
    const diffYcenter = RAbsBJ(centerY - y)

    //remove edges except middles
    if (size != 1) {
        if (
            x != centerX &&
            y != centerY &&
            (x == centerX - offset || x == centerX + offset || y == centerY - offset || y == centerY + offset)
        ) {
            return false
        }
    }

    //remove 2nd line interior corners, leaving middle and tiles near
    if (size >= 4) {
        //up or down
        if (y == centerY + offset - Constants.LARGEUR_CASE || y == centerY - offset + Constants.LARGEUR_CASE) {
            if (diffXcenter > Constants.LARGEUR_CASE * 2) {
                return false
            }
        }

        //left or right
        if (x == centerX + offset - Constants.LARGEUR_CASE || x == centerX - offset + Constants.LARGEUR_CASE) {
            if (diffYcenter > Constants.LARGEUR_CASE * 2) {
                return false
            }
        }
    }

    //a little more corner for size 8
    if (size == 8) {
        if (diffXcenter == Constants.LARGEUR_CASE * 5 && diffYcenter == Constants.LARGEUR_CASE * 5) {
            return false
        }
    }

    return true
}
