//TESH.scrollpos=0
//TESH.alwaysfold=0
library MonsterSimplePatrolArray needs MonsterSimplePatrol



struct MonsterSimplePatrolArray [25000] //50 niveaux * 500 monstres
    private MonsterSimplePatrol array monsters [MAX_NB_MONSTERS]
	private integer lastInstance
    	
	static method create takes nothing returns MonsterSimplePatrolArray
		local MonsterSimplePatrolArray ma = MonsterSimplePatrolArray.allocate()
		set ma.lastInstance = -1
		return ma
	endmethod
	
	method getFirstEmpty takes nothing returns integer
		local integer i = 0
		loop
			exitwhen (i > .lastInstance or .monsters[i] == 0)
			set i = i + 1
		endloop
		return i
	endmethod	
	
    method get takes integer arrayId returns MonsterSimplePatrol
        if (arrayId < 0 or arrayId > .lastInstance) then
            return 0
        endif
        return .monsters[arrayId]
    endmethod	
    
    method getLastInstanceId takes nothing returns integer
        return .lastInstance
    endmethod
	
    method new takes MonsterType mt, real x1, real y1, real x2, real y2, boolean createUnit returns MonsterSimplePatrol
		//local integer n = .getFirstEmpty()
        local integer n = .lastInstance + 1
		if (n >= MAX_NB_MONSTERS) then
			return 0
		endif
		//if (n > .lastInstance) then
			set .lastInstance = n
		//endif
		set .monsters[n] = MonsterSimplePatrol.create(mt, x1, y1, x2, y2)
		if (createUnit) then
			call .monsters[n].createUnit()
		endif
        set .monsters[n].level = udg_levels.getLevelFromMonsterSimplePatrolArray(this)
        set .monsters[n].arrayId = n
		return .monsters[n]  
    endmethod
	
	method count takes nothing returns integer
		local integer nb = 0
		local integer i = 0
		loop
			exitwhen (i > .lastInstance)
				if (.monsters[i] != 0) then
					set nb = nb + 1
				endif
			set i = i + 1
		endloop
		return nb
	endmethod
    
    method onDestroy takes nothing returns nothing
        local integer i = 0
        loop
            exitwhen (i > .lastInstance)
                if (.monsters[i] != 0) then
                    call .monsters[i].destroy()
                endif
            set i = i + 1
        endloop
        set .lastInstance = -1
    endmethod
    
    method setMonsterNull takes integer monsterArrayId returns nothing
        set .monsters[monsterArrayId] = 0
    endmethod
    
    method clearMonster takes integer monsterId returns boolean
        local integer i = 0
        loop
            exitwhen (.monsters[i] == MonsterSimplePatrol(monsterId) or i > .lastInstance)
            set i = i + 1
        endloop
        if (i > .lastInstance) then
            return false
        endif
        call .monsters[i].destroy()
        return true
    endmethod
    
    method getMonsterNear takes real x, real y returns MonsterSimplePatrol
        local real xMob
        local real yMob
        local integer i = 0
        loop
            exitwhen (i > .lastInstance)
                if (.monsters[i] != 0 and .monsters[i].u != null) then
                    set xMob = GetUnitX(.monsters[i].u)
                    set yMob = GetUnitY(.monsters[i].u)
                    if (RAbsBJ(x - xMob) < MONSTER_NEAR_DIFF_MAX and RAbsBJ(y - yMob) < MONSTER_NEAR_DIFF_MAX) then
                        return .monsters[i]
                    endif
                endif
            set i = i + 1
        endloop
        return 0    
    endmethod
    
    method createMonsters takes nothing returns nothing
        local integer i = 0
        loop
            exitwhen (i > .lastInstance)
                if (.monsters[i] != 0) then
                    call .monsters[i].createUnit()
                endif
            set i = i + 1
        endloop
    endmethod
    
    method removeMonsters takes nothing returns nothing
        local integer i = 0
        loop
            exitwhen (i > .lastInstance)
                if (.monsters[i] != 0) then
                    call .monsters[i].removeUnit()
                endif
            set i = i + 1
        endloop
    endmethod
    
    method recreateMonstersOfType takes MonsterType mt returns nothing
        local integer i = 0
        loop
            exitwhen (i > .lastInstance)
                if (.monsters[i] != 0 and .monsters[i].getMonsterType() == mt and .monsters[i].u != null) then
                    call .monsters[i].createUnit()
                endif
            set i = i + 1
        endloop
    endmethod
    
    method removeMonstersOfType takes MonsterType mt returns nothing
        local integer i = 0
        loop
            exitwhen (i > .lastInstance)
                if (.monsters[i] != 0 and .monsters[i].getMonsterType() == mt) then
                    call .monsters[i].destroy()
                endif
            set i = i + 1
        endloop
    endmethod
endstruct


endlibrary