//TESH.scrollpos=24
//TESH.alwaysfold=0
library MessageHeroDies needs Text


globals
    private constant real MESSAGE_DURATION = 10
    private constant real TIME_BETWEEN_DEATH_AND_MESSAGE = 5
    private timer timerSonJoue = CreateTimer()
    private boolean isSoundPlaying = false
    private real DUREE_SON = 3
endglobals


private function GetRandomSoundHeroDies takes nothing returns sound
    local integer n = GetRandomInt(0, 3)
    if (n == 0) then
        return gg_snd_heroDies0
    elseif (n == 1) then
        return gg_snd_heroDies1
    elseif (n == 2) then
        return gg_snd_heroDies2
    else
        return gg_snd_heroDies3
    endif
endfunction


private function GetRandomSoundAllyHeroDies takes nothing returns sound
    local integer n = GetRandomInt(0, 3)
    if (n == 0) then
        return gg_snd_allyHeroDies0
    elseif (n == 1) then
        return gg_snd_allyHeroDies1
    elseif (n == 2) then
        return gg_snd_allyHeroDies2
    else
        return gg_snd_allyHeroDies3
    endif
endfunction


private function SoundEnd takes nothing returns nothing
    set isSoundPlaying = false
endfunction 


private function PlaySoundHeroDies takes player fallenPlayer  returns nothing
    if (not isSoundPlaying) then
        if (GetLocalPlayer() == fallenPlayer) then
            call StartSound(GetRandomSoundHeroDies())
        else
            call StartSound(GetRandomSoundAllyHeroDies())
        endif
        set isSoundPlaying = true
        call TimerStart(timerSonJoue, DUREE_SON, false, function SoundEnd)
    endif
endfunction



//! textmacro DisplayDeathMessagePlayer_function takes n
private function DisplayDeathMessagePlayer_$n$ takes nothing returns nothing
    call PlaySoundHeroDies(Player($n$))
    call Text_A_timed(MESSAGE_DURATION, udg_colorCode[$n$] + GetPlayerName(Player($n$)) + "|r has fallen.")
    call DestroyTimer(GetExpiredTimer())
endfunction
//! endtextmacro

//! runtextmacro DisplayDeathMessagePlayer_function("0")
//! runtextmacro DisplayDeathMessagePlayer_function("1")
//! runtextmacro DisplayDeathMessagePlayer_function("2")
//! runtextmacro DisplayDeathMessagePlayer_function("3")
//! runtextmacro DisplayDeathMessagePlayer_function("4")
//! runtextmacro DisplayDeathMessagePlayer_function("5")
//! runtextmacro DisplayDeathMessagePlayer_function("6")
//! runtextmacro DisplayDeathMessagePlayer_function("7")
//! runtextmacro DisplayDeathMessagePlayer_function("8")
//! runtextmacro DisplayDeathMessagePlayer_function("9")
//! runtextmacro DisplayDeathMessagePlayer_function("10")
//! runtextmacro DisplayDeathMessagePlayer_function("11")


function DisplayDeathMessagePlayer takes player p returns nothing
    local integer n = GetPlayerId(p)
    //! textmacro RunDisplayDeathMessagePlayer takes n
    if (n == $n$) then
        call TimerStart(CreateTimer(), TIME_BETWEEN_DEATH_AND_MESSAGE, false, function DisplayDeathMessagePlayer_$n$)
    endif
    //! endtextmacro
    
    //! runtextmacro RunDisplayDeathMessagePlayer("0")
    //! runtextmacro RunDisplayDeathMessagePlayer("1")
    //! runtextmacro RunDisplayDeathMessagePlayer("2")
    //! runtextmacro RunDisplayDeathMessagePlayer("3")
    //! runtextmacro RunDisplayDeathMessagePlayer("4")
    //! runtextmacro RunDisplayDeathMessagePlayer("5")
    //! runtextmacro RunDisplayDeathMessagePlayer("6")
    //! runtextmacro RunDisplayDeathMessagePlayer("7")
    //! runtextmacro RunDisplayDeathMessagePlayer("8")
    //! runtextmacro RunDisplayDeathMessagePlayer("9")
    //! runtextmacro RunDisplayDeathMessagePlayer("10")
    //! runtextmacro RunDisplayDeathMessagePlayer("11")
endfunction
    


endlibrary