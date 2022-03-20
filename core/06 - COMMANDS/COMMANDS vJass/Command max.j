//TESH.scrollpos=314
//TESH.alwaysfold=0
library CommandMax needs CommandsFunctions, ReinitTerrains, ReinitTerrainsPositions, SaveMapInCache




function ExecuteCommandMax takes Escaper escaper, string cmd returns boolean
	local string name = CmdName(cmd)
	local boolean noParam = NoParam(cmd) 
	local integer nbParam = NbParam(cmd)
	
	local integer n
	local integer i
	local integer j
	local integer k

	local boolean b

	local string str = ""
	local string str2 = ""

	local real x
	local real y
	local location point
 
	local string param

	local string param1 = CmdParam(cmd, 1)
	local string param2 = CmdParam(cmd, 2)
	local string param3 = CmdParam(cmd, 3)
	local string param4 = CmdParam(cmd, 4)
	
	local real speed
    
    local Escaper escaper2

    
    
//-reinitTerrains(rit)   --> reset kinds of terrain
    if (name == "reinitTerrains" or name == "rit") then
        if (noParam) then
            call ReinitTerrains()
        endif        
        return true
    endif
    
    
//-reinitTerrainsPosition(ritp)   --> reset the terrain on the map
    if (name == "reinitTerrainsPosition" or name == "ritp") then
        if (noParam) then
            call ReinitTerrainsPosition()
        endif        
        return true
    endif
        
        
//-saveTerrain(st) [<slotName>]   --> spaces allowed for slotName
    if (name == "saveTerrain" or name == "st") then
        if (noParam) then
            call SaveTerrainWithoutName()
        else
            call SaveTerrainWithName(CmdParam(cmd, 0))
        endif
        return true
    endif
        
        
//-loadTerrain(lt) [<slotName>]
    if (name == "loadTerrain" or name == "lt") then
        if (noParam) then
            call LoadTerrainWithoutName()
        else
            if (not LoadTerrainWithName(CmdParam(cmd, 0))) then
                call Text_erP(escaper.getPlayer(), "this terrain save doesn't exist")
            endif
        endif
        return true
    endif
    
    
//-deleteTerrainSave(delts) [<slotName>]
    if (name == "deleteTerrainSave" or name == "delts") then
        if (noParam) then
            return true
        endif
        if (DeleteTerrainSaveWithName(CmdParam(cmd, 0))) then
            call Text_mkP(escaper.getPlayer(), "terrain save deleted")
        else
            call Text_erP(escaper.getPlayer(), "this terrain save doesn't exist")
        endif
        return true
    endif
    
    
//-control(cl) <Pcolor1>|all(a) [<Pcolor2>]   --> gives the control of a hero to player <Pcolor2>
	if (name == "control" or name == "cl") then
		if (not(nbParam == 1 or nbParam == 2)) then
			return true
		endif
		if (nbParam == 2) then
			if (not IsPlayerColorString(param2)) then
                call Text_erP(escaper.getPlayer(), "param2 should be a player color")
				return true
			endif
			set escaper2 = udg_escapers.get(ColorString2Id(param2))
            if (escaper2 == 0) then
                call Text_erP(escaper.getPlayer(), "escaper " + param2 + " doesn't exist")
                return true
            endif
        else
            set escaper2 = escaper
		endif
		if (param1 == "all" or param1 == "a") then
			set i = 0
			loop
				exitwhen (i >= NB_ESCAPERS)
					if (udg_escapers.get(i) != 0) then
                        call udg_escapers.get(i).giveHeroControl(escaper2)
					endif
				set i = i + 1
			endloop
            if (escaper == escaper2) then
                call Text_P(escaper.getPlayer(), "all heroes are now yours")
            else
                call Text_P(escaper.getPlayer(), "all heroes are now to player " + param2)
            endif
			return true
		endif
		if (IsPlayerColorString(param1)) then
            set n = ColorString2Id(param1)
			if (udg_escapers.get(n) != 0) then
				call udg_escapers.get(n).giveHeroControl(escaper2)
				call GetMirrorEscaper(udg_escapers.get(n)).giveHeroControl(escaper2)
            else
                call Text_erP(escaper.getPlayer(), "escaper " + param1 + " doesn't exist")
                return true
			endif
            if (escaper == escaper2) then
                call Text_P(escaper.getPlayer(), "hero of player " + param1 + " is now yours")
            else
                call Text_P(escaper.getPlayer(), "hero of player " + param1 + " is now to player " + param2)
            endif
		endif
		return true
	endif
    
    
