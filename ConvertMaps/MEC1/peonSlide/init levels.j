//TESH.scrollpos=0
//TESH.alwaysfold=0
function Init_level0_Actions takes nothing returns nothing
	local Level level = ForceGetLevel(0)

//start message

//lives earned
	call level.setNbLivesEarned(5)

//start location
	call level.newStart(GetRectMinX(gg_rct_departLvl_0), GetRectMinY(gg_rct_departLvl_0), GetRectMaxX(gg_rct_departLvl_0), GetRectMaxY(gg_rct_departLvl_0))

//end location
	call level.newEnd(10543, -18048, 10640, -16899)

//visibilities
	call level.newVisibilityModifier(1471, -14998, 4656, -18425)
	call level.newVisibilityModifier(4332, -18421, 9122, -15017)
	call level.newVisibilityModifier(8847, -18421, 10653, -16853)
	call level.newVisibilityModifier(9587, -16918, 9008, -16256)
	call level.newVisibilityModifier(9139, -15122, 6075, -14945)
	call level.newVisibilityModifier(5936, -15098, -2031, -14906)
	call level.newVisibilityModifier(1568, -15092, -2044, -18421)

//monsters no move
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), -979, -16579, -1, false).setId(2625)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), 380, -17604, -1, false).setId(2626)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), 3330, -16055, -1, false).setId(2627)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), 6666, -17218, -1, false).setId(2628)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), 6848, -15943, -1, false).setId(2629)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), 9217, -17548, -1, false).setId(2630)
	call level.monstersNoMove.new(udg_monsterTypes.get("Gpeon"), 4091, -17024, -1, false).setId(3584)
	call level.monstersNoMove.new(udg_monsterTypes.get("Gpeon"), 4171, -17056, -1, false).setId(3585)
	call level.monstersNoMove.new(udg_monsterTypes.get("Gpeon"), 4143, -17125, -1, false).setId(3586)
	call level.monstersNoMove.new(udg_monsterTypes.get("Gpeon"), 4065, -17108, -1, false).setId(3587)
	call level.monstersNoMove.new(udg_monsterTypes.get("Gpeon"), 4008, -17046, -1, false).setId(3588)
	call level.monstersNoMove.new(udg_monsterTypes.get("Goldmine"), 4209, -16493, 270, false).setId(5139)

//monsters simple patrol
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), -519, -15887, -1241, -15224, false).setId(1)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), -108, -15855, -98, -15108, false).setId(2)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 3721, -17386, 2947, -17370, false).setId(12)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 3699, -17142, 2945, -17149, false).setId(13)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 3724, -15889, 3048, -15214, false).setId(14)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 4603, -15878, 5146, -15165, false).setId(17)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 5482, -16907, 5829, -16481, false).setId(20)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 7021, -16706, 6270, -16665, false).setId(27)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 7262, -15869, 7253, -15099, false).setId(30)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 7442, -15907, 7820, -15604, false).setId(31)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 7805, -16401, 8214, -16125, false).setId(32)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 8247, -17385, 8918, -16674, false).setId(33)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 8616, -17717, 9132, -17156, false).setId(35)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 9861, -17154, 9318, -17912, false).setId(37)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), -540, -16290, -1399, -16271, false).setId(38)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 8316, -16901, 8945, -16885, false).setId(40)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 10080, -17175, 10070, -17892, false).setId(41)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 607, -18086, 794, -17646, false).setId(620)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 5478, -17131, 5654, -17436, false).setId(621)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 5012, -17532, 4599, -17516, false).setId(622)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 3993, -15858, 3993, -15117, false).setId(8752)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 4210, -15858, 4210, -15117, false).setId(8753)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 624, -16773, 1148, -17275, false).setId(9668)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 1143, -17570, 1165, -18283, false).setId(9669)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 1958, -17550, 1953, -18050, false).setId(9670)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 2659, -17547, 2657, -18044, false).setId(9671)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 4660, -16847, 5334, -15947, false).setId(9672)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 5766, -17428, 5763, -18042, false).setId(9673)
endfunction

function Init_level0_part2_Actions takes nothing returns nothing
	local Level level = ForceGetLevel(0)


//monsters simple patrol
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 7010, -16301, 6288, -16303, false).setId(9674)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 1068, -16519, 1785, -16524, false).setId(10592)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 1134, -15756, 650, -16246, false).setId(10593)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 4636, -16009, 5352, -16013, false).setId(10594)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 5253, -17689, 5264, -18029, false).setId(10595)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 6923, -17945, 6281, -17413, false).setId(10596)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 7038, -15872, 6405, -15224, false).setId(10597)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 8539, -16183, 7866, -16834, false).setId(10598)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 9688, -17186, 9694, -17898, false).setId(10599)

//monsters multiple patrols

//monsters teleport

//monster spawns

//meteors

//casters

	call level.activate(false)

	call level.activate(true)
endfunction


function Init_level1_Actions takes nothing returns nothing
	local Level level = ForceGetLevel(1)

//start message

//lives earned
	call level.setNbLivesEarned(2)

//start location
	call level.newStart(10470, -17949, 11549, -16992)

//end location
	call level.newEnd(7783, -14867, 7873, -13564)

//visibilities
	call level.newVisibilityModifier(9879, -18415, 18400, -12170)
	call level.newVisibilityModifier(10198, -16928, 9092, -14905)
	call level.newVisibilityModifier(7804, -13594, 10659, -16108)
	call level.newVisibilityModifier(8498, -14567, 7717, -13574)
	call level.newVisibilityModifier(8660, -14669, 7831, -13447)
	call level.newVisibilityModifier(8502, -14751, 7805, -13407)
	call level.newVisibilityModifier(9860, -13834, 8547, -13088)
	call level.newVisibilityModifier(9334, -13362, 8966, -12952)
	call level.newVisibilityModifier(10091, -13219, 9335, -12622)
	call level.newVisibilityModifier(9291, -13132, 9060, -12859)
	call level.newVisibilityModifier(8450, -13453, 8195, -13221)
	call level.newVisibilityModifier(16176, -12372, 15181, -12138)
	call level.newVisibilityModifier(16104, -12216, 18400, -12100)
	call level.newVisibilityModifier(15106, -12208, 14416, -12115)
	call level.newVisibilityModifier(8974, -13171, 8643, -12947)
	call level.newVisibilityModifier(13334, -12355, 14297, -12047)
	call level.newVisibilityModifier(13390, -12254, 14322, -11889)
	call level.newVisibilityModifier(14179, -12260, 14696, -11880)
	call level.newVisibilityModifier(14551, -12261, 15054, -11964)

//monsters no move
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), 13172, -17668, -1, false).setId(2631)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), 13447, -16537, -1, false).setId(2632)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), 11322, -15996, -1, false).setId(2633)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), 12212, -15312, -1, false).setId(2634)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), 15792, -14833, -1, false).setId(2635)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), 16322, -15070, -1, false).setId(2636)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), 17520, -13239, -1, false).setId(2637)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), 13178, -13301, -1, false).setId(2640)
	call level.monstersNoMove.new(udg_monsterTypes.get("kodo"), 11840, -13817, 0, false).setId(6113)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), 15656, -16423, -1, false).setId(7016)
	call level.monstersNoMove.new(udg_monsterTypes.get("circle"), 15929, -13859, -1, false).setId(12464)
	call level.monstersNoMove.new(udg_monsterTypes.get("circle2"), 15324, -12673, -1, false).setId(12465)
	call level.monstersNoMove.new(udg_monsterTypes.get("circle3"), 14803, -13332, -1, false).setId(12466)
	call level.monstersNoMove.new(udg_monsterTypes.get("circle4"), 14190, -13977, -1, false).setId(12469)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), 8178, -14322, -1, false).setId(14873)

