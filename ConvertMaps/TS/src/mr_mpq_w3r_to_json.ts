import { readFileSync } from 'fs'

const getCenter = (a: number, b: number) => {
    return Math.round((a + b) / 2)
}

// itemmake/wispmake number = global item id
// nagamake/nagastrongmake number = facing
// patrolc number = skin id

const lvlsData: {
    levels: {
        [nbLvl: string]: (
            | ['patrol', string, string] // reg 1, reg 2
            | ['bigvines', string] // reg 1
            | ['vines', string] // reg 1
            | ['wispmake', string, string] // reg 1, useless id
            | ['itemmake', string, string] // useless id, reg 1
            | ['nagastrongmake', string, string] // reg 1, facing
            | ['nagamake', string, string] // reg 1, facing
            | ['smallvines', string] // reg 1
            | ['patrolc', string, string, string] // reg 1, reg 2, skin id
            | ['SpawnHorizontalRandom', string, string, string] // reg 1, reg 2, facing
            // reg 1, reg 2, facing, skin id
            | ['SpawnHorizontal', string, string, string, string]
        )[]
    }
    regions: { [lbRegion: string]: [string, string, string, string] }
} = JSON.parse(readFileSync(__dirname + '/../../Other/murloc_revenge_remixed/combined.json').toString())

const initMain = () => {
    const regionMap: { [name: string]: { position: { left: number; right: number; top: number; bottom: number } } } = {}

    for (const [name, region] of Object.entries(lvlsData.regions)) {
        regionMap[name] = {
            position: {
                left: Number(region[0]),
                top: Number(region[1]),
                right: Number(region[2]),
                bottom: Number(region[3]),
            },
        }
    }

    const mecOutput: {
        levels: {
            id: number
            monsters: (
                | {
                      id: number
                      y2: number
                      x2: number
                      monsterClassName: 'MonsterSimplePatrol'
                      x1: number
                      monsterTypeLabel: string
                      y1: number
                  }
                | {
                      id: number
                      monsterClassName: 'MonsterNoMove'
                      x: number
                      monsterTypeLabel: string
                      y: number
                      angle?: number
                  }
            )[]
        }[]
    } = { levels: [] }

    let monsterId = 0

    const getOrCreateLevel = (id: number) => {
        let level = mecOutput.levels.find(l => l.id === id)

        if (!level) {
            level = { id, monsters: [] }
            mecOutput.levels.push(level)
        }

        return level
    }

    for (const [_lvl, lvlData] of Object.entries(lvlsData.levels)) {
        const lvl = Number(_lvl) - 1

        for (const row of lvlData) {
            switch (row[0]) {
                case 'patrol':
                case 'SpawnHorizontal':
                case 'SpawnHorizontalRandom': {
                    const a = regionMap[row[1]]
                    const b = regionMap[row[2]]

                    if (a && b) {
                        getOrCreateLevel(lvl).monsters.push({
                            id: monsterId++,
                            monsterClassName: 'MonsterSimplePatrol',
                            monsterTypeLabel: row[0],
                            x1: getCenter(a.position.left, a.position.right),
                            y1: getCenter(a.position.top, a.position.bottom),
                            x2: getCenter(b.position.left, b.position.right),
                            y2: getCenter(b.position.top, b.position.bottom),
                        })
                    }

                    break
                }

                case 'patrolc': {
                    const a = regionMap[row[1]]
                    const b = regionMap[row[2]]
                    const skinId = row[3]

                    if (a && b) {
                        getOrCreateLevel(lvl).monsters.push({
                            id: monsterId++,
                            monsterClassName: 'MonsterSimplePatrol',
                            monsterTypeLabel: 'patrolc' + skinId,
                            x1: getCenter(a.position.left, a.position.right),
                            y1: getCenter(a.position.top, a.position.bottom),
                            x2: getCenter(b.position.left, b.position.right),
                            y2: getCenter(b.position.top, b.position.bottom),
                        })
                    }

                    break
                }

                case 'bigvines':
                case 'smallvines':
                case 'vines': {
                    const a = regionMap[row[1]]

                    if (a) {
                        getOrCreateLevel(lvl).monsters.push({
                            id: monsterId++,
                            monsterClassName: 'MonsterNoMove',
                            monsterTypeLabel: row[0],
                            x: getCenter(a.position.left, a.position.right),
                            y: getCenter(a.position.top, a.position.bottom),
                        })
                    }

                    break
                }

                case 'wispmake': {
                    const a = regionMap[row[1]]

                    if (a) {
                        getOrCreateLevel(lvl).monsters.push({
                            id: monsterId++,
                            monsterClassName: 'MonsterNoMove',
                            monsterTypeLabel: row[0],
                            x: getCenter(a.position.left, a.position.right),
                            y: getCenter(a.position.top, a.position.bottom),
                        })
                    }

                    break
                }

                case 'itemmake': {
                    const a = regionMap[row[2]]

                    if (a) {
                        getOrCreateLevel(lvl).monsters.push({
                            id: monsterId++,
                            monsterClassName: 'MonsterNoMove',
                            monsterTypeLabel: row[0],
                            x: getCenter(a.position.left, a.position.right),
                            y: getCenter(a.position.top, a.position.bottom),
                        })
                    }

                    break
                }

                case 'nagamake':
                case 'nagastrongmake': {
                    const a = regionMap[row[1]]
                    const facing = row[2]

                    if (a) {
                        getOrCreateLevel(lvl).monsters.push({
                            id: monsterId++,
                            monsterClassName: 'MonsterNoMove',
                            monsterTypeLabel: row[0],
                            x: getCenter(a.position.left, a.position.right),
                            y: getCenter(a.position.top, a.position.bottom),
                            angle: Number(facing),
                        })
                    }

                    break
                }

                default:
                    throw new Error('Unknown row type: ' + row[0])
            }
        }
    }

    // console.log(mecOutput.levels)
    console.log(JSON.stringify(mecOutput))
}

initMain()
