import { createEvent, createTimer } from 'Utils/mapUtils'
import { getUdgEscapers } from '../../../../globals'
import { Constants } from '../../01_libraries/Constants'
import { Natives } from '../../wc3_natives_unsecured/Natives'

/**
 * What the machine of an async player tells the others about its hero.
 *
 * While the hero is an effect, only that machine knows where it really is: it decides, the others
 * replay. BlzSendSyncData carries the decision, and the event it raises fires on every machine in
 * the same game turn, which is what turns a local truth into synchronized state.
 *
 * Three kinds of packets:
 *  - POSITION, ten times a second, so the others keep a true picture,
 *  - DEATH, the moment this machine sees the hero die, so it dies at the same spot everywhere,
 *  - TERRAIN, whenever the terrain under the hero changes. It carries no terrain of its own: the
 *    others run the very same check at the position it carries, and the map being the same for
 *    everybody, they reach the same conclusion. That one packet therefore covers the start of a
 *    slide, a change of slide terrain and the return to walkable ground alike.
 */
const POSITION_PREFIX = 'MEC_AHP'
const DEATH_PREFIX = 'MEC_AHD'
const TERRAIN_PREFIX = 'MEC_AHT'
const FIELD_SEPARATOR = '|'

/** Ten a second: the packets travel at network speed whatever the rate, so a higher one would only
 * refine the shape of a path the receivers can compute themselves between two snapshots. */
const POSITION_PERIOD = 0.1

/**
 * Everything needed to carry on the movement between two packets, so that a receiving machine
 * runs the very same slide as the machine that sent it:
 *  - where the hero is, where it looks, and how high it flies,
 *  - targetAngle, the angle the mouse asks for. Absolute rather than "degrees left to turn": a
 *    relative value would drift, an absolute one corrects itself at every packet,
 *  - turnPerPeriod, the current angular speed. The slide accelerates its turns, so without it a
 *    receiver would restart that acceleration from its own value and draw another curve,
 *  - the vertical state and the distance travelled per period, as for a death.
 */
export type HeroMovementState = {
    x: number
    y: number
    facing: number
    targetAngle: number
    flyHeight: number
    speedZ: number
    lastZ: number
    oldDiffZ: number
    slideMovePerPeriod: number
    turnPerPeriod: number
}

const state = { isInitialized: false, sequence: 0 }

const encode = (escaperId: number, sequence: number, movement: HeroMovementState) =>
    string.format(
        `%d${FIELD_SEPARATOR}%d${FIELD_SEPARATOR}%.2f${FIELD_SEPARATOR}%.2f${FIELD_SEPARATOR}%.2f` +
            `${FIELD_SEPARATOR}%.2f${FIELD_SEPARATOR}%.2f${FIELD_SEPARATOR}%.4f${FIELD_SEPARATOR}%.2f` +
            `${FIELD_SEPARATOR}%.4f${FIELD_SEPARATOR}%.4f${FIELD_SEPARATOR}%.4f`,
        escaperId,
        sequence,
        movement.x,
        movement.y,
        movement.facing,
        movement.targetAngle,
        movement.flyHeight,
        movement.speedZ,
        movement.lastZ,
        movement.oldDiffZ,
        movement.slideMovePerPeriod,
        movement.turnPerPeriod
    )

const decode = (data: string) => {
    const fields: number[] = []

    for (const field of string.gmatch(data, `[^${FIELD_SEPARATOR}]+`)) {
        fields[fields.length] = tonumber(field) ?? 0
    }

    if (fields.length < 12) {
        return undefined
    }

    return {
        escaperId: fields[0],
        sequence: fields[1],
        movement: {
            x: fields[2],
            y: fields[3],
            facing: fields[4],
            targetAngle: fields[5],
            flyHeight: fields[6],
            speedZ: fields[7],
            lastZ: fields[8],
            oldDiffZ: fields[9],
            slideMovePerPeriod: fields[10],
            turnPerPeriod: fields[11],
        },
    }
}

const registerSyncEvent = (prefix: string, onPacket: (data: string) => void) => {
    createEvent({
        events: [
            t => {
                for (let i = 0; i < Constants.NB_ESCAPERS; i++) {
                    BlzTriggerRegisterPlayerSyncEvent(t, Natives.UPlayer(i), prefix, false)
                }
            },
        ],
        actions: [() => onPacket(Natives.UBlzGetTriggerSyncData())],
    })
}

/** Sends the state of the local hero, while it is an effect and only from its own machine */
const sendLocalHeroPosition = () => {
    const escaper = getUdgEscapers().get(GetPlayerId(GetLocalPlayer()!))

    if (!escaper?.isHeroAsEffect()) {
        return
    }

    state.sequence++

    BlzSendSyncData(POSITION_PREFIX, encode(escaper.getId(), state.sequence, escaper.getHeroMovementState()))
}

export const initAsyncHeroSync = () => {
    if (state.isInitialized) {
        return
    }

    state.isInitialized = true

    registerSyncEvent(POSITION_PREFIX, data => {
        const packet = decode(data)

        packet && getUdgEscapers().get(packet.escaperId)?.applyAsyncPosition(packet.sequence, packet.movement)
    })

    registerSyncEvent(TERRAIN_PREFIX, data => {
        const packet = decode(data)

        packet && getUdgEscapers().get(packet.escaperId)?.applyAsyncTerrainChange(packet.sequence, packet.movement)
    })

    registerSyncEvent(DEATH_PREFIX, data => {
        const packet = decode(data)

        packet && getUdgEscapers().get(packet.escaperId)?.applyAsyncDeath(packet.sequence, packet.movement)
    })

    createTimer(POSITION_PERIOD, true, sendLocalHeroPosition)
}

/** Tells the others where the terrain changed, so they can see it change at the same place */
export const sendAsyncTerrainChange = (escaperId: number, movement: HeroMovementState) => {
    state.sequence++

    BlzSendSyncData(TERRAIN_PREFIX, encode(escaperId, state.sequence, movement))
}

/** Only the player owning that hero sends it: they are the only one knowing where it stopped */
export const sendAsyncHeroDeath = (escaperId: number, movement: HeroMovementState) => {
    state.sequence++

    BlzSendSyncData(DEATH_PREFIX, encode(escaperId, state.sequence, movement))
}
