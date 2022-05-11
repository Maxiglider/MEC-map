function Init_level0_Actions takes nothing returns nothing
	local Level level = ForceGetLevel(0)

//start message

//lives earned
	call level.setNbLivesEarned(5)

//start location
	call level.newStart(GetRectMinX(gg_rct_departLvl_0), GetRectMinY(gg_rct_departLvl_0), GetRectMaxX(gg_rct_departLvl_0), GetRectMaxY(gg_rct_departLvl_0))

//end location
	call level.newEnd(-5150, 9705, -5081, 10778)

//visibilities
	call level.newVisibilityModifier(-4979, 9513, -11943, 11968)
	call level.newVisibilityModifier(-6318, 8998, -11995, 9588)
	call level.newVisibilityModifier(-6483, 8921, -5656, 9577)

//monsters no move

//monsters simple patrol
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -8864, 10610, -8864, 9997, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -8119, 9997, -8119, 10610, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("g"), -8468, 9996, -8468, 10609, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -9385, 9868, -9385, 10737, false)

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
	call level.newStart(-5087, 9877, -4476, 10603)

//end location
	call level.newEnd(-8857, 4803, -7791, 4958)

//visibilities
	call level.newVisibilityModifier(-5305, 11186, -2699, 8052)
	call level.newVisibilityModifier(-2797, 11188, -2327, 7923)
	call level.newVisibilityModifier(-11456, 9275, -3613, 6837)
	call level.newVisibilityModifier(-5662, 9505, -5319, 9212)
	call level.newVisibilityModifier(-9910, 7207, -6345, 5737)
	call level.newVisibilityModifier(-9442, 5865, -6902, 4609)

//monsters no move
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), -4164, 8931, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), -3258, 9389, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), -4699, 7817, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), -7544, 7346, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), -7795, 7061, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), -8933, 6896, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), -8315, 5379, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), -9208, 6908, -1, false)

//monsters simple patrol
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -3201, 10253, -3201, 10738, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("g"), -3781, 8461, -3781, 8946, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -4269, 9923, -3895, 10297, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("g"), -6555, 6931, -6884, 7248, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -3058, 9925, -2701, 9925, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("g"), -8050, 8333, -7437, 8333, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -4521, 8972, -4521, 9585, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("g"), -8691, 5191, -7950, 5191, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -4879, 8845, -5188, 9269, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -2958, 9218, -3571, 9218, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -4995, 7564, -4995, 8049, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -5554, 6925, -5554, 7538, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -5829, 6925, -5829, 7538, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -7795, 7804, -7054, 7804, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -8846, 7457, -9331, 7457, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -8973, 6229, -9330, 6229, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -8756, 5517, -8756, 6002, false)

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
	call level.newStart(-8624, 4335, -8001, 4871)

//end location
	call level.newEnd(-11416, 970, -10355, 1153)

//visibilities
	call level.newVisibilityModifier(-11576, 6996, -6871, 1320)
	call level.newVisibilityModifier(-11698, 1476, -9827, 788)

//monsters no move
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), -9987, 4376, -1, false)

//monsters simple patrol
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -9583, 3534, -8086, 3505, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -9596, 3266, -8099, 3275, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -9583, 2951, -8094, 2951, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -9582, 2653, -8083, 2656, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -9997, 2448, -10354, 2448, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -9998, 3200, -10355, 3200, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -9870, 3977, -10227, 3977, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -10994, 3357, -10509, 3357, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -10510, 3645, -10995, 3645, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -10230, 4734, -10710, 5220, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -10638, 2812, -10995, 2812, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -9581, 3824, -8082, 3828, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -10637, 1557, -11122, 1557, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -10765, 2430, -11250, 2430, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -8084, 3698, -9592, 3684, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -8087, 3430, -9586, 3383, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -8087, 3177, -9580, 3139, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -8083, 2865, -9581, 2809, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("g"), -10254, 4424, -10739, 4424, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("g"), -10766, 1922, -11123, 1922, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -8081, 2549, -9578, 2532, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("g"), -8563, 3818, -8078, 3818, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("g"), -8589, 2877, -9074, 2877, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("g"), -9101, 3302, -9586, 3302, false)

//monsters multiple patrols

//monster spawns

//meteors

//casters

endfunction


function Init_level3_Actions takes nothing returns nothing
	local Level level = ForceGetLevel(3)

//start message

//lives earned

//start location
	call level.newStart(-11237, 541, -10532, 1225)

//end location
	call level.newEnd(-10815, -6979, -9648, -6892)

//visibilities
	call level.newVisibilityModifier(-11721, 1319, -7746, -3373)
	call level.newVisibilityModifier(-9034, -3226, -11776, -6344)
	call level.newVisibilityModifier(-11886, -6324, -9494, -7880)

//monsters no move
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), -10602, -3385, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), -10706, -1200, -1, false)

//monsters simple patrol
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -10619, -127, -11122, -109, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -10637, -595, -11122, -595, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -9230, -318, -9715, -318, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -9714, -671, -9229, -671, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -9229, -1019, -9714, -1019, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("g"), -8562, -1738, -8077, -1738, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("g"), -8078, -2105, -8563, -2105, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -10604, -2190, -10604, -2803, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -10893, -3161, -11250, -3161, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -9362, -1934, -9362, -3059, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -9068, -3059, -9068, -1934, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -10099, -1934, -10099, -3059, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("g"), -9731, -3043, -9721, -1972, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("g"), -9547, -3008, -9548, -1978, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -9773, -243, -9773, 241, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -10766, -2854, -11251, -2854, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("g"), -9949, -3043, -9945, -1953, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -10485, -6523, -9995, -6532, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -10481, -2802, -10481, -2189, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -10444, -1038, -10444, -1523, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -9742, -395, -10483, -395, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -9729, -896, -10479, -912, false)

//monsters multiple patrols

//monster spawns
	call level.monsterSpawns.new("crabe1", udg_monsterTypes.get("c"), "leftToRight", 1.800, -11439, -6057, -9377, -4539, false)
	call level.monsterSpawns.new("crabe2", udg_monsterTypes.get("c"), "rightToLeft", 1.800, -11078, -6075, -9067, -4557, false)

//meteors

//casters

endfunction


function Init_level4_Actions takes nothing returns nothing
	local Level level = ForceGetLevel(4)

//start message

//lives earned
	call level.setNbLivesEarned(2)

//start location
	call level.newStart(-10613, -7534, -9875, -6806)

//end location
	call level.newEnd(-3419, 5622, -3307, 6855)

//visibilities
	call level.newVisibilityModifier(-9743, -7936, -8401, -5489)
	call level.newVisibilityModifier(-9290, -3252, -7810, -7145)
	call level.newVisibilityModifier(-8063, -6512, -7136, -5339)
	call level.newVisibilityModifier(-8032, -5559, -6393, -3144)
	call level.newVisibilityModifier(-8437, -4125, -4733, 7134)
	call level.newVisibilityModifier(-2268, 3609, -5289, -1255)
	call level.newVisibilityModifier(-3295, 3340, -5042, 8364)