//-resetOwners(ro)   --> gives back the control of heroes to their owner
	if (name == "resetOwners" or name == "ro") then
        if (noParam) then
            set i = 0
            loop
                exitwhen (i >= NB_ESCAPERS)
                    if (udg_escapers.get(i) != 0) then
                        call udg_escapers.get(i).resetOwner()
                    endif
                set i = i + 1
            endloop
            call Text_P(escaper.getPlayer(), "all heroes are now to their owners")
        endif
		return true
	endif
    
    
//-setlives(setl) <nbLives>
	if (name == "setlives" or name == "setl") then
		if (not(nbParam == 1 and IsPositiveInteger(param1))) then
		   return true
		endif
		call udg_lives.setNb(S2I(param1))
        return true
	endif
    
    
//-teleport(t) <boolean status>   --> enable or disable teleport trigger
	if (name == "teleport" or name == "t") then
		if (not(nbParam == 1)) then
			return true
		endif
        if (not IsBoolString(param1)) then
            call Text_erP(escaper.getPlayer(), "param1 should be a boolean or a real")
            return true
        endif
		if (S2B(param1)) then
			call EnableTrigger(gg_trg_Teleport)
            call Text_P(escaper.getPlayer(), "teleport on")
		else
			call DisableTrigger(gg_trg_Teleport)
            call Text_P(escaper.getPlayer(), "teleport off")
		endif
		return true
	endif


//-redRights(redr) <boolean status> 
	if (name == "redRights" or name == "redr") then
		if (not(nbParam == 1 and IsBoolString(param1))) then
			return true
		endif
		set udg_areRedRightsOn = S2B(param1)
        if (S2B(param1)) then
            call Text_P(escaper.getPlayer(), "red rights on")
        else
            call Text_P(escaper.getPlayer(), "red rights off")
        endif
		return true
	endif
    
    
//-autorevive(ar) [<boolean status> [<Pcolor>|all(a)]]
	if (name == "autorevive" or name == "ar") then
		if (noParam) then
			call escaper.setHasAutorevive(true)
            call Text_P(escaper.getPlayer(), "you have now autorevive set to on")
			return true
		endif
		if (not IsBoolString(param1)) then
            call Text_erP(escaper.getPlayer(), "param1 should be a boolean")
			return true
		endif
		set b = S2B(param1)
		if (nbParam == 1) then
			call escaper.setHasAutorevive(b)
            if (b) then
                call Text_P(escaper.getPlayer(), "you have now autorevive set to on")
            else
                call Text_P(escaper.getPlayer(), "you have now autorevive set to off")
            endif
			return true
		endif
		if (not(nbParam == 2)) then
            call Text_erP(escaper.getPlayer(), "no more than 2 params allowed for this command")
			return true
		endif
		if (param2 == "all" or param2 == "a") then
			set i=0
			loop
				exitwhen (i >= NB_ESCAPERS)
					if (udg_escapers.get(i) != 0) then
						call udg_escapers.get(i).setHasAutorevive(b)
					endif
				set i = i+1
			endloop
            if (b) then
                call Text_P(escaper.getPlayer(), "autorevive set to on for all")
            else
                call Text_P(escaper.getPlayer(), "autorevive set to off for all")
            endif
            return true
		endif
		if (IsPlayerColorString(param2)) then
            set n = ColorString2Id(param2)
			if (udg_escapers.get(n) != 0) then
				call udg_escapers.get(n).setHasAutorevive(b)
                if (b) then
                    call Text_P(escaper.getPlayer(), "autorevive set to on for player " + param2)
                else
                    call Text_P(escaper.getPlayer(), "autorevive set to off for player " + param2)
                endif
            else
                call Text_erP(escaper.getPlayer(), "escaper " + param2 + " doesn't exist")
			endif
        else
            call Text_erP(escaper.getPlayer(), "param2 should be a player color or \"all\"")
		endif
		return true
	endif

    	
