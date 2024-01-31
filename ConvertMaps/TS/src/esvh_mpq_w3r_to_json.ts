import { existsSync, readFileSync } from 'fs'
import War3Map from 'mdx-m3-viewer/dist/cjs/parsers/w3x/map'
import { RegionsTranslator } from 'wc3maptranslator'

const getCenter = (a: number, b: number) => {
    return Math.round((a + b) / 2)
}

const lvlData = JSON.parse(readFileSync(__dirname + '/../../Other/Easy_slide_vHardcore/combined.json').toString())

const initMain = () => {
    const targetFile = process.argv[2]

    if (!existsSync(targetFile)) {
        console.log('File does not exist')
        return
    }

    const war3Map = new War3Map()
    war3Map.load(readFileSync(targetFile).buffer)

    const rawRegions = war3Map.get('war3map.w3r')?.arrayBuffer()

    if (!rawRegions) {
        console.log('No regions found')
        return
    }

    const jsonRegions = RegionsTranslator.warToJson(Buffer.from(rawRegions))
    type IRegion = (typeof jsonRegions.json)[0]

    const patrolMap: { [lvl_patrolNr: string]: { lvl: number; patrolNr: number; a?: IRegion; b?: IRegion } } = {}

    for (const region of jsonRegions.json) {
        let lvl = Number(region.name.match(/lvl(\d+)/)?.[1])
        const oldLvl = lvl
        const patrolNr = Number(region.name.match(/grunt (\d+)/)?.[1])

        const isA = region.name.trim().endsWith('a')
        const isB = region.name.trim().endsWith('b')

        if (lvlData[0].includes(region.name.replace(' b', ' a'))) {
            lvl = 0
        } else if (lvlData[1].includes(region.name.replace(' b', ' a'))) {
            lvl = 1
        } else if (lvlData[2].includes(region.name.replace(' b', ' a'))) {
            lvl = 2
        } else if (lvlData[3].includes(region.name.replace(' b', ' a'))) {
            lvl = 3
        } else if (lvlData[4].includes(region.name.replace(' b', ' a'))) {
            lvl = 4
        } else if (lvlData[5].includes(region.name.replace(' b', ' a'))) {
            lvl = 5
        }

        if (!patrolMap[`${oldLvl}_${patrolNr}`]) {
            patrolMap[`${oldLvl}_${patrolNr}`] = { lvl, patrolNr }
        }

        if (isA) {
            patrolMap[`${oldLvl}_${patrolNr}`].a = region
        }

        if (isB) {
            patrolMap[`${oldLvl}_${patrolNr}`].b = region
        }
    }

    const patrols: { lvl: number; x1: number; y1: number; x2: number; y2: number }[] = []

    for (const lvlPatrolNr in patrolMap) {
        const patrol = patrolMap[lvlPatrolNr]

        if (patrol.a && patrol.b) {
            patrols.push({
                lvl: patrol.lvl,
                x1: getCenter(patrol.a.position.left, patrol.a.position.right),
                y1: getCenter(patrol.a.position.top, patrol.a.position.bottom),
                x2: getCenter(patrol.b.position.left, patrol.b.position.right),
                y2: getCenter(patrol.b.position.top, patrol.b.position.bottom),
            })
        }
    }

    const mecOutput: {
        levels: {
            id: number
            monsters: {
                id: number
                y2: number
                x2: number
                monsterClassName: 'MonsterSimplePatrol'
                x1: number
                monsterTypeLabel: 'g'
                y1: number
            }[]
        }[]
    } = { levels: [] }

    let monsterId = 0

    for (const patrol of patrols) {
        let level = mecOutput.levels.find(l => l.id === patrol.lvl)

        if (!level) {
            level = { id: patrol.lvl, monsters: [] }
            mecOutput.levels.push(level)
        }

        level.monsters.push({
            id: monsterId++,
            monsterClassName: 'MonsterSimplePatrol',
            monsterTypeLabel: 'g',
            x1: patrol.x1,
            y1: patrol.y1,
            x2: patrol.x2,
            y2: patrol.y2,
        })
    }

    // console.log(mecOutput.levels)
    console.log(JSON.stringify(mecOutput))
}

initMain()
