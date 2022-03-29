import { Init_terrain_limit_variables } from 'core/01_libraries/Init_terrain_limit_variables'
import { initGameTime } from 'core/04_STRUCTURES/Lives_and_game_time/Time_of_game_trigger'
import { InitTrig_Effect_meteor_on_pick_down } from 'core/04_STRUCTURES/Meteor/Effect_meteor_on_pick_down'
import { InitTrig_Effect_meteor_on_pick_up } from 'core/04_STRUCTURES/Meteor/Effect_meteor_on_pick_up'
import { InitTrig_Meteor_being_used } from 'core/04_STRUCTURES/Meteor/Meteor_being_used'
import { InitTrig_Right_click_on_widget } from 'core/04_STRUCTURES/Meteor/Right_click_on_widget'
import { InitTrig_Stop_using_normal_meteor } from 'core/04_STRUCTURES/Meteor/Stop_using_normal_meteor'
import { InitTrig_Afk_mode_ordre_recu } from 'core/08_GAME/Afk_mode/Afk_mode_ordre_recu'
import { InitTrig_Camera_reset } from 'core/08_GAME/Camera_reset/Camera_reset'
import { InitTrig_A_hero_dies_check_if_all_dead_and_sounds } from 'core/08_GAME/Death/A_hero_dies_check_if_all_dead_and_sounds'
import { InitTrig_InvisUnit_is_getting_damage } from 'core/08_GAME/Death/InvisUnit_is_getting_damage'
import { InitTrig_Lose_a_life_and_res } from 'core/08_GAME/Death/Lose_a_life_and_res'
import { InitTrig_Sound_monster_dies } from 'core/08_GAME/Death/Sound_monster_dies'
import { InitTrig_Allways_day } from 'core/08_GAME/Init_game/Allways_day'
import { InitTrig_Camera } from 'core/08_GAME/Init_game/Camera'
import { InitTrig_Forces_ally } from 'core/08_GAME/Init_game/Forces_ally'
import { InitTrig_Start_sound } from 'core/08_GAME/Init_game/Start_sound'
import { InitTrig_Init_lives } from 'core/08_GAME/Init_structures/Init_lives'
import { InitTrig_Init_struct_levels } from 'core/08_GAME/Init_structures/Init_struct_levels'
import { InitTrig_A_player_leaves } from 'core/08_GAME/Leavers/A_player_leaves'
import { InitTrig_creation_dialogue } from 'core/08_GAME/Mode_coop/creation_dialogue'
import { InitTrig_Select_hero } from 'core/08_GAME/Select_and_unselect_heroes/Select_hero'
import { InitTrig_Unselect_hero } from 'core/08_GAME/Select_and_unselect_heroes/Unselect_hero'
import { InitTrig_Using_shortcut } from 'core/08_GAME/Shortcuts/Using_shortcut'

