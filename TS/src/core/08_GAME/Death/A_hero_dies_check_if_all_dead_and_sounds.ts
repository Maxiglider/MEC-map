

let udg_nbKilled = 0;


const Trig_a_hero_dies_Conditions = (): boolean => {
	return IsHero(GetTriggerUnit());
};


const Trig_a_hero_dies_Actions = (): void => {
	let hero = GetTriggerUnit();
	let n = GetUnitUserData(hero);
	let nbAlive = 0;
	let last = false;
	let i: number;
	let diffX: number;
	let diffY: number;

	udg_nbKilled = udg_nbKilled + 1;
	if ((udg_nbKilled === 3 && udg_tripleKillSoundOn)) {
		StartSound(gg_snd_multisquish)
		udg_nbKilled = 0;
	}

	i = 0;
	while (true) {
		if ((i >= NB_ESCAPERS)) break;
		if ( (udg_escapers.get(i).isAlive()) ) {
			nbAlive = nbAlive + 1;
		}
		i = i + 1;
	}

	if ((nbAlive === 0)) {
		TriggerExecute(gg_trg_Lose_a_life_and_res)
		TriggerSleepAction(2)
		StartSound(gg_snd_questFailed)
		last = true;
	} else {
		if ((nbAlive === 1)) {
			StartSound(gg_snd_warning)
		}
	}

	if ((isAfk[n])) {
		DestroyTextTag(afkModeTextTags[n])
	} else {
		PauseTimer(afkModeTimers[n])
	}

	if ((AreAllAliveHeroesAfk())) {
		KillAllHeroesAfkInFiveSeconds()
	}

	if ((last)) {
		TriggerSleepAction(3)
	} else {
		//coop
		if ((udg_coopModeActive)) {
 TriggerSleepAction( 1.3 )

			//si héros déjà vivant, inutile de le ressuciter
			if ((IsUnitAliveBJ(hero))) {
 TriggerSleepAction(3.7)
				udg_nbKilled = udg_nbKilled - 1;
				return;
			}

			//déplacement du héros si mort sur le death path
			if ( (udg_terrainTypes.getTerrainType(GetUnitX(hero), GetUnitY(hero)).getKind() == "death") ) {
				DeplacementHeroHorsDeathPath(hero)
			}

			//revive si autre héros (vivant) au même endroit
			i = 0;
			while (true) {
				if (i >= NB_ESCAPERS) break;
				if ( (i != n and udg_escapers.get(i).isAlive()) ) {
					diffX = GetUnitX(udg_escapers.get(i).getHero()) - GetUnitX(hero)
					diffY = GetUnitY(udg_escapers.get(i).getHero()) - GetUnitY(hero)
					if ((SquareRoot(diffX * diffX + diffY * diffY) < COOP_REVIVE_DIST)) {
 udg_escapers.get(n).coopReviveHero()
 TriggerSleepAction(3.7)
						udg_nbKilled = udg_nbKilled - 1;
						return;
					}
				}
				i = i + 1;
			}
 udg_escapers.get(n).enableTrigCoopRevive()
 TriggerSleepAction(3.7)
		} else {
			TriggerSleepAction(5)
		}
	}

	SetUnitAnimation(hero, "stand")
	udg_nbKilled = udg_nbKilled - 1;
};

//===========================================================================
const InitTrig_A_hero_dies_check_if_all_dead_and_sounds = (): void => {
	gg_trg_A_hero_dies_check_if_all_dead_and_sounds = CreateTrigger();
	TriggerRegisterAnyUnitEventBJ(gg_trg_A_hero_dies_check_if_all_dead_and_sounds, EVENT_PLAYER_UNIT_DEATH)
	TriggerAddCondition(gg_trg_A_hero_dies_check_if_all_dead_and_sounds, Condition(Trig_a_hero_dies_Conditions))
	TriggerAddAction(gg_trg_A_hero_dies_check_if_all_dead_and_sounds, Trig_a_hero_dies_Actions)
};

