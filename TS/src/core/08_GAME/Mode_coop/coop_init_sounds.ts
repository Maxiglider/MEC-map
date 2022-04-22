import {SoundPlay3DUnit} from "../../02_bibliotheques_externes/SoundUtils";


export function RunCoopSoundOnHero(hero: unit){
    const coopSound = SoundPlay3DUnit('war3mapImported\\goutte.wav', 280)
    AttachSoundToUnit(coopSound, hero)
    StartSound(coopSound)
    KillSoundWhenDone(coopSound)
}