//DISABLED TRIGGER

//TESH.scrollpos=0
//TESH.alwaysfold=0
library HeroesForTest initializer Init_HeroesForTest needs Escaper


globals
    location array startPositions
    location array startPositionsRandomized
    integer array playerIdsRandomized
    
    constant real TIME_BEFORE_HERO_SPAWN = 0.
    constant real TIME_BETWEEN_EACH_HERO_SPAWN = 0.3
    constant real HERO_START_ANGLE = 90.
    constant string EFFECT_FOR_MISSING_HEROES = "Abilities\\Spells\\Undead\\DeathPact\\DeathPactTarget.mdl"
    private constant integer NB_COLUMNS = 4
    private constant integer NB_ROWS = 3
endglobals


function RandomizeStartPositionsAndHeroSpawnOrder takes nothing returns nothing
    local boolean array alreadyAdded
    local integer n
    local integer i
    
//randomize start positions
    set i = 0
    loop
        exitwhen (i > 11)
            loop
                set n = GetRandomInt(0, 11)
                exitwhen (not alreadyAdded[n])
            endloop
            set startPositionsRandomized[i] = startPositions[n]
            set alreadyAdded[n] = true
        set i = i + 1
    endloop
    
//reinit alreadyAdded to false
    set i = 0
    loop
        exitwhen (i > 11)
            set alreadyAdded[i] = false
        set i = i + 1
    endloop
    
//randomize hero spawn order
    set i = 0
    loop
        exitwhen (i > 11)
            loop
                set n = GetRandomInt(0, 11)
                exitwhen (not alreadyAdded[n])
            endloop
            set playerIdsRandomized[i] = n
            set alreadyAdded[n] = true
        set i = i + 1
    endloop
endfunction



function Trig_heroes_Actions takes nothing returns nothing
    local boolean array alreadyAdded
    local effect anEffect
    local integer i
    local integer n

//randomize start positions
    call RandomizeStartPositionsAndHeroSpawnOrder()
    
//create heroes
    call ClearSelection()
    set i = 0
    loop
        exitwhen (i > 11)
            set n = playerIdsRandomized[i]
            //set udg_is_activ_j[n] = true
            if (udg_escapers.get(i) != 0) then
                call udg_escapers.get(i).createHero(GetLocationX(startPositionsRandomized[n]), GetLocationY(startPositionsRandomized[n]), HERO_START_ANGLE)
            else
                set anEffect = AddSpecialEffectLoc(EFFECT_FOR_MISSING_HEROES, startPositionsRandomized[n])
                call DestroyEffect(anEffect)
            endif
            set startPositionsRandomized[n] = null
            //call TriggerSleepAction(TIME_BETWEEN_EACH_HERO_SPAWN)
        set i = i + 1
    endloop
    //call EnableTrigger(gg_trg_anticheat_teleport_and_revive)
    //set AnticheatTeleport_justRevived = true
    set anEffect = null
endfunction

//===========================================================================
function Init_HeroesForTest takes nothing returns nothing
//define start positions
    local real minX = GetRectMinX(gg_rct_departLvl_0)
    local real minY = GetRectMinY(gg_rct_departLvl_0)
    local real diffX = (GetRectMaxX(gg_rct_departLvl_0) - minX) / (NB_COLUMNS - 1)
    local real diffY = (GetRectMaxY(gg_rct_departLvl_0) - minY) / (NB_ROWS - 1)
    local integer x = 0
    local integer y = 0
    local integer n = 0
    loop
        exitwhen (y  >  NB_ROWS - 1)
        loop
            exitwhen (x > NB_COLUMNS - 1)
                set startPositions[n] = Location(minX + diffX * x, minY + diffY * y)
            set n = n + 1
            set x = x + 1
        endloop
        set x = 0
        set y = y + 1
    endloop
    
    set gg_trg_Heroes = CreateTrigger()
    call TriggerAddAction(gg_trg_Heroes, function Trig_heroes_Actions)
    call TriggerRegisterTimerEvent(gg_trg_Heroes, TIME_BEFORE_HERO_SPAWN, false)
endfunction


endlibrary
