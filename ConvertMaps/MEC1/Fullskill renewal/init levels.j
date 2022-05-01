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
	call level.newEnd(5780, -3114, 6550, -2995)

//visibilities
	call level.newVisibilityModifier(7442, -7645, -7389, 7100)

//monsters no move

//monsters simple patrol
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 6394, -6274, 5943, -5668, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 5917, -6228, 6351, -5634, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 6476, -5642, 6484, -6243, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 6550, -5622, 6990, -6198, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 6557, -5468, 7026, -5463, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 7034, -5291, 6559, -5276, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 6541, -5150, 7002, -4673, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 6273, -5085, 6551, -4623, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 6169, -4618, 6455, -5077, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 5898, -5092, 6131, -4616, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 6068, -5098, 5678, -4608, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 5618, -5120, 5145, -5084, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 5147, -5264, 5620, -5292, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 5623, -5402, 5152, -5427, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 5146, -5608, 5584, -5936, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 5009, -5643, 5019, -6003, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 4852, -5628, 4539, -5959, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 4866, -4332, 4534, -3762, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 5101, -4304, 5071, -3717, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 5298, -3722, 5345, -4319, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 5556, -4331, 5546, -3719, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 5798, -3722, 5811, -4325, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 6349, -4277, 5911, -3701, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 5935, -4325, 6396, -3739, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 4856, -5227, 4508, -5196, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 4498, -4744, 4848, -4742, false)

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
	call level.setNbLivesEarned(2)

//start location
	call level.newStart(5808, -3248, 6479, -2797)

//end location
	call level.newEnd(5764, 811, 6647, 900)

//visibilities

//monsters no move

//monsters simple patrol
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 5786, -2259, 6508, -2241, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 6533, -2030, 5784, -1692, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 5787, -1897, 6530, -2060, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 6516, -2325, 5783, -2072, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 5775, -2318, 6509, -1767, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 6534, -1947, 5804, -1733, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 5770, -2019, 6521, -2282, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 6547, -2027, 5789, -2054, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 5692, -1515, 5679, -1016, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 5422, -1009, 5433, -1509, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 5196, -1515, 5184, -1042, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 5113, -1536, 4790, -1052, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 4785, -2121, 5133, -1784, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 5328, -1793, 5344, -2135, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 5385, -2249, 5742, -2213, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 5295, -2319, 5311, -2660, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 4930, -2319, 4931, -2656, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 4601, -2317, 4607, -2660, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 4590, -1987, 4109, -1908, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 4120, -1678, 4588, -1689, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 4598, -1431, 4122, -1385, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 4119, -1170, 4594, -1137, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 4590, -942, 4118, -891, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 4109, -2128, 4595, -2138, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 4595, -765, 4229, -513, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 4258, -175, 4731, -500, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 4733, -507, 4506, -134, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 4525, 87, 5067, -445, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 5120, -230, 4881, 142, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 5133, -243, 5492, -7, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 5147, -371, 5742, -253, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 5742, -253, 5477, -733, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 5764, -253, 5761, -742, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 5784, -250, 6140, -381, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 6268, 124, 6024, 271, false)

//monsters multiple patrols

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
	call level.newStart(5842, 720, 6585, 1066)

//end location
	call level.newEnd(5000, 5367, 5087, 6559)

//visibilities

//monsters no move

//monsters simple patrol
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 6394, 1426, 5916, 1466, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 6401, 1658, 6047, 1943, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 6028, 1936, 6516, 1930, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 6518, 2180, 6055, 2352, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 6169, 2519, 6638, 2540, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 6137, 2582, 6344, 2901, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 5854, 3205, 5856, 2569, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 5754, 2561, 5570, 3070, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 5261, 2583, 5749, 2546, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 5226, 2555, 5239, 1951, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 5047, 2545, 5052, 1945, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 4866, 1943, 4863, 2552, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 4713, 2557, 4701, 1938, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 4352, 2308, 4611, 2576, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 4597, 2731, 4110, 2765, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 4112, 3020, 4603, 2988, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 4604, 3224, 4116, 3277, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 4120, 3498, 4594, 3453, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 4720, 3546, 4237, 3729, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 4245, 3901, 4730, 3845, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 4803, 3869, 4774, 4352, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 4950, 4342, 4961, 3863, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 5259, 3970, 5118, 4362, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 5633, 4405, 5136, 4430, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 5130, 4641, 5627, 4616, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 5639, 4603, 5385, 5004, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 5416, 5340, 5886, 4865, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 5887, 4869, 5881, 5382, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 5895, 4867, 6361, 5310, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 5890, 4869, 6398, 4892, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 5906, 4499, 6398, 4542, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 6403, 4409, 5892, 4352, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 6156, 3838, 6409, 4105, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 6514, 4095, 6499, 3481, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 6776, 3584, 6616, 4100, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 6681, 4136, 6905, 3717, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 7043, 4267, 6668, 4273, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 6665, 4482, 6924, 4769, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 6916, 5066, 6417, 5064, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 6409, 5268, 6930, 5304, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 6403, 5509, 6618, 5828, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 6539, 5913, 6152, 5772, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 5892, 5747, 5758, 6169, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 6037, 6274, 6040, 5767, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 5543, 6271, 5563, 5637, false)

