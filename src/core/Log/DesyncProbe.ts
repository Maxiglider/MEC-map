import { MemoryHandler } from 'Utils/MemoryHandler'
import { createEvent, createTimer } from 'Utils/mapUtils'
import { Timer } from 'w3ts'
import { getUdgEscapers, udg_monsters, udg_spawned_monster_units } from '../../../globals'
import { SyncSaveLoad } from '../../Utils/SaveLoad/TreeLib/SyncSaveLoad'
import { Constants } from '../01_libraries/Constants'
import { AfkMode } from '../08_GAME/Afk_mode/Afk_mode'
import { Natives } from '../wc3_natives_unsecured/Natives'
import { setHeroDeathListener } from './DeathCause'

/**
 * What must be the same on every machine, written by each of them five times a second, so that a
 * desync is traced to what diverged first rather than guessed at. A desync drops a player from the
 * game, screen and all, so the lines go to a file of that machine rather than to the screen: after
 * one, every player sends both of theirs (Documents/Warcraft III/CustomMapData/MEC/desync_probe_p<N>.txt
 * and desync_probe_p<N>_last.txt), and the first value that differs at the same probe tick is where
 * to look. It stops by itself the moment a player leaves, so that the files still hold the drop
 * however long the game goes on.
 *
 *  - t: the game time of the probe, in seconds since it was turned on,
 *  - rng: a draw from the random generator of the game, shared by every machine,
 *  - hid: the id of a handle made just now, which follows every handle ever made and destroyed,
 *  - mobs: the positions of every monster unit, summed, then their facings (face) and their current
 *    orders (ord), summed,
 *  - ag: the agents made and unmade on this machine since the probe was turned on, by kind, as
 *    made/unmade: effects (e), timers (t), units (u), triggers (tr), groups (g), locations (l), rects
 *    (r), regions (rg), items (i), lightnings (li), forces (f), destructables (d), sounds (s). Every
 *    native making or unmaking one is counted, whoever calls it (see wrapAgentNatives). An agent made
 *    by one machine alone is the most common desync, and hid cannot show it: the garbage collector of
 *    each machine frees handles at its own pace, so hid differs by thousands in a game that holds,
 *  - mh: the tables of MemoryHandler handed out, given back, and waiting in its pool: a table taken
 *    or given back by one machine alone makes every table after it differ,
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
 *
 * Each death of a hero adds a line of its own, "[probe N death]", with where its unit died and what
 * killed it (see DeathCause): the cause is written where the death was decided, so for a hero sliding
 * as an effect only the file of its own machine knows it. Those lines are not compared.
 */
const PROBE_PERIOD = 0.2

/** The last minute: a desync is noticed a few seconds after what caused it */
const PROBE_FILE_LINES = 300

/** The file is written once a second rather than at every probe: writing it is the costly part */
const PROBES_PER_WRITE = 5

/**
 * The last five seconds, written again at every probe to a file of their own. The machine a desync
 * drops hears of no player leaving: its game just ends, and what it probed since its last write of
 * the whole file is lost - up to a second, the one before its drop, which only that machine can show.
 * The machines still in the game notice the drop seconds later, which is why they need the whole file.
 */
const LAST_PROBES_LINES = 25

const state = {
    timer: undefined as Timer | undefined,
    tick: 0,
    lines: [] as string[],
    fileName: '',
    lastFileName: '',
    leaveTrigger: undefined as trigger | undefined,
}

const writeProbeFile = () => {
    SyncSaveLoad().writeFileWithoutPossibleLoading(state.fileName, state.lines.join('\n'), false)
}

const writeLastProbesFile = () => {
    const lineCount = state.lines.length

    SyncSaveLoad().writeFileWithoutPossibleLoading(
        state.lastFileName,
        table.concat(state.lines, '\n', math.max(1, lineCount - LAST_PROBES_LINES + 1), lineCount),
        false
    )
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
    writeLastProbesFile()

    state.timer.destroy()
    state.timer = undefined
    setHeroDeathListener(undefined)
    unwrapAgentNatives()
}

