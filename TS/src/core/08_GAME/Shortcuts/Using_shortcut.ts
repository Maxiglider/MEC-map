import { udg_colorCode } from 'core/01_libraries/Init_colorCodes'
import { Text } from 'core/01_libraries/Text'
import { Hero2Escaper, IsHero } from 'core/04_STRUCTURES/Escaper/Escaper_functions'
import { literalArray } from 'Utils/ArrayUtils'
import { createEvent } from 'Utils/mapUtils'
import {
    getUdgEscapers,
} from "../../../../globals";
import {GREY} from "../../01_libraries/Constants";
import {execute} from "../../04_STRUCTURES/Escaper/EscaperSavedCommands";


const initCommandShortcuts = () => {
    const shortcutCommands: { [K in typeof shortcuts[0]]: (string | null)[] } = {
        A: [],
        Z: [],
        E: [],
        R: [],
        Q: [],
        S: [],
        D: [],
        F: [],
    }

    const InitShortcutSkills = (playerId: number) => {
        const hero = getUdgEscapers().get(playerId)?.getHero()

        if (!hero) {
            return
        }

        shortcuts.forEach(sc => {
            if (shortcutCommands[sc][playerId] == null) {
                UnitRemoveAbility(hero, FourCC(`SC${sc}o`))
                UnitAddAbility(hero, FourCC(`SC${sc}u`))
            } else {
                UnitRemoveAbility(hero, FourCC(`SC${sc}u`))
                UnitAddAbility(hero, FourCC(`SC${sc}o`))
            }
        })
    }

    const AssignShortcut = (playerId: number, shortcut: string, command: string) => {
        const hero = getUdgEscapers().get(playerId)?.getHero()

        if (!hero) {
            return
        }

        shortcut = StringCase(shortcut, true)

        shortcuts.forEach(sc => {
            if (shortcut == sc) {
                if (shortcutCommands[sc][playerId] == null) {
                    UnitRemoveAbility(hero, FourCC(`SC${shortcut}u`))
                    UnitAddAbility(hero, FourCC(`SC${shortcut}o`))
                }
                shortcutCommands[sc][playerId] = '-' + command
                return
            }
        })
    }

    const UnassignShortcut = (playerId: number, shortcut: string) => {
        const hero = getUdgEscapers().get(playerId)?.getHero()

        if (!hero) {
            return
        }

        shortcut = StringCase(shortcut, true)

        shortcuts.forEach(sc => {
            if (shortcut == sc) {
                if (shortcutCommands[sc][playerId] != null) {
                    UnitRemoveAbility(hero, FourCC(`SC${shortcut}o`))
                    UnitAddAbility(hero, FourCC(`SC${shortcut}u`))
                    shortcutCommands[sc][playerId] = null
                }
                return
            }
        })
    }

    const IsShortcut = (S: string): boolean => {
        S = StringCase(S, true)

        return !!shortcuts.find(s => s === S)
    }

    const GetStringAssignedFromCommand = (command: string) => {
        let outputStr: string
        let spaceFound = false
        let cmdLength = StringLength(command)
        let charId = 3
        while (true) {
            if (charId >= cmdLength) break
            if (SubStringBJ(command, charId, charId) === ' ') {
                if (!spaceFound) {
                    spaceFound = true
                } else {
                    outputStr = SubStringBJ(command, charId + 1, cmdLength)
                    if (
                        SubStringBJ(outputStr, 1, 1) === '(' &&
                        SubStringBJ(outputStr, StringLength(outputStr), StringLength(outputStr)) === ')'
                    ) {
                        outputStr = SubStringBJ(outputStr, 2, StringLength(outputStr) - 1)
                    }
                    return outputStr
                }
            }
            charId = charId + 1
        }
        return null
    }

    const DisplayShortcuts = (playerId: number) => {
        Text.P(Player(playerId), ' ')
        Text.P(Player(playerId), udg_colorCode[playerId] + 'Your shortcuts:')

        shortcuts.forEach(sc => {
            if (shortcutCommands[sc][playerId] == null) {
                Text.P(Player(playerId), udg_colorCode[playerId] + '$shortcut$: |r' + udg_colorCode[GREY] + 'none')
            } else {
                Text.P(Player(playerId), udg_colorCode[playerId] + '$shortcut$: |r' + shortcutCommands[sc][playerId])
            }
        })
    }

    return {
        shortcutCommands,
        InitShortcutSkills,
        AssignShortcut,
        UnassignShortcut,
        IsShortcut,
        GetStringAssignedFromCommand,
        DisplayShortcuts,
    }
}

export const CommandShortcuts = initCommandShortcuts()



export const shortcuts = literalArray(['A', 'Z', 'E', 'R', 'Q', 'S', 'D', 'F'])

export const InitTrig_Using_shortcut = () => {
    createEvent({
        events: [t => TriggerRegisterAnyUnitEventBJ(t, EVENT_PLAYER_UNIT_SPELL_CAST)],
        conditions: [() => IsHero(GetTriggerUnit())],
        actions: [
            () => {
                const escaper = Hero2Escaper(GetTriggerUnit())

                if (!escaper) {
                    return
                }

                const p = escaper.getPlayer()

                if (!p) {
                    return
                }

                shortcuts.forEach(sc => {
                    if (GetSpellAbilityId() === FourCC(`SC${sc}o`)) {
                        Text.P(
                            p,
                            udg_colorCode[GetPlayerId(p)] +
                                GetPlayerName(p) +
                                ':|r ' +
                                CommandShortcuts.shortcutCommands[sc][GetPlayerId(p)]
                        )

                        const targetCmd = CommandShortcuts.shortcutCommands[sc][GetPlayerId(p)]

                        if (!targetCmd) {
                            return
                        }

                        execute(escaper, targetCmd, true)
                    }
                })
            },
        ],
    })
}
