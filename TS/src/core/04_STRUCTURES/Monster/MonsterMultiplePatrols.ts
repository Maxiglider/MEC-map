

const initMonsterMultiplePatrols = () => { // needs MonsterInterface //extends Monster



// TODO; Used to be private
const NewRegion = (x: number, y: number): region => {
	let r = Rect(x - 16, y - 16, x + 16, y + 16);
	let R = CreateRegion();
	RegionAddRect(R, r)
	RemoveRect(r)
	r = null;
	return R;
};

const MonsterMultiplePatrols_move_Actions = (): void => {
	let monster: Monster;
	let MMP: MonsterMultiplePatrols;
	if ((IsHero(GetTriggerUnit()))) {
		return;
	}
	monster = MonsterId2Monster(GetUnitUserData(GetTriggerUnit()));
	if ( (monster.getType() == MonsterMultiplePatrols.typeid) ) {
		        MMP = MonsterMultiplePatrols(integer(monster))
		if ( (MMP.getCurrentTrigger() == GetTriggeringTrigger()) ) {
 MMP.nextMove()
		}
	}
};
//===========================================================






}


class MonsterMultiplePatrols { // extends Monster

	// TODO; Used to be static
		 integer NB_MAX_LOC = 20  
	// TODO; Used to be static
		 integer nbInstances = 0 
	// TODO; Used to be static
		 real array X
	// TODO; Used to be static
		 real array Y
	// TODO; Used to be static
		 integer staticLastLocInd = -1
		
	
	
	// TODO; Used to be private
		 integer id
		unit u
	// TODO; Used to be private
		 MonsterType mt
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
		
	// TODO; Used to be private
		 integer lastLocInd
	// TODO; Used to be private
		 integer currentMove
	// TODO; Used to be private
		 integer sens //0 : normal toujours positif, 1 : sens normal avec changement, 2 : sens inversé avec changement
		
		//! textmacro MMP_Variables takes N
	// TODO; Used to be private
		 real x$N$
	// TODO; Used to be private
		 real y$N$
	// TODO; Used to be private
		 region r$N$
		trigger t$N$
		//! endtextmacro
		//! runtextmacro MMP_Variables( "0"  )
		//! runtextmacro MMP_Variables( "1"  )
		//! runtextmacro MMP_Variables( "2"  )
		//! runtextmacro MMP_Variables( "3"  )
		//! runtextmacro MMP_Variables( "4"  )
		//! runtextmacro MMP_Variables( "5"  )
		//! runtextmacro MMP_Variables( "6"  )
		//! runtextmacro MMP_Variables( "7"  )
		//! runtextmacro MMP_Variables( "8"  )
		//! runtextmacro MMP_Variables( "9"  )
		//! runtextmacro MMP_Variables( "10" )
		//! runtextmacro MMP_Variables( "11" )
		//! runtextmacro MMP_Variables( "12" )
		//! runtextmacro MMP_Variables( "13" )
		//! runtextmacro MMP_Variables( "14" )
		//! runtextmacro MMP_Variables( "15" )
		//! runtextmacro MMP_Variables( "16" )
		//! runtextmacro MMP_Variables( "17" )
		//! runtextmacro MMP_Variables( "18" )
		//! runtextmacro MMP_Variables( "19" )
		trigger currentTrigger
	
	
	
	// TODO; Used to be static
		 
	
	
	count = (): number => {
		return MonsterMultiplePatrols.nbInstances
	};
	
	// TODO; Used to be static
	storeNewLoc = (x: number, y: number): boolean => {
		// TODO; Used to be static
		if ( (MonsterMultiplePatrols.LastLocInd >= MonsterMultiplePatrols.NB_MAX_LOC - 1) ) {
			return false;
		}
		// TODO; Used to be static
		MonsterMultiplePatrols.LastLocInd = MonsterMultiplePatrols.staticLastLocInd + 1
		// TODO; Used to be static
		MonsterMultiplePatrols.X[MonsterMultiplePatrols.LastLocInd] = x
		// TODO; Used to be static
		MonsterMultiplePatrols.Y[MonsterMultiplePatrols.LastLocInd] = y	
		return true;
	};
	
