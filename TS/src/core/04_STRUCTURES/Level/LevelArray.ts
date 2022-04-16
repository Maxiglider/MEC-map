import { NB_LIVES_AT_BEGINNING } from 'core/01_libraries/Constants'
import { Text } from 'core/01_libraries/Text'
import { gg_trg_apparition_dialogue_et_fermeture_automatique } from 'core/08_GAME/Mode_coop/creation_dialogue'
import { ServiceManager } from 'Services'
import { getUdgEscapers } from '../../../../globals'
import { MoveCamExceptForPlayer } from '../../01_libraries/Basic_functions'
import { udg_colorCode } from '../../01_libraries/Init_colorCodes'
import { BaseArray } from '../BaseArray'
import type { CasterType } from '../Caster/CasterType'
import type { Escaper } from '../Escaper/Escaper'
import type { MeteorArray } from '../Meteor/MeteorArray'
import type { MonsterArray } from '../Monster/MonsterArray'
import type { MonsterType } from '../Monster/MonsterType'
import type { MonsterSpawnArray } from '../MonsterSpawn/MonsterSpawnArray'
import type { ClearMobArray } from '../Monster_properties/ClearMobArray'
import { Level } from './Level'
import { IsLevelBeingMade } from './Level_functions'
import type { VisibilityModifierArray } from './VisibilityModifierArray'

export class LevelArray extends BaseArray<Level> {
    private currentLevel: number

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
        this.data[0].activate(true)
        this.lastInstanceId++

        ServiceManager.getService('Lives').initLives()

        this.currentLevel = 0
    }

    goToLevel = (finisher: Escaper | undefined, levelId: number): boolean => {
        let i: number
        let previousLevelId = this.currentLevel

        if (levelId < 0 || levelId > this.lastInstanceId || levelId === this.currentLevel) {
            return false
        }

        this.currentLevel = levelId
        if (previousLevelId > -1 && !IsLevelBeingMade(this.data[previousLevelId])) {
            getUdgEscapers().destroyMakesIfForSpecificLevel_currentLevel()
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
        if (this.currentLevel >= this.lastInstanceId) {
            return false
        }
        this.currentLevel = this.currentLevel + 1
        if (!IsLevelBeingMade(this.data[this.currentLevel - 1])) {
            getUdgEscapers().destroyMakesIfForSpecificLevel_currentLevel()
            this.data[this.currentLevel - 1].activate(false)
        }
        this.data[this.currentLevel].activate(true)
        this.data[this.currentLevel].checkpointReviveHeroes(finisher)

        if (this.moveCamToStart(this.data[this.currentLevel], finisher) && finisher) {
            Text.A(
                udg_colorCode[GetPlayerId(finisher.getPlayer())] +
                    'Good job ' +
                    GetPlayerName(finisher.getPlayer()) +
                    ' !'
            )
        }

        return true
    }

    moveCamToStart(level: Level, finisher: Escaper | undefined) {
        const start = level.getStart()

        if (start) {
            const xCam = start.getCenterX()
            const yCam = start.getCenterY()
            if (finisher) {
                MoveCamExceptForPlayer(finisher.getPlayer(), xCam, yCam)
            } else {
                SetCameraPosition(xCam, yCam)
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

        //coop
        TriggerExecute(gg_trg_apparition_dialogue_et_fermeture_automatique)
    }

    new = () => {
        const lvl = new Level()
        const id = this._new(lvl)
        lvl.id = id
        return true
    }

    destroyLastLevel = (): boolean => {
        if (this.lastInstanceId <= 0) {
            return false
        }
        this.data[this.lastInstanceId].destroy()
        delete this.data[this.lastInstanceId]
        this.lastInstanceId = this.lastInstanceId - 1
        return true
    }

    getCurrentLevel = (): Level => {
        return this.data[this.currentLevel]
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
}
