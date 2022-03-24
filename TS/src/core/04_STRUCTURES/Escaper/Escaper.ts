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
import { EscaperEffectArray } from './EscaperEffectArray'

export type IEscaper = ReturnType<typeof Escaper>

export const Escaper = (escaperId: number) => {
    const SHOW_REVIVE_EFFECTS = false
    const heroToSelect: unit

    let playerId = escaperId >= NB_PLAYERS_MAX ? escaperId - 12 : escaperId

    let p = Player(playerId)
    let hero: unit
    let invisUnit: unit
    let walkSpeed = HERO_WALK_SPEED
    let slideSpeed = HERO_SLIDE_SPEED
    let baseColorId = playerId
    let cameraField = DEFAULT_CAMERA_FIELD
    SetCameraFieldForPlayer(p, CAMERA_FIELD_TARGET_DISTANCE, I2R(cameraField), 0)

    let lastTerrainType: TerrainType = 0
    let controler: IEscaper

    let slide = CreateSlideTrigger(escaperId)
    let checkTerrain = CreateCheckTerrainTrigger(escaperId)

    let vcRed = 100
    let vcGreen = 100
    let vcBlue = 100
    let vcTransparency = escaperId >= NB_PLAYERS_MAX ? 50 : 0
    let discoTrigger: trigger | null = null
    let effects = EscaperEffectArray()
    let terrainKillEffect: effect
    let meteorEffect: effect

    let godMode = false
    let godModeKills = false
    let walkSpeedAbsolute = false
    let slideSpeedAbsolute = false
    let hasAutoreviveB = false

    let canCheatB = false
    let isMaximaxouB = false
    let isTrueMaximaxouB = false

    let make: Make = 0
    let makeLastActions: MakeLastActions = MakeLastActions() // TODO; used to be; MakeLastActions.create(e)
    let makingLevel: Level = 0

    let currentLevelTouchTerrainDeath: Level //pour le terrain qui tue, vérifie s'il faut bien tuer l'escaper
    let itemInInventory: item //créer le déclo pour save ça

    let lastZ: number
    let oldDiffZ: number
    let speedZ: number

    let slideLastAngleOrder = -1
    let isHeroSelectedB: boolean

    let instantTurnAbsolute = false

    let animSpeedSecondaryHero = 0.8

    //coop
    let powerCircle = CreateUnit(p, POWER_CIRCLE, 0, 0, 0)
    SetUnitUserData(powerCircle, escaperId)
    ShowUnit(powerCircle, false)

    let dummyPowerCircle = CreateUnit(ENNEMY_PLAYER, DUMMY_POWER_CIRCLE, 0, 0, 0)
    SetUnitUserData(dummyPowerCircle, escaperId)
    ShowUnit(dummyPowerCircle, false)

    let coopInvul: boolean

    // let controler:Escaper ; TODO; REMOVE THIS; CONTROLLER IS JUST A SELF REFERENCE SO this. (in theory or just w/e function directly)

    const getEscaperId = () => {
        return escaperId
    }

    //item method
    const resetItem = (): boolean => {
        //renvoie true si le héros portait un item
        if (UnitHasItemOfTypeBJ(hero, METEOR_NORMAL)) {
            SetItemDroppable(UnitItemInSlot(hero, 0), true)
            Meteor(GetItemUserData(UnitItemInSlot(hero, 0))).replace()
            DestroyEffect(meteorEffect)
            meteorEffect = null
            return true
        }
        return false
    }

    const addEffectMeteor = () => {
        if (meteorEffect == null) {
            meteorEffect = AddSpecialEffectTarget(
                'Abilities\\Weapons\\DemonHunterMissile\\DemonHunterMissile.mdl',
                hero,
                'hand right'
            )
        }
    }

    const removeEffectMeteor = () => {
        if (meteorEffect != null) {
            DestroyEffect(meteorEffect)
            meteorEffect = null
        }
    }

    //select method
    const selectHero = () => {
        SelectUnitAddForPlayer(hero, controler.getPlayer())
        setIsHeroSelectedForPlayer(controler.getPlayer(), true)
    }

    //creation method
    const createHero = (x: number, y: number, angle: number): boolean => {
        //retourne false si le héros existe déja
        let heroTypeId = HERO_TYPE_ID

        if (hero != null) {
            return false
        }

        if (escaperId >= NB_PLAYERS_MAX) {
            heroTypeId = HERO_SECONDARY_TYPE_ID
        }

        hero = CreateUnit(p, heroTypeId, x, y, angle)

        if (escaperId >= NB_PLAYERS_MAX) {
            SetUnitTimeScale(hero, animSpeedSecondaryHero)
        }

        SetUnitFlyHeight(hero, 1, 0)
        SetUnitFlyHeight(hero, 0, 0)
        SetUnitUserData(hero, escaperId)
        ShowUnit(hero, false)
        ShowUnit(hero, true)
        UnitRemoveAbility(hero, FourCC('Aloc'))
        SetUnitMoveSpeed(hero, walkSpeed) //voir pour le nom de la fonction
        selectHero()

        if (baseColorId == 0) {
            SetUnitColor(hero, PLAYER_COLOR_RED)
        } else {
            SetUnitColor(hero, ConvertPlayerColor(baseColorId))
        }

        SetUnitVertexColorBJ(hero, vcRed, vcGreen, vcBlue, vcTransparency)
        SpecialIllidan(hero)
        invisUnit = CreateUnit(NEUTRAL_PLAYER, INVIS_UNIT_TYPE_ID, x, y, angle)
        SetUnitUserData(invisUnit, GetPlayerId(p))
        TriggerRegisterUnitEvent(gg_trg_InvisUnit_is_getting_damage, invisUnit, EVENT_UNIT_DAMAGED)
        effects.showEffects(hero)
        lastTerrainType = 0
        TimerStart(afkModeTimers[escaperId], timeMinAfk, false, GetAfkModeTimeExpiresCodeFromId(escaperId))
        InitShortcutSkills(GetPlayerId(p))
        EnableTrigger(checkTerrain)
        return true
    }

    const createHeroAtStart = (): boolean => {
        let x: number
        let y: number
        let start: Start = udg_levels.getCurrentLevel().getStart()
        let angle: real

        if (start == 0) {
            //si le départ du niveau en cours n'existe pas
            start = DEPART_PAR_DEFAUT
            angle = HERO_START_ANGLE
        } else {
            angle = GetRandomDirectionDeg()
        }

        x = start.getRandomX()
        y = start.getRandomY()
        return createHero(x, y, angle)
    }

    const removeHero = () => {
        if (hero == null) {
            return
        }

        resetItem()

        if (IsUnitAliveBJ(hero)) {
            KillUnit(hero)
        }

        RemoveUnit(hero)
        hero = null
        RemoveUnit(invisUnit)
        invisUnit = null
        lastTerrainType = 0
        make.destroy()
        make = 0
        effects.hideEffects()
        DisableTrigger(checkTerrain)
        DisableTrigger(slide)

        //coop
        ShowUnit(powerCircle, false)
        ShowUnit(dummyPowerCircle, false)

        if (!isEscaperSecondary()) {
            GetMirrorEscaper(this).removeHero()
        }
    }

    const destroy = () => {
        removeHero()
        DestroyEffect(terrainKillEffect)
        terrainKillEffect = null
        effects.destroy()
        DestroyTrigger(slide)
        slide = null
        DestroyTrigger(checkTerrain)
        checkTerrain = null
        DestroyTrigger(discoTrigger)
        discoTrigger = null
        udg_escapers.nullify(GetPlayerId(p))
        //coop
        RemoveUnit(powerCircle)
        powerCircle = null
        RemoveUnit(dummyPowerCircle)
        dummyPowerCircle = null
    }

    //getId method
    const getId = (): number => {
        return escaperId
    }

    //trigger methods
    const enableSlide = (doEnable: boolean): boolean => {
        let heroPos: location

        if (IsTriggerEnabled(slide) == doEnable) {
            return false
        }

        if (doEnable) {
            EnableTrigger(slide)
            StopUnit(hero)
            heroPos = GetUnitLoc(hero)
            setLastZ(GetLocationZ(heroPos) + GetUnitFlyHeight(hero))
            RemoveLocation(heroPos)
            heroPos = null
        } else {
            DisableTrigger(slide)
            slideLastAngleOrder = -1
        }

        return true
    }

    const setSlideLastAngleOrder = (angle: number) => {
        slideLastAngleOrder = angle
    }

    const getSlideLastAngleOrder = (): number => {
        return slideLastAngleOrder
    }

    const enableCheckTerrain = (doEnable: boolean): boolean => {
        if (IsTriggerEnabled(checkTerrain) == doEnable) {
            return false
        }
        if (doEnable) {
            EnableTrigger(checkTerrain)
        } else {
            DisableTrigger(checkTerrain)
        }
        return true
    }

    const isSliding = (): boolean => {
        return IsTriggerEnabled(slide)
    }

    const doesCheckTerrain = (): boolean => {
        return IsTriggerEnabled(checkTerrain)
    }

    //move methods
    const moveHero = (x: real, y: real) => {
        SetUnitX(hero, x)
        SetUnitY(hero, y)
    }

    const moveInvisUnit = (x: real, y: real) => {
        SetUnitX(invisUnit, x)
        SetUnitY(invisUnit, y)
    }

    //hero methods
    const getHero = (): unit => {
        return hero
    }

    const isAlive = (): boolean => {
        return IsUnitAliveBJ(hero)
    }

    const isPaused = (): boolean => {
        return IsUnitPaused(hero)
    }

    const kill = (): boolean => {
        if (isAlive()) {
            resetItem()
            KillUnit(hero).lastTerrainType = 0
            ShowUnit(invisUnit, false)
            enableCheckTerrain(false)
            StopAfk(escaperId)
            DisplayDeathMessagePlayer(p)
            isHeroSelectedB = false
            return true
        }
        return false
    }

    const pause = (doPause: boolean) => {
        if (isPaused() == doPause) {
            return false
        }
        PauseUnit(hero, doPause)
        return true
    }

    const specialIllidan = () => {
        SetUnitAnimation(hero, 'Morph Alternate')
    }

    const revive = (x: real, y: real): boolean => {
        if (isAlive()) {
            return false
        }
        ReviveHero(hero, x, y, SHOW_REVIVE_EFFECTS)
        SetUnitX(invisUnit, x)
        SetUnitY(invisUnit, y)
        ShowUnit(invisUnit, true).enableCheckTerrain(true).specialIllidan().selectHero()
        if (vcTransparency != 0) {
            SetUnitVertexColorBJ(hero, vcRed, vcGreen, vcBlue, vcTransparency)
        }
        TimerStart(afkModeTimers[escaperId], timeMinAfk, false, GetAfkModeTimeExpiresCodeFromId(escaperId))
        lastZ = 0
        oldDiffZ = 0
        speedZ = 0
        //coop
        ShowUnit(powerCircle, false)
        ShowUnit(dummyPowerCircle, false)
        return true
    }

    const reviveAtStart = (): boolean => {
        let x: real = udg_levels.getCurrentLevel().getStartRandomX()
        let y: real = udg_levels.getCurrentLevel().getStartRandomY()

        if (!isEscaperSecondary()) {
            GetMirrorEscaper(this).reviveAtStart()
        }

        return revive(x, y)
    }

    const turnInstantly = (angle: real) => {
        let heroTypeId = HERO_TYPE_ID
        let lastTerrainType: TerrainType = lastTerrainType
        let x = GetUnitX(hero)
        let y = GetUnitY(hero)
        let meteor = UnitItemInSlot(hero, 0)

        RemoveUnit(hero)

        //recreate hero
        if (escaperId >= NB_PLAYERS_MAX) {
            heroTypeId = HERO_SECONDARY_TYPE_ID
        }

        hero = CreateUnit(p, heroTypeId, x, y, angle)

        if (escaperId >= NB_PLAYERS_MAX) {
            SetUnitTimeScale(hero, animSpeedSecondaryHero)
        }

        SetUnitFlyHeight(hero, 1, 0)
        SetUnitFlyHeight(hero, 0, 0)
        SetUnitUserData(hero, GetPlayerId(p))
        ShowUnit(hero, false)
        ShowUnit(hero, true)
        UnitRemoveAbility(hero, 'Aloc')
        SetUnitMoveSpeed(hero, walkSpeed) //voir pour le nom de la fonction
        if (controler != this) {
            SetUnitOwner(hero, controler.getPlayer(), false)
        }

        if (isHeroSelectedB) {
            SelectUnit(hero, true)
        }
        if (baseColorId == 0) {
            SetUnitColor(hero, PLAYER_COLOR_RED)
        } else {
            SetUnitColor(hero, ConvertPlayerColor(baseColorId))
        }
        SetUnitVertexColorBJ(hero, vcRed, vcGreen, vcBlue, vcTransparency)
        effects.showEffects(hero)
        if (make != 0) {
            make.maker = hero
            TriggerRegisterUnitEvent(make.t, hero, EVENT_UNIT_ISSUED_POINT_ORDER)
        }
        ///////////////////////
        lastTerrainType = lastTerrainType
        SetUnitAnimation(getHero(), 'stand')
        if (meteor != null) {
            UnitAddItem(hero, meteor)
        }
        InitShortcutSkills(GetPlayerId(p))
        meteor = null
    }

    const reverse = () => {
        let angle: number = GetUnitFacing(hero) + (180).turnInstantly(angle)
        if (slideLastAngleOrder != -1) {
            slideLastAngleOrder = slideLastAngleOrder + 180
            SetUnitFacing(hero, slideLastAngleOrder)
        }
    }

    // TODO; Should be IEscaper but gives circular error
    const giveHeroControl = (escaper: any) => {
        SetUnitOwner(hero, escaper.getPlayer(), false)
        controler = escaper
    }

    const resetOwner = () => {
        SetUnitOwner(hero, getPlayer(), false)
        controler = this
    }

    const setIsHeroSelectedForPlayer = (p: player, heroSelected: boolean) => {
        if (GetLocalPlayer() == p) {
            isHeroSelectedB = heroSelected
        }
    }

    //effects methods
    const newEffect = (efStr: string, bodyPart: string) => {
        effects.new(efStr, hero, bodyPart)

        if (!isEscaperSecondary()) {
            GetMirrorEscaper(this).newEffect(efStr, bodyPart)
        }
    }

    const destroyLastEffects = (numEfToDestroy: number) => {
        effects.destroyLastEffects(numEfToDestroy)

        if (!isEscaperSecondary()) {
            GetMirrorEscaper(this).destroyLastEffects(numEfToDestroy)
        }
    }

    const hideEffects = () => {
        effects.hideEffects()

        if (!isEscaperSecondary()) {
            GetMirrorEscaper(this).hideEffects()
        }
    }

    const showEffects = () => {
        effects.showEffects(hero)

        if (!isEscaperSecondary()) {
            GetMirrorEscaper(this).showEffects()
        }
    }

    //terrainKill methods
    const destroyTerrainKillEffect = () => {
        DestroyEffect(terrainKillEffect).terrainKillEffect = null
    }

    const createTerrainKillEffect = (killEffectStr: string) => {
        if (terrainKillEffect != null) {
            destroyTerrainKillEffect()
        }
        terrainKillEffect = AddSpecialEffectTarget(killEffectStr, hero, TERRAIN_KILL_EFFECT_BODY_PART)
    }

    //lastTerrainType methods
    const getLastTerrainType = (): TerrainType => {
        return lastTerrainType
    }

    const setLastTerrainType = (terrainType: TerrainType) => {
        lastTerrainType = terrainType
    }

    //speed methods
    const setSlideSpeed = (ss: number) => {
        slideSpeed = ss
    }

    const setWalkSpeed = (ws: number) => {
        walkSpeed = ws
        SetUnitMoveSpeed(hero, ws)
    }

    const getSlideSpeed = (): number => {
        return slideSpeed
    }

    const getRealSlideSpeed = (): number => {
        return slideSpeed / SLIDE_PERIOD
    }

    const getWalkSpeed = (): number => {
        return walkSpeed
    }

    const isAbsoluteSlideSpeed = (): boolean => {
        return slideSpeedAbsolute
    }

    const absoluteSlideSpeed = (slideSpeed: number) => {
        slideSpeedAbsolute = true
        slideSpeed = slideSpeed // TODO; Refactor to ss otherwise its a self ref

        if (!isEscaperSecondary()) {
            GetMirrorEscaper(this).absoluteSlideSpeed(slideSpeed)
        }
    }

    const stopAbsoluteSlideSpeed = () => {
        let currentTerrainType: TerrainType

        if (slideSpeedAbsolute) {
            slideSpeedAbsolute = false
            if (isAlive()) {
                currentTerrainType = udg_terrainTypes.getTerrainType(GetUnitX(hero), GetUnitY(hero))
                if (currentTerrainType.getKind() == 'slide') {
                    setSlideSpeed(TerrainTypeSlide(integer(currentTerrainType)).getSlideSpeed())
                }
            }

            if (!isEscaperSecondary()) {
                GetMirrorEscaper(this).stopAbsoluteSlideSpeed()
            }
        }
    }

    const isAbsoluteWalkSpeed = (): boolean => {
        return walkSpeedAbsolute
    }

    const absoluteWalkSpeed = (walkSpeed: number) => {
        walkSpeedAbsolute = true
        setWalkSpeed(walkSpeed)

        if (!isEscaperSecondary()) {
            GetMirrorEscaper(this).absoluteWalkSpeed(walkSpeed)
        }
    }

    const stopAbsoluteWalkSpeed = () => {
        let currentTerrainType: TerrainType
        if (walkSpeedAbsolute) {
            walkSpeedAbsolute = false
            if (isAlive()) {
                currentTerrainType = udg_terrainTypes.getTerrainType(GetUnitX(hero), GetUnitY(hero))
                if (currentTerrainType.getKind() == 'walk') {
                    setWalkSpeed(TerrainTypeWalk(integer(currentTerrainType)).getWalkSpeed())
                }
            }

            if (!isEscaperSecondary()) {
                GetMirrorEscaper(this).stopAbsoluteWalkSpeed()
            }
        }
    }

    const isAbsoluteInstantTurn = (): boolean => {
        return instantTurnAbsolute
    }

    const setAbsoluteInstantTurn = (flag: boolean) => {
        instantTurnAbsolute = flag

        if (!isEscaperSecondary()) {
            GetMirrorEscaper(this).setAbsoluteInstantTurn(flag)
        }
    }

    //godMode methods
    const setGodMode = (godMode: boolean) => {
        godMode = godMode // TODO; SELF REF

        if (!isEscaperSecondary()) {
            GetMirrorEscaper(this).setGodMode(godMode)
        }
    }

    const setGodModeKills = (godModeKills: boolean) => {
        godModeKills = godModeKills // TODO; SELF REF

        if (!isEscaperSecondary()) {
            GetMirrorEscaper(this).setGodModeKills(godModeKills)
        }
    }

    const isGodModeOn = (): boolean => {
        return godMode
    }

    const doesGodModeKills = (): boolean => {
        return godModeKills
    }

    //color methods
    const setBaseColor = (baseColorId: number): boolean => {
        if (baseColorId < 0 || baseColorId >= NB_PLAYERS_MAX_REFORGED) {
            return false
        }
        baseColorId = baseColorId // TODO; SELF REF
        if (hero != null) {
            if (baseColorId == 0) {
                SetUnitColor(hero, PLAYER_COLOR_RED)
            } else {
                SetUnitColor(hero, ConvertPlayerColor(baseColorId))
            }
        }

        if (!isEscaperSecondary()) {
            ColorInfo(this, p)
            GetMirrorEscaper(this).setBaseColor(baseColorId)
        }
        return true
    }

    const setBaseColorDisco = (baseColorId: number): boolean => {
        if (baseColorId < 0 || baseColorId >= NB_PLAYERS_MAX_REFORGED) {
            return false
        }
        baseColorId = baseColorId // TODO; SELF REF
        if (hero != null) {
            if (baseColorId == 0) {
                SetUnitColor(hero, PLAYER_COLOR_RED)
            } else {
                SetUnitColor(hero, ConvertPlayerColor(baseColorId))
            }
        }

        if (!isEscaperSecondary()) {
            GetMirrorEscaper(this).setBaseColorDisco(baseColorId)
        }

        return true
    }

    const getBaseColor = (): number => {
        return baseColorId
    }

    const setVcRed = (vcRed: number): boolean => {
        if (vcRed < 0 || vcRed > 100) {
            return false
        }
        vcRed = vcRed // TODO; SELF REF

        if (!isEscaperSecondary()) {
            GetMirrorEscaper(this).setVcRed(vcRed)
        }

        return true
    }

    const setVcGreen = (vcGreen: number): boolean => {
        if (vcGreen < 0 || vcGreen > 100) {
            return false
        }
        vcGreen = vcGreen // TODO; SELF REF

        if (!isEscaperSecondary()) {
            GetMirrorEscaper(this).setVcGreen(vcGreen)
        }

        return true
    }

    const setVcBlue = (vcBlue: number): boolean => {
        if (vcBlue < 0 || vcBlue > 100) {
            return false
        }

        if (!isEscaperSecondary()) {
            GetMirrorEscaper(this).setVcBlue(vcBlue)
        }

        vcBlue = vcBlue // TODO; SELF REF
        return true
    }

    const setVcTransparency = (vcTransparency: number): boolean => {
        if (vcTransparency < 0 || vcTransparency > 100) {
            return false
        }

        if (isEscaperSecondary()) {
            return true //secondary escapers transparency is fixed
        }

        vcTransparency = vcTransparency // TODO; self ref

        return true
    }

    const getVcRed = (): number => {
        return vcRed
    }

    const getVcGreen = (): number => {
        return vcGreen
    }

    const getVcBlue = (): number => {
        return vcBlue
    }

    const getVcTransparency = (): number => {
        return vcTransparency
    }

    const refreshVertexColor = () => {
        SetUnitVertexColorBJ(hero, vcRed, vcGreen, vcBlue, vcTransparency)

        if (!isEscaperSecondary()) {
            ColorInfo(this, p)
            GetMirrorEscaper(this).refreshVertexColor()
        }
    }

    //cheat methods
    const setCanCheat = (canCheat: boolean) => {
        if (!canCheat) {
            isMaximaxouB = false
            isTrueMaximaxouB = false
        }
        canCheatB = canCheat // TODO; self ref
    }

    const setIsMaximaxou = (isMaximaxou: boolean) => {
        if (isMaximaxou) {
            setCanCheat(true)
        } else {
            isTrueMaximaxouB = false
        }
        isMaximaxouB = isMaximaxou // TODO; self ref
    }

    const setIsTrueMaximaxou = (isTrueMaximaxou: boolean) => {
        if (isTrueMaximaxou) {
            setIsMaximaxou(true)
        }
        isTrueMaximaxouB = isTrueMaximaxou
    }

    const canCheat = (): boolean => {
        return canCheatB
    }

    const isMaximaxou = (): boolean => {
        return isMaximaxouB
    }

    const isTrueMaximaxou = (): boolean => {
        return isTrueMaximaxouB
    }

    //autres
    const getPlayer = (): player => {
        return p
    }

    // TODO; IEscaper is circular dep
    const getControler = (): any => {
        return controler
    }

    const setCameraField = (cameraField: number) => {
        cameraField = cameraField //TODO; self ref
        SetCameraFieldForPlayer(p, CAMERA_FIELD_TARGET_DISTANCE, I2R(cameraField), 0)
    }

    const getCameraField = (): number => {
        return cameraField
    }

    const resetCamera = () => {
        ResetToGameCameraForPlayer(p, 0)
        SetCameraFieldForPlayer(p, CAMERA_FIELD_TARGET_DISTANCE, cameraField, 0)
    }

    // TODO; Should be IEscaper but gives circular error
    const kick = (kicked: any) => {
        //TODO; COULD BE CIRCULAR REF
        CustomDefeatBJ(kicked.getPlayer(), 'You have been kicked by ' + GetPlayerName(p) + ' !')
        Text_A(
            udg_colorCode[GetPlayerId(kicked.getPlayer())] +
                GetPlayerName(kicked.getPlayer()) +
                ' has been kicked by ' +
                udg_colorCode[GetPlayerId(p)] +
                GetPlayerName(p) +
                ' !'
        )
        kicked.destroy()
        GetMirrorEscaper(kicked).destroy()
    }

    //autorevive methods
    const hasAutorevive = (): boolean => {
        return hasAutoreviveB
    }

    const setHasAutorevive = (hasAutorevive: boolean) => {
        hasAutoreviveB = hasAutorevive
    }

    //make methods
    const getMake = (): Make => {
        return make
    }

    const destroyMakeIfForSpecificLevel = () => {
        let doDestroy: boolean

        if (make != 0) {
            doDestroy = make.getType() == MakeMonsterNoMove.typeid
            doDestroy = doDestroy || make.getType() == MakeMonsterSimplePatrol.typeid
            doDestroy = doDestroy || make.getType() == MakeMonsterMultiplePatrols.typeid
            doDestroy = doDestroy || make.getType() == MakeMonsterTeleport.typeid
            doDestroy = doDestroy || make.getType() == MakeDeleteMonsters.typeid
            doDestroy = doDestroy || make.getType() == MakeMeteor.typeid
            doDestroy = doDestroy || make.getType() == MakeCaster.typeid
            doDestroy = doDestroy || make.getType() == MakeDeleteMeteors.typeid
            doDestroy = doDestroy || make.getType() == MakeStart.typeid
            doDestroy = doDestroy || make.getType() == MakeEnd.typeid
            doDestroy = doDestroy || make.getType() == MakeVisibilityModifier.typeid

            if (doDestroy) {
                destroyMake()
            }
        }
    }

    const setMakingLevel = (level: Level): boolean => {
        let oldMakingLevel: Level
        if (makingLevel == level) {
            return false
        }
        oldMakingLevel = makingLevel
        makingLevel = level
        destroyMakeIfForSpecificLevel()
        if (!IsLevelBeingMade(oldMakingLevel)) {
            oldMakingLevel.activate(false)
            if (udg_levels.getCurrentLevel().getId() < oldMakingLevel.getId()) {
                oldMakingLevel.activateVisibilities(false)
            }
        }
        Level_earningLivesActivated = false
        level.activate(true)
        Level_earningLivesActivated = true
        return true
    }

    const getMakingLevel = (): Level => {
        if (makingLevel == 0) {
            return udg_levels.getCurrentLevel()
        }
        return makingLevel
    }

    const isMakingCurrentLevel = (): boolean => {
        return makingLevel == 0
    }

    const destroyMake = (): boolean => {
        if (make == 0) {
            return false
        }
        make.destroy()
        make = 0

        if (!isEscaperSecondary()) {
            GetMirrorEscaper(this).destroyMake()
        }

        return true
    }

    const onInitMake = () => {
        if (!isEscaperSecondary()) {
            GetMirrorEscaper(this).makeDoNothing()
        }
    }

    const makeDoNothing = () => {
        destroyMake()
        make = MakeDoNothing.create(hero)
    }

    const makeCreateNoMoveMonsters = (mt: MonsterType, facingAngle: number) => {
        onInitMake()
        //mode : noMove
        destroyMake()
        make = MakeMonsterNoMove.create(hero, mt, facingAngle)
    }

    const makeCreateSimplePatrolMonsters = (mode: string, mt: MonsterType) => {
        onInitMake()
        destroyMake()
        //modes : normal, string, auto
        if (mode == 'normal' || mode == 'string' || mode == 'auto') {
            make = MakeMonsterSimplePatrol.create(hero, mode, mt)
        }
    }

    const makeCreateMultiplePatrolsMonsters = (mode: string, mt: MonsterType) => {
        onInitMake()
        destroyMake()
        //modes : normal, string
        if (mode == 'normal' || mode == 'string') {
            make = MakeMonsterMultiplePatrols.create(hero, mode, mt)
        }
    }

    const makeCreateTeleportMonsters = (mode: string, mt: MonsterType, period: number, angle: number) => {
        onInitMake()
        destroyMake()
        //modes : normal, string
        if (mode == 'normal' || mode == 'string') {
            make = MakeMonsterTeleport.create(hero, mode, mt, period, angle)
        }
    }

    const makeMmpOrMtNext = (): boolean => {
        onInitMake()
        if (
            make == 0 ||
            !(make.getType() == MakeMonsterMultiplePatrols.typeid || make.getType() == MakeMonsterTeleport.typeid)
        ) {
            return false
        }
        if (make.getType() == MakeMonsterMultiplePatrols.typeid) {
            MakeMonsterMultiplePatrols(integer(make)).nextMonster()
        } else {
            MakeMonsterTeleport(integer(make)).nextMonster()
        }
        return true
    }

    const makeMonsterTeleportWait = (): boolean => {
        onInitMake()
        if (make == 0 || make.getType() != MakeMonsterTeleport.typeid) {
            return false
        }
        return MakeMonsterTeleport(integer(make)).addWaitPeriod()
    }

    const makeMonsterTeleportHide = (): boolean => {
        onInitMake()
        if (make == 0 || make.getType() != MakeMonsterTeleport.typeid) {
            return false
        }
        return MakeMonsterTeleport(integer(make)).addHidePeriod()
    }

    const makeCreateMonsterSpawn = (label: string, mt: MonsterType, sens: string, frequence: number) => {
        onInitMake()
        destroyMake()
        make = MakeMonsterSpawn.create(hero, label, mt, sens, frequence)
    }

    const makeDeleteMonsters = (mode: string) => {
        onInitMake()
        destroyMake()

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

        make = MakeDeleteMonsters.create(hero, mode)
    }

    const makeSetUnitTeleportPeriod = (mode: string, period: number) => {
        onInitMake()
        destroyMake()

        //modes : oneByOne, twoClics
        if (mode != 'twoClics' && mode != 'oneByOne') {
            return
        }

        make = MakeSetUnitTeleportPeriod.create(hero, mode, period)
    }

    const makeGetUnitTeleportPeriod = () => {
        onInitMake()
        destroyMake()
        make = MakeGetUnitTeleportPeriod.create(hero)
    }

    const makeSetUnitMonsterType = (mode: string, mt: MonsterType) => {
        onInitMake()
        destroyMake()

        //modes : oneByOne, twoClics
        if (mode != 'twoClics' && mode != 'oneByOne') {
            return
        }

        make = MakeSetUnitMonsterType.create(hero, mode, mt)
    }

    const makeCreateMeteor = () => {
        onInitMake()
        destroyMake()
        make = MakeMeteor.create(hero)
    }

    const makeDeleteMeteors = (mode: string) => {
        onInitMake()
        destroyMake()

        //delete modes : oneByOne, twoClics
        if (mode != 'oneByOne' && mode != 'twoClics') {
            return
        }

        make = MakeDeleteMeteors.create(hero, mode)
    }

    const makeCreateCaster = (casterType: ICasterType, angle: number) => {
        onInitMake()
        destroyMake()
        make = MakeCaster.create(hero, casterType, angle)
    }

    const makeDeleteCasters = (mode: string) => {
        onInitMake()
        destroyMake()

        //delete modes : oneByOne, twoClics
        if (mode != 'oneByOne' && mode != 'twoClics') {
            return
        }

        make = MakeDeleteCasters.create(hero, mode)
    }

    const makeCreateClearMobs = (disableDuration: number) => {
        onInitMake()
        destroyMake()
        make = MakeClearMob.create(hero, disableDuration)
    }

    const makeDeleteClearMobs = () => {
        onInitMake()
        destroyMake()
        make = MakeDeleteClearMob.create(hero)
    }

    const makeCreateTerrain = (terrainType: TerrainType) => {
        onInitMake()
        destroyMake()
        make = MakeTerrainCreate.create(hero, terrainType)
    }

    const makeTerrainCopyPaste = () => {
        onInitMake()
        destroyMake()
        make = MakeTerrainCopyPaste.create(hero)
    }

    const makeTerrainVerticalSymmetry = () => {
        onInitMake()
        destroyMake()
        make = MakeTerrainVerticalSymmetry.create(hero)
    }

    const makeTerrainHorizontalSymmetry = () => {
        onInitMake()
        destroyMake()
        make = MakeTerrainHorizontalSymmetry.create(hero)
    }

    const makeTerrainHeight = (radius: number, height: number) => {
        onInitMake()
        destroyMake()
        make = MakeTerrainHeight.create(hero, radius, height)
    }

    const makeGetTerrainType = () => {
        onInitMake()
        destroyMake()
        make = MakeGetTerrainType.create(hero)
    }

    const makeExchangeTerrains = () => {
        onInitMake()
        destroyMake()
        make = MakeExchangeTerrains.create(hero)
    }

    const makeCreateStart = (forNext: boolean) => {
        onInitMake()
        destroyMake()
        make = MakeStart.create(hero, forNext)
    }

    const makeCreateEnd = () => {
        onInitMake()
        destroyMake()
        make = MakeEnd.create(hero)
    }

    const makeCreateVisibilityModifier = () => {
        onInitMake()
        destroyMake()
        make = MakeVisibilityModifier.create(hero)
    }

    const cancelLastAction = (): boolean => {
        if (make != 0) {
            if (make.cancelLastAction()) {
                return true
            }
        }
        return makeLastActions.cancelLastAction()
    }

    const redoLastAction = (): boolean => {
        if (makeLastActions.redoLastAction()) {
            return true
        }
        if (make != 0) {
            return make.redoLastAction()
        }
        return false
    }

    const deleteSpecificActionsForLevel = (level: Level) => {
        makeLastActions.deleteSpecificActionsForLevel(level)
    }

    const newAction = (action: MakeAction): MakeAction => {
        return makeLastActions.newAction(action)
    }

    const destroyAllSavedActions = () => {
        makeLastActions.destroyAllActions()
    }

    const destroyCancelledActions = () => {
        makeLastActions.destroyCancelledActions()
    }

    //for gravity gestion
    const getLastZ = (): number => {
        return lastZ
    }

    const setLastZ = (lastZ: number) => {
        lastZ = lastZ
    }

    const getOldDiffZ = (): number => {
        return oldDiffZ
    }

    const setOldDiffZ = (oldDiffZ: number) => {
        oldDiffZ = oldDiffZ
    }

    const getSpeedZ = (): number => {
        return speedZ
    }

    const setSpeedZ = (speedX: number) => {
        speedZ = speedZ
    }

    //coop reviving
    const coopReviveHero = () => {
        let mirrorEscaper: Escaper = GetMirrorEscaper(this)
        let mirrorHero: unit = mirrorEscaper.getHero()

        revive(GetUnitX(hero), GetUnitY(hero))
        RunSoundOnUnit(udg_coop_index_son, hero)
        SetUnitAnimation(hero, 'channel')
        absoluteSlideSpeed(0)
        setCoopInvul(true)

        mirrorEscaper.revive(GetUnitX(mirrorHero), GetUnitY(mirrorHero))
        RunSoundOnUnit(udg_coop_index_son, mirrorHero)
        SetUnitAnimation(mirrorHero, 'channel')
        mirrorEscaper.absoluteSlideSpeed(0)
        mirrorEscaper.setCoopInvul(true)

        TriggerSleepAction(1.4)

        stopAbsoluteSlideSpeed()
        SetUnitAnimation(hero, 'stand')

        mirrorEscaper.stopAbsoluteSlideSpeed()
        SetUnitAnimation(mirrorHero, 'stand')

        TriggerSleepAction(0.6)

        setCoopInvul(false)
        mirrorEscaper.setCoopInvul(false)
    }

    const isCoopInvul = (): boolean => {
        return coopInvul
    }

    const setCoopInvul = (invul: boolean) => {
        coopInvul = invul
    }

    const enableTrigCoopRevive = () => {
        ShowUnit(powerCircle, true)
        SetUnitPathing(powerCircle, false)
        SetUnitPosition(powerCircle, GetUnitX(hero), GetUnitY(hero))
        ShowUnit(dummyPowerCircle, true)
        SetUnitPathing(dummyPowerCircle, false)
        SetUnitPosition(dummyPowerCircle, GetUnitX(hero), GetUnitY(hero))
    }

    const refreshCerclePosition = () => {
        if (!IsUnitHidden(powerCircle)) {
            SetUnitPosition(powerCircle, GetUnitX(hero), GetUnitY(hero))
            SetUnitPosition(dummyPowerCircle, GetUnitX(hero), GetUnitY(hero))
        }
    }

    const isEscaperSecondary = (): boolean => {
        return escaperId >= NB_PLAYERS_MAX
    }

    return {
        discoTrigger,
        getEscaperId,
        resetItem,
        addEffectMeteor,
        removeEffectMeteor,
        selectHero,
        createHero,
        createHeroAtStart,
        removeHero,
        destroy,
        getId,
        enableSlide,
        setSlideLastAngleOrder,
        getSlideLastAngleOrder,
        enableCheckTerrain,
        isSliding,
        doesCheckTerrain,
        moveHero,
        moveInvisUnit,
        getHero,
        isAlive,
        isPaused,
        kill,
        pause,
        specialIllidan,
        revive,
        reviveAtStart,
        turnInstantly,
        reverse,
        giveHeroControl,
        resetOwner,
        setIsHeroSelectedForPlayer,
        newEffect,
        destroyLastEffects,
        hideEffects,
        showEffects,
        destroyTerrainKillEffect,
        createTerrainKillEffect,
        getLastTerrainType,
        setLastTerrainType,
        setSlideSpeed,
        setWalkSpeed,
        getSlideSpeed,
        getRealSlideSpeed,
        getWalkSpeed,
        isAbsoluteSlideSpeed,
        absoluteSlideSpeed,
        stopAbsoluteSlideSpeed,
        isAbsoluteWalkSpeed,
        absoluteWalkSpeed,
        stopAbsoluteWalkSpeed,
        isAbsoluteInstantTurn,
        setAbsoluteInstantTurn,
        setGodMode,
        setGodModeKills,
        isGodModeOn,
        doesGodModeKills,
        setBaseColor,
        setBaseColorDisco,
        getBaseColor,
        setVcRed,
        setVcGreen,
        setVcBlue,
        setVcTransparency,
        getVcRed,
        getVcGreen,
        getVcBlue,
        getVcTransparency,
        refreshVertexColor,
        setCanCheat,
        setIsMaximaxou,
        setIsTrueMaximaxou,
        canCheat,
        isMaximaxou,
        isTrueMaximaxou,
        getPlayer,
        getControler,
        setCameraField,
        getCameraField,
        resetCamera,
        kick,
        hasAutorevive,
        setHasAutorevive,
        getMake,
        destroyMakeIfForSpecificLevel,
        setMakingLevel,
        getMakingLevel,
        isMakingCurrentLevel,
        destroyMake,
        onInitMake,
        makeDoNothing,
        makeCreateNoMoveMonsters,
        makeCreateSimplePatrolMonsters,
        makeCreateMultiplePatrolsMonsters,
        makeCreateTeleportMonsters,
        makeMmpOrMtNext,
        makeMonsterTeleportWait,
        makeMonsterTeleportHide,
        makeCreateMonsterSpawn,
        makeDeleteMonsters,
        makeSetUnitTeleportPeriod,
        makeGetUnitTeleportPeriod,
        makeSetUnitMonsterType,
        makeCreateMeteor,
        makeDeleteMeteors,
        makeCreateCaster,
        makeDeleteCasters,
        makeCreateClearMobs,
        makeDeleteClearMobs,
        makeCreateTerrain,
        makeTerrainCopyPaste,
        makeTerrainVerticalSymmetry,
        makeTerrainHorizontalSymmetry,
        makeTerrainHeight,
        makeGetTerrainType,
        makeExchangeTerrains,
        makeCreateStart,
        makeCreateEnd,
        makeCreateVisibilityModifier,
        cancelLastAction,
        redoLastAction,
        deleteSpecificActionsForLevel,
        newAction,
        destroyAllSavedActions,
        destroyCancelledActions,
        getLastZ,
        setLastZ,
        getOldDiffZ,
        setOldDiffZ,
        getSpeedZ,
        setSpeedZ,
        coopReviveHero,
        isCoopInvul,
        setCoopInvul,
        enableTrigCoopRevive,
        refreshCerclePosition,
        isEscaperSecondary,
    }
}