//monsters no move
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), -7734, -4994, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), -7484, -5152, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), -7306, -4673, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), -7618, -4514, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), -5531, -1944, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), -5788, -2091, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), -6271, -1746, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), -6421, -2116, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), -6343, -3042, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), -5795, -2974, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), -5459, -3125, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), -6118, -3453, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), -4468, -641, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), -4159, -650, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), -4574, 6125, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), -5548, -2468, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), -6204, -2578, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), -6259, 107, 0, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), -6388, 89, 180, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), -3989, 2550, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), -5455, 3504, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), -4758, 4462, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), -4445, 4339, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), -3603, 23, -45, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), -3779, 198, 135, false)

//monsters simple patrol
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -6040, 909, -6040, 1394, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -5111, -2965, -6776, -2187, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -6782, -2727, -5104, -2060, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -5748, -3709, -6778, -2940, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -6771, -1757, -5119, -2174, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -5111, -1886, -6780, -2828, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("g"), -9595, -7411, -9595, -6926, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("g"), -9000, -6541, -9000, -7026, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("g"), -8727, -6542, -8727, -7027, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("g"), -8205, -6221, -8690, -6221, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("g"), -8109, -6131, -8109, -5518, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("g"), -7039, -4466, -7039, -3853, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("g"), -6541, -3746, -7026, -3746, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -5261, 3390, -5874, 3390, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -6029, 307, -6642, 307, false)
endfunction

function Init_level4_part2_Actions takes nothing returns nothing
	local Level level = ForceGetLevel(4)


//monsters simple patrol
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -6030, -80, -6643, -80, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -5658, -3699, -5129, -2833, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -5123, -2233, -6773, -1947, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -6758, -1854, -5117, -1663, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -5985, 397, -5985, 754, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -6764, -2340, -5128, -2311, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -5687, 652, -5687, 1265, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -5262, 502, -5619, 502, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -5158, -2664, -6772, -3200, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -5085, 369, -5085, -115, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -4978, -399, -4621, -399, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -4321, -397, -4321, -882, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -5165, -3682, -6743, -2607, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -3598, -115, -4083, -115, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -2958, 810, -3827, 810, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -3215, 1165, -3215, 1650, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -3567, 668, -3208, 1017, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -2930, 2253, -2445, 2253, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -3039, 2317, -3039, 2802, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -3425, 2700, -3425, 3441, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -3538, 2701, -3538, 3442, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -3705, 3441, -3705, 2700, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -4141, 2674, -4141, 2189, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("g"), -4514, 2316, -4514, 2929, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("g"), -4758, 2930, -4758, 2317, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("g"), -4946, 2317, -4946, 2930, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("g"), -5195, 2930, -5195, 2317, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -5517, 4221, -5874, 4221, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -5082, 4594, -5082, 4109, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -4595, 5352, -4238, 5352, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("g"), -4723, 4770, -4238, 4770, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("g"), -7181, -5001, -7918, -4714, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("g"), -5747, -1106, -5262, -1106, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("g"), -6029, -1102, -6514, -1102, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("g"), -6509, -1462, -5270, -1475, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -4595, 5156, -4238, 5156, false)

//monsters multiple patrols

//monster spawns

//meteors

//casters

endfunction


function Init_level5_Actions takes nothing returns nothing
	local Level level = ForceGetLevel(5)

//start message

//lives earned
	call level.setNbLivesEarned(2)

//start location
	call level.newStart(-3543, 5919, -2827, 6641)

//end location
	call level.newEnd(5139, 8499, 5293, 9428)

//visibilities
	call level.newVisibilityModifier(3220, 5335, -5973, 12018)
	call level.newVisibilityModifier(-3660, 5465, 879, 2088)
	call level.newVisibilityModifier(455, 3553, 4132, 5843)
	call level.newVisibilityModifier(3947, 4383, 5628, 5882)
	call level.newVisibilityModifier(5873, 8030, -432, 12051)

//monsters no move
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), 2216, 6036, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), 2498, 6124, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), 1833, 6287, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), 3308, 4497, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), 3959, 5305, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), -468, 4712, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), 451, 2970, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), -550, 5449, 0, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), -323, 5462, 180, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), -2290, 6275, 180, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), -1919, 6644, -135, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), -2658, 5920, 45, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), -1929, 5915, 135, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), -2659, 6620, -45, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), 822, 6382, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), 355, 6136, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), -17, 6408, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("indomptable"), 4927, 8966, 180, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), 1878, 8623, 0, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), 1798, 8690, 90, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), 1711, 8591, 180, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), 1800, 8511, 270, false)

//monsters simple patrol
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 2060, 6636, 2914, 6081, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 2749, 6583, 2174, 5919, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 1960, 6004, 2437, 6801, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 2914, 6369, 2441, 5778, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 2408, 6731, 2911, 6279, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 2445, 5275, 3058, 5275, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 2444, 5093, 3057, 5093, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -1021, 9494, -1337, 10050, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -1614, 3469, -1614, 3826, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 2102, 4183, 2436, 3782, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("g"), -656, 4239, -618, 3052, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 3084, 4657, 4337, 4657, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 3385, 4849, 3385, 3980, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 2701, 4036, 3442, 4036, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 3724, 5082, 4337, 5082, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 3852, 4859, 4337, 4859, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 4428, 5618, 4428, 5133, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 4699, 5132, 4699, 5617, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -856, 7215, -421, 7608, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -1280, 8058, -1616, 7597, false)
endfunction

function Init_level5_part2_Actions takes nothing returns nothing
	local Level level = ForceGetLevel(5)


//monsters simple patrol
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -1335, 7478, -981, 7993, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -1529, 4471, -1889, 4827, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -1522, 4229, -1882, 3869, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -957, 3853, -957, 4210, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -269, 6752, -626, 6752, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -341, 4209, -341, 3852, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -627, 6868, -270, 6868, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 268, 3854, 625, 3854, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -948, 3085, -948, 3442, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -304, 3442, -304, 3085, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -1293, 8194, -1650, 8194, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 243, 3071, 600, 3425, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 1792, 9245, 2309, 8913, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 1262, 7958, 1766, 7609, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -1528, 9228, -1528, 9713, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -1603, 3442, -1603, 3085, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("g"), -850, 9485, -850, 9970, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("g"), -607, 9485, -607, 9970, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("g"), -327, 9485, -327, 9970, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("g"), 2189, 4800, 2802, 4800, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -1760, 6025, -1453, 6528, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -1453, 6528, -1253, 6022, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -1253, 6022, -967, 6523, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -967, 6523, -758, 6019, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -793, 3468, -793, 3825, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -478, 3825, -478, 3468, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -1268, 3853, -1268, 4210, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -1260, 3826, -1260, 3469, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -1277, 3084, -1277, 3441, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 57, 3442, 57, 3085, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 57, 3469, 57, 3826, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 43, 3853, 43, 4210, false)

