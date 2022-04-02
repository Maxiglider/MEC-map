import { Level } from '../Level/Level'
import { MONSTER_NEAR_DIFF_MAX } from '../Monster/MonsterArray'
import { Meteor } from './Meteor'
import {IsItemBetweenLocs, IsUnitBetweenLocs} from "../../01_libraries/Basic_functions";

export class MeteorArray {
    private meteors: Meteor[]
    private level: Level

    constructor(level: Level) {
        this.level = level
        this.meteors = []
    }

    get = (meteorId: number) => {
        return this.meteors[meteorId]
    }

    new = (meteor: Meteor, createMeteor: boolean) => {
        const n = meteor.getId()
        this.meteors[n] = meteor

        if (createMeteor) {
            meteor.createMeteorItem()
        }

        meteor.level = this.level
    }

    removeMeteor = (meteorId: number) => {
        //todomax former name : setMeteorNull
        delete this.meteors[meteorId]
    }

    count = (): number => {
        return this.meteors.filter(meteor => meteor !== undefined).length
    }

    destroy = () => {
        this.meteors.map(meteor => {
            meteor.destroy()
        })
    }

    clearMeteor = (meteorId: number): boolean => {
        if (this.meteors[meteorId]) {
            this.meteors[meteorId].destroy()
            delete this.meteors[meteorId]
            return true
        } else {
            return false
        }
    }

    createMeteorsItems = () => {
        this.meteors.map(meteor => {
            if (meteor) {
                meteor.createMeteorItem()
            }
        })
    }

    removeMeteorsItems = () => {
        this.meteors.map(meteor => {
            if (meteor) {
                meteor.removeMeteorItem()
            }
        })
    }

    getMeteorNear = (x: number, y: number) => {
        this.meteors.map(meteor => {
            if (meteor) {
                const item = meteor.getItem()
                if (item) {
                    const xMeteor = GetItemX(item)
                    const yMeteor = GetItemY(item)
                    if (RAbsBJ(x - xMeteor) < MONSTER_NEAR_DIFF_MAX && RAbsBJ(y - yMeteor) < MONSTER_NEAR_DIFF_MAX) {
                        return meteor
                    }
                }
            }
        })

        return null
    }

    getMeteorsBetweenLocs(x1: number, y1: number, x2: number, y2: number) {
        return this.meteors.filter(meteor => {
            const item = meteor.getItem()
            if (item) {
                if (IsItemBetweenLocs(item, x1, y1, x2, y2)) {
                    return true
                }
            }

            return false
        })
    }
}
