//TESH.scrollpos=52
//TESH.alwaysfold=0
library CasterType needs Text


globals
    constant real DEFAULT_CASTER_PROJECTILE_SPEED = 600
    constant real MIN_CASTER_PROJECTILE_SPEED = 100
    constant real DEFAULT_CASTER_RANGE = 1000
    constant real MIN_CASTER_LOAD_TIME = 0.2
    constant real DEFAULT_CASTER_LOAD_TIME = 1.0
    constant string DEFAULT_CASTER_ANIMATION = "spell"
endglobals


struct CasterType
    string label
    string theAlias
    private MonsterType casterMonsterType
    private MonsterType projectileMonsterType
    private real range
    private real projectileSpeed
    private real loadTime
    private string animation
    
    static method create takes string label, MonsterType casterMonsterType, MonsterType projectileMonsterType, real range, real projectileSpeed, real loadTime, string animation returns CasterType
        local CasterType ct
        if (range <= 0 or projectileSpeed <= 0) then
            return 0
        endif
        set ct = CasterType.allocate()
        set ct.label = label
        set ct.casterMonsterType = casterMonsterType
        set ct.projectileMonsterType = projectileMonsterType
        set ct.range = range
        set ct.projectileSpeed = projectileSpeed
        set ct.loadTime = loadTime
        set ct.animation = animation
        return ct
    endmethod

    
	method setLabel takes string label returns nothing
		set .label = label
	endmethod
	
	method setAlias takes string theAlias returns MonsterType
		set .theAlias = theAlias
        return this
	endmethod

    method refresh takes nothing returns nothing //recrée les monstres correspondant au niveau actuel
        local Level array levelsMaking
        local Escaper escaper
        local integer i
        local integer j
        local boolean levelAlreadyChecked
        local integer nbLevelsMaking = 0
        local Level currentLevel = udg_levels.getCurrentLevel()
        call currentLevel.refreshCastersOfType(this) 
        set i = 0
        loop
            exitwhen (i >= NB_ESCAPERS)
                set escaper = udg_escapers.get(i)
                if (escaper != 0) then
                    if (escaper.getMakingLevel() != currentLevel) then
                        set levelAlreadyChecked = false
                        set j = 0
                        loop
                            exitwhen (j >= nbLevelsMaking)
                                if (escaper.getMakingLevel() == levelsMaking[j]) then
                                    set levelAlreadyChecked = true
                                endif
                            set j = j + 1
                        endloop
                        if (not levelAlreadyChecked) then
                            set levelsMaking[nbLevelsMaking] = escaper.getMakingLevel()
                            set nbLevelsMaking = nbLevelsMaking + 1
                        endif
                    endif
                endif
            set i = i + 1
        endloop
        set i = 0
        loop
            exitwhen (i >= nbLevelsMaking)
                call levelsMaking[i].refreshCastersOfType(this)
            set i = i + 1
        endloop
    endmethod
    
    method onDestroy takes nothing returns nothing
        call udg_levels.removeCastersOfType(this)
    endmethod

    method getCasterMonsterType takes nothing returns MonsterType
        return .casterMonsterType
    endmethod
    
    method setCasterMonsterType takes MonsterType newCasterMonsterType returns nothing
        set .casterMonsterType = newCasterMonsterType
        call .refresh()
    endmethod
    
    method getProjectileMonsterType takes nothing returns MonsterType
        return .projectileMonsterType
    endmethod
    
    method setProjectileMonsterType takes MonsterType newProjectileMonsterType returns nothing
        set .projectileMonsterType = newProjectileMonsterType
    endmethod
    
    method getRange takes nothing returns real
        return .range
    endmethod
    
    method setRange takes real newRange returns boolean
        if (newRange <= 0) then
            return false
        endif
        set .range = newRange
        return true
    endmethod
    
    method getProjectileSpeed takes nothing returns real
        return .projectileSpeed
    endmethod
    
    method setProjectileSpeed takes real newSpeed returns boolean
        if (newSpeed <= 0) then
            return false
        endif
        set .projectileSpeed = newSpeed
        return true
    endmethod
    
    method getLoadTime takes nothing returns real
        return .loadTime
    endmethod
    
    method setLoadTime takes real loadTime returns boolean
        if (loadTime < MIN_CASTER_LOAD_TIME) then
            return false
        endif
        set .loadTime = loadTime
        return true
    endmethod
    
    method getAnimation takes nothing returns string
        return .animation
    endmethod
    
    method setAnimation takes string animation returns nothing
        set .animation = animation
    endmethod
    
    method displayForPlayer takes player p returns nothing
        local string space = "   "
        local string display = udg_colorCode[TEAL] + .label + " " + .theAlias + " : "
        set display = display + .casterMonsterType.label + space + .projectileMonsterType.label + space + "range: " + R2S(.range) + space
        set display = display + "projectileSpeed: " + R2S(.projectileSpeed) + space + "loadTime: " + R2S(.loadTime) + space + .animation
        call Text_P_timed(p, TERRAIN_DATA_DISPLAY_TIME, display)
    endmethod
    
    method toString takes nothing returns string
        local string str = .label + CACHE_SEPARATEUR_PARAM + .theAlias + CACHE_SEPARATEUR_PARAM
        set str = str + .casterMonsterType.label + CACHE_SEPARATEUR_PARAM + .projectileMonsterType.label + CACHE_SEPARATEUR_PARAM
        set str = str + R2S(.range) + CACHE_SEPARATEUR_PARAM + R2S(.projectileSpeed) + CACHE_SEPARATEUR_PARAM + R2S(.loadTime) + CACHE_SEPARATEUR_PARAM + .animation
        return str
    endmethod
endstruct


endlibrary