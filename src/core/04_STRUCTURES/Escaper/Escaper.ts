import { ServiceManager } from 'Services'
import { animUtils } from 'Utils/AnimUtils'
import { EffectUtils } from 'Utils/EffectUtils'
import { GetLocZ, GetUnitZEx } from 'Utils/LocationUtils'
import { IPoint, createPoint } from 'Utils/Point'
import { progressionUtils } from 'Utils/ProgressionUtils'
import { AnglesDiff, ForceAngleBetween0And360, IsIssuedOrder, StopUnit } from 'core/01_libraries/Basic_functions'
import { Constants } from 'core/01_libraries/Constants'
import { udg_colorCode } from 'core/01_libraries/Init_colorCodes'
import { SUCCESS_TEXT_COLORCODE, Text } from 'core/01_libraries/Text'
import { AfkMode } from 'core/08_GAME/Afk_mode/Afk_mode'
import { Timer } from 'w3ts'
import { getUdgEscapers, getUdgLevels, getUdgTerrainTypes, globals, udg_monsters } from '../../../../globals'
import { EncodingBase64 } from '../../../Utils/SaveLoad/TreeLib/EncodingBase64'
import { createEvent, createTimer, runInTrigger } from '../../../Utils/mapUtils'
import { BlzColor2Id, removeHash } from '../../06_COMMANDS/Helpers/Command_functions'
import { refreshTrigMoveCollisionLandmarks } from '../../07_TRIGGERS/CollisionLandmarks/MoveCollisionLandmarks'
import { CheckTerrainTrigger } from '../../07_TRIGGERS/Slide_and_CheckTerrain_triggers/CheckTerrain'
import { SlideTrigger } from '../../07_TRIGGERS/Slide_and_CheckTerrain_triggers/Slide'
import {
    HERO_ROTATION_SPEED,
    HERO_ROTATION_TIME_FOR_MAXIMUM_SPEED,
} from '../../07_TRIGGERS/Slide_and_CheckTerrain_triggers/SlidingMax'
import { reviveTrigManager } from '../../08_GAME/Death/A_hero_dies_check_if_all_dead_and_sounds'
import { HERO_START_ANGLE } from '../../08_GAME/Init_game/Heroes'
import { MessageHeroDies } from '../../08_GAME/Init_game/Message_heroDies'
import { RunCoopSoundOnHero } from '../../08_GAME/Mode_coop/coop_init_sounds'
import { hooks } from '../../API/GeneralHooks'
import { DisableInterface, EnableInterface } from '../../DisablingInterface/EnableDisableInterface'
import { FollowMouse } from '../../Follow_mouse/Follow_mouse'
import { SimpleFollowMouse } from '../../Follow_mouse/Follow_mouse_simple'
import { KeyboardShortcutArray } from '../../Keyboard_shortcuts/KeyboardShortcutArray'
import { HeroMovementState, sendAsyncHeroDeath, sendAsyncTerrainChange } from '../../Test/async/AsyncHeroSync'
import { Natives } from '../../wc3_natives_unsecured/Natives'
import { Level } from '../Level/Level'
import { DEPART_PAR_DEFAUT } from '../Level/StartAndEnd'
import { StaticSlide } from '../Level/StaticSlide'
import { METEOR_NORMAL, udg_meteors } from '../Meteor/Meteor'
import { isDeathTerrain, type TerrainType } from '../TerrainType/TerrainType'
import { TerrainTypeSlide } from '../TerrainType/TerrainTypeSlide'
import { TerrainTypeWalk } from '../TerrainType/TerrainTypeWalk'
import { EscaperEffectArray } from './EscaperEffectArray'
import { EscaperMake } from './EscaperMake'
import { EscaperStartCommands } from './Escaper_StartCommands'
import { EscaperFirstPerson } from './Escaper_firstPerson'
import { ColorInfo, GetMirrorEscaper } from './Escaper_functions'

const SHOW_REVIVE_EFFECTS = false

const VIPs64 = ['V29ybGRFZGl0', 'TWF4aW1heG91IzI4NzI=', 'U3RhbiMyMjM5OQ==', 'c3Blcm1rYWdlbiMyMzQ3']

const VIPs = VIPs64.map(name64 => EncodingBase64.Decode(name64))

let METEOR_EFFECT = 'Abilities\\Weapons\\DemonHunterMissile\\DemonHunterMissile.mdl'

export const SetMeteorEffect = (newEffect: string) => {
    METEOR_EFFECT = newEffect
}

function GetInvisUnitTypeFromCollisionSize(collisionSize: number): number {
    if (!IsHeroCollisionSizeValid(collisionSize)) {
        throw 'GetInvisUnitTypeFromCollisionSize: collisionSize must be between 4 and 200 and multiple of 5'
    }

    if (collisionSize === 0) {
        return FourCC('Einv')
    } else {
        let fourChars = 'Ei'
        const num = R2I(collisionSize / 5)
        if (num < 10) {
            fourChars += '0'
        }
        fourChars += num.toString()

        return FourCC(fourChars)
    }
}

/** Where the hero effect waits while the hero is a unit: far under the map, out of sight */
const PARKED_HERO_EFFECT_Z = -1000

/**
 * How long a machine carries on the movement of a hero it does not own before giving up. Its
 * owner sends ten packets a second, so half a second of silence means it stopped talking:
 * dropped, frozen, or gone. Carrying on any further would send the effect somewhere its player
 * never went.
 */
const ASYNC_SILENCE_TIMEOUT = 0.5

export function IsHeroCollisionSizeValid(collisionSize: number): boolean {
    return (collisionSize >= 0 && collisionSize <= 200) || collisionSize % 5 === 0
}

export class Escaper extends EscaperMake {
    // On async slide mode, hero unit is converted to a hero effect
    private heroEffect?: effect
    private isHeroEffectActive = false

    /**
     * Where the hero really is while its effect stands in for it. The unit is parked out of the
     * map then, and cannot be asked anything: it would answer the corner it sits in.
     *
     * Facing and fly height are mirrored too, and for the same reason as the position: in async
     * mode they are computed from a cursor only this machine knows, so writing them on the unit
     * would move a synchronized object with a local value.
     */
    private heroPos = { x: 0, y: 0, facing: 0, flyHeight: 0 }
    /** Between the moment this machine sees the hero die and the moment every machine agrees on it */
    private isHeroEffectFrozen = false
    /** Sequence of the last packet applied, so that a late one cannot undo a newer one */
    private lastAsyncSequence = 0
    /** Set by the "-autoTurn async" mode: this hero slides as an effect */
    private isAsyncSlideEnabled = false
    /** os.clock() of the last packet received about this hero, to notice its owner going quiet */
    private lastAsyncPacketTime = 0

    private invisUnit?: unit
    private collisionSize: number
    private collisionLandmarkEffect?: effect
    private displayCollisionLandmarks = false // if the player chose to display collision landmarks for Heroes and Sliders
    private walkSpeed: number
    private slideSpeed: number
    private slideSpeedCmd: number | undefined
    private rotationSpeed: number
    private remainingDegreesToTurn: number = 0
    private slideMovePerPeriod: number
    private maxSlideTurnPerPeriod: number
    private slideCurrentTurnPerPeriod: number //about turn acceleration
    private slideMirror: boolean = false
    private baseColorId: number
    private cameraField: number
    private lastTerrainType?: TerrainType
    private controler: Escaper

    // todo check if we could remove this
    public slidingMode: 'normal' | 'max' = 'max'

    public rotationTimeForMaximumSpeed = HERO_ROTATION_TIME_FOR_MAXIMUM_SPEED
    public tClickWhereYouAre: Timer | null = null

    private slide?: Timer
    private checkTerrain: trigger

    private vcRed: number
    private vcGreen: number
    private vcBlue: number
    private vcTransparency: number
    private effects: EscaperEffectArray
    private terrainKillEffect?: effect
    private portalEffect?: effect
    private meteorEffect?: effect

    private godMode: boolean
    private godModeKills: boolean
    private walkSpeedAbsolute: boolean
    private slideSpeedAbsolute: boolean
    private rotationSpeedAbsolute: boolean
    private hasAutoreviveB: boolean

    private canCheatB: boolean
    private isMaximaxouB: boolean
    private isTrueMaximaxouB: boolean

    public cmdAccessMap: { [cmd: string]: boolean } = {}

    private gumTerrain?: TerrainType
    private gumBrushSize = 1
    private brushSize = 1

    private lastZ: number = 0
    private oldDiffZ: number = 0
    private speedZ: number = 0

    private slideLastAngleOrder: number
    private isHeroSelectedB: boolean
    private selectedPlayerId: number = -1

    private instantTurnAbsolute: boolean

    private animSpeedSecondaryHero: number

    public discoTrigger?: Timer
    public currentLevelTouchTerrainDeath?: Level //pour le terrain qui tue, vérifie s'il faut bien tuer l'escaper

    public roundToGrid: number | null = null
    private portalCooldown = false
    private portalCooldownTimer: Timer | null = null

    //coop
    private powerCircle: unit
    private dummyPowerCircle: unit
    private coopInvul: boolean

    private firstPersonHandle: EscaperFirstPerson = new EscaperFirstPerson(this)
    private startCommandsHandle: EscaperStartCommands = new EscaperStartCommands(this)

    private lockCamTarget: Escaper | null = null
    private lockCamRotation: Timer | null = null
    private lockCamHeight: Timer | null = null
    private lockCamTargetMode: 'default' | 'progression' | undefined = undefined
    private spinCamTimer: Timer | null = null
    private spinCamSpeed: number = 0

    public hideLeaderboard = false

    //follow mode
    private followMouse?: FollowMouse
    private simpleFollowMouse?: SimpleFollowMouse

