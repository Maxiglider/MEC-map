//TESH.scrollpos=95
//TESH.alwaysfold=0
library MakeTerrainCreateAction needs MakeAction, ModifyTerrainFunctions


struct MakeTerrainCreateAction extends MakeAction
    static hashtable terrainSaves
    static integer terrainSaveLastId
    
    private static method onInit takes nothing returns nothing
        set MakeTerrainCreateAction.terrainSaves = InitHashtable()
        set MakeTerrainCreateAction.terrainSaveLastId = -1
    endmethod
    
    static method newTerrainSaveId takes nothing returns integer
        set MakeTerrainCreateAction.terrainSaveLastId = MakeTerrainCreateAction.terrainSaveLastId + 1
        return MakeTerrainCreateAction.terrainSaveLastId
    endmethod
    
    static method removeTerrainSave takes integer terrainSaveId returns nothing
        call FlushChildHashtable(MakeTerrainCreateAction.terrainSaves, terrainSaveId)
    endmethod    
    
    
    
    private integer terrainSaveId
    private TerrainType terrainTypeNew
    private real minX
    private real minY
    private real maxX
    private real maxY

    static method create takes TerrainType terrainTypeNew, real x1, real y1, real x2, real y2 returns MakeTerrainCreateAction
        local hashtable terrainSave
        local integer terrainSaveId
        local MakeTerrainCreateAction a
        local real x
        local real y
        local integer i
       
        local real minX = RMinBJ(x1, x2)
        local real maxX = RMaxBJ(x1, x2)
        local real minY = RMinBJ(y1, y2)
        local real maxY = RMaxBJ(y1, y2)
        
        if (terrainTypeNew == 0 or terrainTypeNew.getTerrainTypeId() == 0) then
            return -1
        endif
        if (GetNbCaseBetween(minX, minY, maxX, maxY) > NB_MAX_TILES_MODIFIED) then
            return 0
        endif
        set a = MakeTerrainCreateAction.allocate()
        set terrainSave = MakeTerrainCreateAction.terrainSaves
        set a.terrainSaveId = MakeTerrainCreateAction.newTerrainSaveId()
        
        set i = 0
        set x = minX
        set y = minY
        loop
            exitwhen (y > maxY)
                loop
                    exitwhen (x > maxX)
                        call SaveInteger(terrainSave, a.terrainSaveId, i, integer(udg_terrainTypes.getTerrainType(x, y)))
                        set i = i + 1
                    set x = x + LARGEUR_CASE
                endloop
                set x = minX
            set y = y + LARGEUR_CASE
        endloop 
        set terrainSave = null
        
        call ChangeTerrainBetween(terrainTypeNew.getTerrainTypeId(), minX, minY, maxX, maxY)
        set a.terrainTypeNew = terrainTypeNew
        set a.minX = minX
        set a.maxX = maxX
        set a.minY = minY
        set a.maxY = maxY
        set a.isActionMadeB = true
        return a
    endmethod
    
    private method onDestroy takes nothing returns nothing
        call MakeTerrainCreateAction.removeTerrainSave(.terrainSaveId)
    endmethod
    
    method terrainModificationCancel takes nothing returns nothing 
        local TerrainType terrainType
        local real x
        local real y
        local integer i
       
        set i = 0
        set x = .minX
        set y = .minY
        loop
            exitwhen (y > .maxY)
                loop
                    exitwhen (x > .maxX)
                        set terrainType = TerrainType(LoadInteger(MakeTerrainCreateAction.terrainSaves, .terrainSaveId, i))
                        if (terrainType != 0 and terrainType.getTerrainTypeId() != 0) then
                            call ChangeTerrainType(x, y, terrainType.getTerrainTypeId())
                        endif
                        set i = i + 1
                    set x = x + LARGEUR_CASE
                endloop
                set x = .minX
            set y = y + LARGEUR_CASE
        endloop
    endmethod
    
    method terrainModificationRedo takes nothing returns nothing 
        local integer terrainTypeId = .terrainTypeNew.getTerrainTypeId()
        if (terrainTypeId == 0) then
            call Text_erP(.owner.getPlayer(), "the terrain type for this action doesn't exist anymore")
        else
            call ChangeTerrainBetween(terrainTypeId, .minX, .minY, .maxX, .maxY)
        endif
    endmethod
    
	method cancel takes nothing returns boolean
        if (not .isActionMadeB) then
            return false
        endif
        call .terrainModificationCancel()
        set .isActionMadeB = false
        call Text_mkP(.owner.getPlayer(), "terrain creation cancelled")
        return true
	endmethod
	
	method redo takes nothing returns boolean
        if (.isActionMadeB) then
            return false
        endif
        call .terrainModificationRedo()
        set .isActionMadeB = true
        call Text_mkP(.owner.getPlayer(), "terrain creation redone")
        return true
	endmethod		
endstruct




endlibrary