//TESH.scrollpos=0
//TESH.alwaysfold=0
library EscaperEffectFunctions needs SlideTrigger, CheckTerrainTrigger, LevelFunctions


function String2BodyPartStr takes string S returns string 
    if (S == "leftHand" or S == "lh") then
        return "hand left"
    endif
    if (S == "rightHand" or S == "rh") then
        return "hand right"
    endif
    if (S == "leftFoot" or S == "lf") then
        return "foot left"
    endif
    if (S == "rightFoot" or S == "rf") then
        return "foot right"
    endif
    if (S == "overhead" or S == "oh") then
        return "overhead"
    endif
    if (S == "head" or S == "h") then
        return "head"
    endif
    if (S == "origin" or S == "o") then
        return "origin"
    endif
    if (S == "chest" or S == "c") then
        return "chest"
    endif
    return null
endfunction


function IsBodyPartStr takes string s returns boolean
    return String2BodyPartStr(s) != null
endfunction


function String2EffectStr takes string str returns string
    if (str == "light" or str == "l") then
        return "Abilities\\Weapons\\FarseerMissile\\FarseerMissile.mdl"
    endif
    if (str == "fire" or str == "f") then
        return "Abilities\\Spells\\Items\\AIfb\\AIfbTarget.mdl"
    endif
    if (str == "ice" or str == "i") then
        return "Abilities\\Spells\\Items\\AIob\\AIobTarget.mdl"
    endif
    if (str == "corruption" or str == "c") then
        return "Abilities\\Spells\\Items\\OrbCorruption\\OrbCorruption.mdl"
    endif
    if (str == "poison" or str == "p") then
        return "Abilities\\Spells\\Items\\OrbVenom\\OrbVenom.mdl"
    endif
    if (str == "slow" or str == "s") then
        return "Abilities\\Spells\\Items\\OrbSlow\\OrbSlow.mdl"
    endif
    return null
endfunction


function IsEffectStr takes string str returns boolean
    return String2EffectStr(str) != null
endfunction



endlibrary
