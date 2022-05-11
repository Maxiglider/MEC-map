function Init_level0_Actions takes nothing returns nothing
	local Level level = ForceGetLevel(0)

//start message

//lives earned
	call level.setNbLivesEarned(3)

//start location
	call level.newStart(GetRectMinX(gg_rct_departLvl_0), GetRectMinY(gg_rct_departLvl_0), GetRectMaxX(gg_rct_departLvl_0), GetRectMaxY(gg_rct_departLvl_0))

//end location
	call level.newEnd(15195, 6505, 15195, 7337)

//visibilities
	call level.newVisibilityModifier(18000, 4609, 17814, 4873)
	call level.newVisibilityModifier(18040, 4125, 17802, 5647)
	call level.newVisibilityModifier(18036, 4080, 17644, 5661)
	call level.newVisibilityModifier(18806, 4002, 19784, 6097)
	call level.newVisibilityModifier(19729, 4149, 20260, 6086)
	call level.newVisibilityModifier(19964, 4851, 20377, 5994)
	call level.newVisibilityModifier(20085, 5722, 20376, 6031)
	call level.newVisibilityModifier(17758, 5410, 18608, 6550)
	call level.newVisibilityModifier(18295, 5712, 18712, 6548)
	call level.newVisibilityModifier(18571, 6423, 17653, 6844)
	call level.newVisibilityModifier(17408, 6770, 18216, 7833)
	call level.newVisibilityModifier(17412, 7646, 18218, 7969)
	call level.newVisibilityModifier(17435, 7607, 18217, 8106)
	call level.newVisibilityModifier(18175, 7770, 17413, 8336)
	call level.newVisibilityModifier(17047, 6574, 17607, 8339)
	call level.newVisibilityModifier(15441, 6560, 15112, 7304)
	call level.newVisibilityModifier(17906, 7819, 18220, 8366)
	call level.newVisibilityModifier(19014, 1049, 17813, 6239)
	call level.newVisibilityModifier(18962, 5759, 19486, 6152)
	call level.newVisibilityModifier(19125, 5674, 19620, 6172)
	call level.newVisibilityModifier(17432, 8271, 16334, 6500)
	call level.newVisibilityModifier(17542, 7675, 16302, 8387)
	call level.newVisibilityModifier(18068, 6798, 16297, 8487)
	call level.newVisibilityModifier(16481, 7468, 15153, 6559)

//monsters no move
	call level.monstersNoMove.new(udg_monsterTypes.get("r"), 18434, 2947, -1, false).setId(3451)
	call level.monstersNoMove.new(udg_monsterTypes.get("r"), 18433, 3463, -1, false).setId(3452)
	call level.monstersNoMove.new(udg_monsterTypes.get("r"), 19331, 4614, -1, false).setId(3472)
	call level.monstersNoMove.new(udg_monsterTypes.get("r"), 18435, 5378, -1, false).setId(3489)
	call level.monstersNoMove.new(udg_monsterTypes.get("r"), 18819, 4488, -1, false).setId(3491)
	call level.monstersNoMove.new(udg_monsterTypes.get("r"), 19713, 4743, -1, false).setId(3492)
	call level.monstersNoMove.new(udg_monsterTypes.get("r"), 18307, 6016, -1, false).setId(3496)
	call level.monstersNoMove.new(udg_monsterTypes.get("r"), 18181, 6408, -1, false).setId(3497)
	call level.monstersNoMove.new(udg_monsterTypes.get("r"), 19331, 5645, -1, false).setId(3508)
	call level.monstersNoMove.new(udg_monsterTypes.get("r"), 16134, 6923, -1, false).setId(3518)

//monsters simple patrol
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 17967, 2417, 18902, 2417, false).setId(3444)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 18906, 2676, 17962, 2678, false).setId(3445)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 18432, 2996, 18433, 3412, false).setId(3450)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 18386, 2941, 17966, 2937, false).setId(3453)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 18474, 3453, 18899, 3455, false).setId(3454)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 18898, 2940, 18481, 2940, false).setId(3455)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 17972, 3458, 18385, 3458, false).setId(3456)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 18094, 3843, 18774, 3843, false).setId(3457)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 18768, 4051, 18101, 4055, false).setId(3458)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 18095, 4212, 18774, 4212, false).setId(3459)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 18451, 4816, 18071, 4265, false).setId(3460)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 18796, 4250, 18454, 4818, false).setId(3461)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 18898, 4284, 18897, 4816, false).setId(3462)
endfunction

