//TESH.scrollpos=0
//TESH.alwaysfold=0
library SaveCasterTypes needs Text, SaveLevels



function StartSaveCasterTypes takes nothing returns nothing
    call udg_casterTypes.saveInCache()
    call Text_A("caster types saved")
    call StartSaveLevels()
endfunction



endlibrary