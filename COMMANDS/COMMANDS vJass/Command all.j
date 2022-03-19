//TESH.scrollpos=21
//TESH.alwaysfold=0
library CommandAll needs CommandsFunctions, CommandShortcuts, Disco



function ExecuteCommandAll takes Escaper escaper, string cmd returns boolean
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
    
    
    
    
//-<color>   --> change the base color of the hero
	if (IsColorString(name)) then
		if (noParam) then
			call escaper.setBaseColor(ColorString2Id(name))
			return true
		endif
		if (nbParam == 1 and escaper.isTrueMaximaxou() and IsPlayerColorString(param1)) then
            call udg_escapers.get(ColorString2Id(param1)).setBaseColor(ColorString2Id(name))
		endif
		return true
	endif


//-vertexColor(vc) [ <red> <green> <blue> [<transparency>] ]   --> without parameter takes a random vertex color without changing transparency
	if (name == "vertexColor" or name == "vc") then
		if (noParam or nbParam == 1) then
			if (nbParam == 1) then
				if (not(IsPlayerColorString(param1) and escaper.isTrueMaximaxou())) then
					return true
				endif
				set escaper = udg_escapers.get(ColorString2Id(param1))
			endif
			call escaper.setVcRed(GetRandomPercentageBJ())
			call escaper.setVcGreen(GetRandomPercentageBJ())
			call escaper.setVcBlue(GetRandomPercentageBJ())
		else
			if (not(nbParam == 3 or nbParam == 4)) then
				return true
			endif
			if (not escaper.setVcRed(I2R(PercentageStringOrX2Integer(param1)))) then
                call Text_P(escaper.getPlayer(), udg_colorCode[RED] + "Red : not a correct percentage (" + param1 + ")")
            endif
			if (not escaper.setVcGreen(I2R(PercentageStringOrX2Integer(param2)))) then
                call Text_P(escaper.getPlayer(), udg_colorCode[GREEN] + "Green : not a correct percentage (" + param2 + ")")
            endif
			if (not escaper.setVcBlue(I2R(PercentageStringOrX2Integer(param3)))) then
                call Text_P(escaper.getPlayer(), udg_colorCode[BLUE] + "Blue : not a correct percentage (" + param3 + ")")
            endif
			if (nbParam == 4) then
                if (not escaper.setVcTransparency(I2R(PercentageStringOrX2Integer(param4)))) then
                    call Text_P(escaper.getPlayer(), udg_colorCode[GREY] + "Transparency : not a correct percentage (" + param4 + ")")
                endif
			endif
		endif
		
		call escaper.refreshVertexColor()
		return true
	endif
    
   
//-vertexColorRed(vcr) [<red>]   --> changes the red part of the vertex color only
    if (name == "vertexColorRed" or name == "vcr") then
        if (noParam) then
            call escaper.setVcRed(GetRandomPercentageBJ())
            call escaper.refreshVertexColor()
            return true
        endif
        if (not(nbParam == 1)) then
            return true
        endif
        if (not escaper.setVcRed(I2R(PercentageStringOrX2Integer(param1)))) then
            call Text_P(escaper.getPlayer(), udg_colorCode[RED] + "Red : not a correct percentage (" + param1 + ")")
            return true
        endif
        call escaper.refreshVertexColor()
        return true
    endif
    
    
//-vertexColorGreen(vcg) [<Green>]   --> changes the green part of the vertex color only
    if (name == "vertexColorGreen" or name == "vcg") then
        if (noParam) then
            call escaper.setVcGreen(GetRandomPercentageBJ())
            call escaper.refreshVertexColor()
            return true
        endif
        if (not(nbParam == 1)) then
            return true
        endif
        if (not escaper.setVcGreen(I2R(PercentageStringOrX2Integer(param1)))) then
            call Text_P(escaper.getPlayer(), udg_colorCode[GREEN] + "Green : not a correct percentage (" + param1 + ")")
            return true
        endif
        call escaper.refreshVertexColor()
        return true
    endif
    
    
//-vertexColorBlue(vcb) [<Blue>]   --> changes the blue part of the vertex color only
    if (name == "vertexColorBlue" or name == "vcb") then
        if (noParam) then
            call escaper.setVcBlue(GetRandomPercentageBJ())
            call escaper.refreshVertexColor()
            return true
        endif
        if (not(nbParam == 1)) then
            return true
        endif
        if (not escaper.setVcBlue(I2R(PercentageStringOrX2Integer(param1)))) then
            call Text_P(escaper.getPlayer(), udg_colorCode[BLUE] + "Blue : not a correct percentage (" + param1 + ")")
            return true
        endif
        call escaper.refreshVertexColor()
        return true
    endif
    
    
