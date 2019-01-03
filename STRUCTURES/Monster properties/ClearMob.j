//TESH.scrollpos=93
//TESH.alwaysfold=0
library ClearMob initializer InitClearMob needs MonsterInterface



globals
    private hashtable htClearMob //0, triggerMobId ==> ClearMob   1, timerHandleId ==> clearMob
    constant real CLEAR_MOB_MAX_DURATION = 300 //5 min max
    private constant integer TRIGGER_MOB = 0
    private constant integer TIMER_ACTIVATED = 1
    private constant integer TIMER_FRONT_MONTANT = 2
    public constant real FRONT_MONTANT_DURATION = 0.03
    private timer udp_currentTimer
    constant integer MAX_NB_CLEAR_MOB_BY_LEVEL = 160
    private constant string TRIGGER_MOB_PERMANENT_EFFECT = "Abilities\\Spells\\Orc\\StasisTrap\\StasisTotemTarget.mdl" //effet pour démarquer les trigger mobs
endglobals


function ClearTriggerMobId2ClearMob takes integer triggerMobId returns ClearMob
    return ClearMob(LoadInteger(htClearMob, 0, triggerMobId))
endfunction


function ClearMobTimerExpires takes nothing returns nothing
    local ClearMob clearMob = ClearMob(LoadInteger(htClearMob, TIMER_ACTIVATED, GetHandleId(GetExpiredTimer())))
    if (clearMob != 0) then
        call clearMob.initialize() //réinitialise la couleur du trigger mob
        set udp_currentTimer = GetExpiredTimer()
        call clearMob.getBlockMobs().executeForAll("TemporarilyEnableMonsterOrCasterEach")
    endif
endfunction

function ClearMobFrontMontantTimerExpires takes nothing returns nothing //le trigger mob perd de son éclat car il n'y a plus de héros sur lui
    local ClearMob clearMob = ClearMob(LoadInteger(htClearMob, TIMER_FRONT_MONTANT, GetHandleId(GetExpiredTimer())))
    if (clearMob != 0) then
        if (clearMob.isBeingActivated()) then
            call clearMob.getTriggerMob().setVertexColor(70, 100, 70)
        endif
    endif
endfunction

function KillMonsterOrCasterEach takes nothing returns nothing
    call GetEnumMoc().killUnit()
endfunction

function TemporarilyDisableMonsterOrCasterEach takes nothing returns nothing
    call GetEnumMoc().temporarilyDisable(udp_currentTimer)
endfunction

function TemporarilyEnableMonsterOrCasterEach takes nothing returns nothing
    call GetEnumMoc().temporarilyEnable(udp_currentTimer)
endfunction

private function InitClearMob takes nothing returns nothing
    set htClearMob = InitHashtable()
endfunction




