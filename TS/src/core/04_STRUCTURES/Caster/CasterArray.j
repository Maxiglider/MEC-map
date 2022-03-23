//TESH.scrollpos=0
//TESH.alwaysfold=0
library CasterArray needs Caster


struct CasterArray [25000] //50 niveaux * 500 monstres
    private Caster array casters [MAX_NB_MONSTERS]
	private integer lastInstance
	
	static method create takes nothing returns CasterArray
		local CasterArray ca = CasterArray.allocate()
		set ca.lastInstance = -1
		return ca
	endmethod
	
	method getFirstEmpty takes nothing returns integer
		local integer i = 0
		loop
			exitwhen (i > .lastInstance or .casters[i] == 0)
			set i = i + 1
		endloop
		return i
	endmethod	
	
    method get takes integer arrayId returns Caster
        if (arrayId < 0 or arrayId > .lastInstance) then
            return 0
        endif
        return .casters[arrayId]
    endmethod
    
    method getLastInstanceId takes nothing returns integer
        return .lastInstance
    endmethod
	
    method new takes CasterType casterType, real x, real y, real angle, boolean enable returns Caster //retourne le caster s'il a pu être créé, 0 sinon
		//local integer n = .getFirstEmpty()
        local integer n = .lastInstance + 1
		if (n >= MAX_NB_MONSTERS) then
			return 0
		endif
		//if (n > .lastInstance) then
			set .lastInstance = n
		//endif
		set .casters[n] = Caster.create(casterType, x, y, angle)
		if (enable) then
			call .casters[n].enable()
		endif
        set .casters[n].level = udg_levels.getLevelFromCasterArray(this)
        set .casters[n].arrayId = n
		return .casters[n]   
    endmethod
	
	method count takes nothing returns integer
		local integer nb = 0
		local integer i = 0
		loop
			exitwhen (i > .lastInstance)
				if (.casters[i] != 0) then
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
                if (.casters[i] != 0) then
                    call .casters[i].destroy()
                endif
            set i = i + 1
        endloop
        set .lastInstance = -1
    endmethod
    
    method setCasterNull takes integer casterArrayId returns nothing
        set .casters[casterArrayId] = 0
    endmethod
    
    method clearCaster takes integer casterId returns boolean
        local integer i = 0
        loop
            exitwhen (.casters[i] == Caster(casterId) or i > .lastInstance)
            set i = i + 1
        endloop
        if (i > .lastInstance) then
            return false
        endif
        call .casters[i].destroy()
        return true
    endmethod
    
    method getCasterNear takes real x, real y returns Caster
        local real xCaster
        local real yCaster
        local integer i = 0
        loop
            exitwhen (i > .lastInstance)
                if (.casters[i] != 0 and .casters[i].casterUnit != null) then
                    set xCaster = GetUnitX(.casters[i].casterUnit)
                    set yCaster = GetUnitY(.casters[i].casterUnit)
                    if (RAbsBJ(x - xCaster) < MONSTER_NEAR_DIFF_MAX and RAbsBJ(y - yCaster) < MONSTER_NEAR_DIFF_MAX) then
                        return .casters[i]
                    endif
                endif
            set i = i + 1
        endloop
        return 0    
    endmethod
    
    method createCasters takes nothing returns nothing
        local integer i = 0
        loop
            exitwhen (i > .lastInstance)
                if (.casters[i] != 0) then
                    call .casters[i].enable()
                endif
            set i = i + 1
        endloop
    endmethod
    
    method removeCasters takes nothing returns nothing
        local integer i = 0
        loop
            exitwhen (i > .lastInstance)
                if (.casters[i] != 0) then
                    call .casters[i].disable()
                endif
            set i = i + 1
        endloop
    endmethod
    
    method refreshCastersOfType takes CasterType casterType returns nothing
        local integer i = 0
        loop
            exitwhen (i > .lastInstance)
                if (.casters[i] != 0 and .casters[i].getCasterType() == casterType and .casters[i].casterUnit != null) then
                    call .casters[i].refresh()
                endif
            set i = i + 1
        endloop
    endmethod
    
    method removeCastersOfType takes CasterType casterType returns nothing
        local integer i = 0
        loop
            exitwhen (i > .lastInstance)
                if (.casters[i] != 0 and .casters[i].getCasterType() == casterType) then
                    call .casters[i].destroy()
                endif
            set i = i + 1
        endloop
    endmethod
endstruct



endlibrary