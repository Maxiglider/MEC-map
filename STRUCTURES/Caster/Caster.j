//TESH.scrollpos=111
//TESH.alwaysfold=0
library Caster initializer InitCaster needs MonsterCreationFunctions, CasterFunctions, MonsterInterface, ClearMob


globals
    public hashtable casterHashtable // 0: trigger, 1: timer
endglobals




struct Caster [300000] //12 escapers * 50 niveaux * 500 monstres
    private integer id
    Level level
    integer arrayId
    private CasterType casterType
    private real x
    private real y
    private real angle
    private timer disablingTimer
    //color
    private integer baseColorId
    private real vcRed
    private real vcGreen
    private real vcBlue
    private real vcTransparency
    
    unit casterUnit
    private trigger trg_unitWithinRange
    Escaper array escapersInRange [NB_ESCAPERS]
    integer nbEscapersInRange
    boolean canShoot
    timer t
    private boolean enabled
    
    method isEnabled takes nothing returns boolean
        return .enabled
    endmethod
    
    method getId takes nothing returns integer
        return .id
    endmethod
    
    method setId takes integer id returns Caster
        if (id == .id) then
            return this
        endif
        call CasterHashtableSetCasterId(this, .id, id)
        set .id = id
        call MonsterIdHasBeenSetTo(id)
        return this
    endmethod
    
    method getX takes nothing returns real
        return .x
    endmethod
    
    method getY takes nothing returns real
        return .y
    endmethod
    
    method getRange takes nothing returns real
        return .casterType.getRange()
    endmethod
    
    method getProjectileSpeed takes nothing returns real
        return .casterType.getProjectileSpeed()
    endmethod
    
    method getCasterUnit takes nothing returns unit
        return .casterUnit
    endmethod
    
    method getProjectileMonsterType takes nothing returns MonsterType
        return .casterType.getProjectileMonsterType()
    endmethod
    
    method getLoadTime takes nothing returns real
        return .casterType.getLoadTime()
    endmethod
    
    method getCasterType takes nothing returns CasterType
        return .casterType
    endmethod
    
    method getAnimation takes nothing returns string
        return .casterType.getAnimation()
    endmethod
    
    
    static method create takes CasterType casterType, real x, real y, real angle returns Caster
        local Caster c = Caster.allocate()
        set c.casterType = casterType
        set c.x = x
        set c.y = y
        set c.angle = angle
        set c.id = GetNextMonsterId()
        call CasterHashtableSetCasterId(c, NO_ID, c.id)
        set c.disablingTimer = null
        //color
        set c.baseColorId = -1
        set c.vcRed = 100
        set c.vcGreen = 100
        set c.vcBlue = 100
        set c.vcTransparency = 0
        return c
    endmethod
    
    
    method enable takes nothing returns nothing
        set .nbEscapersInRange = 0
        set .canShoot = true
        set .casterUnit = NewImmobileMonster(.casterType.getCasterMonsterType(), .x, .y, .angle)
        call SetUnitUserData(.casterUnit, .id)
        set .trg_unitWithinRange = CreateTrigger()
        call TriggerRegisterUnitInRangeSimple(.trg_unitWithinRange, .casterType.getRange(), .casterUnit)
        call TriggerAddAction(.trg_unitWithinRange, function CasterUnitWithinRange_Actions)
        call SaveInteger(casterHashtable, 0, GetHandleId(.trg_unitWithinRange), integer(this))
        set .t = CreateTimer()
        call SaveInteger(casterHashtable, 1, GetHandleId(.t), integer(this))
        set .enabled = true
    endmethod
    
    method disable takes nothing returns nothing
        call RemoveSavedInteger(casterHashtable, 0, GetHandleId(.trg_unitWithinRange))
        call DestroyTrigger(.trg_unitWithinRange)
        set .trg_unitWithinRange = null
        call RemoveUnit(.casterUnit)
        set .casterUnit = null 
        call RemoveSavedInteger(casterHashtable, 1, GetHandleId(.t))
        call DestroyTimer(.t)
        set .t = null
        set .disablingTimer = null
    endmethod
    
    method killUnit takes nothing returns nothing
        call KillUnit(.casterUnit)
        call RemoveSavedInteger(casterHashtable, 0, GetHandleId(.trg_unitWithinRange))
        call DestroyTrigger(.trg_unitWithinRange)
        set .trg_unitWithinRange = null
        call RemoveSavedInteger(casterHashtable, 1, GetHandleId(.t))
        call DestroyTimer(.t)
        set .t = null
    endmethod
    
    method refresh takes nothing returns nothing
        local ClearMob clearMob = ClearTriggerMobId2ClearMob(.id)
        local timer disablingTimer = .disablingTimer
        local boolean isCasterAlive = IsUnitAliveBJ(.casterUnit)
        if (.casterUnit != null) then
            call .disable()
            call .enable()
            if (disablingTimer != null and TimerGetRemaining(disablingTimer) > 0) then
                call .temporarilyDisable(disablingTimer)
            endif
            if (not isCasterAlive) then
                call .killUnit()
            endif
            if (.baseColorId != -1) then
                if (.baseColorId == 0) then
                    call SetUnitColor(.casterUnit, PLAYER_COLOR_RED)
                else
                    call SetUnitColor(.casterUnit, ConvertPlayerColor(.baseColorId))
                endif
            endif
            call SetUnitVertexColorBJ(.casterUnit, .vcRed, .vcGreen, .vcBlue, .vcTransparency)
        endif
        if (clearMob != 0) then
            call clearMob.redoTriggerMobPermanentEffect()
        endif
        set disablingTimer = null
    endmethod
    
    method onDestroy takes nothing returns nothing
        call .disable()
        call .level.casters.setCasterNull(.arrayId)
        if (ClearTriggerMobId2ClearMob(.id) != 0) then
            call ClearTriggerMobId2ClearMob(.id).destroy()
        endif
        call CasterHashtableRemoveCasterId(.id)
    endmethod
    
    method escaperOutOfRangeOrDead takes Escaper escaper returns nothing
        local integer  i = 0
        loop
            exitwhen (escaper == .escapersInRange[i] or i == .nbEscapersInRange)
            set i = i + 1
        endloop
        if (i < .nbEscapersInRange) then
            loop
                exitwhen (i == .nbEscapersInRange - 1)
                    set .escapersInRange[i] = .escapersInRange[i + 1]
                set i = i + 1
            endloop
            set .nbEscapersInRange = .nbEscapersInRange - 1
        endif
    endmethod
    
    method temporarilyDisable takes timer disablingTimer returns nothing
        if (.disablingTimer == null or .disablingTimer == disablingTimer or TimerGetRemaining(disablingTimer) > TimerGetRemaining(.disablingTimer)) then
            set .disablingTimer = disablingTimer
            call UnitRemoveAbility(.casterUnit, .casterType.getCasterMonsterType().getImmolationSkill())
            call SetUnitVertexColorBJ(.casterUnit, .vcRed, .vcGreen, .vcBlue, DISABLE_TRANSPARENCY)
            set .vcTransparency = DISABLE_TRANSPARENCY
            set .enabled = false
        endif
    endmethod
    
    method temporarilyEnable takes timer disablingTimer returns nothing
        if (.disablingTimer == disablingTimer) then //on ne réactive le mob que si le disablingTimer correspond bien au bon, celui restant le plus longtemps
            call UnitAddAbility(.casterUnit, .casterType.getCasterMonsterType().getImmolationSkill())
            call SetUnitVertexColorBJ(.casterUnit, .vcRed, .vcGreen, .vcBlue, 0)
            set .vcTransparency = 0
            set .enabled = true
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
            if (.casterUnit != null) then
                if (baseColorId == 0) then
                    call SetUnitColor(.casterUnit, PLAYER_COLOR_RED)
                else
                    call SetUnitColor(.casterUnit, ConvertPlayerColor(baseColorId))
                endif
            endif
        endif
    endmethod
    
    method setVertexColor takes real vcRed, real vcGreen, real vcBlue returns nothing
        set .vcRed = vcRed
        set .vcGreen = vcGreen
        set .vcBlue = vcBlue
        if (.casterUnit != null) then
            call SetUnitVertexColorBJ(.casterUnit, vcRed, vcGreen, vcBlue, .vcTransparency)
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
        if (.casterUnit != null) then
            if (MOBS_VARIOUS_COLORS) then
                set initBaseColorId = GetPlayerId(GetOwningPlayer(.casterUnit))
            else
                set initBaseColorId = 12
            endif
            if (initBaseColorId == 0) then
                call SetUnitColor(.casterUnit, PLAYER_COLOR_RED)
            else
                call SetUnitColor(.casterUnit, ConvertPlayerColor(initBaseColorId))
            endif
            call SetUnitVertexColorBJ(.casterUnit, .vcRed, .vcGreen, .vcBlue, .vcTransparency)
        endif
    endmethod    
    
    method toString takes nothing returns string
        local string str
        if (.casterType.theAlias != null and .casterType.theAlias != "") then
            set str = .casterType.theAlias + CACHE_SEPARATEUR_PARAM
        else
            set str = .casterType.label + CACHE_SEPARATEUR_PARAM
        endif
        set str = str + I2S(.id) + CACHE_SEPARATEUR_PARAM + I2S(R2I(.x)) + CACHE_SEPARATEUR_PARAM + I2S(R2I(.y))
        set str = str + CACHE_SEPARATEUR_PARAM + I2S(R2I(.angle))
        return str
    endmethod
endstruct



function InitCaster takes nothing returns nothing
    set casterHashtable = InitHashtable()
endfunction

endlibrary