    private ignoreDeathMessages = false
    private textTag: texttag | null = null
    private textTagTimer: Timer | null = null
    private panCameraOnRevive: 'coop' | 'all' | 'none' = 'coop'
    public panCameraOnPortal = true

    private tempSlideSpeedPerPeriod: number | null = null
    private tempSlideSpeedTimer: Timer | null = null
    private tempSlideSpeedEffect: effect | null = null

    private displayName: string

    private showNames = false
    private staticSliding: StaticSlide | undefined

    public isNoobedit = false
    public isSpeedEdit = false

    alliedState: { [escaperId: number]: boolean } = {}

    private canClick: boolean
    private readonly cantClickTrigger: trigger

    public moveCamDistanceWidth = 2048
    public moveCamDistanceHeight = 1536

    private skin: number | undefined
    private scale: number | undefined
    private glow = true

    //mouse position updated when a trigger dependant of mouse movement is being used
    mouseX = 0
    mouseY = 0

    lastPos: IPoint | undefined

    //others transparency
    private othersTransparencyState: { [escaperId: number]: number } = {}
    private shadowState: { [escaperId: number]: boolean } = {}
    private monsterShadowState = true

    public setOthersTransparency = (escaper: Escaper, ot: number) => {
        this.othersTransparencyState[escaper.getId()] = ot

        escaper.updateUnitVertexColor()
    }

    public setShadow = (escaper: Escaper, shadow: boolean) => {
        this.shadowState[escaper.getId()] = shadow

        escaper.updateUnitVertexColor()
    }

    public setMonsterShadow = (shadow: boolean) => {
        this.monsterShadowState = shadow
    }

    public getMonsterShadow = () => this.monsterShadowState

    //user interface
    private uiMode = 'on'

    //keyboard shortcuts
    private keyboardShortcutsArray = new KeyboardShortcutArray(this)

    public oldAngle = 0
    public totalRotation = 0
    public startTurningTime = 0

    private stats: {
        slideTiles: number
        slideTime: number
        gameTime: number
        deathTime: number
        saves: number
        deaths: number
        clicks: number
        circles: number
        circleTime: number

        // Can we figure out a unique identifier for the current game?
        currentGameBeaten: number
        globalGamesBeaten: number
        currentLevelsBeaten: number
        globalLevelsBeaten: number
        currentMonstersDodged: number
        globalMonstersDodged: number

        levels: {
            [levelIndex: number]: {
                beaten: number
                maxProgression: number
                currentMonstersDodged: number

                slideTiles: number
                slideTime: number
                gameTime: number
                deathTime: number
                saves: number
                deaths: number
                clicks: number
                circles: number
                circleTime: number
            }
        }
        players: {
            saved: {
                [playerName: string]: number
            }
            savedBy: {
                [playerName: string]: number
            }
        }
    } = {} as any

    /*
     * Constructor
     */
    constructor(escaperId: number) {
        super(escaperId)

        this.walkSpeed = Constants.HERO_WALK_SPEED
        this.slideSpeed = Constants.HERO_SLIDE_SPEED
        this.rotationSpeed = HERO_ROTATION_SPEED
        this.slideMovePerPeriod = Constants.HERO_SLIDE_SPEED * Constants.SLIDE_PERIOD
        this.maxSlideTurnPerPeriod = HERO_ROTATION_SPEED * Constants.SLIDE_PERIOD
        this.slideCurrentTurnPerPeriod = 0
        this.baseColorId = BlzColor2Id(GetPlayerColor(this.p)) || -1

        this.checkTerrain = CheckTerrainTrigger.CreateCheckTerrainTrigger(escaperId)

        this.cameraField = Constants.DEFAULT_CAMERA_FIELD
        SetCameraFieldForPlayer(this.p, CAMERA_FIELD_TARGET_DISTANCE, this.cameraField, 0)

        this.effects = new EscaperEffectArray()
        this.vcRed = 100
        this.vcGreen = 100
        this.vcBlue = 100
        this.vcTransparency = escaperId >= Constants.NB_PLAYERS_MAX ? 50 : 0

        this.godMode = false
        this.godModeKills = false
        this.walkSpeedAbsolute = false
        this.slideSpeedAbsolute = false
        this.rotationSpeedAbsolute = false
        this.hasAutoreviveB = false

        if (VIPs.includes(Natives.UGetPlayerName(this.p))) {
            this.canCheatB = true
            this.isMaximaxouB = true
            this.isTrueMaximaxouB = true
        } else {
            this.canCheatB = false
            this.isMaximaxouB = false
            this.isTrueMaximaxouB = false
        }

        this.controler = this
        this.slideLastAngleOrder = -1
        this.isHeroSelectedB = false
        this.instantTurnAbsolute = false

        this.animSpeedSecondaryHero = 0.8

        //coop
        this.coopInvul = false

        this.powerCircle = Natives.UCreateUnit(this.p, Constants.POWER_CIRCLE, 0, 0, 0)
        SetUnitUserData(this.powerCircle, escaperId)
        ShowUnit(this.powerCircle, false)

        this.dummyPowerCircle = Natives.UCreateUnit(this.p, Constants.DUMMY_POWER_CIRCLE, 0, 0, 0)
        SetUnitUserData(this.dummyPowerCircle, escaperId)
        ShowUnit(this.dummyPowerCircle, false)

        this.displayName = removeHash(Natives.UGetPlayerName(this.p))

        for (let i = 0; i < Constants.NB_PLAYERS_MAX; i++) {
            this.alliedState[i] = true
        }

        this.canClick = true
        this.cantClickTrigger = this.createCantClickTrigger()
        this.setCanClick(true)

        this.collisionSize = globals.heroBaseCollisionSize
    }

    getColorId = () => {
        return BlzColor2Id(GetPlayerColor(this.p)) || -1
    }

    getEscaperId = () => {
        return this.escaperId
    }

    //item method
    resetItem = () => {
        //renvoie true si le héros portait un item
        if (this.hero && UnitHasItemOfTypeBJ(this.hero, METEOR_NORMAL)) {
            const item = UnitItemInSlot(this.hero, 0)
            if (!!item) {
                SetItemDroppable(item, true)
                udg_meteors[GetItemUserData(item)]?.replace()
                this.removeEffectMeteor()
                return true
            }
        }
        return false
    }

    addEffectMeteor = () => {
        if (!this.meteorEffect && this.hero) {
            this.meteorEffect = EffectUtils.addSpecialEffectTarget(METEOR_EFFECT, this.hero, 'hand right')
        }
    }

    removeEffectMeteor = () => {
        if (this.meteorEffect) {
            EffectUtils.destroyEffect(this.meteorEffect)
            delete this.meteorEffect
        }
    }

    //select method
    selectHero = () => {
        this.hero && SelectUnitAddForPlayer(this.hero, this.controler.getPlayer())
        this.setIsHeroSelectedForPlayer(this.controler.getPlayer(), true)
    }

    //creation method
    createHero(x: number, y: number, angle: number) {
        //retourne false si le héros existe déja
        let heroTypeId = this.skin || Constants.HERO_TYPE_ID

        if (this.hero) {
            return false
        }

        if (this.escaperId >= Constants.NB_PLAYERS_MAX) {
            heroTypeId = Constants.HERO_SECONDARY_TYPE_ID
        }

        this.hero = Natives.UCreateUnit(this.p, heroTypeId, x, y, angle)

        if (!this.hero) {
            // Invalid skin, reset and try again
            if (this.skin) {
                this.setSkin(undefined)
                this.createHero(x, y, angle)
            }

            return
        }

        if (this.skin) {
            UnitRemoveAbility(this.hero, FourCC('Aloc'))
            UnitAddAbility(this.hero, FourCC('Aloc'))
        }

        if (this.scale !== undefined) {
            SetUnitScale(this.hero, this.scale, this.scale, this.scale)
        }

        globals.heroToEscaperHandles[GetHandleId(this.hero)] = this.escaperId

        if (this.escaperId >= Constants.NB_PLAYERS_MAX) {
            SetUnitTimeScale(this.hero, this.animSpeedSecondaryHero)
        }

        BlzSetUnitBooleanField(this.hero, UNIT_BF_HERO_HIDE_HERO_DEATH_MESSAGE, true)

        SetUnitFlyHeight(this.hero, 1, 0)
        SetUnitFlyHeight(this.hero, 0, 0)
        SetUnitUserData(this.hero, this.escaperId)
        ShowUnit(this.hero, false)
        ShowUnit(this.hero, true)
        UnitRemoveAbility(this.hero, FourCC('Aloc'))
        SetUnitMoveSpeed(this.hero, this.walkSpeed) //voir pour le nom de la fonction
        this.selectHero()
        this.moveCameraToHeroIfNecessary()

        SetUnitColor(this.hero, Natives.UConvertPlayerColor(this.baseColorId))
        SetUnitColor(this.powerCircle, Natives.UConvertPlayerColor(this.baseColorId))

        this.updateUnitVertexColor()
        this.SpecialIllidan()

        this.refreshInvisUnit()
        this.refreshCollisionLandmark()

        this.createHeroEffect()

        this.effects.showEffects(this.hero)
        delete this.lastTerrainType
        TimerStart(AfkMode.afkModeTimers[this.escaperId], AfkMode.timeMinAfk, false, () =>
            AfkMode.GetAfkModeTimeExpiresCodeFromId(this.escaperId)
        )

        EnableTrigger(this.checkTerrain)

        this.textTag = Natives.UCreateTextTag()
        SetTextTagTextBJ(this.textTag, udg_colorCode[this.getColorId()] + this.getDisplayName(), 10)
        SetTextTagPermanent(this.textTag, true)
        SetTextTagVisibility(this.textTag, false)
        this.textTagTimer = createTimer(0.01, true, this.updateTextTagPos)

        this.updateShowNames(false)
        this.updateUnitVertexColor()

        this.startCommandsHandle.loadStartCommands()

        //what to do on hero death
        const hero = this.hero
        createEvent({
            events: [t => TriggerRegisterUnitEvent(t, hero, EVENT_UNIT_DEATH)],
            actions: [
                () => {
                    this.onEscaperDeath()
                },
            ],
        })

        this.skin && SetUnitPathing(this.hero, false)

        return true
    }

