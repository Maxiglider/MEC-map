import { udg_levels } from 'core/08_GAME/Init_structures/Init_struct_levels'
import {MonsterType} from "../Monster/MonsterType";
import {MonsterSpawn} from "./MonsterSpawn";
import {Level} from "../Level/Level";
import {Text} from "../../01_libraries/Text";


export class MonsterSpawnArray {
    private monsterSpawns: MonsterSpawn[]
    private level: Level

    constructor(level: Level) {
        this.level = level
        this.monsterSpawns = []
    }

    get = (arrayId: number): MonsterSpawn => {
        return this.monsterSpawns[arrayId]
    }

    getFromLabel = (label: string): MonsterSpawn | null => {
        const filteredMS = this.monsterSpawns.filter(ms => (
            ms.getLabel() === label
        ))

        if(filteredMS.length > 0){
            return filteredMS[0]
        }else{
            return null
        }
    }

    new(monsterSpawn: MonsterSpawn, activate: boolean) {
        const n = monsterSpawn.getId()
        this.monsterSpawns[n] = monsterSpawn

        if (activate) {
            monsterSpawn.activate()
        }
        monsterSpawn.level = this.level
    }

    count = (): number => {
        return this.monsterSpawns.filter(ms => ms !== undefined).length
    }

    destroy = () => {
        this.monsterSpawns.map(ms => {
            ms && ms.destroy()
        })
    }

    removeMonsterSpawn = (monsterSpawnId: number) => {
        delete this.monsterSpawns[monsterSpawnId]
    }

    clearMonsterSpawn = (label: string): boolean => {
        let ms = this.getFromLabel(label)
        if (ms) {
            delete this.monsterSpawns[ms.getId()]
            ms.destroy()
            return true
        } else {
            return false
        }
    }

    setMonsterType = (label: string, mt: MonsterType): boolean => {
        let ms = this.getFromLabel(label)
        if (ms) {
            ms.setMonsterType(mt)
            return true
        }else{
            return false
        }
    }

    setSens = (label: string, sens: string): boolean => {
        let ms = this.getFromLabel(label)
        if (ms) {
            ms.setSens(sens)
            return true
        }else{
            return false
        }
    }

    setFrequence = (label: string, frequence: number): boolean => {
        let ms = this.getFromLabel(label)
        if (ms) {
            ms.setFrequence(frequence)
            return true
        }else{
            return false
        }
    }

    activate = () => {
        this.monsterSpawns.map(ms => {
            ms && ms.activate()
        })
    }

    deactivate = () => {
        this.monsterSpawns.map(ms => {
            ms && ms.deactivate()
        })
    }

    displayForPlayer = (p: player) => {
        let nbMs = this.count()
        if(nbMs == 0){
            Text.erP(p, 'no monster spawn for this level')
        }else{
            this.monsterSpawns.map(ms => {
                ms && ms.displayForPlayer(p)
            })
        }
    }

    changeLabel = (oldLabel: string, newLabel: string): boolean => {
        const msWithOldLabel = this.getFromLabel(oldLabel)
        const msWithNewLabel = this.getFromLabel(newLabel)

        if(!msWithOldLabel || msWithNewLabel){
            return false
        }

        msWithOldLabel.setLabel(newLabel)

        return true
    }
}