//monsters multiple patrols

//monster spawns

//meteors

//casters

endfunction


function Init_level3_Actions takes nothing returns nothing
	local Level level = ForceGetLevel(3)

//start message

//lives earned
	call level.setNbLivesEarned(3)

//start location
	call level.newStart(4851, 5491, 5156, 6424)

//end location
	call level.newEnd(-242, 3081, 758, 3163)

//visibilities

//monsters no move

//monsters simple patrol
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 4241, 5781, 4475, 6152, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 4078, 6272, 4105, 5798, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 3963, 5773, 3724, 6143, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 3575, 6147, 3598, 5657, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 3451, 6157, 3213, 5785, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 3076, 5779, 3043, 6271, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 2936, 5758, 2480, 6230, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 2463, 5588, 2930, 5571, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 2927, 5361, 2459, 5397, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 2459, 5144, 2932, 5150, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 2555, 4751, 2438, 5117, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 2513, 4670, 2093, 5074, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 2042, 4630, 2324, 4381, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 2169, 4191, 1857, 4451, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 1748, 4335, 1970, 4017, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 1653, 3863, 1660, 4214, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 1647, 4390, 1182, 4410, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 1176, 4228, 1645, 4214, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 1646, 4539, 1180, 4603, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 1173, 4748, 1651, 4750, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 1661, 4899, 1160, 4897, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 1665, 4979, 1406, 5257, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 1414, 5399, 1781, 5387, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 1780, 5517, 1420, 5537, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 1740, 6005, 1776, 5514, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 1796, 6022, 2136, 5565, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 2171, 5984, 1794, 6018, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 1794, 6277, 2149, 6844, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 2166, 6352, 1767, 6910, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 1608, 6897, 1611, 6294, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 1417, 6288, 1392, 6921, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 1228, 6905, 1235, 6272, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 1099, 6274, 1043, 6924, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 871, 6924, 930, 6280, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 894, 6260, 262, 6280, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 265, 6302, 857, 5959, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 508, 5900, 27, 6220, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 256, 6284, 496, 5902, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 515, 5675, 18, 5721, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 4, 5518, 498, 5485, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 507, 5371, 14, 5427, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 267, 5004, 527, 5375, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 307, 4782, 864, 5331, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 864, 5331, 298, 4793, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 531, 4667, 889, 4682, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 281, 4570, 849, 3900, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 850, 3900, 293, 4562, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 249, 4380, 507, 3843, false)
endfunction

function Init_level3_part2_Actions takes nothing returns nothing
	local Level level = ForceGetLevel(3)


//monsters simple patrol
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 510, 3782, 13, 3832, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 16, 3641, 516, 3632, false)

//monsters multiple patrols

//monster spawns

//meteors

//casters

endfunction


function Init_level4_Actions takes nothing returns nothing
	local Level level = ForceGetLevel(4)

//start message

//lives earned
	call level.setNbLivesEarned(4)

//start location
	call level.newStart(-110, 2937, 621, 3211)

//end location
	call level.newEnd(1553, -4884, 2541, -4787)

//visibilities

//monsters no move