	// TODO; Used to be static
	destroyLocs = (): void => {
		// TODO; Used to be static
		MonsterMultiplePatrols.LastLocInd = -1
	};
	
	
	
	
	getId = (): number => {
		return this.id;
	};
	
	setId = (id: number): MonsterMultiplePatrols => {
		if ((id === this.id)) {
			return _this;
		}
		MonsterHashtableSetMonsterId(_this, this.id, id)
		this.id = id;
		MonsterIdHasBeenSetTo(id)
		return _this;
	};
	
	getCurrentTrigger = (): trigger => {
		return this.currentTrigger;
	};
	
	removeUnit = (): void => {
		if ((this.u !== null)) {
			GroupRemoveUnit(monstersClickable, this.u)
			RemoveUnit(this.u)
			this.u = null;
		}
	};
	
	killUnit = (): void => {
		if ((this.u !== null && IsUnitAliveBJ(this.u))) {
			KillUnit(this.u)
		}
	};
	
	// TODO; Used to be private
	onDestroy = (): void => {
		while (true) {
			if ((!this.destroyLastLoc())) break;
		}
		if ((this.u !== null)) {
			this.removeUnit()
		}
	 this.level.monstersMultiplePatrols.setMonsterNull(this.arrayId)
		MonsterMultiplePatrols.nbInstances = MonsterMultiplePatrols.nbInstances - 1
		if ((ClearTriggerMobId2ClearMob(this.id) !== 0)) {
	 ClearTriggerMobId2ClearMob(this.id).destroy()
		}
		MonsterHashtableRemoveMonsterId(this.id)
	};
	
	disableTrigger = (id: number): void => {
		//! textmacro MMP_disableTrigger takes N
		if ((id === $N$)) {
			DisableTrigger(this.t$N$)
			return;
		}
		//! endtextmacro
		//! runtextmacro MMP_disableTrigger( "0"  )
		//! runtextmacro MMP_disableTrigger( "1"  )
		//! runtextmacro MMP_disableTrigger( "2"  )
		//! runtextmacro MMP_disableTrigger( "3"  )
		//! runtextmacro MMP_disableTrigger( "4"  )
		//! runtextmacro MMP_disableTrigger( "5"  )
		//! runtextmacro MMP_disableTrigger( "6"  )
		//! runtextmacro MMP_disableTrigger( "7"  )
		//! runtextmacro MMP_disableTrigger( "8"  )
		//! runtextmacro MMP_disableTrigger( "9"  )
		//! runtextmacro MMP_disableTrigger( "10" )
		//! runtextmacro MMP_disableTrigger( "11" )
		//! runtextmacro MMP_disableTrigger( "12" )
		//! runtextmacro MMP_disableTrigger( "13" )
		//! runtextmacro MMP_disableTrigger( "14" )
		//! runtextmacro MMP_disableTrigger( "15" )
		//! runtextmacro MMP_disableTrigger( "16" )
		//! runtextmacro MMP_disableTrigger( "17" )
		//! runtextmacro MMP_disableTrigger( "18" )
		//! runtextmacro MMP_disableTrigger( "19" )
	};
	
