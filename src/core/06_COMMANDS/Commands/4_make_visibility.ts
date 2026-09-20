import { getUdgVisibilityTypes } from '../../../../globals'
import { ServiceManager } from '../../../Services'
import { Text } from '../../01_libraries/Text'
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

    //-deleteVisibilityType(delvt) <label>
    registerCommand({
        name: 'deleteVisibilityType',
        alias: ['delvt'],
        group,
        argDescription: '<label>',
        description: 'Delete a visibility type',
        cb: ({ nbParam, param1 }, escaper) => {
            if (nbParam !== 1) {
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

            getUdgVisibilityTypes().remove(visibilityType)

            Text.mkP(p, 'visibility type "' + label + '" deleted')

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