//monsters multiple patrols
	call MonsterMultiplePatrols.storeNewLoc(2580, 10008)
	call MonsterMultiplePatrols.storeNewLoc(2698, 9455)
	call MonsterMultiplePatrols.storeNewLoc(2308, 9461)
	call level.monstersMultiplePatrols.new(udg_monsterTypes.get("g"), "normal", false)

	call MonsterMultiplePatrols.storeNewLoc(-1384, 8313)
	call MonsterMultiplePatrols.storeNewLoc(-1947, 8329)
	call MonsterMultiplePatrols.storeNewLoc(-1940, 9090)
	call MonsterMultiplePatrols.storeNewLoc(-1387, 9064)
	call level.monstersMultiplePatrols.new(udg_monsterTypes.get("g"), "normal", false)

	call MonsterMultiplePatrols.storeNewLoc(3132, 8723)
	call MonsterMultiplePatrols.storeNewLoc(3343, 9231)
	call MonsterMultiplePatrols.storeNewLoc(3466, 8707)
	call MonsterMultiplePatrols.storeNewLoc(3628, 9228)
	call MonsterMultiplePatrols.storeNewLoc(3746, 8709)
	call MonsterMultiplePatrols.storeNewLoc(3895, 9224)
	call MonsterMultiplePatrols.storeNewLoc(4013, 8707)
	call MonsterMultiplePatrols.storeNewLoc(4226, 9228)
	call MonsterMultiplePatrols.storeNewLoc(4367, 8701)
	call level.monstersMultiplePatrols.new(udg_monsterTypes.get("c"), "string", false)

	call MonsterMultiplePatrols.storeNewLoc(1658, 7040)
	call MonsterMultiplePatrols.storeNewLoc(1427, 7203)
	call MonsterMultiplePatrols.storeNewLoc(1167, 7056)
	call level.monstersMultiplePatrols.new(udg_monsterTypes.get("c"), "string", false)

	call MonsterMultiplePatrols.storeNewLoc(1667, 6900)
	call MonsterMultiplePatrols.storeNewLoc(1419, 6762)
	call MonsterMultiplePatrols.storeNewLoc(1159, 6900)
	call level.monstersMultiplePatrols.new(udg_monsterTypes.get("c"), "string", false)

	call MonsterMultiplePatrols.storeNewLoc(2058, 8330)
	call MonsterMultiplePatrols.storeNewLoc(1534, 8316)
	call MonsterMultiplePatrols.storeNewLoc(1527, 8827)
	call MonsterMultiplePatrols.storeNewLoc(2064, 8805)
	call level.monstersMultiplePatrols.new(udg_monsterTypes.get("g"), "normal", false)

//monster spawns

//meteors
	call level.meteors.new(-776, 2557, false)
	call level.meteors.new(5191, 5388, false)
	call level.meteors.new(185, 9722, false)

//casters

endfunction


function Init_level6_Actions takes nothing returns nothing
	local Level level = ForceGetLevel(6)

//start message

//lives earned
	call level.setNbLivesEarned(2)

//start location
	call level.newStart(5488, 8602, 6138, 9361)

//end location
	call level.newEnd(7176, 2593, 8195, 2682)

//visibilities
	call level.newVisibilityModifier(1413, 5427, 11888, 11617)
	call level.newVisibilityModifier(8660, 5630, 6725, 2679)

//monsters no move
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), 10086, 8922, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), 9778, 8352, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), 10118, 7943, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), 9831, 7551, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), 10249, 6995, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), 9861, 6776, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), 9439, 9453, -135, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), 9522, 9342, -135, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), 9597, 9244, -135, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), 9681, 9139, -135, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), 9608, 9667, 45, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), 9680, 9586, 45, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), 9756, 9501, 45, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), 9823, 9408, 45, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), 9873, 9317, 45, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), 10085, 8353, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), 10147, 7315, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), 5661, 6549, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), 6398, 7285, 0, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), 5588, 7300, 0, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), 5226, 7598, 0, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), 4758, 7275, 0, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), 6981, 7554, 0, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), 7536, 7220, 0, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), 7468, 4047, -80, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), 7915, 4052, -120, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), 4349, 6414, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), 6230, 6389, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), 5998, 6319, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), 4071, 6866, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), 4339, 6665, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), 4513, 6504, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), 4745, 6270, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), 5160, 6531, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), 5412, 6403, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), 5697, 6272, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), 5004, 6330, -1, false)

//monsters simple patrol
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 8689, 6469, 8076, 6469, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 6397, 6132, 6689, 6515, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 6864, 6324, 6571, 5950, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 6770, 5782, 7073, 6117, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 7265, 5939, 6930, 5597, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 7097, 5419, 7433, 5781, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 7547, 5637, 7255, 5275, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 7366, 5157, 7710, 5482, false)
endfunction

function Init_level6_part2_Actions takes nothing returns nothing
	local Level level = ForceGetLevel(6)


//monsters simple patrol
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 7431, 5088, 7927, 5269, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 8077, 4720, 7295, 4732, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 7424, 4877, 7938, 4879, false)

