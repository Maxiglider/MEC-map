//TESH.scrollpos=1017
//TESH.alwaysfold=0
library Escaper needs EscaperEffectArray, EscaperFunctions, MessageHeroDies



globals
	constant boolean SHOW_REVIVE_EFFECTS = false
    private unit heroToSelect
endglobals


struct Escaper
	private integer escaperId
	private integer playerId

	private player p
    private unit hero
	private unit invisUnit
    private real walkSpeed
    private real slideSpeed
    private integer baseColorId
	private integer cameraField
	private TerrainType lastTerrainType
    private Escaper controler
	
	private trigger slide
	private trigger checkTerrain
	
    private real vcRed
    private real vcGreen
    private real vcBlue
    private real vcTransparency
    trigger discoTrigger
    private EscaperEffectArray effects
	private effect terrainKillEffect
    private effect meteorEffect
	
	private boolean godMode
	private boolean godModeKills
	private boolean walkSpeedAbsolute
	private boolean slideSpeedAbsolute
	private boolean canTeleportB
	private boolean hasAutoreviveB
	
	private boolean canCheatB
	private boolean isMaximaxouB
	private boolean isTrueMaximaxouB
    
    private Make make
    private MakeLastActions makeLastActions
    private Level makingLevel
	
	Level currentLevelTouchTerrainDeath //pour le terrain qui tue, vérifie s'il faut bien tuer l'escaper
	private item itemInInventory //créer le déclo pour save ça
    
    private real lastZ
    private real oldDiffZ
    private real speedZ
    
    private real slideLastAngleOrder
    private boolean isHeroSelectedB

    private boolean instantTurnAbsolute

    private real animSpeedSecondaryHero = 0.8
    
    //coop
    private unit powerCircle
    private unit dummyPowerCircle
    private boolean coopInvul
    

//constructor
	static method create takes integer escaperId returns Escaper //ne crée pas le héros
		local Escaper e = Escaper.allocate()

		if (escaperId > 11) then
			set e.playerId = escaperId - 12
		else
			set e.playerId = escaperId
		endif

		set e.escaperId = escaperId
		set e.p = Player(e.playerId)
		set e.walkSpeed = HERO_WALK_SPEED
		set e.slideSpeed = HERO_SLIDE_SPEED
		set e.baseColorId = e.playerId
		set e.slide = CreateSlideTrigger(escaperId)
        set e.checkTerrain = CreateCheckTerrainTrigger(escaperId)
        set e.cameraField = DEFAULT_CAMERA_FIELD
        call SetCameraFieldForPlayer(e.p, CAMERA_FIELD_TARGET_DISTANCE, I2R(e.cameraField), 0)
        set e.effects = EscaperEffectArray.create()
        set e.vcRed = 100
        set e.vcGreen = 100
        set e.vcBlue = 100
        set e.vcTransparency = 0
        set e.lastTerrainType = 0
        set e.makingLevel = 0
        set e.make = 0
        set e.makeLastActions = MakeLastActions.create(e)
        set e.godMode = false
        set e.godModeKills = false
        set e.walkSpeedAbsolute = false
        set e.slideSpeedAbsolute = false
        set e.canTeleportB = false
        set e.hasAutoreviveB = false
        set e.canCheatB = false
        set e.isMaximaxouB = false
        set e.isTrueMaximaxouB = false
        set e.discoTrigger = null
        set e.controler = e
        set e.slideLastAngleOrder = -1
        set e.instantTurnAbsolute = false

        //coop
        set e.powerCircle = CreateUnit(e.p, POWER_CIRCLE, 0, 0, 0)
        call SetUnitUserData(e.powerCircle, escaperId)
        call ShowUnit(e.powerCircle, false)
        set e.dummyPowerCircle = CreateUnit(ENNEMY_PLAYER, DUMMY_POWER_CIRCLE, 0, 0, 0)
        call SetUnitUserData(e.dummyPowerCircle, escaperId)
        call ShowUnit(e.dummyPowerCircle, false)

		return e
	endmethod


	method getEscaperId takes nothing returns integer
		return .escaperId
	endmethod
    
    
//item method
    method resetItem takes nothing returns boolean //renvoie true si le héros portait un item
        if (UnitHasItemOfTypeBJ(.hero, METEOR_NORMAL)) then
            call SetItemDroppable(UnitItemInSlot(.hero, 0), true)
            call Meteor(GetItemUserData(UnitItemInSlot(.hero, 0))).replace()
            call DestroyEffect(.meteorEffect)
            set .meteorEffect = null
            return true
        endif
        return false
    endmethod
    
    method addEffectMeteor takes nothing returns nothing
        if(.meteorEffect == null)then
            set .meteorEffect = AddSpecialEffectTarget("Abilities\\Weapons\\DemonHunterMissile\\DemonHunterMissile.mdl", .hero, "hand right")
        endif
    endmethod
    
    method removeEffectMeteor takes nothing returns nothing
        if(.meteorEffect != null)then
            call DestroyEffect(.meteorEffect)
            set .meteorEffect = null
        endif
    endmethod
    
