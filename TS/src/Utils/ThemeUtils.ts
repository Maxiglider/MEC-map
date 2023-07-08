import { String2Ascii } from 'core/01_libraries/Ascii'
import { arrayPush } from 'core/01_libraries/Basic_functions'
import { LARGEUR_CASE } from 'core/01_libraries/Constants'
import { MonsterType } from 'core/04_STRUCTURES/Monster/MonsterType'
import { ChangeTerrainType } from 'core/07_TRIGGERS/Modify_terrain_Functions/Modify_terrain_functions'
import { getUdgLevels, getUdgMonsterTypes, globals } from '../../globals'

const initThemeUtils = () => {
    // Terrain order is based on how its saved in WE, all newly loaded terrains overrule all others
    const availableThemes = {
        fullskill: {
            // death < slide < walk
            terrainOrder: ['death', 'slide', 'walk'],
            walkTerrain: 'Lgrd',
            slideTerrain: 'Nice',
            deathTerrain: 'Ywmb',
            monsterIds: ['hfoo'],
        },
        murloc: {
            // slide < death < walk
            terrainOrder: ['slide', 'death', 'walk'],
            walkTerrain: 'Yblm',
            slideTerrain: 'Nsnw',
            deathTerrain: 'Avin',
            monsterIds: ['nmrl', 'nmrr', 'nmfs', 'nmrm', 'nmmu'],
        },
    }

    const modifyTerrain = (fromTerrain: number, toTerrain: number) => {
        let y = globals.MAP_MIN_Y

        while (y <= globals.MAP_MAX_Y) {
            let x = globals.MAP_MIN_X

            while (x <= globals.MAP_MAX_X) {
                const tt = GetTerrainType(x, y)

                if (tt === fromTerrain) {
                    ChangeTerrainType(x, y, toTerrain)
                }

                x = x + LARGEUR_CASE
            }

            y = y + LARGEUR_CASE
        }
    }

    let currentTheme: 'fullskill' | 'murloc' | undefined = undefined
    let currentAvailableMonsters: MonsterType[] | undefined = []
    let appliedMonsters: { [monsterId: number]: MonsterType | undefined } = {}

    const applyGameTheme = () => {
        if (!currentTheme) {
            return
        }

        const monsterTypes = getUdgMonsterTypes()
        const availableMonsters: MonsterType[] = []

        for (const i of availableThemes[currentTheme].monsterIds) {
            let cMonster = monsterTypes.getByLabel(`sgt${currentTheme}m${i}`)

            if (!cMonster) {
                cMonster = monsterTypes.new(`sgt${currentTheme}m${i}`, String2Ascii(i), 1, 40, 380, false)
            }

            arrayPush(availableMonsters, cMonster)
        }

        currentAvailableMonsters = availableMonsters

        for (const [_, level] of pairs(getUdgLevels().getAll())) {
            if (level.isActivated()) {
                for (const [_, monster] of pairs(level.monsters.getAll())) {
                    const oldMonsterType = monster.getMonsterType()

                    if (oldMonsterType) {
                        monster.setMonsterType(availableMonsters[GetRandomInt(0, availableMonsters.length - 1)])
                        appliedMonsters[monster.getId()] = oldMonsterType
                    }
                }

                for (const [_, monsterSpawn] of pairs(level.monsterSpawns.getAll())) {
                    monsterSpawn.refresh()
                }
            }
        }
    }

    const getRandomAvailableMonsterType = () => {
        if (currentAvailableMonsters && currentAvailableMonsters?.length > 0) {
            return currentAvailableMonsters[GetRandomInt(0, currentAvailableMonsters.length - 1)]
        }
    }

    return {
        applyGameTheme,
        getRandomAvailableMonsterType,
        getCurrentTheme: () => currentTheme,
        setCurrentTheme: (theme: 'fullskill' | 'murloc' | undefined) => {
            if (!theme) {
                currentAvailableMonsters = undefined

                for (const [_, level] of pairs(getUdgLevels().getAll())) {
                    if (level.isActivated()) {
                        for (const [_, monster] of pairs(level.monsters.getAll())) {
                            const oldMonsterType = appliedMonsters[monster.getId()]

                            if (oldMonsterType) {
                                monster.setMonsterType(oldMonsterType)
                                appliedMonsters[monster.getId()] = undefined
                            }
                        }

                        for (const [_, monsterSpawn] of pairs(level.monsterSpawns.getAll())) {
                            monsterSpawn.refresh()
                        }
                    }
                }
            }

            currentTheme = theme
        },
        availableThemes,
        modifyTerrain,
    }
}

export const ThemeUtils = initThemeUtils()
