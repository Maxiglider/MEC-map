//TESH.scrollpos=16
//TESH.alwaysfold=0
library GameTime initializer Init_GameTime

globals    
    private integer hours = 0
    private integer minuts = 0
    private integer seconds = 0
    player TIME_PLAYER = Player(0)
endglobals




function Trig_time_of_game_Actions takes nothing returns nothing
    local string timeStr
    local string hourStr
    local string minStr
    local string secStr
    
    //set integers
    if (seconds >= 59) then
        set seconds = 0
        if (minuts >= 59) then
            set minuts = 0
            set hours = hours + 1
        else
            set minuts = minuts + 1
        endif
    else
        set seconds = seconds + 1
    endif
    
    
    //set strings
    set hourStr = I2S(hours)
    
    if (minuts < 10) then
        set minStr = "0" + I2S(minuts)
    else
        set minStr = I2S(minuts)
    endif
    
    if (seconds < 10) then
        set secStr = "0" + I2S(seconds)
    else
        set secStr = I2S(seconds)
    endif
    
    set timeStr = "|Cfffed312 Game time :  " + hourStr + " h  " + minStr + " min  " + secStr + " s" 
    call LeaderboardSetPlayerItemLabelBJ(TIME_PLAYER, udg_lives.getLeaderboard(), timeStr)
endfunction



//===========================================================================
function Init_GameTime takes nothing returns nothing
    set gg_trg_Time_of_game_trigger = CreateTrigger(  )
    call TriggerAddAction( gg_trg_Time_of_game_trigger, function Trig_time_of_game_Actions )
    call TriggerRegisterTimerEvent( gg_trg_Time_of_game_trigger, 1., true)
endfunction


endlibrary
