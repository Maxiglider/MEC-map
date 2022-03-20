//TESH.scrollpos=0
//TESH.alwaysfold=0
library AfkMode initializer Init_AfkMode needs EscaperFunctions



globals
    real timeMinAfk = 30.
    private constant real Z = -50.
    private constant real SIZE = 8.
    private constant real TRANSPARENCY = 0.
    
    boolean array isAfk
    timer array afkModeTimers
    texttag array afkModeTextTags
    timer killAllAfkTimer = CreateTimer()
endglobals


function AreAllAliveHeroesAfk takes nothing returns boolean //false if noone is dead
    local boolean someoneAlive = false
    local boolean someoneDead = false
    local integer i = 0
    loop
        exitwhen (i >= NB_ESCAPERS)
            if (udg_escapers.get(i).getHero() != null) then
                if (IsUnitAliveBJ(udg_escapers.get(i).getHero())) then
                    set someoneAlive = true
                    if (not isAfk[i]) then
                        return false
                    endif
                else
                    set someoneDead = true
                endif
            endif
        set i = i + 1
    endloop
    return someoneAlive and someoneDead
endfunction


function KillAllHeroesIfAfk takes nothing returns nothing
    local integer i = 0    
    if (AreAllAliveHeroesAfk()) then
        loop
            exitwhen (i >= NB_ESCAPERS)
                if (IsUnitAliveBJ(udg_escapers.get(i).getHero()) and isAfk[i]) then
                    call udg_escapers.get(i).kill()
                endif
            set i = i + 1
        endloop
    endif
endfunction


function KillAllHeroesAfkInFiveSeconds takes nothing returns nothing
    call TimerStart(killAllAfkTimer, 5., false, function KillAllHeroesIfAfk)
endfunction


function SetAfkMode takes integer escaperId returns nothing
	local integer playerId = escaperId2playerId(escaperId)
    if (afkModeTextTags[escaperId] != null) then
        call DestroyTextTag(afkModeTextTags[escaperId])
    endif
    set afkModeTextTags[escaperId] = CreateTextTagUnitBJ( udg_colorCode[playerId]+"AFK|r", udg_escapers.get(escaperId).getHero(), Z, SIZE, 100, 100, 100, TRANSPARENCY )
    set isAfk[escaperId] = true
endfunction


function StopAfk takes integer escaperId returns nothing
    if (isAfk[escaperId]) then
        set isAfk[escaperId] = false
        call DestroyTextTag(afkModeTextTags[escaperId])
        set afkModeTextTags[escaperId] = null
    endif
endfunction


//! textmacro AfkModeTimerExpires takes id
function AfkModeTimerExpires_$id$ takes nothing returns nothing
    call SetAfkMode($id$)
    if (AreAllAliveHeroesAfk()) then
        call KillAllHeroesAfkInFiveSeconds()
    endif
endfunction
//! endtextmacro

//! runtextmacro AfkModeTimerExpires("0")
//! runtextmacro AfkModeTimerExpires("1")
//! runtextmacro AfkModeTimerExpires("2")
//! runtextmacro AfkModeTimerExpires("3")
//! runtextmacro AfkModeTimerExpires("4")
//! runtextmacro AfkModeTimerExpires("5")
//! runtextmacro AfkModeTimerExpires("6")
//! runtextmacro AfkModeTimerExpires("7")
//! runtextmacro AfkModeTimerExpires("8")
//! runtextmacro AfkModeTimerExpires("9")
//! runtextmacro AfkModeTimerExpires("10")
//! runtextmacro AfkModeTimerExpires("11")
//! runtextmacro AfkModeTimerExpires("12")
//! runtextmacro AfkModeTimerExpires("13")
//! runtextmacro AfkModeTimerExpires("14")
//! runtextmacro AfkModeTimerExpires("15")
//! runtextmacro AfkModeTimerExpires("16")
//! runtextmacro AfkModeTimerExpires("17")
//! runtextmacro AfkModeTimerExpires("18")
//! runtextmacro AfkModeTimerExpires("19")
//! runtextmacro AfkModeTimerExpires("20")
//! runtextmacro AfkModeTimerExpires("21")
//! runtextmacro AfkModeTimerExpires("22")
//! runtextmacro AfkModeTimerExpires("23")


function GetAfkModeTimeExpiresCodeFromId takes integer id returns code
    //! textmacro GetAfkModeTimeExpiresCodeFromId takes id
    if (id == $id$) then
        return function AfkModeTimerExpires_$id$
    endif
    //! endtextmacro
    
    //! runtextmacro GetAfkModeTimeExpiresCodeFromId("0")
    //! runtextmacro GetAfkModeTimeExpiresCodeFromId("1")
    //! runtextmacro GetAfkModeTimeExpiresCodeFromId("2")
    //! runtextmacro GetAfkModeTimeExpiresCodeFromId("3")
    //! runtextmacro GetAfkModeTimeExpiresCodeFromId("4")
    //! runtextmacro GetAfkModeTimeExpiresCodeFromId("5")
    //! runtextmacro GetAfkModeTimeExpiresCodeFromId("6")
    //! runtextmacro GetAfkModeTimeExpiresCodeFromId("7")
    //! runtextmacro GetAfkModeTimeExpiresCodeFromId("8")
    //! runtextmacro GetAfkModeTimeExpiresCodeFromId("9")
    //! runtextmacro GetAfkModeTimeExpiresCodeFromId("10")
    //! runtextmacro GetAfkModeTimeExpiresCodeFromId("11")
    //! runtextmacro GetAfkModeTimeExpiresCodeFromId("12")
    //! runtextmacro GetAfkModeTimeExpiresCodeFromId("13")
    //! runtextmacro GetAfkModeTimeExpiresCodeFromId("14")
    //! runtextmacro GetAfkModeTimeExpiresCodeFromId("15")
    //! runtextmacro GetAfkModeTimeExpiresCodeFromId("16")
    //! runtextmacro GetAfkModeTimeExpiresCodeFromId("17")
    //! runtextmacro GetAfkModeTimeExpiresCodeFromId("18")
    //! runtextmacro GetAfkModeTimeExpiresCodeFromId("19")
    //! runtextmacro GetAfkModeTimeExpiresCodeFromId("20")
    //! runtextmacro GetAfkModeTimeExpiresCodeFromId("21")
    //! runtextmacro GetAfkModeTimeExpiresCodeFromId("22")
    //! runtextmacro GetAfkModeTimeExpiresCodeFromId("23")

    return null
endfunction


//===========================================================================
function Init_AfkMode takes nothing returns nothing
    local integer i = 0
    loop
        exitwhen i >= NB_ESCAPERS
            set afkModeTimers[i] = CreateTimer()
            set isAfk[i] = false
            set afkModeTextTags[i] = null
        set i = i + 1
    endloop
endfunction


endlibrary

