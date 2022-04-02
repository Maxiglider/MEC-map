import { NB_ESCAPERS, TEAL, TERRAIN_DATA_DISPLAY_TIME } from 'core/01_libraries/Constants'
import { Text } from 'core/01_libraries/Text'
import { CACHE_SEPARATEUR_PARAM } from 'core/07_TRIGGERS/Save_map_in_gamecache/struct_StringArrayForCache'
import { udg_escapers } from 'core/08_GAME/Init_structures/Init_escapers'
import { udg_levels } from 'core/08_GAME/Init_structures/Init_struct_levels'
import { Escaper } from '../Escaper/Escaper'
import { Level } from '../Level/Level'
import {MonsterType} from "../Monster/MonsterType";
import {udg_colorCode} from "../../01_libraries/Init_colorCodes";

const DEFAULT_CASTER_PROJECTILE_SPEED = 600
const MIN_CASTER_PROJECTILE_SPEED = 100
const DEFAULT_CASTER_RANGE = 1000
const MIN_CASTER_LOAD_TIME = 0.2
const DEFAULT_CASTER_LOAD_TIME = 1
const DEFAULT_CASTER_ANIMATION = 'spell'

export class CasterType {
    label: string
    theAlias?: string
    private casterMonsterType: MonsterType
    private projectileMonsterType: MonsterType
    private range: number
    private projectileSpeed: number
    private loadTime: number
    private animation: string

    constructor(
        label: string,
        casterMonsterType: MonsterType,
        projectileMonsterType: MonsterType,
        range: number,
        projectileSpeed: number,
        loadTime: number,
        animation: string
    ) {
        if (range <= 0 || projectileSpeed <= 0) {
            throw new Error('CasterType: range and projectileSpeed must be positive')
        }

        this.label = label
        this.casterMonsterType = casterMonsterType
        this.projectileMonsterType = projectileMonsterType
        this.range = range
        this.projectileSpeed = projectileSpeed
        this.loadTime = loadTime
        this.animation = animation
    }

    setLabel = (label: string) => {
        this.label = label
    }

    setAlias(theAlias: string) {
        this.theAlias = theAlias
        return this
    }

    refresh = () => {
        let levelsMaking: Level[] = []
        let levelAlreadyChecked: boolean
        let nbLevelsMaking = 0
        const currentLevel = udg_levels.getCurrentLevel()
        currentLevel.refreshCastersOfType(this)

        for(let i = 0; i < NB_ESCAPERS; i++){
            const escaper = udg_escapers.get(i)
            if (escaper) {
                if (escaper.getMakingLevel() != currentLevel) {
                    levelAlreadyChecked = false

                    for(let j = 0; j < nbLevelsMaking; j++){
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
        }

        for(let i = 0; i < nbLevelsMaking; i++){
            levelsMaking[i].refreshCastersOfType(this)
        }
    }

    destroy = () => {
        udg_levels.removeCastersOfType(this)
    }

    getCasterMonsterType = (): MonsterType => {
        return this.casterMonsterType
    }

    setCasterMonsterType = (newCasterMonsterType: MonsterType) => {
        this.casterMonsterType = newCasterMonsterType
        this.refresh()
    }

    getProjectileMonsterType = (): MonsterType => {
        return this.projectileMonsterType
    }

    setProjectileMonsterType = (newProjectileMonsterType: MonsterType) => {
        this.projectileMonsterType = newProjectileMonsterType
    }

    getRange = (): number => {
        return this.range
    }

    setRange = (newRange: number): boolean => {
        if (newRange <= 0) {
            return false
        }
        this.range = newRange
        return true
    }

    getProjectileSpeed = (): number => {
        return this.projectileSpeed
    }

    setProjectileSpeed = (newSpeed: number): boolean => {
        if (newSpeed <= 0) {
            return false
        }
        this.projectileSpeed = newSpeed
        return true
    }

    getLoadTime = (): number => {
        return this.loadTime
    }

    setLoadTime = (loadTime: number): boolean => {
        if (loadTime < MIN_CASTER_LOAD_TIME) {
            return false
        }
        this.loadTime = loadTime
        return true
    }

    getAnimation = (): string => {
        return this.animation
    }

    setAnimation = (animation: string) => {
        this.animation = animation
    }

    displayForPlayer = (p: player) => {
        let space = '   '
        let display = udg_colorCode[TEAL] + this.label + ' ' + this.theAlias + ' : '
        display =
            display +
            this.casterMonsterType.label +
            space +
            this.projectileMonsterType.label +
            space +
            'range: ' +
            R2S(this.range) +
            space
        display =
            display +
            'projectileSpeed: ' +
            R2S(this.projectileSpeed) +
            space +
            'loadTime: ' +
            R2S(this.loadTime) +
            space +
            this.animation
        Text.P_timed(p, TERRAIN_DATA_DISPLAY_TIME, display)
    }

    toString = (): string => {
        let str = this.label + CACHE_SEPARATEUR_PARAM + this.theAlias + CACHE_SEPARATEUR_PARAM
        str =
            str +
            this.casterMonsterType.label +
            CACHE_SEPARATEUR_PARAM +
            this.projectileMonsterType.label +
            CACHE_SEPARATEUR_PARAM
        str =
            str +
            R2S(this.range) +
            CACHE_SEPARATEUR_PARAM +
            R2S(this.projectileSpeed) +
            CACHE_SEPARATEUR_PARAM +
            R2S(this.loadTime) +
            CACHE_SEPARATEUR_PARAM +
            this.animation
        return str
    }
}