//-createHero(crh) [<Pcolor>|all(a)]
	if (name == "createHero" or name == "crh") then
		if (noParam) then
			if (not escaper.createHeroAtStart()) then
				call Text_erP(escaper.getPlayer(), "You already have a hero !")
			endif
			return true
		endif
		if (not(nbParam == 1)) then
            call Text_erP(escaper.getPlayer(), "no more than one param allowed for this command")
			return true
		endif
		if (param1 == "all" or param1 == "a") then
			set i = 0
			loop
				exitwhen (i >= NB_ESCAPERS)
                    if (udg_escapers.get(i) == 0) then
                        call udg_escapers.newAt(i)
                        if (udg_doubleHeroesEnabled) then
                        	call udg_escapers.newAt(i + NB_PLAYERS_MAX)
                        endif
                    endif
                    call udg_escapers.get(i).createHeroAtStart()
					if (udg_doubleHeroesEnabled) then
                    	call udg_escapers.get(i + NB_PLAYERS_MAX).createHeroAtStart()
					endif
				set i = i + 1
			endloop
			return true
		endif
		if (IsPlayerColorString(param1)) then
            set n = ColorString2Id(param1)
            if (udg_escapers.get(n) == 0) then
                call udg_escapers.newAt(n)
				if (udg_doubleHeroesEnabled) then
					call udg_escapers.newAt(n + NB_PLAYERS_MAX)
				endif
            endif
			if (not udg_escapers.get(n).createHeroAtStart()) then
                call Text_erP(escaper.getPlayer(), "this player already has a hero")
			endif
			if (udg_doubleHeroesEnabled) then
				call udg_escapers.get(n + NB_PLAYERS_MAX).createHeroAtStart()
			endif
		endif
		return true
	endif
    
    
//-deleteHero(delh) [<Pcolor>|all(a)]
	if (name == "deleteHero" or name == "delh") then
		if (noParam) then
			call escaper.removeHero()
			return true
		endif
		if (not(nbParam == 1)) then
            call Text_erP(escaper.getPlayer(), "no more than one param allowed for this command")
			return true
		endif
		if (param1 == "all" or param1 == "a") then
			set i = 0
			loop
				exitwhen (i >= NB_ESCAPERS)
					if (udg_escapers.get(i) != 0 and udg_escapers.get(i) != escaper) then
                        if (IsEscaperInGame(i)) then
                            call udg_escapers.get(i).removeHero()
                        else
                            call udg_escapers.remove(i)
                        endif
					endif
				set i = i + 1
			endloop
			return true
		endif
		if (IsPlayerColorString(param1)) then
            set n = ColorString2Id(param1)
			if (udg_escapers.get(n) != 0) then
                if (IsEscaperInGame(n)) then
                    call udg_escapers.get(n).removeHero()
                else
                    call udg_escapers.remove(n)
                endif
            else
                call Text_erP(escaper.getPlayer(), "escaper " + param1 + " doesn't exist")
            endif
        else
            call Text_erP(escaper.getPlayer(), "param1 should be a player color or \"all\"")
		endif
		return true
	endif

    
