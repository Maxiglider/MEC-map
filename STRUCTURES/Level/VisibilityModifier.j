//TESH.scrollpos=0
//TESH.alwaysfold=0
library VisibilityModifier


struct VisibilityModifier [5000] //50 niveaux * 100 VM
	private real x1
	private real y1
	private real x2
	private real y2
	private fogmodifier fm
    Level level
    integer arrayId
	
	static method create takes real x1, real y1, real x2, real y2 returns VisibilityModifier
		local VisibilityModifier vm = VisibilityModifier.allocate()
		local rect visionRect = Rect(x1, y1, x2, y2)
		set vm.x1 = x1
		set vm.y1 = y1
		set vm.x2 = x2
		set vm.y2 = y2
        set vm.fm = CreateFogModifierRect(Player(0), FOG_OF_WAR_VISIBLE, visionRect, true, false)
		call RemoveRect(visionRect)
		set visionRect = null
        call RefreshHideAllVM()
		return vm
	endmethod
	
	private method onDestroy takes nothing returns nothing
		call DestroyFogModifier(.fm)
		set .fm = null
        call .level.visibilities.setNull(.arrayId)
	endmethod
	
	method activate takes boolean activ returns nothing
		if (activ) then
			call FogModifierStart(.fm)
		else
			call FogModifierStop(.fm)
		endif
	endmethod
    
    method copy takes nothing returns VisibilityModifier
        return VisibilityModifier.create(.x1, .y1, .x2, .y2) 
    endmethod
    
    method toString takes nothing returns string
        local string x1 = I2S(R2I(.x1))
        local string y1 = I2S(R2I(.y1))
        local string x2 = I2S(R2I(.x2))
        local string y2 = I2S(R2I(.y2))
        return (x1 + CACHE_SEPARATEUR_PARAM + y1 + CACHE_SEPARATEUR_PARAM + x2 + CACHE_SEPARATEUR_PARAM + y2)
    endmethod
endstruct




endlibrary