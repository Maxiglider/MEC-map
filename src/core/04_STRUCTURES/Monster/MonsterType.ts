import { MemoryHandler } from 'Utils/MemoryHandler'
import { Constants } from 'core/01_libraries/Constants'
import { Text } from 'core/01_libraries/Text'
import { getUdgEscapers, getUdgLevels } from '../../../../globals'
import { errorHandler } from '../../../Utils/mapUtils'
import { Ascii2String } from '../../01_libraries/Ascii'
import { ReplaceBackslahsesInLinks, Round32 } from '../../01_libraries/Basic_functions'
import { ColorString2Id, udg_colorCode } from '../../01_libraries/Init_colorCodes'
import { Natives } from '../../wc3_natives_unsecured/Natives'
import { Level } from '../Level/Level'
import { requestContactChunksRebuild } from './ContactChunks'
import { IMMOLATION_SKILLS } from './Immolation_skills'

/** Under this, an idle animation would be played too often to be seen, and would cost for nothing */
export const MIN_IDLE_PERIOD = 0.5
export const MAX_IDLE_PERIOD = 600

/** As far as a monster may be asked to see: a little over the widest sight the game gives a unit of its own */
export const MAX_MONSTER_SIGHT = 2000

export class MonsterType {
    label: string
    theAlias?: string
    private unitTypeId: number
    private scale: number //influe sur la taille de l'unité ; 1.0 donne une taille normale
    private immolationRadius = 0
    private immolationSkill: number | null
    private speed: number
    private isClickableB: boolean
    private isWanderableB: boolean
    private killingEffectStr?: string
    private maxLife: number
    private height: number
    private createTerrainLabel?: string
    private killRectDimensions?: { width: number; height: number }

    /**
     * How far every unit of this type sees, sharing what it sees with everyone (the players are allied with shared
     * vision). 0 is MEC's own: a monster is given no sight at all, so that it lights nothing of a level it stands in.
     * A lamp of a dark level is what this is for.
     */
    private sightRadius = 0

    private lifeBonusEnabled = false
    private lifeBonusNbLivesEarned = 0
    private lifeBonusMinimumSurviveTime = 0

    /** the colour every unit of this type wears, as the player colour id it maps to; -1 leaves the owner's colour */
    private baseColorId = -1
    private baseColorStr?: string

    /** what every unit of this type plays on its own, every `idlePeriod` seconds; 0 plays nothing */
    private idlePeriod = 0
    private idleAnimation?: string
    private idleEffect?: string
    private idleTimer?: timer

