import { MonsterOrCaster } from './MonsterOrCaster'

export class MonsterOrCasterStack {
    private monsterOrCaster: MonsterOrCaster | null = null
    private nextElement: MonsterOrCasterStack | null = null
    private udg_enumMoc: MonsterOrCaster | null = null

    constructor(monsterOrCaster: MonsterOrCaster) {
        if (monsterOrCaster === null) {
            throw new Error('monsterOrCaster cannot be null')
        }

        this.monsterOrCaster = monsterOrCaster
    }

    addMonsterOrCaster = (monsterOrCaster: MonsterOrCaster) => {
        let newElement: MonsterOrCasterStack
        if (monsterOrCaster === null) {
            return false
        }
        newElement = this.create(this.monsterOrCaster)
        newElement.nextElement = this.nextElement
        this.monsterOrCaster = monsterOrCaster
        this.nextElement = newElement
        return true
    }

    destroy = () => {
        if (this.monsterOrCaster !== null) {
            this.monsterOrCaster.destroy()
        }

        if (this.nextElement !== null) {
            this.nextElement.destroy()
        }
    }

    executeForAll = (functionName: string) => {
        this.udg_enumMoc = this.monsterOrCaster
        ExecuteFunc(functionName)
        if (this.nextElement !== null) {
            this.nextElement.executeForAll(functionName)
        }
    }

    GetEnumMoc = () => this.udg_enumMoc

    containsMob = (mobId: number): boolean => {
        if (this.monsterOrCaster != null && this.monsterOrCaster.getId() == mobId) {
            return true
        } else if (this.nextElement !== null) {
            return this.nextElement.containsMob(mobId)
        } else {
            return false
        }
    }

    getLast = () => this.monsterOrCaster

    removeLast = () => {
        let oldNextElement = this.nextElement
        if (this.monsterOrCaster === null) {
            return false
        }
        this.monsterOrCaster.destroy()
        if (this.nextElement !== null) {
            this.monsterOrCaster = this.nextElement!.getLast()!.copy()
            this.nextElement = this.nextElement.nextElement
            this.nextElement!.nextElement = null
            this.nextElement!.destroy()
        } else {
            this.monsterOrCaster = null
        }
        return true
    }
}
