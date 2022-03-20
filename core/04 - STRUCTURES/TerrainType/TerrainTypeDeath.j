//TESH.scrollpos=0
//TESH.alwaysfold=0
library TerrainTypeDeath needs TerrainTypeDeathKillingTimers


globals
    constant real DEATH_TERRAIN_MAX_TOLERANCE = 50.
endglobals


struct TerrainTypeDeath extends TerrainType
	private string killingEffectStr
	private real timeToKill  //en secondes
	private KillingTimers killingTimers
    private real toleranceDist
	
	static method create takes string label, integer terrainTypeId, string killingEffectStr, real timeToKill, real toleranceDist returns TerrainTypeDeath
		local integer i
		local TerrainTypeDeath tt
        if (not CanUseTerrain(terrainTypeId)) then
            return 0
        endif      
        set tt = TerrainTypeDeath.allocate()
		set tt.label = label
        set tt.theAlias = null
		set tt.terrainTypeId = terrainTypeId
		set tt.killingEffectStr = killingEffectStr
		set tt.timeToKill = timeToKill
		set tt.killingTimers = KillingTimers.create()
		set tt.kind = "death"
        set tt.toleranceDist = toleranceDist
        set tt.orderId = 0
        set tt.cliffClassId = 1
		return tt
	endmethod
	
	private method onDestroy takes nothing returns nothing
		call .killingTimers.destroy()			
	endmethod
	
	method setKillingEffectStr takes string killingEffectStr returns nothing
		set .killingEffectStr = killingEffectStr
	endmethod
	
	method getKillingEffectStr takes nothing returns string
		return .killingEffectStr
	endmethod
	
	method setTimeToKill takes real newTimeToKill returns boolean
        if (newTimeToKill < 0) then
            return false
        endif
		set .timeToKill = newTimeToKill
        return true
	endmethod
    
    method getTimeToKill takes nothing returns real
        return .timeToKill
    endmethod
	
	method killEscaper takes Escaper escaper returns nothing
		call escaper.enableCheckTerrain(false)
        call escaper.enableSlide(false)
        call escaper.pause(true)
		call escaper.createTerrainKillEffect(.killingEffectStr)
		call .killingTimers.start(escaper.getId(), .timeToKill)
	endmethod
    
    method getTimer takes integer escaperId returns timer
        return .killingTimers.get(escaperId)
    endmethod	
	
    method getToleranceDist takes nothing returns real
        return .toleranceDist
    endmethod
    
    method setToleranceDist takes real toleranceDist returns boolean
        if(toleranceDist < 0 or toleranceDist > DEATH_TERRAIN_MAX_TOLERANCE)then
            return false
        endif
        set .toleranceDist = toleranceDist
        return true
    endmethod
endstruct


endlibrary