import { Constants } from 'core/01_libraries/Constants'
import { Caster } from 'core/04_STRUCTURES/Caster/Caster'
import { MonsterNoMove } from 'core/04_STRUCTURES/Monster/MonsterNoMove'
import { ChangeTerrainType } from 'core/07_TRIGGERS/Modify_terrain_Functions/Modify_terrain_functions'
import { getUdgLevels, globals } from '../../globals'

const initThemeUtils = () => {
    // Terrain order is based on how its saved in WE, all newly loaded terrains overrule all others
    const availableThemes = {
        fullskill: {
            // death < slide < walk
            terrainOrder: ['death', 'slide', 'walk'],
            walkTerrain: 'Lgrd',
            slideTerrain: 'Nice',
            deathTerrain: 'Ywmb',
            monsterSkins: [FourCC('hfoo')],
        },
        murloc: {
            // slide < death < walk
            terrainOrder: ['slide', 'death', 'walk'],
            walkTerrain: 'Yblm',
            slideTerrain: 'Nsnw',
            deathTerrain: 'Avin',
            monsterSkins: [FourCC('nmrl'), FourCC('nmrr'), FourCC('nmfs'), FourCC('nmrm'), FourCC('nmmu')],
        },
        rkr: {
            // death < slide < walk
            terrainOrder: ['death', 'slide', 'walk'],
            walkTerrain: 'Yblm',
            slideTerrain: 'Nice',
            deathTerrain: 'Wsnw',
            monsterSkins: [FourCC('nwwd')],
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

                x = x + Constants.LARGEUR_CASE
            }

            y = y + Constants.LARGEUR_CASE
        }
    }

    let currentTheme: 'fullskill' | 'murloc' | 'rkr' | undefined = undefined
    let appliedMonsterSkins: { [monsterId: number]: number | undefined } = {}
    let customMonsterSkin: number | undefined = undefined // Manually set via -setMonsterSkin

    const applyGameTheme = (target?: 'units' | 'rocks') => {
        if (!currentTheme && !customMonsterSkin) {
            return
        }

        const skinIds = currentTheme ? availableThemes[currentTheme].monsterSkins : []

        for (const [_, level] of pairs(getUdgLevels().getAll())) {
            if (level.isActivated()) {
                for (const [_, monster] of pairs(level.monsters.getAll())) {
                    // Filter by target type
                    const isStationary = monster instanceof MonsterNoMove || monster instanceof Caster
                    const shouldApply =
                        !target || (target === 'rocks' && isStationary) || (target === 'units' && !isStationary)

                    if (monster.u && shouldApply) {
                        // Store original skin (or undefined if not set)
                        if (appliedMonsterSkins[monster.getId()] === undefined) {
                            appliedMonsterSkins[monster.getId()] = monster.getMonsterSkin()
                        }

                        // Apply custom skin if set, otherwise apply theme skin
                        if (customMonsterSkin !== undefined) {
                            monster.setMonsterSkin(customMonsterSkin)
                        } else if (currentTheme) {
                            // Apply random skin from theme
                            const randomSkin = skinIds[GetRandomInt(0, skinIds.length - 1)]
                            monster.setMonsterSkin(randomSkin)
                        }
                    }
                }

                for (const [_, monsterSpawn] of pairs(level.monsterSpawns.getAll())) {
                    monsterSpawn.refresh()
                }
            }
        }
    }

    const getRandomAvailableMonsterSkin = () => {
        if (currentTheme) {
            const skinIds = availableThemes[currentTheme].monsterSkins
            return skinIds[GetRandomInt(0, skinIds.length - 1)]
        }
        return undefined
    }

    return {
        applyGameTheme,
        getRandomAvailableMonsterSkin,
        getCurrentTheme: () => currentTheme,
        setCurrentTheme: (theme: 'fullskill' | 'murloc' | 'rkr' | undefined) => {
            if (!theme) {
                // Restore original skins for all monsters that had theme applied
                for (const [_, level] of pairs(getUdgLevels().getAll())) {
                    if (level.isActivated()) {
                        for (const [_, monster] of pairs(level.monsters.getAll())) {
                            const monsterId = monster.getId()

                            // Only reset if this monster had a theme applied
                            if (appliedMonsterSkins[monsterId] !== undefined || monster.u) {
                                const originalSkin = appliedMonsterSkins[monsterId]

                                if (monster.u) {
                                    // Restore original skin (or undefined if it never had one)
                                    monster.setMonsterSkin(originalSkin)
                                }
                            }
                        }

                        for (const [_, monsterSpawn] of pairs(level.monsterSpawns.getAll())) {
                            monsterSpawn.refresh()
                        }
                    }
                }

                // Clear the applied skins map
                appliedMonsterSkins = {}
            }

            currentTheme = theme
        },
        setCustomMonsterSkin: (skinId: number | undefined) => {
            customMonsterSkin = skinId
        },
        getCustomMonsterSkin: () => customMonsterSkin,
        availableThemes,
        modifyTerrain,
    }
}

export const ThemeUtils = initThemeUtils()
