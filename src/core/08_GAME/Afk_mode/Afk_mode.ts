import { forRange } from 'Utils/mapUtils'
import { Constants } from 'core/01_libraries/Constants'
import { udg_colorCode } from 'core/01_libraries/Init_colorCodes'
import { escaperId2playerId } from 'core/04_STRUCTURES/Escaper/Escaper_functions'
import { getUdgEscapers, globals } from '../../../../globals'
import { playerId2colorId } from '../../06_COMMANDS/Helpers/Command_functions'
import { Natives } from '../../wc3_natives_unsecured/Natives'

const initAfkMode = () => {
    const timeMinAfk = 20
    const Z = -50
    const SIZE = 8
    const TRANSPARENCY = 0
    const isAfk: boolean[] = []
    const afkModeTimers: timer[] = []
    const afkModeTextTags: texttag[] = []
    const afkModeCbs: (() => void)[] = []
    const killAllAfkTimer = CreateTimer()
    let paused = false

    const AreAllAliveHeroesAfk = (): boolean => {
        let someoneAlive = false
        let someoneDead = false
        let i = 0
        while (true) {
            if (i >= Constants.NB_ESCAPERS) break

            const hero = getUdgEscapers().get(i)?.getHero()

            if (hero != null) {
                if (IsUnitAliveBJ(hero)) {
                    someoneAlive = true
                    if (!isAfk[i]) {
                        return false
                    }
                } else {
                    someoneDead = true
                }
            }
            i = i + 1
        }
        return someoneAlive && someoneDead
    }

    const KillAllHeroesIfAfk = () => {
        let i = 0
        if (AfkMode.AreAllAliveHeroesAfk()) {
            while (true) {
                if (i >= Constants.NB_ESCAPERS) break

                const hero = getUdgEscapers().get(i)?.getHero()

                if (hero && IsUnitAliveBJ(hero) && isAfk[i]) {
                    getUdgEscapers().get(i)?.kill()
                }

                i = i + 1
            }
        }
    }

    const KillAllAfkHeroesInAShortTime = () => {
        if (globals.killAfkHeroes) {
            TimerStart(killAllAfkTimer, 8, false, KillAllHeroesIfAfk)
        }
    }

    const SetAfkMode = (escaperId: number) => {
        let playerId = escaperId2playerId(escaperId)
        if (afkModeTextTags[escaperId] !== null) {
            DestroyTextTag(afkModeTextTags[escaperId])
        }

        const hero = getUdgEscapers().get(escaperId)?.getHero()

        if (hero && IsUnitAliveBJ(hero)) {
            afkModeTextTags[escaperId] = Natives.UCreateTextTagUnitBJ(
                udg_colorCode[playerId2colorId(playerId)] + 'AFK|r',
                hero,
                Z,
                SIZE,
                100,
                100,
                100,
                TRANSPARENCY
            )
        }

        isAfk[escaperId] = true
    }

    const StopAfk = (escaperId: number) => {
        if (isAfk[escaperId]) {
            isAfk[escaperId] = false
            DestroyTextTag(afkModeTextTags[escaperId])
            ;(afkModeTextTags[escaperId] as any) = null
        }
    }

    const GetAfkModeTimeExpiresCodeFromId = (id: number) => {
        if (paused) {
            return
        }

        SetAfkMode(id)

        if (AfkMode.AreAllAliveHeroesAfk()) {
            KillAllAfkHeroesInAShortTime()
        }
    }

    forRange(Constants.NB_PLAYERS_MAX, i => {
        afkModeTimers[i] = CreateTimer()
        afkModeCbs[i] = () => {
            AfkMode.GetAfkModeTimeExpiresCodeFromId(i)
        }
        isAfk[i] = false
        ;(afkModeTextTags[i] as any) = null
    })

    const resetAfk = (playerId: number) => {
        AfkMode.StopAfk(playerId)
        TimerStart(AfkMode.afkModeTimers[playerId], AfkMode.timeMinAfk, false, AfkMode.afkModeCbs[playerId])
    }

    /**
     * While paused, nobody becomes AFK and nobody is killed for it: for a while a map takes the players' hands
     * itself, a cinematic say, where a player who cannot move would otherwise be marked AFK and killed with the
     * others. Pausing lets go of the AFK marks already shown; resuming gives every hero alive its whole AFK time
     * again, counted from then.
     */
    const setPaused = (b: boolean) => {
        if (b === paused) {
            return
        }

        paused = b

        if (paused) {
            PauseTimer(killAllAfkTimer)
            forRange(Constants.NB_ESCAPERS, i => AfkMode.StopAfk(i))
            return
        }

        forRange(Constants.NB_PLAYERS_MAX, i => {
            const hero = getUdgEscapers().get(i)?.getHero()

            if (hero && IsUnitAliveBJ(hero)) {
                resetAfk(i)
            }
        })
    }

    const isPaused = () => paused

    return {
        timeMinAfk,
        isAfk,
        afkModeTimers,
        afkModeTextTags,
        afkModeCbs,
        AreAllAliveHeroesAfk,
        KillAllHeroesIfAfk,
        KillAllAfkHeroesInAShortTime,
        SetAfkMode,
        StopAfk,
        GetAfkModeTimeExpiresCodeFromId,
        resetAfk,
        setPaused,
        isPaused,
    }
}

export const AfkMode = initAfkMode()