//select method
    method selectHero takes nothing returns nothing
        call SelectUnitAddForPlayer(.hero, .controler.getPlayer())
        call .setIsHeroSelectedForPlayer(.controler.getPlayer(), true)
    endmethod
	
//creation method
	method createHero takes real x, real y, real angle returns boolean //retourne false si le héros existe déja
		local integer heroTypeId = HERO_TYPE_ID

		if (.hero != null) then
			return false
		endif

		if (.escaperId >= NB_PLAYERS_MAX) then
			set heroTypeId = HERO_SECONDARY_TYPE_ID
		endif

		set .hero = CreateUnit(.p, heroTypeId, x, y, angle)

		if (.escaperId >= NB_PLAYERS_MAX) then
			call SetUnitTimeScale(.hero, .animSpeedSecondaryHero)
		endif

        call SetUnitFlyHeight(.hero, 1., 0.)
        call SetUnitFlyHeight(.hero, 0., 0.)
        call SetUnitUserData(.hero, .escaperId)
        call ShowUnit(.hero, false)
        call ShowUnit(.hero, true)
        call UnitRemoveAbility(.hero, 'Aloc')
		call SetUnitMoveSpeed(.hero, .walkSpeed) //voir pour le nom de la fonction
        call .selectHero()
        if (.baseColorId == 0) then
            call SetUnitColor(.hero, PLAYER_COLOR_RED)
        else
            call SetUnitColor(.hero, ConvertPlayerColor(.baseColorId))
        endif
        call SetUnitVertexColorBJ(.hero, .vcRed, .vcGreen, .vcBlue, .vcTransparency)
        call SpecialIllidan(.hero)
		set .invisUnit = CreateUnit(NEUTRAL_PLAYER, INVIS_UNIT_TYPE_ID, x, y, angle)
        call SetUnitUserData(.invisUnit, GetPlayerId(.p)) 
        call TriggerRegisterUnitEvent(gg_trg_InvisUnit_is_getting_damage, .invisUnit, EVENT_UNIT_DAMAGED)
        call .effects.showEffects(.hero)
        set .lastTerrainType = 0
        call TimerStart(afkModeTimers[GetPlayerId(.p)], timeMinAfk, false, GetAfkModeTimeExpiresCodeFromId(GetPlayerId(.p)))
        call InitShortcutSkills(GetPlayerId(.p))
        call EnableTrigger(.checkTerrain)
        return true
	endmethod
	
	method createHeroAtStart takes nothing returns boolean
		local real x
		local real y
		local Start start = udg_levels.getCurrentLevel().getStart()
        local real angle
		if (start == 0) then //si le départ du niveau en cours n'existe pas
			set start = DEPART_PAR_DEFAUT
            set angle = HERO_START_ANGLE
        else
            set angle = GetRandomDirectionDeg()
		endif
		set x = start.getRandomX()
		set y = start.getRandomY()
		return .createHero(x, y, angle)
	endmethod
	
	method removeHero takes nothing returns nothing
		if (.hero == null) then
			return
		endif
		call .resetItem()
        if (IsUnitAliveBJ(.hero)) then
            call KillUnit(.hero)
        endif
		call RemoveUnit(.hero)
		set .hero = null
		call RemoveUnit(.invisUnit)
		set .invisUnit = null
		set .lastTerrainType = 0
        call .make.destroy()
        set .make = 0
        call .effects.hideEffects()
        call DisableTrigger(.checkTerrain)
        call DisableTrigger(.slide)
        //coop
        call ShowUnit(.powerCircle, false)
        call ShowUnit(.dummyPowerCircle, false)
	endmethod
	
	private method onDestroy takes nothing returns nothing
		call .removeHero()
		call DestroyEffect(.terrainKillEffect)
		set .terrainKillEffect = null
		call .effects.destroy()
		call DestroyTrigger(.slide)
		set .slide = null
		call DestroyTrigger(.checkTerrain)
		set .checkTerrain = null
        call DestroyTrigger(.discoTrigger)
        set .discoTrigger = null
        call udg_escapers.nullify(GetPlayerId(.p))
        //coop
        call RemoveUnit(.powerCircle)
        set .powerCircle = null
        call RemoveUnit(.dummyPowerCircle)
        set .dummyPowerCircle = null
	endmethod
    
//getId method
    method getId takes nothing returns integer
        local integer i = 0
        loop
            exitwhen (i >= NB_ESCAPERS)
                if (this == udg_escapers.get(i)) then
                    return i
                endif
            set i = i + 1
        endloop
        return -1
    endmethod		
			