//monsters simple patrol
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 268, 2317, 521, 2563, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 576, 2544, 591, 2063, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 892, 2305, 636, 2553, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 1042, 2297, 1047, 2692, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 1257, 2681, 1278, 1929, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 1433, 1923, 1402, 2686, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 1665, 2422, 1654, 1945, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 1670, 1904, 2159, 1932, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 2163, 1756, 1659, 1741, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 1675, 1574, 2178, 1586, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 2174, 1396, 1696, 1391, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 1673, 1221, 2177, 1247, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 2171, 1083, 1697, 1095, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 1932, 649, 2178, 1011, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 2291, 1018, 2251, 297, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 2411, 285, 2415, 1031, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 2561, 1018, 2501, 276, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 2578, 263, 2903, 596, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 2582, 127, 3320, 169, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 3316, 30, 2574, 26, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 2693, -262, 3190, -257, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 3195, -440, 2712, -460, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 2702, -587, 3196, -611, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 2600, -1337, 3068, -898, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 2836, -1395, 3290, -976, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 2833, -1469, 3334, -1490, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 3281, -1982, 2817, -1540, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 2810, -2027, 3324, -1533, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 2809, -2047, 2628, -1551, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 2214, -1565, 2813, -2035, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 2815, -2048, 2180, -2048, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 2192, -2261, 2819, -2283, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 2819, -2428, 2176, -2474, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 2821, -2574, 2207, -3003, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 2222, -3025, 2819, -2548, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 2962, -2560, 2956, -3050, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 2957, -3091, 3330, -2943, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 3590, -3257, 2937, -3239, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 3203, -3584, 3584, -3577, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 3167, -3697, 3539, -4155, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 3013, -3721, 3026, -4193, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 2798, -4221, 2783, -3707, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 2526, -3688, 2525, -4212, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 2635, -4214, 2647, -3693, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 2916, -4223, 2906, -3691, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 2310, -4214, 2100, -3727, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 2306, -4214, 1817, -4060, false)

//monsters multiple patrols

//monster spawns

//meteors

//casters

endfunction


function Init_level5_Actions takes nothing returns nothing
	local Level level = ForceGetLevel(5)

//start message
	call level.setNbLivesEarned(5)

//lives earned

//start location
	call level.newStart(1647, -5107, 2442, -4720)

//end location
	call level.newEnd(-2574, -4629, -1663, -4563)

//visibilities

//monsters no move

//monsters simple patrol
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 1816, -5583, 2302, -5586, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 2304, -5757, 1830, -5948, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 2302, -5760, 2132, -6231, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 2532, -5778, 2528, -6233, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 2713, -6258, 2716, -5770, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 2862, -5763, 2900, -6240, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 3055, -6229, 3069, -5768, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 3218, -6258, 3431, -5895, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 3231, -6479, 3569, -6450, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 3573, -6708, 3214, -6682, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 3222, -6899, 3569, -6924, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 3035, -6934, 3042, -7398, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 2825, -7418, 2804, -6920, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 2639, -6917, 2632, -7386, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 2515, -7388, 2497, -6912, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 2297, -6922, 2285, -7400, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 2085, -6917, 2110, -7402, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 1933, -7406, 1891, -6912, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 1712, -6925, 1720, -7394, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 1508, -7398, 1500, -6930, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 1396, -6925, 1370, -7406, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 1193, -7395, 1176, -6919, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 1021, -6925, 1009, -7397, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 823, -7397, 828, -6935, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 638, -6919, 416, -7290, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 628, -6673, 276, -6644, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 282, -6385, 630, -6389, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 644, -6159, 276, -6139, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 279, -5901, 627, -5901, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 630, -5629, 265, -5611, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 226, -5609, 200, -5114, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 52, -5114, 59, -5603, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -76, -5599, -92, -5142, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -252, -5124, -215, -5605, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -267, -5621, -591, -5268, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -252, -5634, -757, -5638, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -746, -5872, -272, -5822, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -269, -6014, -760, -6030, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -631, -6392, -158, -6082, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -627, -6531, -140, -6499, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -138, -6663, -605, -6656, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -615, -6749, -315, -7092, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -455, -7244, -709, -6830, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -809, -6923, -628, -7403, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -985, -6914, -995, -7412, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -1209, -7397, -1206, -6907, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -1427, -6912, -1427, -7404, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -1605, -7406, -1609, -6917, false)
endfunction

function Init_level5_part2_Actions takes nothing returns nothing
	local Level level = ForceGetLevel(5)


//monsters simple patrol
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -1762, -6919, -1760, -7399, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -1930, -7406, -1916, -6929, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -1933, -6761, -2279, -6744, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -2286, -6510, -1926, -6516, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -1930, -6308, -2291, -6282, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -2277, -6121, -1921, -6075, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -1927, -5876, -2282, -5852, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -2284, -5638, -1926, -5624, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -1912, -5428, -2292, -5364, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -2286, -5174, -1922, -5162, false)

