//TESH.scrollpos=0
//TESH.alwaysfold=0
library Level needs VisibilityModifierArray, StartAndEnd, Triggers, Lives

//nombre maximum de niveaux : 200. Nombre maximum de monstres de chaque type par niveau : 1000.


globals
    public boolean earningLivesActivated = true
endglobals


struct Level
    private boolean isActivatedB
    private string startMessage
    private integer livesEarnedAtBeginning
	private Start start
	private End end
	VisibilityModifierArray visibilities
	MonsterNoMoveArray monstersNoMove
	MonsterSimplePatrolArray monstersSimplePatrol
	MonsterMultiplePatrolsArray monstersMultiplePatrols
    MonsterTeleportArray monstersTeleport
    MonsterSpawnArray monsterSpawns
    MeteorArray meteors
    CasterArray casters
    ClearMobArray clearMobs
	private TriggerArray triggers
    
    static method create takes nothing returns Level
        local Level l = Level.allocate()
        set l.visibilities = VisibilityModifierArray.create()
        set l.triggers = TriggerArray.create()
        set l.monstersNoMove = MonsterNoMoveArray.create()
        set l.monstersSimplePatrol = MonsterSimplePatrolArray.create()
        set l.monstersMultiplePatrols = MonsterMultiplePatrolsArray.create()
        set l.monstersTeleport = MonsterTeleportArray.create()
        set l.monsterSpawns = MonsterSpawnArray.create()
        set l.meteors = MeteorArray.create()
        set l.casters = CasterArray.create()
        set l.clearMobs = ClearMobArray.create()
        set l.livesEarnedAtBeginning = 1
        set l.isActivatedB = false
        set l.startMessage = ""
        set l.start = 0
        set l.end = 0
        return l
    endmethod
	
	method activate takes boolean activ returns nothing
        if (.isActivatedB == activ) then
            return
        endif
        call .end.activate(activ)
        call .triggers.activate(activ)
        if (activ) then
            if (.startMessage != null and .startMessage != "" and earningLivesActivated) then
                call Text_A(.startMessage)
            endif
            call .visibilities.activate(true)
            call .monstersNoMove.createMonsters()
            call .monstersSimplePatrol.createMonsters()
            call .monstersMultiplePatrols.createMonsters()
            call .monstersTeleport.createMonsters()
            call .monsterSpawns.activate()
            call .meteors.createMeteors()
            call .casters.createCasters()
            call .clearMobs.initializeClearMobs()
            if (earningLivesActivated and .getId() > 0) then
                call udg_lives.add(.livesEarnedAtBeginning)
            endif
        else
            call .monstersNoMove.removeMonsters()
            call .monstersSimplePatrol.removeMonsters()
            call .monstersMultiplePatrols.removeMonsters()
            call .monstersTeleport.removeMonsters()
            call .monsterSpawns.desactivate()
            call .meteors.removeMeteors()
            call .casters.removeCasters()
            call udg_escapers.deleteSpecificActionsForLevel(this)
        endif
        set .isActivatedB = activ
    endmethod
    
    method checkpointReviveHeroes takes Escaper finisher returns nothing
        set TrigCheckpointReviveHeroes_levelForReviving = this
        set TrigCheckpointReviveHeroes_revivingFinisher = finisher
        call TriggerExecute(gg_trg____Trig_checkpoint_revive_heroes)    
    endmethod
    
    method getStart takes nothing returns Start
        return .start
    endmethod
    
    method getStartRandomX takes nothing returns real
        return .start.getRandomX()
    endmethod
    
    method getStartRandomY takes nothing returns real
        return .start.getRandomY()
    endmethod
    
    method newStart takes real x1, real y1, real x2, real y2 returns nothing
        call .start.destroy()
        set .start = Start.create(x1, y1, x2, y2)
    endmethod
    
    method newEnd takes real x1, real y1, real x2, real y2 returns nothing
        call .end.destroy()
        set .end = End.create(x1, y1, x2, y2)
        if (.isActivatedB) then
            call .end.activate(true)
        endif
    endmethod
    
    method getEnd takes nothing returns End
        return .end
    endmethod
    
    method getNbMonsters takes string mode returns integer
        //modes : all, moving, not moving
        local integer nb = 0
        if (mode == "all" or mode == "not moving") then
            set nb = nb + .monstersNoMove.count() + .casters.count()
        endif
        if (mode == "all" or mode == "moving") then
            set nb = nb + .monstersSimplePatrol.count() + .monstersMultiplePatrols.count()
        endif
        if (mode == "all") then
            set nb = nb + .monstersTeleport.count()
        endif
        return nb
    endmethod
    
    method onDestroy takes nothing returns nothing
        call .start.destroy()
        call .end.destroy()
        call .visibilities.destroy()
        call .triggers.destroy()
        call .monstersNoMove.destroy()
        call .monstersSimplePatrol.destroy()
        call .monstersMultiplePatrols.destroy()
        call .monstersTeleport.destroy()
    endmethod
    
    method recreateMonstersOfType takes MonsterType mt returns nothing
        call .monstersNoMove.recreateMonstersOfType(mt)
        call .monstersSimplePatrol.recreateMonstersOfType(mt)
        call .monstersMultiplePatrols.recreateMonstersOfType(mt)
        call .monstersTeleport.recreateMonstersOfType(mt)
    endmethod
    
    method removeMonstersOfType takes MonsterType mt returns nothing
        call .monstersNoMove.removeMonstersOfType(mt)
        call .monstersSimplePatrol.removeMonstersOfType(mt)
        call .monstersMultiplePatrols.removeMonstersOfType(mt)
        call .monstersTeleport.removeMonstersOfType(mt)
    endmethod
    
    method refreshCastersOfType takes CasterType ct returns nothing
        call .casters.refreshCastersOfType(ct)
    endmethod
    
    method removeCastersOfType takes CasterType ct returns nothing
        call .casters.removeCastersOfType(ct)
    endmethod
    
    method getId takes nothing returns integer
        local integer i = 0
        loop
            exitwhen (udg_levels.get(i) == 0)
                if (udg_levels.get(i) == this) then
                    return i
                endif
            set i = i + 1
        endloop
        return -1
    endmethod
    
    method isActivated takes nothing returns boolean
        return .isActivatedB
    endmethod
    
    method setIsActivated takes boolean activated returns nothing
        set .isActivatedB = activated
    endmethod
    
    method setNbLivesEarned takes integer nbLives returns boolean
        if (nbLives < 0) then
            return false
        endif
        set .livesEarnedAtBeginning = nbLives
        return true
    endmethod
    
    method getNbLives takes nothing returns integer
        return .livesEarnedAtBeginning
    endmethod
    
    method newVisibilityModifier takes real x1, real y1, real x2, real y2 returns VisibilityModifier
        return .visibilities.new(x1, y1, x2, y2)
    endmethod
    
    method newVisibilityModifierFromExisting takes VisibilityModifier vm returns VisibilityModifier
        return .visibilities.newFromExisting(vm)
    endmethod
    
    method removeVisibilities takes nothing returns nothing
        call .visibilities.removeAllVisibilityModifiers()
    endmethod
    
    method activateVisibilities takes boolean activate returns nothing
        call .visibilities.activate(activate)
    endmethod
    
    method setStartMessage takes string str returns nothing
        if (str == "") then
            set str = null
        endif
        set .startMessage = str
    endmethod
    
    method getStartMessage takes nothing returns string
        return .startMessage
    endmethod
endstruct
    


endlibrary
