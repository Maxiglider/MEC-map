//TESH.scrollpos=0
//TESH.alwaysfold=0
library CommandsFunctions needs Escaper, MonstersClickableSetLife




//gives the name of the entered command  ////the name of the entered command is <command_name>
function CmdName takes string str returns string
  local integer length = StringLength(str)
  local string outputStr = "" 
  local string car
  local integer i = 0

  if (SubString(str, 0, 1) == "-" and length > 1) then
    set car = SubString(str, 1, 2)
    set i = 1   
    loop
      exitwhen (i >= length or car == " ")
      set outputStr = outputStr + car
      set i = i + 1
      set car = SubString(str, i, i + 1)
    endloop
  endif
  if (StringLength(outputStr) >= 1) then
    return outputStr
  endif
  return null
endfunction 

function IsCmd takes string str returns boolean
    return CmdName(str) != null 
endfunction


//gives the parameter number 'paramNumber' of the entered command : <paramX>
function CmdParam takes string str, integer paramNumber returns string
  local integer length = StringLength(str)
  local integer nameLength = StringLength(CmdName(str))
  local string outputStr = null
  local string char
  local integer i = 0
  local integer currentParamNumber = 1
  local integer lastSpaceFound_pos = nameLength + 2   
  
  if (not IsCmd(str)) then 
     return null
  endif     
  
  set i = lastSpaceFound_pos + 1
  
  if (paramNumber == 0) then
    return SubStringBJ(str, i, length)
  endif
     
  loop
  exitwhen (currentParamNumber == paramNumber or i > length)
	set char = SubStringBJ(str, i, i) 
	if ((char == " ") and (i - 1 == lastSpaceFound_pos)) then
	    return null
    endif
	if (char == " ") then
	  set lastSpaceFound_pos = i
	  set currentParamNumber = currentParamNumber + 1
	endif
	set i = i + 1
  endloop	
  
  if (currentParamNumber == paramNumber) then
    loop
    exitwhen (i > length)
      set char = SubStringBJ(str, i, i)
      exitwhen (char == " ")
      set outputStr = outputStr + char
      set i = i + 1
    endloop
    return outputStr
  endif
  return null
endfunction


function NbParam takes string str returns integer
    local integer i = 1
    loop
        exitwhen (CmdParam(str, i) == null)
        set i = i + 1
    endloop
    return i-1
endfunction


function NoParam takes string str returns boolean
    return CmdParam(str, 0) == null
endfunction



function IsColorString takes string colorString returns boolean
    return (ColorString2Id(colorString) >= 0)
endfunction

function IsPlayerColorString takes string colorString returns boolean
    return (ColorString2Id(colorString) >= 0 and ColorString2Id(colorString) <= NB_PLAYERS_MAX)
endfunction




endlibrary