function Init_level0_Actions takes nothing returns nothing
	local Level level = ForceGetLevel(0)

//start message

//lives earned
	call level.setNbLivesEarned(5)

//start location
	call level.newStart(GetRectMinX(gg_rct_departLvl_0), GetRectMinY(gg_rct_departLvl_0), GetRectMaxX(gg_rct_departLvl_0), GetRectMaxY(gg_rct_departLvl_0))

//end location
	call level.newEnd(10965, -3144, 12308, -3008)

//visibilities
	call level.newVisibilityModifier(12844, -4235, 10710, -3002)
	call level.newVisibilityModifier(12801, -13068, 7568, -3818)

//monsters no move
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 11443, -9111, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 10359, -8351, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 9749, -9053, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 8601, -10085, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 8452, -8908, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 8451, -7787, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 8450, -8350, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 9575, -7192, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 10286, -7046, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 11264, -7177, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 11572, -6124, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 9871, -5490, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 10595, -5886, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 8578, -5857, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 9543, -4283, -1, false)

//monsters simple patrol
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 11148, -9628, 11889, -9628, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 10705, -8819, 10705, -8078, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 9485, -9382, 10226, -9382, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 9278, -9613, 9278, -10354, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 9055, -10354, 9055, -9613, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 8817, -9220, 8076, -9220, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 8076, -8612, 8817, -8612, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 8817, -8105, 8076, -8105, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 8076, -7550, 8817, -7550, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 9294, -6797, 9294, -7410, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 9865, -7410, 9865, -6797, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 10651, -6798, 10651, -7411, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 11276, -6458, 11889, -6458, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 10833, -5390, 10833, -6003, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 10278, -6002, 10278, -5389, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 9395, -5390, 9395, -6003, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 9266, -6002, 9266, -5389, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 9112, -5390, 9112, -6003, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 8561, -5017, 8076, -5017, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 9116, -4110, 9116, -4595, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 9892, -4594, 9892, -4109, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 10811, -4109, 10811, -4594, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 10941, -4594, 10941, -4109, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 8561, -4627, 8100, -4126, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 8555, -5383, 8100, -5971, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 11263, -6025, 11875, -5418, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 11875, -7386, 11263, -6786, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 8100, -6800, 8821, -7440, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 8819, -9587, 8103, -10313, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 10210, -10345, 9476, -9588, false)
endfunction

function Init_level0_part2_Actions takes nothing returns nothing
	local Level level = ForceGetLevel(0)


//monsters simple patrol
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 10221, -8847, 9503, -8080, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 11130, -8841, 11866, -8105, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 11404, -4020, 11889, -4020, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 11889, -3882, 11404, -3882, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 11404, -3715, 11889, -3715, false)

//monsters multiple patrols

//monster spawns

//meteors

//casters

	call level.activate(true)
endfunction


function Init_level1_Actions takes nothing returns nothing
	local Level level = ForceGetLevel(1)

//start message

//lives earned

//start location
	call level.newStart(11387, -3203, 11885, -2691)

//end location
	call level.newEnd(10407, 1586, 10569, 2867)

//visibilities
	call level.newVisibilityModifier(3443, -3899, 12829, 211)
	call level.newVisibilityModifier(6270, -912, 12807, 2924)

//monsters no move
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 10543, -370, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 10090, -361, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 9065, -2692, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 7783, -2629, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 6803, -2896, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 4171, -2616, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 7828, -742, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 7936, -345, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 10241, 2254, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 10552, -2267, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 10192, -2347, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 8455, 1678, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 8971, 1924, -1, false)

//monsters simple patrol
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 11404, -1498, 11889, -1498, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 11889, -891, 11404, -891, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 10731, -627, 10731, -142, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 9916, -142, 9916, -627, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 9329, -1153, 8972, -1153, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 9491, -2445, 9491, -2930, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 8642, -2930, 8642, -2445, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 8777, -2446, 8777, -2931, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 7986, -3058, 7986, -2445, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 8116, -2445, 8116, -3058, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 7306, -3059, 7306, -2446, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 7546, -3059, 7546, -2446, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 6063, -3059, 6063, -2318, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 6202, -2318, 6202, -3059, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 6347, -3059, 6347, -2318, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 6493, -2318, 6493, -3059, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 6629, -3059, 6629, -2318, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 5500, -2318, 5500, -3187, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 5386, -3186, 5386, -2317, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 5266, -2317, 5266, -3186, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 5122, -3187, 5122, -2318, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 4881, -3187, 4881, -2318, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 4762, -2318, 4762, -3187, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 4636, -3186, 4636, -2317, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 4511, -2317, 4511, -3186, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 4368, -1037, 4368, -1394, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 5188, -499, 5188, -142, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 5943, -1037, 5943, -1394, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 6712, -498, 6712, -141, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 9626, 2546, 9626, 1933, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 9730, 1933, 9730, 2546, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 11388, -648, 11863, -164, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 9597, -1533, 9954, -1894, false)
endfunction

function Init_level1_part2_Actions takes nothing returns nothing
	local Level level = ForceGetLevel(1)


//monsters simple patrol
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 8175, 384, 7695, 795, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 7683, 1014, 8268, 453, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 8348, 533, 7704, 1179, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 7711, 1319, 8424, 603, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 8507, 676, 7699, 1497, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 8591, 779, 7687, 1710, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 5745, -777, 5388, -777, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 6156, -779, 6513, -779, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 7281, -762, 6924, -762, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 7518, -1394, 7518, -1037, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 5919, -2317, 5919, -3058, false)

//monsters multiple patrols

//monster spawns

//meteors

//casters

endfunction


function Init_level2_Actions takes nothing returns nothing
	local Level level = ForceGetLevel(2)

//start message

//lives earned

//start location
	call level.newStart(10460, 1884, 11051, 2596)

//end location
	call level.newEnd(2657, 9736, 3791, 9827)

//visibilities
	call level.newVisibilityModifier(12826, 1619, 5536, 12570)
	call level.newVisibilityModifier(6343, 1692, 5620, -102)
	call level.newVisibilityModifier(6269, 5949, 2533, 9926)