//monsters multiple patrols
	call MonsterMultiplePatrols.storeNewLoc(8402, 5529)
	call MonsterMultiplePatrols.storeNewLoc(8726, 6022)
	call MonsterMultiplePatrols.storeNewLoc(8835, 5505)
	call MonsterMultiplePatrols.storeNewLoc(9030, 6024)
	call MonsterMultiplePatrols.storeNewLoc(9156, 5529)
	call MonsterMultiplePatrols.storeNewLoc(9223, 6013)
	call MonsterMultiplePatrols.storeNewLoc(9521, 5524)
	call level.monstersMultiplePatrols.new(udg_monsterTypes.get("c"), "string", false)

	call MonsterMultiplePatrols.storeNewLoc(9522, 5529)
	call MonsterMultiplePatrols.storeNewLoc(9213, 6019)
	call MonsterMultiplePatrols.storeNewLoc(9150, 5527)
	call MonsterMultiplePatrols.storeNewLoc(9045, 6022)
	call MonsterMultiplePatrols.storeNewLoc(8870, 5512)
	call MonsterMultiplePatrols.storeNewLoc(8711, 6017)
	call MonsterMultiplePatrols.storeNewLoc(8397, 5529)
	call level.monstersMultiplePatrols.new(udg_monsterTypes.get("c"), "string", false)

	call MonsterMultiplePatrols.storeNewLoc(9519, 5559)
	call MonsterMultiplePatrols.storeNewLoc(9458, 6159)
	call MonsterMultiplePatrols.storeNewLoc(9836, 5864)
	call MonsterMultiplePatrols.storeNewLoc(9737, 6303)
	call MonsterMultiplePatrols.storeNewLoc(10205, 6254)
	call level.monstersMultiplePatrols.new(udg_monsterTypes.get("c"), "string", false)

	call MonsterMultiplePatrols.storeNewLoc(8076, 6103)
	call MonsterMultiplePatrols.storeNewLoc(8388, 5955)
	call MonsterMultiplePatrols.storeNewLoc(8702, 6118)
	call level.monstersMultiplePatrols.new(udg_monsterTypes.get("c"), "string", false)

	call MonsterMultiplePatrols.storeNewLoc(8694, 6385)
	call MonsterMultiplePatrols.storeNewLoc(8415, 6228)
	call MonsterMultiplePatrols.storeNewLoc(8073, 6371)
	call level.monstersMultiplePatrols.new(udg_monsterTypes.get("c"), "string", false)

	call MonsterMultiplePatrols.storeNewLoc(8079, 6578)
	call MonsterMultiplePatrols.storeNewLoc(8384, 6748)
	call MonsterMultiplePatrols.storeNewLoc(8707, 6590)
	call level.monstersMultiplePatrols.new(udg_monsterTypes.get("c"), "string", false)

	call MonsterMultiplePatrols.storeNewLoc(7681, 3745)
	call MonsterMultiplePatrols.storeNewLoc(8051, 3728)
	call MonsterMultiplePatrols.storeNewLoc(8163, 3947)
	call MonsterMultiplePatrols.storeNewLoc(7686, 3968)
	call level.monstersMultiplePatrols.new(udg_monsterTypes.get("c"), "normal", false)

	call MonsterMultiplePatrols.storeNewLoc(7675, 3739)
	call MonsterMultiplePatrols.storeNewLoc(7689, 3971)
	call MonsterMultiplePatrols.storeNewLoc(7229, 3885)
	call MonsterMultiplePatrols.storeNewLoc(7330, 3697)
	call level.monstersMultiplePatrols.new(udg_monsterTypes.get("c"), "normal", false)

	call MonsterMultiplePatrols.storeNewLoc(7684, 4253)
	call MonsterMultiplePatrols.storeNewLoc(7684, 4493)
	call MonsterMultiplePatrols.storeNewLoc(7042, 4364)
	call MonsterMultiplePatrols.storeNewLoc(7172, 4088)
	call level.monstersMultiplePatrols.new(udg_monsterTypes.get("c"), "normal", false)

	call MonsterMultiplePatrols.storeNewLoc(7687, 4482)
	call MonsterMultiplePatrols.storeNewLoc(7692, 4241)
	call MonsterMultiplePatrols.storeNewLoc(7173, 4090)
	call MonsterMultiplePatrols.storeNewLoc(7040, 4351)
	call level.monstersMultiplePatrols.new(udg_monsterTypes.get("c"), "normal", false)

	call MonsterMultiplePatrols.storeNewLoc(7684, 4486)
	call MonsterMultiplePatrols.storeNewLoc(7688, 4241)
	call MonsterMultiplePatrols.storeNewLoc(8190, 4084)
	call MonsterMultiplePatrols.storeNewLoc(8329, 4345)
	call level.monstersMultiplePatrols.new(udg_monsterTypes.get("c"), "normal", false)

	call MonsterMultiplePatrols.storeNewLoc(7689, 4241)
	call MonsterMultiplePatrols.storeNewLoc(7684, 4479)
	call MonsterMultiplePatrols.storeNewLoc(8327, 4345)
	call MonsterMultiplePatrols.storeNewLoc(8204, 4090)
	call level.monstersMultiplePatrols.new(udg_monsterTypes.get("c"), "normal", false)

//monster spawns
	call level.monsterSpawns.new("geants", udg_monsterTypes.get("g"), "upToDown", 2.000, 6553, 8585, 8321, 10241, false)
	call level.monsterSpawns.new("crabes1", udg_monsterTypes.get("c"), "downToUp", 2.000, 8487, 9076, 9262, 10276, false)
	call level.monsterSpawns.new("crabes2", udg_monsterTypes.get("c"), "rightToLeft", 4.000, 9345, 6494, 10867, 9100, false)
	call level.monsterSpawns.new("geants2", udg_monsterTypes.get("g"), "rightToLeft", 1.500, 3792, 7029, 8900, 7784, false)

//meteors

//casters

endfunction


function Init_level7_Actions takes nothing returns nothing
	local Level level = ForceGetLevel(7)

//start message

//lives earned
	call level.setNbLivesEarned(3)

//start location
	call level.newStart(7334, 1841, 8059, 2364)

//end location
	call level.newEnd(-370, 375, 1038, 498)

//visibilities
	call level.newVisibilityModifier(3127, 6467, 12224, -1021)
	call level.newVisibilityModifier(3330, 3703, -3000, 388)
	call level.newVisibilityModifier(12224, -912, 4398, -3699)
	call level.newVisibilityModifier(4359, -3223, 9255, -4068)
	call level.newVisibilityModifier(3914, -934, 4363, -1524)
	call level.newVisibilityModifier(12224, 5970, 3211, -887)

//monsters no move
	call level.monstersNoMove.new(udg_monsterTypes.get("ancien"), 4865, -1329, 0, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), 9822, -812, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), 9521, -828, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), 7440, -248, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), 7316, -259, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), 9730, -223, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), 9939, -399, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), 9409, -456, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), 7137, -3856, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), 5292, -2494, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), 3618, -23, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), 8157, -1676, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), 10312, -1898, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), 5440, -911, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), 4817, -3658, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), 6210, -1127, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), 3851, 133, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), 3348, -178, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("ancien"), 3146, 2695, -90, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), 6870, 884, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), 6434, 831, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), 6103, 923, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), 6079, 563, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), 6013, 199, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), 5556, 323, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), 5319, 177, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), 5029, 469, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), 5235, 737, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), 5037, 1016, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), 5191, 1253, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), 4853, 1350, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), 4506, 1715, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), 4275, 1607, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), 4118, 2240, -90, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), 3965, 2220, -90, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), 3737, 2187, -90, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), 4049, 1899, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), 2832, 1375, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), 2475, 1246, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), 2402, 1882, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), 2933, 2199, -1, false)
endfunction

function Init_level7_part2_Actions takes nothing returns nothing
	local Level level = ForceGetLevel(7)


//monsters no move
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), 2985, 3104, -1, false)

//monsters simple patrol
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 8437, -242, 8437, 626, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 8326, 626, 8326, -242, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 8170, -243, 8170, 625, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 8989, -755, 8989, 241, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 8787, -754, 8787, 242, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 9210, -1139, 9210, 241, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 8872, 241, 8872, -755, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 10125, 2032, 9729, 2453, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 6531, 3052, 5359, 3088, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 5374, 2966, 6528, 2945, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 9740, 4687, 10225, 4687, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 6529, 2827, 5378, 2835, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 5381, 2704, 6536, 2722, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("g"), 6475, 3246, 5403, 3287, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 9328, -1267, 9328, 241, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 9440, 242, 9440, -1394, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 9564, -1522, 9564, 242, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("g"), 5728, 2289, 5728, 1932, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 9641, -1522, 9641, 242, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 9768, 241, 9768, -1523, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("g"), 6156, 3618, 6513, 3618, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 9855, -1522, 9855, 242, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 5942, 4209, 5942, 3724, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 9740, 2543, 10225, 2543, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 10225, 2745, 9740, 2745, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 9740, 2932, 10225, 2932, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 10226, 3085, 9741, 3085, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 9741, 3243, 10226, 3243, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 10226, 3402, 9741, 3402, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 10216, -1523, 10216, -1038, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 9949, 241, 9949, -1523, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 9741, 3589, 10226, 3589, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 10225, 3761, 9740, 3761, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 9741, 3958, 10226, 3958, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 10225, 4159, 9740, 4159, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 9741, 4353, 10226, 4353, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 10226, 4528, 9741, 4528, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 10253, -1557, 10866, -1557, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 10206, -1677, 10206, -2162, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 9787, -1934, 9787, -2419, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 9656, -2418, 9656, -1933, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 6163, 3724, 6163, 4209, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("g"), 5179, 3724, 5179, 4209, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 4908, 4209, 4908, 3724, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("g"), 5677, 3724, 5677, 4209, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 9473, -1934, 9473, -2419, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("g"), 6112, 2289, 6112, 1932, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("g"), 6456, 2289, 6456, 1932, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 5438, 3725, 5438, 4210, false)
endfunction

