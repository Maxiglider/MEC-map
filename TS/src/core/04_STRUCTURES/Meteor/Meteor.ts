

const initMeteor = () => { //


const METEOR_NORMAL = FourCC("MND1");
const METEOR_CHEAT = FourCC("MCD1");



//struct Meteor //100 météores * 50 niveaux

// TODO; Used to be private
     real x
// TODO; Used to be private
     real y
// TODO; Used to be private
     item meteor
    Level level
    integer arrayId
    
    


const getItem = (): item => {
	return this.meteor;
};

// TODO; Used to be static
const create = (x: number, y: number): Meteor => {
	local Meteor m = Meteor.allocate()
	m.x = x
	m.y = y
	return m;
};

const removeMeteor = (): void => {
	if ((this.meteor !== null)) {
		RemoveItem(this.meteor)
		this.meteor = null;
	}
};

const createMeteor = (): void => {
	if ((this.meteor !== null)) {
		this.removeMeteor()
	}
	this.meteor = CreateItem(METEOR_NORMAL, this.x, this.y);
	if ( (udg_terrainTypes.getTerrainType(this.x, this.y).getKind() == "slide") ) {
		SetItemDroppable(this.meteor, false)
	}
 SetItemUserData(this.meteor, integer(this))
};

// TODO; Used to be private
const onDestroy = (): void => {
	if ((this.meteor !== null)) {
		this.removeMeteor()
		this.meteor = null;
	}
 this.level.meteors.setMeteorNull(this.arrayId)
};

const replace = (): void => {
	SetItemPosition(this.meteor, this.x, this.y)
};

const toString = (): string => {
	return (I2S(R2I(this.x)) + CACHE_SEPARATEUR_PARAM + I2S(R2I(this.y)));
};

//endstruct



}
