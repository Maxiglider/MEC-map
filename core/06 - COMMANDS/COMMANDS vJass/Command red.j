//TESH.scrollpos=57
//TESH.alwaysfold=0
library CommandRed needs CommandsFunctions




function ExecuteCommandRed takes Escaper escaper, string cmd returns boolean
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
    
    
    
    
//-kill(kl) <Pcolor>   --> kills a hero
	if (name == "kill" or name == "kl") then
		if (nbParam != 1) then
			return true
		endif
		if (escaper.isTrueMaximaxou()) then
			if (IsPlayerColorString(param1)) then
                if (udg_escapers.get(ColorString2Id(param1)) != 0) then
                    call udg_escapers.get(ColorString2Id(param1)).kill()
                endif
				return true
			endif
			if (param1 == "all" or param1 == "a") then
				set i = 0
				loop
					exitwhen (i >= NB_ESCAPERS)
						if (udg_escapers.get(i) != escaper and udg_escapers.get(i) != 0) then
                            call udg_escapers.get(i).kill()
						endif
					set i = i+1
				endloop
			endif
			return true
		endif
        if (IsPlayerColorString(param1) and not udg_escapers.get(ColorString2Id(param1)).canCheat()) then
            if (udg_escapers.get(ColorString2Id(param1)) != 0) then
                call udg_escapers.get(ColorString2Id(param1)).kill()
            endif
        endif
		return true
	endif
	
	
//-kick(kc) <Pcolor>   --> kicks a player
	if (name == "kick" or name == "kc") then
		if (nbParam != 1) then
			return true
		endif
		if (escaper.isTrueMaximaxou()) then
			if (IsPlayerColorString(param1)) then
                if (udg_escapers.get(ColorString2Id(param1)) != 0) then
                    call escaper.kick(udg_escapers.get(ColorString2Id(param1)))
                endif
				return true
			endif
			if (param1 == "all" or param1 == "a") then
				set i = 0
				loop
					exitwhen (i >= NB_ESCAPERS)
						if (udg_escapers.get(i) != escaper and udg_escapers.get(i) != 0) then
                            call escaper.kick(udg_escapers.get(i))
						endif
					set i = i+1
				endloop
			endif
			return true
		endif
        if (IsPlayerColorString(param1) and not udg_escapers.get(ColorString2Id(param1)).canCheat()) then
            if (udg_escapers.get(ColorString2Id(param1)) != 0) then
                call escaper.kick(udg_escapers.get(ColorString2Id(param1)))
            endif
        endif
		return true
	endif
    
    
//-restart(-)
    if (name == "restart") then
        if (noParam) then
            call udg_levels.restartTheGame()
        endif
        return true
    endif
    


    return false
endfunction





endlibrary
