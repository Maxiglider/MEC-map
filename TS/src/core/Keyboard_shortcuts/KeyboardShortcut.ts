import {createEvent} from "../../Utils/mapUtils";
import {ServiceManager} from "../../Services";
import {Escaper} from "../04_STRUCTURES/Escaper/Escaper";


const string2AcceptedOsKey: {[x: string]: oskeytype} = {
    "0": OSKEY_0,
    "1": OSKEY_1,
    "2": OSKEY_2,
    "3": OSKEY_3,
    "4": OSKEY_4,
    "5": OSKEY_5,
    "6": OSKEY_6,
    "7": OSKEY_7,
    "8": OSKEY_8,
    "9": OSKEY_9,
    "a": OSKEY_A,
    "b": OSKEY_B,
    "c": OSKEY_C,
    "d": OSKEY_D,
    "e": OSKEY_E,
    "f": OSKEY_F,
    "g": OSKEY_G,
    "h": OSKEY_H,
    "i": OSKEY_I,
    "j": OSKEY_J,
    "k": OSKEY_K,
    "l": OSKEY_L,
    "m": OSKEY_M,
    "n": OSKEY_N,
    "o": OSKEY_O,
    "p": OSKEY_P,
    "q": OSKEY_Q,
    "r": OSKEY_R,
    "s": OSKEY_S,
    "t": OSKEY_T,
    "u": OSKEY_U,
    "v": OSKEY_V,
    "w": OSKEY_W,
    "x": OSKEY_X,
    "y": OSKEY_Y,
    "z": OSKEY_Z,
}

const string2AllowedKeyModifier: {[x: string]: number} = {
    "c": 2, //ctrl
    "s": 1, //shift
}

const keyModifier2String: {[x: number] : string} = {
    0: "",
    1: "S",
    2: "C",
    3: "CS"
}


const shortcutKeyDefinitionErrorMsg = "wrong shortcut key"

export class KeyboardShortcut{
    private escaper: Escaper
    private shortcutString: string
    private command: string

    private shortcutKey: oskeytype
    private shortcutKeyStr: string
    private shortcutKeyModifier: number

    private event: trigger | null = null

    constructor(escaper: Escaper, shortcutString: string, command: string) {
        //find the key and modifier according to shortcut string
        shortcutString = shortcutString.toLowerCase()
        const len = shortcutString.length

        let charKey: string = ""
        let modifier: number = 0

        if(len == 1){
            charKey = shortcutString
        }else if(len == 2 || len == 3){
            charKey = shortcutString[len - 1]

            const modifiersStr = shortcutString.substring(0,  len - 1).split('')
            for(let modifierStr of modifiersStr){
                if(!string2AllowedKeyModifier[modifierStr]){
                    throw shortcutKeyDefinitionErrorMsg
                }

                modifier += string2AllowedKeyModifier[modifierStr]
            }
        }

        if(!string2AcceptedOsKey[charKey]){
            throw shortcutKeyDefinitionErrorMsg
        }

        if(command.length == 0) {
            throw "you need a command for your shortcut"
        }


        this.escaper = escaper
        this.shortcutString = shortcutString
        this.shortcutKeyStr = charKey
        this.command = (command.substring(0, 1) == '-' ? '' : '-') + command
        this.shortcutKey = string2AcceptedOsKey[charKey]
        this.shortcutKeyModifier = modifier
    }

    enableEvent = () => {
        this.event && DestroyTrigger(this.event)

        this.event = createEvent({
            events: [t => {
                BlzTriggerRegisterPlayerKeyEvent(t, this.escaper.getPlayer(), this.shortcutKey, this.shortcutKeyModifier, false)
            }],
            actions: [() => {
                const { ExecuteCommand } = ServiceManager.getService('Cmd')
                ExecuteCommand(this.escaper, this.command)
            }]
        })
    }

    disableEvent = () => {
        this.event && DestroyTrigger(this.event)
    }

    destroy = () => {
        this.disableEvent()
    }

    toDisplayString = () => {
        return keyModifier2String[this.shortcutKeyModifier] + this.shortcutKeyStr + " : " + this.command
    }

    toJson = () => ({
        //useless but mandatory due to BaseArray implementation
    })
}