    createHeroAtStart = () => {
        let x: number
        let y: number
        let start = getUdgLevels().getCurrentLevel(this)?.getStart()
        let angle: number

        if (!start) {
            //si le départ du niveau en cours n'existe pas
            start = DEPART_PAR_DEFAUT
            angle = HERO_START_ANGLE
        } else {
            angle = GetRandomDirectionDeg()
        }

        x = start.getRandomX()
        y = start.getRandomY()
        return this.createHero(x, y, angle)
    }

    removeHero = () => {
        if (!this.hero) {
            return
        }

        this.resetItem()

        this.kill()

        delete globals.heroToEscaperHandles[GetHandleId(this.hero)]
        RemoveUnit(this.hero)
        delete this.hero
        this.refreshCollisionLandmark()

        if (this.invisUnit) {
            RemoveUnit(this.invisUnit)
            delete this.invisUnit
        }

        delete this.lastTerrainType
        this.destroyMake()
        this.effects.hideEffects()

        const staticSliding = this.staticSliding

        if (staticSliding) {
            staticSliding.removePlayer(this.getId())
        }

        DisableTrigger(this.checkTerrain)
        this.slide && this.slide.pause().destroy()

        //coop
        ShowUnit(this.powerCircle, false)
        ShowUnit(this.dummyPowerCircle, false)

        if (!this.isEscaperSecondary()) {
            GetMirrorEscaper(this)?.removeHero()
        }

        this.textTag && DestroyTextTag(this.textTag)
        this.textTag = null
        this.textTagTimer?.destroy()
        this.textTagTimer = null
    }

    destroy = () => {
        this.removeHero()

        if (this.terrainKillEffect) {
            EffectUtils.destroyEffect(this.terrainKillEffect)
            delete this.terrainKillEffect
        }
        this.effects.destroy()

        this.slide && this.slide.destroy()
        DestroyTrigger(this.checkTerrain)

        this.discoTrigger?.destroy()
        delete this.discoTrigger

        getUdgEscapers().removeEscaper(this.escaperId)

        //coop
        RemoveUnit(this.powerCircle)
        RemoveUnit(this.dummyPowerCircle)

        this.portalCooldownTimer?.destroy()
        this.portalCooldownTimer = null

        DestroyTrigger(this.cantClickTrigger)

        this.lastPos?.__destroy()

        this.destroyMake()
        this.destroyMakeLastActions()
    }

    //getId method
    getId = () => {
        return this.escaperId
    }

    //trigger methods
    enableSlide(doEnable: boolean) {
        if (!!this.slide === doEnable) {
            return false
        }

        if (this.isStaticSliding()) {
            return false
        }

        if (doEnable) {
            this.slide = SlideTrigger.CreateSlideTimer(this.escaperId)

            if (this.hero) {
                StopUnit(this.hero)
                this.setLastZ(this.getHeroZ())

                //follow mouse
                if (this.followMouse) {
                    //be sure we aren't on reverse
                    const tt = getUdgTerrainTypes().getTerrainType(this.getHeroX(), this.getHeroY())
                    if (tt instanceof TerrainTypeSlide && tt.getSlideSpeed() >= 0) {
                        this.followMouse.startFollowingMouse()
                    }
                }
            }
        } else {
            this.slide?.pause().destroy()
            delete this.slide
            this.slideLastAngleOrder = -1
            this.setRemainingDegreesToTurn(0)
            this.setSlideCurrentTurnPerPeriod(0)
        }

        this.updateHeroEffectMode()

        return true
    }

    setSlideLastAngleOrder(angle: number) {
        this.slideLastAngleOrder = angle
    }

    getSlideLastAngleOrder = () => {
        return this.slideLastAngleOrder
    }

    enableCheckTerrain(doEnable: boolean) {
        if (IsTriggerEnabled(this.checkTerrain) == doEnable) {
            return false
        }
        if (doEnable) {
            EnableTrigger(this.checkTerrain)
        } else {
            DisableTrigger(this.checkTerrain)
        }
        return true
    }

    isSliding = () => {
        return !!this.slide
    }

    doesCheckTerrain = () => {
        return IsTriggerEnabled(this.checkTerrain)
    }

    setLastPos = () => {
        if (!this.hero) return

        const lastX = this.getHeroX()
        const lastY = this.getHeroY()

        if (!this.lastPos || (this.lastPos.x !== lastX && this.lastPos.y !== lastY)) {
            this.lastPos?.__destroy()
            this.lastPos = createPoint(lastX, lastY)
        }
    }

    //move methods

    /**
     * Everything about where the hero is and where it looks goes through these, rather than
     * through GetUnitX and friends: during an async slide the unit is parked out of the map and
     * the effect is the hero, so asking the unit would give the corner it waits in.
     */
    getHeroX = () => (this.isHeroEffectActive ? this.heroPos.x : this.hero ? GetUnitX(this.hero) : 0)

    getHeroY = () => (this.isHeroEffectActive ? this.heroPos.y : this.hero ? GetUnitY(this.hero) : 0)

    getHeroFacing = () => (this.isHeroEffectActive ? this.heroPos.facing : this.hero ? GetUnitFacing(this.hero) : 0)

    getHeroFlyHeight = () =>
        this.isHeroEffectActive ? this.heroPos.flyHeight : this.hero ? GetUnitFlyHeight(this.hero) : 0

    /** Terrain height at the hero position, plus how high above it the hero flies */
    getHeroZ = () => GetLocZ(this.getHeroX(), this.getHeroY()) + this.getHeroFlyHeight()

    moveHero(x: number, y: number, updateLast = true) {
        if (!this.hero) {
            return
        }

        if (updateLast) {
            this.setLastPos()
        }

        if (this.isHeroEffectMovementBlocked()) {
            return
        }

        this.heroPos.x = x
        this.heroPos.y = y

        if (this.isHeroEffectActive) {
            this.updateHeroEffect()

            return
        }

        SetUnitX(this.hero, x)
        SetUnitY(this.hero, y)
    }

    /** Turns the hero on the spot, without the progressive rotation of SetUnitFacing */
    setHeroFacing(angle: number) {
        if (!this.hero) {
            return
        }

        if (this.isHeroEffectMovementBlocked()) {
            return
        }

        this.heroPos.facing = angle

        if (this.isHeroEffectActive) {
            this.updateHeroEffect()

            return
        }

        BlzSetUnitFacingEx(this.hero, angle)
    }

    setHeroFlyHeight(height: number, rate: number) {
        if (!this.hero) {
            return
        }

        if (this.isHeroEffectMovementBlocked()) {
            return
        }

        this.heroPos.flyHeight = height

        if (this.isHeroEffectActive) {
            this.updateHeroEffect()

            return
        }

        SetUnitFlyHeight(this.hero, height, rate)
    }

    moveInvisUnit(x: number, y: number) {
        if (this.invisUnit) {
            SetUnitX(this.invisUnit, x)
            SetUnitY(this.invisUnit, y)
        }
    }

    //hero methods
    getHero = () => {
        return this.hero
    }

    isAlive = () => {
        return this.hero && IsUnitAliveBJ(this.hero)
    }

    isPaused = () => {
        return this.hero && IsUnitPaused(this.hero)
    }

    private onEscaperDeath = () => {
        this.resetItem()
        delete this.lastTerrainType
        this.invisUnit && ShowUnit(this.invisUnit, false)
        this.enableCheckTerrain(false)
        AfkMode.StopAfk(this.escaperId)
        MessageHeroDies.DisplayDeathMessagePlayer(this.p)
        this.isHeroSelectedB = false

        if (this.firstPersonHandle.isFirstPerson()) {
            this.resetCamera()
        }

        if (!this.isEscaperSecondary()) {
            ServiceManager.getService('Multiboard').increasePlayerScore(GetPlayerId(this.getPlayer()), 'deaths')
        }

        for (const [_, target] of pairs(getUdgEscapers().getAll())) {
            if (target.lockCamTarget === this) {
                target.calcProgressionLockCamTarget()
            }
        }
    }

    /**
     * While the hero is an effect, only this machine knows where it is, so it cannot die here and
     * now: the effect freezes on the spot, and every machine is told where it stopped. The death
     * happens for real in applyAsyncDeath, once they all agree.
     */
    kill = () => {
        if (this.isAsyncControlledElsewhere()) {
            // not this machine to say: its owner will tell where it died
            return true
        }

        if (this.isHeroEffectActive && !this.isHeroEffectFrozen && this.isAlive()) {
            this.isHeroEffectFrozen = true

            sendAsyncHeroDeath(this.escaperId, this.getHeroMovementState())

            return true
        }

        return this.killNow()
    }

    /** Everything the other machines need to carry on the movement of this hero themselves */
    getHeroMovementState = (): HeroMovementState => ({
        x: this.heroPos.x,
        y: this.heroPos.y,
        facing: this.heroPos.facing,
        // absolute rather than the degrees left to turn, which would drift from packet to packet
        targetAngle: this.heroPos.facing + this.getRemainingDegreesToTurn(),
        flyHeight: this.heroPos.flyHeight,
        speedZ: this.getSpeedZ(),
        lastZ: this.getLastZ(),
        oldDiffZ: this.getOldDiffZ(),
        slideMovePerPeriod: this.getSlideMovePerPeriod(),
        turnPerPeriod: this.getSlideCurrentTurnPerPeriod(),
    })

