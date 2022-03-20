//TESH.scrollpos=0
//TESH.alwaysfold=0
library SaveMonsterTypes needs Text, SaveCasterTypes



function StartSaveMonsterTypes takes nothing returns nothing
    call udg_monsterTypes.saveInCache()
    call Text_A("monster types saved")
    call StartSaveCasterTypes()
endfunction



endlibrary