//monsters no move
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 10576, 3184, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 10694, 2874, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 10896, 3098, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 10754, 3417, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 10467, 3698, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 10997, 3502, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 10912, 4245, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 11459, 4265, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 11693, 4755, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 12222, 4848, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 11596, 5426, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 11574, 6013, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 10507, 6106, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 10005, 6848, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 10038, 7316, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 10688, 7644, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 11352, 8473, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 11916, 8422, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 12038, 9361, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 11498, 9654, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 10976, 9779, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 10671, 10267, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 10066, 10085, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 10012, 10372, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 9492, 10864, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 8706, 11140, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 8620, 10460, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 8542, 10544, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 8480, 10611, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 8413, 10677, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 8350, 10737, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 8279, 10809, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 8221, 10885, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 7693, 10811, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 7793, 10713, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 7859, 10626, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 7931, 10527, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 7974, 10469, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 8047, 10365, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 7674, 10049, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 6687, 8062, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 7643, 8364, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 7599, 8255, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 7549, 8147, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 7376, 7848, -1, false)
endfunction

function Init_level2_part2_Actions takes nothing returns nothing
	local Level level = ForceGetLevel(2)


//monsters no move
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 7349, 7760, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 8411, 7286, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 8297, 6687, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 8112, 6398, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 9184, 5796, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 8407, 5854, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 9302, 5060, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 9393, 5128, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 9494, 5225, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 9569, 5287, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 9457, 4717, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 9570, 4624, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 9660, 4543, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 9744, 4473, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 9832, 4388, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 8940, 4394, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 6393, 4639, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 6598, 4762, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 6163, 6715, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 6262, 6793, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 6351, 6872, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 6417, 6934, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 6499, 6931, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 6577, 6865, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 6624, 6747, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 5980, 7090, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 5974, 7229, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 4838, 7017, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 4836, 6809, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 4535, 6900, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 5176, 6919, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 8634, 4226, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 8534, 3682, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 6098, 6685, -1, false)

//monsters simple patrol
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 11134, 3555, 10501, 4227, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 10886, 4606, 11397, 3832, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 11783, 4071, 11264, 4885, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 11632, 5098, 12279, 4469, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 11653, 5188, 12388, 5190, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 11664, 5237, 12291, 5865, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 11386, 5361, 11910, 6130, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 11529, 6274, 11120, 5501, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 10493, 5755, 11022, 6532, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 10738, 6647, 10109, 6032, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 9849, 6405, 10489, 6914, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 10481, 7079, 9740, 7079, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 10483, 7275, 9863, 7820, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 9897, 8031, 10601, 7312, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 10636, 7397, 9997, 8099, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 10492, 8188, 11258, 7533, false)
endfunction

function Init_level2_part3_Actions takes nothing returns nothing
	local Level level = ForceGetLevel(2)


//monsters simple patrol
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 10903, 8468, 11376, 7683, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 11530, 7816, 11024, 8593, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 11394, 8855, 11909, 8051, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 12162, 8451, 11400, 8989, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 11404, 9109, 12273, 9109, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 11393, 9211, 12174, 9721, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 11139, 9467, 11391, 10247, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 10725, 9576, 10896, 10381, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 10494, 10498, 10227, 9721, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 9590, 10092, 10105, 10875, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 9859, 11130, 9226, 10366, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 9093, 10617, 9695, 11358, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 8957, 11378, 8957, 10637, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 8833, 10610, 8110, 11392, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 7932, 10883, 8588, 10205, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 8073, 9968, 7431, 10784, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 7298, 10494, 7558, 9718, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 7286, 9579, 7035, 10370, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 6777, 10232, 7043, 9480, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 5882, 8333, 5882, 9586, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 6021, 9713, 6021, 8076, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 6282, 9969, 6282, 7948, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 6415, 7830, 6409, 10096, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 6517, 10091, 6521, 7821, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 6641, 9044, 5772, 9044, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 6641, 8740, 5772, 8740, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 6883, 7821, 6883, 8562, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 7209, 8561, 7209, 7692, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 7546, 7551, 8028, 8420, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 8205, 8166, 7693, 7421, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 7815, 7284, 8426, 7927, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 8556, 7551, 7822, 7194, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 8690, 6897, 7693, 6897, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 8691, 6665, 8065, 5906, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 8453, 5628, 8963, 6408, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 9228, 4889, 10097, 4889, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 9001, 5032, 9598, 5619, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 9085, 4736, 9726, 4223, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 9349, 3955, 8922, 4735, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 8950, 3813, 8698, 4605, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 8324, 4491, 8827, 3568, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 8437, 3465, 8207, 4224, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 8066, 4210, 8066, 3341, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 7928, 3341, 7928, 4210, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 7740, 4082, 7740, 3341, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 7390, 4081, 7390, 3340, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 7025, 3329, 7302, 4093, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 7161, 4217, 6669, 3460, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 6395, 3845, 7046, 4471, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 7153, 4416, 6430, 3640, false)
endfunction

function Init_level2_part4_Actions takes nothing returns nothing
	local Level level = ForceGetLevel(2)


//monsters simple patrol
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 6267, 4099, 6906, 4742, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 6897, 5016, 6028, 5016, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 5900, 5385, 6897, 5385, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 6770, 5886, 5901, 5886, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 5901, 5646, 6770, 5646, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 5897, 6390, 6777, 6133, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 5900, 6538, 6897, 6538, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 5891, 6642, 6536, 7301, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 5535, 6541, 5535, 7410, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 5369, 7410, 5369, 6541, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 4977, 6540, 4977, 7281, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 4675, 7281, 4675, 6540, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 4387, 6541, 4387, 7282, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 10754, 5621, 11256, 6404, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 8710, 5488, 9229, 6269, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 3313, 9391, 3084, 9391, false)

//monsters multiple patrols

//monster spawns

//meteors

//casters

endfunction


function Init_level3_Actions takes nothing returns nothing
	local Level level = ForceGetLevel(3)

//start message

//lives earned
	call level.setNbLivesEarned(2)

//start location
	call level.newStart(2899, 9728, 3471, 10254)

//end location
	call level.newEnd(-39, 6334, 1611, 6356)

//visibilities
	call level.newVisibilityModifier(-12776, 12585, 4330, 10110)
	call level.newVisibilityModifier(7783, 6213, -440, 8543)
	call level.newVisibilityModifier(-493, 7816, 6768, 12590)
	call level.newVisibilityModifier(-4630, 6366, 2431, 11027)
	call level.newVisibilityModifier(-4362, 6823, -5275, 9227)
	call level.newVisibilityModifier(-6139, 8710, -3060, 11961)

