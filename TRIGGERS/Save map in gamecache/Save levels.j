//TESH.scrollpos=129
//TESH.alwaysfold=0
library SaveLevels initializer InitStartSaveNextLevel needs Text

globals
    private integer levelId
    private Level level
    private integer visibilityId
    private integer monsterNoMoveId
    private integer monsterSimplePatrolId
    private integer monsterMultiplePatrolsId
    private integer monsterTeleportId
    private integer meteorId
    private integer monsterSpawnId
    private integer casterId
    private constant integer NB_ITEM_TO_SAVE_EACH_TIME = 10
    private trigger trg_startSaveNextLevel
endglobals




//casters
private function SaveCasters_Actions takes nothing returns nothing
    local integer i = 0
    loop
        exitwhen (i >= NB_ITEM_TO_SAVE_EACH_TIME)
            if (casterId > level.casters.getLastInstanceId()) then
                call stringArrayForCache.writeInCache()
                call DisableTrigger(GetTriggeringTrigger())
                call TriggerExecute(trg_startSaveNextLevel)
                return
            endif
            if (level.casters.get(casterId) != 0) then
                call stringArrayForCache.push(level.casters.get(casterId).toString())
            endif
            set casterId = casterId + 1
        set i = i + 1
    endloop
endfunction

private function StartSaveCasters takes nothing returns nothing
    if (level.casters.count() == 0) then
        call TriggerExecute(trg_startSaveNextLevel)
    else
        set stringArrayForCache = StringArrayForCache.create("level" + I2S(levelId), "casters", true)
        call TriggerClearActions(trigSaveMapInCache)
        call TriggerAddAction(trigSaveMapInCache, function SaveCasters_Actions)
        call EnableTrigger(trigSaveMapInCache)
        set casterId = 0
    endif
endfunction
///////////////////////////


//monsterSpawns
private function SaveMonsterSpawns_Actions takes nothing returns nothing
    local integer i = 0
    loop
        exitwhen (i >= NB_ITEM_TO_SAVE_EACH_TIME)
            if (monsterSpawnId > level.monsterSpawns.getLastInstanceId()) then
                call stringArrayForCache.writeInCache()
                call DisableTrigger(GetTriggeringTrigger())
                call StartSaveCasters()
                return
            endif
            if (level.monsterSpawns.get(monsterSpawnId) != 0) then
                call stringArrayForCache.push(level.monsterSpawns.get(monsterSpawnId).toString())
            endif
            set monsterSpawnId = monsterSpawnId + 1
        set i = i + 1
    endloop
endfunction

private function StartSaveMonsterSpawns takes nothing returns nothing
    if (level.monsterSpawns.count() == 0) then
        call StartSaveCasters()
    else
        set stringArrayForCache = StringArrayForCache.create("level" + I2S(levelId), "monsterSpawns", true)
        call TriggerClearActions(trigSaveMapInCache)
        call TriggerAddAction(trigSaveMapInCache, function SaveMonsterSpawns_Actions)
        call EnableTrigger(trigSaveMapInCache)
        set monsterSpawnId = 0
    endif
endfunction
///////////////////////////

//meteors
private function SaveMeteors_Actions takes nothing returns nothing
    local integer i = 0
    loop
        exitwhen (i >= NB_ITEM_TO_SAVE_EACH_TIME)
            if (meteorId > level.meteors.getLastInstanceId()) then
                call stringArrayForCache.writeInCache()
                call DisableTrigger(GetTriggeringTrigger())
                call StartSaveMonsterSpawns()
                return
            endif
            if (level.meteors.get(meteorId) != 0) then
                call stringArrayForCache.push(level.meteors.get(meteorId).toString())
            endif
            set meteorId = meteorId + 1
        set i = i + 1
    endloop
endfunction

private function StartSaveMeteors takes nothing returns nothing
    if (level.meteors.count() == 0) then
        call StartSaveMonsterSpawns()
    else
        set stringArrayForCache = StringArrayForCache.create("level" + I2S(levelId), "meteors", true)
        call TriggerClearActions(trigSaveMapInCache)
        call TriggerAddAction(trigSaveMapInCache, function SaveMeteors_Actions)
        call EnableTrigger(trigSaveMapInCache)
        set meteorId = 0
    endif
endfunction
///////////////////////////

