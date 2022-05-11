function Init_level0_Actions takes nothing returns nothing
	local Level level = ForceGetLevel(0)

//start message

//lives earned
	call level.setNbLivesEarned(5)

//start location
	call level.newStart(GetRectMinX(gg_rct_departLvl_0), GetRectMinY(gg_rct_departLvl_0), GetRectMaxX(gg_rct_departLvl_0), GetRectMaxY(gg_rct_departLvl_0))

//end location
	call level.newEnd(-1994, 9892, -1822, 11334)

//visibilities
	call level.newVisibilityModifier(4151, 5527, 2250, 11330)
	call level.newVisibilityModifier(-2989, 9637, 4185, 11968)

//monsters no move
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 3084, 9962, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("diplo"), 769, 10606, -90, false)

//monsters simple patrol
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("ptera"), 2884, 8398, 3661, 8427, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("ptera"), 3704, 9268, 2824, 9296, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("ptero"), 2829, 7371, 3698, 7371, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 2829, 10139, 3698, 10139, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("ptero"), 2842, 8830, 3698, 8817, false)

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
	call level.newStart(-2291, 10236, -1795, 10982)

//end location
	call level.newEnd(-3044, 4234, -2032, 4377)

//visibilities
	call level.newVisibilityModifier(-2623, 11789, -4544, 4140)
	call level.newVisibilityModifier(2533, 9940, -4149, 4341)
	call level.newVisibilityModifier(-3101, 4170, -1906, 4459)

//monsters no move
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), -1792, 9266, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), -1525, 9008, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), -1271, 8748, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), -821, 7603, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), -1350, 5488, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 278, 5011, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 340, 5147, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 467, 5415, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 577, 5283, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 505, 7242, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 714, 7927, -1, false)

//monsters simple patrol
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("allo"), 178, 8589, 178, 9330, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), -141, 6917, -1010, 6917, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), -1011, 6764, -142, 6764, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("steg"), -1805, 9773, -2290, 9773, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("steg"), -1020, 8178, -1020, 7309, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("allo"), -1250, 6604, -537, 5912, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), -1523, 5829, -910, 5829, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), -253, 5105, -253, 4620, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), -917, 5005, -917, 5618, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 498, 7609, 13, 7609, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 1039, 8175, 1392, 8043, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("steg"), 397, 5661, 1266, 5661, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("steg"), 396, 6201, 1265, 6201, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("allo"), 913, 6779, 1521, 6616, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("allo"), 909, 6876, 1531, 7085, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("steg"), 1137, 8954, 780, 8954, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("steg"), 1293, 8951, 1650, 8951, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("steg"), 1266, 5921, 397, 5921, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), -1166, 8253, -1779, 8253, false)

//monsters multiple patrols

//monster spawns
	call level.monsterSpawns.new("sucho1", udg_monsterTypes.get("sucho"), "rightToLeft", 1.500, -2962, 4579, -1836, 6611, false)
	call level.monsterSpawns.new("sucho2", udg_monsterTypes.get("sucho"), "leftToRight", 1.500, -3360, 4565, -2089, 6605, false)

//meteors

//casters

endfunction


function Init_level2_Actions takes nothing returns nothing
	local Level level = ForceGetLevel(2)

//start message
	call level.setStartMessage("Warning ! Reverse slide !")

//lives earned

//start location
	call level.newStart(-2819, 3950, -2289, 4429)

//end location
	call level.newEnd(3651, 2958, 3770, 4120)

//visibilities
	call level.newVisibilityModifier(-4593, -521, 3398, 5684)
	call level.newVisibilityModifier(3053, 2740, 3925, 4491)

//monsters no move
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 3336, 3518, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), -2549, 2744, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), -894, 1916, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), -534, 2477, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), -726, 3170, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), -266, 3530, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 263, 3887, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), -615, 3844, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 1453, 1364, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 858, 2525, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), -2075, 1082, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), -1267, 1480, -1, false)

//monsters simple patrol
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("allo"), -2205, 1643, -2901, 922, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), -2930, 3101, -2189, 3101, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), -2931, 2062, -2190, 2062, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("allo"), -1144, 1651, -286, 938, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("allo"), 385, 3188, 990, 4063, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("allo"), 1015, 1655, 429, 1067, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("steg"), -1682, 909, -1682, 1650, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("steg"), -1139, 2229, -270, 2229, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("steg"), -1010, 2869, -269, 2869, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 1009, 2119, 396, 2119, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), -2190, 2290, -2931, 2290, false)

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
	call level.newStart(3663, 3270, 4135, 3749)