//monsters no move
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 3073, 10873, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 3156, 10885, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 1771, 9925, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 1624, 10638, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), -287, 11943, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), -2041, 11134, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), -3725, 10677, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 334, 10930, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), -3424, 11186, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("n"), 1095, 7831, 90, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("n"), 854, 7263, 45, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), -460, 7848, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), -2428, 8442, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), -3967, 7206, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 640, 6775, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 931, 6778, -1, false)

//monsters simple patrol
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 3087, 11390, 3430, 11246, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 2686, 11648, 2452, 11919, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 2189, 11403, 2550, 11141, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 1421, 10878, 1906, 10878, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 1677, 10106, 2290, 10106, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 1031, 9612, 1031, 10097, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -2, 12017, -2, 11660, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -1651, 10380, -1651, 10865, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -883, 10111, -398, 10111, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 13, 10237, 498, 10237, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 641, 8333, 641, 8562, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -1776, 11661, -1776, 12146, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -1016, 10509, -1016, 10994, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -1672, 9356, -1672, 9841, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -1909, 9357, -1909, 9842, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -3364, 10871, -3687, 11039, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -3703, 11268, -3338, 11504, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -4361, 11253, -4596, 11527, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -4861, 9591, -4492, 9332, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -5780, 10987, -6146, 11138, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -6479, 11505, -6479, 11020, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -5766, 9474, -5508, 9847, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 650, 10976, 278, 11280, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -1076, 11890, -1076, 11405, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -2119, 8817, -2119, 8332, false)
endfunction

function Init_level3_part2_Actions takes nothing returns nothing
	local Level level = ForceGetLevel(3)


//monsters simple patrol
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -2681, 8333, -2681, 8690, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -3558, 8583, -3334, 8196, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -3062, 8312, -3200, 8702, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -4877, 7669, -5362, 7669, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -5108, 7038, -4749, 7288, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -3719, 7181, -3719, 7666, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -2933, 6796, -2933, 7281, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -1685, 7410, -1685, 6925, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -330, 7821, -330, 8306, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -654, 8178, -654, 7693, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -1160, 7401, -1406, 7696, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 374, 8033, 123, 8453, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 397, 6894, 1138, 6894, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 1010, 7029, 525, 7029, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 910, 8048, 1024, 8444, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -3453, 7027, -3196, 7406, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -4351, 7281, -4351, 6796, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -1806, 11288, -2291, 11288, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -4494, 10519, -4851, 10519, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -4115, 8067, -4234, 8427, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -4844, 7948, -4844, 8433, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -3367, 10180, -3800, 9915, false)

//monsters multiple patrols

//monster spawns
	call level.monsterSpawns.new("murlocBasHaut", udg_monsterTypes.get("murloc"), "downToUp", 4.500, -11819, 10040, -6846, 11700, false)
	call level.monsterSpawns.new("murlocHautBas", udg_monsterTypes.get("murloc"), "upToDown", 4.500, -11821, 10596, -6866, 12239, false)

//meteors
	call level.meteors.new(-12276, 11049, false)
	call level.meteors.new(-12276, 11193, false)

//casters

endfunction


function Init_level4_Actions takes nothing returns nothing
	local Level level = ForceGetLevel(4)

//start message

//lives earned
	call level.setNbLivesEarned(2)

//start location
	call level.newStart(337, 5698, 1217, 6574)

//end location
	call level.newEnd(-4110, -10458, -3884, -7965)

//visibilities
	call level.newVisibilityModifier(9738, 8926, -350, -13032)
	call level.newVisibilityModifier(-1430, -7420, 2065, -13071)
	call level.newVisibilityModifier(-1054, -7951, -4996, -13073)

//monsters no move
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 1587, 3461, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 1969, 3448, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 2720, 3572, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 2964, 3304, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 3659, 3104, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 3727, 3203, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 3784, 3319, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 3799, 3420, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 3771, 3562, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 3697, 3569, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 4136, 3781, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 4087, 3668, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 4059, 3557, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 4057, 3442, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 4099, 3369, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 4142, 3292, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 4177, 3252, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 3852, 2427, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 3529, 1186, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 3590, 1268, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 3521, 1646, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 3603, 1540, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 2847, 1394, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 1792, 1591, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 1996, 1414, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 1799, 1209, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 1609, 1393, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 776, -1926, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 776, -1619, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 631, -1789, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 935, -1801, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 986, -2708, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 559, -2718, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 787, -2961, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 1008, -4302, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 1011, -3882, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 586, -3857, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 790, -4101, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 564, -4286, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 891, -4824, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 911, -4922, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 918, -5027, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 879, -5115, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 814, -5194, -1, false)
endfunction

function Init_level4_part2_Actions takes nothing returns nothing
	local Level level = ForceGetLevel(4)


//monsters no move
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 732, -5223, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 648, -5227, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 560, -5214, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 472, -5252, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 423, -5297, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 423, -5381, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 485, -5469, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 563, -5522, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 627, -5499, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 702, -5463, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 805, -5481, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 861, -5571, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 841, -5658, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 759, -5730, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 1286, -5543, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 1195, -5518, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 1099, -5483, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 1051, -5391, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 1137, -5034, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 1147, -5108, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 1180, -5172, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 5425, -6474, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 5367, -6028, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 4402, -5386, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 5392, -7772, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 5634, -8180, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 5288, -8006, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 5067, -8087, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 5318, -8268, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 3194, -8817, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 3068, -9266, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 2055, -9352, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 1698, -8954, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 2074, -8567, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), -158, -8941, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), -369, -8715, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), -582, -8941, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), -371, -9239, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 358, -9235, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 445, -9215, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 523, -9213, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 603, -9149, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 650, -9037, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 355, -8664, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 473, -8667, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 580, -8711, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 1030, -8935, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 39, -9885, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 273, -8402, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 298, -8290, -1, false)
endfunction

function Init_level4_part3_Actions takes nothing returns nothing
	local Level level = ForceGetLevel(4)


//monsters no move
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 336, -8192, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 386, -8040, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 413, -7954, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 305, -7571, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 251, -7663, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 197, -7760, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 168, -7850, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 137, -7947, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 121, -8026, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), 89, -8120, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), -175, -8179, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), -149, -8059, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), -133, -7947, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), -84, -7835, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), -2144, -8889, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), -2136, -8996, -1, false)

