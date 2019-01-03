//TESH.scrollpos=0
//TESH.alwaysfold=0
library ViewAllHideAll initializer Init_ViewAllHideAll


globals
    fogmodifier udg_hideAll
    fogmodifier udg_viewAll
endglobals


function RefreshHideAllVM takes nothing returns nothing
    call DestroyFogModifier(udg_hideAll)
    set udg_hideAll = CreateFogModifierRect(Player(0), FOG_OF_WAR_MASKED, GetWorldBounds(), true, false )
    call FogModifierStart(udg_hideAll)
endfunction


function Init_ViewAllHideAll takes nothing returns nothing
    set udg_viewAll = CreateFogModifierRect(Player(0), FOG_OF_WAR_VISIBLE, GetPlayableMapRect(), true, false )
    set udg_hideAll = CreateFogModifierRect(Player(0), FOG_OF_WAR_MASKED, GetWorldBounds(), true, false )
    call FogModifierStart(udg_hideAll)
endfunction


endlibrary