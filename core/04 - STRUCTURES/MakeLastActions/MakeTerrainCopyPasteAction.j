//TESH.scrollpos=141
//TESH.alwaysfold=0
library MakeTerrainCopyPasteAction needs MakeAction, ModifyTerrainFunctions


struct MakeTerrainCopyPasteAction extends MakeAction
    static hashtable terrainSavesBefore
    static hashtable terrainSavesAfter
    static integer terrainSaveLastId
    
    private static method onInit takes nothing returns nothing
        set MakeTerrainCopyPasteAction.terrainSavesBefore = InitHashtable()
        set MakeTerrainCopyPasteAction.terrainSavesAfter = InitHashtable()
        set MakeTerrainCopyPasteAction.terrainSaveLastId = -1
    endmethod
    
    static method newTerrainSaveId takes nothing returns integer
        set MakeTerrainCopyPasteAction.terrainSaveLastId = MakeTerrainCopyPasteAction.terrainSaveLastId + 1
        return MakeTerrainCopyPasteAction.terrainSaveLastId
    endmethod
    
    static method removeTerrainSave takes integer terrainSaveId returns nothing
        call FlushChildHashtable(MakeTerrainCopyPasteAction.terrainSavesBefore, terrainSaveId)
        call FlushChildHashtable(MakeTerrainCopyPasteAction.terrainSavesAfter, terrainSaveId)
    endmethod    
    
    
    private integer terrainSaveId
    private real minX
    private real minY
    private real maxX
    private real maxY

    static method create takes real x1, real y1, real x2, real y2, real x3, real y3, real x4, real y4 returns MakeTerrainCopyPasteAction
        local MakeTerrainCopyPasteAction a
        local real xCopy
        local real yCopy
        local real xPaste
        local real yPaste
        local integer i
        local TerrainType terrainType
        local integer terrainTypeId
       
        local real minXcopy = RMinBJ(x1, x2)
        local real maxXcopy = RMaxBJ(x1, x2)
        local real minYcopy = RMinBJ(y1, y2)
        local real maxYcopy = RMaxBJ(y1, y2)
        
        local real diffX = maxXcopy - minXcopy
        local real diffY = maxYcopy - minYcopy
        
        local real minXpaste
        local real minYpaste
        if (x4 > x3) then 
            //direction droite
            set minXpaste = x3
        else    
            //direction gauche
            set minXpaste = x3 - diffX
        endif
        if (y4 > y3) then 
            //direction haut
            set minYpaste = y3
        else    
            //direction bas
            set minYpaste = y3 - diffY
        endif
        
        if (minXpaste < MAP_MIN_X or minXpaste + diffX > MAP_MAX_X or minYpaste < MAP_MIN_Y or minYpaste + diffY > MAP_MAX_Y) then
            return 0
        endif
        
        set a = MakeTerrainCopyPasteAction.allocate()
        set a.terrainSaveId = MakeTerrainCopyPasteAction.newTerrainSaveId()
        set a.minX = minXpaste
        set a.minY = minYpaste
        set a.maxX = minXpaste + diffX
        set a.maxY = minYpaste + diffY
        
        set i = 0
        set xPaste = minXpaste
        set yPaste = minYpaste
        set xCopy = minXcopy
        set yCopy = minYcopy
        loop
            exitwhen (yCopy > maxYcopy)
                loop
                    exitwhen (xCopy > maxXcopy)
                        call SaveInteger(MakeTerrainCopyPasteAction.terrainSavesBefore, a.terrainSaveId, i, integer(udg_terrainTypes.getTerrainType(xPaste, yPaste)))
                        set terrainType = udg_terrainTypes.getTerrainType(xCopy, yCopy)
                        call SaveInteger(MakeTerrainCopyPasteAction.terrainSavesAfter, a.terrainSaveId, i, integer(udg_terrainTypes.getTerrainType(xCopy, yCopy)))
                        if (terrainType != 0) then
                            set terrainTypeId = terrainType.getTerrainTypeId()
                            if (terrainTypeId != 0) then
                                call ChangeTerrainType(xPaste, yPaste, terrainTypeId)
                            endif
                        endif                        
                        set i = i + 1
                        set xPaste = xPaste + LARGEUR_CASE
                    set xCopy = xCopy + LARGEUR_CASE
                endloop
                set xPaste = minXpaste
                set xCopy = minXcopy
                set yPaste = yPaste + LARGEUR_CASE
            set yCopy = yCopy + LARGEUR_CASE
        endloop
        
        set a.isActionMadeB = true
        return a
    endmethod
    
    private method onDestroy takes nothing returns nothing
        call MakeTerrainCopyPasteAction.removeTerrainSave(.terrainSaveId)
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
                        set terrainType = TerrainType(LoadInteger(MakeTerrainCopyPasteAction.terrainSavesBefore, .terrainSaveId, i))
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
                        set terrainType = TerrainType(LoadInteger(MakeTerrainCopyPasteAction.terrainSavesAfter, .terrainSaveId, i))
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
    
	method cancel takes nothing returns boolean
        if (not .isActionMadeB) then
            return false
        endif
        call .terrainModificationCancel()
        set .isActionMadeB = false
        call Text_mkP(.owner.getPlayer(), "terrain copy/paste cancelled")
        return true
	endmethod
	
	method redo takes nothing returns boolean
        if (.isActionMadeB) then
            return false
        endif
        call .terrainModificationRedo()
        set .isActionMadeB = true
        call Text_mkP(.owner.getPlayer(), "terrain copy/paste redone")
        return true
	endmethod		
endstruct




endlibrary