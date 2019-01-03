//TESH.scrollpos=0
//TESH.alwaysfold=0
library EscaperSavedCommands initializer Init_EscaperSavedCommands needs CommandExecution


globals
    EscaperSavedCommands udg_savedCommands
endglobals


struct EscaperSavedCommands
    private hashtable savedCommands
    
    
    static method create takes nothing returns EscaperSavedCommands
        local EscaperSavedCommands sc = EscaperSavedCommands.allocate()
        set sc.savedCommands = InitHashtable()
        return sc
    endmethod
    
    method new takes Escaper escaper, string commandName, string command returns nothing
        call SaveStr(.savedCommands, escaper, StringHash(commandName), command)
    endmethod
    
    method execute takes Escaper escaper, string commandName returns boolean
        local string cmd = LoadStr(.savedCommands, escaper, StringHash(commandName))
        if (cmd == null) then
            return false
        else
            call ExecuteCommand(escaper, cmd)
        endif
        return true
    endmethod
endstruct


function Init_EscaperSavedCommands takes nothing returns nothing
    set udg_savedCommands = EscaperSavedCommands.create()
endfunction


endlibrary