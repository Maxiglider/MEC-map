import { globals } from '../../../../globals'
import { ServiceManager } from '../../../Services'
import { IsBoolString, S2B } from '../../01_libraries/Basic_functions'
import { Text } from '../../01_libraries/Text'
import type { Escaper } from '../../04_STRUCTURES/Escaper/Escaper'

/**
 * The commands setting the slide speed control, the game constants a hero sliding async speeds up and slows down
 * with (see SlideSpeedControl). -showSlideSpeed, a display setting of each player, stays with -showNames in 1_all.
 */

/** A real written by the player, or undefined: S2R reads anything that is not a number as 0 */
const readRatio = (param: string): number | undefined => {
    const ratio = S2R(param)
    return ratio !== 0 || param === '0' || param === '0.0' ? ratio : undefined
}

/**
 * The four real settings of the slide speed control share their callback: without a value, tell it; with one,
 * check it is between min and max, then set it for everybody. Called from each command's own arrow
 * function, which the help generator reads without running it.
 */
const setSlideSpeedControlRatio = (
    { nbParam, param1 }: { nbParam: number; param1: string },
    escaper: Escaper,
    label: string,
    min: number,
    max: number | undefined,
    get: () => number,
    set: (ratio: number) => void
): true => {
    if (nbParam === 0) {
        Text.P(escaper.getPlayer(), label + ' is ' + R2S(get()))
        return true
    }

    if (nbParam !== 1) {
        return true
    }

    const ratio = readRatio(param1)

    if (ratio === undefined || ratio < min || (max !== undefined && ratio > max)) {
        Text.erP(
            escaper.getPlayer(),
            label +
                ' must be a real ' +
                (max === undefined ? 'of at least ' + R2S(min) : 'between ' + R2S(min) + ' and ' + R2S(max))
        )
        return true
    }

    set(ratio)
    Text.A(label + ' set to ' + R2S(ratio))
    return true
}

export const initExecuteCommandMake_speed_control = () => {
    const { registerCommand } = ServiceManager.getService('Cmd')
    const group = 'make'

    //-slideSpeedControl(ssc) [<boolean>]
    registerCommand({
        name: 'slideSpeedControl',
        alias: ['ssc'],
        group,
        argDescription: '[<boolean>]',
        description:
            'Lets a hero sliding in async or asyncClicks mode speed up by holding the right click and slow down by holding the left one, within the bounds of -setSlideSpeedControlMin and -setSlideSpeedControlMax. Off by default. Without a value, tells whether it is on',
        cb: ({ nbParam, param1 }, escaper) => {
            if (nbParam === 0) {
                Text.P(escaper.getPlayer(), 'slide speed control is ' + (globals.slideSpeedControl ? 'on' : 'off'))
                return true
            }

            if (nbParam !== 1 || !IsBoolString(param1)) {
                return true
            }

            globals.slideSpeedControl = S2B(param1)
            Text.A('slide speed control ' + (globals.slideSpeedControl ? 'on' : 'off'))
            return true
        },
    })

    //-setSlideSpeedControlMax(setsscmax) [<ratio>]
    registerCommand({
        name: 'setSlideSpeedControlMax',
        alias: ['setsscmax'],
        group,
        argDescription: '[<ratio>]',
        description:
            'The fastest a hero can slide with the slide speed control, as a ratio of the base slide speed: 1.5 is 150%. At least 1, 1.5 by default. Without a value, tells it',
        cb: (cmd, escaper) =>
            setSlideSpeedControlRatio(
                cmd,
                escaper,
                'slide speed control max',
                1,
                undefined,
                () => globals.slideSpeedControlMax,
                ratio => (globals.slideSpeedControlMax = ratio)
            ),
    })

    //-setSlideSpeedControlMin(setsscmin) [<ratio>]
    registerCommand({
        name: 'setSlideSpeedControlMin',
        alias: ['setsscmin'],
        group,
        argDescription: '[<ratio>]',
        description:
            'The slowest a hero can slide with the slide speed control, as a ratio of the base slide speed: 0 lets it stop. Between 0 and 1, 0.5 by default. Without a value, tells it',
        cb: (cmd, escaper) =>
            setSlideSpeedControlRatio(
                cmd,
                escaper,
                'slide speed control min',
                0,
                1,
                () => globals.slideSpeedControlMin,
                ratio => (globals.slideSpeedControlMin = ratio)
            ),
    })

    //-setSlideSpeedControlAcceleration(setssca) [<ratio>]
    registerCommand({
        name: 'setSlideSpeedControlAcceleration',
        alias: ['setssca'],
        group,
        argDescription: '[<ratio>]',
        description:
            'How much holding the right click adds to the slide speed each second, as a ratio of the base slide speed: 0.2 adds 20% of it a second. At least 0, 0.2 by default. Without a value, tells it',
        cb: (cmd, escaper) =>
            setSlideSpeedControlRatio(
                cmd,
                escaper,
                'slide speed control acceleration',
                0,
                undefined,
                () => globals.slideSpeedControlAcceleration,
                ratio => (globals.slideSpeedControlAcceleration = ratio)
            ),
    })

    //-setSlideSpeedControlBraking(setsscb) [<ratio>]
    registerCommand({
        name: 'setSlideSpeedControlBraking',
        alias: ['setsscb'],
        group,
        argDescription: '[<ratio>]',
        description:
            'How much holding the left click takes off the slide speed each second, as a ratio of the base slide speed: 0.4 takes 40% of it a second. At least 0, 0.4 by default. Without a value, tells it',
        cb: (cmd, escaper) =>
            setSlideSpeedControlRatio(
                cmd,
                escaper,
                'slide speed control braking',
                0,
                undefined,
                () => globals.slideSpeedControlBraking,
                ratio => (globals.slideSpeedControlBraking = ratio)
            ),
    })
}