//monsters simple patrol
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 15231, -16235, 15227, -17050, false).setId(63)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 14077, -16246, 13307, -17145, false).setId(69)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 10624, -16129, 10254, -16640, false).setId(73)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 11899, -14918, 12408, -14885, false).setId(83)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 12569, -15094, 12532, -15740, false).setId(84)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 14696, -15869, 14676, -15074, false).setId(91)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 15233, -15358, 14919, -15065, false).setId(93)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 16909, -15394, 16958, -14598, false).setId(99)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 17809, -14702, 17058, -14002, false).setId(101)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 13076, -13729, 12738, -13374, false).setId(115)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 8374, -13926, 8592, -14594, false).setId(122)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 13796, -15454, 14191, -15043, false).setId(1184)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 17118, -14543, 17462, -14899, false).setId(1185)
endfunction

function Init_level1_part2_Actions takes nothing returns nothing
	local Level level = ForceGetLevel(1)


//monsters simple patrol
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 15407, -14608, 15408, -15357, false).setId(9678)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 15689, -14496, 15678, -15470, false).setId(9679)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 16081, -14496, 16098, -15459, false).setId(9680)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 16586, -14508, 16613, -15463, false).setId(9681)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 13015, -17300, 13014, -18030, false).setId(10601)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 14124, -16297, 14128, -17001, false).setId(10611)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 12866, -17094, 14031, -16073, false).setId(10612)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 13223, -15902, 13173, -17114, false).setId(10613)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 12922, -16007, 14005, -17110, false).setId(10614)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 12669, -16297, 12665, -16996, false).setId(10615)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 12538, -16279, 11919, -16900, false).setId(10616)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 12386, -15757, 11792, -16378, false).setId(10617)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 11668, -15656, 11642, -16360, false).setId(10618)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 10756, -16165, 10758, -16740, false).setId(10619)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 9877, -16374, 10584, -15670, false).setId(10620)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 9832, -15647, 9367, -16269, false).setId(10621)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 14358, -15144, 14338, -15851, false).setId(10622)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 13569, -14963, 13560, -14482, false).setId(10623)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 13424, -15100, 13001, -14794, false).setId(10624)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 13193, -15473, 12858, -15051, false).setId(10625)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 17198, -13824, 18029, -13842, false).setId(10626)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 17185, -13700, 17899, -13451, false).setId(10627)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 12640, -13470, 12642, -14174, false).setId(10634)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 11080, -13467, 11079, -14194, false).setId(10635)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 10564, -14185, 10566, -13470, false).setId(10636)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 9104, -13189, 9310, -13663, false).setId(10637)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 9885, -13210, 9717, -13691, false).setId(10638)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 16456, -12981, 16843, -13521, false).setId(14867)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 16758, -12553, 17015, -13169, false).setId(14868)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 17356, -12624, 17046, -13171, false).setId(14869)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 13555, -12308, 13575, -13144, false).setId(14870)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 8521, -13915, 9170, -13704, false).setId(14871)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 8934, -13482, 8713, -14163, false).setId(14872)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 12106, -17869, 12489, -17355, false).setId(15809)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 15497, -15629, 15096, -15995, false).setId(15810)

//monsters multiple patrols

//monsters teleport

//monster spawns
	call level.monsterSpawns.new("masspeons01", udg_monsterTypes.get("peon"), "upToDown", 1.000, 14060, -14397, 16306, -12020, false)

//meteors
	call level.meteors.new(9381, -15765, false)

//casters
	call level.casters.new(udg_casterTypes.get("archer"), 15261, -13184, -1, false).setId(13345)

endfunction


function Init_level2_Actions takes nothing returns nothing
	local Level level = ForceGetLevel(2)

//start message

//lives earned
	call level.setNbLivesEarned(2)

//start location
	call level.newStart(6879, -14764, 7969, -13671)

//end location
	call level.newEnd(12473, -9993, 12546, -8699)

//visibilities
	call level.newVisibilityModifier(8160, -15255, -2042, -9936)
	call level.newVisibilityModifier(1322, -10066, -2021, -9746)
	call level.newVisibilityModifier(1456, -10003, -2028, -9687)
	call level.newVisibilityModifier(1622, -9976, 2811, -9717)
	call level.newVisibilityModifier(1176, -9909, 1666, -9713)
	call level.newVisibilityModifier(2788, -10030, 4692, -9817)
	call level.newVisibilityModifier(4608, -9976, 5532, -9783)
	call level.newVisibilityModifier(5562, -9841, 7395, -9779)
	call level.newVisibilityModifier(5269, -9879, 6089, -9554)
	call level.newVisibilityModifier(4841, -9837, 5265, -9541)
	call level.newVisibilityModifier(5911, -9785, 6810, -9641)
	call level.newVisibilityModifier(5991, -10097, 6740, -9714)
	call level.newVisibilityModifier(6521, -10107, 7539, -9477)
	call level.newVisibilityModifier(7306, -9946, 8270, -9417)
	call level.newVisibilityModifier(8003, -9453, 11793, -12642)
	call level.newVisibilityModifier(9954, -12718, 7884, -13356)
	call level.newVisibilityModifier(9610, -12353, 7999, -13187)
	call level.newVisibilityModifier(12592, -8633, 10216, -11622)
	call level.newVisibilityModifier(11747, -11539, 12709, -12361)
	call level.newVisibilityModifier(12735, -11641, 12546, -8684)
	call level.newVisibilityModifier(10132, -9467, 9799, -9213)
	call level.newVisibilityModifier(8859, -9516, 7216, -9298)
	call level.newVisibilityModifier(7147, -9539, 6038, -9443)
	call level.newVisibilityModifier(7221, -9474, 6843, -9238)
	call level.newVisibilityModifier(6686, -9781, 6074, -9598)
	call level.newVisibilityModifier(10190, -9179, 9886, -8955)

//monsters no move
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), 6625, -14331, -1, false).setId(2642)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), 5896, -14472, -1, false).setId(2643)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), 1943, -13315, -1, false).setId(2644)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), 192, -11785, -1, false).setId(2650)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), -429, -11497, -1, false).setId(2651)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), -980, -11634, -1, false).setId(2652)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), -869, -10952, -1, false).setId(2653)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), -1075, -10351, -1, false).setId(2654)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), -620, -10482, -1, false).setId(2655)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), 163, -10247, -1, false).setId(2656)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), 643, -10365, -1, false).setId(2657)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), 1905, -11391, -1, false).setId(2658)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), 2728, -12395, -1, false).setId(2659)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), 3232, -12788, -1, false).setId(2660)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), 2826, -11007, -1, false).setId(2661)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), 3088, -11017, -1, false).setId(2662)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), 2952, -10513, -1, false).setId(2663)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), 5133, -10662, -1, false).setId(2664)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), 5215, -10591, -1, false).setId(2665)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), 5317, -10511, -1, false).setId(2666)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), 5407, -10437, -1, false).setId(2667)
endfunction

