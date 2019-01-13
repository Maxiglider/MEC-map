//TESH.scrollpos=0
//TESH.alwaysfold=0
library TerrainTypeWalk needs TerrainType


struct TerrainTypeWalk extends TerrainType
	private real walkSpeed
	
	static method create takes string label, integer terrainTypeId, real walkSpeed returns TerrainTypeWalk
		local TerrainTypeWalk tt 
        if (not CanUseTerrain(terrainTypeId)) then
            return 0
        endif        
        set tt = TerrainTypeWalk.allocate()
		set tt.label = label
        set tt.theAlias = null
		set tt.terrainTypeId = terrainTypeId
        set tt.walkSpeed = walkSpeed
        set tt.kind = "walk"
        set tt.orderId = 0
        set tt.cliffClassId = 1
        return tt
	endmethod
	
	method getWalkSpeed takes nothing returns real
		return .walkSpeed
	endmethod
	
	method setWalkSpeed takes real walkSpeed returns nothing
		set .walkSpeed = walkSpeed
	endmethod
endstruct





endlibrary