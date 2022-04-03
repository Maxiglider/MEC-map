import { initOldTriggers } from 'core/09_From_old_Worldedit_triggers/init_old_triggers'
import { errorHandler } from 'Utils/mapUtils'
import { addScriptHook, W3TS_HOOK } from 'w3ts/hooks'
import {initEscapers} from "./core/08_GAME/Init_structures/Init_escapers";


const tsMain = () => {
    // call main game func
    initOldTriggers()

    //escapers
    initEscapers()
}

addScriptHook(W3TS_HOOK.MAIN_AFTER, errorHandler(tsMain))
