//TESH.scrollpos=0
//TESH.alwaysfold=0
library TerrainTypeSlide needs TerrainType


struct TerrainTypeSlide extends TerrainType
	private real slideSpeed
    private boolean canTurn
	
	
	static method create takes string label, integer terrainTypeId, real slideSpeed, boolean canTurn returns TerrainTypeSlide
		local TerrainTypeSlide tt
        if (not CanUseTerrain(terrainTypeId)) then
            return 0
        endif   
        set tt = TerrainTypeSlide.allocate()
		set tt.label = label
        set tt.theAlias = null
		set tt.terrainTypeId = terrainTypeId
        set tt.kind = "slide"
		set tt.slideSpeed = slideSpeed * SLIDE_PERIOD
        set tt.canTurn = canTurn
        set tt.orderId = 0
        return tt
	endmethod
    
    method getSlideSpeed takes nothing returns real
        return .slideSpeed
    endmethod
    
    method setSlideSpeed takes real slideSpeed returns nothing
        set .slideSpeed = slideSpeed * SLIDE_PERIOD
    endmethod
    
    method getCanTurn takes nothing returns boolean
        return .canTurn
    endmethod
    
    method setCanTurn takes boolean canTurn returns boolean
        if (canTurn == .canTurn) then
            return false
        endif
        set .canTurn = canTurn
        return true
    endmethod
endstruct




endlibrary