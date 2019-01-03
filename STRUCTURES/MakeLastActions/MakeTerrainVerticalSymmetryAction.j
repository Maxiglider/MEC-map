//TESH.scrollpos=8
//TESH.alwaysfold=0
library MakeTerrainVerticalSymmetryAction needs MakeAction, ModifyTerrainFunctions


struct MakeTerrainVerticalSymmetryAction extends MakeAction   
    private real minX
    private real minY
    private real maxX
    private real maxY

    static method create takes real x1, real y1, real x2, real y2 returns MakeTerrainVerticalSymmetryAction
        local MakeTerrainVerticalSymmetryAction a
       
        local real minX = RMinBJ(x1, x2)
        local real maxX = RMaxBJ(x1, x2)
        local real minY = RMinBJ(y1, y2)
        local real maxY = RMaxBJ(y1, y2)
        
        //pour éviter les ptits décalages
        set minX = I2R(R2I(minX / LARGEUR_CASE)) * LARGEUR_CASE
        set minY = I2R(R2I(minY / LARGEUR_CASE)) * LARGEUR_CASE
        set maxX = I2R(R2I(maxX / LARGEUR_CASE)) * LARGEUR_CASE
        set maxY = I2R(R2I(maxY / LARGEUR_CASE)) * LARGEUR_CASE
        
        if (GetNbCaseBetween(minX, minY, maxX, maxY) > NB_MAX_TILES_MODIFIED) then
            return 0
        endif
        set a = MakeTerrainVerticalSymmetryAction.allocate()
        set a.minX = minX
        set a.minY = minY
        set a.maxX = maxX
        set a.maxY = maxY
        call a.applySymmetry()        
        set a.isActionMadeB = true
        return a
    endmethod
    
    method applySymmetry takes nothing returns nothing
        local integer i
        local real x
        local real y
        local integer array terrainTypeIds
        
        //sauvegarde du terrain
        set i = 0
        set x = .minX
        set y = .minY
        loop
            exitwhen (y > .maxY)
                loop
                    exitwhen (x > .maxX)
                        set terrainTypeIds[i] = GetTerrainType(x, y)
                        set i = i + 1
                    set x = x + LARGEUR_CASE
                endloop
                set x = .minX
            set y = y + LARGEUR_CASE
        endloop
        
        //application de la symétrie
        set i = 0
        set x = .minX
        set y = .maxY
        loop
            exitwhen (y < .minY)
                loop
                    exitwhen (x > .maxX)
                        call ChangeTerrainType(x, y, terrainTypeIds[i])
                        set i = i + 1
                    set x = x + LARGEUR_CASE
                endloop
                set x = .minX
            set y = y - LARGEUR_CASE
        endloop  
    endmethod
    
	method cancel takes nothing returns boolean
        if (not .isActionMadeB) then
            return false
        endif
        call .applySymmetry()
        set .isActionMadeB = false
        call Text_mkP(.owner.getPlayer(), "terrain vertical symmetry cancelled")
        return true
	endmethod
	
	method redo takes nothing returns boolean
        if (.isActionMadeB) then
            return false
        endif
        call .applySymmetry()
        set .isActionMadeB = true
        call Text_mkP(.owner.getPlayer(), "terrain vertical symmetry redone")
        return true
	endmethod		
endstruct




endlibrary