	activateMove = (id: number): void => {
		//! textmacro MMP_activateMove takes N
		if ((id === $N$)) {
			EnableTrigger(this.t$N$)
			this.currentTrigger = this.t$N$;
			IssuePointOrder(this.u, "move", this.x$N$, this.y$N$)
			return;
		}
		//! endtextmacro
		//! runtextmacro MMP_activateMove( "0"  )
		//! runtextmacro MMP_activateMove( "1"  )
		//! runtextmacro MMP_activateMove( "2"  )
		//! runtextmacro MMP_activateMove( "3"  )
		//! runtextmacro MMP_activateMove( "4"  )
		//! runtextmacro MMP_activateMove( "5"  )
		//! runtextmacro MMP_activateMove( "6"  )
		//! runtextmacro MMP_activateMove( "7"  )
		//! runtextmacro MMP_activateMove( "8"  )
		//! runtextmacro MMP_activateMove( "9"  )
		//! runtextmacro MMP_activateMove( "10" )
		//! runtextmacro MMP_activateMove( "11" )
		//! runtextmacro MMP_activateMove( "12" )
		//! runtextmacro MMP_activateMove( "13" )
		//! runtextmacro MMP_activateMove( "14" )
		//! runtextmacro MMP_activateMove( "15" )
		//! runtextmacro MMP_activateMove( "16" )
		//! runtextmacro MMP_activateMove( "17" )
		//! runtextmacro MMP_activateMove( "18" )
		//! runtextmacro MMP_activateMove( "19" )
	};
	
	nextMove = (): void => {
		this.disableTrigger(this.currentMove)
		if ((this.sens === 0 || this.sens === 1)) {
			if ((this.currentMove >= this.lastLocInd)) {
				if ((this.sens === 0)) {
					this.currentMove = 0;
				} else {
					this.sens = 2;
					this.currentMove = this.currentMove - 1;
				}
			} else {
				this.currentMove = this.currentMove + 1;
			}
		} else {
			if ((this.currentMove <= 0)) {
				this.sens = 1;
				this.currentMove = 1;
			} else {
				this.currentMove = this.currentMove - 1;
			}
		}
		this.activateMove(this.currentMove)
	};
	
	// TODO; Used to be static
	create = (mt: MonsterType, mode: string): MonsterMultiplePatrols => {
		//mode == "normal" (0, 1, 2, 3, 0 , 1...) ou mode == "string" (0, 1, 2, 3, 2, 1...)
		let m: MonsterMultiplePatrols;
		let i: number;
	
		if ((mode !== "normal" && mode !== "string")) {
			return 0;
		}
		m = MonsterMultiplePatrols.allocate()
		MonsterMultiplePatrols.nbInstances = MonsterMultiplePatrols.nbInstances + 1	
		m.mt = mt
		if ((mode === "normal")) {
			m.sens = 0
		} else {
			m.sens = 1
		}
	
		//! textmacro MMP_create takes N
		// TODO; Used to be static
		if ( ($N$ <= MonsterMultiplePatrols.LastLocInd) ) {
			m.x$N$ = MonsterMultiplePatrols.X[$N$]
			m.y$N$ = MonsterMultiplePatrols.Y[$N$]
			m.r$N$ = NewRegion(m.x$N$, m.y$N$)
			m.t$N$ = CreateTrigger()
	 DisableTrigger(m.t$N$)
	 TriggerAddAction(m.t$N$, function MonsterMultiplePatrols_move_Actions)
	 TriggerRegisterEnterRegionSimple(m.t$N$, m.r$N$)
		}
		//! endtextmacro
		//! runtextmacro MMP_create( "0"  )
		//! runtextmacro MMP_create( "1"  )
		//! runtextmacro MMP_create( "2"  )
		//! runtextmacro MMP_create( "3"  )
		//! runtextmacro MMP_create( "4"  )
		//! runtextmacro MMP_create( "5"  )
		//! runtextmacro MMP_create( "6"  )
		//! runtextmacro MMP_create( "7"  )
		//! runtextmacro MMP_create( "8"  )
		//! runtextmacro MMP_create( "9"  )
		//! runtextmacro MMP_create( "10" )
		//! runtextmacro MMP_create( "11" )
		//! runtextmacro MMP_create( "12" )
		//! runtextmacro MMP_create( "13" )
		//! runtextmacro MMP_create( "14" )
		//! runtextmacro MMP_create( "15" )
		//! runtextmacro MMP_create( "16" )
		//! runtextmacro MMP_create( "17" )
		//! runtextmacro MMP_create( "18" )
		//! runtextmacro MMP_create( "19" )
	
		// TODO; Used to be static
		m.lastLocInd = MonsterMultiplePatrols.LastLocInd
		//call Text_A("test, lastLocInd == " + I2S(m.lastLocInd))
		m.currentMove = -1
	 MonsterMultiplePatrols.destroyLocs()
		m.life = 0
		m.id = GetNextMonsterId()
	 MonsterHashtableSetMonsterId(m, NO_ID, m.id)
		m.disablingTimer = null
		//color
		m.baseColorId = -1
		m.vcRed = 100
		m.vcGreen = 100
		m.vcBlue = 100
		m.vcTransparency = 0
		return m;
	};
	
