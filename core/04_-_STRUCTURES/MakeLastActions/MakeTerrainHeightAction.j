//TESH.scrollpos=0
//TESH.alwaysfold=0
library MakeTerrainHeightAction needs MakeAction


struct MakeTerrainHeightAction extends MakeAction   
    private real radius
    private real height
    private real x
    private real y
    private terraindeformation terrainDeform
    
    static method create takes real radius, real height, real x, real y returns MakeTerrainHeightAction
        local MakeTerrainHeightAction a = MakeTerrainHeightAction.allocate()
        set a.radius = radius
        set a.height = height
        set a.x = x
        set a.y = y
        call a.apply()  
        set a.isActionMadeB = true
        return a
    endmethod
    
    method apply takes nothing returns nothing
        set .terrainDeform = TerrainDeformCrater(.x, .y, .radius, -.height, 0, true)
    endmethod
    
    method cancel takes nothing returns boolean
        if (not .isActionMadeB) then
            return false
        endif
        call TerrainDeformStop(.terrainDeform, 0)
        set .isActionMadeB = false
        call Text_mkP(.owner.getPlayer(), "terrain height cancelled")
        return true
    endmethod	
	
	method redo takes nothing returns boolean
        if (.isActionMadeB) then
            return false
        endif
		call .apply()
        set .isActionMadeB = true
        call Text_mkP(.owner.getPlayer(), "terrain height redone")
        return true
	endmethod
endstruct




endlibrary