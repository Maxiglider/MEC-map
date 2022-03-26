

const Trig_a_player_leaves_Actions = (): void => {
	let n = GetPlayerId(GetTriggerPlayer());
 udg_escapers.remove(n)
	StopAfk(n)
	StopAfk(n + NB_PLAYERS_MAX)
	DisplayTextToForce(GetPlayersAll(), udg_colorCode[n] + "This is too difficult for " + GetPlayerName(GetTriggerPlayer()) + ", (s)he has left the game.")
	StartSound(gg_snd_noob)
	//NbPlayersMinimumThree_nbPlayers = NbPlayersMinimumThree_nbPlayers - 1
};



//===========================================================================
const InitTrig_A_player_leaves = (): void => {
	let i = 0;
	gg_trg_A_player_leaves = CreateTrigger();
	while (true) {
		if (i > 11) break;
		TriggerRegisterPlayerEventLeave(gg_trg_A_player_leaves, Player(i))
		i = i + 1;
	}
	TriggerAddAction(gg_trg_A_player_leaves, Trig_a_player_leaves_Actions)
};