function Init_level0_part2_Actions takes nothing returns nothing
	local Level level = ForceGetLevel(0)


//monsters simple patrol
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 18980, 4848, 19301, 4148, false).setId(3464)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 19410, 4155, 19410, 5059, false).setId(3465)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 19830, 4395, 18969, 4261, false).setId(3466)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 19759, 4308, 19247, 4939, false).setId(3467)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 19505, 5130, 20078, 4892, false).setId(3468)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 20266, 4946, 19760, 5251, false).setId(3470)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 19753, 5373, 20306, 5365, false).setId(3471)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 20279, 5810, 19741, 5411, false).setId(3474)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("w"), 18560, 5717, 18989, 5209, false).setId(3482)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 18760, 5710, 18763, 5123, false).setId(3483)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 18636, 5711, 18634, 5053, false).setId(3484)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 18390, 5373, 17715, 5366, false).setId(3485)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 18430, 5428, 18545, 5734, false).setId(3486)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 17748, 5061, 18405, 5358, false).setId(3488)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 18772, 4480, 17846, 4482, false).setId(3490)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("w"), 17973, 5891, 18516, 5883, false).setId(3494)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 18297, 6068, 18178, 6352, false).setId(3495)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 17981, 6165, 18512, 6165, false).setId(3498)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 17724, 6633, 18289, 6627, false).setId(3500)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 17790, 7091, 17790, 7507, false).setId(3501)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("w"), 17455, 7037, 18138, 7035, false).setId(3502)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("w"), 18133, 7555, 17459, 7559, false).setId(3503)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 19302, 5655, 19109, 5869, false).setId(3504)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 19361, 5606, 19542, 5388, false).setId(3505)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 19102, 5405, 19308, 5610, false).setId(3506)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 19547, 5883, 19348, 5664, false).setId(3507)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 17446, 7835, 18114, 8111, false).setId(3510)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 16160, 6951, 16355, 7152, false).setId(3513)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 16352, 6672, 16160, 6879, false).setId(3514)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("w"), 15874, 6578, 15872, 7250, false).setId(3515)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("w"), 15667, 6913, 16086, 6913, false).setId(3516)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 15617, 6577, 15617, 7246, false).setId(3517)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("w"), 17404, 7859, 17812, 8260, false).setId(3519)

//monsters multiple patrols

//monsters teleport

//monster spawns
	call level.monsterSpawns.new("troll1", udg_monsterTypes.get("t"), "downToUp", 1.500, 16516, 6611, 17269, 8371, false)

//meteors

//casters

	call level.activate(false)

	call level.activate(true)
endfunction


function Init_level1_Actions takes nothing returns nothing
	local Level level = ForceGetLevel(1)

//start message

//lives earned

//start location
	call level.newStart(14427, 6474, 15277, 7340)

//end location
	call level.newEnd(16335, 13802, 17202, 13806)

