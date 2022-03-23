import { Ascii } from 'core/01_libraries/Ascii'
import { BasicFunctions } from 'core/01_libraries/Basic_functions'
import { DecodeString } from 'core/01_libraries/Decode_string'
import { FunctionsOnNumbers } from 'core/01_libraries/Functions_on_numbers'
import { ColorCodes } from 'core/01_libraries/Init_colorCodes'
import { Init_terrain_limit_variables } from 'core/01_libraries/Init_terrain_limit_variables'
import { Text } from 'core/01_libraries/Text'
import { ZLibrary } from 'core/02_bibliotheques_externes/ZLibrary'
import { ViewAllHideAll } from 'core/03_view_all_hide_all/View_all_hide_all'
import { errorHandler } from 'Utils/mapUtils'
import { addScriptHook, W3TS_HOOK } from 'w3ts/hooks'

const tsMain = () => {
    // call main game func

    // 1
    {
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

    // 2
    {
    }

    // 3
    {
        ViewAllHideAll()
    }
}

addScriptHook(W3TS_HOOK.MAIN_AFTER, errorHandler(tsMain))
