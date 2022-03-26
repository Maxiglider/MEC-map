

let udg_gameIsLost = false;


const Trig_Lose_a_life_and_res_Actions = (): void => {
	let i: number;
 udg_lives.loseALife()
	if ( (udg_lives.get() < 0) ) {
		if ((!udg_gameIsLost)) {
			udg_gameIsLost = true;
			DisplayTextToForce(GetPlayersAll(), "You have no more lives !")
			TriggerSleepAction(2)
			DisplayTextToForce(GetPlayersAll(), "The game will restart in 10 seconds.")
 TriggerSleepAction( 10.00 )
 udg_levels.restartTheGame()
			udg_gameIsLost = false;
		}
	} else {
		if ((udg_changeAllTerrainsAtRevive)) {
 TriggerSleepAction( 6.00 )
			ChangeAllTerrains("normal")
 TriggerSleepAction( 2.00 )
		} else {
 TriggerSleepAction( 8.00 )
		}
		i = 0;
		while (true) {
			if ((i >= NB_ESCAPERS)) break;
			if ( (udg_escapers.get(i) != 0) ) {
 udg_escapers.get(i).reviveAtStart()
			}
			i = i + 1;
		}
		Text_A("|cff5c2e2eYou have lost a life !")
		//AnticheatTeleport_justRevived = true
	}
};

//===========================================================================
const InitTrig_Lose_a_life_and_res = (): void => {
	gg_trg_Lose_a_life_and_res = CreateTrigger();
	TriggerAddAction(gg_trg_Lose_a_life_and_res, Trig_Lose_a_life_and_res_Actions)
};