	createUnit = (): void => {
		let clearMob = ClearTriggerMobId2ClearMob(this.id);
		let disablingTimer = this.disablingTimer;
		let previouslyEnabled = this.u !== null;
		let isMonsterAlive = IsUnitAliveBJ(this.u);
		if ((previouslyEnabled)) {
			this.removeUnit()
		}
		if ((this.lastLocInd <= 0)) {
			return;
		}
		this.u = NewPatrolMonster(this.mt, this.x0, this.y0, this.x1, this.y1);
		SetUnitUserData(this.u, this.id)
		this.currentMove = 1;
		if ((this.sens === 2)) {
			this.sens = 1;
		}
		EnableTrigger(this.t1)
		this.currentTrigger = this.t1;
		if ( (this.mt.isClickable()) ) {
			this.life = this.mt.getMaxLife()
			GroupAddUnit(monstersClickable, this.u)
		}
		if ((previouslyEnabled)) {
			if ((disablingTimer !== null && TimerGetRemaining(disablingTimer) > 0)) {
				this.temporarilyDisable(disablingTimer)
			}
			if ((!isMonsterAlive)) {
				this.killUnit()
			}
			if ((this.baseColorId !== -1)) {
				if ((this.baseColorId === 0)) {
					SetUnitColor(this.u, PLAYER_COLOR_RED)
				} else {
					SetUnitColor(this.u, ConvertPlayerColor(this.baseColorId))
				}
			}
			SetUnitVertexColorBJ(this.u, this.vcRed, this.vcGreen, this.vcBlue, this.vcTransparency)
		}
		if ((clearMob !== 0)) {
	 clearMob.redoTriggerMobPermanentEffect()
		}
		disablingTimer = null;
	};
	
	getLife = (): number => {
		return this.life;
	};
	
	setLife = (life: number): void => {
		this.life = life;
		if ((life > 0)) {
	 SetUnitLifeBJ(this.u, I2R(life) - 0.5)
		} else {
			this.killUnit()
		}
	};
	
	getX = (id: number): number => {
		//! textmacro MMP_getX takes N
		if ((id === $N$)) {
			return this.x$N$;
		}
		//! endtextmacro
		//! runtextmacro MMP_getX( "0"  )
		//! runtextmacro MMP_getX( "1"  )
		//! runtextmacro MMP_getX( "2"  )
		//! runtextmacro MMP_getX( "3"  )
		//! runtextmacro MMP_getX( "4"  )
		//! runtextmacro MMP_getX( "5"  )
		//! runtextmacro MMP_getX( "6"  )
		//! runtextmacro MMP_getX( "7"  )
		//! runtextmacro MMP_getX( "8"  )
		//! runtextmacro MMP_getX( "9"  )
		//! runtextmacro MMP_getX( "10" )
		//! runtextmacro MMP_getX( "11" )
		//! runtextmacro MMP_getX( "12" )
		//! runtextmacro MMP_getX( "13" )
		//! runtextmacro MMP_getX( "14" )
		//! runtextmacro MMP_getX( "15" )
		//! runtextmacro MMP_getX( "16" )
		//! runtextmacro MMP_getX( "17" )
		//! runtextmacro MMP_getX( "18" )
		//! runtextmacro MMP_getX( "19" )
		return 0;
	};
	
