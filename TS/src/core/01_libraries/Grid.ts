import { globals } from '../../../globals'
import { DrawLineByLightningCode } from './Draw_lines'
import { arrayPush } from './Basic_functions'

const gridLines: lightning[] = []

export const ClearGrid = () => {
    for (const line of gridLines) {
        DestroyLightning(line)
    }
    gridLines.length = 0
}

const LINE_LENGTH_PRECISION_IN_SLK = 8192 / 2

const grid32size = 32
const grid128size = 128
const grid512size = 512

export type gridOpacity = 5 | 10 | 15 | 25 | 50 | 75 | 100
export type gridType = 32 | 128 | 512

let currentGridType: 0 | gridType;
const currentGridOpacity: {
    'grid512': gridOpacity,
    'grid128': gridOpacity,
    'grid32': gridOpacity
} = {
    'grid512': 50,
    'grid128': 50,
    'grid32': 25
};

export const DrawGrid = (type?: 0 | gridType) => {
    ClearGrid()

    if (type === undefined) {
        if (currentGridType === undefined || currentGridType === 0) {
            currentGridType = 512
        } else if (currentGridType === 512) {
            currentGridType = 128
        } else if (currentGridType === 128) {
            currentGridType = 32
        } else if (currentGridType === 32) {
            currentGridType = 0
        }
    } else {
        currentGridType = type
    }

    if (currentGridType === 0) {
        return
    }

    let delta = grid32size
    if (currentGridType === 128) {
        delta = grid128size
    } else if (currentGridType === 512) {
        delta = grid512size
    }

    // Vertical lines
    for (let x = globals.MAP_MIN_X; x <= globals.MAP_MAX_X; x += delta) {
        let lineType: gridType = 32
        if (x % grid512size === 0) {
            lineType = 512
        } else if (x % grid128size === 0) {
            lineType = 128
        }

        arrayPush(gridLines, DrawLineByLightningCode(`grid${lineType}a${currentGridOpacity[`grid${lineType}`]}`, x, globals.MAP_MIN_Y - LINE_LENGTH_PRECISION_IN_SLK, x, globals.MAP_MAX_Y + LINE_LENGTH_PRECISION_IN_SLK))
    }

    // Horizontal lines
    for (let y = globals.MAP_MIN_Y; y <= globals.MAP_MAX_Y; y += delta) {
        let lineType: gridType = 32
        if (y % grid512size === 0) {
            lineType = 512
        } else if (y % grid128size === 0) {
            lineType = 128
        }

        arrayPush(gridLines, DrawLineByLightningCode(`grid${lineType}a${currentGridOpacity[`grid${lineType}`]}`, globals.MAP_MIN_X - LINE_LENGTH_PRECISION_IN_SLK, y, globals.MAP_MAX_X + LINE_LENGTH_PRECISION_IN_SLK, y))
    }
}

const RefreshGrid = () => {
    if (currentGridType !== undefined && currentGridType !== 0) {
        DrawGrid(currentGridType)
    }
}

export const SetGridOpacity = (opacity: gridOpacity) => {
    if(!checkOpacityValue(opacity)) {
        return false
    }
    currentGridOpacity.grid512 = opacity
    currentGridOpacity.grid128 = opacity
    currentGridOpacity.grid32 = opacity
    RefreshGrid()

    return true
}

export const SetGridOpacityForAllGrids = (opacityGrid1: gridOpacity, opacityGrid2: gridOpacity, opacityGrid3: gridOpacity) => {
    if(!checkOpacityValue(opacityGrid1) || !checkOpacityValue(opacityGrid2) || !checkOpacityValue(opacityGrid3)) {
        return false
    }
    currentGridOpacity.grid512 = opacityGrid1
    currentGridOpacity.grid128 = opacityGrid2
    currentGridOpacity.grid32 = opacityGrid3
    RefreshGrid()

    return true
}

export const checkOpacityValue = (opacity: number) => {
    return opacity === 5 || opacity === 10 || opacity === 15 || opacity === 25 || opacity === 50 || opacity === 75 || opacity === 100
}
