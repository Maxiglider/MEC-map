//TESH.scrollpos=57
//TESH.alwaysfold=0
library Text



globals
    private constant string NORMAL_TEXT_COLORCODE = "|c00ffffff" //blanc
    private constant string MAKE_TEXT_COLORCODE = "|c00ffff00" //jaune
    private constant string ERROR_TEXT_COLORCODE = "|c00960000" //sorte de rouge foncé
    
    public boolean enabled = true
    public real posX = 0
    public real posY = 0.4
endglobals


private function ForPlayer_timed_withColorCode takes player p, real duration, string colorcode, string message returns boolean
    if (not enabled) then
        return false
    endif
    if (duration >= 0.) then
        call DisplayTimedTextToPlayer(p, posX, posY, duration, colorcode + message)
    else
        call DisplayTextToPlayer(p, posX, posY, colorcode + message)
    endif
    
    return true
endfunction
    
private function ForAll_timed_withColorCode takes real duration, string colorcode, string message returns boolean
    local integer i 
    if (not enabled) then
        return false
    endif
    set i = 0
    loop
        exitwhen (i > 11)
            call ForPlayer_timed_withColorCode(Player(i), duration, colorcode, message)
        set i = i + 1
    endloop
    
    return true
endfunction


public function P_timed takes player p, real duration, string message returns boolean
    return ForPlayer_timed_withColorCode(p, duration, NORMAL_TEXT_COLORCODE, message)
endfunction

public function P takes player p, string message returns boolean
    return ForPlayer_timed_withColorCode(p, -1., NORMAL_TEXT_COLORCODE, message)
endfunction

public function erP_timed takes player p, real duration, string message returns boolean
    return ForPlayer_timed_withColorCode(p, duration, ERROR_TEXT_COLORCODE, message)
endfunction

public function erP takes player p, string message returns boolean
    return ForPlayer_timed_withColorCode(p, -1., ERROR_TEXT_COLORCODE, message)
endfunction

public function mkP_timed takes player p, real duration, string message returns boolean
    return ForPlayer_timed_withColorCode(p, duration, MAKE_TEXT_COLORCODE, message)
endfunction

public function mkP takes player p, string message returns boolean
    return ForPlayer_timed_withColorCode(p, -1., MAKE_TEXT_COLORCODE, message)
endfunction


public function A_timed takes real duration, string message returns boolean
    return ForAll_timed_withColorCode(duration, NORMAL_TEXT_COLORCODE, message)
endfunction

public function A takes string message returns boolean
    return ForAll_timed_withColorCode(-1., NORMAL_TEXT_COLORCODE, message)
endfunction

public function erA_timed takes real duration, string message returns boolean
    return ForAll_timed_withColorCode(duration, ERROR_TEXT_COLORCODE, message)
endfunction

public function erA takes string message returns boolean
    return ForAll_timed_withColorCode(-1., ERROR_TEXT_COLORCODE, message)
endfunction

public function mkA_timed takes real duration, string message returns boolean
    return ForAll_timed_withColorCode(duration, MAKE_TEXT_COLORCODE, message)
endfunction

public function mkA takes string message returns boolean
    return ForAll_timed_withColorCode(-1., MAKE_TEXT_COLORCODE, message)
endfunction




function DisplayLineToPlayer takes player p returns nothing
    call Text_P(p, " ")
endfunction



endlibrary
