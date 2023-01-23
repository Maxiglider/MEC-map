import { NB_ESCAPERS, NB_LIVES_AT_BEGINNING, NB_PLAYERS_MAX } from 'core/01_libraries/Constants'
import { Text } from 'core/01_libraries/Text'
import { gg_trg_apparition_dialogue_et_fermeture_automatique } from 'core/08_GAME/Mode_coop/creation_dialogue'
import { ServiceManager } from 'Services'
import { getUdgCasterTypes, getUdgEscapers, getUdgMonsterTypes, getUdgTerrainTypes, globals } from '../../../../globals'
import { udg_colorCode } from '../../01_libraries/Init_colorCodes'
import { BaseArray } from '../BaseArray'
import { Caster } from '../Caster/Caster'
import type { CasterType } from '../Caster/CasterType'
import { Escaper } from '../Escaper/Escaper'
import type { MeteorArray } from '../Meteor/MeteorArray'
import { Monster } from '../Monster/Monster'
import type { MonsterArray } from '../Monster/MonsterArray'
import { MonsterMultiplePatrols } from '../Monster/MonsterMultiplePatrols'
import { MonsterNoMove } from '../Monster/MonsterNoMove'
import { MonsterSimplePatrol } from '../Monster/MonsterSimplePatrol'
import { MonsterTeleport } from '../Monster/MonsterTeleport'
import type { MonsterType } from '../Monster/MonsterType'
import type { MonsterSpawnArray } from '../MonsterSpawn/MonsterSpawnArray'
import type { ClearMobArray } from '../Monster_properties/ClearMobArray'
import { isDeathTerrain, isSlideTerrain } from '../TerrainType/TerrainType'
import { Level } from './Level'
import { sameLevelProgression } from './LevelProgression'
import { IsLevelBeingMade } from './Level_functions'
import type { VisibilityModifierArray } from './VisibilityModifierArray'

const MIN_TIME_BETWEEN_GOTNL = 0.05

type ILevelProgression = 'all' | 'allied' | 'solo'

export class LevelArray extends BaseArray<Level> {
    private currentLevel: number
    private tLastGoToNextLevel?: timer

    private noobEdit = false
    private speedEdit = false

    private modeState: {
        noobEdit: {
            active: boolean
            lives: number
            autoreviveDelay: number | undefined
            terrains: { [label: string]: { timeToKill: number } }
        }
        speedEdit: { active: boolean; terrains: { [label: string]: { slideSpeed: number; rotationSpeed: number } } }
    } = {
        noobEdit: { active: false, lives: 0, autoreviveDelay: undefined, terrains: {} },
        speedEdit: { active: false, terrains: {} },
    }

    private levelProgression: ILevelProgression = 'all'

    levelProgressionState: { [escaperId: number]: number } = {}

    constructor() {
        super(true)
        let x1 = GetRectMinX(gg_rct_departLvl_0)
        let y1 = GetRectMinY(gg_rct_departLvl_0)
        let x2 = GetRectMaxX(gg_rct_departLvl_0)
        let y2 = GetRectMaxY(gg_rct_departLvl_0)

        this.data[0] = new Level()
        this.data[0].id = 0
        this.data[0].newStart(x1, y1, x2, y2)
        this.data[0].setNbLivesEarned(NB_LIVES_AT_BEGINNING)
        this.lastInstanceId++

        ServiceManager.getService('Lives').initLives()

        this.currentLevel = 0

        for (let i = 0; i < NB_PLAYERS_MAX; i++) {
            this.levelProgressionState[i] = 0
        }
    }

    hasPlayersInLevel = (lvlId: number) => {
        let j = 0

        for (let i = 0; i < NB_PLAYERS_MAX; i++) {
            const p = Player(i)

            if (
                this.levelProgressionState[i] === lvlId &&
                GetPlayerController(p) === MAP_CONTROL_USER &&
                GetPlayerSlotState(p) === PLAYER_SLOT_STATE_PLAYING
            ) {
                j++
            }
        }

        return j > 0
    }

