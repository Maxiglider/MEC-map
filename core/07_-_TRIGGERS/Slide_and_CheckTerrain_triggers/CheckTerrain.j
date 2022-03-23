//TESH.scrollpos=74
//TESH.alwaysfold=0
library CheckTerrainTrigger needs BasicFunctions, MeteorFunctions


globals
    private constant real TOLERANCE_ANGLE_DIFF = 5
    private constant real TOLERANCE_RAYON_DIFF = 20
    private constant real INIT_RAYON_TOLERANCE = 20
endglobals


//! textmacro CheckTerrainActions_function takes n
function CheckTerrain_$n$_Actions takes nothing returns nothing
    local Escaper escaper = udg_escapers.get($n$)
    local real x = GetUnitX(escaper.getHero())
    local real y = GetUnitY(escaper.getHero())
	local TerrainType lastTerrainType = escaper.getLastTerrainType()
    local TerrainType currentTerrainType = udg_terrainTypes.getTerrainType(x, y)
    local effect an_effect
    
    local boolean touchedByDeathTerrain
    local real toleranceDist
    local real angle
    local real xTolerance
    local real yTolerance
    local TerrainType terrainTypeTolerance
    local boolean wasSliding
    local real oldSlideSpeed
    local real tempRayonTolerance
    
    local TerrainTypeSlide terrainTypeS
    local TerrainTypeDeath terrainTypeD
    local TerrainTypeWalk terrainTypeW
    
    call escaper.moveInvisUnit(x, y)
    
    if (IsOnGround(escaper.getHero())) then
        if (lastTerrainType == currentTerrainType and currentTerrainType.getKind() != "death") then
            return
        endif
        call escaper.setLastTerrainType(currentTerrainType)
        set wasSliding = escaper.isSliding()
        set oldSlideSpeed = escaper.getSlideSpeed()

        if (currentTerrainType.getKind() == "slide") then
            set terrainTypeS = TerrainTypeSlide(integer(currentTerrainType))
            call escaper.enableSlide(true)
            if (not wasSliding) then
                call HeroComingToSlide_CheckItem(escaper.getHero())
                call ClearLastClickSave($n$)
            endif
            if (not escaper.isAbsoluteSlideSpeed()) then
                call escaper.setSlideSpeed(terrainTypeS.getSlideSpeed())
                if (terrainTypeS.getSlideSpeed() < 0)  then
                    if (wasSliding) then
                        if (oldSlideSpeed >= 0) then
                            call escaper.reverse()
                        endif
                    else
                        call escaper.reverse()
                    endif
                else
                    if (wasSliding) then
                        if (oldSlideSpeed < 0) then
                            call escaper.reverse()
                        endif
                    endif                
                endif
            endif
        else
            if (currentTerrainType.getKind() == "death") then
                set terrainTypeD = TerrainTypeDeath(integer(currentTerrainType))
                set touchedByDeathTerrain = true
                set toleranceDist = terrainTypeD.getToleranceDist()
                if (toleranceDist != 0) then
                    set tempRayonTolerance = INIT_RAYON_TOLERANCE
                    loop
                        exitwhen (not touchedByDeathTerrain) or tempRayonTolerance > toleranceDist
                            set angle = 0
                            loop
                                exitwhen (not touchedByDeathTerrain) or angle >= 360
                                    set xTolerance = x + tempRayonTolerance * CosBJ(angle)
                                    set yTolerance = y + tempRayonTolerance * SinBJ(angle)
                                    set terrainTypeTolerance = udg_terrainTypes.getTerrainType(xTolerance, yTolerance)
                                    if (terrainTypeTolerance.getKind() != "death") then
                                        set touchedByDeathTerrain = false
                                    endif
                                set angle = angle + TOLERANCE_ANGLE_DIFF
                            endloop     
                        set tempRayonTolerance = tempRayonTolerance + TOLERANCE_RAYON_DIFF
                    endloop
                endif
                if (touchedByDeathTerrain) then
                    if (escaper.isGodModeOn()) then
                        set an_effect = AddSpecialEffect(GM_TOUCH_DEATH_TERRAIN_EFFECT_STR, x, y)
                        call DestroyEffect(an_effect)
                        set an_effect = null
                    else
                        set terrainTypeD = TerrainTypeDeath(integer(currentTerrainType))
                        call terrainTypeD.killEscaper(escaper)
                        call escaper.enableSlide(false)
                        //coop
                    endif
                else
                    if (terrainTypeTolerance.getKind() == "slide") then
                        set terrainTypeS = TerrainTypeSlide(integer(terrainTypeTolerance))
                        set oldSlideSpeed = escaper.getSlideSpeed()
                        call escaper.enableSlide(true)
                        call escaper.setSlideSpeed(terrainTypeS.getSlideSpeed())
                        if (not wasSliding) then
                            call HeroComingToSlide_CheckItem(escaper.getHero())
                            call ClearLastClickSave($n$)
                        endif
                        if (not escaper.isAbsoluteSlideSpeed()) then
                            call escaper.setSlideSpeed(terrainTypeS.getSlideSpeed())
                            if (terrainTypeS.getSlideSpeed() < 0)  then
                                if (wasSliding) then
                                    if (oldSlideSpeed >= 0) then
                                        call escaper.reverse()
                                    endif
                                else
                                    call escaper.reverse()
                                endif
                            else
                                if (wasSliding) then
                                    if (oldSlideSpeed < 0) then
                                        call escaper.reverse()
                                    endif
                                endif                
                            endif
                        endif
                    else //terrain tolerance : walk ou rien du tout
                        call escaper.enableSlide(false)
                        if (wasSliding) then
                            call HeroComingOutFromSlide_CheckItem(escaper.getHero())
                            if (oldSlideSpeed < 0) then
                                call escaper.reverse()
                            endif
                            if (udg_autoContinueAfterSliding[$n$] and oldSlideSpeed >= 0) then
                                call AutoContinueAfterSliding($n$)
                            endif
                        endif
                        if (terrainTypeTolerance.getKind() == "walk") then
                            if (not escaper.isAbsoluteWalkSpeed()) then
                                set terrainTypeW = TerrainTypeWalk(integer(terrainTypeTolerance))
                                call escaper.setWalkSpeed(terrainTypeW.getWalkSpeed())
                            endif
                        endif
                    endif
                endif
            else // walk ou rien du tout (pseudo walk)
                call escaper.enableSlide(false)
                if (lastTerrainType.getKind() == "slide") then
                    call HeroComingOutFromSlide_CheckItem(escaper.getHero())
                    if (oldSlideSpeed < 0) then
                        call escaper.reverse()
                    endif
                    if (udg_autoContinueAfterSliding[$n$] and oldSlideSpeed >= 0) then
                        call AutoContinueAfterSliding($n$)
                    endif
                endif
                if (currentTerrainType.getKind() == "walk") then
                    if (not escaper.isAbsoluteWalkSpeed()) then
                        set terrainTypeW = TerrainTypeWalk(integer(currentTerrainType))
                        call escaper.setWalkSpeed(terrainTypeW.getWalkSpeed())
                    endif
                endif
            endif
        endif
    endif
