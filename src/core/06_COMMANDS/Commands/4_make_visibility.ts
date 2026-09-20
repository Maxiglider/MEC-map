import { getUdgLevels, getUdgVisibilityTypes } from '../../../../globals'
import { ServiceManager } from '../../../Services'
import { arrayPush } from '../../01_libraries/Basic_functions'
import { Constants } from '../../01_libraries/Constants'
import { IsPositiveInteger } from '../../01_libraries/Functions_on_numbers'
import { Text } from '../../01_libraries/Text'
import { worldToTile } from '../../04_STRUCTURES/Visibility/TileCoordinates'
import { VisibilityCompositor } from '../../04_STRUCTURES/Visibility/VisibilityCompositor'
import { VisibilityState, VisibilityType } from '../../04_STRUCTURES/Visibility/VisibilityType'
import { USAGE } from '../Helpers/Command_functions'

/** Accepts the full words and the built-ins' own aliases, so "-newvt blink v 2 1" reads naturally */
const parseVisibilityState = (str: string): VisibilityState | null => {
    if (str === 'visible' || str === 'v') {
        return 'visible'
    }

    if (str === 'masked' || str === 'm') {
        return 'masked'
    }

    return null
}

/** S2R gives 0 on anything that isn't a number, so this one test covers both cases */
const parsePositiveTime = (str: string): number | null => {
    const time = S2R(str)

    return time > 0 ? time : null
}

const FORCE_FLAG = '--force'

/** How many tiles a visibility type holds, and which levels they are in, for -delvt to say what is at stake */
const countUsage = (visibilityType: VisibilityType) => {
    let tiles = 0
    const levelIds: string[] = []

    getUdgLevels().forAll((level, levelId) => {
        const n = level.visibilityTiles.countByType(visibilityType)

        if (n > 0) {
            tiles += n
            arrayPush(levelIds, I2S(levelId))
        }
    })

    return {
        tiles,
        levels: levelIds.length === 1 ? 'level ' + levelIds[0] : 'levels ' + levelIds.join(', '),
    }
}