struct ClearMob [8000] //50 niveaux * 160
    Level level
    integer arrayId
    private MonsterOrCaster triggerMob
    private MonsterOrCasterStack blockMobs
    private real disableDuration //0 = permanent
    private timer timerActivated
    private timer timerFrontMontant //le trigger mob reste en vert pêtant le temps du "front montant"
    boolean enabled
    private effect triggerMobPermanentEffect

    
    method getDisableDuration takes nothing returns real
        return .disableDuration
    endmethod
    
    method setDisableDuration takes real disableDuration returns boolean
        if (disableDuration > CLEAR_MOB_MAX_DURATION or disableDuration < FRONT_MONTANT_DURATION) then
            return false
        endif
        set .disableDuration = disableDuration
        return true
    endmethod
    
    method getTriggerMob takes nothing returns MonsterOrCaster
        return .triggerMob
    endmethod
    
    method setTriggerMob takes MonsterOrCaster newTriggerMob returns boolean
        if (newTriggerMob == 0 or .triggerMob == newTriggerMob) then
            return false
        endif
        call RemoveSavedInteger(htClearMob, TRIGGER_MOB, .triggerMob.getId())
        call SaveInteger(htClearMob, TRIGGER_MOB, newTriggerMob.getId(), integer(this))
        set .triggerMob = newTriggerMob
        return true
    endmethod
    
    method getBlockMobs takes nothing returns MonsterOrCasterStack
        return .blockMobs
    endmethod

    static method create takes integer triggerMobId, real disableDuration returns ClearMob
        local ClearMob clearMob
        local MonsterOrCaster triggerMob
        if (disableDuration != 0 and (disableDuration > CLEAR_MOB_MAX_DURATION or disableDuration < FRONT_MONTANT_DURATION)) then
            return 0
        endif
        set triggerMob = MonsterOrCaster.create(triggerMobId)
        if (triggerMob != 0) then
            set clearMob = ClearMob.allocate()
            set clearMob.triggerMob = triggerMob
        else
            return 0
        endif
        set clearMob.blockMobs = 0
        set clearMob.disableDuration = disableDuration
        set clearMob.timerActivated = CreateTimer()
        set clearMob.timerFrontMontant = CreateTimer()
        set clearMob.triggerMobPermanentEffect = null
        set clearMob.enabled = true
        call SaveInteger(htClearMob, TRIGGER_MOB, triggerMobId, integer(clearMob))
        call SaveInteger(htClearMob, TIMER_ACTIVATED, GetHandleId(clearMob.timerActivated), integer(clearMob))
        call SaveInteger(htClearMob, TIMER_FRONT_MONTANT, GetHandleId(clearMob.timerFrontMontant), integer(clearMob))
        return clearMob
    endmethod
    
    method initialize takes nothing returns nothing
        call .triggerMob.setBaseColor("blue")
        call .triggerMob.setVertexColor(30, 60, 100)
        if (.triggerMobPermanentEffect == null) then
            set .triggerMobPermanentEffect = AddSpecialEffectTarget(TRIGGER_MOB_PERMANENT_EFFECT, .triggerMob.getUnit(), "origin")
        endif
        set .enabled = true
    endmethod
    
    method close takes nothing returns nothing
        if (.triggerMobPermanentEffect != null) then
            call DestroyEffect(.triggerMobPermanentEffect)
            set .triggerMobPermanentEffect = null
        endif
    endmethod
    
    method redoTriggerMobPermanentEffect takes nothing returns nothing
        if (.triggerMobPermanentEffect != null) then
            call DestroyEffect(.triggerMobPermanentEffect)
        endif
        set .triggerMobPermanentEffect = AddSpecialEffectTarget(TRIGGER_MOB_PERMANENT_EFFECT, .triggerMob.getUnit(), "origin")
    endmethod        
    
    method addBlockMob takes integer blockMobId returns boolean
        if (.blockMobs.containsMob(blockMobId)) then
            return false
        endif
        if (.blockMobs == 0) then
            set .blockMobs = MonsterOrCasterStack.create(MonsterOrCaster.create(blockMobId))
            return .blockMobs != 0
        else
            return .blockMobs.addMonsterOrCaster(MonsterOrCaster.create(blockMobId))
        endif
    endmethod
    
    method removeLastBlockMob takes nothing returns boolean
        call .blockMobs.getLast().temporarilyEnable(.timerActivated)
        return .blockMobs.removeLast()
    endmethod
    
    method removeAllBlockMobs takes nothing returns nothing
        set udp_currentTimer = .timerActivated
        call .blockMobs.executeForAll("TemporarilyEnableMonsterOrCasterEach")
        call .blockMobs.destroy()
        set .blockMobs = 0
    endmethod

    method onDestroy takes nothing returns nothing 
        call RemoveSavedInteger(htClearMob, TRIGGER_MOB, .triggerMob.getId())
        call RemoveSavedInteger(htClearMob, TIMER_ACTIVATED, GetHandleId(.timerActivated))
        call RemoveSavedInteger(htClearMob, TIMER_FRONT_MONTANT, GetHandleId(.timerFrontMontant))
        call .close()
        call .triggerMob.reinitColor()
        call .triggerMob.destroy()
        set .triggerMob = 0
        set udp_currentTimer = .timerActivated
        call .blockMobs.executeForAll("TemporarilyEnableMonsterOrCasterEach")
        call .blockMobs.destroy()
        call DestroyTimer(.timerActivated)
        set .timerActivated = null
        call DestroyTimer(.timerFrontMontant)
        set .timerFrontMontant = null
        call .level.clearMobs.setClearMobNull(.arrayId)
    endmethod
    
    method isBeingActivated takes nothing returns boolean
        return TimerGetRemaining(.timerActivated) > 0
    endmethod
    
    method activate takes nothing returns nothing //active le clear mob, c'est-à-dire désactive les block mobs associés
        if (not .enabled) then
            return
        endif
        if (.disableDuration == 0) then //désactivation permanente des block mobs
            call .blockMobs.executeForAll("KillMonsterOrCasterEach")
            set .enabled = false //le clear mob se désactive pour le niveau actuel (il n'est plus utile car les mobs sont morts)
        else
            set udp_currentTimer = .timerActivated
            call TimerStart(.timerActivated, .disableDuration, false, function ClearMobTimerExpires)
            call .blockMobs.executeForAll("TemporarilyDisableMonsterOrCasterEach")
            call TimerStart(.timerFrontMontant, FRONT_MONTANT_DURATION, false, function ClearMobFrontMontantTimerExpires) //le vert perd de son éclat quand le héros part du trigger mob, mais pas de le cas d'un clear mob permanent
        endif
        //dans tous les cas le trigger mob "s'active"
        call .triggerMob.setBaseColor("green")
        call .triggerMob.setVertexColor(40, 100, 40)
    endmethod
endstruct




endlibrary