//visibilities
	call level.newVisibilityModifier(15261, 6384, 14382, 8203)
	call level.newVisibilityModifier(15158, 6673, 15367, 6394)
	call level.newVisibilityModifier(15100, 7159, 15366, 7447)
	call level.newVisibilityModifier(14320, 8174, 14875, 8461)
	call level.newVisibilityModifier(14874, 8472, 13926, 8575)
	call level.newVisibilityModifier(13774, 8696, 14463, 11002)
	call level.newVisibilityModifier(14569, 8111, 13937, 8471)
	call level.newVisibilityModifier(13907, 8318, 14654, 8724)
	call level.newVisibilityModifier(14013, 8359, 14538, 8904)
	call level.newVisibilityModifier(13962, 8261, 14841, 8684)
	call level.newVisibilityModifier(14405, 7980, 15099, 8493)
	call level.newVisibilityModifier(14326, 8129, 14924, 8738)
	call level.newVisibilityModifier(14071, 8200, 14676, 8980)
	call level.newVisibilityModifier(13894, 8798, 13453, 9659)
	call level.newVisibilityModifier(14226, 9119, 14606, 11129)
	call level.newVisibilityModifier(14477, 10226, 14903, 11290)
	call level.newVisibilityModifier(14837, 11220, 15898, 10370)
	call level.newVisibilityModifier(14858, 10696, 15568, 9687)
	call level.newVisibilityModifier(14969, 10365, 14379, 9039)
	call level.newVisibilityModifier(14202, 9347, 14880, 8502)
	call level.newVisibilityModifier(14788, 8008, 15171, 8393)
	call level.newVisibilityModifier(14480, 8093, 15009, 8637)
	call level.newVisibilityModifier(14600, 8379, 14231, 7987)
	call level.newVisibilityModifier(15715, 10453, 16077, 12542)
	call level.newVisibilityModifier(15346, 10896, 16278, 10377)
	call level.newVisibilityModifier(15841, 10484, 16244, 12425)
	call level.newVisibilityModifier(15756, 10463, 16336, 12408)
	call level.newVisibilityModifier(16050, 12003, 16319, 12461)
	call level.newVisibilityModifier(15449, 10829, 16247, 10162)
	call level.newVisibilityModifier(15639, 10666, 16336, 10063)
	call level.newVisibilityModifier(16168, 10670, 14929, 9226)
	call level.newVisibilityModifier(15735, 10997, 15054, 12479)
	call level.newVisibilityModifier(15595, 11187, 14774, 12442)
	call level.newVisibilityModifier(14842, 12139, 15668, 12635)
	call level.newVisibilityModifier(15211, 12120, 15801, 12604)
	call level.newVisibilityModifier(15803, 11889, 16340, 12580)
	call level.newVisibilityModifier(15985, 12542, 16358, 9268)
	call level.newVisibilityModifier(15993, 12518, 16519, 9297)
	call level.newVisibilityModifier(14764, 9637, 16568, 9053)
	call level.newVisibilityModifier(16528, 9835, 17052, 13568)
	call level.newVisibilityModifier(16113, 10207, 16760, 9494)
	call level.newVisibilityModifier(16495, 11598, 18688, 9993)
	call level.newVisibilityModifier(17394, 10990, 17218, 13588)
	call level.newVisibilityModifier(16782, 10851, 17312, 13581)
	call level.newVisibilityModifier(16800, 12107, 16333, 13619)
	call level.newVisibilityModifier(16289, 13576, 17242, 13737)
	call level.newVisibilityModifier(16732, 13470, 17320, 13747)
	call level.newVisibilityModifier(16328, 13534, 17270, 13845)
endfunction

function Init_level1_part2_Actions takes nothing returns nothing
	local Level level = ForceGetLevel(1)


//visibilities
	call level.newVisibilityModifier(16971, 13559, 17324, 13850)

//monsters no move
	call level.monstersNoMove.new(udg_monsterTypes.get("r"), 14721, 10759, -1, false).setId(3545)
	call level.monstersNoMove.new(udg_monsterTypes.get("r"), 15745, 10758, -1, false).setId(3547)
	call level.monstersNoMove.new(udg_monsterTypes.get("r"), 15485, 9350, -1, false).setId(3567)
	call level.monstersNoMove.new(udg_monsterTypes.get("r"), 16134, 9350, -1, false).setId(3568)

