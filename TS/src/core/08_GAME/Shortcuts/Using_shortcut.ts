import { ColorCodes } from 'core/01_libraries/Init_colorCodes'
import { Text } from 'core/01_libraries/Text'
import { EscaperFunctions } from 'core/04_STRUCTURES/Escaper/Escaper_functions'
import { CommandExecution } from 'core/06_COMMANDS/COMMANDS_vJass/Command_execution'
import { literalArray } from 'Utils/ArrayUtils'
import { createEvent } from 'Utils/mapUtils'
import { CommandShortcuts } from './Command_shortcuts_functions'

export const shortcuts = literalArray(['A', 'Z', 'E', 'R', 'Q', 'S', 'D', 'F'])

export const InitTrig_Using_shortcut = () => {
    createEvent({
        events: [t => TriggerRegisterAnyUnitEventBJ(t, EVENT_PLAYER_UNIT_SPELL_CAST)],
        conditions: [() => EscaperFunctions.IsHero(GetTriggerUnit())],
        actions: [
            () => {
                const escaper = EscaperFunctions.Hero2Escaper(GetTriggerUnit())
                const p = escaper.getPlayer()

                shortcuts.forEach(sc => {
                    if (GetSpellAbilityId() === FourCC(`SC${sc}o`)) {
                        Text.P(
                            p,
                            ColorCodes.udg_colorCode[GetPlayerId(p)] +
                                GetPlayerName(p) +
                                ':|r ' +
                                CommandShortcuts.shortcutCommands[sc][GetPlayerId(p)]
                        )

                        const targetCmd = CommandShortcuts.shortcutCommands[sc][GetPlayerId(p)]

                        if (!targetCmd) {
                            return
                        }

                        CommandExecution.ExecuteCommand(escaper, targetCmd)
                    }
                })
            },
        ],
    })
}
