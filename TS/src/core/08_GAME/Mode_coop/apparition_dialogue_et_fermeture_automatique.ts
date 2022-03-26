

const FermerDialogueAutomatiquement = (): void => {
	if ((!dialBoutonAppuye)) {
		DialogDisplay(udg_joueurDialogue, dialChoixModeCoop, false)
		if ((udg_coopModeActive)) {
			DisplayTextToForce(GetPlayersAll(), "coop mode automatically chosen")
		} else {
			DisplayTextToForce(GetPlayersAll(), "solo mode automatically chosen")
		}
	}
};



const Trig_apparition_dialogue_Actions = (): void => {
	//détermination du premier joueur
	let i = 0;
	while (true) {
		if ((GetPlayerController(Player(i)) === MAP_CONTROL_USER && GetPlayerSlotState(Player(i)) === PLAYER_SLOT_STATE_PLAYING) || i > 11) break;
		i = i + 1;
	}
	if ((i > 11)) {
		return;
	}
	udg_joueurDialogue = Player(i);
	DialogDisplay(udg_joueurDialogue, dialChoixModeCoop, true)
	dialBoutonAppuye = false;
	TimerStart(dialTimerTempLimite, DIAL_TIME_TO_ANSWER, false, FermerDialogueAutomatiquement)
};

//===========================================================================
const InitTrig_apparition_dialogue_et_fermeture_automatique = (): void => {
	gg_trg_apparition_dialogue_et_fermeture_automatique = CreateTrigger();
	TriggerRegisterTimerEventSingle(gg_trg_apparition_dialogue_et_fermeture_automatique, 1)
	TriggerAddAction(gg_trg_apparition_dialogue_et_fermeture_automatique, Trig_apparition_dialogue_Actions)
};

