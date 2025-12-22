import { MonsterNoMove } from './MonsterNoMove'
import { String2Ascii } from '../../01_libraries/Ascii'
import { MonsterType } from './MonsterType'
import {getUdgMonsterTypes, globals, udg_monsters } from '../../../../globals'
import { Escaper } from '../Escaper/Escaper'
import { RunSoundOnUnit } from '../../02_bibliotheques_externes/SoundUtils'
import { createTimer } from '../../../Utils/mapUtils'
import {ServiceManager} from "../../../Services";

const BOOK_OF_LIVE_UNIT_ID = String2Ascii('ubol') // todo add a book of life unit 'ubol' in the MEC base map
const BOOK_OF_LIVE_SCALE = 1
const BOOK_OF_LIFE_IMMO_RADIUS = 60
const BOOK_OF_LIFE_IMMO_MOVE_SPEED = 200 // mandatory even if useless
const LIVES_EARNED_SOUND_PATH = 'Sound/Interface/SecretFound.wav'
const LIVES_EARNED_SOUND_DURATION = 2525
const MONSTER_TYPE_LABEL = 'bookOfLife'

export class BookOfLife extends MonsterNoMove {
    private static mt?: MonsterType
    private livesEarned = false
    private escapersWhoJustReached: Set<Escaper> = new Set()

    static getMonsterType(): MonsterType {
        if (!this.mt) {
            // Generate a monster type by default
            this.mt = getUdgMonsterTypes().getByLabel(MONSTER_TYPE_LABEL) || undefined

            if(!this.mt){
                this.mt = getUdgMonsterTypes().new(
                    'bookOfLife',
                    BOOK_OF_LIVE_UNIT_ID,
                    BOOK_OF_LIVE_SCALE,
                    BOOK_OF_LIFE_IMMO_RADIUS,
                    BOOK_OF_LIFE_IMMO_MOVE_SPEED,
                    false
                )
            }
        }

        return this.mt
    }

    constructor(x: number, y: number, angle: number, forceId: number | null = null) {
        super(BookOfLife.getMonsterType(), x, y, angle, forceId)
    }

    static count = () => {
        let n = 0

        for (const [_, monster] of pairs(udg_monsters)) {
            if (monster instanceof BookOfLife) {
                n++
            }
        }

        return n
    }

    createUnit() {
        super.createUnit()
        this.livesEarned = false
    }

    onEscaperReachingBookOfLife(escaper: Escaper) {
        if (this.escapersWhoJustReached.has(escaper)) {
            return
        }
        this.escapersWhoJustReached.add(escaper)

        if (globals.bookOfLifeMinimumSurviveTime <= 0) {
            this.triggerEscaperEarningLives(escaper)
        } else {
            const MEC_core_API = ServiceManager.getService('MEC_core_API')

            const timer = createTimer(globals.bookOfLifeMinimumSurviveTime, false, () => {
                this.triggerEscaperEarningLives(escaper)
                timer.destroy()
                MEC_core_API.destroyHook(hookId)
            })
            const hookId = MEC_core_API.onEscaperDeath(() => {
                timer.destroy()
                this.escapersWhoJustReached.delete(escaper)
            })
        }
    }

    triggerEscaperEarningLives(escaper: Escaper) {
        this.escapersWhoJustReached.delete(escaper)

        if (this.livesEarned) {
            return
        }
        this.livesEarned = true

        const heroUnit = escaper.getHero()
        heroUnit && RunSoundOnUnit(LIVES_EARNED_SOUND_PATH, LIVES_EARNED_SOUND_DURATION, heroUnit)

        escaper.addLives(globals.bookOfLifeNbLivesEarned)

        this.removeUnit()
    }
}
