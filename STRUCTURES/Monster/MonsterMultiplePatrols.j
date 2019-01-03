//TESH.scrollpos=293
//TESH.alwaysfold=0
library MonsterMultiplePatrols needs MonsterInterface //extends Monster [8000]



private function NewRegion takes real x, real y returns region
    local rect r = Rect(x-16, y-16, x+16, y+16)
    local region R = CreateRegion()
    call RegionAddRect(R, r)
    call RemoveRect(r)
    set r = null
    return R
endfunction

function MonsterMultiplePatrols_move_Actions takes nothing returns nothing 
    local Monster monster
    local MonsterMultiplePatrols MMP
    if (IsHero(GetTriggerUnit())) then
        return
    endif
    set monster = Monster(GetUnitUserData(GetTriggerUnit()))
    if (monster.getType() == MonsterMultiplePatrols.typeid) then
        set MMP = MonsterMultiplePatrols(integer(monster))
        if (MMP.getCurrentTrigger() == GetTriggeringTrigger()) then
            call MMP.nextMove()
        endif
    endif
endfunction
//===========================================================


struct MonsterMultiplePatrols extends Monster
	static integer NB_MAX_LOC = 20  
    static integer nbInstances = 0 
	static real array X [20]
	static real array Y [20]
	static integer staticLastLocInd = -1
    
    static method count takes nothing returns integer
        return MonsterMultiplePatrols.nbInstances
    endmethod
	
	static method storeNewLoc takes real x, real y returns boolean //retourne true si le nouveau point a pu être stocké
		if (MonsterMultiplePatrols.staticLastLocInd >= MonsterMultiplePatrols.NB_MAX_LOC - 1) then
			return false
		endif
		set MonsterMultiplePatrols.staticLastLocInd = MonsterMultiplePatrols.staticLastLocInd + 1
		set MonsterMultiplePatrols.X[MonsterMultiplePatrols.staticLastLocInd] = x
		set MonsterMultiplePatrols.Y[MonsterMultiplePatrols.staticLastLocInd] = y	
		return true
	endmethod
    
    static method destroyLocs takes nothing returns nothing
        set MonsterMultiplePatrols.staticLastLocInd = -1
    endmethod
    
    
    private integer id
    unit u
    private MonsterType mt
    private timer disablingTimer
    //color
    private integer baseColorId
    private real vcRed
    private real vcGreen
    private real vcBlue
    private real vcTransparency
    
	private integer lastLocInd
	private integer currentMove
    private integer sens //0 : normal toujours positif, 1 : sens normal avec changement, 2 : sens inversé avec changement
    
    //! textmacro MMP_Variables takes N
	private real x$N$
	private real y$N$
	private region r$N$
	trigger t$N$
	//! endtextmacro
	//! runtextmacro MMP_Variables( "0"  )
	//! runtextmacro MMP_Variables( "1"  )
	//! runtextmacro MMP_Variables( "2"  )
	//! runtextmacro MMP_Variables( "3"  )
	//! runtextmacro MMP_Variables( "4"  )
	//! runtextmacro MMP_Variables( "5"  )
	//! runtextmacro MMP_Variables( "6"  )
	//! runtextmacro MMP_Variables( "7"  )
	//! runtextmacro MMP_Variables( "8"  )
	//! runtextmacro MMP_Variables( "9"  )
	//! runtextmacro MMP_Variables( "10" )
	//! runtextmacro MMP_Variables( "11" )
	//! runtextmacro MMP_Variables( "12" )
	//! runtextmacro MMP_Variables( "13" )
	//! runtextmacro MMP_Variables( "14" )
	//! runtextmacro MMP_Variables( "15" )
	//! runtextmacro MMP_Variables( "16" )
	//! runtextmacro MMP_Variables( "17" )
	//! runtextmacro MMP_Variables( "18" )
	//! runtextmacro MMP_Variables( "19" )
    trigger currentTrigger
    
    method getId takes nothing returns integer
        return .id
    endmethod
    
    method setId takes integer id returns MonsterMultiplePatrols
        if (id == .id) then
            return this
        endif
        call MonsterHashtableSetMonsterId(this, .id, id)
        set .id = id
        return this
    endmethod
    
    method getCurrentTrigger takes nothing returns trigger
        return .currentTrigger
    endmethod
	
	method removeUnit takes nothing returns nothing
        if (.u != null) then
            call GroupRemoveUnit(monstersClickable, .u)
            call RemoveUnit(.u)
            set .u = null
        endif
	endmethod
    
    method killUnit takes nothing returns nothing
        if (.u != null and IsUnitAliveBJ(.u)) then
            call KillUnit(.u)
        endif
    endmethod
    
    private method onDestroy takes nothing returns nothing
        loop
            exitwhen (not .destroyLastLoc())
        endloop
		if (.u != null) then
			call .removeUnit()
		endif
        call .level.monstersMultiplePatrols.setMonsterNull(.arrayId)
        set MonsterMultiplePatrols.nbInstances = MonsterMultiplePatrols.nbInstances - 1
        if (ClearTriggerMobId2ClearMob(.id) != 0) then
            call ClearTriggerMobId2ClearMob(.id).destroy()
        endif
        call MonsterHashtableRemoveMonsterId(.id)
    endmethod
	
	method disableTrigger takes integer id returns nothing
	//! textmacro MMP_disableTrigger takes N
	if (id == $N$) then
		call DisableTrigger(.t$N$)
		return
	endif
	//! endtextmacro
	//! runtextmacro MMP_disableTrigger( "0"  )
	//! runtextmacro MMP_disableTrigger( "1"  )
	//! runtextmacro MMP_disableTrigger( "2"  )
	//! runtextmacro MMP_disableTrigger( "3"  )
	//! runtextmacro MMP_disableTrigger( "4"  )
	//! runtextmacro MMP_disableTrigger( "5"  )
	//! runtextmacro MMP_disableTrigger( "6"  )
	//! runtextmacro MMP_disableTrigger( "7"  )
	//! runtextmacro MMP_disableTrigger( "8"  )
	//! runtextmacro MMP_disableTrigger( "9"  )
	//! runtextmacro MMP_disableTrigger( "10" )
	//! runtextmacro MMP_disableTrigger( "11" )
	//! runtextmacro MMP_disableTrigger( "12" )
	//! runtextmacro MMP_disableTrigger( "13" )
	//! runtextmacro MMP_disableTrigger( "14" )
	//! runtextmacro MMP_disableTrigger( "15" )
	//! runtextmacro MMP_disableTrigger( "16" )
	//! runtextmacro MMP_disableTrigger( "17" )
	//! runtextmacro MMP_disableTrigger( "18" )
	//! runtextmacro MMP_disableTrigger( "19" )
	endmethod
	
	method activateMove takes integer id returns nothing
	//! textmacro MMP_activateMove takes N
	if (id == $N$) then
		call EnableTrigger(.t$N$)
        set .currentTrigger = .t$N$
		call IssuePointOrder(.u, "move", .x$N$, .y$N$)
		return
	endif
	//! endtextmacro
	//! runtextmacro MMP_activateMove( "0"  )
	//! runtextmacro MMP_activateMove( "1"  )
	//! runtextmacro MMP_activateMove( "2"  )
	//! runtextmacro MMP_activateMove( "3"  )
	//! runtextmacro MMP_activateMove( "4"  )
	//! runtextmacro MMP_activateMove( "5"  )
	//! runtextmacro MMP_activateMove( "6"  )
	//! runtextmacro MMP_activateMove( "7"  )
	//! runtextmacro MMP_activateMove( "8"  )
	//! runtextmacro MMP_activateMove( "9"  )
	//! runtextmacro MMP_activateMove( "10" )
	//! runtextmacro MMP_activateMove( "11" )
	//! runtextmacro MMP_activateMove( "12" )
	//! runtextmacro MMP_activateMove( "13" )
	//! runtextmacro MMP_activateMove( "14" )
	//! runtextmacro MMP_activateMove( "15" )
	//! runtextmacro MMP_activateMove( "16" )
	//! runtextmacro MMP_activateMove( "17" )
	//! runtextmacro MMP_activateMove( "18" )
	//! runtextmacro MMP_activateMove( "19" )
	endmethod
	
	method nextMove takes nothing returns nothing
		call .disableTrigger(.currentMove)
        if (.sens == 0 or .sens == 1) then
       		if (.currentMove >= .lastLocInd) then
                if (.sens == 0) then
                    set .currentMove = 0
                else
                    set .sens = 2
                    set .currentMove = .currentMove - 1
                endif
            else
                set .currentMove = .currentMove + 1
            endif
        else //sens == 2
            if (.currentMove <= 0) then
                set .sens = 1
                set .currentMove = 1
            else
                set .currentMove = .currentMove - 1
            endif
        endif   
		call .activateMove(.currentMove)
	endmethod
	
	static method create takes MonsterType mt, string mode returns MonsterMultiplePatrols
        //mode == "normal" (0, 1, 2, 3, 0 , 1...) ou mode == "string" (0, 1, 2, 3, 2, 1...)
		local MonsterMultiplePatrols m
		local integer i
		
        if (mode != "normal" and mode != "string") then
            return 0
        endif
        
        set m = MonsterMultiplePatrols.allocate()
        set MonsterMultiplePatrols.nbInstances = MonsterMultiplePatrols.nbInstances + 1	
        set m.mt = mt
        if (mode == "normal") then
            set m.sens = 0
        else
            set m.sens = 1
        endif
		
		//! textmacro MMP_create takes N
		if ($N$ <= MonsterMultiplePatrols.staticLastLocInd) then
			set m.x$N$ = MonsterMultiplePatrols.X[$N$]
			set m.y$N$ = MonsterMultiplePatrols.Y[$N$]
			set m.r$N$ = NewRegion(m.x$N$, m.y$N$)
			set m.t$N$ = CreateTrigger()
			call DisableTrigger(m.t$N$)
			call TriggerAddAction(m.t$N$, function MonsterMultiplePatrols_move_Actions)
			call TriggerRegisterEnterRegionSimple(m.t$N$, m.r$N$)
		endif
		//! endtextmacro
		//! runtextmacro MMP_create( "0"  )
		//! runtextmacro MMP_create( "1"  )
		//! runtextmacro MMP_create( "2"  )
		//! runtextmacro MMP_create( "3"  )
		//! runtextmacro MMP_create( "4"  )
		//! runtextmacro MMP_create( "5"  )
		//! runtextmacro MMP_create( "6"  )
		//! runtextmacro MMP_create( "7"  )
		//! runtextmacro MMP_create( "8"  )
		//! runtextmacro MMP_create( "9"  )
		//! runtextmacro MMP_create( "10" )
		//! runtextmacro MMP_create( "11" )
		//! runtextmacro MMP_create( "12" )
		//! runtextmacro MMP_create( "13" )
		//! runtextmacro MMP_create( "14" )
		//! runtextmacro MMP_create( "15" )
		//! runtextmacro MMP_create( "16" )
		//! runtextmacro MMP_create( "17" )
		//! runtextmacro MMP_create( "18" )
		//! runtextmacro MMP_create( "19" )
		
		set m.lastLocInd = MonsterMultiplePatrols.staticLastLocInd
        //call Text_A("test, lastLocInd == " + I2S(m.lastLocInd))
		set m.currentMove = -1
		call MonsterMultiplePatrols.destroyLocs()
        set m.life = 0
        set m.id = GetNextMonsterId()
        call MonsterHashtableSetMonsterId(m, NO_ID, m.id)
        set m.disablingTimer = null
        //color
        set m.baseColorId = -1
        set m.vcRed = 100
        set m.vcGreen = 100
        set m.vcBlue = 100
        set m.vcTransparency = 0
		return m
	endmethod
	
	method createUnit takes nothing returns nothing
        local ClearMob clearMob = ClearTriggerMobId2ClearMob(.id)
        local timer disablingTimer = .disablingTimer
        local boolean previouslyEnabled = .u != null
        local boolean isMonsterAlive = IsUnitAliveBJ(.u)
        if (previouslyEnabled) then
            call .removeUnit()
        endif
		if (.lastLocInd <= 0) then
			return
		endif
		set .u = NewPatrolMonster(.mt, .x0, .y0, .x1, .y1)
        call SetUnitUserData(.u, .id)
        set .currentMove = 1
        if (.sens == 2) then
            set .sens = 1
        endif
        call EnableTrigger(.t1)
        set .currentTrigger = .t1
        if (.mt.isClickable()) then
            set .life = .mt.getMaxLife()
            call GroupAddUnit(monstersClickable, .u)
        endif
        if (previouslyEnabled) then
            if (disablingTimer != null and TimerGetRemaining(disablingTimer) > 0) then
                call .temporarilyDisable(disablingTimer)
            endif
            if (not isMonsterAlive) then
                call .killUnit()
            endif
            if (.baseColorId != -1) then
                if (.baseColorId == 0) then
                    call SetUnitColor(.u, PLAYER_COLOR_RED)
                else
                    call SetUnitColor(.u, ConvertPlayerColor(.baseColorId))
                endif
            endif
            call SetUnitVertexColorBJ(.u, .vcRed, .vcGreen, .vcBlue, .vcTransparency)
        endif
        if (clearMob != 0) then
            call clearMob.redoTriggerMobPermanentEffect()
        endif
        set disablingTimer = null
	endmethod
	
    method getLife takes nothing returns integer
        return .life
    endmethod
    
    method setLife takes integer life returns nothing
        set .life = life
        if (life > 0) then
            call SetUnitLifeBJ(.u, I2R(life) - 0.5)
        else
            call .killUnit()
        endif
    endmethod
    
    method getX takes integer id returns real
        //! textmacro MMP_getX takes N
        if (id == $N$) then
            return .x$N$
        endif
        //! endtextmacro
		//! runtextmacro MMP_getX( "0"  )
		//! runtextmacro MMP_getX( "1"  )
		//! runtextmacro MMP_getX( "2"  )
		//! runtextmacro MMP_getX( "3"  )
		//! runtextmacro MMP_getX( "4"  )
		//! runtextmacro MMP_getX( "5"  )
		//! runtextmacro MMP_getX( "6"  )
		//! runtextmacro MMP_getX( "7"  )
		//! runtextmacro MMP_getX( "8"  )
		//! runtextmacro MMP_getX( "9"  )
		//! runtextmacro MMP_getX( "10" )
		//! runtextmacro MMP_getX( "11" )
		//! runtextmacro MMP_getX( "12" )
		//! runtextmacro MMP_getX( "13" )
		//! runtextmacro MMP_getX( "14" )
		//! runtextmacro MMP_getX( "15" )
		//! runtextmacro MMP_getX( "16" )
		//! runtextmacro MMP_getX( "17" )
		//! runtextmacro MMP_getX( "18" )
		//! runtextmacro MMP_getX( "19" )
        return 0.    
    endmethod
    
    method getY takes integer id returns real
        //! textmacro MMP_getY takes N
        if (id == $N$) then
            return .y$N$
        endif
        //! endtextmacro
		//! runtextmacro MMP_getY( "0"  )
		//! runtextmacro MMP_getY( "1"  )
		//! runtextmacro MMP_getY( "2"  )
		//! runtextmacro MMP_getY( "3"  )
		//! runtextmacro MMP_getY( "4"  )
		//! runtextmacro MMP_getY( "5"  )
		//! runtextmacro MMP_getY( "6"  )
		//! runtextmacro MMP_getY( "7"  )
		//! runtextmacro MMP_getY( "8"  )
		//! runtextmacro MMP_getY( "9"  )
		//! runtextmacro MMP_getY( "10" )
		//! runtextmacro MMP_getY( "11" )
		//! runtextmacro MMP_getY( "12" )
		//! runtextmacro MMP_getY( "13" )
		//! runtextmacro MMP_getY( "14" )
		//! runtextmacro MMP_getY( "15" )
		//! runtextmacro MMP_getY( "16" )
		//! runtextmacro MMP_getY( "17" )
		//! runtextmacro MMP_getY( "18" )
		//! runtextmacro MMP_getY( "19" )
        return 0.    
    endmethod
    
    method destroyLastLoc takes nothing returns boolean
		if (.lastLocInd == 1) then
            call DisableTrigger(.t0)
			call DestroyTrigger(.t1)
			set .t1 = null
			call RemoveRegion(.r1)
			set .r1 = null
			call RemoveUnit(.u)
			set .u = null
		endif
        //! textmacro MMP_destroyLastLoc takes N
        if (.lastLocInd == $N$) then
            call DestroyTrigger(.t$N$)
            set .t$N$ = null
            call RemoveRegion(.r$N$)
            set .r$N$ = null
            if ($N$ == .currentMove) then
                set .currentMove = .currentMove - 1
                call .activateMove(.currentMove)
            endif
        endif
        //! endtextmacro
		//! runtextmacro MMP_destroyLastLoc( "0"  )
		//! runtextmacro MMP_destroyLastLoc( "2"  )
		//! runtextmacro MMP_destroyLastLoc( "3"  )
		//! runtextmacro MMP_destroyLastLoc( "4"  )
		//! runtextmacro MMP_destroyLastLoc( "5"  )
		//! runtextmacro MMP_destroyLastLoc( "6"  )
		//! runtextmacro MMP_destroyLastLoc( "7"  )
		//! runtextmacro MMP_destroyLastLoc( "8"  )
		//! runtextmacro MMP_destroyLastLoc( "9"  )
		//! runtextmacro MMP_destroyLastLoc( "10" )
		//! runtextmacro MMP_destroyLastLoc( "11" )
		//! runtextmacro MMP_destroyLastLoc( "12" )
		//! runtextmacro MMP_destroyLastLoc( "13" )
		//! runtextmacro MMP_destroyLastLoc( "14" )
		//! runtextmacro MMP_destroyLastLoc( "15" )
		//! runtextmacro MMP_destroyLastLoc( "16" )
		//! runtextmacro MMP_destroyLastLoc( "17" )
		//! runtextmacro MMP_destroyLastLoc( "18" )
		//! runtextmacro MMP_destroyLastLoc( "19" )
        if (.lastLocInd < 0) then
            return false
        endif
        set .lastLocInd = .lastLocInd - 1
        return true
    endmethod
	
	method addNewLocAt takes integer id, real x, real y returns nothing
		//! textmacro MMP_addNewLocAt takes N
		if (id == $N$) then
			set .x$N$ = x
			set .y$N$ = y
			set .r$N$ = NewRegion(x, y)
			set .t$N$ = CreateTrigger()
			call DisableTrigger(.t$N$)
			call TriggerAddAction(.t$N$, function MonsterMultiplePatrols_move_Actions)
			call TriggerRegisterEnterRegionSimple(.t$N$, .r$N$)
			return
		endif
		//! endtextmacro
		//! runtextmacro MMP_addNewLocAt( "0"  )
		//! runtextmacro MMP_addNewLocAt( "1"  )
		//! runtextmacro MMP_addNewLocAt( "2"  )
		//! runtextmacro MMP_addNewLocAt( "3"  )
		//! runtextmacro MMP_addNewLocAt( "4"  )
		//! runtextmacro MMP_addNewLocAt( "5"  )
		//! runtextmacro MMP_addNewLocAt( "6"  )
		//! runtextmacro MMP_addNewLocAt( "7"  )
		//! runtextmacro MMP_addNewLocAt( "8"  )
		//! runtextmacro MMP_addNewLocAt( "9"  )
		//! runtextmacro MMP_addNewLocAt( "10" )
		//! runtextmacro MMP_addNewLocAt( "11" )
		//! runtextmacro MMP_addNewLocAt( "12" )
		//! runtextmacro MMP_addNewLocAt( "13" )
		//! runtextmacro MMP_addNewLocAt( "14" )
		//! runtextmacro MMP_addNewLocAt( "15" )
		//! runtextmacro MMP_addNewLocAt( "16" )
		//! runtextmacro MMP_addNewLocAt( "17" )
		//! runtextmacro MMP_addNewLocAt( "18" )
		//! runtextmacro MMP_addNewLocAt( "19" )
	endmethod
	
	method addNewLoc takes real x, real y returns integer
        if (.lastLocInd >= MonsterMultiplePatrols.NB_MAX_LOC - 1) then //nombre limite de points atteint
			return 3 //erreur 3
		endif
        if (GetLocDist(.getX(.lastLocInd), .getY(.lastLocInd), x, y) <= PATROL_DISTANCE_MIN) then
            return 2 //erreur 2
        endif
        if (.sens == 0 and GetLocDist(.x0, .y0, x, y) <= PATROL_DISTANCE_MIN) then
            return 1 //erreur 1
        endif
		set .lastLocInd = .lastLocInd + 1
		call .addNewLocAt(.lastLocInd, x, y)
		if (.lastLocInd == 1) then
            call .createUnit()
		endif
		return 0 //c'est bon, pas d'erreur
	endmethod   	
    
    method getMonsterType takes nothing returns MonsterType
        return .mt
    endmethod
    
    method setMonsterType takes MonsterType mt returns boolean
        if (mt == 0 or mt == .mt) then
            return false
        endif
        set .mt = mt
        call .createUnit()
        return true
    endmethod
    
    method temporarilyDisable takes timer disablingTimer returns nothing
        if (.disablingTimer == null or .disablingTimer == disablingTimer or TimerGetRemaining(disablingTimer) > TimerGetRemaining(.disablingTimer)) then
            set .disablingTimer = disablingTimer
            call UnitRemoveAbility(.u, .mt.getImmolationSkill())
            call SetUnitVertexColorBJ(.u, .vcRed, .vcGreen, .vcBlue, DISABLE_TRANSPARENCY)
            set .vcTransparency = DISABLE_TRANSPARENCY
        endif
    endmethod
    
    method temporarilyEnable takes timer disablingTimer returns nothing
        if (.disablingTimer == disablingTimer) then //on ne réactive le mob que si le disablingTimer correspond bien au bon, celui restant le plus longtemps
            call UnitAddAbility(.u, .mt.getImmolationSkill())
            call SetUnitVertexColorBJ(.u, .vcRed, .vcGreen, .vcBlue, 0)
            set .vcTransparency = 0
        endif
    endmethod
    
    method setBaseColor takes string colorString returns nothing
        local integer baseColorId
        if (IsColorString(colorString)) then
			set baseColorId = ColorString2Id(colorString)
            if (baseColorId < 0 or baseColorId > 12) then
                return
            endif
            set .baseColorId = baseColorId
            if (.u != null) then
                if (baseColorId == 0) then
                    call SetUnitColor(.u, PLAYER_COLOR_RED)
                else
                    call SetUnitColor(.u, ConvertPlayerColor(baseColorId))
                endif
            endif
        endif
    endmethod
    
    method setVertexColor takes real vcRed, real vcGreen, real vcBlue returns nothing
        set .vcRed = vcRed
        set .vcGreen = vcGreen
        set .vcBlue = vcBlue
        if (.u != null) then
            call SetUnitVertexColorBJ(.u, vcRed, vcGreen, vcBlue, .vcTransparency)
        endif
    endmethod
    
    method reinitColor takes nothing returns nothing
        local integer initBaseColorId
        //changement valeurs des champs
        set .baseColorId = -1
        set .vcRed = 100
        set .vcGreen = 100
        set .vcBlue = 100
        set .vcTransparency = 0
        //changement couleur du mob actuel
        if (.u != null) then
            if (MOBS_VARIOUS_COLORS) then
                set initBaseColorId = GetPlayerId(GetOwningPlayer(.u))
            else
                set initBaseColorId = 12
            endif
            if (initBaseColorId == 0) then
                call SetUnitColor(.u, PLAYER_COLOR_RED)
            else
                call SetUnitColor(.u, ConvertPlayerColor(initBaseColorId))
            endif
            call SetUnitVertexColorBJ(.u, .vcRed, .vcGreen, .vcBlue, .vcTransparency)
        endif
    endmethod    
    
    method toString takes nothing returns string
        local string str
        if (.mt.theAlias != null and .mt.theAlias != "") then
            set str = .mt.theAlias + CACHE_SEPARATEUR_PARAM
        else
            set str = .mt.label + CACHE_SEPARATEUR_PARAM
        endif
        set str = str + I2S(.id) + CACHE_SEPARATEUR_PARAM
        if (.sens > 0) then
            set str = str + "string"
        else
            set str = str + "normal"
        endif
        //! textmacro MMP_loc_toString takes N
        if (.lastLocInd < $N$) then
            return str
        endif
        set str = str + CACHE_SEPARATEUR_PARAM + I2S(R2I(.x$N$)) + CACHE_SEPARATEUR_PARAM + I2S(R2I(.y$N$))
        //! endtextmacro
		//! runtextmacro MMP_loc_toString( "0"  )
		//! runtextmacro MMP_loc_toString( "1"  )
		//! runtextmacro MMP_loc_toString( "2"  )
		//! runtextmacro MMP_loc_toString( "3"  )
		//! runtextmacro MMP_loc_toString( "4"  )
		//! runtextmacro MMP_loc_toString( "5"  )
		//! runtextmacro MMP_loc_toString( "6"  )
		//! runtextmacro MMP_loc_toString( "7"  )
		//! runtextmacro MMP_loc_toString( "8"  )
		//! runtextmacro MMP_loc_toString( "9"  )
		//! runtextmacro MMP_loc_toString( "10" )
		//! runtextmacro MMP_loc_toString( "11" )
		//! runtextmacro MMP_loc_toString( "12" )
		//! runtextmacro MMP_loc_toString( "13" )
		//! runtextmacro MMP_loc_toString( "14" )
		//! runtextmacro MMP_loc_toString( "15" )
		//! runtextmacro MMP_loc_toString( "16" )
		//! runtextmacro MMP_loc_toString( "17" )
		//! runtextmacro MMP_loc_toString( "18" )
		//! runtextmacro MMP_loc_toString( "19" )
        return str
    endmethod
endstruct



endlibrary