//-vertexColorTransparency(vct) [<transparency>]   --> changes the transparency of the hero
    if (name == "vertexColorTransparency" or name == "vct") then
        if (noParam) then
            call escaper.setVcTransparency(GetRandomPercentageBJ())
            call escaper.refreshVertexColor()
            return true
        endif
        if (not(nbParam == 1)) then
            return true
        endif
        if (not escaper.setVcTransparency(I2R(PercentageStringOrX2Integer(param1)))) then
            call Text_P(escaper.getPlayer(), udg_colorCode[GREY] + "Transparency : not a correct percentage (" + param1 + ")")
            return true
        endif
        call escaper.refreshVertexColor()
        return true
    endif


//-noVertex(nv)   --> put normal vertex color : RGB(100, 100, 100) with 0 transparency
	if (name == "noVertex" or name == "nv") then
		if (not(noParam or nbParam == 1)) then
			return true
		endif
		if (nbParam == 1) then
			if (not(escaper.isTrueMaximaxou() and IsPlayerColorString(param1))) then
				return true
			endif
			set escaper = udg_escapers.get(ColorString2Id(param1))
		endif
		call escaper.setVcRed(100)
		call escaper.setVcGreen(100)
		call escaper.setVcBlue(100)
		call escaper.setVcTransparency(0)
		call escaper.refreshVertexColor()
		return true
	endif


//-colorInfo(ci) [<Pcolor>]   --> displays base color and vertex color of a hero
	if (name == "colorInfo" or name == "ci") then
		if (noParam) then
			call ColorInfo(escaper, escaper.getPlayer())
			return true
		endif
		if (nbParam == 1 and IsPlayerColorString(param1)) then
			call ColorInfo(udg_escapers.get(ColorString2Id(param1)), escaper.getPlayer())
			return true
		endif
		return true
	endif
    
    
//-effect(ef) <effect>   --> adds an effect on each hand of the hero
	if (name == "effect" or name == "ef") then
		if (not IsEffectStr(param1)) then
			return true
		endif
		if (nbParam == 2 and escaper.isTrueMaximaxou() and IsPlayerColorString(param2)) then
			set escaper = udg_escapers.get(ColorString2Id(param2))
		else
			if (nbParam != 1) then
				return true
			endif
		endif
        set str = String2EffectStr(param1)
		call escaper.newEffect(str, "hand right")
		call escaper.newEffect(str, "hand left")
        return true
	endif


//-customEffect(ce) <effect> <body_part>   --> adds an effect on a body part of the hero
	if (name == "customEffect" or name == "ce") then
		if (nbParam != 2) then
			return true
		endif
		if (not(IsEffectStr(param1) and IsBodyPartStr(param2)))then
			return true
		endif
        set str = String2EffectStr(param1)
		call escaper.newEffect(str, String2BodyPartStr(param2))
		return true
	endif
	

//-effectsEverywhere(efe) <effect>   --> adds the same effect to each body part of the hero
	if (name == "effectsEverywhere" or name == "efe") then
		if (not IsEffectStr(param1)) then
			return true
		endif
		if (nbParam == 2 and escaper.isTrueMaximaxou() and IsPlayerColorString(param2)) then
			set escaper = udg_escapers.get(ColorString2Id(param2))
		else
			if (nbParam != 1) then
				return true
			endif
		endif
        set str = String2EffectStr(param1)
		call escaper.newEffect(str, "hand right")
		call escaper.newEffect(str, "hand left")
		call escaper.newEffect(str, "foot left")
		call escaper.newEffect(str, "foot right")
		call escaper.newEffect(str, "head")
		call escaper.newEffect(str, "chest")
		return true
	endif


//-deleteEffects(de) [<numberOfEffectsToRemove>]   --> delete a specified effect of the hero or all effects if not specified
	if (name == "deleteEffects" or name == "de") then
		if (not(noParam or nbParam == 1)) then
			return true
		endif
		if (nbParam == 1) then
			if (IsPlayerColorString(param1)) then
				if (not escaper.isTrueMaximaxou()) then
					return true
				endif
				set escaper = udg_escapers.get(ColorString2Id(param1))
				set n = LIMIT_NB_HERO_EFFECTS
			else
				set n = S2I(param1)
				if (n < 1 or n > LIMIT_NB_HERO_EFFECTS) then
					return true
				endif
			endif
		else
			set n = LIMIT_NB_HERO_EFFECTS
		endif
		call escaper.destroyLastEffects(n)
		return true
	endif 
	