//monsters multiple patrols

//monster spawns

//meteors

//casters

endfunction


function Init_level6_Actions takes nothing returns nothing
	local Level level = ForceGetLevel(6)

//start message
	call level.setNbLivesEarned(5)

//lives earned

//start location
	call level.newStart(-2448, -4734, -1793, -4347)

//end location
	call level.newEnd(-2147, 1419, -2091, 2570)

//visibilities

//monsters no move

//monsters simple patrol
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -1925, -3774, -2282, -3762, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -2400, -3321, -1806, -3366, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -1800, -3203, -2408, -3182, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -2409, -3015, -1794, -3030, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -2053, -2752, -2408, -2745, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -2417, -663, -1794, -670, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -1797, -497, -2413, -443, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -2420, -288, -1786, -313, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -2414, -2369, -1790, -2354, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -1793, -2231, -2447, -2175, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -2433, -2037, -1792, -2067, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -1782, -1613, -2428, -1580, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -2440, -1421, -1804, -1454, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -1774, -1356, -2408, -1301, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -2421, -137, -1786, -166, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -2035, 128, -2302, 649, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -2216, 758, -1907, 273, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -1791, 358, -2071, 884, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -1934, 1032, -1652, 540, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -1531, 787, -1777, 1184, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -1424, 798, -1459, 1280, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -1311, 1262, -1312, 794, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -1269, 760, -926, 1214, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -1257, 699, -899, 665, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -910, 523, -1263, 516, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -1138, 8, -884, 505, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -759, -107, -782, 510, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -649, 504, -626, -112, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -528, -112, -517, 496, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -510, -118, -136, 195, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -506, -124, -123, -126, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -486, -407, -136, -393, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -140, -627, -495, -625, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -490, -870, -131, -878, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -495, -1386, -561, -897, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -507, -1413, -1001, -931, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -512, -1403, -1003, -1388, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -1006, -1638, -518, -1652, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -518, -2041, -1000, -2256, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -498, -2055, -980, -2430, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -508, -2058, -972, -2646, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -502, -2048, -725, -2657, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -502, -2053, -552, -2654, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -217, -2062, -160, -2667, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -19, -2672, -72, -2047, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 107, -2168, 390, -2659, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 365, -2178, 130, -2661, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 559, -2065, 586, -2669, false)
endfunction

function Init_level6_part2_Actions takes nothing returns nothing
	local Level level = ForceGetLevel(6)


//monsters simple patrol
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 704, -2060, 714, -2652, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 1166, -2661, 1636, -1990, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 1649, -2142, 1314, -2680, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 1618, -2620, 1162, -2156, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 1157, -1895, 1665, -1893, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 1670, -1661, 1149, -1675, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 1165, -1531, 1660, -1260, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 1159, -1511, 1628, -947, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 1155, -1522, 1345, -913, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 1156, -1544, 1145, -878, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 959, -2192, 966, -2656, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 989, -898, 996, -1509, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 523, -1019, 889, -900, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 888, -664, 405, -649, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 398, -482, 887, -464, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 888, -289, 412, -259, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 406, -30, 885, 1, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 762, 532, 383, 1, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 277, 74, 670, 607, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 590, 738, 186, 170, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 101, 290, 512, 749, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 494, 854, 19, 539, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 16, 809, 504, 890, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), 504, 1076, 3, 1040, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -30, 1033, -45, 1532, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -190, 1539, -192, 1029, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -331, 1040, -338, 1513, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -686, 1188, -389, 1524, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -457, 1605, -756, 1314, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -1086, 1331, -674, 1703, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -898, 1776, -893, 1287, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -1158, 1420, -1138, 1896, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -1391, 1941, -1526, 1676, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -1295, 1420, -1310, 1934, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -1640, 1681, -1689, 2174, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -1801, -3455, -2405, -3485, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -2429, -1831, -1795, -1836, false)

//monsters multiple patrols

//monster spawns

//meteors

//casters

endfunction


function Init_level7_Actions takes nothing returns nothing
	local Level level = ForceGetLevel(7)

//start message
	call level.setNbLivesEarned(7)

//lives earned

