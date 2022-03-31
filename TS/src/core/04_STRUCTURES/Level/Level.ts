import { Text } from 'core/01_libraries/Text'
import { udg_lives } from 'core/08_GAME/Init_structures/Init_lives'
import { TrigCheckpointReviveHeroes } from './Trig_checkpoint_revive_heroes'
import {MonstersArray} from "../Monster/MonstersArray";
import {VisibilityModifierArray} from "./VisibilityModifierArray";
import {TriggerArray} from "./Triggers";
import {MeteorArray} from "../Meteor/MeteorArray";
import {CasterArray} from "../Caster/CasterArray";
import {ClearMobArray} from "../Monster_properties/ClearMobArray";
import {udg_escapers} from "../../08_GAME/Init_structures/Init_escapers";
import {Escaper} from "../Escaper/Escaper";
import {MonsterType} from "../Monster/MonsterType";
import {CasterType} from "../Caster/CasterType";
import {udg_levels} from "../../08_GAME/Init_structures/Init_struct_levels";
import {VisibilityModifier} from "./VisibilityModifier";


export class Level {
    public static earningLivesActivated = true

    private isActivatedB: boolean
    private startMessage: string
    private livesEarnedAtBeginning: number
    private start: Start
    private end: End
    private triggers: TriggerArray

    visibilities: VisibilityModifierArray
    monsters: MonstersArray
    monsterSpawns: MonsterSpawnArray
    meteors: MeteorArray
    casters: CasterArray
    clearMobs: ClearMobArray

    constructor() {
        this.visibilities = new VisibilityModifierArray()
        this.triggers = new TriggerArray()
        this.monsters = new MonstersArray(this)
        this.monsterSpawns = new MonsterSpawnArray()
        this.meteors = new MeteorArray()
        this.casters = new CasterArray()
        this.clearMobs = new ClearMobArray()
        this.livesEarnedAtBeginning = 1
        this.isActivatedB = false
        this.startMessage = ''
        this.start = new Start()
        this.end = new End()
    }

    activate(activ: boolean) {
        if (this.isActivatedB == activ) return

        this.end.activate(activ)
        this.triggers.activate(activ)

        if (activ) {
            if (this.startMessage && Level.earningLivesActivated) {
                Text.A(this.startMessage)
            }
            this.visibilities.activate(true)
            this.monsters.createMonstersUnits()
            this.monsterSpawns.activate()
            this.meteors.createMeteors()
            this.casters.createCasters()
            this.clearMobs.initializeClearMobs()
            if (Level.earningLivesActivated && this.getId() > 0) {
                udg_lives.add(this.livesEarnedAtBeginning)
            }
        }else{
            this.monsters.removeMonstersUnits()
            this.monsterSpawns.desactivate()
            this.meteors.removeMeteors()
            this.casters.removeCasters()
            udg_escapers.deleteSpecificActionsForLevel(this)
        }

        this.isActivatedB = activ
    }

    checkpointReviveHeroes(finisher: Escaper) {
        TrigCheckpointReviveHeroes_levelForReviving = this
        TrigCheckpointReviveHeroes_revivingFinisher = finisher
        TriggerExecute(TrigCheckpointReviveHeroes.gg_trg____Trig_checkpoint_revive_heroes)
    }

    getStart() {
        return this.start
    }

    getStartRandomX() {
        return this.start.getRandomX()
    }

    getStartRandomY() {
        return this.start.getRandomY()
    }

    newStart(x1: number, y1: number, x2: number, y2: number) {
        this.start.destroy()
        this.start = new Start(x1, y1, x2, y2)
    }

    newEnd(x1: number, y1: number, x2: number, y2: number) {
        this.end.destroy()
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
        this.start.destroy()
        this.end.destroy()
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
        this.casters.refreshCastersOfType(ct)
    }

    removeCastersOfType(ct: CasterType) {
        this.casters.removeCastersOfType(ct)
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