function Init_level2_part2_Actions takes nothing returns nothing
	local Level level = ForceGetLevel(2)


//monsters no move
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), 5489, -10351, -1, false).setId(2668)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), 5588, -10260, -1, false).setId(2669)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), 5649, -10806, -1, false).setId(2670)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), 5510, -11599, -1, false).setId(2671)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), 5782, -11920, -1, false).setId(2672)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), 5499, -11927, -1, false).setId(2673)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), 5754, -11602, -1, false).setId(2674)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), 12211, -9198, -1, false).setId(2679)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), 12209, -9529, -1, false).setId(2680)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), 6334, -12870, -1, false).setId(14877)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), 11105, -9350, -1, false).setId(14884)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), 8943, -11260, -1, false).setId(15818)

//monsters simple patrol
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 2922, -14690, 3488, -14031, false).setId(133)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 2994, -13939, 2914, -14702, false).setId(135)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 2138, -14053, 2695, -13512, false).setId(136)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 2028, -13689, 2319, -13429, false).setId(137)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 1276, -14233, 967, -13845, false).setId(139)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 773, -12966, 501, -12491, false).setId(151)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 1002, -10792, 1319, -10457, false).setId(153)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 1521, -11285, 1807, -10975, false).setId(154)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 2947, -13300, 3566, -12995, false).setId(161)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 3251, -11250, 2627, -11250, false).setId(162)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 3330, -10184, 3331, -10816, false).setId(1674)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 4087, -10820, 4097, -10184, false).setId(1675)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 4996, -10178, 4970, -10824, false).setId(1676)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 2861, -13900, 2498, -14271, false).setId(2228)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 1477, -13382, 1822, -13749, false).setId(2230)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 1131, -12287, 532, -12287, false).setId(9683)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 10758, -9001, 10760, -9453, false).setId(9689)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 11392, -9011, 11405, -9706, false).setId(9690)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 11658, -8998, 11668, -9696, false).setId(9691)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 5766, -14090, 5434, -14670, false).setId(10641)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 4802, -14685, 4268, -13803, false).setId(10642)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 4989, -13844, 4359, -14592, false).setId(10643)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 3580, -14471, 3583, -14741, false).setId(10644)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 1655, -14115, 1171, -13568, false).setId(10645)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 1658, -10640, 1163, -11132, false).setId(10653)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 1768, -11869, 1075, -12065, false).setId(10654)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 1944, -12076, 1951, -12782, false).setId(10655)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 2265, -12061, 2267, -12770, false).setId(10656)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 2520, -12063, 2528, -12768, false).setId(10657)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 3445, -12187, 2833, -12804, false).setId(10658)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 2707, -11778, 3302, -11342, false).setId(10659)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 5287, -12071, 5987, -11511, false).setId(10660)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 5259, -10879, 5999, -10094, false).setId(10662)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 6014, -10858, 5232, -10146, false).setId(10664)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 5859, -12483, 5313, -12985, false).setId(10665)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 6018, -12700, 6030, -13162, false).setId(10666)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 6404, -12569, 6864, -13000, false).setId(10667)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 7009, -12585, 6441, -12388, false).setId(10668)
endfunction

function Init_level2_part3_Actions takes nothing returns nothing
	local Level level = ForceGetLevel(2)


//monsters simple patrol
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 7092, -12374, 6651, -11910, false).setId(10669)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 7173, -12287, 7162, -11794, false).setId(10670)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 10599, -9767, 10035, -9691, false).setId(10697)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 10611, -9613, 10263, -9180, false).setId(10698)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 12027, -9109, 12038, -9601, false).setId(10699)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 1270, -11563, 1525, -12270, false).setId(14161)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 1558, -11386, 2287, -11382, false).setId(14163)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 2587, -10727, 3301, -10724, false).setId(14164)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 3716, -10148, 3723, -10835, false).setId(14165)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 4543, -10123, 4552, -10850, false).setId(14166)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 5632, -9776, 5632, -11200, false).setId(14167)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 5973, -12095, 5361, -11432, false).setId(14168)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 5028, -11798, 6251, -11776, false).setId(14169)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 11907, -9033, 11909, -9666, false).setId(14170)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 6404, -14087, 6404, -14571, false).setId(14874)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 5257, -13949, 5114, -14325, false).setId(14875)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 3895, -13905, 4089, -14208, false).setId(14876)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 7390, -11565, 7599, -12117, false).setId(15811)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 8178, -11173, 8633, -11594, false).setId(15812)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 7917, -11299, 8108, -11865, false).setId(15813)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 9143, -10959, 9677, -11325, false).setId(15814)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 9602, -10634, 10015, -10977, false).setId(15815)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 10192, -10799, 9802, -10428, false).setId(15816)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 9966, -10237, 10450, -10573, false).setId(15817)

//monsters multiple patrols
	call MonsterMultiplePatrols.storeNewLoc(1062, -14659)
	call MonsterMultiplePatrols.storeNewLoc(606, -14013)
	call MonsterMultiplePatrols.storeNewLoc(136, -14664)
	call MonsterMultiplePatrols.storeNewLoc(-298, -14000)
	call MonsterMultiplePatrols.storeNewLoc(-715, -14662)
	call MonsterMultiplePatrols.storeNewLoc(-301, -13989)
	call MonsterMultiplePatrols.storeNewLoc(127, -14697)
	call MonsterMultiplePatrols.storeNewLoc(613, -13997)
	call level.monstersMultiplePatrols.new(udg_monsterTypes.get("peon"), "normal", false).setId(16366)

	call MonsterMultiplePatrols.storeNewLoc(450, -13261)
	call MonsterMultiplePatrols.storeNewLoc(-163, -12569)
	call MonsterMultiplePatrols.storeNewLoc(-649, -13299)
	call MonsterMultiplePatrols.storeNewLoc(-1277, -12677)
	call MonsterMultiplePatrols.storeNewLoc(-628, -13327)
	call MonsterMultiplePatrols.storeNewLoc(-165, -12592)
	call level.monstersMultiplePatrols.new(udg_monsterTypes.get("kodo"), "normal", false).setId(16367)

	call MonsterMultiplePatrols.storeNewLoc(-1263, -14574)
	call MonsterMultiplePatrols.storeNewLoc(-627, -13976)
	call MonsterMultiplePatrols.storeNewLoc(-268, -14700)
	call MonsterMultiplePatrols.storeNewLoc(214, -13983)
	call MonsterMultiplePatrols.storeNewLoc(568, -14699)
	call MonsterMultiplePatrols.storeNewLoc(995, -13977)
	call MonsterMultiplePatrols.storeNewLoc(557, -14700)
	call MonsterMultiplePatrols.storeNewLoc(195, -13998)
	call MonsterMultiplePatrols.storeNewLoc(-295, -14703)
	call MonsterMultiplePatrols.storeNewLoc(-661, -13993)
	call level.monstersMultiplePatrols.new(udg_monsterTypes.get("peon"), "normal", false).setId(16368)

	call MonsterMultiplePatrols.storeNewLoc(-667, -13652)
	call MonsterMultiplePatrols.storeNewLoc(-1025, -13332)
	call MonsterMultiplePatrols.storeNewLoc(-1360, -13645)
	call MonsterMultiplePatrols.storeNewLoc(-1035, -13919)
	call level.monstersMultiplePatrols.new(udg_monsterTypes.get("peon"), "normal", false).setId(16369)

	call MonsterMultiplePatrols.storeNewLoc(-1383, -13660)
	call MonsterMultiplePatrols.storeNewLoc(-1005, -13354)
	call MonsterMultiplePatrols.storeNewLoc(-667, -13645)
	call MonsterMultiplePatrols.storeNewLoc(-1032, -13911)
	call level.monstersMultiplePatrols.new(udg_monsterTypes.get("peon"), "normal", false).setId(16370)

