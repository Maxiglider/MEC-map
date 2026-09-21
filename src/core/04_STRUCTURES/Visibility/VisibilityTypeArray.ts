import { MemoryHandler } from 'Utils/MemoryHandler'
import { arrayPush } from '../../01_libraries/Basic_functions'
import { Constants } from '../../01_libraries/Constants'
import { Text } from '../../01_libraries/Text'
import { handlePaginationArgs, handlePaginationObj } from '../../06_COMMANDS/Helpers/Pagination'
import { BaseArray } from '../BaseArray'
import { MASKED_LABEL, UNTOUCHED_LABEL, VISIBLE_LABEL, VisibilityState, VisibilityType } from './VisibilityType'

/**
 * The colours a periodic type gets, in turn, so two of them are never outlined the same by -debugVisibilityZones.
 * Yellow comes first, which is what the only periodic type of a simple map used to be. The three colours of the
 * built-ins are left out, so the legend stays unambiguous.
 */
const PERIODIC_COLOR_INDEXES = [
    Constants.YELLOW,
    Constants.ORANGE,
    Constants.PURPLE,
    Constants.TEAL,
    Constants.PINK,
    Constants.LIGHTBLUE,
    Constants.BLUE,
    Constants.BROWN,
    Constants.DARKGREEN,
]

/**
 * The visibility types of the whole game - not of a level, unlike the tiles that reference them.
 *
 * Always holds the three built-ins, recreated by the constructor on every load: "untouched" (the implicit state of
 * every tile nothing was painted on), "visible" and "masked".
 */
export class VisibilityTypeArray extends BaseArray<VisibilityType> {
    private untouched: VisibilityType
    private visible: VisibilityType
    private masked: VisibilityType

    /**
     * How many periodic types have been created, which picks the next colour. Not serialized: newFromJson recreates
     * them in the order they were saved, which is the order they were created in, so every machine lands on the same
     * colours without having to store them.
     */
    private nbPeriodicCreated = 0

    constructor() {
        super(true)

        this.untouched = new VisibilityType(UNTOUCHED_LABEL, 'untouched', 'u', true, Constants.GREY)
        this.visible = new VisibilityType(VISIBLE_LABEL, 'visible', 'v', true, Constants.GREEN)
        this.masked = new VisibilityType(MASKED_LABEL, 'masked', 'm', true, Constants.RED)

        this.untouched.id = this._new(this.untouched)
        this.visible.id = this._new(this.visible)
        this.masked.id = this._new(this.masked)
    }

    /** The highest id ever handed out, so a caller can size an array indexed by type id */
    getIdLimit = () => this.lastInstanceId + 1

    getUntouched = () => this.untouched
    getVisible = () => this.visible
    getMasked = () => this.masked

    getByLabel = (label: string) => {
        for (const [_, visibilityType] of pairs(this.data)) {
            if (visibilityType.label === label || visibilityType.theAlias === label) {
                return visibilityType
            }
        }

        return null
    }

    isLabelAlreadyUsed = (label: string) => this.getByLabel(label) !== null

    newPeriodic = (label: string, startState: VisibilityState, visibleTime: number, maskedTime: number) => {
        if (this.isLabelAlreadyUsed(label)) throw `VisibilityType label already used: "${label}"`
        if (visibleTime <= 0 || maskedTime <= 0) throw 'VisibilityType: both times must be greater than zero'

        const colorIndex = PERIODIC_COLOR_INDEXES[this.nbPeriodicCreated % PERIODIC_COLOR_INDEXES.length]
        this.nbPeriodicCreated++

        const vt = new VisibilityType(label, 'periodic', null, false, colorIndex, startState, visibleTime, maskedTime)
        vt.id = this._new(vt)

        return vt
    }

    remove = (visibilityType: VisibilityType): boolean => {
        if (visibilityType.immutable) {
            return false
        }

        for (const [id, vt] of pairs(this.data)) {
            if (vt === visibilityType) {
                vt.destroy()
                delete this.data[id]
                return true
            }
        }

        return false
    }

    displayPaginatedForPlayer = (p: player, cmd: string) => {
        const { searchTerms, pageNum } = handlePaginationArgs(cmd)
        const searchTerm = searchTerms.join(' ')

        if (searchTerm.length !== 0) {
            const visibilityType = this.getByLabel(searchTerm)

            if (visibilityType) {
                visibilityType.displayForPlayer(p)
            } else {
                Text.erP(p, `unknown visibility type`)
            }

            return
        }

        const pag = handlePaginationObj(this.getAll(), pageNum)

        Text.P_timed(
            p,
            Constants.TERRAIN_DATA_DISPLAY_TIME,
            `|cff00ff00Visibility Types (page |cff00ccff${pageNum}|r|cff00ff00/|cff00ccff${pag.totalPages}|r|cff00ff00)|r`
        )

        for (const l of pag.cmds) {
            Text.P_timed(p, Constants.TERRAIN_DATA_DISPLAY_TIME, l)
        }
    }

    toJson = () => {
        const arr = MemoryHandler.getEmptyArray()

        for (const [_, visibilityType] of pairs(this.data)) {
            // The built-ins are rebuilt by the constructor on every load, there is nothing of them to save
            if (!visibilityType.immutable) {
                arrayPush(arr, visibilityType.toJson())
            }
        }

        return arr
    }

    newFromJson = (visibilityTypesJson: { [x: string]: any }[]) => {
        for (const visibilityTypeJson of visibilityTypesJson) {
            const vt = this.newPeriodic(
                visibilityTypeJson.label,
                visibilityTypeJson.startState === 'masked' ? 'masked' : 'visible',
                visibilityTypeJson.visibleTime,
                visibilityTypeJson.maskedTime
            )

            if (visibilityTypeJson.alias) {
                vt.setAlias(visibilityTypeJson.alias)
            }
        }
    }
}
