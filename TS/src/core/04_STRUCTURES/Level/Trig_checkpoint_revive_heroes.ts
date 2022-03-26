

const initTrigCheckpointReviveHeroes = () => { // initializer Init_Trig_checkpoint_revive_heroes needs ChangeAllTerrains


// TODO; Used to be public
let levelForReviving: Level;
// TODO; Used to be public
let revivingFinisher: Escaper;



const Trig_Trig_checkpoint_revive_heroes_Actions = (): void => {
	let l = levelForReviving;
	let finisher = revivingFinisher;
	let escaper: Escaper;
	let i = 0;
	while (true) {
		if ((i >= NB_ESCAPERS)) break;
		escaper = udg_escapers.get(i)
		if ((escaper !== 0 && escaper !== finisher)) {
			if ( (not escaper.reviveAtStart()) ) {
 escaper.moveHero(l.getStartRandomX(), l.getStartRandomY())
 StopUnit(escaper.getHero())
 escaper.pause(true)
 escaper.setLastZ(0)
 escaper.setOldDiffZ(0)
 escaper.setSpeedZ(0)
			}
 SetUnitFlyHeight(escaper.getHero(), 0, 0)
 escaper.enableSlide(false)
		}
		i = i + 1;
	}
	TriggerSleepAction(1)
	i = 0;
	while (true) {
		if ((i >= NB_ESCAPERS)) break;
		escaper = udg_escapers.get(i)
		if ((escaper !== 0 && escaper !== finisher)) {
 escaper.pause(false)
		}
		i = i + 1;
	}
	if ((udg_changeAllTerrainsAtRevive)) {
 TriggerSleepAction(1.00)
		ChangeAllTerrains("normal")
	}
};

//===========================================================================
const Init_Trig_checkpoint_revive_heroes = (): void => {
	gg_trg____Trig_checkpoint_revive_heroes = CreateTrigger();
	TriggerAddAction(gg_trg____Trig_checkpoint_revive_heroes, Trig_Trig_checkpoint_revive_heroes_Actions)
};


}