    /** Puts this hero exactly where the machine of its player says it is */
    private applyHeroMovementState = (movement: HeroMovementState) => {
        this.heroPos.x = movement.x
        this.heroPos.y = movement.y
        this.heroPos.facing = movement.facing
        this.heroPos.flyHeight = movement.flyHeight

        this.setRemainingDegreesToTurn(AnglesDiff(movement.targetAngle, movement.facing))
        this.setSlideCurrentTurnPerPeriod(movement.turnPerPeriod)
        this.setSpeedZ(movement.speedZ)
        this.setLastZ(movement.lastZ)
        this.setOldDiffZ(movement.oldDiffZ)
        this.setSlideMovePerPeriodOnResync(movement.slideMovePerPeriod)
    }

    /**
     * A snapshot from the machine owning this hero. Between two of them the slide of every machine
     * carries the movement on by itself, which is why the angle asked for and the angular speed
     * travel along: the same numbers in, the same path out.
     *
     * The sender applies nothing here: it is already ahead of what it just sent.
     */
    applyAsyncPosition = (sequence: number, movement: HeroMovementState) => {
        if (sequence <= this.lastAsyncSequence || GetLocalPlayer() === this.p || !this.isHeroEffectActive) {
            return
        }

        this.lastAsyncSequence = sequence
        this.lastAsyncPacketTime = os.clock()
        this.applyHeroMovementState(movement)
        this.updateHeroEffect()
    }

    /**
     * The death everybody agreed on: the unit takes back the place, the facing and the fly height
     * the effect had reached, and dies there. Dying in the air needs nothing special: the slide
     * keeps carrying a dead hero until it lands, and only then stops.
     */
    applyAsyncDeath = (sequence: number, movement: HeroMovementState) => {
        this.lastAsyncSequence = sequence
        this.lastAsyncPacketTime = os.clock()
        this.applyHeroMovementState(movement)

        this.setHeroAsEffect(false)
        this.isHeroEffectFrozen = false

        // Killed before the slide is turned back on: enabling it hands a sliding hero over to its
        // effect again, which a dead one must not be.
        this.killNow()

        // The slide may well be off here: it is turned on and off by the terrain under the hero,
        // and in async mode every machine reads that under its own position. Without it the body
        // would stop in mid air instead of finishing its flight.
        this.enableSlide(true)

        // after enableSlide, which samples the terrain height itself and would overwrite them
        this.setLastZ(movement.lastZ)
        this.setOldDiffZ(movement.oldDiffZ)
    }

    /** Kills the hero for real, wherever its unit stands */
    killNow = () => {
        if (this.isAlive()) {
            if (this.hero) {
                KillUnit(this.hero)

                for (const hook of hooks.hooks_onEscaperDeath.getHooks()) {
                    hook.execute(this)
                }

                this.disableSlideSpeedTemporarily()
            }
            return true
        }
        return false
    }

    pause(doPause: boolean) {
        if (this.isPaused() == doPause) {
            return false
        }
        this.hero && PauseUnit(this.hero, doPause)
        return true
    }

    SpecialIllidan = () => {
        this.hero && SetUnitAnimation(this.hero, 'Morph Alternate')
    }

    revive(x: number, y: number, type: 'coop' | 'other' = 'other') {
        const isAlive = this.isAlive()

        if (!this.hero || !this.invisUnit || isAlive) {
            return false
        }

        this.setLastPos()

        if (IsHeroUnitId(GetUnitTypeId(this.hero))) {
            ReviveHero(this.hero, x, y, SHOW_REVIVE_EFFECTS)

            if (this.skin) {
                SetUnitPathing(this.hero, false)
                SetUnitX(this.hero, x)
                SetUnitY(this.hero, y)
            }
        } else {
            const angle = this.getHeroFacing()

            this.removeHero()
            this.createHero(x, y, angle)
        }

        SetUnitX(this.invisUnit, x)
        SetUnitY(this.invisUnit, y)
        ShowUnit(this.invisUnit, true)
        this.enableCheckTerrain(true)
        this.SpecialIllidan()
        this.selectHero()
        this.updateUnitVertexColor()

        for (const [_, terrainType] of pairs(getUdgTerrainTypes().getAll())) {
            if (isDeathTerrain(terrainType)) {
                terrainType.abortKillEscaper(this)
            }
        }

        if (!this.firstPersonHandle.isFirstPerson()) {
            this.setCanClick(true)
        }

        TimerStart(AfkMode.afkModeTimers[this.escaperId], AfkMode.timeMinAfk, false, () =>
            AfkMode.GetAfkModeTimeExpiresCodeFromId(this.escaperId)
        )
        this.lastZ = 0
        this.oldDiffZ = 0
        this.speedZ = 0

        //coop
        ShowUnit(this.powerCircle, false)
        ShowUnit(this.dummyPowerCircle, false)

        if (this.hero && (this.panCameraOnRevive === 'all' || this.panCameraOnRevive === type)) {
            //move camera if needed
            if (GetLocalPlayer() == this.p) {
                this.moveCameraToHeroIfNecessary()
            }
        }

        if (type !== 'coop') {
            for (const [_, staticSlide] of pairs(getUdgLevels().getCurrentLevel(this).staticSlides.getAll())) {
                staticSlide.removePlayer(this.escaperId)
            }
        }

        reviveTrigManager.removeEscaper(this.escaperId)

        return true
    }

    moveCameraToHeroIfNecessary = () => {
        if (!this.hero) {
            return
        }

        if (this.isLockCamTarget()) {
            return
        }

        if (this.panCameraOnRevive === 'none') {
            return
        }

        const xHero = this.getHeroX()
        const yHero = this.getHeroY()

        const minX = GetCameraTargetPositionX() - this.moveCamDistanceWidth / 2
        const minY = GetCameraTargetPositionY() - this.moveCamDistanceHeight / 2
        const maxX = GetCameraTargetPositionX() + this.moveCamDistanceWidth / 2
        const maxY = GetCameraTargetPositionY() + this.moveCamDistanceHeight / 2

        if (xHero < minX || xHero > maxX || yHero < minY || yHero > maxY) {
            SetCameraPositionForPlayer(this.p, xHero, yHero)
        }
    }

    reviveAtStart = () => {
        const x: number = getUdgLevels().getCurrentLevel(this).getStartRandomX()
        const y: number = getUdgLevels().getCurrentLevel(this).getStartRandomY()

        if (!this.isEscaperSecondary()) {
            GetMirrorEscaper(this)?.reviveAtStart()
        }

        const startFacing = getUdgLevels().getCurrentLevel(this).getStart()?.getFacing()
        startFacing && this.turnInstantly(startFacing)

        return this.revive(x, y)
    }

    turnInstantly(angle: number) {
        this.setHeroFacing(angle)
    }

    /**
     * The slow turn of a unit, at its own turn rate. An effect has no such thing, so it turns on
     * the spot instead: while sliding in async mode the angle comes from the cursor anyway, and
     * the slide applies its own rotation speed on top.
     */
    turnProgressively(angle: number) {
        if (!this.hero) {
            return
        }

        if (this.isHeroEffectActive) {
            this.setHeroFacing(angle)

            return
        }

        SetUnitFacing(this.hero, angle)
    }

    reverse = () => {
        if (!this.hero) return

        const angle: number = this.getHeroFacing() + 180
        this.turnInstantly(angle)
        if (this.slideLastAngleOrder != -1) {
            this.slideLastAngleOrder = this.slideLastAngleOrder + 180
            SetUnitFacing(this.hero, this.slideLastAngleOrder)
        }
    }

    giveHeroControl(escaper: Escaper) {
        this.hero && SetUnitOwner(this.hero, escaper.getPlayer(), false)
        this.controler = escaper
    }

    resetOwner = () => {
        this.giveHeroControl(this)
    }

    setIsHeroSelectedForPlayer(p: player, heroSelected: boolean) {
        if (GetLocalPlayer() == p) {
            this.isHeroSelectedB = heroSelected
        }
    }

    setSelectedPlayerId = (playerId: number) => {
        this.selectedPlayerId = playerId
    }

    getSelectedPlayerId = () => this.selectedPlayerId

    //effects methods
    newEffect(efStr: string, bodyPart: string) {
        this.hero && this.effects.new(efStr, this.hero, bodyPart)

        if (!this.isEscaperSecondary()) {
            GetMirrorEscaper(this)?.newEffect(efStr, bodyPart)
        }
    }

    destroyLastEffects(numEfToDestroy: number) {
        this.effects.destroyLastEffects(numEfToDestroy)

        if (!this.isEscaperSecondary()) {
            GetMirrorEscaper(this)?.destroyLastEffects(numEfToDestroy)
        }
    }

    hideEffects = () => {
        this.effects.hideEffects()

        if (!this.isEscaperSecondary()) {
            GetMirrorEscaper(this)?.hideEffects()
        }
    }

    showEffects = () => {
        this.hero && this.effects.showEffects(this.hero)

        if (!this.isEscaperSecondary()) {
            GetMirrorEscaper(this)?.showEffects()
        }
    }

    //terrainKill methods
    destroyTerrainKillEffect = () => {
        EffectUtils.destroyEffect(this.terrainKillEffect)
    }

    createTerrainKillEffect(killEffectStr: string) {
        this.destroyTerrainKillEffect()
        this.hero &&
            (this.terrainKillEffect = EffectUtils.addSpecialEffectTarget(
                killEffectStr,
                this.hero,
                Constants.TERRAIN_KILL_EFFECT_BODY_PART
            ))
    }

    destroyPortalEffect = () => {
        EffectUtils.destroyEffect(this.portalEffect)
    }