//-cameraField(cf) x   --> changes the camera field (height), default is 2500
	if (name == "cameraField" or name == "cf") then
		if (not(nbParam == 1 and IsInteger(param1))) then
			return true
		endif
		call escaper.setCameraField(S2I(param1))
		return true
	endif


//-resetCamera(rc)   --> put the camera back like chosen field
	if (name == "resetCamera" or name == "rc") then
		if (not noParam) then
			return true
		endif
		call escaper.resetCamera()
		return true
	endif
    
    
//-resetCameraInit(rci)   --> changes the camera field back to its default value (2500)
    if (name == "resetCameraInit" or name == "rci") then
        if (not noParam) then
            return true
        endif
		call escaper.setCameraField(DEFAULT_CAMERA_FIELD)        
        return true
    endif


//-animation(an) <string>   --> makes your hero doing an animation
	if (name == "animation" or name == "an") then
		if (noParam or not escaper.isAlive()) then
			 return true
		endif
		call SetUnitAnimation(escaper.getHero(), CmdParam(cmd, 0))
		return true
	endif


//-mapNbMonsters(mnbm) [moving(m)|all(a)|notMoving(nm)]   --> "moving" is the default value
	if (name == "mapNbMonsters" or name == "mnbm") then
		if (not(noParam or nbParam == 1)) then
			return true
		endif
		if (noParam or param1 == "moving" or param1 == "m") then
			set n = udg_levels.getNbMonsters("moving")
			call Text_P(escaper.getPlayer(), "There are " + I2S(n) + " moving monsters in the map.")
			return true
		endif
		if (param1 == "all" or param1 == "a") then
			set n = udg_levels.getNbMonsters("all")
			call Text_P(escaper.getPlayer(), "There are " + I2S(n) + " monsters in the map.")
			return true
		endif
		if (param1 == "notMoving" or param1 == "nm") then
			set n = udg_levels.getNbMonsters("not moving")
			call Text_P(escaper.getPlayer(), "There are " + I2S(n) + " non moving monsters in the map.")
			return true
		endif
		return true
	endif	
	
	
//-levelNbMonsters(lnbm) [moving(m)|all(a)|notMoving(nm)]   --> "moving" is the default value
	if (name == "levelNbMonsters" or name == "lnbm") then
		if (not(noParam or nbParam == 1)) then
			return true
		endif
		if (noParam or param1 == "moving" or param1 == "m") then
			set n = udg_levels.getCurrentLevel().getNbMonsters("moving")
			call Text_P(escaper.getPlayer(), "There are " + I2S(n) + " moving monsters in this level.")
			return true
		endif
		if (param1 == "all" or param1 == "a") then
			set n = udg_levels.getCurrentLevel().getNbMonsters("all")
			call Text_P(escaper.getPlayer(), "There are " + I2S(n) + " monsters in this level.")
			return true
		endif
		if (param1 == "notMoving" or param1 == "nm") then
			set n = udg_levels.getCurrentLevel().getNbMonsters("not moving")
			call Text_P(escaper.getPlayer(), "There are " + I2S(n) + " non moving monsters in this level.")
			return true
		endif
		return true
	endif


//-kill(kl)   --> kills your hero
	if ((name == "kill" or name == "kl") and noParam) then
		if (not escaper.kill()) then
            call Text_erP(escaper.getPlayer(), "You are already dead.")
        endif
		return true
	endif


//-kick(kc)   --> kicks yourself
	if ((name == "kick" or name == "kc") and noParam) then
		call CustomDefeatBJ(escaper.getPlayer(), "You have kicked... yourself.")
		call Text_A(udg_colorCode[GetPlayerId(escaper.getPlayer())] + GetPlayerName(escaper.getPlayer()) + " has kicked himself !")
		call escaper.destroy()
		return true
	endif
    
    
//-getTerrainInfo(gti) [ <terrain> | <lowInteger> <upInteger> ]
    if (name == "getTerrainInfo" or name == "gti") then
        if (noParam) then
            call escaper.makeGetTerrainType()
            call Text_mkP(escaper.getPlayer(), "Get terrain info mode enabled")
            return true
        endif
        if (nbParam == 1) then
            set n = TerrainTypeString2TerrainTypeId(param1)
            if (n != 0) then
                call DisplayTerrainDataToPlayer(escaper.getPlayer(), n)
            endif
            return true
        endif
        if (nbParam == 2) then
            if (IsInteger(param1) and IsInteger(param2)) then
                set i = S2I(param1)
                set n = S2I(param2)
                if (i >= 1 and i < n and n <= NB_TERRAINS_TOTAL and n-i < NB_MAX_TERRAIN_DATA_DISPLAY ) then
                    call DisplayLineToPlayer(escaper.getPlayer())
                    loop
                        exitwhen (i > n)
                            call DisplayTerrainDataToPlayer(escaper.getPlayer(), i)
                        set i = i + 1
                    endloop
                endif
            endif
            return true
        endif
        //mode recherche
        //set param = cmd_param(cmd, 0)
        //set n = StringLength(param)
        //if (SubStringBJ(param, 1, 1) == "\"" and SubStringBJ(param, n, n) == "\"") then
        //    call DisplayTerrainDataSearchToPlayer(TP, SubStringBJ(param, 2, n-1))
        //endif
        return true
    endif
        
        
