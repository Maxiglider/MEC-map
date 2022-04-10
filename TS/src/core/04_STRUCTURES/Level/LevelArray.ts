import { NB_LIVES_AT_BEGINNING } from 'core/01_libraries/Constants'
import { Text } from 'core/01_libraries/Text'
import { gg_trg_apparition_dialogue_et_fermeture_automatique } from 'core/08_GAME/Mode_coop/creation_dialogue'
import { getUdgEscapers } from '../../../../globals'
import { MoveCamExceptForPlayer } from '../../01_libraries/Basic_functions'
import { udg_colorCode } from '../../01_libraries/Init_colorCodes'
import { getUdgLives } from '../../08_GAME/Init_structures/Init_lives'
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

export class LevelArray {
    private levels: Level[] = []
    private currentLevel: number
    private lastInstance: number

    constructor() {
        let x1 = GetRectMinX(gg_rct_departLvl_0)
        let y1 = GetRectMinY(gg_rct_departLvl_0)
        let x2 = GetRectMaxX(gg_rct_departLvl_0)
        let y2 = GetRectMaxY(gg_rct_departLvl_0)

        this.levels[0] = new Level(0)
        this.levels[0].newStart(x1, y1, x2, y2)
        this.levels[0].setNbLivesEarned(NB_LIVES_AT_BEGINNING)
        this.levels[0].activate(true)
        this.currentLevel = 0
        this.lastInstance = 0
    }

    goToLevel = (finisher: Escaper | undefined, levelId: number): boolean => {
        let i: number
        let previousLevelId = this.currentLevel

        if (levelId < 0 || levelId > this.lastInstance || levelId === this.currentLevel) {
            return false
        }

        this.currentLevel = levelId
        if (previousLevelId > -1 && !IsLevelBeingMade(this.levels[previousLevelId])) {
            getUdgEscapers().destroyMakesIfForSpecificLevel_currentLevel()
            this.levels[previousLevelId].activate(false)
        }

        this.levels[this.currentLevel].activate(true)
        this.levels[this.currentLevel].checkpointReviveHeroes(finisher)

        if (levelId > previousLevelId + 1) {
            i = previousLevelId + 1
            while (true) {
                if (i >= levelId) break
                this.levels[i].activateVisibilities(true)
                i = i + 1
            }
        } else {
            if (levelId < previousLevelId) {
                i = levelId + 1
                while (true) {
                    if (i > previousLevelId) break
                    this.levels[i].activateVisibilities(false)
                    i = i + 1
                }
            }
        }

        this.moveCamToStart(this.levels[levelId], finisher)

        return true
    }

    goToNextLevel = (finisher?: Escaper): boolean => {
        if (this.currentLevel >= this.lastInstance) {
            return false
        }
        this.currentLevel = this.currentLevel + 1
        if (!IsLevelBeingMade(this.levels[this.currentLevel - 1])) {
            getUdgEscapers().destroyMakesIfForSpecificLevel_currentLevel()
            this.levels[this.currentLevel - 1].activate(false)
        }
        this.levels[this.currentLevel].activate(true)
        this.levels[this.currentLevel].checkpointReviveHeroes(finisher)

        if (this.moveCamToStart(this.levels[this.currentLevel], finisher) && finisher) {
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
            this.levels[0].activate(false)
        }
        this.goToLevel(undefined, 0)
        getUdgLives().setNb(this.levels[0].getNbLives())

        const start = this.levels[0].getStart()
        start && SetCameraPosition(start.getCenterX(), start.getCenterY())

        //coop
        TriggerExecute(gg_trg_apparition_dialogue_et_fermeture_automatique)
    }

    new = (): boolean => {
        this.lastInstance = this.lastInstance + 1
        this.levels[this.lastInstance] = new Level(this.lastInstance)
        return true
    }

    destroyLastLevel = (): boolean => {
        if (this.lastInstance <= 0) {
            return false
        }
        this.levels[this.lastInstance].destroy()
        this.lastInstance = this.lastInstance - 1
        return true
    }

    count = () => this.levels.length

    getCurrentLevel = (): Level => {
        return this.levels[this.currentLevel]
    }

    get = (levelId: number) => {
        if (levelId > this.lastInstance || levelId < 0) {
            return null
        }
        return this.levels[levelId]
    }

    getLevelFromMonsterArray = (ma: MonsterArray) => {
        return ma.getLevel()
    }

    getLevelFromMonsterSpawnArray = (msa: MonsterSpawnArray) => {
        let i = 0
        while (true) {
            if (i > this.lastInstance || this.levels[i].monsterSpawns == msa) break
            i = i + 1
        }
        if (i > this.lastInstance) {
            return null
        }
        return this.levels[i]
    }

    getLevelFromMeteorArray = (ma: MeteorArray) => {
        let i = 0
        while (true) {
            if (i > this.lastInstance || this.levels[i].meteors == ma) break
            i = i + 1
        }
        if (i > this.lastInstance) {
            return null
        }
        return this.levels[i]
    }

    getLevelFromVisibilityModifierArray = (vma: VisibilityModifierArray) => {
        let i = 0
        while (true) {
            if (i > this.lastInstance || this.levels[i].visibilities == vma) break
            i = i + 1
        }
        if (i > this.lastInstance) {
            return null
        }
        return this.levels[i]
    }

    getLevelFromClearMobArray = (clearMobArray: ClearMobArray) => {
        let i = 0
        while (true) {
            if (i > this.lastInstance || this.levels[i].clearMobs == clearMobArray) break
            i = i + 1
        }
        if (i > this.lastInstance) {
            return null
        }
        return this.levels[i]
    }

    clearMonstersOfType = (mt: MonsterType) => {
        let i = 0
        while (i <= this.lastInstance) {
            this.levels[i].clearMonstersOfType(mt)
            i = i + 1
        }
    }

    removeCastersOfType = (ct: CasterType) => {
        for (let i = 0; i <= this.lastInstance; i++) {
            this.levels[i].removeCastersOfType(ct)
        }
    }

    getLastLevelId = (): number => {
        return this.lastInstance
    }

    getNbMonsters = (mode: string): number => {
        //modes : all, moving, not moving
        let nb = 0
        let i = 0
        while (true) {
            if (i > this.lastInstance) break
            nb = nb + this.levels[i].getNbMonsters(mode)
            i = i + 1
        }
        return nb
    }
}
