import { ServiceManager } from 'Services'
import { createTimer } from 'Utils/mapUtils'
import { getUdgEscapers, getUdgLevels, udg_spawned_monster_units, udg_spawned_monsters } from '../../../../globals'
import { arrayPush } from '../../01_libraries/Basic_functions'
import { Escaper } from '../../04_STRUCTURES/Escaper/Escaper'

/**
 * Finds what the hero of an async player touches, by hand.
 *
 * A hero sliding as an effect no longer carries its invisible unit around, so the immolation of
 * the monsters has nothing to burn: the contact has to be looked for. Only the machine owning the
 * hero looks, since it is the only one knowing where it really is, and what it finds goes to the
 * very same handler the immolation used to call, so every consequence stays where it was written.
 *
 * The reach is the collision size of the hero, which the invisible unit was built from.
 *
 * Monsters carry the ability Locust to be unclickable, and the enumeration natives ignore those,
 * so the engine cannot be asked: the candidates come from what MEC itself keeps track of.
 */
const CONTACT_CHECK_PERIOD = 0.02

/** Where each hero was at the previous check, to sweep the step rather than test a single point */
const lastCheckedPositions: { [escaperId: number]: { x: number; y: number } } = {}
const state = { isInitialized: false }

/**
 * Squared distance from a point to the segment the hero travelled. Tested against the segment
 * rather than the arrival point, so that a fast slide cannot step over a monster between two
 * checks: it makes the detection independent from the speed, which is what allows this to run
 * fifty times a second rather than at every slide step.
 */
const squaredDistanceToStep = (fromX: number, fromY: number, toX: number, toY: number, x: number, y: number) => {
    const stepX = toX - fromX
    const stepY = toY - fromY
    const squaredStepLength = stepX * stepX + stepY * stepY

    let ratio = 0

    if (squaredStepLength > 0) {
        ratio = ((x - fromX) * stepX + (y - fromY) * stepY) / squaredStepLength
        ratio = ratio < 0 ? 0 : ratio > 1 ? 1 : ratio
    }

    const closestX = fromX + ratio * stepX - x
    const closestY = fromY + ratio * stepY - y

    return closestX * closestX + closestY * closestY
}

type ContactContext = {
    escaper: Escaper
    fromX: number
    fromY: number
    toX: number
    toY: number
    heroRadius: number
    /**
     * All of them, not the first one found: the immolation fired the handler once per monster
     * burning the hero, so touching a jump pad and a monster at the same instant, or two life
     * bonuses at once, must still count twice.
     */
    touched: unit[]
}

/** Cheapest tests first: a monster that cannot burn, or one that is gone, costs almost nothing */
const testCandidate = (context: ContactContext, candidate: unit | undefined, contactRadius: number) => {
    if (!candidate || contactRadius <= 0) {
        return
    }

    if (GetUnitTypeId(candidate) === 0 || !IsUnitAliveBJ(candidate) || IsUnitHidden(candidate)) {
        return
    }

    const x = GetUnitX(candidate)
    const y = GetUnitY(candidate)
    const reach = contactRadius + context.heroRadius

    // rejected on one axis at a time, before anything is multiplied
    if (RAbsBJ(x - context.toX) > reach && RAbsBJ(x - context.fromX) > reach) {
        return
    }

    if (RAbsBJ(y - context.toY) > reach && RAbsBJ(y - context.fromY) > reach) {
        return
    }

    if (squaredDistanceToStep(context.fromX, context.fromY, context.toX, context.toY, x, y) <= reach * reach) {
        arrayPush(context.touched, candidate)
    }
}

/** Every monster of every active level: several of them can be running at once */
const testLevelMonsters = (context: ContactContext) => {
    getUdgLevels().forAll(level => {
        if (!level.isActivated()) {
            return
        }

        level.monsters.forAll(monster => {
            testCandidate(context, monster.u, monster.getMonsterType()?.getImmolationRadius() ?? 0)
        })
    })
}

/**
 * The temporary monsters, whatever spawned them: a monster spawn, the shot of a caster, or
 * whatever comes next. They are walked from their own registry rather than from what created
 * them, so a new source of them needs nothing here.
 */
const testSpawnedMonsters = (context: ContactContext) => {
    for (const [handleId, spawned] of pairs(udg_spawned_monster_units)) {
        spawned && testCandidate(context, spawned, udg_spawned_monsters[handleId]?.getImmolationRadius() ?? 0)
    }
}

/** The circle a dead ally leaves behind, which revives them when touched */
const testPowerCircles = (context: ContactContext) => {
    getUdgEscapers().forAll(other => {
        if (other === context.escaper) {
            return
        }

        const circle = other.getDummyPowerCircle()

        testCandidate(context, circle, circle ? BlzGetUnitCollisionSize(circle) : 0)
    })
}

const checkEscaperContacts = (escaper: Escaper) => {
    const toX = escaper.getHeroX()
    const toY = escaper.getHeroY()
    const from = lastCheckedPositions[escaper.getId()] ?? { x: toX, y: toY }

    lastCheckedPositions[escaper.getId()] = { x: toX, y: toY }

    const context: ContactContext = {
        escaper,
        fromX: from.x,
        fromY: from.y,
        toX,
        toY,
        heroRadius: escaper.getHeroCollisionSize(),
        touched: [],
    }

    testLevelMonsters(context)
    testSpawnedMonsters(context)
    testPowerCircles(context)

    // Handled once everything has been walked, rather than as each contact is found: a handler
    // can kill a monster, which takes it out of the very tables being read. The handler is the one
    // the immolation called, so that a contact keeps meaning exactly what it meant, and it turns
    // down whatever comes after the hero died by itself.
    for (const touched of context.touched) {
        ServiceManager.getService('InvisUnit_is_getting_damage').onEscaperTouchingUnit(escaper, touched, 0)
    }
}

export const initAsyncContactCheck = () => {
    if (state.isInitialized) {
        return
    }

    state.isInitialized = true

    createTimer(CONTACT_CHECK_PERIOD, true, () => {
        getUdgEscapers().forAll(escaper => {
            // only the machine owning the hero, and only while its effect carries it
            if (escaper.isAsyncControlledHere() && escaper.isAlive()) {
                checkEscaperContacts(escaper)
            }
        })
    })
}
