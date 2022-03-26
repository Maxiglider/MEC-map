

const initCommandShortcuts = () => { // needs BasicFunctions


let A_shortcutCommand: Array<string> = [];
let Z_shortcutCommand: Array<string> = [];
let E_shortcutCommand: Array<string> = [];
let R_shortcutCommand: Array<string> = [];
let Q_shortcutCommand: Array<string> = [];
let S_shortcutCommand: Array<string> = [];
let D_shortcutCommand: Array<string> = [];
let F_shortcutCommand: Array<string> = [];



const InitShortcutSkills = (playerId: number): void => {
	local unit hero = udg_escapers.get(playerId).getHero()

	//!//@@BELOWTEXTMACRO
	/* textmacro InitShortcut takes shortcut
	    if ($shortcut$_shortcutCommand[playerId] == null) then
 UnitRemoveAbility(hero, 'SC$shortcut$o')
 UnitAddAbility(hero, 'SC$shortcut$u')
	    else
 UnitRemoveAbility(hero, 'SC$shortcut$u')
 UnitAddAbility(hero, 'SC$shortcut$o')
	    endif
	    //! endtextmacro


	//! runtextmacro InitShortcut("A")
	//! runtextmacro InitShortcut("Z")
	//! runtextmacro InitShortcut("E")
	//! runtextmacro InitShortcut("R")
	//! runtextmacro InitShortcut("Q")
	//! runtextmacro InitShortcut("S")
	//! runtextmacro InitShortcut("D")
	//! runtextmacro InitShortcut("F")

	hero = null;
};



const AssignShortcut = (playerId: number, shortcut: string, command: string): void => {
	local unit hero = udg_escapers.get(playerId).getHero()
	shortcut = StringCase(shortcut, true);

	//!//@@BELOWTEXTMACRO
	/* textmacro AssignShortcut takes shortcut
	    if (shortcut == "$shortcut$") then
	        if ($shortcut$_shortcutCommand[playerId] == null) then
 UnitRemoveAbility(hero, 'SC$shortcut$u')
 UnitAddAbility(hero, 'SC$shortcut$o')
	        endif
	        $shortcut$_shortcutCommand[playerId] = "-" + command
	        return
	    endif
	    //! endtextmacro


	//! runtextmacro AssignShortcut("A")
	//! runtextmacro AssignShortcut("Z")
	//! runtextmacro AssignShortcut("E")
	//! runtextmacro AssignShortcut("R")
	//! runtextmacro AssignShortcut("Q")
	//! runtextmacro AssignShortcut("S")
	//! runtextmacro AssignShortcut("D")
	//! runtextmacro AssignShortcut("F")

	hero = null;
};


const UnassignShortcut = (playerId: number, shortcut: string): void => {
	local unit hero = udg_escapers.get(playerId).getHero()
	shortcut = StringCase(shortcut, true);

	//!//@@BELOWTEXTMACRO
	/* textmacro UnassignShortcut takes shortcut
	    if (shortcut == "$shortcut$") then
	        if ($shortcut$_shortcutCommand[playerId] != null) then
 UnitRemoveAbility(hero, 'SC$shortcut$o')
 UnitAddAbility(hero, 'SC$shortcut$u')
	            $shortcut$_shortcutCommand[playerId] = null
	        endif
	        return
	    endif
	    //! endtextmacro


	//! runtextmacro UnassignShortcut("A")
	//! runtextmacro UnassignShortcut("Z")
	//! runtextmacro UnassignShortcut("E")
	//! runtextmacro UnassignShortcut("R")
	//! runtextmacro UnassignShortcut("Q")
	//! runtextmacro UnassignShortcut("S")
	//! runtextmacro UnassignShortcut("D")
	//! runtextmacro UnassignShortcut("F")

	hero = null;
};


const IsShortcut = (S: string): boolean => {
	S = StringCase(S, true);
	//!//@@BELOWTEXTMACRO
	/* textmacro IsShortcut takes shortcut
	    if (S == "$shortcut$") then
	        return true
	    endif
	    //! endtextmacro


	//! runtextmacro IsShortcut("A")
	//! runtextmacro IsShortcut("Z")
	//! runtextmacro IsShortcut("E")
	//! runtextmacro IsShortcut("R")
	//! runtextmacro IsShortcut("Q")
	//! runtextmacro IsShortcut("S")
	//! runtextmacro IsShortcut("D")
	//! runtextmacro IsShortcut("F")

	return false;
};



const GetStringAssignedFromCommand = (command: string): string => {
	let outputStr: string;
	let spaceFound = false;
	let cmdLength = StringLength(command);
	let charId = 3;
	while (true) {
		if ((charId >= cmdLength)) break;
		if ((SubStringBJ(command, charId, charId) === " ")) {
			if ((!spaceFound)) {
				spaceFound = true;
			} else {
				outputStr = SubStringBJ(command, charId + 1, cmdLength);
				if ((SubStringBJ(outputStr, 1, 1) === "(" && SubStringBJ(outputStr, StringLength(outputStr), StringLength(outputStr)) === ")")) {
					outputStr = SubStringBJ(outputStr, 2, StringLength(outputStr) - 1);
				}
				return outputStr;
			}
		}
		charId = charId + 1;
	}
	return null;
};



const DisplayShortcuts = (playerId: number): void => {
	Text_P(Player(playerId), " ")
	Text_P(Player(playerId), udg_colorCode[playerId] + "Your shortcuts:")
	//!//@@BELOWTEXTMACRO
	/* textmacro ShowShortcut takes shortcut
	    if ($shortcut$_shortcutCommand[playerId] == null) then
 Text_P(Player(playerId), udg_colorCode[playerId] + "$shortcut$: |r" + udg_colorCode[GREY] + "none")
	    else
 Text_P(Player(playerId), udg_colorCode[playerId] + "$shortcut$: |r" + $shortcut$_shortcutCommand[playerId])
	    endif
	    //! endtextmacro


	//! runtextmacro ShowShortcut("A")
	//! runtextmacro ShowShortcut("Z")
	//! runtextmacro ShowShortcut("E")
	//! runtextmacro ShowShortcut("R")
	//! runtextmacro ShowShortcut("Q")
	//! runtextmacro ShowShortcut("S")
	//! runtextmacro ShowShortcut("D")
	//! runtextmacro ShowShortcut("F")
};



}
