import { ServiceManager } from 'Services'
import { IDestroyable, MemoryHandler } from 'Utils/MemoryHandler'
import { String2Ascii } from 'core/01_libraries/Ascii'
import { arrayPush } from 'core/01_libraries/Basic_functions'
import { LARGEUR_CASE } from 'core/01_libraries/Constants'
import { udg_colorCode } from 'core/01_libraries/Init_colorCodes'
import { Escaper } from 'core/04_STRUCTURES/Escaper/Escaper'
import { MonsterMultiplePatrols } from 'core/04_STRUCTURES/Monster/MonsterMultiplePatrols'
import { MonsterNoMove } from 'core/04_STRUCTURES/Monster/MonsterNoMove'
import { playerId2colorId } from 'core/06_COMMANDS/COMMANDS_vJass/Command_functions'
import { getUdgLevels, getUdgTerrainTypes, globals } from '../../globals'
import { MonsterSimplePatrol } from '../core/04_STRUCTURES/Monster/MonsterSimplePatrol'

type Point = { x: number; y: number }
type ITileMap = { [x: number]: { [y: number]: number } }

const initProgressionUtils = () => {
    // todo; use memory handler for all; also make const
    let segments: { [segmentIndex: number]: { x: number; y: number }[] } = {}

    let progressionMap: {
        [x: number]: { [y: number]: { levelIndex: number; progression: number } }
    } = {}

    let levelSegments: { [levelIndex: number]: { numSegments: number; segmentsMaxDistance: number } } = {}

    const debugVariables: {
        debug: boolean
        units: unit[]
        textTags: texttag[]
    } = {
        debug: false,
        units: [],
        textTags: [],
    }

    const init = (props?: { debug: 'level' | 'distance' | 'bfs' | 'segment' }) => {
        // clear previous data
        segments = {}
        progressionMap = {}
        levelSegments = {}

        if (debugVariables.debug) {
            for (const u of debugVariables.units) {
                RemoveUnit(u)
            }

            for (const t of debugVariables.textTags) {
                DestroyTextTag(t)
            }

            debugVariables.debug = false
            debugVariables.units = []
            debugVariables.textTags = []
        }

        if (props?.debug) {
            debugVariables.debug = true
        }

        // TODO; use memoryhandler for all
        const tileMap: ITileMap = {}
        const levelMap: ITileMap = {}
        const tts = getUdgTerrainTypes()

        let y = globals.MAP_MIN_Y
        let currentSegment = 0

        while (y <= globals.MAP_MAX_Y) {
            let x = globals.MAP_MIN_X

            while (x <= globals.MAP_MAX_X) {
                const tt = tts.getTerrainType(x, y)

                if (tt && tt.kind === 'slide') {
                    if (!tileMap[x]) tileMap[x] = {}

                    // Order matters, from 'oldest' to 'newest'
                    const a = tileMap[x - LARGEUR_CASE]?.[y - LARGEUR_CASE]
                    const b = tileMap[x]?.[y - LARGEUR_CASE]
                    const c = tileMap[x + LARGEUR_CASE]?.[y - LARGEUR_CASE]
                    const d = tileMap[x - LARGEUR_CASE]?.[y]

                    const newValue = a || b || c || d || ++currentSegment

                    tileMap[x][y] = newValue

                    if (!segments[newValue]) segments[newValue] = []
                    arrayPush(segments[newValue], { x, y })

                    const opts = MemoryHandler.getEmptyArray<number>()

                    arrayPush(opts, a)
                    arrayPush(opts, b)
                    arrayPush(opts, c)
                    arrayPush(opts, d)

                    for (const o of opts) {
                        if (o && newValue !== o) {
                            for (const s of segments[o]) {
                                tileMap[s.x][s.y] = newValue
                                arrayPush(segments[newValue], s)
                            }

                            // segments[o].__destroy()
                            delete segments[o]
                        }
                    }

                    opts.__destroy()
                }

                x = x + LARGEUR_CASE
            }

            y = y + LARGEUR_CASE
        }

        const addLevelMapPoint = (levelIndex: number, x: number, y: number) => {
            const nx = Math.floor(x / LARGEUR_CASE) * LARGEUR_CASE
            const ny = Math.floor(y / LARGEUR_CASE) * LARGEUR_CASE

            if (!levelMap[nx]) levelMap[nx] = {}
            levelMap[nx][ny] = levelIndex

            if (props?.debug === 'level') {
                debugVariables.units.push(CreateUnit(Player(levelIndex), String2Ascii('hfoo'), nx, ny, 0))
            }
        }

        for (const [levelIndex, level] of pairs(getUdgLevels().getAll())) {
            for (const [_, monster] of pairs(level.monsters.getAll())) {
                if (monster instanceof MonsterSimplePatrol) {
                    addLevelMapPoint(levelIndex, (monster.x1 + monster.x2) / 2, (monster.y1 + monster.y2) / 2)
                } else if (monster instanceof MonsterNoMove) {
                    addLevelMapPoint(levelIndex, monster.x, monster.y)
                } else if (monster instanceof MonsterMultiplePatrols) {
                    let prevX = 0
                    let prevY = 0

                    for (let i = 0; i < monster.x.length; i++) {
                        const nextX = monster.x[i]
                        const nextY = monster.y[i]

                        if (i !== 0) {
                            addLevelMapPoint(levelIndex, (prevX + nextX) / 2, (prevY + nextY) / 2)
                        }

                        prevX = nextX
                        prevY = nextY
                    }
                }
            }
        }

        const directions: Point[] = [
            { x: -LARGEUR_CASE, y: 0 },
            { x: LARGEUR_CASE, y: 0 },
            { x: 0, y: -LARGEUR_CASE },
            { x: 0, y: LARGEUR_CASE },
            { x: -LARGEUR_CASE, y: -LARGEUR_CASE },
            { x: -LARGEUR_CASE, y: LARGEUR_CASE },
            { x: LARGEUR_CASE, y: -LARGEUR_CASE },
            { x: LARGEUR_CASE, y: LARGEUR_CASE },
        ]

        const BFS_far = (point: Point, distanceMap?: ITileMap) => {
            const visited = MemoryHandler.getEmptyObject<{ [key: string]: boolean }>()
            visited[`${point.x}_${point.y}`] = true

            const queue = MemoryHandler.getEmptyArray<[Point, number]>()
            arrayPush(queue, [point, 0])

            let farthestPoint = point
            let maxDistance = 0

            while (queue.length > 0) {
                const [currentPoint, distance] = queue.shift() as [Point, number]

                if (distance > maxDistance) {
                    maxDistance = distance
                    farthestPoint = currentPoint
                }

                for (const dir of directions) {
                    const newPoint = { x: currentPoint.x + dir.x, y: currentPoint.y + dir.y }
                    const key = `${newPoint.x}_${newPoint.y}`

                    if (tileMap[newPoint.x]?.[newPoint.y] && !visited[key]) {
                        visited[key] = true
                        const newDistance = distance + 1

                        arrayPush(queue, [newPoint, newDistance])

                        if (distanceMap) {
                            if (!distanceMap[newPoint.x]) distanceMap[newPoint.x] = {}
                            distanceMap[newPoint.x][newPoint.y] = newDistance

                            if (props?.debug === 'distance') {
                                const u = CreateUnit(Player(0), String2Ascii('hfoo'), newPoint.x, newPoint.y, 0)
                                const t = CreateTextTagUnitBJ(
                                    udg_colorCode[playerId2colorId(0)] + `${newDistance}`,
                                    u,
                                    -50,
                                    8,
                                    100,
                                    100,
                                    100,
                                    0
                                )

                                debugVariables.units.push(u)
                                debugVariables.textTags.push(t)
                            }
                        }
                    }
                }
            }

            queue.__destroy()
            visited.__destroy()

            return [farthestPoint, maxDistance] as const
        }

        for (const [_, segment] of pairs(segments)) {
            const distanceMap: ITileMap = {}

            const [farthestPoint, _] = BFS_far(segment[0])
            const [_2, longestDistance] = BFS_far(farthestPoint, distanceMap)

            if (props?.debug === 'bfs') {
                debugVariables.units.push(CreateUnit(Player(0), String2Ascii('hfoo'), segment[0].x, segment[0].y, 0))
                debugVariables.units.push(
                    CreateUnit(Player(1), String2Ascii('hfoo'), farthestPoint.x, farthestPoint.y, 0)
                )
                debugVariables.units.push(CreateUnit(Player(2), String2Ascii('hfoo'), _2.x, _2.y, 0))
            }

            let foundLevelIndex = -1

            for (const tile of segment) {
                const levelIndex = levelMap[tile.x]?.[tile.y]

                if (levelIndex) {
                    foundLevelIndex = levelIndex
                    break
                }
            }

            if (foundLevelIndex !== -1) {
                if (!levelSegments[foundLevelIndex]) {
                    levelSegments[foundLevelIndex] = { numSegments: 0, segmentsMaxDistance: 0 }
                }

                levelSegments[foundLevelIndex].numSegments++
                levelSegments[foundLevelIndex].segmentsMaxDistance += longestDistance

                for (const tile of segment) {
                    const progression = distanceMap[tile.x]?.[tile.y]

                    if (!progression) {
                        continue
                    }

                    if (!progressionMap[tile.x]) progressionMap[tile.x] = {}
                    progressionMap[tile.x][tile.y] = {
                        levelIndex: foundLevelIndex,
                        progression,
                    }

                    if (props?.debug === 'segment') {
                        const u = CreateUnit(Player(foundLevelIndex), String2Ascii('hfoo'), tile.x, tile.y, 0)
                        const t = CreateTextTagUnitBJ(
                            udg_colorCode[playerId2colorId(0)] + `${progression}`,
                            u,
                            -50,
                            8,
                            100,
                            100,
                            100,
                            0
                        )

                        debugVariables.units.push(u)
                        debugVariables.textTags.push(t)
                    }
                }
            }

            // print(`Segment: ${_} distance: ${longestDistance}`)
        }

        ServiceManager.getService('Multiboard').setProgressionEnabled(true)
    }

    // Might be in reversed order since we don't know the slide direction at this point
    const calculatePlayerProgression = (escaper: Escaper) => {
        const hero = escaper.getHero()

        if (!hero) {
            return -1
        }

        const xHero = Math.floor(GetUnitX(hero) / LARGEUR_CASE) * LARGEUR_CASE
        const yHero = Math.floor(GetUnitY(hero) / LARGEUR_CASE) * LARGEUR_CASE

        const heroProgression = progressionMap[xHero]?.[yHero]

        if (!heroProgression) {
            return -1
        }

        if (heroProgression.levelIndex !== getUdgLevels().getCurrentLevel(escaper).id) {
            return -1
        }

        return Math.round(
            (heroProgression.progression / levelSegments[heroProgression.levelIndex].segmentsMaxDistance) * 100
        )
    }

    const progressionState: { [player: number]: { reverse: boolean; progression: number } & IDestroyable } = {}
    const progressionStateLvl: { [player: number]: { progressionLvl: number } & IDestroyable } = {}

    const resetPlayerProgressionState = (escaper: Escaper, resetLvl?: boolean) => {
        if (progressionState[escaper.getId()]) {
            progressionState[escaper.getId()].__destroy()
            delete progressionState[escaper.getId()]
        }

        if (resetLvl && progressionStateLvl[escaper.getId()]) {
            progressionStateLvl[escaper.getId()].__destroy()
            delete progressionStateLvl[escaper.getId()]
        }
    }

    // Doesn't take teleports into consideration (cheat: -t). We don't want this either because its far more likely for a portal at the end of the level which is a valid teleport and you don't want to reverse progression there
    const getPlayerProgression = (escaper: Escaper) => {
        const nextProgression = calculatePlayerProgression(escaper)

        if (!progressionState[escaper.getId()]) {
            progressionState[escaper.getId()] = MemoryHandler.getEmptyObject()
            progressionState[escaper.getId()].reverse = false
            progressionState[escaper.getId()].progression = -1
        }

        if (nextProgression !== -1) {
            if (progressionState[escaper.getId()].progression === -1) {
                progressionState[escaper.getId()].reverse = nextProgression > 50
            }

            progressionState[escaper.getId()].progression = nextProgression
        }

        if (progressionState[escaper.getId()].progression === -1) {
            return 0
        }

        if (progressionState[escaper.getId()].reverse) {
            return 100 - progressionState[escaper.getId()].progression
        } else {
            return progressionState[escaper.getId()].progression
        }
    }

    const getPlayerProgressionLvl = (escaper: Escaper) => {
        if (!progressionStateLvl[escaper.getId()]) {
            progressionStateLvl[escaper.getId()] = MemoryHandler.getEmptyObject()
            progressionStateLvl[escaper.getId()].progressionLvl = -1
        }

        const nextProgression = getPlayerProgression(escaper)

        if (nextProgression > progressionStateLvl[escaper.getId()].progressionLvl) {
            progressionStateLvl[escaper.getId()].progressionLvl = nextProgression
        }

        if (progressionStateLvl[escaper.getId()].progressionLvl === -1) {
            return 0
        }

        return progressionStateLvl[escaper.getId()].progressionLvl
    }

    return { init, getPlayerProgression, getPlayerProgressionLvl, resetPlayerProgressionState }
}

export const progressionUtils = initProgressionUtils()
