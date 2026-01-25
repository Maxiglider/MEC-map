const widths = {
    1: 0,
    2: 1,
    4: 2,
    8: 3,
    16: 4
}

const colorMin = 0;
const colorMax = 215

const colorNameToColorNumber = {
    'black': 0,
    'darkred': 3,
    'red': 5,
    'darkblue': 18,
    'blue': 30,
    'purple': 35,
    'darkgreen': 72,
    'orange': 77,
    'pink': 101,
    'grey': 129,
    'green': 180,
    'yellow': 185,
    'teal': 210,
    'white': 215,
}

let currentColor = 0;
let currentWidth = 1;

const getLightningCode = (color: number, width: number) => {
    // @ts-ignore
    if(widths[width] === undefined) {
        throw new Error(`DrawLine: width must be one of the following values: ${Object.keys(widths).join(', ')}.`);
    }

    if(color < colorMin || color > colorMax) {
        throw new Error(`DrawLine: color must be between ${colorMin} and ${colorMax}.`);
    }

    // @ts-ignore
    const code = widths[width] * 216 + color;
    return `c${code}`
}

export const DrawLineByLightningCode = (lightningCode: string, x1: number, y1: number, x2: number, y2: number) => {
    return AddLightning(lightningCode, false, x1, y1, x2, y2)
}

export const DrawLineByColorNumber = (color: number, width: number, x1: number, y1: number, x2: number, y2: number) => {
    const lightningCode = getLightningCode(color, width);
    return DrawLineByLightningCode(lightningCode, x1, y1, x2, y2)
}

export const DrawLine = (x1: number, y1: number, x2: number, y2: number, colorName?: string, width?: number) => {
    let color = currentColor
    if(colorName !== undefined) {
        // @ts-ignore
        if(colorNameToColorNumber[colorName] === undefined) {
            throw new Error(`DrawLine: colorName must be one of the following values: ${Object.keys(colorNameToColorNumber).join(', ')}.`);
        }

        // @ts-ignore
        color = colorNameToColorNumber[colorName];
    }

    let lineWidth = currentWidth
    if(width !== undefined) {
        // @ts-ignore
        if(widths[width] === undefined) {
            throw new Error(`DrawLine: width must be one of the following values: ${Object.keys(widths).join(', ')}.`);
        }

        lineWidth = width;
    }

    // @ts-ignore
    const lightning = DrawLineByColorNumber(color, lineWidth, x1, y1, x2, y2)

    if(lightning === undefined) {
        throw new Error(`DrawLine: Failed to create lightning effect.`)
    }

    return lightning
}

export const DefineDrawLineType = (colorName: string, width: number) =>{
    // @ts-ignore
    if(colorNameToColorNumber[colorName] === undefined) {
        throw new Error(`DefineDrawLineType: colorName must be one of the following values: ${Object.keys(colorNameToColorNumber).join(', ')}.`);
    }

    // @ts-ignore
    if(widths[width] === undefined) {
        throw new Error(`DefineDrawLineType: width must be one of the following values: ${Object.keys(widths).join(', ')}.`);
    }

    // @ts-ignore
    currentColor = colorNameToColorNumber[colorName];
    currentWidth = width;
}