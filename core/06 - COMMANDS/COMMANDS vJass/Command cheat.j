//TESH.scrollpos=459
//TESH.alwaysfold=0
library CommandCheat needs CommandsFunctions





function ExecuteCommandCheat takes Escaper escaper, string cmd returns boolean
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

    


//-slideSpeed(ss) <speed>   --> changes the slide speed of your hero, ignoring terrains
	if (name == "setSlideSpeed" or name == "ss") then
		if (not IsInteger(param1)) then
			return true
		endif
		set speed = S2R(param1) * SLIDE_PERIOD
		if (nbParam == 1) then
			call escaper.absoluteSlideSpeed(speed)
            call Text_P(escaper.getPlayer(), "your slide speed is set to " + param1)
			return true
		endif
		if (not(nbParam == 2 and escaper.isMaximaxou())) then
			return true
		endif 
		if (param2 == "all" or param2 == "a") then
			set i = 0
			loop
				exitwhen (i > 11)
                    if (udg_escapers.get(i) != 0) then
                        call udg_escapers.get(i).absoluteSlideSpeed(speed)
                    endif
				set i = i + 1
			endloop
            call Text_P(escaper.getPlayer(), "slide speed for all is set to " + param1)
			return true
		endif
		if (IsPlayerColorString(param2)) then
            if (udg_escapers.get(ColorString2Id(param2)) != 0) then
                call udg_escapers.get(ColorString2Id(param2)).absoluteSlideSpeed(speed)
                call Text_P(escaper.getPlayer(), "slide speed for player " + param2 + " is set to " + param1)
            endif
		endif   
		return true
	endif 
	
	
//-normalSlideSpeed(nss)   --> puts the slide speed back to normal (respecting terrains)
	if (name == "normalSlideSpeed" or name == "nss") then
		if (noParam) then
			call escaper.stopAbsoluteSlideSpeed()
            call Text_P(escaper.getPlayer(), "your slide speed depends now on terrains")
			return true
		endif
		if (not(nbParam == 1 and escaper.isMaximaxou())) then
			return true
		endif
		if (param1 == "all" or param1 == "a") then
			set i = 0
			loop
				exitwhen (i > 11)
                    if (udg_escapers.get(i) != 0) then
						call udg_escapers.get(i).stopAbsoluteSlideSpeed()
					endif		
				set i = i+1
			endloop
            call Text_P(escaper.getPlayer(), "slide speed for all depends now on terrains")
			return true
		endif		
		if (IsPlayerColorString(param1)) then
			if (udg_escapers.get(ColorString2Id(param1)) != 0) then
				call udg_escapers.get(ColorString2Id(param1)).stopAbsoluteSlideSpeed()
                call Text_P(escaper.getPlayer(), "slide speed for player " + param1 + " depends now on terrains")
			endif	
		endif
		return true
	endif
	
	
	
//-walkSpeed(ws) <speed>   --> changes the walk speed of your hero, ignoring terrains
	if (name == "setWalkSpeed" or name == "ws") then
		if (not IsInteger(param1)) then
			return true
		endif
		set speed = S2R(param1)
		if (nbParam == 1) then
			call escaper.absoluteWalkSpeed(speed)
            call Text_P(escaper.getPlayer(), "walk speed set to " + param1)
			return true
		endif
		if (not(nbParam == 2 and escaper.isMaximaxou())) then
			return true
		endif 
		if (param2 == "all" or param2 == "a") then
			set i = 0
			loop
				exitwhen (i > 11)
					if (udg_escapers.get(i) != 0) then
						call udg_escapers.get(i).absoluteWalkSpeed(speed)
					endif
				set i = i + 1
			endloop
            call Text_P(escaper.getPlayer(), "walk speed for all set to " + param1)
			return true
		endif
		if (IsPlayerColorString(param2)) then
			if (udg_escapers.get(ColorString2Id(param2)) != 0) then
                call udg_escapers.get(ColorString2Id(param2)).absoluteWalkSpeed(speed)
                call Text_P(escaper.getPlayer(), "walk speed for player " + param2 + " set to " + param1)
            endif
		endif   
		return true
	endif 
	
	
