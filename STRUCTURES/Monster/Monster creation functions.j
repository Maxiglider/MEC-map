//TESH.scrollpos=15
//TESH.alwaysfold=0
library MonsterCreationFunctions needs BasicFunctions, MonsterTypeArray


globals
    private unit monster
    private integer ATTACK_SKILL = 'Aatk'
    private constant integer ABILITY_1_LIFE = 'ABV1'
    private constant integer ABILITY_10_LIFE = 'ABV2'
    private constant integer ABILITY_100_LIFE = 'ABV3'
    private constant integer ABILITY_1000_LIFE = 'ABV4'
    private constant integer ABILITY_10000_LIFE = 'ABV5'
    private constant integer ABILITY_ANNULER_VISION = 'A0AV'
    private constant integer ABILITY_FORME_CORBEAU = 'Amrf'
endglobals

    
    
private function UnitAddRemoveLifeAbility takes unit u, integer lifeAbility returns nothing
    call UnitAddAbility(u, lifeAbility)
    call SetUnitAbilityLevel(u, lifeAbility, 2)
    call UnitRemoveAbility(u, lifeAbility)
endfunction

function UnitAddMaxLife takes unit u, integer lifeToAdd returns nothing
    loop
        exitwhen (lifeToAdd <= 0)
            if (lifeToAdd >= 10000) then
                call UnitAddRemoveLifeAbility(u, ABILITY_10000_LIFE)
                set lifeToAdd = lifeToAdd - 10000
            else
                if (lifeToAdd >= 1000) then
                    call UnitAddRemoveLifeAbility(u, ABILITY_1000_LIFE)
                    set lifeToAdd = lifeToAdd - 1000
                else
                    if (lifeToAdd >= 100) then
                        call UnitAddRemoveLifeAbility(u, ABILITY_100_LIFE)
                        set lifeToAdd = lifeToAdd - 100
                    else
                        if (lifeToAdd >= 10) then
                            call UnitAddRemoveLifeAbility(u, ABILITY_10_LIFE)
                            set lifeToAdd = lifeToAdd - 10
                        else
                            call UnitAddRemoveLifeAbility(u, ABILITY_1_LIFE)
                            set lifeToAdd = lifeToAdd - 1
                        endif
                    endif
                endif
            endif
    endloop
endfunction

function SetUnitMaxLife takes unit u, integer newMaxLife returns boolean
    local integer maxLife = R2I(GetUnitState(u, UNIT_STATE_MAX_LIFE))
    if (newMaxLife <= maxLife) then
        return false
    endif
    call UnitAddMaxLife(u, newMaxLife - maxLife)
    return true
endfunction


function NewImmobileMonsterForPlayer takes MonsterType mt, player p, real x, real y, real angle returns unit
    local real scale
    if (angle == -1) then
        set monster = CreateUnit(p, mt.getUnitTypeId(), x, y, GetRandomDirectionDeg())
    else
        set monster = CreateUnit(p, mt.getUnitTypeId(), x, y, angle)
    endif
    //if (IsHeroUnitId(mt.getUnitTypeId())) then
    //    call Text_A("hero")
    //else
    //    call Text_A("pas hero")
    //endif
    call SetUnitUseFood(monster, false)
    if (mt.isClickable()) then
        call SetUnitMaxLife(monster, mt.getMaxLife())
    else
        call UnitAddAbility(monster, 'Aloc')
        call UnitAddAbility(monster, ABILITY_ANNULER_VISION)
    endif
    call UnitAddAbility(monster, mt.getImmolationSkill())
    set scale = mt.getScale()
    if (scale != -1) then
        call SetUnitScale(monster, scale, scale, scale)
    endif
    call SetUnitMoveSpeed(monster, mt.getUnitMoveSpeed())
    if (not MOBS_VARIOUS_COLORS) then
        call SetUnitColor(monster, ConvertPlayerColor(12))
    endif
    call UnitRemoveAbility(monster, ATTACK_SKILL)
    call UnitRemoveType(monster, UNIT_TYPE_PEON)
    if (mt.getHeight() != -1) then
        call UnitAddAbility(monster, ABILITY_FORME_CORBEAU)
        call SetUnitFlyHeight(monster, mt.getHeight(), 0)
    endif
    return monster
endfunction

function NewImmobileMonster takes MonsterType mt, real x, real y, real angle returns unit
    local player p
    if (mt.isClickable()) then
        set p = ENNEMY_PLAYER
    else
        set p = GetCurrentMonsterPlayer()
    endif
    return NewImmobileMonsterForPlayer(mt, p, x, y, angle)
endfunction


function NewPatrolMonster takes MonsterType mt, real x1, real y1, real x2, real y2 returns unit
    local real angle = bj_RADTODEG * Atan2(y1 - y2, x1 - x2)
    set monster = NewImmobileMonster(mt, x1, y1, angle)
    call IssuePointOrder(monster, "patrol", x2, y2)
    return monster
endfunction




endlibrary