    createPortalEffect(effectStr: string) {
        this.destroyPortalEffect()
        this.hero &&
            (this.portalEffect = EffectUtils.addSpecialEffectTarget(
                effectStr,
                this.hero,
                Constants.TERRAIN_KILL_EFFECT_BODY_PART
            ))
    }

    //lastTerrainType methods
    getLastTerrainType = () => {
        return this.lastTerrainType
    }

    setLastTerrainType(terrainType: TerrainType | undefined) {
        this.lastTerrainType = terrainType
    }

    //speed methods
    setSlideSpeed(ss: number) {
        this.slideSpeed = ss
        this.slideMovePerPeriod = ss * Constants.SLIDE_PERIOD
    }

    /**
     * Forces how far the hero travels each period, as it was on the machine that saw it die. The
     * temporary speed is dropped: its timer cannot be transmitted, and the hero is dead anyway,
     * so this speed only has to last until it lands.
     */
    setSlideMovePerPeriodOnResync(movePerPeriod: number) {
        this.disableSlideSpeedTemporarily()
        this.slideMovePerPeriod = movePerPeriod
    }

    disableSlideSpeedTemporarily() {
        if (this.tempSlideSpeedTimer) {
            this.tempSlideSpeedEffect && DestroyEffect(this.tempSlideSpeedEffect)
            this.tempSlideSpeedEffect = null
            this.tempSlideSpeedTimer?.destroy()
            this.tempSlideSpeedTimer = null
            this.tempSlideSpeedPerPeriod = null
        }
    }

    setSlideSpeedTemporarily(ss: number, duration: number, effect?: string) {
        this.disableSlideSpeedTemporarily()
        this.tempSlideSpeedPerPeriod = (this.getSlideMirror() ? -1 : 1) * ss * Constants.SLIDE_PERIOD

        if (this.hero && effect) {
            this.tempSlideSpeedEffect = Natives.UAddSpecialEffectTargetUnitBJ('origin', this.hero, effect)
        }

        this.tempSlideSpeedTimer = createTimer(duration, false, () => {
            this.disableSlideSpeedTemporarily()
        })
    }

    //speed methods
    setRotationSpeed(rs: number) {
        this.rotationSpeed = rs //rounds
        this.maxSlideTurnPerPeriod = rs * Constants.SLIDE_PERIOD * 360 //degrees
    }

    getRemainingDegreesToTurn() {
        return this.remainingDegreesToTurn
    }

    setRemainingDegreesToTurn(remainingDegreesToTurn: number) {
        if (RAbsBJ(remainingDegreesToTurn) < 0.01) remainingDegreesToTurn = 0
        this.remainingDegreesToTurn = remainingDegreesToTurn
    }

    getSlideMovePerPeriod = () => {
        return this.tempSlideSpeedPerPeriod || this.slideMovePerPeriod
    }

    getMaxSlideTurnPerPeriod = () => {
        return this.maxSlideTurnPerPeriod
    }

    setSlideCurrentTurnPerPeriod = (n: number) => {
        this.slideCurrentTurnPerPeriod = n
    }

    getSlideCurrentTurnPerPeriod = () => {
        return this.slideCurrentTurnPerPeriod
    }

    setWalkSpeed(ws: number) {
        this.walkSpeed = ws
        this.hero && SetUnitMoveSpeed(this.hero, ws)
    }

    getSlideSpeed = () => {
        return this.slideSpeed
    }

    getRotationSpeed = () => {
        return this.rotationSpeed
    }

    getWalkSpeed = () => {
        return this.walkSpeed
    }

    isAbsoluteSlideSpeed = () => {
        return this.slideSpeedAbsolute
    }

    absoluteSlideSpeed(slideSpeed: number, isCommand = false) {
        this.slideSpeedAbsolute = true
        this.setSlideSpeed((this.getSlideMirror() ? -1 : 1) * slideSpeed)
        isCommand && (this.slideSpeedCmd = slideSpeed)

        if (!this.isEscaperSecondary()) {
            GetMirrorEscaper(this)?.absoluteSlideSpeed(slideSpeed, isCommand)
        }
    }

    stopAbsoluteSlideSpeed = (isCommand = false) => {
        if (this.slideSpeedAbsolute) {
            this.slideSpeedAbsolute = false

            if (this.hero && this.isAlive()) {
                const currentTerrainType = getUdgTerrainTypes().getTerrainType(this.getHeroX(), this.getHeroY())

                if (currentTerrainType instanceof TerrainTypeSlide) {
                    this.setSlideSpeed((this.getSlideMirror() ? -1 : 1) * currentTerrainType.getSlideSpeed())
                }
            }

            if (isCommand) {
                this.slideSpeedCmd = undefined
            } else {
                if (this.slideSpeedCmd !== undefined) {
                    this.slideSpeedAbsolute = true
                    this.setSlideSpeed(this.slideSpeedCmd)
                }
            }

            if (!this.isEscaperSecondary()) {
                GetMirrorEscaper(this)?.stopAbsoluteSlideSpeed(isCommand)
            }
        }
    }

    isAbsoluteRotationSpeed = () => {
        return this.rotationSpeedAbsolute
    }

    absoluteRotationSpeed(rotationSpeed: number) {
        this.rotationSpeedAbsolute = true
        this.setRotationSpeed(rotationSpeed)

        if (!this.isEscaperSecondary()) {
            GetMirrorEscaper(this)?.absoluteRotationSpeed(rotationSpeed)
        }
    }

    stopAbsoluteRotationSpeed = () => {
        if (this.rotationSpeedAbsolute) {
            this.rotationSpeedAbsolute = false

            if (this.hero && this.isAlive()) {
                const currentTerrainType = getUdgTerrainTypes().getTerrainType(this.getHeroX(), this.getHeroY())
                if (currentTerrainType instanceof TerrainTypeSlide) {
                    this.setRotationSpeed(currentTerrainType.getRotationSpeed())
                }
            }

            if (!this.isEscaperSecondary()) {
                GetMirrorEscaper(this)?.stopAbsoluteRotationSpeed()
            }
        }
    }

    isAbsoluteWalkSpeed = () => {
        return this.walkSpeedAbsolute
    }

    absoluteWalkSpeed(walkSpeed: number) {
        this.walkSpeedAbsolute = true
        this.setWalkSpeed(walkSpeed)

        if (!this.isEscaperSecondary()) {
            GetMirrorEscaper(this)?.absoluteWalkSpeed(walkSpeed)
        }
    }

    stopAbsoluteWalkSpeed = () => {
        if (this.walkSpeedAbsolute) {
            this.walkSpeedAbsolute = false
            if (this.hero && this.isAlive()) {
                const currentTerrainType = getUdgTerrainTypes().getTerrainType(this.getHeroX(), this.getHeroY())
                if (currentTerrainType instanceof TerrainTypeWalk) {
                    this.setWalkSpeed(currentTerrainType.getWalkSpeed())
                }
            }

            if (!this.isEscaperSecondary()) {
                GetMirrorEscaper(this)?.stopAbsoluteWalkSpeed()
            }
        }
    }

    isAbsoluteInstantTurn = () => {
        return this.instantTurnAbsolute
    }

    setAbsoluteInstantTurn(flag: boolean) {
        this.instantTurnAbsolute = flag

        if (!this.isEscaperSecondary()) {
            GetMirrorEscaper(this)?.setAbsoluteInstantTurn(flag)
        }
    }

    //godMode methods
    setGodMode(godMode: boolean) {
        this.godMode = godMode

        if (!this.isEscaperSecondary()) {
            GetMirrorEscaper(this)?.setGodMode(godMode)
        }
    }

    setGodModeKills(godModeKills: boolean) {
        this.godModeKills = godModeKills

        if (!this.isEscaperSecondary()) {
            GetMirrorEscaper(this)?.setGodModeKills(godModeKills)
        }
    }

    isGodModeOn = () => {
        return this.godMode
    }

    doesGodModeKills = () => {
        return this.godModeKills
    }

    //color methods
    setBaseColor(baseColorId: number) {
        if (baseColorId < 0 || baseColorId >= Constants.NB_PLAYERS_MAX_REFORGED) {
            return false
        }
        this.baseColorId = baseColorId
        if (this.hero) {
            if (baseColorId == 0) {
                SetUnitColor(this.hero, PLAYER_COLOR_RED)
                SetUnitColor(this.powerCircle, PLAYER_COLOR_RED)
            } else {
                SetUnitColor(this.hero, Natives.UConvertPlayerColor(baseColorId))
                SetUnitColor(this.powerCircle, Natives.UConvertPlayerColor(baseColorId))
            }
        }

        this.updateUnitVertexColor()

        if (!this.isEscaperSecondary()) {
            ColorInfo(this, this.p)
            GetMirrorEscaper(this)?.setBaseColor(baseColorId)
        }
        return true
    }

    setBaseColorDisco(baseColorId: number) {
        if (baseColorId < 0 || baseColorId >= Constants.NB_PLAYERS_MAX_REFORGED) {
            return false
        }
        this.baseColorId = baseColorId
        if (this.hero) {
            if (baseColorId == 0) {
                SetUnitColor(this.hero, PLAYER_COLOR_RED)
                SetUnitColor(this.powerCircle, PLAYER_COLOR_RED)
            } else {
                SetUnitColor(this.hero, Natives.UConvertPlayerColor(baseColorId))
                SetUnitColor(this.powerCircle, Natives.UConvertPlayerColor(baseColorId))
            }
        }

        if (!this.isEscaperSecondary()) {
            GetMirrorEscaper(this)?.setBaseColorDisco(baseColorId)
        }

        return true
    }

    getBaseColor = () => {
        return this.baseColorId
    }

