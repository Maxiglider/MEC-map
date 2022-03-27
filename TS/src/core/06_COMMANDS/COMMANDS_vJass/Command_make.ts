import { BasicFunctions } from "core/01_libraries/Basic_functions";
import { FunctionsOnNumbers } from "core/01_libraries/Functions_on_numbers";

const initCommandMake = () => { // needs CommandsFunctions, ChangeOneTerrain, ChangeAllTerrains, ExchangeTerrains, RandomizeTerrains, Ascii





const ExecuteCommandMake = (escaper: Escaper, cmd: string): boolean => {
	let name = CmdName(cmd);
	let noParam = NoParam(cmd);
	let nbParam = NbParam(cmd);

	let n: number;
	let i: number;
	let j: number;
	let k: number;

	let b: boolean;

	let str = "";
	let str2 = "";

	let x: number;
	let y: number;
	let point: location;

	let param: string;

	let param1 = CmdParam(cmd, 1);
	let param2 = CmdParam(cmd, 2);
	let param3 = CmdParam(cmd, 3);
	let param4 = CmdParam(cmd, 4);

	let speed: number;
	let terrainType: TerrainType;
	let level: Level;





	//-newWalk(neww) <label> <terrainType> [<walkSpeed>]   --> add a new kind of walk terrain
	if ((name === "newWalk" || name === "neww")) {
		if ((nbParam < 2 || nbParam > 3)) {
			return true;
		}
		if ((nbParam === 3)) {
			if ((!FunctionsOnNumbers.IsPositiveInteger(param3) || S2R(param3) > 522)) {
 Text.erP(escaper.getPlayer(), "wrong speed value, should be a real between 0 and 522")
				return true;
			}
			speed = S2R(param3);
		} else {
			speed = HERO_WALK_SPEED;
		}
		if ((StringContainsChar(param1, CACHE_SEPARATEUR_ITEM) || StringContainsChar(param1, CACHE_SEPARATEUR_PARAM) || StringContainsChar(param1, "\""))) {
 Text.erP(escaper.getPlayer(), "characters \", " + CACHE_SEPARATEUR_ITEM + " and " + CACHE_SEPARATEUR_PARAM + " not allowed")
			return true;
		}
		if ( (udg_terrainTypes.newWalk(param1, TerrainTypeString2TerrainTypeId(param2), speed) == 0) ) {
 Text.erP(escaper.getPlayer(), "impossible to add this new terrain type")
		} else {
 Text.mkP(escaper.getPlayer(), "new terrain type \"" + param1 + "\" added")
		}
		return true;
	}


	//-newDeath(newd) <label> <terrainType> [<killingEffect> [<terrainTimeToKill>]]   --> add a new kind of death terrain
	if ((name === "newDeath" || name === "newd")) {
		if ((nbParam < 2 || nbParam > 4)) {
			return true;
		}
		if ((nbParam >= 3)) {
			str = param3;
			if ((StringContainsChar(param3, CACHE_SEPARATEUR_ITEM) || StringContainsChar(param3, CACHE_SEPARATEUR_PARAM) || StringContainsChar(param3, "\""))) {
 Text.erP(escaper.getPlayer(), "characters \", " + CACHE_SEPARATEUR_ITEM + " and " + CACHE_SEPARATEUR_PARAM + " not allowed")
				return true;
			}
		} else {
			str = "";
		}
		if ((nbParam === 4)) {
			if ((param4 !== "0" && S2R(param4) === 0)) {
				return true;
			}
			x = S2R(param4);
		} else {
			x = TERRAIN_DEATH_TIME_TO_KILL;
		}
		if ((StringContainsChar(param1, CACHE_SEPARATEUR_ITEM) || StringContainsChar(param1, CACHE_SEPARATEUR_PARAM) || StringContainsChar(param1, "\""))) {
 Text.erP(escaper.getPlayer(), "characters \", " + CACHE_SEPARATEUR_ITEM + " and " + CACHE_SEPARATEUR_PARAM + " not allowed")
			return true;
		}
		if ( (udg_terrainTypes.newDeath(param1, TerrainTypeString2TerrainTypeId(param2), str, x, 0) == 0) ) {
 Text.erP(escaper.getPlayer(), "impossible to add this new terrain type")
		} else {
 Text.mkP(escaper.getPlayer(), "new terrain type \"" + param1 + "\" added")
		}
		return true;
	}


	//-newSlide(news) <label> <terrainType> [<slideSpeed> [<canTurn>]]   --> add a new kind of slide terrain
	if ((name === "newSlide" || name === "news")) {
		if ((nbParam < 2 || nbParam > 4)) {
			return true;
		}
		if ((nbParam >= 3)) {
			if ((!IsInteger(param3))) {
 Text.erP(escaper.getPlayer(), "the slide speed must be an integer")
				return true;
			}
			speed = S2R(param3);
		} else {
			speed = HERO_SLIDE_SPEED;
		}
		if ((nbParam === 4)) {
			if ((!BasicFunctions.IsBoolString(param4))) {
 Text.erP(escaper.getPlayer(), "the property \"canTurn\" must be a boolean (true or false)")
				return true;
			}
			b = BasicFunctions.S2B(param4);
		} else {
			b = true;
		}
		if ((StringContainsChar(param1, CACHE_SEPARATEUR_ITEM) || StringContainsChar(param1, CACHE_SEPARATEUR_PARAM) || StringContainsChar(param1, "\""))) {
 Text.erP(escaper.getPlayer(), "characters \", " + CACHE_SEPARATEUR_ITEM + " and " + CACHE_SEPARATEUR_PARAM + " not allowed")
			return true;
		}
		if ( (udg_terrainTypes.newSlide(param1, TerrainTypeString2TerrainTypeId(param2), speed, b) == 0) ) {
 Text.erP(escaper.getPlayer(), "impossible to add this new terrain type")
		} else {
 Text.mkP(escaper.getPlayer(), "new terrain type \"" + param1 + "\" added")
		}
		return true;
	}


	//-setTerrainLabel(settl) <oldTerrainLabel> <newTerrainLabel>
	if ((name === "setTerrainLabel" || name === "settl")) {
		if ((!(nbParam === 2))) {
			return true;
		}
		b = (udg_terrainTypes.get(param1) != 0)
		if ((b)) {
			b = (not udg_terrainTypes.isLabelAlreadyUsed(param2))
		}
		if ((b)) {
			if ((StringContainsChar(param2, CACHE_SEPARATEUR_ITEM) || StringContainsChar(param2, CACHE_SEPARATEUR_PARAM) || StringContainsChar(param2, "\""))) {
 Text.erP(escaper.getPlayer(), "characters \", " + CACHE_SEPARATEUR_ITEM + " and " + CACHE_SEPARATEUR_PARAM + " not allowed")
				return true;
			}
 udg_terrainTypes.get(param1).setLabel(param2)
 Text.mkP(escaper.getPlayer(), "label changed to \"" + param2 + "\"")
		} else {
 Text.erP(escaper.getPlayer(), "impossible to change label")
		}
		return true;
	}


	//-setTerrainAlias(setta) <terrainLabel> <alias>   --> an alias is a shortcut which can be used like a label
	if ((name === "setTerrainAlias" || name === "setta")) {
		if ((!(nbParam === 2))) {
			return true;
		}
		b = (udg_terrainTypes.get(param1) != 0)
		if ((b)) {
			b = (not udg_terrainTypes.isLabelAlreadyUsed(param2))
		}
		if ((b)) {
			if ((StringContainsChar(param2, CACHE_SEPARATEUR_ITEM) || StringContainsChar(param2, CACHE_SEPARATEUR_PARAM) || StringContainsChar(param2, "\""))) {
 Text.erP(escaper.getPlayer(), "characters \", " + CACHE_SEPARATEUR_ITEM + " and " + CACHE_SEPARATEUR_PARAM + " not allowed")
				return true;
			}
 udg_terrainTypes.get(param1).setAlias(param2)
 Text.mkP(escaper.getPlayer(), "alias changed to \"" + param2 + "\"")
		} else {
 Text.erP(escaper.getPlayer(), "impossible to change alias")
		}
		return true;
	}


	//-setTerrainWalkSpeed(settws) <walkTerrainLabel> <walkSpeed>   --> max walk speed : 522
	if ((name === "setTerrainWalkSpeed" || name === "settws")) {
		if ((!(nbParam === 2))) {
			return true;
		}
		terrainType = udg_terrainTypes.get(param1)
		if ((terrainType === 0)) {
 Text.erP(escaper.getPlayer(), "unknown terrain")
			return true;
		}
		if ( (terrainType.getKind() != "walk") ) {
 Text.erP(escaper.getPlayer(), "the terrain must be of walk type")
			return true;
		}
		if ((!IsPositiveInteger(param2) || S2R(param2) > 522)) {
 Text.erP(escaper.getPlayer(), "wrong speed value, should be a real between 0 and 522")
			return true;
		}
 TerrainTypeWalk(integer(terrainType)).setWalkSpeed(S2R(param2))
 Text.mkP(escaper.getPlayer(), "terrain walk speed changed")
		return true;
	}


	//-setTerrainKillEffect(settke) <deathTerrainLabel> <killingEffect>   --> special effect appearing when a hero touch the death terrain
	if ((name === "setTerrainKillEffect" || name === "settke")) {
		if ((!(nbParam === 2))) {
			return true;
		}
		terrainType = udg_terrainTypes.get(param1)
		if ((terrainType === 0)) {
 Text.erP(escaper.getPlayer(), "unknown terrain")
			return true;
		}
		if ( (terrainType.getKind() != "death") ) {
 Text.erP(escaper.getPlayer(), "the terrain must be of death type")
			return true;
		}
		if ((StringContainsChar(param2, CACHE_SEPARATEUR_ITEM) || StringContainsChar(param2, CACHE_SEPARATEUR_PARAM) || StringContainsChar(param2, "\""))) {
 Text.erP(escaper.getPlayer(), "characters \", " + CACHE_SEPARATEUR_ITEM + " and " + CACHE_SEPARATEUR_PARAM + " not allowed")
			return true;
		}
 TerrainTypeDeath(integer(terrainType)).setKillingEffectStr(param2)
 Text.mkP(escaper.getPlayer(), "terrain kill effect changed")
		return true;
	}


	//-setTerrainKillDelay(settkd) <deathTerrainLabel> <killingDelay>   --> time before which the hero dies when he touch the death terrain
	if ((name === "setTerrainKillDelay" || name === "settkd")) {
		if ((!(nbParam === 2))) {
			return true;
		}
		terrainType = udg_terrainTypes.get(param1)
		if ((terrainType === 0)) {
 Text.erP(escaper.getPlayer(), "unknown terrain")
			return true;
		}
		if ( (terrainType.getKind() != "death") ) {
 Text.erP(escaper.getPlayer(), "the terrain must be of death type")
			return true;
		}
		if ((param2 !== "0" && S2R(param2) === 0)) {
 Text.erP(escaper.getPlayer(), "wrong delay value")
			return true;
		}
 TerrainTypeDeath(integer(terrainType)).setTimeToKill(S2R(param2))
 Text.mkP(escaper.getPlayer(), "terrain kill delay changed")
		return true;
	}


	//-setTerrainKillTolerance(settkt) <deathTerrainLabel> <tolerance dist>   --> max distance to the closest non death terrain, where heroes won't die
	if ((name === "setTerrainKillTolerance" || name === "settkt")) {
		if ((!(nbParam === 2))) {
			return true;
		}
		terrainType = udg_terrainTypes.get(param1)
		if ((terrainType === 0)) {
 Text.erP(escaper.getPlayer(), "unknown terrain")
			return true;
		}
		if ( (terrainType.getKind() != "death") ) {
 Text.erP(escaper.getPlayer(), "the terrain must be of death type")
			return true;
		}
		if ((param2 !== "0" && S2R(param2) === 0)) {
 Text.erP(escaper.getPlayer(), "wrong tolerance value")
			return true;
		}
		if ( (TerrainTypeDeath(integer(terrainType)).setToleranceDist(S2R(param2))) ) {
 Text.mkP(escaper.getPlayer(), "tolerance distance changed")
		} else {
 Text.erP(escaper.getPlayer(), "tolerance must be between 0 and " + R2S(DEATH_TERRAIN_MAX_TOLERANCE))
		}
		return true;
	}


	//-setTerrainSlideSpeed(settss) <slideTerrainLabel> <slideSpeed>
	if ((name === "setTerrainSlideSpeed" || name === "settss")) {
		if ((!(nbParam === 2))) {
			return true;
		}
		terrainType = udg_terrainTypes.get(param1)
		if ((terrainType === 0)) {
 Text.erP(escaper.getPlayer(), "unknown terrain")
			return true;
		}
		if ( (terrainType.getKind() != "slide") ) {
 Text.erP(escaper.getPlayer(), "the terrain must be of slide type")
			return true;
		}
		if ((!IsInteger(param2))) {
 Text.erP(escaper.getPlayer(), "wrong speed value")
			return true;
		}
 TerrainTypeSlide(integer(terrainType)).setSlideSpeed(S2R(param2))
 Text.mkP(escaper.getPlayer(), "terrain slide speed changed")
		return true;
	}


	//-setTerrainCanTurn(settct) <slideTerrainLabel> <canTurn>
	if ((name === "setTerrainCanTurn" || name === "settct")) {
		if ((!(nbParam === 2))) {
			return true;
		}
		terrainType = udg_terrainTypes.get(param1)
		if ((terrainType === 0)) {
 Text.erP(escaper.getPlayer(), "unknown terrain")
			return true;
		}
		if ( (terrainType.getKind() != "slide") ) {
 Text.erP(escaper.getPlayer(), "the terrain must be of slide type")
			return true;
		}
		if ((!BasicFunctions.IsBoolString(param2))) {
 Text.erP(escaper.getPlayer(), "the property \"canTurn\" must be a boolean (true or false)")
			return true;
		}
		if ( (TerrainTypeSlide(integer(terrainType)).setCanTurn(BasicFunctions.S2B(param2))) ) {
			if ((BasicFunctions.S2B(param2))) {
 Text.mkP(escaper.getPlayer(), "the heroes can now turn on this slide terrain")
			} else {
 Text.mkP(escaper.getPlayer(), "the heroes can't turn on this slide terrain anymore")
			}
		} else {
			if ((BasicFunctions.S2B(param2))) {
 Text.erP(escaper.getPlayer(), "the heroes can already turn on this slide terrain")
			} else {
 Text.erP(escaper.getPlayer(), "the heroes already can't turn on this slide terrain")
			}
		}
		return true;
	}


	//-changeTerrain(cht) <terrainLabel> <newTerrainType>   --> examples of terrain types : 'Nice', 46
	if ((name === "changeTerrain" || name === "cht")) {
		if ((!(nbParam === 2))) {
			return true;
		}
 DisplayLineToPlayer(escaper.getPlayer())
		str = ChangeOneTerrain(param1, param2);
		if ((str !== null)) {
 Text.mkP(escaper.getPlayer(), "changed to " + udg_colorCode[RED] + str)
		} else {
 Text.erP(escaper.getPlayer(), "couldn't change terrain")
		}
		return true;
	}


	//-changeAllTerrains(chat) [known(k)|notKnown(nk)]
	if ((name === "changeAllTerrains" || name === "chat")) {
		if ((noParam)) {
			str = "normal";
		} else {
			if ((nbParam === 1)) {
				if ((param1 === "known" || param1 === "k")) {
					str = "known";
				} else {
					if ((param1 === "notKnown" || param1 === "nk")) {
						str = "notKnown";
					} else {
						return true;
					}
				}
			}
		}
		if ((!ChangeAllTerrains(str))) {
 Text.erP(escaper.getPlayer(), "couldn't change terrains")
		}
		return true;
	}


	//-changeAllTerrainsAtRevive(chatar) <boolean change>
	if ((name === "changeAllTerrainsAtRevive" || name === "chatar")) {
		if ((nbParam === 1 && BasicFunctions.IsBoolString(param1) && BasicFunctions.S2B(param1) !== udg_changeAllTerrainsAtRevive)) {
			udg_changeAllTerrainsAtRevive = BasicFunctions.S2B(param1);
 Text.mkP(escaper.getPlayer(), "change all terrains at revive " + StringCase(param1, true))
		}
		return true;
	}


	//-exchangeTerrains(excht) [<terrainLabelA> <terrainLabelB>]   --> without parameter, click on the terrains to exchange them
	if ((name === "exchangeTerrains" || name === "excht")) {
		if ((noParam)) {
 escaper.makeExchangeTerrains()
 Text.mkP(escaper.getPlayer(), "exchange terrains on")
			return true;
		}
		if ((!(nbParam === 2))) {
			return true;
		}
		if ((ExchangeTerrains(param1, param2))) {
 Text.mkP(escaper.getPlayer(), "terrains exchanged")
		} else {
 Text.erP(escaper.getPlayer(), "couldn't exchange terrains")
		}
		return true;
	}


	//-randomizeTerrains(rdmt)
	if ((name === "randomizeTerrains" || name === "rdmt")) {
		if ((noParam)) {
			RandomizeTerrains()
		}
		return true;
	}


	//-createTerrain(crt) <terrainLabel>   --> create the terrain on the map, by clicking
	if ((name === "createTerrain" || name === "crt")) {
		if ((!(nbParam === 1))) {
			return true;
		}
		if ( (udg_terrainTypes.get(param1) == 0) ) {
 Text.erP(escaper.getPlayer(), "terrain \"" + param1 + "\" doesn't exist")
		} else {
 escaper.makeCreateTerrain(udg_terrainTypes.get(param1))
 Text.mkP(escaper.getPlayer(), "creating terrain on")
		}
		return true;
	}


	//-copyPasteTerrain(cpt)   --> copy paste a rectangle of terrain on the map
	if ((name === "copyPasteTerrain" || name === "cpt")) {
		if ((noParam)) {
 escaper.makeTerrainCopyPaste()
 Text.mkP(escaper.getPlayer(), "copy/paste terrain on")
		}
		return true;
	}


	//-verticalSymmetryTerrain(vst)   --> transform a rectangle of terrain by a vertical symmetry
	if ((name === "verticalSymmetryTerrain" || name === "vst")) {
		if ((noParam)) {
 escaper.makeTerrainVerticalSymmetry()
 Text.mkP(escaper.getPlayer(), "vertical symmetry terrain on")
		}
		return true;
	}


	//-horizontalSymmetryTerrain(hst)   --> transform a rectangle of terrain by an horizontal symmetry
	if ((name === "horizontalSymmetryTerrain" || name === "hst")) {
		if ((noParam)) {
 escaper.makeTerrainHorizontalSymmetry()
 Text.mkP(escaper.getPlayer(), "horizontal symmetry terrain on")
		}
		return true;
	}


	//-terrainHeight(th) [<terrainRadius> [<height>]]   --> apply a terrain height at chosen places ; default radius 100, default height 100
	if ((name === "terrainHeight" || name === "th")) {
		if ((!(nbParam <= 2))) {
			return true;
		}
		if ((nbParam === 2)) {
			y = S2R(param2);
			if ((y === 0 && param2 !== "0")) {
 Text.erP(escaper.getPlayer(), "param2 (height) must be a real")
				return true;
			}
			if ((y === 0)) {
 Text.erP(escaper.getPlayer(), "param2 (height) can't be 0")
				return true;
			}
		} else {
			y = 100;
		}
		if ((nbParam >= 1)) {
			x = S2R(param1);
			if ((x === 0 && param1 !== "0")) {
 Text.erP(escaper.getPlayer(), "param1 (radius) must be a real")
				return true;
			}
			if ((x <= 0)) {
 Text.erP(escaper.getPlayer(), "param1 (radius) must be higher than 0")
				return true;
			}
		} else {
			x = 100;
		}
 escaper.makeTerrainHeight(x, y)
 Text.mkP(escaper.getPlayer(), "terrain height making")
		return true;
	}


	//-displayTerrains(dt) [<terrainLabel>]   --> displays the characteristics of the terrains added by the maker(s)
	if ((name === "displayTerrains" || name === "dt")) {
		if ((!(nbParam <= 1))) {
			return true;
		}
		if ((nbParam === 1)) {
			if ( (udg_terrainTypes.isLabelAlreadyUsed(param1)) ) {
 udg_terrainTypes.get(param1).displayForPlayer(escaper.getPlayer())
			} else {
 Text.erP(escaper.getPlayer(), "unknown terrain")
			}
		} else {
 udg_terrainTypes.displayForPlayer(escaper.getPlayer())
		}
		return true;
	}


	//-newMonster(newm) <label> <unitTypeId> [<immolationRadius> [<speed> [<scale> [<isClickable>]]]]
	if ((name === "newMonster" || name === "newm")) {
		if ((nbParam < 2 || nbParam > 6)) {
			return true;
		}
		//checkParam1
		if ( (udg_monsterTypes.isLabelAlreadyUsed(param1)) ) {
 Text.erP(escaper.getPlayer(), "label \"" + param1 + "\" already used")
			return true;
		}
		//checkParam2
		if ((!(StringLength(param2) === 6 && SubStringBJ(param2, 1, 1) === "'" && SubStringBJ(param2, 6, 6) === "'"))) {
 Text.erP(escaper.getPlayer(), "wrong unit type id (exemple : 'hfoo')")
			return true;
		}
		//checkParam3
		if ((nbParam >= 3)) {
			x = S2R(param3);
			if ((!((x / 5) === I2R(R2I(x / 5))) || x < 0 || x > 400)) {
 Text.erP(escaper.getPlayer(), "wrong immolation radius ; should be an integer divisible by 5 and between 0 and 400")
				return true;
			}
			//checkParam4
			if ((nbParam >= 4)) {
				str = CmdParam(cmd, 4);
				if ((!(FunctionsOnNumbers.IsPositiveInteger(str)) || S2I(str) > MAX_MOVE_SPEED)) {
 Text.erP(escaper.getPlayer(), "wrong speed value ; should be a positive integer between 0 and 522")
					return true;
				}
				speed = S2R(str);
				//checkParam5
				if ((nbParam >= 5)) {
					str = CmdParam(cmd, 5);
					if ((S2R(str) <= 0 && str !== "default" && str !== "d")) {
 Text.erP(escaper.getPlayer(), "wrong scale value ; should be a real upper than 0 or \"default\" or \"d\"")
						return true;
					}
					if ((str === "default" || str === "d")) {
						x = -1;
					} else {
						x = S2R(str);
					}
					//checkParam6
					if ((nbParam === 6)) {
						str = CmdParam(cmd, 6);
						if ((!BasicFunctions.IsBoolString(str))) {
 Text.erP(escaper.getPlayer(), "wrong \"is clickable\" value ; should be 'true', 'false', '0' or '1'")
							return true;
						}
						b = BasicFunctions.S2B(str);
					} else {
						b = false;
					}
				} else {
					x = -1;
					b = false;
				}
			} else {
				speed = DEFAULT_MONSTER_SPEED;
				x = -1;
				b = false;
			}
		} else {
			param3 = "0";
			speed = DEFAULT_MONSTER_SPEED;
			x = -1;
			b = false;
		}
		if ((StringContainsChar(param1, CACHE_SEPARATEUR_ITEM) || StringContainsChar(param1, CACHE_SEPARATEUR_PARAM) || StringContainsChar(param1, "\""))) {
 Text.erP(escaper.getPlayer(), "characters \", " + CACHE_SEPARATEUR_ITEM + " and " + CACHE_SEPARATEUR_PARAM + " not allowed")
			return true;
		}
		if ( (udg_monsterTypes.new(param1, String2Ascii(SubStringBJ(param2, 2, 5)), x, S2R(param3), speed, b) == 0) ) {
 Text.erP(escaper.getPlayer(), "couldn't create the monster type")
		} else {
 Text.mkP(escaper.getPlayer(), "monster type \"" + param1 + "\" created")
		}
		return true;
	}


	//-setMonsterLabel(setml) <oldMonsterLabel> <newMonsterLabel>
	if ((name === "setMonsterLabel" || name === "setml")) {
		if ((!(nbParam === 2))) {
			return true;
		}
		b = (udg_monsterTypes.get(param1) != 0)
		if ((b)) {
			b = (not udg_monsterTypes.isLabelAlreadyUsed(param2))
		}
		if ((b)) {
			if ((StringContainsChar(param2, CACHE_SEPARATEUR_ITEM) || StringContainsChar(param2, CACHE_SEPARATEUR_PARAM) || StringContainsChar(param2, "\""))) {
 Text.erP(escaper.getPlayer(), "characters \", " + CACHE_SEPARATEUR_ITEM + " and " + CACHE_SEPARATEUR_PARAM + " not allowed")
				return true;
			}
 udg_monsterTypes.get(param1).setLabel(param2)
 Text.mkP(escaper.getPlayer(), "label changed to \"" + param2 + "\"")
		} else {
 Text.erP(escaper.getPlayer(), "impossible to change label")
		}
		return true;
	}


	//-setMonsterAlias(setma) <monsterLabel> <alias>
	if ((name === "setMonsterAlias" || name === "setma")) {
		if ((!(nbParam === 2))) {
			return true;
		}
		b = (udg_monsterTypes.get(param1) != 0)
		if ((b)) {
			b = (not udg_monsterTypes.isLabelAlreadyUsed(param2))
		}
		if ((b)) {
			if ((StringContainsChar(param2, CACHE_SEPARATEUR_ITEM) || StringContainsChar(param2, CACHE_SEPARATEUR_PARAM) || StringContainsChar(param2, "\""))) {
 Text.erP(escaper.getPlayer(), "characters \", " + CACHE_SEPARATEUR_ITEM + " and " + CACHE_SEPARATEUR_PARAM + " not allowed")
				return true;
			}
 udg_monsterTypes.get(param1).setAlias(param2)
 Text.mkP(escaper.getPlayer(), "alias changed to \"" + param2 + "\"")
		} else {
 Text.erP(escaper.getPlayer(), "impossible to change alias")
		}
		return true;
	}


	//-setMonsterUnit(setmu) <monsterLabel> <unitType>   --> example of unit type : 'ewsp'
	if ((name === "setMonsterUnit" || name === "setmu")) {
		if ((!(nbParam === 2))) {
			return true;
		}
		//checkParam1
		if ( (not udg_monsterTypes.isLabelAlreadyUsed(param1)) ) {
 Text.erP(escaper.getPlayer(), "unknown monster type")
			return true;
		}
		//checkParam2
		if ((!(StringLength(param2) === 6 && SubStringBJ(param2, 1, 1) === "'" && SubStringBJ(param2, 6, 6) === "'"))) {
 Text.erP(escaper.getPlayer(), "wrong unit type id (exemple : 'hfoo')")
			return true;
		}
		if ( (udg_monsterTypes.get(param1).setUnitTypeId(String2Ascii(SubStringBJ(param2, 2, 5)))) ) {
 Text.mkP(escaper.getPlayer(), "unit type changed")
		} else {
 Text.erP(escaper.getPlayer(), "this unit type doesn't exist")
		}
		return true;
	}


	//-setMonsterImmolation(setmi) <monsterLabel> <immolationRadius>   --> immolation between 5 and 400, divisible by 5
	if ((name === "setMonsterImmolation" || name === "setmi")) {
		if ((!(nbParam === 2))) {
			return true;
		}
		//checkParam1
		if ( (not udg_monsterTypes.isLabelAlreadyUsed(param1)) ) {
 Text.erP(escaper.getPlayer(), "unknown monster type")
			return true;
		}
		//checkParam2
		x = S2R(param2);
		if ((!((x / 5) === I2R(R2I(x / 5))) || x < 0 || x > 400)) {
 Text.erP(escaper.getPlayer(), "wrong immolation radius ; should be an integer divisible by 5 and between 0 and 400")
			return true;
		}
		if ( (udg_monsterTypes.get(param1).setImmolation(x)) ) {
 Text.mkP(escaper.getPlayer(), "immolation changed")
		} else {
 Text.erP(escaper.getPlayer(), "couldn't change immolation")
		}
		return true;
	}


	//-setMonsterMoveSpeed(setmms) <monsterLabel> <speed>
	if ((name === "setMonsterMoveSpeed" || name === "setmms")) {
		if ((!(nbParam === 2))) {
			return true;
		}
		//checkParam1
		if ( (not udg_monsterTypes.isLabelAlreadyUsed(param1)) ) {
 Text.erP(escaper.getPlayer(), "unknown monster type")
			return true;
		}
		//checkParam2
		if ((!(FunctionsOnNumbers.IsPositiveInteger(param2)) || S2I(param2) > MAX_MOVE_SPEED)) {
 Text.erP(escaper.getPlayer(), "wrong speed value ; should be a positive integer between 0 and 522")
			return true;
		}
		if ( (udg_monsterTypes.get(param1).setUnitMoveSpeed(S2R(param2))) ) {
 Text.mkP(escaper.getPlayer(), "move speed changed")
		} else {
 Text.erP(escaper.getPlayer(), "couldn't change move speed")
		}
		return true;
	}


	//-setMonsterScale(setms) <monsterLabel> <scale>   --> affects the size of this kind of monster
	if ((name === "setMonsterScale" || name === "setms")) {
		if ((!(nbParam === 2))) {
			return true;
		}
		//checkParam1
		if ( (not udg_monsterTypes.isLabelAlreadyUsed(param1)) ) {
 Text.erP(escaper.getPlayer(), "unknown monster type")
			return true;
		}
		//checkParam2
		if ((S2R(param2) <= 0 && param2 !== "default" && param2 !== "d")) {
 Text.erP(escaper.getPlayer(), "wrong scale value ; should be a real upper than 0 or \"default\" or \"d\"")
			return true;
		}
		if ((param2 === "default" || param2 === "d")) {
			x = -1;
		} else {
			x = S2R(param2);
		}
		if ( (udg_monsterTypes.get(param1).setScale(x)) ) {
 Text.mkP(escaper.getPlayer(), "scale changed")
		} else {
 Text.erP(escaper.getPlayer(), "couldn't change scale, probably because the old value is the same")
		}
		return true;
	}


	//-setMonsterClickable(setmc) <monsterLabel> <boolean clickable>   --> sets if locust or not for this kind of monster
	if ((name === "setMonsterClickable" || name === "setmc")) {
		if ((!(nbParam === 2))) {
			return true;
		}
		//checkParam1
		if ( (not udg_monsterTypes.isLabelAlreadyUsed(param1)) ) {
 Text.erP(escaper.getPlayer(), "unknown monster type")
			return true;
		}
		//checkParam2
		if ((!BasicFunctions.IsBoolString(param2))) {
 Text.erP(escaper.getPlayer(), "wrong \"is clickable\" value ; should be 'true', 'false', '0' or '1'")
			return true;
		}
		if ( (udg_monsterTypes.get(param1).setIsClickable(BasicFunctions.S2B(param2))) ) {
			if ((BasicFunctions.S2B(param2))) {
 Text.mkP(escaper.getPlayer(), "this monster type is now clickable")
			} else {
 Text.mkP(escaper.getPlayer(), "this monster type is now unclickable")
			}
		} else {
			if ((BasicFunctions.S2B(param2))) {
 Text.erP(escaper.getPlayer(), "this monster type is already clickable")
			} else {
 Text.erP(escaper.getPlayer(), "this monster type is already unclickable")
			}
		}
		return true;
	}


	//-setMonsterKillEffect(setmke) <monsterLabel> <killingEffect>
	if ((name === "setMonsterKillEffect" || name === "setmke")) {
		if ((!(nbParam === 2))) {
			return true;
		}
		//checkParam1
		if ( (not udg_monsterTypes.isLabelAlreadyUsed(param1)) ) {
 Text.erP(escaper.getPlayer(), "unknown monster type")
			return true;
		}
		if ((StringContainsChar(param2, CACHE_SEPARATEUR_ITEM) || StringContainsChar(param2, CACHE_SEPARATEUR_PARAM) || StringContainsChar(param2, "\""))) {
 Text.erP(escaper.getPlayer(), "characters \", " + CACHE_SEPARATEUR_ITEM + " and " + CACHE_SEPARATEUR_PARAM + " not allowed")
			return true;
		}
 udg_monsterTypes.get(param1).setKillingEffectStr(param2)
 Text.mkP(escaper.getPlayer(), "kill effect changed for this monster type")
		return true;
	}


	//-setMonsterMeteorsToKill(setmmtk) <monsterLabel> <meteorNumber>
	if ((name === "setMonsterMeteorsToKill" || name === "setmmtk")) {
		if ((!(nbParam === 2))) {
			return true;
		}
		//checkParam1
		if ( (not udg_monsterTypes.isLabelAlreadyUsed(param1)) ) {
 Text.erP(escaper.getPlayer(), "unknown monster type")
			return true;
		}
		//checkParam2
		if ((!(FunctionsOnNumbers.IsPositiveInteger(param2) && S2I(param2) > 0 && S2I(param2) < 10))) {
 Text.erP(escaper.getPlayer(), "param2 must be an integer between 1 and 9")
			return true;
		}
 udg_monsterTypes.get(param1).setNbMeteorsToKill(S2I(param2))
 Text.mkP(escaper.getPlayer(), "number of meteors to kill changed for this monster type")
		return true;
	}


	//-setMonsterHeight(setmh) <monsterLabel> <height>|default|d
	if ((name === "setMonsterHeight" || name === "setmh")) {
		if ((!(nbParam === 2))) {
			return true;
		}
		//checkParam1
		if ( (not udg_monsterTypes.isLabelAlreadyUsed(param1)) ) {
 Text.erP(escaper.getPlayer(), "unknown monster type")
			return true;
		}
		//checkParam2
		if ((param2 === "default" || param2 === "d")) {
			x = -1;
		} else if ((S2R(param2) > 0 || param2 === "0")) {
			x = S2R(param2);
		} else {
 Text.erP(escaper.getPlayer(), "wrong height ; should be a positive real or \"default\" or \"d\"")
			return true;
		}
		if ( (udg_monsterTypes.get(param1).setHeight(x)) ) {
 Text.mkP(escaper.getPlayer(), "height changed for this monster type")
		} else {
 Text.erP(escaper.getPlayer(), "the height is already to this value")
		}
		return true;
	}


	//-createMonsterImmobile(crmi) <monsterLabel> [<facingAngle>]   --> if facing angle not specified, random angles will be chosen
	if ((name === "createMonsterImmobile" || name === "crmi")) {
		if ((nbParam < 1 || nbParam > 2)) {
			return true;
		}
		//checkParam1
		if ( (not udg_monsterTypes.isLabelAlreadyUsed(param1)) ) {
 Text.erP(escaper.getPlayer(), "unknown monster type")
			return true;
		}
		//checkParam2
		if ((nbParam === 2)) {
			if ((S2R(param2) === 0 && param2 !== "0")) {
 Text.erP(escaper.getPlayer(), "wrong angle value ; should be a real (-1 for random angle)")
				return true;
			}
			x = S2R(param2);
		} else {
			x = -1;
		}
 escaper.makeCreateNoMoveMonsters(udg_monsterTypes.get(param1), x)
 Text.mkP(escaper.getPlayer(), "monster making on")
		return true;
	}

	//-createMonster(crm) <monsterLabel>   --> simple patrols (2 locations)   
	if ((name === "createMonster" || name === "crm")) {
		if ((!(nbParam === 1))) {
			return true;
		}
		//checkParam1
		if ( (not udg_monsterTypes.isLabelAlreadyUsed(param1)) ) {
 Text.erP(escaper.getPlayer(), "unknown monster type")
			return true;
		}
 escaper.makeCreateSimplePatrolMonsters("normal", udg_monsterTypes.get(param1))
 Text.mkP(escaper.getPlayer(), "monster making on")
		return true;
	}

	//-createMonsterString(crms) <monsterLabel>   --> simple patrols where the second loc of a monster is the first loc of the next one
	if ((name === "createMonsterString" || name === "crms")) {
		if ((!(nbParam === 1))) {
			return true;
		}
		//checkParam1
		if ( (not udg_monsterTypes.isLabelAlreadyUsed(param1)) ) {
 Text.erP(escaper.getPlayer(), "unknown monster type")
			return true;
		}
 escaper.makeCreateSimplePatrolMonsters("string", udg_monsterTypes.get(param1))
 Text.mkP(escaper.getPlayer(), "monster making on")
		return true;
	}

	//-createMonsterAuto(crma) <monsterLabel>  --> simple patrols created with only one click (click on a slide terrain)
	if ((name === "crma")) {
		if ((!(nbParam === 1))) {
			return true;
		}
		//checkParam1
		if ( (not udg_monsterTypes.isLabelAlreadyUsed(param1)) ) {
 Text.erP(escaper.getPlayer(), "unknown monster type")
			return true;
		}
 escaper.makeCreateSimplePatrolMonsters("auto", udg_monsterTypes.get(param1))
 Text.mkP(escaper.getPlayer(), "monster making on")
		return true;
	}


	//-setAutoDistOnTerrain(setadot) <newDist>   --> for patrol monsters created in one click, distance between locations and slide terrain
	if ((name === "setAutoDistOnTerrain" || name === "setadot")) {
		if ((!(nbParam === 1 && (S2R(param1) !== 0 || param1 === "0" || param1 === "default" || param1 === "d")))) {
			return true;
		}
		if ((param1 === "default" || param1 === "d")) {
			MakeSimplePatrolAuto_ChangeDistOnTerrainDefault()
		} else {
			if ((!MakeSimplePatrolAuto_ChangeDistOnTerrain(S2R(param1)))) {
 Text.erP(escaper.getPlayer(), "distance specified out of bounds")
				return true;
			}
		}
 Text.mkP(escaper.getPlayer(), "distance on terrain changed")
		return true;
	}


	//-createMonsterMultiPatrols(crmmp) <monsterLabel>   --> patrols until 20 locations
	if ((name === "createMonsterMultiPatrols" || name === "crmmp")) {
		if ((!(nbParam === 1))) {
			return true;
		}
		//checkParam1
		if ( (not udg_monsterTypes.isLabelAlreadyUsed(param1)) ) {
 Text.erP(escaper.getPlayer(), "unknown monster type")
			return true;
		}
 escaper.makeCreateMultiplePatrolsMonsters("normal", udg_monsterTypes.get(param1))
 Text.mkP(escaper.getPlayer(), "monster making on")
		return true;
	}

	//-createMonsterMultiPatrolsString(crmmps) <monsterLabel>   --> patrols until 20 locations, with come back at last location
	if ((name === "createMonsterMultiPatrolsString" || name === "crmmps")) {
		if ((!(nbParam === 1))) {
			return true;
		}
		//checkParam1
		if ( (not udg_monsterTypes.isLabelAlreadyUsed(param1)) ) {
 Text.erP(escaper.getPlayer(), "unknown monster type")
			return true;
		}
 escaper.makeCreateMultiplePatrolsMonsters("string", udg_monsterTypes.get(param1))
 Text.mkP(escaper.getPlayer(), "monster making on")
		return true;
	}


	//-createMonsterTeleport(crmt) <monsterLabel> <period> <angle>   --> teleport monster until 20 locations
	if ((name === "createMonsterTeleport" || name === "crmt")) {
		if ((!(nbParam === 3))) {
			return true;
		}
		//checkParam1
		if ( (not udg_monsterTypes.isLabelAlreadyUsed(param1)) ) {
 Text.erP(escaper.getPlayer(), "unknown monster type")
			return true;
		}
		//checkParam2
		x = S2R(param2);
		if ((x < MONSTER_TELEPORT_PERIOD_MIN || x > MONSTER_TELEPORT_PERIOD_MAX)) {
 Text.erP(escaper.getPlayer(), "the period must be between " + R2S(MONSTER_TELEPORT_PERIOD_MIN) + " and " + R2S(MONSTER_TELEPORT_PERIOD_MAX))
			return true;
		}
		//checkParam3
		if ((S2R(param3) === 0 && param3 !== "0")) {
 Text.erP(escaper.getPlayer(), "wrong angle value ; should be a real (-1 for random angle)")
			return true;
		}
 escaper.makeCreateTeleportMonsters("normal", udg_monsterTypes.get(param1), x, S2R(param3))
 Text.mkP(escaper.getPlayer(), "monster making on")
		return true;
	}


	//-createMonsterTeleportStrings(crmts) <monsterLabel> <period> <angle>   --> teleport monster until 20 locations
	if ((name === "createMonsterTeleport" || name === "crmts")) {
		if ((!(nbParam === 3))) {
			return true;
		}
		//checkParam1
		if ( (not udg_monsterTypes.isLabelAlreadyUsed(param1)) ) {
 Text.erP(escaper.getPlayer(), "unknown monster type")
			return true;
		}
		//checkParam2
		x = S2R(param2);
		if ((x < MONSTER_TELEPORT_PERIOD_MIN || x > MONSTER_TELEPORT_PERIOD_MAX)) {
 Text.erP(escaper.getPlayer(), "the period must be between " + R2S(MONSTER_TELEPORT_PERIOD_MIN) + " and " + R2S(MONSTER_TELEPORT_PERIOD_MAX))
			return true;
		}
		//checkParam3
		if ((S2R(param3) === 0 && param3 !== "0")) {
 Text.erP(escaper.getPlayer(), "wrong angle value ; should be a real (-1 for random angle)")
			return true;
		}
 escaper.makeCreateTeleportMonsters("string", udg_monsterTypes.get(param1), x, S2R(param3))
 Text.mkP(escaper.getPlayer(), "monster making on")
		return true;
	}


	//-next(n)   --> finalize the current multi patrols or teleport monster and start the next one
	if ((name === "next" || name === "n")) {
		if ((!noParam)) {
			return true;
		}
		if ( (escaper.makeMmpOrMtNext()) ) {
 Text.mkP(escaper.getPlayer(), "next")
		} else {
 Text.erP(escaper.getPlayer(), "you're not making multipatrol or teleport monsters")
		}
		return true;
	}


	//-monsterTeleportWait(mtw)   --> ajoute une période d'attente le MonsterTeleport en train d'être créé
	if ((name === "monsterTeleportWait" || name === "mtw")) {
		if ((!noParam)) {
			return true;
		}
		if ( (escaper.makeMonsterTeleportWait()) ) {
 Text.mkP(escaper.getPlayer(), "wait period added")
		} else {
 Text.erP(escaper.getPlayer(), "impossible to add a wait period")
		}
		return true;
	}


	//-monsterTeleportHide(mth)   --> ajoute une période où le MonsterTeleport est caché et ne tue pas
	if ((name === "monsterTeleportHide" || name === "mth")) {
		if ((!noParam)) {
			return true;
		}
		if ( (escaper.makeMonsterTeleportHide()) ) {
 Text.mkP(escaper.getPlayer(), "hide period added")
		} else {
 Text.erP(escaper.getPlayer(), "impossible to add a hide period")
		}
		return true;
	}


	//-setUnitTeleportPeriod(setutp) <period>
	if ((name === "setUnitTeleportPeriod" || name === "setutp")) {
		if ((nbParam !== 1)) {
			return true;
		}
		//checkParam1
		x = S2R(param1);
		if ((x < MONSTER_TELEPORT_PERIOD_MIN || x > MONSTER_TELEPORT_PERIOD_MAX)) {
 Text.erP(escaper.getPlayer(), "the period must be between " + R2S(MONSTER_TELEPORT_PERIOD_MIN) + " and " + R2S(MONSTER_TELEPORT_PERIOD_MAX))
			return true;
		}
		//apply command
 escaper.makeSetUnitTeleportPeriod("oneByOne", x)
 Text.mkP(escaper.getPlayer(), "setting unit teleport period on")
		return true;
	}


	//-setUnitTeleportPeriodBetweenPoints(setutpbp) <period>
	if ((name === "setUnitTeleportPeriodBetweenPoints" || name === "setutpbp")) {
		if ((nbParam !== 1)) {
			return true;
		}
		//checkParam1
		x = S2R(param1);
		if ((x < MONSTER_TELEPORT_PERIOD_MIN || x > MONSTER_TELEPORT_PERIOD_MAX)) {
 Text.erP(escaper.getPlayer(), "the period must be between " + R2S(MONSTER_TELEPORT_PERIOD_MIN) + " and " + R2S(MONSTER_TELEPORT_PERIOD_MAX))
			return true;
		}
		//apply command
 escaper.makeSetUnitTeleportPeriod("twoClics", x)
 Text.mkP(escaper.getPlayer(), "setting unit teleport period on")
		return true;
	}


	//-getUnitTeleportPeriod(getutp)
	if ((name === "getUnitTeleportPeriod" || name === "getutp")) {
		if ((!noParam)) {
			return true;
		}
		//apply command
 escaper.makeGetUnitTeleportPeriod()
 Text.mkP(escaper.getPlayer(), "getting unit teleport period on")
		return true;
	}


	//-setUnitTeleportPeriod(setutp) <period>
	if ((name === "setUnitTeleportPeriod" || name === "setutp")) {
		if ((nbParam !== 1)) {
			return true;
		}
		//checkParam1
		x = S2R(param1);
		if ((x < MONSTER_TELEPORT_PERIOD_MIN || x > MONSTER_TELEPORT_PERIOD_MAX)) {
 Text.erP(escaper.getPlayer(), "the period must be between " + R2S(MONSTER_TELEPORT_PERIOD_MIN) + " and " + R2S(MONSTER_TELEPORT_PERIOD_MAX))
			return true;
		}
		//apply command
 escaper.makeSetUnitTeleportPeriod("oneByOne", x)
 Text.mkP(escaper.getPlayer(), "setting unit teleport period on")
		return true;
	}


	//-setUnitMonsterType(setumt) <monsterLabel>
	if ((name === "setUnitMonsterType" || name === "setumt")) {
		if ((nbParam !== 1)) {
			return true;
		}
		//checkParam1
		if ( (not udg_monsterTypes.isLabelAlreadyUsed(param1)) ) {
 Text.erP(escaper.getPlayer(), "unknown monster type")
			return true;
		}
		//apply command
 escaper.makeSetUnitMonsterType("oneByOne", udg_monsterTypes.get(param1))
 Text.mkP(escaper.getPlayer(), "setting unit monster type on")
		return true;
	}


	//-setUnitMonsterTypeBetweenPoints(setumtbp) <monsterLabel>
	if ((name === "setUnitMonsterTypeBetweenPoints" || name === "setumtbp")) {
		if ((nbParam !== 1)) {
			return true;
		}
		//checkParam1
		if ( (not udg_monsterTypes.isLabelAlreadyUsed(param1)) ) {
 Text.erP(escaper.getPlayer(), "unknown monster type")
			return true;
		}
		//apply command
 escaper.makeSetUnitMonsterType("twoClics", udg_monsterTypes.get(param1))
 Text.mkP(escaper.getPlayer(), "setting unit monster type on")
		return true;
	}


	//-displayMonsters(dm) [<monsterLabel>]   --> displays the characteristics of the kinds of monsters added by the maker(s)
	if ((name === "displayMonsters" || name === "dm")) {
		if ((!(nbParam <= 1))) {
			return true;
		}
		if ((nbParam === 1)) {
			if ( (udg_monsterTypes.isLabelAlreadyUsed(param1)) ) {
 udg_monsterTypes.get(param1).displayTotalForPlayer(escaper.getPlayer())
			} else {
 Text.erP(escaper.getPlayer(), "unknown monster type")
			}
		} else {
 udg_monsterTypes.displayForPlayer(escaper.getPlayer())
		}
		return true;
	}


	//-deleteMonstersBetweenPoints(delmbp) [<deleteMode>]   --> delete monsters in a rectangle formed with two clicks
	if ((name === "deleteMonstersBetweenPoints" || name === "delmbp")) {
		//delete modes : all, noMove, move, simplePatrol, multiplePatrols
		if ((!(nbParam <= 1))) {
			return true;
		}
		if ((nbParam === 1)) {
			if ((param1 === "all" || param1 === "a")) {
				str = "all";
			} else {
				if ((param1 === "noMove" || param1 === "nm")) {
					str = "noMove";
				} else {
					if ((param1 === "move" || param1 === "m")) {
						str = "move";
					} else {
						if ((param1 === "simplePatrol" || param1 === "sp")) {
							str = "simplePatrol";
						} else {
							if ((param1 === "multiplePatrols" || param1 === "mp")) {
								str = "multiplePatrols";
							} else {
								return true;
							}
						}
					}
				}
			}
		} else {
			str = "all";
		}
 escaper.makeDeleteMonsters(str)
 Text.mkP(escaper.getPlayer(), "monsters deleting on")
		return true;
	}


	//-deleteMonster(delm)   --> delete the monsters clicked by the player
	if ((name === "deleteMonster" || name === "delm")) {
		if ((noParam)) {
 escaper.makeDeleteMonsters("oneByOne")
 Text.mkP(escaper.getPlayer(), "monster deleting on")
		}
		return true;
	}


	//-createMonsterSpawn(crmsp) <monsterSpawnLabel> <monsterLabel> <direction> [<frequency>]   --> default frequency is 2, minimum is 0.1, maximum is 30
	if ((name === "createMonsterSpawn" || name === "crmsp")) {
		if ((!(nbParam >= 3 && nbParam <= 4))) {
 Text.erP(escaper.getPlayer(), "uncorrect number of parameters")
			return true;
		}
		if ((escaper.getMakingLevel().monsterSpawns.getFromLabel(param1) != 0)) {
 Text.erP(escaper.getPlayer(), "a monster spawn with label \"" + param1 + "\" already exists for this level")
			return true;
		}
		if ((udg_monsterTypes.get(param2) == 0)) {
 Text.erP(escaper.getPlayer(), "unknown monster type \"" + param2 + "\"")
			return true;
		}
		if ((param3 === "leftToRight" || param3 === "ltr")) {
			str = "leftToRight";
		} else if ((param3 === "upToDown" || param3 === "utd")) {
			str = "upToDown";
		} else if ((param3 === "rightToLeft" || param3 === "rtl")) {
			str = "rightToLeft";
		} else if ((param3 === "downToUp" || param3 === "dtu")) {
			str = "downToUp";
		} else {
 Text.erP(escaper.getPlayer(), "param 3 should be direction : leftToRight, upToDown, rightToLeft or downToUp")
			return true;
		}
		if ((nbParam === 4)) {
			x = S2R(param4);
			if ((x < 0.1 or x > 30)) {
 Text.erP(escaper.getPlayer(), "frequency must be a real between 0.1 and 30")
				return true;
			}
		} else {
			x = 2;
		}
 escaper.makeCreateMonsterSpawn(param1, udg_monsterTypes.get(param2), str, x)
 Text.mkP(escaper.getPlayer(), "monster spawn making on")
		return true;
	}


	//-setMonsterSpawnLabel(setmsl) <oldMonsterSpawnLabel> <newMonsterSpawnLabel>
	if ((name === "setMonsterSpawnLabel" || name === "setmsl")) {
		if ((!(nbParam === 2))) {
			return true;
		}
		if ((escaper.getMakingLevel().monsterSpawns.changeLabel(param1, param2))) {
 Text.mkP(escaper.getPlayer(), "label changed")
		} else {
 Text.erP(escaper.getPlayer(), "couldn't change label")
		}
		return true;
	}


	//-setMonsterSpawnMonster(setmsm) <monsterSpawnLabel> <monsterLabel>
	if ((name === "setMonsterSpawnMonster" || name === "setmsm")) {
		if ((!(nbParam === 2))) {
			return true;
		}
		if ((escaper.getMakingLevel().monsterSpawns.getFromLabel(param1) == 0)) {
 Text.erP(escaper.getPlayer(), "unknown monster spawn \"" + param1 + "\" in this level")
			return true;
		}
		if ((udg_monsterTypes.get(param2) == 0)) {
 Text.erP(escaper.getPlayer(), "unknown monster type \"" + param2 + "\"")
			return true;
		}
 escaper.getMakingLevel().monsterSpawns.getFromLabel(param1).setMonsterType(udg_monsterTypes.get(param2))
 Text.mkP(escaper.getPlayer(), "monster type changed")
		return true;
	}


	//-setMonsterSpawnDirection(setmsd) <monsterSpawnLabel> <direction>   --> leftToRight(ltr), upToDown(utd), rightToLeft(rtl), downToUp(dtu)
	if ((name === "setMonsterSpawnDirection" || name === "setmsd")) {
		if ((!(nbParam === 2))) {
			return true;
		}
		if ((escaper.getMakingLevel().monsterSpawns.getFromLabel(param1) == 0)) {
 Text.erP(escaper.getPlayer(), "unknown monster spawn \"" + param1 + "\" in this level")
			return true;
		}
		if ((param2 === "leftToRight" || param2 === "ltr")) {
			str = "leftToRight";
		} else if ((param2 === "upToDown" || param2 === "utd")) {
			str = "upToDown";
		} else if ((param2 === "rightToLeft" || param2 === "rtl")) {
			str = "rightToLeft";
		} else if ((param2 === "downToUp" || param2 === "dtu")) {
			str = "downToUp";
		} else {
 Text.erP(escaper.getPlayer(), "direction should be leftToRight, upToDown, rightToLeft or downToUp")
			return true;
		}
 escaper.getMakingLevel().monsterSpawns.getFromLabel(param1).setSens(str)
 Text.mkP(escaper.getPlayer(), "direction changed")
		return true;
	}


	//-setMonsterSpawnFrequency(setmsf) <monsterSpawnLabel> <frequency>   --> maximum 20 mobs per second
	if ((name === "setMonsterSpawnFrequency" || name === "setmsf")) {
		if ((!(nbParam === 2))) {
			return true;
		}
		if ((escaper.getMakingLevel().monsterSpawns.getFromLabel(param1) == 0)) {
 Text.erP(escaper.getPlayer(), "unknown monster spawn \"" + param1 + "\" in this level")
			return true;
		}
		x = S2R(param2);
		if ((x < 0.1 or x > 30)) {
 Text.erP(escaper.getPlayer(), "frequency must be a real between 0.1 and 30")
			return true;
		}
 escaper.getMakingLevel().monsterSpawns.getFromLabel(param1).setFrequence(x)
 Text.mkP(escaper.getPlayer(), "frequency changed")
		return true;
	}


	//-displayMonsterSpawns(dms)
	if ((name === "displayMonsterSpawns" || name === "dms")) {
		if ((!noParam)) {
			return true;
		}
 escaper.getMakingLevel().monsterSpawns.displayForPlayer(escaper.getPlayer())
		return true;
	}


	//-deleteMonsterSpawn(delms) <monsterSpawnLabel> 
	if ((name === "deleteMonsterSpawn" || name === "delms")) {
		if ((!(nbParam === 1))) {
			return true;
		}
		if ((escaper.getMakingLevel().monsterSpawns.clearMonsterSpawn(param1))) {
 Text.mkP(escaper.getPlayer(), "monster spawn deleted")
		} else {
 Text.erP(escaper.getPlayer(), "unknown monster spawn for this level")
		}
		return true;
	}


	//createKey(crk)   --> create meteors used to kill clickable monsters
	if ((name === "createKey" || name === "crk")) {
		if ((noParam)) {
 escaper.makeCreateMeteor()
 Text.mkP(escaper.getPlayer(), "meteor making on")
		}
		return true;
	}


	//-deleteKeysBetweenPoints(delkbp)   --> delete meteors in a rectangle formed with two clicks
	if ((name === "deleteKeysBetweenPoints" || name === "delkbp")) {
		if ((noParam)) {
 escaper.makeDeleteMeteors("twoClics")
 Text.mkP(escaper.getPlayer(), "meteors deleting on")
		}
		return true;
	}


	//-deleteKey(delk)   --> delete the meteors clicked by the player
	if ((name === "deleteKey" || name === "delk")) {
		if ((noParam)) {
 escaper.makeDeleteMeteors("oneByOne")
 Text.mkP(escaper.getPlayer(), "meteors deleting on")
		}
		return true;
	}


	//-createStart(crs) [next(n)]   --> create the start (a rectangle formed with two clicks) of the current level or the next one if specified
	if ((name === "createStart" || name === "crs")) {
		if ((!(nbParam <= 1))) {
			return true;
		}
		//checkParam1
		if ((nbParam === 1)) {
			if ((!(param1 === "next" || param1 === "n"))) {
 Text.erP(escaper.getPlayer(), "param1 should be \"next\" or \"n\"")
				return true;
			}
			b = true;
		} else {
			b = false;
		}
 escaper.makeCreateStart(b) //b signifie si le "Start" est créé pour le niveau suivant (sinon pour le niveau en cours de mapping pour l'escaper)
 Text.mkP(escaper.getPlayer(), "start making on")
		return true;
	}


	//-createEnd(cre)   --> create the end (a rectangle formed with two clicks) of the current level
	if ((name === "createEnd" || name === "cre")) {
		if ((!noParam)) {
			return true;
		}
 escaper.makeCreateEnd()
 Text.mkP(escaper.getPlayer(), "end making on")
		return true;
	}


	//-getMakingLevel(getmkl)   --> displays the id of the level the player is creating (the first one is id 0)
	if ((name === "getMakingLevel" || name === "getmkl")) {
		if ((!noParam)) {
			return true;
		}
		if ( (udg_levels.getCurrentLevel() == escaper.getMakingLevel()) ) {
			str = " (same as current level)";
		} else {
			str = "";
		}
 Text.P(escaper.getPlayer(), "the level you are making is number " + I2S(escaper.getMakingLevel().getId()) + str)
		return true;
	}


	//-setMakingLevel(setmkl) <levelId> | current(c)   --> sets the level the players chose to continue creating
	if ((name === "setMakingLevel" || name === "setmkl")) {
		if ((!(nbParam === 1))) {
			return true;
		}
		if ((FunctionsOnNumbers.IsPositiveInteger(param1))) {
			n = S2I(param1);
			if ( (udg_levels.getLastLevelId() < n) ) {
				if ( (n - udg_levels.getLastLevelId() == 1) ) {
					if ( (udg_levels.new()) ) {
 Text.mkP(escaper.getPlayer(), "level number " + I2S(n) + " created")
					} else {
 Text.erP(escaper.getPlayer(), "nombre maximum de niveaux atteint")
						return true;
					}
				} else {
 Text.erP(escaper.getPlayer(), "this level doesn't exist")
					return true;
				}
			}
			if ( (escaper.setMakingLevel(udg_levels.get(n))) ) {
 Text.mkP(escaper.getPlayer(), "you are now making level " + I2S(n))
			} else {
 Text.erP(escaper.getPlayer(), "you are already making this level")
			}
		} else {
			if ((param1 === "current" || param1 === "c")) {
				if ( (escaper.setMakingLevel(0)) ) {
 Text.mkP(escaper.getPlayer(), "you are now making current level (which is at the moment number " + I2S(udg_levels.getCurrentLevel().getId()) + ")")
				} else {
 Text.erP(escaper.getPlayer(), "you are already making current level")
				}
			} else {
 Text.erP(escaper.getPlayer(), "param1 should be a level id or \"current\"")
			}
		}
		return true;
	}


	//-newLevel(newl)   --> creates a new level after the last one
	if ((name === "newLevel" || name === "newl")) {
		if ((noParam)) {
			if ( (udg_levels.new()) ) {
 Text.mkP(escaper.getPlayer(), "level number " + I2S(udg_levels.getLastLevelId()) + " created")
			} else {
 Text.erP(escaper.getPlayer(), "nombre maximum de niveaux atteint")
			}
		}
		return true;
	}


	//-setLivesEarned(setle) <livesNumber> [<levelID>]   --> the number of lives earned at the specified level
	if ((name === "setLivesEarned" || name === "setle")) {
		if ((!(nbParam >= 1 && nbParam <= 2))) {
			return true;
		}
		//check param1
		if ((!FunctionsOnNumbers.IsPositiveInteger(param1))) {
 Text.erP(escaper.getPlayer(), "the number of lives must be a positive integer")
			return true;
		}
		//check param2
		if ((nbParam === 2)) {
			if ((!(FunctionsOnNumbers.IsPositiveInteger(param2)))) {
 Text.erP(escaper.getPlayer(), "the level number must be a positive integer")
				return true;
			}
			level = udg_levels.get(S2I(param2))
			if ((level === 0)) {
 Text.erP(escaper.getPlayer(), "level number " + param2 + " doesn't exist")
				return true;
			}
		} else {
			level = escaper.getMakingLevel()
		}
 level.setNbLivesEarned(S2I(param1))
		if ( (level.getId() > 0) ) {
 Text.mkP(escaper.getPlayer(), "the number of lives earned at level " + I2S(level.getId()) + " is now " + param1)
		} else {
 Text.mkP(escaper.getPlayer(), "the number of lives at the beginning of the game is now " + param1)
		}
		return true;
	}


	//-createVisibility(crv)   --> create visibility rectangles for the current level
	if ((name === "createVisibility" || name === "crv")) {
		if ((noParam)) {
 escaper.makeCreateVisibilityModifier()
 Text.mkP(escaper.getPlayer(), "visibility making on")
		}
		return true;
	}


	//-removeVisibilities(remv) [<levelId>]   --> remove all visibility rectangles made for the current level
	if ((name === "removeVisibilities" || name === "remv")) {
		if ((!(noParam || nbParam === 1))) {
			return true;
		}
		//check param1
		if ((nbParam === 1)) {
			if ((!(FunctionsOnNumbers.IsPositiveInteger(param1)))) {
 Text.erP(escaper.getPlayer(), "the level number must be a positive integer")
				return true;
			}
			level = udg_levels.get(S2I(param2))
			if ((level === 0)) {
 Text.erP(escaper.getPlayer(), "level number " + param1 + " doesn't exist")
				return true;
			}
		} else {
			level = escaper.getMakingLevel()
		}
 level.removeVisibilities()
 Text.mkP(escaper.getPlayer(), "visibilities removed for level " + I2S(level.getId()))
		return true;
	}


	//-setStartMessage(setsm) [<message>]   --> sets the start message of the current level (spaces allowed)
	if ((name === "setStartMessage" || name === "setsm")) {
 escaper.getMakingLevel().setStartMessage(CmdParam(cmd, 0))
 Text.mkP(escaper.getPlayer(), "start message for level " + I2S(escaper.getMakingLevel().getId()) + " changed")
		return true;
	}


	//-getStartMessage(getsm)   --> displays the start message of the current level
	if ((name === "getStartMessage" || name === "getsm")) {
		str = escaper.getMakingLevel().getStartMessage()
		if ((str === "" || str === null)) {
 Text.mkP(escaper.getPlayer(), "start message for level " + I2S(escaper.getMakingLevel().getId()) + " is not defined")
		} else {
 Text.mkP(escaper.getPlayer(), "start message for level " + I2S(escaper.getMakingLevel().getId()) + " is \"" + str + "\"")
		}
		return true;
	}


	//-cancel(z)   --> cancel the last action made on the map
	if ((name === "cancel" || name === "z")) {
		if ((noParam)) {
			if ( (not escaper.cancelLastAction()) ) {
 Text.erP(escaper.getPlayer(), "nothing to cancel")
			}
		}
		return true;
	}


	//-redo(y)   --> redo the last action cancelled
	if ((name === "redo" || name === "y")) {
		if ((noParam)) {
			if ( (not escaper.redoLastAction()) ) {
 Text.erP(escaper.getPlayer(), "nothing to redo")
			}
		}
		return true;
	}


	//-nbLevels(nbl)   --> display the number of levels that are currently in the map
	if ((name === "nbLevels" || name === "nbl")) {
		if ((noParam)) {
			n = udg_levels.count()
			if ((n > 1)) {
 Text.P(escaper.getPlayer(), "there are currently " + I2S(n) + " levels in the map")
			} else {
 Text.P(escaper.getPlayer(), "there is currently " + I2S(n) + " level in the map")
			}
		}
		return true;
	}


	//-newCaster(newc) <label> <casterMonsterType> <projectileMonsterType> [<range> [<projectileSpeed> [<loadTime>]]]
	if ((name === "newCaster" || name === "newc")) {
		if ((nbParam < 3 || nbParam > 6)) {
			return true;
		}
		//checkParam1
		if ( (udg_casterTypes.isLabelAlreadyUsed(param1)) ) {
 Text.erP(escaper.getPlayer(), "label \"" + param1 + "\" already used")
			return true;
		}
		//checkParam2
		if ( (not udg_monsterTypes.isLabelAlreadyUsed(param2)) ) {
 Text.erP(escaper.getPlayer(), "unknown monster type \"" + param2 + "\"")
			return true;
		}
		//checkParam3
		if ( (not udg_monsterTypes.isLabelAlreadyUsed(param3)) ) {
 Text.erP(escaper.getPlayer(), "unknown monster type \"" + param3 + "\"")
			return true;
		}
		//checkParam4 range
		if ((nbParam >= 4)) {
			if ((S2R(param4) <= 0)) {
 Text.erP(escaper.getPlayer(), "the range must be a real higher than 0")
				return true;
			}
			x = S2R(param4);
			//checkParam5 projectile speed
			if ((nbParam >= 5)) {
				if ((S2R(CmdParam(cmd, 5)) < MIN_CASTER_PROJECTILE_SPEED)) {
 Text.erP(escaper.getPlayer(), "the projectile speed must be a real higher or equals to " + R2S(MIN_CASTER_PROJECTILE_SPEED))
					return true;
				}
				speed = S2R(CmdParam(cmd, 5));
				//checkParam6 load time
				if ((nbParam === 6)) {
					if ((S2R(CmdParam(cmd, 6)) < MIN_CASTER_LOAD_TIME)) {
 Text.erP(escaper.getPlayer(), "the load time must be a real higher or equals to " + R2S(MIN_CASTER_LOAD_TIME))
						return true;
					}
					y = S2R(CmdParam(cmd, 6));
				} else {
					y = DEFAULT_CASTER_LOAD_TIME;
				}
			} else {
				y = DEFAULT_CASTER_LOAD_TIME;
				speed = DEFAULT_CASTER_PROJECTILE_SPEED;
			}
		} else {
			y = DEFAULT_CASTER_LOAD_TIME;
			speed = DEFAULT_CASTER_PROJECTILE_SPEED;
			x = DEFAULT_CASTER_RANGE;
		}
		//apply command
		if ((StringContainsChar(param1, CACHE_SEPARATEUR_ITEM) || StringContainsChar(param1, CACHE_SEPARATEUR_PARAM) || StringContainsChar(param1, "\""))) {
 Text.erP(escaper.getPlayer(), "characters \", " + CACHE_SEPARATEUR_ITEM + " and " + CACHE_SEPARATEUR_PARAM + " not allowed")
			return true;
		}
 udg_casterTypes.new(param1, udg_monsterTypes.get(param2), udg_monsterTypes.get(param3), x, speed, y, DEFAULT_CASTER_ANIMATION)
 Text.mkP(escaper.getPlayer(), "new caster type \"" + param1 + "\" created")
		return true;
	}


	//-setCasterLabel(setcl) <oldCasterLabel> <newCasterLabel>
	if ((name === "setCasterLabel" || name === "setcl")) {
		if ((!(nbParam === 2))) {
			return true;
		}
		b = (udg_casterTypes.get(param1) != 0)
		if ((b)) {
			b = (not udg_casterTypes.isLabelAlreadyUsed(param2))
		}
		if ((b)) {
			if ((StringContainsChar(param2, CACHE_SEPARATEUR_ITEM) || StringContainsChar(param2, CACHE_SEPARATEUR_PARAM) || StringContainsChar(param2, "\""))) {
 Text.erP(escaper.getPlayer(), "characters \", " + CACHE_SEPARATEUR_ITEM + " and " + CACHE_SEPARATEUR_PARAM + " not allowed")
				return true;
			}
 udg_casterTypes.get(param1).setLabel(param2)
 Text.mkP(escaper.getPlayer(), "label changed to \"" + param2 + "\"")
		} else {
 Text.erP(escaper.getPlayer(), "impossible to change label")
		}
		return true;
	}


	//-setCasterAlias(setca) <casterLabel> <alias>
	if ((name === "setCasterAlias" || name === "setca")) {
		if ((!(nbParam === 2))) {
			return true;
		}
		b = (udg_casterTypes.get(param1) != 0)
		if ((b)) {
			b = (not udg_casterTypes.isLabelAlreadyUsed(param2))
		}
		if ((b)) {
			if ((StringContainsChar(param2, CACHE_SEPARATEUR_ITEM) || StringContainsChar(param2, CACHE_SEPARATEUR_PARAM) || StringContainsChar(param2, "\""))) {
 Text.erP(escaper.getPlayer(), "characters \", " + CACHE_SEPARATEUR_ITEM + " and " + CACHE_SEPARATEUR_PARAM + " not allowed")
				return true;
			}
 udg_casterTypes.get(param1).setAlias(param2)
 Text.mkP(escaper.getPlayer(), "alias changed to \"" + param2 + "\"")
		} else {
 Text.erP(escaper.getPlayer(), "impossible to change alias")
		}
		return true;
	}


	//-setCasterCaster(setcc) <casterLabel> <casterMonsterType>
	if ((name === "setCasterCaster" || name === "setcc")) {
		if ((nbParam !== 2)) {
			return true;
		}
		//checkParam 1
		if ( (not udg_casterTypes.isLabelAlreadyUsed(param1)) ) {
 Text.erP(escaper.getPlayer(), "unknown caster type \"" + param1 + "\"")
			return true;
		}
		//checkParam 2
		if ( (not udg_monsterTypes.isLabelAlreadyUsed(param2)) ) {
 Text.erP(escaper.getPlayer(), "unknown monster type \"" + param2 + "\"")
			return true;
		}
		//apply command
 udg_casterTypes.get(param1).setCasterMonsterType(udg_monsterTypes.get(param2))
 Text.mkP(escaper.getPlayer(), "caster monster type changed")
		return true;
	}


	//-setCasterProjectile(setcp) <casterLabel> <projectileMonsterType>
	if ((name === "setCasterProjectile" || name === "setcp")) {
		if ((nbParam !== 2)) {
			return true;
		}
		//checkParam 1
		if ( (not udg_casterTypes.isLabelAlreadyUsed(param1)) ) {
 Text.erP(escaper.getPlayer(), "unknown caster type \"" + param1 + "\"")
			return true;
		}
		//checkParam 2
		if ( (not udg_monsterTypes.isLabelAlreadyUsed(param2)) ) {
 Text.erP(escaper.getPlayer(), "unknown monster type \"" + param2 + "\"")
			return true;
		}
		//apply command
 udg_casterTypes.get(param1).setProjectileMonsterType(udg_monsterTypes.get(param2))
 Text.mkP(escaper.getPlayer(), "projectile monster type changed")
		return true;
	}


	//-setCasterRange(setcr) <casterLabel> <range>
	if ((name === "setCasterRange" || name === "setcr")) {
		if ((nbParam !== 2)) {
			return true;
		}
		//checkParam 1
		if ( (not udg_casterTypes.isLabelAlreadyUsed(param1)) ) {
 Text.erP(escaper.getPlayer(), "unknown caster type \"" + param1 + "\"")
			return true;
		}
		//checkParam 2
		if ((S2R(param2) <= 0)) {
 Text.erP(escaper.getPlayer(), "the range must be a real higher than 0")
			return true;
		}
		//apply command
 udg_casterTypes.get(param1).setRange(S2R(param2))
 Text.mkP(escaper.getPlayer(), "range changed")
		return true;
	}


	//-setCasterSpeed(setcs) <casterLabel> <projectileSpeed>
	if ((name === "setCasterSpeed" || name === "setcs")) {
		if ((nbParam !== 2)) {
			return true;
		}
		//checkParam 1
		if ( (not udg_casterTypes.isLabelAlreadyUsed(param1)) ) {
 Text.erP(escaper.getPlayer(), "unknown caster type \"" + param1 + "\"")
			return true;
		}
		//checkParam 2
		if ((S2R(param2) < MIN_CASTER_PROJECTILE_SPEED)) {
 Text.erP(escaper.getPlayer(), "the projectile speed must be a real higher or equals to " + R2S(MIN_CASTER_PROJECTILE_SPEED))
			return true;
		}
		//apply command
 udg_casterTypes.get(param1).setProjectileSpeed(S2R(param2))
 Text.mkP(escaper.getPlayer(), "projectile speed changed")
		return true;
	}


	//-setCasterLoadtime(setclt) <casterLabel> <loadTime>
	if ((name === "setCasterLoadTime" || name === "setclt")) {
		if ((nbParam !== 2)) {
			return true;
		}
		//checkParam 1
		if ( (not udg_casterTypes.isLabelAlreadyUsed(param1)) ) {
 Text.erP(escaper.getPlayer(), "unknown caster type \"" + param1 + "\"")
			return true;
		}
		//checkParam 2
		if ((S2R(param2) < MIN_CASTER_LOAD_TIME)) {
 Text.erP(escaper.getPlayer(), "the load time must be a real higher or equals to " + R2S(MIN_CASTER_LOAD_TIME))
			return true;
		}
		//apply command
 udg_casterTypes.get(param1).setLoadTime(S2R(param2))
 Text.mkP(escaper.getPlayer(), "load time changed")
		return true;
	}


	//-setCasterAnimation(setcan) <casterLabel> <animation>
	if ((name === "setCasterAnimation" || name === "setcan")) {
		if ((!(nbParam >= 2))) {
			return true;
		}
		//checkParam 1
		if ( (not udg_casterTypes.isLabelAlreadyUsed(param1)) ) {
 Text.erP(escaper.getPlayer(), "unknown caster type \"" + param1 + "\"")
			return true;
		}
		//checkParam 2
		n = StringLength(name) + StringLength(param1) + 4;
		str = SubStringBJ(cmd, n, StringLength(cmd));
		//apply command
 udg_casterTypes.get(param1).setAnimation(str)
 Text.mkP(escaper.getPlayer(), "caster animation changed")
		return true;
	}


	//-createCaster(crc) <casterLabel> [<facingAngle>]
	if ((name === "createCaster" || name === "crc")) {
		if ((nbParam < 1 || nbParam > 2)) {
			return true;
		}
		//checkParam 1
		if ( (not udg_casterTypes.isLabelAlreadyUsed(param1)) ) {
 Text.erP(escaper.getPlayer(), "unknown caster type \"" + param1 + "\"")
			return true;
		}
		//checkParam2
		if ((nbParam === 2)) {
			if ((S2R(param2) === 0 && param2 !== "0")) {
 Text.erP(escaper.getPlayer(), "wrong angle value ; should be a real (-1 for random angle)")
				return true;
			}
			x = S2R(param2);
		} else {
			x = -1;
		}
		//apply command
 escaper.makeCreateCaster(udg_casterTypes.get(param1), x)
 Text.mkP(escaper.getPlayer(), "casters making on")
		return true;
	}


	//-deleteCastersBetweenPoints(delcbp)   --> delete casters in a rectangle formed with two clicks
	if ((name === "deleteCastersBetweenPoints" || name === "delcbp")) {
		if ((noParam)) {
 escaper.makeDeleteCasters("twoClics")
 Text.mkP(escaper.getPlayer(), "casters deleting on")
		}
		return true;
	}


	//-deleteCaster(delc)   --> delete the casters clicked by the player
	if ((name === "deleteCaster" || name === "delc")) {
		if ((noParam)) {
 escaper.makeDeleteCasters("oneByOne")
 Text.mkP(escaper.getPlayer(), "casters deleting on")
		}
		return true;
	}


	//-displayCasters(dc) [<casterLabel>]
	if ((name === "displayCasters" || name === "dc")) {
		if ((!(nbParam <= 1))) {
			return true;
		}
		if ((nbParam === 1)) {
			if ( (udg_casterTypes.isLabelAlreadyUsed(param1)) ) {
 udg_casterTypes.get(param1).displayForPlayer(escaper.getPlayer())
			} else {
 Text.erP(escaper.getPlayer(), "unknown caster type")
			}
		} else {
 udg_casterTypes.displayForPlayer(escaper.getPlayer())
		}
		return true;
	}


	//-createClearMob(crcm) <disableDuration>
	if ((name === "createClearMob" || name === "crcm")) {
		if ((!(nbParam === 1))) {
			return true;
		}
		x = S2R(param1);
		if ((x !== 0 && (x > CLEAR_MOB_MAX_DURATION || x < ClearMob_FRONT_MONTANT_DURATION))) {
 Text.erP(escaper.getPlayer(), "the disable duration must be a real between " + R2S(ClearMob_FRONT_MONTANT_DURATION) + " and " + R2S(CLEAR_MOB_MAX_DURATION))
			return true;
		}
 escaper.makeCreateClearMobs(x)
 Text.mkP(escaper.getPlayer(), "clear mob making on")
		return true;
	}


	//-deleteClearMob(delcm)
	if ((name === "deleteClearMob" || name === "delcm")) {
		if ((!noParam)) {
			return true;
		}
 escaper.makeDeleteClearMobs()
 Text.mkP(escaper.getPlayer(), "clear mobs deleting on")
		return true;
	}


	//-getTerrainCliffClass(gettcc) <terrainLabel>
	if ((name === "getTerrainCliffClass" || name === "gettcc")) {
		if ((nbParam !== 1)) {
			return true;
		}
		//checkParam 1
		b = (udg_terrainTypes.get(param1) != 0)
		if ((!b)) {
			return true;
		}
		//apply command
 Text.mkP(escaper.getPlayer(), "cliff class for that terrain is " + I2S(udg_terrainTypes.get(param1).getCliffClassId()))
		return true;
	}


	//-getMainTileset
	if ((name === "getMainTileset")) {
		if ((!noParam)) {
			return true;
		}
		if ( (udg_terrainTypes.getMainTileset() == "auto") ) {
 Text.mkP(escaper.getPlayer(), "main tile: auto")
		} else {
 Text.mkP(escaper.getPlayer(), "main tile: " + udg_terrainTypes.getMainTileset() + " = " + tileset2tilesetString(udg_terrainTypes.getMainTileset()))
		}
		return true;
	}




	return false;
};






}