    refreshCurrentLevel = () => {
        this.data[this.currentLevel].activate(false)
        this.data[this.currentLevel].activate(true)
    }

    goToLevel = (finisher: Escaper | undefined, levelId: number): boolean => {
        let i: number
        let previousLevelId = this.getCurrentLevel(finisher).id

        if (levelId < 0 || levelId > this.lastInstanceId || levelId === this.currentLevel) {
            return false
        }

        this.currentLevel = levelId

        for (let i = 0; i < NB_PLAYERS_MAX; i++) {
            if (!finisher || (getUdgEscapers().get(i) && sameLevelProgression(finisher, getUdgEscapers().get(i)!))) {
                this.levelProgressionState[i] = levelId
            }
        }

        if (
            previousLevelId > -1 &&
            !IsLevelBeingMade(this.data[previousLevelId]) &&
            !this.hasPlayersInLevel(previousLevelId)
        ) {
            getUdgEscapers().destroyMakesIfForSpecificLevel_currentLevel()
            // TODO; deactivate all loaded lvls
            this.data[previousLevelId].activate(false)
        }

        this.data[this.currentLevel].activate(true)
        this.data[this.currentLevel].checkpointReviveHeroes(finisher)

        if (levelId > previousLevelId + 1) {
            i = previousLevelId + 1
            while (true) {
                if (i >= levelId) break
                this.data[i].activateVisibilities(true)
                i = i + 1
            }
        } else {
            if (levelId < previousLevelId) {
                i = levelId + 1
                while (true) {
                    if (i > previousLevelId) break
                    this.data[i].activateVisibilities(false)
                    i = i + 1
                }
            }
        }

        this.moveCamToStart(this.data[levelId], finisher)

        return true
    }

    goToNextLevel = (finisher?: Escaper): boolean => {
        if (this.getCurrentLevel(finisher).id >= this.lastInstanceId) {
            return false
        }

        //check a goToNextLevel wasn't just made
        if (this.tLastGoToNextLevel && TimerGetElapsed(this.tLastGoToNextLevel) < MIN_TIME_BETWEEN_GOTNL) {
            return false
        }

        if (!this.tLastGoToNextLevel) this.tLastGoToNextLevel = CreateTimer()
        TimerStart(this.tLastGoToNextLevel, 10, false, DoNothing)

        this.currentLevel = this.getCurrentLevel(finisher).id + 1

        for (let i = 0; i < NB_PLAYERS_MAX; i++) {
            if (!finisher || (getUdgEscapers().get(i) && sameLevelProgression(finisher, getUdgEscapers().get(i)!))) {
                this.levelProgressionState[i] = this.currentLevel
            }
        }

        if (!IsLevelBeingMade(this.data[this.currentLevel - 1]) && !this.hasPlayersInLevel(this.currentLevel - 1)) {
            getUdgEscapers().destroyMakesIfForSpecificLevel_currentLevel()
            // TODO; deactivate all loaded lvls
            this.data[this.currentLevel - 1].activate(false)
        }
        this.data[this.currentLevel].activate(true)
        this.data[this.currentLevel].checkpointReviveHeroes(finisher)

        if (this.moveCamToStart(this.data[this.currentLevel], finisher) && finisher) {
            Text.A(udg_colorCode[finisher.getColorId()] + 'Good job ' + finisher.getDisplayName() + ' !')
        }

        return true
    }

