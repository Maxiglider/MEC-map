import { initOldTriggers } from 'core/09_From_old_Worldedit_triggers/init_old_triggers'
import { errorHandler } from 'Utils/mapUtils'
import { addScriptHook, W3TS_HOOK } from 'w3ts/hooks'

const tsMain = () => {
    // call main game func

    initOldTriggers()
}

addScriptHook(W3TS_HOOK.MAIN_AFTER, errorHandler(tsMain))
