import { initOldTriggers } from 'core/Init/init_old_triggers'
import { errorHandler } from 'Utils/mapUtils'
import { addScriptHook, W3TS_HOOK } from 'w3ts/hooks'
import {initEscapers} from "./core/08_GAME/Init_structures/Init_escapers";
import {initializers} from "./core/Init/initializers";


const tsMain = () => {
    //initializers
    initializers()

    //triggers
    // initOldTriggers()

    //escapers
    // initEscapers()
}

addScriptHook(W3TS_HOOK.MAIN_AFTER, errorHandler(tsMain))
