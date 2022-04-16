import { Text } from 'core/01_libraries/Text'
import { ServiceManager } from 'Services'
import { getUdgEscapers } from '../../../../globals'
import type { CasterType } from '../Caster/CasterType'
import type { Escaper } from '../Escaper/Escaper'
import { MeteorArray } from '../Meteor/MeteorArray'
import { MonsterArray } from '../Monster/MonsterArray'
import type { MonsterType } from '../Monster/MonsterType'
import { MonsterSpawnArray } from '../MonsterSpawn/MonsterSpawnArray'
import { ClearMobArray } from '../Monster_properties/ClearMobArray'
import { PortalMobArray } from '../Monster_properties/PortalMobArray'
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
    public id: number = -1

    visibilities: VisibilityModifierArray
    monsters: MonsterArray
    monsterSpawns: MonsterSpawnArray
    meteors: MeteorArray
    clearMobs: ClearMobArray
    portalMobs: PortalMobArray

    constructor() {
        this.visibilities = new VisibilityModifierArray(this)
        this.triggers = new TriggerArray()
        this.monsters = new MonsterArray(this)
        this.monsterSpawns = new MonsterSpawnArray(this)
        this.meteors = new MeteorArray(this)
        this.clearMobs = new ClearMobArray(this)
        this.portalMobs = new PortalMobArray(this)
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
            this.portalMobs.initializePortalMobs()
            if (Level.earningLivesActivated && this.getId() > 0) {
                ServiceManager.getService('Lives').add(this.livesEarnedAtBeginning)
            }
        } else {
            this.monsters.removeMonstersUnits()
            this.monsterSpawns.deactivate()
            this.meteors.removeMeteorsItems()
            getUdgEscapers().deleteSpecificActionsForLevel(this)
        }

        this.isActivatedB = activ
    }

    checkpointReviveHeroes(finisher: Escaper | undefined) {
        checkPointReviveHeroes(this, finisher)
    }

    getStart = () => {
        return this.start
    }

    getStartRandomX = () => {
        return this.start ? this.start.getRandomX() : 0
    }

    getStartRandomY = () => {
        return this.start ? this.start.getRandomY() : 0
    }

    newStart(x1: number, y1: number, x2: number, y2: number) {
        this.start && this.start.destroy()
        this.start = new Start(x1, y1, x2, y2)
    }

    newStartFromJson(data: {[x: string]: number}){
        this.newStart(data.minX, data.minY, data.maxX, data.maxY)
    }

    newEnd(x1: number, y1: number, x2: number, y2: number) {
        this.end && this.end.destroy()
        this.end = new End(x1, y1, x2, y2)
        if (this.isActivatedB) {
            this.end.activate(true)
        }
    }

    newEndFromJson(data: {[x: string]: number}){
        this.newEnd(data.minX, data.minY, data.maxX, data.maxY)
    }

    getEnd = () => {
        return this.end
    }

    getNbMonsters(mode: string) {
        //modes : all, moving, not moving
        return this.monsters.count(mode)
    }

    destroy = () => {
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

    getId = () => {
        return this.id
    }

    isActivated = () => {
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

    getNbLives = () => {
        return this.livesEarnedAtBeginning
    }

    newVisibilityModifier(x1: number, y1: number, x2: number, y2: number) {
        return this.visibilities.new(x1, y1, x2, y2)
    }

    newVisibilityModifierFromExisting(vm: VisibilityModifier) {
        return this.visibilities.newFromExisting(vm)
    }

    removeVisibilities = () => {
        this.visibilities.removeAllVisibilityModifiers()
    }

    activateVisibilities(activate: boolean) {
        this.visibilities.activate(activate)
    }

    setStartMessage(str: string) {
        this.startMessage = str
    }

    getStartMessage = () => {
        return this.startMessage
    }

    toJson = () => {
        const json: { [x: string]: any } = {}

        //level id
        json.id = this.id

        //start message
        if (this.getStartMessage() != null && this.getStartMessage() != '') {
            json.startMessage = this.getStartMessage()
        }

        //nb lives earned
        json.nbLives = this.getNbLives()

        //start
        json.start = this.getStart()?.toJson()

        //end
        json.end = this.getEnd()?.toJson()

        //visibilities
        json.visibilities = this.visibilities.toJson()

        //monsters
        json.monsters = this.monsters.toJson()

        //monsterSpawns
        json.monsterSpawns = this.monsterSpawns.toJson()

        //meteors
        json.meteors = this.meteors.toJson()

        //clearMobs
        json.clearMobs = this.clearMobs.toJson()

        //portalMobs
        json.portalMobs = this.portalMobs.toJson()

        return json
    }
}
