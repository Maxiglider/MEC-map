import { FunctionsOnNumbers } from "core/01_libraries/Functions_on_numbers";

const initCommandCheat = () => { // needs CommandsFunctions





const ExecuteCommandCheat = (escaper: Escaper, cmd: string): boolean => {
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




	//-slideSpeed(ss) <speed>   --> changes the slide speed of your hero, ignoring terrains
	if ((name === "setSlideSpeed" || name === "ss")) {
		if ((!IsInteger(param1))) {
			return true;
		}
		speed = S2R(param1) * SLIDE_PERIOD;
		if ((nbParam === 1)) {
 escaper.absoluteSlideSpeed(speed)
 Text.P(escaper.getPlayer(), "your slide speed is to " + param1)
			return true;
		}
		if ( (not(nbParam == 2 and escaper.isMaximaxou())) ) {
			return true;
		}
		if ((param2 === "all" || param2 === "a")) {
			i = 0;
			while (true) {
				if ((i >= NB_ESCAPERS)) break;
				if ( (udg_escapers.get(i) != 0) ) {
 udg_escapers.get(i).absoluteSlideSpeed(speed)
				}
				i = i + 1;
			}
 Text.P(escaper.getPlayer(), "slide speed for all is to " + param1)
			return true;
		}
		if ((IsPlayerColorString(param2))) {
			if ( (udg_escapers.get(ColorString2Id(param2)) != 0) ) {
 udg_escapers.get(ColorString2Id(param2)).absoluteSlideSpeed(speed)
 Text.P(escaper.getPlayer(), "slide speed for player " + param2 + " is to " + param1)
			}
		}
		return true;
	}


	//-normalSlideSpeed(nss)   --> puts the slide speed back to normal (respecting terrains)
	if ((name === "normalSlideSpeed" || name === "nss")) {
		if ((noParam)) {
 escaper.stopAbsoluteSlideSpeed()
 Text.P(escaper.getPlayer(), "your slide speed depends now on terrains")
			return true;
		}
		if ( (not(nbParam == 1 and escaper.isMaximaxou())) ) {
			return true;
		}
		if ((param1 === "all" || param1 === "a")) {
			i = 0;
			while (true) {
				if ((i >= NB_ESCAPERS)) break;
				if ( (udg_escapers.get(i) != 0) ) {
 udg_escapers.get(i).stopAbsoluteSlideSpeed()
				}
				i = i + 1;
			}
 Text.P(escaper.getPlayer(), "slide speed for all depends now on terrains")
			return true;
		}
		if ((IsPlayerColorString(param1))) {
			if ( (udg_escapers.get(ColorString2Id(param1)) != 0) ) {
 udg_escapers.get(ColorString2Id(param1)).stopAbsoluteSlideSpeed()
 Text.P(escaper.getPlayer(), "slide speed for player " + param1 + " depends now on terrains")
			}
		}
		return true;
	}



	//-walkSpeed(ws) <speed>   --> changes the walk speed of your hero, ignoring terrains
	if ((name === "setWalkSpeed" || name === "ws")) {
		if ((!IsInteger(param1))) {
			return true;
		}
		speed = S2R(param1);
		if ((nbParam === 1)) {
 escaper.absoluteWalkSpeed(speed)
 Text.P(escaper.getPlayer(), "walk speed to " + param1)
			return true;
		}
		if ( (not(nbParam == 2 and escaper.isMaximaxou())) ) {
			return true;
		}
		if ((param2 === "all" || param2 === "a")) {
			i = 0;
			while (true) {
				if ((i >= NB_ESCAPERS)) break;
				if ( (udg_escapers.get(i) != 0) ) {
 udg_escapers.get(i).absoluteWalkSpeed(speed)
				}
				i = i + 1;
			}
 Text.P(escaper.getPlayer(), "walk speed for all to " + param1)
			return true;
		}
		if ((IsPlayerColorString(param2))) {
			if ( (udg_escapers.get(ColorString2Id(param2)) != 0) ) {
 udg_escapers.get(ColorString2Id(param2)).absoluteWalkSpeed(speed)
 Text.P(escaper.getPlayer(), "walk speed for player " + param2 + " to " + param1)
			}
		}
		return true;
	}


	//-normalWalkSpeed(nws)   --> puts the walk speed back to normal (respecting terrains)
	if ((name === "normalWalkSpeed" || name === "nws")) {
		if ((noParam)) {
 escaper.stopAbsoluteWalkSpeed()
 Text.P(escaper.getPlayer(), "walk speed depends now on terrains")
			return true;
		}
		if ( (not(nbParam == 1 and escaper.isMaximaxou())) ) {
			return true;
		}
		if ((param1 === "all" || param1 === "a")) {
			i = 0;
			while (true) {
				if ((i >= NB_ESCAPERS)) break;
				if ( (udg_escapers.get(i) != 0) ) {
 udg_escapers.get(i).stopAbsoluteWalkSpeed()
				}
				i = i + 1;
			}
 Text.P(escaper.getPlayer(), "walk speed for all depends now on terrains")
			return true;
		}
		if ((IsPlayerColorString(param1))) {
			if ( (udg_escapers.get(ColorString2Id(param1)) != 0) ) {
 udg_escapers.get(ColorString2Id(param1)).stopAbsoluteWalkSpeed()
 Text.P(escaper.getPlayer(), "walk speed for player " + param1 + " depends now on terrains")
			}
		}
		return true;
	}


	//-canTeleport(ct) <boolean canTeleport>   --> teleport trigger must have been enabled by the admin
	if ((name === "canTeleport" || name === "ct")) {
		if ((!IsBoolString(param1))) {
			return true;
		}
		b = S2B(param1);
		if ((nbParam === 1)) {
 ActivateTeleport(escaper.getHero(), false)
 ActivateTeleport(GetMirrorEscaper(escaper).getHero(), false)
			return true;
		}
		if ( (not(nbParam == 2 and escaper.isMaximaxou())) ) {
			return true;
		}
		if ((param2 === "all" || param2 === "a")) {
			i = 0;
			while (true) {
				if ((i >= NB_ESCAPERS)) break;
				if ( (udg_escapers.get(i) != 0) ) {
					if ((b)) {
 ActivateTeleport(udg_escapers.get(i).getHero(), false)
 ActivateTeleport(GetMirrorEscaper(udg_escapers.get(i)).getHero(), false)
					} else {
 DisableTeleport(udg_escapers.get(i).getHero())
 DisableTeleport(GetMirrorEscaper(udg_escapers.get(i)).getHero())
					}
				}
				i = i + 1;
			}
			return true;
		}
		if ((IsPlayerColorString(param2))) {
			if ( (udg_escapers.get(ColorString2Id(param2)) != 0) ) {
				if ((b)) {
 ActivateTeleport(udg_escapers.get(ColorString2Id(param2)).getHero(), false)
 ActivateTeleport(GetMirrorEscaper(udg_escapers.get(ColorString2Id(param2))).getHero(), false)
				} else {
 DisableTeleport(udg_escapers.get(ColorString2Id(param2)).getHero())
 DisableTeleport(GetMirrorEscaper(udg_escapers.get(ColorString2Id(param2))).getHero())
				}
			}
		}
		return true;
	}


	//-teleport(t)   --> teleports your hero at the next clic
	if ((name === "teleport" || name === "t") && (noParam || (nbParam === 1 && (param1 === "0" || S2R(param1) !== 0)))) {
		if ((nbParam === 1)) {
 SetUnitFacing(escaper.getHero(), S2R(param1))
 SetUnitFacing(GetMirrorEscaper(escaper).getHero(), S2R(param1))
		}
 ActivateTeleport(escaper.getHero(), true)
 ActivateTeleport(GetMirrorEscaper(escaper).getHero(), true)
		return true;
	}


	//-revive(r)   --> revives your hero
	if ((name === "revive" || name === "r")) {
		if ((noParam)) {
 escaper.reviveAtStart()
			return true;
		}
		if ( (not(nbParam == 1 and escaper.isMaximaxou())) ) {
			return true;
		}
		if ((param1 === "all" || param1 === "a")) {
			i = 0;
			while (true) {
				if ((i >= NB_ESCAPERS)) break;
				if ( (udg_escapers.get(i) != 0) ) {
 udg_escapers.get(i).reviveAtStart()
				}
				i = i + 1;
			}
			return true;
		}
		if ((IsPlayerColorString(param1))) {
			if ( (udg_escapers.get(ColorString2Id(param1)) != 0) ) {
 udg_escapers.get(ColorString2Id(param1)).reviveAtStart()
			}
		}
		return true;
	}


	//-reviveTo(rto) <Pcolor>   --> revives your hero to an other hero, with the same facing angle
	if ((name === "reviveTo" || name === "rto")) {
		if ((!(nbParam === 1 && IsPlayerColorString(param1)))) {
			return true;
		}
		n = ColorString2Id(param1);
		if ( (not udg_escapers.get(n).isAlive() or udg_escapers.get(n) == 0) ) {
			return true;
		}
 escaper.revive(GetUnitX(udg_escapers.get(n).getHero()), GetUnitY(udg_escapers.get(n).getHero()))
 escaper.turnInstantly(GetUnitFacing(udg_escapers.get(n).getHero()))
 GetMirrorEscaper(escaper).revive(GetUnitX(udg_escapers.get(n).getHero()), GetUnitY(udg_escapers.get(n).getHero()))
 GetMirrorEscaper(escaper).turnInstantly(GetUnitFacing(udg_escapers.get(n).getHero()))

		return true;
	}


	//-getInfiniteMeteors(gim)   --> puts in your inventory a meteor that doesn't disapear after being used
	if ((name === "getInfiniteMeteors" || name === "gim")) {
		if ((noParam)) {
			if ( (UnitItemInSlot(escaper.getHero(), 0) == null) ) {
 HeroAddCheatMeteor(escaper.getHero())
 Text.P(escaper.getPlayer(), "you get infinite meteors")
			} else {
 Text.erP(escaper.getPlayer(), "inventory full")
			}
		}
		return true;
	}


	//-deleteInfiniteMeteors(dim)   --> remove the infinite meteor from your inventory if you have one
	if ((name === "deleteInfiniteMeteors" || name === "dim")) {
		if ((noParam)) {
			if ( (GetItemTypeId(UnitItemInSlot(escaper.getHero(), 0)) == METEOR_CHEAT) ) {
 RemoveItem(UnitItemInSlot(escaper.getHero(), 0))
 Text.P(escaper.getPlayer(), "infinite meteors removed")
			} else {
 Text.erP(escaper.getPlayer(), "no infinite meteors to remove")
			}
		}
		return true;
	}


	//-endLevel(el)   --> go to the end of the current level
	if ((name === "endLevel" || name === "el")) {
		if ((noParam)) {
 udg_levels.goToNextLevel(0)
		}
		return true;
	}


	//-goToLevel(gotl) <levelId>   --> first level is number 0
	if ((name === "goToLevel" || name === "gotl")) {
		if ((!(nbParam === 1))) {
			return true;
		}
		if ((!FunctionsOnNumbers.IsPositiveInteger(param1))) {
 Text.erP(escaper.getPlayer(), "level number should be a positive integer")
			return true;
		}
		n = S2I(param1);
		if ( (udg_levels.getCurrentLevel().getId() == n) ) {
 Text.erP(escaper.getPlayer(), "you already are in this level")
			return true;
		}
		if ( (not udg_levels.goToLevel(0, n)) ) {
 Text.erP(escaper.getPlayer(), "this levels doesn't exist (level max : " + I2S(udg_levels.getLastLevelId()) + ")")
		}
		return true;
	}


	//-viewAll(va)   --> displays the whole map
	if ((name === "viewAll" || name === "va")) {
		if ((noParam)) {
			FogModifierStart(udg_viewAll)
		}
		return true;
	}


	//-hideAll(ha)   --> puts the map view back to normal
	if ((name === "hideAll" || name === "ha")) {
		if ((noParam)) {
			FogModifierStop(udg_viewAll)
		}
		return true;
	}


	//-setGodMode(setgm) <boolean status>   --> activate or desactivate god mode for your hero
	if ((name === "setGodMode" || name === "setgm")) {
		if ((!(nbParam === 1 || nbParam === 2))) {
 Text.erP(escaper.getPlayer(), "one or two params for this command")
			return true;
		}
		if ((IsBoolString(param1))) {
			b = S2B(param1);
		} else {
 Text.erP(escaper.getPlayer(), "param1 must be a boolean")
			return true;
		}
		if ((nbParam === 1)) {
 escaper.setGodMode(b)
			if ((b)) {
 Text.P(escaper.getPlayer(), "you are now invulnerable")
			} else {
 Text.P(escaper.getPlayer(), "you are now vulnerable")
			}
			return true;
		}
		if ( (not escaper.isMaximaxou()) ) {
 Text.erP(escaper.getPlayer(), "your rights are too weak")
			return true;
		}
		if ((param2 === "all" || param2 === "a")) {
			i = 0;
			while (true) {
				if ((i >= NB_ESCAPERS)) break;
				if ( (udg_escapers.get(i) != 0) ) {
 udg_escapers.get(i).setGodMode(b)
				}
				i = i + 1;
			}
			if ((b)) {
 Text.P(escaper.getPlayer(), "all sliders are now invulnerable")
			} else {
 Text.P(escaper.getPlayer(), "all sliders are now vulnerable")
			}
			return true;
		}
		if ((IsPlayerColorString(param2))) {
			n = ColorString2Id(param2);
			if ( (udg_escapers.get(n) != 0) ) {
 udg_escapers.get(n).setGodMode(b)
				if ((b)) {
 Text.P(escaper.getPlayer(), "slider " + param2 + " is now invulnerable")
				} else {
 Text.P(escaper.getPlayer(), "slider " + param2 + " is now vulnerable")
				}
			} else {
 Text.erP(escaper.getPlayer(), "escaper " + param2 + " doesn't exist")
			}
		} else {
 Text.erP(escaper.getPlayer(), "param2 must be a player color or \"all\"")
		}
		return true;
	}


	//-setGodModeKills(setgmk) <boolean status>   --> if activated, monsters will be killed by your hero
	if ((name === "setGodModeKills" || name === "setgmk")) {
		if ((!(nbParam === 1 || nbParam === 2))) {
 Text.erP(escaper.getPlayer(), "one or two params for this command")
			return true;
		}
		if ((IsBoolString(param1))) {
			b = S2B(param1);
		} else {
 Text.erP(escaper.getPlayer(), "param1 must be a boolean")
			return true;
		}
		if ((nbParam === 1)) {
 escaper.setGodModeKills(b)
			if ((b)) {
 Text.P(escaper.getPlayer(), "your god mode now kills monsters (if activated)")
			} else {
 Text.P(escaper.getPlayer(), "you god mode doesn't kill monsters anymore")
			}
			return true;
		}
		if ( (not escaper.isMaximaxou()) ) {
 Text.erP(escaper.getPlayer(), "your rights are too weak")
			return true;
		}
		if ((param2 === "all" || param2 === "a")) {
			i = 0;
			while (true) {
				if ((i >= NB_ESCAPERS)) break;
				if ( (udg_escapers.get(i) != 0) ) {
 udg_escapers.get(i).setGodModeKills(b)
				}
				i = i + 1;
			}
			if ((b)) {
 Text.P(escaper.getPlayer(), "god mode of all sliders now kills monsters (if activated)")
			} else {
 Text.P(escaper.getPlayer(), "god mode of all sliders doesn't kill monsters anymore")
			}
			return true;
		}
		if ((IsPlayerColorString(param2))) {
			n = ColorString2Id(param2);
			if ( (udg_escapers.get(n) != 0) ) {
 udg_escapers.get(n).setGodModeKills(b)
				if ((b)) {
 Text.P(escaper.getPlayer(), "god mode of slider " + param2 + " now kills monsters (if activated)")
				} else {
 Text.P(escaper.getPlayer(), "god mode of slider " + param2 + " doesn't kill monsters anymore")
				}
			} else {
 Text.erP(escaper.getPlayer(), "escaper " + param2 + " doesn't exist")
			}
		} else {
 Text.erP(escaper.getPlayer(), "param2 must be a player color or \"all\"")
		}
		return true;
	}


	//-setGravity(setg) x
	if ((name === "setGravity" || name === "setg")) {
		if ((!(nbParam === 1) || (S2R(param1) === 0 && param1 !== "0"))) {
			return true;
		}
		SetGravity(S2R(param1))
 Text.P(escaper.getPlayer(), "gravity changed")
		return true;
	}


	//-getGravity(getg)
	if ((name === "getGravity" || name === "getg")) {
		if ((noParam)) {
 Text.P(escaper.getPlayer(), "current gravity is " + R2S(GetRealGravity()))
		}
		return true;
	}


	//-setHeight(seth)
	if ((name === "setHeight" || name === "seth")) {
		if ((nbParam !== 1 || (S2R(param1) <= 0 && param1 !== "0"))) {
			return true;
		}
 SetUnitFlyHeight(escaper.getHero(), S2R(param1), 0)
 SetUnitFlyHeight(GetMirrorEscaper(escaper).getHero(), S2R(param1), 0)
		return true;
	}


	//-setTailleUnit(settu)
	if ((name === "setTailleUnit" || name === "settu")) {
		if ((nbParam !== 1 || (S2R(param1) <= 0 && param1 !== "0"))) {
			return true;
		}
		TAILLE_UNITE = S2R(param1);
		return true;
	}


	//-instantTurn
	if (name === "instantTurn" || name === "it") {
		if ((nbParam === 1 && IsBoolString(param1))) {
			if ( (escaper.isAbsoluteInstantTurn() != S2B(param1)) ) {
 escaper.setAbsoluteInstantTurn(S2B(param1))
				if ((S2B(param1))) {
 Text.P(escaper.getPlayer(), "instant turn on")
				} else {
 Text.P(escaper.getPlayer(), "instant turn off")
				}
			}
		}
		return true;
	}


	return false;
};




}
