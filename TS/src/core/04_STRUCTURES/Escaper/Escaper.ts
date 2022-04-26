import { StopUnit } from 'core/01_libraries/Basic_functions'
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
    PLAYER_DUMMY_CIRCLE,
    PLAYER_INVIS_UNIT,
    POWER_CIRCLE,
    SLIDE_PERIOD,
    TERRAIN_KILL_EFFECT_BODY_PART,
} from 'core/01_libraries/Constants'
import { udg_colorCode } from 'core/01_libraries/Init_colorCodes'
import { Text } from 'core/01_libraries/Text'
import { MakeCaster } from 'core/05_MAKE_STRUCTURES/Make_create_casters/MakeCaster'
import { MakeMeteor } from 'core/05_MAKE_STRUCTURES/Make_create_meteors/MakeMeteor'
import { MakeMonsterMultiplePatrols } from 'core/05_MAKE_STRUCTURES/Make_create_monsters/MakeMonsterMultiplePatrols'
import { MakeMonsterSimplePatrol } from 'core/05_MAKE_STRUCTURES/Make_create_monsters/MakeMonsterSimplePatrol'
import { MakeMonsterTeleport } from 'core/05_MAKE_STRUCTURES/Make_create_monsters/MakeMonsterTeleport'
import { MakeMonsterSpawn } from 'core/05_MAKE_STRUCTURES/Make_create_monster_spawn/MakeMonsterSpawn'
import { MakeDeleteCasters } from 'core/05_MAKE_STRUCTURES/Make_delete_casters/MakeDeleteCasters'
import { MakeDeleteMeteors } from 'core/05_MAKE_STRUCTURES/Make_delete_meteors/MakeDeleteMeteors'
import { MakeDeleteMonsters } from 'core/05_MAKE_STRUCTURES/Make_delete_monsters/MakeDeleteMonsters'
import { MakeClearMob } from 'core/05_MAKE_STRUCTURES/Make_monster_properties/MakeClearMob'
import { MakeDeleteClearMob } from 'core/05_MAKE_STRUCTURES/Make_monster_properties/MakeDeleteClearMob'
import { MakeDeletePortalMob } from 'core/05_MAKE_STRUCTURES/Make_monster_properties/MakeDeletePortalMob'
import { MakePortalMob } from 'core/05_MAKE_STRUCTURES/Make_monster_properties/MakePortalMob'
import { MakeGetUnitTeleportPeriod } from 'core/05_MAKE_STRUCTURES/Make_set_unit_properties/MakeGetUnitTeleportPeriod'
import { MakeSetUnitMonsterType } from 'core/05_MAKE_STRUCTURES/Make_set_unit_properties/MakeSetUnitMonsterType'
import { MakeSetUnitTeleportPeriod } from 'core/05_MAKE_STRUCTURES/Make_set_unit_properties/MakeSetUnitTeleportPeriod'
import { AfkMode } from 'core/08_GAME/Afk_mode/Afk_mode'
import { ServiceManager } from 'Services'
import { Timer } from 'w3ts'
import { getUdgEscapers, getUdgLevels, getUdgTerrainTypes } from '../../../../globals'
import {createEvent, createTimer} from '../../../Utils/mapUtils'
import { EncodingBase64 } from '../../../Utils/SaveLoad/TreeLib/EncodingBase64'
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
import {BlzColor2Id, removeHash} from '../../06_COMMANDS/COMMANDS_vJass/Command_functions'
import { CheckTerrainTrigger } from '../../07_TRIGGERS/Slide_and_CheckTerrain_triggers/CheckTerrain'
import { SlideTrigger } from '../../07_TRIGGERS/Slide_and_CheckTerrain_triggers/Slide'
import { Trig_InvisUnit_is_getting_damage } from '../../08_GAME/Death/InvisUnit_is_getting_damage'
import { HERO_START_ANGLE } from '../../08_GAME/Init_game/Heroes'
import { MessageHeroDies } from '../../08_GAME/Init_game/Message_heroDies'
import { RunCoopSoundOnHero } from '../../08_GAME/Mode_coop/coop_init_sounds'
import { CommandShortcuts } from '../../08_GAME/Shortcuts/Using_shortcut'
import { FollowMouse } from '../../Follow_mouse/Follow_mouse'
import type { CasterType } from '../Caster/CasterType'
import { Level } from '../Level/Level'
import { IsLevelBeingMade } from '../Level/Level_functions'
import { DEPART_PAR_DEFAUT } from '../Level/StartAndEnd'
import { METEOR_NORMAL, udg_meteors } from '../Meteor/Meteor'
import type { MonsterType } from '../Monster/MonsterType'
import type { TerrainType } from '../TerrainType/TerrainType'
import { TerrainTypeSlide } from '../TerrainType/TerrainTypeSlide'
import { TerrainTypeWalk } from '../TerrainType/TerrainTypeWalk'
import { EscaperEffectArray } from './EscaperEffectArray'
import { EscaperFirstPerson } from './Escaper_firstPerson'
import {ColorInfo, GetMirrorEscaper, IsHero} from './Escaper_functions'
import { EscaperStartCommands } from './Escaper_StartCommands'