//trigger methods
	method enableSlide takes boolean doEnable returns boolean
        local location heroPos
		if (IsTriggerEnabled(.slide) == doEnable) then
			return false
		endif
		if (doEnable) then
			call EnableTrigger(.slide)
			call StopUnit(.hero)
            set heroPos = GetUnitLoc(.hero)
            call .setLastZ(GetLocationZ(heroPos) + GetUnitFlyHeight(.hero))
            call RemoveLocation(heroPos)
            set heroPos = null
		else
			call DisableTrigger(.slide)
            set .slideLastAngleOrder = -1
		endif
		return true
	endmethod
    
    method setSlideLastAngleOrder takes real angle returns nothing
        set .slideLastAngleOrder = angle
    endmethod
    
    method getSlideLastAngleOrder takes nothing returns real
        return .slideLastAngleOrder
	endmethod
    
	method enableCheckTerrain takes boolean doEnable returns boolean
		if (IsTriggerEnabled(.checkTerrain) == doEnable) then
			return false
		endif
		if (doEnable) then
			call EnableTrigger(.checkTerrain)
		else
			call DisableTrigger(.checkTerrain)
		endif
		return true
	endmethod
    
    method isSliding takes nothing returns boolean
        return IsTriggerEnabled(.slide)
    endmethod
    
    method doesCheckTerrain takes nothing returns boolean
        return IsTriggerEnabled(.checkTerrain)
    endmethod
	
	
//move methods
	method moveHero takes real x, real y returns nothing
		call SetUnitX(.hero, x)
		call SetUnitY(.hero, y)
	endmethod
	
	method moveInvisUnit takes real x, real y returns nothing
		call SetUnitX(.invisUnit, x)
		call SetUnitY(.invisUnit, y)
	endmethod	
	
	
//hero methods
	method getHero takes nothing returns unit
		return .hero
	endmethod
	
	method isAlive takes nothing returns boolean
		return IsUnitAliveBJ(.hero)
	endmethod
	
	method isPaused takes nothing returns boolean
		return IsUnitPaused(.hero)
	endmethod
	
	method kill takes nothing returns boolean
		if (.isAlive()) then
			call .resetItem()
			call KillUnit(.hero)
			set .lastTerrainType = 0
            call ShowUnit(.invisUnit, false)
            call .enableCheckTerrain(false)
            call StopAfk(GetPlayerId(.p))
            call DisplayDeathMessagePlayer(.p)
            set .isHeroSelectedB = false
			return true
		endif
		return false
	endmethod
	
	method pause takes boolean doPause returns boolean
		if (.isPaused() == doPause) then
            return false
		endif
        call PauseUnit(.hero, doPause)
        return true
	endmethod
	
	method specialIllidan takes nothing returns nothing
		call SetUnitAnimation(.hero, "Morph Alternate")
	endmethod
	
	method revive takes real x, real y returns boolean
		if (.isAlive()) then
			return false
		endif
		call ReviveHero(.hero, x, y, SHOW_REVIVE_EFFECTS)
		call SetUnitX(.invisUnit, x)
		call SetUnitY(.invisUnit, y)
		call ShowUnit(.invisUnit, true)
		call .enableCheckTerrain(true)
		call .specialIllidan()
		call .selectHero()
        if (.vcTransparency != 0) then
            call SetUnitVertexColorBJ(.hero, .vcRed, .vcGreen, .vcBlue, .vcTransparency)
        endif
        call TimerStart(afkModeTimers[GetPlayerId(.p)], timeMinAfk, false, GetAfkModeTimeExpiresCodeFromId(GetPlayerId(.p)))
        set .lastZ = 0
        set .oldDiffZ = 0
        set .speedZ = 0
        //coop
        call ShowUnit(.powerCircle, false)
        call ShowUnit(.dummyPowerCircle, false)
        return true
	endmethod
	
	method reviveAtStart takes nothing returns boolean
		local real x = udg_levels.getCurrentLevel().getStartRandomX()
		local real y = udg_levels.getCurrentLevel().getStartRandomY()
		return .revive(x, y)
	endmethod
    
    
    method turnInstantly takes real angle returns nothing
		local integer heroTypeId = HERO_TYPE_ID
        local TerrainType lastTerrainType = .lastTerrainType
        local real x = GetUnitX(.hero)
		local real y = GetUnitY(.hero)
        local item meteor = UnitItemInSlot(.hero, 0)

		call RemoveUnit(.hero)

        //recreate hero
			if (.escaperId >= NB_PLAYERS_MAX) then
				set heroTypeId = HERO_SECONDARY_TYPE_ID
			endif

			set .hero = CreateUnit(.p, heroTypeId, x, y, angle)

			if (.escaperId >= NB_PLAYERS_MAX) then
				call SetUnitTimeScale(.hero, .animSpeedSecondaryHero)
			endif

            call SetUnitFlyHeight(.hero, 1., 0.)
            call SetUnitFlyHeight(.hero, 0., 0.)
            call SetUnitUserData(.hero, GetPlayerId(.p))
            call ShowUnit(.hero, false)
            call ShowUnit(.hero, true)
            call UnitRemoveAbility(.hero, 'Aloc')
            call SetUnitMoveSpeed(.hero, .walkSpeed) //voir pour le nom de la fonction
            if (.controler != this) then
                call SetUnitOwner(.hero, .controler.getPlayer(), false)
            endif

            if (.isHeroSelectedB) then
                call SelectUnit(.hero, true)
            endif
            if (.baseColorId == 0) then
                call SetUnitColor(.hero, PLAYER_COLOR_RED)
            else
                call SetUnitColor(.hero, ConvertPlayerColor(.baseColorId))
            endif
            call SetUnitVertexColorBJ(.hero, .vcRed, .vcGreen, .vcBlue, .vcTransparency)
            call .effects.showEffects(.hero)
            if (.make != 0) then
                set .make.maker = .hero
                call TriggerRegisterUnitEvent(.make.t, .hero, EVENT_UNIT_ISSUED_POINT_ORDER)
            endif
        ///////////////////////
        set .lastTerrainType = lastTerrainType
        call SetUnitAnimation(.getHero(), "stand")
        if (meteor != null) then
            call UnitAddItem(.hero, meteor)
        endif
        call InitShortcutSkills(GetPlayerId(.p))
        set meteor = null
    endmethod
	
	method reverse takes nothing returns nothing
		local real angle = GetUnitFacing(.hero) + 180 //à vérifier
		call .turnInstantly(angle)
        if (.slideLastAngleOrder != -1) then
            set .slideLastAngleOrder = .slideLastAngleOrder + 180
            call SetUnitFacing(.hero, .slideLastAngleOrder)
        endif
	endmethod
    
    method giveHeroControl takes Escaper escaper returns nothing
        call SetUnitOwner(.hero, escaper.getPlayer(), false)
        set .controler = escaper
    endmethod
    
    method resetOwner takes nothing returns nothing
        call SetUnitOwner(.hero, .getPlayer(), false)
        set .controler = this
    endmethod
    
    method setIsHeroSelectedForPlayer takes player p, boolean heroSelected returns nothing
        if (GetLocalPlayer() == p) then
            set .isHeroSelectedB = heroSelected
        endif
    endmethod
	
    
