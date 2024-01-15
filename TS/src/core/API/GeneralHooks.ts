import { Level } from 'core/04_STRUCTURES/Level/Level'
import { Monster } from '../04_STRUCTURES/Monster/Monster'
import { MecHookArray } from './MecHookArray'

export const hooks = {
    hooks_onBeforeCreateMonsterUnit: new MecHookArray<(monster: Partial<Monster>) => void>(),
    hooks_onAfterCreateMonsterUnit: new MecHookArray<(monster: Partial<Monster>) => void>(),
    hooks_onStartLevelAny: new MecHookArray<(level: Level) => void>(),
    hooks_onEndLevelAny: new MecHookArray<(level: Level) => void>(),
}