//-normalWalkSpeed(nws)   --> puts the walk speed back to normal (respecting terrains)
	if (name == "normalWalkSpeed" or name == "nws") then
		if (noParam) then
			call escaper.stopAbsoluteWalkSpeed()
            call Text_P(escaper.getPlayer(), "walk speed depends now on terrains")
			return true
		endif
		if (not(nbParam == 1 and escaper.isMaximaxou())) then
			return true
		endif
		if (param1 == "all" or param1 == "a") then
			set i = 0
			loop
				exitwhen (i > 11)
					if (udg_escapers.get(i) != 0) then
						call udg_escapers.get(i).stopAbsoluteWalkSpeed()
					endif		
				set i = i+1
			endloop
            call Text_P(escaper.getPlayer(), "walk speed for all depends now on terrains")
			return true
		endif
		if (IsPlayerColorString(param1)) then
			if (udg_escapers.get(ColorString2Id(param1)) != 0) then
				call udg_escapers.get(ColorString2Id(param1)).stopAbsoluteWalkSpeed()
                call Text_P(escaper.getPlayer(), "walk speed for player " + param1 + " depends now on terrains")
			endif	
		endif
		return true
	endif	
	
	
//-canTeleport(ct) <boolean canTeleport>   --> teleport trigger must have been enabled by the admin
	if (name == "canTeleport" or name == "ct") then
		if (not IsBoolString(param1)) then
			return true
		endif
		set b = S2B(param1)
		if (nbParam == 1) then
			call escaper.setCanTeleport(b)
			return true
		endif
		if (not(nbParam == 2 and escaper.isMaximaxou())) then
			return true
		endif
		if (param2 == "all" or param2 == "a") then
			set i = 0
			loop
				exitwhen (i > 11)
					if (udg_escapers.get(i) != 0) then
						call udg_escapers.get(i).setCanTeleport(b)
					endif
				set i = i + 1
			endloop
			return true
		endif
		if (IsPlayerColorString(param2)) then
			if (udg_escapers.get(ColorString2Id(param2)) != 0) then
                call udg_escapers.get(ColorString2Id(param2)).setCanTeleport(b)
            endif
		endif   
		return true
	endif
    
    
//-teleport(t)   --> teleports your hero at the next clic
    if (name == "teleport" or name == "t") and (noParam or (nbParam == 1 and (param1 == "0" or S2R(param1) != 0))) then
        if (nbParam == 1) then
            call SetUnitFacing(escaper.getHero(), S2R(param1))
        endif
        call ActivateTeleportOnceOnly(escaper.getHero())
        return true
    endif


//-revive(r)   --> revives your hero
	if (name == "revive" or name == "r") then
		if (noParam) then
			call escaper.reviveAtStart()
			return true
		endif
		if (not(nbParam == 1 and escaper.isMaximaxou())) then
			return true
		endif
		if (param1 == "all" or param1 == "a") then
			set i = 0
			loop
				exitwhen (i > 11)
					if (udg_escapers.get(i) != 0) then
						call udg_escapers.get(i).reviveAtStart()
					endif		
				set i = i+1
			endloop
			return true
		endif
		if (IsPlayerColorString(param1)) then
			if (udg_escapers.get(ColorString2Id(param1)) != 0) then
				call udg_escapers.get(ColorString2Id(param1)).reviveAtStart()
			endif	
		endif
		return true
	endif

    
//-reviveTo(rto) <Pcolor>   --> revives your hero to an other hero, with the same facing angle
    if (name == "reviveTo" or name == "rto") then
        if (not(nbParam == 1 and IsPlayerColorString(param1))) then
            return true
        endif
        set n = ColorString2Id(param1)
        if (not udg_escapers.get(n).isAlive() or udg_escapers.get(n) == 0) then
            return true
        endif
        call escaper.turnInstantly(GetUnitFacing(udg_escapers.get(n).getHero()))
        call escaper.moveHero(GetUnitX(udg_escapers.get(n).getHero()), GetUnitY(udg_escapers.get(n).getHero()))
        return true
    endif
        
        
