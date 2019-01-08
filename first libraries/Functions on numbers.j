//TESH.scrollpos=10
//TESH.alwaysfold=0
library FunctionsOnNumbers



function EstChiffre takes string str returns boolean
    if (str == "0" or str == "1" or str == "2" or str == "3" or str == "4") then
        return true
    endif
    if (str == "5" or str == "6" or str == "7" or str == "8" or str == "9") then
        return true
    endif
    return false
endfunction

function IsInteger takes string str returns boolean
    local integer length = StringLength(str)
    local integer i
    
    if (SubString(str, 0, 1) == "-") then
        set i = 1
    else
        set i = 0
    endif
    
    loop
        exitwhen (i >= length)
            if (not EstChiffre(SubString(str, i, i+1))) then
                return false
            endif
        set i = i + 1
    endloop
    
    return true
endfunction

function IsPositiveInteger takes string str returns boolean
    return (SubString(str, 0, 1) != "-" and IsInteger(str))
endfunction    

function IsPercentage takes string str returns boolean
    local integer n = S2I(str)
    return (IsPositiveInteger(str) and n >= 0 and n <= 100)
endfunction

function PercentageStringOrX2Integer takes string str returns integer
    if (not IsPercentage(str)) then
        if (str == "x") then
            return GetRandomInt(0, 100)
        endif
        return -1
    endif
    return S2I(str)
endfunction

function I2HexaString takes integer n returns string
    if (n < 10) then
        return I2S(n)
    endif
    if (n == 10) then
        return "A"
    endif
    if (n == 11) then
        return "B"
    endif
    if (n == 12) then
        return "C"
    endif
    if (n == 13) then
        return "D"
    endif
    if (n == 14) then
        return "E"
    endif
    if (n == 15) then
        return "F"
    endif
    return "0"
endfunction


endlibrary
