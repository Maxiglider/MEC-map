import { ServiceManager } from 'Services'
import { animUtils } from 'Utils/AnimUtils'
import { EffectUtils } from 'Utils/EffectUtils'
import { GetUnitZEx } from 'Utils/LocationUtils'
import { IPoint, createPoint } from 'Utils/Point'
import { progressionUtils } from 'Utils/ProgressionUtils'
import { ForceAngleBetween0And360, IsIssuedOrder, StopUnit } from 'core/01_libraries/Basic_functions'
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
import { Natives } from '../../wc3_natives_unsecured/Natives'
import { Level } from '../Level/Level'
import { DEPART_PAR_DEFAUT } from '../Level/StartAndEnd'
import { StaticSlide } from '../Level/StaticSlide'
import { METEOR_CHEAT, METEOR_NORMAL, udg_meteors } from '../Meteor/Meteor'
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

export function IsHeroCollisionSizeValid(collisionSize: number): boolean {
    return (collisionSize >= 0 && collisionSize <= 200) || collisionSize % 5 === 0
}

export class Escaper extends EscaperMake {
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
    private readonly canClickTrigger: trigger

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
        this.canClickTrigger = this.createCanClickTrigger()
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

        DestroyTrigger(this.canClickTrigger)

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
                this.setLastZ(BlzGetUnitZ(this.hero) + GetUnitFlyHeight(this.hero))

                //follow mouse
                if (this.followMouse) {
                    //be sure we aren't on reverse
                    const tt = getUdgTerrainTypes().getTerrainType(GetUnitX(this.hero), GetUnitY(this.hero))
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

        const lastX = GetUnitX(this.hero)
        const lastY = GetUnitY(this.hero)

        if (!this.lastPos || (this.lastPos.x !== lastX && this.lastPos.y !== lastY)) {
            this.lastPos?.__destroy()
            this.lastPos = createPoint(lastX, lastY)
        }
    }

    //move methods
    moveHero(x: number, y: number, updateLast = true) {
        if (this.hero) {
            if (updateLast) {
                this.setLastPos()
            }

            SetUnitX(this.hero, x)
            SetUnitY(this.hero, y)
        }
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

    kill = () => {
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
            const angle = GetUnitFacing(this.hero)

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

        const xHero = GetUnitX(this.hero)
        const yHero = GetUnitY(this.hero)

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
        this.hero && BlzSetUnitFacingEx(this.hero, angle)
    }

    reverse = () => {
        if (!this.hero) return

        const angle: number = GetUnitFacing(this.hero) + 180
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
                const currentTerrainType = getUdgTerrainTypes().getTerrainType(GetUnitX(this.hero), GetUnitY(this.hero))

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
                const currentTerrainType = getUdgTerrainTypes().getTerrainType(GetUnitX(this.hero), GetUnitY(this.hero))
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
                const currentTerrainType = getUdgTerrainTypes().getTerrainType(GetUnitX(this.hero), GetUnitY(this.hero))
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
            const xHero = GetUnitX(this.hero)
            const yHero = GetUnitY(this.hero)

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
            SetUnitPosition(this.powerCircle, GetUnitX(this.hero), GetUnitY(this.hero))
            ShowUnit(this.dummyPowerCircle, true)
            SetUnitPathing(this.dummyPowerCircle, false)
            SetUnitPosition(this.dummyPowerCircle, GetUnitX(this.hero), GetUnitY(this.hero))
        }
    }

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
                this.hero &&
                    SetCameraFieldForPlayer(this.getPlayer(), CAMERA_FIELD_ROTATION, GetUnitFacing(this.hero), 0)
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

        SetTextTagPos(this.textTag, GetUnitX(this.hero) - 64, GetUnitY(this.hero) + 192, 0)
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
            const x = GetUnitX(this.hero)
            const y = GetUnitY(this.hero)

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
    createCanClickTrigger = () => {
        return createEvent({
            events: [
                t => TriggerRegisterAnyUnitEventBJ(t, EVENT_PLAYER_UNIT_ISSUED_POINT_ORDER),
                t => TriggerRegisterAnyUnitEventBJ(t, EVENT_PLAYER_UNIT_ISSUED_TARGET_ORDER),
            ],
            actions: [
                () => {
                    if (this.getPlayer() === Natives.UGetTriggerPlayer() && !this.canClick) {
                        if (
                            !IsIssuedOrder('smart') ||
                            GetItemTypeId(Natives.UGetOrderTargetItem()) === METEOR_NORMAL ||
                            GetItemTypeId(Natives.UGetOrderTargetItem()) === METEOR_CHEAT
                        ) {
                            return
                        }

                        StopUnit(Natives.UGetTriggerUnit())
                    }
                },
            ],
        })
    }

    setCanClick = (canClick: boolean) => {
        this.canClick = canClick

        if (canClick) {
            DisableTrigger(this.canClickTrigger)
        } else {
            EnableTrigger(this.canClickTrigger)
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
                GetUnitX(this.hero),
                GetUnitY(this.hero)
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
            BlzSetSpecialEffectPosition(this.collisionLandmarkEffect, GetUnitX(this.hero), GetUnitY(this.hero), z)
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
