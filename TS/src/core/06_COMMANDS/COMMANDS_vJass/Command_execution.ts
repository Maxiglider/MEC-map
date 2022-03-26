

const initCommandExecution = () => { // initializer Init_Command_execution needs CommandAll, CommandRed, CommandCheat, CommandMake, CommandMax, CommandTrueMax




const ExecuteCommandSingle = (escaper: Escaper, cmd: string): void => {
	if ((!ExecuteCommandAll(escaper, cmd))) {
		if ( (not((escaper.getPlayer() == Player(0) and udg_areRedRightsOn) or escaper.canCheat())) ) {
 Text.erP(escaper.getPlayer(), "unknown command or not enough rights")
			return;
		}
		if ((!ExecuteCommandRed(escaper, cmd))) {
			if ( (not escaper.canCheat()) ) {
 Text.erP(escaper.getPlayer(), "unknown command or not enough rights")
				return;
			}
			if ((!ExecuteCommandCheat(escaper, cmd))) {
				if ((!ExecuteCommandMake(escaper, cmd))) {
					if ( (not escaper.isMaximaxou()) ) {
 Text.erP(escaper.getPlayer(), "unknown command or not enough rights")
						return;
					}
					if ((!ExecuteCommandMax(escaper, cmd))) {
						if ( (not escaper.isTrueMaximaxou()) ) {
 Text.erP(escaper.getPlayer(), "unknown command or not enough rights")
							return;
						}
						if ((!ExecuteCommandTrueMax(escaper, cmd))) {
 Text.erP(escaper.getPlayer(), "unknown command")
						}
					}
				}
			}
		}
	}
};


const ExecuteCommand = (escaper: Escaper, cmd: string): void => {
	let singleCommands: Array<string> = [];
	let char: string;
	let i: number;
	let nbParenthesesNonFermees = 0;
	let singleCommandId = 0;
	let charId: number;

	//ex : "-(abc def)" --> "-abc def"
	if ((SubStringBJ(cmd, 2, 2) === "(" && SubStringBJ(cmd, StringLength(cmd), StringLength(cmd)) === ")")) {
		cmd = SubStringBJ(cmd, 1, 1) + SubStringBJ(cmd, 3, StringLength(cmd) - 1);
	}

	charId = 2;
	while (true) {
		if ((charId > StringLength(cmd))) break;
		char = SubStringBJ(cmd, charId, charId);
		if ((char === ",")) {
			if ((nbParenthesesNonFermees <= 0)) {
				singleCommandId = singleCommandId + 1;
				charId = charId + 1;
			}
		} else {
			if ((char === "(")) {
				nbParenthesesNonFermees = nbParenthesesNonFermees + 1;
			} else {
				if ((char === ")")) {
					nbParenthesesNonFermees = nbParenthesesNonFermees - 1;
				}
			}
		}
		if ((char !== "," || nbParenthesesNonFermees > 0)) {
			singleCommands[ singleCommandId ] = singleCommands[singleCommandId] + char;
		}
		charId = charId + 1;
	}
	i = 0;
	while (true) {
		if ((i > singleCommandId)) break;
		if ((singleCommands[i] !== null && singleCommands[i] !== "")) {
			ExecuteCommandSingle(escaper, "-" + singleCommands[i])
		}
		i = i + 1;
	}
};


const Trig_Command_execution_Actions = (): void => {
	if ((!IsCmd(GetEventPlayerChatString()))) {
		return;
	}
 ExecuteCommand(udg_escapers.get(GetPlayerId(GetTriggerPlayer())), GetEventPlayerChatString())
};



//===========================================================================
const Init_Command_execution = (): void => {
	gg_trg_Command_execution = CreateTrigger();
	TriggerAddAction(gg_trg_Command_execution, Trig_Command_execution_Actions)
	TriggerRegisterPlayerChatEvent(gg_trg_Command_execution, Player(0), "-", false)
	TriggerRegisterPlayerChatEvent(gg_trg_Command_execution, Player(1), "-", false)
	TriggerRegisterPlayerChatEvent(gg_trg_Command_execution, Player(2), "-", false)
	TriggerRegisterPlayerChatEvent(gg_trg_Command_execution, Player(3), "-", false)
	TriggerRegisterPlayerChatEvent(gg_trg_Command_execution, Player(4), "-", false)
	TriggerRegisterPlayerChatEvent(gg_trg_Command_execution, Player(5), "-", false)
	TriggerRegisterPlayerChatEvent(gg_trg_Command_execution, Player(6), "-", false)
	TriggerRegisterPlayerChatEvent(gg_trg_Command_execution, Player(7), "-", false)
	TriggerRegisterPlayerChatEvent(gg_trg_Command_execution, Player(8), "-", false)
	TriggerRegisterPlayerChatEvent(gg_trg_Command_execution, Player(9), "-", false)
	TriggerRegisterPlayerChatEvent(gg_trg_Command_execution, Player(10), "-", false)
	TriggerRegisterPlayerChatEvent(gg_trg_Command_execution, Player(11), "-", false)
};



}

