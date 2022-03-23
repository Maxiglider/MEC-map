//TESH.scrollpos=30
//TESH.alwaysfold=0
library MonsterSpawn needs MonsterCreationFunctions


private function RemoveEnumMonster takes nothing returns nothing
    call RemoveUnit(GetEnumUnit())
endfunction

globals
    private hashtable ht //pour retrouver les MonsterSpawn correspondant aux triggers et régions
    private constant real DECALAGE_UNSPAWN = 200 //décalage de l'ordre de déplacement au delà de la région d'unspawn
    private constant real DELAY_BETWEEN_SPAWN_AND_MOVEMENT = 0.5
endglobals

private function MonsterStartMovement takes nothing returns nothing
    local timer mobTimer = GetExpiredTimer()
    local MonsterSpawn ms = MonsterSpawn(LoadInteger(ht, 1, GetHandleId(mobTimer)))
    local unit mobUnit = LoadUnitHandle(ht, 2, GetHandleId(mobTimer))
    call ms.startMobMovement(mobUnit)
    call UnitAddAbility(mobUnit, 'Aloc')
    call DestroyTimer(mobTimer)
    set mobUnit = null
    set mobTimer = null
endfunction    

private function MonsterSpawn_Actions takes nothing returns nothing
    local MonsterSpawn ms = MonsterSpawn(LoadInteger(ht, 0, GetHandleId(GetTriggeringTrigger())))
    local unit mobUnit = ms.createMob()
    local timer mobTimer = CreateTimer()
    call SaveInteger(ht, 1, GetHandleId(mobTimer), integer(ms))
    call SaveUnitHandle(ht, 2, GetHandleId(mobTimer), mobUnit)
    call TimerStart(mobTimer, DELAY_BETWEEN_SPAWN_AND_MOVEMENT, false, function MonsterStartMovement)
    call SetUnitOwner(mobUnit, ENNEMY_PLAYER, false)
    call ShowUnit(mobUnit, false)
    call UnitRemoveAbility(mobUnit, 'Aloc')
    call GroupAddUnit(ms.monsters, mobUnit)
    set mobUnit = null
    set mobTimer = null
endfunction

private function UnspawMonster_Actions takes nothing returns nothing
    local MonsterSpawn ms = MonsterSpawn(LoadInteger(ht, 0, GetHandleId(GetTriggeringTrigger())))
    if(IsUnitInGroup(GetTriggerUnit(), ms.monsters))then
        call GroupRemoveUnit(ms.monsters, GetTriggerUnit())
        call RemoveUnit(GetTriggerUnit())
    endif
endfunction
    


