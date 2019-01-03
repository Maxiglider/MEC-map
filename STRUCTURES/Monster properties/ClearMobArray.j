//TESH.scrollpos=0
//TESH.alwaysfold=0
library ClearMobArray needs ClearMob

    

struct ClearMobArray [8000] //50 niveaux * 160 monstres
    private ClearMob array clearMobs [MAX_NB_CLEAR_MOB_BY_LEVEL]
	private integer lastInstance
	
	static method create takes nothing returns ClearMobArray
		local ClearMobArray cma = ClearMobArray.allocate()
		set cma.lastInstance = -1
		return cma
	endmethod
	
	method getFirstEmpty takes nothing returns integer
		local integer i = 0
		loop
			exitwhen (i > .lastInstance or .clearMobs[i] == 0)
			set i = i + 1
		endloop
		return i
	endmethod	
	
    method get takes integer arrayId returns ClearMob
        if (arrayId < 0 or arrayId > .lastInstance) then
            return 0
        endif
        return .clearMobs[arrayId]
    endmethod
    
    method getLastInstanceId takes nothing returns integer
        return .lastInstance
    endmethod
	
    method new takes integer triggerMobId, real disableDuration, boolean initialize returns ClearMob //retourne le clearMob s'il a pu être créé, 0 sinon
		//local integer n = .getFirstEmpty()
        local integer n = .lastInstance + 1
		if (n >= MAX_NB_CLEAR_MOB_BY_LEVEL) then
			return 0
		endif
		//if (n > .lastInstance) then
			set .lastInstance = n
		//endif
		set .clearMobs[n] = ClearMob.create(triggerMobId, disableDuration)
		if (initialize) then
			call .clearMobs[n].initialize()
		endif
        set .clearMobs[n].level = udg_levels.getLevelFromClearMobArray(this)
        set .clearMobs[n].arrayId = n
		return .clearMobs[n]   
    endmethod
	
	method count takes nothing returns integer
		local integer nb = 0
		local integer i = 0
		loop
			exitwhen (i > .lastInstance)
				if (.clearMobs[i] != 0) then
					set nb = nb + 1
				endif
			set i = i + 1
		endloop
		return nb
	endmethod
    
    method onDestroy takes nothing returns nothing
        local integer i = 0
        loop
            exitwhen (i > .lastInstance)
                if (.clearMobs[i] != 0) then
                    call .clearMobs[i].destroy()
                endif
            set i = i + 1
        endloop
        set .lastInstance = -1
    endmethod
    
    method setClearMobNull takes integer clearMobArrayId returns nothing
        set .clearMobs[clearMobArrayId] = 0
    endmethod
    
    method clearClearMob takes integer clearMobId returns boolean
        local integer i = 0
        loop
            exitwhen (.clearMobs[i] == ClearMob(clearMobId) or i > .lastInstance)
            set i = i + 1
        endloop
        if (i > .lastInstance) then
            return false
        endif
        call .clearMobs[i].destroy()
        return true
    endmethod
    
    method getClearMobNear takes real x, real y returns ClearMob
        local real xMob
        local real yMob
        local integer i = 0
        loop
            exitwhen (i > .lastInstance)
                if (.clearMobs[i] != 0 and .clearMobs[i].getTriggerMob().getUnit() != null) then
                    set xMob = GetUnitX(.clearMobs[i].getTriggerMob().getUnit())
                    set yMob = GetUnitY(.clearMobs[i].getTriggerMob().getUnit())
                    if (RAbsBJ(x - xMob) < MONSTER_NEAR_DIFF_MAX and RAbsBJ(y - yMob) < MONSTER_NEAR_DIFF_MAX) then
                        return .clearMobs[i]
                    endif
                endif
            set i = i + 1
        endloop
        return 0    
    endmethod
    
    method initializeClearMobs takes nothing returns nothing
        local integer i = 0
        loop
            exitwhen (i > .lastInstance)
                if (.clearMobs[i] != 0) then
                    call .clearMobs[i].initialize()
                endif
            set i = i + 1
        endloop
    endmethod
    
    method closeClearMobs takes nothing returns nothing
        local integer i = 0
        loop
            exitwhen (i > .lastInstance)
                if (.clearMobs[i] != 0) then
                    call .clearMobs[i].close()
                endif
            set i = i + 1
        endloop
    endmethod
endstruct


endlibrary