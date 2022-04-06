import { errorHandler } from 'Utils/mapUtils'
import { addScriptHook, W3TS_HOOK } from 'w3ts/hooks'
import { initializers } from './core/Init/initializers'

const tsMain = () => {
    //initializers
    initializers()

    //triggers
    // initOldTriggers()

    //escapers
    // initEscapers()
}

addScriptHook(W3TS_HOOK.MAIN_AFTER, errorHandler(tsMain))