//monsters simple patrol
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 1395, 4455, 139, 4479, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 404, 4218, 1130, 4207, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 402, 4737, 1147, 4719, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 1004, 3848, 365, 3230, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 538, 3040, 1162, 3680, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 990, 3040, 359, 3706, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 2030, 3065, 1554, 3856, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 1544, 3076, 2036, 3838, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 2562, 3092, 2574, 3852, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 2809, 4108, 2823, 2811, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 3071, 3061, 3078, 3839, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 4348, 2537, 3333, 2556, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 3327, 2318, 4348, 2307, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 4097, 2055, 4097, 2802, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 3586, 2815, 3590, 2059, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 4090, 1779, 3594, 1021, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 4096, 1013, 3594, 1810, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 3196, 1186, 2642, 1854, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 2439, 1648, 3032, 936, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 2458, 1132, 3013, 1854, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 1549, 1797, 2034, 1797, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 2033, 1018, 1548, 1018, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 1265, 1534, 268, 1534, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 397, 1667, 1138, 1667, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 268, 1294, 1265, 1294, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 1137, 1144, 396, 1144, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 1006, 740, 519, 277, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 1023, 267, 520, 758, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 268, -254, 1265, -254, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 1009, -509, 524, -509, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 992, -703, 424, -1174, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 550, -1323, 1106, -848, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 1521, -2835, 12, -2835, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 269, -2560, 1266, -2560, false)
endfunction

function Init_level4_part4_Actions takes nothing returns nothing
	local Level level = ForceGetLevel(4)


//monsters simple patrol
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 268, -3054, 1265, -3054, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 1009, -3332, 524, -3332, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 1239, -3827, 511, -4577, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 278, -4350, 1076, -3631, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 527, -3591, 1254, -4357, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 1020, -4579, 300, -3788, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 1594, -5708, 2297, -4886, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 2517, -5114, 1775, -5849, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 2530, -5632, 1844, -4836, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 1596, -5063, 2271, -5899, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 2040, -4625, 2067, -6131, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 2408, -4998, 2413, -5759, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 3204, -5394, 2991, -4951, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 3329, -5270, 3704, -5002, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 3458, -5368, 3673, -5822, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 3333, -5509, 2973, -5742, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 3569, -5895, 3084, -5895, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 3084, -4863, 3569, -4863, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 3846, -5134, 3846, -5619, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 2825, -5619, 2825, -5134, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 4093, -5602, 4700, -4963, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 4828, -5075, 4216, -5715, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 4352, -5864, 4955, -5210, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 5064, -5695, 4794, -5953, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 4873, -6401, 5502, -5770, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 5615, -5898, 4997, -6504, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 5114, -6636, 5746, -6025, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 5872, -6160, 5250, -6764, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 5801, -7327, 6712, -6971, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 6167, -7688, 6468, -6696, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 6407, -7667, 6136, -6631, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 6692, -7394, 5773, -7033, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 4985, -8833, 4358, -9461, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 4270, -8500, 4852, -9215, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 4698, -9390, 4111, -8681, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 3450, -8958, 3981, -8960, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 3329, -9091, 3335, -9730, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 3197, -8969, 2686, -8954, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 3329, -8823, 3329, -8204, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 2175, -9088, 2403, -9371, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 1914, -9096, 1676, -9350, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 1931, -8834, 1674, -8556, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 2181, -8838, 2421, -8567, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 120, -8845, 120, -9074, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -1071, -8845, -1071, -9074, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 892, -9589, 888, -8334, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 1154, -8588, 1154, -9343, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 248, -9467, 519, -10230, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 262, -10483, -242, -9723, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 15, -9454, 379, -10369, false)
endfunction

function Init_level4_part5_Actions takes nothing returns nothing
	local Level level = ForceGetLevel(4)


//monsters simple patrol
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -1792, -9330, -1792, -8589, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -2046, -8333, -2046, -9586, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -2294, -9586, -2294, -8333, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -2558, -8590, -2558, -9331, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -2674, -9201, -1677, -9201, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -1678, -8711, -2675, -8711, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), 5692, -6848, 5944, -6584, false)

//monsters multiple patrols

//monster spawns
	call level.monsterSpawns.new("murlocs1", udg_monsterTypes.get("murloc"), "leftToRight", 5.000, 971, 1941, 2369, 2897, false)

//meteors

//casters

endfunction


function Init_level5_Actions takes nothing returns nothing
	local Level level = ForceGetLevel(5)

//start message

//lives earned
	call level.setNbLivesEarned(3)

//start location
	call level.newStart(-4574, -9397, -3897, -8509)

//end location
	call level.newEnd(-2278, -5809, -846, -5692)

//visibilities
	call level.newVisibilityModifier(-316, -13024, -12816, -5812)
	call level.newVisibilityModifier(-12751, -6224, -9274, -5473)
	call level.newVisibilityModifier(-2369, -6165, -169, -5531)

//monsters no move
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), -4833, -8949, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), -5440, -9004, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), -6495, -10162, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), -7743, -11596, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), -8422, -11660, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), -8656, -10816, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), -7946, -10329, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), -7813, -9741, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), -8101, -9393, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), -9113, -9477, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), -9606, -9954, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), -9934, -10293, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), -10097, -11452, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), -10823, -12203, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), -11213, -12396, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), -11837, -12058, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), -11738, -10653, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), -10749, -10078, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), -10918, -9609, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), -11268, -9244, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), -11794, -9055, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), -11891, -8996, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), -11610, -7794, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), -9708, -8546, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), -9414, -8269, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), -9926, -7474, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), -10375, -7504, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), -10705, -7258, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), -9967, -6568, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), -8475, -7348, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), -7646, -8571, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), -6867, -8452, -1, false)

//monsters simple patrol
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -5171, -9202, -5171, -8717, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -7911, -11405, -7911, -12018, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -8153, -12018, -8153, -11405, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -8461, -11326, -8946, -11326, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -8947, -11063, -8462, -11063, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -8050, -9938, -7437, -9938, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -8336, -9714, -8336, -9229, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -8835, -9230, -8835, -9715, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -10226, -10516, -9613, -10516, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -9870, -11148, -10355, -11148, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -11032, -12046, -11032, -12659, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -11662, -11706, -12147, -11706, false)
endfunction

function Init_level5_part2_Actions takes nothing returns nothing
	local Level level = ForceGetLevel(5)