//monsters simple patrol
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 14514, 7679, 15188, 7677, false).setId(3520)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("w"), 15188, 7812, 14516, 7810, false).setId(3521)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 14497, 8089, 14846, 8397, false).setId(3522)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 14158, 8394, 14566, 8685, false).setId(3524)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 14698, 8558, 14366, 8223, false).setId(3527)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("w"), 14166, 9171, 13491, 9171, false).setId(3528)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 13722, 8868, 13723, 9545, false).setId(3529)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("w"), 14120, 9752, 14438, 9969, false).setId(3533)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 14127, 9726, 14546, 9718, false).setId(3534)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 15187, 7919, 14511, 7921, false).setId(3536)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 14110, 10273, 14865, 10965, false).setId(3537)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 14839, 10549, 14131, 10238, false).setId(3538)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 14618, 10314, 14151, 10561, false).setId(3539)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 14493, 10056, 14493, 10849, false).setId(3541)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 14924, 10451, 15558, 11045, false).setId(3542)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 15551, 10451, 14918, 11060, false).setId(3543)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 14771, 10750, 15701, 10752, false).setId(3544)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 14633, 10957, 14633, 10325, false).setId(3546)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 14022, 8540, 14408, 8848, false).setId(3548)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 14241, 9014, 13839, 8750, false).setId(3549)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 13618, 9470, 14535, 9470, false).setId(3551)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 14104, 9687, 14178, 9239, false).setId(3552)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 16005, 11210, 16004, 10685, false).setId(3553)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("w"), 15777, 10974, 16211, 11529, false).setId(3554)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 15695, 11589, 16297, 11826, false).setId(3555)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 16299, 11582, 15817, 11841, false).setId(3556)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 15816, 11964, 16291, 12334, false).setId(3557)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 15626, 11952, 15652, 12339, false).setId(3558)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("w"), 15246, 12377, 15458, 11933, false).setId(3559)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 15012, 12137, 15460, 11759, false).setId(3560)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 15571, 12412, 14911, 11794, false).setId(3561)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("w"), 15537, 9336, 16084, 9336, false).setId(3564)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 15479, 9558, 16131, 9140, false).setId(3565)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 16135, 9549, 15484, 9140, false).setId(3566)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 16466, 9485, 16465, 10430, false).setId(3569)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("w"), 16188, 9999, 16713, 9990, false).setId(3570)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 16582, 10553, 16860, 10131, false).setId(3571)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 16189, 9777, 16865, 10710, false).setId(3572)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 17211, 10422, 17211, 10698, false).setId(3573)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 17401, 10700, 17404, 10422, false).setId(3574)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 17865, 10173, 17865, 10448, false).setId(3575)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 18018, 10450, 18015, 10173, false).setId(3576)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 18243, 10687, 18521, 10687, false).setId(3578)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("w"), 18518, 10862, 18225, 10870, false).setId(3579)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 17918, 11218, 17916, 10936, false).setId(3580)
endfunction

function Init_level1_part3_Actions takes nothing returns nothing
	local Level level = ForceGetLevel(1)


//monsters simple patrol
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("w"), 17713, 10938, 17716, 11209, false).setId(3581)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("w"), 17251, 11341, 17246, 11063, false).setId(3584)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("w"), 17092, 11069, 17097, 11345, false).setId(3585)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 16993, 11374, 16579, 11705, false).setId(3586)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 16696, 11786, 17104, 11767, false).setId(3587)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 16587, 10965, 16984, 11537, false).setId(3588)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 17106, 11904, 16576, 12305, false).setId(3589)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 16710, 11996, 16713, 12749, false).setId(3590)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 16574, 12551, 17097, 12547, false).setId(3591)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 16884, 12337, 16886, 12748, false).setId(3592)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 16584, 12888, 16810, 13228, false).setId(3593)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("w"), 16443, 13526, 17100, 13524, false).setId(3594)

//monsters multiple patrols

//monsters teleport

//monster spawns

//meteors

//casters

endfunction


function Init_level2_Actions takes nothing returns nothing
	local Level level = ForceGetLevel(2)

//start message

//lives earned
	call level.setNbLivesEarned(2)

//start location
	call level.newStart(16357, 13649, 17191, 14515)

//end location
	call level.newEnd(13023, 16091, 13890, 16120)

