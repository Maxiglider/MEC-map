import { Text } from 'core/01_libraries/Text'
import { udg_lives } from 'core/08_GAME/Init_structures/Init_lives'
 import { udg_escapers } from '../../../../globals'
import { udg_levels } from '../../08_GAME/Init_structures/Init_struct_levels'
import type { CasterType } from '../Caster/CasterType'
import type { Escaper } from '../Escaper/Escaper'
import { MeteorArray } from '../Meteor/MeteorArray'
import { MonsterArray } from '../Monster/MonsterArray'
import type { MonsterType } from '../Monster/MonsterType'
import { MonsterSpawnArray } from '../MonsterSpawn/MonsterSpawnArray'
import { ClearMobArray } from '../Monster_properties/ClearMobArray'
import { checkPointReviveHeroes } from './checkpointReviveHeroes_function'
import { End, Start } from './StartAndEnd'
import { TriggerArray } from './Triggers'
import type { VisibilityModifier } from './VisibilityModifier'
import { VisibilityModifierArray } from './VisibilityModifierArray'

export class Level {
    public static earningLivesActivated = true

    private isActivatedB: boolean
    private startMessage: string
    private livesEarnedAtBeginning: number
    private start?: Start
    private end?: End
    private triggers: TriggerArray

    visibilities: VisibilityModifierArray
    monsters: MonsterArray
    monsterSpawns: MonsterSpawnArray
    meteors: MeteorArray
    clearMobs: ClearMobArray

    constructor() {
        this.visibilities = new VisibilityModifierArray(this)
        this.triggers = new TriggerArray()
        this.monsters = new MonsterArray(this)
        this.monsterSpawns = new MonsterSpawnArray(this)
        this.meteors = new MeteorArray(this)
        this.clearMobs = new ClearMobArray(this)
        this.livesEarnedAtBeginning = 1
        this.isActivatedB = false
        this.startMessage = ''
    }

    activate(activ: boolean) {
        if (this.isActivatedB == activ) return

        this.end && this.end.activate(activ)
        this.triggers.activate(activ)

        if (activ) {
            if (this.startMessage && Level.earningLivesActivated) {
                Text.A(this.startMessage)
            }
            this.visibilities.activate(true)
            this.monsters.createMonstersUnits()
            this.monsterSpawns.activate()
            this.meteors.createMeteorsItems()
            this.clearMobs.initializeClearMobs()
            if (Level.earningLivesActivated && this.getId() > 0) {
                udg_lives.add(this.livesEarnedAtBeginning)
            }
        } else {
            this.monsters.removeMonstersUnits()
            this.monsterSpawns.deactivate()
            this.meteors.removeMeteorsItems()
            udg_escapers.deleteSpecificActionsForLevel(this)
        }

        this.isActivatedB = activ
    }

    checkpointReviveHeroes(finisher: Escaper | undefined) {
        checkPointReviveHeroes(this, finisher)
    }

    getStart() {
        return this.start
    }

    getStartRandomX() {
        return this.start ? this.start.getRandomX() : 0
    }

    getStartRandomY() {
        return this.start ? this.start.getRandomY() : 0
    }

    newStart(x1: number, y1: number, x2: number, y2: number) {
        this.start && this.start.destroy()
        this.start = new Start(x1, y1, x2, y2)
    }

    newEnd(x1: number, y1: number, x2: number, y2: number) {
        this.end && this.end.destroy()
        this.end = new End(x1, y1, x2, y2)
        if (this.isActivatedB) {
            this.end.activate(true)
        }
    }

    getEnd() {
        return this.end
    }

    getNbMonsters(mode: string) {
        //modes : all, moving, not moving
        return this.monsters.count(mode)
    }

    destroy() {
        this.start && this.start.destroy()
        this.end && this.end.destroy()
        this.visibilities.destroy()
        this.triggers.destroy()
        this.monsters.destroy()
        //todomax destroy spawns missing ?
    }

    recreateMonstersUnitsOfType(mt: MonsterType) {
        this.monsters.recreateMonstersUnitsOfType(mt)
    }

    clearMonstersOfType(mt: MonsterType) {
        this.monsters.clearMonstersOfType(mt)
    }

    refreshCastersOfType(ct: CasterType) {
        this.monsters.refreshCastersOfType(ct)
    }

    removeCastersOfType(ct: CasterType) {
        this.monsters.removeCastersOfType(ct)
    }

    getId() {
        let i = 0
        while (udg_levels.get(i)) {
            if (udg_levels.get(i) === this) {
                return i
            }
            i++
        }
        return -1
    }

    isActivated() {
        return this.isActivatedB
    }

    setIsActivated(activated: boolean) {
        this.isActivatedB = activated
    }

    setNbLivesEarned(nbLives: number) {
        if (nbLives < 0) {
            return false
        }
        this.livesEarnedAtBeginning = nbLives
        return true
    }

    getNbLives() {
        return this.livesEarnedAtBeginning
    }

    newVisibilityModifier(x1: number, y1: number, x2: number, y2: number) {
        return this.visibilities.new(x1, y1, x2, y2)
    }

    newVisibilityModifierFromExisting(vm: VisibilityModifier) {
        return this.visibilities.newFromExisting(vm)
    }

    removeVisibilities() {
        this.visibilities.removeAllVisibilityModifiers()
    }

    activateVisibilities(activate: boolean) {
        this.visibilities.activate(activate)
    }

    setStartMessage(str: string) {
        this.startMessage = str
    }

    getStartMessage() {
        return this.startMessage
    }
}