//end location
	call level.newEnd(13868, 14111, 14865, 14184)

//visibilities
	call level.newVisibilityModifier(3028, -509, 15200, 12126)
	call level.newVisibilityModifier(8023, 12803, 15187, 11849)
	call level.newVisibilityModifier(15187, 11849, 13872, 14187)

//monsters no move
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 13914, 611, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 13910, 759, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 13902, 902, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get(""), 3837, 3769, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("edap"), 14315, 12938, 180, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("edap"), 14473, 12382, 0, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("edap"), 14456, 13468, 0, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 8835, 5413, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 7981, 6076, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 8295, 6509, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 7653, 6363, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 6827, 7024, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 10900, 7919, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 11600, 7758, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 11352, 9182, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 11866, 9363, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 10782, 10477, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 8593, 2038, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 7579, 1928, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 7551, 2211, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 6176, 2114, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 5150, 2105, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 4675, 511, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 4711, -351, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 5483, -159, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 9207, 913, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 9627, 590, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 10118, 848, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 10751, 570, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 11248, 911, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 11876, 597, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 12336, 892, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 12825, 590, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 11889, 10177, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 12298, 9995, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 10727, 5122, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 12923, 6637, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 11433, 5244, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 11191, 5067, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 12751, 4707, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 11854, 7452, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 11122, 10288, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 12757, 9717, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 13222, 8211, -1, false)
endfunction

function Init_level3_part2_Actions takes nothing returns nothing
	local Level level = ForceGetLevel(3)


//monsters no move
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 13468, 11986, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 12929, 11808, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 12323, 11993, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 11815, 11817, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 11372, 11986, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 10875, 11806, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 10300, 11815, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 9939, 12050, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 9457, 11815, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 9063, 11905, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 8176, 5557, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 8472, 5983, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 13931, 11838, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 12838, 1965, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 11793, 3949, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 6877, 9187, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 7952, 9151, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 5519, 4992, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 5638, 4765, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 8216, 7470, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 8969, 7159, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 8928, 4469, -1, false)

//monsters simple patrol
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 8513, 4465, 8513, 3980, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 7820, 5796, 8689, 5796, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 7029, 6541, 7029, 7282, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 6541, 7396, 7026, 7396, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 7848, 7564, 7848, 8305, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 8486, 7794, 8486, 7053, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 8806, 7053, 8806, 7794, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 9703, 8306, 9703, 7821, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 8973, 8072, 10226, 8072, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 11660, 8955, 12145, 8955, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 10892, 9603, 11505, 9603, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 11612, 10866, 11612, 10253, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("allo"), 7038, 7565, 6573, 8279, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("steg"), 9811, 2573, 9811, 3186, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("steg"), 9816, 2418, 9816, 1805, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 9911, 7820, 9911, 8817, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 10737, 8524, 9740, 8524, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("steg"), 12044, 7870, 12657, 7870, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("steg"), 11431, 7436, 11431, 8049, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("allo"), 11676, 8371, 12544, 8931, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("allo"), 4210, 1729, 3597, 1729, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("allo"), 10508, 2492, 11121, 2492, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("allo"), 5260, 883, 5873, 883, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("allo"), 4210, 104, 3597, 104, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("allo"), 7401, 882, 7401, 141, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("steg"), 10636, 10113, 11249, 10113, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 5478, 2418, 5478, 1805, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 5845, 1804, 5845, 2417, false)
endfunction

function Init_level3_part3_Actions takes nothing returns nothing
	local Level level = ForceGetLevel(3)


