import {init_StartAndEnd} from "../04_STRUCTURES/Level/StartAndEnd";
import {initViewAllHideAll} from "../03_view_all_hide_all/View_all_hide_all";
import {initNoSelectionCircle} from "../08_GAME/Init_game/No_selection_circle";
import {initArrays} from "./initArrays";
import {Init_Heroes} from "../08_GAME/Init_game/Heroes";
import {initGameTime} from "../04_STRUCTURES/Lives_and_game_time/Time_of_game_trigger";
import {initOldTriggers} from "./init_old_triggers";
import {init_commandExecution} from "../06_COMMANDS/COMMANDS_vJass/Command_execution";
import {makingRightsToAll} from "../06_COMMANDS/Rights/manage_rights";
import {init_TerrainTypeNamesAndData} from "../07_TRIGGERS/Modify_terrain_Functions/Terrain_type_names_and_data";
import {init_ToTurnOnSlide} from "../07_TRIGGERS/Slide_and_CheckTerrain_triggers/To_turn_on_slide";

export const initializers = () => {
    initArrays()
    init_StartAndEnd()
    initViewAllHideAll()
    initNoSelectionCircle()
    Init_Heroes()
    initGameTime()
    initOldTriggers()
    init_commandExecution()
    init_TerrainTypeNamesAndData()
    init_ToTurnOnSlide()

    //todomax disable this line at end
    makingRightsToAll()
}