//-canCheat(cc) <Pcolor>|all(a) [<boolean status>]
	if (name == "canCheat" or name == "cc") then
		if (not(nbParam == 1 or nbParam == 2)) then
            call Text_erP(escaper.getPlayer(), "one or two params for this command")
			return true
		endif
		if (nbParam == 2) then
            if (IsBoolString(param2)) then
                set b = S2B(param2)
            else
                call Text_erP(escaper.getPlayer(), "param2 must be a boolean")
                return true
            endif
        else
            set b = true
        endif
		if (param1 == "all" or param1 == "a") then
			set i = 0
			loop
				exitwhen (i >= NB_ESCAPERS)
                    if (udg_escapers.get(i) != 0 and udg_escapers.get(i) != escaper) then
                        if (not udg_escapers.get(i).isMaximaxou()) then
                            call udg_escapers.get(i).setCanCheat(b)
                        endif
					endif
				set i = i + 1
			endloop
            if (b) then
                call Text_P(escaper.getPlayer(), "all players can now cheat and make")
            else
                call Text_P(escaper.getPlayer(), "all players who haven't Maximaxou rights can't cheat or make anymore")
            endif
			return true
		endif
		if (IsPlayerColorString(param1)) then
            set n = ColorString2Id(param1)
            if (udg_escapers.get(n) != 0) then
                if (udg_escapers.get(n) != escaper) then
                    if (not udg_escapers.get(n).isMaximaxou()) then
                        call udg_escapers.get(n).setCanCheat(b)
                        if (b) then
                            call Text_P(escaper.getPlayer(), "player " + param1 + " can now cheat and make")
                        else
                            call Text_P(escaper.getPlayer(), "player " + param1 + " no longer can cheat and make")
                        endif
                    else
                        call Text_erP(escaper.getPlayer(), "you can't change rights of player " + param1 + ", he has Maximaxou rights like you")
                    endif
                else
                    call Text_erP(escaper.getPlayer(), "you can't change your own rights")
                endif
            else
                call Text_erP(escaper.getPlayer(), "escaper " + param1 + " doesn't exist")
            endif
        else
            call Text_erP(escaper.getPlayer(), "param1 must be a player color or \"all\"")
		endif
		return true
	endif

    
//-setAfkTime(setafkt) <time>
    if (name == "setAfkTime" or name == "setafkt") then
        if (nbParam != 1 or S2I(param1) <= 0) then
            call Text_erP(escaper.getPlayer(), "there must be one param which is an integer higher than 0")
            return true
        endif
        set timeMinAfk = S2R(param1) 
        call Text_P(escaper.getPlayer(), "afk time set to " + param1)
        return true
    endif
    
    
//-setAutoreviveDelay(setard) <time>   --> maximum 15 seconds
    if (name == "setAutoreviveDelay" or name == "setard") then
        if (not(nbParam == 1 and (S2R(param1) > 0 or param1 == "0") and S2R(param1) <= 15)) then
            call Text_erP(escaper.getPlayer(), "there must be one param positive real (maximum 15)")
            return true
        endif
        set x = S2R(param1)
        set udg_autoreviveDelay = x
        if (x > 1) then
            call Text_P(escaper.getPlayer(), "autorevive delay set to " + R2S(x) + " seconds")
        else
            call Text_P(escaper.getPlayer(), "autorevive delay set to " + R2S(x) + " second")
        endif
        return true
    endif
    

//-saveMapInCache(smic)
    if (name == "saveMapInCache" or name == "smic") then
        if (noParam) then
            call StartSaveMapInCache()
        endif
        return true
    endif
    

//-removeTerrain(remt) <terrainLabel>
    if (name == "removeTerrain" or name == "remt") then
        if (not(nbParam == 1)) then
            return true
        endif
        if (udg_terrainTypes.remove(param1)) then
            call Text_mkP(escaper.getPlayer(), "terrain removed")
        else
            call Text_erP(escaper.getPlayer(), "unknown terrain")
        endif
        return true
    endif
    

//-removeMonster(remm) <monsterLabel>
    if (name == "removeMonster" or name == "remm") then
        if (not(nbParam == 1)) then
            return true
        endif
        if (udg_monsterTypes.remove(param1)) then
            call Text_mkP(escaper.getPlayer(), "monster type removed")
        else
            call Text_erP(escaper.getPlayer(), "unknown monster type")
        endif
        return true
    endif
    
    