//monsters simple patrol
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 4745, 1650, 4745, 1037, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("ptera"), 7708, 3862, 7704, 3338, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("ptera"), 7681, 4479, 7690, 3999, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("ptera"), 7699, 3199, 7694, 2694, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("steg"), 9101, 4999, 9586, 4999, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("allo"), 7435, 6284, 7435, 6897, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("allo"), 11240, 10775, 11491, 10138, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 9058, 3826, 9058, 3341, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 9965, 3859, 10104, 3441, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("allo"), 10381, 4217, 10994, 4217, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("allo"), 10737, 4808, 10124, 4808, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 12812, 8859, 13425, 8859, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 13426, 8591, 12813, 8591, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 13308, 6514, 13308, 5901, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("steg"), 12813, 7646, 13298, 7646, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("allo"), 11761, 3347, 11148, 3347, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("allo"), 11917, 2622, 12530, 2622, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 11902, 3227, 11603, 2684, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 13315, 3460, 12802, 3754, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 13043, 3999, 13440, 3707, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("steg"), 7178, 7949, 7178, 8306, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("steg"), 7553, 8433, 7553, 7948, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 12940, 8097, 13553, 8097, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("steg"), 8798, 5093, 9245, 5532, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("steg"), 7790, 6118, 7970, 6695, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("steg"), 8560, 6129, 8560, 5132, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("steg"), 12406, 10225, 12406, 9612, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("steg"), 12941, 2606, 13554, 2606, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("allo"), 13554, 2945, 12941, 2945, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 12795, 2360, 13198, 1890, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 12222, 4940, 12677, 4322, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 7794, 8973, 7794, 9330, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 4740, 5114, 4403, 5578, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 5385, 5108, 5722, 5581, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("steg"), 7949, 7278, 9202, 7278, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("steg"), 12919, 9588, 13535, 9949, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("allo"), 9341, 4329, 8617, 4969, false)

//monsters multiple patrols

//monster spawns
	call level.monsterSpawns.new("suchoReversePath", udg_monsterTypes.get("sucho"), "leftToRight", 1.100, 9400, 5614, 12383, 7161, false)
	call level.monsterSpawns.new("suchoFastPath", udg_monsterTypes.get("sucho"), "downToUp", 3.500, 9090, -203, 13682, 1314, false)
	call level.monsterSpawns.new("suchoDroite", udg_monsterTypes.get("sucho"), "rightToLeft", 14.000, 13827, 4337, 15111, 11372, false)

//meteors
	call level.meteors.new(14208, 736, false)
	call level.meteors.new(11504, 2043, false)
	call level.meteors.new(13317, 9350, false)

//casters
	call level.casters.new(udg_casterTypes.get("dra"), 8639, 10682, -1, false)
	call level.casters.new(udg_casterTypes.get("dra"), 6341, 9625, -1, false)
	call level.casters.new(udg_casterTypes.get("dra"), 4642, 6756, 45, false)
	call level.casters.new(udg_casterTypes.get("dra"), 5450, 6751, 135, false)

endfunction


function Init_level4_Actions takes nothing returns nothing
	local Level level = ForceGetLevel(4)

//start message

//lives earned
	call level.setNbLivesEarned(2)

//start location
	call level.newStart(14090, 14073, 14718, 14834)

//end location
	call level.newEnd(-4169, 22126, -2974, 22297)

//visibilities
	call level.newVisibilityModifier(15310, 15055, 4520, 11242)
	call level.newVisibilityModifier(4802, 11310, -4599, 13472)
	call level.newVisibilityModifier(15002, 14629, 13771, 15205)
	call level.newVisibilityModifier(560, 12606, -4606, 19646)
	call level.newVisibilityModifier(-2051, 19094, -4544, 22203)

//monsters no move
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), -2776, 17134, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), -2989, 14801, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), -2884, 15167, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), -2337, 14558, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), -2399, 14508, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), -2470, 14437, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), -2572, 14387, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), -2653, 14345, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), -2755, 14308, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), -2107, 14372, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), -2177, 14320, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), -2246, 14269, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), -2314, 14219, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), -2386, 14170, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), -2489, 14104, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), -2579, 14048, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), -981, 14019, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), -730, 14017, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("diplo"), -2038, 15043, 45, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), -1890, 13781, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), -1642, 13756, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), -60, 13677, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), -300, 14648, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), -519, 15271, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), -845, 15049, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), -1887, 18703, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), -3283, 18773, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), -3545, 19064, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), -3804, 19547, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), -3576, 19830, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), -1280, 18693, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), -1195, 18506, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), -991, 18654, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), -1124, 18868, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), -2200, 18961, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), -2618, 18751, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), -2983, 18963, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), -1195, 16243, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), -1411, 16907, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), -1374, 16996, -1, false)

//monsters simple patrol
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 12956, 14833, 12956, 14092, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 12423, 14092, 12423, 14833, false)
endfunction

function Init_level4_part2_Actions takes nothing returns nothing
	local Level level = ForceGetLevel(4)


