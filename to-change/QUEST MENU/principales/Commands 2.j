//TESH.scrollpos=0
//TESH.alwaysfold=0
globals

    constant string Commands2 = "-drunk(-) <real drunkValue>  --> value between 5 and 60
makes your hero drink alcohol

-noDrunk(-) 
stops drunk mode

-apm(-) [all|a]
displays apm on slide of everybody or just yourself

-saveCommand(sc) <commandLabel> <command>
saves a command or group of commands into a name of your choice

-executeCommand(ec) <commandLabel>
execute a command or group of commands you saved with \"saveCommand\"

-autoContinueAfterSliding(acas) <boolean status>
activated at the beginning of the game
ex: -acas off, -acas 1

-usedTerrains(ut)
displays the terrains used in this game

-getTerrainInfo(gti) [ <terrain> | <lowInteger> <upInteger> ]
gets information about terrains used in the game and all terrains of warcraft 3
terrains are numbered between 1 and 177
without parameter you'll get information about terrains you right click on (use -stop to stop this mode)

-stop(s) 
stops getTerrainInfoMode"


//===========================================================================
    constant string Commands2Requirement1 = "Here is the second part of various commands you can use in game"
    constant string Commands2Requirement2 = ""
    constant string Commands2Requirement3 = "drunk, noDrunk, apm, sc, ec, acas, ut, gti, s"

endglobals






//===========================================================================
function InitTrig_Commands_2 takes nothing returns nothing
endfunction

