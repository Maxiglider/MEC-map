

const TrigAppuiBoutonDialogue_Actions = (): void => {
	udg_coopModeActive = GetClickedButton() === btnChoixCoop;
	dialBoutonAppuye = true;
	if ((udg_coopModeActive)) {
		DisplayTextToForce(GetPlayersAll(), "coop mode chosen by first player")
	} else {
		DisplayTextToForce(GetPlayersAll(), "solo mode chosen by first player")
	}
};





const InitTrig_appui_sur_bouton_dialogue = (): void => {
	gg_trg_appui_sur_bouton_dialogue = CreateTrigger();
	//évènement défini dans le trigger "creation dialogue"
	TriggerAddAction(gg_trg_appui_sur_bouton_dialogue, TrigAppuiBoutonDialogue_Actions)
};