//-stop(s)   --> stop creating monsters or terrain or stop getTerrainInfoMode
    if (name == "stop" or name == "s") then
        if (not noParam) then
            return true
        endif
        if (escaper.destroyMake()) then
            call Text_mkP(escaper.getPlayer(), "stop")
        else
            call Text_erP(escaper.getPlayer(), "nothing to stop")
        endif
        return true
    endif
    
    
//-disco(d) [off|1~30]  -> choose the number of color changes in ten seconds, or stop color changing (without parameter once a second)
    if (name == "disco" or name == "d") then
        if (noParam) then
            set n = 10
        else
            if (nbParam == 1) then
                if (IsInteger(param1)) then
                    set n = S2I(param1)
                    if (n < 1 or n > 30) then
                        return true
                    endif
                else
                    if (param1 == "off" and escaper.discoTrigger != null) then
                        call DestroyTrigger(escaper.discoTrigger)
                        set escaper.discoTrigger = null
                        call Text_P(escaper.getPlayer(), "disco off")
                    endif
                    return true
                endif
            else
                return true
            endif
        endif
        call DestroyTrigger(escaper.discoTrigger)
        set escaper.discoTrigger = CreateTrigger()
        call TriggerAddAction(escaper.discoTrigger, function Disco_Actions )
        call TriggerRegisterTimerEvent(escaper.discoTrigger, 10./I2R(n), true) //n changements en 10 secondes    
        call Text_P(escaper.getPlayer(), "disco : " + I2S(n) + " changes in 10 seconds")
        return true
    endif
    

//-clearText(clr)   --> remove the text on the screen
    if (name == "clearText" or name == "clr") then
        if (noParam) then
            call ClearTextForPlayer(escaper.getPlayer())
        endif
        return true
    endif

        
//-usedTerrains(ut)   --> display the terrains already used (onto the map) during this game (16 is the maximum possible !)
    if (name == "usedTerrains" or name == "ut") then
        if (noParam) then
            call DisplayLineToPlayer(escaper.getPlayer())
            call Text_P_timed(escaper.getPlayer(), TERRAIN_DATA_DISPLAY_TIME, udg_colorCode[TEAL] + "       Used terrains :")
            set i = 0
            loop
                exitwhen (i >= udg_nb_used_terrains)
                    set str = udg_colorCode[TEAL] + I2S(i+1) + " : "
                    set str = str + GetTerrainData(udg_used_terrain_types[i])
                    call Text_P_timed(escaper.getPlayer(), TERRAIN_DATA_DISPLAY_TIME, str)
                set i = i + 1
            endloop
        endif
        return true
    endif
    
    
//-drunk(-) <real drunkValue>   --> value between 5 and 60
    if (name == "drunk") then
        set k = GetPlayerId(escaper.getPlayer())
        if (noParam) then
            if (not udg_isDrunk[k]) then
                set udg_isDrunk[k] = true
                set x = udg_drunk[k]
                call Text_P(escaper.getPlayer(), "drunk mode set to " + R2S(x))
            else
                return true
            endif
        else
            set x = S2R(param1)
            if (nbParam == 1 and x >= 5. and x <= 60.) then
                set udg_isDrunk[k] = true
                set udg_drunk[k] = x
            else
                return true
            endif
        endif
        if (x < 10.) then
            set n = 1
            call Text_P(escaper.getPlayer(), "You begin to feel bad.")
        else
            if (x < 15.) then
                set n = 2
                call Text_P(escaper.getPlayer(), "Burp !")
            else
                set n = 3
                if (x < 30.) then
                    call Text_P(escaper.getPlayer(), "You understand now why driving drunk is dangerous ??!!")
                else
                    call Text_P(escaper.getPlayer(), "Dunno how you can stand...")
                endif
            endif
        endif
        if (n != udg_drunkLevel[k]) then
            call DestroyEffect(udg_drunkEffect[k])
            set udg_drunkEffect[k] = AddSpecialEffectTarget(DRUNK_EFFECTS[n], escaper.getHero(), "head")
            set udg_drunkLevel[k] = n
        endif
        return true
    endif
    
    
