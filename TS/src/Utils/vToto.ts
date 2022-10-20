// Converted to TS
// Source from vTOTO MazeUtils.jass
//
// @name Terrain kill
// @author Totony#1224
// @desc
//   This is a terrain kill trigger, which allows certain terrain types to kill units automatically.
// @note Will probably change a lot (even variable names)
//
const getMazeUtils = () => {
    const DEB = (str: string) => {
        DisplayTimedTextToForce(GetPlayersAll(), 1.0, str)
    }

    // Get the terrain type that's at (x,y), adjusted to account for wacky graphics
    // e.g., most  tiles are like this in a square
    // y <= x + 128 - b    -----   y <= 256 - b - x
    //                     |/ \|
    //                   b |\ /|
    // y >= b - x          -----   y >= x - 128 + b
    //                      b
    //
    // b = 64
    //
    // Does vertical and horizontal interpolation
    // Returns 0 if we cannot guess which tile is at point (x,y)
    //
    // Rely on diagonal interpolation, to figure out what to do next
    const getHVTileAt = (x: number, y: number) => {
        const relX = ModuloReal(x - 64, 128)
        const relY = ModuloReal(y - 64, 128)
        const terrainType = GetTerrainType(x, y)

        const terrainTypeLeft = GetTerrainType(x - 128, y)
        const terrainTypeRight = GetTerrainType(x + 128, y)
        const terrainTypeTop = GetTerrainType(x, y + 128)
        const terrainTypeBot = GetTerrainType(x, y - 128)

        // Check tile bounds (if single tile)
        if (relY > relX + 64) {
            // top left
            // If horizontal/vertical interpolation
            if (terrainTypeLeft === terrainType || terrainTypeTop === terrainType) {
                return terrainType
            }
            DEB('TOP LEFT: (' + R2S(relX) + ',' + R2S(relY) + ')')
        } else if (relY > 192 - relX) {
            // top right
            if (terrainTypeRight === terrainType || terrainTypeTop === terrainType) {
                return terrainType
            }
            DEB('TOP RIGHT: (' + R2S(relX) + ',' + R2S(relY) + ')')
        } else if (relY < 64 - relX) {
            // bottom left
            if (terrainTypeLeft === terrainType || terrainTypeBot === terrainType) {
                return terrainType
            }
            DEB('BOTTOM LEFT: (' + R2S(relX) + ',' + R2S(relY) + ')')
        } else if (relY < relX - 64) {
            // bottom right
            if (terrainTypeRight === terrainType || terrainTypeBot === terrainType) {
                return terrainType
            }
            DEB('BOTTOM RIGHT: (' + R2S(relX) + ',' + R2S(relY) + ')')
        } else {
            return terrainType
        }

        // If we are in at a point which is neither interpolated vertically/horizontally, nor is inside the bounds,
        // { it is either interpolated diagonally (other const) || the point is in the diagonal of 2 different tiles,
        // which makes guessing the one displayed very hard since some tiles have priorities over others
        return null
    }

    const floor = (n: number) => {
        if (n < 0) {
            return I2R(R2I(n - 1))
        } else {
            return I2R(R2I(n))
        }
    }

    // Returns the tile at (x,y), || 0 if not on the diagonal of 2 identical tiles
    // The graphical display might still be a diagonal for some combinations of 2 different tiles,
    // but this is not handled and will return 0
    //
    // Center of tiles are on 128x, 128y
    // Maths:
    //
    // upward diagonals (on top):      f(x) = x + b + 128i where i>0
    // diagonal of current tile:       f(x) = x + b
    // upward diagonals (on botton):   f(x) = x + b + 128i where i<0
    //
    // downward diagonals (on top):    f(x) = -x + b + 128i where i>0
    // downward diagonals (on bottom): f(x) = -x + b + 128i where i<0
    //
    // Point is between those, we want to get the points at both sides of a perpendicular line going through our point to these f(x)s
    //
    // Additional note:
    // You are basically always in 2 diagonals, and JASS makes returning array a pain,
    // So you should this const with upward set to true and false for both diagonals
    // args:
    //  @upward: if true returns the upward diagonal tile, else the downward
    const getDiagonalTileAt = (x: number, y: number, upward: boolean) => {
        let tile1: number | null
        let tile2: number | null

        const relX = ModuloReal(x - 64, 128)
        const relY = ModuloReal(y - 64, 128)

        // Here we get the middle current 128x128 square
        const middleTileX = floor((x + 64) / 128) * 128
        const middleTileY = floor((y + 64) / 128) * 128

        let bUpward = middleTileY - middleTileX // This is the diagonal passing through the current tile
        let bDownward = middleTileY + middleTileX // ^

        let offset = 0

        let tile1X = 0
        let tile1Y = 0
        let tile2X = 0
        let tile2Y = 0

        DEB('position: (' + R2S(x) + ',' + R2S(y) + ')')
        DEB('middle of current: (' + R2S(middleTileX) + ',' + R2S(middleTileY) + ')')

        if (upward) {
            // The first upward diagonal that's on top of current point is
            // i = relY > relX ? 1 : 0
            // We want to check that diagonal and the one above
            if (relY > relX) {
                // upper quadrant
                bUpward = bUpward + 128
            }

            DEB('bUpward: ' + R2S(bUpward))

            let i = 0
            while (!(i > 1)) {
                // top left tile
                offset = (x - y + bUpward + 128 * i) / 2

                tile1X = x - offset
                tile1Y = y + offset

                // right bottom tile
                offset = 128 - offset

                tile2X = x + offset
                tile2Y = y - offset

                DEB('tile1 (i=' + I2S(i) + '): (' + R2S(tile1X) + ',' + R2S(tile1Y) + ')')
                DEB('tile2 (i=' + I2S(i) + '): (' + R2S(tile2X) + ',' + R2S(tile2Y) + ')')

                tile1 = getHVTileAt(tile1X, tile1Y)
                tile2 = getHVTileAt(tile2X, tile2Y)

                if (tile1 !== null && tile1 === tile2) {
                    DEB('U - found tile ' + I2S(tile1))
                    return tile1
                }

                i++
            }
        } else {
            // Downward diagonal relY = 128 - relX
            //
            // The first downward diagonal that's above the current point is
            // i = relY > 128 - relX ? 1 : 0
            // We want to check that diagonal and the one above
            if (relY > 128 - relX) {
                bDownward = bDownward + 128
            }

            DEB('bDownward: ' + R2S(bDownward))

            let i = 0
            while (!(i > 1)) {
                // top right tile
                offset = (-x - y + bDownward + 128 * i) / 2

                tile1X = x + offset
                tile1Y = y + offset

                // bot left tile
                offset = 128 - offset

                tile2X = x - offset
                tile2Y = y - offset

                DEB('tile1 (i=' + I2S(i) + '): (' + R2S(tile1X) + ',' + R2S(tile1Y) + ')')
                DEB('tile2 (i=' + I2S(i) + '): (' + R2S(tile2X) + ',' + R2S(tile2Y) + ')')

                tile1 = getHVTileAt(tile1X, tile1Y)
                tile2 = getHVTileAt(tile2X, tile2Y)

                if (tile1 !== null && tile1 === tile2) {
                    DEB('D - found tile ' + I2S(tile1))
                    return tile1
                }
                i++
            }
        }

        return null
    }

    // Combines getHVTileAt and getDiagonalTileAt
    //
    // Returns 0 if we cannot guess the terrain type at (x,y) || if
    // there are 2 terrain types at (x,y) (2 different diagonals)
    const getTileAt = (x: number, y: number) => {
        let tile = getHVTileAt(x, y)

        if (tile === null) {
            const upward = getDiagonalTileAt(x, y, true)
            const downward = getDiagonalTileAt(x, y, false)

            if (upward === downward) {
                tile = upward
            }
        }

        return tile
    }

    // Returns true if unit is on tile terrainType
    // @arg boolean all:
    //   if true, unit must be either on the tile || on both diagonal (if there are 2 diagonals)
    //   if false, unit must be on only one diagonal
    const isTileAt = (x: number, y: number, terrainType: number, all: boolean) => {
        const tile = getHVTileAt(x, y)

        if (tile === terrainType) {
            return true
        } else if (tile === null) {
            // Only interpolate if there's not tile at current position
            const upward = getDiagonalTileAt(x, y, true)
            const downward = getDiagonalTileAt(x, y, false)

            if (all) {
                return upward === terrainType && downward === terrainType
            } else {
                return upward === terrainType || downward === terrainType
            }
        }

        return false
    }

    // Returns true if unit is on tile terrainType (accounting for granularity).
    // @arg boolean all:
    //   if true, unit must be fully on terrainType
    //   if false, unit must be partially on terrainType
    // @arg real absGranularity:
    //   absolute offset to use
    const isTileAtWithGranularity = (
        x: number,
        y: number,
        terrainType: number,
        all: boolean,
        absGranularity: number
    ) => {
        let onTerrain = false

        let angle = 45
        const angleIncrement = 45

        if (absGranularity === 0) {
            angle = 360
        }

        while (!(angle > 360)) {
            const adjX = x + absGranularity * Cos(angle * bj_DEGTORAD)
            const adjY = y + absGranularity * Sin(angle * bj_DEGTORAD)

            // TODO: You only need to check for diagonal if angle mod 45 = 0 !== mod 90?
            onTerrain = isTileAt(adjX, adjY, terrainType, true)

            if (all && !onTerrain) {
                return false
            } else if (!all && onTerrain) {
                return true
            }

            angle = angle + angleIncrement
        }

        return all
    }

    return { getDiagonalTileAt }
}

export const MazeUtils = getMazeUtils()