//effects methods
	method newEffect takes string efStr, string bodyPart returns nothing
		call .effects.new(efStr, .hero, bodyPart)
	endmethod
	
	method destroyLastEffects takes integer numEfToDestroy returns nothing
		call .effects.destroyLastEffects(numEfToDestroy)
	endmethod
	
	method hideEffects takes nothing returns nothing
		call .effects.hideEffects()
	endmethod
	
	method showEffects takes nothing returns nothing
		call .effects.showEffects(.hero)
	endmethod
	
    
//terrainKill methods
	method destroyTerrainKillEffect takes nothing returns nothing
		call DestroyEffect(.terrainKillEffect)
		set .terrainKillEffect = null
	endmethod
	
	method createTerrainKillEffect takes string killEffectStr returns nothing
		if (.terrainKillEffect != null) then
			call .destroyTerrainKillEffect()
		endif
		set .terrainKillEffect = AddSpecialEffectTarget( killEffectStr, .hero, TERRAIN_KILL_EFFECT_BODY_PART )
	endmethod
	
//lastTerrainType methods
	method getLastTerrainType takes nothing returns TerrainType
		return .lastTerrainType
	endmethod
	
    method setLastTerrainType takes TerrainType terrainType returns nothing
		set .lastTerrainType = terrainType
	endmethod
	
//speed methods
	method setSlideSpeed takes real slideSpeed returns nothing
		set .slideSpeed = slideSpeed
	endmethod
	
	method setWalkSpeed takes real walkSpeed returns nothing
		set .walkSpeed = walkSpeed
		call SetUnitMoveSpeed(.hero, walkSpeed)
	endmethod
	
	method getSlideSpeed takes nothing returns real
		return .slideSpeed
	endmethod
    
    method getRealSlideSpeed takes nothing returns real
        return .slideSpeed / SLIDE_PERIOD
    endmethod
	
	method getWalkSpeed takes nothing returns real
		return .walkSpeed
	endmethod
	
	method isAbsoluteSlideSpeed takes nothing returns boolean
		return .slideSpeedAbsolute
	endmethod
	
	method absoluteSlideSpeed takes real slideSpeed returns nothing
		set .slideSpeedAbsolute = true
		set .slideSpeed = slideSpeed
	endmethod
	
	method stopAbsoluteSlideSpeed takes nothing returns nothing
        local TerrainType currentTerrainType
		if (.slideSpeedAbsolute) then
            set .slideSpeedAbsolute = false
            if (.isAlive()) then
                set currentTerrainType= udg_terrainTypes.getTerrainType(GetUnitX(.hero), GetUnitY(.hero))
                if (currentTerrainType.getKind() == "slide") then
                    call .setSlideSpeed(TerrainTypeSlide(integer(currentTerrainType)).getSlideSpeed())
                endif
            endif
        endif        
	endmethod
	
	method isAbsoluteWalkSpeed takes nothing returns boolean
		return .walkSpeedAbsolute
	endmethod
	
	method absoluteWalkSpeed takes real walkSpeed returns nothing
		set .walkSpeedAbsolute = true
		call .setWalkSpeed( walkSpeed )
	endmethod
	
	method stopAbsoluteWalkSpeed takes nothing returns nothing
        local TerrainType currentTerrainType
		if (.walkSpeedAbsolute) then
            set .walkSpeedAbsolute = false
            if (.isAlive()) then
                set currentTerrainType= udg_terrainTypes.getTerrainType(GetUnitX(.hero), GetUnitY(.hero))
                if (currentTerrainType.getKind() == "walk") then
                    call .setWalkSpeed(TerrainTypeWalk(integer(currentTerrainType)).getWalkSpeed())
                endif
            endif
        endif 
	endmethod

	method isAbsoluteInstantTurn takes nothing returns boolean
	    return .instantTurnAbsolute
	endmethod

	method setAbsoluteInstantTurn takes boolean flag returns nothing
		set .instantTurnAbsolute = flag
	endmethod
	