//monsters teleport

//monster spawns
	call level.monsterSpawns.new("wolfmass", udg_monsterTypes.get("wolf"), "upToDown", 2.000, -1348, -12051, 1025, -9762, false)

//meteors

//casters

endfunction


function Init_level3_Actions takes nothing returns nothing
	local Level level = ForceGetLevel(3)

//start message

//lives earned
	call level.setNbLivesEarned(3)

//start location
	call level.newStart(12398, -9884, 13454, -8801)

//end location
	call level.newEnd(4447, -4087, 4544, -2815)

//visibilities
	call level.newVisibilityModifier(12348, -8682, 18316, -17645)
	call level.newVisibilityModifier(-2028, -7032, 15247, -12005)
	call level.newVisibilityModifier(15340, -8750, 18400, -2855)
	call level.newVisibilityModifier(15426, -7178, 11352, -2681)
	call level.newVisibilityModifier(15311, -3010, 16868, -2584)
	call level.newVisibilityModifier(15225, -2767, 16620, -2516)
	call level.newVisibilityModifier(16610, -2939, 18336, -2675)
	call level.newVisibilityModifier(13301, -2804, 12867, -2328)
	call level.newVisibilityModifier(12905, -2826, 11728, -2350)
	call level.newVisibilityModifier(11713, -2747, 11299, -2407)
	call level.newVisibilityModifier(8040, -4084, 17056, -9587)
	call level.newVisibilityModifier(11325, -4140, 10936, -3680)
	call level.newVisibilityModifier(11327, -3642, 10996, -2578)
	call level.newVisibilityModifier(10879, -4109, 10529, -3833)
	call level.newVisibilityModifier(11044, -4152, 10680, -3705)
	call level.newVisibilityModifier(4442, -2786, 6100, -4335)
	call level.newVisibilityModifier(8112, -7206, 6102, -6253)
	call level.newVisibilityModifier(6111, -7233, 5170, -6336)
	call level.newVisibilityModifier(5176, -7085, 4743, -6604)
	call level.newVisibilityModifier(4815, -7100, 3155, -6681)
	call level.newVisibilityModifier(4757, -6863, 2378, -6624)
	call level.newVisibilityModifier(3278, -7262, 2441, -6815)
	call level.newVisibilityModifier(2513, -7207, 700, -6568)
	call level.newVisibilityModifier(2711, -6762, 1293, -6354)
	call level.newVisibilityModifier(2957, -6775, 1056, -6221)
	call level.newVisibilityModifier(576, -7146, -2032, -6691)
	call level.newVisibilityModifier(910, -7127, 411, -6794)
	call level.newVisibilityModifier(405, -7008, 1079, -6489)
	call level.newVisibilityModifier(8241, -6668, 5581, -3935)
	call level.newVisibilityModifier(7373, -4088, 6147, -2768)
	call level.newVisibilityModifier(6619, -4134, 5912, -2791)

//monsters no move
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), 13692, -9218, -1, false).setId(2681)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), 13683, -9502, -1, false).setId(2682)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), 9746, -8879, -1, false).setId(2703)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), 9202, -8539, -1, false).setId(2704)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), 9230, -9126, -1, false).setId(2705)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), 7811, -8493, -1, false).setId(2706)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), 7808, -8592, -1, false).setId(2707)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), 7809, -8686, -1, false).setId(2708)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), 7802, -8796, -1, false).setId(2709)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), 6987, -8251, -1, false).setId(2710)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), 5233, -8652, -1, false).setId(2711)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), 4885, -8338, -1, false).setId(2712)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), 2854, -9200, -1, false).setId(2715)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), -792, -7669, -1, false).setId(2723)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), -824, -8332, -1, false).setId(2724)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), 6399, -6987, -1, false).setId(2733)
endfunction

function Init_level3_part2_Actions takes nothing returns nothing
	local Level level = ForceGetLevel(3)


//monsters no move
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), 6520, -7237, -1, false).setId(2734)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), 16200, -6432, -1, false).setId(2758)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), 16855, -5289, -1, false).setId(2760)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), 17061, -4900, -1, false).setId(2765)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), 17053, -4214, -1, false).setId(2766)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), 16816, -3636, -1, false).setId(2768)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), 14564, -4414, -1, false).setId(2772)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), 13982, -4357, -1, false).setId(2773)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), 13187, -3211, -1, false).setId(2775)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), 12453, -2910, -1, false).setId(2776)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), 11788, -3869, -1, false).setId(2779)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), 6289, -5845, -1, false).setId(2790)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), 6512, -4463, -1, false).setId(2793)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), 5794, -3455, -1, false).setId(2796)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), 4793, -3457, -1, false).setId(2797)
	call level.monstersNoMove.new(udg_monsterTypes.get("Gpeon"), 18142, -4829, -1, false).setId(4542)
	call level.monstersNoMove.new(udg_monsterTypes.get("Gpeon"), 18215, -4827, -1, false).setId(4543)
	call level.monstersNoMove.new(udg_monsterTypes.get("Gpeon"), 18169, -4881, -1, false).setId(4544)
	call level.monstersNoMove.new(udg_monsterTypes.get("Gpeon"), 18187, -4939, -1, false).setId(4545)
	call level.monstersNoMove.new(udg_monsterTypes.get("Gpeon"), 18146, -4982, -1, false).setId(4546)
	call level.monstersNoMove.new(udg_monsterTypes.get("Gpeon"), 17997, -3601, -1, false).setId(4547)
	call level.monstersNoMove.new(udg_monsterTypes.get("Gpeon"), 18023, -3680, -1, false).setId(4548)
	call level.monstersNoMove.new(udg_monsterTypes.get("Gpeon"), 18111, -3562, -1, false).setId(4549)
	call level.monstersNoMove.new(udg_monsterTypes.get("Gpeon"), 18124, -3657, -1, false).setId(4550)
	call level.monstersNoMove.new(udg_monsterTypes.get("Gpeon"), 18113, -3784, -1, false).setId(4551)
	call level.monstersNoMove.new(udg_monsterTypes.get("Gpeon"), 17656, -6118, -1, false).setId(4552)
	call level.monstersNoMove.new(udg_monsterTypes.get("Gpeon"), 17755, -6120, -1, false).setId(4553)
	call level.monstersNoMove.new(udg_monsterTypes.get("Gpeon"), 17698, -6211, -1, false).setId(4554)
	call level.monstersNoMove.new(udg_monsterTypes.get("Gpeon"), 17790, -6217, -1, false).setId(4555)
	call level.monstersNoMove.new(udg_monsterTypes.get("Gpeon"), 17605, -6222, -1, false).setId(4556)
	call level.monstersNoMove.new(udg_monsterTypes.get("Goldmine"), 17830, -3994, 270, false).setId(5140)
	call level.monstersNoMove.new(udg_monsterTypes.get("Goldmine"), 17914, -4918, 270, false).setId(5141)
	call level.monstersNoMove.new(udg_monsterTypes.get("Goldmine"), 17831, -5797, 270, false).setId(5143)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), 4608, -8713, -1, false).setId(11504)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), 3710, -8083, -1, false).setId(11505)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), 4088, -9880, -1, false).setId(11506)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), 3570, -9529, -1, false).setId(11507)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), 16852, -5821, -1, false).setId(14894)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), 6405, -5145, -1, false).setId(14935)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), 6671, -3868, -1, false).setId(15819)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), 15606, -8261, -1, false).setId(15827)

