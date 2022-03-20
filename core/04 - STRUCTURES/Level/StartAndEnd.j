//TESH.scrollpos=0
//TESH.alwaysfold=0
library StartAndEnd initializer Init_StartAndEnd needs BasicFunctions, Escaper


interface RectInterface
    real minX
    real minY
    real maxX
    real maxY
    rect r
    method toString takes nothing returns string
endinterface


globals
    Start DEPART_PAR_DEFAUT
endglobals


struct Start extends RectInterface
    static method create takes real x1, real y1, real x2, real y2 returns Start
        local Start s = Start.allocate()
        set s.minX = RMinBJ(x1, x2)
        set s.minY = RMinBJ(y1, y2)
        set s.maxX = RMaxBJ(x1, x2)
        set s.maxY = RMaxBJ(y1, y2)
        set s.r  = Rect(s.minX, s.minY, s.maxX, s.maxY)
        return s
    endmethod
	
	private method onDestroy takes nothing returns nothing
		call RemoveRect(.r)
		set .r = null
	endmethod
	
	method getRandomX takes nothing returns real
		return GetRandomReal(.minX, .maxX)
    endmethod
    
	method getRandomY takes nothing returns real
		return GetRandomReal(.minY, .maxY )
    endmethod
	
	method getCenterX takes nothing returns real
		return GetRectCenterX(.r)
    endmethod
    
	method getCenterY takes nothing returns real
		return GetRectCenterY(.r)
    endmethod
    
    method toString takes nothing returns string
        local string minX = I2S(R2I(.minX))
        local string minY = I2S(R2I(.minY))
        local string maxX = I2S(R2I(.maxX))
        local string maxY = I2S(R2I(.maxY))
        return (minX + CACHE_SEPARATEUR_PARAM + minY + CACHE_SEPARATEUR_PARAM + maxX + CACHE_SEPARATEUR_PARAM + maxY)
    endmethod
endstruct





function EndReaching_Actions takes nothing returns nothing
    local Escaper finisher = Hero2Escaper(GetTriggerUnit())
    if (finisher == 0) then
        return
    endif
    if (not udg_levels.goToNextLevel(finisher)) then
        call Text_A("Good job ! You have finished the game.")
        call TriggerSleepAction(2)
        call Text_A("restart in 10 seconds")
        call TriggerSleepAction(10)
        call udg_levels.restartTheGame()
    endif
endfunction


struct End extends RectInterface
    private trigger endReaching

    static method create takes real x1, real y1, real x2, real y2 returns End
        local End e = End.allocate()
        set e.minX = RMinBJ(x1, x2)
        set e.minY = RMinBJ(y1, y2)
        set e.maxX = RMaxBJ(x1, x2)
        set e.maxY = RMaxBJ(y1, y2)
        set e.r  = Rect(e.minX, e.minY, e.maxX, e.maxY)
        set e.endReaching = CreateTrigger()
        call TriggerAddAction(e.endReaching, function EndReaching_Actions)
        call TriggerRegisterEnterRectSimple(e.endReaching, e.r)
        call DisableTrigger(e.endReaching)
        return e
    endmethod
    
    method activate takes boolean activ returns nothing
        if activ then
            call EnableTrigger(.endReaching)
        else
            call DisableTrigger(.endReaching)
        endif
    endmethod
    
    private method onDestroy takes nothing returns nothing
		call RemoveRect(.r)
		set .r = null
        call DestroyTrigger(.endReaching)
        set .endReaching = null
    endmethod   
    
    method toString takes nothing returns string
        local string minX = I2S(R2I(.minX))
        local string minY = I2S(R2I(.minY))
        local string maxX = I2S(R2I(.maxX))
        local string maxY = I2S(R2I(.maxY))
        return (minX + CACHE_SEPARATEUR_PARAM + minY + CACHE_SEPARATEUR_PARAM + maxX + CACHE_SEPARATEUR_PARAM + maxY)
    endmethod     
endstruct





//===========================================================================
function Init_StartAndEnd takes nothing returns nothing
    set DEPART_PAR_DEFAUT = Start.create(-500, -500, 500, 500)
endfunction



endlibrary
