//TESH.scrollpos=19
//TESH.alwaysfold=0
library CommandTrueMax needs CommandsFunctions




function ExecuteCommandTrueMax takes Escaper escaper, string cmd returns boolean
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
    
    
    

//-beAdmin <Pcolor>|all(a) [<boolean status>]
	if (name == "beAdmin") then
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
						call udg_escapers.get(i).setIsMaximaxou(b)
					endif
				set i = i + 1
			endloop
            if (b) then
                call Text_P(escaper.getPlayer(), "all players have now admin rights")
            else
                call Text_P(escaper.getPlayer(), "you are now the only one to have admin rights")
            endif
			return true
		endif
		if (IsPlayerColorString(param1)) then
            set n = ColorString2Id(param1)
            if (udg_escapers.get(n) != 0) then
                if (udg_escapers.get(n) != escaper) then
                    call udg_escapers.get(n).setIsMaximaxou(b)
                    if (b) then
                        call Text_P(escaper.getPlayer(), "player " + param1 + " has now admin rights")
                    else
                        call Text_P(escaper.getPlayer(), "player " + param1 + " no longer has admin rights")
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



    return false
endfunction





endlibrary
