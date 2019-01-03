//TESH.scrollpos=0
//TESH.alwaysfold=0
library MakeAction


interface MakeAction
    boolean isActionMadeB
    Escaper owner
    method cancel takes nothing returns boolean
    method redo takes nothing returns boolean
endinterface


endlibrary