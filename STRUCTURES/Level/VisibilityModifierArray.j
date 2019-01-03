//TESH.scrollpos=0
//TESH.alwaysfold=0
library VisibilityModifierArray needs VisibilityModifier


struct VisibilityModifierArray [5000] //50 niveaux * 100 VM
	private VisibilityModifier array vms [100] 
	private integer lastInstance
	
	
	static method create takes nothing returns VisibilityModifierArray
		local VisibilityModifierArray v = VisibilityModifierArray.allocate()
		set v.lastInstance = -1
		return v
	endmethod
    
	private method onDestroy takes nothing returns nothing
		local integer i = 0
		loop
			exitwhen (i > .lastInstance)
				call .vms[i].destroy()
			set i = i + 1
		endloop
		set .lastInstance = -1
	endmethod
    
	method new takes real x1, real y1, real x2, real y2 returns VisibilityModifier
		if (.lastInstance >= 99) then
			return 0
		endif
        set .lastInstance = .lastInstance + 1
        set .vms[.lastInstance] = VisibilityModifier.create(x1, y1, x2, y2)
        set .vms[.lastInstance].level = udg_levels.getLevelFromVisibilityModifierArray(this)
        set .vms[.lastInstance].arrayId = .lastInstance
		return .vms[.lastInstance]
	endmethod
    
    method newFromExisting takes VisibilityModifier vm returns VisibilityModifier
        if (.lastInstance >= 199) then
            return 0
        endif
        set .lastInstance = .lastInstance + 1
        set .vms[.lastInstance] = vm
        return vm
    endmethod
	
	method count takes nothing returns integer
        local integer n = 0
        local integer i = 0
        loop
            exitwhen (i > .lastInstance)
                if (.vms[i] != 0) then
                    set n = n + 1
                endif
            set i = i + 1
        endloop
		return n
	endmethod
    
    method get takes integer visibilityId returns VisibilityModifier
        if (visibilityId < 0 or visibilityId > .lastInstance) then
            return 0
        endif
        return .vms[visibilityId]
    endmethod
    
    method getLastInstanceId takes nothing returns integer
        return .lastInstance
    endmethod
    
    method setNull takes integer arrayId returns nothing
        if (arrayId >= 0 and arrayId <= .lastInstance) then
            set .vms[arrayId] = 0
        endif
    endmethod
    
    method removeAllVisibilityModifiers takes nothing returns nothing
        loop
            exitwhen (.lastInstance < 0)
                call .vms[.lastInstance].destroy()
            set .lastInstance = .lastInstance - 1
        endloop
    endmethod
	
	method removeLasts takes integer numberOfVMToRemove returns boolean //renvoie true si tous sont supprimés
		local integer i = numberOfVMToRemove
		loop
			exitwhen (i <= 0 or .lastInstance < 0)
				call .vms[.lastInstance].destroy()
				set .lastInstance = .lastInstance - 1
			set i = i - 1
		endloop	
        return (i == 0)
	endmethod
	
	method activate takes boolean activ returns nothing
		local integer i = 0
		loop
			exitwhen (i > .lastInstance)
				call .vms[i].activate(activ)
			set i = i + 1
		endloop
	endmethod
endstruct




endlibrary

			