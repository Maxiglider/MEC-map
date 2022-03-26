

const initTriggers = () => { //


//struct Trigger

// TODO; Used to be private
     trigger t
    
    
// TODO; Used to be private
     


const onDestroy = (): void => {
	DestroyTrigger(this.t)
	this.t = null;
};

// TODO; Used to be static
const create = (): Trigger => {
	local Trigger t = Trigger.allocate()
	t.t = CreateTrigger()
	return t;
};

const activate = (activ: boolean): void => {
	if ((activ)) {
		EnableTrigger(this.t)
	} else {
		DisableTrigger(this.t)
	}
};

//endstruct



//struct TriggerArray
// TODO; Used to be private
     Trigger array triggers
// TODO; Used to be private
     integer lastInstance
    
    
// TODO; Used to be static
     


const create = (): TriggerArray => {
	local TriggerArray ta = TriggerArray.allocate()
	ta.lastInstance = -1
	return ta;
};

// TODO; Used to be private
const onDestroy = (): void => {
	let i = 0;
	while (true) {
		if ((i > this.lastInstance)) break;
 this.triggers[i].destroy()
		i = i + 1;
	}
	this.lastInstance = -1;
};

const activate = (activ: boolean): void => {
	let i = 0;
	while (true) {
		if ((i > this.lastInstance)) break;
		if ((this.triggers[i] !== 0)) {
 this.triggers[i].activate(activ)
		}
		i = i + 1;
	}
};

//endstruct



}