//start location
	call level.newStart(-2326, 1534, -2018, 2435)

//end location
	call level.newEnd(-5378, 1935, -5296, 3237)

//visibilities

//monsters no move

//monsters simple patrol
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -2697, 2315, -2709, 1673, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -2878, 2317, -2913, 1798, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -3050, 1914, -3018, 2515, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -3109, 2559, -3165, 2012, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -3546, 2575, -3101, 2578, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -3075, 2765, -3571, 2784, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -3559, 2990, -3083, 2996, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -3087, 3168, -3559, 3183, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -3066, 3220, -3530, 3808, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -3560, 3159, -3054, 3824, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -3168, 3851, -3549, 3372, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -2857, 3221, -2888, 3846, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -2751, 3849, -2744, 3229, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -2654, 3218, -2663, 3846, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -2518, 3836, -2527, 3229, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -2437, 3199, -2454, 3839, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -2338, 3823, -2352, 3224, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -2271, 3188, -2031, 3552, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -2158, 2948, -1940, 3437, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -1842, 3375, -1902, 2720, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -2152, 2914, -1676, 3073, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -1661, 3070, -1901, 2673, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -1642, 3087, -1409, 2713, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -1630, 3325, -1299, 3319, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -1291, 3535, -1636, 3544, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -1640, 3793, -1285, 3799, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -1281, 4015, -1645, 4020, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -1648, 4218, -1278, 4207, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -1644, 4230, -1631, 4687, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -2026, 4489, -1661, 4732, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -1668, 4945, -2155, 4943, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -2157, 5159, -1679, 5120, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -1669, 5288, -2151, 5312, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -2152, 5516, -1680, 5495, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -1677, 5699, -2145, 5707, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -2164, 5769, -1704, 6187, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -1693, 5717, -2141, 6259, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -2198, 5787, -2240, 6265, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -2356, 5696, -2661, 6017, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -2769, 5969, -2457, 5608, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -2464, 5470, -2788, 5759, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -2915, 5700, -2656, 5305, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -2702, 5187, -3023, 5520, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -3162, 5456, -2822, 5007, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -3196, 4999, -2861, 4699, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -3293, 4975, -3282, 4517, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -3406, 4517, -3435, 5001, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -4468, 3814, -3987, 3806, false)
endfunction

function Init_level7_part2_Actions takes nothing returns nothing
	local Level level = ForceGetLevel(7)


//monsters simple patrol
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -3982, 3675, -4444, 3643, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -4471, 3509, -3985, 3506, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -3976, 3380, -4452, 3392, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -4449, 3228, -3977, 3237, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -3986, 3081, -4455, 3086, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -4466, 2927, -3988, 2953, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -3985, 2800, -4470, 2832, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -4472, 2830, -4124, 2409, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -4488, 2821, -4376, 2205, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -4646, 2794, -4635, 2213, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -4731, 2195, -4769, 2824, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -4889, 2806, -4864, 2198, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -4042, 4544, -3594, 5007, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -3607, 4498, -4063, 4955, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -4091, 5248, -3601, 5236, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -3589, 5489, -4067, 5495, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -4076, 5720, -3596, 5714, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -3602, 5387, -4089, 5378, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -4083, 5641, -3607, 5618, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -4084, 5896, -3613, 6309, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -3604, 5903, -4036, 6386, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -4332, 5914, -4370, 6392, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -4481, 5899, -4517, 6402, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -4648, 6395, -4662, 5908, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -4798, 5926, -4823, 6420, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -4987, 6413, -4974, 5908, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -5108, 5905, -5130, 6375, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -5265, 6382, -5246, 5870, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -5241, 5876, -5731, 5908, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -5739, 5780, -5259, 5765, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -5257, 5642, -5743, 5662, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -5741, 5525, -5257, 5493, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -5774, 5512, -5749, 5031, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -5856, 5006, -5902, 5489, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -6013, 5496, -5996, 5028, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -6109, 5022, -6144, 5509, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -6148, 5002, -6498, 5046, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -6500, 4915, -6154, 4865, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -6131, 4859, -6493, 4553, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -6134, 4859, -6337, 4420, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -6131, 4862, -6164, 4272, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -5962, 4840, -5545, 4267, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -5861, 4239, -5885, 4872, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -5744, 4868, -5720, 4246, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -5612, 4254, -5676, 4840, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -5370, 4256, -5389, 4854, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -5210, 4391, -5262, 4865, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -5126, 4993, -5087, 4521, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -4961, 4629, -4995, 5127, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -4895, 5236, -4883, 4739, false)
endfunction

