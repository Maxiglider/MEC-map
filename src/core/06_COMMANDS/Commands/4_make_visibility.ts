import { getUdgLevels, getUdgVisibilityTypes } from '../../../../globals'
import { ServiceManager } from '../../../Services'
import { IsBoolString, S2B, arrayPush } from '../../01_libraries/Basic_functions'
import { Constants } from '../../01_libraries/Constants'
import { IsPositiveInteger } from '../../01_libraries/Functions_on_numbers'
import { Text } from '../../01_libraries/Text'
import { Level } from '../../04_STRUCTURES/Level/Level'
import { worldToTile } from '../../04_STRUCTURES/Visibility/TileCoordinates'
import { VisibilityCompositor } from '../../04_STRUCTURES/Visibility/VisibilityCompositor'
import { VisibilityState, VisibilityType } from '../../04_STRUCTURES/Visibility/VisibilityType'
import { BrushShape } from '../../05_MAKE_STRUCTURES/Make/BrushShape'
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

    // --- The visibility types, which belong to the whole game ---

    //-newVisibilityType(newvt) <label> <visibilityTypeStart> <visibleTime> <maskedTime>   --> add a new periodic visibility type
    registerCommand({
        name: 'newVisibilityType',
        alias: ['newvt'],
        group,
        argDescription: '<label> <visibilityTypeStart> <visibleTime> <maskedTime>',
        description:
            'Add a new visibility type, switching between visible and masked. visibilityTypeStart can be visible|v|masked|m. The two times are in seconds and must be greater than zero',
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

            if (visibleTime === null || maskedTime === null) {
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

    //-setVisibilityTypeStart(setvts) <label> <visibilityTypeStart>
    registerCommand({
        name: 'setVisibilityTypeStart',
        alias: ['setvts'],
        group,
        argDescription: '<label> <visibilityTypeStart>',
        description:
            'Set the state a visibility type starts its cycle on. visibilityTypeStart can be visible|v|masked|m',
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

            if (visibleTime === null || maskedTime === null) {
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

    // --- What a level says about its terrain tiles ---

    //-createVisibility(crv) <visibilityTypeLabel> [<brushSize> [<shape>]]   --> paint visibility on the terrain tiles
    registerCommand({
        name: 'createVisibility',
        alias: ['crv'],
        group,
        argDescription: '<visibilityTypeLabel> [<brushSize> [<shape>]]',
        description:
            'Paint a visibility type on the terrain tiles of the current level, by clicking two corners or with a brush. Paint "u" (untouched) to erase',
        cb: ({ noParam, nbParam, param1, param2, param3 }, escaper) => {
            const p = escaper.getPlayer()

            // Not a USAGE: the parameterless form used to be the whole command, so it has to say what became of it
            if (noParam) {
                Text.erP(p, '-crv no longer creates a visibility rectangle on its own')
                Text.mkP(
                    p,
                    'visibility is now painted per terrain tile, with a visibility type that can mask an area again, not only reveal it'
                )
                Text.mkP(p, 'use "-crv <visibilityTypeLabel>" - built in types: u (untouched), v (visible), m (masked)')
                Text.mkP(p, 'type "-dvt" to list every visibility type, "-newvt" to create one')
                return true
            }

            if (nbParam > 3) {
                return USAGE
            }

            const visibilityType = getUdgVisibilityTypes().getByLabel(param1)

            if (!visibilityType) {
                Text.erP(p, 'visibility type "' + param1 + '" doesn\'t exist')
                return true
            }

            const level = escaper.getMakingLevel()

            // A level holds either the old rectangles or the tiles, never both: they do not compose together
            if (level.isLegacyVisibility()) {
                Text.erP(
                    p,
                    'level ' +
                        I2S(level.getId()) +
                        ' still uses the old visibility rectangles - run -convertVisibilities first, or -remv to clear them'
                )
                return true
            }

            if (nbParam === 1) {
                escaper.makeCreateVisibility(visibilityType)
                Text.mkP(p, 'visibility painting on, click two corners')
                return true
            }

            const brushSize = S2I(param2)

            if (brushSize < 1 || brushSize > 8) {
                Text.erP(p, 'brush size has to be between 1 and 8')
                return true
            }

            const shape: BrushShape = param3 == 'circle' || param3 == 'c' ? 'circle' : 'square'

            escaper.makeCreateVisibility(visibilityType, brushSize, shape)
            Text.mkP(p, 'visibility painting on, hold the right button to paint and the left one to erase')

            return true
        },
    })

    //-setLevelResetVisibilities(setlrv) <boolean> [<levelId>]   --> set whether the levels below stop contributing to the visibility when this one starts
    registerCommand({
        name: 'setLevelResetVisibilities',
        alias: ['setlrv'],
        group,
        argDescription: '<boolean> [<levelId>]',
        description:
            'Set whether the levels below stop contributing to the visibility when this one starts (applies a total black mask on the map when true). Painting "m" tiles with -crv says the same thing per tile, and more precisely',
        cb: ({ nbParam, param1, param2 }, escaper) => {
            if (nbParam > 2 || !IsBoolString(param1)) {
                return USAGE
            }

            const levelNum = nbParam == 2 ? S2I(param2) : escaper.getMakingLevel().getId()
            const level = getUdgLevels().get(levelNum)
            if (!level) {
                Text.erP(escaper.getPlayer(), `Level number ${param2} doesn't exist`)
                return true
            }

            const doReset = S2B(param1)

            if (level.getResetVisiblitiesAtStart() === doReset) {
                Text.erP(
                    escaper.getPlayer(),
                    `Level ${levelNum} already has reset visibilities at start set to ${param1}`
                )
                return true
            }

            level.setResetVisiblitiesAtStart(doReset)
            Text.mkP(
                escaper.getPlayer(),
                `Level ${levelNum} will ${doReset ? '' : 'no longer '}reset visibilities at start`
            )

            return true
        },
    })

    //-removeVisibilities(remv) [<levelId>]   --> remove everything the level says about visibility
    registerCommand({
        name: 'removeVisibilities',
        alias: ['remv'],
        group,
        argDescription: '[<levelId>]',
        description:
            'Remove everything the current level says about visibility: its painted tiles, and the old visibility rectangles if it still has any',
        cb: ({ noParam, nbParam, param1 }, escaper) => {
            if (!(noParam || nbParam === 1)) {
                return true
            }

            let level: Level | null = null

            //check param1
            if (nbParam === 1) {
                if (!IsPositiveInteger(param1)) {
                    Text.erP(escaper.getPlayer(), 'the level number must be a positive integer')
                    return true
                }
                // was reading param2, which is empty here: every "-remv <levelId>" emptied level 0 instead
                level = getUdgLevels().get(S2I(param1))
                if (!level) {
                    Text.erP(escaper.getPlayer(), 'level number ' + param1 + " doesn't exist")
                    return true
                }
            } else {
                level = escaper.getMakingLevel()
            }
            level.removeVisibilities()
            Text.mkP(escaper.getPlayer(), 'visibilities removed for level ' + I2S(level.getId()))
            return true
        },
    })

    //-convertVisibilities(convv) <levelId>|current|c|all   --> turn a level's old visibility rectangles into painted tiles
    registerCommand({
        name: 'convertVisibilities',
        alias: ['convv'],
        group,
        argDescription: '<levelId>|current|c|all',
        description:
            "Turn a level's old visibility rectangles into visible tiles, so it can be painted. Their borders snap to the terrain grid, by up to half a tile",
        cb: ({ nbParam, param1 }, escaper) => {
            if (nbParam !== 1) {
                return USAGE
            }

            const p = escaper.getPlayer()
            const levels: Level[] = []

            if (param1 === 'all') {
                // By id rather than through forAll, whose pairs order would have the fog modifiers destroyed in a
                // different order on each machine, and their handle ids drift apart
                for (let levelId = 0; levelId <= getUdgLevels().getLastLevelId(); levelId++) {
                    const level = getUdgLevels().get(levelId)

                    if (level && level.isLegacyVisibility()) {
                        arrayPush(levels, level)
                    }
                }

                if (levels.length === 0) {
                    Text.erP(p, 'no level has an old visibility rectangle to convert')
                    return true
                }
            } else {
                // "current"/"c" names the making level explicitly, as the terrain save commands use it
                let level = escaper.getMakingLevel()

                if (param1 !== 'current' && param1 !== 'c') {
                    if (!IsPositiveInteger(param1)) {
                        Text.erP(p, 'the level number must be a positive integer, or "current" ("c"), or "all"')
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

                arrayPush(levels, level)
            }

            const visible = getUdgVisibilityTypes().getVisible()
            let nbRects = 0

            for (const level of levels) {
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
            }

            getUdgLevels().refreshVisibilities()

            const where = levels.length === 1 ? 'level ' + I2S(levels[0].getId()) : I2S(levels.length) + ' levels'

            Text.mkP(
                p,
                I2S(nbRects) +
                    ' visibility rectangles of ' +
                    where +
                    ' converted into visible tiles - their borders moved onto the terrain grid, by up to ' +
                    I2S(Constants.LARGEUR_CASE / 2) +
                    ' units'
            )
            Text.mkP(p, 'this one cannot be undone, and -smic now saves ' + where + ' as tiles')

            return true
        },
    })

    // --- Debug ---

    //-debugVisibilityZones(debvz) <boolean>   --> outline the fog modifiers the compositor builds
    registerCommand({
        name: 'debugVisibilityZones',
        alias: ['debvz'],
        group,
        argDescription: '<boolean>',
        description:
            'Outline the zones the visibility compositor turns the painted tiles into, and show how many of them there are and how long the partition took',
        cb: ({ nbParam, param1 }, escaper) => {
            if (nbParam !== 1 || !IsBoolString(param1)) {
                return USAGE
            }

            const p = escaper.getPlayer()
            const enabled = S2B(param1)

            VisibilityCompositor.setDebugEnabled(enabled)

            if (!enabled) {
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
}