//monsters simple patrol
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 7211, -8523, 7474, -8107, false).setId(265)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 6083, -9715, 6049, -9179, false).setId(270)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 6029, -5310, 6751, -5295, false).setId(413)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 6065, -9206, 6483, -9222, false).setId(2231)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 5826, -3095, 5119, -3832, false).setId(2798)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 8985, -8382, 9340, -8299, false).setId(9701)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 6769, -5532, 6024, -5509, false).setId(9745)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 4869, -3110, 5583, -3825, false).setId(9747)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 13854, -8998, 13839, -9723, false).setId(10700)
endfunction

function Init_level3_part3_Actions takes nothing returns nothing
	local Level level = ForceGetLevel(3)


//monsters simple patrol
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 9592, -9336, 9384, -8354, false).setId(10727)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 8887, -9407, 9973, -8588, false).setId(10728)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 8841, -8186, 9168, -7866, false).setId(10729)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 8706, -8066, 8700, -7566, false).setId(10730)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 8528, -8407, 8127, -7889, false).setId(10731)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 8373, -8673, 8092, -8307, false).setId(10732)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 7812, -8373, 7415, -9192, false).setId(10733)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 7806, -8381, 8196, -9196, false).setId(10734)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 7097, -8664, 6740, -8125, false).setId(10735)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 6856, -9030, 6351, -8518, false).setId(10736)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 6715, -9175, 6179, -8696, false).setId(10737)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 5586, -9683, 5894, -9236, false).setId(10738)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 5272, -9338, 5752, -9103, false).setId(10739)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 5046, -9295, 5725, -8680, false).setId(10740)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 4916, -8883, 5635, -8327, false).setId(10741)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 5316, -8013, 4873, -8833, false).setId(10742)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 5947, -7073, 5972, -7666, false).setId(10768)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 6393, -7545, 6027, -7037, false).setId(10769)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 6764, -5026, 6036, -5024, false).setId(10815)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 5609, -3818, 5604, -3082, false).setId(10817)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 5332, -3107, 4967, -3812, false).setId(10818)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 4305, -8708, 4297, -9096, false).setId(14171)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 2493, -9279, 2900, -8522, false).setId(14172)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 3280, -9915, 4058, -9654, false).setId(14173)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 4298, -9294, 4593, -9584, false).setId(14174)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 16683, -6228, 17094, -6452, false).setId(14891)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 16435, -5829, 17199, -6200, false).setId(14892)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 16533, -5513, 17342, -5930, false).setId(14893)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 17210, -3520, 16568, -3999, false).setId(14895)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 16989, -3283, 16575, -3493, false).setId(14896)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 16372, -3289, 16735, -3023, false).setId(14897)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 16311, -2746, 16107, -3273, false).setId(14898)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 15307, -2767, 15824, -3144, false).setId(14899)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 15691, -3780, 15416, -3323, false).setId(14900)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 14977, -2968, 14981, -3841, false).setId(14901)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 14530, -3460, 15276, -3446, false).setId(14902)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 14794, -4146, 15182, -3921, false).setId(14903)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 14769, -4263, 14761, -4714, false).setId(14904)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 14413, -4240, 14403, -4720, false).setId(14905)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 14302, -3962, 13863, -3974, false).setId(14906)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 13505, -4398, 13800, -4158, false).setId(14907)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 14044, -3530, 13758, -3738, false).setId(14908)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 13254, -4135, 13511, -3806, false).setId(14909)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 13579, -3114, 13579, -3556, false).setId(14910)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 13524, -3619, 12982, -3452, false).setId(14911)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 13122, -2896, 12765, -3378, false).setId(14912)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 12279, -3266, 12294, -2611, false).setId(14913)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 12696, -2826, 12531, -3192, false).setId(14914)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 11636, -2603, 11791, -3158, false).setId(14915)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 11990, -2994, 11438, -2814, false).setId(14916)
endfunction

function Init_level3_part4_Actions takes nothing returns nothing
	local Level level = ForceGetLevel(3)


//monsters simple patrol
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 12128, -3586, 11336, -3418, false).setId(14917)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 11470, -3887, 11941, -3411, false).setId(14918)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 11721, -5155, 12469, -4433, false).setId(14919)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 12357, -5166, 11619, -4422, false).setId(14920)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 11810, -4247, 12590, -4881, false).setId(14921)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 12311, -4281, 11527, -4918, false).setId(14922)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 11320, -4750, 12757, -4738, false).setId(14923)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 11698, -4319, 12373, -4297, false).setId(14924)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 11684, -5153, 12363, -5151, false).setId(14925)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 6760, -5779, 6169, -6389, false).setId(14934)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 6434, -4730, 6778, -4725, false).setId(14936)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 6397, -4248, 6077, -4563, false).setId(14937)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 6046, -4136, 6389, -4123, false).setId(14938)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 6282, -3467, 6652, -3195, false).setId(14940)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 6295, -3586, 6776, -3557, false).setId(14942)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 6132, -3090, 6136, -3456, false).setId(14943)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 14162, -8998, 14183, -9693, false).setId(15820)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 14450, -8873, 14654, -9520, false).setId(15821)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 14681, -8768, 15034, -9174, false).setId(15822)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 14947, -8616, 15311, -9029, false).setId(15823)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 15562, -8760, 15154, -8404, false).setId(15824)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 15647, -7809, 15976, -8044, false).setId(15825)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 16022, -7412, 16262, -7555, false).setId(15826)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 16007, -7000, 16502, -6985, false).setId(15828)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 16498, -6167, 16522, -6774, false).setId(15829)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 11606, -5575, 11964, -6107, false).setId(15830)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 11208, -5819, 11588, -6212, false).setId(15831)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 11088, -6223, 11461, -6572, false).setId(15832)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 10932, -6476, 11374, -6828, false).setId(15833)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 10660, -6717, 11073, -7229, false).setId(15834)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 10416, -7113, 10839, -7464, false).setId(15835)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 10704, -7613, 10315, -7220, false).setId(15836)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 10204, -7323, 10601, -7739, false).setId(15837)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 10049, -7497, 10454, -7871, false).setId(15838)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 9905, -7772, 10307, -8112, false).setId(15839)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 9817, -8186, 10059, -8431, false).setId(15840)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 6291, -6634, 6788, -6639, false).setId(15841)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 6045, -5998, 6792, -5976, false).setId(15842)

