import { StopUnit } from 'core/01_libraries/Basic_functions'
import {
    DEFAULT_CAMERA_FIELD,
    DUMMY_POWER_CIRCLE,
    ENNEMY_PLAYER,
    HERO_SECONDARY_TYPE_ID,
    HERO_SLIDE_SPEED,
    HERO_TYPE_ID,
    HERO_WALK_SPEED,
    INVIS_UNIT_TYPE_ID,
    NB_PLAYERS_MAX,
    NB_PLAYERS_MAX_REFORGED,
    NEUTRAL_PLAYER,
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
import { MakeGetUnitTeleportPeriod } from 'core/05_MAKE_STRUCTURES/Make_set_unit_properties/MakeGetUnitTeleportPeriod'
import { MakeSetUnitMonsterType } from 'core/05_MAKE_STRUCTURES/Make_set_unit_properties/MakeSetUnitMonsterType'
import { MakeSetUnitTeleportPeriod } from 'core/05_MAKE_STRUCTURES/Make_set_unit_properties/MakeSetUnitTeleportPeriod'
import { AfkMode } from 'core/08_GAME/Afk_mode/Afk_mode'
import { udg_escapers } from 'core/08_GAME/Init_structures/Init_escapers'
import { udg_coop_index_son } from 'core/08_GAME/Mode_coop/coop_init_sounds'
import { udg_terrainTypes } from '../../../../globals'
import { Make } from '../../05_MAKE_STRUCTURES/Make/Make'
import { MakeAction } from '../../05_MAKE_STRUCTURES/MakeLastActions/MakeAction'
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
import { MakeTerrainHorizontalSymmetry } from '../../05_MAKE_STRUCTURES/Make_terrain/MakeTerrainHorizontalSymmetry'
import { MakeTerrainVerticalSymmetry } from '../../05_MAKE_STRUCTURES/Make_terrain/MakeTerrainVerticalSymmetry'
import { MakeTerrainHeight } from '../../05_MAKE_STRUCTURES/Make_terrain_height/MakeTerrainHeight'
import { CheckTerrainTrigger } from '../../07_TRIGGERS/Slide_and_CheckTerrain_triggers/CheckTerrain'
import { SlideTrigger } from '../../07_TRIGGERS/Slide_and_CheckTerrain_triggers/Slide'
import { Trig_InvisUnit_is_getting_damage } from '../../08_GAME/Death/InvisUnit_is_getting_damage'
import { Heroes } from '../../08_GAME/Init_game/Heroes'
import { MessageHeroDies } from '../../08_GAME/Init_game/Message_heroDies'
import { udg_levels } from '../../08_GAME/Init_structures/Init_struct_levels'
import { CommandShortcuts } from '../../08_GAME/Shortcuts/Command_shortcuts_functions'
import { Level } from '../Level/Level'
import { DEPART_PAR_DEFAUT } from '../Level/StartAndEnd'
import { Meteor, METEOR_NORMAL } from '../Meteor/Meteor'
import { MonsterType } from '../Monster/MonsterType'
import { TerrainType } from '../TerrainType/TerrainType'
import { TerrainTypeSlide } from '../TerrainType/TerrainTypeSlide'
import { TerrainTypeWalk } from '../TerrainType/TerrainTypeWalk'
import { EscaperEffectArray, IEscaperEffectArray } from './EscaperEffectArray'
import { ColorInfo, GetMirrorEscaper } from './Escaper_functions'

const SHOW_REVIVE_EFFECTS = false

export class Escaper {
    private escaperId: number
    private playerId: number

    private p: player
    private hero?: unit
    private invisUnit?: unit
    private walkSpeed: number
    private slideSpeed: number
    private baseColorId: number
    private cameraField: number
    private lastTerrainType?: TerrainType
    private controler: Escaper

    private slide: trigger
    private checkTerrain: trigger

    private vcRed: number
    private vcGreen: number
    private vcBlue: number
    private vcTransparency: number
    private effects: IEscaperEffectArray
    private terrainKillEffect?: effect
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

    private itemInInventory?: item

    private lastZ?: number
    private oldDiffZ?: number
    private speedZ?: number

    private slideLastAngleOrder: number
    private isHeroSelectedB: boolean

    private instantTurnAbsolute: boolean

    private animSpeedSecondaryHero: number

    public discoTrigger?: trigger
    public currentLevelTouchTerrainDeath: Level //pour le terrain qui tue, vérifie s'il faut bien tuer l'escaper

    //coop
    private powerCircle: unit
    private dummyPowerCircle: unit
    private coopInvul: boolean

    constructor(escaperId: number) {
        this.playerId = escaperId >= NB_PLAYERS_MAX ? escaperId - 12 : escaperId

        this.escaperId = escaperId
        this.p = Player(this.playerId)
        this.walkSpeed = HERO_WALK_SPEED
        this.slideSpeed = HERO_SLIDE_SPEED
        this.baseColorId = this.playerId

        this.slide = SlideTrigger.CreateSlideTrigger(escaperId)
        this.checkTerrain = CheckTerrainTrigger.CreateCheckTerrainTrigger(escaperId)

        this.cameraField = DEFAULT_CAMERA_FIELD
        SetCameraFieldForPlayer(this.p, CAMERA_FIELD_TARGET_DISTANCE, this.cameraField, 0)

        this.effects = EscaperEffectArray()
        this.vcRed = 100
        this.vcGreen = 100
        this.vcBlue = 100
        this.vcTransparency = escaperId >= NB_PLAYERS_MAX ? 50 : 0

        this.makeLastActions = MakeLastActions(this)

        this.godMode = false
        this.godModeKills = false
        this.walkSpeedAbsolute = false
        this.slideSpeedAbsolute = false
        this.hasAutoreviveB = false

        this.canCheatB = false
        this.isMaximaxouB = false
        this.isTrueMaximaxouB = false

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

        this.dummyPowerCircle = CreateUnit(ENNEMY_PLAYER, DUMMY_POWER_CIRCLE, 0, 0, 0)
        SetUnitUserData(this.dummyPowerCircle, escaperId)
        ShowUnit(this.dummyPowerCircle, false)
    }

    getEscaperId() {
        return this.escaperId
    }

    //item method
    resetItem() {
        //renvoie true si le héros portait un item
        if (this.hero && UnitHasItemOfTypeBJ(this.hero, METEOR_NORMAL)) {
            SetItemDroppable(UnitItemInSlot(this.hero, 0), true)
            Meteor.get(GetItemUserData(UnitItemInSlot(this.hero, 0))).replace()
            this.removeEffectMeteor()
            return true
        }
        return false
    }

    addEffectMeteor() {
        if (!this.meteorEffect && this.hero) {
            this.meteorEffect = AddSpecialEffectTarget(
                'Abilities\\Weapons\\DemonHunterMissile\\DemonHunterMissile.mdl',
                this.hero,
                'hand right'
            )
        }
    }

    removeEffectMeteor() {
        if (this.meteorEffect) {
            DestroyEffect(this.meteorEffect)
            delete this.meteorEffect
        }
    }

    //select method
    selectHero() {
        this.hero && SelectUnitAddForPlayer(this.hero, this.controler.getPlayer())
        this.setIsHeroSelectedForPlayer(this.controler.getPlayer(), true)
    }

    //creation method
    createHero(x: number, y: number, angle: number) {
        //retourne false si le héros existe déja
        let heroTypeId = HERO_TYPE_ID

        if (this.hero != null) {
            return false
        }

        if (this.escaperId >= NB_PLAYERS_MAX) {
            heroTypeId = HERO_SECONDARY_TYPE_ID
        }

        this.hero = CreateUnit(this.p, heroTypeId, x, y, angle)

        if (this.escaperId >= NB_PLAYERS_MAX) {
            SetUnitTimeScale(this.hero, this.animSpeedSecondaryHero)
        }

        SetUnitFlyHeight(this.hero, 1, 0)
        SetUnitFlyHeight(this.hero, 0, 0)
        SetUnitUserData(this.hero, this.escaperId)
        ShowUnit(this.hero, false)
        ShowUnit(this.hero, true)
        UnitRemoveAbility(this.hero, FourCC('Aloc'))
        SetUnitMoveSpeed(this.hero, this.walkSpeed) //voir pour le nom de la fonction
        this.selectHero()

        if (this.baseColorId == 0) {
            SetUnitColor(this.hero, PLAYER_COLOR_RED)
        } else {
            SetUnitColor(this.hero, ConvertPlayerColor(this.baseColorId))
        }

        SetUnitVertexColorBJ(this.hero, this.vcRed, this.vcGreen, this.vcBlue, this.vcTransparency)
        this.SpecialIllidan()
        this.invisUnit = CreateUnit(NEUTRAL_PLAYER, INVIS_UNIT_TYPE_ID, x, y, angle)
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
        return true
    }

    createHeroAtStart() {
        let x: number
        let y: number
        let start = udg_levels.getCurrentLevel().getStart()
        let angle: number

        if (!start) {
            //si le départ du niveau en cours n'existe pas
            start = DEPART_PAR_DEFAUT
            angle = Heroes.HERO_START_ANGLE
        } else {
            angle = GetRandomDirectionDeg()
        }

        x = start.getRandomX()
        y = start.getRandomY()
        return this.createHero(x, y, angle)
    }

    removeHero() {
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
        DisableTrigger(this.slide)

        //coop
        ShowUnit(this.powerCircle, false)
        ShowUnit(this.dummyPowerCircle, false)

        if (!this.isEscaperSecondary()) {
            GetMirrorEscaper(this)?.removeHero()
        }
    }

    destroy() {
        this.removeHero()

        if (this.terrainKillEffect) {
            DestroyEffect(this.terrainKillEffect)
            delete this.terrainKillEffect
        }
        this.effects.destroy()

        DestroyTrigger(this.slide)
        DestroyTrigger(this.checkTerrain)

        this.discoTrigger && DestroyTrigger(this.discoTrigger)
        delete this.discoTrigger

        udg_escapers.nullify(this.escaperId)

        //coop
        RemoveUnit(this.powerCircle)
        RemoveUnit(this.dummyPowerCircle)
    }

    //getId method
    getId() {
        return this.escaperId
    }

    //trigger methods
    enableSlide(doEnable: boolean) {
        let heroPos: location

        if (IsTriggerEnabled(this.slide) == doEnable) {
            return false
        }

        if (doEnable) {
            EnableTrigger(this.slide)

            if (this.hero) {
                StopUnit(this.hero)
                heroPos = GetUnitLoc(this.hero)
                this.setLastZ(GetLocationZ(heroPos) + GetUnitFlyHeight(this.hero))
                RemoveLocation(heroPos)
            }
        } else {
            DisableTrigger(this.slide)
            this.slideLastAngleOrder = -1
        }

        return true
    }

    setSlideLastAngleOrder(angle: number) {
        this.slideLastAngleOrder = angle
    }

    getSlideLastAngleOrder() {
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

    isSliding() {
        return IsTriggerEnabled(this.slide)
    }

    doesCheckTerrain() {
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
    getHero() {
        return this.hero
    }

    isAlive() {
        return this.hero && IsUnitAliveBJ(this.hero)
    }

    isPaused() {
        return this.hero && IsUnitPaused(this.hero)
    }

    kill() {
        if (this.isAlive()) {
            this.resetItem()
            this.hero && KillUnit(this.hero)
            delete this.lastTerrainType
            this.invisUnit && ShowUnit(this.invisUnit, false)
            this.enableCheckTerrain(false)
            AfkMode.StopAfk(this.escaperId)
            MessageHeroDies.DisplayDeathMessagePlayer(this.p)
            this.isHeroSelectedB = false
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

    SpecialIllidan() {
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
            SetUnitVertexColorBJ(this.hero, this.vcRed, this.vcGreen, this.vcBlue, this.vcTransparency)
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

    reviveAtStart() {
        const x: number = udg_levels.getCurrentLevel().getStartRandomX()
        const y: number = udg_levels.getCurrentLevel().getStartRandomY()

        if (!this.isEscaperSecondary()) {
            GetMirrorEscaper(this)?.reviveAtStart()
        }

        return this.revive(x, y)
    }

    turnInstantly(angle: number) {
        if (!this.hero) return

        let heroTypeId = HERO_TYPE_ID
        let lastTerrainType = this.lastTerrainType
        let x = GetUnitX(this.hero)
        let y = GetUnitY(this.hero)
        let meteor = UnitItemInSlot(this.hero, 0)

        RemoveUnit(this.hero)

        //recreate this.hero
        if (this.escaperId >= NB_PLAYERS_MAX) {
            heroTypeId = HERO_SECONDARY_TYPE_ID
        }

        this.hero = CreateUnit(this.p, heroTypeId, x, y, angle)

        if (this.escaperId >= NB_PLAYERS_MAX) {
            SetUnitTimeScale(this.hero, this.animSpeedSecondaryHero)
        }

        SetUnitFlyHeight(this.hero, 1, 0)
        SetUnitFlyHeight(this.hero, 0, 0)
        SetUnitUserData(this.hero, GetPlayerId(this.p))
        ShowUnit(this.hero, false)
        ShowUnit(this.hero, true)
        UnitRemoveAbility(this.hero, FourCC('Aloc'))
        SetUnitMoveSpeed(this.hero, this.walkSpeed) //voir pour le nom de la fonction
        if (this.controler != this) {
            SetUnitOwner(this.hero, this.controler.getPlayer(), false)
        }

        if (this.isHeroSelectedB) {
            SelectUnit(this.hero, true)
        }
        if (this.baseColorId == 0) {
            SetUnitColor(this.hero, PLAYER_COLOR_RED)
        } else {
            SetUnitColor(this.hero, ConvertPlayerColor(this.baseColorId))
        }
        SetUnitVertexColorBJ(this.hero, this.vcRed, this.vcGreen, this.vcBlue, this.vcTransparency)
        this.effects.showEffects(this.hero)
        if (this.make != null) {
            this.make.maker = this.hero
            TriggerRegisterUnitEvent(this.make.t, this.hero, EVENT_UNIT_ISSUED_POINT_ORDER)
        }
        ///////////////////////
        this.lastTerrainType = lastTerrainType
        SetUnitAnimation(this.hero, 'stand')
        if (meteor) {
            UnitAddItem(this.hero, meteor)
        }
        CommandShortcuts.InitShortcutSkills(GetPlayerId(this.p))
    }

    reverse() {
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

    resetOwner() {
        this.giveHeroControl(this)
    }

    setIsHeroSelectedForPlayer(p: player, heroSelected: boolean) {
        if (GetLocalPlayer() == p) {
            this.isHeroSelectedB = heroSelected
        }
    }

    //effects methods
    newEffect(efStr: string, bodyPart: string) {
        this.effects.new(efStr, this.hero, bodyPart)

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

    hideEffects() {
        this.effects.hideEffects()

        if (!this.isEscaperSecondary()) {
            GetMirrorEscaper(this)?.hideEffects()
        }
    }

    showEffects() {
        this.hero && this.effects.showEffects(this.hero)

        if (!this.isEscaperSecondary()) {
            GetMirrorEscaper(this)?.showEffects()
        }
    }

    //terrainKill methods
    destroyTerrainKillEffect() {
        this.terrainKillEffect && DestroyEffect(this.terrainKillEffect)
    }

    createTerrainKillEffect(killEffectStr: string) {
        this.destroyTerrainKillEffect()
        this.hero &&
            (this.terrainKillEffect = AddSpecialEffectTarget(killEffectStr, this.hero, TERRAIN_KILL_EFFECT_BODY_PART))
    }

    //lastTerrainType methods
    getLastTerrainType() {
        return this.lastTerrainType
    }

    setLastTerrainType(terrainType: TerrainType) {
        this.lastTerrainType = terrainType
    }

    //speed methods
    setSlideSpeed(ss: number) {
        this.slideSpeed = ss
    }

    setWalkSpeed(ws: number) {
        this.walkSpeed = ws
        this.hero && SetUnitMoveSpeed(this.hero, ws)
    }

    getSlideSpeed() {
        return this.slideSpeed
    }

    getRealSlideSpeed() {
        return this.slideSpeed / SLIDE_PERIOD
    }

    getWalkSpeed() {
        return this.walkSpeed
    }

    isAbsoluteSlideSpeed() {
        return this.slideSpeedAbsolute
    }

    absoluteSlideSpeed(slideSpeed: number) {
        this.slideSpeedAbsolute = true
        this.slideSpeed = slideSpeed

        if (!this.isEscaperSecondary()) {
            GetMirrorEscaper(this)?.absoluteSlideSpeed(slideSpeed)
        }
    }

    stopAbsoluteSlideSpeed() {
        const currentTerrainType: TerrainType

        if (this.slideSpeedAbsolute) {
            this.slideSpeedAbsolute = false
            if (this.hero && this.isAlive()) {
                this.currentTerrainType = udg_terrainTypes.getTerrainType(GetUnitX(this.hero), GetUnitY(this.hero))
                if (currentTerrainType?.getKind() == 'slide') {
                    this.setSlideSpeed(TerrainTypeSlide.get(currentTerrainType).getSlideSpeed())
                }
            }

            if (!this.isEscaperSecondary()) {
                GetMirrorEscaper(this)?.stopAbsoluteSlideSpeed()
            }
        }
    }

    isAbsoluteWalkSpeed() {
        return this.walkSpeedAbsolute
    }

    absoluteWalkSpeed(walkSpeed: number) {
        this.walkSpeedAbsolute = true
        this.setWalkSpeed(walkSpeed)

        if (!this.isEscaperSecondary()) {
            GetMirrorEscaper(this)?.absoluteWalkSpeed(walkSpeed)
        }
    }

    stopAbsoluteWalkSpeed() {
        let currentTerrainType: TerrainType
        if (this.walkSpeedAbsolute) {
            this.walkSpeedAbsolute = false
            if (this.hero && this.isAlive()) {
                currentTerrainType = udg_terrainTypes.getTerrainType(GetUnitX(this.hero), GetUnitY(this.hero))
                if (currentTerrainType.getKind() == 'walk') {
                    this.setWalkSpeed(TerrainTypeWalk.get(currentTerrainType).getWalkSpeed())
                }
            }

            if (!this.isEscaperSecondary()) {
                GetMirrorEscaper(this)?.stopAbsoluteWalkSpeed()
            }
        }
    }

    isAbsoluteInstantTurn() {
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

    isGodModeOn() {
        return this.godMode
    }

    doesGodModeKills() {
        return this.godModeKills
    }

    //color methods
    setBaseColor(baseColorId: number) {
        if (baseColorId < 0 || baseColorId >= NB_PLAYERS_MAX_REFORGED) {
            return false
        }
        this.baseColorId = baseColorId
        if (this.hero != null) {
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
        if (this.hero != null) {
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

    getBaseColor() {
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

    getVcRed() {
        return this.vcRed
    }

    getVcGreen() {
        return this.vcGreen
    }

    getVcBlue() {
        return this.vcBlue
    }

    getVcTransparency() {
        return this.vcTransparency
    }

    refreshVertexColor() {
        SetUnitVertexColorBJ(this.hero, this.vcRed, this.vcGreen, this.vcBlue, this.vcTransparency)

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

    canCheat() {
        return this.canCheatB
    }

    isMaximaxou() {
        return this.isMaximaxouB
    }

    isTrueMaximaxou() {
        return this.isTrueMaximaxouB
    }

    //autres
    getPlayer() {
        return this.p
    }

    getControler() {
        return this.controler
    }

    setCameraField(cameraField: number) {
        this.cameraField = cameraField
        SetCameraFieldForPlayer(this.p, CAMERA_FIELD_TARGET_DISTANCE, I2R(cameraField), 0)
    }

    getCameraField() {
        return this.cameraField
    }

    resetCamera() {
        ResetToGameCameraForPlayer(this.p, 0)
        SetCameraFieldForPlayer(this.p, CAMERA_FIELD_TARGET_DISTANCE, this.cameraField, 0)
    }

    kick(kicked: Escaper) {
        CustomDefeatBJ(kicked.getPlayer(), 'You have been kicked by ' + GetPlayerName(this.p) + ' !')
        Text.A(
            udg_colorCode[GetPlayerId(kicked.getPlayer())] +
                GetPlayerName(kicked.getPlayer()) +
                ' has been kicked by ' +
                udg_colorCode[GetPlayerId(this.p)] +
                GetPlayerName(this.p) +
                ' !'
        )
        kicked.destroy()
        GetMirrorEscaper(kicked)?.destroy()
    }

    //autorevive methods
    hasAutorevive() {
        return this.hasAutoreviveB
    }

    setHasAutorevive(hasAutorevive: boolean) {
        this.hasAutoreviveB = hasAutorevive
    }

    //make methods
    getMake() {
        return this.make
    }

    destroyMakeIfForSpecificLevel() {
        let doDestroy: boolean

        if (this.make != null) {
            doDestroy = this.make.getType() == MakeMonsterNoMove.typeid
            doDestroy = doDestroy || this.make.getType() == MakeMonsterSimplePatrol.typeid
            doDestroy = doDestroy || this.make.getType() == MakeMonsterMultiplePatrols.typeid
            doDestroy = doDestroy || this.make.getType() == MakeMonsterTeleport.typeid
            doDestroy = doDestroy || this.make.getType() == MakeDeleteMonsters.typeid
            doDestroy = doDestroy || this.make.getType() == MakeMeteor.typeid
            doDestroy = doDestroy || this.make.getType() == MakeCaster.typeid
            doDestroy = doDestroy || this.make.getType() == MakeDeleteMeteors.typeid
            doDestroy = doDestroy || this.make.getType() == MakeStart.typeid
            doDestroy = doDestroy || this.make.getType() == MakeEnd.typeid
            doDestroy = doDestroy || this.make.getType() == MakeVisibilityModifier.typeid

            if (doDestroy) {
                this.destroyMake()
            }
        }
    }

    setMakingLevel(level: Level) {
        let oldMakingLevel: Level
        if (this.makingLevel == level) {
            return false
        }
        oldMakingLevel = this.makingLevel
        this.makingLevel = level
        this.destroyMakeIfForSpecificLevel()
        if (!LevelFunctions.IsLevelBeingMade(oldMakingLevel)) {
            oldMakingLevel.activate(false)
            if (udg_levels.getCurrentLevel().getId() < oldMakingLevel.getId()) {
                oldMakingLevel.activateVisibilities(false)
            }
        }
        Level.earningLivesActivated = false
        level.activate(true)
        Level.earningLivesActivated = true
        return true
    }

    getMakingLevel(): Level {
        if (this.makingLevel) {
            return this.makingLevel
        } else {
            return udg_levels.getCurrentLevel()
        }
    }

    isMakingCurrentLevel() {
        return !!this.makingLevel
    }

    destroyMake() {
        if (!this.make) {
            return false
        }
        this.make.destroy()
        delete this.make

        if (!this.isEscaperSecondary()) {
            GetMirrorEscaper(this)?.destroyMake()
        }

        return true
    }

    onInitMake() {
        if (!this.isEscaperSecondary()) {
            GetMirrorEscaper(this)?.makeDoNothing()
        }
    }

    makeDoNothing() {
        this.destroyMake()
        this.make = new MakeDoNothing(this.hero)
    }

    makeCreateNoMoveMonsters(mt: MonsterType, facingAngle: number) {
        this.onInitMake()
        //mode : noMove
        this.destroyMake()
        this.make = new MakeMonsterNoMove(this.hero, mt, facingAngle)
    }

    makeCreateSimplePatrolMonsters(mode: string, mt: MonsterType) {
        this.onInitMake()
        this.destroyMake()
        //modes : normal, string, auto
        if (mode == 'normal' || mode == 'string' || mode == 'auto') {
            this.make = new MakeMonsterSimplePatrol(this.hero, mode, mt)
        }
    }

    makeCreateMultiplePatrolsMonsters(mode: string, mt: MonsterType) {
        this.onInitMake()
        this.destroyMake()
        //modes : normal, string
        if (mode == 'normal' || mode == 'string') {
            this.make = new MakeMonsterMultiplePatrols(this.hero, mode, mt)
        }
    }

    makeCreateTeleportMonsters(mode: string, mt: MonsterType, period: number, angle: number) {
        this.onInitMake()
        this.destroyMake()
        //modes : normal, string
        if (mode == 'normal' || mode == 'string') {
            this.make = new MakeMonsterTeleport(this.hero, mode, mt, period, angle)
        }
    }

    makeMmpOrMtNext() {
        this.onInitMake()
        if (
            this.make == null ||
            !(
                this.make.getType() == MakeMonsterMultiplePatrols.typeid ||
                this.make.getType() == MakeMonsterTeleport.typeid
            )
        ) {
            return false
        }
        if (this.make.getType() == MakeMonsterMultiplePatrols.typeid) {
            MakeMonsterMultiplePatrols.get(this.make).nextMonster()
        } else {
            MakeMonsterTeleport.get(this.make).nextMonster()
        }
        return true
    }

    makeMonsterTeleportWait() {
        this.onInitMake()
        if (this.make == null || this.make.getType() != MakeMonsterTeleport.typeid) {
            return false
        }
        return MakeMonsterTeleport.get(this.make).addWaitPeriod()
    }

    makeMonsterTeleportHide() {
        this.onInitMake()
        if (this.make == null || this.make.getType() != MakeMonsterTeleport.typeid) {
            return false
        }
        return MakeMonsterTeleport.get(this.make).addHidePeriod()
    }

    makeCreateMonsterSpawn(label: string, mt: MonsterType, sens: string, frequence: number) {
        this.onInitMake()
        this.destroyMake()
        this.make = new MakeMonsterSpawn(this.hero, label, mt, sens, frequence)
    }

    makeDeleteMonsters(mode: string) {
        this.onInitMake()
        this.destroyMake()

        //delete modes : all, noMove, move, simplePatrol, multiplePatrols, oneByOne
        if (
            mode != 'all' &&
            mode != 'noMove' &&
            mode != 'move' &&
            mode != 'simplePatrol' &&
            mode != 'multiplePatrols' &&
            mode != 'oneByOne'
        ) {
            return
        }

        this.make = new MakeDeleteMonsters(this.hero, mode)
    }

    makeSetUnitTeleportPeriod(mode: string, period: number) {
        this.onInitMake()
        this.destroyMake()

        //modes : oneByOne, twoClics
        if (mode != 'twoClics' && mode != 'oneByOne') {
            return
        }

        this.make = new MakeSetUnitTeleportPeriod(this.hero, mode, period)
    }

    makeGetUnitTeleportPeriod() {
        this.onInitMake()
        this.destroyMake()
        this.make = new MakeGetUnitTeleportPeriod(this.hero)
    }

    makeSetUnitMonsterType(mode: string, mt: MonsterType) {
        this.onInitMake()
        this.destroyMake()

        //modes : oneByOne, twoClics
        if (mode != 'twoClics' && mode != 'oneByOne') {
            return
        }

        this.make = new MakeSetUnitMonsterType(this.hero, mode, mt)
    }

    makeCreateMeteor() {
        this.onInitMake()
        this.destroyMake()
        this.make = new MakeMeteor(this.hero)
    }

    makeDeleteMeteors(mode: string) {
        this.onInitMake()
        this.destroyMake()

        //delete modes : oneByOne, twoClics
        if (mode != 'oneByOne' && mode != 'twoClics') {
            return
        }

        this.make = new MakeDeleteMeteors(this.hero, mode)
    }

    makeCreateCaster(casterType: ICasterType, angle: number) {
        this.onInitMake()
        this.destroyMake()
        this.make = new MakeCaster(this.hero, casterType, angle)
    }

    makeDeleteCasters(mode: string) {
        this.onInitMake()
        this.destroyMake()

        //delete modes : oneByOne, twoClics
        if (mode != 'oneByOne' && mode != 'twoClics') {
            return
        }

        this.make = new MakeDeleteCasters(this.hero, mode)
    }

    makeCreateClearMobs(disableDuration: number) {
        this.onInitMake()
        this.destroyMake()
        this.make = new MakeClearMob(this.hero, disableDuration)
    }

    makeDeleteClearMobs() {
        this.onInitMake()
        this.destroyMake()
        this.make = new MakeDeleteClearMob(this.hero)
    }

    makeCreateTerrain(terrainType: TerrainType) {
        this.onInitMake()
        this.destroyMake()
        this.make = new MakeTerrainCreate(this.hero, terrainType)
    }

    makeTerrainCopyPaste() {
        this.onInitMake()
        this.destroyMake()
        this.make = new MakeTerrainCopyPaste(this.hero)
    }

    makeTerrainVerticalSymmetry() {
        this.onInitMake()
        this.destroyMake()
        this.make = new MakeTerrainVerticalSymmetry(this.hero)
    }

    makeTerrainHorizontalSymmetry() {
        this.onInitMake()
        this.destroyMake()
        this.make = new MakeTerrainHorizontalSymmetry(this.hero)
    }

    makeTerrainHeight(radius: number, height: number) {
        this.onInitMake()
        this.destroyMake()
        this.make = new MakeTerrainHeight(this.hero, radius, height)
    }

    makeGetTerrainType() {
        this.onInitMake()
        this.destroyMake()
        this.make = new MakeGetTerrainType(this.hero)
    }

    makeExchangeTerrains() {
        this.onInitMake()
        this.destroyMake()
        this.make = new MakeExchangeTerrains(this.hero)
    }

    makeCreateStart(forNext: boolean) {
        this.onInitMake()
        this.destroyMake()
        this.make = new MakeStart(this.hero, forNext)
    }

    makeCreateEnd() {
        this.onInitMake()
        this.destroyMake()
        this.make = new MakeEnd(this.hero)
    }

    makeCreateVisibilityModifier() {
        this.onInitMake()
        this.destroyMake()
        this.make = new MakeVisibilityModifier(this.hero)
    }

    cancelLastAction() {
        if (this.make != 0) {
            if (this.make.cancelLastAction()) {
                return true
            }
        }
        return this.makeLastActions.cancelLastAction()
    }

    redoLastAction() {
        if (this.makeLastActions.redoLastAction()) {
            return true
        }
        if (this.make != null) {
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

    destroyAllSavedActions() {
        this.makeLastActions.destroyAllActions()
    }

    destroyCancelledActions() {
        this.makeLastActions.destroyCancelledActions()
    }

    //for gravity gestion
    getLastZ() {
        return this.lastZ
    }

    setLastZ(lastZ: number) {
        this.lastZ = lastZ
    }

    getOldDiffZ() {
        return this.oldDiffZ
    }

    setOldDiffZ(oldDiffZ: number) {
        this.oldDiffZ = oldDiffZ
    }

    getSpeedZ() {
        return this.speedZ
    }

    setSpeedZ(speedX: number) {
        this.speedZ = speedZ
    }

    //coop reviving
    coopReviveHero() {
        const mirrorEscaper = GetMirrorEscaper(this)
        const mirrorHero = mirrorEscaper?.getHero()

        if (this.hero) {
            this.revive(GetUnitX(this.hero), GetUnitY(this.hero))
            RunSoundOnUnit(udg_coop_index_son, this.hero)
            SetUnitAnimation(this.hero, 'channel')
            this.absoluteSlideSpeed(0)
            this.setCoopInvul(true)
        }

        if (mirrorHero && mirrorEscaper) {
            mirrorEscaper.revive(GetUnitX(mirrorHero), GetUnitY(mirrorHero))
            RunSoundOnUnit(udg_coop_index_son, mirrorHero)
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

    isCoopInvul() {
        return this.coopInvul
    }

    setCoopInvul(invul: boolean) {
        this.coopInvul = invul
    }

    enableTrigCoopRevive() {
        if (this.hero) {
            ShowUnit(this.powerCircle, true)
            SetUnitPathing(this.powerCircle, false)
            SetUnitPosition(this.powerCircle, GetUnitX(this.hero), GetUnitY(this.hero))
            ShowUnit(this.dummyPowerCircle, true)
            SetUnitPathing(this.dummyPowerCircle, false)
            SetUnitPosition(this.dummyPowerCircle, GetUnitX(this.hero), GetUnitY(this.hero))
        }
    }

    refreshCerclePosition() {
        if (!IsUnitHidden(this.powerCircle) && this.hero) {
            SetUnitPosition(this.powerCircle, GetUnitX(this.hero), GetUnitY(this.hero))
            SetUnitPosition(this.dummyPowerCircle, GetUnitX(this.hero), GetUnitY(this.hero))
        }
    }

    isEscaperSecondary() {
        return this.escaperId >= NB_PLAYERS_MAX
    }
}