//-removeLastLevel(remll)
    if (name == "removeLastLevel" or name == "remll") then
        if (noParam) then
            if (udg_levels.destroyLastLevel()) then
                call Text_mkP(escaper.getPlayer(), "level number " + I2S(udg_levels.getLastLevelId()+1) + " destroyed")
            else
                call Text_erP(escaper.getPlayer(), "impossible to destroy the first level")
            endif
        endif
        return true
    endif

    
//-removeCaster(remc) <casterLabel>
    if (name == "removeCaster" or name == "remc") then
        if (nbParam != 1) then
            return true
        endif
        //checkParam 1
        if (not udg_casterTypes.isLabelAlreadyUsed(param1)) then
            call Text_erP(escaper.getPlayer(), "unknown caster type \"" + param1 + "\"")
            return true
        endif
        //apply command
        call udg_casterTypes.remove(param1)
        call Text_mkP(escaper.getPlayer(), "caster type removed")
        return true
    endif
    
    
//-setTerrainsOrder(setto) <terrainLabels>
    if (name == "setTerrainsOrder" or name == "setto") then
        if (udg_terrainTypes.setOrder(cmd)) then
            call Text_mkP(escaper.getPlayer(), "terrains order set")
        else
            call Text_erP(escaper.getPlayer(), "couldn't set terrains order. Usage : put all the terrain types as parameters, once each")
        endif
        return true
    endif
    

//-setTerrainCliffClass(settcc) <terrainLabel> <cliffClass>
    if (name == "setTerrainCliffClass" or name == "settcc") then
        if (nbParam != 2) then
            return true
        endif
        //checkParam 1
        set b = (udg_terrainTypes.get(param1) != 0)
        if (not b) then
            return true
        endif
        //checkParam 2
        if (param2 != "1" and param2 != "2") then
            call Text_erP(escaper.getPlayer(), "cliff class must be 1 or 2")
        endif
        //apply command
        call udg_terrainTypes.get(param1).setCliffClassId(S2I(param2))
        call Text_mkP(escaper.getPlayer(), "cliff class changed to " + param2)
        return true
    endif


//-setMainTileset <tileset>
    if (name == "setMainTileset") then
        if (nbParam > 1) then
            return true
        endif
        if (udg_terrainTypes.setMainTileset(param1)) then
            call Text_mkP(escaper.getPlayer(), "main tileset changed")
        else
            call Text_P(escaper.getPlayer(), "available tilesets : " + MAKE_TEXT_COLORCODE + "auto|r ; " + MAKE_TEXT_COLORCODE + "A|r = Ashenvale ; " + MAKE_TEXT_COLORCODE + "B|r = Barrens ; " + MAKE_TEXT_COLORCODE + "C|r = Felwood ; " + MAKE_TEXT_COLORCODE + "D|r = Dungeon ; " + MAKE_TEXT_COLORCODE + "F|r = Lordaeron Fall ; " + MAKE_TEXT_COLORCODE + "G|r = Underground ; " + MAKE_TEXT_COLORCODE + "L|r = Lordaeron Summer ; " + MAKE_TEXT_COLORCODE + "N|r = Northrend ; " + MAKE_TEXT_COLORCODE + "Q|r = Village Fall ; " + MAKE_TEXT_COLORCODE + "V|r = Village ; " + MAKE_TEXT_COLORCODE + "W|r = Lordaeron Winter ; " + MAKE_TEXT_COLORCODE + "X|r = Dalaran ; " + MAKE_TEXT_COLORCODE + "Y|r = Cityscape ; " + MAKE_TEXT_COLORCODE + "Z|r = Sunken Ruins ; " + MAKE_TEXT_COLORCODE + "I|r = Icecrown ; " + MAKE_TEXT_COLORCODE + "J|r = Dalaran Ruins ; " + MAKE_TEXT_COLORCODE + "O|r = Outland ; " + MAKE_TEXT_COLORCODE + "K|r = Black Citadel")
        endif
        return true
    endif
    
    


    return false
endfunction





endlibrary