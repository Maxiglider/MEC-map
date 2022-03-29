class MonsterSpawnArray {
    //50 levels * 100 monster spawns

    private monsterSpawns: MonsterSpawn[]
    private lastInstance = -1

    getFirstEmpty = (): number => {
        let i = 0
        while (true) {
            if (i > this.lastInstance || this.monsterSpawns[i] === 0) break
            i = i + 1
        }
        return i
    }

    get = (arrayId: number): MonsterSpawn => {
        if (arrayId < 0 || arrayId > this.lastInstance) {
            return 0
        }
        return this.monsterSpawns[arrayId]
    }

    getFromLabel = (label: string): MonsterSpawn => {
        let i = 0
        while (true) {
            if (i > this.lastInstance) break
            if (this.monsterSpawns[i].getLabel() == label) {
                return this.monsterSpawns[i]
            }
            i = i + 1
        }
        return 0
    }

    getLastInstanceId = (): number => {
        return this.lastInstance
    }

    new = (
        label: string,
        mt: MonsterType,
        sens: string,
        frequence: number,
        x1: number,
        y1: number,
        x2: number,
        y2: number,
        activate: boolean
    ): MonsterSpawn => {
        //local integer n = this.getFirstEmpty()
        let n = this.lastInstance + 1
        if (n >= MAX_NB_MONSTERS) {
            return 0
        }
        if (this.getFromLabel(label) !== 0) {
            return 0
        }
        //if (n > this.lastInstance) then
        this.lastInstance = n
        //endif
        this.monsterSpawns[n] = new MonsterSpawn(label, mt, sens, frequence, x1, y1, x2, y2)
        if (activate) {
            this.monsterSpawns[n].activate()
        }
        this.monsterSpawns[n].level = udg_levels.getLevelFromMonsterSpawnArray(this)
        this.monsterSpawns[n].arrayId = n
        return this.monsterSpawns[n]
    }

    count = (): number => {
        let n = 0
        let i = 0
        while (true) {
            if (i > this.lastInstance) break
            if (this.monsterSpawns[i] !== 0) {
                n = n + 1
            }
            i = i + 1
        }
        return n
    }

    destroy = () => {
        let i = 0
        while (true) {
            if (i > this.lastInstance) break
            if (this.monsterSpawns[i] !== 0) {
                this.monsterSpawns[i].destroy()
            }
            i = i + 1
        }
        this.lastInstance = -1
    }

    setMonsterSpawnNull = (monsterSpawnArrayId: number) => {
        this.monsterSpawns[monsterSpawnArrayId] = 0
    }

    clearMonsterSpawn = (label: string): boolean => {
        let ms = this.getFromLabel(label)
        if (ms !== 0) {
            ms.destroy()
            ms = 0
            return true
        } else {
            return false
        }
    }

    // TODO; Used to be public
    setMonsterType = (label: string, mt: MonsterType): boolean => {
        let ms = this.getFromLabel(label)
        if (ms === 0) {
            return false
        }
        ms.setMonsterType(mt)
        return true
    }

    // TODO; Used to be public
    setSens = (label: string, sens: string): boolean => {
        let ms = this.getFromLabel(label)
        if (ms === 0) {
            return false
        }
        ms.setSens(sens)
        return true
    }

    // TODO; Used to be public
    setFrequence = (label: string, frequence: number): boolean => {
        let ms = this.getFromLabel(label)
        if (ms === 0) {
            return false
        }
        ms.setFrequence(frequence)
        return true
    }

    // TODO; Used to be public
    activate = () => {
        let i = 0
        while (true) {
            if (i > this.lastInstance) break
            if (this.monsterSpawns[i] !== 0) {
                this.monsterSpawns[i].activate()
            }
            i = i + 1
        }
    }

    // TODO; Used to be public
    desactivate = () => {
        let i = 0
        while (true) {
            if (i > this.lastInstance) break
            if (this.monsterSpawns[i] !== 0) {
                this.monsterSpawns[i].desactivate()
            }
            i = i + 1
        }
    }

    displayForPlayer = (p: player) => {
        let nbMs = 0
        let i = 0
        while (true) {
            if (i > this.lastInstance) break
            if (this.monsterSpawns[i] !== 0) {
                this.monsterSpawns[i].displayForPlayer(p)
                nbMs = nbMs + 1
            }
            i = i + 1
        }
        if (nbMs === 0) {
            Text.erP(p, 'no monster spawn for this level')
        }
    }

    changeLabel = (oldLabel: string, newLabel: string): boolean => {
        if (this.getFromLabel(oldLabel) === 0 || this.getFromLabel(newLabel) !== 0) {
            return false
        }
        this.getFromLabel(oldLabel).setLabel(newLabel)
        return true
    }
}