    setVcRed(vcRed: number) {
        if (vcRed < 0 || vcRed > 100) {
            return false
        }
        this.vcRed = vcRed

        if (!this.isEscaperSecondary()) {
            GetMirrorEscaper(this)?.setVcRed(vcRed)
        }

        return true
    }

    setVcGreen(vcGreen: number) {
        if (vcGreen < 0 || vcGreen > 100) {
            return false
        }
        this.vcGreen = vcGreen

        if (!this.isEscaperSecondary()) {
            GetMirrorEscaper(this)?.setVcGreen(vcGreen)
        }

        return true
    }

    setVcBlue(vcBlue: number) {
        if (vcBlue < 0 || vcBlue > 100) {
            return false
        }

        if (!this.isEscaperSecondary()) {
            GetMirrorEscaper(this)?.setVcBlue(vcBlue)
        }

        this.vcBlue = vcBlue
        return true
    }

    setVcTransparency(vcTransparency: number) {
        if (vcTransparency < 0 || vcTransparency > 100) {
            return false
        }

        if (this.isEscaperSecondary()) {
            return true //secondary escapers transparency is fixed
        }

        this.vcTransparency = vcTransparency

        return true
    }

    getVcRed = () => {
        return this.vcRed
    }

    getVcGreen = () => {
        return this.vcGreen
    }

    getVcBlue = () => {
        return this.vcBlue
    }

    getVcTransparency = () => {
        return this.vcTransparency
    }

    refreshVertexColor = () => {
        this.hero && this.updateUnitVertexColor()

        if (!this.isEscaperSecondary()) {
            ColorInfo(this, this.p)
            GetMirrorEscaper(this)?.refreshVertexColor()
        }
    }

    //cheat methods
    setCanCheat(canCheat: boolean) {
        if (!canCheat) {
            this.isMaximaxouB = false
            this.isTrueMaximaxouB = false
        }
        this.canCheatB = canCheat
    }

    setIsMaximaxou(isMaximaxou: boolean) {
        if (isMaximaxou) {
            this.setCanCheat(true)
        } else {
            this.isTrueMaximaxouB = false
        }
        this.isMaximaxouB = isMaximaxou
    }

    setIsTrueMaximaxou(isTrueMaximaxou: boolean) {
        if (isTrueMaximaxou) {
            this.setIsMaximaxou(true)
        }
        this.isTrueMaximaxouB = isTrueMaximaxou
    }

    canCheat = () => {
        return this.canCheatB
    }

    isMaximaxou = () => {
        return this.isMaximaxouB
    }

    isTrueMaximaxou = () => {
        return this.isTrueMaximaxouB
    }

    //autres
    getPlayer = () => {
        return this.p
    }

    getControler = () => {
        return this.controler
    }

    setCameraField(cameraField: number) {
        this.cameraField = cameraField
        SetCameraFieldForPlayer(this.p, CAMERA_FIELD_TARGET_DISTANCE, I2R(cameraField), 0)
    }

    getCameraField = () => {
        return this.cameraField
    }

    resetCamera = () => {
        if (!this.spinCamTimer) {
            ResetToGameCameraForPlayer(this.p, 0)
        }

        SetCameraFieldForPlayer(this.p, CAMERA_FIELD_TARGET_DISTANCE, this.cameraField, 0)

        if (this.lockCamTarget) {
            const hero = this.lockCamTarget.getHero()

            if (hero) {
                SetCameraTargetControllerNoZForPlayer(this.getPlayer(), hero, 0, 0, false)
            }
        }

        this.startSpinCam()
    }

    startSpinCam = () => {
        if (this.spinCamSpeed !== 0 && this.lastTerrainType?.getKind() === 'slide') {
            this.stopSpinCam()

            this.spinCamTimer = createTimer(Constants.SLIDE_PERIOD, true, () => {
                if (this.hero) {
                    SetCameraFieldForPlayer(
                        this.getPlayer(),
                        CAMERA_FIELD_ROTATION,
                        ForceAngleBetween0And360(Rad2Deg(GetCameraField(CAMERA_FIELD_ROTATION)) + this.spinCamSpeed),
                        0
                    )
                }
            })
        } else {
            this.stopSpinCam()
        }
    }

    stopSpinCam = () => {
        if (this.spinCamTimer) {
            this.spinCamTimer?.destroy()
            this.spinCamTimer = null
        }
    }

    kick(kicked: Escaper) {
        CustomDefeatBJ(kicked.getPlayer(), 'You have been kicked by ' + this.displayName + ' !')
        Text.A(
            udg_colorCode[kicked.getColorId()] +
                kicked.displayName +
                ' has been kicked by ' +
                udg_colorCode[this.getColorId()] +
                this.displayName +
                ' !'
        )
        kicked.destroy()
        GetMirrorEscaper(kicked)?.destroy()

        // Delay it a bit
        runInTrigger(() => getUdgLevels().deactivateEmptyLevels())
    }

    //autorevive methods
    hasAutorevive = () => {
        return this.hasAutoreviveB
    }

    setHasAutorevive(hasAutorevive: boolean) {
        this.hasAutoreviveB = hasAutorevive
    }

    //for gravity gestion
    getLastZ = () => {
        return this.lastZ
    }

    setLastZ(lastZ: number) {
        this.lastZ = lastZ
    }

    getOldDiffZ = () => {
        return this.oldDiffZ
    }

    setOldDiffZ(oldDiffZ: number) {
        this.oldDiffZ = oldDiffZ
    }

    getSpeedZ = () => {
        return this.speedZ
    }

    setSpeedZ(speedZ: number) {
        this.speedZ = speedZ
    }

    //coop reviving
    coopReviveHero: (this: void) => void = () => {
        const mirrorEscaper = GetMirrorEscaper(this)
        const mirrorHero = mirrorEscaper?.getHero()

        if (this.hero) {
            const xHero = this.getHeroX()
            const yHero = this.getHeroY()

            if (!this.revive(xHero, yHero, 'coop')) {
                if (this.hero && (this.panCameraOnRevive === 'all' || this.panCameraOnRevive === 'coop')) {
                    //move camera if needed
                    if (GetLocalPlayer() == this.p) {
                        this.moveCameraToHeroIfNecessary()
                    }
                }
            }

            RunCoopSoundOnHero(this.hero)
            animUtils.setAnimation(this.hero, globals.animOnRevive || 'channel')
            this.absoluteSlideSpeed(0)
            this.setCoopInvul(true)
        }

        if (mirrorHero && mirrorEscaper) {
            mirrorEscaper.revive(GetUnitX(mirrorHero), GetUnitY(mirrorHero), 'coop')
            RunCoopSoundOnHero(mirrorHero)
            animUtils.setAnimation(mirrorHero, globals.animOnRevive || 'channel')
            mirrorEscaper.absoluteSlideSpeed(0)
            mirrorEscaper.setCoopInvul(true)
        }

        TriggerSleepAction(1.4)

        this.stopAbsoluteSlideSpeed()
        this.hero && SetUnitAnimation(this.hero, 'stand')

        mirrorEscaper?.stopAbsoluteSlideSpeed()
        mirrorHero && SetUnitAnimation(mirrorHero, 'stand')

        TriggerSleepAction(0.6)

        this.setCoopInvul(false)
        mirrorEscaper?.setCoopInvul(false)
    }

    isCoopInvul = () => {
        return this.coopInvul
    }

    setCoopInvul(invul: boolean) {
        this.coopInvul = invul
    }

    enableTrigCoopRevive = () => {
        if (this.hero) {
            ShowUnit(this.powerCircle, true)
            SetUnitPathing(this.powerCircle, false)
            SetUnitPosition(this.powerCircle, this.getHeroX(), this.getHeroY())
            ShowUnit(this.dummyPowerCircle, true)
            SetUnitPathing(this.dummyPowerCircle, false)
            SetUnitPosition(this.dummyPowerCircle, this.getHeroX(), this.getHeroY())
        }
    }

    /**
     * The power circle only serves once the hero is dead, so it follows the unit rather than the
     * effect: it has nothing to do while the hero slides.
     */
    refreshCerclePosition = () => {
        if (!IsUnitHidden(this.powerCircle) && this.hero) {
            SetUnitPosition(this.powerCircle, GetUnitX(this.hero), GetUnitY(this.hero))
            SetUnitPosition(this.dummyPowerCircle, GetUnitX(this.hero), GetUnitY(this.hero))
        }
    }

    isPortalCooldown = () => this.portalCooldown

    enablePortalCooldown = () => {
        this.portalCooldown = true
    }

    disablePortalCooldown = (timeout: number) => {
        this.portalCooldownTimer?.destroy()
        this.portalCooldownTimer = createTimer(timeout, false, () => (this.portalCooldown = false))
    }

    getFirstPersonHandle = () => this.firstPersonHandle
    getStartCommandsHandle = () => this.startCommandsHandle

    isLockCamTarget = () => !!this.lockCamTarget

    setLockCamTarget = (lockCamTarget: Escaper | null, lockCamTargetMode: 'default' | 'progression' = 'default') => {
        this.lockCamTarget = lockCamTarget
        this.lockCamTargetMode = lockCamTargetMode
        this.resetCamera()

        this.calcProgressionLockCamTarget()
    }

    setSpinCamSpeed = (speed: number) => {
        this.spinCamSpeed = speed
        this.resetCamera()
    }

    calcProgressionLockCamTarget = () => {
        if (this.lockCamTargetMode !== 'progression') {
            return
        }

        let highestProgression = 0
        let highestProgressionPlayer: Escaper | undefined = undefined

        for (const [_, player] of pairs(getUdgEscapers().getAll())) {
            const targetProgression = progressionUtils.getPlayerProgression(player)

            if (highestProgressionPlayer === undefined || targetProgression > highestProgression) {
                highestProgression = targetProgression
                highestProgressionPlayer = player
            }
        }

        if (highestProgressionPlayer) {
            this.lockCamTarget = highestProgressionPlayer
            this.resetCamera()
        }
    }

