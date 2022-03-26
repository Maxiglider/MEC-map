

const initStringArrayForCache = () => { // needs Text


const CACHE_SEPARATEUR_ITEM = "(";
const CACHE_SEPARATEUR_PARAM = ",";

// TODO; Used to be private
const MAX_STRING_LENGTH = 200;
let stringArrayForCache = 0;


//struct StringArrayForCache

// TODO; Used to be private
     string array stringArray
// TODO; Used to be private
     integer lastStringId
// TODO; Used to be private
     string category
// TODO; Used to be private
     string variableName
// TODO; Used to be private
     boolean avecSeparateur
    
// TODO; Used to be static
     


const create = (category: string, variableName: string, avecSeparateur: boolean): StringArrayForCache => {
	let sa: StringArrayForCache;
	if ((stringArrayForCache !== 0)) {
 stringArrayForCache.destroy()
	}
	sa = StringArrayForCache.allocate()
	sa.lastStringId = -1
	sa.category = category
	sa.variableName = variableName
	sa.avecSeparateur = avecSeparateur
	return sa;
};

// TODO; Used to be private
const nextString = (): void => {
	this.lastStringId = this.lastStringId + 1;
	this.stringArray[ this.lastStringId ] = "";
};

const push = (str: string): void => {
	let length: number;
	let nbCharsDispoForCurrentString: number;
	if ((this.lastStringId === -1)) {
		this.nextString()
	} else {
		if ((StringLength(this.stringArray[this.lastStringId]) === MAX_STRING_LENGTH)) {
			this.nextString()
		}
		if ((this.avecSeparateur)) {
			this.stringArray[ this.lastStringId ] = this.stringArray[this.lastStringId] + CACHE_SEPARATEUR_ITEM;
		}
	}
	nbCharsDispoForCurrentString = MAX_STRING_LENGTH - StringLength(this.stringArray[this.lastStringId]);
	length = StringLength(str);
	while (true) {
		if ((length === 0)) break;
		if ((length > nbCharsDispoForCurrentString)) {
			this.stringArray[ this.lastStringId ] = this.stringArray[this.lastStringId] + SubStringBJ(str, 1, nbCharsDispoForCurrentString);
			this.nextString()
			str = SubStringBJ(str, nbCharsDispoForCurrentString + 1, length);
		} else {
			this.stringArray[ this.lastStringId ] = this.stringArray[this.lastStringId] + str;
			str = "";
		}
		nbCharsDispoForCurrentString = MAX_STRING_LENGTH - StringLength(this.stringArray[this.lastStringId]);
		length = StringLength(str);
	}
};

const writeInCache = (): void => {
	let i: number;
	if ((this.lastStringId > 0)) {
		i = 0;
		while (true) {
			if ((i > this.lastStringId)) break;
			StoreString(saveMap_cache, this.category, this.variableName + I2S(i), this.stringArray[i])
			//call Text_A(I2S(i) + " : " + this.stringArray[i])
			//call Text_A("longueur chaîne : " + I2S(StringLength(this.stringArray[i])))
			i = i + 1;
		}
	} else {
		if ((this.lastStringId === 0)) {
			StoreString(saveMap_cache, this.category, this.variableName, this.stringArray[0])
			Text_A(this.stringArray[0])
			Text_A("longueur chaîne : " + I2S(StringLength(this.stringArray[0])))
		}
	}
	Text_A(this.category + ", " + this.variableName + " : finish write in cache")
};

//endstruct



}
