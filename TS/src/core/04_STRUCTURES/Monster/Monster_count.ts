import {Monster} from "./Monster";
import {MonsterSimplePatrol} from "./MonsterSimplePatrol";
import {MonsterMultiplePatrols} from "./MonsterMultiplePatrols";
import {MonsterNoMove} from "./MonsterNoMove";

export const countMonstersAccordingToMode = (monsters: Monster[], mode?: string) => {
    if (!mode) mode = 'all'

    let filteredMonsters: Monster[] = []
    if (mode == 'all') {
        filteredMonsters = monsters.filter((monster: Monster) => monster !== undefined)
    } else if (mode == 'moving') {
        filteredMonsters = monsters.filter(
            (monster: Monster) => monster instanceof MonsterSimplePatrol || monster instanceof MonsterMultiplePatrols
        )
    } else if (mode == 'not moving') {
        filteredMonsters = monsters.filter((monster: Monster) => monster instanceof MonsterNoMove)
    }

    return filteredMonsters.length
}