    toggleLockCamRotation = (lockCamRotation: boolean) => {
        this.lockCamRotation?.destroy()
        this.lockCamRotation = null

        if (lockCamRotation) {
            this.lockCamRotation = createTimer(0.001, true, () => {
                this.hero && SetCameraFieldForPlayer(this.getPlayer(), CAMERA_FIELD_ROTATION, this.getHeroFacing(), 0)
            })
        }
    }

    toggleLockCamHeight = (lockCamHeight: boolean) => {
        this.lockCamHeight?.destroy()
        this.lockCamHeight = null

        if (lockCamHeight) {
            this.lockCamHeight = createTimer(0.001, true, () => {
                if (this.hero && !this.firstPersonHandle.isFirstPerson()) {
                    SetCameraFieldForPlayer(this.getPlayer(), CAMERA_FIELD_ZOFFSET, GetUnitZEx(this.hero), 0)
                }
            })
        }
    }

    isLockCamHeight = () => !!this.lockCamHeight

    setGumTerrain = (terrainType: TerrainType) => {
        this.gumTerrain = terrainType
    }

    getGumTerrain = () => {
        return this.gumTerrain
    }

    setBrushSize = (size: number) => {
        this.brushSize = size
    }

    getBrushSize = () => {
        return this.brushSize
    }

    setGumBrushSize = (size: number) => {
        this.gumBrushSize = size
    }

    getGumBrushSize = () => {
        return this.gumBrushSize
    }

    enableFollowMouseMode = (flag: boolean, neverDisable: boolean) => {
        this.followMouse?.destroy()
        if (flag) {
            this.followMouse = new FollowMouse(this, neverDisable)
        } else {
            delete this.followMouse
        }
    }

    getFollowMouse = () => {
        return this.followMouse
    }

    enableSimpleFollowMouseMode = (flag: boolean) => {
        this.simpleFollowMouse?.destroy()
        if (flag) {
            this.simpleFollowMouse = new SimpleFollowMouse(this)
        } else {
            delete this.simpleFollowMouse
        }
    }

    getSimpleFollowMouse = () => {
        return this.simpleFollowMouse
    }

    getSlideMirror = () => this.slideMirror

    setSlideMirror = (slideMirror: boolean) => (this.slideMirror = slideMirror)

    isIgnoringDeathMessages = () => this.ignoreDeathMessages

    setIgnoreDeathMessages = (ignoreDeathMessages: boolean) => (this.ignoreDeathMessages = ignoreDeathMessages)

    setPanCameraOnRevive = (panCameraOnRevive: 'coop' | 'all' | 'none') => {
        this.panCameraOnRevive = panCameraOnRevive
    }

    updateTextTagPos: (this: void) => void = () => {
        if (!this.hero || !this.textTag) {
            return
        }

        SetTextTagPos(this.textTag, this.getHeroX() - 64, this.getHeroY() + 192, 0)
    }

    getTextTag = () => this.textTag

    getDisplayName = () => this.displayName

    setShowNames = (showNames: boolean) => {
        this.showNames = showNames
        this.updateShowNames(true)
    }

    isStaticSliding = () => !!this.staticSliding

    getStaticSliding = () => this.staticSliding

    setStaticSliding = (staticSliding: StaticSlide | undefined) => {
        this.staticSliding = staticSliding
    }

    updateShowNames = (localOnly: boolean) => {
        for (const [_, player] of pairs(getUdgEscapers().getAll())) {
            if (!localOnly || player.getPlayer() === GetLocalPlayer()) {
                for (const [_, escaper] of pairs(getUdgEscapers().getAll())) {
                    const textTag = escaper.getTextTag()

                    if (textTag && GetLocalPlayer() !== escaper.getPlayer()) {
                        SetTextTagVisibility(textTag, player.showNames)
                    }
                }
            }
        }
    }

    /**
     * The effect stands in for the hero unit in async slide mode. It is created with the hero, on
     * every machine at once as a handle demands, and never destroyed: it simply waits under the
     * map when the hero is a unit, so that no handle ever appears or disappears mid game.
     */
    private createHeroEffect = () => {
        if (this.heroEffect || !this.hero) {
            return
        }

        this.heroEffect = EffectUtils.addSpecialEffect(Constants.HERO_MODEL_PATH, this.getHeroX(), this.getHeroY())

        if (!this.heroEffect) {
            return
        }

        BlzSetSpecialEffectColorByPlayer(this.heroEffect, Natives.UPlayer(this.baseColorId))
        this.parkHeroEffect()
    }

    /** Sends the effect under the map, where nobody sees it */
    private parkHeroEffect = () => {
        this.heroEffect && BlzSetSpecialEffectPosition(this.heroEffect, 0, 0, PARKED_HERO_EFFECT_Z)
    }

    isHeroAsEffect = () => this.isHeroEffectActive

    /**
     * Whether this hero is meant to slide as an effect, which the "-autoTurn async" mode decides.
     * Kept here rather than read from that mode, so that the hand over belongs to the sliding
     * state itself and happens wherever that state changes.
     */
    setAsyncSlideEnabled = (isEnabled: boolean) => {
        this.isAsyncSlideEnabled = isEnabled
        this.updateHeroEffectMode()
    }

    /**
     * Hands the hero over to its effect, or takes it back, following the sliding state. Called
     * from enableSlide, so it happens at the very moment that state changes, on every machine:
     * a timer noticing it later would flip each machine at a different point of the slide.
     */
    private updateHeroEffectMode = () => {
        // a dead hero stays a unit: its body is carried by the slide, and every machine watches
        // the same one fall
        this.setHeroAsEffect(this.isAsyncSlideEnabled && this.isSliding() && this.isAlive() === true)
    }

    /**
     * Two reasons to leave the effect where it is: this machine saw the hero die and waits for the
     * others to agree on the spot, or it stopped hearing from the machine that owns it. Carrying
     * the movement on would be inventing a path its player never took.
     */
    private isHeroEffectMovementBlocked = () => {
        if (!this.isHeroEffectActive) {
            return false
        }

        return this.isHeroEffectFrozen || this.isAsyncOwnerSilent()
    }

    /** Purely local: each machine decides for itself whether it is still being told anything */
    isAsyncOwnerSilent = () =>
        this.isAsyncControlledElsewhere() && os.clock() - this.lastAsyncPacketTime > ASYNC_SILENCE_TIMEOUT

    /** This machine owns the hero and decides for it: it is the only one knowing where it is */
    isAsyncControlledHere = () => this.isHeroEffectActive && GetLocalPlayer() === this.p

    /** Another machine decides for this hero: this one only replays what it is told */
    isAsyncControlledElsewhere = () => this.isHeroEffectActive && GetLocalPlayer() !== this.p

    /** Announces a terrain change, so the others run the same check at the same place */
    sendAsyncTerrainChangeIfNeeded = () => {
        this.isAsyncControlledHere() && sendAsyncTerrainChange(this.escaperId, this.getHeroMovementState())
    }

    /**
     * The terrain changed under the hero of another machine: this one puts it where that change
     * happened and runs its own check there. Same position and same map, so same conclusions:
     * slide started, slide terrain changed, or walkable ground reached.
     */
    applyAsyncTerrainChange = (sequence: number, movement: HeroMovementState) => {
        if (sequence <= this.lastAsyncSequence || !this.isAsyncControlledElsewhere()) {
            return
        }

        this.lastAsyncSequence = sequence
        this.lastAsyncPacketTime = os.clock()
        this.applyHeroMovementState(movement)
        this.updateHeroEffect()

        CheckTerrainTrigger.CheckTerrainActions(this.escaperId)
    }

    /**
     * Hands the hero over to its effect, or takes it back.
     *
     * While the effect stands in, the unit is parked in the corner of the map, which is enough to
     * hide it: its look is left alone. It must not move, because in async mode its position would
     * be computed from a cursor only this machine knows, and moving a synchronized unit with a
     * local value is what gets a player kicked. It still answers the orders of its player, which
     * is what keeps the illusion of controlling it.
     *
     * The effect only takes over while sliding: back on walkable ground, or dead, the unit is put
     * back where the effect had brought it and takes its part again.
     */
    setHeroAsEffect = (isEffect: boolean) => {
        if (!this.hero || isEffect === this.isHeroEffectActive) {
            return
        }

        if (isEffect) {
            // the unit knows where it is for the last time here
            this.heroPos.x = this.getHeroX()
            this.heroPos.y = this.getHeroY()
            this.heroPos.facing = this.getHeroFacing()
            this.heroPos.flyHeight = this.getHeroFlyHeight()

            this.isHeroEffectActive = true
            this.lastAsyncPacketTime = os.clock()

            // the native lock would drag the camera to the corner the unit waits in
            this.releaseLockedCameraFromUnit()
            this.updateHeroEffect()

            return
        }

        this.isHeroEffectActive = false
        this.parkHeroEffect()

        // the unit takes back the place the effect had led it to
        SetUnitX(this.hero, this.heroPos.x)
        SetUnitY(this.hero, this.heroPos.y)
        BlzSetUnitFacingEx(this.hero, this.heroPos.facing)
        SetUnitFlyHeight(this.hero, this.heroPos.flyHeight, 0)

        // the unit is back where it belongs, the native lock can hold it again
        const viewer = getUdgEscapers().get(GetPlayerId(GetLocalPlayer()!))

        viewer?.lockCamTarget === this && viewer.resetCamera()
    }

