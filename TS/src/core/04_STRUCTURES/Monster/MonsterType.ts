import { MemoryHandler } from 'Utils/MemoryHandler'
import { Text } from 'core/01_libraries/Text'
import { getUdgEscapers, getUdgLevels } from '../../../../globals'
import { Ascii2String } from '../../01_libraries/Ascii'
import {
    MAX_MOVE_SPEED,
    NB_ESCAPERS,
    NEUTRAL_PLAYER,
    RED,
    TERRAIN_DATA_DISPLAY_TIME,
} from '../../01_libraries/Constants'
import { udg_colorCode } from '../../01_libraries/Init_colorCodes'
import { Level } from '../Level/Level'
import { IMMOLATION_SKILLS } from './Immolation_skills'

export class MonsterType {
    label: string
    theAlias?: string
    private unitTypeId: number
    private scale: number //influe sur la taille de l'unité ; 1.0 donne une taille normale
    private immolationSkill: number | null
    private speed: number
    private isClickableB: boolean
    private isWanderableB: boolean
    private killingEffectStr?: string
    private maxLife: number
    private height: number
    private createTerrainLabel?: string

    constructor(
        label: string,
        unitTypeId: number,
        scale: number,
        immolationRadius: number,
        speed: number,
        isClickable: boolean
    ) {
        if (speed <= 0 || speed > MAX_MOVE_SPEED) {
            throw this.constructor.name + ' : wrong speed value "' + speed + '"'
        }

        if (scale <= 0 && scale !== -1) {
            throw this.constructor.name + ' : wrong scale value "' + scale + '"'
        }

        if (immolationRadius !== 0 && !IMMOLATION_SKILLS[immolationRadius]) {
            throw `${this.constructor.name} - '${label}' - '${unitTypeId}' - wrong immolation radius - '${immolationRadius}'`
        }

        const testMonster = CreateUnit(NEUTRAL_PLAYER, unitTypeId, 0, 0, 0)
        if (!testMonster) {
            throw `Unit type unknown: ${label}`
        } else {
            RemoveUnit(testMonster)
        }

        this.label = label
        this.unitTypeId = unitTypeId
        this.scale = scale
        this.immolationSkill = IMMOLATION_SKILLS[immolationRadius]
        this.speed = speed
        this.isClickableB = isClickable
        this.isWanderableB = false
        this.maxLife = 10000
        this.height = -1
    }

    setLabel = (label: string) => {
        this.label = label
    }

    getLabel = () => {
        return this.label
    }

    setAlias = (theAlias: string): MonsterType => {
        this.theAlias = theAlias
        return this
    }

    refresh = () => {
        let levelsMaking: Level[] = []
        let levelAlreadyChecked: boolean
        let nbLevelsMaking = 0
        const currentLevel = getUdgLevels().getCurrentLevel()
        currentLevel.recreateMonstersUnitsOfType(this)

        for (let i = 0; i < NB_ESCAPERS; i++) {
            let escaper = getUdgEscapers().get(i)
            if (escaper && escaper.getMakingLevel() != currentLevel) {
                levelAlreadyChecked = false

                for (let j = 0; j < nbLevelsMaking; j++) {
                    if (escaper.getMakingLevel() == levelsMaking[j]) {
                        levelAlreadyChecked = true
                        break
                    }
                }

                if (!levelAlreadyChecked) {
                    levelsMaking[nbLevelsMaking] = escaper.getMakingLevel()
                    nbLevelsMaking++
                }
            }
        }

        for (let i = 0; i < nbLevelsMaking; i++) {
            levelsMaking[i].recreateMonstersUnitsOfType(this)
        }
    }

    destroy = () => {
        getUdgLevels().clearMonstersOfType(this)
    }

    getUnitTypeId = (): number => {
        return this.unitTypeId
    }

    setUnitTypeId = (unitTypeId: number): boolean => {
        let testMonster = CreateUnit(NEUTRAL_PLAYER, unitTypeId, 0, 0, 0)
        if (!testMonster) {
            return false
        }

        RemoveUnit(testMonster)

        this.unitTypeId = unitTypeId
        this.refresh()
        return true
    }

    getScale = (): number => {
        return this.scale
    }

    setScale = (scale: number): boolean => {
        if ((scale <= 0 && scale !== -1) || scale === this.scale) {
            return false
        }
        this.scale = scale
        this.refresh()
        return true
    }

    getCreateTerrainLabel = () => {
        return this.createTerrainLabel
    }

    setCreateTerrainLabel = (createTerrainLabel?: string): MonsterType => {
        this.createTerrainLabel = createTerrainLabel
        return this
    }

    getImmolationSkill = () => {
        return this.immolationSkill
    }

    setImmolation = (immolationRadius: number): boolean => {
        if (immolationRadius !== 0 && !IMMOLATION_SKILLS[immolationRadius]) {
            return false
        }
        this.immolationSkill = IMMOLATION_SKILLS[immolationRadius]
        this.refresh()
        return true
    }

