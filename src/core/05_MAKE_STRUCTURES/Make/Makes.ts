import { MakePropertyChange } from './MakePropertyChange'
import { MakeTerrainHeightAction } from '../MakeLastActions/MakeTerrainHeightAction'
import { MakeCopyLevelPatrol } from '../Make_copy_paste/MakeCopyLevelPatrol'
import { MakeCaster } from '../Make_create_casters/MakeCaster'
import { MakeMeteor } from '../Make_create_meteors/MakeMeteor'
import { MakeMonsterSpawn } from '../Make_create_monster_spawn/MakeMonsterSpawn'
import { MakeMonsterMultiplePatrols } from '../Make_create_monsters/MakeMonsterMultiplePatrols'
import { MakeMonsterNoMove } from '../Make_create_monsters/MakeMonsterNoMove'
import { MakeMonsterSimplePatrol } from '../Make_create_monsters/MakeMonsterSimplePatrol'
import { MakeMonsterTeleport } from '../Make_create_monsters/MakeMonsterTeleport'
import { MakeDeleteMeteorsAction } from '../MakeLastActions/MakeDeleteMeteorsAction'
import { MakeGetRegion } from '../Make_create_region/MakeGetRegion'
import { MakeTerrainHorizontalSymmetry } from '../Make_terrain/MakeTerrainHorizontalSymmetry'
import { MakeStaticSlide } from '../Make_create_static_slide/MakeStaticSlide'
import { MakeStaticSlideInfo } from '../Make_create_static_slide/MakeStaticSlideInfo'
import { MakeCircleMob } from '../Make_monster_properties/MakeCircleMob'
import { MakeEnd } from '../Make_start_end_visibilityModifier/MakeEnd'
import { MakeVisibilityModifierAction } from '../MakeLastActions/MakeVisibilityModifierAction'
import { MakePropertyChangeAction } from '../MakeLastActions/MakePropertyChangeAction'
import { MakeVisibilityModifier } from '../Make_start_end_visibilityModifier/MakeVisibilityModifier'
import { MakeMoveRegionPoint } from '../Make_create_region/MakeMoveRegionPoint'
import { MakeMeteorAction } from '../MakeLastActions/MakeMeteorAction'
import { MakeTerrainHeight } from '../Make_terrain_height/MakeTerrainHeight'
import { MakeTerrainCopyPaste } from '../Make_terrain/MakeTerrainCopyPaste'
import { MakeTerrainHorizontalSymmetryAction } from '../MakeLastActions/MakeTerrainHorizontalSymmetryAction'
import { MakeDeleteStaticSlide } from '../Make_create_static_slide/MakeDeleteStaticSlide'
import { MakeExchangeTerrains } from '../Make_exchange_terrains/MakeExchangeTerrains'
import { MakeGetUnitTeleportPeriod } from '../Make_set_unit_properties/MakeGetUnitTeleportPeriod'
import { MakeTerrainVerticalSymmetry } from '../Make_terrain/MakeTerrainVerticalSymmetry'
import { MakeSetUnitTeleportPeriod } from '../Make_set_unit_properties/MakeSetUnitTeleportPeriod'
import { MakeDeletePortalMob } from '../Make_monster_properties/MakeDeletePortalMob'
import { MakePortalMob } from '../Make_monster_properties/MakePortalMob'
import { MakeSetUnitMonsterType } from '../Make_set_unit_properties/MakeSetUnitMonsterType'
import { MakeGetMonsterInfo } from '../Make_get_info/MakeGetMonsterInfo'
import { MakeTerrainCreateBrushAction } from '../MakeLastActions/MakeTerrainCreateBrushAction'
import { MakeAction } from '../MakeLastActions/MakeAction'
import { MakeStart } from '../Make_start_end_visibilityModifier/MakeStart'
import { MakeMonsterAttackGroundOrder } from '../Make_monster_properties/MakeMonsterAttackGroundOrder'
import { MakeRegion } from '../Make_create_region/MakeRegion'
import { MakeSetBlockMobEffect } from '../Make_monster_properties/MakeSetBlockMobEffect'
import { MakeDeleteCasters } from '../Make_delete_casters/MakeDeleteCasters'
import { MakeDeleteMeteors } from '../Make_delete_meteors/MakeDeleteMeteors'
import { MakeClearMob } from '../Make_monster_properties/MakeClearMob'
import { MakeDoNothing } from '../Make_do_nothing/MakeDoNothing'
import { MakeLastActions } from '../MakeLastActions/MakeLastActions'
import { MakeTerrainCreate } from '../Make_terrain/MakeTerrainCreate'
import { MakeTerrainCopyPasteAction } from '../MakeLastActions/MakeTerrainCopyPasteAction'
import { MakeDeleteMonstersAction } from '../MakeLastActions/MakeDeleteMonstersAction'
import { MakeTerrainCreateBrush } from '../Make_terrain/MakeTerrainCreateBrush'
import { MakeGetTerrainType } from '../Make_get_info/MakeGetTerrainType'
import { MakeTpForEnd } from '../Make_start_end_visibilityModifier/MakeTpForEnd'
import { MakeDeleteClearMob } from '../Make_monster_properties/MakeDeleteClearMob'
import { MakeTerrainCreateAction } from '../MakeLastActions/MakeTerrainCreateAction'
import { MakeDeleteCircleMob } from '../Make_monster_properties/MakeDeleteCircleMob'
import { MakeTerrainVerticalSymmetryAction } from '../MakeLastActions/MakeTerrainVerticalSymmetryAction'
import { MakeMonsterAction } from '../MakeLastActions/MakeMonsterAction'
import { MakeDeleteMonsters } from '../Make_delete_monsters/MakeDeleteMonsters'
import { MakeSetClearMobEffect } from '../Make_monster_properties/MakeSetClearMobEffect'
import { Make } from './Make'