struct MonsterSpawn [5000] //50 levels * 100 monster spawns
    private static method onInit takes nothing returns nothing
        set ht = InitHashtable()
        //0, tSpawn --> MonsterSpawn
        //0, tUnspawn --> MonsterSpawn
        //1, timer --> MonsterSpawn
        //2, timer --> unité mob
    endmethod
    
    private string label
    private MonsterType mt
    private string sens //leftToRight, upToDown, rightToLeft, downToUp
    private real frequence
    private real minX
    private real minY
    private real maxX
    private real maxY
    private trigger tSpawn
    private trigger tUnspawn
    private region unspawnReg
    group monsters
    
    Level level
    integer arrayId
    
    
    public method getLabel takes nothing returns string
        return .label
    endmethod
    
    
    method desactivate takes nothing returns nothing
		if(.unspawnReg != null)then
            call RemoveRegion(.unspawnReg)
            set .unspawnReg = null
        endif
        if(.tSpawn != null)then
            call DestroyTrigger(.tSpawn)
            set .tSpawn = null
        endif
        if(.tUnspawn != null)then
            call DestroyTrigger(.tUnspawn)
            set .tUnspawn = null
        endif
        if(.monsters != null)then
            call ForGroup(.monsters, function RemoveEnumMonster)
            call DestroyGroup(.monsters)
            set .monsters = null
        endif
    endmethod
    
    private method createUnspawnReg takes nothing returns nothing
        local rect r
        local real x1
        local real y1
        local real x2
        local real y2
        //leftToRight, upToDown, rightToLeft, downToUp
        if(.sens == "leftToRight")then
            set x1 = .maxX
            set x2 = .maxX
            set y1 = .minY - DECALAGE_UNSPAWN
            set y2 = .maxY + DECALAGE_UNSPAWN
        elseif(.sens == "upToDown")then
            set x1 = .minX - DECALAGE_UNSPAWN
            set x2 = .maxX + DECALAGE_UNSPAWN
            set y1 = .minY
            set y2 = .minY
        elseif(.sens == "rightToLeft")then
            set x1 = .minX
            set x2 = .minX
            set y1 = .minY - DECALAGE_UNSPAWN
            set y2 = .maxY + DECALAGE_UNSPAWN
        else //downToUp
            set x1 = .minX - DECALAGE_UNSPAWN
            set x2 = .maxX + DECALAGE_UNSPAWN
            set y1 = .maxY
            set y2 = .maxY
        endif
        set r = Rect(x1, y1, x2, y2)
        set .unspawnReg = CreateRegion()
        call RegionAddRect(.unspawnReg, r)
        call RemoveRect(r)
    endmethod
    
    method activate takes nothing returns nothing
        set .monsters = CreateGroup()
        set .tSpawn = CreateTrigger()
        call SaveInteger(ht, 0, GetHandleId(.tSpawn), integer(this))
        call TriggerRegisterTimerEvent(.tSpawn, 1/.frequence, true)
        call TriggerAddAction(.tSpawn, function MonsterSpawn_Actions)
        call .createUnspawnReg()
        set .tUnspawn = CreateTrigger()
        call SaveInteger(ht, 0, GetHandleId(.tUnspawn), integer(this))
        call TriggerRegisterEnterRegion(.tUnspawn, .unspawnReg, null)
        call TriggerAddAction(.tUnspawn, function UnspawMonster_Actions)
    endmethod
    
    private method onDestroy takes nothing returns nothing
        call .desactivate()
        call .level.monsterSpawns.setMonsterSpawnNull(.arrayId)
    endmethod
	
	static method create takes string label, MonsterType mt, string sens, real frequence, real x1, real y1, real x2, real y2 returns MonsterSpawn
		local MonsterSpawn ms = MonsterSpawn.allocate()
        set ms.label = label
        set ms.mt = mt
        set ms.sens = sens
        set ms.frequence = frequence
        set ms.minX = RMinBJ(x1, x2)
        set ms.minY = RMinBJ(y1, y2)
        set ms.maxX = RMaxBJ(x1, x2)
        set ms.maxY = RMaxBJ(y1, y2)
		return ms
	endmethod
    
    method startMobMovement takes unit mobUnit returns nothing
        local player p
        local real x1
        local real y1
        local real x2
        local real y2
        //leftToRight, upToDown, rightToLeft, downToUp
        if(.sens == "leftToRight")then
            set x1 = .minX
            set x2 = .maxX + DECALAGE_UNSPAWN
            set y1 = GetRandomReal(.minY, .maxY)
            set y2 = y1
        elseif(.sens == "upToDown")then
            set x1 = GetRandomReal(.minX, .maxX)
            set x2 = x1
            set y1 = .maxY
            set y2 = .minY - DECALAGE_UNSPAWN
        elseif(.sens == "rightToLeft")then
            set x1 = .maxX
            set x2 = .minX - DECALAGE_UNSPAWN
            set y1 = GetRandomReal(.minY, .maxY)
            set y2 = y1
        else //downToUp
            set x1 = GetRandomReal(.minX, .maxX)
            set x2 = x1
            set y1 = .minY
            set y2 = .maxY + DECALAGE_UNSPAWN
        endif
        call SetUnitX(mobUnit, x1)
        call SetUnitY(mobUnit, y1)
        if (udg_monsterTypes.monsterUnit2MonsterType(mobUnit).isClickable()) then
            set p = ENNEMY_PLAYER
        else
            set p = GetCurrentMonsterPlayer()
        endif
        call SetUnitOwner(mobUnit, p, MOBS_VARIOUS_COLORS)
        call ShowUnit(mobUnit, true)
        call IssuePointOrder(mobUnit, "move", x2, y2)
    endmethod
    
    public method createMob takes nothing returns unit
        local real angle
        //leftToRight, upToDown, rightToLeft, downToUp
        if(.sens == "leftToRight")then
            set angle = 180
        elseif(.sens == "upToDown")then
            set angle = 90
        elseif(.sens == "rightToLeft")then
            set angle = 0
        else //downToUp
            set angle = -90
        endif
        return NewImmobileMonsterForPlayer(.mt, ENNEMY_PLAYER, (.minX + .maxX)/2, (.minY + .maxY)/2, angle)
    endmethod
    
    public method setLabel takes string newLabel returns nothing
        set .label = newLabel
    endmethod

    public method setMonsterType takes MonsterType mt returns nothing
        set .mt = mt
    endmethod
    
    public method setSens takes string sens returns nothing
        set .sens = sens
        call .desactivate()
        call .activate()
    endmethod
    
    public method setFrequence takes real frequence returns nothing
        set .frequence = frequence
        call DestroyTrigger(.tSpawn)
        set .tSpawn = CreateTrigger()
        call SaveInteger(ht, 0, GetHandleId(.tSpawn), integer(this))
        call TriggerRegisterTimerEvent(.tSpawn, 1/.frequence, true)
        call TriggerAddAction(.tSpawn, function MonsterSpawn_Actions)
    endmethod
    
    public method displayForPlayer takes player p returns nothing
        local string display = udg_colorCode[GREY] + .label + " : " + .mt.label + "   " + .sens + "   " + R2S(.frequence)
        call Text_P_timed(p, TERRAIN_DATA_DISPLAY_TIME, display)
    endmethod

    public method toString takes nothing returns string
        local string str = .label + CACHE_SEPARATEUR_PARAM
        if (.mt.theAlias != null and .mt.theAlias != "") then
            set str = str + .mt.theAlias + CACHE_SEPARATEUR_PARAM
        else
            set str = str + .mt.label + CACHE_SEPARATEUR_PARAM
        endif
        set str = str + .sens + CACHE_SEPARATEUR_PARAM + R2S(.frequence) + CACHE_SEPARATEUR_PARAM
        set str = str + I2S(R2I(.minX)) + CACHE_SEPARATEUR_PARAM + I2S(R2I(.minY)) + CACHE_SEPARATEUR_PARAM + I2S(R2I(.maxX)) + CACHE_SEPARATEUR_PARAM + I2S(R2I(.maxY))
        return str
    endmethod

endstruct


endlibrary