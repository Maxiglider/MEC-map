

const initVisibilityModifier = () => { //


//struct VisibilityModifier //50 niveaux * 100 VM

// TODO; Used to be private
	 real x1
// TODO; Used to be private
	 real y1
// TODO; Used to be private
	 real x2
// TODO; Used to be private
	 real y2
// TODO; Used to be private
	 fogmodifier fm
    Level level
    integer arrayId
	
// TODO; Used to be static
	 


const create = (x1: number, y1: number, x2: number, y2: number): VisibilityModifier => {
	local VisibilityModifier vm = VisibilityModifier.allocate()
	let visionRect = Rect(x1, y1, x2, y2);
	vm.x1 = x1
	vm.y1 = y1
	vm.x2 = x2
	vm.y2 = y2
	vm.fm = CreateFogModifierRect(Player(0), FOG_OF_WAR_VISIBLE, visionRect, true, false)
	RemoveRect(visionRect)
	visionRect = null;
	RefreshHideAllVM()
	return vm;
};

// TODO; Used to be private
const onDestroy = (): void => {
	DestroyFogModifier(this.fm)
	this.fm = null;
 this.level.visibilities.setNull(this.arrayId)
};

const activate = (activ: boolean): void => {
	if ((activ)) {
		FogModifierStart(this.fm)
	} else {
		FogModifierStop(this.fm)
	}
};

const copy = (): VisibilityModifier => {
	return VisibilityModifier.create(this.x1, this.y1, this.x2, this.y2) 
};

const toString = (): string => {
	let x1 = I2S(R2I(this.x1));
	let y1 = I2S(R2I(this.y1));
	let x2 = I2S(R2I(this.x2));
	let y2 = I2S(R2I(this.y2));
	return (x1 + CACHE_SEPARATEUR_PARAM + y1 + CACHE_SEPARATEUR_PARAM + x2 + CACHE_SEPARATEUR_PARAM + y2);
};

//endstruct




}