function Init_level7_part3_Actions takes nothing returns nothing
	local Level level = ForceGetLevel(7)


//monsters simple patrol
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 8972, -2162, 8972, -1421, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 8835, -1421, 8835, -2162, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 8679, -2162, 8679, -1421, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 8434, -1971, 7821, -1971, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 8178, -2379, 7565, -2379, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 7914, -2930, 7914, -1677, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 8589, -3053, 9458, -3053, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 9458, -3262, 8589, -3262, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 8808, -2574, 8808, -3827, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 8945, -3826, 8945, -2573, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 9132, -2574, 9132, -3827, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 8300, -3597, 8300, -4082, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 8195, -4082, 8195, -3597, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 7809, -3827, 7809, -3214, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 7652, -3214, 7652, -3827, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 8178, -3552, 7309, -3552, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 7948, -3850, 8689, -3850, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 6434, -4082, 6434, -3469, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 5104, -3442, 5104, -2701, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 4877, -2987, 5490, -2987, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 5489, -3175, 4876, -3175, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 5132, -2641, 5873, -2641, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 8588, -2952, 9457, -2952, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 7410, -520, 6925, -520, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 2675, 909, 2675, 1778, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 3186, 1181, 2189, 1181, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 2188, 1300, 3185, 1300, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 3186, 1417, 2189, 1417, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 2189, 1620, 3186, 1620, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 2725, 1805, 2725, 2546, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 3853, -836, 4466, -836, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("g"), 3954, 475, 3469, 475, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("g"), 3344, 652, 3344, 1137, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 2852, 2545, 2852, 1804, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 2671, 1767, 2069, 2125, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("g"), 1233, 1239, 1460, 948, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 638, 1037, 638, 1394, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 369, 1166, -243, 1166, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -243, 1079, 369, 1079, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("g"), 1650, 2132, 1165, 2132, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("g"), 1165, 2307, 1650, 2307, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("g"), 1649, 2460, 1164, 2460, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("g"), 1650, 2950, 1165, 2950, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("g"), 2091, 2956, 2091, 3313, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("g"), 2251, 3313, 2251, 2956, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 2917, 1778, 2917, 909, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 7409, 114, 6924, 114, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 6924, 7, 7409, 7, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 6897, -525, 6897, -1010, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 3853, -1046, 4466, -1046, false)
endfunction

function Init_level7_part4_Actions takes nothing returns nothing
	local Level level = ForceGetLevel(7)


//monsters simple patrol
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 3084, -487, 4209, -487, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 3085, -236, 4210, -236, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 3085, 58, 4210, 58, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 4209, -365, 3084, -365, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 4210, -102, 3085, -102, false)

//monsters multiple patrols
	call MonsterMultiplePatrols.storeNewLoc(8934, 1914)
	call MonsterMultiplePatrols.storeNewLoc(9043, 2311)
	call MonsterMultiplePatrols.storeNewLoc(9166, 1931)
	call level.monstersMultiplePatrols.new(udg_monsterTypes.get("c"), "string", false)

	call MonsterMultiplePatrols.storeNewLoc(9301, 2313)
	call MonsterMultiplePatrols.storeNewLoc(9431, 1922)
	call MonsterMultiplePatrols.storeNewLoc(9551, 2291)
	call level.monstersMultiplePatrols.new(udg_monsterTypes.get("c"), "string", false)

//monster spawns
	call level.monsterSpawns.new("geants", udg_monsterTypes.get("g"), "downToUp", 2.000, 5202, -1656, 6653, -672, false)

//meteors
	call level.meteors.new(4593, 3963, false)
	call level.meteors.new(9983, 5063, false)

//casters

endfunction


function Init_level8_Actions takes nothing returns nothing
	local Level level = ForceGetLevel(8)

//start message

//lives earned
	call level.setNbLivesEarned(3)

//start location
	call level.newStart(-65, -33, 683, 542)

//end location
	call level.newEnd(-371, -9078, 1026, -8903)

//visibilities
	call level.newVisibilityModifier(-1270, 649, 1720, -9060)

//monsters no move

//monsters simple patrol

//monsters multiple patrols

//monster spawns
	call level.monsterSpawns.new("crabes1", udg_monsterTypes.get("c"), "leftToRight", 17.000, -1125, -8720, 1332, -980, false)
	call level.monsterSpawns.new("crabes2", udg_monsterTypes.get("c"), "rightToLeft", 17.000, -706, -8745, 1757, -953, false)

//meteors

//casters

endfunction


function Init_level9_Actions takes nothing returns nothing
	local Level level = ForceGetLevel(9)

//start message

//lives earned
	call level.setNbLivesEarned(3)

//start location
	call level.newStart(-17, -9522, 691, -8904)

//end location
	call level.newEnd(2528, -9204, 3621, -9078)

//visibilities
	call level.newVisibilityModifier(313, 2243, -11551, -11748)
	call level.newVisibilityModifier(-1852, -11792, 3477, -9848)
	call level.newVisibilityModifier(-797, -10277, 3669, -8996)

//monsters no move
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), -1996, -8503, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), -2113, -5173, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), -3079, -3264, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), -4621, -10091, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), -6893, -10935, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), -8994, -10069, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), -3881, -10104, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), -3372, -9960, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), 1530, -10750, -1, false)

//monsters simple patrol
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -2701, -3102, -3442, -3102, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -3442, -3443, -2701, -3443, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -3086, -4646, -3827, -4646, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -1678, -8941, -2547, -8941, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -2546, -8670, -1677, -8670, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -1678, -8342, -2547, -8342, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -1678, -7660, -2163, -7660, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -1934, -6795, -2419, -6795, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -2162, -5978, -1677, -5978, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -3086, -5254, -3699, -5254, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -3698, -5602, -3085, -5602, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -3442, -6376, -2957, -6376, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -3086, -7263, -3699, -7263, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -3698, -7731, -3085, -7731, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -3342, -8357, -3955, -8357, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -4140, -8590, -4140, -9331, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -4507, -8589, -4507, -9330, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -5189, -8717, -5189, -9330, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -5757, -8717, -5757, -9330, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -6292, -9330, -6292, -8717, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -6933, -8717, -6933, -9330, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -7380, -9330, -7380, -8717, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -7941, -8717, -7941, -9330, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -8452, -9331, -8452, -8718, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -9025, -8717, -9025, -9330, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -9454, -9331, -9454, -8718, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -9613, -9406, -10354, -9406, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -9959, -9842, -9959, -8973, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -9403, -9870, -9403, -10483, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -9196, -10482, -9196, -9869, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -8668, -9869, -8668, -10482, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -8489, -10483, -8489, -9870, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -7997, -9869, -7997, -10482, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -7770, -10482, -7770, -9869, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -6669, -10570, -7282, -10570, false)
endfunction

