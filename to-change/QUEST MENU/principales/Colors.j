//TESH.scrollpos=0
//TESH.alwaysfold=0
globals

    constant string Colors = "The colors are :
red or rd, blue or be
teal or tl, purple or pe
yellow or yw, orange or oe
green or gn, pink or pk
grey or gray or gy, lightblue or lb
darkgreen or dg, brown or bn
black or bk

-<color>
change the base color of your character

-vertexColor [ <red> <green> <blue> [<transparency>] ]
alias -vc, change the vertex color of you character.
The result color depends on the basic color of your character.
The parameters are integer percentage or x to take a random percentage.
Without parameter, it will do like -vc x x x.

You can also specify onnly the red part of the vertex color :
-vertexColorRed [<red>], alias -vcr
Same for green, blue and transparency (vcg, vcb, vct)

-noVertex
alias -nv, cancel the vertex color of your character
it's like -vc 100 100 100

-colorInfo [<Pcolor>]
alias -ci, display info about the color of your character, or of an other player's character"
    
//==================================================================================================================    
    constant string ColorsRequirement1 = "Here are all commands to change the color of your character."
    constant string ColorsRequirement2 = ""
    constant string ColorsRequirement3 = "rd, be, tl, pe, yw, oe, gn, pk, gy, lb, dg, bn, bk, vc, vcr, vcg, vcb, vct, nv, ci"
    
endglobals
















//===========================================================================
function InitTrig_Colors takes nothing returns nothing
endfunction

