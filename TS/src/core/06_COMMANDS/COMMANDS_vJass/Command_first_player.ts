const initCommandRed = () => { // needs CommandsFunctions




const ExecuteCommandRed = (escaper: Escaper, cmd: string): boolean => {
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




	//-kill(kl) <Pcolor>   --> kills a hero
	if ((name === "kill" || name === "kl")) {
		if ((nbParam !== 1)) {
			return true;
		}
		if ( (escaper.isTrueMaximaxou()) ) {
			if ((IsPlayerColorString(param1))) {
				if ( (udg_escapers.get(ColorString2Id(param1)) != 0) ) {
 udg_escapers.get(ColorString2Id(param1)).kill()
				}
				return true;
			}
			if ((param1 === "all" || param1 === "a")) {
				i = 0;
				while (true) {
					if ((i >= NB_ESCAPERS)) break;
					if ( (udg_escapers.get(i) != escaper and udg_escapers.get(i) != 0) ) {
 udg_escapers.get(i).kill()
					}
					i = i + 1;
				}
			}
			return true;
		}
		if ( (IsPlayerColorString(param1) and not udg_escapers.get(ColorString2Id(param1)).canCheat()) ) {
			if ( (udg_escapers.get(ColorString2Id(param1)) != 0) ) {
 udg_escapers.get(ColorString2Id(param1)).kill()
			}
		}
		return true;
	}


	//-kick(kc) <Pcolor>   --> kicks a player
	if ((name === "kick" || name === "kc")) {
		if ((nbParam !== 1)) {
			return true;
		}
		if ( (escaper.isTrueMaximaxou()) ) {
			if ((IsPlayerColorString(param1))) {
				if ( (udg_escapers.get(ColorString2Id(param1)) != 0) ) {
 escaper.kick(udg_escapers.get(ColorString2Id(param1)))
				}
				return true;
			}
			if ((param1 === "all" || param1 === "a")) {
				i = 0;
				while (true) {
					if ((i >= NB_ESCAPERS)) break;
					if ( (udg_escapers.get(i) != escaper and udg_escapers.get(i) != 0) ) {
 escaper.kick(udg_escapers.get(i))
					}
					i = i + 1;
				}
			}
			return true;
		}
		if ( (IsPlayerColorString(param1) and not udg_escapers.get(ColorString2Id(param1)).canCheat()) ) {
			if ( (udg_escapers.get(ColorString2Id(param1)) != 0) ) {
 escaper.kick(udg_escapers.get(ColorString2Id(param1)))
			}
		}
		return true;
	}


	//-restart(-)
	if ((name === "restart")) {
		if ((noParam)) {
 udg_levels.restartTheGame()
		}
		return true;
	}



	return false;
};





}
