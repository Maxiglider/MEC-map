import { IsOnGround } from 'core/01_libraries/Basic_functions'
import { CHECK_TERRAIN_PERIOD, GM_TOUCH_DEATH_TERRAIN_EFFECT_STR } from 'core/01_libraries/Constants'
import { GetMirrorEscaper } from 'core/04_STRUCTURES/Escaper/Escaper_functions'
import { MeteorFunctions } from 'core/04_STRUCTURES/Meteor/Meteor_functions'
import { TerrainType } from 'core/04_STRUCTURES/TerrainType/TerrainType'
import { TerrainTypeDeath } from 'core/04_STRUCTURES/TerrainType/TerrainTypeDeath'
import { TerrainTypeSlide } from 'core/04_STRUCTURES/TerrainType/TerrainTypeSlide'
import { TerrainTypeWalk } from 'core/04_STRUCTURES/TerrainType/TerrainTypeWalk'
import { createEvent } from 'Utils/mapUtils'
import { getUdgEscapers, getUdgTerrainTypes } from '../../../../globals'
import { AutoContinueAfterSliding } from './Auto_continue_after_sliding'

const TOLERANCE_ANGLE_DIFF = 5
const TOLERANCE_RAYON_DIFF = 20
const INIT_RAYON_TOLERANCE = 20