function Init_level7_part3_Actions takes nothing returns nothing
	local Level level = ForceGetLevel(7)


//monsters simple patrol
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -4720, 4743, -4629, 5250, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -4729, 4745, -4393, 5026, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -4746, 4750, -4362, 4756, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -4711, 4302, -4354, 4603, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -4563, 4135, -4276, 4523, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -4450, 4091, -4153, 4426, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -4446, 4025, -3980, 4042, false)

//monsters multiple patrols

//monster spawns

//meteors

//casters

endfunction


function Init_level8_Actions takes nothing returns nothing
	local Level level = ForceGetLevel(8)

//start message

//lives earned
	call level.setNbLivesEarned(8)

//start location
	call level.newStart(-5621, 2069, -5247, 3083)

//end location
	call level.newEnd(-5385, -2938, -4218, -2860)

//visibilities

//monsters no move

//monsters simple patrol
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -5895, 2189, -6041, 2664, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -6188, 2526, -6009, 2056, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -6034, 1996, -6371, 1968, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -6257, 1668, -5896, 1677, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -6031, 1414, -6387, 1399, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -6347, 925, -5976, 1376, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -5866, 1266, -6172, 823, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -6091, 703, -5774, 1176, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -5666, 1088, -6031, 662, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -5970, 583, -5603, 994, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -5775, 539, -5534, 895, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -5465, 862, -5644, 556, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -5372, 893, -5092, 593, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -4996, 651, -5268, 999, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -5170, 1129, -4929, 743, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -4851, 793, -5086, 1228, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -4742, 797, -4549, 1233, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -4471, 1125, -4655, 686, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -4351, 1119, -4344, 661, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -4254, 661, -4268, 1141, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -4039, 1007, -4046, 546, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -3948, 554, -3930, 1033, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -3828, 1009, -3838, 530, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -3830, 492, -3345, 500, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -3325, 360, -3826, 331, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -3817, 236, -3330, 227, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -3332, 80, -3825, 80, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -3823, -108, -3336, -123, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -3333, -265, -3826, -249, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -3823, -366, -3337, -402, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -3810, -847, -3348, -400, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -3829, -371, -3376, -825, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -3972, -404, -3971, -829, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -4143, -869, -4164, -401, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -4233, -365, -4558, -818, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -4593, -305, -4235, -281, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -4618, -235, -4263, 206, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -4777, 253, -4786, -221, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -4981, -241, -4976, 246, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -5154, 259, -5134, -247, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -5258, -244, -5301, 249, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -5427, 246, -5436, -235, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -5562, -238, -5592, 246, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -5725, 243, -5731, -247, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -5855, -252, -5916, 253, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -6037, 236, -6010, -218, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -6012, -244, -6375, -231, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -6385, -456, -6030, -443, false)
endfunction

function Init_level8_part2_Actions takes nothing returns nothing
	local Level level = ForceGetLevel(8)


//monsters simple patrol
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -6020, -630, -6393, -627, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -6387, -787, -6023, -789, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -6016, -894, -6387, -924, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -6002, -898, -6375, -1308, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -6379, -1470, -5812, -962, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -5732, -1025, -5733, -1639, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -5650, -1015, -5645, -1642, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -5549, -1647, -5572, -1012, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -5440, -1650, -5464, -1025, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -5345, -1707, -4904, -956, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -5330, -925, -4923, -1712, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -5159, -1771, -5187, -902, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -5062, -895, -5062, -1773, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -4787, -1534, -4802, -1150, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -4694, -925, -4278, -1725, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -4687, -1740, -4283, -946, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -4528, -905, -4514, -1783, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -4394, -1773, -4435, -898, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -4174, -1044, -4145, -1620, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -4049, -1048, -4032, -1650, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -3943, -1660, -3740, -908, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -3888, -1758, -3616, -908, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -3753, -1761, -3500, -979, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -3671, -1758, -3454, -1156, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -3318, -1548, -2994, -1219, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -3311, -1604, -2961, -1584, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -3329, -1756, -2946, -1753, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -3316, -1916, -2955, -1910, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -3332, -2062, -2951, -2059, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -3331, -2047, -2998, -2479, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -3426, -2057, -3426, -2532, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -3577, -2557, -3592, -2038, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -3775, -2051, -3775, -2529, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -3930, -2548, -3952, -2025, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -4108, -2028, -4095, -2548, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -4214, -2565, -4217, -2041, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -4326, -2054, -4340, -2540, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -4439, -2540, -4439, -2051, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -4588, -2057, -4569, -2540, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -4618, -2551, -4947, -2086, false)