//monsters teleport
private function SaveMonstersTeleport_Actions takes nothing returns nothing
    local integer i = 0
    loop
        exitwhen (i >= NB_ITEM_TO_SAVE_EACH_TIME)
            if (monsterTeleportId > level.monstersTeleport.getLastInstanceId()) then
                call stringArrayForCache.writeInCache()
                call DisableTrigger(GetTriggeringTrigger())
                call StartSaveMeteors()
                return
            endif
            if (level.monstersTeleport.get(monsterTeleportId) != 0) then
                call stringArrayForCache.push(level.monstersTeleport.get(monsterTeleportId).toString())
            endif
            set monsterTeleportId = monsterTeleportId + 1
        set i = i + 1
    endloop
endfunction

private function StartSaveMonstersTeleport takes nothing returns nothing
    if (level.monstersTeleport.count() == 0) then
        call StartSaveMeteors()
    else
        set stringArrayForCache = StringArrayForCache.create("level" + I2S(levelId), "monstersTeleport", true)
        call TriggerClearActions(trigSaveMapInCache)
        call TriggerAddAction(trigSaveMapInCache, function SaveMonstersTeleport_Actions)
        call EnableTrigger(trigSaveMapInCache)
        set monsterTeleportId = 0
    endif
endfunction
///////////////////////////

//monsters multiple patrols
private function SaveMonstersMultiplePatrols_Actions takes nothing returns nothing
    local integer i = 0
    loop
        exitwhen (i >= NB_ITEM_TO_SAVE_EACH_TIME)
            if (monsterMultiplePatrolsId > level.monstersMultiplePatrols.getLastInstanceId()) then
                call stringArrayForCache.writeInCache()
                call DisableTrigger(GetTriggeringTrigger())
                call StartSaveMonstersTeleport()
                return
            endif
            if (level.monstersMultiplePatrols.get(monsterMultiplePatrolsId) != 0) then
                call stringArrayForCache.push(level.monstersMultiplePatrols.get(monsterMultiplePatrolsId).toString())
            endif
            set monsterMultiplePatrolsId = monsterMultiplePatrolsId + 1
        set i = i + 1
    endloop
endfunction

private function StartSaveMonstersMultiplePatrols takes nothing returns nothing
    if (level.monstersMultiplePatrols.count() == 0) then
        call StartSaveMonstersTeleport()
    else
        set stringArrayForCache = StringArrayForCache.create("level" + I2S(levelId), "monstersMultiplePatrols", true)
        call TriggerClearActions(trigSaveMapInCache)
        call TriggerAddAction(trigSaveMapInCache, function SaveMonstersMultiplePatrols_Actions)
        call EnableTrigger(trigSaveMapInCache)
        set monsterMultiplePatrolsId = 0
    endif
endfunction
///////////////////////////

//monsters simple patrol
private function SaveMonstersSimplePatrol_Actions takes nothing returns nothing
    local integer i = 0
    loop
        exitwhen (i >= NB_ITEM_TO_SAVE_EACH_TIME)
            if (monsterSimplePatrolId > level.monstersSimplePatrol.getLastInstanceId()) then
                call stringArrayForCache.writeInCache()
                call DisableTrigger(GetTriggeringTrigger())
                call StartSaveMonstersMultiplePatrols()
                return
            endif
            if (level.monstersSimplePatrol.get(monsterSimplePatrolId) != 0) then
                call stringArrayForCache.push(level.monstersSimplePatrol.get(monsterSimplePatrolId).toString())
            endif
            set monsterSimplePatrolId = monsterSimplePatrolId + 1
        set i = i + 1
    endloop
endfunction

private function StartSaveMonstersSimplePatrol takes nothing returns nothing
    if (level.monstersSimplePatrol.count() == 0) then
        call StartSaveMonstersMultiplePatrols()
    else
        set stringArrayForCache = StringArrayForCache.create("level" + I2S(levelId), "monstersSimplePatrol", true)
        call TriggerClearActions(trigSaveMapInCache)
        call TriggerAddAction(trigSaveMapInCache, function SaveMonstersSimplePatrol_Actions)
        call EnableTrigger(trigSaveMapInCache)
        set monsterSimplePatrolId = 0
    endif
endfunction
///////////////////////////

//monsters no move
private function SaveMonstersNoMove_Actions takes nothing returns nothing
    local integer i = 0
    loop
        exitwhen (i >= NB_ITEM_TO_SAVE_EACH_TIME)
            if (monsterNoMoveId > level.monstersNoMove.getLastInstanceId()) then
                call stringArrayForCache.writeInCache()
                call DisableTrigger(GetTriggeringTrigger())
                call StartSaveMonstersSimplePatrol()
                return
            endif
            if (level.monstersNoMove.get(monsterNoMoveId) != 0) then
                call stringArrayForCache.push(level.monstersNoMove.get(monsterNoMoveId).toString())
            endif
            set monsterNoMoveId = monsterNoMoveId + 1
        set i = i + 1
    endloop