//monsters multiple patrols
	call MonsterMultiplePatrols.storeNewLoc(4015, -9086)
	call MonsterMultiplePatrols.storeNewLoc(3191, -9104)
	call MonsterMultiplePatrols.storeNewLoc(3186, -8447)
	call MonsterMultiplePatrols.storeNewLoc(4076, -8387)
	call level.monstersMultiplePatrols.new(udg_monsterTypes.get("lightning1"), "normal", false).setId(12079)

	call MonsterMultiplePatrols.storeNewLoc(4290, -8919)
	call MonsterMultiplePatrols.storeNewLoc(4233, -9713)
	call MonsterMultiplePatrols.storeNewLoc(3156, -9698)
	call MonsterMultiplePatrols.storeNewLoc(3183, -8449)
	call MonsterMultiplePatrols.storeNewLoc(4295, -8397)
	call level.monstersMultiplePatrols.new(udg_monsterTypes.get("lightning2"), "normal", false).setId(12080)

	call MonsterMultiplePatrols.storeNewLoc(4557, -8900)
	call MonsterMultiplePatrols.storeNewLoc(4534, -9405)
	call MonsterMultiplePatrols.storeNewLoc(2761, -9405)
	call MonsterMultiplePatrols.storeNewLoc(2682, -8461)
	call MonsterMultiplePatrols.storeNewLoc(4629, -8393)
	call level.monstersMultiplePatrols.new(udg_monsterTypes.get("lightning3"), "normal", false).setId(12082)

//monsters teleport

//monster spawns

//meteors

//casters

endfunction


function Init_level4_Actions takes nothing returns nothing
	local Level level = ForceGetLevel(4)

//start message

//lives earned
	call level.setNbLivesEarned(10)

//start location
	call level.newStart(3559, -3991, 4629, -2917)

//end location
	call level.newEnd(12767, 226, 12993, 1626)

//visibilities
	call level.newVisibilityModifier(-2029, -18413, 18400, 2006)

//monsters no move
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), -472, -3564, -1, false).setId(2930)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), -362, -1704, -1, false).setId(2936)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), 50, -166, -1, false).setId(2937)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), 798, -281, -1, false).setId(2938)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), 749, -1283, -1, false).setId(2939)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), 1424, -1224, -1, false).setId(2940)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), 1456, -177, -1, false).setId(2941)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), 2052, -763, -1, false).setId(2942)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), 2703, -1161, -1, false).setId(2943)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), 2690, -588, -1, false).setId(2944)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), 3396, -1512, -1, false).setId(2945)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), 4219, -2050, -1, false).setId(2946)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), 4816, -2146, -1, false).setId(2949)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), 5684, -786, -1, false).setId(2951)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), 6169, -1247, -1, false).setId(2952)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), 5403, -1163, -1, false).setId(2953)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), 5395, -2052, -1, false).setId(2954)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), 5501, -1592, -1, false).setId(2955)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), 3939, -1318, -1, false).setId(2961)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), 3937, -1759, -1, false).setId(2962)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), 6931, -1310, -1, false).setId(2963)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), 6927, -1767, -1, false).setId(2964)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), 8180, -3599, -1, false).setId(2965)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), 8834, -3823, -1, false).setId(2966)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), 9535, -3592, -1, false).setId(2967)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), 10106, -3602, -1, false).setId(2968)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), 9388, -1166, -1, false).setId(2969)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), 8654, -1231, -1, false).setId(2970)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), 7947, -666, -1, false).setId(2971)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), 7799, 72, -1, false).setId(2972)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), 8139, 710, -1, false).setId(2973)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), 8678, 220, -1, false).setId(2974)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), 9024, -188, -1, false).setId(2975)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), 10966, 961, -1, false).setId(2976)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), 10536, 317, -1, false).setId(2977)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), 10256, -288, -1, false).setId(2978)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), 10533, -1013, -1, false).setId(2979)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), 11727, -1236, -1, false).setId(2980)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), 14594, -2304, -1, false).setId(2982)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), 16237, -2207, -1, false).setId(2983)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), 15761, -360, -1, false).setId(2986)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), 15935, 380, -1, false).setId(2987)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), 14984, 746, -1, false).setId(2990)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), 14989, -532, -1, false).setId(2991)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), 14193, 346, -1, false).setId(2992)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), 13227, 1017, -1, false).setId(2993)
endfunction

function Init_level4_part2_Actions takes nothing returns nothing
	local Level level = ForceGetLevel(4)


//monsters no move
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), 14305, 905, -1, false).setId(2994)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), 9180, -2326, -1, false).setId(15845)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), -74, -2360, -1, false).setId(15873)
	call level.monstersNoMove.new(udg_monsterTypes.get("burrow"), 16645, 1224, -1, false).setId(15876)

//monsters simple patrol
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), -449, -2402, 10, -2034, false).setId(475)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), -501, -2057, 0, -1702, false).setId(476)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), -657, -1664, -133, -1465, false).setId(477)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), -146, -1444, -663, -1235, false).setId(478)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), -136, -899, -645, -679, false).setId(480)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 20, -404, -278, 126, false).setId(482)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 1096, -1271, 1085, -1772, false).setId(491)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 8451, -3323, 8550, -4091, false).setId(510)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 9097, -3298, 9321, -4122, false).setId(512)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 9175, -3317, 9116, -4101, false).setId(515)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 9079, -1531, 9732, -848, false).setId(517)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 8277, -760, 8614, -1545, false).setId(519)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 7675, -559, 8202, -375, false).setId(521)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 7547, -182, 8052, -62, false).setId(522)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 7544, 265, 8081, 216, false).setId(523)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 9467, 260, 9962, 288, false).setId(530)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 9853, 709, 9359, 716, false).setId(531)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 10590, 772, 11046, 412, false).setId(537)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 10411, 642, 10821, 194, false).setId(538)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 10485, -437, 10005, -497, false).setId(541)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 11394, -679, 10980, -229, false).setId(545)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 11747, -771, 12340, -793, false).setId(550)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 18042, -1556, 17408, -1573, false).setId(576)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 18034, -1004, 17532, -1024, false).setId(578)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 18029, -717, 17538, -694, false).setId(579)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 15379, 773, 14604, 754, false).setId(602)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 514, -394, 996, 92, false).setId(2820)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 3101, -1598, 3560, -467, false).setId(2825)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 8228, -3348, 9048, -4077, false).setId(2828)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 9880, -4081, 9332, -3340, false).setId(2829)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 9410, -764, 9384, -1555, false).setId(2832)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 8495, -801, 8484, -1511, false).setId(2833)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 7600, -440, 8136, -183, false).setId(2834)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 9178, 83, 8620, -332, false).setId(2837)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 9853, 857, 9346, 880, false).setId(2839)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 9839, 606, 9360, 583, false).setId(2840)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 9374, 413, 9962, 433, false).setId(2841)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 9943, 1081, 9550, 1493, false).setId(2842)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 10135, 1657, 10110, 1159, false).setId(2843)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 10594, -741, 10250, -1154, false).setId(2846)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 10887, -734, 11337, -1091, false).setId(2847)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 12126, -1341, 11684, -868, false).setId(2850)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 11803, -632, 12315, -586, false).setId(2851)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 11773, -1552, 11277, -1284, false).setId(2855)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 13060, -759, 13061, -1553, false).setId(2857)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 18042, -1650, 17424, -1679, false).setId(2867)
endfunction

function Init_level4_part3_Actions takes nothing returns nothing
	local Level level = ForceGetLevel(4)


