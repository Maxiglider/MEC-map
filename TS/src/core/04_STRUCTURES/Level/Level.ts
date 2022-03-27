import { Text } from 'core/01_libraries/Text'
import { gg_trg____Trig_checkpoint_revive_heroes } from './Trig_checkpoint_revive_heroes'

//Avec le jass : //todomax handle infinite number of monsters and levels
//nombre maximum de niveaux : 200. Nombre maximum de monstres de chaque type par niveau : 1000.

export class Level {
    public static earningLivesActivated = true

    private isActivatedB: boolean
    private startMessage: string
    private livesEarnedAtBeginning: number
    private start: IStart
    private end: IEnd
    visibilities = VisibilityModifierArray()
    monstersNoMove = MonsterNoMoveArray()
    monstersSimplePatrol = MonsterSimplePatrolArray()
    monstersMultiplePatrols = MonsterMultiplePatrolsArray()
    monstersTeleport = MonsterTeleportArray()
    monsterSpawns = MonsterSpawnArray()
    meteors = MeteorArray()
    casters = CasterArray()
    clearMobs = ClearMobArray()
    private triggers = TriggerArray()

    constructor() {
        this.visibilities = new VisibilityModifierArray()
        this.triggers = new TriggerArray()
        this.monstersNoMove = new MonsterNoMoveArray()
        this.monstersSimplePatrol = new MonsterSimplePatrolArray()
        this.monstersMultiplePatrols = new MonsterMultiplePatrolsArray()
        this.monstersTeleport = new MonsterTeleportArray()
        this.monsterSpawns = new MonsterSpawnArray()
        this.meteors = new MeteorArray()
        this.casters = new CasterArray()
        this.clearMobs = new ClearMobArray()
        this.livesEarnedAtBeginning = 1
        this.isActivatedB = false
        this.startMessage = ''
        this.start = 0
        this.end = 0
    }

    activate(activ: boolean) {
        if (this.isActivatedB == activ) return

        this.end.activate(activ)
        this.triggers.activate(activ)

        if (activ) {
            if (this.startMessage && self.earningLivesActivated) {
                Text.A(this.startMessage)
            }
            this.visibilities.activate(true)
            this.monstersNoMove.createMonsters()
            this.monstersSimplePatrol.createMonsters()
            this.monstersMultiplePatrols.createMonsters()
            this.monstersTeleport.createMonsters()
            this.monsterSpawns.activate()
            this.meteors.createMeteors()
            this.casters.createCasters()
            this.clearMobs.initializeClearMobs()
            if (Level.earningLivesActivated && getId() > 0) {
                udg_lives.add(this.livesEarnedAtBeginning)
            } else this.monstersNoMove.removeMonsters()
            this.monstersSimplePatrol.removeMonsters()
            this.monstersMultiplePatrols.removeMonsters()
            this.monstersTeleport.removeMonsters()
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
        TriggerExecute(gg_trg____Trig_checkpoint_revive_heroes)
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
        let nb = 0
        if (mode == 'all' || mode == 'not moving') {
            nb += this.monstersNoMove.count() + this.casters.count()
        }
        if (mode == 'all' || mode == 'moving') {
            nb += this.monstersSimplePatrol.count() + this.monstersMultiplePatrols.count()
        }
        if (mode == 'all') {
            nb += this.monstersTeleport.count()
        }
        return nb
    }

    destroy() {
        this.start.destroy()
        this.end.destroy()
        this.visibilities.destroy()
        this.triggers.destroy()
        this.monstersNoMove.destroy()
        this.monstersSimplePatrol.destroy()
        this.monstersMultiplePatrols.destroy()
        this.monstersTeleport.destroy()
    }

    recreateMonstersOfType(mt: MonsterType) {
        this.monstersNoMove.recreateMonstersOfType(mt)
        this.monstersSimplePatrol.recreateMonstersOfType(mt)
        this.monstersMultiplePatrols.recreateMonstersOfType(mt)
        this.monstersTeleport.recreateMonstersOfType(mt)
    }

    removeMonstersOfType(mt: MonsterType) {
        this.monstersNoMove.removeMonstersOfType(mt)
        this.monstersSimplePatrol.removeMonstersOfType(mt)
        this.monstersMultiplePatrols.removeMonstersOfType(mt)
        this.monstersTeleport.removeMonstersOfType(mt)
    }

    refreshCastersOfType(ct: CasterType) {
        this.casters.refreshCastersOfType(ct)
    }

    removeCastersOfType(ct: CasterType) {
        this.casters.removeCastersOfType(ct)
    }

    getId() {
        let i = 0
        while (udg_levels.get(i) != 0) {
            if (udg_levels.get(i) == this) {
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