//monsters simple patrol
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -12146, -11488, -11661, -11488, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -11533, -11092, -12018, -11092, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -10994, -9847, -10509, -9847, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -11661, -8744, -12146, -8744, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -11461, -8178, -11461, -7565, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -10053, -8206, -10053, -8819, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -9715, -8063, -9102, -8063, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -9101, -7943, -9714, -7943, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -11278, -6402, -11763, -6402, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -11141, -6258, -11141, -5773, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -9300, -6669, -9300, -7154, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -9124, -7155, -9124, -6670, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -6899, -7867, -6414, -7867, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -5503, -6898, -5503, -6541, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -4481, -7053, -4481, -7410, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -3535, -7026, -3535, -6669, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -2426, -7310, -2426, -7667, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -5755, -8852, -5508, -9339, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -6237, -9159, -5838, -9692, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -6509, -9594, -6046, -10065, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -6295, -10108, -6728, -9782, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -6583, -10571, -6986, -10168, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -6666, -10840, -7125, -10431, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -7260, -10572, -6819, -10927, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -7462, -11030, -7057, -11402, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -7199, -11540, -7585, -11160, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -7697, -11292, -7437, -11775, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -8464, -11414, -8821, -11777, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -8346, -10873, -8682, -10488, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -8521, -10275, -8211, -10754, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -8165, -9981, -8068, -10608, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -7682, -9480, -8185, -9735, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -9096, -9871, -9422, -9384, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -9617, -9610, -9353, -9996, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -9609, -10277, -9971, -9843, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -9877, -10900, -10213, -10751, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -10489, -11382, -10137, -11799, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -10266, -12060, -10723, -11691, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -10744, -11912, -10502, -12437, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -11730, -12422, -11514, -11927, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -11406, -10764, -11771, -10363, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -11345, -10125, -11345, -10738, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -10894, -10376, -11125, -10107, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -11270, -9615, -10880, -9232, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -11393, -8973, -11768, -9348, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -11660, -8319, -12018, -8175, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -11532, -8201, -11882, -7669, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -11133, -8342, -11033, -7815, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -10759, -7949, -10876, -8442, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -10623, -8584, -10504, -8062, false)
endfunction

function Init_level5_part3_Actions takes nothing returns nothing
	local Level level = ForceGetLevel(5)


//monsters simple patrol
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -10239, -8191, -10360, -8705, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -9473, -8578, -9804, -8084, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -9980, -7810, -9610, -7435, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -10121, -7172, -10234, -7677, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -10505, -7535, -10505, -7047, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -10641, -6929, -11001, -7300, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -11135, -7160, -10893, -6791, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -11148, -6667, -11522, -7035, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -11643, -6678, -11154, -6486, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -11161, -6363, -11561, -5898, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -10625, -6028, -10874, -6410, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -10619, -6547, -10383, -6159, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -10126, -6279, -10235, -6666, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -9849, -6937, -9732, -6390, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -9502, -6553, -9669, -7134, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -8617, -6836, -8959, -7270, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -8205, -7184, -8443, -7683, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -8316, -7808, -7945, -7448, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -7811, -7572, -8178, -7938, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -7582, -8064, -8037, -8376, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -7823, -8588, -7458, -8111, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -7292, -8201, -7185, -8581, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -6670, -8455, -6984, -7948, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -6411, -7699, -6765, -7557, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -6634, -7290, -6296, -7431, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -6143, -7323, -6386, -6906, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -6019, -6659, -5900, -7044, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -5115, -7052, -5003, -6668, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -4737, -6929, -4990, -7306, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -3843, -7177, -3929, -6761, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -3200, -7175, -2997, -6831, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -2592, -7115, -2817, -7418, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -2143, -7025, -1938, -7296, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -1672, -7167, -1905, -6917, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -1784, -6647, -1555, -6922, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -1523, -6355, -1166, -6355, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -1550, -6353, -1907, -6353, false)

//monsters multiple patrols

//monster spawns

//meteors

//casters

endfunction


function Init_level6_Actions takes nothing returns nothing
	local Level level = ForceGetLevel(6)

//start message

//lives earned
	call level.setNbLivesEarned(3)

//start location
	call level.newStart(-1876, -5948, -1204, -5314)

//end location
	call level.newEnd(-5151, -5711, -5053, -4287)

//visibilities
	call level.newVisibilityModifier(148, -6409, -4408, 7044)
	call level.newVisibilityModifier(-4138, -6276, -5367, -3985)

//monsters no move

//monsters simple patrol

//monsters multiple patrols

//monster spawns
	call level.monsterSpawns.new("murlocGD", udg_monsterTypes.get("murloc"), "leftToRight", 12.000, -2616, -5043, -914, 5293, false)
	call level.monsterSpawns.new("murlocDG", udg_monsterTypes.get("murloc"), "rightToLeft", 12.000, -2183, -5047, -314, 5304, false)
	call level.monsterSpawns.new("murlocBH", udg_monsterTypes.get("murloc"), "downToUp", 5.000, -4015, -5880, -2897, 6048, false)

//meteors

//casters

endfunction


function Init_level7_Actions takes nothing returns nothing
	local Level level = ForceGetLevel(7)

//start message

//lives earned
	call level.setNbLivesEarned(6)

//start location
	call level.newStart(-5565, -5313, -4955, -4679)

//end location
	call level.newEnd(-11367, -173, -10880, -80)

//visibilities
	call level.newVisibilityModifier(-1588, -7587, -12801, 10502)

//monsters no move
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), -5957, -5181, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), -6069, -4873, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), -6428, -5058, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), -7023, -4721, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), -7319, -4985, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), -8076, -4571, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), -8337, -4837, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), -8898, -4688, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), -8902, -4367, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), -9399, -4601, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), -10595, -4574, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), -10892, -4299, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), -11265, -4538, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), -11597, -4369, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), -11504, -3913, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), -11808, -2902, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), -11522, -3240, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), -11222, -2807, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), -11216, -2413, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), -11394, -2563, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), -10305, -2747, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), -10016, -2539, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), -9688, -2846, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), -8116, -2805, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), -7646, -3144, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), -7181, -3051, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), -7064, -3332, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), -5832, -3266, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), -5669, -2942, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), -5378, -2871, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), -5482, -2350, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), -6397, 2967, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), -4941, 3568, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), -5061, 4333, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), -5368, 4653, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), -5691, 5016, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), -6237, 4961, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), -6422, 5937, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), -5214, 6129, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), -5299, 6599, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), -6197, 7045, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), -7413, 7117, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), -7621, 7731, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), -7119, 8632, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), -7316, 8737, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), -11581, 9450, -1, false)
endfunction

