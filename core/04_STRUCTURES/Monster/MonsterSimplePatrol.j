//TESH.scrollpos=99
//TESH.alwaysfold=0
library MonsterSimplePatrol initializer Init_MonsterSimplePatrol needs MonsterInterface


//vérification que les monstres multi-patrouilles patrouillent bien
globals
    private group simplePatrolMobs = CreateGroup()
    private constant real checkSimplePatrolMobsPeriod = 5.
endglobals

private function CheckSimplePatrolMobsEnum takes nothing returns nothing
    if (GetUnitCurrentOrder(GetEnumUnit()) == 0) then //le mob s'est arrêté
        call MonsterSimplePatrol(GetUnitUserData(GetEnumUnit())).createUnit()
    endif        
endfunction 

private function CheckSimplePatrolMobs_Actions takes nothing returns nothing
    call ForGroup(simplePatrolMobs, function CheckSimplePatrolMobsEnum)
endfunction

function Init_MonsterSimplePatrol takes nothing returns nothing
    local trigger trigCheckSimplePatrolMobs = CreateTrigger()
    call TriggerAddAction(trigCheckSimplePatrolMobs, function CheckSimplePatrolMobs_Actions)
    call TriggerRegisterTimerEvent(trigCheckSimplePatrolMobs, checkSimplePatrolMobsPeriod, true)
    set trigCheckSimplePatrolMobs = null
endfunction
/////////////////////////////////////////////////////////////////////////


struct MonsterSimplePatrol extends Monster
    static integer nbInstances = 0    
    
    static method count takes nothing returns integer
        return MonsterSimplePatrol.nbInstances
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
    
	private real x1
	private real y1
	private real x2
	private real y2
    
    method getId takes nothing returns integer
        return .id
    endmethod
    
    method setId takes integer id returns MonsterSimplePatrol
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
            call GroupRemoveUnit(simplePatrolMobs, .u)
            call RemoveUnit(.u)
            set .u = null
        endif
	endmethod
    
    method killUnit takes nothing returns nothing
        if (.u != null and IsUnitAliveBJ(.u)) then
            call GroupRemoveUnit(simplePatrolMobs, .u)
            call KillUnit(.u)
        endif
    endmethod
    
    private method onDestroy takes nothing returns nothing
		if (.u != null) then
			call .removeUnit()
		endif
        call .level.monstersSimplePatrol.setMonsterNull(.arrayId)
        set MonsterSimplePatrol.nbInstances = MonsterSimplePatrol.nbInstances - 1
        if (ClearTriggerMobId2ClearMob(.id) != 0) then
            call ClearTriggerMobId2ClearMob(.id).destroy()
        endif
        call MonsterHashtableRemoveMonsterId(.id)
    endmethod
	
	static method create takes MonsterType mt, real x1, real y1, real x2, real y2 returns MonsterSimplePatrol
		local MonsterSimplePatrol m = MonsterSimplePatrol.allocate()
        set MonsterSimplePatrol.nbInstances = MonsterSimplePatrol.nbInstances + 1
        set m.mt = mt
		set m.x1 = x1
		set m.y1 = y1
		set m.x2 = x2
		set m.y2 = y2
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
        set .u = NewPatrolMonster(.mt, .x1, .y1, .x2, .y2)
        call SetUnitUserData(.u, .id)
        call GroupAddUnit(simplePatrolMobs, .u)
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
        set str = str + I2S(.id) + CACHE_SEPARATEUR_PARAM + I2S(R2I(.x1)) + CACHE_SEPARATEUR_PARAM + I2S(R2I(.y1)) + CACHE_SEPARATEUR_PARAM
        set str = str + I2S(R2I(.x2)) + CACHE_SEPARATEUR_PARAM + I2S(R2I(.y2))
        return str
    endmethod
endstruct


endlibrary