function Init_level9_part2_Actions takes nothing returns nothing
	local Level level = ForceGetLevel(9)


//monsters simple patrol
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -6608, -10638, -6608, -11379, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -6443, -11379, -6443, -10638, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -6146, -10638, -6146, -11379, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -5005, -10517, -5746, -10517, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -5190, -9870, -5190, -10867, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -5347, -9870, -5347, -10995, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -5525, -11122, -5525, -9869, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -4864, -10482, -4864, -9613, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -4715, -9613, -4715, -10482, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -4501, -10482, -4501, -9613, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -2521, -10610, -2521, -9869, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -2414, -9870, -2414, -10611, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -2247, -10610, -2247, -9869, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -2079, -9870, -2079, -10611, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -1448, -10995, -1448, -10254, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -3699, -7488, -3086, -7488, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -1235, -10994, -1235, -10253, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -1087, -10253, -1087, -10994, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -3086, -7102, -3699, -7102, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -806, -10253, -806, -10994, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -636, -10995, -636, -10254, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -472, -10254, -472, -10995, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 2573, -10142, 3442, -10142, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 3441, -10261, 2572, -10261, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 2572, -10382, 3441, -10382, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 3313, -9753, 2828, -9753, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -3086, -7801, -3699, -7801, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 2604, -10400, 3403, -10925, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 51, -10995, 51, -10382, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 415, -10382, 415, -10995, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 727, -10995, 727, -10382, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 1041, -10382, 1041, -10995, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 1366, -10995, 1366, -10382, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 1692, -10382, 1692, -10995, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 1998, -10995, 1998, -10382, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 2345, -10382, 2345, -10995, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 1177, -10994, 1177, -10381, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), -1678, -8141, -2547, -8141, false)

//monsters multiple patrols

//monster spawns
	call level.monsterSpawns.new("crabes", udg_monsterTypes.get("g"), "upToDown", 0.800, -2263, -4781, -1569, -1049, false)

//meteors

//casters

endfunction


function Init_level10_Actions takes nothing returns nothing
	local Level level = ForceGetLevel(10)

//start message

//lives earned

//start location
	call level.newStart(2828, -9321, 3316, -8743)

//end location
	call level.newEnd(10632, -7586, 10907, -7348)

//visibilities
	call level.newVisibilityModifier(-595, -11894, 11819, 1836)

//monsters no move
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), 3859, -8653, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), 5838, -8967, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), 7278, -7764, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), 9681, -11571, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), 9276, -11343, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), 10049, -11343, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), 10456, -11588, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), 10845, -11326, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), 11099, -8759, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), 10499, -10360, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), 9967, -9523, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), 5242, -10478, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), 4488, -8700, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), 5510, -11142, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("mo"), 1893, -3996, 0, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("mo"), 2113, -3984, 0, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("mo"), 2365, -3975, 0, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("mo"), 2614, -3964, 0, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("mo"), 2733, -4163, 180, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("mo"), 2506, -4167, 180, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("mo"), 2250, -4169, 180, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("mo"), 2015, -4176, 180, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("mo"), 1885, -4370, 0, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("mo"), 2125, -4366, 0, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("mo"), 2381, -4376, 0, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("mo"), 2623, -4372, 0, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("mo"), 2727, -4547, 180, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("mo"), 2505, -4556, 180, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("mo"), 2255, -4559, 180, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("mo"), 2012, -4563, 180, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("mo"), 2148, -1177, 45, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("mo"), 2513, -1170, 135, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("mo"), 2490, -825, 225, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("mo"), 2132, -825, 315, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("mo"), 2736, -3597, 180, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("mo"), 2519, -3606, 180, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("mo"), 2237, -3616, 180, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("mo"), 1991, -3608, 180, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("mo"), 2731, -3218, 180, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("mo"), 2520, -3216, 180, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("mo"), 2221, -3246, 180, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("mo"), 2102, -3437, 0, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("mo"), 1991, -3248, 180, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("mo"), 2632, -3435, 0, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("mo"), 1875, -3431, 0, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("mo"), 2353, -3432, 0, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("mo"), 1883, -2572, 0, false)
endfunction

function Init_level10_part2_Actions takes nothing returns nothing
	local Level level = ForceGetLevel(10)


//monsters no move
	call level.monstersNoMove.new(udg_monsterTypes.get("mo"), 2079, -2583, 0, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("mo"), 2275, -2586, 0, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("mo"), 2457, -2586, 0, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("mo"), 1989, -2759, 180, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("mo"), 2186, -2759, 180, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("mo"), 2370, -2750, 180, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("mo"), 2552, -2757, 180, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("mo"), 2728, -2766, 180, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("mo"), 2614, -2578, 0, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("mo"), 2727, -2373, 180, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("mo"), 2544, -2379, 180, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("mo"), 2360, -2377, 180, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("mo"), 2170, -2390, 180, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("mo"), 1991, -2390, 180, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("mo"), 2729, -1951, 180, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("mo"), 1871, -3062, 0, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("mo"), 2095, -3062, 0, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("mo"), 2362, -3059, 0, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("mo"), 2645, -3053, 0, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("mo"), 2522, -1947, 180, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("mo"), 2339, -1958, 180, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("mo"), 2139, -1958, 180, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("mo"), 1976, -1960, 180, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("mo"), 1883, -2107, 0, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("mo"), 2052, -2099, 0, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("mo"), 2247, -2097, 0, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("mo"), 2437, -2095, 0, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("mo"), 1869, -1816, 0, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("mo"), 2641, -2082, 0, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("mo"), 2037, -1818, 0, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("mo"), 2225, -1822, 0, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("mo"), 2625, -1811, 0, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("mo"), 2427, -1824, 0, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), 2969, -5220, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), 3208, -5017, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), 3466, -5232, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("o"), 3705, -5017, -1, false)

//monsters simple patrol
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 3314, -8377, 2829, -8377, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 3504, -7923, 3504, -7438, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 3724, -8478, 4209, -8478, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 4209, -8774, 3724, -8774, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 3725, -9079, 4210, -9079, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 3852, -9577, 4337, -9577, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 4337, -10065, 3980, -10065, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 5874, -10192, 5517, -10192, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 4108, -10560, 4593, -10560, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 4059, -11149, 4059, -11634, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 4654, -11150, 4654, -11635, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 5489, -10307, 5004, -10307, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 2971, -7710, 3437, -8251, false)
endfunction

function Init_level10_part3_Actions takes nothing returns nothing
	local Level level = ForceGetLevel(10)