//monsters simple patrol
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 11888, 14834, 11888, 14093, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 11316, 14092, 11316, 14833, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 10761, 14833, 10761, 14092, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 10240, 14092, 10240, 14833, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 9703, 14833, 9703, 14092, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("steg"), 5516, 13253, 6129, 13253, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("steg"), 6130, 14016, 5517, 14016, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 5517, 13772, 6130, 13772, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 6130, 13471, 5517, 13471, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 6979, 14093, 6979, 14834, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 8106, 14834, 8106, 14093, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), -3341, 16853, -3954, 16853, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), -3294, 17037, -3294, 17650, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), -2931, 16683, -2446, 16683, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("allo"), -3415, 15828, -4098, 16175, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), -2445, 16317, -2930, 16317, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), -1933, 15978, -2930, 15978, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), -1933, 15644, -2930, 15644, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("allo"), -2930, 15819, -1933, 15819, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), -2384, 15119, -2964, 15515, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), -3323, 15046, -2425, 15025, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), -2419, 14976, -2821, 14569, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), -2044, 14098, -2299, 13563, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), -1289, 13680, -1411, 14108, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("steg"), -242, 14154, 242, 14154, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), -402, 14323, -624, 14371, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), -1273, 15384, -1615, 15018, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), -1155, 15589, -1487, 15969, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), -862, 15564, -537, 15805, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("allo"), -254, 15120, -652, 14693, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), -2178, 17540, -1648, 17538, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), -3955, 19305, -3470, 19305, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("allo"), -1245, 17996, -1927, 17830, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), -1535, 18563, -1401, 19092, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), -1530, 18474, -954, 18216, false)

//monsters multiple patrols

//monster spawns

//meteors

//casters
	call level.casters.new(udg_casterTypes.get("dra"), 3446, 13315, -45, false)
	call level.casters.new(udg_casterTypes.get("dra"), 4701, 12247, 45, false)
	call level.casters.new(udg_casterTypes.get("dra"), 2310, 12305, 45, false)
	call level.casters.new(udg_casterTypes.get("dra"), 1093, 13299, -45, false)
	call level.casters.new(udg_casterTypes.get("dra"), -3442, 13332, -45, false)
	call level.casters.new(udg_casterTypes.get("dra"), -3429, 12296, 45, false)
	call level.casters.new(udg_casterTypes.get("dra"), -1899, 12304, 45, false)
	call level.casters.new(udg_casterTypes.get("dra"), -459, 12296, 45, false)
	call level.casters.new(udg_casterTypes.get("dra"), -1928, 13297, -45, false)
	call level.casters.new(udg_casterTypes.get("dra"), -458, 13312, -45, false)
	call level.casters.new(udg_casterTypes.get("dra"), -3115, 16650, -1, false)
	call level.casters.new(udg_casterTypes.get("dra"), -3159, 20828, -90, false)

endfunction


function Init_level5_Actions takes nothing returns nothing
	local Level level = ForceGetLevel(5)

//start message

//lives earned
	call level.setNbLivesEarned(3)

//start location
	call level.newStart(-3937, 22068, -3248, 22873)

//end location
	call level.newEnd(2876, 21619, 4289, 21800)

//visibilities
	call level.newVisibilityModifier(-4591, 23512, 4030, 12421)
	call level.newVisibilityModifier(2941, 12817, 4899, 19505)
	call level.newVisibilityModifier(5600, 17553, 2617, 21609)

//monsters no move
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), -441, 20254, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), -1050, 22383, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), -757, 22515, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), -488, 22456, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 630, 21166, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 666, 20579, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 407, 20783, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 366, 22186, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 654, 22446, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 1821, 21561, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 2151, 16586, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 1242, 16572, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 1929, 15594, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 2042, 15219, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 3614, 14160, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 3731, 15667, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 3742, 15300, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 5212, 19389, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 3873, 16116, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 3565, 16292, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 3536, 16783, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 4085, 17387, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 4877, 18530, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 4758, 18532, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 5176, 18898, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), -1407, 20225, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), -1054, 20274, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 2639, 13965, -1, false)

