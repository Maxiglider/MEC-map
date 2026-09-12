import { createEvent, createTimer } from 'Utils/mapUtils'
import { Timer } from 'w3ts'
import { getUdgEscapers, udg_monsters, udg_spawned_monster_units } from '../../../globals'
import { SyncSaveLoad } from '../../Utils/SaveLoad/TreeLib/SyncSaveLoad'
import { Constants } from '../01_libraries/Constants'
import { AfkMode } from '../08_GAME/Afk_mode/Afk_mode'
import { Natives } from '../wc3_natives_unsecured/Natives'

/**
 * What must be the same on every machine, written by each of them five times a second, so that a
 * desync is traced to what diverged first rather than guessed at. A desync drops a player from the
 * game, screen and all, so the lines go to a file of that machine rather than to the screen: after
 * one, every player sends theirs (Documents/Warcraft III/CustomMapData/MEC/desync_probe_p<N>.txt),
 * and the first value that differs at the same probe tick is where to look. It stops by itself the
 * moment a player leaves, so that the files still hold the drop however long the game goes on.
 *
 *  - t: the game time of the probe, in seconds since it was turned on,
 *  - rng: a draw from the random generator of the game, shared by every machine,
 *  - hid: the id of a handle made just now, which follows every handle ever made and destroyed,
 *  - mobs: the positions of every monster unit, summed, then their facings (face) and their current
 *    orders (ord), summed,
 *  - then per hero: its unit, its facing (f), fly height (h) and life (l), alive (a), sliding as an
 *    effect (e), sliding (s), the static slide taking it along (ss), the terrain it was last on (tt),
 *    its slide speed (sp), whether that speed is absolute (abs), coop invulnerable (inv), whether its
 *    terrain is checked (ck), afk (afk), the hero its camera is locked on (cam, -1 for none), its
 *    invisible unit (iv) and its power circle (pc), each as a position and whether it is hidden,
 *    and last, while it slides as an effect, where this machine sees that effect (fx).
 *
 * Turned on and off by a command, hence on every machine at once, as it has to be: it draws from the
 * random generator and makes a handle, which is harmless only when every machine does the same.
 * Where a hero sliding as an effect is seen is left out: that differs from one machine to another
 * by design, while its unit follows the packets. So do the static slide, the terrain and the slide
 * speed its own machine gives it between two packets: they read "*" for such a hero. Its effect is
 * written all the same, as fx*: different on every machine by design, and what its unit is compared
 * to - the fx of another machine should be close to the unit of the machine of that hero.
 */
const PROBE_PERIOD = 0.2

/** The last minute: a desync is noticed a few seconds after what caused it */
const PROBE_FILE_LINES = 300

/** The file is written once a second rather than at every probe: writing it is the costly part */
const PROBES_PER_WRITE = 5

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

const describeMonsters = () => {
    let positions = 0
    let facings = 0
    let orders = 0

    const add = (u: unit) => {
        positions += math.floor(GetUnitX(u)) + math.floor(GetUnitY(u))
        facings += math.floor(GetUnitFacing(u))
        orders += GetUnitCurrentOrder(u)
    }

    for (const [_, monster] of pairs(udg_monsters)) {
        const u = monster.u

        if (u) {
            add(u)
        }
    }

    for (const [_, u] of pairs(udg_spawned_monster_units)) {
        if (u !== undefined) {
            add(u)
        }
    }

    return string.format('mobs %d face %d ord %d', positions, facings, orders)
}

/** A unit of the hero other than its own: where it stands, and whether it is hidden */
const describeUnit = (u: unit | undefined) =>
    u ? string.format('%d,%d,%s', math.floor(GetUnitX(u)), math.floor(GetUnitY(u)), flag(IsUnitHidden(u))) : '-'

const describeHeroes = () => {
    let line = ''

    getUdgEscapers().forAll(escaper => {
        const hero = escaper.getHero()

        if (!hero) {
            return
        }

        // given by its own machine between two packets while it slides as an effect
        const isOwnMachineState = escaper.isHeroAsEffect()

        line += string.format(
            ' | %d: %d,%d f%d h%d l%d a%s e%s s%s ss%s tt%s sp%s abs%s inv%s ck%s afk%s cam%d iv%s pc%s fx%s',
            escaper.getId(),
            math.floor(GetUnitX(hero)),
            math.floor(GetUnitY(hero)),
            math.floor(GetUnitFacing(hero)),
            math.floor(GetUnitFlyHeight(hero)),
            math.floor(GetWidgetLife(hero)),
            flag(escaper.isAlive()),
            flag(escaper.isHeroAsEffect()),
            flag(escaper.isSliding()),
            isOwnMachineState ? '*' : tostring(escaper.getStaticSliding()?.id ?? -1),
            isOwnMachineState ? '*' : (escaper.getLastTerrainType()?.label ?? '-'),
            isOwnMachineState ? '*' : tostring(math.floor(escaper.getSlideSpeed() ?? 0)),
            flag(escaper.isAbsoluteSlideSpeed()),
            flag(escaper.isCoopInvul()),
            flag(escaper.doesCheckTerrain()),
            flag(AfkMode.isAfk[escaper.getId()]),
            escaper.getLockCamTarget()?.getId() ?? -1,
            describeUnit(escaper.getInvisUnit()),
            describeUnit(escaper.getPowerCircle()),
            isOwnMachineState
                ? string.format('*%d,%d', math.floor(escaper.getHeroX()), math.floor(escaper.getHeroY()))
                : '-'
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
            '[probe %d t%.1f] rng %d hid %d %s%s',
            state.tick,
            state.tick * PROBE_PERIOD,
            draw,
            handleId,
            describeMonsters(),
            describeHeroes()
        )
    )

    if (state.lines.length > PROBE_FILE_LINES) {
        state.lines.shift()
    }

    // Written again whole every second, so that the machine dropped by a desync has its last lines on
    // its disk already. Writing a file only concerns this machine, and makes no handle.
    if (state.tick % PROBES_PER_WRITE === 0) {
        writeProbeFile()
    }
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
