//TESH.scrollpos=98
//TESH.alwaysfold=0
library TerrainTypeArray needs TerrainTypeWalk, TerrainTypeDeath, TerrainTypeSlide, CommandsFunctions


struct TerrainTypeArray
    private TerrainTypeWalk array ttWalk [177] //le nombre de terrains du jeu est de 177
    private TerrainTypeDeath array ttDeath [177]
    private TerrainTypeSlide array ttSlide [177]
    integer numberOfWalk
    integer numberOfDeath
    integer numberOfSlide
    string mainTileset
    
    static method create takes nothing returns TerrainTypeArray
        local TerrainTypeArray tta = TerrainTypeArray.allocate()
        set tta.numberOfWalk = 0
        set tta.numberOfDeath = 0
        set tta.numberOfSlide = 0
        set tta.mainTileset = "auto"
        return tta
    endmethod    
    
    method get takes string label returns TerrainType
		local integer i = 0
		loop
			exitwhen (i >= .numberOfWalk)
				if (.ttWalk[i].label == label or .ttWalk[i].theAlias == label) then
					return .ttWalk[i]
				endif
			set i = i + 1
		endloop
		set i = 0
		loop
			exitwhen (i >= .numberOfDeath)
				if (.ttDeath[i].label == label or .ttDeath[i].theAlias == label) then
					return .ttDeath[i]
				endif
			set i = i + 1
		endloop
		set i = 0
		loop
			exitwhen (i >= .numberOfSlide)
				if (.ttSlide[i].label == label or .ttSlide[i].theAlias == label) then
					return .ttSlide[i]
				endif
			set i = i + 1
		endloop
		return 0
	endmethod
	
	method getTerrainType takes real x, real y returns TerrainType
		local integer terrainTypeId = GetTerrainType(x, y)
		local integer i = 0
		loop
			exitwhen (i >= .numberOfWalk)
				if (.ttWalk[i].getTerrainTypeId() == terrainTypeId) then
					return .ttWalk[i]
				endif
			set i = i + 1
		endloop
		set i = 0
		loop
			exitwhen (i >= .numberOfDeath)
				if (.ttDeath[i].getTerrainTypeId() == terrainTypeId) then
					return .ttDeath[i]
				endif
			set i = i + 1
		endloop
		set i = 0
		loop
			exitwhen (i >= .numberOfSlide)
				if (.ttSlide[i].getTerrainTypeId() == terrainTypeId) then
					return .ttSlide[i]
				endif
			set i = i + 1
		endloop
		return 0
	endmethod
    
    method isTerrainTypeIdAlreadyUsed takes integer terrainTypeId returns boolean
        local integer i = 0
        loop
            exitwhen (i >= .numberOfWalk)
                if (terrainTypeId == .ttWalk[i].getTerrainTypeId()) then
                    return true
                endif
            set i = i + 1
        endloop
        set i = 0
        loop
            exitwhen (i >= .numberOfDeath)
                if (terrainTypeId == .ttDeath[i].getTerrainTypeId()) then
                    return true
                endif
            set i = i + 1
        endloop
        set i = 0
        loop
            exitwhen (i >= .numberOfSlide)
                if (terrainTypeId == .ttSlide[i].getTerrainTypeId()) then
                    return true
                endif
            set i = i + 1
        endloop
        return false
    endmethod
	
	method isLabelAlreadyUsed takes string label returns boolean
		return (.get(label) != 0)
	endmethod
    
    method newWalk takes string label, integer terrainTypeId, real walkspeed returns TerrainTypeWalk
        local integer n = .numberOfWalk
        if (.count() >= 16 or .isLabelAlreadyUsed(label) or .isTerrainTypeIdAlreadyUsed(terrainTypeId) or terrainTypeId == 0) then
            return 0
        endif
        set .ttWalk[n] = TerrainTypeWalk.create(label, terrainTypeId, walkspeed)
        if (.ttWalk[n] != 0) then
            set .numberOfWalk = .numberOfWalk + 1
        endif
        return .ttWalk[n]
    endmethod
    
    method newDeath takes string label, integer terrainTypeId, string killingEffectStr, real timeToKill, real toleranceDist returns TerrainTypeDeath
        local integer n = .numberOfDeath
        if (.count() >= 16 or .isLabelAlreadyUsed(label) or .isTerrainTypeIdAlreadyUsed(terrainTypeId) or terrainTypeId == 0) then
            return 0
        endif
        set .ttDeath[n] = TerrainTypeDeath.create(label, terrainTypeId, killingEffectStr, timeToKill, toleranceDist)
        if (.ttDeath[n] != 0) then
            set .numberOfDeath = .numberOfDeath + 1
        endif
        return .ttDeath[n]
    endmethod
    
    method newSlide takes string label, integer terrainTypeId, real slideSpeed, boolean canTurn returns TerrainTypeSlide
        local integer n = .numberOfSlide
        if (.count() >= 16 or .isLabelAlreadyUsed(label) or .isTerrainTypeIdAlreadyUsed(terrainTypeId) or terrainTypeId == 0) then
            return 0
        endif
        set .ttSlide[n] = TerrainTypeSlide.create(label, terrainTypeId, slideSpeed, canTurn)
        if (.ttSlide[n] != 0) then
            set .numberOfSlide = .numberOfSlide + 1
        endif
        return .ttSlide[n]
    endmethod
    
    method remove takes string label returns boolean
        local integer position
        local integer i
        local TerrainType tt = .get(label)
        if (tt == 0) then
            return false
        endif
        if (tt.kind == "walk") then
            set i = 0
            loop
                exitwhen (.ttWalk[i].label == label or .ttWalk[i].theAlias == label or i >= .numberOfWalk)
                set i = i + 1
            endloop
            if (i < .numberOfWalk) then
                set position = i
                set i = i + 1
                loop
                    exitwhen (i >= .numberOfWalk)
                        set .ttWalk[i-1] = .ttWalk[i]
                    set i = i + 1
                endloop
                set .numberOfWalk = .numberOfWalk - 1
            endif
        endif
        if (tt.kind == "death") then
            set i = 0
            loop
                exitwhen (.ttDeath[i].label == label or .ttDeath[i].theAlias == label or i >= .numberOfDeath)
                set i = i + 1
            endloop
            if (i < .numberOfDeath) then
                set position = i
                set i = i + 1
                loop
                    exitwhen (i >= .numberOfDeath)
                        set .ttDeath[i-1] = .ttDeath[i]
                    set i = i + 1
                endloop
                set .numberOfDeath = .numberOfDeath - 1
            endif
        endif
        if (tt.kind == "slide") then
            set i = 0
            loop
                exitwhen (.ttSlide[i].label == label or .ttSlide[i].theAlias == label or i >= .numberOfSlide)
                set i = i + 1
            endloop
            if (i < .numberOfSlide) then
                set position = i
                set i = i + 1
                loop
                    exitwhen (i >= .numberOfSlide)
                        set .ttSlide[i-1] = .ttSlide[i]
                    set i = i + 1
                endloop
                set .numberOfSlide = .numberOfSlide - 1
            endif
        endif
        call tt.destroy()
        return true
    endmethod
    
    method getWalk takes integer id returns TerrainTypeWalk
        return .ttWalk[id]
    endmethod
    
    method getDeath takes integer id returns TerrainTypeDeath
        return .ttDeath[id]
    endmethod
    
    method getSlide takes integer id returns TerrainTypeSlide
        return .ttSlide[id]
    endmethod
    
    method displayForPlayer takes player p returns nothing
        local integer i = 0
        loop
            exitwhen (i >= .numberOfSlide)
                call .ttSlide[i].displayForPlayer(p)
            set i = i + 1
        endloop
        set i = 0
        loop
            exitwhen (i >= .numberOfWalk)
                call .ttWalk[i].displayForPlayer(p)
            set i = i + 1
        endloop
        set i = 0
        loop
            exitwhen (i >= .numberOfDeath)
                call .ttDeath[i].displayForPlayer(p)
            set i = i + 1
        endloop
        if (.numberOfSlide + .numberOfWalk + .numberOfDeath == 0) then
            call Text_erP(p, "no terrain saved")
        endif
    endmethod
    
    method saveInCache takes nothing returns nothing
        local integer i

        //main tileset
        set stringArrayForCache = StringArrayForCache.create("terrain", "mainTileset", false)
        call stringArrayForCache.push(.mainTileset)
        call stringArrayForCache.writeInCache()

        //terrainConfig
        set stringArrayForCache = StringArrayForCache.create("terrain", "terrainConfig", true)
        set i = 0
        loop
            exitwhen (i >= .numberOfSlide)
                call stringArrayForCache.push(.ttSlide[i].toString())
            set i = i + 1
        endloop
        set i = 0
        loop
            exitwhen (i >= .numberOfWalk)
                call stringArrayForCache.push(.ttWalk[i].toString())
            set i = i + 1
        endloop
        set i = 0
        loop
            exitwhen (i >= .numberOfDeath)
                call stringArrayForCache.push(.ttDeath[i].toString())
            set i = i + 1
        endloop
        call stringArrayForCache.writeInCache()
    endmethod
    
    method count takes nothing returns integer
        return .numberOfWalk + .numberOfSlide + .numberOfDeath
    endmethod
    
    //mettre en place l'ordre des terrains au niveau des tilesets
    method setOrder takes string cmd returns boolean
        local TerrainType terrainType
        local TerrainType array terrainTypesOrdered
        local integer nbTerrainsDone
        local integer i
        if (.count() != NbParam(cmd)) then
            return false
        endif
        set nbTerrainsDone = 0
        loop
            exitwhen (nbTerrainsDone == .count())
                set terrainType = .get(CmdParam(cmd, nbTerrainsDone + 1))
                //vérification que le terrain existe
                if (terrainType == 0) then
                    return false
                endif
                //vérification que le terrain n'a pas déjà été cité
                set i = 0
                loop
                    exitwhen (i == nbTerrainsDone)
                        if (terrainTypesOrdered[i] == terrainType) then
                            return false
                        endif
                    set i = i + 1
                endloop
                //mémorisation du terrain
                set terrainTypesOrdered[nbTerrainsDone] = terrainType
            set nbTerrainsDone = nbTerrainsDone + 1
        endloop
        //mémorisation du numéro d'ordre de chaque terrain
        set i = 0
        loop
            exitwhen (i == nbTerrainsDone)
                call terrainTypesOrdered[i].setOrderId(i + 1)
            set i = i + 1
        endloop
        return true
    endmethod

    method setMainTileset takes string tileset returns boolean
        local string tilesetChar = tileset2tilesetChar(tileset)
        if (tilesetChar != "") then
            set .mainTileset = tilesetChar
            return true
        endif
        return false
    endmethod

    method getMainTileset takes nothing returns string
        return .mainTileset
    endmethod
endstruct
    
    


endlibrary