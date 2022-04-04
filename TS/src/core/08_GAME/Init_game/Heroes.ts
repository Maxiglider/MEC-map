import { NB_ESCAPERS } from 'core/01_libraries/Constants'
import { udg_doubleHeroesEnabled } from 'core/Double_heroes/double_heroes_config'
import { createEvent } from 'Utils/mapUtils'
import { getUdgEscapers } from '../../../../globals'

let startPositions: location[] = []
let startPositionsRandomized: location[] = []
let playerIdsRandomized: number[] = []

export const HERO_START_ANGLE = 90

const TIME_BEFORE_HERO_SPAWN = 3
const TIME_BETWEEN_EACH_HERO_SPAWN = 0.3
const EFFECT_FOR_MISSING_HEROES = 'Abilities\\Spells\\Undead\\DeathPact\\DeathPactTarget.mdl'
const NB_COLUMNS = 4
const NB_ROWS = 3

const RandomizeStartPositionsAndHeroSpawnOrder = () => {
    let alreadyAdded: boolean[] = []
    let n: number
    let i: number

    //randomize start positions
    i = 0
    while (true) {
        if (i >= NB_ESCAPERS) break
        while (true) {
            n = GetRandomInt(0, NB_ESCAPERS - 1)
            if (!alreadyAdded[n]) break
        }
        startPositionsRandomized[i] = startPositions[n]
        alreadyAdded[n] = true
        i = i + 1
    }

    //reinit alreadyAdded to false
    i = 0
    while (true) {
        if (i >= NB_ESCAPERS) break
        alreadyAdded[i] = false
        i = i + 1
    }

    //randomize hero spawn order
    i = 0
    while (true) {
        if (i >= 12) break
        while (true) {
            n = GetRandomInt(0, 11)
            if (!alreadyAdded[n]) break
        }
        playerIdsRandomized[i] = n
        alreadyAdded[n] = true
        i = i + 1
    }

    if (udg_doubleHeroesEnabled) {
        while (true) {
            if (i >= NB_ESCAPERS) break
            while (true) {
                n = GetRandomInt(12, NB_ESCAPERS - 1)
                if (!alreadyAdded[n]) break
            }
            playerIdsRandomized[i] = n
            alreadyAdded[n] = true
            i = i + 1
        }
    }
}

const Trig_heroes_Actions = () => {
    let alreadyAdded: boolean[] = []
    let anEffect: effect | null
    let i: number
    let n: number

    //randomize start positions
    RandomizeStartPositionsAndHeroSpawnOrder()

    //create heroes
    ClearSelection()
    i = 0
    while (true) {
        if (i >= NB_ESCAPERS) break
        n = playerIdsRandomized[i]
        if (getUdgEscapers().get(n)) {
            getUdgEscapers()
                .get(n)
                ?.createHero(
                    GetLocationX(startPositionsRandomized[n]),
                    GetLocationY(startPositionsRandomized[n]),
                    HERO_START_ANGLE
                )
        } else {
            anEffect = AddSpecialEffectLoc(EFFECT_FOR_MISSING_HEROES, startPositionsRandomized[n])
            DestroyEffect(anEffect)
        }
        ;(startPositionsRandomized[n] as any) = null
        TriggerSleepAction(TIME_BETWEEN_EACH_HERO_SPAWN)
        i = i + 1
    }
    //call EnableTrigger(gg_trg_anticheat_teleport_and_revive)
    //AnticheatTeleport_justRevived = true
    anEffect = null
}

//===========================================================================
export const init_Heroes = () => {
    //define start positions
    let minX = GetRectMinX(gg_rct_departLvl_0)
    let minY = GetRectMinY(gg_rct_departLvl_0)
    let diffX = (GetRectMaxX(gg_rct_departLvl_0) - minX) / (NB_COLUMNS - 1)
    let diffY = (GetRectMaxY(gg_rct_departLvl_0) - minY) / (NB_ROWS - 1)
    let x = 0
    let y = 0
    let n = 0
    let spawnPeriod = TIME_BEFORE_HERO_SPAWN

    if (udg_doubleHeroesEnabled) {
        spawnPeriod = spawnPeriod / 2
    }

    while (true) {
        if (y > NB_ROWS - 1) break
        while (true) {
            if (x > NB_COLUMNS - 1) break
            startPositions[n] = Location(minX + diffX * x, minY + diffY * y)
            n = n + 1
            x = x + 1
        }
        x = 0
        y = y + 1
    }

    if (udg_doubleHeroesEnabled) {
        x = 0
        y = 0
        while (true) {
            if (y > NB_ROWS - 1) break
            while (true) {
                if (x > NB_COLUMNS - 1) break
                startPositions[n] = Location(minX + diffX * x, minY + diffY * y)
                n = n + 1
                x = x + 1
            }
            x = 0
            y = y + 1
        }
    }

    createEvent({
        events: [t => TriggerRegisterTimerEvent(t, spawnPeriod, false)],
        actions: [() => Trig_heroes_Actions()],
    })
}