function Init_level7_part2_Actions takes nothing returns nothing
	local Level level = ForceGetLevel(7)


//monsters no move
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), -12035, 8928, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), -11781, 7659, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), -7637, 2201, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), -11288, 2602, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), -11427, 2695, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), -10926, 2364, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), -11027, 2300, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), -11164, 2250, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), -11254, 2258, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), -11314, 2292, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), -10092, -1796, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), -10087, -1503, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), -10329, -1647, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), -10577, -1656, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), -10440, -1407, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), -10742, -1436, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), -10898, -1196, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), -11067, -1327, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), -10896, -928, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), -11124, -921, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), -11318, -892, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), -11008, -627, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), -11235, -583, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("bush"), -11204, 2550, -1, false)

//monsters simple patrol
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -6279, -4494, -6279, -5363, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -6677, -5235, -6677, -4494, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -7177, -4366, -7177, -5235, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -7703, -5106, -7703, -4365, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -8203, -4238, -8203, -5107, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -8706, -4978, -8706, -4237, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -9075, -4109, -9075, -4978, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -9527, -4978, -9527, -4237, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -9980, -4110, -9980, -4979, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -10433, -4850, -10433, -4109, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -10759, -4110, -10759, -4851, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -12019, -3414, -11278, -3414, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -11069, -3059, -11069, -2190, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -10809, -2189, -10809, -2930, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -10454, -3058, -10454, -2189, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -9868, -2317, -9868, -3186, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -9308, -3187, -9308, -2446, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -9005, -2446, -9005, -3187, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -8675, -3186, -8675, -2445, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -8250, -2446, -8250, -3315, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -7789, -3443, -7789, -2574, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -7334, -2701, -7334, -3570, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -6952, -3571, -6952, -2830, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -6702, -2830, -6702, -3571, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -6473, -3571, -6473, -2830, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -6043, -2574, -6043, -3571, false)
endfunction

function Init_level7_part3_Actions takes nothing returns nothing
	local Level level = ForceGetLevel(7)


//monsters simple patrol
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -5006, -1628, -5747, -1628, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -5747, -1461, -5006, -1461, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -5005, -1304, -5746, -1304, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -5747, -1132, -5006, -1132, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -5005, -971, -5746, -971, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -5746, -820, -5005, -820, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -5005, -676, -5746, -676, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -5746, -530, -5005, -530, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -5006, -369, -5747, -369, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -5747, -208, -5006, -208, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -5747, -1780, -5006, -1780, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -5005, 322, -5746, 322, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -5746, 458, -5005, 458, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -5006, 602, -5747, 602, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -5746, 740, -5005, 740, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -5006, 884, -5747, 884, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -5747, 1016, -5006, 1016, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -5005, 1146, -5746, 1146, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -5746, 1285, -5005, 1285, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -5005, 1443, -5746, 1443, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -5747, 1570, -5006, 1570, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -5005, 1660, -5746, 1660, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -6930, -5249, -6878, -4472, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -7377, -4341, -7537, -5119, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -7979, -5123, -7934, -4361, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -8458, -4233, -8510, -5107, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -9308, -4992, -9244, -4114, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -9659, -4130, -9819, -5005, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -10266, -4848, -10173, -4092, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -11037, -3982, -11037, -4851, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -11149, -3966, -11540, -4733, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -12014, -3685, -11291, -3563, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -12018, -3766, -11149, -3766, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -11171, -3891, -11876, -4346, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -11290, -3216, -11986, -2454, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -11767, -2418, -11151, -3080, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -10679, -3047, -10586, -2165, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -10116, -2296, -10217, -3078, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -9669, -3208, -9488, -2431, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -9160, -2446, -9160, -3187, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -8841, -3187, -8841, -2446, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -8436, -2445, -8436, -3314, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -8063, -3330, -7945, -2563, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -7505, -2697, -7593, -3451, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -6265, -2668, -6238, -3590, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -5979, -2452, -5634, -3466, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -5385, -3207, -5876, -2420, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -5870, -2294, -5137, -2829, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -5005, -2197, -5874, -2197, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -6030, 2774, -6643, 2774, false)
endfunction

function Init_level7_part4_Actions takes nothing returns nothing
	local Level level = ForceGetLevel(7)


//monsters simple patrol
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -5492, 3085, -5492, 3570, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -5235, 3795, -4750, 3795, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -4750, 4054, -5235, 4054, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -5965, 4749, -5965, 5234, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -6285, 5693, -6770, 5693, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -6157, 6257, -6157, 5772, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -5925, 5773, -5925, 6258, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -5694, 6257, -5694, 5772, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -5618, 6281, -5005, 6281, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -6378, 6796, -6378, 7409, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -6663, 7409, -6663, 6924, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -6865, 6924, -6865, 7409, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -7179, 7281, -7179, 6796, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -7960, 6413, -7960, 6898, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -8242, 6898, -8242, 6413, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -8717, 7327, -9330, 7327, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -9331, 7504, -8718, 7504, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -8616, 7565, -8616, 8050, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -8377, 8050, -8377, 7565, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -8104, 7564, -8104, 8049, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -7844, 8049, -7844, 7564, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -7410, 8205, -6925, 8205, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -6925, 8416, -7410, 8416, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -7838, 9100, -7838, 9585, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -8077, 9586, -8077, 9101, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -8271, 9101, -8271, 9586, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -8488, 8972, -8488, 9585, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -9462, 8945, -9462, 8460, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -9853, 8333, -9853, 8818, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -10057, 8817, -10057, 8204, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -10270, 8204, -10270, 8817, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -11400, 9229, -11400, 9714, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -11790, 8646, -12275, 8646, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -12275, 8452, -11790, 8452, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -11522, 8050, -11522, 7565, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -11039, 7922, -11039, 7309, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -5758, 1917, -5382, 2290, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -5641, 2429, -6030, 2050, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -6395, 2294, -5925, 2642, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -5909, 2860, -6471, 3282, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -5882, 2954, -6076, 3448, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -5792, 3459, -5538, 2950, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -5365, 3583, -5037, 3087, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -5002, 3201, -5230, 3707, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -5372, 4340, -5019, 4598, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -5386, 4987, -5624, 4606, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -6526, 4982, -6169, 5382, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -6292, 5609, -6646, 5256, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -5634, 6258, -5254, 5879, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -5755, 6414, -5388, 6771, false)
endfunction