//-getInfiniteMeteors(gim)   --> puts in your inventory a meteor that doesn't disapear after being used
    if (name == "getInfiniteMeteors" or name == "gim") then
        if (noParam) then
            if (UnitItemInSlot(escaper.getHero(), 0) == null) then
                call HeroAddCheatMeteor(escaper.getHero())
                call Text_P(escaper.getPlayer(), "you get infinite meteors")
            else
                call Text_erP(escaper.getPlayer(), "inventory full")
            endif
        endif
        return true
    endif
    
    
//-deleteInfiniteMeteors(dim)   --> remove the infinite meteor from your inventory if you have one
    if (name == "deleteInfiniteMeteors" or name == "dim") then
        if (noParam) then
            if (GetItemTypeId(UnitItemInSlot(escaper.getHero(), 0)) == METEOR_CHEAT) then
                call RemoveItem(UnitItemInSlot(escaper.getHero(), 0))
                call Text_P(escaper.getPlayer(), "infinite meteors removed")
            else
                call Text_erP(escaper.getPlayer(), "no infinite meteors to remove")
            endif
        endif
        return true
    endif
    
    
//-endLevel(el)   --> go to the end of the current level
    if (name == "endLevel" or name == "el") then
        if (noParam) then
            call udg_levels.goToNextLevel(0)
        endif
        return true
    endif 
    
	
//-goToLevel(gotl) <levelId>   --> first level is number 0
	if (name == "goToLevel" or name == "gotl") then
        if (not(nbParam == 1)) then
            return true
        endif
		if (not IsPositiveInteger(param1)) then
            call Text_erP(escaper.getPlayer(), "level number should be a positive integer")
			return true
		endif
        set n = S2I(param1)
        if (udg_levels.getCurrentLevel().getId() == n) then
            call Text_erP(escaper.getPlayer(), "you already are in this level")
            return true
        endif
		if (not udg_levels.goToLevel(0, n)) then
            call Text_erP(escaper.getPlayer(), "this levels doesn't exist (level max : " + I2S(udg_levels.getLastLevelId()) + ")")
		endif
		return true
	endif
    
    
//-viewAll(va)   --> displays the whole map
    if (name == "viewAll" or name == "va") then
        if (noParam) then
            call FogModifierStart(udg_viewAll)
        endif
        return true
    endif
    
    
//-hideAll(ha)   --> puts the map view back to normal
    if (name == "hideAll" or name == "ha") then
        if (noParam) then
            call FogModifierStop(udg_viewAll)
        endif
        return true
    endif 
    
    
//-setGodMode(setgm) <boolean status>   --> activate or desactivate god mode for your hero
    if (name == "setGodMode" or name == "setgm") then
		if (not(nbParam == 1 or nbParam == 2)) then
            call Text_erP(escaper.getPlayer(), "one or two params for this command")
			return true
		endif
        if (IsBoolString(param1)) then
            set b = S2B(param1)
        else
            call Text_erP(escaper.getPlayer(), "param1 must be a boolean")
            return true
        endif
        if (nbParam == 1) then
            call escaper.setGodMode(b)
            if (b) then
                call Text_P(escaper.getPlayer(), "you are now invulnerable")
            else
                call Text_P(escaper.getPlayer(), "you are now vulnerable")
            endif
            return true
        endif
        if (not escaper.isMaximaxou()) then
            call Text_erP(escaper.getPlayer(), "your rights are too weak")
            return true
        endif
		if (param2 == "all" or param2 == "a") then
			set i = 0
			loop
				exitwhen (i > 11)
                    if (udg_escapers.get(i) != 0) then
                        call udg_escapers.get(i).setGodMode(b)
					endif
				set i = i + 1
			endloop
            if (b) then
                call Text_P(escaper.getPlayer(), "all sliders are now invulnerable")
            else
                call Text_P(escaper.getPlayer(), "all sliders are now vulnerable")
            endif
			return true
		endif
		if (IsPlayerColorString(param2)) then
            set n = ColorString2Id(param2)
            if (udg_escapers.get(n) != 0) then
                call udg_escapers.get(n).setGodMode(b)
                if (b) then
                    call Text_P(escaper.getPlayer(), "slider " + param2 + " is now invulnerable")
                else
                    call Text_P(escaper.getPlayer(), "slider " + param2 + " is now vulnerable")
                endif
            else
                call Text_erP(escaper.getPlayer(), "escaper " + param2 + " doesn't exist")
            endif
        else
            call Text_erP(escaper.getPlayer(), "param2 must be a player color or \"all\"")
		endif
		return true
	endif


