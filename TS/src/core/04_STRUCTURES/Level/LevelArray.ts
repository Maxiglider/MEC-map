import { BasicFunctions } from 'core/01_libraries/Basic_functions'
import { NB_LIVES_AT_BEGINNING } from 'core/01_libraries/Constants'
import { ColorCodes } from 'core/01_libraries/Init_colorCodes'
import { Text } from 'core/01_libraries/Text'
import { udg_escapers } from 'core/08_GAME/Init_structures/Init_escapers'
import { udg_levels } from 'core/08_GAME/Init_structures/Init_struct_levels'
import { Escaper } from '../Escaper/Escaper'
import { MonsterNoMoveArray } from '../Monster/MonsterNoMoveArray'
import { Level } from './Level'
import { LevelFunctions } from './Level_functions'

export const NB_MAX_LEVELS = 50

export class LevelArray {
    private levels: Level[] = []
    private currentLevel: number
    private lastInstance: number

    constructor() {
        let x1 = GetRectMinX(gg_rct_departLvl_0)
        let y1 = GetRectMinY(gg_rct_departLvl_0)
        let x2 = GetRectMaxX(gg_rct_departLvl_0)
        let y2 = GetRectMaxY(gg_rct_departLvl_0)

        this.levels[0] = new Level()
        this.levels[0].newStart(x1, y1, x2, y2)
        this.levels[0].setNbLivesEarned(NB_LIVES_AT_BEGINNING)
        this.levels[0].activate(true)
        this.currentLevel = 0
        this.lastInstance = 0
    }

    goToLevel = (finisher: Escaper, levelId: number): boolean => {
        let xCam: number
        let yCam: number
        let i: number
        let previousLevelId = this.currentLevel
        if (levelId < 0 || levelId > this.lastInstance || levelId === this.currentLevel) {
            return false
        }
        this.currentLevel = levelId
        if (previousLevelId !== NB_MAX_LEVELS) {
            if (!LevelFunctions.IsLevelBeingMade(this.levels[previousLevelId])) {
                udg_escapers.destroyMakesIfForSpecificLevel_currentLevel()
                this.levels[previousLevelId].activate(false)
            }
        }
        this.levels[this.currentLevel].activate(true)
        this.levels[this.currentLevel].checkpointReviveHeroes(finisher)
        if (previousLevelId !== NB_MAX_LEVELS) {
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
        }
        xCam = this.levels[levelId].getStart().getCenterX()
        yCam = this.levels[levelId].getStart().getCenterY()
        if (finisher !== 0) {
            BasicFunctions.MoveCamExceptForPlayer(finisher.getPlayer(), xCam, yCam)
        } else {
            SetCameraPosition(xCam, yCam)
        }
        return true
    }

    goToNextLevel = (finisher: Escaper): boolean => {
        let xCam: number
        let yCam: number
        if (this.currentLevel >= this.lastInstance) {
            return false
        }
        this.currentLevel = this.currentLevel + 1
        if (!LevelFunctions.IsLevelBeingMade(this.levels[this.currentLevel - 1])) {
            udg_escapers.destroyMakesIfForSpecificLevel_currentLevel()
            this.levels[this.currentLevel - 1].activate(false)
        }
        this.levels[this.currentLevel].activate(true)
        this.levels[this.currentLevel].checkpointReviveHeroes(finisher)
        xCam = this.levels[this.currentLevel].getStart().getCenterX()
        yCam = this.levels[this.currentLevel].getStart().getCenterY()
        if (finisher !== 0) {
            BasicFunctions.MoveCamExceptForPlayer(finisher.getPlayer(), xCam, yCam)
            Text.A(
                ColorCodes.udg_colorCode[GetPlayerId(finisher.getPlayer())] +
                    'Good job ' +
                    GetPlayerName(finisher.getPlayer()) +
                    ' !'
            )
        } else {
            SetCameraPosition(xCam, yCam)
        }
        return true
    }

    restartTheGame = () => {
        if (this.currentLevel === 0) {
            this.currentLevel = NB_MAX_LEVELS
            this.levels[0].activate(false)
        }
        this.goToLevel(0, 0)
        udg_lives.setNb(this.levels[0].getNbLives())
        SetCameraPosition(this.levels[0].getStart().getCenterX(), this.levels[0].getStart().getCenterY())
        //coop
        TriggerExecute(gg_trg_apparition_dialogue_et_fermeture_automatique)
    }

    new = (): boolean => {
        if (this.lastInstance >= NB_MAX_LEVELS - 1) {
            return false
        }
        this.lastInstance = this.lastInstance + 1
        this.levels[this.lastInstance] = new Level()
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

    count = (): number => {
        return this.lastInstance + 1
    }

    getCurrentLevel = (): Level => {
        return this.levels[this.currentLevel]
    }

    get = (levelId: number) => {
        if (levelId > this.lastInstance || levelId < 0) {
            return null
        }
        return this.levels[levelId]
    }

    getLevelFromMonsterNoMoveArray = (ma: MonsterNoMoveArray) => {
        let i = 0
        while (true) {
            if (i > this.lastInstance || this.levels[i].monstersNoMove == ma) break
            i = i + 1
        }
        if (i > this.lastInstance) {
            return null
        }
        return this.levels[i]
    }

    getLevelFromMonsterSimplePatrolArray = (ma: MonsterSimplePatrolArray) => {
        let i = 0
        while (true) {
            if (i > this.lastInstance || this.levels[i].monstersSimplePatrol == ma) break
            i = i + 1
        }
        if (i > this.lastInstance) {
            return null
        }
        return this.levels[i]
    }

    getLevelFromMonsterMultiplePatrolsArray = (ma: MonsterMultiplePatrolsArray) => {
        let i = 0
        while (true) {
            if (i > this.lastInstance || this.levels[i].monstersMultiplePatrols == ma) break
            i = i + 1
        }
        if (i > this.lastInstance) {
            return null
        }
        return this.levels[i]
    }

    getLevelFromMonsterTeleportArray = (ma: MonsterTeleportArray) => {
        let i = 0
        while (true) {
            if (i > this.lastInstance || this.levels[i].monstersTeleport == ma) break
            i = i + 1
        }
        if (i > this.lastInstance) {
            return null
        }
        return this.levels[i]
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

    getLevelFromCasterArray = (casterArray: CasterArray) => {
        let i = 0
        while (true) {
            if (i > this.lastInstance || this.levels[i].casters == casterArray) break
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

    removeMonstersOfType = (mt: MonsterType) => {
        let i = 0
        while (true) {
            if (i > this.lastInstance) break
            this.levels[i].removeMonstersOfType(mt)
            i = i + 1
        }
    }

    removeCastersOfType = (ct: CasterType) => {
        let i = 0
        while (true) {
            if (i > this.lastInstance) break
            this.levels[i].removeCastersOfType(ct)
            i = i + 1
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

const ForceGetLevel = (levelId: number) => {
    let i: number
    let lastInstance: number
    if (levelId < 0 || levelId >= NB_MAX_LEVELS) {
        return null
    }
    if (udg_levels === 0) {
        udg_levels = new LevelArray()
    }
    lastInstance = udg_levels.getLastLevelId()
    while (true) {
        if (lastInstance >= levelId) break
        udg_levels.new()
        lastInstance = udg_levels.getLastLevelId()
    }
    return udg_levels.get(levelId)
}