//monsters simple patrol
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 18039, -1446, 17460, -1469, false).setId(2868)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 18043, -1184, 17554, -1214, false).setId(2869)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 17576, -1100, 18030, -1081, false).setId(2870)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 18022, -885, 17564, -869, false).setId(2871)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 18032, -582, 17538, -578, false).setId(2872)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 15760, 1549, 16774, 1558, false).setId(2882)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 14779, 341, 15176, -115, false).setId(2886)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 14763, -721, 15209, -324, false).setId(2887)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 13260, 1249, 14022, 798, false).setId(2890)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 13661, 1261, 13646, 804, false).setId(2892)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 14240, 1261, 13815, 780, false).setId(2893)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 13460, 559, 13840, 127, false).setId(2894)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 14049, 637, 14045, 124, false).setId(2900)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 1630, -568, 1164, -554, false).setId(9751)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 1012, -1298, 627, -1641, false).setId(9753)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 2281, -1012, 1810, -1025, false).setId(9754)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 8188, -779, 7949, -1022, false).setId(9760)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 7852, 799, 8184, 385, false).setId(9761)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 12792, -1047, 12791, -1276, false).setId(9763)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 17285, -2196, 17424, -2792, false).setId(9766)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 15988, 115, 15595, 491, false).setId(9769)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 14806, 433, 15140, 444, false).setId(9770)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 14800, -216, 15141, -203, false).setId(9771)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 14070, 1248, 14064, 764, false).setId(9775)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), -151, -1033, -609, -1376, false).setId(10832)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), -42, -561, -611, -391, false).setId(10833)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 159, 101, 161, -400, false).setId(10834)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 374, 104, 387, -379, false).setId(10835)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 551, -507, 1014, -509, false).setId(10836)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 1003, -686, 538, -679, false).setId(10837)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 987, -896, 544, -902, false).setId(10838)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 998, -1131, 531, -1117, false).setId(10839)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 1532, -1666, 1154, -1278, false).setId(10840)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 1649, -1042, 1187, -1036, false).setId(10841)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 1629, -811, 1185, -795, false).setId(10842)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 1723, -382, 1705, 99, false).setId(10843)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 2170, -12, 1802, -400, false).setId(10844)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 2280, -548, 1833, -540, false).setId(10845)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 2287, -1295, 1918, -1656, false).setId(10846)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 2347, -1309, 2359, -1781, false).setId(10847)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 2814, -1671, 2426, -1284, false).setId(10848)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 2939, -925, 2445, -915, false).setId(10849)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 2931, -380, 2538, -38, false).setId(10850)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 2997, -376, 2998, 92, false).setId(10851)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 3078, -370, 3446, 0, false).setId(10852)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 3563, -1236, 3092, -1247, false).setId(10853)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 3116, -645, 3566, -1305, false).setId(10855)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 8918, -3361, 8535, -4064, false).setId(10857)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 9761, -3379, 9372, -4066, false).setId(10858)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 9815, -3366, 10213, -3984, false).setId(10859)
endfunction

function Init_level4_part4_Actions takes nothing returns nothing
	local Level level = ForceGetLevel(4)


//monsters simple patrol
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 11064, -2012, 10569, -1363, false).setId(10860)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 8063, -1416, 8816, -896, false).setId(10861)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 8099, 277, 7697, 645, false).setId(10862)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 8321, 517, 8314, 994, false).setId(10863)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 8319, 485, 8802, 833, false).setId(10864)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 8377, 188, 8927, 446, false).setId(10865)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 8956, 108, 8455, -167, false).setId(10866)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 9199, -12, 9215, -521, false).setId(10867)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 9385, 123, 9792, -335, false).setId(10868)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 9826, 1001, 9381, 1014, false).setId(10869)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 9985, 1170, 9976, 1617, false).setId(10870)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 10302, 1172, 10294, 1628, false).setId(10871)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 10586, 1634, 10590, 1179, false).setId(10872)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 10628, 1159, 10999, 1510, false).setId(10873)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 11209, 1218, 10657, 782, false).setId(10874)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 10654, 1139, 11212, 705, false).setId(10875)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 10319, 585, 10670, 43, false).setId(10876)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 10178, 315, 10570, -217, false).setId(10877)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 10481, -673, 10033, -948, false).setId(10878)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 10704, -813, 10691, -1277, false).setId(10879)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 10854, -802, 11188, -1246, false).setId(10880)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 11359, -731, 10911, -721, false).setId(10881)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 11304, -150, 11435, -627, false).setId(10882)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 11489, -51, 11728, -604, false).setId(10883)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 11779, -37, 11777, -511, false).setId(10884)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 11758, -1625, 11288, -1630, false).setId(10885)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 11771, -1677, 11402, -2048, false).setId(10886)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 12123, -1689, 12122, -2149, false).setId(10887)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 12291, -1653, 12676, -2038, false).setId(10888)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 12343, -1481, 12786, -1492, false).setId(10890)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 13208, -1408, 13553, -1042, false).setId(10891)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 13225, -1614, 13679, -1594, false).setId(10892)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 13761, -1865, 13214, -2228, false).setId(10893)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 14301, -2533, 14286, -2069, false).setId(10896)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 18031, -1330, 17567, -1330, false).setId(10907)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 17551, -523, 17924, -120, false).setId(10908)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 17428, -44, 17426, -497, false).setId(10909)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 17210, -44, 17208, -501, false).setId(10910)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 17135, -519, 16787, -123, false).setId(10911)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 16421, -930, 16406, -1398, false).setId(10914)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 16209, -927, 16222, -1405, false).setId(10915)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 16056, -934, 16059, -1409, false).setId(10916)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 15494, -675, 15962, -675, false).setId(10919)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 15526, -536, 15993, -518, false).setId(10921)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 16073, 621, 16077, 144, false).setId(10924)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 16232, 606, 16249, 161, false).setId(10925)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 17601, 1085, 18002, 1599, false).setId(10926)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 17803, 1757, 17769, 1044, false).setId(10927)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 17542, 1285, 17546, 1762, false).setId(10928)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 17106, 1730, 17471, 1191, false).setId(10929)
endfunction

function Init_level4_part5_Actions takes nothing returns nothing
	local Level level = ForceGetLevel(4)