//monsters simple patrol
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), -1779, 22029, -270, 22029, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), -1779, 21620, -270, 21620, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), -1778, 21397, -269, 21397, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), -1779, 21204, -270, 21204, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), -1778, 20962, -269, 20962, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), -269, 21286, -1778, 21286, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), -269, 21520, -1778, 21520, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), -269, 21723, -1778, 21723, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), -269, 21977, -1778, 21977, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), -269, 22139, -1778, 22139, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), -1779, 22234, -270, 22234, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), -269, 20824, -1778, 20824, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), -269, 20572, -1778, 20572, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), -1778, 20486, -269, 20486, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("allo"), -1829, 22284, -1829, 22769, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("allo"), -2118, 22769, -2118, 22284, false)
endfunction

function Init_level5_part2_Actions takes nothing returns nothing
	local Level level = ForceGetLevel(5)


//monsters simple patrol
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("allo"), -2431, 22285, -2431, 22770, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("allo"), -2789, 22769, -2789, 22284, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("allo"), -125, 20465, -125, 19980, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("steg"), 886, 20297, 121, 20886, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("steg"), 235, 21034, 1060, 20469, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 335, 21785, 733, 22107, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 369, 21708, 1035, 21705, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 898, 21468, 249, 21506, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("steg"), 1093, 22284, 1093, 22897, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("steg"), 3983, 21268, 3703, 20858, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("steg"), 3968, 20580, 4376, 20901, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("steg"), 1421, 22118, 2034, 22118, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("steg"), 4640, 20495, 4211, 20194, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("steg"), 1548, 20636, 2033, 20636, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("steg"), 4610, 19809, 4881, 20242, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("steg"), 1751, 19569, 1751, 19084, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("steg"), 781, 18849, 1266, 18849, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("steg"), 1265, 18630, 780, 18630, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("steg"), 5259, 19862, 4858, 19569, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("steg"), 1595, 17777, 1595, 17292, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("steg"), 1783, 17778, 1783, 17293, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("steg"), 1919, 17293, 1919, 17778, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("steg"), 5127, 18533, 4713, 18983, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("steg"), 1768, 15218, 1768, 14733, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("steg"), 1393, 14503, 908, 14503, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("steg"), 1899, 14066, 1899, 13581, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("steg"), 2327, 13580, 2327, 14065, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("steg"), 3376, 14065, 3376, 13580, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("steg"), 3213, 14858, 3698, 14858, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("steg"), 4081, 15896, 3596, 15896, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("steg"), 3341, 16514, 3826, 16514, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("steg"), 4478, 18487, 4884, 18143, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("steg"), 4613, 17773, 4327, 18089, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("steg"), 4076, 17819, 4355, 17506, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("steg"), 3704, 17459, 4116, 17120, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("steg"), 1054, 19417, 1475, 18962, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 1420, 21119, 1905, 21119, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 1805, 20277, 2290, 20277, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 2417, 19912, 1932, 19912, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 1932, 19683, 2417, 19683, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 1036, 17859, 1521, 17859, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 1394, 18243, 909, 18243, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 2033, 21844, 1548, 21844, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 2189, 17050, 2546, 17050, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 1636, 16882, 1636, 16397, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("allo"), 3449, 14319, 3943, 14705, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 1534, 14732, 1534, 15217, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 2901, 13837, 2901, 14322, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("allo"), 1677, 14362, 1279, 13814, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("allo"), 1544, 16117, 1018, 16119, false)
endfunction

function Init_level5_part3_Actions takes nothing returns nothing
	local Level level = ForceGetLevel(5)


//monsters simple patrol
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 1405, 22383, 1677, 22684, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 1549, 15874, 1199, 15543, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("allo"), 4097, 16659, 3468, 17382, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 2094, 14065, 2094, 13580, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 5200, 20192, 4684, 19630, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 4567, 20828, 4000, 20272, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 3736, 20659, 4315, 21201, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("allo"), 3953, 21332, 3340, 21332, false)

//monsters multiple patrols

//monster spawns

//meteors

//casters

endfunction


function Init_level6_Actions takes nothing returns nothing
	local Level level = ForceGetLevel(6)

//start message

//lives earned
	call level.setNbLivesEarned(4)

//start location
	call level.newStart(3244, 21579, 4055, 22497)

//end location
	call level.newEnd(6108, 16355, 6534, 16779)

//visibilities
	call level.newVisibilityModifier(2483, 23501, 19187, -482)
	call level.newVisibilityModifier(18980, 23520, 19262, -490)