//visibilities
	call level.newVisibilityModifier(17291, 13536, 14013, 15010)
	call level.newVisibilityModifier(16415, 13711, 13910, 12850)
	call level.newVisibilityModifier(16521, 13777, 13913, 11727)
	call level.newVisibilityModifier(16461, 14617, 14019, 18346)
	call level.newVisibilityModifier(15911, 16344, 16706, 15588)
	call level.newVisibilityModifier(15966, 17846, 17046, 16569)
	call level.newVisibilityModifier(15790, 17251, 17031, 16220)
	call level.newVisibilityModifier(12965, 14415, 11991, 15154)
	call level.newVisibilityModifier(11913, 14769, 11078, 11810)
	call level.newVisibilityModifier(11165, 14637, 12351, 13909)
	call level.newVisibilityModifier(11496, 14603, 12472, 14156)
	call level.newVisibilityModifier(14293, 13567, 13434, 10795)
	call level.newVisibilityModifier(14118, 10698, 14790, 11819)
	call level.newVisibilityModifier(13922, 11468, 11897, 10613)
	call level.newVisibilityModifier(12309, 10504, 11286, 11455)
	call level.newVisibilityModifier(11324, 11280, 14013, 15254)
	call level.newVisibilityModifier(11376, 11363, 10895, 8286)
	call level.newVisibilityModifier(11579, 10708, 10485, 11383)
	call level.newVisibilityModifier(11392, 11180, 10646, 8567)
	call level.newVisibilityModifier(11049, 10875, 10399, 9771)
	call level.newVisibilityModifier(11305, 10688, 10388, 9364)
	call level.newVisibilityModifier(11031, 10655, 11959, 8383)
	call level.newVisibilityModifier(10699, 11005, 13826, 8388)
	call level.newVisibilityModifier(11383, 9019, 12415, 8168)
	call level.newVisibilityModifier(11432, 8945, 13136, 8085)
	call level.newVisibilityModifier(14065, 14969, 12890, 16222)
	call level.newVisibilityModifier(11532, 11107, 11026, 11851)
	call level.newVisibilityModifier(11480, 10933, 10378, 11413)

//monsters no move
	call level.monstersNoMove.new(udg_monsterTypes.get("r"), 16001, 14466, -1, false).setId(3632)
	call level.monstersNoMove.new(udg_monsterTypes.get("r"), 15873, 14860, -1, false).setId(3633)
	call level.monstersNoMove.new(udg_monsterTypes.get("r"), 15242, 16923, -1, false).setId(3662)
	call level.monstersNoMove.new(udg_monsterTypes.get("r"), 14723, 17930, -1, false).setId(3668)
	call level.monstersNoMove.new(udg_monsterTypes.get("r"), 11523, 13830, -1, false).setId(3693)
	call level.monstersNoMove.new(udg_monsterTypes.get("r"), 12162, 14486, -1, false).setId(3695)
	call level.monstersNoMove.new(udg_monsterTypes.get("r"), 11520, 12287, -1, false).setId(3706)
	call level.monstersNoMove.new(udg_monsterTypes.get("r"), 11518, 13199, -1, false).setId(3707)
	call level.monstersNoMove.new(udg_monsterTypes.get("polarbear"), 12845, 12234, 270, false).setId(3751)

//monsters simple patrol
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 15641, 14058, 15931, 13666, false).setId(3626)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 15746, 13498, 15403, 13816, false).setId(3627)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("w"), 15457, 13216, 15180, 13629, false).setId(3628)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("w"), 15677, 14137, 16239, 14569, false).setId(3629)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 15991, 14506, 15878, 14797, false).setId(3631)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 15664, 14564, 16207, 14920, false).setId(3634)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 16115, 15530, 15547, 15783, false).setId(3637)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 15680, 16047, 16292, 15565, false).setId(3638)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("w"), 15590, 15542, 16362, 15850, false).setId(3639)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("w"), 15865, 16214, 16362, 15642, false).setId(3640)
endfunction

function Init_level2_part2_Actions takes nothing returns nothing
	local Level level = ForceGetLevel(2)


