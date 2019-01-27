//TESH.scrollpos=0
//TESH.alwaysfold=0
library MonstersClickableSetLife initializer Init_MonstersClickableSetLife


globals
    group monstersClickable
    trigger trigMonstersClickableSetLife
    private constant real PERIOD = 0.1
endglobals


function MonstersClickableSetLifeForEach takes nothing returns nothing
    local unit monsterUnit = GetEnumUnit()
    local real currentLife = GetUnitState(monsterUnit, UNIT_STATE_LIFE)
    local Monster monster = Monster(LoadInteger(htMonsterId2MonsterHandleId, MonsterInterface_MONSTER, GetUnitUserData(monsterUnit)))
    local real previousLife = I2R(monster.getLife())
    local real diffLife = RMaxBJ(currentLife, previousLife) - RMinBJ(currentLife, previousLife)
    if (diffLife < 100) then
        call SetUnitLifeBJ(GetEnumUnit(), previousLife - 0.5)
    else
        loop
            exitwhen (diffLife <= 0)
                call monster.setLife(R2I(previousLife) - 10000)
            set diffLife = diffLife - 10000
        endloop
    endif
endfunction

function MonstersClickableSetLife_Actions takes nothing returns nothing
    call ForGroup(monstersClickable, function MonstersClickableSetLifeForEach)
endfunction


//===========================================================================
function Init_MonstersClickableSetLife takes nothing returns nothing
    set monstersClickable = CreateGroup()
    set trigMonstersClickableSetLife = CreateTrigger()
    call TriggerAddAction(trigMonstersClickableSetLife, function MonstersClickableSetLife_Actions)
    call TriggerRegisterTimerEvent(trigMonstersClickableSetLife, PERIOD, true)
endfunction


endlibrary