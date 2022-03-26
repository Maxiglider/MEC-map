

const initCaster = () => { // initializer InitCaster needs MonsterCreationFunctions, CasterFunctions, MonsterInterface, ClearMob


// TODO; Used to be public
let casterHashtable: hashtable;




//struct Caster //12 escapers * 50 niveaux * 500 monstres

// TODO; Used to be private
     integer id
    Level level
    integer arrayId
// TODO; Used to be private
     CasterType casterType
// TODO; Used to be private
     real x
// TODO; Used to be private
     real y
// TODO; Used to be private
     real angle
// TODO; Used to be private
     timer disablingTimer
    //color
// TODO; Used to be private
     integer baseColorId
// TODO; Used to be private
     real vcRed
// TODO; Used to be private
     real vcGreen
// TODO; Used to be private
     real vcBlue
// TODO; Used to be private
     real vcTransparency
    
    unit casterUnit
// TODO; Used to be private
     trigger trg_unitWithinRange
    Escaper array escapersInRange [NB_ESCAPERS]
    integer nbEscapersInRange
    boolean canShoot
    timer t
// TODO; Used to be private
     boolean enabled
    
    


const isEnabled = (): boolean => {
	return this.enabled;
};

const getId = (): number => {
	return this.id;
};

const setId = (id: number): Caster => {
	if ((id === this.id)) {
		return _this;
	}
	CasterHashtableSetCasterId(_this, this.id, id)
	this.id = id;
	MonsterIdHasBeenSetTo(id)
	return _this;
};

const getX = (): number => {
	return this.x;
};

const getY = (): number => {
	return this.y;
};

const getRange = (): number => {
	return this.casterType.getRange()
};

const getProjectileSpeed = (): number => {
	return this.casterType.getProjectileSpeed()
};

const getCasterUnit = (): unit => {
	return this.casterUnit;
};

const getProjectileMonsterType = (): MonsterType => {
	return this.casterType.getProjectileMonsterType()
};

const getLoadTime = (): number => {
	return this.casterType.getLoadTime()
};

const getCasterType = (): CasterType => {
	return this.casterType;
};

const getAnimation = (): string => {
	return this.casterType.getAnimation()
};


// TODO; Used to be static
const create = (casterType: CasterType, x: number, y: number, angle: number): Caster => {
	local Caster c = Caster.allocate()
	c.casterType = casterType
	c.x = x
	c.y = y
	c.angle = angle
	c.id = GetNextMonsterId()
 CasterHashtableSetCasterId(c, NO_ID, c.id)
	c.disablingTimer = null
	//color
	c.baseColorId = -1
	c.vcRed = 100
	c.vcGreen = 100
	c.vcBlue = 100
	c.vcTransparency = 0
	return c;
};


const enable = (): void => {
	this.nbEscapersInRange = 0;
	this.canShoot = true;
	this.casterUnit = NewImmobileMonster(this.casterType.getCasterMonsterType(), this.x, this.y, this.angle)
	SetUnitUserData(this.casterUnit, this.id)
	this.trg_unitWithinRange = CreateTrigger();
 TriggerRegisterUnitInRangeSimple(this.trg_unitWithinRange, this.casterType.getRange(), this.casterUnit)
	TriggerAddAction(this.trg_unitWithinRange, CasterUnitWithinRange_Actions)
 SaveInteger(casterHashtable, 0, GetHandleId(this.trg_unitWithinRange), integer(this))
	this.t = CreateTimer();
 SaveInteger(casterHashtable, 1, GetHandleId(this.t), integer(this))
	this.enabled = true;
};

const disable = (): void => {
	RemoveSavedInteger(casterHashtable, 0, GetHandleId(this.trg_unitWithinRange))
	DestroyTrigger(this.trg_unitWithinRange)
	this.trg_unitWithinRange = null;
	RemoveUnit(this.casterUnit)
	this.casterUnit = null;
	RemoveSavedInteger(casterHashtable, 1, GetHandleId(this.t))
	DestroyTimer(this.t)
	this.t = null;
	this.disablingTimer = null;
};

const killUnit = (): void => {
	KillUnit(this.casterUnit)
	RemoveSavedInteger(casterHashtable, 0, GetHandleId(this.trg_unitWithinRange))
	DestroyTrigger(this.trg_unitWithinRange)
	this.trg_unitWithinRange = null;
	RemoveSavedInteger(casterHashtable, 1, GetHandleId(this.t))
	DestroyTimer(this.t)
	this.t = null;
};

const refresh = (): void => {
	let clearMob = ClearTriggerMobId2ClearMob(this.id);
	let disablingTimer = this.disablingTimer;
	let isCasterAlive = IsUnitAliveBJ(this.casterUnit);
	if ((this.casterUnit !== null)) {
		this.disable()
		this.enable()
		if ((disablingTimer !== null && TimerGetRemaining(disablingTimer) > 0)) {
			this.temporarilyDisable(disablingTimer)
		}
		if ((!isCasterAlive)) {
			this.killUnit()
		}
		if ((this.baseColorId !== -1)) {
			if ((this.baseColorId === 0)) {
				SetUnitColor(this.casterUnit, PLAYER_COLOR_RED)
			} else {
				SetUnitColor(this.casterUnit, ConvertPlayerColor(this.baseColorId))
			}
		}
		SetUnitVertexColorBJ(this.casterUnit, this.vcRed, this.vcGreen, this.vcBlue, this.vcTransparency)
	}
	if ((clearMob !== 0)) {
 clearMob.redoTriggerMobPermanentEffect()
	}
	disablingTimer = null;
};

const onDestroy = (): void => {
	this.disable()
 this.level.casters.setCasterNull(this.arrayId)
	if ((ClearTriggerMobId2ClearMob(this.id) !== 0)) {
 ClearTriggerMobId2ClearMob(this.id).destroy()
	}
	CasterHashtableRemoveCasterId(this.id)
};

const escaperOutOfRangeOrDead = (escaper: Escaper): void => {
	let i = 0;
	while (true) {
		if ((escaper === this.escapersInRange[i] || i === this.nbEscapersInRange)) break;
		i = i + 1;
	}
	if ((i < this.nbEscapersInRange)) {
		while (true) {
			if ((i === this.nbEscapersInRange - 1)) break;
			this.escapersInRange[ i ] = this.escapersInRange[i + 1];
			i = i + 1;
		}
		this.nbEscapersInRange = this.nbEscapersInRange - 1;
	}
};

const temporarilyDisable = (disablingTimer: timer): void => {
	if ((this.disablingTimer === null || this.disablingTimer === disablingTimer || TimerGetRemaining(disablingTimer) > TimerGetRemaining(this.disablingTimer))) {
		this.disablingTimer = disablingTimer;
 UnitRemoveAbility(this.casterUnit, this.casterType.getCasterMonsterType().getImmolationSkill())
		SetUnitVertexColorBJ(this.casterUnit, this.vcRed, this.vcGreen, this.vcBlue, DISABLE_TRANSPARENCY)
		this.vcTransparency = DISABLE_TRANSPARENCY;
		this.enabled = false;
	}
};

const temporarilyEnable = (disablingTimer: timer): void => {
	if ((this.disablingTimer === disablingTimer)) {
 UnitAddAbility(this.casterUnit, this.casterType.getCasterMonsterType().getImmolationSkill())
		SetUnitVertexColorBJ(this.casterUnit, this.vcRed, this.vcGreen, this.vcBlue, 0)
		this.vcTransparency = 0;
		this.enabled = true;
	}
};

const setBaseColor = (colorString: string): void => {
	let baseColorId: number;
	if ((IsColorString(colorString))) {
		baseColorId = ColorString2Id(colorString);
		if ((baseColorId < 0 || baseColorId > 12)) {
			return;
		}
		this.baseColorId = baseColorId;
		if ((this.casterUnit !== null)) {
			if ((baseColorId === 0)) {
				SetUnitColor(this.casterUnit, PLAYER_COLOR_RED)
			} else {
				SetUnitColor(this.casterUnit, ConvertPlayerColor(baseColorId))
			}
		}
	}
};

const setVertexColor = (vcRed: number, vcGreen: number, vcBlue: number): void => {
	this.vcRed = vcRed;
	this.vcGreen = vcGreen;
	this.vcBlue = vcBlue;
	if ((this.casterUnit !== null)) {
		SetUnitVertexColorBJ(this.casterUnit, vcRed, vcGreen, vcBlue, this.vcTransparency)
	}
};

const reinitColor = (): void => {
	let initBaseColorId: number;
	//changement valeurs des champs
	this.baseColorId = -1;
	this.vcRed = 100;
	this.vcGreen = 100;
	this.vcBlue = 100;
	this.vcTransparency = 0;
	//changement couleur du mob actuel
	if ((this.casterUnit !== null)) {
		if ((MOBS_VARIOUS_COLORS)) {
			initBaseColorId = GetPlayerId(GetOwningPlayer(this.casterUnit));
		} else {
			initBaseColorId = 12;
		}
		if ((initBaseColorId === 0)) {
			SetUnitColor(this.casterUnit, PLAYER_COLOR_RED)
		} else {
			SetUnitColor(this.casterUnit, ConvertPlayerColor(initBaseColorId))
		}
		SetUnitVertexColorBJ(this.casterUnit, this.vcRed, this.vcGreen, this.vcBlue, this.vcTransparency)
	}
};

const toString = (): string => {
	let str: string;
	if ( (this.casterType.theAlias != null and this.casterType.theAlias != "") ) {
		str = this.casterType.theAlias + CACHE_SEPARATEUR_PARAM
	} else {
		str = this.casterType.label + CACHE_SEPARATEUR_PARAM
	}
	str = str + I2S(this.id) + CACHE_SEPARATEUR_PARAM + I2S(R2I(this.x)) + CACHE_SEPARATEUR_PARAM + I2S(R2I(this.y));
	str = str + CACHE_SEPARATEUR_PARAM + I2S(R2I(this.angle));
	return str;
};

//endstruct



const InitCaster = (): void => {
	casterHashtable = InitHashtable();
};

}
