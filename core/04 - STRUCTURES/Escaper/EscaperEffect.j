//TESH.scrollpos=0
//TESH.alwaysfold=0
library EscaperEffect needs EscaperEffectFunctions


struct EscaperEffect
	private effect ef
	private string efStr
	private string bodyPart
	

	static method create takes string efStr, unit u, string bodyPart returns EscaperEffect
		local EscaperEffect e = EscaperEffect.allocate()
		set e.efStr = efStr
		set e.bodyPart = bodyPart
		set e.ef = AddSpecialEffectTarget(efStr, u, bodyPart)
		return e
	endmethod
	
	private method onDestroy takes nothing returns nothing
        if(.ef != null)then
            call DestroyEffect(.ef)
            set .ef = null
        endif
	endmethod
	
	method recreate takes unit u returns nothing
		call .onDestroy()
		set .ef = AddSpecialEffectTarget(.efStr, u, .bodyPart)
	endmethod	

	method remove takes nothing returns nothing
		call DestroyEffect(.ef)
		set .ef = null
	endmethod
endstruct





endlibrary