endfunction
//! endtextmacro

//! runtextmacro CheckTerrainActions_function("0")
//! runtextmacro CheckTerrainActions_function("1")
//! runtextmacro CheckTerrainActions_function("2")
//! runtextmacro CheckTerrainActions_function("3")
//! runtextmacro CheckTerrainActions_function("4")
//! runtextmacro CheckTerrainActions_function("5")
//! runtextmacro CheckTerrainActions_function("6")
//! runtextmacro CheckTerrainActions_function("7")
//! runtextmacro CheckTerrainActions_function("8")
//! runtextmacro CheckTerrainActions_function("9")
//! runtextmacro CheckTerrainActions_function("10")
//! runtextmacro CheckTerrainActions_function("11")
//! runtextmacro CheckTerrainActions_function("12")
//! runtextmacro CheckTerrainActions_function("13")
//! runtextmacro CheckTerrainActions_function("14")
//! runtextmacro CheckTerrainActions_function("15")
//! runtextmacro CheckTerrainActions_function("16")
//! runtextmacro CheckTerrainActions_function("17")
//! runtextmacro CheckTerrainActions_function("18")
//! runtextmacro CheckTerrainActions_function("19")
//! runtextmacro CheckTerrainActions_function("20")
//! runtextmacro CheckTerrainActions_function("21")
//! runtextmacro CheckTerrainActions_function("22")
//! runtextmacro CheckTerrainActions_function("23")


//! textmacro CheckTerrainActions_get takes n
	if (n == $n$) then
		return function CheckTerrain_$n$_Actions
	endif
//! endtextmacro

function GetCheckTerrainActions takes integer n returns code
	//! runtextmacro CheckTerrainActions_get("0")
	//! runtextmacro CheckTerrainActions_get("1")
	//! runtextmacro CheckTerrainActions_get("2")
	//! runtextmacro CheckTerrainActions_get("3")
	//! runtextmacro CheckTerrainActions_get("4")
	//! runtextmacro CheckTerrainActions_get("5")
	//! runtextmacro CheckTerrainActions_get("6")
	//! runtextmacro CheckTerrainActions_get("7")
	//! runtextmacro CheckTerrainActions_get("8")
	//! runtextmacro CheckTerrainActions_get("9")
	//! runtextmacro CheckTerrainActions_get("10")
	//! runtextmacro CheckTerrainActions_get("11")
	//! runtextmacro CheckTerrainActions_get("12")
	//! runtextmacro CheckTerrainActions_get("13")
	//! runtextmacro CheckTerrainActions_get("14")
	//! runtextmacro CheckTerrainActions_get("15")
	//! runtextmacro CheckTerrainActions_get("16")
	//! runtextmacro CheckTerrainActions_get("17")
	//! runtextmacro CheckTerrainActions_get("18")
	//! runtextmacro CheckTerrainActions_get("19")
	//! runtextmacro CheckTerrainActions_get("20")
	//! runtextmacro CheckTerrainActions_get("21")
	//! runtextmacro CheckTerrainActions_get("22")
	//! runtextmacro CheckTerrainActions_get("23")

	return null
endfunction
		
        
function CreateCheckTerrainTrigger takes integer playerId returns trigger
    local trigger checkTerrainTrigger = CreateTrigger()
    call DisableTrigger(checkTerrainTrigger)
    call TriggerAddAction(checkTerrainTrigger, GetCheckTerrainActions(playerId))
    call TriggerRegisterTimerEventPeriodic(checkTerrainTrigger, CHECK_TERRAIN_PERIOD)
    return checkTerrainTrigger
endfunction



endlibrary