import { arrayPush } from 'core/01_libraries/Basic_functions'
import { Text } from 'core/01_libraries/Text'
import { ServiceManager } from 'Services'
import { getUdgEscapers } from '../../../../globals'
import { ObjectHandler } from '../../../Utils/ObjectHandler'
import { MecHookArray } from '../../API/MecHookArray'
import type { CasterType } from '../Caster/CasterType'
import type { Escaper } from '../Escaper/Escaper'
import { MeteorArray } from '../Meteor/MeteorArray'
import { MonsterArray } from '../Monster/MonsterArray'
import type { MonsterType } from '../Monster/MonsterType'
import { MonsterSpawnArray } from '../MonsterSpawn/MonsterSpawnArray'
import { CircleMobArray } from '../Monster_properties/CircleMobArray'
import { ClearMobArray } from '../Monster_properties/ClearMobArray'
import { PortalMobArray } from '../Monster_properties/PortalMobArray'
import { checkPointReviveHeroes } from './checkpointReviveHeroes_function'
import { End, Start } from './StartAndEnd'
import { StaticSlideArray } from './StaticSlideArray'
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
    private lights: lightning[] = []
    debugRegionsVisible = false

    visibilities: VisibilityModifierArray
    monsters: MonsterArray
    monsterSpawns: MonsterSpawnArray
    meteors: MeteorArray
    clearMobs: ClearMobArray
    portalMobs: PortalMobArray
    circleMobs: CircleMobArray
    staticSlides: StaticSlideArray

    //hooks
    public hooks_onStart = new MecHookArray()
    public hooks_onEnd = new MecHookArray()

    constructor() {
        this.visibilities = new VisibilityModifierArray(this)
        this.triggers = new TriggerArray()
        this.monsters = new MonsterArray(this)
        this.monsterSpawns = new MonsterSpawnArray(this)
        this.meteors = new MeteorArray(this)
        this.clearMobs = new ClearMobArray(this)
        this.portalMobs = new PortalMobArray(this)
        this.circleMobs = new CircleMobArray(this)
        this.staticSlides = new StaticSlideArray(this)
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
            this.circleMobs.initializeCircleMobs()
            this.staticSlides.activate(true)
            if (Level.earningLivesActivated && this.getId() > 0) {
                ServiceManager.getService('Lives').add(this.livesEarnedAtBeginning)
            }

            if (this.hooks_onStart) {
                for (const hook of this.hooks_onStart.getHooks()) {
                    hook.execute(this)
                }
            }
        } else {
            this.monsters.removeMonstersUnits()
            this.monsterSpawns.deactivate()
            this.meteors.removeMeteorsItems()
            this.staticSlides.activate(false)
            getUdgEscapers().deleteSpecificActionsForLevel(this)

            if (this.hooks_onEnd) {
                for (const hook of this.hooks_onEnd.getHooks()) {
                    hook.execute(this)
                }
            }
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

        this.updateDebugRegions()
    }

    newStartFromJson(data: { [x: string]: number }) {
        this.newStart(data.minX, data.minY, data.maxX, data.maxY)
    }

    newEnd(x1: number, y1: number, x2: number, y2: number) {
        this.end && this.end.destroy()
        this.end = new End(x1, y1, x2, y2)
        if (this.isActivatedB) {
            this.end.activate(true)
        }

        this.updateDebugRegions()
    }

    newEndFromJson(data: { [x: string]: number }) {
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
        this.monsterSpawns.destroy()
        this.destroyDebugRegions()
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

    updateDebugRegions = () => {
        this.destroyDebugRegions()

        if (this.debugRegionsVisible) {
            this.start && this.drawRegion(this.start.minX, this.start.minY, this.start.maxX, this.start.maxY)
            this.end && this.drawRegion(this.end.minX, this.end.minY, this.end.maxX, this.end.maxY)

            for (const [_, staticSlide] of pairs(this.staticSlides.getAll())) {
                this.drawRegion(staticSlide.getX1(), staticSlide.getY1(), staticSlide.getX2(), staticSlide.getY2())
                this.drawRegion(staticSlide.getX3(), staticSlide.getY3(), staticSlide.getX4(), staticSlide.getY4())
            }

            for (const [_, monsterSpawn] of pairs(this.monsterSpawns.getAll())) {
                this.drawRegion(
                    monsterSpawn.getMinX(),
                    monsterSpawn.getMinY(),
                    monsterSpawn.getMaxX(),
                    monsterSpawn.getMaxY()
                )
            }
        }
    }

    setDebugRegionsVisible = (active: boolean) => {
        this.debugRegionsVisible = active
        this.updateDebugRegions()
    }

    drawRegion = (x1: number, y1: number, x2: number, y2: number) => {
        this.drawLine(x1, y1, x1, y2)
        this.drawLine(x1, y1, x2, y1)
        this.drawLine(x2, y2, x1, y2)
        this.drawLine(x2, y2, x2, y1)
    }

    drawLine = (x1: number, y1: number, x2: number, y2: number) => {
        const light = AddLightning('DRAM', false, x1, y1, x2, y2)
        arrayPush(this.lights, light)
    }

    destroyDebugRegions = () => {
        for (const light of this.lights) {
            DestroyLightning(light)
        }

        this.lights.length = 0
    }

    toJson = () => {
        const json = ObjectHandler.getNewObject<any>()

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

        //circleMobs
        json.circleMobs = this.circleMobs.toJson()

        //staticSlides
        json.staticSlides = this.staticSlides.toJson()

        return json
    }
}