	getY = (id: number): number => {
		//! textmacro MMP_getY takes N
		if ((id === $N$)) {
			return this.y$N$;
		}
		//! endtextmacro
		//! runtextmacro MMP_getY( "0"  )
		//! runtextmacro MMP_getY( "1"  )
		//! runtextmacro MMP_getY( "2"  )
		//! runtextmacro MMP_getY( "3"  )
		//! runtextmacro MMP_getY( "4"  )
		//! runtextmacro MMP_getY( "5"  )
		//! runtextmacro MMP_getY( "6"  )
		//! runtextmacro MMP_getY( "7"  )
		//! runtextmacro MMP_getY( "8"  )
		//! runtextmacro MMP_getY( "9"  )
		//! runtextmacro MMP_getY( "10" )
		//! runtextmacro MMP_getY( "11" )
		//! runtextmacro MMP_getY( "12" )
		//! runtextmacro MMP_getY( "13" )
		//! runtextmacro MMP_getY( "14" )
		//! runtextmacro MMP_getY( "15" )
		//! runtextmacro MMP_getY( "16" )
		//! runtextmacro MMP_getY( "17" )
		//! runtextmacro MMP_getY( "18" )
		//! runtextmacro MMP_getY( "19" )
		return 0;
	};
	
	destroyLastLoc = (): boolean => {
		if ((this.lastLocInd === 1)) {
			DisableTrigger(this.t0)
			DestroyTrigger(this.t1)
			this.t1 = null;
			RemoveRegion(this.r1)
			this.r1 = null;
			RemoveUnit(this.u)
			this.u = null;
		}
		//! textmacro MMP_destroyLastLoc takes N
		if ((this.lastLocInd === $N$)) {
			DestroyTrigger(this.t$N$)
			this.t$N$ = null;
			RemoveRegion(this.r$N$)
			this.r$N$ = null;
			if (($N$ === this.currentMove)) {
				this.currentMove = this.currentMove - 1;
				this.activateMove(this.currentMove)
			}
		}
		//! endtextmacro
		//! runtextmacro MMP_destroyLastLoc( "0"  )
		//! runtextmacro MMP_destroyLastLoc( "2"  )
		//! runtextmacro MMP_destroyLastLoc( "3"  )
		//! runtextmacro MMP_destroyLastLoc( "4"  )
		//! runtextmacro MMP_destroyLastLoc( "5"  )
		//! runtextmacro MMP_destroyLastLoc( "6"  )
		//! runtextmacro MMP_destroyLastLoc( "7"  )
		//! runtextmacro MMP_destroyLastLoc( "8"  )
		//! runtextmacro MMP_destroyLastLoc( "9"  )
		//! runtextmacro MMP_destroyLastLoc( "10" )
		//! runtextmacro MMP_destroyLastLoc( "11" )
		//! runtextmacro MMP_destroyLastLoc( "12" )
		//! runtextmacro MMP_destroyLastLoc( "13" )
		//! runtextmacro MMP_destroyLastLoc( "14" )
		//! runtextmacro MMP_destroyLastLoc( "15" )
		//! runtextmacro MMP_destroyLastLoc( "16" )
		//! runtextmacro MMP_destroyLastLoc( "17" )
		//! runtextmacro MMP_destroyLastLoc( "18" )
		//! runtextmacro MMP_destroyLastLoc( "19" )
		if ((this.lastLocInd < 0)) {
			return false;
		}
		this.lastLocInd = this.lastLocInd - 1;
		return true;
	};
	
