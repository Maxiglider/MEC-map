import {createTimer} from "../../../Utils/mapUtils";
import {getUdgLevels} from "../../../../globals";

export const init_startFirstLevel = () => {
    createTimer(0, false, () => {
        getUdgLevels().get(0).activate(true)
    })
}