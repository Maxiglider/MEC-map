import { ServiceManager } from 'Services'
import { animUtils } from 'Utils/AnimUtils'
import { EffectUtils } from 'Utils/EffectUtils'
import { GetUnitZEx } from 'Utils/LocationUtils'
import { IPoint, createPoint } from 'Utils/Point'
import { progressionUtils } from 'Utils/ProgressionUtils'
import { IsIssuedOrder, StopUnit } from 'core/01_libraries/Basic_functions'
import {
    DEFAULT_CAMERA_FIELD,
    DUMMY_POWER_CIRCLE,
    HERO_SECONDARY_TYPE_ID,
    HERO_SLIDE_SPEED,
    HERO_TYPE_ID,
    HERO_WALK_SPEED,
    INVIS_UNIT_TYPE_ID,
    NB_PLAYERS_MAX,
    NB_PLAYERS_MAX_REFORGED,
    PLAYER_INVIS_UNIT,
    POWER_CIRCLE,
    SLIDE_PERIOD,
    TERRAIN_KILL_EFFECT_BODY_PART,
} from 'core/01_libraries/Constants'
import { udg_colorCode } from 'core/01_libraries/Init_colorCodes'
import { Text } from 'core/01_libraries/Text'
import { MakePropertyChange } from 'core/05_MAKE_STRUCTURES/Make/MakePropertyChange'
import { MakeCopyLevelPatrol } from 'core/05_MAKE_STRUCTURES/Make_copy_paste/MakeCopyLevelPatrol'
import { MakeCaster } from 'core/05_MAKE_STRUCTURES/Make_create_casters/MakeCaster'
import { MakeMeteor } from 'core/05_MAKE_STRUCTURES/Make_create_meteors/MakeMeteor'
import { MakeMonsterSpawn } from 'core/05_MAKE_STRUCTURES/Make_create_monster_spawn/MakeMonsterSpawn'
import { MakeMonsterMultiplePatrols } from 'core/05_MAKE_STRUCTURES/Make_create_monsters/MakeMonsterMultiplePatrols'
import { MakeMonsterSimplePatrol } from 'core/05_MAKE_STRUCTURES/Make_create_monsters/MakeMonsterSimplePatrol'
import { MakeMonsterTeleport } from 'core/05_MAKE_STRUCTURES/Make_create_monsters/MakeMonsterTeleport'
import { MakeGetRegion } from 'core/05_MAKE_STRUCTURES/Make_create_region/MakeGetRegion'
import { MakeMoveRegionPoint } from 'core/05_MAKE_STRUCTURES/Make_create_region/MakeMoveRegionPoint'
import { MakeRegion } from 'core/05_MAKE_STRUCTURES/Make_create_region/MakeRegion'
import { MakeDeleteStaticSlide } from 'core/05_MAKE_STRUCTURES/Make_create_static_slide/MakeDeleteStaticSlide'
import { MakeStaticSlide } from 'core/05_MAKE_STRUCTURES/Make_create_static_slide/MakeStaticSlide'
import { MakeStaticSlideInfo } from 'core/05_MAKE_STRUCTURES/Make_create_static_slide/MakeStaticSlideInfo'
import { MakeDeleteCasters } from 'core/05_MAKE_STRUCTURES/Make_delete_casters/MakeDeleteCasters'
import { MakeDeleteMeteors } from 'core/05_MAKE_STRUCTURES/Make_delete_meteors/MakeDeleteMeteors'
import { MakeDeleteMonsters } from 'core/05_MAKE_STRUCTURES/Make_delete_monsters/MakeDeleteMonsters'
import { MakeCircleMob } from 'core/05_MAKE_STRUCTURES/Make_monster_properties/MakeCircleMob'
import { MakeClearMob } from 'core/05_MAKE_STRUCTURES/Make_monster_properties/MakeClearMob'
import { MakeDeleteCircleMob } from 'core/05_MAKE_STRUCTURES/Make_monster_properties/MakeDeleteCircleMob'
import { MakeDeleteClearMob } from 'core/05_MAKE_STRUCTURES/Make_monster_properties/MakeDeleteClearMob'
import { MakeDeletePortalMob } from 'core/05_MAKE_STRUCTURES/Make_monster_properties/MakeDeletePortalMob'
import { MakeMonsterAttackGroundOrder } from 'core/05_MAKE_STRUCTURES/Make_monster_properties/MakeMonsterAttackGroundOrder'
import { MakePortalMob } from 'core/05_MAKE_STRUCTURES/Make_monster_properties/MakePortalMob'
import { MakeGetUnitTeleportPeriod } from 'core/05_MAKE_STRUCTURES/Make_set_unit_properties/MakeGetUnitTeleportPeriod'
import { MakeSetUnitMonsterType } from 'core/05_MAKE_STRUCTURES/Make_set_unit_properties/MakeSetUnitMonsterType'
import { MakeSetUnitTeleportPeriod } from 'core/05_MAKE_STRUCTURES/Make_set_unit_properties/MakeSetUnitTeleportPeriod'
import { AfkMode } from 'core/08_GAME/Afk_mode/Afk_mode'
import { Timer } from 'w3ts'
import { getUdgEscapers, getUdgLevels, getUdgTerrainTypes, globals } from '../../../../globals'
import { EncodingBase64 } from '../../../Utils/SaveLoad/TreeLib/EncodingBase64'
import { createEvent, createTimer, runInTrigger } from '../../../Utils/mapUtils'
import type { Make } from '../../05_MAKE_STRUCTURES/Make/Make'
import type { MakeAction } from '../../05_MAKE_STRUCTURES/MakeLastActions/MakeAction'
import { MakeLastActions } from '../../05_MAKE_STRUCTURES/MakeLastActions/MakeLastActions'
import { MakeMonsterNoMove } from '../../05_MAKE_STRUCTURES/Make_create_monsters/MakeMonsterNoMove'
import { MakeDoNothing } from '../../05_MAKE_STRUCTURES/Make_do_nothing/MakeDoNothing'
import { MakeExchangeTerrains } from '../../05_MAKE_STRUCTURES/Make_exchange_terrains/MakeExchangeTerrains'
import { MakeGetTerrainType } from '../../05_MAKE_STRUCTURES/Make_get_info/MakeGetTerrainType'
import { MakeEnd } from '../../05_MAKE_STRUCTURES/Make_start_end_visibilityModifier/MakeEnd'
import { MakeStart } from '../../05_MAKE_STRUCTURES/Make_start_end_visibilityModifier/MakeStart'
import { MakeVisibilityModifier } from '../../05_MAKE_STRUCTURES/Make_start_end_visibilityModifier/MakeVisibilityModifier'
import { MakeTerrainCopyPaste } from '../../05_MAKE_STRUCTURES/Make_terrain/MakeTerrainCopyPaste'
import { MakeTerrainCreate } from '../../05_MAKE_STRUCTURES/Make_terrain/MakeTerrainCreate'
import { MakeTerrainCreateBrush } from '../../05_MAKE_STRUCTURES/Make_terrain/MakeTerrainCreateBrush'
import { MakeTerrainHorizontalSymmetry } from '../../05_MAKE_STRUCTURES/Make_terrain/MakeTerrainHorizontalSymmetry'
import { MakeTerrainVerticalSymmetry } from '../../05_MAKE_STRUCTURES/Make_terrain/MakeTerrainVerticalSymmetry'
import { MakeTerrainHeight } from '../../05_MAKE_STRUCTURES/Make_terrain_height/MakeTerrainHeight'
import { BlzColor2Id, removeHash } from '../../06_COMMANDS/COMMANDS_vJass/Command_functions'
import { CheckTerrainTrigger } from '../../07_TRIGGERS/Slide_and_CheckTerrain_triggers/CheckTerrain'
import { SlideTrigger } from '../../07_TRIGGERS/Slide_and_CheckTerrain_triggers/Slide'
import {
    HERO_ROTATION_SPEED,
    HERO_ROTATION_TIME_FOR_MAXIMUM_SPEED,
} from '../../07_TRIGGERS/Slide_and_CheckTerrain_triggers/SlidingMax'
import { reviveTrigManager } from '../../08_GAME/Death/A_hero_dies_check_if_all_dead_and_sounds'
import { Trig_InvisUnit_is_getting_damage } from '../../08_GAME/Death/InvisUnit_is_getting_damage'
import { HERO_START_ANGLE } from '../../08_GAME/Init_game/Heroes'
import { MessageHeroDies } from '../../08_GAME/Init_game/Message_heroDies'
import { RunCoopSoundOnHero } from '../../08_GAME/Mode_coop/coop_init_sounds'
import { DisableInterface, EnableInterface } from '../../DisablingInterface/EnableDisableInterface'
import { FollowMouse } from '../../Follow_mouse/Follow_mouse'
import { KeyboardShortcutArray } from '../../Keyboard_shortcuts/KeyboardShortcutArray'
import type { CasterType } from '../Caster/CasterType'
import { Level } from '../Level/Level'
import { IsLevelBeingMade } from '../Level/Level_functions'
import { DEPART_PAR_DEFAUT } from '../Level/StartAndEnd'
import { StaticSlide } from '../Level/StaticSlide'
import { METEOR_CHEAT, METEOR_NORMAL, udg_meteors } from '../Meteor/Meteor'
import type { MonsterType } from '../Monster/MonsterType'
import { isDeathTerrain, type TerrainType } from '../TerrainType/TerrainType'
import { TerrainTypeSlide } from '../TerrainType/TerrainTypeSlide'
import { TerrainTypeWalk } from '../TerrainType/TerrainTypeWalk'
import { EscaperEffectArray } from './EscaperEffectArray'
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