//monsters no move
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 9812, 20655, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 9507, 19875, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 9722, 19814, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 9631, 20131, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 9983, 21340, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 11719, 21481, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 16898, 22233, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 16971, 22908, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 13548, 21365, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 13562, 22576, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 17260, 714, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 16986, 20077, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 16869, 20009, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 16783, 19957, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 16695, 19924, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 16608, 19880, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 16522, 19844, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 16517, 19532, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 16584, 19580, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 16646, 19605, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 16716, 19655, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 16802, 19689, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 16864, 19713, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 16949, 19744, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 17017, 19779, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 17089, 19798, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 17404, 20013, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 17403, 19907, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 17396, 19814, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 17393, 19732, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 18454, 18438, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 17352, 18825, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 16689, 18283, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 16939, 17768, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 16257, 17165, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 15818, 16680, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 16019, 16395, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 17161, 14886, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 18945, 14865, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 14092, 19341, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 14414, 16366, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 14684, 16636, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 12937, 19033, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("ptera"), 6031, 16775, 90, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("ptera"), 6641, 16758, 90, false)
endfunction

function Init_level6_part2_Actions takes nothing returns nothing
	local Level level = ForceGetLevel(6)


//monsters no move
	call level.monstersNoMove.new(udg_monsterTypes.get("ptera"), 6652, 16554, 90, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("ptera"), 6027, 16597, 90, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("ptero"), 6357, 16254, 90, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("ptera"), 6663, 16294, 90, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("ptera"), 6025, 16312, 90, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 11587, 16120, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 11500, 15877, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 10998, 15926, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 8276, 16937, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 8360, 16943, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 8438, 16943, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 8503, 16949, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 8543, 17023, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 8609, 17042, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 8721, 17057, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 8741, 17137, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 9834, 15488, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 8713, 16002, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 11194, 17911, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 11140, 18385, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 10554, 18496, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 11262, 17150, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 9919, 18860, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 9703, 18595, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 9282, 18829, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 10487, 18893, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 10229, 18725, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 11676, 17645, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 8106, 17681, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 7737, 17778, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 6770, 19069, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 9163, 17918, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 10106, 17216, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 9923, 16539, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 10174, 15891, -1, false)
	call level.monstersNoMove.new(udg_monsterTypes.get("plante"), 10226, 15501, -1, false)

//monsters simple patrol
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("allo"), 9733, 22285, 9733, 23154, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 6135, 22390, 6012, 22799, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 5622, 22538, 5740, 22021, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 8333, 22325, 8690, 22325, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("allo"), 4859, 22514, 4859, 21773, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("allo"), 5299, 21773, 5299, 22514, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("steg"), 14861, 21936, 15602, 21936, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("steg"), 15218, 21308, 14605, 21308, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("allo"), 7976, 23153, 7976, 22412, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("steg"), 16141, 21989, 17138, 21989, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("steg"), 7139, 21396, 7286, 20844, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("steg"), 17541, 23154, 17541, 22669, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("steg"), 18572, 22543, 19057, 22543, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("steg"), 7807, 21493, 7478, 21995, false)
endfunction

function Init_level6_part3_Actions takes nothing returns nothing
	local Level level = ForceGetLevel(6)


//monsters simple patrol
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("steg"), 7002, 22541, 7002, 22898, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("steg"), 7145, 22897, 7145, 22540, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 7933, 22025, 8171, 21757, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 16092, 21490, 16092, 20749, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 7665, 21108, 7207, 21614, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 7023, 20594, 6794, 20904, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("steg"), 6386, 20095, 6029, 20095, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("steg"), 15339, 21015, 15341, 20456, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("allo"), 8166, 22377, 8546, 23217, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 9465, 20499, 9963, 20217, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 10096, 20986, 9743, 21133, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 9869, 21793, 10220, 21508, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("steg"), 9869, 22131, 10354, 22131, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 9458, 22639, 9101, 22639, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 10707, 22859, 10423, 22597, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("steg"), 11086, 22157, 11086, 23026, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("steg"), 11240, 23025, 11240, 22156, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("steg"), 11404, 22156, 11404, 23025, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("steg"), 11541, 23025, 11541, 22156, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("steg"), 11689, 22157, 11689, 23026, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("steg"), 11783, 23025, 11783, 22156, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 12287, 22014, 12760, 22484, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 11249, 21202, 10764, 21202, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 12651, 20852, 12363, 21227, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 13228, 21745, 13228, 21004, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 13909, 21004, 13909, 21745, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 13211, 22285, 13211, 22898, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 13939, 22898, 13939, 22285, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 16626, 21720, 16141, 21720, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 16633, 21632, 16882, 21359, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 16753, 22649, 16396, 22649, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 17289, 22669, 17289, 23154, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 13809, 21992, 13324, 21992, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 18564, 23154, 18564, 22797, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 18038, 22918, 17808, 22657, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("ptera"), 17804, 21631, 18610, 21598, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("ptera"), 17791, 20613, 18569, 20585, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("ptera"), 18537, 20743, 17817, 20743, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("allo"), 17651, 16881, 17651, 15884, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 16497, 21114, 15756, 21114, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 17615, 20236, 17615, 20593, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 17418, 20594, 17418, 20237, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 17674, 19335, 17921, 19596, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 18285, 19210, 18293, 19857, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 18685, 19461, 18455, 19204, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 18791, 18537, 18423, 18819, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 17425, 18558, 17661, 18825, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 17255, 18560, 17022, 18828, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 16243, 16258, 16008, 16004, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 16396, 17419, 16746, 17396, false)
endfunction