const flag = (value: boolean | unit | undefined) => (value ? '1' : '0')

type NativeFunction = (this: void, ...args: any[]) => any

/** The kinds of agent counted, in the order they are written */
const AGENT_KINDS = ['e', 't', 'u', 'tr', 'g', 'l', 'r', 'rg', 'i', 'li', 'f', 'd', 's']

/** The natives making or unmaking an agent, by kind. One missing from this version of the game is skipped */
const AGENT_NATIVES: { name: string; kind: string; isMade: boolean }[] = [
    { name: 'AddSpecialEffect', kind: 'e', isMade: true },
    { name: 'AddSpecialEffectLoc', kind: 'e', isMade: true },
    { name: 'AddSpecialEffectTarget', kind: 'e', isMade: true },
    { name: 'AddSpellEffect', kind: 'e', isMade: true },
    { name: 'AddSpellEffectLoc', kind: 'e', isMade: true },
    { name: 'AddSpellEffectById', kind: 'e', isMade: true },
    { name: 'AddSpellEffectByIdLoc', kind: 'e', isMade: true },
    { name: 'AddSpellEffectTarget', kind: 'e', isMade: true },
    { name: 'AddSpellEffectTargetById', kind: 'e', isMade: true },
    { name: 'DestroyEffect', kind: 'e', isMade: false },
    { name: 'CreateTimer', kind: 't', isMade: true },
    { name: 'DestroyTimer', kind: 't', isMade: false },
    { name: 'CreateUnit', kind: 'u', isMade: true },
    { name: 'CreateUnitByName', kind: 'u', isMade: true },
    { name: 'CreateUnitAtLoc', kind: 'u', isMade: true },
    { name: 'CreateUnitAtLocByName', kind: 'u', isMade: true },
    { name: 'BlzCreateUnitWithSkin', kind: 'u', isMade: true },
    { name: 'CreateCorpse', kind: 'u', isMade: true },
    { name: 'RemoveUnit', kind: 'u', isMade: false },
    { name: 'CreateTrigger', kind: 'tr', isMade: true },
    { name: 'DestroyTrigger', kind: 'tr', isMade: false },
    { name: 'CreateGroup', kind: 'g', isMade: true },
    { name: 'DestroyGroup', kind: 'g', isMade: false },
    { name: 'Location', kind: 'l', isMade: true },
    { name: 'RemoveLocation', kind: 'l', isMade: false },
    { name: 'Rect', kind: 'r', isMade: true },
    { name: 'RectFromLoc', kind: 'r', isMade: true },
    { name: 'RemoveRect', kind: 'r', isMade: false },
    { name: 'CreateRegion', kind: 'rg', isMade: true },
    { name: 'RemoveRegion', kind: 'rg', isMade: false },
    { name: 'CreateItem', kind: 'i', isMade: true },
    { name: 'BlzCreateItemWithSkin', kind: 'i', isMade: true },
    { name: 'RemoveItem', kind: 'i', isMade: false },
    { name: 'AddLightning', kind: 'li', isMade: true },
    { name: 'AddLightningEx', kind: 'li', isMade: true },
    { name: 'DestroyLightning', kind: 'li', isMade: false },
    { name: 'CreateForce', kind: 'f', isMade: true },
    { name: 'DestroyForce', kind: 'f', isMade: false },
    { name: 'CreateDestructable', kind: 'd', isMade: true },
    { name: 'CreateDestructableZ', kind: 'd', isMade: true },
    { name: 'CreateDeadDestructable', kind: 'd', isMade: true },
    { name: 'CreateDeadDestructableZ', kind: 'd', isMade: true },
    { name: 'BlzCreateDestructableWithSkin', kind: 'd', isMade: true },
    { name: 'BlzCreateDestructableZWithSkin', kind: 'd', isMade: true },
    { name: 'RemoveDestructable', kind: 'd', isMade: false },
    { name: 'CreateSound', kind: 's', isMade: true },
    { name: 'CreateSoundFromLabel', kind: 's', isMade: true },
    { name: 'CreateMIDISound', kind: 's', isMade: true },
]