function Init_level7_part5_Actions takes nothing returns nothing
	local Level level = ForceGetLevel(7)


//monsters simple patrol
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -5643, 7030, -5884, 6543, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -6143, 6671, -5899, 7168, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -7308, 6635, -7655, 7055, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -7696, 6525, -7800, 6907, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -8696, 6521, -8461, 6890, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -8724, 7035, -8946, 6923, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -8720, 7555, -9064, 7945, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -7669, 8056, -7312, 7665, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -7055, 7787, -7527, 8193, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -7537, 8836, -7057, 8945, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -7663, 8964, -7426, 9467, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -8592, 8953, -8935, 9360, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -9090, 9207, -8852, 8838, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -9002, 8599, -9326, 9095, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -9667, 8332, -9667, 8945, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -10480, 8331, -10381, 8823, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -10736, 8578, -10508, 9091, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -10877, 8834, -10627, 9337, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -10893, 9472, -11006, 8958, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -11261, 9084, -11139, 9615, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -11527, 9083, -11872, 9481, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -12127, 9287, -11674, 8946, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -11670, 8257, -12253, 8287, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -11660, 8176, -12141, 7942, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -12029, 7804, -11543, 8143, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -11284, 7921, -11282, 7437, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -10882, 7289, -10764, 7796, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -10501, 7664, -10751, 7068, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -10618, 6927, -10371, 7413, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -9811, 5517, -9811, 6002, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -9594, 6002, -9594, 5517, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -9385, 5517, -9385, 6002, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -9201, 6002, -9201, 5517, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -9063, 5497, -8749, 5882, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -8603, 5623, -8814, 5376, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -8333, 5485, -8688, 5139, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -8433, 4982, -8081, 5368, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -7924, 5219, -8191, 4732, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -8048, 4595, -7691, 4970, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -8051, 4498, -7438, 4498, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -8155, 4455, -7559, 4100, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -7822, 3966, -8189, 4336, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -8263, 3113, -7862, 3538, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -7703, 3351, -8103, 2964, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -7997, 2830, -7591, 3212, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -7442, 3061, -7826, 2692, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -7795, 2616, -7182, 2616, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -7181, 2515, -7794, 2515, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -7795, 2433, -7182, 2433, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -7996, 2436, -7817, 1943, false)
endfunction

function Init_level7_part6_Actions takes nothing returns nothing
	local Level level = ForceGetLevel(7)


//monsters simple patrol
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -7961, 1781, -8182, 2312, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -8268, 2289, -8268, 1804, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -8445, 1805, -8445, 2290, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -8592, 2313, -8690, 1930, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -10111, 2690, -10226, 2437, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -8590, 1148, -8694, 885, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -11133, 3213, -11164, 4344, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -11010, 4344, -10983, 3199, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -10722, 4341, -10736, 3205, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -10594, 3205, -10591, 4353, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -10479, 4341, -10468, 3201, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -10363, 3192, -10360, 4362, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -10115, 3205, -10114, 4330, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -11374, 3213, -11374, 4338, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -11476, 4337, -11476, 3212, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -11562, 3213, -11562, 4338, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -11659, 4338, -11659, 3213, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -9987, 3196, -9984, 4332, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -9854, 4335, -9833, 3221, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -9631, 4327, -9611, 3199, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -9483, 3208, -9493, 4338, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -9401, 4338, -9366, 3203, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -9253, 3212, -9274, 4353, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -8985, 3205, -8960, 4338, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -8834, 4335, -8822, 3222, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -8725, 3221, -8712, 4344, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -8588, 4341, -8584, 3217, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -8497, 3215, -8491, 4344, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -8297, 3205, -8275, 4356, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -8822, 2414, -8940, 1941, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -9332, 2053, -8974, 2433, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -9225, 2551, -9470, 2049, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -9584, 2168, -9517, 2677, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -9735, 2682, -9978, 2286, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -10536, 2423, -10552, 2941, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -10771, 2941, -10749, 2449, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -10890, 2439, -11239, 2944, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -10768, 2281, -11002, 1798, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -10879, 1685, -10642, 2164, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -10611, 1670, -10297, 2149, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -10252, 2034, -10343, 1547, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -10231, 1535, -9901, 2009, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -9860, 1910, -9979, 1406, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -9844, 1284, -9534, 1874, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -9359, 1642, -9594, 1145, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -9336, 1039, -9232, 1527, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -9129, 1525, -9137, 1041, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -9072, 1031, -8854, 1405, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -8178, 642, -7983, 1146, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -7694, 1020, -7926, 506, false)
endfunction

function Init_level7_part7_Actions takes nothing returns nothing
	local Level level = ForceGetLevel(7)


//monsters simple patrol
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -7616, 527, -7610, 1022, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -7535, 517, -7392, 1022, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -7251, 1019, -7304, 392, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -7145, 255, -7041, 875, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -6917, 760, -7020, 244, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -6900, 128, -6670, 649, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -6783, 11, -6429, 426, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -6771, -351, -6414, -351, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -6413, -865, -6770, -865, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -6771, -1289, -6414, -1289, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -6413, -1736, -6770, -1736, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -6769, -1915, -6441, -2270, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -6930, -1938, -7223, -2261, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -7661, -1643, -6938, -1662, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -6934, -1416, -7660, -1392, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -7653, -1058, -6933, -1060, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -6942, -716, -7659, -662, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -7647, -346, -6929, -381, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -6926, -69, -7667, -69, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -7663, -1917, -7340, -2261, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -7842, -1922, -8138, -2237, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -7821, -1604, -8178, -1604, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -8179, -1134, -7822, -1134, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -7821, -618, -8178, -618, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -8176, -245, -7861, 73, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -8332, -262, -8643, 92, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -8691, -628, -8334, -628, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -8334, -1183, -8691, -1183, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -8690, -1699, -8333, -1699, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -8694, -1923, -8359, -2277, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -8773, -1933, -8773, -2290, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -8846, -1574, -9203, -1574, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -9203, -1115, -8846, -1115, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -9203, -594, -8846, -594, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -9199, -272, -8873, 73, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -9355, -254, -9663, 88, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -9358, -469, -9715, -469, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -9714, -849, -9357, -849, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -9358, -1235, -9715, -1235, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("murloc"), -9720, -1404, -9482, -1792, false)

