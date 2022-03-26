const Trig_Forces_ally_Actions = (): void => {
	bj_forLoopAIndex = 1;
	bj_forLoopAIndexEnd = 11;
	while (true) {
		if (bj_forLoopAIndex > bj_forLoopAIndexEnd) break;
		SetPlayerAllianceStateBJ(Player(11), ConvertedPlayer(GetForLoopIndexA()), bj_ALLIANCE_ALLIED_VISION)
		SetPlayerAllianceStateBJ(ConvertedPlayer(GetForLoopIndexA()), Player(11), bj_ALLIANCE_ALLIED_VISION)
		bj_forLoopAIndex = bj_forLoopAIndex + 1;
	}
};

//===========================================================================
const InitTrig_Forces_ally = (): void => {
	gg_trg_Forces_ally = CreateTrigger();
	TriggerAddAction(gg_trg_Forces_ally, Trig_Forces_ally_Actions)
};

