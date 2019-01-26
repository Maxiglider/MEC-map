//TESH.scrollpos=3
//TESH.alwaysfold=0
library MonsterInterface initializer InitHtMonster needs MonsterCreationFunctions, CommandsFunctions


globals
    constant integer MAX_NB_MONSTERS = 500 //nombre maximum de monstres pour chacun des trois types et par niveau (no move, simple patrol, multiple patrols)
    hashtable htMonsterId2MonsterHandleId
    public constant integer MONSTER = 1
    private constant integer CASTER = 2
    constant integer NO_ID = -1
    private integer monsterNextId = 1
    constant real DISABLE_TRANSPARENCY = 80
endglobals

interface Monster [100000] //50 niveaux * 2000 monstres maximum prévu par niveau
    static integer nbInstances = 0
    integer id
	unit u = null
	MonsterType mt
    Level level
    integer arrayId
    integer life
    timer disablingTimer
    integer baseColorId
    real vcRed
    real vcGreen
    real vcBlue
    real vcTransparency
	//static method count takes nothing returns integer
    method getId takes nothing returns integer
    //method setId takes integer id returns Monster______
	method createUnit takes nothing returns nothing
	method removeUnit takes nothing returns nothing
    method killUnit takes nothing returns nothing
    method getMonsterType takes nothing returns MonsterType
    method setMonsterType takes MonsterType mt returns boolean
    method toString takes nothing returns string
    method getLife takes nothing returns integer
    method setLife takes integer life returns nothing
    method temporarilyDisable takes timer disablingTimer returns nothing
    method temporarilyEnable takes timer enablingTimer returns nothing
    method setBaseColor takes string colorString returns nothing
    method setVertexColor takes real vcRed, real vcGreen, real vcBlue returns nothing
    method reinitColor takes nothing returns nothing
endinterface


private function InitHtMonster takes nothing returns nothing
    set htMonsterId2MonsterHandleId = InitHashtable()
endfunction


function GetNextMonsterId takes nothing returns integer
    set monsterNextId = monsterNextId + 1
    return monsterNextId - 1
endfunction

function MonsterIdHasBeenSetTo takes integer monsterId returns nothing
    if (monsterId >= monsterNextId) then
        set monsterNextId = monsterId + 1
    endif
endfunction


////////////////////////////////////////////////////////////////////
function MonsterHashtableSetMonsterId takes Monster monster, integer oldId, integer newId returns nothing
    if (oldId == newId) then
        return
    endif
    if (oldId != NO_ID) then
        call RemoveSavedInteger(htMonsterId2MonsterHandleId, MONSTER, oldId)
    endif
    call SaveInteger(htMonsterId2MonsterHandleId, MONSTER, newId, integer(monster))
endfunction

function MonsterId2Monster takes integer monsterId returns Monster
    return Monster(LoadInteger(htMonsterId2MonsterHandleId, MONSTER, monsterId))
endfunction

function MonsterHashtableRemoveMonsterId takes integer id returns nothing
    call RemoveSavedInteger(htMonsterId2MonsterHandleId, MONSTER, id)
endfunction


////////////////////////////////////////////////////////////////////
function CasterHashtableSetCasterId takes Caster caster, integer oldId, integer newId returns nothing
    if (oldId == newId) then
        return
    endif
    if (oldId != NO_ID) then
        call RemoveSavedInteger(htMonsterId2MonsterHandleId, CASTER, oldId)
    endif
    call SaveInteger(htMonsterId2MonsterHandleId, CASTER, newId, integer(caster))
endfunction

function CasterId2Caster takes integer casterId returns Caster
    return Caster(LoadInteger(htMonsterId2MonsterHandleId, CASTER, casterId))
endfunction

function CasterHashtableRemoveCasterId takes integer id returns nothing
    call RemoveSavedInteger(htMonsterId2MonsterHandleId, CASTER, id)
endfunction



endlibrary




