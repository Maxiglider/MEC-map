

const initGravity = () => { // initializer InitGravity


// TODO; Used to be private
let gravity: number;


const SetGravity = (newGravity: number): void => {
	gravity = newGravity * SLIDE_PERIOD;
};

const GetGravity = (): number => {
	return gravity;
};

const GetRealGravity = (): number => {
	return gravity / SLIDE_PERIOD;
};


const InitGravity = (): void => {
	gravity = -45 * SLIDE_PERIOD;
};


}
