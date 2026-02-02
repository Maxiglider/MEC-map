import { EffectUtils } from 'Utils/EffectUtils'
import { createEvent } from 'Utils/mapUtils'
import { IsOnGround } from 'core/01_libraries/Basic_functions'
import { Constants } from 'core/01_libraries/Constants'
import { Escaper } from 'core/04_STRUCTURES/Escaper/Escaper'
import { GetMirrorEscaper } from 'core/04_STRUCTURES/Escaper/Escaper_functions'
import { MeteorFunctions } from 'core/04_STRUCTURES/Meteor/Meteor_functions'
import { TerrainType } from 'core/04_STRUCTURES/TerrainType/TerrainType'
import { TerrainTypeDeath } from 'core/04_STRUCTURES/TerrainType/TerrainTypeDeath'
import { TerrainTypeSlide } from 'core/04_STRUCTURES/TerrainType/TerrainTypeSlide'
import { TerrainTypeWalk } from 'core/04_STRUCTURES/TerrainType/TerrainTypeWalk'
import { hooks } from 'core/API/GeneralHooks'
import { getUdgEscapers, getUdgTerrainTypes } from '../../../../globals'
import { AutoContinueAfterSliding } from './Auto_continue_after_sliding'

const TOLERANCE_ANGLE_DIFF = 5
const TOLERANCE_RAYON_DIFF = 20
const INIT_RAYON_TOLERANCE = 20

