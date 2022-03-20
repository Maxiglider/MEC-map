//TESH.scrollpos=0
//TESH.alwaysfold=0
globals

    constant string CommandShortcuts = "To assign a command to a key, use this command :
-assign <key> <command>
alias as
don't put the \"-\" of the command you wanna save
ex: -assign A red, -as d vc, -as e mirror on, -as R m off

To assign an other command to a already used shortcut, just type command assign again.

To disable a shortcut, use this command :
-unassign <key>
alias uas

To display your current shortcuts, use this command :
-displayShortcuts
alias -ds"


    
//==================================================================================================================    
    constant string CommandShortcutsRequirement1 = "You can now use 8 shortcuts to execute your favorite commands !"
    constant string CommandShortcutsRequirement2 = "Press A, Z, E, R, Q, S, D or F !"

endglobals







//===========================================================================
function InitTrig_Command_shortcuts takes nothing returns nothing
endfunction

