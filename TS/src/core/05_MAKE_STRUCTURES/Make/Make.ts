import { BasicFunctions } from 'core/01_libraries/Basic_functions'
import { EscaperFunctions } from 'core/04_STRUCTURES/Escaper/Escaper_functions'
const { Hero2Escaper } = EscaperFunctions
const { IsIssuedOrder, StopUnit } = BasicFunctions

export const MakeConsts: {
    MAKE_LAST_CLIC_UNIT_ID: number
    MAKE_CANT_CANCEL_MORE: string
    MAKE_CANT_REDO_MORE: string
} = {
    MAKE_LAST_CLIC_UNIT_ID: FourCC('e001'), //à remplacer par l'id de l'unité choisie (need couleur variable)
    MAKE_CANT_CANCEL_MORE: 'Nothing else to cancel !',
    MAKE_CANT_REDO_MORE: 'Nothing else to redo !',
}

export abstract class Make {
    makerOwner: player
    kind: string //monsterMaking, monsterDeleting...
    t: trigger | null
    maker: unit
    escaper: Escaper
    orderX: number = 0
    orderY: number = 0

    constructor(maker: unit, kind: string) {
        this.maker = maker
        this.makerOwner = GetOwningPlayer(maker)
        this.kind = kind
        this.escaper = Hero2Escaper(maker)

        this.t = null
        this.enableTrigger()
    }

    destroy() {
        if (this.t) {
            DestroyTrigger(this.t)
        }
    }

    doBaseActions() {
        if (!BasicFunctions.IsIssuedOrder('smart')) {
            return false
        }

        this.orderX = GetOrderPointX()
        this.orderY = GetOrderPointY()

        BasicFunctions.StopUnit(this.maker)
        return true
    }

    abstract doActions(): void

    enableTrigger() {
        if (this.t) DestroyTrigger(this.t)
        this.t = CreateTrigger()
        TriggerAddAction(this.t, this.doActions)
        TriggerRegisterUnitEvent(this.t, this.maker, EVENT_UNIT_ISSUED_POINT_ORDER)
    }

    cancelLastAction() {
        return false
    }

    redoLastAction() {
        return false
    }
}

/* todomax make that not needed
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
    elseif (kind == "doNothing") then
        return function StopTriggerUnit
    endif
    return null
endfunction
*/
