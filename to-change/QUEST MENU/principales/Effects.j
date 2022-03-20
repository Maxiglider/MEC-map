//TESH.scrollpos=0
//TESH.alwaysfold=0
globals

    constant string Effects = "The effects are :
light or l
fire or f
ice or i
corruption or c
poison or p
slow or s

-effect <effect>
alias -ef, puts an effect on each hand of your hero

-customEffect <effect> <bodyPart>
alias -ce, puts an effect on the specified bodyPart
The body parts are :
leftHand or lh
rightHand or rh
leftFoot or lf
rightFoot or rf
overhead or oh
head or h
origin or o
chest or c

-effectsEverywhere <effect>
alias -efe, puts the same effect to each body part of your hero

-deleteEffects [<numberOfEffectsToRemove n>]
alias -de, deletes the n last effects of your hero, all effects if no parameter specified"
    

//==================================================================================================================   
    constant string EffectsRequirement1 = "Here are all commands to add effects on your character."
    constant string EffectsRequirement2 = ""
    constant string EffectsRequirement3 = "ef, ce, efe, de"
    
endglobals
















//===========================================================================
function InitTrig_Effects takes nothing returns nothing
endfunction

