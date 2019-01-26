//TESH.scrollpos=183
//TESH.alwaysfold=0
library MonsterTeleport initializer InitMonsterTeleport needs MonsterInterface //extends Monster [8000]


globals
    constant real WAIT = 1000000
    constant real HIDE = 2000000
    constant real MONSTER_TELEPORT_PERIOD_MIN = 0.1
    constant real MONSTER_TELEPORT_PERIOD_MAX = 10
    public hashtable monsterTeleportHashtable // 0: timer
endglobals


function MonsterTeleport_move_Actions takes nothing returns nothing 
    local Monster monster
    local MonsterTeleport MT = MonsterTeleport(LoadInteger(monsterTeleportHashtable, 0, GetHandleId(GetExpiredTimer())))
    if (MT == 0) then
        return
    endif
    call MT.nextMove()
endfunction
//===========================================================


struct MonsterTeleport extends Monster
	static integer NB_MAX_LOC = 20  
    static integer nbInstances = 0 
	static real array X [20]
	static real array Y [20]
	static integer staticLastLocInd = -1
    
    static method count takes nothing returns integer
        return MonsterTeleport.nbInstances
    endmethod
	
	static method storeNewLoc takes real x, real y returns boolean //retourne true si le nouveau point a pu être stocké
		if (MonsterTeleport.staticLastLocInd >= MonsterTeleport.NB_MAX_LOC - 1) then
			return false
		endif
		set MonsterTeleport.staticLastLocInd = MonsterTeleport.staticLastLocInd + 1
		set MonsterTeleport.X[MonsterTeleport.staticLastLocInd] = x
		set MonsterTeleport.Y[MonsterTeleport.staticLastLocInd] = y	
		return true
	endmethod
    
    static method destroyLocs takes nothing returns nothing
        set MonsterTeleport.staticLastLocInd = -1
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
    
    private real period
    private real angle
    
	private integer lastLocInd
	private integer currentLoc
    private integer sens //0 : normal toujours positif, 1 : sens normal avec changement, 2 : sens inversé avec changement
    
    //! textmacro MT_Variables takes N
	private real x$N$
	private real y$N$
	//! endtextmacro
	//! runtextmacro MT_Variables( "0"  )
	//! runtextmacro MT_Variables( "1"  )
	//! runtextmacro MT_Variables( "2"  )
	//! runtextmacro MT_Variables( "3"  )
	//! runtextmacro MT_Variables( "4"  )
	//! runtextmacro MT_Variables( "5"  )
	//! runtextmacro MT_Variables( "6"  )
	//! runtextmacro MT_Variables( "7"  )
	//! runtextmacro MT_Variables( "8"  )
	//! runtextmacro MT_Variables( "9"  )
	//! runtextmacro MT_Variables( "10" )
	//! runtextmacro MT_Variables( "11" )
	//! runtextmacro MT_Variables( "12" )
	//! runtextmacro MT_Variables( "13" )
	//! runtextmacro MT_Variables( "14" )
	//! runtextmacro MT_Variables( "15" )
	//! runtextmacro MT_Variables( "16" )
	//! runtextmacro MT_Variables( "17" )
	//! runtextmacro MT_Variables( "18" )
	//! runtextmacro MT_Variables( "19" )
    private timer t
    
    
    method getId takes nothing returns integer
        return .id
    endmethod
    
    method setId takes integer id returns MonsterTeleport
        if (id == .id) then
            return this
        endif
        call MonsterHashtableSetMonsterId(this, .id, id)
        set .id = id
        call MonsterIdHasBeenSetTo(id)
        return this
    endmethod
        	
	method removeUnit takes nothing returns nothing
        if (.u != null) then
            call GroupRemoveUnit(monstersClickable, .u)
            call RemoveUnit(.u)
            set .u = null
            call PauseTimer(.t)
        endif
	endmethod
    
    method killUnit takes nothing returns nothing
        if (.u != null and IsUnitAliveBJ(.u)) then
            call KillUnit(.u)
            call PauseTimer(.t)
        endif
    endmethod
    
    private method onDestroy takes nothing returns nothing
		if (.u != null) then
			call .removeUnit()
		endif
        call .level.monstersTeleport.setMonsterNull(.arrayId)
        set MonsterTeleport.nbInstances = MonsterTeleport.nbInstances - 1
        call RemoveSavedInteger(monsterTeleportHashtable, 0, GetHandleId(.t))
        call DestroyTimer(.t)
        set .t = null
        if (ClearTriggerMobId2ClearMob(.id) != 0) then
            call ClearTriggerMobId2ClearMob(.id).destroy()
        endif
        call MonsterHashtableRemoveMonsterId(.id)
    endmethod
	
	static method create takes MonsterType mt, real period, real angle, string mode returns MonsterTeleport
        //mode == "normal" (0, 1, 2, 3, 0 , 1...) ou mode == "string" (0, 1, 2, 3, 2, 1...)
		local MonsterTeleport m
		local integer i
		
        if ((mode != "normal" and mode != "string") or period < MONSTER_TELEPORT_PERIOD_MIN or period > MONSTER_TELEPORT_PERIOD_MAX) then
            return 0
        endif
        
        set m = MonsterTeleport.allocate()
        set MonsterTeleport.nbInstances = MonsterTeleport.nbInstances + 1	
        set m.mt = mt
        if (mode == "normal") then
            set m.sens = 0
        else
            set m.sens = 1
        endif
        set m.angle = angle
        set m.period = period
        set m.t = CreateTimer()
        call SaveInteger(monsterTeleportHashtable, 0, GetHandleId(m.t), integer(m))
		
		//! textmacro MT_create takes N
		if ($N$ <= MonsterTeleport.staticLastLocInd) then
			set m.x$N$ = MonsterTeleport.X[$N$]
			set m.y$N$ = MonsterTeleport.Y[$N$]
		endif
		//! endtextmacro
		//! runtextmacro MT_create( "0"  )
		//! runtextmacro MT_create( "1"  )
		//! runtextmacro MT_create( "2"  )
		//! runtextmacro MT_create( "3"  )
		//! runtextmacro MT_create( "4"  )
		//! runtextmacro MT_create( "5"  )
		//! runtextmacro MT_create( "6"  )
		//! runtextmacro MT_create( "7"  )
		//! runtextmacro MT_create( "8"  )
		//! runtextmacro MT_create( "9"  )
		//! runtextmacro MT_create( "10" )
		//! runtextmacro MT_create( "11" )
		//! runtextmacro MT_create( "12" )
		//! runtextmacro MT_create( "13" )
		//! runtextmacro MT_create( "14" )
		//! runtextmacro MT_create( "15" )
		//! runtextmacro MT_create( "16" )
		//! runtextmacro MT_create( "17" )
		//! runtextmacro MT_create( "18" )
		//! runtextmacro MT_create( "19" )
		
		set m.lastLocInd = MonsterTeleport.staticLastLocInd
        //call Text_A("test, lastLocInd == " + I2S(m.lastLocInd))
		set m.currentLoc = -1
		call MonsterTeleport.destroyLocs()
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
    
    method setPeriod takes real period returns boolean
        if (period < MONSTER_TELEPORT_PERIOD_MIN or period > MONSTER_TELEPORT_PERIOD_MAX) then
            return false
        endif
        set .period = period
        if (.u != null and IsUnitAliveBJ(.u)) then
            call TimerStart(.t, .period, true, function MonsterTeleport_move_Actions)
        endif
        return true
    endmethod
    
    method getPeriod takes nothing returns real
        return .period
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
		set .u = NewImmobileMonster(.mt, .x0, .y0, .angle)
        call SetUnitUserData(.u, .id)
        set .currentLoc = 0
        if (.sens == 2) then
            set .sens = 1
        endif
        call TimerStart(.t, .period, true, function MonsterTeleport_move_Actions)
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
    
	method nextMove takes nothing returns nothing
        local real x
        local real y
        if (.sens == 0 or .sens == 1) then
       		if (.currentLoc >= .lastLocInd) then
                if (.sens == 0) then
                    set .currentLoc = 0
                else
                    set .sens = 2
                    set .currentLoc = .currentLoc - 1
                endif
            else
                set .currentLoc = .currentLoc + 1
            endif
        else //sens == 2
            if (.currentLoc <= 0) then
                set .sens = 1
                set .currentLoc = 1
            else
                set .currentLoc = .currentLoc - 1
            endif
        endif   
        set x = .getX(.currentLoc)
        set y = .getY(.currentLoc)
		if (x == HIDE and y == HIDE) then
            call ShowUnit(.u, false)
        elseif (x != WAIT or y != WAIT) then
            if (IsUnitHidden(.u)) then
                call ShowUnit(.u, true)
                if (not .mt.isClickable()) then
                    call UnitRemoveAbility(.u, 'Aloc')
                    call UnitAddAbility(.u, 'Aloc')
                endif
            endif
            call SetUnitX(.u, x)
            call SetUnitY(.u, y)
        endif //cas autre : wait, on ne fait rien
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
        //! textmacro TM_getX takes N
        if (id == $N$) then
            return .x$N$
        endif
        //! endtextmacro
		//! runtextmacro TM_getX( "0"  )
		//! runtextmacro TM_getX( "1"  )
		//! runtextmacro TM_getX( "2"  )
		//! runtextmacro TM_getX( "3"  )
		//! runtextmacro TM_getX( "4"  )
		//! runtextmacro TM_getX( "5"  )
		//! runtextmacro TM_getX( "6"  )
		//! runtextmacro TM_getX( "7"  )
		//! runtextmacro TM_getX( "8"  )
		//! runtextmacro TM_getX( "9"  )
		//! runtextmacro TM_getX( "10" )
		//! runtextmacro TM_getX( "11" )
		//! runtextmacro TM_getX( "12" )
		//! runtextmacro TM_getX( "13" )
		//! runtextmacro TM_getX( "14" )
		//! runtextmacro TM_getX( "15" )
		//! runtextmacro TM_getX( "16" )
		//! runtextmacro TM_getX( "17" )
		//! runtextmacro TM_getX( "18" )
		//! runtextmacro TM_getX( "19" )
        return 0.    
    endmethod
    
    method getY takes integer id returns real
        //! textmacro TM_getY takes N
        if (id == $N$) then
            return .y$N$
        endif
        //! endtextmacro
		//! runtextmacro TM_getY( "0"  )
		//! runtextmacro TM_getY( "1"  )
		//! runtextmacro TM_getY( "2"  )
		//! runtextmacro TM_getY( "3"  )
		//! runtextmacro TM_getY( "4"  )
		//! runtextmacro TM_getY( "5"  )
		//! runtextmacro TM_getY( "6"  )
		//! runtextmacro TM_getY( "7"  )
		//! runtextmacro TM_getY( "8"  )
		//! runtextmacro TM_getY( "9"  )
		//! runtextmacro TM_getY( "10" )
		//! runtextmacro TM_getY( "11" )
		//! runtextmacro TM_getY( "12" )
		//! runtextmacro TM_getY( "13" )
		//! runtextmacro TM_getY( "14" )
		//! runtextmacro TM_getY( "15" )
		//! runtextmacro TM_getY( "16" )
		//! runtextmacro TM_getY( "17" )
		//! runtextmacro TM_getY( "18" )
		//! runtextmacro TM_getY( "19" )
        return 0.    
    endmethod
	
	method addNewLocAt takes integer id, real x, real y returns nothing
		//! textmacro TM_addNewLocAt takes N
		if (id == $N$) then
			set .x$N$ = x
			set .y$N$ = y
			return
		endif
		//! endtextmacro
		//! runtextmacro TM_addNewLocAt( "0"  )
		//! runtextmacro TM_addNewLocAt( "1"  )
		//! runtextmacro TM_addNewLocAt( "2"  )
		//! runtextmacro TM_addNewLocAt( "3"  )
		//! runtextmacro TM_addNewLocAt( "4"  )
		//! runtextmacro TM_addNewLocAt( "5"  )
		//! runtextmacro TM_addNewLocAt( "6"  )
		//! runtextmacro TM_addNewLocAt( "7"  )
		//! runtextmacro TM_addNewLocAt( "8"  )
		//! runtextmacro TM_addNewLocAt( "9"  )
		//! runtextmacro TM_addNewLocAt( "10" )
		//! runtextmacro TM_addNewLocAt( "11" )
		//! runtextmacro TM_addNewLocAt( "12" )
		//! runtextmacro TM_addNewLocAt( "13" )
		//! runtextmacro TM_addNewLocAt( "14" )
		//! runtextmacro TM_addNewLocAt( "15" )
		//! runtextmacro TM_addNewLocAt( "16" )
		//! runtextmacro TM_addNewLocAt( "17" )
		//! runtextmacro TM_addNewLocAt( "18" )
		//! runtextmacro TM_addNewLocAt( "19" )
	endmethod
	
	method addNewLoc takes real x, real y returns boolean
        if (.lastLocInd >= MonsterTeleport.NB_MAX_LOC - 1) then //nombre limite de points atteint
			return false //erreur
		endif
		set .lastLocInd = .lastLocInd + 1
		call .addNewLocAt(.lastLocInd, x, y)
		if (.lastLocInd == 1) then
            call .createUnit()
		endif
		return true //c'est bon, pas d'erreur
	endmethod 
  	
    method destroyLastLoc takes nothing returns boolean
		if (.lastLocInd == 1) then
            call PauseTimer(.t)
			call RemoveUnit(.u)
			set .u = null
		endif
        if (.lastLocInd < 0) then
            return false
        endif
        set .lastLocInd = .lastLocInd - 1
        return true
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
        set str = str + CACHE_SEPARATEUR_PARAM + R2S(period) + CACHE_SEPARATEUR_PARAM + I2S(R2I(angle))
        //! textmacro TM_loc_toString takes N
        if (.lastLocInd < $N$) then
            return str
        endif
        set str = str + CACHE_SEPARATEUR_PARAM + I2S(R2I(.x$N$)) + CACHE_SEPARATEUR_PARAM + I2S(R2I(.y$N$))
        //! endtextmacro
		//! runtextmacro TM_loc_toString( "0"  )
		//! runtextmacro TM_loc_toString( "1"  )
		//! runtextmacro TM_loc_toString( "2"  )
		//! runtextmacro TM_loc_toString( "3"  )
		//! runtextmacro TM_loc_toString( "4"  )
		//! runtextmacro TM_loc_toString( "5"  )
		//! runtextmacro TM_loc_toString( "6"  )
		//! runtextmacro TM_loc_toString( "7"  )
		//! runtextmacro TM_loc_toString( "8"  )
		//! runtextmacro TM_loc_toString( "9"  )
		//! runtextmacro TM_loc_toString( "10" )
		//! runtextmacro TM_loc_toString( "11" )
		//! runtextmacro TM_loc_toString( "12" )
		//! runtextmacro TM_loc_toString( "13" )
		//! runtextmacro TM_loc_toString( "14" )
		//! runtextmacro TM_loc_toString( "15" )
		//! runtextmacro TM_loc_toString( "16" )
		//! runtextmacro TM_loc_toString( "17" )
		//! runtextmacro TM_loc_toString( "18" )
		//! runtextmacro TM_loc_toString( "19" )
        return str
    endmethod
endstruct


function InitMonsterTeleport takes nothing returns nothing
    set monsterTeleportHashtable = InitHashtable()
endfunction



endlibrary