const initCheckTerrainTrigger = () => {
    const CheckTerrain_Actions = (playerId: number) => {
        const escaper = getUdgEscapers().get(playerId)

        if (!escaper) {
            return
        }

        const hero = escaper.getHero()

        if (!hero) {
            return
        }

        const x = GetUnitX(hero)
        const y = GetUnitY(hero)
        const lastTerrainType = escaper.getLastTerrainType()
        const currentTerrainType = getUdgTerrainTypes().getTerrainType(x, y)
        let an_effect: effect | null

        let touchedByDeathTerrain: boolean
        let toleranceDist: number
        let angle: number
        let xTolerance: number
        let yTolerance: number
        let terrainTypeTolerance: TerrainType | null = null
        let wasSliding: boolean
        let oldSlideSpeed: number
        let tempRayonTolerance: number

        escaper.moveInvisUnit(x, y)

        if (IsOnGround(hero)) {
            if (
                !currentTerrainType ||
                (lastTerrainType == currentTerrainType && currentTerrainType.getKind() != 'death')
            ) {
                return
            }
            escaper.setLastTerrainType(currentTerrainType)
            wasSliding = escaper.isSliding()
            oldSlideSpeed = escaper.getSlideSpeed()

            if (currentTerrainType instanceof TerrainTypeSlide) {
                escaper.enableSlide(true)
                if (!wasSliding) {
                    MeteorFunctions.HeroComingToSlide_CheckItem(hero)
                    AutoContinueAfterSliding.ClearLastClickSave(playerId)
                }

                if (!escaper.isAbsoluteSlideSpeed()) {
                    escaper.setSlideSpeed(currentTerrainType.getSlideSpeed())
                }

                if (!escaper.isAbsoluteRotationSpeed()) {
                    escaper.setRotationSpeed(currentTerrainType.getRotationSpeed())
                }

                if (escaper.getSlideSpeed() < 0) {
                    if (wasSliding) {
                        if (oldSlideSpeed >= 0) {
                            escaper.reverse()
                        }
                    } else {
                        escaper.reverse()
                    }
                } else {
                    if (wasSliding) {
                        if (oldSlideSpeed < 0) {
                            escaper.reverse()
                        }
                    }
                }
            } else {
                if (currentTerrainType instanceof TerrainTypeDeath) {
                    touchedByDeathTerrain = true
                    toleranceDist = currentTerrainType.getToleranceDist()
                    if (toleranceDist != 0) {
                        tempRayonTolerance = INIT_RAYON_TOLERANCE
                        while (true) {
                            if (!touchedByDeathTerrain || tempRayonTolerance > toleranceDist) {
                                break
                            }
                            angle = 0
                            while (true) {
                                if (!touchedByDeathTerrain || angle >= 360) {
                                    break
                                }
                                xTolerance = x + tempRayonTolerance * CosBJ(angle)
                                yTolerance = y + tempRayonTolerance * SinBJ(angle)
                                terrainTypeTolerance = getUdgTerrainTypes().getTerrainType(xTolerance, yTolerance)
                                if (terrainTypeTolerance?.getKind() != 'death') {
                                    touchedByDeathTerrain = false
                                }
                                angle = angle + TOLERANCE_ANGLE_DIFF
                            }
                            tempRayonTolerance = tempRayonTolerance + TOLERANCE_RAYON_DIFF
                        }
                    }
                    if (touchedByDeathTerrain) {
                        if (escaper.isGodModeOn()) {
                            an_effect = AddSpecialEffect(GM_TOUCH_DEATH_TERRAIN_EFFECT_STR, x, y)
                            DestroyEffect(an_effect)
                            an_effect = null
                        } else {
                            currentTerrainType.killEscaper(escaper)
                            escaper.enableSlide(false)

                            const mirrorEscaper = GetMirrorEscaper(escaper)

                            if (mirrorEscaper) {
                                currentTerrainType.killEscaper(mirrorEscaper)
                                mirrorEscaper.enableSlide(false)
                            }
                        }
                    } else {
                        if (terrainTypeTolerance instanceof TerrainTypeSlide) {
                            oldSlideSpeed = escaper.getSlideSpeed()
                            escaper.enableSlide(true)

                            if (!wasSliding) {
                                MeteorFunctions.HeroComingToSlide_CheckItem(hero)
                                AutoContinueAfterSliding.ClearLastClickSave(playerId)
                            }

                            if (!escaper.isAbsoluteSlideSpeed()) {
                                escaper.setSlideSpeed(terrainTypeTolerance.getSlideSpeed())
                            }

                            if (!escaper.isAbsoluteRotationSpeed()) {
                                escaper.setRotationSpeed(terrainTypeTolerance.getRotationSpeed())
                            }

                            if (escaper.getSlideSpeed() < 0) {
                                if (wasSliding) {
                                    if (oldSlideSpeed >= 0) {
                                        escaper.reverse()
                                    }
                                } else {
                                    escaper.reverse()
                                }
                            } else {
                                if (wasSliding) {
                                    if (oldSlideSpeed < 0) {
                                        escaper.reverse()
                                    }
                                }
                            }
                        } else {
                            //terrain tolerance : walk ou rien du tout
                            escaper.enableSlide(false)
                            if (wasSliding) {
                                MeteorFunctions.HeroComingOutFromSlide_CheckItem(hero)
                                if (oldSlideSpeed < 0) {
                                    escaper.reverse()
                                }
                                if (
                                    AutoContinueAfterSliding.udg_autoContinueAfterSliding[playerId] &&
                                    oldSlideSpeed >= 0
                                ) {
                                    AutoContinueAfterSliding.AutoContinueAfterSliding(playerId)
                                }
                            }
                            if (terrainTypeTolerance instanceof TerrainTypeWalk) {
                                if (!escaper.isAbsoluteWalkSpeed()) {
                                    escaper.setWalkSpeed(terrainTypeTolerance.getWalkSpeed())
                                }
                            }
                        }
                    }
                } else {
                    // walk ou rien du tout (pseudo walk)
                    escaper.enableSlide(false)
                    if (lastTerrainType?.getKind() == 'slide') {
                        MeteorFunctions.HeroComingOutFromSlide_CheckItem(hero)
                        if (oldSlideSpeed < 0) {
                            escaper.reverse()
                        }
                        if (AutoContinueAfterSliding.udg_autoContinueAfterSliding[playerId] && oldSlideSpeed >= 0) {
                            AutoContinueAfterSliding.AutoContinueAfterSliding(playerId)
                        }
                    }
                    if (currentTerrainType instanceof TerrainTypeWalk) {
                        if (!escaper.isAbsoluteWalkSpeed()) {
                            escaper.setWalkSpeed(currentTerrainType.getWalkSpeed())
                        }
                    }
                }
            }
        }
    }

    const CreateCheckTerrainTrigger = (playerId: number) => {
        const checkTerrainTrigger = createEvent({
            events: [t => TriggerRegisterTimerEventPeriodic(t, CHECK_TERRAIN_PERIOD)],
            actions: [() => CheckTerrain_Actions(playerId)],
        })

        DisableTrigger(checkTerrainTrigger)
        return checkTerrainTrigger
    }

    return { CreateCheckTerrainTrigger }
}

export const CheckTerrainTrigger = initCheckTerrainTrigger()