	addNewLocAt = (id: number, x: number, y: number): void => {
		//! textmacro MMP_addNewLocAt takes N
		if ((id === $N$)) {
			this.x$N$ = x;
			this.y$N$ = y;
			this.r$N$ = NewRegion(x, y);
			this.t$N$ = CreateTrigger();
			DisableTrigger(this.t$N$)
			TriggerAddAction(this.t$N$, MonsterMultiplePatrols_move_Actions)
			TriggerRegisterEnterRegionSimple(this.t$N$, this.r$N$)
			return;
		}
		//! endtextmacro
		//! runtextmacro MMP_addNewLocAt( "0"  )
		//! runtextmacro MMP_addNewLocAt( "1"  )
		//! runtextmacro MMP_addNewLocAt( "2"  )
		//! runtextmacro MMP_addNewLocAt( "3"  )
		//! runtextmacro MMP_addNewLocAt( "4"  )
		//! runtextmacro MMP_addNewLocAt( "5"  )
		//! runtextmacro MMP_addNewLocAt( "6"  )
		//! runtextmacro MMP_addNewLocAt( "7"  )
		//! runtextmacro MMP_addNewLocAt( "8"  )
		//! runtextmacro MMP_addNewLocAt( "9"  )
		//! runtextmacro MMP_addNewLocAt( "10" )
		//! runtextmacro MMP_addNewLocAt( "11" )
		//! runtextmacro MMP_addNewLocAt( "12" )
		//! runtextmacro MMP_addNewLocAt( "13" )
		//! runtextmacro MMP_addNewLocAt( "14" )
		//! runtextmacro MMP_addNewLocAt( "15" )
		//! runtextmacro MMP_addNewLocAt( "16" )
		//! runtextmacro MMP_addNewLocAt( "17" )
		//! runtextmacro MMP_addNewLocAt( "18" )
		//! runtextmacro MMP_addNewLocAt( "19" )
	};
	
	addNewLoc = (x: number, y: number): number => {
		if ( (this.lastLocInd >= MonsterMultiplePatrols.NB_MAX_LOC - 1) ) {
			return 3;
		}
		if ((GetLocDist(this.getX(this.lastLocInd), this.getY(this.lastLocInd), x, y) <= PATROL_DISTANCE_MIN)) {
			return 2;
		}
		if ((this.sens === 0 && GetLocDist(this.x0, this.y0, x, y) <= PATROL_DISTANCE_MIN)) {
			return 1;
		}
		this.lastLocInd = this.lastLocInd + 1;
		this.addNewLocAt(this.lastLocInd, x, y)
		if ((this.lastLocInd === 1)) {
			this.createUnit()
		}
		return 0;
	};
	
	getMonsterType = (): MonsterType => {
		return this.mt;
	};
	
	setMonsterType = (mt: MonsterType): boolean => {
		if ((mt === 0 || mt === this.mt)) {
			return false;
		}
		this.mt = mt;
		this.createUnit()
		return true;
	};
	
	temporarilyDisable = (disablingTimer: timer): void => {
		if ((this.disablingTimer === null || this.disablingTimer === disablingTimer || TimerGetRemaining(disablingTimer) > TimerGetRemaining(this.disablingTimer))) {
			this.disablingTimer = disablingTimer;
	 UnitRemoveAbility(this.u, this.mt.getImmolationSkill())
			SetUnitVertexColorBJ(this.u, this.vcRed, this.vcGreen, this.vcBlue, DISABLE_TRANSPARENCY)
			this.vcTransparency = DISABLE_TRANSPARENCY;
		}
	};
	
	temporarilyEnable = (disablingTimer: timer): void => {
		if ((this.disablingTimer === disablingTimer)) {
	 UnitAddAbility(this.u, this.mt.getImmolationSkill())
			SetUnitVertexColorBJ(this.u, this.vcRed, this.vcGreen, this.vcBlue, 0)
			this.vcTransparency = 0;
		}
	};
	
