const initCommandTrueMax = () => { // needs CommandsFunctions




const ExecuteCommandTrueMax = (escaper: Escaper, cmd: string): boolean => {
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




	//-beAdmin <Pcolor>|all(a) [<boolean status>]
	if ((name === "beAdmin")) {
		if ((!(nbParam === 1 || nbParam === 2))) {
 Text.erP(escaper.getPlayer(), "one or two params for this command")
			return true;
		}
		if ((nbParam === 2)) {
			if ((IsBoolString(param2))) {
				b = S2B(param2);
			} else {
 Text.erP(escaper.getPlayer(), "param2 must be a boolean")
				return true;
			}
		} else {
			b = true;
		}
		if ((param1 === "all" || param1 === "a")) {
			i = 0;
			while (true) {
				if ((i >= NB_ESCAPERS)) break;
				if ( (udg_escapers.get(i) != 0 and udg_escapers.get(i) != escaper) ) {
 udg_escapers.get(i).setIsMaximaxou(b)
				}
				i = i + 1;
			}
			if ((b)) {
 Text.P(escaper.getPlayer(), "all players have now admin rights")
			} else {
 Text.P(escaper.getPlayer(), "you are now the only one to have admin rights")
			}
			return true;
		}
		if ((IsPlayerColorString(param1))) {
			n = ColorString2Id(param1);
			if ( (udg_escapers.get(n) != 0) ) {
				if ( (udg_escapers.get(n) != escaper) ) {
 udg_escapers.get(n).setIsMaximaxou(b)
					if ((b)) {
 Text.P(escaper.getPlayer(), "player " + param1 + " has now admin rights")
					} else {
 Text.P(escaper.getPlayer(), "player " + param1 + " no longer has admin rights")
					}
				} else {
 Text.erP(escaper.getPlayer(), "you can't change your own rights")
				}
			} else {
 Text.erP(escaper.getPlayer(), "escaper " + param1 + " doesn't exist")
			}
		} else {
 Text.erP(escaper.getPlayer(), "param1 must be a player color or \"all\"")
		}
		return true;
	}



	return false;
};





}
