import { Ascii } from 'core/01 - libraries/Ascii'
import { BasicFunctions } from 'core/01 - libraries/Basic functions'
import { DecodeString } from 'core/01 - libraries/Decode string'
import { FunctionsOnNumbers } from 'core/01 - libraries/Functions on numbers'
import { ColorCodes } from 'core/01 - libraries/Init colorCodes'
import { Init_terrain_limit_variables } from 'core/01 - libraries/Init terrain limit variables'
import { Text } from 'core/01 - libraries/Text'
import { ZLibrary } from 'core/01 - libraries/ZLibrary'
import { errorHandler } from 'Utils/mapUtils'
import { addScriptHook, W3TS_HOOK } from 'w3ts/hooks'

const tsMain = () => {
    // call main game func

    // Order matters, text is required by most
    Text()
    Ascii()
    BasicFunctions()
    // Constants()
    DecodeString()
    FunctionsOnNumbers()
    ColorCodes()
    Init_terrain_limit_variables()
    ZLibrary()
}

addScriptHook(W3TS_HOOK.MAIN_AFTER, errorHandler(tsMain))
