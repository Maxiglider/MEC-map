//todomax add clearMob: ClearMob as propery of Monster
//todomax add getIndex method, with index field, key of udg_monsters and UserData of the unit

export interface Monster {
    /* TODO; static */ nbInstances: number = 0
    id: number
    u: unit | null = null
    mt: MonsterType
    level: Level
    arrayId: number
    life: number
    disablingTimer: timer
    baseColorId: number
    vcRed: number
    vcGreen: number
    vcBlue: number
    vcTransparency: number
    //static function count takes nothing returns integer
    getId: () => number
    //method setId takes integer id returns Monster______
    createUnit: () => void
    removeUnit: () => void
    killUnit: () => void
    getMonsterType: () => MonsterType
    setMonsterType: (mt: MonsterType) => boolean
    toString: () => string
    getLife: () => number
    setLife: (life: number) => void
    temporarilyDisable: (disablingTimer: timer) => void
    temporarilyEnable: (enablingTimer: timer) => void
    setBaseColor: (colorString: string) => void
    setVertexColor: (vcRed: number, vcGreen: number, vcBlue: number) => void
    reinitColor: () => void
    destroy: () => void
}

const initMonster = () => {
    const MAX_NB_MONSTERS = 500
    let htMonsterId2MonsterHandleId: hashtable = InitHashtable()
    const MONSTER = 1
    const CASTER = 2
    const NO_ID = -1
    let monsterNextId = 1
    const DISABLE_TRANSPARENCY = 80

    const GetNextMonsterId = (): number => {
        monsterNextId = monsterNextId + 1
        return monsterNextId - 1
    }

    const MonsterIdHasBeenSetTo = (monsterId: number) => {
        if (monsterId >= monsterNextId) {
            monsterNextId = monsterId + 1
        }
    }

    const MonsterHashtableSetMonsterId = (monster: Monster, oldId: number, newId: number) => {
        if (oldId === newId) {
            return
        }
        if (oldId !== NO_ID) {
            RemoveSavedInteger(htMonsterId2MonsterHandleId, MONSTER, oldId)
        }
        SaveInteger(htMonsterId2MonsterHandleId, MONSTER, newId, integer(monster))
    }

    const MonsterId2Monster = (monsterId: number): Monster => {
        return Monster(LoadInteger(htMonsterId2MonsterHandleId, MONSTER, monsterId))
    }

    const MonsterHashtableRemoveMonsterId = (id: number) => {
        RemoveSavedInteger(htMonsterId2MonsterHandleId, MONSTER, id)
    }

    const CasterHashtableSetCasterId = (caster: Caster, oldId: number, newId: number) => {
        if (oldId === newId) {
            return
        }
        if (oldId !== NO_ID) {
            RemoveSavedInteger(htMonsterId2MonsterHandleId, CASTER, oldId)
        }
        SaveInteger(htMonsterId2MonsterHandleId, CASTER, newId, integer(caster))
    }

    const CasterId2Caster = (casterId: number): Caster => {
        return Caster(LoadInteger(htMonsterId2MonsterHandleId, CASTER, casterId))
    }

    const CasterHashtableRemoveCasterId = (id: number) => {
        RemoveSavedInteger(htMonsterId2MonsterHandleId, CASTER, id)
    }

    return {
        MAX_NB_MONSTERS,
        htMonsterId2MonsterHandleId,
        MONSTER,
        NO_ID,
        DISABLE_TRANSPARENCY,
        GetNextMonsterId,
        MonsterIdHasBeenSetTo,
        MonsterHashtableSetMonsterId,
        MonsterId2Monster,
        MonsterHashtableRemoveMonsterId,
        CasterHashtableSetCasterId,
        CasterId2Caster,
        CasterHashtableRemoveCasterId,
    }
}

export const Monster = initMonster()