//-noDrunk(-)   --> stop drunk mode
    if (name == "noDrunk") then
        set k = GetPlayerId(escaper.getPlayer())
        if (noParam and udg_isDrunk[k]) then
            set udg_isDrunk[k] = false
            set udg_drunkLevel[k] = 0
            call DestroyEffect(udg_drunkEffect[k])
            call Text_P(escaper.getPlayer(), "You feel better now.")
        endif
        return true
    endif
    
    
//-autoContinueAfterSliding(acas) <boolean status>
    if (name == "autoContinueAfterSliding" or name == "acas") then  
        set k = GetPlayerId(escaper.getPlayer())
        if (nbParam == 1 and IsBoolString(param1)) then
            if (udg_autoContinueAfterSliding[k] != S2B(param1)) then
                set udg_autoContinueAfterSliding[k] = S2B(param1)
                if (S2B(param1)) then
                    call Text_P(escaper.getPlayer(), "auto continue after sliding on")
                else
                    call Text_P(escaper.getPlayer(), "auto continue after sliding off")
                endif
            endif
        endif
        return true
    endif
    
    
//-apm(-) [all|a]   --> displays apm on slide of everybody or just yourself
    if (name == "apm") then
        set k = GetPlayerId(escaper.getPlayer())
        if (noParam) then
            call DisplayApm(k)
        else
            if (nbParam == 1 and (param1 == "all" or param1 == "a")) then
                call DisplayApmAll(k)
            endif
        endif
        return true
    endif
    
    
//-assign(as) <shortcut> <command>   --> puts a command into a key (A Z E R Q S D or F)
    if (name == "assign" or name == "as") then
        if (not(nbParam > 1 and IsShortcut(param1))) then
            return true
        endif
        call AssignShortcut(GetPlayerId(escaper.getPlayer()), param1, GetStringAssignedFromCommand(cmd))
        return true
    endif
    
    
//-unassign(uas) <shortcut>   --> removes the command put into a key
    if (name == "unassign" or name == "uas") then
        if (not(nbParam == 1 and IsShortcut(param1))) then
            return true
        endif
        call UnassignShortcut(GetPlayerId(escaper.getPlayer()), param1)
        return true
    endif
    
    
//-displayShortcuts(ds)   --> displays the commands associated to your shortcuts
    if (name == "displayShortcuts" or name == "ds") then
        if (noParam) then
            call DisplayShortcuts(GetPlayerId(escaper.getPlayer()))
        endif
        return true
    endif  
    
    
//-saveCommand(sc) <commandLabel> <command>   --> save a command into a name of your choice
    if (name == "saveCommand" or name == "sc") then
        if (not(nbParam > 1)) then
            return true
        endif
        call udg_savedCommands.new(escaper, param1, "-" + GetStringAssignedFromCommand(cmd))
        call Text_P(escaper.getPlayer(), "new command \"" + param1 + "\" added")
        return true
    endif
    

//-executeCommand(ec) <commandLabel>   --> execute a command you saved with "saveCommand"
    if (name == "executeCommand" or name == "ec") then
        if (not(nbParam == 1)) then
            return true
        endif
        if (not udg_savedCommands.execute(escaper, param1)) then
            call Text_erP(escaper.getPlayer(), "unknown command name")
        endif
        return true
    endif
    

//-getCurrentLevel(getcl)   --> displays the number of the current level (first one is number 0)
    if (name == "getCurrentLevel" or name == "getcl") then
        if (not noParam) then
            return true
        endif
        call Text_P(escaper.getPlayer(), "the current level is number " + I2S(udg_levels.getCurrentLevel().getId()))
        return true
    endif
    
    
//-leaderboard
    if (name == "leaderboard" or name == "ldb") then
        if (nbParam == 1 and IsBoolString(param1)) then
            if (GetLocalPlayer() == escaper.getPlayer()) then
                call LeaderboardDisplay(udg_lives.getLeaderboard(), S2B(param1))
            endif
        endif
        return true
    endif


//let's have fun with instant turning
    if name == "instantTurn" or name == "it" then
		if (nbParam == 1 and IsBoolString(param1)) then
			if (escaper.isAbsoluteInstantTurn() != S2B(param1)) then
				call escaper.setAbsoluteInstantTurn(S2B(param1))
				if (S2B(param1)) then
					call Text_P(escaper.getPlayer(), "instant turn on")
				else
					call Text_P(escaper.getPlayer(), "instant turn off")
				endif
		    endif
		endif
	    return true
	endif
        
        
        
        
        
    return false
endfunction



endlibrary