function Init_level6_part4_Actions takes nothing returns nothing
	local Level level = ForceGetLevel(6)


//monsters simple patrol
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 16780, 17926, 17137, 17926, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 16753, 18049, 16396, 18049, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("steg"), 16357, 17393, 16357, 16780, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 16012, 16997, 16753, 16997, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 16712, 16210, 16023, 15822, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("steg"), 16754, 15634, 16013, 15634, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("ptero"), 13936, 17889, 14612, 17847, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("ptera"), 14603, 18034, 13969, 18044, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 13937, 18864, 13580, 18864, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 13580, 19048, 13937, 19048, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 14220, 19069, 14533, 19532, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("steg"), 13964, 16916, 14577, 16916, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 13244, 19132, 12935, 19451, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("steg"), 13502, 19212, 13502, 19953, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("allo"), 13334, 19953, 13334, 19212, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 13169, 18733, 12684, 18733, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("steg"), 12685, 18055, 13426, 18055, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("steg"), 13297, 17540, 12684, 17540, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 13297, 16515, 12556, 16515, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 12556, 16332, 13297, 16332, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 13297, 16177, 12556, 16177, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("steg"), 12294, 15373, 12294, 15986, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("steg"), 12069, 15985, 12069, 15372, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("steg"), 11838, 15373, 11838, 15986, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("allo"), 11658, 16523, 11267, 16118, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("allo"), 11263, 15984, 10779, 16464, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("allo"), 11260, 15874, 10822, 15550, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 9070, 18562, 8737, 18865, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 9071, 18426, 8734, 18314, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 9456, 17917, 9237, 17677, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 9854, 17546, 9828, 17166, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 9997, 16977, 10354, 16977, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 9969, 16195, 9612, 16195, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 9997, 15693, 10482, 15693, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("steg"), 9332, 15746, 9106, 15380, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("steg"), 8470, 16136, 8949, 16517, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("allo"), 9068, 16249, 8720, 15631, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 8689, 16689, 8204, 16689, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("steg"), 10098, 18046, 11127, 18756, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("steg"), 10252, 17878, 11275, 18624, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("steg"), 11435, 18457, 10371, 17746, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("steg"), 10544, 17570, 11540, 18348, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("steg"), 11690, 18203, 10714, 17402, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("steg"), 10985, 18974, 9969, 18163, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 7410, 18303, 7053, 18303, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 7103, 19282, 6935, 18822, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 7923, 17649, 7923, 17292, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("allo"), 10911, 17219, 11841, 18055, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 11472, 18378, 10498, 17674, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 10669, 17479, 11577, 18269, false)
endfunction

function Init_level6_part5_Actions takes nothing returns nothing
	local Level level = ForceGetLevel(6)


//monsters simple patrol
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 9201, 18186, 8860, 18056, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("steg"), 9736, 17703, 9390, 17323, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 7552, 17915, 7789, 18187, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 8135, 17189, 8321, 17667, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 7063, 18697, 7340, 18923, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 11285, 18538, 10363, 17803, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 10070, 18087, 10994, 18834, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("trex"), 10100, 19058, 10100, 18573, false)

//monsters multiple patrols