const SHOW_REVIVE_EFFECTS = false

const VIPs64 = ['V29ybGRFZGl0', 'TWF4aW1heG91IzI4NzI=', 'U3RhbiMyMjM5OQ==']

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
    private slideMovePerPeriod: number
    private slideMirror: boolean = false
    private baseColorId: number
    private cameraField: number
    private lastTerrainType?: TerrainType
    private controler: Escaper

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
    private hasAutoreviveB: boolean

    private canCheatB: boolean
    private isMaximaxouB: boolean
    private isTrueMaximaxouB: boolean

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

    public hideLeaderboard = false

    //follow mode
    private followMouse?: FollowMouse

    //make
    private gumTerrain?: TerrainType
    private gumBrushSize = 1

    private ignoreDeathMessages = false
    private textTag: texttag | null = null
    private textTagTimer: Timer | null = null

    private displayName: string

    private showNames = false
    private showOthersTransparency: number | null = null

    //mouse position updated when a trigger dependant of mouse movement is being used
    mouseX = 0
    mouseY = 0

    /*
     * Constructor
     */
    constructor(escaperId: number) {
        this.playerId = escaperId >= NB_PLAYERS_MAX ? escaperId - 12 : escaperId

        this.escaperId = escaperId
        this.p = Player(this.playerId)
        this.walkSpeed = HERO_WALK_SPEED
        this.slideSpeed = HERO_SLIDE_SPEED
        this.slideMovePerPeriod = HERO_SLIDE_SPEED * SLIDE_PERIOD
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

        this.dummyPowerCircle = CreateUnit(PLAYER_DUMMY_CIRCLE, DUMMY_POWER_CIRCLE, 0, 0, 0)
        SetUnitUserData(this.dummyPowerCircle, escaperId)
        ShowUnit(this.dummyPowerCircle, false)

        this.displayName = removeHash(GetPlayerName(this.p))
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
            this.meteorEffect = AddSpecialEffectTarget(METEOR_EFFECT, this.hero, 'hand right')
        }
    }

    removeEffectMeteor = () => {
        if (this.meteorEffect) {
            DestroyEffect(this.meteorEffect)
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
        let heroTypeId = HERO_TYPE_ID

        if (this.hero) {
            return false
        }

        if (this.escaperId >= NB_PLAYERS_MAX) {
            heroTypeId = HERO_SECONDARY_TYPE_ID
        }

        this.hero = CreateUnit(this.p, heroTypeId, x, y, angle)

        if(!this.hero){
            return
        }

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

        SetUnitColor(this.hero, ConvertPlayerColor(this.baseColorId))
        BlzSetHeroProperName(this.hero, this.getDisplayName())

        this.updateUnitVertexColor(false)
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
        TimerStart(
            AfkMode.afkModeTimers[this.escaperId],
            AfkMode.timeMinAfk,
            false,
            AfkMode.GetAfkModeTimeExpiresCodeFromId(this.escaperId)
        )
        CommandShortcuts.InitShortcutSkills(GetPlayerId(this.p))
        EnableTrigger(this.checkTerrain)

        this.textTag = CreateTextTag()
        SetTextTagTextBJ(this.textTag, udg_colorCode[this.getColorId()] + this.getDisplayName(), 10)
        SetTextTagPermanent(this.textTag, true)
        SetTextTagVisibility(this.textTag, false)
        this.textTagTimer = createTimer(0.01, true, this.updateTextTagPos)

        this.updateShowNames(false)
        this.updateUnitVertexColor(false)

        this.startCommandsHandle.loadStartCommands()

        //what to do on hero death
        const hero = this.hero
        createEvent({
            events: [t => TriggerRegisterUnitEvent(t, hero, EVENT_UNIT_DEATH)],
            actions: [() => {
                this.onEscaperDeath()
            }]
        })

        return true
    }

    createHeroAtStart = () => {
        let x: number
        let y: number
        let start = getUdgLevels().getCurrentLevel()?.getStart()
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

        if (IsUnitAliveBJ(this.hero)) {
            KillUnit(this.hero)
        }

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

        DisableTrigger(this.checkTerrain)
        this.slide && this.slide.destroy()

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
            DestroyEffect(this.terrainKillEffect)
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
            this.slide?.destroy()
            delete this.slide
            this.slideLastAngleOrder = -1
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

    //move methods
    moveHero(x: number, y: number) {
        if (this.hero) {
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

        if (!this.isEscaperSecondary()) {
            ServiceManager.getService('Multiboard').increasePlayerScore(GetPlayerId(this.getPlayer()), 'deaths')
        }
    }

    kill = () => {
        if (this.isAlive()) {
            this.hero && KillUnit(this.hero)
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

    revive(x: number, y: number) {
        if (!this.hero || !this.invisUnit || this.isAlive()) {
            return false
        }

        ReviveHero(this.hero, x, y, SHOW_REVIVE_EFFECTS)
        SetUnitX(this.invisUnit, x)
        SetUnitY(this.invisUnit, y)
        ShowUnit(this.invisUnit, true)
        this.enableCheckTerrain(true)
        this.SpecialIllidan()
        this.selectHero()

        if (this.vcTransparency != 0) {
            this.updateUnitVertexColor(false)
        }

        TimerStart(
            AfkMode.afkModeTimers[this.escaperId],
            AfkMode.timeMinAfk,
            false,
            AfkMode.GetAfkModeTimeExpiresCodeFromId(this.escaperId)
        )
        this.lastZ = 0
        this.oldDiffZ = 0
        this.speedZ = 0

        //coop
        ShowUnit(this.powerCircle, false)
        ShowUnit(this.dummyPowerCircle, false)

        return true
    }

    reviveAtStart = () => {
        const x: number = getUdgLevels().getCurrentLevel().getStartRandomX()
        const y: number = getUdgLevels().getCurrentLevel().getStartRandomY()

        if (!this.isEscaperSecondary()) {
            GetMirrorEscaper(this)?.reviveAtStart()
        }

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
        this.terrainKillEffect && DestroyEffect(this.terrainKillEffect)
    }

    createTerrainKillEffect(killEffectStr: string) {
        this.destroyTerrainKillEffect()
        this.hero &&
            (this.terrainKillEffect = AddSpecialEffectTarget(killEffectStr, this.hero, TERRAIN_KILL_EFFECT_BODY_PART))
    }

    destroyPortalEffect = () => {
        this.portalEffect && DestroyEffect(this.portalEffect)
    }

    createPortalEffect(effectStr: string) {
        this.destroyPortalEffect()
        this.hero && (this.portalEffect = AddSpecialEffectTarget(effectStr, this.hero, TERRAIN_KILL_EFFECT_BODY_PART))
    }

    //lastTerrainType methods
    getLastTerrainType = () => {
        return this.lastTerrainType
    }

    setLastTerrainType(terrainType: TerrainType) {
        this.lastTerrainType = terrainType
    }

    //speed methods
    setSlideSpeed(ss: number) {
        this.slideSpeed = ss
        this.slideMovePerPeriod = ss * SLIDE_PERIOD
    }

    getSlideMovePerPeriod = () => {
        return this.slideMovePerPeriod
    }

    setWalkSpeed(ws: number) {
        this.walkSpeed = ws
        this.hero && SetUnitMoveSpeed(this.hero, ws)
    }

    getSlideSpeed = () => {
        return this.slideSpeed
    }

    getWalkSpeed = () => {
        return this.walkSpeed
    }

    isAbsoluteSlideSpeed = () => {
        return this.slideSpeedAbsolute
    }

    absoluteSlideSpeed(slideSpeed: number) {
        this.slideSpeedAbsolute = true
        this.slideSpeed = slideSpeed
        this.slideMovePerPeriod = slideSpeed * SLIDE_PERIOD

        if (!this.isEscaperSecondary()) {
            GetMirrorEscaper(this)?.absoluteSlideSpeed(slideSpeed)
        }
    }

    stopAbsoluteSlideSpeed = () => {
        if (this.slideSpeedAbsolute) {
            this.slideSpeedAbsolute = false

            if (this.hero && this.isAlive()) {
                const currentTerrainType = getUdgTerrainTypes().getTerrainType(GetUnitX(this.hero), GetUnitY(this.hero))
                if (currentTerrainType instanceof TerrainTypeSlide) {
                    this.setSlideSpeed(currentTerrainType.getSlideSpeed())
                }
            }

            if (!this.isEscaperSecondary()) {
                GetMirrorEscaper(this)?.stopAbsoluteSlideSpeed()
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
            } else {
                SetUnitColor(this.hero, ConvertPlayerColor(baseColorId))
            }
        }

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
            } else {
                SetUnitColor(this.hero, ConvertPlayerColor(baseColorId))
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
        this.hero && this.updateUnitVertexColor(false)

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

    makeCreateSimplePatrolMonsters(mode: string, mt: MonsterType) {
        this.destroyMake()
        //modes : normal, string, auto
        if (mode == 'normal' || mode == 'string' || mode == 'auto') {
            if (this.hero) this.make = new MakeMonsterSimplePatrol(this.hero, mode, mt)
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

    makeCreateMonsterSpawn(label: string, mt: MonsterType, sens: string, frequence: number) {
        this.destroyMake()
        if (this.hero) this.make = new MakeMonsterSpawn(this.hero, label, mt, sens, frequence)
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

    makeCreateStart(forNext: boolean) {
        this.destroyMake()
        if (this.hero) this.make = new MakeStart(this.hero, forNext)
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
    coopReviveHero = () => {
        const mirrorEscaper = GetMirrorEscaper(this)
        const mirrorHero = mirrorEscaper?.getHero()

        if (this.hero) {
            const xHero = GetUnitX(this.hero)
            const yHero = GetUnitY(this.hero)
            this.revive(xHero, yHero)
            RunCoopSoundOnHero(this.hero)
            SetUnitAnimation(this.hero, 'channel')
            this.absoluteSlideSpeed(0)
            this.setCoopInvul(true)

            //move camera if needed
            if (GetLocalPlayer() == this.p) {
                const FIELD = 1500
                const minX = GetCameraTargetPositionX() - FIELD / 2
                const minY = GetCameraTargetPositionY() - FIELD / 2
                const maxX = GetCameraTargetPositionX() + FIELD / 2
                const maxY = GetCameraTargetPositionY() + FIELD / 2

                if (xHero < minX || xHero > maxX || yHero < minY || yHero > maxY) {
                    SetCameraPositionForPlayer(this.p, xHero, yHero)
                }
            }
        }

        if (mirrorHero && mirrorEscaper) {
            mirrorEscaper.revive(GetUnitX(mirrorHero), GetUnitY(mirrorHero))
            RunCoopSoundOnHero(mirrorHero)
            SetUnitAnimation(mirrorHero, 'channel')
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

    setLockCamTarget = (lockCamTarget: Escaper | null) => {
        this.lockCamTarget = lockCamTarget
    }

    setGumTerrain = (terrainType: TerrainType) => {
        this.gumTerrain = terrainType
    }

    getGumTerrain = () => {
        return this.gumTerrain
    }

    setGumBrushSize = (size: number) => {
        this.gumBrushSize = size
    }

    getGumBrushSize = () => {
        return this.gumBrushSize
    }

    enableFollowMouseMode = (flag: boolean) => {
        this.followMouse?.destroy()
        if (flag) {
            this.followMouse = new FollowMouse(this)
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

    setShowOthersTransparency = (showOthersTransparency: number | null) => {
        this.showOthersTransparency = showOthersTransparency
        this.updateUnitVertexColor(true)
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

    updateUnitVertexColor = (localOnly: boolean) => {
        for (const [_, player] of pairs(getUdgEscapers().getAll())) {
            if (!localOnly || player.getPlayer() === GetLocalPlayer()) {
                for (const [_, escaper] of pairs(getUdgEscapers().getAll())) {
                    const hero = escaper.getHero()

                    if (hero) {
                        SetUnitVertexColorBJ(
                            hero,
                            escaper.vcRed,
                            escaper.vcGreen,
                            escaper.vcBlue,
                            GetLocalPlayer() === escaper.getPlayer() || player.showOthersTransparency === null
                                ? escaper.vcTransparency
                                : player.showOthersTransparency
                        )
                    }
                }
            }
        }
    }

    toJson = () => ({
        //useless but mandatory due to BaseArray implementation
    })
}