	setBaseColor = (colorString: string): void => {
		let baseColorId: number;
		if ((IsColorString(colorString))) {
			baseColorId = ColorString2Id(colorString);
			if ((baseColorId < 0 || baseColorId > 12)) {
				return;
			}
			this.baseColorId = baseColorId;
			if ((this.u !== null)) {
				if ((baseColorId === 0)) {
					SetUnitColor(this.u, PLAYER_COLOR_RED)
				} else {
					SetUnitColor(this.u, ConvertPlayerColor(baseColorId))
				}
			}
		}
	};
	
	setVertexColor = (vcRed: number, vcGreen: number, vcBlue: number): void => {
		this.vcRed = vcRed;
		this.vcGreen = vcGreen;
		this.vcBlue = vcBlue;
		if ((this.u !== null)) {
			SetUnitVertexColorBJ(this.u, vcRed, vcGreen, vcBlue, this.vcTransparency)
		}
	};
	
	reinitColor = (): void => {
		let initBaseColorId: number;
		//changement valeurs des champs
		this.baseColorId = -1;
		this.vcRed = 100;
		this.vcGreen = 100;
		this.vcBlue = 100;
		this.vcTransparency = 0;
		//changement couleur du mob actuel
		if ((this.u !== null)) {
			if ((MOBS_VARIOUS_COLORS)) {
				initBaseColorId = GetPlayerId(GetOwningPlayer(this.u));
			} else {
				initBaseColorId = 12;
			}
			if ((initBaseColorId === 0)) {
				SetUnitColor(this.u, PLAYER_COLOR_RED)
			} else {
				SetUnitColor(this.u, ConvertPlayerColor(initBaseColorId))
			}
			SetUnitVertexColorBJ(this.u, this.vcRed, this.vcGreen, this.vcBlue, this.vcTransparency)
		}
	};
	
	toString = (): string => {
		let str: string;
		if ( (this.mt.theAlias != null && this.mt.theAlias != "") ) {
			str = this.mt.theAlias + CACHE_SEPARATEUR_PARAM
		} else {
			str = this.mt.label + CACHE_SEPARATEUR_PARAM
		}
		str = str + I2S(this.id) + CACHE_SEPARATEUR_PARAM;
		if ((this.sens > 0)) {
			str = str + "string";
		} else {
			str = str + "normal";
		}
		//! textmacro MMP_loc_toString takes N
		if ((this.lastLocInd < $N$)) {
			return str;
		}
		str = str + CACHE_SEPARATEUR_PARAM + I2S(R2I(this.x$N$)) + CACHE_SEPARATEUR_PARAM + I2S(R2I(this.y$N$));
		//! endtextmacro
		//! runtextmacro MMP_loc_toString( "0"  )
		//! runtextmacro MMP_loc_toString( "1"  )
		//! runtextmacro MMP_loc_toString( "2"  )
		//! runtextmacro MMP_loc_toString( "3"  )
		//! runtextmacro MMP_loc_toString( "4"  )
		//! runtextmacro MMP_loc_toString( "5"  )
		//! runtextmacro MMP_loc_toString( "6"  )
		//! runtextmacro MMP_loc_toString( "7"  )
		//! runtextmacro MMP_loc_toString( "8"  )
		//! runtextmacro MMP_loc_toString( "9"  )
		//! runtextmacro MMP_loc_toString( "10" )
		//! runtextmacro MMP_loc_toString( "11" )
		//! runtextmacro MMP_loc_toString( "12" )
		//! runtextmacro MMP_loc_toString( "13" )
		//! runtextmacro MMP_loc_toString( "14" )
		//! runtextmacro MMP_loc_toString( "15" )
		//! runtextmacro MMP_loc_toString( "16" )
		//! runtextmacro MMP_loc_toString( "17" )
		//! runtextmacro MMP_loc_toString( "18" )
		//! runtextmacro MMP_loc_toString( "19" )
		return str;
	};
	
	}