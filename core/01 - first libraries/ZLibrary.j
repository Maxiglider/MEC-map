//TESH.scrollpos=67
//TESH.alwaysfold=0
library ZLibrary ////  by D.O.G.  version 2.5  ////
    ///////////////////////////////////////////////
    ///////////////////  A P I  ///////////////////
    ///////////////////////////////////////////////
    // function GetSurfaceZ takes real x, real y returns real
    //  - Gets terrain Z if specified point is on the ground
    //    or water surface Z if specified point is in the water
    ///////////////////////////////////////////////
    // function GetTerrainZ takes real x, real y returns real
    //  - Gets terrain Z regardless of specified point position
    ///////////////////////////////////////////////
    // function GetUnitZ takes unit u returns real
    // function SetUnitZ takes unit u, real z returns nothing
    //  - They work perfectly on ground units with
    //    pre-added and removed "Crow Form" ability,
    //    BUT inaccurately on flying units near and
    //    over cliffs due to War3 smooth flying over
    //    cliffs system
    ///////////////////////////////////////////////
    // function CreateUnitZ takes player p, integer unitid, real x, real y, real z, real face returns unit
    //  - The same as "CreateUnit" but with extra parameter Z
    ///////////////////////////////////////////////
    // function GetWaterDepth takes real x, real y returns real
    //  - gets water depth in specified point
    //    (returns 0 if no water else positive real number)
    ///////////////////////////////////////////////
    // function GetWaterType takes real x, real y returns integer
    //  - returns WATER_TYPE_NONE, WATER_TYPE_SHALLOW or WATER_TYPE_DEEP
    ///////////////////////////////////////////////
    /////////////  C O N S T A N T S  /////////////
    ///////////////////////////////////////////////
    globals
        constant integer WATER_TYPE_NONE = 0
        constant integer WATER_TYPE_SHALLOW = 1
        constant integer WATER_TYPE_DEEP = 2
    endglobals
    ///////////////////////////////////////////////
    //////////////////  C O D E  //////////////////
    ///////////////////////////////////////////////
    globals
        private constant integer PLATFORM = 'B000'
        private constant real PLATFORM_HEIGHT = 2745.46265
        private constant location p = Location(0.0, 0.0)
    endglobals
    
    function GetSurfaceZ takes real x, real y returns real
        call MoveLocation(p, x, y)
        return GetLocationZ(p)
    endfunction
   
    function GetTerrainZ takes real x, real y returns real
        local real z
        local destructable d = CreateDestructable(PLATFORM, x, y, 0.0, 10.0, 0)
        call MoveLocation(p, x, y)
        set z = GetLocationZ(p) - PLATFORM_HEIGHT
        call RemoveDestructable(d)
        set d = null
        return z
    endfunction
   
    function GetUnitZ takes unit u returns real
        if IsUnitType(u, UNIT_TYPE_FLYING) then
            return GetSurfaceZ(GetUnitX(u), GetUnitY(u)) + GetUnitFlyHeight(u)
        endif
        return GetTerrainZ(GetUnitX(u), GetUnitY(u)) + GetUnitFlyHeight(u)
    endfunction
   
    function SetUnitZ takes unit u, real z returns nothing
        if IsUnitType(u, UNIT_TYPE_FLYING) then
            call SetUnitFlyHeight(u, z - GetSurfaceZ(GetUnitX(u), GetUnitY(u)), 0.0)
        else
            call SetUnitFlyHeight(u, z - GetTerrainZ(GetUnitX(u), GetUnitY(u)), 0.0)
        endif
    endfunction
   
    function CreateUnitZ takes player p, integer unitid, real x, real y, real z, real face returns unit
        local unit u = CreateUnit(p, unitid, x, y, face)
        // Enable setting fly height for ground units
        static if not LIBRARY_AutoFly then
            call UnitAddAbility(u, 'Amrf') // "Crow Form"
            call UnitRemoveAbility(u, 'Amrf')
        endif
        // Finally set Z
        call SetUnitZ(u, z)
        return u
    endfunction
   
    function GetWaterDepth takes real x, real y returns real
        local real z
        local destructable d
        call MoveLocation(p, x, y)
        set z = GetLocationZ(p)
        set d = CreateDestructable(PLATFORM, x, y, 0.0, 10.0, 0)
        set z = z + PLATFORM_HEIGHT - GetLocationZ(p)
        call RemoveDestructable(d)
        set d = null
        if z >= 0.0 then // Small negative results may occur such as -0.0001
            return z
        endif
        return 0.0
    endfunction
    
    function GetWaterType takes real x, real y returns integer
        local real d = GetWaterDepth(x, y)
        if d == 0.0 then
            return WATER_TYPE_NONE
        elseif d < 52.0 then
            return WATER_TYPE_SHALLOW
        endif
        return WATER_TYPE_DEEP
    endfunction
    
endlibrary