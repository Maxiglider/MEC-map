

let dialChoixModeCoop: dialog;
let btnChoixCoop: button;
let btnChoixSolo: button;
let dialBoutonAppuye: boolean;
const DIAL_TIME_TO_ANSWER = 10;
let udg_joueurDialogue: player;
let dialTimerTempLimite: timer;
let udg_coopModeActive = true;


const CreationDialogue_Actions = (): void => {
	dialChoixModeCoop = DialogCreate();
	dialTimerTempLimite = CreateTimer();
	DialogSetMessageBJ(dialChoixModeCoop, "Choose a game mode for everybody")
	btnChoixCoop = DialogAddButton(dialChoixModeCoop, "Coop (you can revive allies)", 0);
	btnChoixSolo = DialogAddButton(dialChoixModeCoop, "Solo", 0);
	TriggerRegisterDialogEventBJ(gg_trg_appui_sur_bouton_dialogue, dialChoixModeCoop)
};

const InitTrig_creation_dialogue = (): void => {
	gg_trg_creation_dialogue = CreateTrigger();
	TriggerAddAction(gg_trg_creation_dialogue, CreationDialogue_Actions)
	TriggerRegisterTimerEvent(gg_trg_creation_dialogue, 0, false)
};