    constructor(
        label: string,
        unitTypeId: number,
        scale: number,
        immolationRadius: number,
        speed: number,
        isClickable: boolean
    ) {
        if (speed <= 0 || speed > Constants.MAX_MOVE_SPEED) {
            throw this.constructor.name + ' : wrong speed value "' + speed + '"'
        }

        if (scale <= 0 && scale !== -1) {
            throw this.constructor.name + ' : wrong scale value "' + scale + '"'
        }

        if (immolationRadius !== 0 && !IMMOLATION_SKILLS[immolationRadius]) {
            throw `${this.constructor.name} - '${label}' - '${unitTypeId}' - wrong immolation radius - '${immolationRadius}'`
        }

        const testMonster = Natives.UCreateUnit(Constants.NEUTRAL_PLAYER, unitTypeId, 0, 0, 0)
        if (!testMonster) {
            throw `Unit type unknown: ${label}`
        } else {
            RemoveUnit(testMonster)
        }

        this.label = label
        this.unitTypeId = unitTypeId
        this.scale = scale
        this.immolationRadius = immolationRadius
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

    /** The levels whose monsters are standing right now: the one being played, and the ones escapers are making */
    private forEachLiveLevel = (cb: (level: Level) => void) => {
        let levelsMaking: Level[] = []
        let levelAlreadyChecked: boolean
        let nbLevelsMaking = 0
        const currentLevel = getUdgLevels().getCurrentLevel()
        cb(currentLevel)

        for (let i = 0; i < Constants.NB_ESCAPERS; i++) {
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
            cb(levelsMaking[i])
        }
    }

    refresh = () => {
        this.forEachLiveLevel(level => level.recreateMonstersUnitsOfType(this))
    }

    destroy = () => {
        if (this.idleTimer) {
            PauseTimer(this.idleTimer)
            DestroyTimer(this.idleTimer)
            this.idleTimer = undefined
        }
        getUdgLevels().clearMonstersOfType(this)
    }

    getUnitTypeId = (): number => {
        return this.unitTypeId
    }

    setUnitTypeId = (unitTypeId: number): boolean => {
        let testMonster = Natives.UCreateUnit(Constants.NEUTRAL_PLAYER, unitTypeId, 0, 0, 0)
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

        const previousSkill = this.immolationSkill
        this.immolationRadius = immolationRadius
        this.immolationSkill = IMMOLATION_SKILLS[immolationRadius]

        // the units are not rebuilt for this: see Monster.refreshImmolation
        this.forEachLiveLevel(level => level.refreshImmolationOfMonsterType(this, previousSkill))
        requestContactChunksRebuild()
        return true
    }

    getUnitMoveSpeed = (): number => {
        return this.speed
    }

    setUnitMoveSpeed = (speed: number): boolean => {
        if (speed <= 0 || speed > Constants.MAX_MOVE_SPEED) {
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
        this.killingEffectStr = ReplaceBackslahsesInLinks(effectStr)
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

    getSightRadius = (): number => {
        return this.sightRadius
    }

    /**
     * Gives every unit of this type a sight of its own, 0 taking it away again (MEC's own way).
     *
     * The units are made again: the engine works a unit's vision out when it is created, and setting the field on one
     * already standing - a lamp that never moves - changes nothing.
     */
    setSightRadius = (sightRadius: number): boolean => {
        if (sightRadius < 0 || sightRadius > MAX_MONSTER_SIGHT) {
            return false
        }
        this.sightRadius = sightRadius
        this.refresh()
        return true
    }

    getImmolationRadiusStr = (): string => {
        if (!this.immolationSkill) {
            return '0'
        }

        let immoStr = Ascii2String(this.immolationSkill)
        immoStr = SubStringBJ(immoStr, 2, 4) ?? ''
        return I2S(S2I(immoStr)) ?? ''
    }

    setKillRectDimensions = (width: number, height: number): boolean => {
        // round 32 for rect usage
        const roundedWidth = Round32(width)
        const roundedHeight = Round32(height)

        if (roundedHeight <= 0 || roundedWidth <= 0) {
            return false
        }

        this.killRectDimensions = { width: roundedWidth, height: roundedHeight }
        this.refresh()

        return true
    }

    removeKillRectDimensions = (): void => {
        this.killRectDimensions = undefined
        this.refresh()
    }

    getKillRectDimensions = (): { width: number; height: number } | undefined => {
        return this.killRectDimensions
    }

    setLifeBonus = (enabling: boolean, nbLivesEarned?: number, minimumSurviveTime?: number): void => {
        this.lifeBonusEnabled = enabling

        if (nbLivesEarned !== undefined) {
            this.lifeBonusNbLivesEarned = nbLivesEarned
        }

        if (minimumSurviveTime !== undefined) {
            this.lifeBonusMinimumSurviveTime = minimumSurviveTime
        }
    }

    getBaseColorId = (): number => {
        return this.baseColorId
    }

    getBaseColorStr = (): string | undefined => {
        return this.baseColorStr
    }

    /** Gives every unit of this type a colour of its own, whatever player owns it. An unknown colour changes nothing. */
    setBaseColor = (colorString: string): boolean => {
        const colorId = ColorString2Id(colorString)
        if (colorId < 0 || colorId > Constants.NB_PLAYERS_MAX) {
            return false
        }
        this.baseColorId = colorId
        this.baseColorStr = colorString
        this.refresh()
        return true
    }

    /** Back to the colour of the player owning the units */
    removeBaseColor = (): void => {
        this.baseColorId = -1
        this.baseColorStr = undefined
        this.refresh()
    }

    getIdlePeriod = (): number => {
        return this.idlePeriod
    }

    getIdleAnimation = (): string | undefined => {
        return this.idleAnimation
    }

    getIdleEffect = (): string | undefined => {
        return this.idleEffect
    }

    /**
     * Makes every unit of this type play an animation, an effect over its head, or both, every `period` seconds
     * on its own - what many old maps do to their monsters to keep them alive on the screen. A period of 0, or
     * neither an animation nor an effect, stops it.
     */
    setIdle = (period: number, animation?: string, effect?: string): boolean => {
        if (period < 0 || period > MAX_IDLE_PERIOD) {
            return false
        }

        this.idlePeriod = period
        this.idleAnimation = animation
        this.idleEffect = effect ? ReplaceBackslahsesInLinks(effect) : undefined

        if (period < MIN_IDLE_PERIOD || (!this.idleAnimation && !this.idleEffect)) {
            this.idlePeriod = 0
            this.idleTimer && PauseTimer(this.idleTimer)
            return true
        }

        if (!this.idleTimer) {
            this.idleTimer = CreateTimer()
        }
        TimerStart(
            this.idleTimer,
            this.idlePeriod,
            true,
            errorHandler(() => this.playIdle())
        )
        return true
    }

    /** Plays the idle animation and effect on every unit of this type standing right now */
    private playIdle = () => {
        this.forEachLiveLevel(level => level.playIdleOfMonsterType(this))
    }

    getLifeBonus = (): { nbLivesEarned: number; minimumSurviveTime: number } | undefined => {
        if (!this.lifeBonusEnabled) {
            return undefined
        }

        return {
            nbLivesEarned: this.lifeBonusNbLivesEarned,
            minimumSurviveTime: this.lifeBonusMinimumSurviveTime,
        }
    }

    toText = (): string => {
        let space = '   '
        let display = udg_colorCode[Constants.RED] + this.label + (this.theAlias ? ' ' + this.theAlias : '') + " : '"
        let scaleDisplay: string
        let heightDisplay: string
        if (this.scale === -1) {
            scaleDisplay = 'default'
        } else {
            scaleDisplay = R2S(this.scale) ?? ''
        }
        if (this.height === -1) {
            heightDisplay = 'default'
        } else {
            heightDisplay = I2S(R2I(this.height)) ?? ''
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
        if (this.killingEffectStr) {
            display = display + space + this.killingEffectStr
        }
        if (this.isClickableB) {
            display = display + space + 'clickable' + space + I2S(this.maxLife / 10000)
        }
        if (this.isWanderableB) {
            display = display + space + 'wanderable'
        }
        if (this.baseColorStr) {
            display = display + space + 'color_' + udg_colorCode[this.baseColorId] + this.baseColorStr + '|r'
        }
        if (this.idlePeriod > 0) {
            display = display + space + 'idle_' + R2S(this.idlePeriod) + 's'
            this.idleAnimation && (display = display + '_' + this.idleAnimation)
            this.idleEffect && (display = display + '_' + this.idleEffect)
        }
        if (this.killRectDimensions) {
            display =
                display +
                space +
                'killRect_' +
                I2S(R2I(this.killRectDimensions.width)) +
                'x' +
                I2S(R2I(this.killRectDimensions.height))
        }
        if (this.lifeBonusEnabled) {
            display =
                display +
                space +
                'lifeBonus_enabled_nb' +
                I2S(this.lifeBonusNbLivesEarned) +
                '_minSurv' +
                R2S(this.lifeBonusMinimumSurviveTime) +
                's'
        }
        return display
    }

    displayForPlayer = (p: player) => {
        Text.P_timed(p, Constants.TERRAIN_DATA_DISPLAY_TIME, this.toText())
    }

    getImmolationRadius() {
        return this.immolationRadius
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
        output['color'] = this.baseColorStr

        if (this.sightRadius > 0) {
            output['sightRadius'] = this.sightRadius
        }

        if (this.idlePeriod > 0) {
            output['idlePeriod'] = this.idlePeriod
            output['idleAnimation'] = this.idleAnimation
            output['idleEffect'] = this.idleEffect
        }

        if (this.killRectDimensions) {
            output['killRectDimensions'] = {
                width: this.killRectDimensions.width,
                height: this.killRectDimensions.height,
            }
        }

        if (this.lifeBonusEnabled) {
            output['lifeBonusEnabled'] = this.lifeBonusEnabled
            output['lifeBonusNbLivesEarned'] = this.lifeBonusNbLivesEarned
            output['lifeBonusMinimumSurviveTime'] = this.lifeBonusMinimumSurviveTime
        }

        return output
    }
}