    moveCamToStart(level: Level, finisher: Escaper | undefined) {
        const start = level.getStart()

        if (start) {
            const xCam = start.getCenterX()
            const yCam = start.getCenterY()

            if (finisher) {
                let x = xCam
                let y = yCam

                if (GetLocalPlayer() === finisher.getPlayer()) {
                    x = GetCameraTargetPositionX()
                    y = GetCameraTargetPositionY()
                }

                for (const [_, escaper] of pairs(getUdgEscapers().getAll())) {
                    if (!finisher || sameLevelProgression(finisher, escaper)) {
                        SetCameraPositionForPlayer(escaper.getPlayer(), x, y)
                    }
                }
            } else {
                for (const [_, escaper] of pairs(getUdgEscapers().getAll())) {
                    if (!finisher || sameLevelProgression(finisher, escaper)) {
                        SetCameraPositionForPlayer(escaper.getPlayer(), xCam, yCam)
                    }
                }
            }

            for (const [_, escaper] of pairs(getUdgEscapers().getAll())) {
                if (!finisher || sameLevelProgression(finisher, escaper)) {
                    if (escaper.isLockCamTarget()) {
                        escaper.resetCamera()
                    }
                }
            }

            return true
        } else {
            return false
        }
    }

    restartTheGame = () => {
        if (this.currentLevel === 0) {
            this.currentLevel = -1 //to assure level changing
            this.data[0].activate(false)
        }
        this.goToLevel(undefined, 0)
        ServiceManager.getService('Lives').setNb(this.data[0].getNbLives())

        const start = this.data[0].getStart()
        start && SetCameraPosition(start.getCenterX(), start.getCenterY())

        for (const [_, escaper] of pairs(getUdgEscapers().getAll())) {
            if (escaper.isLockCamTarget()) {
                escaper.resetCamera()
            }
        }

        //coop
        TriggerExecute(gg_trg_apparition_dialogue_et_fermeture_automatique)
    }

    new = () => {
        const lvl = new Level()
        const id = this._new(lvl)
        lvl.id = id
        return lvl
    }

    newFromJson = (levelsJson: { [x: string]: any }[]) => {
        if (levelsJson.length > 0) {
            this.destroyLastLevel(true)
        }

        for (let levelJson of levelsJson) {
            const level = this.new()

            //start message
            if (levelJson.startMessage) {
                level.setStartMessage(levelJson.startMessage)
            }

            //nb lives earned
            if (levelJson.nbLives) {
                level.setNbLivesEarned(levelJson.nbLives)
            }

            //start
            if (levelJson.start) {
                level.newStartFromJson(levelJson.start)
            } else if (levelJson.id == 0) {
                const x1 = GetRectMinX(gg_rct_departLvl_0)
                const y1 = GetRectMinY(gg_rct_departLvl_0)
                const x2 = GetRectMaxX(gg_rct_departLvl_0)
                const y2 = GetRectMaxY(gg_rct_departLvl_0)
                level.newStart(x1, y1, x2, y2)
            }

            //end
            if (levelJson.end) {
                level.newEndFromJson(levelJson.end)
            }

            //visibilities
            if (levelJson.visibilities) {
                level.visibilities.newFromJson(levelJson.visibilities)
            }

            //monsters
            if (levelJson.monsters) {
                for (let m of levelJson.monsters) {
                    let monster: Monster | null = null

                    if (m.monsterClassName == 'Caster') {
                        const ct = getUdgCasterTypes().getByLabel(m.casterTypeLabel)

                        if (!ct) {
                            Text.erA(`Caster type "${m.casterTypeLabel}" unknown`)
                        } else {
                            monster = new Caster(ct, m.x, m.y, m.angle, m.id)
                        }
                    } else {
                        const mt = getUdgMonsterTypes().getByLabel(m.monsterTypeLabel)

                        if (!mt) {
                            Text.erA(`Monster label "${m.monsterTypeLabel}" unknown`)
                        } else {
                            if (m.monsterClassName == 'MonsterNoMove') {
                                monster = new MonsterNoMove(mt, m.x, m.y, m.angle, m.id)
                            } else if (m.monsterClassName == 'MonsterSimplePatrol') {
                                monster = new MonsterSimplePatrol(mt, m.x1, m.y1, m.x2, m.y2, m.id)
                            } else if (m.monsterClassName == 'MonsterMultiplePatrols') {
                                for (const [n, x] of pairs(m.xArr)) {
                                    const y = m.yArr[n]
                                    MonsterMultiplePatrols.storeNewLoc(x, y)
                                }
                                monster = new MonsterMultiplePatrols(mt, m.mode, m.id)
                            } else if (m.monsterClassName == 'MonsterTeleport') {
                                for (const [n, x] of pairs(m.xArr)) {
                                    const y = m.yArr[n]
                                    MonsterTeleport.storeNewLoc(x, y)
                                }
                                monster = new MonsterTeleport(mt, m.period, m.angle, m.mode, m.id)
                            }
                        }
                    }

                    if (monster) {
                        m.jumpPad && monster.setJumpPad(m.jumpPad)

                        level.monsters.new(monster, false)
                    }
                }
            }

            //monster spawns
            if (levelJson.monsterSpawns) {
                level.monsterSpawns.newFromJson(levelJson.monsterSpawns)
            }

            //meteors
            if (levelJson.meteors) {
                level.meteors.newFromJson(levelJson.meteors)
            }

            //clearMobs
            if (levelJson.clearMobs) {
                level.clearMobs.newFromJson(levelJson.clearMobs)
            }

            //portalMobs
            if (levelJson.portalMobs) {
                level.portalMobs.newFromJson(levelJson.portalMobs)
            }

            //circles
            if (levelJson.circleMobs) {
                level.circleMobs.newFromJson(levelJson.circleMobs)
            }

            //staticSlides
            if (levelJson.staticSlides) {
                level.staticSlides.newFromJson(levelJson.staticSlides)
            }
        }
    }

