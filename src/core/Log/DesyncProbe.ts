import { createEvent, createTimer } from 'Utils/mapUtils'
import { Timer } from 'w3ts'
import { getUdgEscapers, udg_monsters, udg_spawned_monster_units } from '../../../globals'
import { SyncSaveLoad } from '../../Utils/SaveLoad/TreeLib/SyncSaveLoad'
import { Constants } from '../01_libraries/Constants'
import { Natives } from '../wc3_natives_unsecured/Natives'

/**
 * What must be the same on every machine, written by each of them once a second, so that a desync
 * is traced to what diverged first rather than guessed at. A desync drops a player from the game,
 * screen and all, so the lines go to a file of that machine rather than to the screen: after one,
 * every player sends theirs (Documents/Warcraft III/CustomMapData/MEC/desync_probe_p<N>.txt), and
 * the first value that differs at the same probe tick is where to look. It stops by itself the moment
 * a player leaves, so that the files still hold the drop however long the game goes on.
 *
 *  - rng: a draw from the random generator of the game, shared by every machine,
 *  - hid: the id of a handle made just now, which follows every handle ever made and destroyed,
 *  - mobs: the positions of every monster unit, summed,
 *  - then per hero: its unit, alive (a), sliding as an effect (e), sliding (s), the static slide
 *    taking it along (ss), the terrain it was last on (tt), its slide speed (sp), whether that
 *    speed is absolute (abs), coop invulnerable (inv), and whether its terrain is checked (ck).
 *
 * Turned on and off by a command, hence on every machine at once, as it has to be: it draws from the
 * random generator and makes a handle, which is harmless only when every machine does the same.
 * Where a hero sliding as an effect is seen is left out: that differs from one machine to another
 * by design, while its unit waits in a corner of the map.
 */
const PROBE_PERIOD = 1

/** The last minute: a desync is noticed a few seconds after what caused it */
const PROBE_FILE_LINES = 60

const state = {
    timer: undefined as Timer | undefined,
    tick: 0,
    lines: [] as string[],
    fileName: '',
    leaveTrigger: undefined as trigger | undefined,
}

const writeProbeFile = () => {
    SyncSaveLoad().writeFileWithoutPossibleLoading(state.fileName, state.lines.join('\n'), false)
}

/**
 * A desync drops a player, which every machine still in the game hears as that player leaving. The
 * probe stops right there on each of them, so that its file ends with what led to the drop instead
 * of pushing it out a minute later while the game goes on. The dropped machine stops by itself.
 */
const stopOnPlayerLeaving = () => {
    if (state.timer === undefined) {
        return
    }

    state.lines.push(
        string.format(
            '[probe %d] %s left the game: probe stopped',
            state.tick,
            GetPlayerName(Natives.UGetTriggerPlayer())
        )
    )

    writeProbeFile()

    state.timer.destroy()
    state.timer = undefined
}

const flag = (value: boolean | unit | undefined) => (value ? '1' : '0')

const sumMonsterPositions = () => {
    let sum = 0

    for (const [_, monster] of pairs(udg_monsters)) {
        const u = monster.u

        if (u) {
            sum += math.floor(GetUnitX(u)) + math.floor(GetUnitY(u))
        }
    }

    for (const [_, u] of pairs(udg_spawned_monster_units)) {
        if (u !== undefined) {
            sum += math.floor(GetUnitX(u)) + math.floor(GetUnitY(u))
        }
    }

    return sum
}

const describeHeroes = () => {
    let line = ''

    getUdgEscapers().forAll(escaper => {
        const hero = escaper.getHero()

        if (!hero) {
            return
        }

        line += string.format(
            ' | %d: %d,%d a%s e%s s%s ss%d tt%s sp%d abs%s inv%s ck%s',
            escaper.getId(),
            math.floor(GetUnitX(hero)),
            math.floor(GetUnitY(hero)),
            flag(escaper.isAlive()),
            flag(escaper.isHeroAsEffect()),
            flag(escaper.isSliding()),
            escaper.getStaticSliding()?.id ?? -1,
            escaper.getLastTerrainType()?.label ?? '-',
            math.floor(escaper.getSlideSpeed() ?? 0),
            flag(escaper.isAbsoluteSlideSpeed()),
            flag(escaper.isCoopInvul()),
            flag(escaper.doesCheckTerrain())
        )
    })

    return line
}

const probe = () => {
    state.tick++

    const draw = GetRandomInt(0, 999999)
    const location = Location(0, 0)
    const handleId = GetHandleId(location)
    RemoveLocation(location)

    state.lines.push(
        string.format(
            '[probe %d] rng %d hid %d mobs %d%s',
            state.tick,
            draw,
            handleId,
            sumMonsterPositions(),
            describeHeroes()
        )
    )

    if (state.lines.length > PROBE_FILE_LINES) {
        state.lines.shift()
    }

    // Written again whole every second, so that the machine dropped by a desync has its last lines on
    // its disk already. Writing a file only concerns this machine, and makes no handle.
    writeProbeFile()
}

export const setDesyncProbeEnabled = (isEnabled: boolean) => {
    if (isEnabled === (state.timer !== undefined)) {
        return
    }

    if (!isEnabled) {
        state.timer?.destroy()
        state.timer = undefined

        return
    }

    // made once, the first time, and kept: it only acts while the probe runs
    if (!state.leaveTrigger) {
        state.leaveTrigger = createEvent({
            events: [
                t => {
                    for (let i = 0; i < Constants.NB_PLAYERS_MAX; i++) {
                        TriggerRegisterPlayerEvent(t, Natives.UPlayer(i), EVENT_PLAYER_LEAVE)
                    }
                },
            ],
            actions: [stopOnPlayerLeaving],
        })
    }

    state.tick = 0
    state.lines = []
    // named after the player of this machine, so that two games run on one computer keep both files
    state.fileName = `MEC/desync_probe_p${GetPlayerId(GetLocalPlayer()!) + 1}.txt`
    state.timer = createTimer(PROBE_PERIOD, true, probe)
}
