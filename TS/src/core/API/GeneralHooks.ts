import { Escaper } from 'core/04_STRUCTURES/Escaper/Escaper'
import { Level } from 'core/04_STRUCTURES/Level/Level'
import { Region } from 'core/04_STRUCTURES/Region/Region'
import { Monster } from '../04_STRUCTURES/Monster/Monster'
import { MecHookArray } from './MecHookArray'

export const hooks = {
    hooks_onBeforeCreateMonsterUnit: new MecHookArray<(monster: Partial<Monster>) => void>(),
    hooks_onAfterCreateMonsterUnit: new MecHookArray<(monster: Partial<Monster>) => void>(),
    hooks_onStartLevelAny: new MecHookArray<(level: Level) => void>(),
    hooks_onEndLevelAny: new MecHookArray<(level: Level) => void>(),
    hooks_onCoopHeroRevive: new MecHookArray<(reviver: Escaper, revived: Escaper) => void>(),
    hooks_onHeroEnterRegion: new MecHookArray<(escaper: Escaper, region: Region) => void>(),
    hooks_onHeroEnterRegionOnce: new MecHookArray<(escaper: Escaper, region: Region) => void>(),
    hooks_onModeSelection: new MecHookArray<(mode: 'solo' | 'coop') => void>(),
}