//monster spawns
	call level.monsterSpawns.new("sucho2", udg_monsterTypes.get("sucho"), "upToDown", 2.000, 15784, 179, 16698, 15141, false)
	call level.monsterSpawns.new("sucho1", udg_monsterTypes.get("sucho"), "downToUp", 3.700, 7942, 19228, 9396, 20462, false)
	call level.monsterSpawns.new("sucho3", udg_monsterTypes.get("sucho"), "upToDown", 1.700, 17717, -154, 18496, 15194, false)

//meteors

//casters
	call level.casters.new(udg_casterTypes.get("dra"), 13056, 22024, 180, false)
	call level.casters.new(udg_casterTypes.get("dra"), 7119, 20259, -45, false)
	call level.casters.new(udg_casterTypes.get("dra"), 14093, 18947, -1, false)

endfunction




function InitTrig_Init_levels takes nothing returns nothing
	local trigger initLevel0 = CreateTrigger()
	local trigger initLevel1 = CreateTrigger()
	local trigger initLevel2 = CreateTrigger()
	local trigger initLevel3 = CreateTrigger()
	local trigger initLevel3_part2 = CreateTrigger()
	local trigger initLevel3_part3 = CreateTrigger()
	local trigger initLevel4 = CreateTrigger()
	local trigger initLevel4_part2 = CreateTrigger()
	local trigger initLevel5 = CreateTrigger()
	local trigger initLevel5_part2 = CreateTrigger()
	local trigger initLevel5_part3 = CreateTrigger()
	local trigger initLevel6 = CreateTrigger()
	local trigger initLevel6_part2 = CreateTrigger()
	local trigger initLevel6_part3 = CreateTrigger()
	local trigger initLevel6_part4 = CreateTrigger()
	local trigger initLevel6_part5 = CreateTrigger()
	call TriggerAddAction(initLevel0, function Init_level0_Actions)
	call TriggerRegisterTimerEventSingle(initLevel0, 0.0000)
	call TriggerAddAction(initLevel1, function Init_level1_Actions)
	call TriggerRegisterTimerEventSingle(initLevel1, 0.0001)
	call TriggerAddAction(initLevel2, function Init_level2_Actions)
	call TriggerRegisterTimerEventSingle(initLevel2, 0.0002)
	call TriggerAddAction(initLevel3, function Init_level3_Actions)
	call TriggerRegisterTimerEventSingle(initLevel3, 0.0003)
	call TriggerAddAction(initLevel3_part2, function Init_level3_part2_Actions)
	call TriggerRegisterTimerEventSingle(initLevel3_part2, 0.0004)
	call TriggerAddAction(initLevel3_part3, function Init_level3_part3_Actions)
	call TriggerRegisterTimerEventSingle(initLevel3_part3, 0.0005)
	call TriggerAddAction(initLevel4, function Init_level4_Actions)
	call TriggerRegisterTimerEventSingle(initLevel4, 0.0006)
	call TriggerAddAction(initLevel4_part2, function Init_level4_part2_Actions)
	call TriggerRegisterTimerEventSingle(initLevel4_part2, 0.0007)
	call TriggerAddAction(initLevel5, function Init_level5_Actions)
	call TriggerRegisterTimerEventSingle(initLevel5, 0.0008)
	call TriggerAddAction(initLevel5_part2, function Init_level5_part2_Actions)
	call TriggerRegisterTimerEventSingle(initLevel5_part2, 0.0009)
	call TriggerAddAction(initLevel5_part3, function Init_level5_part3_Actions)
	call TriggerRegisterTimerEventSingle(initLevel5_part3, 0.0010)
	call TriggerAddAction(initLevel6, function Init_level6_Actions)
	call TriggerRegisterTimerEventSingle(initLevel6, 0.0011)
	call TriggerAddAction(initLevel6_part2, function Init_level6_part2_Actions)
	call TriggerRegisterTimerEventSingle(initLevel6_part2, 0.0012)
	call TriggerAddAction(initLevel6_part3, function Init_level6_part3_Actions)
	call TriggerRegisterTimerEventSingle(initLevel6_part3, 0.0013)
	call TriggerAddAction(initLevel6_part4, function Init_level6_part4_Actions)
	call TriggerRegisterTimerEventSingle(initLevel6_part4, 0.0014)
	call TriggerAddAction(initLevel6_part5, function Init_level6_part5_Actions)
	call TriggerRegisterTimerEventSingle(initLevel6_part5, 0.0015)
endfunction

