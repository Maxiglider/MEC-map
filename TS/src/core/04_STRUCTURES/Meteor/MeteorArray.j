//TESH.scrollpos=94
//TESH.alwaysfold=0
library MeteorArray needs Meteor

globals
    private constant integer MAX_NB_METEORS = 100 //par niveau
endglobals



struct MeteorArray [5000] //50 niveaux * 100 météores
    private Meteor array meteors [MAX_NB_METEORS]
    private integer lastInstance
    
	static method create takes nothing returns MeteorArray
		local MeteorArray ma = MeteorArray.allocate()
		set ma.lastInstance = -1
		return ma
	endmethod
	
	method getFirstEmpty takes nothing returns integer
		local integer i = 0
		loop
			exitwhen (i > .lastInstance or .meteors[i] == 0)
			set i = i + 1
		endloop
		return i
	endmethod	
	
    method get takes integer arrayId returns Meteor
        if (arrayId < 0 or arrayId > .lastInstance) then
            return 0
        endif
        return .meteors[arrayId]
    endmethod
	
    method new takes real x, real y, boolean createMeteor returns Meteor //retourne la météore si elle a pu être créée, 0 sinon
		//local integer n = .getFirstEmpty()
        local integer n = .lastInstance + 1
		if (n >= MAX_NB_METEORS) then
			return 0
		endif
		//if (n > .lastInstance) then
			set .lastInstance = n
		//endif
		set .meteors[n] = Meteor.create(x, y)
		if (createMeteor) then
			call .meteors[n].createMeteor()
		endif
        set .meteors[n].level = udg_levels.getLevelFromMeteorArray(this)
        set .meteors[n].arrayId = n
		return .meteors[n]   
    endmethod
    
    method setMeteorNull takes integer arrayId returns nothing
        set .meteors[arrayId] = 0
    endmethod
	
	method count takes nothing returns integer
		local integer n = 0
		local integer i = 0
		loop
			exitwhen (i > .lastInstance)
				if (.meteors[i] != 0) then
					set n = n + 1
				endif
			set i = i + 1
		endloop
		return n
	endmethod
    
    method onDestroy takes nothing returns nothing
        local integer i = 0
        loop
            exitwhen (i > .lastInstance)
                if (.meteors[i] != 0) then
                    call .meteors[i].destroy()
                endif
            set i = i + 1
        endloop
        set .lastInstance = -1
    endmethod
    
    method clearMeteor takes integer meteorId returns boolean
        local integer i = 0
        loop
            exitwhen (.meteors[i] == Meteor(meteorId) or i > .lastInstance)
            set i = i + 1
        endloop
        if (i > .lastInstance) then
            return false
        endif
        call .meteors[i].destroy()
        set .meteors[i] = 0
        return true
    endmethod
    
    method createMeteors takes nothing returns nothing
        local integer i = 0
        loop
            exitwhen (i > .lastInstance)
                if (.meteors[i] != 0) then
                    call .meteors[i].createMeteor()
                endif
            set i = i + 1
        endloop
    endmethod
    
    method removeMeteors takes nothing returns nothing
        local integer i = 0
        loop
            exitwhen (i > .lastInstance)
                if (.meteors[i] != 0) then
                    call .meteors[i].removeMeteor()
                endif
            set i = i + 1
        endloop
    endmethod
    
    method getMeteorNear takes real x, real y returns Meteor
        local real xMeteor
        local real yMeteor
        local integer i = 0
        loop
            exitwhen (i > .lastInstance)
                if (.meteors[i] != 0 and .meteors[i].getItem() != null) then
                    set xMeteor = GetItemX(.meteors[i].getItem())
                    set yMeteor = GetItemY(.meteors[i].getItem())
                    if (RAbsBJ(x - xMeteor) < MONSTER_NEAR_DIFF_MAX and RAbsBJ(y - yMeteor) < MONSTER_NEAR_DIFF_MAX) then
                        return .meteors[i]
                    endif
                endif
            set i = i + 1
        endloop
        return 0    
    endmethod
    
    method getLastInstanceId takes nothing returns integer
        return .lastInstance
    endmethod
endstruct




endlibrary