export class Escaper {
    private escaperId: number
    private playerId: number

    private p: player
    private hero?: unit
    private invisUnit?: unit
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
    private tClickWhereYouAre: Timer | null = null

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

    private make?: Make
    private makeLastActions: MakeLastActions
    private makingLevel?: Level

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

    public hideLeaderboard = false

    //follow mode
    private followMouse?: FollowMouse

    //make
    private gumTerrain?: TerrainType
    private gumBrushSize = 1
    private brushSize = 1

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
    private canClickTrigger: trigger

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
        this.playerId = escaperId >= NB_PLAYERS_MAX ? escaperId - 12 : escaperId

        this.escaperId = escaperId
        this.p = Player(this.playerId)
        this.walkSpeed = HERO_WALK_SPEED
        this.slideSpeed = HERO_SLIDE_SPEED
        this.rotationSpeed = HERO_ROTATION_SPEED
        this.slideMovePerPeriod = HERO_SLIDE_SPEED * SLIDE_PERIOD
        this.maxSlideTurnPerPeriod = HERO_ROTATION_SPEED * SLIDE_PERIOD
        this.slideCurrentTurnPerPeriod = 0
        this.baseColorId = BlzColor2Id(GetPlayerColor(this.p)) || -1

        this.checkTerrain = CheckTerrainTrigger.CreateCheckTerrainTrigger(escaperId)