//monsters simple patrol
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 3576, -7935, 3944, -7594, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 3970, -8044, 3717, -8325, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 3818, -9486, 4238, -9096, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 4088, -10512, 4372, -10207, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 4098, -10616, 4472, -10891, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 4734, -11133, 5205, -11598, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 5263, -10747, 4993, -10513, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("g"), 4321, -11149, 4321, -11634, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 5129, -9972, 5480, -10224, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 4715, -8583, 4374, -8325, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 4862, -8165, 4674, -7731, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 4861, -8171, 5173, -7780, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 5259, -9069, 5521, -8713, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 5769, -9192, 6143, -8941, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 5751, -11132, 5300, -11596, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 5811, -11166, 5820, -11614, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 6141, -11374, 5917, -11153, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 5920, -10952, 6376, -10965, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 6498, -10616, 6050, -10628, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 6183, -10240, 6492, -10368, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 6664, -10215, 6419, -9744, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 6267, -8166, 5902, -8033, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 6939, -8822, 7395, -8810, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 7399, -8980, 6938, -8996, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 6943, -9244, 7277, -9605, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 6929, -9507, 7285, -9844, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 6960, -10170, 7275, -9859, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 7058, -10237, 7495, -9929, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 7071, -10364, 7527, -10340, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 7506, -10683, 7065, -10498, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 7161, -10867, 6831, -10530, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 6809, -11001, 7146, -11001, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 7145, -11137, 6832, -11586, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 7285, -11613, 7286, -11151, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 7441, -11163, 7454, -11615, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 7797, -11365, 7559, -11152, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 7605, -10673, 8110, -11333, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 8189, -10993, 7956, -10649, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 8307, -10988, 8300, -10386, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 8403, -10383, 8405, -10992, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 8466, -11000, 8911, -10434, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 8478, -11267, 8934, -11245, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 8948, -11255, 8498, -11716, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 8962, -11274, 8964, -11760, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 9215, -11624, 8975, -11288, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 9354, -11633, 9595, -11277, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 9977, -11633, 9738, -11277, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 10117, -11637, 10371, -11270, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 10510, -11270, 10736, -11628, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 10889, -11633, 11136, -11261, false)
endfunction

function Init_level10_part4_Actions takes nothing returns nothing
	local Level level = ForceGetLevel(10)


//monsters simple patrol
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 11209, -11287, 11194, -11755, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 11108, -10380, 11103, -10989, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 10986, -10980, 11018, -10387, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 10755, -10611, 10513, -9887, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 10266, -10267, 10853, -10211, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 10996, -9592, 10770, -9368, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 11125, -8465, 10881, -8826, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 10664, -8810, 10660, -8204, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 10812, -8204, 10785, -8814, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 6435, -9583, 6878, -9581, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 6891, -9384, 6444, -9391, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 6436, -9212, 6870, -9063, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 6334, -8140, 6332, -7468, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 6799, -7405, 7046, -7174, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 6084, -7088, 6503, -6648, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 6469, -8375, 6852, -8340, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 6451, -8157, 6833, -7896, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 5605, -6913, 5415, -6767, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 6512, -7807, 5922, -7792, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 5748, -8069, 5526, -8302, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 5837, -8093, 5840, -8558, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 9463, -8652, 9440, -8220, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 7078, -8008, 7543, -8005, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 7533, -8145, 7070, -8147, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 6940, -8449, 7405, -8459, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 7402, -8641, 6942, -8653, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 9094, -9863, 8964, -10250, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 8747, -9624, 8738, -10216, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 8578, -10214, 8571, -9605, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 8402, -9608, 8380, -10224, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 8223, -10220, 8227, -9613, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 8083, -9618, 8053, -10215, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("g"), 8966, -9330, 8966, -8205, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 9457, -8825, 7564, -8825, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("g"), 9233, -9330, 9233, -8205, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 9458, -8953, 7565, -8953, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 10357, -9203, 10129, -8837, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 9750, -9230, 10361, -9209, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 10355, -9392, 9755, -9428, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 3953, -11055, 3596, -11055, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 3974, -11122, 3639, -11592, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 7564, -8960, 9457, -8960, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("g"), 9091, -8205, 9091, -9330, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 5852, -6863, 5424, -5908, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 6514, -6162, 5389, -6162, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 5959, -6387, 5959, -5902, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 6627, -7410, 6627, -6669, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 7180, -7541, 7537, -7541, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 7154, -7530, 6797, -7530, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 10993, -9832, 10508, -9832, false)
endfunction

function Init_level10_part5_Actions takes nothing returns nothing
	local Level level = ForceGetLevel(10)


//monsters simple patrol
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 10892, -8975, 11377, -8975, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 10879, -9078, 11344, -9549, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 10621, -8920, 10134, -8738, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 10149, -8630, 10501, -8183, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 10098, -9866, 9741, -9866, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 9602, -10611, 10079, -10942, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 10100, -10658, 9607, -10381, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 9603, -10142, 10096, -10394, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 9478, -10611, 8995, -10965, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 9468, -10392, 8975, -10662, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 9469, -10137, 8977, -10400, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("g"), 4748, -10978, 5233, -10978, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 4868, -9564, 5473, -9253, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 4990, -8975, 5473, -8492, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 5588, -8696, 5696, -9210, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 5774, -9296, 6233, -9534, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 5775, -9725, 6141, -9603, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 4884, -8547, 5247, -8160, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 6157, -9990, 6898, -9990, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 6642, -8762, 6285, -8762, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 8456, -11145, 8969, -10810, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 2598, -909, 2598, -1138, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 2686, -1138, 2686, -909, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 2703, -511, 2184, -509, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 1804, -3773, 2801, -3773, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 2801, -2912, 1804, -2912, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 1804, -2230, 2801, -2230, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("g"), 8321, -9276, 8315, -8233, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("g"), 8061, -8221, 8063, -9297, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("g"), 8571, -9282, 8582, -8230, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 2815, -1684, 1801, -1660, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 3825, -2103, 3596, -2103, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 7447, -9805, 7953, -9446, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("g"), 3455, -6695, 3457, -7243, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 3693, -6703, 3712, -7255, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 3203, -6693, 3203, -7257, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("g"), 4098, -7282, 4098, -6925, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("g"), 2946, -6925, 2946, -7282, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("g"), 2929, -7288, 2060, -7288, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 2554, -7054, 2554, -7667, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("g"), 2400, -6825, 1950, -7094, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 6647, -5769, 6941, -5351, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 7421, -6153, 7904, -5543, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 5634, -4878, 5634, -5491, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 7436, -6490, 7921, -6490, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 7198, -5518, 7198, -6131, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 6219, -5747, 6219, -4878, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 6506, -4877, 6506, -5746, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 6413, -4722, 6413, -4237, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 6783, -4238, 6783, -4723, false)
endfunction

function Init_level10_part6_Actions takes nothing returns nothing
	local Level level = ForceGetLevel(10)


//monsters simple patrol
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 5461, -4595, 5461, -4238, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 7312, -4877, 7312, -5362, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 7429, -5362, 7429, -4877, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 7807, -5007, 7449, -4357, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 3715, -4387, 4014, -4093, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 5735, -7445, 5357, -8201, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 5617, -7254, 5260, -7254, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("c"), 6513, -6538, 6028, -6538, false)