//monsters simple patrol
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 16455, 15743, 15553, 15661, false).setId(3641)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 16455, 16698, 16879, 16423, false).setId(3643)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 16958, 16696, 16435, 16508, false).setId(3644)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("w"), 16299, 16373, 16545, 16076, false).setId(3645)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 16425, 16923, 16616, 17266, false).setId(3646)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 16273, 17066, 16811, 17059, false).setId(3647)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("w"), 16163, 17190, 16855, 16880, false).setId(3648)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 16362, 17523, 16002, 17329, false).setId(3649)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 15998, 17325, 15665, 17407, false).setId(3651)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 15858, 16433, 16050, 16935, false).setId(3653)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("w"), 15676, 16922, 16207, 16673, false).setId(3654)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 15655, 16313, 15648, 16602, false).setId(3655)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 15171, 16343, 15501, 16583, false).setId(3658)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 15011, 17061, 15448, 16631, false).setId(3659)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("w"), 15054, 16600, 15436, 17017, false).setId(3660)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 15009, 17056, 15410, 17190, false).setId(3663)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 15319, 17367, 14778, 17281, false).setId(3664)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 15009, 17699, 15449, 17548, false).setId(3665)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 15022, 17519, 15436, 17924, false).setId(3667)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 14697, 17688, 14380, 17903, false).setId(3669)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("w"), 14949, 17714, 14723, 17865, false).setId(3670)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 14388, 17921, 15025, 18086, false).setId(3671)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("w"), 14276, 17299, 14544, 17290, false).setId(3672)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 14642, 17373, 14254, 17655, false).setId(3673)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 14151, 16445, 14659, 16422, false).setId(3674)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 14690, 16343, 14242, 16030, false).setId(3675)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 14369, 15758, 14826, 16219, false).setId(3680)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 15188, 15908, 14258, 15901, false).setId(3681)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 14749, 15520, 15135, 16170, false).setId(3683)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 14770, 15351, 15334, 15349, false).setId(3684)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("w"), 15299, 14895, 14908, 14887, false).setId(3685)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 15003, 14484, 15399, 14769, false).setId(3686)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 15313, 13938, 14994, 14307, false).setId(3688)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 14746, 14064, 14929, 13743, false).setId(3689)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("w"), 11518, 13874, 12125, 14451, false).setId(3692)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("w"), 11823, 13903, 11558, 14187, false).setId(3696)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("w"), 11800, 14434, 12107, 14073, false).setId(3697)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("w"), 11581, 14384, 11934, 14004, false).setId(3700)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 11201, 13629, 11852, 13092, false).setId(3701)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 11858, 13134, 11199, 12702, false).setId(3702)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("w"), 11326, 12985, 11728, 12808, false).setId(3703)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("w"), 11732, 13433, 11313, 13299, false).setId(3704)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("w"), 11522, 12340, 11519, 13137, false).setId(3705)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("w"), 11559, 12314, 11755, 12514, false).setId(3708)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 11543, 12240, 11744, 11958, false).setId(3709)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 14991, 12843, 15007, 13513, false).setId(3710)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 14556, 12988, 14213, 13388, false).setId(3711)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 13998, 13205, 14629, 13349, false).setId(3712)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("w"), 14001, 13044, 14439, 13511, false).setId(3713)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("w"), 13884, 12980, 14299, 12686, false).setId(3714)
endfunction

function Init_level2_part3_Actions takes nothing returns nothing
	local Level level = ForceGetLevel(2)


//monsters simple patrol
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("w"), 13861, 12757, 14288, 12939, false).setId(3715)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 13640, 12600, 14270, 12551, false).setId(3716)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 14177, 12443, 13851, 12755, false).setId(3717)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 13761, 12341, 14273, 12155, false).setId(3718)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 13496, 12014, 14273, 12169, false).setId(3719)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 14271, 11879, 13498, 12033, false).setId(3720)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("w"), 13614, 11900, 14155, 12032, false).setId(3721)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("w"), 13477, 11626, 13773, 11518, false).setId(3722)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("w"), 12290, 11215, 13305, 10680, false).setId(3729)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("w"), 13314, 11217, 12291, 10678, false).setId(3730)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 12288, 11064, 13315, 10830, false).setId(3731)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 13314, 11060, 12291, 10830, false).setId(3732)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 12351, 10947, 13276, 10928, false).setId(3733)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 10531, 10623, 11219, 10597, false).setId(3734)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 10664, 10118, 11222, 10389, false).setId(3735)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 10655, 10404, 11235, 10069, false).setId(3736)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("w"), 10558, 9678, 11370, 9952, false).setId(3737)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 10536, 9946, 11591, 9797, false).setId(3739)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 11283, 9501, 11310, 10034, false).setId(3740)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 11296, 9460, 11731, 9456, false).setId(3741)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 11356, 8967, 10820, 9414, false).setId(3742)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 10911, 8956, 11346, 8864, false).setId(3743)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("w"), 11045, 8441, 11717, 8740, false).setId(3744)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 11484, 8799, 11472, 8366, false).setId(3745)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 12217, 8357, 12248, 8793, false).setId(3746)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("w"), 14263, 13761, 14673, 14117, false).setId(3752)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("w"), 12601, 12678, 13251, 12653, false).setId(3753)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("w"), 13266, 12927, 12852, 12931, false).setId(3754)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 12724, 12811, 13266, 12778, false).setId(3755)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 13134, 12540, 12880, 13370, false).setId(3756)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 12853, 13142, 13452, 13120, false).setId(3757)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("w"), 13247, 13498, 13644, 13465, false).setId(3760)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("w"), 13656, 13624, 13241, 13644, false).setId(3761)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("w"), 13238, 13781, 13654, 13758, false).setId(3762)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("w"), 13652, 13916, 13235, 13946, false).setId(3763)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("w"), 13052, 14261, 13058, 15311, false).setId(3767)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("w"), 13817, 15312, 13815, 14263, false).setId(3768)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("w"), 13192, 14257, 13871, 15280, false).setId(3769)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("w"), 13680, 14247, 13004, 15290, false).setId(3770)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 13439, 14387, 13444, 15183, false).setId(3775)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 13247, 15659, 13644, 15657, false).setId(3778)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("t"), 13644, 15657, 13252, 15662, false).setId(3779)