//godMode methods    
    method setGodMode takes boolean godMode returns nothing
        set .godMode = godMode
    endmethod
    
    method setGodModeKills takes boolean godModeKills returns nothing
        set .godModeKills = godModeKills
    endmethod
	
	method isGodModeOn takes nothing returns boolean
		return .godMode
	endmethod

	method doesGodModeKills takes nothing returns boolean
		return .godModeKills
	endmethod
	
//color methods
	method setBaseColor takes integer baseColorId returns boolean
        if (baseColorId < 0 or baseColorId > 12) then
            return false
        endif
		set .baseColorId = baseColorId
		if (.hero != null) then
            if (baseColorId == 0) then
                call SetUnitColor(.hero, PLAYER_COLOR_RED)
            else
                call SetUnitColor(.hero, ConvertPlayerColor(baseColorId))
            endif
		endif
        call ColorInfo(this, .p)
        return true
	endmethod
    
	method setBaseColorDisco takes integer baseColorId returns boolean
        if (baseColorId < 0 or baseColorId > 12) then
            return false
        endif
		set .baseColorId = baseColorId
		if (.hero != null) then
            if (baseColorId == 0) then
                call SetUnitColor(.hero, PLAYER_COLOR_RED)
            else
                call SetUnitColor(.hero, ConvertPlayerColor(baseColorId))
            endif
		endif
        return true
	endmethod
    
    method getBaseColor takes nothing returns integer
        return .baseColorId
    endmethod
	
	method setVcRed takes real vcRed returns boolean
        if (vcRed < 0 or vcRed > 100) then
            return false
        endif
		set .vcRed = vcRed
        return true
	endmethod
	
	method setVcGreen takes real vcGreen returns boolean
        if (vcGreen < 0 or vcGreen > 100) then
            return false
        endif
		set .vcGreen = vcGreen
        return true
	endmethod
	
	method setVcBlue takes real vcBlue returns boolean
        if (vcBlue < 0 or vcBlue > 100) then
            return false
        endif
		set .vcBlue = vcBlue
        return true
	endmethod
	
	method setVcTransparency takes real vcTransparency returns boolean
        if (vcTransparency < 0 or vcTransparency > 100) then
            return false
        endif
		set .vcTransparency = vcTransparency
        return true
	endmethod
	
	method getVcRed takes nothing returns real
		return .vcRed
	endmethod
	
	method getVcGreen takes nothing returns real
		return .vcGreen
	endmethod
	
	method getVcBlue takes nothing returns real
		return .vcBlue
	endmethod
	
	method getVcTransparency takes nothing returns real
		return .vcTransparency
	endmethod
	
	method refreshVertexColor takes nothing returns nothing
		call SetUnitVertexColorBJ(.hero, .vcRed, .vcGreen, .vcBlue, .vcTransparency)
		call ColorInfo(this, .p)
	endmethod
	
//cheat methods
	method setCanCheat takes boolean canCheat returns nothing
        if (not canCheat) then
            set .isMaximaxouB = false
            set .isTrueMaximaxouB = false
        endif
		set .canCheatB = canCheat
	endmethod
	
	method setIsMaximaxou takes boolean isMaximaxou returns nothing
		if (isMaximaxou) then
			call .setCanCheat(true)
        else
            set .isTrueMaximaxouB = false
		endif
		set .isMaximaxouB = isMaximaxou
	endmethod
	
	method setIsTrueMaximaxou takes boolean isTrueMaximaxou returns nothing
		if (isTrueMaximaxou) then
			call .setIsMaximaxou(true)
		endif
		set .isTrueMaximaxouB = isTrueMaximaxou
	endmethod
	
	method canCheat takes nothing returns boolean
		return .canCheatB
	endmethod
	
	method isMaximaxou takes nothing returns boolean
		return .isMaximaxouB
	endmethod
	
	method isTrueMaximaxou takes nothing returns boolean
		return .isTrueMaximaxouB
	endmethod
	
    