    /** Detaches the camera from the unit, without moving it: the effect takes over from here */
    private releaseLockedCameraFromUnit = () => {
        const viewer = getUdgEscapers().get(GetPlayerId(GetLocalPlayer()!))

        if (viewer?.lockCamTarget !== this) {
            return
        }

        ResetToGameCameraForPlayer(GetLocalPlayer()!, 0)
        SetCameraPosition(this.heroPos.x, this.heroPos.y)
    }

    /**
     * Draws the effect where the hero is, and keeps the unit in its corner: the player keeps
     * ordering it around, and an order would otherwise walk it back into the map.
     */
    updateHeroEffect = () => {
        if (!this.heroEffect || !this.hero || !this.isHeroEffectActive) {
            return
        }

        BlzSetSpecialEffectPosition(this.heroEffect, this.heroPos.x, this.heroPos.y, this.getHeroZ())
        BlzSetSpecialEffectYaw(this.heroEffect, Deg2Rad(this.heroPos.facing))

        SetUnitX(this.hero, globals.MAP_MIN_X)
        SetUnitY(this.hero, globals.MAP_MIN_Y)

        this.updateLockedCamera()
    }

    /**
     * A camera locked on the hero follows its unit, which now waits in a corner of the map, so it
     * has to be carried by hand. Done here rather than on a timer of its own, so that the camera
     * moves at the very moment the effect does, which is what keeps it smooth.
     */
    private updateLockedCamera = () => {
        const viewer = getUdgEscapers().get(GetPlayerId(GetLocalPlayer()!))

        if (viewer?.lockCamTarget !== this) {
            return
        }

        SetCameraPosition(this.heroPos.x, this.heroPos.y)
    }

    updateUnitVertexColor = () => {
        if (this.hero) {
            const otherTransparency =
                getUdgEscapers().get(GetPlayerId(GetLocalPlayer()))?.othersTransparencyState[this.escaperId] || null

            const shadow = getUdgEscapers().get(GetPlayerId(GetLocalPlayer()))?.shadowState[this.escaperId]

            SetUnitVertexColorBJ(
                this.hero,
                this.vcRed,
                this.vcGreen,
                this.vcBlue,
                GetLocalPlayer() === this.getPlayer() || otherTransparency === null || this.isEscaperSecondary()
                    ? this.vcTransparency
                    : otherTransparency
            )

            SetUnitVertexColorBJ(
                this.powerCircle,
                this.vcRed,
                this.vcGreen,
                this.vcBlue,
                GetLocalPlayer() === this.getPlayer() || otherTransparency === null || this.isEscaperSecondary()
                    ? this.vcTransparency
                    : otherTransparency
            )

            if (shadow === false) {
                // Force toggle it to update the shadow
                BlzSetUnitSkin(this.hero, this.skin === FourCC('hpea') ? FourCC('hfoo') : FourCC('hpea'))
                BlzSetUnitSkin(this.hero, this.skin || Constants.HERO_TYPE_ID)
            } else {
                // Unfortunately we can't disable the skin, you'll have to recreate the unit
            }

            // Changing base color with -red will break the teamglow. Thats why we need to reapply it
            BlzShowUnitTeamGlow(this.hero, true)
            BlzShowUnitTeamGlow(this.hero, this.glow)
            BlzShowUnitTeamGlow(this.powerCircle, true)
            BlzShowUnitTeamGlow(this.powerCircle, this.glow)
        }
    }

    enableClickWhereYouAre = (b: boolean) => {
        if (this.tClickWhereYouAre) {
            this.tClickWhereYouAre.destroy()
            this.tClickWhereYouAre = null
        }

        if (b && this.hero) {
            const x = this.getHeroX()
            const y = this.getHeroY()

            const clickWhereYouAre_Action = () => {
                this.hero && this.isSliding() && IssuePointOrder(this.hero, 'smart', x, y)
            }

            this.tClickWhereYouAre = createTimer(0.1, true, clickWhereYouAre_Action)
            clickWhereYouAre_Action()
        }
    }

    enableInterface = (b: boolean, showMinimap: boolean) => {
        let mode: string
        if (b) {
            mode = 'on'
        } else if (showMinimap) {
            mode = 'map'
        } else {
            mode = 'off'
        }

        if (this.uiMode == mode) {
            return false
        }

        if (GetLocalPlayer() == this.p) {
            if (!b) {
                DisableInterface(showMinimap)
            } else {
                EnableInterface()
            }
        }

        this.uiMode = mode

        return true
    }

    getKeyboardShortcutsArray = () => {
        return this.keyboardShortcutsArray
    }

    // Prevent clicks
    createCantClickTrigger = () => {
        return createEvent({
            events: [
                t => TriggerRegisterAnyUnitEventBJ(t, EVENT_PLAYER_UNIT_ISSUED_POINT_ORDER),
                t => TriggerRegisterAnyUnitEventBJ(t, EVENT_PLAYER_UNIT_ISSUED_TARGET_ORDER),
            ],
            actions: [
                () => {
                    if (this.getHero() === Natives.UGetTriggerUnit() && !this.canClick) {
                        if (IsIssuedOrder('smart')) {
                            StopUnit(Natives.UGetTriggerUnit())
                        }
                    }
                },
            ],
        })
    }

    setCanClick = (canClick: boolean) => {
        this.canClick = canClick

        if (canClick) {
            DisableTrigger(this.cantClickTrigger)
        } else {
            EnableTrigger(this.cantClickTrigger)
        }
    }

    getSkin = () => this.skin

    setSkin = (skin: number | undefined) => {
        this.skin = skin
    }

    getScale = () => this.scale

    setScale = (scale: number | undefined) => {
        this.scale = scale
    }

    setGlow = (glow: boolean) => {
        this.glow = glow
        this.updateUnitVertexColor()
    }

    addLives(numLives: number) {
        ServiceManager.getService('Lives').add(numLives)

        Text.ForAll_timed_withColorCode(
            3,
            SUCCESS_TEXT_COLORCODE,
            `${GetPlayerName(this.getPlayer())} has earned ${numLives} ${numLives > 1 ? 'lives' : 'life'} for the team!`
        )
    }

    setHeroCollisionSize = (collisionSize: number) => {
        GetInvisUnitTypeFromCollisionSize(collisionSize) // throws if collision size is invalid
        this.collisionSize = collisionSize
        this.refreshInvisUnit()
        this.refreshCollisionLandmark()
    }

    refreshInvisUnit = () => {
        if (!this.hero) {
            return
        }

        if (this.invisUnit) {
            RemoveUnit(this.invisUnit)
        }

        const invisUnitUnitTypeId = GetInvisUnitTypeFromCollisionSize(this.collisionSize)

        // The invisible unit tells when the hero touches a monster, through the immolation of the
        // monsters, which an effect cannot trigger: it stays on the unit, and the effect will need
        // a contact check computed by hand.
        this.invisUnit = Natives.UCreateUnit(
            Constants.PLAYER_INVIS_UNIT,
            invisUnitUnitTypeId,
            GetUnitX(this.hero),
            GetUnitY(this.hero),
            0
        )
        SetUnitPathing(this.invisUnit, false)
        SetUnitUserData(this.invisUnit, GetPlayerId(this.p))
        TriggerRegisterUnitEvent(
            ServiceManager.getService('InvisUnit_is_getting_damage').Trig_InvisUnit_is_getting_damage
                .gg_trg_InvisUnit_is_getting_damage,
            this.invisUnit,
            EVENT_UNIT_DAMAGED
        )
    }

    /**
     * Display or not collision landmark for all players according to their choice, and resize it according to collision size
     */
    refreshCollisionLandmark = () => {
        const localEscaper = getUdgEscapers().get(GetPlayerId(Natives.UGetLocalPlayer()))
        const displayCollisionLandmark = localEscaper?.displayCollisionLandmarks ?? false

        if (this.collisionLandmarkEffect) {
            BlzSetSpecialEffectScale(this.collisionLandmarkEffect, 0) // hide it because an effect doesn't visually instanstly disappear on destroy
            DestroyEffect(this.collisionLandmarkEffect)
            delete this.collisionLandmarkEffect
        }

        if (this.hero) {
            this.collisionLandmarkEffect = AddSpecialEffect(
                Constants.COLLISION_LANDMARK_MODEL,
                this.getHeroX(),
                this.getHeroY()
            )
            if (!this.collisionLandmarkEffect) {
                throw new Error("Couldn't create collision landmark effect")
            }
            const scale = this.collisionSize / Constants.COLLISION_LANDMARK_MODEL_BASE_RADIUS
            BlzSetSpecialEffectScale(this.collisionLandmarkEffect, scale)

            if (!displayCollisionLandmark) {
                BlzSetSpecialEffectAlpha(this.collisionLandmarkEffect, 0)
            }
        }
    }

    moveCollisionLandmark = () => {
        if (this.collisionLandmarkEffect && this.hero) {
            const z =
                GetUnitZEx(this.hero) -
                (Constants.COLLISION_LANDMARK_MODEL_BASE_HEIGHT * this.collisionSize) /
                    Constants.COLLISION_LANDMARK_MODEL_BASE_RADIUS
            BlzSetSpecialEffectPosition(this.collisionLandmarkEffect, this.getHeroX(), this.getHeroY(), z)
        }
    }

    getDisplayCollisionLandmarks = () => {
        return this.displayCollisionLandmarks
    }

    setDisplayCollisionLandmarks = (flag: boolean) => {
        this.displayCollisionLandmarks = flag

        getUdgEscapers().forMainEscapers(escaper => {
            escaper.refreshCollisionLandmark()
        })
        for (const [_, monster] of pairs(udg_monsters)) {
            monster.refreshCollisionLandmark()
        }

        refreshTrigMoveCollisionLandmarks()
    }

    toJson = () => ({
        //useless but mandatory due to BaseArray implementation
    })
}