//monsters multiple patrols

//monster spawns

//meteors

//casters

endfunction


function Init_level9_Actions takes nothing returns nothing
	local Level level = ForceGetLevel(9)

//start message
	call level.setNbLivesEarned(13)

//lives earned

//start location
	call level.newStart(-5248, -3191, -4332, -2802)

//end location
	call level.newEnd(-3234, -5568, -2684, -5498)

//visibilities

//monsters no move

//monsters simple patrol
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -5097, -3565, -4486, -3572, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -5108, -3569, -4535, -3988, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -5132, -3596, -5132, -4049, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -5274, -4083, -5283, -3586, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -5438, -3579, -5432, -4060, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -5599, -4063, -5617, -3569, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -5781, -3599, -5789, -4063, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -5965, -4063, -5984, -3589, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -6031, -4085, -6272, -3589, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -6033, -4083, -6476, -3638, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -6021, -4068, -6492, -3926, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -6021, -4078, -6490, -4082, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -6503, -4300, -6036, -4316, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -6040, -4507, -6484, -4498, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -6497, -4671, -6048, -4689, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -6053, -4860, -6497, -4860, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -6500, -5046, -6045, -5075, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -6048, -5235, -6502, -5255, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -6505, -5412, -6058, -5406, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -6036, -5512, -6486, -5627, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -6018, -5509, -6467, -5954, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -6014, -5515, -6010, -5967, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -6014, -5527, -5556, -5916, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -6012, -5515, -5540, -5630, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -5540, -5746, -6471, -5770, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -5982, -5292, -5537, -5295, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -5529, -5023, -5962, -5040, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -5967, -4860, -5574, -4857, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -5517, -4721, -5973, -4710, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -5510, -4699, -5749, -4269, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -5511, -4684, -5963, -4529, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -5487, -4706, -5390, -4268, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -5482, -4695, -5164, -4498, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -5465, -4917, -5167, -4911, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -5164, -5187, -5446, -5190, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -5446, -5502, -5182, -5496, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -5143, -5657, -5425, -5937, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -5109, -5660, -5105, -5940, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -5104, -5660, -4814, -5902, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -5062, -5343, -4788, -5349, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -5059, -5029, -4793, -5029, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -5063, -4736, -4781, -4744, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -4755, -4697, -5060, -4307, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -4724, -4673, -4754, -4266, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -4718, -4697, -4423, -4313, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -4674, -4898, -4390, -4865, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -4684, -5206, -4398, -5186, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -4678, -5548, -4392, -5543, false)
endfunction

function Init_level9_part2_Actions takes nothing returns nothing
	local Level level = ForceGetLevel(9)


//monsters simple patrol
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -4405, -5806, -4669, -5838, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -4694, -6002, -4420, -6434, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -4402, -6046, -4671, -6456, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -4855, -6485, -4872, -6046, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -5079, -6076, -5063, -6488, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -5252, -6490, -5270, -6064, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -5451, -6061, -5483, -6469, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -5612, -6464, -5641, -6064, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -5820, -6070, -5802, -6466, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -5954, -6482, -5984, -6043, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -6129, -6052, -6125, -6480, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -6158, -6503, -6458, -6070, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -6493, -6513, -6185, -6525, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -6194, -6736, -6479, -6736, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -6484, -6926, -6195, -6929, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -6186, -7049, -6464, -7344, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -6137, -7057, -6126, -7364, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -6135, -7052, -5825, -7331, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -6097, -6989, -5808, -6969, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -5772, -6870, -6102, -6608, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -5729, -6884, -5438, -6628, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -5706, -7037, -5405, -7049, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -5405, -7049, -5682, -7373, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -5349, -7063, -5068, -7319, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -5343, -7061, -5037, -7050, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -5028, -6887, -5308, -6604, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -4913, -6973, -4737, -6586, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -4840, -7018, -4615, -6705, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -4521, -6802, -4705, -7152, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -4579, -7282, -4364, -6943, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -4315, -6921, -4323, -7378, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -4179, -7367, -4191, -6970, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -4052, -6988, -4038, -7359, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -3793, -7359, -3812, -7053, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -3597, -7238, -3593, -6979, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -3445, -7235, -3447, -6952, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -3213, -7083, -3208, -7377, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -3054, -7073, -3001, -7363, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -3011, -6854, -2734, -6868, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -3006, -6610, -2737, -6610, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -3000, -6334, -2748, -6296, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -3422, -6404, -3128, -6410, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -3435, -6442, -3438, -6858, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -3568, -6869, -3595, -6448, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -3739, -6442, -3763, -6867, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -3423, -6418, -3138, -6801, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -3760, -6420, -4152, -6821, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -4194, -6304, -3745, -6295, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -3725, -6100, -4191, -6077, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -4205, -5858, -3743, -5864, false)
endfunction

