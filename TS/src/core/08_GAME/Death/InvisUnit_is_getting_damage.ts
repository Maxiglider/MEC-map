

//évènement ajouté à la création de l'unité invisible


let TAILLE_UNITE = 100;


const Trig_invisUnit_dies_Actions = (): void => {
	let invisUnit = GetTriggerUnit();
	let n = GetUnitUserData(invisUnit);
	local Escaper escaper = udg_escapers.get(n)
	let killingUnit = GetEventDamageSource();
	let clearMob: ClearMob;
	let moc: MonsterOrCaster;
	let effectStr: string;
	let eff: effect;
	let x: number;
	let y: number;
	local location heroPos = GetUnitLoc(escaper.getHero())
	local real hauteurHero = GetLocationZ(heroPos) + GetUnitFlyHeight(escaper.getHero())
	let killingUnitPos = GetUnitLoc(killingUnit);
	let hauteurKillingUnit = GetLocationZ(killingUnitPos) + GetUnitFlyHeight(killingUnit);

	RemoveLocation(heroPos)
	RemoveLocation(killingUnitPos)
	heroPos = null;
	killingUnitPos = null;
	if ( (not escaper.isAlive()) ) {
		invisUnit = null;
		killingUnit = null;
		return;
	}


	if ((RAbsBJ(hauteurHero - hauteurKillingUnit) < TAILLE_UNITE)) {
		if ((GetUnitTypeId(killingUnit) === DUMMY_POWER_CIRCLE)) {
 udg_escapers.get(GetUnitUserData(killingUnit)).coopReviveHero()
			invisUnit = null;
			killingUnit = null;
			return;
		} else {
			clearMob = ClearTriggerMobId2ClearMob(GetUnitUserData(killingUnit));
			if ((clearMob !== 0)) {
 clearMob.activate()
				} else if ( (escaper.isGodModeOn()) ) {
				if ( (escaper.doesGodModeKills()) ) {
					if ((GetUnitUserData(killingUnit) !== 0)) {
						moc = MonsterOrCaster.create(GetUnitUserData(killingUnit))
 moc.killUnit() //on ne tue pas directement le monstre, pour pouvoir exécuter des actions secondaires
 moc.destroy()
					} else {
						KillUnit(killingUnit)
					}
				}
				x = GetUnitX(killingUnit);
				y = GetUnitY(killingUnit);
				eff = AddSpecialEffect(GM_KILLING_EFFECT, x, y);
				DestroyEffect(eff)
				eff = null;
				invisUnit = null;
				killingUnit = null;
				return;
			}
			if ( (not escaper.isCoopInvul()) ) {
 escaper.kill()

				//effet de tuation du héros par le monstre, suivant le type du monstre
				effectStr = udg_monsterTypes.monsterUnit2KillEffectStr(killingUnit)
				if ((effectStr !== null)) {
					x = GetUnitX(invisUnit);
					y = GetUnitY(invisUnit);
					eff = AddSpecialEffect(effectStr, x, y);
					TriggerSleepAction(3)
					DestroyEffect(eff)
					eff = null;
				}
			}
		}
	}

	invisUnit = null;
	killingUnit = null;
};

//===========================================================================
const InitTrig_InvisUnit_is_getting_damage = (): void => {
	gg_trg_InvisUnit_is_getting_damage = CreateTrigger();
	TriggerAddAction(gg_trg_InvisUnit_is_getting_damage, Trig_invisUnit_dies_Actions)
};