    destroyLastLevel = (forceDelete0: boolean = false): boolean => {
        const maxLevelIdToDelete = forceDelete0 ? 0 : 1
        if (this.lastInstanceId < maxLevelIdToDelete) {
            return false
        }
        this.data[this.lastInstanceId].destroy()
        delete this.data[this.lastInstanceId]
        this.lastInstanceId = this.lastInstanceId - 1
        return true
    }

    getCurrentLevel = (escaper?: Escaper): Level => {
        if (this.levelProgression === 'all' || !escaper) {
            return this.data[this.currentLevel]
        } else {
            return this.data[this.levelProgressionState[escaper.getId()]]
        }
    }

    getLevelFromMonsterArray = (ma: MonsterArray) => {
        return ma.getLevel()
    }

    getLevelFromMonsterSpawnArray = (msa: MonsterSpawnArray) => {
        let i = 0
        while (true) {
            if (i > this.lastInstanceId || this.data[i].monsterSpawns == msa) break
            i = i + 1
        }
        if (i > this.lastInstanceId) {
            return null
        }
        return this.data[i]
    }

    getLevelFromMeteorArray = (ma: MeteorArray) => {
        let i = 0
        while (true) {
            if (i > this.lastInstanceId || this.data[i].meteors == ma) break
            i = i + 1
        }
        if (i > this.lastInstanceId) {
            return null
        }
        return this.data[i]
    }

    getLevelFromVisibilityModifierArray = (vma: VisibilityModifierArray) => {
        let i = 0
        while (true) {
            if (i > this.lastInstanceId || this.data[i].visibilities == vma) break
            i = i + 1
        }
        if (i > this.lastInstanceId) {
            return null
        }
        return this.data[i]
    }

    getLevelFromClearMobArray = (clearMobArray: ClearMobArray) => {
        let i = 0
        while (true) {
            if (i > this.lastInstanceId || this.data[i].clearMobs == clearMobArray) break
            i = i + 1
        }
        if (i > this.lastInstanceId) {
            return null
        }
        return this.data[i]
    }

    clearMonstersOfType = (mt: MonsterType) => {
        let i = 0
        while (i <= this.lastInstanceId) {
            this.data[i].clearMonstersOfType(mt)
            i = i + 1
        }
    }

    removeCastersOfType = (ct: CasterType) => {
        for (let i = 0; i <= this.lastInstanceId; i++) {
            this.data[i].removeCastersOfType(ct)
        }
    }