export const Makes = {
    MakePropertyChange,
    MakeCopyLevelPatrol,
    MakeCaster,
    MakeMeteor,
    MakeMonsterSpawn,
    MakeMonsterMultiplePatrols,
    MakeMonsterNoMove,
    MakeMonsterSimplePatrol,
    MakeMonsterTeleport,
    MakeDeleteMeteorsAction,
    MakeGetRegion,
    MakeTerrainHorizontalSymmetry,
    MakeStaticSlide,
    MakeStaticSlideInfo,
    MakeCircleMob,
    MakeEnd,
    MakeVisibilityModifierAction,
    MakePropertyChangeAction,
    MakeVisibilityModifier,
    MakeMoveRegionPoint,
    MakeMeteorAction,
    MakeTerrainHeight,
    MakeTerrainCopyPaste,
    MakeTerrainHorizontalSymmetryAction,
    MakeDeleteStaticSlide,
    MakeExchangeTerrains,
    MakeGetUnitTeleportPeriod,
    MakeTerrainVerticalSymmetry,
    MakeSetUnitTeleportPeriod,
    MakeDeletePortalMob,
    MakePortalMob,
    MakeSetUnitMonsterType,
    MakeGetMonsterInfo,
    MakeTerrainCreateBrushAction,
    MakeStart,
    MakeMonsterAttackGroundOrder,
    MakeRegion,
    MakeSetBlockMobEffect,
    MakeDeleteCasters,
    MakeDeleteMeteors,
    MakeClearMob,
    MakeDoNothing,
    MakeTerrainCreate,
    MakeTerrainCopyPasteAction,
    MakeDeleteMonstersAction,
    MakeTerrainCreateBrush,
    MakeGetTerrainType,
    MakeTerrainHeightAction,
    MakeTpForEnd,
    MakeDeleteClearMob,
    MakeTerrainCreateAction,
    MakeDeleteCircleMob,
    MakeTerrainVerticalSymmetryAction,
    MakeMonsterAction,
    MakeDeleteMonsters,
    MakeSetClearMobEffect,
}
