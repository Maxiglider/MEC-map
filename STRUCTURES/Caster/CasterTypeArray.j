//TESH.scrollpos=0
//TESH.alwaysfold=0
library CasterTypeArray needs CasterType


struct CasterTypeArray
    private CasterType array casterTypes [100]
    private integer numberOfCasterTypes

    static method create takes nothing returns CasterTypeArray
        local CasterTypeArray ta = CasterTypeArray.allocate()
        set ta.numberOfCasterTypes = 0
        return ta        
    endmethod
    
    method get takes string label returns CasterType
		local integer i = 0
		loop
			exitwhen (i >= .numberOfCasterTypes)
				if (.casterTypes[i].label == label or .casterTypes[i].theAlias == label) then
					return .casterTypes[i]
				endif
			set i = i + 1
		endloop
		return 0
	endmethod

	method isLabelAlreadyUsed takes string label returns boolean
		return (.get(label) != 0)
	endmethod
    
    method new takes string label, MonsterType casterMonsterType, MonsterType projectileMonsterType, real range, real projectileSpeed, real loadTime, string animation returns CasterType
        local integer n = .numberOfCasterTypes
        if (.isLabelAlreadyUsed(label)) then
            return 0
        endif
        set .casterTypes[n] = CasterType.create(label, casterMonsterType, projectileMonsterType, range, projectileSpeed, loadTime, animation)
        if (.casterTypes[n] != 0) then
            set .numberOfCasterTypes = .numberOfCasterTypes + 1
        endif
        return .casterTypes[n]
    endmethod
    
    method remove takes string label returns boolean
        local integer position
        local integer i
        local CasterType ct = .get(label)
        if (ct == 0) then
            return false
        endif
        set i = 0
        loop
            exitwhen (.casterTypes[i].label == label or .casterTypes[i].theAlias == label or i >= .numberOfCasterTypes)
            set i = i + 1
        endloop
        if (i < .numberOfCasterTypes) then
            set position = i
            set i = i + 1
            loop
                exitwhen (i >= .numberOfCasterTypes)
                    set .casterTypes[i-1] = .casterTypes[i]
                set i = i + 1
            endloop
            set .numberOfCasterTypes = .numberOfCasterTypes - 1
        endif
        call ct.destroy()
        return true
    endmethod
    
    method displayForPlayer takes player p returns nothing
        local integer i = 0
        loop
            exitwhen (i >= .numberOfCasterTypes)
                call .casterTypes[i].displayForPlayer(p)
            set i = i + 1
        endloop
        if (.numberOfCasterTypes == 0) then
            call Text_erP(p, "no caster type saved")
        endif
    endmethod
    
    method saveInCache takes nothing returns nothing
        local integer i
        set stringArrayForCache = StringArrayForCache.create("casterTypes", "casterTypes", true)
        set i = 0
        loop
            exitwhen (i >= .numberOfCasterTypes)
                call stringArrayForCache.push(.casterTypes[i].toString())
            set i = i + 1
        endloop
        call stringArrayForCache.writeInCache()
    endmethod
endstruct


endlibrary