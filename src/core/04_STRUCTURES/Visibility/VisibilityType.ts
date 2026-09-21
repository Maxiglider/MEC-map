import { MemoryHandler } from 'Utils/MemoryHandler'
import { Constants } from '../../01_libraries/Constants'
import { PLAYER_COLOR_NAMES } from '../../01_libraries/Draw_lines'
import { udg_colorCode } from '../../01_libraries/Init_colorCodes'
import { Text } from '../../01_libraries/Text'

export const VISIBILITY_DISPLAY_SPACE = '   '

/**
 * What a visibility type does to the terrain tiles it is painted on.
 *
 * "untouched" is transparent: the tile falls through to whatever the level below says about it. That is what
 * separates it from "masked", which hides the tile even when a lower level reveals it - the whole point of the
 * per-tile system over the old reveal-only rectangles.
 */
export type VisibilityTypeKind = 'untouched' | 'visible' | 'masked' | 'periodic'

export type VisibilityState = 'visible' | 'masked'

export const UNTOUCHED_LABEL = 'untouched'
export const VISIBLE_LABEL = 'visible'
export const MASKED_LABEL = 'masked'

export const isVisibilityState = (str: string): str is VisibilityState => str === 'visible' || str === 'masked'

export class VisibilityType {
    label: string
    theAlias: string | null

    /** Fixed at creation: only "periodic" types are ever built by the makers, the three others are the built-ins */
    readonly kind: VisibilityTypeKind

    /** The three built-ins can neither be edited nor deleted, not even with --force */
    readonly immutable: boolean

    /** Set by VisibilityTypeArray on insertion, so a type can index a plain array - no table keyed by an object */
    id: number = -1

    /**
     * One of the Constants player colours, which names how this type is written in the chat AND how its zones are
     * outlined by -debugVisibilityZones. A single index rather than a colour code on one side and a line colour name
     * on the other, which would sooner or later disagree.
     */
    readonly colorIndex: number

    /** Only meaningful when kind === 'periodic' */
    private startState: VisibilityState
    /** Only meaningful when kind === 'periodic', in seconds, > 0 */
    private visibleTime: number
    /** Only meaningful when kind === 'periodic', in seconds, > 0 */
    private maskedTime: number

    constructor(
        label: string,
        kind: VisibilityTypeKind,
        theAlias: string | null,
        immutable: boolean,
        colorIndex: number,
        startState: VisibilityState = 'visible',
        visibleTime: number = 0,
        maskedTime: number = 0
    ) {
        this.label = label
        this.kind = kind
        this.theAlias = theAlias
        this.immutable = immutable
        this.colorIndex = colorIndex
        this.startState = startState
        this.visibleTime = visibleTime
        this.maskedTime = maskedTime
    }

    isUntouched = () => this.kind === 'untouched'
    isMasked = () => this.kind === 'masked'
    isPeriodic = () => this.kind === 'periodic'

    /**
     * Whether this type needs a fog modifier at all. The world bounds black mask is permanently on, so "masked" is
     * simply the absence of one, and "untouched" never reaches the compositor's output either.
     */
    needsFogModifier = () => this.kind === 'visible' || this.kind === 'periodic'

    getStartState = () => this.startState

    setStartState = (startState: VisibilityState) => {
        this.startState = startState
    }

    getVisibleTime = () => this.visibleTime
    getMaskedTime = () => this.maskedTime

    setTimes = (visibleTime: number, maskedTime: number) => {
        this.visibleTime = visibleTime
        this.maskedTime = maskedTime
    }

    /** The full cycle of a periodic type, 0 for every other kind */
    getPeriod = () => (this.isPeriodic() ? this.visibleTime + this.maskedTime : 0)

    setLabel = (label: string) => {
        this.label = label
    }

    setAlias = (theAlias: string) => {
        this.theAlias = theAlias
    }

    /** How the type is written in the chat */
    getColor = () => udg_colorCode[this.colorIndex]

    /** How its zones are outlined on the ground, the same colour under another name */
    getLineColorName = () => PLAYER_COLOR_NAMES[this.colorIndex]

    toText = () => {
        let display =
            this.getColor() +
            this.label +
            (this.theAlias && this.theAlias !== '' ? ' ' + this.theAlias : '') +
            '|r' +
            VISIBILITY_DISPLAY_SPACE +
            this.kind

        if (this.isPeriodic()) {
            display +=
                VISIBILITY_DISPLAY_SPACE +
                'from ' +
                this.startState +
                VISIBILITY_DISPLAY_SPACE +
                'visible ' +
                R2S(this.visibleTime) +
                's' +
                VISIBILITY_DISPLAY_SPACE +
                'masked ' +
                R2S(this.maskedTime) +
                's'
        }

        return display
    }

    displayForPlayer = (p: player) => {
        Text.P_timed(p, Constants.TERRAIN_DATA_DISPLAY_TIME, this.toText())
    }

    /**
     * Only the maker-made types are ever serialized: VisibilityTypeArray.toJson() leaves the built-ins out, since its
     * constructor recreates them on every load and they cannot be edited anyway.
     */
    toJson = () => {
        const output = MemoryHandler.getEmptyObject<any>()

        output['label'] = this.label
        output['alias'] = this.theAlias
        output['kind'] = this.kind
        output['startState'] = this.startState
        output['visibleTime'] = this.visibleTime
        output['maskedTime'] = this.maskedTime

        return output
    }

    destroy = () => {}
}