//monsters multiple patrols
	call MonsterMultiplePatrols.storeNewLoc(3715, -2807)
	call MonsterMultiplePatrols.storeNewLoc(3991, -2975)
	call MonsterMultiplePatrols.storeNewLoc(4220, -2811)
	call level.monstersMultiplePatrols.new(udg_monsterTypes.get("c"), "string", false)

	call MonsterMultiplePatrols.storeNewLoc(3712, -3193)
	call MonsterMultiplePatrols.storeNewLoc(3981, -3051)
	call MonsterMultiplePatrols.storeNewLoc(4223, -3219)
	call level.monstersMultiplePatrols.new(udg_monsterTypes.get("c"), "string", false)

	call MonsterMultiplePatrols.storeNewLoc(3722, -2952)
	call MonsterMultiplePatrols.storeNewLoc(3485, -2793)
	call MonsterMultiplePatrols.storeNewLoc(3198, -2950)
	call level.monstersMultiplePatrols.new(udg_monsterTypes.get("c"), "string", false)

	call MonsterMultiplePatrols.storeNewLoc(3210, -3030)
	call MonsterMultiplePatrols.storeNewLoc(3488, -3186)
	call MonsterMultiplePatrols.storeNewLoc(3725, -3036)
	call level.monstersMultiplePatrols.new(udg_monsterTypes.get("c"), "string", false)

//monster spawns
	call level.monsterSpawns.new("crabes2", udg_monsterTypes.get("c"), "upToDown", 3.000, 4568, -7470, 5151, -4637, false)
	call level.monsterSpawns.new("crabes1", udg_monsterTypes.get("c"), "rightToLeft", 5.000, 7658, -7984, 10152, -7082, false)
	call level.monsterSpawns.new("crabes3", udg_monsterTypes.get("c"), "rightToLeft", 4.500, 1666, -6469, 4406, -5558, false)
	call level.monsterSpawns.new("crabesFinal2", udg_monsterTypes.get("c"), "rightToLeft", 4.000, 8085, -6198, 11506, -4734, false)
	call level.monsterSpawns.new("crabesFinal1", udg_monsterTypes.get("c"), "downToUp", 6.000, 8143, -6541, 11047, -4562, false)

//meteors

//casters

endfunction




function InitTrig_Init_levels takes nothing returns nothing
	local trigger initLevel0 = CreateTrigger()
	local trigger initLevel1 = CreateTrigger()
	local trigger initLevel2 = CreateTrigger()
	local trigger initLevel3 = CreateTrigger()
	local trigger initLevel4 = CreateTrigger()
	local trigger initLevel4_part2 = CreateTrigger()
	local trigger initLevel5 = CreateTrigger()
	local trigger initLevel5_part2 = CreateTrigger()
	local trigger initLevel6 = CreateTrigger()
	local trigger initLevel6_part2 = CreateTrigger()
	local trigger initLevel7 = CreateTrigger()
	local trigger initLevel7_part2 = CreateTrigger()
	local trigger initLevel7_part3 = CreateTrigger()
	local trigger initLevel7_part4 = CreateTrigger()
	local trigger initLevel8 = CreateTrigger()
	local trigger initLevel9 = CreateTrigger()
	local trigger initLevel9_part2 = CreateTrigger()
	local trigger initLevel10 = CreateTrigger()
	local trigger initLevel10_part2 = CreateTrigger()
	local trigger initLevel10_part3 = CreateTrigger()
	local trigger initLevel10_part4 = CreateTrigger()
	local trigger initLevel10_part5 = CreateTrigger()
	local trigger initLevel10_part6 = CreateTrigger()
	call TriggerAddAction(initLevel0, function Init_level0_Actions)
	call TriggerRegisterTimerEventSingle(initLevel0, 0.0000)
	call TriggerAddAction(initLevel1, function Init_level1_Actions)
	call TriggerRegisterTimerEventSingle(initLevel1, 0.0001)
	call TriggerAddAction(initLevel2, function Init_level2_Actions)
	call TriggerRegisterTimerEventSingle(initLevel2, 0.0002)
	call TriggerAddAction(initLevel3, function Init_level3_Actions)
	call TriggerRegisterTimerEventSingle(initLevel3, 0.0003)
	call TriggerAddAction(initLevel4, function Init_level4_Actions)
	call TriggerRegisterTimerEventSingle(initLevel4, 0.0004)
	call TriggerAddAction(initLevel4_part2, function Init_level4_part2_Actions)
	call TriggerRegisterTimerEventSingle(initLevel4_part2, 0.0005)
	call TriggerAddAction(initLevel5, function Init_level5_Actions)
	call TriggerRegisterTimerEventSingle(initLevel5, 0.0006)
	call TriggerAddAction(initLevel5_part2, function Init_level5_part2_Actions)
	call TriggerRegisterTimerEventSingle(initLevel5_part2, 0.0007)
	call TriggerAddAction(initLevel6, function Init_level6_Actions)
	call TriggerRegisterTimerEventSingle(initLevel6, 0.0008)
	call TriggerAddAction(initLevel6_part2, function Init_level6_part2_Actions)
	call TriggerRegisterTimerEventSingle(initLevel6_part2, 0.0009)
	call TriggerAddAction(initLevel7, function Init_level7_Actions)
	call TriggerRegisterTimerEventSingle(initLevel7, 0.0010)
	call TriggerAddAction(initLevel7_part2, function Init_level7_part2_Actions)
	call TriggerRegisterTimerEventSingle(initLevel7_part2, 0.0011)
	call TriggerAddAction(initLevel7_part3, function Init_level7_part3_Actions)
	call TriggerRegisterTimerEventSingle(initLevel7_part3, 0.0012)
	call TriggerAddAction(initLevel7_part4, function Init_level7_part4_Actions)
	call TriggerRegisterTimerEventSingle(initLevel7_part4, 0.0013)
	call TriggerAddAction(initLevel8, function Init_level8_Actions)
	call TriggerRegisterTimerEventSingle(initLevel8, 0.0014)
	call TriggerAddAction(initLevel9, function Init_level9_Actions)
	call TriggerRegisterTimerEventSingle(initLevel9, 0.0015)
	call TriggerAddAction(initLevel9_part2, function Init_level9_part2_Actions)
	call TriggerRegisterTimerEventSingle(initLevel9_part2, 0.0016)
	call TriggerAddAction(initLevel10, function Init_level10_Actions)
	call TriggerRegisterTimerEventSingle(initLevel10, 0.0017)
	call TriggerAddAction(initLevel10_part2, function Init_level10_part2_Actions)
	call TriggerRegisterTimerEventSingle(initLevel10_part2, 0.0018)
	call TriggerAddAction(initLevel10_part3, function Init_level10_part3_Actions)
	call TriggerRegisterTimerEventSingle(initLevel10_part3, 0.0019)
	call TriggerAddAction(initLevel10_part4, function Init_level10_part4_Actions)
	call TriggerRegisterTimerEventSingle(initLevel10_part4, 0.0020)
	call TriggerAddAction(initLevel10_part5, function Init_level10_part5_Actions)
	call TriggerRegisterTimerEventSingle(initLevel10_part5, 0.0021)
	call TriggerAddAction(initLevel10_part6, function Init_level10_part6_Actions)
	call TriggerRegisterTimerEventSingle(initLevel10_part6, 0.0022)
endfunction