    getUnitMoveSpeed = (): number => {
        return this.speed
    }

    setUnitMoveSpeed = (speed: number): boolean => {
        if (speed <= 0 || speed > MAX_MOVE_SPEED) {
            return false
        }
        this.speed = speed
        this.refresh()
        return true
    }

    isClickable = (): boolean => {
        return this.isClickableB
    }

    setIsClickable = (isClickable: boolean): boolean => {
        if (this.isClickableB === isClickable) {
            return false
        }
        this.isClickableB = isClickable
        this.refresh()
        return true
    }

    isWanderable = () => this.isWanderableB

    setIsWanderable = (isWanderable: boolean): boolean => {
        if (this.isWanderableB === isWanderable) {
            return false
        }
        this.isWanderableB = isWanderable
        this.refresh()
        return true
    }

    getKillingEffectStr = () => {
        return this.killingEffectStr
    }

    setKillingEffectStr = (effectStr: string): MonsterType => {
        this.killingEffectStr = effectStr
        return this
    }

    setNbMeteorsToKill = (nbMeteorsToKill: number): MonsterType => {
        //nombre de météores qu'il faut pour tuer le monstre, sachant qu'une météore fait 10k de dégât
        if (nbMeteorsToKill < 1 || nbMeteorsToKill > 9) {
            return this
        }
        this.maxLife = nbMeteorsToKill * 10000
        if (this.isClickableB) {
            this.refresh()
        }
        return this
    }

    getMaxLife = (): number => {
        return this.maxLife
    }

    getHeight = (): number => {
        return this.height
    }

    setHeight = (height: number): boolean => {
        if (height !== -1 && height < 0 && height !== this.height) {
            return false
        }
        this.height = height
        this.refresh()
        return true
    }

    getImmolationRadiusStr = (): string => {
        if (!this.immolationSkill) {
            return '0'
        }

        let immoStr = Ascii2String(this.immolationSkill)
        immoStr = SubStringBJ(immoStr, 2, 4)
        return I2S(S2I(immoStr))
    }

    displayForPlayer = (p: player) => {
        let space = '   '
        let display = udg_colorCode[RED] + this.label + (this.theAlias ? ' ' + this.theAlias : '') + " : '"
        let scaleDisplay: string
        let heightDisplay: string
        if (this.scale === -1) {
            scaleDisplay = 'default'
        } else {
            scaleDisplay = R2S(this.scale)
        }
        if (this.height === -1) {
            heightDisplay = 'default'
        } else {
            heightDisplay = I2S(R2I(this.height))
        }
        display = display + Ascii2String(this.unitTypeId) + "'"
        display =
            display +
            space +
            'speed_' +
            I2S(R2I(this.speed)) +
            space +
            'immo_' +
            this.getImmolationRadiusStr() +
            space +
            'scale_' +
            scaleDisplay +
            space +
            'height_' +
            heightDisplay
        if (this.isClickableB) {
            display = display + space + 'clickable' + space + I2S(this.maxLife / 10000)
        }
        Text.P_timed(p, TERRAIN_DATA_DISPLAY_TIME, display)
    }

    displayTotalForPlayer = (p: player) => {
        let space = '   '
        let display = udg_colorCode[RED] + this.label + (this.theAlias ? ' ' + this.theAlias : '') + " : '"
        let scaleDisplay: string
        let heightDisplay: string
        if (this.scale === -1) {
            scaleDisplay = 'default'
        } else {
            scaleDisplay = R2S(this.scale)
        }
        if (this.height === -1) {
            heightDisplay = 'default'
        } else {
            heightDisplay = I2S(R2I(this.height))
        }
        display = display + Ascii2String(this.unitTypeId) + "'" + space
        display = display + space + 'speed_' + I2S(R2I(this.speed)) + space + 'immo_' + this.getImmolationRadiusStr()
        space + 'scale_' + scaleDisplay + space + 'height_' + heightDisplay + space + this.killingEffectStr
        if (this.isClickableB) {
            display = display + space + 'clickable' + space + I2S(this.maxLife / 10000)
        }
        if (this.isWanderableB) {
            display = display + space + 'wanderable'
        }
        Text.P_timed(p, TERRAIN_DATA_DISPLAY_TIME, display)
    }

    toJson = () => {
        const output = MemoryHandler.getEmptyObject<any>()

        output['label'] = this.label
        output['alias'] = this.theAlias
        output['unitTypeId'] = Ascii2String(this.unitTypeId)
        output['scale'] = this.scale
        output['immolationRadius'] = S2I(this.getImmolationRadiusStr())
        output['speed'] = R2I(this.speed)
        output['isClickable'] = this.isClickableB
        output['isWanderable'] = this.isWanderableB
        output['killingEffect'] = this.killingEffectStr
        output['nbMeteorsToKill'] = this.maxLife / 10000
        output['height'] = R2I(this.height)
        output['createTerrainLabel'] = this.createTerrainLabel

        return output
    }
}
