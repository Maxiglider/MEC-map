//TESH.scrollpos=0
//TESH.alwaysfold=0
library MeteorFunctions needs Meteor


globals
    private item meteor
endglobals



function HeroAddCheatMeteor takes unit hero returns item
    set meteor = UnitAddItemById(hero, METEOR_CHEAT)
    if (udg_terrainTypes.getTerrainType(GetUnitX(hero), GetUnitY(hero)).getKind() == "slide") then
        call SetItemDroppable(meteor, false)
    endif
    return meteor
endfunction


function HeroComingToSlide_CheckItem takes unit hero returns nothing
    set meteor = UnitItemInSlot(hero, 0)
    if (meteor != null) then
        call SetItemDroppable(meteor, false)
    endif
endfunction


function HeroComingOutFromSlide_CheckItem takes unit hero returns nothing
    set meteor = UnitItemInSlot(hero, 0)
    if (meteor != null) then
        call SetItemDroppable(meteor, true)
    endif
endfunction


function ExecuteRightClicOnUnit takes unit hero, unit u returns nothing
    local item itemCarried = UnitItemInSlot(hero, 0)
    local integer itemCarriedType = GetItemTypeId(itemCarried)
    if ((itemCarriedType == METEOR_NORMAL or itemCarriedType == METEOR_CHEAT) and GetWidgetLife(u) > 0.) then
        call UnitUseItemTarget(hero, itemCarried, u)
    else
        call StopUnit(hero)
    endif 
    set itemCarried = null    
endfunction



endlibrary


