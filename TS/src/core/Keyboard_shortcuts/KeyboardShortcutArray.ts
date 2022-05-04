import {BaseArray} from "../04_STRUCTURES/BaseArray";
import {KeyboardShortcut} from "./KeyboardShortcut";
import {Escaper} from "../04_STRUCTURES/Escaper/Escaper";
import {Text} from "../01_libraries/Text";

export class KeyboardShortcutArray extends BaseArray<KeyboardShortcut> {
    private escaper: Escaper

    constructor(escaper: Escaper) {
        super(true);
        this.escaper = escaper
    }
    public displayAll = () => {
        this.forAll((ks, ksId) => {
            Text.mkP(this.escaper.getPlayer(), ksId + " : " + ks.toDisplayString())
        })
    }

    searchByShortcutString(shortcutString: string){
        let output: number | null = null

        this.forAll((ks, ksId) => {
            if(ks.getShortcutString() == shortcutString){
                output = ksId
            }
        })

        return output
    }

    new = (ks: KeyboardShortcut, enable: boolean) => {
        const oldId = this.searchByShortcutString(ks.getShortcutString())
        if(oldId){
            this.destroyOne(oldId)
        }

        this._new(ks)

        if (enable) {
            ks.enableEvent()
        }
    }
}