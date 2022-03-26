

const initLevelFunctions = () => { //


const IsLevelBeingMade = (level: Level): boolean => {
	let i = 0;
	while (true) {
		if ((i >= NB_ESCAPERS)) break;
		if ( (udg_escapers.get(i) != 0) ) {
			if ( (udg_escapers.get(i).getMakingLevel() == level) ) {
				return true;
			}
		}
		i = i + 1;
	}
	return (udg_levels.getCurrentLevel() == level)
};


}

