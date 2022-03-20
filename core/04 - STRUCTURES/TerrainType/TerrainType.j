//TESH.scrollpos=54
//TESH.alwaysfold=0
library TerrainType needs TerrainTypeFunctions, TerrainFunctions


struct TerrainType 
    string label
    string theAlias
    string kind
	integer terrainTypeId
    integer orderId //numéro du terrain (ordre des tilesets), de 1 à 16
    integer cliffClassId //cliff class 1 or 2, depending of the main tileset
    
    method setOrderId takes integer orderId returns TerrainType
        set .orderId = orderId
        return TerrainType(integer(this))
    endmethod
    
    method getOrderId takes nothing returns integer
        return .orderId
    endmethod

    method setCliffClassId takes integer cliffClassId returns TerrainType
        if (cliffClassId == 1 or cliffClassId == 2) then
            set .cliffClassId = cliffClassId
        endif
        return TerrainType(integer(this))
    endmethod
    
    method getCliffClassId takes nothing returns integer
        return .cliffClassId
    endmethod
	
	method setType takes integer terrainTypeId returns nothing
		set .terrainTypeId = terrainTypeId
	endmethod
    
	method setLabel takes string label returns nothing
		set .label = label
	endmethod
	
	method setAlias takes string theAlias returns TerrainType
		set .theAlias = theAlias
        return TerrainType(integer(this))
	endmethod
	
	method getTerrainTypeId takes nothing returns integer
		return .terrainTypeId
	endmethod
	
	method setTerrainTypeId takes integer terrainTypeId returns boolean
        if (not CanUseTerrain(terrainTypeId)) then
            return false
        endif 
		set .terrainTypeId = terrainTypeId
        return true
	endmethod
	
	method getKind takes nothing returns string
		return .kind
	endmethod
    
    method onDestroy takes nothing returns nothing
        set .label = null
        set .theAlias = null
        set .kind = null
        set .terrainTypeId = 0
    endmethod
    
    method displayForPlayer takes player p returns nothing
        local string order
        local string space = "   "
        local TerrainTypeSlide slide
        local TerrainTypeWalk walk
        local TerrainTypeDeath death
        local string displayCanTurn
        local string display
        if (.orderId != 0) then
            set order = " (order " + I2S(.orderId) + ")"
        else
            set order = ""
        endif
        if (.kind == "slide") then
            set slide = TerrainTypeSlide(integer(this))
            if (slide.getCanTurn()) then
                set displayCanTurn = "can turn"
            else
                set displayCanTurn = "can't turn"
            endif
            set display = COLOR_TERRAIN_SLIDE + .label + " " + .theAlias + order + " : '" + Ascii2String(.terrainTypeId) + "'" + space
            set display = display + I2S(R2I(slide.getSlideSpeed()/SLIDE_PERIOD)) + space + displayCanTurn
        else
        if (.kind == "walk") then
            set walk = TerrainTypeWalk(integer(this))
            set display = COLOR_TERRAIN_WALK + .label + " " + .theAlias + order + " : '" + Ascii2String(.terrainTypeId) + "'" + space
            set display = display + I2S(R2I(walk.getWalkSpeed()))
        else
        if (.kind == "death") then
            set death = TerrainTypeDeath(integer(this))
            set display = COLOR_TERRAIN_DEATH + .label + " " + .theAlias + order + " : '" + Ascii2String(.terrainTypeId) + "'" + space
            set display = display + R2S(death.getTimeToKill()) + space + death.getKillingEffectStr() + space + I2S(R2I(death.getToleranceDist()))
        endif
        endif
        endif
        //display cliff class
        set display = display + space + "cliff" + I2S(.cliffClassId)
        call Text_P_timed(p, TERRAIN_DATA_DISPLAY_TIME, display)
    endmethod
    
    method toString takes nothing returns string
        local TerrainTypeSlide slide
        local TerrainTypeWalk walk
        local TerrainTypeDeath death
        local string str = .label + CACHE_SEPARATEUR_PARAM + .theAlias + CACHE_SEPARATEUR_PARAM + I2S(.orderId) + CACHE_SEPARATEUR_PARAM
        set str = str + .kind + CACHE_SEPARATEUR_PARAM + Ascii2String(.terrainTypeId) + CACHE_SEPARATEUR_PARAM + I2S(.cliffClassId) + CACHE_SEPARATEUR_PARAM
        if (.kind == "slide") then
            set slide = TerrainTypeSlide(integer(this))
            set str = str + I2S(R2I(slide.getSlideSpeed() / SLIDE_PERIOD)) + CACHE_SEPARATEUR_PARAM + B2S(slide.getCanTurn())
        else
        if (.kind == "walk") then
            set walk = TerrainTypeWalk(integer(this))
            set str = str + I2S(R2I(walk.getWalkSpeed()))
        else
        if (.kind == "death") then
            set death = TerrainTypeDeath(integer(this))
            set str = str + death.getKillingEffectStr() + CACHE_SEPARATEUR_PARAM
            set str = str + R2S(death.getTimeToKill()) + CACHE_SEPARATEUR_PARAM
            set str = str + R2S(death.getToleranceDist())
        endif
        endif
        endif
        return str
    endmethod
endstruct


endlibrary