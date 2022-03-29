

const initMMSimplePatrolActions = () => { // needs TerrainTypeFunctions, Escaper

const MIN_DIST = 5;
const MAX_DIST = 2000;
const ECART_DIST = 32;
const ECART_ANGLE = 9;
const DIST_ON_TERRAIN_MAX = 300;
const DIST_ON_TERRAIN_DEFAULT = 50;
let distOnTerrain = 50;


const MakeSimplePatrolAuto_ChangeDistOnTerrain = (newDist: number): boolean => {
	if ((newDist < 0 || newDist > DIST_ON_TERRAIN_MAX)) {
		return false;
	}
	distOnTerrain = newDist;
	return true;
};

const MakeSimplePatrolAuto_ChangeDistOnTerrainDefault = () => {
	distOnTerrain = DIST_ON_TERRAIN_DEFAULT;
};


const MonsterMakingSimplePatrol_Actions = () => {
	let monster: Monster;
	let escaper = EscaperFunctions.Hero2Escaper(GetTriggerUnit());
	local Make mkGeneral = escaper.getMake()
		local MakeMonsterSimplePatrol mk = MakeMonsterSimplePatrol(integer(mkGeneral))
	let x = GetOrderPointX();
	let y = GetOrderPointY();

	let x1: number;
	let y1: number;
	let x2: number;
	let y2: number;
	let dist: number;
	let angle: number;
	let found: boolean;

	if ((!BasicFunctions.IsIssuedOrder("smart"))) {
		return;
	}
 BasicFunctions.StopUnit(mk.maker)
	if ( (mk.getMode() == "normal") ) {
		if ( (mk.isLastLocSavedUsed()) ) {
			if ( (BasicFunctions.GetLocDist(mk.lastX, mk.lastY, x, y) <= PATROL_DISTANCE_MIN) ) {
 Text.erP(mk.makerOwner, "Too close to the start location !")
				return;
			} else {
				monster = escaper.getMakingLevel().monstersSimplePatrol.new(mk.getMonsterType(), mk.lastX, mk.lastY, x, y, true)
 escaper.newAction(MakeMonsterAction.create(escaper.getMakingLevel(), monster))
 mk.unsaveLocDefinitely()
			}
		} else {
 mk.saveLoc(x, y)
		}
	}
	if ( (mk.getMode() == "string") ) {
		if ( (mk.isLastLocSavedUsed()) ) {
			if ( (BasicFunctions.GetLocDist(mk.lastX, mk.lastY, x, y) <= PATROL_DISTANCE_MIN) ) {
 Text.erP(mk.makerOwner, "Too close to the start location !")
				return;
			} else {
				monster = escaper.getMakingLevel().monstersSimplePatrol.new(mk.getMonsterType(), mk.lastX, mk.lastY, x, y, true)
 escaper.newAction(MakeMonsterAction.create(escaper.getMakingLevel(), monster))
 mk.unsaveLoc()
			}
		}
 mk.saveLoc(x, y)
	}
	if ( (mk.getMode() == "auto") ) {
		if ((IsTerrainTypeOfKind(GetTerrainType(x, y), "death"))) {
 Text.erP(mk.makerOwner, "You clicked on a death terrain !")
			return;
		}

		//find approximatively first location
		found = false;
		dist = MIN_DIST;
		while (true) {
			if ((found || dist > MAX_DIST)) break;
			angle = 0;
			x1 = x + dist * CosBJ(angle);
			y1 = y + dist * SinBJ(angle);
			found = IsTerrainTypeOfKind(GetTerrainType(x1, y1), "death");
			if (found) break;

			angle = 90;
			x1 = x + dist * CosBJ(angle);
			y1 = y + dist * SinBJ(angle);
			found = IsTerrainTypeOfKind(GetTerrainType(x1, y1), "death");
			if (found) break;

			angle = 180;
			x1 = x + dist * CosBJ(angle);
			y1 = y + dist * SinBJ(angle);
			found = IsTerrainTypeOfKind(GetTerrainType(x1, y1), "death");
			if (found) break;

			angle = 270;
			x1 = x + dist * CosBJ(angle);
			y1 = y + dist * SinBJ(angle);
			found = IsTerrainTypeOfKind(GetTerrainType(x1, y1), "death");
			if (found) break;

			angle = 1;
			while (true) {
				if ((found || angle >= 360)) break;
				x1 = x + dist * CosBJ(angle);
				y1 = y + dist * SinBJ(angle);
				found = IsTerrainTypeOfKind(GetTerrainType(x1, y1), "death");
				angle = angle + ECART_ANGLE;
			}
			angle = angle - ECART_ANGLE;

			dist = dist + ECART_DIST;
		}

		//first location not found
		if ((!found)) {
 Text.erP(mk.makerOwner, "Death terrain too far !")
			return;
		}

		//precise position of first location
		while (true) {
			if ((!IsTerrainTypeOfKind(GetTerrainType(x1, y1), "death"))) break;
			dist = dist - 1;
			x1 = x + dist * CosBJ(angle);
			y1 = y + dist * SinBJ(angle);
		}
		dist = dist + distOnTerrain + 1;
		x1 = x + dist * CosBJ(angle);
		y1 = y + dist * SinBJ(angle);

		//prepare angle for the second location
		if ((angle >= 180)) {
			angle = angle - 180;
		} else {
			angle = angle + 180;
		}

		//find approximatively second location
		found = false;
		dist = MIN_DIST;
		while (true) {
			if ((found || dist > MAX_DIST)) break;
			x2 = x + dist * CosBJ(angle);
			y2 = y + dist * SinBJ(angle);
			found = IsTerrainTypeOfKind(GetTerrainType(x2, y2), "death");
			dist = dist + ECART_DIST;
		}

		//second location not found
		if ((!found)) {
 Text.erP(mk.makerOwner, "Death terrain too far for the second location !")
			return;
		}

		//precise position of second location
		while (true) {
			if ((!IsTerrainTypeOfKind(GetTerrainType(x2, y2), "death"))) break;
			dist = dist - 1;
			x2 = x + dist * CosBJ(angle);
			y2 = y + dist * SinBJ(angle);
		}
		dist = dist + distOnTerrain + 1;
		x2 = x + dist * CosBJ(angle);
		y2 = y + dist * SinBJ(angle);

		//the two locations were found, creating monster
		monster = escaper.getMakingLevel().monstersSimplePatrol.new(mk.getMonsterType(), x1, y1, x2, y2, true)
 escaper.newAction(MakeMonsterAction.create(escaper.getMakingLevel(), monster))
	}
};

// TODO; ONLY RETURN LAST FUNCTION


}