    getLastLevelId = (): number => {
        return this.lastInstanceId
    }

    getNbMonsters = (mode: string): number => {
        //modes : all, moving, not moving
        let nb = 0
        let i = 0
        while (true) {
            if (i > this.lastInstanceId) break
            nb = nb + this.data[i].getNbMonsters(mode)
            i = i + 1
        }
        return nb
    }

    isNoobEdit = () => this.noobEdit
    setIsNoobEdit = (isNoobEdit: boolean) => {
        if (this.modeState.noobEdit.active === isNoobEdit) {
            return
        }

        this.modeState.noobEdit.active = isNoobEdit

        if (isNoobEdit) {
            this.modeState.noobEdit.lives = ServiceManager.getService('Lives').get()
            this.modeState.noobEdit.autoreviveDelay = globals.autoreviveDelay

            ServiceManager.getService('Lives').setNb(9999)
            globals.autoreviveDelay = 0.3

            for (let i = 0; i < NB_ESCAPERS; i++) {
                getUdgEscapers().get(i)?.setHasAutorevive(true)
            }

            for (const [_, terrain] of pairs(getUdgTerrainTypes().getAll())) {
                if (isDeathTerrain(terrain)) {
                    this.modeState.noobEdit.terrains[terrain.label] = { timeToKill: terrain.getTimeToKill() }
                    terrain.setTimeToKill(0.3)
                }
            }
        } else {
            ServiceManager.getService('Lives').setNb(this.modeState.noobEdit.lives)
            globals.autoreviveDelay = this.modeState.noobEdit.autoreviveDelay

            for (let i = 0; i < NB_ESCAPERS; i++) {
                getUdgEscapers().get(i)?.setHasAutorevive(false)
            }

            for (const [_, terrain] of pairs(getUdgTerrainTypes().getAll())) {
                if (isDeathTerrain(terrain)) {
                    terrain.setTimeToKill(this.modeState.noobEdit.terrains[terrain.label].timeToKill)
                }
            }
        }

        // If noobedit gets disabled we'll still show the noobedit tag on the leaderboard.
        if (!this.noobEdit) {
            this.noobEdit = true
            ServiceManager.getService('Multiboard').reinitBoards()
        }
    }

    isSpeedEdit = () => this.speedEdit
    setIsSpeedEdit = (isSpeedEdit: boolean) => {
        if (this.modeState.speedEdit.active === isSpeedEdit) {
            return
        }

        this.modeState.speedEdit.active = isSpeedEdit

        if (isSpeedEdit) {
            for (const [_, terrain] of pairs(getUdgTerrainTypes().getAll())) {
                if (isSlideTerrain(terrain)) {
                    this.modeState.speedEdit.terrains[terrain.label] = {
                        slideSpeed: terrain.getSlideSpeed(),
                        rotationSpeed: terrain.getRotationSpeed(),
                    }

                    terrain.setSlideSpeed(Math.max(800, terrain.getSlideSpeed()))
                    terrain.setRotationSpeed(Math.max(1.2, terrain.getRotationSpeed()))
                }
            }
        } else {
            for (const [_, terrain] of pairs(getUdgTerrainTypes().getAll())) {
                if (isSlideTerrain(terrain)) {
                    terrain.setSlideSpeed(this.modeState.speedEdit.terrains[terrain.label].slideSpeed)
                    terrain.setRotationSpeed(this.modeState.speedEdit.terrains[terrain.label].rotationSpeed)
                }
            }
        }

        // If speedEdit gets disabled we'll still show the speedEdit tag on the leaderboard.
        if (!this.speedEdit) {
            this.speedEdit = true
            ServiceManager.getService('Multiboard').reinitBoards()
        }
    }

    getLevelProgression = () => this.levelProgression
    setLevelProgression = (levelProgression: ILevelProgression) => (this.levelProgression = levelProgression)
}
