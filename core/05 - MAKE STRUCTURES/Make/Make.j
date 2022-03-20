//TESH.scrollpos=0
//TESH.alwaysfold=0
library Make needs MMNoMoveActions, MMSimplePatrolActions, MMMultiplePatrolsActions, MMTeleportActions, MonsterSpawnMakingActions, MonsterDeleteActions, MakeSetUnitMonsterTypeActions, MakeSetUnitTeleportPeriodActions, MakeGetUnitTeleportPeriodActions, TerrainMakingActions, TerrainHeightMakingActions, GettingTerrainTypeInfoActions, MakeExchangeTerrainsActions, StartMakingActions, EndMakingActions, VisibilityModifierMakingActions, TerrainCopyPasteActions, TerrainVerticalSymmetryActions, TerrainHorizontalSymmetryActions, MeteorMakingActions, CasterMakingActions, MeteorDeleteActions, CasterDeleteActions, MClearMobActions, MClearMobDeleteActions

globals
	constant integer MAKE_LAST_CLIC_UNIT_ID = 'e001' //à remplacer par l'id de l'unité choisie (need couleur variable)
	constant string MAKE_CANT_CANCEL_MORE = "Nothing else to cancel !"
	constant string MAKE_CANT_REDO_MORE = "Nothing else to redo !"
endglobals


interface Make
    player makerOwner
    string kind //monsterMaking, monsterDeleting...
    trigger t
    unit maker
    method cancelLastAction takes nothing returns boolean
    method redoLastAction takes nothing returns boolean
endinterface


public function GetActions takes string kind returns code
    if (kind == "monsterCreateNoMove") then
        return function MonsterMakingNoMove_Actions
    elseif (kind == "monsterCreateSimplePatrol") then
        return function MonsterMakingSimplePatrol_Actions
    elseif (kind == "monsterCreateMultiplePatrols") then
        return function MonsterMakingMultiplePatrols_Actions
    elseif (kind == "monsterCreateTeleport") then
        return function MonsterMakingTeleport_Actions
    elseif (kind == "monsterSpawnCreate") then
        return function MonsterSpawnMaking_Actions
    elseif (kind == "deleteMonsters") then
        return function MonsterDelete_Actions   
    elseif (kind == "setUnitMonsterType") then
        return function SetUnitMonsterType_Actions
    elseif (kind == "setUnitTeleportPeriod") then
        return function SetUnitTeleportPeriod_Actions
    elseif (kind == "getUnitTeleportPeriod") then
        return function GetUnitTeleportPeriod_Actions
    elseif (kind == "meteorCreate") then
        return function MeteorMaking_Actions
    elseif (kind == "casterCreate") then
        return function CasterMaking_Actions
    elseif (kind == "deleteCasters") then
        return function CasterDelete_Actions
    elseif (kind == "createClearMob") then
        return function ClearMobMaking_Actions 
    elseif (kind == "deleteClearMob") then
        return function ClearMobDelete_Actions
    elseif (kind == "deleteMeteors") then
        return function MeteorDelete_Actions
    elseif (kind == "terrainCreate") then
        return function TerrainMaking_Actions
    elseif (kind == "terrainHeight") then
        return function TerrainHeightMaking_Actions
    elseif (kind == "terrainCopyPaste") then
        return function TerrainCopyPaste_Actions
    elseif (kind == "terrainVerticalSymmetry") then
        return function TerrainVerticalSymmetry_Actions
    elseif (kind == "terrainHorizontalSymmetry") then
        return function TerrainHorizontalSymmetry_Actions
    elseif (kind == "getTerrainType") then
        return function GettingTerrainTypeInfo_Actions
    elseif (kind == "exchangeTerrains") then
        return function MakeExchangeTerrains_Actions
    elseif (kind == "startCreate") then
        return function StartMaking_Actions
    elseif (kind == "endCreate") then
        return function EndMaking_Actions
    elseif (kind == "visibilityModifierCreate") then
        return function VisibilityModifierMaking_Actions
    endif
    return null
endfunction



endlibrary


