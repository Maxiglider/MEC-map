import { init_Test } from '../../../../core/Test/test'
import { init_terrain_limit_variables } from '../01_libraries/Init_terrain_limit_variables'
import { initViewAllHideAll } from '../03_view_all_hide_all/View_all_hide_all'
import { init_StartAndEnd } from '../04_STRUCTURES/Level/StartAndEnd'
import { initGameTime } from '../04_STRUCTURES/Lives_and_game_time/Time_of_game_trigger'
import { init_commandExecution } from '../06_COMMANDS/COMMANDS_vJass/Command_execution'
import { initCachedPlayerNames } from '../06_COMMANDS/COMMANDS_vJass/Command_functions'
import { init_StopSecondIfMake } from '../07_TRIGGERS/Handling_secondary_hero/Stop_second_if_make'
import { init_TerrainTypeNamesAndData } from '../07_TRIGGERS/Modify_terrain_Functions/Terrain_type_names_and_data'
import { init_ToTurnOnSlide } from '../07_TRIGGERS/Slide_and_CheckTerrain_triggers/To_turn_on_slide'
import { init_Apm } from '../08_GAME/Apm_clics_par_minute/Apm'
import { init_Heroes } from '../08_GAME/Init_game/Heroes'
import { initNoSelectionCircle } from '../08_GAME/Init_game/No_selection_circle'
import { initArrays } from './initArrays'
import { initOldTriggers } from './init_old_triggers'
import {init_doubleKill} from "../Double_heroes/double_kill";

export const initializers = () => {
    init_terrain_limit_variables()
    initArrays()
    init_StartAndEnd()
    initViewAllHideAll()
    initNoSelectionCircle()
    init_Apm()
    init_Heroes()
    initGameTime()
    initOldTriggers()
    init_commandExecution()
    init_TerrainTypeNamesAndData()
    init_ToTurnOnSlide()
    init_StopSecondIfMake()
    initCachedPlayerNames()
    init_doubleKill()

    //todomax disable this line at end
    init_Test()
}