//monsters multiple patrols

//monster spawns

//meteors

//casters

endfunction




function InitTrig_Init_levels takes nothing returns nothing
	local trigger initLevel0 = CreateTrigger()
	local trigger initLevel0_part2 = CreateTrigger()
	local trigger initLevel1 = CreateTrigger()
	local trigger initLevel1_part2 = CreateTrigger()
	local trigger initLevel2 = CreateTrigger()
	local trigger initLevel2_part2 = CreateTrigger()
	local trigger initLevel2_part3 = CreateTrigger()
	local trigger initLevel2_part4 = CreateTrigger()
	local trigger initLevel3 = CreateTrigger()
	local trigger initLevel3_part2 = CreateTrigger()
	local trigger initLevel4 = CreateTrigger()
	local trigger initLevel4_part2 = CreateTrigger()
	local trigger initLevel4_part3 = CreateTrigger()
	local trigger initLevel4_part4 = CreateTrigger()
	local trigger initLevel4_part5 = CreateTrigger()
	local trigger initLevel5 = CreateTrigger()
	local trigger initLevel5_part2 = CreateTrigger()
	local trigger initLevel5_part3 = CreateTrigger()
	local trigger initLevel6 = CreateTrigger()
	local trigger initLevel7 = CreateTrigger()
	local trigger initLevel7_part2 = CreateTrigger()
	local trigger initLevel7_part3 = CreateTrigger()
	local trigger initLevel7_part4 = CreateTrigger()
	local trigger initLevel7_part5 = CreateTrigger()
	local trigger initLevel7_part6 = CreateTrigger()
	local trigger initLevel7_part7 = CreateTrigger()
	call TriggerAddAction(initLevel0, function Init_level0_Actions)
	call TriggerRegisterTimerEventSingle(initLevel0, 0.0000)
	call TriggerAddAction(initLevel0_part2, function Init_level0_part2_Actions)
	call TriggerRegisterTimerEventSingle(initLevel0_part2, 0.0001)
	call TriggerAddAction(initLevel1, function Init_level1_Actions)
	call TriggerRegisterTimerEventSingle(initLevel1, 0.0002)
	call TriggerAddAction(initLevel1_part2, function Init_level1_part2_Actions)
	call TriggerRegisterTimerEventSingle(initLevel1_part2, 0.0003)
	call TriggerAddAction(initLevel2, function Init_level2_Actions)
	call TriggerRegisterTimerEventSingle(initLevel2, 0.0004)
	call TriggerAddAction(initLevel2_part2, function Init_level2_part2_Actions)
	call TriggerRegisterTimerEventSingle(initLevel2_part2, 0.0005)
	call TriggerAddAction(initLevel2_part3, function Init_level2_part3_Actions)
	call TriggerRegisterTimerEventSingle(initLevel2_part3, 0.0006)
	call TriggerAddAction(initLevel2_part4, function Init_level2_part4_Actions)
	call TriggerRegisterTimerEventSingle(initLevel2_part4, 0.0007)
	call TriggerAddAction(initLevel3, function Init_level3_Actions)
	call TriggerRegisterTimerEventSingle(initLevel3, 0.0008)
	call TriggerAddAction(initLevel3_part2, function Init_level3_part2_Actions)
	call TriggerRegisterTimerEventSingle(initLevel3_part2, 0.0009)
	call TriggerAddAction(initLevel4, function Init_level4_Actions)
	call TriggerRegisterTimerEventSingle(initLevel4, 0.0010)
	call TriggerAddAction(initLevel4_part2, function Init_level4_part2_Actions)
	call TriggerRegisterTimerEventSingle(initLevel4_part2, 0.0011)
	call TriggerAddAction(initLevel4_part3, function Init_level4_part3_Actions)
	call TriggerRegisterTimerEventSingle(initLevel4_part3, 0.0012)
	call TriggerAddAction(initLevel4_part4, function Init_level4_part4_Actions)
	call TriggerRegisterTimerEventSingle(initLevel4_part4, 0.0013)
	call TriggerAddAction(initLevel4_part5, function Init_level4_part5_Actions)
	call TriggerRegisterTimerEventSingle(initLevel4_part5, 0.0014)
	call TriggerAddAction(initLevel5, function Init_level5_Actions)
	call TriggerRegisterTimerEventSingle(initLevel5, 0.0015)
	call TriggerAddAction(initLevel5_part2, function Init_level5_part2_Actions)
	call TriggerRegisterTimerEventSingle(initLevel5_part2, 0.0016)
	call TriggerAddAction(initLevel5_part3, function Init_level5_part3_Actions)
	call TriggerRegisterTimerEventSingle(initLevel5_part3, 0.0017)
	call TriggerAddAction(initLevel6, function Init_level6_Actions)
	call TriggerRegisterTimerEventSingle(initLevel6, 0.0018)
	call TriggerAddAction(initLevel7, function Init_level7_Actions)
	call TriggerRegisterTimerEventSingle(initLevel7, 0.0019)
	call TriggerAddAction(initLevel7_part2, function Init_level7_part2_Actions)
	call TriggerRegisterTimerEventSingle(initLevel7_part2, 0.0020)
	call TriggerAddAction(initLevel7_part3, function Init_level7_part3_Actions)
	call TriggerRegisterTimerEventSingle(initLevel7_part3, 0.0021)
	call TriggerAddAction(initLevel7_part4, function Init_level7_part4_Actions)
	call TriggerRegisterTimerEventSingle(initLevel7_part4, 0.0022)
	call TriggerAddAction(initLevel7_part5, function Init_level7_part5_Actions)
	call TriggerRegisterTimerEventSingle(initLevel7_part5, 0.0023)
	call TriggerAddAction(initLevel7_part6, function Init_level7_part6_Actions)
	call TriggerRegisterTimerEventSingle(initLevel7_part6, 0.0024)
	call TriggerAddAction(initLevel7_part7, function Init_level7_part7_Actions)
	call TriggerRegisterTimerEventSingle(initLevel7_part7, 0.0025)
endfunction