const madeAgents: { [kind: string]: number } = {}
const unmadeAgents: { [kind: string]: number } = {}

/** The natives as they were before the probe wrapped them, by name, to give them back */
const originalNatives: { [name: string]: NativeFunction | undefined } = {}

/**
 * Wraps every native of AGENT_NATIVES so that it counts what it makes or unmakes, then does what it
 * did. On every machine at once, as the probe is turned on by a command, and given back as it stops.
 * Only counts: nothing else changes, so the game plays the same.
 */
const wrapAgentNatives = () => {
    for (const kind of AGENT_KINDS) {
        madeAgents[kind] = 0
        unmadeAgents[kind] = 0
    }

    for (const native of AGENT_NATIVES) {
        const original = (_G as any)[native.name] as NativeFunction | undefined

        if (typeof original !== 'function' || originalNatives[native.name] !== undefined) {
            continue
        }

        originalNatives[native.name] = original

        const counts = native.isMade ? madeAgents : unmadeAgents
        const kind = native.kind

        const counted: NativeFunction = (...args: any[]) => {
            counts[kind] = counts[kind] + 1

            return original(...args)
        }

        ;(_G as any)[native.name] = counted
    }
}

const unwrapAgentNatives = () => {
    for (const native of AGENT_NATIVES) {
        const original = originalNatives[native.name]

        if (original !== undefined) {
            ;(_G as any)[native.name] = original
            delete originalNatives[native.name]
        }
    }
}

const describeAgents = () => {
    let line = 'ag'

    for (const kind of AGENT_KINDS) {
        line += string.format(' %s%d/%d', kind, madeAgents[kind] ?? 0, unmadeAgents[kind] ?? 0)
    }

    const pool = MemoryHandler.getPoolStats()

    return line + string.format(' mh %d/%d/%d', pool.handedOut, pool.returned, pool.cached)
}

/** A line of its own for each death, written at once: a death is what a probe is most often read for */
const writeHeroDeath = (escaperId: number, x: number, y: number, cause: string) => {
    if (state.timer === undefined) {
        return
    }

    state.lines.push(
        string.format(
            '[probe %d death] %d died at %d,%d: %s',
            state.tick,
            escaperId,
            math.floor(x),
            math.floor(y),
            cause
        )
    )

    if (state.lines.length > PROBE_FILE_LINES) {
        state.lines.shift()
    }

    writeProbeFile()
}

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
            '[probe %d t%.1f] rng %d hid %d %s %s%s',
            state.tick,
            state.tick * PROBE_PERIOD,
            draw,
            handleId,
            describeMonsters(),
            describeAgents(),
            describeHeroes()
        )
    )

    if (state.lines.length > PROBE_FILE_LINES) {
        state.lines.shift()
    }

    // The last seconds at every probe, so that a machine dropped by a desync keeps the probes that led
    // to its drop; the whole file once a second. Writing a file only concerns this machine, and makes
    // no handle, and every machine writes at the same probes.
    writeLastProbesFile()

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
        setHeroDeathListener(undefined)
        unwrapAgentNatives()

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
    // named after the player of this machine, so that two games run on one computer keep their files
    const playerNumber = GetPlayerId(GetLocalPlayer()!) + 1
    state.fileName = `MEC/desync_probe_p${playerNumber}.txt`
    state.lastFileName = `MEC/desync_probe_p${playerNumber}_last.txt`
    state.timer = createTimer(PROBE_PERIOD, true, probe)
    setHeroDeathListener(writeHeroDeath)
    // last, so that counting starts from the same point on every machine
    wrapAgentNatives()
}
