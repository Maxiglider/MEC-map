//TESH.scrollpos=55
//TESH.alwaysfold=0
library MonsterTypeArray needs MonsterType


struct MonsterTypeArray
    private MonsterType array monsterTypes [1000]
    private integer numberOfMonsterTypes

    static method create takes nothing returns MonsterTypeArray
        local MonsterTypeArray ma = MonsterTypeArray.allocate()
        set ma.numberOfMonsterTypes = 0
        return ma        
    endmethod
    
    method get takes string label returns MonsterType
		local integer i = 0
		loop
			exitwhen (i >= .numberOfMonsterTypes)
				if (.monsterTypes[i].label == label or .monsterTypes[i].theAlias == label) then
					return .monsterTypes[i]
				endif
			set i = i + 1
		endloop
		return 0
	endmethod

	method isLabelAlreadyUsed takes string label returns boolean
		return (.get(label) != 0)
	endmethod
    
    method new takes string label, integer unitTypeId, real scale, real immolationRadius, real speed, boolean isClickable returns MonsterType
        local integer n = .numberOfMonsterTypes
        if (.isLabelAlreadyUsed(label)) then
            return 0
        endif
        set .monsterTypes[n] = MonsterType.create(label, unitTypeId, scale, immolationRadius, speed, isClickable)
        if (.monsterTypes[n] != 0) then
            set .numberOfMonsterTypes = .numberOfMonsterTypes + 1
        endif
        return .monsterTypes[n]
    endmethod
    
    method remove takes string label returns boolean
        local integer position
        local integer i
        local MonsterType mt = .get(label)
        if (mt == 0) then
            return false
        endif
        set i = 0
        loop
            exitwhen (.monsterTypes[i].label == label or .monsterTypes[i].theAlias == label or i >= .numberOfMonsterTypes)
            set i = i + 1
        endloop
        if (i < .numberOfMonsterTypes) then
            set position = i
            set i = i + 1
            loop
                exitwhen (i >= .numberOfMonsterTypes)
                    set .monsterTypes[i-1] = .monsterTypes[i]
                set i = i + 1
            endloop
            set .numberOfMonsterTypes = .numberOfMonsterTypes - 1
        endif
        call mt.destroy()
        return true
    endmethod
    
    method displayForPlayer takes player p returns nothing
        local integer i = 0
        loop
            exitwhen (i >= .numberOfMonsterTypes)
                call .monsterTypes[i].displayForPlayer(p)
            set i = i + 1
        endloop
        if (.numberOfMonsterTypes == 0) then
            call Text_erP(p, "no monster type saved")
        endif
    endmethod
    
    method monsterUnit2KillEffectStr takes unit monsterUnit returns string
        local MonsterOrCaster moc = MonsterOrCaster.create(GetUnitUserData(monsterUnit))
        local MonsterType mt = moc.getMonsterType()
        call moc.destroy()
        return mt.getKillingEffectStr()
    endmethod
    
    method monsterUnit2MonsterType takes unit monsterUnit returns MonsterType
        local integer monsterUnitTypeId = GetUnitTypeId(monsterUnit)
        local integer i = 0
        loop
            exitwhen (i >= .numberOfMonsterTypes)
                if(.monsterTypes[i].getUnitTypeId() == monsterUnitTypeId)then
                    return .monsterTypes[i]
                endif
            set i = i + 1
        endloop
        return 0
    endmethod
    
    method saveInCache takes nothing returns nothing
        local integer i
        set stringArrayForCache = StringArrayForCache.create("monsterTypes", "monsterTypes", true)
        set i = 0
        loop
            exitwhen (i >= .numberOfMonsterTypes)
                call stringArrayForCache.push(.monsterTypes[i].toString())
            set i = i + 1
        endloop
        call stringArrayForCache.writeInCache()
    endmethod
endstruct



endlibrary