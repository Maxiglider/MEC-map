import { getUdgLevels } from '../../globals'
import { creepDataArray } from '../creeps'

const initSlideAfterDarkUtils = () => {
    let isActive = false
    const monsterTimers: { [monsterId: number]: timer } = {}

    const changeMonsterSkin = (monsterId: number) => {
        const level = getUdgLevels().getCurrentLevel()
        const monster = level?.monsters.getAll()[monsterId]

        if (monster && monster.u) {
            const randomCreep = creepDataArray[GetRandomInt(0, creepDataArray.length - 1)]
            const randomSkinId = FourCC(randomCreep.id)
            monster.setMonsterSkin(randomSkinId)

            // Schedule next change with random interval
            const nextInterval = GetRandomReal(1.0, 10.0)
            const timer = CreateTimer()
            monsterTimers[monsterId] = timer
            TimerStart(timer, nextInterval, false, () => changeMonsterSkin(monsterId))
        }
    }

    const applyToLevel = (levelId?: number) => {
        if (!isActive) return

        const level = levelId !== undefined ? getUdgLevels().get(levelId) : getUdgLevels().getCurrentLevel()

        if (!level || !level.isActivated()) return

        for (const [_, monster] of pairs(level.monsters.getAll())) {
            if (monster.u) {
                const monsterId = monster.getId()

                // Skip if already has a timer
                if (monsterTimers[monsterId]) continue

                // Start with initial random delay
                const initialDelay = GetRandomReal(1.0, 10.0)
                const timer = CreateTimer()
                monsterTimers[monsterId] = timer
                TimerStart(timer, initialDelay, false, () => changeMonsterSkin(monsterId))
            }
        }
    }

    const activate = () => {
        isActive = true

        // Apply to all active levels
        for (const [_, level] of pairs(getUdgLevels().getAll())) {
            if (level.isActivated()) {
                applyToLevel(level.getId())
            }
        }
    }

    const deactivate = () => {
        isActive = false

        // Clear all timers
        for (const [monsterId, timer] of pairs(monsterTimers)) {
            DestroyTimer(timer)
            delete monsterTimers[monsterId]
        }
    }

    const isSlideAfterDarkActive = () => isActive

    return {
        activate,
        deactivate,
        applyToLevel,
        isActive: isSlideAfterDarkActive,
    }
}

export const SlideAfterDarkUtils = initSlideAfterDarkUtils()
