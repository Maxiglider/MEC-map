import { getUdgLevels, globals } from '../../../../globals'
import { Natives } from '../../wc3_natives_unsecured/Natives'

/**
 * Two lines of text on the ground, centered under the start zone of the first level, for every player: how to get
 * the follow mouse mode, and, while the slide speed control is on, how to use it.
 *
 * The text tags are made once, the same on every machine, and only moved, rewritten or hidden afterwards. A text tag
 * is drawn from its left end, so a line is centered by an estimate of its width: close enough to read as centered.
 */
const FOLLOW_MOUSE_LINE = 'Type "-sm a" for follow mouse mode'
const SLIDE_SPEED_CONTROL_LINE = 'Hold the right click to speed up, the left click to brake'

const FONT_SIZE = 10
/** The estimated width of a character at that font size, in world units */
const CHAR_WIDTH = 11
/** How far under the start zone the first line stands, and the second under the first */
const MARGIN_UNDER_ZONE = 32
const LINE_HEIGHT = 48

const lines: { followMouse?: texttag; slideSpeedControl?: texttag } = {}

const placeLine = (textTag: texttag, text: string, centerX: number, y: number) => {
    SetTextTagTextBJ(textTag, text, FONT_SIZE)
    SetTextTagPos(textTag, centerX - (text.length * CHAR_WIDTH) / 2, y, 0)
}

const makeLine = () => {
    const textTag = Natives.UCreateTextTag()
    SetTextTagPermanent(textTag, true)
    return textTag
}

/**
 * Puts the lines where the start zone of the first level is, and shows the second one according to the slide speed
 * control. Called whenever one of those changes: the game start, the start zone made again, -slideSpeedControl.
 */
export const refreshStartZoneHints = () => {
    const start = getUdgLevels()?.get(0)?.getStart()

    if (!start) {
        lines.followMouse && SetTextTagVisibility(lines.followMouse, false)
        lines.slideSpeedControl && SetTextTagVisibility(lines.slideSpeedControl, false)
        return
    }

    const centerX = (start.minX + start.maxX) / 2
    const y = start.minY - MARGIN_UNDER_ZONE

    lines.followMouse = lines.followMouse ?? makeLine()
    placeLine(lines.followMouse, FOLLOW_MOUSE_LINE, centerX, y)
    SetTextTagVisibility(lines.followMouse, true)

    lines.slideSpeedControl = lines.slideSpeedControl ?? makeLine()
    placeLine(lines.slideSpeedControl, SLIDE_SPEED_CONTROL_LINE, centerX, y - LINE_HEIGHT)
    SetTextTagVisibility(lines.slideSpeedControl, globals.slideSpeedControl)
}