//monsters simple patrol
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 16707, 1592, 16401, 1153, false).setId(10932)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 16261, 1772, 16259, 1279, false).setId(10933)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 16138, 1140, 15779, 1546, false).setId(10934)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 15681, 1506, 15701, 1033, false).setId(10935)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 15607, 1517, 15305, 1073, false).setId(10936)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 15238, 1150, 15229, 1631, false).setId(10937)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 15196, 1135, 14736, 1144, false).setId(10938)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 14750, 945, 15237, 947, false).setId(10939)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 15194, 298, 14762, -58, false).setId(10940)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 14786, -320, 15174, -709, false).setId(10941)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 13845, -794, 14572, -805, false).setId(10944)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 13810, -23, 13367, -322, false).setId(10948)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 13808, 46, 13322, 42, false).setId(10949)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 13805, 107, 13336, 296, false).setId(10950)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 14472, 251, 14062, 631, false).setId(10951)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 14108, 696, 14567, 686, false).setId(10952)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 13727, 1243, 13297, 791, false).setId(10954)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 7747, -1361, 7242, -1853, false).setId(14944)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 7487, -1203, 7497, -1890, false).setId(14945)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 7701, -2055, 8056, -2044, false).setId(14947)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 7641, -2258, 7988, -2488, false).setId(14949)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 7447, -2722, 7905, -2690, false).setId(14950)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 7784, -2960, 7340, -2918, false).setId(14951)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 10584, -2706, 10179, -3116, false).setId(14957)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 10696, -3112, 10236, -2718, false).setId(14958)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 9691, -2744, 9863, -3025, false).setId(14959)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 9542, -2836, 9539, -3188, false).setId(14960)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 9162, -2768, 8912, -3126, false).setId(14961)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 8811, -2608, 8830, -3051, false).setId(14962)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 8529, -2495, 8240, -2116, false).setId(14963)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 8414, -1974, 8610, -2250, false).setId(14964)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 8703, -1700, 8721, -2159, false).setId(14965)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 9145, -1874, 8898, -2219, false).setId(14966)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 9464, -2330, 9465, -2654, false).setId(14970)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 9899, -2198, 9896, -2546, false).setId(14972)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 10495, -1832, 10468, -2533, false).setId(14973)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 10837, -2359, 10302, -2001, false).setId(14974)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 10331, -2502, 10858, -2037, false).setId(14975)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 10624, -1781, 11006, -1532, false).setId(14976)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 9993, -1447, 9988, -2126, false).setId(14977)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 9822, -1603, 10177, -1969, false).setId(14978)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 9786, -1956, 10109, -1598, false).setId(14979)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 9010, -1000, 9812, -1005, false).setId(14980)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 9798, -1327, 9042, -961, false).setId(14981)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 11959, -1718, 11943, -2162, false).setId(14982)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 12276, -1700, 12319, -2165, false).setId(14983)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 13225, -1495, 13676, -1436, false).setId(14985)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 13667, -1798, 13190, -1886, false).setId(14986)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 14955, -1952, 14943, -2277, false).setId(14988)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 15375, -1823, 15807, -2238, false).setId(14989)
endfunction

function Init_level4_part6_Actions takes nothing returns nothing
	local Level level = ForceGetLevel(4)


//monsters simple patrol
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 15325, -2267, 15826, -1830, false).setId(14990)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 15569, -1818, 15561, -2281, false).setId(14991)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 16141, -1933, 16131, -2404, false).setId(14992)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 16635, -2078, 16376, -2377, false).setId(14993)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 16808, -2087, 16795, -2527, false).setId(14994)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 16441, -2492, 17089, -2129, false).setId(14995)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 17750, -2560, 17082, -2603, false).setId(14996)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 17408, -2055, 17653, -2179, false).setId(14997)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 17891, -1918, 17420, -1930, false).setId(14998)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 16678, -368, 17119, -511, false).setId(14999)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 16676, -854, 16994, -850, false).setId(15000)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 16638, -932, 16956, -1226, false).setId(15001)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 15859, -1048, 15696, -1347, false).setId(15002)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 15854, -953, 15539, -953, false).setId(15003)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 15591, -222, 15876, -14, false).setId(15004)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 15870, 6, 15511, -17, false).setId(15005)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 17022, 1658, 17228, 1173, false).setId(15006)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 16785, 1549, 16940, 1068, false).setId(15008)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 7475, -3243, 7897, -3027, false).setId(15843)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 7848, -3519, 8149, -3126, false).setId(15844)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 13908, -2016, 13387, -2361, false).setId(15846)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 13880, -1994, 13678, -2515, false).setId(15847)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 14117, -994, 15215, -992, false).setId(15848)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 14104, -1304, 15200, -1342, false).setId(15849)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 13978, -1169, 15342, -1161, false).setId(15850)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 14206, -421, 13756, -699, false).setId(15851)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 14176, -81, 13508, -456, false).setId(15852)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 3087, -3446, 3334, -3711, false).setId(15853)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 3073, -3469, 2823, -3834, false).setId(15854)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 2646, -3350, 2659, -3828, false).setId(15855)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 2519, -3281, 2122, -3794, false).setId(15856)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 1985, -3634, 2346, -3132, false).setId(15857)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 1910, -2965, 1871, -3456, false).setId(15858)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 743, -3171, 743, -2334, false).setId(15864)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 888, -2337, 888, -3164, false).setId(15865)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 1047, -2600, 1049, -3316, false).setId(15866)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 1175, -2715, 1176, -3292, false).setId(15867)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 1430, -2957, 1430, -3570, false).setId(15868)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 1551, -2957, 1551, -3570, false).setId(15869)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 431, -2317, 431, -2802, false).setId(15870)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 146, -2061, 146, -2674, false).setId(15872)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 3700, -1293, 3700, -1778, false).setId(15874)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("peon"), 9482, -2302, 9790, -2635, false).setId(15875)

//monsters multiple patrols

//monsters teleport

//monster spawns
	call level.monsterSpawns.new("Masspeon", udg_monsterTypes.get("peon"), "upToDown", 4.000, 3888, -2684, 6960, -317, false)

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
	local trigger initLevel3 = CreateTrigger()
	local trigger initLevel3_part2 = CreateTrigger()
	local trigger initLevel3_part3 = CreateTrigger()
	local trigger initLevel3_part4 = CreateTrigger()
	local trigger initLevel4 = CreateTrigger()
	local trigger initLevel4_part2 = CreateTrigger()
	local trigger initLevel4_part3 = CreateTrigger()
	local trigger initLevel4_part4 = CreateTrigger()
	local trigger initLevel4_part5 = CreateTrigger()
	local trigger initLevel4_part6 = CreateTrigger()
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
	call TriggerAddAction(initLevel3, function Init_level3_Actions)
	call TriggerRegisterTimerEventSingle(initLevel3, 0.0007)
	call TriggerAddAction(initLevel3_part2, function Init_level3_part2_Actions)
	call TriggerRegisterTimerEventSingle(initLevel3_part2, 0.0008)
	call TriggerAddAction(initLevel3_part3, function Init_level3_part3_Actions)
	call TriggerRegisterTimerEventSingle(initLevel3_part3, 0.0009)
	call TriggerAddAction(initLevel3_part4, function Init_level3_part4_Actions)
	call TriggerRegisterTimerEventSingle(initLevel3_part4, 0.0010)
	call TriggerAddAction(initLevel4, function Init_level4_Actions)
	call TriggerRegisterTimerEventSingle(initLevel4, 0.0011)
	call TriggerAddAction(initLevel4_part2, function Init_level4_part2_Actions)
	call TriggerRegisterTimerEventSingle(initLevel4_part2, 0.0012)
	call TriggerAddAction(initLevel4_part3, function Init_level4_part3_Actions)
	call TriggerRegisterTimerEventSingle(initLevel4_part3, 0.0013)
	call TriggerAddAction(initLevel4_part4, function Init_level4_part4_Actions)
	call TriggerRegisterTimerEventSingle(initLevel4_part4, 0.0014)
	call TriggerAddAction(initLevel4_part5, function Init_level4_part5_Actions)
	call TriggerRegisterTimerEventSingle(initLevel4_part5, 0.0015)
	call TriggerAddAction(initLevel4_part6, function Init_level4_part6_Actions)
	call TriggerRegisterTimerEventSingle(initLevel4_part6, 0.0016)
endfunction