export const initExecuteCommandMake_visibility = () => {
    const { registerCommand } = ServiceManager.getService('Cmd')
    const group = 'make'

    /**
     * Resolves a label (or alias) to an editable visibility type, telling the player what went wrong otherwise.
     * The three built-ins are never editable, not even by a rename.
     */
    const getEditableType = (p: player, label: string): VisibilityType | null => {
        const visibilityType = getUdgVisibilityTypes().getByLabel(label)

        if (!visibilityType) {
            Text.erP(p, 'visibility type "' + label + '" doesn\'t exist')
            return null
        }

        if (visibilityType.immutable) {
            Text.erP(p, 'visibility type "' + visibilityType.label + '" is built in and can\'t be edited')
            return null
        }

        return visibilityType
    }

    //-newVisibilityType(newvt) <label> <visible|masked> <visibleTime> <maskedTime>   --> add a new periodic visibility type
    registerCommand({
        name: 'newVisibilityType',
        alias: ['newvt'],
        group,
        argDescription: '<label> <visible|masked> <visibleTime> <maskedTime>',
        description:
            'Add a new visibility type, switching between visible and masked. The two times are in seconds and must be greater than zero',
        cb: ({ nbParam, param1, param2, param3, param4 }, escaper) => {
            if (nbParam !== 4) {
                return USAGE
            }

            const p = escaper.getPlayer()

            if (getUdgVisibilityTypes().isLabelAlreadyUsed(param1)) {
                Text.erP(p, 'visibility type "' + param1 + '" already exists')
                return true
            }

            const startState = parseVisibilityState(param2)

            if (!startState) {
                Text.erP(p, 'the start state must be "visible" (v) or "masked" (m)')
                return true
            }

            const visibleTime = parsePositiveTime(param3)
            const maskedTime = parsePositiveTime(param4)

            if (!visibleTime || !maskedTime) {
                Text.erP(p, 'both times must be numbers of seconds greater than zero')
                return true
            }

            getUdgVisibilityTypes().newPeriodic(param1, startState, visibleTime, maskedTime)

            Text.mkP(p, 'new visibility type "' + param1 + '" added')

            return true
        },
    })

    //-setVisibilityTypeLabel(setvtl) <label> <newLabel>
    registerCommand({
        name: 'setVisibilityTypeLabel',
        alias: ['setvtl'],
        group,
        argDescription: '<label> <newLabel>',
        description: 'Rename a visibility type',
        cb: ({ nbParam, param1, param2 }, escaper) => {
            if (nbParam !== 2) {
                return USAGE
            }

            const p = escaper.getPlayer()
            const visibilityType = getEditableType(p, param1)

            if (!visibilityType) {
                return true
            }

            if (getUdgVisibilityTypes().isLabelAlreadyUsed(param2)) {
                Text.erP(p, 'visibility type "' + param2 + '" already exists')
                return true
            }

            visibilityType.setLabel(param2)

            Text.mkP(p, 'visibility type renamed to "' + param2 + '"')

            return true
        },
    })

    //-setVisibilityTypeAlias(setvta) <label> <alias>
    registerCommand({
        name: 'setVisibilityTypeAlias',
        alias: ['setvta'],
        group,
        argDescription: '<label> <alias>',
        description: 'Set the alias of a visibility type',
        cb: ({ nbParam, param1, param2 }, escaper) => {
            if (nbParam !== 2) {
                return USAGE
            }

            const p = escaper.getPlayer()
            const visibilityType = getEditableType(p, param1)

            if (!visibilityType) {
                return true
            }

            if (getUdgVisibilityTypes().isLabelAlreadyUsed(param2)) {
                Text.erP(p, 'visibility type "' + param2 + '" already exists')
                return true
            }

            visibilityType.setAlias(param2)

            Text.mkP(p, 'visibility type "' + visibilityType.label + '" is now also called "' + param2 + '"')

            return true
        },
    })

    //-setVisibilityTypeStart(setvts) <label> <visible|masked>
    registerCommand({
        name: 'setVisibilityTypeStart',
        alias: ['setvts'],
        group,
        argDescription: '<label> <visible|masked>',
        description: 'Set the state a visibility type starts its cycle on',
        cb: ({ nbParam, param1, param2 }, escaper) => {
            if (nbParam !== 2) {
                return USAGE
            }

            const p = escaper.getPlayer()
            const visibilityType = getEditableType(p, param1)

            if (!visibilityType) {
                return true
            }

            const startState = parseVisibilityState(param2)

            if (!startState) {
                Text.erP(p, 'the start state must be "visible" (v) or "masked" (m)')
                return true
            }

            visibilityType.setStartState(startState)

            Text.mkP(p, 'visibility type "' + visibilityType.label + '" now starts ' + startState)

            return true
        },
    })

    //-setVisibilityTypeTimes(setvtt) <label> <visibleTime> <maskedTime>
    registerCommand({
        name: 'setVisibilityTypeTimes',
        alias: ['setvtt'],
        group,
        argDescription: '<label> <visibleTime> <maskedTime>',
        description: 'Set both times of a visibility type cycle, in seconds',
        cb: ({ nbParam, param1, param2, param3 }, escaper) => {
            if (nbParam !== 3) {
                return USAGE
            }

            const p = escaper.getPlayer()
            const visibilityType = getEditableType(p, param1)

            if (!visibilityType) {
                return true
            }

            const visibleTime = parsePositiveTime(param2)
            const maskedTime = parsePositiveTime(param3)

            if (!visibleTime || !maskedTime) {
                Text.erP(p, 'both times must be numbers of seconds greater than zero')
                return true
            }

            visibilityType.setTimes(visibleTime, maskedTime)

            Text.mkP(
                p,
                'visibility type "' +
                    visibilityType.label +
                    '" is now visible ' +
                    R2S(visibleTime) +
                    's and masked ' +
                    R2S(maskedTime) +
                    's'
            )

            return true
        },
    })

    //-deleteVisibilityType(delvt) <label> [--force]
    registerCommand({
        name: 'deleteVisibilityType',
        alias: ['delvt'],
        group,
        argDescription: '<label> [--force]',
        description: 'Delete a visibility type. --force also deletes every tile painted with it, in every level',
        cb: ({ nbParam, param1, param2 }, escaper) => {
            if (nbParam < 1 || nbParam > 2) {
                return USAGE
            }

            if (nbParam === 2 && param2 !== FORCE_FLAG) {
                return USAGE
            }

            const p = escaper.getPlayer()
            const visibilityType = getUdgVisibilityTypes().getByLabel(param1)

            if (!visibilityType) {
                Text.erP(p, 'visibility type "' + param1 + '" doesn\'t exist')
                return true
            }

            if (visibilityType.immutable) {
                Text.erP(p, 'visibility type "' + visibilityType.label + '" is built in and can\'t be deleted')
                return true
            }

            const label = visibilityType.label
            const usage = countUsage(visibilityType)

            // Deleting a type used somewhere takes those tiles away from levels the maker may not even be on, so it
            // asks to be spelled out - and the refusal gives the count first, since there is no undoing it afterwards.
            if (usage.tiles > 0 && nbParam !== 2) {
                Text.erP(
                    p,
                    'visibility type "' +
                        label +
                        '" is used by ' +
                        I2S(usage.tiles) +
                        ' tiles in ' +
                        usage.levels +
                        ' - add ' +
                        FORCE_FLAG +
                        ' to delete it and those tiles'
                )
                return true
            }

            if (usage.tiles > 0) {
                getUdgLevels().forAll(level => level.visibilityTiles.removeAllOfType(visibilityType))
            }

            getUdgVisibilityTypes().remove(visibilityType)

            if (usage.tiles > 0) {
                Text.mkP(
                    p,
                    'visibility type "' +
                        label +
                        '" deleted, along with ' +
                        I2S(usage.tiles) +
                        ' tiles in ' +
                        usage.levels
                )
            } else {
                Text.mkP(p, 'visibility type "' + label + '" deleted')
            }

            return true
        },
    })

    //-convertVisibilities(convv) [<levelId>]   --> turn a level's old visibility rectangles into painted tiles
    registerCommand({
        name: 'convertVisibilities',
        alias: ['convv'],
        group,
        argDescription: '[<levelId>]',
        description:
            "Turn a level's old visibility rectangles into visible tiles, so it can be painted. Their borders snap to the terrain grid, by up to half a tile",
        cb: ({ noParam, nbParam, param1 }, escaper) => {
            if (!noParam && nbParam !== 1) {
                return USAGE
            }

            const p = escaper.getPlayer()
            let level = escaper.getMakingLevel()

            if (nbParam === 1) {
                if (!IsPositiveInteger(param1)) {
                    Text.erP(p, 'the level number must be a positive integer')
                    return true
                }

                const target = getUdgLevels().get(S2I(param1))

                if (!target) {
                    Text.erP(p, 'level number ' + param1 + " doesn't exist")
                    return true
                }

                level = target
            }

            if (!level.isLegacyVisibility()) {
                Text.erP(p, 'level ' + I2S(level.getId()) + ' has no old visibility rectangle to convert')
                return true
            }

            const visible = getUdgVisibilityTypes().getVisible()
            let nbRects = 0

            level.visibilities.forAll(vm => {
                nbRects++
                level.visibilityTiles.setRect(
                    worldToTile(vm.getX1()),
                    worldToTile(vm.getY1()),
                    worldToTile(vm.getX2()),
                    worldToTile(vm.getY2()),
                    visible
                )
            })

            level.visibilities.removeAllVisibilityModifiers()

            getUdgLevels().refreshVisibilities()

            Text.mkP(
                p,
                I2S(nbRects) +
                    ' visibility rectangles of level ' +
                    I2S(level.getId()) +
                    ' converted into visible tiles - their borders moved onto the terrain grid, by up to ' +
                    I2S(Constants.LARGEUR_CASE / 2) +
                    ' units'
            )
            Text.mkP(p, 'this one cannot be undone, and -smic now saves this level as tiles')

            return true
        },
    })

    //-debugVisibilityZones(dvz) <on|off>   --> outline the fog modifiers the compositor builds
    registerCommand({
        name: 'debugVisibilityZones',
        alias: ['dvz'],
        group,
        argDescription: '<on|off>',
        description:
            'Outline the zones the visibility compositor turns the painted tiles into, and show how many of them there are and how long the partition took',
        cb: ({ nbParam, param1 }, escaper) => {
            if (nbParam !== 1 || (param1 !== 'on' && param1 !== 'off')) {
                return USAGE
            }

            const p = escaper.getPlayer()

            VisibilityCompositor.setDebugEnabled(param1 === 'on')

            if (param1 === 'off') {
                Text.mkP(p, 'visibility zones debug off')
                return true
            }

            const visibilityTypes = getUdgVisibilityTypes()

            Text.mkP(p, I2S(VisibilityCompositor.countZones()) + ' visibility zones, one fog modifier each')

            for (let id = 0; id < visibilityTypes.getIdLimit(); id++) {
                const visibilityType = visibilityTypes.get(id)

                if (!visibilityType) {
                    continue
                }

                const n = VisibilityCompositor.countZonesOfType(visibilityType)

                if (n > 0) {
                    Text.mkP(p, '    ' + visibilityType.toText() + '   ' + I2S(n) + ' zones')
                }
            }

            // Measured with os.clock(), which does not read the same on two machines: shown to whoever asked, and
            // to nobody else, so a local value never becomes something the game depends on
            Text.mkP(p, 'last partition took ' + R2S(VisibilityCompositor.getLastDurationMs()) + ' ms on your machine')

            return true
        },
    })

    //-displayVisibilityTypes(dvt) [<label>] [page]
    registerCommand({
        name: 'displayVisibilityTypes',
        alias: ['dvt'],
        group,
        argDescription: '[<label>] [page]',
        description: 'Displays the visibility types of the game',
        cb: ({ cmd }, escaper) => {
            getUdgVisibilityTypes().displayPaginatedForPlayer(escaper.getPlayer(), cmd)
            return true
        },
    })
}
