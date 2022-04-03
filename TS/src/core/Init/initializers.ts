import {init_StartAndEnd} from "../04_STRUCTURES/Level/StartAndEnd";
import {initViewAllHideAll} from "../03_view_all_hide_all/View_all_hide_all";
import {initNoSelectionCircle} from "../08_GAME/Init_game/No_selection_circle";

export const initializers = () => {
    init_StartAndEnd()
    initViewAllHideAll()
    initNoSelectionCircle()
}