import { StringArrayForCache } from 'core/07_TRIGGERS/Save_map_in_gamecache/struct_StringArrayForCache';


const initTerrainTypeArray = () => { // needs TerrainTypeWalk, TerrainTypeDeath, TerrainTypeSlide, CommandsFunctions


//struct TerrainTypeArray

// TODO; Used to be private
     TerrainTypeWalk array ttWalk //le nombre de terrains du jeu est de 177
// TODO; Used to be private
     TerrainTypeDeath array ttDeath
// TODO; Used to be private
     TerrainTypeSlide array ttSlide
    integer numberOfWalk
    integer numberOfDeath
    integer numberOfSlide
    string mainTileset
    
// TODO; Used to be static
     


const create = (): TerrainTypeArray => {
	local TerrainTypeArray tta = TerrainTypeArray.allocate()
	tta.numberOfWalk = 0
	tta.numberOfDeath = 0
	tta.numberOfSlide = 0
	tta.mainTile= "auto"
	return tta;
};

const get = (label: string): TerrainType => {
	let i = 0;
	while (true) {
		if ((i >= this.numberOfWalk)) break;
		if ( (this.ttWalk[i].label == label or this.ttWalk[i].theAlias == label) ) {
			return this.ttWalk[i];
		}
		i = i + 1;
	}
	i = 0;
	while (true) {
		if ((i >= this.numberOfDeath)) break;
		if ( (this.ttDeath[i].label == label or this.ttDeath[i].theAlias == label) ) {
			return this.ttDeath[i];
		}
		i = i + 1;
	}
	i = 0;
	while (true) {
		if ((i >= this.numberOfSlide)) break;
		if ( (this.ttSlide[i].label == label or this.ttSlide[i].theAlias == label) ) {
			return this.ttSlide[i];
		}
		i = i + 1;
	}
	return 0;
};

const getTerrainType = (x: number, y: number): TerrainType => {
	let terrainTypeId = GetTerrainType(x, y);
	let i = 0;
	while (true) {
		if ((i >= this.numberOfWalk)) break;
		if ( (this.ttWalk[i].getTerrainTypeId() == terrainTypeId) ) {
			return this.ttWalk[i];
		}
		i = i + 1;
	}
	i = 0;
	while (true) {
		if ((i >= this.numberOfDeath)) break;
		if ( (this.ttDeath[i].getTerrainTypeId() == terrainTypeId) ) {
			return this.ttDeath[i];
		}
		i = i + 1;
	}
	i = 0;
	while (true) {
		if ((i >= this.numberOfSlide)) break;
		if ( (this.ttSlide[i].getTerrainTypeId() == terrainTypeId) ) {
			return this.ttSlide[i];
		}
		i = i + 1;
	}
	return 0;
};

const isTerrainTypeIdAlreadyUsed = (terrainTypeId: number): boolean => {
	let i = 0;
	while (true) {
		if ((i >= this.numberOfWalk)) break;
		if ( (terrainTypeId == this.ttWalk[i].getTerrainTypeId()) ) {
			return true;
		}
		i = i + 1;
	}
	i = 0;
	while (true) {
		if ((i >= this.numberOfDeath)) break;
		if ( (terrainTypeId == this.ttDeath[i].getTerrainTypeId()) ) {
			return true;
		}
		i = i + 1;
	}
	i = 0;
	while (true) {
		if ((i >= this.numberOfSlide)) break;
		if ( (terrainTypeId == this.ttSlide[i].getTerrainTypeId()) ) {
			return true;
		}
		i = i + 1;
	}
	return false;
};

const isLabelAlreadyUsed = (label: string): boolean => {
	return (this.get(label) !== 0);
};

const newWalk = (label: string, terrainTypeId: number, walkspeed: number): TerrainTypeWalk => {
	let n = this.numberOfWalk;
	if ((this.count() >= 16 || this.isLabelAlreadyUsed(label) || this.isTerrainTypeIdAlreadyUsed(terrainTypeId) || terrainTypeId === 0)) {
		return 0;
	}
	this.ttWalk[n] = TerrainTypeWalk.create(label, terrainTypeId, walkspeed)
	if ((this.ttWalk[n] !== 0)) {
		this.numberOfWalk = this.numberOfWalk + 1;
	}
	return this.ttWalk[n];
};

const newDeath = (label: string, terrainTypeId: number, killingEffectStr: string, timeToKill: number, toleranceDist: number): TerrainTypeDeath => {
	let n = this.numberOfDeath;
	if ((this.count() >= 16 || this.isLabelAlreadyUsed(label) || this.isTerrainTypeIdAlreadyUsed(terrainTypeId) || terrainTypeId === 0)) {
		return 0;
	}
	this.ttDeath[n] = TerrainTypeDeath.create(label, terrainTypeId, killingEffectStr, timeToKill, toleranceDist)
	if ((this.ttDeath[n] !== 0)) {
		this.numberOfDeath = this.numberOfDeath + 1;
	}
	return this.ttDeath[n];
};

const newSlide = (label: string, terrainTypeId: number, slideSpeed: number, canTurn: boolean): TerrainTypeSlide => {
	let n = this.numberOfSlide;
	if ((this.count() >= 16 || this.isLabelAlreadyUsed(label) || this.isTerrainTypeIdAlreadyUsed(terrainTypeId) || terrainTypeId === 0)) {
		return 0;
	}
	this.ttSlide[n] = TerrainTypeSlide.create(label, terrainTypeId, slideSpeed, canTurn)
	if ((this.ttSlide[n] !== 0)) {
		this.numberOfSlide = this.numberOfSlide + 1;
	}
	return this.ttSlide[n];
};

const remove = (label: string): boolean => {
	let position: number;
	let i: number;
	let tt = this.get(label);
	if ((tt === 0)) {
		return false;
	}
	if ( (tt.kind == "walk") ) {
		i = 0;
		while (true) {
			if (this.ttWalk[i].label == label or this.ttWalk[i].theAlias == label or i >= this.numberOfWalk) break;
			i = i + 1;
		}
		if ((i < this.numberOfWalk)) {
			position = i;
			i = i + 1;
			while (true) {
				if ((i >= this.numberOfWalk)) break;
				this.ttWalk[ i - 1 ] = this.ttWalk[i];
				i = i + 1;
			}
			this.numberOfWalk = this.numberOfWalk - 1;
		}
	}
	if ( (tt.kind == "death") ) {
		i = 0;
		while (true) {
			if (this.ttDeath[i].label == label or this.ttDeath[i].theAlias == label or i >= this.numberOfDeath) break;
			i = i + 1;
		}
		if ((i < this.numberOfDeath)) {
			position = i;
			i = i + 1;
			while (true) {
				if ((i >= this.numberOfDeath)) break;
				this.ttDeath[ i - 1 ] = this.ttDeath[i];
				i = i + 1;
			}
			this.numberOfDeath = this.numberOfDeath - 1;
		}
	}
	if ( (tt.kind == "slide") ) {
		i = 0;
		while (true) {
			if (this.ttSlide[i].label == label or this.ttSlide[i].theAlias == label or i >= this.numberOfSlide) break;
			i = i + 1;
		}
		if ((i < this.numberOfSlide)) {
			position = i;
			i = i + 1;
			while (true) {
				if ((i >= this.numberOfSlide)) break;
				this.ttSlide[ i - 1 ] = this.ttSlide[i];
				i = i + 1;
			}
			this.numberOfSlide = this.numberOfSlide - 1;
		}
	}
 tt.destroy()
	return true;
};

const getWalk = (id: number): TerrainTypeWalk => {
	return this.ttWalk[id];
};

const getDeath = (id: number): TerrainTypeDeath => {
	return this.ttDeath[id];
};

const getSlide = (id: number): TerrainTypeSlide => {
	return this.ttSlide[id];
};

const displayForPlayer = (p: player): void => {
	let i = 0;
	while (true) {
		if ((i >= this.numberOfSlide)) break;
 this.ttSlide[i].displayForPlayer(p)
		i = i + 1;
	}
	i = 0;
	while (true) {
		if ((i >= this.numberOfWalk)) break;
 this.ttWalk[i].displayForPlayer(p)
		i = i + 1;
	}
	i = 0;
	while (true) {
		if ((i >= this.numberOfDeath)) break;
 this.ttDeath[i].displayForPlayer(p)
		i = i + 1;
	}
	if ((this.numberOfSlide + this.numberOfWalk + this.numberOfDeath === 0)) {
		Text.erP(p, "no terrain saved")
	}
};

const saveInCache = (): void => {
	let i: number;

	//main tileset
	StringArrayForCache.stringArrayForCache = new StringArrayForCache("terrain", "mainTileset", false)
	StringArrayForCache.stringArrayForCache.push(this.mainTileset)
	StringArrayForCache.stringArrayForCache.writeInCache()

	//terrainConfig
	StringArrayForCache.stringArrayForCache = new StringArrayForCache("terrain", "terrainConfig", true)
	i = 0;
	while (true) {
		if ((i >= this.numberOfSlide)) break;
		StringArrayForCache.stringArrayForCache.push(this.ttSlide[i].toString())
		i = i + 1;
	}
	i = 0;
	while (true) {
		if ((i >= this.numberOfWalk)) break;
		StringArrayForCache.stringArrayForCache.push(this.ttWalk[i].toString())
		i = i + 1;
	}
	i = 0;
	while (true) {
		if ((i >= this.numberOfDeath)) break;
		StringArrayForCache.stringArrayForCache.push(this.ttDeath[i].toString())
		i = i + 1;
	}
	StringArrayForCache.stringArrayForCache.writeInCache()
};

const count = (): number => {
	return this.numberOfWalk + this.numberOfSlide + this.numberOfDeath;
};

//mettre en place l'ordre des terrains au niveau des tilesets
const setOrder = (cmd: string): boolean => {
	let terrainType: TerrainType;
	let terrainTypesOrdered: Array<TerrainType> = [];
	let nbTerrainsDone: number;
	let i: number;
	if ((this.count() !== NbParam(cmd))) {
		return false;
	}
	nbTerrainsDone = 0;
	while (true) {
		if ((nbTerrainsDone === this.count())) break;
		terrainType = this.get(CmdParam(cmd, nbTerrainsDone + 1));
		//vérification que le terrain existe
		if ((terrainType === 0)) {
			return false;
		}
		//vérification que le terrain n'a pas déjà été cité
		i = 0;
		while (true) {
			if ((i === nbTerrainsDone)) break;
			if ((terrainTypesOrdered[i] === terrainType)) {
				return false;
			}
			i = i + 1;
		}
		//mémorisation du terrain
		terrainTypesOrdered[ nbTerrainsDone ] = terrainType;
		nbTerrainsDone = nbTerrainsDone + 1;
	}
	//mémorisation du numéro d'ordre de chaque terrain
	i = 0;
	while (true) {
		if ((i === nbTerrainsDone)) break;
 terrainTypesOrdered[i].setOrderId(i + 1)
		i = i + 1;
	}
	return true;
};

const setMainTile= (tileset: string): boolean => {
	let tilesetChar = tileset2tilesetChar(tileset);
	if ((tilesetChar !== "")) {
		this.mainTile= tilesetChar;
		return true;
	}
	return false;
};

const getMainTile= (): string => {
	return this.mainTileset;
};

//endstruct




}
