//TESH.scrollpos=0
//TESH.alwaysfold=0
globals

    constant string RedCommands = "-kill <Pcolor>
alias -kl, kills a hero
examples : -kill be,  -kl teal

-kick <Pcolor>
alias -kc, kicks a player
examples : -kick be,  -kc teal

-restart
just restart the game like when lose"


    
//==================================================================================================================   
    constant string RedCommandsRequirement1 = "If a player is afk, no more need to kill him (autokill if needed)."
    constant string RedCommandsRequirement2 = "If a player is really boring, still need to kick him."
    constant string RedCommandsRequirement3 = "kl, kc, restart"
    
endglobals
















//===========================================================================
function InitTrig_Red_commands takes nothing returns nothing
endfunction

