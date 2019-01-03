//TESH.scrollpos=0
//TESH.alwaysfold=0
library MMSimplePatrolActions needs TerrainTypeFunctions, Escaper

globals
    private constant real MIN_DIST = 5
    private constant real MAX_DIST = 2000
    private constant real ECART_DIST = 32
    private constant real ECART_ANGLE = 9
    private constant real DIST_ON_TERRAIN_MAX = 300
    private constant real DIST_ON_TERRAIN_DEFAULT = 50
    private real distOnTerrain = 50
endglobals


function MakeSimplePatrolAuto_ChangeDistOnTerrain takes real newDist returns boolean
    if (newDist < 0 or newDist > DIST_ON_TERRAIN_MAX) then
        return false
    endif
    set distOnTerrain = newDist
    return true
endfunction

function MakeSimplePatrolAuto_ChangeDistOnTerrainDefault takes nothing returns nothing
    set distOnTerrain = DIST_ON_TERRAIN_DEFAULT
endfunction


function MonsterMakingSimplePatrol_Actions takes nothing returns nothing
    local Monster monster
    local Escaper escaper = Hero2Escaper(GetTriggerUnit())
    local Make mkGeneral = escaper.getMake()
	local MakeMonsterSimplePatrol mk = MakeMonsterSimplePatrol(integer(mkGeneral))
    local real x = GetOrderPointX()
    local real y = GetOrderPointY()
    
    local real x1
    local real y1
    local real x2
    local real y2
    local real dist
    local real angle 
    local boolean found
    
    if (not IsIssuedOrder("smart")) then   
        return
    endif
    call StopUnit(mk.maker)
	
	
	if (mk.getMode() == "normal") then
		if (mk.isLastLocSavedUsed()) then
            if (GetLocDist(mk.lastX, mk.lastY, x, y) <= PATROL_DISTANCE_MIN) then
                call Text_erP(mk.makerOwner, "Too close to the start location !")
                return
            else
                set monster = escaper.getMakingLevel().monstersSimplePatrol.new(mk.getMonsterType(), mk.lastX, mk.lastY, x, y, true)
                call escaper.newAction(MakeMonsterAction.create(escaper.getMakingLevel(), monster))
                call mk.unsaveLocDefinitely()
            endif
		else
			call mk.saveLoc(x, y)
		endif
	endif
    
	
	if (mk.getMode() == "string") then
		if (mk.isLastLocSavedUsed()) then
            if (GetLocDist(mk.lastX, mk.lastY, x, y) <= PATROL_DISTANCE_MIN) then
                call Text_erP(mk.makerOwner, "Too close to the start location !")
                return
            else
                set monster = escaper.getMakingLevel().monstersSimplePatrol.new(mk.getMonsterType(), mk.lastX, mk.lastY, x, y, true)
                call escaper.newAction(MakeMonsterAction.create(escaper.getMakingLevel(), monster))
                call mk.unsaveLoc()
            endif
        endif
		call mk.saveLoc(x, y)
	endif
    
    
    if (mk.getMode() == "auto") then
        if (IsTerrainTypeOfKind(GetTerrainType(x, y), "death")) then
            call Text_erP(mk.makerOwner, "You clicked on a death terrain !")
            return
        endif
        
        //find approximatively first location
        set found = false
        set dist = MIN_DIST
        loop
            exitwhen (found or dist > MAX_DIST)
                set angle = 0
                set x1 = x + dist * CosBJ(angle)
                set y1 = y + dist * SinBJ(angle)
                set found = IsTerrainTypeOfKind(GetTerrainType(x1, y1), "death")
                exitwhen found
                
                set angle = 90
                set x1 = x + dist * CosBJ(angle)
                set y1 = y + dist * SinBJ(angle)
                set found = IsTerrainTypeOfKind(GetTerrainType(x1, y1), "death")
                exitwhen found
                
                set angle = 180
                set x1 = x + dist * CosBJ(angle)
                set y1 = y + dist * SinBJ(angle)
                set found = IsTerrainTypeOfKind(GetTerrainType(x1, y1), "death")
                exitwhen found
                
                set angle = 270
                set x1 = x + dist * CosBJ(angle)
                set y1 = y + dist * SinBJ(angle)
                set found = IsTerrainTypeOfKind(GetTerrainType(x1, y1), "death")
                exitwhen found
                
                set angle = 1
                loop
                    exitwhen (found or angle >= 360)
                        set x1 = x + dist * CosBJ(angle)
                        set y1 = y + dist * SinBJ(angle)
                        set found = IsTerrainTypeOfKind(GetTerrainType(x1, y1), "death")
                    set angle = angle + ECART_ANGLE
                endloop
                set angle = angle - ECART_ANGLE
                
            set dist = dist + ECART_DIST
        endloop
        
        //first location not found
        if (not found) then
            call Text_erP(mk.makerOwner, "Death terrain too far !")
            return
        endif
        
        //precise position of first location
        loop
            exitwhen (not IsTerrainTypeOfKind(GetTerrainType(x1, y1), "death"))
            set dist = dist - 1
                set x1 = x + dist * CosBJ(angle)
                set y1 = y + dist * SinBJ(angle)
        endloop
        set dist = dist + distOnTerrain + 1
        set x1 = x + dist * CosBJ(angle)
        set y1 = y + dist * SinBJ(angle)
        
        //prepare angle for the second location
        if (angle >= 180) then
            set angle = angle - 180
        else
            set angle = angle + 180
        endif
        
        //find approximatively second location
        set found = false
        set dist = MIN_DIST
        loop
            exitwhen (found or dist > MAX_DIST)
                set x2 = x + dist * CosBJ(angle)
                set y2 = y + dist * SinBJ(angle)        
                set found = IsTerrainTypeOfKind(GetTerrainType(x2, y2), "death")
            set dist = dist + ECART_DIST
        endloop
        
        //second location not found
        if (not found) then
            call Text_erP(mk.makerOwner, "Death terrain too far for the second location !")
            return
        endif
        
        //precise position of second location
        loop
            exitwhen (not IsTerrainTypeOfKind(GetTerrainType(x2, y2), "death"))
            set dist = dist - 1
                set x2 = x + dist * CosBJ(angle)
                set y2 = y + dist * SinBJ(angle)
        endloop
        set dist = dist + distOnTerrain + 1
        set x2 = x + dist * CosBJ(angle)
        set y2 = y + dist * SinBJ(angle)
        
        //the two locations were found, creating monster
        set monster = escaper.getMakingLevel().monstersSimplePatrol.new(mk.getMonsterType(), x1, y1, x2, y2, true)
        call escaper.newAction(MakeMonsterAction.create(escaper.getMakingLevel(), monster))
    endif
endfunction



endlibrary