//-setGodModeKills(setgmk) <boolean status>   --> if activated, monsters will be killed by your hero
    if (name == "setGodModeKills" or name == "setgmk") then
		if (not(nbParam == 1 or nbParam == 2)) then
            call Text_erP(escaper.getPlayer(), "one or two params for this command")
			return true
		endif
        if (IsBoolString(param1)) then
            set b = S2B(param1)
        else
            call Text_erP(escaper.getPlayer(), "param1 must be a boolean")
            return true
        endif
        if (nbParam == 1) then
            call escaper.setGodModeKills(b)
            if (b) then
                call Text_P(escaper.getPlayer(), "your god mode now kills monsters (if activated)")
            else
                call Text_P(escaper.getPlayer(), "you god mode doesn't kill monsters anymore")
            endif
            return true
        endif
        if (not escaper.isMaximaxou()) then
            call Text_erP(escaper.getPlayer(), "your rights are too weak")
            return true
        endif
		if (param2 == "all" or param2 == "a") then
			set i = 0
			loop
				exitwhen (i > 11)
                    if (udg_escapers.get(i) != 0) then
                        call udg_escapers.get(i).setGodModeKills(b)
					endif
				set i = i + 1
			endloop
            if (b) then
                call Text_P(escaper.getPlayer(), "god mode of all sliders now kills monsters (if activated)")
            else
                call Text_P(escaper.getPlayer(), "god mode of all sliders doesn't kill monsters anymore")
            endif
			return true
		endif
		if (IsPlayerColorString(param2)) then
            set n = ColorString2Id(param2)
            if (udg_escapers.get(n) != 0) then
                call udg_escapers.get(n).setGodModeKills(b)
                if (b) then
                    call Text_P(escaper.getPlayer(), "god mode of slider " + param2 + " now kills monsters (if activated)")
                else
                    call Text_P(escaper.getPlayer(), "god mode of slider " + param2 + " doesn't kill monsters anymore")
                endif
            else
                call Text_erP(escaper.getPlayer(), "escaper " + param2 + " doesn't exist")
            endif
        else
            call Text_erP(escaper.getPlayer(), "param2 must be a player color or \"all\"")
		endif
		return true
	endif


//-setGravity x
    if (name == "setGravity" or name == "setg") then
        if (not(nbParam == 1) or (S2R(param1) == 0 and param1 != "0")) then
            return true
        endif
        call SetGravity(S2R(param1))
        call Text_P(escaper.getPlayer(), "gravity changed")
        return true
    endif
    
    
//-getGravity
    if (name == "getGravity" or name == "getg") then
        if (noParam) then
            call Text_P(escaper.getPlayer(), "current gravity is " + R2S(GetRealGravity()))
        endif
        return true
    endif
    
    
//-setHeight
    if (name == "setHeight" or name == "seth") then
        if (nbParam != 1 or (S2R(param1) <= 0 and param1 != "0")) then
            return true
        endif
        call SetUnitFlyHeight(escaper.getHero(), S2R(param1), 0)
        return true
    endif

    
//-setTailleUnite
    if (name == "setTailleUnit" or name == "settu") then
        if (nbParam != 1 or (S2R(param1) <= 0 and param1 != "0")) then
            return true
        endif
        set TAILLE_UNITE = S2R(param1)
        return true
    endif


    return false
endfunction




endlibrary
