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

    new = (ks: KeyboardShortcut, enable: boolean) => {
        this._new(ks)

        if (enable) {
            ks.enableEvent()
        }
    }
}