//autres
	method getPlayer takes nothing returns player
		return .p
	endmethod

	method getControler takes nothing returns Escaper
		return .controler
	endmethod
	
	method setCameraField takes integer cameraField returns nothing
		set .cameraField = cameraField
		call SetCameraFieldForPlayer(.p, CAMERA_FIELD_TARGET_DISTANCE, I2R(cameraField), 0)
	endmethod
    
    method getCameraField takes nothing returns integer
        return .cameraField
    endmethod
    
    method resetCamera takes nothing returns nothing
        call ResetToGameCameraForPlayer(.p, 0)
        call SetCameraFieldForPlayer(.p, CAMERA_FIELD_TARGET_DISTANCE, .cameraField, 0 )
    endmethod

	method kick takes Escaper kicked returns nothing
		call CustomDefeatBJ(kicked.getPlayer(), "You have been kicked by " + GetPlayerName(.p) + " !")
        call Text_A(udg_colorCode[GetPlayerId(kicked.getPlayer())] + GetPlayerName(kicked.getPlayer()) + " has been kicked by " + udg_colorCode[GetPlayerId(.p)] + GetPlayerName(.p) + " !")
		call kicked.destroy()
	endmethod
	
    
//teleport methods
	method setCanTeleport takes boolean canTeleport returns nothing
		set .canTeleportB = canTeleport
	endmethod
	
	method canTeleport takes nothing returns boolean
		return .canTeleportB
	endmethod
	
    
//autorevive methods
	method hasAutorevive takes nothing returns boolean
		return .hasAutoreviveB
	endmethod
	
	method setHasAutorevive takes boolean hasAutorevive returns nothing
		set .hasAutoreviveB = hasAutorevive
	endmethod
    
    
