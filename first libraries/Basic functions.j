//TESH.scrollpos=66
//TESH.alwaysfold=0
library BasicFunctions needs Text


globals
    integer udg_currentMonsterPlayerId = 0
endglobals



function IsUnitBetweenLocs takes unit u, real x1, real y1, real x2, real y2 returns boolean
	local real minX = RMinBJ(x1, x2)
	local real maxX = RMaxBJ(x1, x2)
	local real minY = RMinBJ(y1, y2)
	local real maxY = RMaxBJ(y1, y2)
	
	local real x = GetUnitX(u)
	local real y = GetUnitY(u)
	
	return ((minX < x and maxX > x) and (minY < y and maxY > y))
endfunction

function IsItemBetweenLocs takes item i, real x1, real y1, real x2, real y2 returns boolean
	local real minX = RMinBJ(x1, x2)
	local real maxX = RMaxBJ(x1, x2)
	local real minY = RMinBJ(y1, y2)
	local real maxY = RMaxBJ(y1, y2)
	
	local real x = GetItemX(i)
	local real y = GetItemY(i)
	
	return ((minX < x and maxX > x) and (minY < y and maxY > y))
endfunction


function IsPlayerInGame takes player p returns boolean
    return (GetPlayerController(p) == MAP_CONTROL_USER and GetPlayerSlotState(p) == PLAYER_SLOT_STATE_PLAYING)
endfunction


function SpecialIllidan takes unit hero returns nothing
    call SetUnitAnimation(hero, "Morph Alternate")
endfunction


function IsIssuedOrder takes string orderString returns boolean
    return (GetIssuedOrderId() == OrderId(orderString))
endfunction

function IsLastOrderPause takes nothing returns boolean
    return GetIssuedOrderId() == 851973
endfunction

function GetLocDist takes real x1, real y1, real x2, real y2 returns real
    local real diffX = x2 - x1
    local real diffY = y2 - y1
    return SquareRoot(diffX * diffX + diffY * diffY)
endfunction


function GetCurrentMonsterPlayer takes nothing returns player
    if (udg_currentMonsterPlayerId >= 11) then
        set udg_currentMonsterPlayerId = 0
    else
        set udg_currentMonsterPlayerId = udg_currentMonsterPlayerId + 1
    endif
    return Player(udg_currentMonsterPlayerId)
endfunction


function IsUnitInvulnerable takes unit u returns boolean
    local real life = GetUnitState(u, UNIT_STATE_LIFE)
    local real damages
    call UnitDamageTarget(u, u, 0.01, false, false, ATTACK_TYPE_CHAOS, DAMAGE_TYPE_UNIVERSAL,WEAPON_TYPE_WHOKNOWS)
    set damages=life-GetUnitState(u, UNIT_STATE_LIFE)
    call SetUnitState(u, UNIT_STATE_LIFE, life)
    return (damages == 0)
endfunction 


function StopUnit takes unit U returns nothing
    call PauseUnit(U, true)
    call IssueImmediateOrder(U, "stop")
    call PauseUnit(U, false)
endfunction


function IsHero takes unit U returns boolean
    local integer i = 0
    loop
        exitwhen (i > 11)
            if (udg_escapers.get(i).getHero() == U) then
                return true
            endif
        set i = i + 1
    endloop
    return false
endfunction

function ClearTextForPlayer takes player p returns nothing
    if (GetLocalPlayer() == p) then
        call ClearTextMessages()
    endif
endfunction

function MoveCamExceptForPlayer takes player p, real x, real y returns nothing
    if (GetLocalPlayer() == p) then
         set x = GetCameraTargetPositionX()
         set y = GetCameraTargetPositionY()
    endif
    call SetCameraPosition(x, y)
endfunction


function StringContainsChar takes string str, string char returns boolean
    local integer i
    local integer length
    if (StringLength(char) != 1) then
        return false
    endif
    set length = StringLength(str)
    set i = 1
    loop
        exitwhen (i > length)
            if (SubStringBJ(str, i, i) == char) then
                return true
            endif
        set i = i + 1
    endloop
    return false
endfunction


function IsBoolString takes string S returns boolean
    return (S == "true" or S == "false" or S == "on" or S == "off" or S == "1" or S == "0")
endfunction

function S2B takes string S returns boolean
    return (S == "true" or S == "on" or S == "1")
endfunction

function B2S takes boolean b returns string
    if (b) then
        return "true"
    endif
    return "false"
endfunction
    
function IsOnGround takes unit slider returns boolean
    return GetUnitFlyHeight( slider ) < 1
endfunction
    

endlibrary
