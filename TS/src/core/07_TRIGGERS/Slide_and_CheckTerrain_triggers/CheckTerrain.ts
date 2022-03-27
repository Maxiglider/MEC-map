import { BasicFunctions } from 'core/01_libraries/Basic_functions'
import { CHECK_TERRAIN_PERIOD, GM_TOUCH_DEATH_TERRAIN_EFFECT_STR } from 'core/01_libraries/Constants'
import { EscaperFunctions } from 'core/04_STRUCTURES/Escaper/Escaper_functions'
import { MeteorFunctions } from 'core/04_STRUCTURES/Meteor/Meteor_functions'
import { udg_escapers } from 'core/08_GAME/Init_structures/Init_escapers'
import { createEvent } from 'Utils/mapUtils'
import { AutoContinueAfterSliding } from './Auto_continue_after_sliding'

const initCheckTerrainTrigger = () => {
    const TOLERANCE_ANGLE_DIFF = 5
    const TOLERANCE_RAYON_DIFF = 20
    const INIT_RAYON_TOLERANCE = 20

    const CheckTerrain_Actions = (playerId: number) => {
        const escaper = udg_escapers.get(playerId)

        const hero = escaper.getHero()

        if (!hero) {
            return
        }

        const x = GetUnitX(hero)
        const y = GetUnitY(hero)
        const lastTerrainType = escaper.getLastTerrainType()
        const currentTerrainType = udg_terrainTypes.getTerrainType(x, y)
        const an_effect: effect

        const touchedByDeathTerrain: boolean
        const toleranceDist: real
        const angle: real
        const xTolerance: real
        const yTolerance: real
        const terrainTypeTolerance: TerrainType
        const wasSliding: boolean
        const oldSlideSpeed: real
        const tempRayonTolerance: real

        const terrainTypeS: TerrainTypeSlide
        const terrainTypeD: TerrainTypeDeath
        const terrainTypeW: TerrainTypeWalk
        escaper.moveInvisUnit(x, y)

        if (BasicFunctions.IsOnGround(hero)) {
            if (lastTerrainType == currentTerrainType && currentTerrainType.getKind() != 'death') {
                return
            }
            escaper.setLastTerrainType(currentTerrainType)
            wasSliding = escaper.isSliding()
            oldSlideSpeed = escaper.getSlideSpeed()

            if (currentTerrainType.getKind() == 'slide') {
                terrainTypeS = TerrainTypeSlide(integer(currentTerrainType))
                escaper.enableSlide(true)
                if (!wasSliding) {
                    MeteorFunctions.HeroComingToSlide_CheckItem(hero)
                    AutoContinueAfterSliding.ClearLastClickSave(playerId)
                }
                if (!escaper.isAbsoluteSlideSpeed()) {
                    escaper.setSlideSpeed(terrainTypeS.getSlideSpeed())
                    if (terrainTypeS.getSlideSpeed() < 0) {
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
                }
            } else {
                if (currentTerrainType.getKind() == 'death') {
                    terrainTypeD = TerrainTypeDeath(integer(currentTerrainType))
                    touchedByDeathTerrain = true
                    toleranceDist = terrainTypeD.getToleranceDist()
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
                                terrainTypeTolerance = udg_terrainTypes.getTerrainType(xTolerance, yTolerance)
                                if (terrainTypeTolerance.getKind() != 'death') {
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
                            terrainTypeD = TerrainTypeDeath(integer(currentTerrainType))
                            terrainTypeD.killEscaper(escaper)
                            escaper.enableSlide(false)
                            terrainTypeD.killEscaper(EscaperFunctions.GetMirrorEscaper(escaper))
                            EscaperFunctions.GetMirrorEscaper(escaper).enableSlide(false)
                        }
                    } else {
                        if (terrainTypeTolerance.getKind() == 'slide') {
                            terrainTypeS = TerrainTypeSlide(integer(terrainTypeTolerance))
                            oldSlideSpeed = escaper.getSlideSpeed()
                            escaper.enableSlide(true)
                            escaper.setSlideSpeed(terrainTypeS.getSlideSpeed())
                            if (!wasSliding) {
                                MeteorFunctions.HeroComingToSlide_CheckItem(hero)
                                AutoContinueAfterSliding.ClearLastClickSave(playerId)
                            }
                            if (!escaper.isAbsoluteSlideSpeed()) {
                                escaper.setSlideSpeed(terrainTypeS.getSlideSpeed())
                                if (terrainTypeS.getSlideSpeed() < 0) {
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
                            }
                        } else {
                            //terrain tolerance : walk ou rien du tout
                            escaper.enableSlide(false)
                            if (wasSliding) {
                                MeteorFunctions.HeroComingOutFromSlide_CheckItem(hero)
                                if (oldSlideSpeed < 0) {
                                    escaper.reverse()
                                }
                                if (udg_autoContinueAfterSliding[playerId] && oldSlideSpeed >= 0) {
                                    AutoContinueAfterSliding.AutoContinueAfterSliding(playerId)
                                }
                            }
                            if (terrainTypeTolerance.getKind() == 'walk') {
                                if (!escaper.isAbsoluteWalkSpeed()) {
                                    terrainTypeW = TerrainTypeWalk(integer(terrainTypeTolerance))
                                    escaper.setWalkSpeed(terrainTypeW.getWalkSpeed())
                                }
                            }
                        }
                    }
                } else {
                    // walk ou rien du tout (pseudo walk)
                    escaper.enableSlide(false)
                    if (lastTerrainType.getKind() == 'slide') {
                        MeteorFunctions.HeroComingOutFromSlide_CheckItem(hero)
                        if (oldSlideSpeed < 0) {
                            escaper.reverse()
                        }
                        if (udg_autoContinueAfterSliding[playerId] && oldSlideSpeed >= 0) {
                            AutoContinueAfterSliding.AutoContinueAfterSliding(playerId)
                        }
                    }
                    if (currentTerrainType.getKind() == 'walk') {
                        if (!escaper.isAbsoluteWalkSpeed()) {
                            terrainTypeW = TerrainTypeWalk(integer(currentTerrainType))
                            escaper.setWalkSpeed(terrainTypeW.getWalkSpeed())
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
