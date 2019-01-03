//TESH.scrollpos=108
//TESH.alwaysfold=0
library TurnOnSlide initializer Init_ToTurnOnSlide needs Escaper, Apm



globals
//turn variables
    private Escaper escaper
    private unit slider
    private integer n
    private real sliderX
    private real sliderY
    private widget orderWidget
    private real orderX
    private real orderY
    private real angle
    private boolean canTurn
    
//drunk variables
    boolean array udg_isDrunk
    real array udg_drunk
    integer array udg_drunkLevel
    constant real INITIAL_DRUNK = 10.
    effect array udg_drunkEffect
    string array DRUNK_EFFECTS
    constant string DRUNK_EFFECT_PETIT = "Abilities\\Weapons\\BloodElfMissile\\BloodElfMissile.mdl"
    constant string DRUNK_EFFECT_MOYEN = "Abilities\\Weapons\\ChimaeraAcidMissile\\ChimaeraAcidMissile.mdl"
    constant string DRUNK_EFFECT_GROS = "Abilities\\Weapons\\GreenDragonMissile\\GreenDragonMissile.mdl"

//trigger
    trigger trg_turnToPoint
    trigger trg_turnToWidget
endglobals





function Trig_to_turn_to_point_Conditions takes nothing returns boolean
    set escaper = Hero2Escaper(GetTriggerUnit())
    return (IsHero(GetTriggerUnit()) and escaper.isSliding() and not IsLastOrderPause())
endfunction


function Trig_to_turn_to_point_Actions takes nothing returns nothing
//init variables
    set slider = GetTriggerUnit()
    set n = GetUnitUserData(slider)
    set sliderX = GetUnitX(slider)
    set sliderY = GetUnitY(slider)
    set orderX = GetOrderPointX()
    set orderY = GetOrderPointY()
    
//stop hero
    call StopUnit(slider)
    
    if (not IsOnGround(slider)) then
        return
    endif
    
//set angle
    //if (udg_isMirrorModeOn_j[n]) then
    //    set angle = Atan2( sliderY - orderY, sliderX - orderX) * bj_RADTODEG
    //else
      set angle = Atan2(orderY - sliderY, orderX - sliderX) * bj_RADTODEG
    //endif
    
//drunk mode
    if (udg_isDrunk[n]) then
        if (GetRandomInt(1,2) == 1) then
            set angle = angle + udg_drunk[n]
        else
            set angle = angle - udg_drunk[n]
        endif
    endif
    
//turn hero
    set canTurn = true
    if (escaper.getLastTerrainType().kind == "slide") then
        set canTurn = TerrainTypeSlide(integer(escaper.getLastTerrainType())).getCanTurn()
    endif
    if (canTurn) then
        call SetUnitFacing(slider, angle)
        call escaper.setSlideLastAngleOrder(angle)
    endif
        
//save click
    set lastClickedX[n] = orderX
    set lastClickedY[n] = orderY
    set isLastTargetALocation[n] = true
    
    set nbClicsOnSlide[n] = nbClicsOnSlide[n] + 1
endfunction



function Trig_to_turn_to_widget_Conditions takes nothing returns boolean
    set escaper = Hero2Escaper(GetTriggerUnit())
    return (IsHero(GetTriggerUnit()) and escaper.isSliding())
endfunction


function Trig_to_turn_to_widget_Actions takes nothing returns nothing
//init variables
    set slider = GetTriggerUnit()
    set n = GetUnitUserData(slider)
    set sliderX = GetUnitX(slider)
    set sliderY = GetUnitY(slider)
    set orderWidget = GetOrderTarget()
    set orderX = GetWidgetX(orderWidget)
    set orderY = GetWidgetY(orderWidget)
    
//stop hero
    call StopUnit(slider)
    
    if (not IsOnGround(slider)) then
        return
    endif
    
//set angle
    //if (udg_isMirrorModeOn_j[n]) then
    //    set angle = Atan2( sliderY - orderY, sliderX - orderX) * bj_RADTODEG
    //else
    set angle = Atan2( orderY - sliderY, orderX - sliderX) * bj_RADTODEG
    //endif

//drunk mode
    if (udg_isDrunk[n]) then
        if (GetRandomInt(1,2) == 1) then
            set angle = angle + udg_drunk[n]
        else
            set angle = angle - udg_drunk[n]
        endif
    endif
    
//turn hero
    set canTurn = true
    if (escaper.getLastTerrainType().kind == "slide") then
        set canTurn = TerrainTypeSlide(integer(escaper.getLastTerrainType())).getCanTurn()
    endif
    if (canTurn) then
        call SetUnitFacing(slider, angle)
        call escaper.setSlideLastAngleOrder(angle)
    endif
    
//save click
    set lastClickedWidgets[n] = orderWidget
    set lastClickedX[n] = orderX
    set lastClickedY[n] = orderY
    set isLastTargetALocation[n] = false
    
    set nbClicsOnSlide[n] = nbClicsOnSlide[n] + 1
endfunction



//===========================================================================
function Init_ToTurnOnSlide takes nothing returns nothing
    local integer i
    //turn to point
    set trg_turnToPoint = CreateTrigger()
    call TriggerRegisterAnyUnitEventBJ(trg_turnToPoint, EVENT_PLAYER_UNIT_ISSUED_POINT_ORDER)
    call TriggerAddCondition(trg_turnToPoint, Condition( function Trig_to_turn_to_point_Conditions))
    call TriggerAddAction(trg_turnToPoint, function Trig_to_turn_to_point_Actions)
    //turn to widget
    set trg_turnToWidget = CreateTrigger(  )
    call TriggerRegisterAnyUnitEventBJ( trg_turnToWidget, EVENT_PLAYER_UNIT_ISSUED_TARGET_ORDER )
    call TriggerAddCondition( trg_turnToWidget, Condition( function Trig_to_turn_to_widget_Conditions ) )
    call TriggerAddAction( trg_turnToWidget, function Trig_to_turn_to_widget_Actions )
    //drunk mode
    set i = 0
    loop
        exitwhen (i > 11)
            set udg_drunk[i] = INITIAL_DRUNK
        set i = i + 1
    endloop
    set DRUNK_EFFECTS[1] = DRUNK_EFFECT_PETIT
    set DRUNK_EFFECTS[2] = DRUNK_EFFECT_MOYEN
    set DRUNK_EFFECTS[3] = DRUNK_EFFECT_GROS
endfunction



endlibrary