//make methods
    method getMake takes nothing returns Make
        return .make
    endmethod
    
    method destroyMakeIfForSpecificLevel takes nothing returns nothing
        local boolean doDestroy
        if (.make != 0) then
            set doDestroy = (.make.getType() == MakeMonsterNoMove.typeid)
            set doDestroy = doDestroy or (.make.getType() == MakeMonsterSimplePatrol.typeid)
            set doDestroy = doDestroy or (.make.getType() == MakeMonsterMultiplePatrols.typeid)
            set doDestroy = doDestroy or (.make.getType() == MakeMonsterTeleport.typeid)
            set doDestroy = doDestroy or (.make.getType() == MakeDeleteMonsters.typeid)
            set doDestroy = doDestroy or (.make.getType() == MakeMeteor.typeid)
            set doDestroy = doDestroy or (.make.getType() == MakeCaster.typeid)
            set doDestroy = doDestroy or (.make.getType() == MakeDeleteMeteors.typeid)
            set doDestroy = doDestroy or (.make.getType() == MakeStart.typeid)
            set doDestroy = doDestroy or (.make.getType() == MakeEnd.typeid)
            set doDestroy = doDestroy or (.make.getType() == MakeVisibilityModifier.typeid)
            if (doDestroy) then
                call .destroyMake()
            endif
        endif
    endmethod
    
    method setMakingLevel takes Level level returns boolean
        local Level oldMakingLevel
        if (.makingLevel == level) then
            return false
        endif
        set oldMakingLevel = .makingLevel
        set .makingLevel = level
        call .destroyMakeIfForSpecificLevel()
        if (not IsLevelBeingMade(oldMakingLevel)) then
            call oldMakingLevel.activate(false)
            if (udg_levels.getCurrentLevel().getId() < oldMakingLevel.getId()) then
                call oldMakingLevel.activateVisibilities(false)
            endif
        endif
        set Level_earningLivesActivated = false
        call level.activate(true)
        set Level_earningLivesActivated = true
        return true
    endmethod
    
    method getMakingLevel takes nothing returns Level
        if (.makingLevel == 0) then
            return udg_levels.getCurrentLevel()
        endif
        return .makingLevel
    endmethod
    
    method isMakingCurrentLevel takes nothing returns boolean
        return (.makingLevel == 0)
    endmethod
    
    method destroyMake takes nothing returns boolean
        if (.make == 0) then
            return false
        endif
        call .make.destroy()
        set .make = 0
        return true
    endmethod
    
    method makeCreateNoMoveMonsters takes MonsterType mt, real facingAngle returns nothing
        //mode : noMove
        call .destroyMake()
        set .make = MakeMonsterNoMove.create(.hero, mt, facingAngle)
    endmethod
    
	method makeCreateSimplePatrolMonsters takes string mode, MonsterType mt returns nothing
        call .destroyMake()
		//modes : normal, string, auto
		if (mode == "normal" or mode == "string" or mode == "auto") then
			set .make = MakeMonsterSimplePatrol.create(.hero, mode, mt)
		endif
	endmethod	
    
	method makeCreateMultiplePatrolsMonsters takes string mode, MonsterType mt returns nothing
        call .destroyMake()
        //modes : normal, string
		if (mode == "normal" or mode == "string") then
			set .make = MakeMonsterMultiplePatrols.create(.hero, mode, mt)
		endif
	endmethod	
    
	method makeCreateTeleportMonsters takes string mode, MonsterType mt, real period, real angle returns nothing
        call .destroyMake()
        //modes : normal, string
		if (mode == "normal" or mode == "string") then
			set .make = MakeMonsterTeleport.create(.hero, mode, mt, period, angle)
		endif
	endmethod	
    
    method makeMmpOrMtNext takes nothing returns boolean
        if (.make == 0 or not(.make.getType() == MakeMonsterMultiplePatrols.typeid or .make.getType() == MakeMonsterTeleport.typeid)) then
            return false
        endif
        if (.make.getType() == MakeMonsterMultiplePatrols.typeid) then
            call MakeMonsterMultiplePatrols(integer(.make)).nextMonster()
        else
            call MakeMonsterTeleport(integer(.make)).nextMonster()
        endif
        return true
    endmethod
    
    method makeMonsterTeleportWait takes nothing returns boolean
        if (.make == 0 or .make.getType() != MakeMonsterTeleport.typeid) then
            return false
        endif
        return MakeMonsterTeleport(integer(.make)).addWaitPeriod()
    endmethod
    
    method makeMonsterTeleportHide takes nothing returns boolean
        if (.make == 0 or .make.getType() != MakeMonsterTeleport.typeid) then
            return false
        endif
        return MakeMonsterTeleport(integer(.make)).addHidePeriod()
    endmethod
    
    method makeCreateMonsterSpawn takes string label, MonsterType mt, string sens, real frequence returns nothing
        call .destroyMake()
        set .make = MakeMonsterSpawn.create(.hero, label, mt, sens, frequence)
    endmethod
	
	method makeDeleteMonsters takes string mode returns nothing
		call .destroyMake()
		//delete modes : all, noMove, move, simplePatrol, multiplePatrols, oneByOne
		if (mode != "all" and mode != "noMove" and mode != "move" and mode != "simplePatrol" and mode != "multiplePatrols" and mode != "oneByOne") then
			return
		endif
		set .make = MakeDeleteMonsters.create(.hero, mode)
	endmethod
	
	method makeSetUnitTeleportPeriod takes string mode, real period returns nothing
		call .destroyMake()
		//modes : oneByOne, twoClics
		if (mode != "twoClics" and mode != "oneByOne") then
			return
		endif
		set .make = MakeSetUnitTeleportPeriod.create(.hero, mode, period)
	endmethod
	
	method makeGetUnitTeleportPeriod takes nothing returns nothing
		call .destroyMake()
		set .make = MakeGetUnitTeleportPeriod.create(.hero)
	endmethod
	
	method makeSetUnitMonsterType takes string mode, MonsterType mt returns nothing
		call .destroyMake()
		//modes : oneByOne, twoClics
		if (mode != "twoClics" and mode != "oneByOne") then
			return
		endif
		set .make = MakeSetUnitMonsterType.create(.hero, mode, mt)
	endmethod
    
    method makeCreateMeteor takes nothing returns nothing
        call .destroyMake()
        set .make = MakeMeteor.create(.hero)
    endmethod
	
	method makeDeleteMeteors takes string mode returns nothing
		call .destroyMake()
		//delete modes : oneByOne, twoClics
		if (mode != "oneByOne" and mode != "twoClics") then
			return
		endif
		set .make = MakeDeleteMeteors.create(.hero, mode)
	endmethod
    
    method makeCreateCaster takes CasterType casterType, real angle returns nothing
        call .destroyMake()
        set .make = MakeCaster.create(.hero, casterType, angle)
    endmethod
	
	method makeDeleteCasters takes string mode returns nothing
		call .destroyMake()
		//delete modes : oneByOne, twoClics
		if (mode != "oneByOne" and mode != "twoClics") then
			return
		endif
		set .make = MakeDeleteCasters.create(.hero, mode)
	endmethod
	
	method makeCreateClearMobs takes real disableDuration returns nothing
		call .destroyMake()
		set .make = MakeClearMob.create(.hero, disableDuration)
	endmethod
	
	method makeDeleteClearMobs takes nothing returns nothing
		call .destroyMake()
		set .make = MakeDeleteClearMob.create(.hero)
	endmethod
    
    method makeCreateTerrain takes TerrainType terrainType returns nothing
        call .destroyMake()
        set .make = MakeTerrainCreate.create(.hero, terrainType)    
    endmethod
    
    method makeTerrainCopyPaste takes nothing returns nothing
        call .destroyMake()
        set .make = MakeTerrainCopyPaste.create(.hero)
    endmethod
    
    method makeTerrainVerticalSymmetry takes nothing returns nothing
        call .destroyMake()
        set .make = MakeTerrainVerticalSymmetry.create(.hero)
    endmethod
    
    method makeTerrainHorizontalSymmetry takes nothing returns nothing
        call .destroyMake()
        set .make = MakeTerrainHorizontalSymmetry.create(.hero)
    endmethod
    
    method makeTerrainHeight takes real radius, real height returns nothing
        call .destroyMake()
        set .make = MakeTerrainHeight.create(.hero, radius, height)
    endmethod
    
    method makeGetTerrainType takes nothing returns nothing
        call .destroyMake()
        set .make = MakeGetTerrainType.create(.hero)    
    endmethod
    
    method makeExchangeTerrains takes nothing returns nothing
        call .destroyMake()
        set .make = MakeExchangeTerrains.create(.hero)    
    endmethod  
    
    method makeCreateStart takes boolean forNext returns nothing
        call .destroyMake()
        set .make = MakeStart.create(.hero, forNext)
    endmethod 
    
    method makeCreateEnd takes nothing returns nothing
        call .destroyMake()
        set .make = MakeEnd.create(.hero)
    endmethod
    
    method makeCreateVisibilityModifier takes nothing returns nothing
        call .destroyMake()
        set .make = MakeVisibilityModifier.create(.hero)
    endmethod
    
    method cancelLastAction takes nothing returns boolean
        if (.make != 0) then
            if (.make.cancelLastAction()) then
                return true
            endif
        endif
        return .makeLastActions.cancelLastAction()
    endmethod
    
    method redoLastAction takes nothing returns boolean
        if (.makeLastActions.redoLastAction()) then
            return true
        endif
        if (.make != 0) then
            return .make.redoLastAction()
        endif
        return false
    endmethod
    
    method deleteSpecificActionsForLevel takes Level level returns nothing
        call .makeLastActions.deleteSpecificActionsForLevel(level)
    endmethod
    
    method newAction takes MakeAction action returns MakeAction
        return .makeLastActions.newAction(action)
    endmethod
    
    method destroyAllSavedActions takes nothing returns nothing
        call .makeLastActions.destroyAllActions()
    endmethod
    
    method destroyCancelledActions takes nothing returns nothing
        call .makeLastActions.destroyCancelledActions()
    endmethod
    
    
