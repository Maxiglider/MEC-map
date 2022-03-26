

const initAutoContinueAfterSliding = () => { // initializer Init_AutoContinueAfterSliding  //needs AddDelay



let lastClickedX: Array<number> = [];
let lastClickedY: Array<number> = [];
let lastClickedWidgets: Array<widget> = [];
let isLastTargetALocation: Array<boolean> = [];
let udg_autoContinueAfterSliding: Array<boolean> = [];

// TODO; Used to be private
const ECART_MAX_ANGLE = 45;


const AutoContinueAfterSliding = (n: number): void => {
	local unit hero = udg_escapers.get(n).getHero()
	//vérification de l'angle
	let angleHero2Target = Atan2(lastClickedY[n] - GetUnitY(hero), lastClickedX[n] - GetUnitX(hero)) * bj_RADTODEG;
	let diffAngle = RAbsBJ(angleHero2Target - GetUnitFacing(hero));
	if ((diffAngle > ECART_MAX_ANGLE && diffAngle < 360 - ECART_MAX_ANGLE)) {
		return;
	}

	//cas dernier clic : un point
	if ((isLastTargetALocation[n])) {
		IssuePointOrder(hero, "move", lastClickedX[n], lastClickedY[n])


		//cas dernier clic : pas un point
	} else {
		//dernier widget cliqué n'existe pas (donc aucun clic effectué pendant le slide)
		if ((lastClickedWidgets[n] === null)) {
			return;
		} else {
			//cible n'a pas bougé
			if ((GetWidgetX(lastClickedWidgets[n]) === lastClickedX[n] && GetWidgetY(lastClickedWidgets[n]) === lastClickedY[n])) {
				//ordre clic droit vers cible
				IssueTargetOrder(hero, "smart", lastClickedWidgets[n])
			} else {
				//bouger vers ancien endroit du widget
				IssuePointOrder(hero, "move", lastClickedX[n], lastClickedY[n])
			}
		}
	}
};


const ClearLastClickSave = (n: number): void => {
	isLastTargetALocation[ n ] = false;
	lastClickedWidgets[ n ] = null;
};


//===========================================================================
const Init_AutoContinueAfterSliding = (): void => {
	let i = 0;
	while (true) {
		if ((i >= NB_ESCAPERS)) break;
		udg_autoContinueAfterSliding[ i ] = true;
		i = i + 1;
	}
};


}