function Init_level9_part3_Actions takes nothing returns nothing
	local Level level = ForceGetLevel(9)


//monsters simple patrol
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -3751, -5748, -4198, -5730, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -4191, -5600, -3763, -5626, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -3735, -5527, -4198, -5503, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -4202, -5389, -3760, -5386, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -3735, -5264, -4198, -5242, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -4195, -5094, -3743, -5131, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -3718, -5003, -4184, -4947, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -4187, -4783, -3729, -4789, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -3744, -4673, -4186, -4642, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -4187, -4398, -3742, -4422, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -3736, -4230, -4190, -4234, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -4216, -4016, -3739, -4022, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -3716, -3945, -3734, -3463, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -3631, -3463, -3628, -3919, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -3552, -3924, -3547, -3477, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -3450, -3497, -3451, -3913, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -3413, -3960, -3164, -3483, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -3421, -3974, -2987, -3707, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -3420, -4048, -2975, -4044, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -2969, -4219, -3413, -4229, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -3423, -4403, -2978, -4406, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -2972, -4507, -3430, -4537, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -3422, -4703, -2977, -4721, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -2970, -4850, -3306, -4958, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -3264, -5193, -2834, -4942, false)
	call level.monstersSimplePatrol.new(udg_monsterTypes.get("mob"), -2834, -5112, -3166, -5271, false)

//monsters multiple patrols

//monster spawns

//meteors

//casters

endfunction




function InitTrig_Init_levels takes nothing returns nothing
	local trigger initLevel0 = CreateTrigger()
	local trigger initLevel1 = CreateTrigger()
	local trigger initLevel2 = CreateTrigger()
	local trigger initLevel3 = CreateTrigger()
	local trigger initLevel3_part2 = CreateTrigger()
	local trigger initLevel4 = CreateTrigger()
	local trigger initLevel5 = CreateTrigger()
	local trigger initLevel5_part2 = CreateTrigger()
	local trigger initLevel6 = CreateTrigger()
	local trigger initLevel6_part2 = CreateTrigger()
	local trigger initLevel7 = CreateTrigger()
	local trigger initLevel7_part2 = CreateTrigger()
	local trigger initLevel7_part3 = CreateTrigger()
	local trigger initLevel8 = CreateTrigger()
	local trigger initLevel8_part2 = CreateTrigger()
	local trigger initLevel9 = CreateTrigger()
	local trigger initLevel9_part2 = CreateTrigger()
	local trigger initLevel9_part3 = CreateTrigger()
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
	call TriggerAddAction(initLevel4, function Init_level4_Actions)
	call TriggerRegisterTimerEventSingle(initLevel4, 0.0005)
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
	call TriggerAddAction(initLevel8, function Init_level8_Actions)
	call TriggerRegisterTimerEventSingle(initLevel8, 0.0013)
	call TriggerAddAction(initLevel8_part2, function Init_level8_part2_Actions)
	call TriggerRegisterTimerEventSingle(initLevel8_part2, 0.0014)
	call TriggerAddAction(initLevel9, function Init_level9_Actions)
	call TriggerRegisterTimerEventSingle(initLevel9, 0.0015)
	call TriggerAddAction(initLevel9_part2, function Init_level9_part2_Actions)
	call TriggerRegisterTimerEventSingle(initLevel9_part2, 0.0016)
	call TriggerAddAction(initLevel9_part3, function Init_level9_part3_Actions)
	call TriggerRegisterTimerEventSingle(initLevel9_part3, 0.0017)
endfunction

