//TESH.scrollpos=0
//TESH.alwaysfold=0
function Trig_a_player_leaves_Actions takes nothing returns nothing
    local integer n = GetPlayerId(GetTriggerPlayer())
    call udg_escapers.remove(n)
    call StopAfk(n)
    call DisplayTextToForce(GetPlayersAll(), udg_colorCode[n] + "This is too difficult for " + GetPlayerName(GetTriggerPlayer()) + ", (s)he has left the game." )
    call StartSound(gg_snd_noob)
    //set NbPlayersMinimumThree_nbPlayers = NbPlayersMinimumThree_nbPlayers - 1
endfunction



//===========================================================================
function InitTrig_A_player_leaves takes nothing returns nothing
    local integer i = 0
    set gg_trg_A_player_leaves = CreateTrigger()
    loop
        exitwhen i > 11
        call TriggerRegisterPlayerEventLeave(gg_trg_A_player_leaves, Player(i))
        set i = i + 1
    endloop       
    call TriggerAddAction( gg_trg_A_player_leaves, function Trig_a_player_leaves_Actions )
endfunction