//monsters multiple patrols

//monsters teleport

//monster spawns
	call level.monsterSpawns.new("wolf1", udg_monsterTypes.get("w"), "rightToLeft", 3.500, 12382, 8806, 13263, 10128, false)

//meteors
	call level.meteors.new(12106, 12213, false)

//casters

endfunction


function Init_level3_Actions takes nothing returns nothing
	local Level level = ForceGetLevel(3)

//start message

//lives earned
	call level.setNbLivesEarned(3)

//start location
	call level.newStart(13019, 15949, 13861, 16822)

//end location
	call level.newEnd(-893, 9199, -252, 9332)

//visibilities
	call level.newVisibilityModifier(14133, 15737, 12867, 16912)

//monsters no move

//monsters simple patrol

//monsters multiple patrols

//monsters teleport

//monster spawns

//meteors
	call level.meteors.new(7064, 121, false)
	call level.meteors.new(7284, -119, false)

//casters

endfunction


function Init_level4_Actions takes nothing returns nothing
	local Level level = ForceGetLevel(4)

//start message

//lives earned

//start location
	call level.newStart(-805, 9052, -373, 9770)

//end location
	call level.newEnd(4849, 13685, 4855, 14360)

//visibilities
	call level.newVisibilityModifier(-1001, 7871, 11669, 11610)
	call level.newVisibilityModifier(7086, 8032, 11063, 4872)
	call level.newVisibilityModifier(10733, 8967, 11701, 6763)
	call level.newVisibilityModifier(-990, 11518, 11654, 11683)
	call level.newVisibilityModifier(4549, 10924, -1002, 14701)
	call level.newVisibilityModifier(4766, 11046, 4576, 13209)
	call level.newVisibilityModifier(-1081, 14326, -1053, 14322)
	call level.newVisibilityModifier(-1014, 14585, 4497, 14759)
	call level.newVisibilityModifier(607, 13192, 2110, 14902)
	call level.newVisibilityModifier(4563, 13601, 4707, 14441)
	call level.newVisibilityModifier(4573, 13514, 4791, 14389)
	call level.newVisibilityModifier(4534, 14374, 4836, 14509)
	call level.newVisibilityModifier(4510, 13054, 4794, 13459)
	call level.newVisibilityModifier(4501, 14320, 4825, 14770)
	call level.newVisibilityModifier(4590, 11369, 4932, 14733)

//monsters no move

//monsters simple patrol

//monsters multiple patrols

//monsters teleport

//monster spawns
	call level.monsterSpawns.new("wendigo2", udg_monsterTypes.get("polarbear"), "rightToLeft", 3.500, 6123, 8362, 7656, 10044, false)
	call level.monsterSpawns.new("wolf3", udg_monsterTypes.get("r"), "upToDown", 5.000, 9632, 7741, 11493, 11626, false)
	call level.monsterSpawns.new("troll3", udg_monsterTypes.get("t"), "leftToRight", 4.000, 9454, 7767, 11595, 11017, false)

//meteors

//casters

endfunction


function Init_level5_Actions takes nothing returns nothing
	local Level level = ForceGetLevel(5)

//start message

//lives earned

//start location
	call level.newStart(4730, 13802, 5378, 14224)

//end location

