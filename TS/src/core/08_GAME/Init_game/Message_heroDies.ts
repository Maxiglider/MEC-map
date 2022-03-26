

const initMessageHeroDies = () => { // needs Text


// TODO; Used to be private
const MESSAGE_DURATION = 10;
// TODO; Used to be private
const TIME_BETWEEN_DEATH_AND_MESSAGE = 5;
// TODO; Used to be private
let timerSonJoue = CreateTimer();
// TODO; Used to be private
let isSoundPlaying = false;
// TODO; Used to be private
let DUREE_SON = 3;


// TODO; Used to be private
const GetRandomSoundHeroDies = (): sound => {
	let n = GetRandomInt(0, 3);
	if ((n === 0)) {
		return gg_snd_heroDies0;
	} else if ((n === 1)) {
		return gg_snd_heroDies1;
	} else if ((n === 2)) {
		return gg_snd_heroDies2;
	} else {
		return gg_snd_heroDies3;
	}
};


// TODO; Used to be private
const GetRandomSoundAllyHeroDies = (): sound => {
	let n = GetRandomInt(0, 3);
	if ((n === 0)) {
		return gg_snd_allyHeroDies0;
	} else if ((n === 1)) {
		return gg_snd_allyHeroDies1;
	} else if ((n === 2)) {
		return gg_snd_allyHeroDies2;
	} else {
		return gg_snd_allyHeroDies3;
	}
};


// TODO; Used to be private
const SoundEnd = (): void => {
	isSoundPlaying = false;
};


// TODO; Used to be private
const PlaySoundHeroDies = (fallenPlayer: player): void => {
	if ((!isSoundPlaying)) {
		if ((GetLocalPlayer() === fallenPlayer)) {
			StartSound(GetRandomSoundHeroDies())
		} else {
			StartSound(GetRandomSoundAllyHeroDies())
		}
		isSoundPlaying = true;
		TimerStart(timerSonJoue, DUREE_SON, false, SoundEnd)
	}
};



//! textmacro DisplayDeathMessagePlayer_function takes n
// TODO; Used to be private
const DisplayDeathMessagePlayer_$n$ = (): void => {
	PlaySoundHeroDies(Player($n$))
	Text_A_timed(MESSAGE_DURATION, udg_colorCode[$n$] + GetPlayerName(Player($n$)) + "|r has fallen.")
	DestroyTimer(GetExpiredTimer())
};
//! endtextmacro

//! runtextmacro DisplayDeathMessagePlayer_function("0")
//! runtextmacro DisplayDeathMessagePlayer_function("1")
//! runtextmacro DisplayDeathMessagePlayer_function("2")
//! runtextmacro DisplayDeathMessagePlayer_function("3")
//! runtextmacro DisplayDeathMessagePlayer_function("4")
//! runtextmacro DisplayDeathMessagePlayer_function("5")
//! runtextmacro DisplayDeathMessagePlayer_function("6")
//! runtextmacro DisplayDeathMessagePlayer_function("7")
//! runtextmacro DisplayDeathMessagePlayer_function("8")
//! runtextmacro DisplayDeathMessagePlayer_function("9")
//! runtextmacro DisplayDeathMessagePlayer_function("10")
//! runtextmacro DisplayDeathMessagePlayer_function("11")


const DisplayDeathMessagePlayer = (p: player): void => {
	let n = GetPlayerId(p);
	//! textmacro RunDisplayDeathMessagePlayer takes n
	if ((n === $n$)) {
		TimerStart(CreateTimer(), TIME_BETWEEN_DEATH_AND_MESSAGE, false, DisplayDeathMessagePlayer_$n$)
	}
	//! endtextmacro

	//! runtextmacro RunDisplayDeathMessagePlayer("0")
	//! runtextmacro RunDisplayDeathMessagePlayer("1")
	//! runtextmacro RunDisplayDeathMessagePlayer("2")
	//! runtextmacro RunDisplayDeathMessagePlayer("3")
	//! runtextmacro RunDisplayDeathMessagePlayer("4")
	//! runtextmacro RunDisplayDeathMessagePlayer("5")
	//! runtextmacro RunDisplayDeathMessagePlayer("6")
	//! runtextmacro RunDisplayDeathMessagePlayer("7")
	//! runtextmacro RunDisplayDeathMessagePlayer("8")
	//! runtextmacro RunDisplayDeathMessagePlayer("9")
	//! runtextmacro RunDisplayDeathMessagePlayer("10")
	//! runtextmacro RunDisplayDeathMessagePlayer("11")
};



}
