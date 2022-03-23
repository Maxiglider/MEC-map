//TESH.scrollpos=0
//TESH.alwaysfold=0
library MonsterSpawnArray needs MonsterSpawn


struct MonsterSpawnArray [5000] //50 levels * 100 monster spawns
    private MonsterSpawn array monsterSpawns[100]
	private integer lastInstance
	
	static method create takes nothing returns MonsterSpawnArray
		local MonsterSpawnArray msa = MonsterSpawnArray.allocate()
		set msa.lastInstance = -1
		return msa
	endmethod
	
	method getFirstEmpty takes nothing returns integer
		local integer i = 0
		loop
			exitwhen (i > .lastInstance or .monsterSpawns[i] == 0)
			set i = i + 1
		endloop
		return i
	endmethod	
	
    method get takes integer arrayId returns MonsterSpawn
        if (arrayId < 0 or arrayId > .lastInstance) then
            return 0
        endif
        return .monsterSpawns[arrayId]
    endmethod
    
    method getFromLabel takes string label returns MonsterSpawn
		local integer i = 0
		loop
			exitwhen (i > .lastInstance)
				if (.monsterSpawns[i].getLabel() == label) then
					return .monsterSpawns[i]
				endif
			set i = i + 1
		endloop
		return 0
	endmethod
    
    method getLastInstanceId takes nothing returns integer
        return .lastInstance
    endmethod
	
    method new takes string label, MonsterType mt, string sens, real frequence, real x1, real y1, real x2, real y2, boolean activate returns MonsterSpawn //retourne le monsterSpawn s'il a pu être créé, 0 sinon
		//local integer n = .getFirstEmpty()
        local integer n = .lastInstance + 1
		if (n >= MAX_NB_MONSTERS) then
			return 0
		endif
        if(.getFromLabel(label) != 0)then
            return 0
        endif
		//if (n > .lastInstance) then
			set .lastInstance = n
		//endif
        set .monsterSpawns[n] = MonsterSpawn.create(label, mt, sens, frequence, x1, y1, x2, y2)
        if(activate)then
            call .monsterSpawns[n].activate()
        endif
        set .monsterSpawns[n].level = udg_levels.getLevelFromMonsterSpawnArray(this)
        set .monsterSpawns[n].arrayId = n
		return .monsterSpawns[n]   
    endmethod
    
    method count takes nothing returns integer
		local integer n = 0
		local integer i = 0
		loop
			exitwhen (i > .lastInstance)
				if (.monsterSpawns[i] != 0) then
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
                if (.monsterSpawns[i] != 0) then
                    call .monsterSpawns[i].destroy()
                endif
            set i = i + 1
        endloop
        set .lastInstance = -1
    endmethod
    
    method setMonsterSpawnNull takes integer monsterSpawnArrayId returns nothing
        set .monsterSpawns[monsterSpawnArrayId] = 0
    endmethod
    
    method clearMonsterSpawn takes string label returns boolean
        local MonsterSpawn ms = .getFromLabel(label)
        if(ms != 0)then
            call ms.destroy()
            set ms = 0
            return true
        else
            return false
        endif
    endmethod
    
    public method setMonsterType takes string label, MonsterType mt returns boolean
        local MonsterSpawn ms = .getFromLabel(label)
        if(ms == 0)then
            return false
        endif
        call ms.setMonsterType(mt)
        return true
    endmethod
    
    public method setSens takes string label, string sens returns boolean
        local MonsterSpawn ms = .getFromLabel(label)
        if(ms == 0)then
            return false
        endif
        call ms.setSens(sens)
        return true
    endmethod
    
    public method setFrequence takes string label, real frequence returns boolean
        local MonsterSpawn ms = .getFromLabel(label)
        if(ms == 0)then
            return false
        endif
        call ms.setFrequence(frequence)
        return true
    endmethod
    
    public method activate takes nothing returns nothing
        local integer i = 0
        loop
            exitwhen i > .lastInstance
                if(.monsterSpawns[i] != 0)then
                    call .monsterSpawns[i].activate()
                endif
            set i = i + 1
        endloop
    endmethod
    
    public method desactivate takes nothing returns nothing
        local integer i = 0
        loop
            exitwhen i > .lastInstance
                if(.monsterSpawns[i] != 0)then
                    call .monsterSpawns[i].desactivate()
                endif
            set i = i + 1
        endloop
    endmethod
    
    method displayForPlayer takes player p returns nothing
        local integer nbMs = 0
        local integer i = 0
        loop
            exitwhen (i > .lastInstance)
                if(.monsterSpawns[i] != 0)then
                    call .monsterSpawns[i].displayForPlayer(p)
                    set nbMs = nbMs + 1
                endif
            set i = i + 1
        endloop
        if (nbMs == 0) then
            call Text_erP(p, "no monster spawn for this level")
        endif
    endmethod
    
    method changeLabel takes string oldLabel, string newLabel returns boolean
        if(.getFromLabel(oldLabel) == 0 or .getFromLabel(newLabel) != 0)then
            return false
        endif
        call .getFromLabel(oldLabel).setLabel(newLabel)
        return true
    endmethod
endstruct


endlibrary
