//TESH.scrollpos=72
//TESH.alwaysfold=0
library LevelArray needs Level


globals
    constant integer NB_MAX_LEVELS = 50
endglobals


struct LevelArray
	private Level array levels [NB_MAX_LEVELS]
	private integer currentLevel
	private integer lastInstance
	
	
	static method create takes nothing returns LevelArray
		local real x1 = GetRectMinX(gg_rct_departLvl_0)
		local real y1 = GetRectMinY(gg_rct_departLvl_0)
		local real x2 = GetRectMaxX(gg_rct_departLvl_0)
		local real y2 = GetRectMaxY(gg_rct_departLvl_0)
		local LevelArray la = LevelArray.allocate()
        set la.levels[0] = Level.create()
		call la.levels[0].newStart(x1, y1, x2, y2)
        call la.levels[0].setNbLivesEarned(NB_LIVES_AT_BEGINNING)
        call la.levels[0].activate(true)
        set la.currentLevel = 0
        set la.lastInstance = 0
		return la
	endmethod	
	
	method goToLevel takes Escaper finisher, integer levelId returns boolean
        local real xCam
        local real yCam
        local integer i
        local integer previousLevelId = .currentLevel
		if (levelId < 0 or levelId > .lastInstance or levelId == .currentLevel) then
			return false
		endif
		set .currentLevel = levelId
        if (previousLevelId != NB_MAX_LEVELS) then //cas spécial restart de la game
            if (not IsLevelBeingMade(.levels[previousLevelId])) then
                call udg_escapers.destroyMakesIfForSpecificLevel_currentLevel()
                call .levels[previousLevelId].activate(false)
            endif
        endif
		call .levels[.currentLevel].activate(true)
        call .levels[.currentLevel].checkpointReviveHeroes(finisher)
        if (previousLevelId != NB_MAX_LEVELS) then
            if (levelId > previousLevelId + 1) then
                set i = previousLevelId + 1
                loop
                    exitwhen (i >= levelId)
                        call .levels[i].activateVisibilities(true)
                    set i = i + 1
                endloop
            else
                if (levelId < previousLevelId) then
                    set i = levelId + 1
                    loop
                        exitwhen (i > previousLevelId)
                            call .levels[i].activateVisibilities(false)
                        set i = i + 1
                    endloop
                endif
            endif
        endif
        set xCam = .levels[levelId].getStart().getCenterX()
        set yCam = .levels[levelId].getStart().getCenterY()
        if (finisher != 0) then
            call MoveCamExceptForPlayer(finisher.getPlayer(), xCam, yCam)
        else
            call SetCameraPosition(xCam, yCam)
        endif
		return true
	endmethod
	
	method goToNextLevel takes Escaper finisher returns boolean //retourne false s'il n'y a pas de niveau suivant
        local real xCam
        local real yCam
        if (.currentLevel >= .lastInstance) then
			return false
		endif
		set .currentLevel = .currentLevel + 1
        if (not IsLevelBeingMade(.levels[.currentLevel - 1])) then
            call udg_escapers.destroyMakesIfForSpecificLevel_currentLevel()
            call .levels[.currentLevel - 1].activate(false)
        endif
		call .levels[.currentLevel].activate(true)
        call .levels[.currentLevel].checkpointReviveHeroes(finisher)
        set xCam = .levels[.currentLevel].getStart().getCenterX()
        set yCam = .levels[.currentLevel].getStart().getCenterY()
        if (finisher != 0) then
            call MoveCamExceptForPlayer(finisher.getPlayer(), xCam, yCam)
            call Text_A(udg_colorCode[GetPlayerId(finisher.getPlayer())] + "Good job " + GetPlayerName(finisher.getPlayer()) + " !")
        else
            call SetCameraPosition(xCam, yCam)
        endif
        return true
	endmethod
    
    method restartTheGame takes nothing returns nothing
        if (.currentLevel == 0) then
            set .currentLevel = NB_MAX_LEVELS //pour assurer le changement de niveau
            call .levels[0].activate(false)
        endif
        call .goToLevel(0, 0)
        call udg_lives.setNb(.levels[0].getNbLives())
        call SetCameraPosition(.levels[0].getStart().getCenterX(), .levels[0].getStart().getCenterY())
        //coop
		call TriggerExecute(gg_trg_apparition_dialogue_et_fermeture_automatique)
    endmethod
	
	method new takes nothing returns boolean //retourne false si le nombre maximum de niveaux est déja atteint
		if (.lastInstance >= NB_MAX_LEVELS - 1) then
			return false
		endif
		set .lastInstance = .lastInstance + 1
		set .levels[.lastInstance] = Level.create()
        return true
	endmethod
    
    method destroyLastLevel takes nothing returns boolean
        if (.lastInstance <= 0) then
            return false
        endif
        call .levels[.lastInstance].destroy()
        set .lastInstance = .lastInstance - 1
        return true
    endmethod
	
	method count takes nothing returns integer
		return .lastInstance + 1
	endmethod
	
	method getCurrentLevel takes nothing returns Level
		return .levels[.currentLevel]
	endmethod
    
    method get takes integer levelId returns Level
        if (levelId > .lastInstance or levelId < 0) then
            return 0
        endif
        return .levels[levelId]
    endmethod
    
    method getLevelFromMonsterNoMoveArray takes MonsterNoMoveArray ma returns Level
        local integer i = 0
        loop
            exitwhen (i > .lastInstance or .levels[i].monstersNoMove == ma)
            set i = i + 1
        endloop
        if (i > .lastInstance) then
            return 0
        endif
        return .levels[i]
    endmethod
    method getLevelFromMonsterSimplePatrolArray takes MonsterSimplePatrolArray ma returns Level
        local integer i = 0
        loop
            exitwhen (i > .lastInstance or .levels[i].monstersSimplePatrol == ma)
            set i = i + 1
        endloop
        if (i > .lastInstance) then
            return 0
        endif
        return .levels[i]
    endmethod
    method getLevelFromMonsterMultiplePatrolsArray takes MonsterMultiplePatrolsArray ma returns Level
        local integer i = 0
        loop
            exitwhen (i > .lastInstance or .levels[i].monstersMultiplePatrols == ma)
            set i = i + 1
        endloop
        if (i > .lastInstance) then
            return 0
        endif
        return .levels[i]
    endmethod
    method getLevelFromMonsterTeleportArray takes MonsterTeleportArray ma returns Level
        local integer i = 0
        loop
            exitwhen (i > .lastInstance or .levels[i].monstersTeleport == ma)
            set i = i + 1
        endloop
        if (i > .lastInstance) then
            return 0
        endif
        return .levels[i]
    endmethod
    method getLevelFromMonsterSpawnArray takes MonsterSpawnArray msa returns Level
        local integer i = 0
        loop
            exitwhen (i > .lastInstance or .levels[i].monsterSpawns == msa)
            set i = i + 1
        endloop
        if (i > .lastInstance) then
            return 0
        endif
        return .levels[i]
    endmethod
    method getLevelFromMeteorArray takes MeteorArray ma returns Level
        local integer i = 0
        loop
            exitwhen (i > .lastInstance or .levels[i].meteors == ma)
            set i = i + 1
        endloop
        if (i > .lastInstance) then
            return 0
        endif
        return .levels[i]
    endmethod
    method getLevelFromVisibilityModifierArray takes VisibilityModifierArray vma returns Level
        local integer i = 0
        loop
            exitwhen (i > .lastInstance or .levels[i].visibilities == vma)
            set i = i + 1
        endloop
        if (i > .lastInstance) then
            return 0
        endif
        return .levels[i]
    endmethod
    method getLevelFromCasterArray takes CasterArray casterArray returns Level
        local integer i = 0
        loop
            exitwhen (i > .lastInstance or .levels[i].casters == casterArray)
            set i = i + 1
        endloop
        if (i > .lastInstance) then
            return 0
        endif
        return .levels[i]
    endmethod  
    method getLevelFromClearMobArray takes ClearMobArray clearMobArray returns Level
        local integer i = 0
        loop
            exitwhen (i > .lastInstance or .levels[i].clearMobs == clearMobArray)
            set i = i + 1
        endloop
        if (i > .lastInstance) then
            return 0
        endif
        return .levels[i]
    endmethod
    
    method removeMonstersOfType takes MonsterType mt returns nothing
        local integer i = 0
        loop
            exitwhen (i > .lastInstance)
                call .levels[i].removeMonstersOfType(mt)
            set i = i + 1
        endloop
    endmethod
    
    method removeCastersOfType takes CasterType ct returns nothing
        local integer i = 0
        loop
            exitwhen (i > .lastInstance)
                call .levels[i].removeCastersOfType(ct)
            set i = i + 1
        endloop
    endmethod
    
    method getLastLevelId takes nothing returns integer
        return .lastInstance
    endmethod
    
    method getNbMonsters takes string mode returns integer
        //modes : all, moving, not moving
        local integer nb = 0
        local integer i = 0
        loop
            exitwhen (i > .lastInstance)
                set nb = nb + .levels[i].getNbMonsters(mode)
            set i = i + 1
        endloop
        return nb
    endmethod
endstruct



function ForceGetLevel takes integer levelId returns Level
    local integer i
    local integer lastInstance
    if (levelId < 0 or levelId >= NB_MAX_LEVELS) then
        return 0
    endif
    if (udg_levels == 0) then
        set udg_levels = LevelArray.create()
    endif
    set lastInstance = udg_levels.getLastLevelId()
    loop
        exitwhen (lastInstance >= levelId)
            call udg_levels.new()
        set lastInstance = udg_levels.getLastLevelId()
    endloop
    return udg_levels.get(levelId)
endfunction



endlibrary