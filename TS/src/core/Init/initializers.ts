import { init_Test } from '../../../../core/Test/test'
import { init_terrain_limit_variables } from '../01_libraries/Init_terrain_limit_variables'
import { initViewAllHideAll } from '../03_view_all_hide_all/View_all_hide_all'
import { init_StartAndEnd } from '../04_STRUCTURES/Level/StartAndEnd'
import { initGameTime } from '../04_STRUCTURES/Lives_and_game_time/Time_of_game_trigger'
import { init_TrigMonstersClickableSetLife } from '../04_STRUCTURES/Monster/trig_Monsters_clickable_set_life'
import { initTrig_Autorevive } from '../06_COMMANDS/COMMANDS_vJass/Autorevive'
import { init_commandExecution } from '../06_COMMANDS/COMMANDS_vJass/Command_execution'
import { initCachedPlayerNames } from '../06_COMMANDS/COMMANDS_vJass/Command_functions'
import { init_StopSecondIfMake } from '../07_TRIGGERS/Handling_secondary_hero/Stop_second_if_make'
import { init_TerrainTypeNamesAndData } from '../07_TRIGGERS/Modify_terrain_Functions/Terrain_type_names_and_data'
import { init_ToTurnOnSlide } from '../07_TRIGGERS/Slide_and_CheckTerrain_triggers/To_turn_on_slide'
import { ReinitTerrains } from '../07_TRIGGERS/Triggers_to_modify_terrains/Reinit_terrains'
import { ReinitTerrainsPositions } from '../07_TRIGGERS/Triggers_to_modify_terrains/Reinit_terrains_position_Change_variations_and_ut_at_beginning'
import { init_Apm } from '../08_GAME/Apm_clics_par_minute/Apm'
import { init_Trig_Allways_day } from '../08_GAME/Init_game/Allways_day'
import { init_Heroes } from '../08_GAME/Init_game/Heroes'
import { initNoSelectionCircle } from '../08_GAME/Init_game/No_selection_circle'
import { initSelectUnit } from '../08_GAME/select_unit'
import { init_doubleKill } from '../Double_heroes/double_kill'
import { initArrays } from './initArrays'
import { initOldTriggers } from './init_old_triggers'

export const initializers = () => {
    init_terrain_limit_variables()
    initArrays()
    init_StartAndEnd()
    initViewAllHideAll()
    initNoSelectionCircle()
    init_Apm()
    init_Heroes()
    initSelectUnit()
    initGameTime()
    initOldTriggers()
    init_commandExecution()
    init_TerrainTypeNamesAndData()
    init_ToTurnOnSlide()
    init_StopSecondIfMake()
    initCachedPlayerNames()
    init_doubleKill()
    initTrig_Autorevive()
    init_TrigMonstersClickableSetLife()
    init_Trig_Allways_day()

    //todomax disable this line at end
    init_Test()

    ReinitTerrains.init_ReinitAtStart()
    ReinitTerrainsPositions.init_reinitTerrainsPositions()
}
