//TESH.scrollpos=0
//TESH.alwaysfold=0
library SlideTrigger


//! textmacro SlideActions_function takes n
function Slide_$n$_Actions takes nothing returns nothing
    local Escaper escaper = udg_escapers.get($n$)
	
    local real angle = Deg2Rad(GetUnitFacing(escaper.getHero()))
    
    local location heroPos = GetUnitLoc(escaper.getHero())
	
	local real newX = GetLocationX(heroPos) + escaper.getSlideSpeed() * Cos(angle)
	local real newY = GetLocationY(heroPos) + escaper.getSlideSpeed() * Sin(angle)
    
    local real z = GetLocationZ(heroPos)
    local real diffZ = z - escaper.getLastZ() //différence de hauteur au niveau du terrain
    local real height = GetUnitFlyHeight(escaper.getHero())
    local real delta
    
    if (newX >= MAP_MIN_X and newX <= MAP_MAX_X and newY >= MAP_MIN_Y and newY <= MAP_MAX_Y) then
        call escaper.moveHero(newX, newY)
    endif
    set timeOnSlide[$n$] = timeOnSlide[$n$] + SLIDE_PERIOD
    
    
    //gestion de la hauteur du héros
    if (height > 1) then
        call escaper.setSpeedZ(escaper.getSpeedZ() + GetGravity())
        set height = height + escaper.getSpeedZ() - diffZ
        if (height < 0) then
            set height = 0
        endif
        call SetUnitFlyHeight(escaper.getHero(), height, 0)
        //coop
        call escaper.refreshCerclePosition()
    else
        set delta = diffZ - escaper.getOldDiffZ()
        if (delta < GetGravity()) then
            call escaper.setSpeedZ(escaper.getOldDiffZ() + GetGravity())
            call SetUnitFlyHeight(escaper.getHero(), -diffZ + escaper.getSpeedZ(), 0)
            //arrêter de tourner si un clic a été fait juste avant
            if (not CAN_TURN_IN_AIR) then
                call SetUnitFacing(escaper.getHero(), GetUnitFacing(escaper.getHero()))
            endif
        elseif (not escaper.isAlive()) then //le héros mort touche le sol, on désactive le slide
            call escaper.enableSlide(false)
        endif
    endif
   
    call escaper.setLastZ(z)
    call escaper.setOldDiffZ(diffZ)

    call RemoveLocation(heroPos)
    set heroPos = null
endfunction
//! endtextmacro

//! runtextmacro SlideActions_function("0")
//! runtextmacro SlideActions_function("1")
//! runtextmacro SlideActions_function("2")
//! runtextmacro SlideActions_function("3")
//! runtextmacro SlideActions_function("4")
//! runtextmacro SlideActions_function("5")
//! runtextmacro SlideActions_function("6")
//! runtextmacro SlideActions_function("7")
//! runtextmacro SlideActions_function("8")
//! runtextmacro SlideActions_function("9")
//! runtextmacro SlideActions_function("10")
//! runtextmacro SlideActions_function("11")
//! runtextmacro SlideActions_function("12")
//! runtextmacro SlideActions_function("13")
//! runtextmacro SlideActions_function("14")
//! runtextmacro SlideActions_function("15")
//! runtextmacro SlideActions_function("16")
//! runtextmacro SlideActions_function("17")
//! runtextmacro SlideActions_function("18")
//! runtextmacro SlideActions_function("19")
//! runtextmacro SlideActions_function("20")
//! runtextmacro SlideActions_function("21")
//! runtextmacro SlideActions_function("22")
//! runtextmacro SlideActions_function("23")


//! textmacro SlideActions_get takes n
	if (n == $n$) then
		return function Slide_$n$_Actions
	endif
//! endtextmacro

function GetSlideActions takes integer n returns code
	//! runtextmacro SlideActions_get("0")
	//! runtextmacro SlideActions_get("1")
	//! runtextmacro SlideActions_get("2")
	//! runtextmacro SlideActions_get("3")
	//! runtextmacro SlideActions_get("4")
	//! runtextmacro SlideActions_get("5")
	//! runtextmacro SlideActions_get("6")
	//! runtextmacro SlideActions_get("7")
	//! runtextmacro SlideActions_get("8")
	//! runtextmacro SlideActions_get("9")
	//! runtextmacro SlideActions_get("10")
	//! runtextmacro SlideActions_get("11")
	//! runtextmacro SlideActions_get("12")
	//! runtextmacro SlideActions_get("13")
	//! runtextmacro SlideActions_get("14")
	//! runtextmacro SlideActions_get("15")
	//! runtextmacro SlideActions_get("16")
	//! runtextmacro SlideActions_get("17")
	//! runtextmacro SlideActions_get("18")
	//! runtextmacro SlideActions_get("19")
	//! runtextmacro SlideActions_get("20")
	//! runtextmacro SlideActions_get("21")
	//! runtextmacro SlideActions_get("22")
	//! runtextmacro SlideActions_get("23")

	return null
endfunction


function CreateSlideTrigger takes integer playerId returns trigger
    local trigger slideTrigger = CreateTrigger()
    call DisableTrigger(slideTrigger)
    call TriggerAddAction(slideTrigger, GetSlideActions(playerId))
    call TriggerRegisterTimerEventPeriodic(slideTrigger, SLIDE_PERIOD)
    return slideTrigger
endfunction


endlibrary