export const initOldTriggers = () => {
    Init_terrain_limit_variables()

    // TODO; External libraries of which I'm not sure yet how they're called
    // InitTrig_StringUtils()
    // InitTrig_Stack()
    // InitTrig_TimerUtils()
    // InitTrig_SoundUtils()

    // InitTrig_MonsterSimplePatrol()
    // InitTrig_MonsterSimplePatrolArray()
    // InitTrig_MonsterMultiplePatrols()
    // InitTrig_MonsterMultiplePatrolsArray()
    // InitTrig_MonsterTeleport()
    // InitTrig_MonsterTeleportArray()
    // InitTrig_ClearMob()
    // InitTrig_ClearMobArray()
    // InitTrig_MonsterSpawn()
    // InitTrig_MonsterSpawnArray()
    // InitTrig_Terrain_type_functions()
    // InitTrig_TerrainType()
    // InitTrig_TerrainTypeWalk()
    // InitTrig_TerrainTypeDeath_functions()
    // InitTrig_TerrainTypeDeath_KillingTimers()
    // InitTrig_TerrainTypeDeath()
    // InitTrig_TerrainTypeSlide()
    // InitTrig_TerrainTypeArray()
    initGameTime()
    InitTrig_Right_click_on_widget()
    InitTrig_Meteor_being_used()
    InitTrig_Stop_using_normal_meteor()
    InitTrig_Effect_meteor_on_pick_up()
    InitTrig_Effect_meteor_on_pick_down()
    // InitTrig_Make()
    // InitTrig_Monster_making_no_move_Actions()
    // InitTrig_MakeMonsterNoMove()
    // InitTrig_Monster_making_simple_patrol_Actions()
    // InitTrig_MakeMonsterSimplePatrol()
    // InitTrig_Monster_making_multiple_patrols_Actions()
    // InitTrig_MakeMonsterMultiplePatrols()
    // InitTrig_Monster_making_teleport_Actions()
    // InitTrig_MakeMonsterTeleport()
    // InitTrig_Monster_spawn_making_Actions()
    // InitTrig_MakeMonsterSpawn()
    // InitTrig_Monster_delete_Actions()
    // InitTrig_MakeDeleteMonsters()
    // InitTrig_Make_set_unit_monster_type_Actions()
    // InitTrig_MakeSetUnitMonsterType()
    // InitTrig_Make_set_unit_teleport_period_Actions()
    // InitTrig_MakeSetUnitTeleportPeriod()
    // InitTrig_Make_get_unit_teleport_period_Actions()
    // InitTrig_MakeGetUnitTeleportPeriod()
    // InitTrig_Meteor_making_Actions()
    // InitTrig_MakeMeteor()
    // InitTrig_Meteor_delete_Actions()
    // InitTrig_MakeDeleteMeteors()
    // InitTrig_Caster_making_Actions()
    // InitTrig_MakeCaster()
    // InitTrig_Caster_delete_Actions()
    // InitTrig_MakeDeleteCasters()
    // InitTrig_ClearMob_making_Actions()
    // InitTrig_MakeClearMob()
    // InitTrig_ClearMob_delete_Actions()
    // InitTrig_MakeDeleteClearMob()
    // InitTrig_Terrain_making_Actions()
    // InitTrig_MakeTerrainCreate()
    // InitTrig_Terrain_copy_paste_Actions()
    // InitTrig_MakeTerrainCopyPaste()
    // InitTrig_Terrain_vertical_symmetry_Actions()
    // InitTrig_MakeTerrainVerticalSymmetry()
    // InitTrig_Terrain_horizontal_symmetry_Actions()
    // InitTrig_MakeTerrainHorizontalSymmetry()
    // InitTrig_Terrain_height_making_Actions()
    // InitTrig_MakeTerrainHeight()
    // InitTrig_Make_exchange_terrains_Actions()
    // InitTrig_MakeExchangeTerrains()
    // InitTrig_Start_making_Actions()
    // InitTrig_MakeStart()
    // InitTrig_End_making_Actions()
    // InitTrig_MakeEnd()
    // InitTrig_VisibilityModifier_making_Actions()
    // InitTrig_MakeVisibilityModifier()
    // InitTrig_Getting_terrain_type_info_Actions()
    // InitTrig_MakeGetTerrainType()
    // InitTrig_MakeAction()
    // InitTrig_MakeMonsterAction()
    // InitTrig_MakeDeleteMonstersAction()
    // InitTrig_MakeMeteorAction()
    // InitTrig_MakeDeleteMeteorsAction()
    // InitTrig_MakeCasterAction()
    // InitTrig_MakeDeleteCastersAction()
    // InitTrig_MakeTerrainCreateAction()
    // InitTrig_MakeTerrainCopyPasteAction()
    // InitTrig_MakeTerrainVerticalSymmetryAction()
    // InitTrig_MakeTerrainHorizontalSymmetryAction()
    // InitTrig_MakeTerrainHeightAction()
    // InitTrig_MakeVisibilityModifierAction()
    // InitTrig_MakeLastActions()
    InitTrig_Init_lives()
    InitTrig_Init_struct_levels()
    InitTrig_Forces_ally()
    InitTrig_Camera()
    InitTrig_Allways_day()
    InitTrig_Start_sound()
    InitTrig_creation_dialogue()
    InitTrig_Using_shortcut()
    InitTrig_Camera_reset()
    InitTrig_Afk_mode_ordre_recu()
    InitTrig_A_player_leaves()
    InitTrig_InvisUnit_is_getting_damage()
    InitTrig_A_hero_dies_check_if_all_dead_and_sounds()
    InitTrig_Lose_a_life_and_res()
    InitTrig_Sound_monster_dies()
    InitTrig_Select_hero()
    InitTrig_Unselect_hero()
}
