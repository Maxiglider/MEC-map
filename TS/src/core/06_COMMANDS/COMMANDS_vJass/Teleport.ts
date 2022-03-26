const initTeleport = () => { // needs BasicFunctions


// TODO; Used to be private
let teleTriggers: Array<trigger> = [];
// TODO; Used to be private
let onceOnly: Array<boolean> = [];


const Teleport_Actions = (): void => {
	let hero = GetTriggerUnit();

	if ((!IsIssuedOrder("smart"))) {
		return;
	}
	StopUnit(hero)

	SetUnitX(hero, GetOrderPointX())
	SetUnitY(hero, GetOrderPointY())

	if ((onceOnly[GetUnitUserData(hero)])) {
		DestroyTrigger(GetTriggeringTrigger())
	}

	hero = null;
};



const ActivateTeleport = (hero: unit, onceOnlyB: boolean): void => {
	let escaperId = GetUnitUserData(hero);
	DestroyTrigger(teleTriggers[escaperId])
	teleTriggers[ escaperId ] = CreateTrigger();
	TriggerAddAction(teleTriggers[escaperId], Teleport_Actions)
	TriggerRegisterUnitEvent(teleTriggers[escaperId], hero, EVENT_UNIT_ISSUED_POINT_ORDER)
	onceOnly[ escaperId ] = onceOnlyB;
};



const DisableTeleport = (hero: unit): void => {
	let escaperId = GetUnitUserData(hero);
	DestroyTrigger(teleTriggers[escaperId])
};




}
