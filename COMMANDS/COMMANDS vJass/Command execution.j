//TESH.scrollpos=70
//TESH.alwaysfold=0
library CommandExecution initializer Init_Command_execution needs CommandAll, CommandRed, CommandCheat, CommandMake, CommandMax, CommandTrueMax




function ExecuteCommandSingle takes Escaper escaper, string cmd returns nothing
    if (not ExecuteCommandAll(escaper, cmd)) then
        if (not((escaper.getPlayer() == Player(0) and udg_areRedRightsOn) or escaper.canCheat())) then
            call Text_erP(escaper.getPlayer(), "unknown command or not enough rights")
            return
        endif
        if (not ExecuteCommandRed(escaper, cmd)) then
            if (not escaper.canCheat()) then
                call Text_erP(escaper.getPlayer(), "unknown command or not enough rights")
                return
            endif
            if (not ExecuteCommandCheat(escaper, cmd)) then
                if (not ExecuteCommandMake(escaper, cmd)) then
                    if (not escaper.isMaximaxou()) then
                        call Text_erP(escaper.getPlayer(), "unknown command or not enough rights")
                        return
                    endif
                    if (not ExecuteCommandMax(escaper, cmd)) then
                        if (not escaper.isTrueMaximaxou()) then
                            call Text_erP(escaper.getPlayer(), "unknown command or not enough rights")
                            return
                        endif
                        if (not ExecuteCommandTrueMax(escaper, cmd)) then
                            call Text_erP(escaper.getPlayer(), "unknown command")
                        endif
                    endif
                endif
            endif
        endif
    endif
endfunction


function ExecuteCommand takes Escaper escaper, string cmd returns nothing
    local string array singleCommands
    local string char
    local integer i
    local integer nbParenthesesNonFermees = 0
    local integer singleCommandId = 0
    local integer charId
    
    //ex : "-(abc def)" --> "-abc def"
    if (SubStringBJ(cmd, 2, 2) == "(" and SubStringBJ(cmd, StringLength(cmd), StringLength(cmd)) == ")") then
        set cmd = SubStringBJ(cmd, 1, 1) + SubStringBJ(cmd, 3, StringLength(cmd) - 1)
    endif

    set charId = 2
    loop
        exitwhen (charId > StringLength(cmd))
            set char = SubStringBJ(cmd, charId, charId)
            if (char == ",") then
                if (nbParenthesesNonFermees <= 0) then
                    set singleCommandId = singleCommandId + 1
                    set charId = charId + 1 //on saute un caractère pour ne pas prendre en compte l'espace après la virgule
                endif
            else
                if (char == "(") then
                    set nbParenthesesNonFermees = nbParenthesesNonFermees + 1
                else
                    if (char == ")") then
                        set nbParenthesesNonFermees = nbParenthesesNonFermees - 1
                    endif
                endif
            endif
            if (char != "," or nbParenthesesNonFermees > 0) then
                set singleCommands[singleCommandId] = singleCommands[singleCommandId] + char
            endif
        set charId = charId + 1
    endloop
    set i = 0
    loop
        exitwhen (i > singleCommandId)
            if (singleCommands[i] != null and singleCommands[i] != "") then
                call ExecuteCommandSingle(escaper, "-" + singleCommands[i])
            endif
        set i = i + 1
    endloop
endfunction


function Trig_Command_execution_Actions takes nothing returns nothing
    if (not IsCmd(GetEventPlayerChatString())) then
        return
    endif
    call ExecuteCommand(udg_escapers.get(GetPlayerId(GetTriggerPlayer())), GetEventPlayerChatString())
endfunction



//===========================================================================
function Init_Command_execution takes nothing returns nothing
    set gg_trg_Command_execution = CreateTrigger()
    call TriggerAddAction(gg_trg_Command_execution, function Trig_Command_execution_Actions)
    call TriggerRegisterPlayerChatEvent( gg_trg_Command_execution, Player(0), "-", false )
    call TriggerRegisterPlayerChatEvent( gg_trg_Command_execution, Player(1), "-", false )
    call TriggerRegisterPlayerChatEvent( gg_trg_Command_execution, Player(2), "-", false )
    call TriggerRegisterPlayerChatEvent( gg_trg_Command_execution, Player(3), "-", false )
    call TriggerRegisterPlayerChatEvent( gg_trg_Command_execution, Player(4), "-", false )
    call TriggerRegisterPlayerChatEvent( gg_trg_Command_execution, Player(5), "-", false )
    call TriggerRegisterPlayerChatEvent( gg_trg_Command_execution, Player(6), "-", false )
    call TriggerRegisterPlayerChatEvent( gg_trg_Command_execution, Player(7), "-", false )
    call TriggerRegisterPlayerChatEvent( gg_trg_Command_execution, Player(8), "-", false )
    call TriggerRegisterPlayerChatEvent( gg_trg_Command_execution, Player(9), "-", false )
    call TriggerRegisterPlayerChatEvent( gg_trg_Command_execution, Player(10),"-", false )
    call TriggerRegisterPlayerChatEvent( gg_trg_Command_execution, Player(11),"-", false )
endfunction



endlibrary

