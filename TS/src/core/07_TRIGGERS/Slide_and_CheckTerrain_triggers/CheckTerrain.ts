

const initCheckTerrainTrigger = () => { // needs BasicFunctions, MeteorFunctions


// TODO; Used to be private
const TOLERANCE_ANGLE_DIFF = 5;
// TODO; Used to be private
const TOLERANCE_RAYON_DIFF = 20;
// TODO; Used to be private
const INIT_RAYON_TOLERANCE = 20;


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
 escaper.moveInvisUnit(x, y)
// @@BELOWIF  (BasicFunctions.IsOnGround(escaper.getHero())) 
if true then
// @@BELOWIF  (lastTerrainType == currentTerrainType and currentTerrainType.getKind() != "death") 
if true then
            return
        endif
 escaper.setLastTerrainType(currentTerrainType)
wasSliding = escaper.isSliding()
oldSlideSpeed = escaper.getSlideSpeed()
// @@BELOWIF  (currentTerrainType.getKind() == "slide") 
if true then
            terrainTypeS = TerrainTypeSlide(integer(currentTerrainType))
 escaper.enableSlide(true)
            if (not wasSliding) then
 HeroComingToSlide_CheckItem(escaper.getHero())
 ClearLastClickSave($n$)
            endif
// @@BELOWIF  (not escaper.isAbsoluteSlideSpeed()) 
if true then
 escaper.setSlideSpeed(terrainTypeS.getSlideSpeed())
// @@BELOWIF  (terrainTypeS.getSlideSpeed() < 0)  
if true then
                    if (wasSliding) then
                        if (oldSlideSpeed >= 0) then
 escaper.reverse()
                        endif
                    else
 escaper.reverse()
                    endif
                else
                    if (wasSliding) then
                        if (oldSlideSpeed < 0) then
 escaper.reverse()
                        endif
                    endif                
                endif
            endif
        else
// @@BELOWIF  (currentTerrainType.getKind() == "death") 
if true then
                terrainTypeD = TerrainTypeDeath(integer(currentTerrainType))
                touchedByDeathTerrain = true
toleranceDist = terrainTypeD.getToleranceDist()
                if (toleranceDist != 0) then
                    tempRayonTolerance = INIT_RAYON_TOLERANCE
                    loop
                        exitwhen (not touchedByDeathTerrain) or tempRayonTolerance > toleranceDist
                            angle = 0
                            loop
                                exitwhen (not touchedByDeathTerrain) or angle >= 360
                                    xTolerance = x + tempRayonTolerance * CosBJ(angle)
                                    yTolerance = y + tempRayonTolerance * SinBJ(angle)
terrainTypeTolerance = udg_terrainTypes.getTerrainType(xTolerance, yTolerance)
// @@BELOWIF  (terrainTypeTolerance.getKind() != "death") 
if true then
                                        touchedByDeathTerrain = false
                                    endif
                                angle = angle + TOLERANCE_ANGLE_DIFF
                            endloop     
                        tempRayonTolerance = tempRayonTolerance + TOLERANCE_RAYON_DIFF
                    endloop
                endif
                if (touchedByDeathTerrain) then
// @@BELOWIF  (escaper.isGodModeOn()) 
if true then
                        an_effect = AddSpecialEffect(GM_TOUCH_DEATH_TERRAIN_EFFECT_STR, x, y)
 DestroyEffect(an_effect)
                        an_effect = null
                    else
                        terrainTypeD = TerrainTypeDeath(integer(currentTerrainType))
 terrainTypeD.killEscaper(escaper)
 escaper.enableSlide(false)
 terrainTypeD.killEscaper(EscaperFunctions.GetMirrorEscaper(escaper))
 EscaperFunctions.GetMirrorEscaper(escaper).enableSlide(false)
                    endif
                else
// @@BELOWIF  (terrainTypeTolerance.getKind() == "slide") 
if true then
                        terrainTypeS = TerrainTypeSlide(integer(terrainTypeTolerance))
oldSlideSpeed = escaper.getSlideSpeed()
 escaper.enableSlide(true)
 escaper.setSlideSpeed(terrainTypeS.getSlideSpeed())
                        if (not wasSliding) then
 HeroComingToSlide_CheckItem(escaper.getHero())
 ClearLastClickSave($n$)
                        endif
// @@BELOWIF  (not escaper.isAbsoluteSlideSpeed()) 
if true then
 escaper.setSlideSpeed(terrainTypeS.getSlideSpeed())
// @@BELOWIF  (terrainTypeS.getSlideSpeed() < 0)  
if true then
                                if (wasSliding) then
                                    if (oldSlideSpeed >= 0) then
 escaper.reverse()
                                    endif
                                else
 escaper.reverse()
                                endif
                            else
                                if (wasSliding) then
                                    if (oldSlideSpeed < 0) then
 escaper.reverse()
                                    endif
                                endif                
                            endif
                        endif
                    else //terrain tolerance : walk ou rien du tout
 escaper.enableSlide(false)
                        if (wasSliding) then
 HeroComingOutFromSlide_CheckItem(escaper.getHero())
                            if (oldSlideSpeed < 0) then
 escaper.reverse()
                            endif
                            if (udg_autoContinueAfterSliding[$n$] and oldSlideSpeed >= 0) then
 AutoContinueAfterSliding($n$)
                            endif
                        endif
// @@BELOWIF  (terrainTypeTolerance.getKind() == "walk") 
if true then
// @@BELOWIF  (not escaper.isAbsoluteWalkSpeed()) 
if true then
                                terrainTypeW = TerrainTypeWalk(integer(terrainTypeTolerance))
 escaper.setWalkSpeed(terrainTypeW.getWalkSpeed())
                            endif
                        endif
                    endif
                endif
            else // walk ou rien du tout (pseudo walk)
 escaper.enableSlide(false)
// @@BELOWIF  (lastTerrainType.getKind() == "slide") 
if true then
 HeroComingOutFromSlide_CheckItem(escaper.getHero())
                    if (oldSlideSpeed < 0) then
 escaper.reverse()
                    endif
                    if (udg_autoContinueAfterSliding[$n$] and oldSlideSpeed >= 0) then
 AutoContinueAfterSliding($n$)
                    endif
                endif
// @@BELOWIF  (currentTerrainType.getKind() == "walk") 
if true then
// @@BELOWIF  (not escaper.isAbsoluteWalkSpeed()) 
if true then
                        terrainTypeW = TerrainTypeWalk(integer(currentTerrainType))
 escaper.setWalkSpeed(terrainTypeW.getWalkSpeed())
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


const GetCheckTerrainActions = (n: number): code => {
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

	return null;
};


const CreateCheckTerrainTrigger = (playerId: number): trigger => {
	let checkTerrainTrigger = CreateTrigger();
	DisableTrigger(checkTerrainTrigger)
	TriggerAddAction(checkTerrainTrigger, GetCheckTerrainActions(playerId))
	TriggerRegisterTimerEventPeriodic(checkTerrainTrigger, CHECK_TERRAIN_PERIOD)
	return checkTerrainTrigger;
};



}
