

const initMeteorFunctions = () => { // needs Meteor


// TODO; Used to be private
let meteor: item;



const HeroAddCheatMeteor = (hero: unit): item => {
	meteor = UnitAddItemById(hero, METEOR_CHEAT);
	if ( (udg_terrainTypes.getTerrainType(GetUnitX(hero), GetUnitY(hero)).getKind() == "slide") ) {
		SetItemDroppable(meteor, false)
	}
	return meteor;
};


const HeroComingToSlide_CheckItem = (hero: unit): void => {
	meteor = UnitItemInSlot(hero, 0);
	if ((meteor !== null)) {
		SetItemDroppable(meteor, false)
	}
};


const HeroComingOutFromSlide_CheckItem = (hero: unit): void => {
	meteor = UnitItemInSlot(hero, 0);
	if ((meteor !== null)) {
		SetItemDroppable(meteor, true)
	}
};


const ExecuteRightClicOnUnit = (hero: unit, u: unit): void => {
	let itemCarried = UnitItemInSlot(hero, 0);
	let itemCarriedType = GetItemTypeId(itemCarried);
	if ( ((itemCarriedType == METEOR_NORMAL or itemCarriedType == METEOR_CHEAT) and GetWidgetLife(u) > 0.) ) {
		UnitUseItemTarget(hero, itemCarried, u)
	} else {
		StopUnit(hero)
	}
	itemCarried = null;
};



}