//visibilities
	call level.newVisibilityModifier(4859, 14651, 9688, 11603)
	call level.newVisibilityModifier(9547, 12531, 16506, 6721)
	call level.newVisibilityModifier(11669, 12322, 16401, 13149)
	call level.newVisibilityModifier(11644, 12350, 16350, 13217)
	call level.newVisibilityModifier(16175, 12940, 16412, 13202)
	call level.newVisibilityModifier(16243, 8573, 20100, 3751)
	call level.newVisibilityModifier(19895, 3606, 20263, 8472)
	call level.newVisibilityModifier(16318, 8315, 16902, 9454)
	call level.newVisibilityModifier(16112, 8887, 16579, 9541)
	call level.newVisibilityModifier(16709, 8950, 16578, 9666)
	call level.newVisibilityModifier(16371, 9291, 16489, 9644)
	call level.newVisibilityModifier(16323, 10727, 18602, 9925)
	call level.newVisibilityModifier(16369, 10364, 18567, 10768)
	call level.newVisibilityModifier(18469, 9865, 18712, 10774)
	call level.newVisibilityModifier(16353, 10092, 18457, 9717)
	call level.newVisibilityModifier(16233, 9852, 16932, 9248)
	call level.newVisibilityModifier(16662, 8332, 17036, 9469)
	call level.newVisibilityModifier(16771, 8347, 17139, 9721)
	call level.newVisibilityModifier(16323, 10498, 18728, 10901)
	call level.newVisibilityModifier(18271, 9967, 18694, 9615)

//monsters no move

//monsters simple patrol

//monsters multiple patrols

//monsters teleport

//monster spawns
	call level.monsterSpawns.new("wendigo3", udg_monsterTypes.get("polarbear"), "rightToLeft", 5.000, 11718, 7096, 13008, 9416, false)

//meteors

//casters

endfunction




function InitTrig_Init_levels takes nothing returns nothing
	local trigger initLevel0 = CreateTrigger()
	local trigger initLevel0_part2 = CreateTrigger()
	local trigger initLevel1 = CreateTrigger()
	local trigger initLevel1_part2 = CreateTrigger()
	local trigger initLevel1_part3 = CreateTrigger()
	local trigger initLevel2 = CreateTrigger()
	local trigger initLevel2_part2 = CreateTrigger()
	local trigger initLevel2_part3 = CreateTrigger()
	local trigger initLevel3 = CreateTrigger()
	local trigger initLevel4 = CreateTrigger()
	local trigger initLevel5 = CreateTrigger()
	call TriggerAddAction(initLevel0, function Init_level0_Actions)
	call TriggerRegisterTimerEventSingle(initLevel0, 0.0000)
	call TriggerAddAction(initLevel0_part2, function Init_level0_part2_Actions)
	call TriggerRegisterTimerEventSingle(initLevel0_part2, 0.0001)
	call TriggerAddAction(initLevel1, function Init_level1_Actions)
	call TriggerRegisterTimerEventSingle(initLevel1, 0.0002)
	call TriggerAddAction(initLevel1_part2, function Init_level1_part2_Actions)
	call TriggerRegisterTimerEventSingle(initLevel1_part2, 0.0003)
	call TriggerAddAction(initLevel1_part3, function Init_level1_part3_Actions)
	call TriggerRegisterTimerEventSingle(initLevel1_part3, 0.0004)
	call TriggerAddAction(initLevel2, function Init_level2_Actions)
	call TriggerRegisterTimerEventSingle(initLevel2, 0.0005)
	call TriggerAddAction(initLevel2_part2, function Init_level2_part2_Actions)
	call TriggerRegisterTimerEventSingle(initLevel2_part2, 0.0006)
	call TriggerAddAction(initLevel2_part3, function Init_level2_part3_Actions)
	call TriggerRegisterTimerEventSingle(initLevel2_part3, 0.0007)
	call TriggerAddAction(initLevel3, function Init_level3_Actions)
	call TriggerRegisterTimerEventSingle(initLevel3, 0.0008)
	call TriggerAddAction(initLevel4, function Init_level4_Actions)
	call TriggerRegisterTimerEventSingle(initLevel4, 0.0009)
	call TriggerAddAction(initLevel5, function Init_level5_Actions)
	call TriggerRegisterTimerEventSingle(initLevel5, 0.0010)
endfunction