        this.cameraField = DEFAULT_CAMERA_FIELD
        SetCameraFieldForPlayer(this.p, CAMERA_FIELD_TARGET_DISTANCE, this.cameraField, 0)

        this.effects = new EscaperEffectArray()
        this.vcRed = 100
        this.vcGreen = 100
        this.vcBlue = 100
        this.vcTransparency = escaperId >= NB_PLAYERS_MAX ? 50 : 0

        this.makeLastActions = new MakeLastActions(this)

        this.godMode = false
        this.godModeKills = false
        this.walkSpeedAbsolute = false
        this.slideSpeedAbsolute = false
        this.rotationSpeedAbsolute = false
        this.hasAutoreviveB = false

        if (VIPs.includes(GetPlayerName(this.p))) {
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

        this.powerCircle = CreateUnit(this.p, POWER_CIRCLE, 0, 0, 0)
        SetUnitUserData(this.powerCircle, escaperId)
        ShowUnit(this.powerCircle, false)

        this.dummyPowerCircle = CreateUnit(this.p, DUMMY_POWER_CIRCLE, 0, 0, 0)
        SetUnitUserData(this.dummyPowerCircle, escaperId)
        ShowUnit(this.dummyPowerCircle, false)

        this.displayName = removeHash(GetPlayerName(this.p))

        for (let i = 0; i < NB_PLAYERS_MAX; i++) {
            this.alliedState[i] = true
        }

        this.canClick = true
        this.canClickTrigger = this.createCanClickTrigger()
        this.setCanClick(true)
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
            SetItemDroppable(UnitItemInSlot(this.hero, 0), true)
            udg_meteors[GetItemUserData(UnitItemInSlot(this.hero, 0))]?.replace()
            this.removeEffectMeteor()
            return true
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
        let heroTypeId = this.skin || HERO_TYPE_ID

        if (this.hero) {
            return false
        }

        if (this.escaperId >= NB_PLAYERS_MAX) {
            heroTypeId = HERO_SECONDARY_TYPE_ID
        }

        this.hero = CreateUnit(this.p, heroTypeId, x, y, angle)

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

        if (this.scale) {
            SetUnitScale(this.hero, this.scale, this.scale, this.scale)
        }

        globals.heroToEscaperHandles[GetHandleId(this.hero)] = this.escaperId

        if (this.escaperId >= NB_PLAYERS_MAX) {
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

        SetUnitColor(this.hero, ConvertPlayerColor(this.baseColorId))
        SetUnitColor(this.powerCircle, ConvertPlayerColor(this.baseColorId))

        this.updateUnitVertexColor()
        this.SpecialIllidan()
        this.invisUnit = CreateUnit(PLAYER_INVIS_UNIT, INVIS_UNIT_TYPE_ID, x, y, angle)
        SetUnitUserData(this.invisUnit, GetPlayerId(this.p))
        TriggerRegisterUnitEvent(
            Trig_InvisUnit_is_getting_damage.gg_trg_InvisUnit_is_getting_damage,
            this.invisUnit,
            EVENT_UNIT_DAMAGED
        )
        this.effects.showEffects(this.hero)
        delete this.lastTerrainType
        TimerStart(AfkMode.afkModeTimers[this.escaperId], AfkMode.timeMinAfk, false, () =>
            AfkMode.GetAfkModeTimeExpiresCodeFromId(this.escaperId)
        )

        EnableTrigger(this.checkTerrain)

        this.textTag = CreateTextTag()
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

        if (this.invisUnit) {
            RemoveUnit(this.invisUnit)
            delete this.invisUnit
        }

        delete this.lastTerrainType
        this.make?.destroy()
        delete this.make
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
                TERRAIN_KILL_EFFECT_BODY_PART
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
                TERRAIN_KILL_EFFECT_BODY_PART
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
        this.slideMovePerPeriod = ss * SLIDE_PERIOD
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
        this.tempSlideSpeedPerPeriod = (this.getSlideMirror() ? -1 : 1) * ss * SLIDE_PERIOD

        if (this.hero && effect) {
            this.tempSlideSpeedEffect = AddSpecialEffectTargetUnitBJ('origin', this.hero, effect)
        }

        this.tempSlideSpeedTimer = createTimer(duration, false, () => {
            this.disableSlideSpeedTemporarily()
        })
    }

    //speed methods
    setRotationSpeed(rs: number) {
        this.rotationSpeed = rs //rounds
        this.maxSlideTurnPerPeriod = rs * SLIDE_PERIOD * 360 //degrees
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
        if (baseColorId < 0 || baseColorId >= NB_PLAYERS_MAX_REFORGED) {
            return false
        }
        this.baseColorId = baseColorId
        if (this.hero) {
            if (baseColorId == 0) {
                SetUnitColor(this.hero, PLAYER_COLOR_RED)
                SetUnitColor(this.powerCircle, PLAYER_COLOR_RED)
            } else {
                SetUnitColor(this.hero, ConvertPlayerColor(baseColorId))
                SetUnitColor(this.powerCircle, ConvertPlayerColor(baseColorId))
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
        if (baseColorId < 0 || baseColorId >= NB_PLAYERS_MAX_REFORGED) {
            return false
        }
        this.baseColorId = baseColorId
        if (this.hero) {
            if (baseColorId == 0) {
                SetUnitColor(this.hero, PLAYER_COLOR_RED)
                SetUnitColor(this.powerCircle, PLAYER_COLOR_RED)
            } else {
                SetUnitColor(this.hero, ConvertPlayerColor(baseColorId))
                SetUnitColor(this.powerCircle, ConvertPlayerColor(baseColorId))
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
        ResetToGameCameraForPlayer(this.p, 0)
        SetCameraFieldForPlayer(this.p, CAMERA_FIELD_TARGET_DISTANCE, this.cameraField, 0)

        if (this.lockCamTarget) {
            const hero = this.lockCamTarget.getHero()

            if (hero) {
                SetCameraTargetControllerNoZForPlayer(this.getPlayer(), hero, 0, 0, false)
            }
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

    //make methods
    getMake = () => {
        return this.make
    }

    destroyMakeIfForSpecificLevel = () => {
        if (this.make && this.make.forSpecificLevel) {
            this.destroyMake()
        }
    }

    setMakingLevel(level: Level | null) {
        if (this.makingLevel == level) {
            return false
        }

        const oldMakingLevel = this.makingLevel
        this.destroyMakeIfForSpecificLevel()

        delete this.makingLevel

        if (oldMakingLevel && !IsLevelBeingMade(oldMakingLevel)) {
            oldMakingLevel.activate(false)

            if (getUdgLevels().getCurrentLevel().getId() < oldMakingLevel.getId()) {
                oldMakingLevel.activateVisibilities(false)
            }
        }

        if (level) {
            Level.earningLivesActivated = false
            level && level.activate(true)
            Level.earningLivesActivated = true
            this.makingLevel = level
        }

        return true
    }

    getMakingLevel(): Level {
        if (this.makingLevel) {
            return this.makingLevel
        } else {
            return getUdgLevels().getCurrentLevel()
        }
    }

    isMakingCurrentLevel = () => {
        return !!this.makingLevel
    }

    destroyMake = () => {
        if (!this.make) {
            return false
        }

        this.make && this.make.destroy()
        delete this.make

        if (!this.isEscaperSecondary()) {
            createTimer(0, false, () => {
                //prevent secondary hero from moving at end of make
                const hero = GetMirrorEscaper(this)?.hero
                if (hero) {
                    StopUnit(hero)
                }
            })
        }

        return true
    }

    makeDoNothing = () => {
        this.destroyMake()
        if (this.hero) this.make = new MakeDoNothing(this.hero)
    }

    makeCreateNoMoveMonsters(mt: MonsterType, facingAngle: number) {
        //mode : noMove
        this.destroyMake()
        if (this.hero) this.make = new MakeMonsterNoMove(this.hero, mt, facingAngle)
    }

    makeCreateSimplePatrolMonsters(mode: string, mt: MonsterType, angle?: number) {
        this.destroyMake()
        //modes : normal, string, auto
        if (mode == 'normal' || mode == 'string' || mode == 'auto') {
            if (this.hero) this.make = new MakeMonsterSimplePatrol(this.hero, mode, mt, angle)
        }
    }

    makeCreateMultiplePatrolsMonsters(mode: string, mt: MonsterType) {
        this.destroyMake()
        //modes : normal, string
        if (mode == 'normal' || mode == 'string') {
            if (this.hero) this.make = new MakeMonsterMultiplePatrols(this.hero, mode, mt)
        }
    }

    makeCreateTeleportMonsters(mode: string, mt: MonsterType, period: number, angle: number) {
        this.destroyMake()
        //modes : normal, string
        if (mode == 'normal' || mode == 'string') {
            if (this.hero) this.make = new MakeMonsterTeleport(this.hero, mode, mt, period, angle)
        }
    }

    makeMmpOrMtNext = () => {
        if (!this.make) {
            return false
        }

        if (this.make instanceof MakeMonsterMultiplePatrols || this.make instanceof MakeMonsterTeleport) {
            this.make.nextMonster()
        } else {
            return false
        }

        return true
    }

    makeMonsterTeleportWait = () => {
        if (!this.make || !(this.make instanceof MakeMonsterTeleport)) {
            return false
        }
        return this.make.addWaitPeriod()
    }

    makeMonsterTeleportHide = () => {
        if (!this.make || !(this.make instanceof MakeMonsterTeleport)) {
            return false
        }
        return this.make.addHidePeriod()
    }

    makeCreateMonsterSpawn(label: string, mt: MonsterType, sens: number, frequence: number) {
        this.destroyMake()
        if (this.hero) this.make = new MakeMonsterSpawn(this.hero, label, mt, sens, frequence)
    }

    makeCreateRegion(label: string) {
        this.destroyMake()
        if (this.hero) this.make = new MakeRegion(this.hero, label)
    }

    makeGetRegionAtPoint = () => {
        this.destroyMake()
        if (this.hero) this.make = new MakeGetRegion(this.hero)
    }

    makeMoveRegionPoint = () => {
        this.destroyMake()
        if (this.hero) this.make = new MakeMoveRegionPoint(this.hero)
    }

    makeCopyLevelPatrol = (targetLevel: Level, mode: string) => {
        this.destroyMake()
        if (this.hero) this.make = new MakeCopyLevelPatrol(this.hero, mode, targetLevel)
    }

    makeDeleteMonsters(mode: string) {
        this.destroyMake()

        try {
            if (this.hero) this.make = new MakeDeleteMonsters(this.hero, mode)
        } catch (error) {
            if (typeof error == 'string') {
                Text.erP(this.p, error)
            }
        }
    }

    makeSetUnitTeleportPeriod(mode: string, period: number) {
        this.destroyMake()

        try {
            if (this.hero) this.make = new MakeSetUnitTeleportPeriod(this.hero, mode, period)
        } catch (error) {
            if (typeof error == 'string') {
                Text.erP(this.p, error)
            }
        }
    }

    makeGetUnitTeleportPeriod = () => {
        this.destroyMake()
        if (this.hero) this.make = new MakeGetUnitTeleportPeriod(this.hero)
    }

    makeSetUnitMonsterType(mode: string, mt: MonsterType) {
        this.destroyMake()

        try {
            if (this.hero) this.make = new MakeSetUnitMonsterType(this.hero, mode, mt)
        } catch (error) {
            if (typeof error == 'string') {
                Text.erP(this.p, error)
            }
        }
    }

    makeCreateMeteor = () => {
        this.destroyMake()
        if (this.hero) this.make = new MakeMeteor(this.hero)
    }

    makeDeleteMeteors(mode: string) {
        this.destroyMake()

        try {
            if (this.hero) this.make = new MakeDeleteMeteors(this.hero, mode)
        } catch (error) {
            if (typeof error == 'string') {
                Text.erP(this.p, error)
            }
        }
    }

    makeCreateCaster(casterType: CasterType, angle: number) {
        this.destroyMake()
        if (this.hero) this.make = new MakeCaster(this.hero, casterType, angle)
    }

    makeDeleteCasters(mode: string) {
        this.destroyMake()

        try {
            if (this.hero) this.make = new MakeDeleteCasters(this.hero, mode)
        } catch (error) {
            if (typeof error == 'string') {
                Text.erP(this.p, error)
            }
        }
    }

    makeCreateClearMobs(disableDuration: number) {
        this.destroyMake()
        if (this.hero) this.make = new MakeClearMob(this.hero, disableDuration)
    }

    makeDeleteClearMobs = () => {
        this.destroyMake()
        if (this.hero) this.make = new MakeDeleteClearMob(this.hero)
    }

    makeCreatePortalMobs(freezeDuration: number, portalEffect: string | null, portalEffectDuration: number | null) {
        this.destroyMake()
        if (this.hero) this.make = new MakePortalMob(this.hero, freezeDuration, portalEffect, portalEffectDuration)
    }

    makeDeletePortalMobs = () => {
        this.destroyMake()
        if (this.hero) this.make = new MakeDeletePortalMob(this.hero)
    }

    makeCreateCircleMob(
        speed: number | null,
        direction: 'cw' | 'ccw' | null,
        facing: 'cw' | 'ccw' | 'in' | 'out' | null,
        radius: number | null
    ) {
        this.destroyMake()
        if (this.hero) this.make = new MakeCircleMob(this.hero, speed, direction, facing, radius)
    }

    makeDeleteCircleMob = () => {
        this.destroyMake()
        if (this.hero) this.make = new MakeDeleteCircleMob(this.hero)
    }

    makeCreateStaticSlide(angle: number, speed: number) {
        this.destroyMake()
        if (this.hero) this.make = new MakeStaticSlide(this.hero, angle, speed)
    }

    makeDeleteStaticSlide = () => {
        this.destroyMake()
        if (this.hero) this.make = new MakeDeleteStaticSlide(this.hero)
    }

    makeStaticSlideInfo = () => {
        this.destroyMake()
        if (this.hero) this.make = new MakeStaticSlideInfo(this.hero)
    }

    makeSetPortalMobFreezeDuration(freezeDuration: number) {
        this.destroyMake()
        if (this.hero) {
            this.make = new MakePropertyChange(
                this.hero,
                'freezeDuration',
                freezeDuration,
                (x, y) => this.getMakingLevel().monsters.getMonsterNear(x, y)?.getPortalMob(),
                monster => monster.getFreezeDuration(),
                (monster, freezeDuration) => monster.setFreezeDuration(freezeDuration)
            )
        }
    }

    makeSetPortalMobPortalEffect(portalEffect: string | null) {
        this.destroyMake()
        if (this.hero) {
            this.make = new MakePropertyChange(
                this.hero,
                'portalEffect',
                portalEffect,
                (x, y) => this.getMakingLevel().monsters.getMonsterNear(x, y)?.getPortalMob(),
                monster => monster.getPortalEffect(),
                (monster, portalEffect) => monster.setPortalEffect(portalEffect)
            )
        }
    }

    makeSetPortalMobPortalEffectDuration(portalEffectDuration: number | null) {
        this.destroyMake()
        if (this.hero) {
            this.make = new MakePropertyChange(
                this.hero,
                'portalEffectDuration',
                portalEffectDuration,
                (x, y) => this.getMakingLevel().monsters.getMonsterNear(x, y)?.getPortalMob(),
                monster => monster.getPortalEffectDuration(),
                (monster, portalEffectDuration) => monster.setPortalEffectDuration(portalEffectDuration)
            )
        }
    }

    makeSetCircleMobSpeed(speed: number) {
        this.destroyMake()
        if (this.hero) {
            this.make = new MakePropertyChange(
                this.hero,
                'speed',
                speed,
                (x, y) => this.getMakingLevel().monsters.getMonsterNear(x, y)?.getCircleMob(),
                monster => monster.getSpeed(),
                (monster, speed) => monster.setSpeed(speed)
            )
        }
    }

    makeSetCircleMobDirection(direction: 'cw' | 'ccw') {
        this.destroyMake()
        if (this.hero) {
            this.make = new MakePropertyChange(
                this.hero,
                'direction',
                direction,
                (x, y) => this.getMakingLevel().monsters.getMonsterNear(x, y)?.getCircleMob(),
                monster => monster.getDirection(),
                (monster, direction) => monster.setDirection(direction)
            )
        }
    }

    makeSetCircleMobFacing(facing: 'cw' | 'ccw' | 'in' | 'out') {
        this.destroyMake()
        if (this.hero) {
            this.make = new MakePropertyChange(
                this.hero,
                'facing',
                facing,
                (x, y) => this.getMakingLevel().monsters.getMonsterNear(x, y)?.getCircleMob(),
                monster => monster.getFacing(),
                (monster, facing) => monster.setFacing(facing)
            )
        }
    }

    makeSetCircleMobInitialAngle(initialAngle: number) {
        this.destroyMake()
        if (this.hero) {
            this.make = new MakePropertyChange(
                this.hero,
                'initialAngle',
                initialAngle,
                (x, y) => this.getMakingLevel().monsters.getMonsterNear(x, y)?.getCircleMob(),
                monster => monster.getInitialAngle(),
                (monster, initialAngle) => monster.setInitialAngle(initialAngle)
            )
        }
    }

    makeSetCircleMobRadius(radius: number) {
        this.destroyMake()
        if (this.hero) {
            this.make = new MakePropertyChange(
                this.hero,
                'radius',
                radius,
                (x, y) => this.getMakingLevel().monsters.getMonsterNear(x, y)?.getCircleMob(),
                monster => monster.getRadius(),
                (monster, radius) => monster.setRadius(radius)
            )
        }
    }

    makeSetStaticSlideSpeed(speed: number) {
        this.destroyMake()
        if (this.hero) {
            this.make = new MakePropertyChange(
                this.hero,
                'speed',
                speed,
                (x, y) => this.getMakingLevel().staticSlides.getStaticSlideFromPoint(x, y),
                staticSlide => staticSlide.getSpeed(),
                (staticSlide, speed) => staticSlide.setSpeed(speed)
            )
        }
    }

    makeSetStaticSlideAngle(angle: number) {
        this.destroyMake()
        if (this.hero) {
            this.make = new MakePropertyChange(
                this.hero,
                'angle',
                angle,
                (x, y) => this.getMakingLevel().staticSlides.getStaticSlideFromPoint(x, y),
                staticSlide => staticSlide.getAngle(),
                (staticSlide, angle) => staticSlide.setAngle(angle)
            )
        }
    }

    makeSetStaticSlideCanTurnAngle(canTurnAngle: number | undefined) {
        this.destroyMake()
        if (this.hero) {
            this.make = new MakePropertyChange(
                this.hero,
                'canTurnAngle',
                canTurnAngle,
                (x, y) => this.getMakingLevel().staticSlides.getStaticSlideFromPoint(x, y),
                staticSlide => staticSlide.getCanTurnAngle(),
                (staticSlide, canTurnAngle) => staticSlide.setCanTurnAngle(canTurnAngle)
            )
        }
    }

    makeSetMonsterJumpPad(jumpPad: number | undefined) {
        this.destroyMake()
        if (this.hero) {
            this.make = new MakePropertyChange(
                this.hero,
                'jumpPad',
                jumpPad,
                (x, y) => this.getMakingLevel().monsters.getMonsterNear(x, y),
                monster => monster.getJumpPad(),
                (monster, jumpPad) => monster.setJumpPad(jumpPad)
            )
        }
    }

    makeSetMonsterJumpPadEffect(jumpPadEffect: string | undefined) {
        this.destroyMake()
        if (this.hero) {
            this.make = new MakePropertyChange(
                this.hero,
                'jumpPadEffect',
                jumpPadEffect,
                (x, y) => this.getMakingLevel().monsters.getMonsterNear(x, y),
                monster => monster.getJumpPadEffect(),
                (monster, jumpPadEffect) => monster.setJumpPadEffect(jumpPadEffect)
            )
        }
    }

    makeSetMonsterAttackGroundOrder() {
        this.destroyMake()
        if (this.hero) this.make = new MakeMonsterAttackGroundOrder(this.hero)
    }

    makeCreateTerrain(terrainType: TerrainType) {
        this.destroyMake()
        if (this.hero) this.make = new MakeTerrainCreate(this.hero, terrainType)
    }

    makeCreateTerrainBrush(terrainType: TerrainType, brushSize: number, shape: 'square' | 'circle' = 'square') {
        this.destroyMake()
        this.make = new MakeTerrainCreateBrush(this, terrainType, brushSize, shape)
    }

    makeTerrainCopyPaste = () => {
        this.destroyMake()
        if (this.hero) this.make = new MakeTerrainCopyPaste(this.hero)
    }

    makeTerrainVerticalSymmetry = () => {
        this.destroyMake()
        if (this.hero) this.make = new MakeTerrainVerticalSymmetry(this.hero)
    }

    makeTerrainHorizontalSymmetry = () => {
        this.destroyMake()
        if (this.hero) this.make = new MakeTerrainHorizontalSymmetry(this.hero)
    }

    makeTerrainHeight(radius: number, height: number) {
        this.destroyMake()
        if (this.hero) this.make = new MakeTerrainHeight(this.hero, radius, height)
    }

    makeGetTerrainType = () => {
        this.destroyMake()
        if (this.hero) this.make = new MakeGetTerrainType(this.hero)
    }

    makeExchangeTerrains = () => {
        this.destroyMake()
        if (this.hero) this.make = new MakeExchangeTerrains(this.hero)
    }

    makeCreateStart(forNext: boolean, facing?: number) {
        this.destroyMake()
        if (this.hero) this.make = new MakeStart(this.hero, forNext, facing)
    }

    makeCreateEnd = () => {
        this.destroyMake()
        if (this.hero) this.make = new MakeEnd(this.hero)
    }

    makeCreateVisibilityModifier = () => {
        this.destroyMake()
        if (this.hero) this.make = new MakeVisibilityModifier(this.hero)
    }

    cancelLastAction = () => {
        if (this.make) {
            if (this.make.cancelLastAction()) {
                return true
            }
        }
        return this.makeLastActions.cancelLastAction()
    }

    redoLastAction = () => {
        if (this.makeLastActions.redoLastAction()) {
            return true
        }
        if (this.make) {
            return this.make.redoLastAction()
        }
        return false
    }

    deleteSpecificActionsForLevel(level: Level) {
        this.makeLastActions.deleteSpecificActionsForLevel(level)
    }

    newAction(action: MakeAction) {
        return this.makeLastActions.newAction(action)
    }

    destroyAllSavedActions = () => {
        this.makeLastActions.destroyAllActions()
    }

    destroyCancelledActions = () => {
        this.makeLastActions.destroyCancelledActions()
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

    isEscaperSecondary = () => {
        return this.escaperId >= NB_PLAYERS_MAX
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
                BlzSetUnitSkin(this.hero, this.skin || HERO_TYPE_ID)
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
        }

        if (b && this.hero) {
            const x = GetUnitX(this.hero)
            const y = GetUnitY(this.hero)
            this.tClickWhereYouAre = createTimer(0.1, true, () => {
                this.hero && IssuePointOrder(this.hero, 'smart', x, y)
            })
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
                    if (this.getPlayer() === GetTriggerPlayer() && !this.canClick) {
                        if (
                            !IsIssuedOrder('smart') ||
                            GetItemTypeId(GetOrderTargetItem()) === METEOR_NORMAL ||
                            GetItemTypeId(GetOrderTargetItem()) === METEOR_CHEAT
                        ) {
                            return
                        }

                        StopUnit(GetTriggerUnit())
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

    toJson = () => ({
        //useless but mandatory due to BaseArray implementation
    })
}
