//TESH.scrollpos=35
//TESH.alwaysfold=0
library EscaperEffectArray needs EscaperEffect


struct EscaperEffectArray [240]
	private EscaperEffect array efs [20]
	private integer lastInstance
	
	
	static method create takes nothing returns EscaperEffectArray
		local EscaperEffectArray e = EscaperEffectArray.allocate()
		set e.lastInstance = -1
		return e
	endmethod
	
	method new takes string efStr, unit u, string bodyPart returns nothing
		local integer i
		if (.lastInstance >= 19) then
			call .efs[0].destroy()
			set i = 0
			loop
				exitwhen (i >= 19)
					set .efs[i] = .efs[i+1]
				set i = i + 1
			endloop
		else
			set .lastInstance = .lastInstance + 1
		endif
		set .efs[.lastInstance] = EscaperEffect.create(efStr, u, bodyPart)
	endmethod
	
	method count takes nothing returns integer
		local integer n = 0
		local integer i = 0
		loop
			exitwhen (i > .lastInstance)
				if .efs[i] != 0 then
					set n = n + 1
				endif
			set i = i + 1
		endloop
		return n
	endmethod
	
	private method onDestroy takes nothing returns nothing
		loop
			exitwhen (.lastInstance < 0)
				call .efs[.lastInstance].destroy()
			set .lastInstance = .lastInstance - 1
		endloop
	endmethod
	
	method destroyLastEffects takes integer numEfToDestroy returns nothing
		local integer i = numEfToDestroy
		loop
			exitwhen (i <= 0 or .lastInstance < 0)
				call .efs[.lastInstance].destroy()
				set .lastInstance = .lastInstance - 1
			set i = i - 1
		endloop
	endmethod
	
	method hideEffects takes nothing returns nothing
		local integer i = 0
		loop
			exitwhen i > .lastInstance
				call .efs[i].remove()
			set i = i + 1
		endloop	
	endmethod
	
	method showEffects takes unit u returns nothing
		local integer i = 0
		loop
			exitwhen (i > .lastInstance)
				call .efs[i].recreate(u)
			set i = i + 1
		endloop	
	endmethod
endstruct
	

endlibrary