const initCheckTerrainTrigger = () => {
    const SlideTerrainCheck = (
        terrainType: TerrainTypeSlide,
        escaper: Escaper,
        hero: unit,
        playerId: number,
        wasSliding: boolean,
        wasReversed: boolean
    ) => {
        escaper.enableSlide(true)

        if (!wasSliding) {
            MeteorFunctions.HeroComingToSlide_CheckItem(hero)
            AutoContinueAfterSliding.ClearLastClickSave(playerId)
        }

        if (!escaper.isAbsoluteSlideSpeed()) {
            escaper.setSlideSpeed((escaper.getSlideMirror() ? -1 : 1) * terrainType.getSlideSpeed())
        }

        if (!escaper.isAbsoluteRotationSpeed()) {
            escaper.setRotationSpeed(terrainType.getRotationSpeed())
        }

        if (escaper.getSlideSpeed() < 0) {
            if (wasSliding && !wasReversed && !escaper.getSlideMirror()) {
                escaper.reverse()
            }

            if (!wasSliding) {
                escaper.reverse()
            }

            if (wasSliding && wasReversed && escaper.getSlideMirror()) {
                escaper.reverse()
            }
        } else {
            if (wasSliding && wasReversed && !escaper.getSlideMirror()) {
                escaper.reverse()
            }

            if (wasSliding && !wasReversed && escaper.getSlideMirror()) {
                escaper.reverse()
            }
        }
    }

    const WalkTerrainCheck = (
        lastTerrainType: TerrainType | undefined,
        currentTerrainType: TerrainType,
        escaper: Escaper,
        hero: unit,
        playerId: number,
        wasReversed: boolean
    ) => {
        escaper.enableSlide(false)

        if (lastTerrainType?.getKind() === 'slide') {
            MeteorFunctions.HeroComingOutFromSlide_CheckItem(hero)

            if ((escaper.getSlideMirror() || wasReversed) && !(escaper.getSlideMirror() && wasReversed)) {
                escaper.reverse()
            }

            if (AutoContinueAfterSliding.udg_autoContinueAfterSliding[playerId] && !wasReversed) {
                AutoContinueAfterSliding.AutoContinueAfterSliding(playerId)
            }
        }

        if (currentTerrainType instanceof TerrainTypeWalk) {
            if (!escaper.isAbsoluteWalkSpeed()) {
                escaper.setWalkSpeed(currentTerrainType.getWalkSpeed())
            }
        }
    }

    const CheckTerrainActions = (playerId: number) => {
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

        const wasSliding = escaper.isSliding()
        const oldSlideSpeed = escaper.getSlideSpeed()
        const wasReversed = escaper.getSlideMirror() ? oldSlideSpeed >= 0 : oldSlideSpeed < 0

        escaper.moveInvisUnit(x, y)

        if (escaper.isStaticSliding()) {
            return
        }

        if (IsOnGround(hero)) {
            if (
                !currentTerrainType ||
                (lastTerrainType === currentTerrainType && currentTerrainType.getKind() !== 'death')
            ) {
                return
            }

            escaper.setLastTerrainType(currentTerrainType)

            if (currentTerrainType instanceof TerrainTypeSlide) {
                escaper.startSpinCam()
            } else {
                escaper.stopSpinCam()
            }

            for (const hook of hooks.hooks_onHeroTerrainChange.getHooks()) {
                hook.execute3(escaper, currentTerrainType, lastTerrainType)
            }

            if (currentTerrainType instanceof TerrainTypeSlide) {
                SlideTerrainCheck(currentTerrainType, escaper, hero, playerId, wasSliding, wasReversed)
            } else if (currentTerrainType instanceof TerrainTypeDeath) {
                let touchedByDeathTerrain = true
                let terrainTypeTolerance: TerrainType | null = null
                const toleranceDist = currentTerrainType.getToleranceDist()

                if (toleranceDist !== 0) {
                    let tempRayonTolerance = INIT_RAYON_TOLERANCE

                    while (true) {
                        if (!touchedByDeathTerrain || tempRayonTolerance > toleranceDist) {
                            break
                        }

                        let angle = 0

                        while (true) {
                            if (!touchedByDeathTerrain || angle >= 360) {
                                break
                            }

                            const xTolerance = x + tempRayonTolerance * CosBJ(angle)
                            const yTolerance = y + tempRayonTolerance * SinBJ(angle)
                            terrainTypeTolerance = getUdgTerrainTypes().getTerrainType(xTolerance, yTolerance)

                            if (terrainTypeTolerance?.getKind() !== 'death') {
                                touchedByDeathTerrain = false
                            }

                            angle = angle + TOLERANCE_ANGLE_DIFF
                        }

                        tempRayonTolerance = tempRayonTolerance + TOLERANCE_RAYON_DIFF
                    }
                }

                if (touchedByDeathTerrain) {
                    if (escaper.isGodModeOn()) {
                        EffectUtils.destroyEffect(
                            EffectUtils.addSpecialEffect(Constants.GM_TOUCH_DEATH_TERRAIN_EFFECT_STR, x, y)
                        )
                    } else {
                        currentTerrainType.killEscaper(escaper)
                        escaper.enableSlide(false)

                        const mirrorEscaper = GetMirrorEscaper(escaper)

                        if (mirrorEscaper) {
                            currentTerrainType.killEscaper(mirrorEscaper)
                            mirrorEscaper.enableSlide(false)
                        }
                    }
                } else if (terrainTypeTolerance instanceof TerrainTypeSlide) {
                    SlideTerrainCheck(terrainTypeTolerance, escaper, hero, playerId, wasSliding, wasReversed)
                } else {
                    WalkTerrainCheck(lastTerrainType, currentTerrainType, escaper, hero, playerId, wasReversed)
                }
            } else {
                WalkTerrainCheck(lastTerrainType, currentTerrainType, escaper, hero, playerId, wasReversed)
            }
        }
    }

    const CreateCheckTerrainTrigger = (playerId: number) => {
        const checkTerrainTrigger = createEvent({
            events: [t => TriggerRegisterTimerEventPeriodic(t, Constants.CHECK_TERRAIN_PERIOD)],
            actions: [() => CheckTerrainActions(playerId)],
        })

        DisableTrigger(checkTerrainTrigger)
        return checkTerrainTrigger
    }

    return { CreateCheckTerrainTrigger }
}

export const CheckTerrainTrigger = initCheckTerrainTrigger()
