//TESH.scrollpos=0
//TESH.alwaysfold=0
library EscaperArray needs Escaper


struct EscaperArray
	private Escaper array escapers [NB_ESCAPERS]
	
	static method create takes nothing returns EscaperArray
		local EscaperArray e = EscaperArray.allocate()
		local integer escaperId = 0
		loop
			exitwhen (escaperId >= NB_ESCAPERS)
				if (IsEscaperInGame(Player(escaperId))) then
					set e.escapers[escaperId] = Escaper.create(escaperId)
				else
                    set e.escapers[escaperId] = 0
                endif
			set escaperId = escaperId + 1
		endloop
		return e
	endmethod
    
    method newAt takes integer id returns nothing
        if (id < 0 or id >= NB_ESCAPERS) then
            return
        endif
        if (.escapers[id] != 0) then
            return
        endif
        set .escapers[id] = Escaper.create(id)
    endmethod
	
	method count takes nothing returns integer
		local integer n = 0
		local integer i = 0
		loop
			exitwhen (i >= NB_ESCAPERS)
				if (.escapers[i] != 0) then
					set n = n + 1
				endif
			set i = i + 1
		endloop
		return n
	endmethod
    
    method get takes integer id returns Escaper
        return .escapers[id]
    endmethod
    
    method nullify takes integer id returns nothing
        set .escapers[id] = 0
    endmethod
    
    method remove takes integer id returns nothing
        call .escapers[id].destroy()
        set .escapers[id] = 0
    endmethod
    
    method deleteSpecificActionsForLevel takes Level level returns nothing
        local integer i = 0
        loop
            exitwhen (i >= NB_ESCAPERS)
                if (.escapers[i] != 0) then
                    call .escapers[i].deleteSpecificActionsForLevel(level)
                endif
            set i = i + 1
        endloop
    endmethod
    
    method destroyMakesIfForSpecificLevel_currentLevel takes nothing returns nothing
        //destroy le make des escapers si c'est un make pour spécifique level et que l'escaper make pour le "current_level"
        local boolean doDestroy
        local integer i = 0
        loop
            exitwhen (i >= NB_ESCAPERS)
                if (.escapers[i] != 0 and .escapers[i].isMakingCurrentLevel()) then
                    call .escapers[i].destroyMakeIfForSpecificLevel()
                endif
            set i = i + 1
        endloop
    endmethod
endstruct



endlibrary