//for gravity gestion    
    method getLastZ takes nothing returns real
        return .lastZ
    endmethod
    
    method setLastZ takes real lastZ returns nothing
        set .lastZ = lastZ
    endmethod  
    
    method getOldDiffZ takes nothing returns real
        return .oldDiffZ
    endmethod
    
    method setOldDiffZ takes real oldDiffZ returns nothing
        set .oldDiffZ = oldDiffZ
    endmethod
    
    method getSpeedZ takes nothing returns real
        return .speedZ
    endmethod
    
    method setSpeedZ takes real speedZ returns nothing
        set .speedZ = speedZ
    endmethod
    
    
//coop reviving
    method coopReviveHero takes nothing returns nothing
    	local Escaper mirrorEscaper = GetMirrorEscaper(this)
    	local unit mirrorHero = mirrorEscaper.getHero()

        call .revive(GetUnitX(.hero), GetUnitY(.hero))
        call RunSoundOnUnit(udg_coop_index_son, .hero)
        call SetUnitAnimation(.hero, "channel")
        call .absoluteSlideSpeed(0)
        call .setCoopInvul(true)

        call mirrorEscaper.revive(GetUnitX(mirrorHero), GetUnitY(mirrorHero))
        call RunSoundOnUnit(udg_coop_index_son, mirrorHero)
        call SetUnitAnimation(mirrorHero, "channel")
        call mirrorEscaper.absoluteSlideSpeed(0)
        call mirrorEscaper.setCoopInvul(true)

        call TriggerSleepAction(1.4)

        call .stopAbsoluteSlideSpeed()
        call SetUnitAnimation(.hero, "stand")

        call mirrorEscaper.stopAbsoluteSlideSpeed()
        call SetUnitAnimation(mirrorHero, "stand")

        call TriggerSleepAction(0.6)

        call .setCoopInvul(false)
        call mirrorEscaper.setCoopInvul(false)
    endmethod
    
    method isCoopInvul takes nothing returns boolean
        return .coopInvul
    endmethod
    
    method setCoopInvul takes boolean invul returns nothing
        set .coopInvul = invul
    endmethod
    
    method enableTrigCoopRevive takes nothing returns nothing
        call ShowUnit(.powerCircle, true)
        call SetUnitPathing(.powerCircle, false)
        call SetUnitPosition(.powerCircle, GetUnitX(.hero), GetUnitY(.hero))
        call ShowUnit(.dummyPowerCircle, true)
        call SetUnitPathing(.dummyPowerCircle, false)
        call SetUnitPosition(.dummyPowerCircle, GetUnitX(.hero), GetUnitY(.hero))
    endmethod
    
    method refreshCerclePosition takes nothing returns nothing
        if (not IsUnitHidden(.powerCircle)) then
            call SetUnitPosition(.powerCircle, GetUnitX(.hero), GetUnitY(.hero))
            call SetUnitPosition(.dummyPowerCircle, GetUnitX(.hero), GetUnitY(.hero))
        endif
    endmethod
    
    
endstruct



endlibrary