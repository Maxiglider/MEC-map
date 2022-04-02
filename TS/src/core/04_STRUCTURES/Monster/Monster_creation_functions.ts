import { GetCurrentMonsterPlayer } from 'core/01_libraries/Basic_functions'
import { ENNEMY_PLAYER, MOBS_VARIOUS_COLORS } from 'core/01_libraries/Constants'
import { MonsterType } from './MonsterType'

let monster: unit
let ATTACK_SKILL = FourCC('Aatk')
const ABILITY_1_LIFE = FourCC('ABV1')
const ABILITY_10_LIFE = FourCC('ABV2')
const ABILITY_100_LIFE = FourCC('ABV3')
const ABILITY_1000_LIFE = FourCC('ABV4')
const ABILITY_10000_LIFE = FourCC('ABV5')
const ABILITY_ANNULER_VISION = FourCC('A0AV')
const ABILITY_FORME_CORBEAU = FourCC('Amrf')

export const UnitAddRemoveLifeAbility = (u: unit, lifeAbility: number) => {
    UnitAddAbility(u, lifeAbility)
    SetUnitAbilityLevel(u, lifeAbility, 2)
    UnitRemoveAbility(u, lifeAbility)
}

export const UnitAddMaxLife = (u: unit, lifeToAdd: number) => {
    while (true) {
        if (lifeToAdd <= 0) break
        if (lifeToAdd >= 10000) {
            UnitAddRemoveLifeAbility(u, ABILITY_10000_LIFE)
            lifeToAdd = lifeToAdd - 10000
        } else {
            if (lifeToAdd >= 1000) {
                UnitAddRemoveLifeAbility(u, ABILITY_1000_LIFE)
                lifeToAdd = lifeToAdd - 1000
            } else {
                if (lifeToAdd >= 100) {
                    UnitAddRemoveLifeAbility(u, ABILITY_100_LIFE)
                    lifeToAdd = lifeToAdd - 100
                } else {
                    if (lifeToAdd >= 10) {
                        UnitAddRemoveLifeAbility(u, ABILITY_10_LIFE)
                        lifeToAdd = lifeToAdd - 10
                    } else {
                        UnitAddRemoveLifeAbility(u, ABILITY_1_LIFE)
                        lifeToAdd = lifeToAdd - 1
                    }
                }
            }
        }
    }
}

export const SetUnitMaxLife = (u: unit, newMaxLife: number): boolean => {
    let maxLife = R2I(GetUnitState(u, UNIT_STATE_MAX_LIFE))
    if (newMaxLife <= maxLife) {
        return false
    }
    UnitAddMaxLife(u, newMaxLife - maxLife)
    return true
}

export const NewImmobileMonsterForPlayer = (mt: MonsterType, p: player, x: number, y: number, angle: number): unit => {
    let scale: number
    if (angle === -1) {
        monster = CreateUnit(p, mt.getUnitTypeId(), x, y, GetRandomDirectionDeg())
    } else {
        monster = CreateUnit(p, mt.getUnitTypeId(), x, y, angle)
    }

    SetUnitUseFood(monster, false)
    if (mt.isClickable()) {
        SetUnitMaxLife(monster, mt.getMaxLife())
    } else {
        UnitAddAbility(monster, FourCC('Aloc'))
        UnitAddAbility(monster, ABILITY_ANNULER_VISION)
    }
    UnitAddAbility(monster, mt.getImmolationSkill())
    scale = mt.getScale()
    if (scale !== -1) {
        SetUnitScale(monster, scale, scale, scale)
    }
    SetUnitMoveSpeed(monster, mt.getUnitMoveSpeed())
    if (!MOBS_VARIOUS_COLORS) {
        SetUnitColor(monster, ConvertPlayerColor(24))
    }
    UnitRemoveAbility(monster, ATTACK_SKILL)
    UnitRemoveType(monster, UNIT_TYPE_PEON)
    if (mt.getHeight() != -1) {
        UnitAddAbility(monster, ABILITY_FORME_CORBEAU)
        SetUnitFlyHeight(monster, mt.getHeight(), 0)
    }
    return monster
}

export const NewImmobileMonster = (mt: MonsterType, x: number, y: number, angle: number): unit => {
    let p: player
    if (mt.isClickable()) {
        p = ENNEMY_PLAYER
    } else {
        p = GetCurrentMonsterPlayer()
    }
    return NewImmobileMonsterForPlayer(mt, p, x, y, angle)
}

export const NewPatrolMonster = (mt: MonsterType, x1: number, y1: number, x2: number, y2: number): unit => {
    let angle = bj_RADTODEG * Atan2(y1 - y2, x1 - x2)
    monster = NewImmobileMonster(mt, x1, y1, angle)
    IssuePointOrder(monster, 'patrol', x2, y2)
    return monster
}
