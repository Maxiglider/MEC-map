

const initMakeTerrainVerticalSymmetryAction = () => { // needs MakeAction, ModifyTerrainFunctions


//struct MakeTerrainVerticalSymmetryAction extends MakeAction   

// TODO; Used to be private
     real minX
// TODO; Used to be private
     real minY
// TODO; Used to be private
     real maxX
// TODO; Used to be private
     real maxY

// TODO; Used to be static
     


const create = (x1: number, y1: number, x2: number, y2: number): MakeTerrainVerticalSymmetryAction => {
	let a: MakeTerrainVerticalSymmetryAction;

	let minX = RMinBJ(x1, x2);
	let maxX = RMaxBJ(x1, x2);
	let minY = RMinBJ(y1, y2);
	let maxY = RMaxBJ(y1, y2);

	//pour éviter les ptits décalages
	minX = I2R(R2I(minX / LARGEUR_CASE)) * LARGEUR_CASE;
	minY = I2R(R2I(minY / LARGEUR_CASE)) * LARGEUR_CASE;
	maxX = I2R(R2I(maxX / LARGEUR_CASE)) * LARGEUR_CASE;
	maxY = I2R(R2I(maxY / LARGEUR_CASE)) * LARGEUR_CASE;

	if ((GetNbCaseBetween(minX, minY, maxX, maxY) > NB_MAX_TILES_MODIFIED)) {
		return 0;
	}
	a = MakeTerrainVerticalSymmetryAction.allocate()
	a.minX = minX
	a.minY = minY
	a.maxX = maxX
	a.maxY = maxY
 a.applySymmetry()        
	a.isActionMadeB = true
	return a;
};

const applySymmetry = (): void => {
	let i: number;
	let x: number;
	let y: number;
	let terrainTypeIds: Array<number> = [];

	//sauvegarde du terrain
	i = 0;
	x = this.minX;
	y = this.minY;
	while (true) {
		if ((y > this.maxY)) break;
		while (true) {
			if ((x > this.maxX)) break;
			terrainTypeIds[ i ] = GetTerrainType(x, y);
			i = i + 1;
			x = x + LARGEUR_CASE;
		}
		x = this.minX;
		y = y + LARGEUR_CASE;
	}

	//application de la symétrie
	i = 0;
	x = this.minX;
	y = this.maxY;
	while (true) {
		if ((y < this.minY)) break;
		while (true) {
			if ((x > this.maxX)) break;
			ChangeTerrainType(x, y, terrainTypeIds[i])
			i = i + 1;
			x = x + LARGEUR_CASE;
		}
		x = this.minX;
		y = y - LARGEUR_CASE;
	}
};

const cancel = (): boolean => {
	if ((!this.isActionMadeB)) {
		return false;
	}
	this.applySymmetry()
	this.isActionMadeB = false;
 Text_mkP(this.owner.getPlayer(), "terrain vertical symmetry cancelled")
	return true;
};

const redo = (): boolean => {
	if ((this.isActionMadeB)) {
		return false;
	}
	this.applySymmetry()
	this.isActionMadeB = true;
 Text_mkP(this.owner.getPlayer(), "terrain vertical symmetry redone")
	return true;
};

//endstruct




}
