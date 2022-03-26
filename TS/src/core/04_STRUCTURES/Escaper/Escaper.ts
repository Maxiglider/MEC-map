import { BasicFunctions } from 'core/01_libraries/Basic_functions'
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
import {EscaperEffectArray, IEscaperEffectArray} from './EscaperEffectArray'
import {udg_levels} from "../../08_GAME/Init_structures/Init_struct_levels";


const SHOW_REVIVE_EFFECTS = false


class Escaper {
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

        this.slide = CreateSlideTrigger(escaperId)
        this.checkTerrain = CreateCheckTerrainTrigger(escaperId)

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
        if (this.hero && UnitHasItemOfTypeBJ(this.hero, Meteor.METEOR_NORMAL)) {
            SetItemDroppable(UnitItemInSlot(this.hero, 0), true)
            Meteor.get(GetItemUserData(UnitItemInSlot(this.hero, 0))).replace()
            this.removeEffectMeteor()
            return true
        }
        return false
    }

    addEffectMeteor(){
        if (!this.meteorEffect && this.hero) {
            this.meteorEffect = AddSpecialEffectTarget(
                'Abilities\\Weapons\\DemonHunterMissile\\DemonHunterMissile.mdl',
                this.hero,
                'hand right'
            )
        }
    }

    removeEffectMeteor(){
        if (this.meteorEffect) {
            DestroyEffect(this.meteorEffect)
            delete this.meteorEffect
        }
    }

    //select method
    selectHero(){
        SelectUnitAddForPlayer(this.hero, this.controler.getPlayer())
        setIsHeroSelectedForPlayer(this.controler.getPlayer(), true)
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
        BasicFunctions.SpecialIllidan(this.hero)
        this.invisUnit = CreateUnit(NEUTRAL_PLAYER, INVIS_UNIT_TYPE_ID, x, y, angle)
        SetUnitUserData(this.invisUnit, GetPlayerId(this.p))
        TriggerRegisterUnitEvent(gg_trg_InvisUnit_is_getting_damage, this.invisUnit, EVENT_UNIT_DAMAGED)
        this.effects.showEffects(this.hero)
        this.lastTerrainType = 0
        TimerStart(afkModeTimers[this.escaperId], timeMinAfk, false, GetAfkModeTimeExpiresCodeFromId(this.escaperId))
        InitShortcutSkills(GetPlayerId(this.p))
        EnableTrigger(this.checkTerrain)
        return true
    }

    createHeroAtStart(){
        let x: number
        let y: number
        let start: Start = udg_levels.getCurrentLevel().getStart()
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

    removeHero(){
        if (!this.hero) {
            return
        }

        this.resetItem()

        if (IsUnitAliveBJ(this.hero)) {
            KillUnit(this.hero)
        }

        RemoveUnit(this.hero)
        delete this.hero

        if(this.invisUnit) {
            RemoveUnit(this.invisUnit)
            delete this.invisUnit
        }

        delete this.lastTerrainType
        this.make.destroy()
        delete this.make
        this.effects.hideEffects()

        DisableTrigger(this.checkTerrain)
        DisableTrigger(this.slide)

        //coop
        ShowUnit(this.powerCircle, false)
        ShowUnit(this.dummyPowerCircle, false)

        if (!this.isEscaperSecondary()) {
            GetMirrorEscaper(this).removeHero()
        }
    }

    destroy(){
        this.removeHero()

        if(this.terrainKillEffect) {
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

            if(this.hero) {
                StopUnit(this.hero)
                heroPos = GetUnitLoc(this.hero)
                setLastZ(GetLocationZ(heroPos) + GetUnitFlyHeight(this.hero))
                RemoveLocation(heroPos)
            }
        } else {
            DisableTrigger(this.slide)
            this.slideLastAngleOrder = -1
        }

        return true
    }

    setSlideLastAngleOrder(angle: number){
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

    isSliding(){
        return IsTriggerEnabled(this.slide)
    }

    doesCheckTerrain() {
        return IsTriggerEnabled(this.checkTerrain)
    }

    //move methods
    moveHero(x: number, y: number){
        if(this.hero) {
            SetUnitX(this.hero, x)
            SetUnitY(this.hero, y)
        }
    }

    moveInvisUnit(x: number, y: number){
        if(this.invisUnit) {
            SetUnitX(this.invisUnit, x)
            SetUnitY(this.invisUnit, y)
        }
    }

    //hero methods
    getHero(){
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
            StopAfk(this.escaperId)
            DisplayDeathMessagePlayer(this.p)
            this.isHeroSelectedB = false
            return true
        }
        return false
    }

    pause(doPause: boolean){
        if (this.isPaused() == doPause) {
            return false
        }
        this.hero && PauseUnit(this.hero, doPause)
        return true
    }

    specialIllidan(){
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
        this.specialIllidan()
        this.selectHero()

        if (this.vcTransparency != 0) {
            SetUnitVertexColorBJ(this.hero, this.vcRed, this.vcGreen, this.vcBlue, this.vcTransparency)
        }

        TimerStart(afkModeTimers[this.escaperId], timeMinAfk, false, GetAfkModeTimeExpiresCodeFromId(this.escaperId))
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
            GetMirrorEscaper(this).reviveAtStart()
        }

        return this.revive(x, y)
    }

    turnInstantly(angle: number){
        if(!this.hero) return

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
        if (this.make != 0) {
            this.make.maker = this.hero
            TriggerRegisterUnitEvent(this.make.t, this.hero, EVENT_UNIT_ISSUED_POINT_ORDER)
        }
        ///////////////////////
        this.lastTerrainType = lastTerrainType
        SetUnitAnimation(this.hero, 'stand')
        if (meteor) {
            UnitAddItem(this.hero, meteor)
        }
        InitShortcutSkills(GetPlayerId(this.p))
    }

    reverse(){
        if(!this.hero) return

        const angle: number = GetUnitFacing(this.hero) + 180
        this.turnInstantly(angle)
        if (this.slideLastAngleOrder != -1) {
            this.slideLastAngleOrder = this.slideLastAngleOrder + 180
            SetUnitFacing(this.hero, this.slideLastAngleOrder)
        }
    }

    giveHeroControl(escaper: Escaper){
        this.hero && SetUnitOwner(this.hero, escaper.getPlayer(), false)
        this.controler = escaper
    }

    resetOwner(){
        this.giveHeroControl(this)
    }

    setIsHeroSelectedForPlayer(p: player, heroSelected: boolean){
        if (GetLocalPlayer() == p) {
            this.isHeroSelectedB = heroSelected
        }
    }

    //effects methods
    newEffect(efStr: string, bodyPart: string){
        this.effects.new(efStr, this.hero, bodyPart)

        if (!this.isEscaperSecondary()) {
            GetMirrorEscaper(this).newEffect(efStr, bodyPart)
        }
    }

    destroyLastEffects(numEfToDestroy: number){
        this.effects.destroyLastEffects(numEfToDestroy)

        if (!isEscaperSecondary()) {
            GetMirrorEscaper(this).destroyLastEffects(numEfToDestroy)
        }
    }

    hideEffects(){
        this.effects.hideEffects()

        if (!isEscaperSecondary()) {
            GetMirrorEscaper(this).hideEffects()
        }
    }

    showEffects(){
        this.hero && this.effects.showEffects(this.hero)

        if (!isEscaperSecondary()) {
            GetMirrorEscaper(this).showEffects()
        }
    }

    //terrainKill methods
    destroyTerrainKillEffect(){
        this.terrainKillEffect && DestroyEffect(this.terrainKillEffect)
    }

    createTerrainKillEffect(killEffectStr: string){
        this.destroyTerrainKillEffect()
        this.hero && (this.terrainKillEffect = AddSpecialEffectTarget(killEffectStr, this.hero, TERRAIN_KILL_EFFECT_BODY_PART))
    }

    //lastTerrainType methods
    getLastTerrainType(){
        return this.lastTerrainType
    }

    setLastTerrainType(terrainType: TerrainType){
        this.lastTerrainType = terrainType
    }

    //speed methods
    setSlideSpeed(ss: number){
        this.slideSpeed = ss
    }

    setWalkSpeed(ws: number){
        this.walkSpeed = ws
        this.hero && SetUnitMoveSpeed(this.hero, ws)
    }

    getSlideSpeed() {
        return this.slideSpeed
    }

    getnumberSlideSpeed() {
        return this.slideSpeed / SLIDE_PERIOD
    }

    getWalkSpeed(){
        return this.walkSpeed
    }

    isAbsoluteSlideSpeed() {
        return this.slideSpeedAbsolute
    }

    absoluteSlideSpeed(slideSpeed: number){
        this.slideSpeedAbsolute = true
        this.slideSpeed = slideSpeed

        if (!this.isEscaperSecondary()) {
            GetMirrorEscaper(this).absoluteSlideSpeed(slideSpeed)
        }
    }

    stopAbsoluteSlideSpeed(){
        const currentTerrainType: TerrainType

        if (this.slideSpeedAbsolute) {
            this.slideSpeedAbsolute = false
            if (this.isAlive()) {
                this.currentTerrainType = udg_terrainTypes.getTerrainType(GetUnitX(this.hero), GetUnitY(this.hero))
                if (currentTerrainType.getKind() == 'slide') {
                    this.setSlideSpeed(TerrainTypeSlide(number(currentTerrainType)).getSlideSpeed())
                }
            }

            if (!isEscaperSecondary()) {
                GetMirrorEscaper(this).stopAbsoluteSlideSpeed()
            }
        }
    }

    isAbsoluteWalkSpeed(): boolean => {
        return walkSpeedAbsolute
    }

    absoluteWalkSpeed(walkSpeed: number){
        walkSpeedAbsolute = true
        setWalkSpeed(walkSpeed)

        if (!isEscaperSecondary()) {
            GetMirrorEscaper(this).absoluteWalkSpeed(walkSpeed)
        }
    }

    stopAbsoluteWalkSpeed(){
        this.currentTerrainType: TerrainType
        if (walkSpeedAbsolute) {
            walkSpeedAbsolute = false
            if (isAlive()) {
                currentTerrainType = udg_terrainTypes.getTerrainType(GetUnitX(hero), GetUnitY(hero))
                if (currentTerrainType.getKind() == 'walk') {
                    setWalkSpeed(TerrainTypeWalk(number(currentTerrainType)).getWalkSpeed())
                }
            }

            if (!isEscaperSecondary()) {
                GetMirrorEscaper(this).stopAbsoluteWalkSpeed()
            }
        }
    }

    isAbsoluteInstantTurn(): boolean => {
        return instantTurnAbsolute
    }

    setAbsoluteInstantTurn(flag: boolean){
        instantTurnAbsolute = flag

        if (!isEscaperSecondary()) {
            GetMirrorEscaper(this).setAbsoluteInstantTurn(flag)
        }
    }

    //godMode methods
    setGodMode(godMode: boolean){
        godMode = godMode // TODO; SELF REF

        if (!isEscaperSecondary()) {
            GetMirrorEscaper(this).setGodMode(godMode)
        }
    }

    setGodModeKills(godModeKills: boolean){
        godModeKills = godModeKills // TODO; SELF REF

        if (!isEscaperSecondary()) {
            GetMirrorEscaper(this).setGodModeKills(godModeKills)
        }
    }

    isGodModeOn(): boolean => {
        return godMode
    }

    doesGodModeKills(): boolean => {
        return godModeKills
    }

    //color methods
    setBaseColor(baseColorId: number): boolean => {
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

    setBaseColorDisco(baseColorId: number): boolean => {
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

    getBaseColor(): number => {
        return baseColorId
    }

    setVcRed(vcRed: number): boolean => {
        if (vcRed < 0 || vcRed > 100) {
            return false
        }
        vcRed = vcRed // TODO; SELF REF

        if (!isEscaperSecondary()) {
            GetMirrorEscaper(this).setVcRed(vcRed)
        }

        return true
    }

    setVcGreen(vcGreen: number): boolean => {
        if (vcGreen < 0 || vcGreen > 100) {
            return false
        }
        vcGreen = vcGreen // TODO; SELF REF

        if (!isEscaperSecondary()) {
            GetMirrorEscaper(this).setVcGreen(vcGreen)
        }

        return true
    }

    setVcBlue(vcBlue: number): boolean => {
        if (vcBlue < 0 || vcBlue > 100) {
            return false
        }

        if (!isEscaperSecondary()) {
            GetMirrorEscaper(this).setVcBlue(vcBlue)
        }

        vcBlue = vcBlue // TODO; SELF REF
        return true
    }

    setVcTransparency(vcTransparency: number): boolean => {
        if (vcTransparency < 0 || vcTransparency > 100) {
            return false
        }

        if (isEscaperSecondary()) {
            return true //secondary escapers transparency is fixed
        }

        vcTransparency = vcTransparency // TODO; self ref

        return true
    }

    getVcRed(): number => {
        return vcRed
    }

    getVcGreen(): number => {
        return vcGreen
    }

    getVcBlue(): number => {
        return vcBlue
    }

    getVcTransparency(): number => {
        return vcTransparency
    }

    refreshVertexColor(){
        SetUnitVertexColorBJ(hero, vcRed, vcGreen, vcBlue, vcTransparency)

        if (!isEscaperSecondary()) {
            ColorInfo(this, p)
            GetMirrorEscaper(this).refreshVertexColor()
        }
    }

    //cheat methods
    setCanCheat(canCheat: boolean){
        if (!canCheat) {
            isMaximaxouB = false
            isTrueMaximaxouB = false
        }
        canCheatB = canCheat // TODO; self ref
    }

    setIsMaximaxou(isMaximaxou: boolean){
        if (isMaximaxou) {
            setCanCheat(true)
        } else {
            isTrueMaximaxouB = false
        }
        isMaximaxouB = isMaximaxou // TODO; self ref
    }

    setIsTrueMaximaxou(isTrueMaximaxou: boolean){
        if (isTrueMaximaxou) {
            setIsMaximaxou(true)
        }
        isTrueMaximaxouB = isTrueMaximaxou
    }

    canCheat(): boolean => {
        return canCheatB
    }

    isMaximaxou(): boolean => {
        return isMaximaxouB
    }

    isTrueMaximaxou(): boolean => {
        return isTrueMaximaxouB
    }

    //autres
    getPlayer(): player => {
        return p
    }

    // TODO; IEscaper is circular dep
    getControler(): any => {
        return controler
    }

    setCameraField(cameraField: number){
        cameraField = cameraField //TODO; self ref
        SetCameraFieldForPlayer(p, CAMERA_FIELD_TARGET_DISTANCE, I2R(cameraField), 0)
    }

    getCameraField(): number => {
        return cameraField
    }

    resetCamera(){
        ResetToGameCameraForPlayer(p, 0)
        SetCameraFieldForPlayer(p, CAMERA_FIELD_TARGET_DISTANCE, cameraField, 0)
    }

    // TODO; Should be IEscaper but gives circular error
    kick(kicked: any){
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
    hasAutorevive(): boolean => {
        return hasAutoreviveB
    }

    setHasAutorevive(hasAutorevive: boolean){
        hasAutoreviveB = hasAutorevive
    }

    //make methods
    getMake(): Make => {
        return make
    }

    destroyMakeIfForSpecificLevel(){
        this.doDestroy: boolean

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

    setMakingLevel(level: Level): boolean => {
        this.oldMakingLevel: Level
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

    getMakingLevel(): Level => {
        if (makingLevel == 0) {
            return udg_levels.getCurrentLevel()
        }
        return makingLevel
    }

    isMakingCurrentLevel(): boolean => {
        return makingLevel == 0
    }

    destroyMake(): boolean => {
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

    onInitMake(){
        if (!isEscaperSecondary()) {
            GetMirrorEscaper(this).makeDoNothing()
        }
    }

    makeDoNothing(){
        destroyMake()
        make = MakeDoNothing.create(hero)
    }

    makeCreateNoMoveMonsters(mt: MonsterType, facingAngle: number){
        onInitMake()
        //mode : noMove
        destroyMake()
        make = MakeMonsterNoMove.create(hero, mt, facingAngle)
    }

    makeCreateSimplePatrolMonsters(mode: string, mt: MonsterType){
        onInitMake()
        destroyMake()
        //modes : normal, string, auto
        if (mode == 'normal' || mode == 'string' || mode == 'auto') {
            make = MakeMonsterSimplePatrol.create(hero, mode, mt)
        }
    }

    makeCreateMultiplePatrolsMonsters(mode: string, mt: MonsterType){
        onInitMake()
        destroyMake()
        //modes : normal, string
        if (mode == 'normal' || mode == 'string') {
            make = MakeMonsterMultiplePatrols.create(hero, mode, mt)
        }
    }

    makeCreateTeleportMonsters(mode: string, mt: MonsterType, period: number, angle: number){
        onInitMake()
        destroyMake()
        //modes : normal, string
        if (mode == 'normal' || mode == 'string') {
            make = MakeMonsterTeleport.create(hero, mode, mt, period, angle)
        }
    }

    makeMmpOrMtNext(): boolean => {
        onInitMake()
        if (
            make == 0 ||
            !(make.getType() == MakeMonsterMultiplePatrols.typeid || make.getType() == MakeMonsterTeleport.typeid)
        ) {
            return false
        }
        if (make.getType() == MakeMonsterMultiplePatrols.typeid) {
            MakeMonsterMultiplePatrols(number(make)).nextMonster()
        } else {
            MakeMonsterTeleport(number(make)).nextMonster()
        }
        return true
    }

    makeMonsterTeleportWait(): boolean => {
        onInitMake()
        if (make == 0 || make.getType() != MakeMonsterTeleport.typeid) {
            return false
        }
        return MakeMonsterTeleport(number(make)).addWaitPeriod()
    }

    makeMonsterTeleportHide(): boolean => {
        onInitMake()
        if (make == 0 || make.getType() != MakeMonsterTeleport.typeid) {
            return false
        }
        return MakeMonsterTeleport(number(make)).addHidePeriod()
    }

    makeCreateMonsterSpawn(label: string, mt: MonsterType, sens: string, frequence: number){
        onInitMake()
        destroyMake()
        make = MakeMonsterSpawn.create(hero, label, mt, sens, frequence)
    }

    makeDeleteMonsters(mode: string){
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

    makeSetUnitTeleportPeriod(mode: string, period: number){
        onInitMake()
        destroyMake()

        //modes : oneByOne, twoClics
        if (mode != 'twoClics' && mode != 'oneByOne') {
            return
        }

        make = MakeSetUnitTeleportPeriod.create(hero, mode, period)
    }

    makeGetUnitTeleportPeriod(){
        onInitMake()
        destroyMake()
        make = MakeGetUnitTeleportPeriod.create(hero)
    }

    makeSetUnitMonsterType(mode: string, mt: MonsterType){
        onInitMake()
        destroyMake()

        //modes : oneByOne, twoClics
        if (mode != 'twoClics' && mode != 'oneByOne') {
            return
        }

        make = MakeSetUnitMonsterType.create(hero, mode, mt)
    }

    makeCreateMeteor(){
        onInitMake()
        destroyMake()
        make = MakeMeteor.create(hero)
    }

    makeDeleteMeteors(mode: string){
        onInitMake()
        destroyMake()

        //delete modes : oneByOne, twoClics
        if (mode != 'oneByOne' && mode != 'twoClics') {
            return
        }

        make = MakeDeleteMeteors.create(hero, mode)
    }

    makeCreateCaster(casterType: ICasterType, angle: number){
        onInitMake()
        destroyMake()
        make = MakeCaster.create(hero, casterType, angle)
    }

    makeDeleteCasters(mode: string){
        onInitMake()
        destroyMake()

        //delete modes : oneByOne, twoClics
        if (mode != 'oneByOne' && mode != 'twoClics') {
            return
        }

        make = MakeDeleteCasters.create(hero, mode)
    }

    makeCreateClearMobs(disableDuration: number){
        onInitMake()
        destroyMake()
        make = MakeClearMob.create(hero, disableDuration)
    }

    makeDeleteClearMobs(){
        onInitMake()
        destroyMake()
        make = MakeDeleteClearMob.create(hero)
    }

    makeCreateTerrain(terrainType: TerrainType){
        onInitMake()
        destroyMake()
        make = MakeTerrainCreate.create(hero, terrainType)
    }

    makeTerrainCopyPaste(){
        onInitMake()
        destroyMake()
        make = MakeTerrainCopyPaste.create(hero)
    }

    makeTerrainVerticalSymmetry(){
        onInitMake()
        destroyMake()
        make = MakeTerrainVerticalSymmetry.create(hero)
    }

    makeTerrainHorizontalSymmetry(){
        onInitMake()
        destroyMake()
        make = MakeTerrainHorizontalSymmetry.create(hero)
    }

    makeTerrainHeight(radius: number, height: number){
        onInitMake()
        destroyMake()
        make = MakeTerrainHeight.create(hero, radius, height)
    }

    makeGetTerrainType(){
        onInitMake()
        destroyMake()
        make = MakeGetTerrainType.create(hero)
    }

    makeExchangeTerrains(){
        onInitMake()
        destroyMake()
        make = MakeExchangeTerrains.create(hero)
    }

    makeCreateStart(forNext: boolean){
        onInitMake()
        destroyMake()
        make = MakeStart.create(hero, forNext)
    }

    makeCreateEnd(){
        onInitMake()
        destroyMake()
        make = MakeEnd.create(hero)
    }

    makeCreateVisibilityModifier(){
        onInitMake()
        destroyMake()
        make = MakeVisibilityModifier.create(hero)
    }

    cancelLastAction(): boolean => {
        if (make != 0) {
            if (make.cancelLastAction()) {
                return true
            }
        }
        return makeLastActions.cancelLastAction()
    }

    redoLastAction(): boolean => {
        if (makeLastActions.redoLastAction()) {
            return true
        }
        if (make != 0) {
            return make.redoLastAction()
        }
        return false
    }

    deleteSpecificActionsForLevel(level: Level){
        makeLastActions.deleteSpecificActionsForLevel(level)
    }

    newAction(action: MakeAction): MakeAction => {
        return makeLastActions.newAction(action)
    }

    destroyAllSavedActions(){
        makeLastActions.destroyAllActions()
    }

    destroyCancelledActions(){
        makeLastActions.destroyCancelledActions()
    }

    //for gravity gestion
    getLastZ(): number => {
        return lastZ
    }

    setLastZ(lastZ: number){
        lastZ = lastZ
    }

    getOldDiffZ(): number => {
        return oldDiffZ
    }

    setOldDiffZ(oldDiffZ: number){
        oldDiffZ = oldDiffZ
    }

    getSpeedZ(): number => {
        return speedZ
    }

    setSpeedZ(speedX: number){
        speedZ = speedZ
    }

    //coop reviving
    coopReviveHero(){
        this.mirrorEscaper: Escaper = GetMirrorEscaper(this)
        this.mirrorHero: unit = mirrorEscaper.getHero()

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

    isCoopInvul(): boolean => {
        return coopInvul
    }

    setCoopInvul(invul: boolean){
        coopInvul = invul
    }

    enableTrigCoopRevive(){
        ShowUnit(powerCircle, true)
        SetUnitPathing(powerCircle, false)
        SetUnitPosition(powerCircle, GetUnitX(hero), GetUnitY(hero))
        ShowUnit(dummyPowerCircle, true)
        SetUnitPathing(dummyPowerCircle, false)
        SetUnitPosition(dummyPowerCircle, GetUnitX(hero), GetUnitY(hero))
    }

    refreshCerclePosition(){
        if (!IsUnitHidden(powerCircle)) {
            SetUnitPosition(powerCircle, GetUnitX(hero), GetUnitY(hero))
            SetUnitPosition(dummyPowerCircle, GetUnitX(hero), GetUnitY(hero))
        }
    }

    isEscaperSecondary(): boolean => {
        return escaperId >= NB_PLAYERS_MAX
    }
}
