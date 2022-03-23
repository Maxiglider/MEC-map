import { errorHandler } from 'Utils/mapUtils'
import { addScriptHook, W3TS_HOOK } from 'w3ts/hooks'

const tsMain = () => {
    // call main game func
}

addScriptHook(W3TS_HOOK.MAIN_AFTER, errorHandler(tsMain))
