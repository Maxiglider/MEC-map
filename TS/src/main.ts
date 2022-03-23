import { Ascii } from 'core/01_libraries/Ascii'
import { BasicFunctions } from 'core/01_libraries/Basic_functions'
import { DecodeString } from 'core/01_libraries/Decode_string'
import { FunctionsOnNumbers } from 'core/01_libraries/Functions_on_numbers'
import { ColorCodes } from 'core/01_libraries/Init_colorCodes'
import { Init_terrain_limit_variables } from 'core/01_libraries/Init_terrain_limit_variables'
import { Text } from 'core/01_libraries/Text'
import { ZLibrary } from 'core/02_bibliotheques_externes/ZLibrary'
import { ViewAllHideAll } from 'core/03_view_all_hide_all/View_all_hide_all'
import { Init_AfkMode } from 'core/08_GAME/Afk_mode/Afk_mode'
import { Apm } from 'core/08_GAME/Apm_clics_par_minute/Apm'
import { initOldTriggers } from 'core/09_From_old_Worldedit_triggers/init_old_triggers'
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

    // 8
    {
        Init_AfkMode() // TODO; Needs EscaperFunctions
        Apm() // TODO; Needs BasicFunctions
    }

    // 9
    {
        initOldTriggers()
    }
}

addScriptHook(W3TS_HOOK.MAIN_AFTER, errorHandler(tsMain))