endfunction

private function StartSaveMonstersNoMove takes nothing returns nothing
    if (level.monstersNoMove.count() == 0) then
        call StartSaveMonstersSimplePatrol()
    else
        set stringArrayForCache = StringArrayForCache.create("level" + I2S(levelId), "monstersNoMove", true)
        call TriggerClearActions(trigSaveMapInCache)
        call TriggerAddAction(trigSaveMapInCache, function SaveMonstersNoMove_Actions)
        call EnableTrigger(trigSaveMapInCache)
        set monsterNoMoveId = 0
    endif
endfunction
///////////////////////////

//visibilities
private function SaveVisibilities_Actions takes nothing returns nothing
    local integer i = 0
    loop
        exitwhen (i >= NB_ITEM_TO_SAVE_EACH_TIME)
            if (visibilityId > level.visibilities.getLastInstanceId()) then
                call stringArrayForCache.writeInCache()
                call DisableTrigger(GetTriggeringTrigger())
                call StartSaveMonstersNoMove()
                return
            endif
            if (level.visibilities.get(visibilityId) != 0) then
                call stringArrayForCache.push(level.visibilities.get(visibilityId).toString())
            endif
            set visibilityId = visibilityId + 1
        set i = i + 1
    endloop
endfunction

private function StartSaveVisibilities takes nothing returns nothing
    if (level.visibilities.count() == 0) then
        call StartSaveMonstersNoMove()
    else
        set stringArrayForCache = StringArrayForCache.create("level" + I2S(levelId), "visibilities", true)
        call TriggerClearActions(trigSaveMapInCache)
        call TriggerAddAction(trigSaveMapInCache, function SaveVisibilities_Actions)
        call EnableTrigger(trigSaveMapInCache)
        set visibilityId = 0
    endif
endfunction
///////////////////////////




private function EndSaveLevel takes nothing returns nothing
    call Text_A("all levels saved")
    call SaveGameCache(saveMap_cache)
    call Text_A("SAVING MAP FINISHED")
endfunction

private function StartSaveLevel takes nothing returns nothing
    set level = udg_levels.get(levelId)
    if (level == 0) then
        call EndSaveLevel()
    else
        //start message
        if (level.getStartMessage() != null and level.getStartMessage() != "") then
            set stringArrayForCache = StringArrayForCache.create("level" + I2S(levelId), "startMessage", false)
            call stringArrayForCache.push(StringReplace(level.getStartMessage(), ";", ";;", true))
            call stringArrayForCache.writeInCache()
        endif
        //nb lives earned
        set stringArrayForCache = StringArrayForCache.create("level" + I2S(levelId), "nbLives", false)
        call stringArrayForCache.push(I2S(level.getNbLives()))
        call stringArrayForCache.writeInCache()
        //start
        if (level.getStart() != 0) then
            set stringArrayForCache = StringArrayForCache.create("level" + I2S(levelId), "start", false)
            call stringArrayForCache.push(level.getStart().toString())
            call stringArrayForCache.writeInCache()
        endif
        //end
        if (level.getEnd() != 0) then
            set stringArrayForCache = StringArrayForCache.create("level" + I2S(levelId), "end", false)
            call stringArrayForCache.push(level.getEnd().toString())
            call stringArrayForCache.writeInCache()
        endif
        //reste :      //visibilities  
        //monstersNoMove  //monstersSimplePatrol  //monstersMultiplePatrols  //meteors  //monsterSpawns
        call StartSaveVisibilities()        
    endif
endfunction


function StartSaveLevels takes nothing returns nothing
    local integer i = 0
    loop
        exitwhen (i > 11)
            if (udg_escapers.get(i) != 0) then
                call udg_escapers.get(i).destroyMake()
                call udg_escapers.get(i).destroyAllSavedActions()
            endif
        set i = i + 1
    endloop
    set levelId = 0
    call StartSaveLevel()
endfunction




function StartSaveNextLevel_Actions takes nothing returns nothing
    set levelId = levelId + 1
    call StartSaveLevel()
endfunction

function InitStartSaveNextLevel takes nothing returns nothing
    set trg_startSaveNextLevel = CreateTrigger()
    call TriggerAddAction(trg_startSaveNextLevel, function StartSaveNextLevel_Actions)
endfunction




endlibrary
