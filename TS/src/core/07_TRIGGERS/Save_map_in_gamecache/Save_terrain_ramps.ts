import { IsNearBounds } from 'core/01_libraries/Basic_functions'
import { Constants, LARGEUR_CASE } from 'core/01_libraries/Constants'
import { Text } from 'core/01_libraries/Text'
import { SaveMapInCache } from './SAVE_MAP_in_cache'
import { SaveWater } from './Save_water'
import { StringArrayForCache } from './struct_StringArrayForCache'

const initSaveTerrainRamps = () => {
    let y: number
    let ramps: boolean[] = []
    const DECAL_TEST_PATH = 10

    /*
takes a ramp (ramp center + direction of the ramp)
returns if the ramp middle is raised
a ramp middle is not raised in some cases, depending of the cliff level around the ramp :
here is the ramp : (R = ramp tilepoint, N = near ramp tilepoint, T = basic tilepoint)
TNNNT
TRRRT
TNNNT
the middle R is at cliff level CL
if one of the N tilepoints is at a cliff level different than CL or CL+1, the ramp middle isn't raised
*/

    const isRampMiddleRaised = (x: number, y: number, isRampDirectionX: boolean): boolean => {
        let middleRampcliffLevel = GetTerrainCliffLevel(x, y)
        let diffCliffLevel: number
        let sens = -1
        let diff: number
        let x2: number
        let y2: number
        let isRampMiddleRaisedB = true

        //call CreateUnit(Player(0), 'hpea', x, y, 0)

        while (true) {
            if (sens > 1) break
            diff = -1
            while (true) {
                if (diff > 1) break
                if (isRampDirectionX) {
                    x2 = x + diff * LARGEUR_CASE
                    y2 = y + sens * LARGEUR_CASE
                } else {
                    x2 = x + sens * LARGEUR_CASE
                    y2 = y + diff * LARGEUR_CASE
                }
                diffCliffLevel = GetTerrainCliffLevel(x2, y2) - middleRampcliffLevel
                if (diffCliffLevel < 0 || diffCliffLevel > 1) {
                    isRampMiddleRaisedB = false
                }
                diff = diff + 1
            }
            sens = sens + 2
        }

        return isRampMiddleRaisedB
    }

    //save terrain ramps
    const SaveTerrainRamps_Actions = () => {
        let x: number
        let currentCliffLevel: number
        let otherCliffLevel: number
        let otherCliffLevel2: number
        let otherX: number
        let otherY: number
        let ramp: boolean
        let isRampMiddleRaisedB: boolean = false
        let rampStr: string
        let walkable: boolean
        let walkable2: boolean
        let loc1: location | null
        let loc2: location | null
        let signX: number
        let signY: number

        if (y <= Constants.MAP_MAX_Y) {
            x = Constants.MAP_MIN_X
            while (true) {
                if (x > Constants.MAP_MAX_X) break
                ramp = false

                if (!IsNearBounds(x, y)) {
                    currentCliffLevel = GetTerrainCliffLevel(x, y)
                    isRampMiddleRaisedB = false

                    if (!isRampMiddleRaisedB) {
                        //droite
                        otherX = x + LARGEUR_CASE
                        otherY = y
                        if (otherX <= Constants.MAP_MAX_X) {
                            otherCliffLevel = GetTerrainCliffLevel(otherX, otherY)

                            otherX = x + LARGEUR_CASE / 2
                            walkable =
                                !IsTerrainPathable(otherX, otherY + DECAL_TEST_PATH, PATHING_TYPE_WALKABILITY) ||
                                !IsTerrainPathable(otherX, otherY - DECAL_TEST_PATH, PATHING_TYPE_WALKABILITY)

                            if (currentCliffLevel !== otherCliffLevel) {
                                //il y a une falaise entre les deux ; si c'est walkable malgré tout, c'est qu'il y a une rampe
                                if (walkable) {
                                    ramp = true
                                } else if (IAbsBJ(currentCliffLevel - otherCliffLevel) === 1) {
                                    //ce n'est pas walkable, mais il y a peut-être une rampe, de largeur 1
                                    //si ce n'est pas walkable non plus en bas de la falaise, c'est qu'il y a une rampe
                                    if (currentCliffLevel > otherCliffLevel) {
                                        otherX = x + (3 * LARGEUR_CASE) / 2
                                    } else {
                                        otherX = x - LARGEUR_CASE / 2
                                    }
                                    walkable2 =
                                        !IsTerrainPathable(
                                            otherX,
                                            otherY + DECAL_TEST_PATH,
                                            PATHING_TYPE_WALKABILITY
                                        ) ||
                                        !IsTerrainPathable(otherX, otherY - DECAL_TEST_PATH, PATHING_TYPE_WALKABILITY)
                                    if (!walkable2) {
                                        //il y a une rampe à condition que les deux points en bas de la falaise soient au même niveau de falaise et pas à la même hauteur
                                        if (currentCliffLevel < otherCliffLevel) {
                                            loc1 = Location(x, y)
                                            loc2 = Location(x - LARGEUR_CASE, y)
                                        } else {
                                            loc1 = Location(otherX, y)
                                            loc2 = Location(otherX + LARGEUR_CASE, y)
                                        }
                                        if (
                                            GetLocationZ(loc1) !== GetLocationZ(loc2) &&
                                            GetTerrainCliffLevelBJ(loc1) === GetTerrainCliffLevelBJ(loc2)
                                        ) {
                                            ramp = true
                                        }
                                        RemoveLocation(loc1)
                                        RemoveLocation(loc2)
                                    }
                                }
                                //s'il y a une rampe, on détermine si on est au milieu de la rampe
                                if (ramp) {
                                    if (currentCliffLevel < otherCliffLevel) {
                                        isRampMiddleRaisedB = isRampMiddleRaised(x, y, true)
                                    }
                                }
                            } else {
                                //il n'y a pas de falaise entre les deux ; si ce n'est pas walkable, il y a une rampe de largeur 1 s'il y a une falaise ensuite vers le haut de différence 1
                                if (!walkable) {
                                    otherX = x + LARGEUR_CASE * 2
                                    otherCliffLevel2 = GetTerrainCliffLevel(otherX, otherY)
                                    if (otherCliffLevel2 - currentCliffLevel === 1) {
                                        //il y a une rampe sauf si les deux points en bas de la falaise sont à la même hauteur
                                        loc1 = Location(x, y)
                                        loc2 = Location(x + LARGEUR_CASE, y)
                                        if (GetLocationZ(loc1) !== GetLocationZ(loc2)) {
                                            ramp = true
                                        }
                                        RemoveLocation(loc1)
                                        RemoveLocation(loc2)
                                    }
                                } else {
                                    //il peut y avoir une rampe s'il y a une falaise juste après, vers le haut et walkable
                                    otherX = x + LARGEUR_CASE * 2
                                    if (otherX <= Constants.MAP_MAX_X) {
                                        otherCliffLevel2 = GetTerrainCliffLevel(otherX, otherY)
                                        if (currentCliffLevel < otherCliffLevel2) {
                                            otherX = otherX - LARGEUR_CASE / 2
                                            walkable2 =
                                                !IsTerrainPathable(
                                                    otherX,
                                                    otherY + DECAL_TEST_PATH,
                                                    PATHING_TYPE_WALKABILITY
                                                ) ||
                                                !IsTerrainPathable(
                                                    otherX,
                                                    otherY - DECAL_TEST_PATH,
                                                    PATHING_TYPE_WALKABILITY
                                                )
                                            if (walkable2) {
                                                ramp = true
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }

                    if (!isRampMiddleRaisedB) {
                        //gauche
                        otherX = x - LARGEUR_CASE
                        otherY = y
                        if (otherX >= Constants.MAP_MIN_X) {
                            otherCliffLevel = GetTerrainCliffLevel(otherX, otherY)

                            otherX = x - LARGEUR_CASE / 2
                            walkable =
                                !IsTerrainPathable(otherX, otherY + DECAL_TEST_PATH, PATHING_TYPE_WALKABILITY) ||
                                !IsTerrainPathable(otherX, otherY - DECAL_TEST_PATH, PATHING_TYPE_WALKABILITY)

                            if (currentCliffLevel !== otherCliffLevel) {
                                //il y a une falaise entre les deux ; si c'est walkable malgré tout, c'est qu'il y a une rampe
                                if (walkable) {
                                    ramp = true
                                } else if (IAbsBJ(currentCliffLevel - otherCliffLevel) === 1) {
                                    //ce n'est pas walkable, mais il y a peut-être une rampe, de largeur 1
                                    //si ce n'est pas walkable non plus en bas de la falaise, c'est qu'il y a une rampe
                                    if (currentCliffLevel > otherCliffLevel) {
                                        otherX = x - (3 * LARGEUR_CASE) / 2
                                    } else {
                                        otherX = x + LARGEUR_CASE / 2
                                    }
                                    walkable2 =
                                        !IsTerrainPathable(
                                            otherX,
                                            otherY + DECAL_TEST_PATH,
                                            PATHING_TYPE_WALKABILITY
                                        ) ||
                                        !IsTerrainPathable(otherX, otherY - DECAL_TEST_PATH, PATHING_TYPE_WALKABILITY)
                                    if (!walkable2) {
                                        //il y a une rampe à condition que les deux points en bas de la falaise soient au même niveau de falaise et pas à la même hauteur
                                        if (currentCliffLevel < otherCliffLevel) {
                                            loc1 = Location(x, y)
                                            loc2 = Location(x + LARGEUR_CASE, y)
                                        } else {
                                            loc1 = Location(otherX, y)
                                            loc2 = Location(otherX - LARGEUR_CASE, y)
                                        }
                                        if (
                                            GetLocationZ(loc1) !== GetLocationZ(loc2) &&
                                            GetTerrainCliffLevelBJ(loc1) === GetTerrainCliffLevelBJ(loc2)
                                        ) {
                                            ramp = true
                                        }
                                        RemoveLocation(loc1)
                                        RemoveLocation(loc2)
                                    }
                                }
                                //s'il y a une rampe, on détermine si on est au milieu de la rampe
                                if (ramp) {
                                    if (currentCliffLevel < otherCliffLevel) {
                                        isRampMiddleRaisedB = isRampMiddleRaised(x, y, true)
                                    }
                                }
                            } else {
                                //il n'y a pas de falaise entre les deux ; si ce n'est pas walkable, il y a une rampe de largeur 1 s'il y a une falaise ensuite vers le haut de différence 1
                                if (!walkable) {
                                    otherX = x - LARGEUR_CASE * 2
                                    otherCliffLevel2 = GetTerrainCliffLevel(otherX, otherY)
                                    if (otherCliffLevel2 - currentCliffLevel === 1) {
                                        //il y a une rampe sauf si les deux points en bas de la falaise sont à la même hauteur
                                        loc1 = Location(x, y)
                                        loc2 = Location(x - LARGEUR_CASE, y)
                                        if (GetLocationZ(loc1) !== GetLocationZ(loc2)) {
                                            ramp = true
                                        }
                                        RemoveLocation(loc1)
                                        RemoveLocation(loc2)
                                    }
                                } else {
                                    //il peut y avoir une rampe s'il y a une falaise juste après, vers le haut et walkable
                                    otherX = x - LARGEUR_CASE * 2
                                    if (otherX >= Constants.MAP_MIN_X) {
                                        otherCliffLevel2 = GetTerrainCliffLevel(otherX, otherY)
                                        if (currentCliffLevel < otherCliffLevel2) {
                                            otherX = otherX + LARGEUR_CASE / 2
                                            walkable2 =
                                                !IsTerrainPathable(
                                                    otherX,
                                                    otherY + DECAL_TEST_PATH,
                                                    PATHING_TYPE_WALKABILITY
                                                ) ||
                                                !IsTerrainPathable(
                                                    otherX,
                                                    otherY - DECAL_TEST_PATH,
                                                    PATHING_TYPE_WALKABILITY
                                                )
                                            if (walkable2) {
                                                ramp = true
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }

                    if (!isRampMiddleRaisedB) {
                        //haut
                        otherX = x
                        otherY = y + LARGEUR_CASE
                        if (otherY <= Constants.MAP_MAX_Y) {
                            otherCliffLevel = GetTerrainCliffLevel(otherX, otherY)

                            otherY = y + LARGEUR_CASE / 2
                            walkable =
                                !IsTerrainPathable(otherX + DECAL_TEST_PATH, otherY, PATHING_TYPE_WALKABILITY) ||
                                !IsTerrainPathable(otherX - DECAL_TEST_PATH, otherY, PATHING_TYPE_WALKABILITY)

                            if (currentCliffLevel !== otherCliffLevel) {
                                //il y a une falaise entre les deux ; si c'est walkable malgré tout, c'est qu'il y a une rampe
                                if (walkable) {
                                    ramp = true
                                } else if (IAbsBJ(currentCliffLevel - otherCliffLevel) === 1) {
                                    //ce n'est pas walkable, mais il y a peut-être une rampe, de largeur 1
                                    //si ce n'est pas walkable non plus en bas de la falaise, c'est qu'il y a une rampe
                                    if (currentCliffLevel > otherCliffLevel) {
                                        otherY = y + (3 * LARGEUR_CASE) / 2
                                    } else {
                                        otherY = y - LARGEUR_CASE / 2
                                    }
                                    walkable2 =
                                        !IsTerrainPathable(
                                            otherX + DECAL_TEST_PATH,
                                            otherY,
                                            PATHING_TYPE_WALKABILITY
                                        ) ||
                                        !IsTerrainPathable(otherX - DECAL_TEST_PATH, otherY, PATHING_TYPE_WALKABILITY)
                                    if (!walkable2) {
                                        //il y a une rampe à condition que les deux points en bas de la falaise soient au même niveau de falaise et pas à la même hauteur
                                        if (currentCliffLevel < otherCliffLevel) {
                                            loc1 = Location(x, y)
                                            loc2 = Location(x, y - LARGEUR_CASE)
                                        } else {
                                            loc1 = Location(x, otherY)
                                            loc2 = Location(x, otherY + LARGEUR_CASE)
                                        }
                                        if (
                                            GetLocationZ(loc1) !== GetLocationZ(loc2) &&
                                            GetTerrainCliffLevelBJ(loc1) === GetTerrainCliffLevelBJ(loc2)
                                        ) {
                                            ramp = true
                                        }
                                        RemoveLocation(loc1)
                                        RemoveLocation(loc2)
                                    }
                                }
                                //s'il y a une rampe, on détermine si on est au milieu de la rampe
                                if (ramp) {
                                    if (currentCliffLevel < otherCliffLevel) {
                                        isRampMiddleRaisedB = isRampMiddleRaised(x, y, false)
                                    }
                                }
                            } else {
                                //il n'y a pas de falaise entre les deux ; si ce n'est pas walkable, il y a une rampe de largeur 1 s'il y a une falaise ensuite vers le haut de différence 1
                                if (!walkable) {
                                    otherY = y + LARGEUR_CASE * 2
                                    otherCliffLevel2 = GetTerrainCliffLevel(otherX, otherY)
                                    if (otherCliffLevel2 - currentCliffLevel === 1) {
                                        //il y a une rampe sauf si les deux points en bas de la falaise sont à la même hauteur
                                        loc1 = Location(x, y)
                                        loc2 = Location(x, y + LARGEUR_CASE)
                                        if (GetLocationZ(loc1) !== GetLocationZ(loc2)) {
                                            ramp = true
                                        }
                                        RemoveLocation(loc1)
                                        RemoveLocation(loc2)
                                    }
                                } else {
                                    //il peut y avoir une rampe s'il y a une falaise juste après, vers le haut et walkable
                                    otherY = y + LARGEUR_CASE * 2
                                    if (otherY <= Constants.MAP_MAX_Y) {
                                        otherCliffLevel2 = GetTerrainCliffLevel(otherX, otherY)
                                        if (currentCliffLevel < otherCliffLevel2) {
                                            otherY = otherY - LARGEUR_CASE / 2
                                            walkable2 =
                                                !IsTerrainPathable(
                                                    otherX + DECAL_TEST_PATH,
                                                    otherY,
                                                    PATHING_TYPE_WALKABILITY
                                                ) ||
                                                !IsTerrainPathable(
                                                    otherX - DECAL_TEST_PATH,
                                                    otherY,
                                                    PATHING_TYPE_WALKABILITY
                                                )
                                            if (walkable2) {
                                                ramp = true
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }

                    if (!isRampMiddleRaisedB) {
                        //bas
                        otherX = x
                        otherY = y - LARGEUR_CASE
                        if (otherY >= Constants.MAP_MIN_Y) {
                            otherCliffLevel = GetTerrainCliffLevel(otherX, otherY)

                            otherY = y - LARGEUR_CASE / 2
                            walkable =
                                !IsTerrainPathable(otherX + DECAL_TEST_PATH, otherY, PATHING_TYPE_WALKABILITY) ||
                                !IsTerrainPathable(otherX - DECAL_TEST_PATH, otherY, PATHING_TYPE_WALKABILITY)

                            if (currentCliffLevel !== otherCliffLevel) {
                                //il y a une falaise entre les deux ; si c'est walkable malgré tout, c'est qu'il y a une rampe
                                if (walkable) {
                                    ramp = true
                                } else if (IAbsBJ(currentCliffLevel - otherCliffLevel) === 1) {
                                    //ce n'est pas walkable, mais il y a peut-être une rampe, de largeur 1
                                    //si ce n'est pas walkable non plus en bas de la falaise, c'est qu'il y a une rampe
                                    if (currentCliffLevel > otherCliffLevel) {
                                        otherY = y - (3 * LARGEUR_CASE) / 2
                                    } else {
                                        otherY = y + LARGEUR_CASE / 2
                                    }
                                    walkable2 =
                                        !IsTerrainPathable(
                                            otherX + DECAL_TEST_PATH,
                                            otherY,
                                            PATHING_TYPE_WALKABILITY
                                        ) ||
                                        !IsTerrainPathable(otherX - DECAL_TEST_PATH, otherY, PATHING_TYPE_WALKABILITY)
                                    if (!walkable2) {
                                        //il y a une rampe à condition que les deux points en bas de la falaise soient au même niveau de falaise et pas à la même hauteur
                                        if (currentCliffLevel < otherCliffLevel) {
                                            loc1 = Location(x, y)
                                            loc2 = Location(x, y + LARGEUR_CASE)
                                        } else {
                                            loc1 = Location(x, otherY)
                                            loc2 = Location(x, otherY - LARGEUR_CASE)
                                        }
                                        if (
                                            GetLocationZ(loc1) !== GetLocationZ(loc2) &&
                                            GetTerrainCliffLevelBJ(loc1) === GetTerrainCliffLevelBJ(loc2)
                                        ) {
                                            ramp = true
                                        }
                                        RemoveLocation(loc1)
                                        RemoveLocation(loc2)
                                    }
                                }
                                //s'il y a une rampe, on détermine si on est au milieu de la rampe
                                if (ramp) {
                                    if (currentCliffLevel < otherCliffLevel) {
                                        isRampMiddleRaisedB = isRampMiddleRaised(x, y, false)
                                    }
                                }
                            } else {
                                //il n'y a pas de falaise entre les deux ; si ce n'est pas walkable, il y a une rampe de largeur 1 s'il y a une falaise ensuite vers le haut de différence 1
                                if (!walkable) {
                                    otherY = y - LARGEUR_CASE * 2
                                    otherCliffLevel2 = GetTerrainCliffLevel(otherX, otherY)
                                    if (otherCliffLevel2 - currentCliffLevel === 1) {
                                        //il y a une rampe sauf si les deux points en bas de la falaise sont à la même hauteur
                                        loc1 = Location(x, y)
                                        loc2 = Location(x, y - LARGEUR_CASE)
                                        if (GetLocationZ(loc1) !== GetLocationZ(loc2)) {
                                            ramp = true
                                        }
                                        RemoveLocation(loc1)
                                        RemoveLocation(loc2)
                                    }
                                } else {
                                    //il peut y avoir une rampe s'il y a une falaise juste après, vers le haut et walkable
                                    otherY = y - LARGEUR_CASE * 2
                                    if (otherY >= Constants.MAP_MIN_Y) {
                                        otherCliffLevel2 = GetTerrainCliffLevel(otherX, otherY)
                                        if (currentCliffLevel < otherCliffLevel2) {
                                            otherY = otherY + LARGEUR_CASE / 2
                                            walkable2 =
                                                !IsTerrainPathable(
                                                    otherX + DECAL_TEST_PATH,
                                                    otherY,
                                                    PATHING_TYPE_WALKABILITY
                                                ) ||
                                                !IsTerrainPathable(
                                                    otherX - DECAL_TEST_PATH,
                                                    otherY,
                                                    PATHING_TYPE_WALKABILITY
                                                )
                                            if (walkable2) {
                                                ramp = true
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }

                    //rampes en diagonales
                    if (!ramp) {
                        signY = -1
                        while (true) {
                            if (ramp || signY > 1) break
                            signX = -1
                            while (true) {
                                if (ramp || signX > 1) break
                                otherX = x + LARGEUR_CASE * signX
                                otherY = y + LARGEUR_CASE * signY
                                otherCliffLevel = GetTerrainCliffLevel(otherX, otherY)
                                //call BJDebugMsg("signX : " + R2S(signX) + " ; signY : " + R2S(signY) + " ; x : " + R2S(otherX) + " ; y : " + R2S(otherY))
                                //on ne prend en compte que si ça monte et que c'est walkable
                                if (currentCliffLevel < otherCliffLevel) {
                                    otherX = x + (LARGEUR_CASE * signX) / 2
                                    otherY = y + (LARGEUR_CASE * signY) / 2
                                    walkable = !IsTerrainPathable(otherX, otherY, PATHING_TYPE_WALKABILITY)
                                    if (walkable) {
                                        ramp = true
                                    } else {
                                    }
                                }
                                signX = signX + 2
                            }
                            signY = signY + 2
                        }
                    }
                }

                if (ramp) {
                    if (isRampMiddleRaisedB) {
                        //call CreateUnit(Player(0), 'hpea', x, y, 0)
                        rampStr = '2'
                    } else {
                        //call CreateUnit(Player(1), 'hpea', x, y, 0)
                        rampStr = '1'
                    }
                } else {
                    rampStr = '0'
                }
                StringArrayForCache.stringArrayForCache.push(rampStr)
                x = x + LARGEUR_CASE
            }
            y = y + LARGEUR_CASE
            loc1 = null
            loc2 = null
        } else {
            DisableTrigger(GetTriggeringTrigger())
            StringArrayForCache.stringArrayForCache.writeInCache()
            Text.A('terrain ramps saved')
            SaveWater.StartSaveWater()
        }
    }

    const StartSaveTerrainRamps = () => {
        y = Constants.MAP_MIN_Y
        StringArrayForCache.stringArrayForCache = new StringArrayForCache('terrain', 'terrainRamps', false)
        TriggerClearActions(SaveMapInCache.trigSaveMapInCache)
        TriggerAddAction(SaveMapInCache.trigSaveMapInCache, SaveTerrainRamps_Actions)
        EnableTrigger(SaveMapInCache.trigSaveMapInCache)
    }

    return { StartSaveTerrainRamps }
}

export const SaveTerrainRamps = initSaveTerrainRamps()
