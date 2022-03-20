//TESH.scrollpos=0
//TESH.alwaysfold=0
library MClearMobDeleteActions needs TerrainTypeFunctions, Escaper



function ClearMobDelete_Actions takes nothing returns nothing
    local Escaper escaper = Hero2Escaper(GetTriggerUnit())
    local Make mkGeneral = escaper.getMake()
	local MakeDeleteClearMob mk = MakeDeleteClearMob(integer(mkGeneral))
    local real x = GetOrderPointX()
    local real y = GetOrderPointY()
    
    local MonsterNoMove Mnm
    local MonsterSimplePatrol Msp
	local MonsterMultiplePatrols Mmp
    local MonsterTeleport Mt
    local Caster caster
    local integer monsterOrCasterId
    
    if (not IsIssuedOrder("smart")) then   
        return
    endif
    call StopUnit(mk.maker)
	
    //recherche du monsterOrCaster cliqué
    set Mnm = escaper.getMakingLevel().monstersNoMove.getMonsterNear(x, y)
    if (Mnm != 0 and Mnm.u != null) then
        set monsterOrCasterId = Mnm.getId()
    else        
        set Msp = escaper.getMakingLevel().monstersSimplePatrol.getMonsterNear(x, y)
        if (Msp != 0 and Msp.u != null) then
            set monsterOrCasterId = Msp.getId()
        else        
            set Mmp = escaper.getMakingLevel().monstersMultiplePatrols.getMonsterNear(x, y)
            if (Mmp != 0 and Mmp.u != null) then
                set monsterOrCasterId = Mmp.getId()
            else
                set Mt = escaper.getMakingLevel().monstersTeleport.getMonsterNear(x, y)
                if (Mt != 0 and Mt.u != null) then
                    set monsterOrCasterId = Mt.getId()
                else
                    set caster = escaper.getMakingLevel().casters.getCasterNear(x, y)
                    if (caster != 0 and caster.casterUnit != null) then
                        set monsterOrCasterId = caster.getId()
                    else 
                        set monsterOrCasterId = 0
                    endif
                endif
            endif      
        endif
    endif
    
    //application du clic
    if (monsterOrCasterId == 0) then
        call Text_erP(mk.makerOwner, "no monster clicked for your making level")
    else
        call mk.clickMade(monsterOrCasterId)
    endif
endfunction



endlibrary

