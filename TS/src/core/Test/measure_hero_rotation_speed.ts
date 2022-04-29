import {createTimer} from "../../Utils/mapUtils";
import {getUdgEscapers} from "../../../globals";
import {AnglesDiff} from "../01_libraries/Basic_functions";
import {HERO_ROTATION_SPEED, HERO_ROTATION_TIME_FOR_MAXIMUM_SPEED, SLIDE_PERIOD} from "../01_libraries/Constants";
import {log} from "../Log/log";


export const init_measureSpeed = () => {
    createTimer(10, false, () => {
        const hero = getUdgEscapers().get(0)?.getHero()
        const hero2 = getUdgEscapers().get(1)?.getHero()

        if (hero && hero2) {

            BlzSetUnitFacingEx(hero, 0)
            BlzSetUnitFacingEx(hero2, 0)


            //blue hero new rotation
            const slideTurnPerPeriod = HERO_ROTATION_SPEED * SLIDE_PERIOD * 360 //degrees
            let heroBlueStarted = false

            let sens = 1
            let lastSens = sens

            let currentRotationSpeed = 0
            let increaseRotationSpeedPerPeriod = slideTurnPerPeriod * SLIDE_PERIOD / HERO_ROTATION_TIME_FOR_MAXIMUM_SPEED

            const startBlueHero = () => {
                createTimer(SLIDE_PERIOD, true, () => {
                    if(lastSens != sens){
                        //currentRotationSpeed = 0
                        lastSens = sens
                    }

                    const currentAngle = GetUnitFacing(hero2)

                    const aimedDiffAngle = slideTurnPerPeriod * sens

                    let diffToApply
                    if(aimedDiffAngle < 0){
                        if(currentRotationSpeed > -slideTurnPerPeriod){
                            currentRotationSpeed = RMaxBJ(currentRotationSpeed - increaseRotationSpeedPerPeriod, -slideTurnPerPeriod)
                        }
                    }else if(aimedDiffAngle > 0){
                        if(currentRotationSpeed < slideTurnPerPeriod){
                            currentRotationSpeed = RMinBJ(currentRotationSpeed + increaseRotationSpeedPerPeriod, slideTurnPerPeriod)
                        }
                    }else{
                        if(currentRotationSpeed > 0){
                            currentRotationSpeed = RMaxBJ(currentRotationSpeed - increaseRotationSpeedPerPeriod, 0)
                        }else if(currentRotationSpeed < 0){
                            currentRotationSpeed = RMinBJ(currentRotationSpeed + increaseRotationSpeedPerPeriod, 0)
                        }
                    }

                    if (currentRotationSpeed != 0) {
                        //turn
                        const newAngle = currentAngle + currentRotationSpeed
                        BlzSetUnitFacingEx(hero2, newAngle)

                        print("hero1 : " + GetUnitFacing(hero) + " ; hero2 : " + GetUnitFacing(hero2))
                        log(GetUnitFacing(hero) + "\t" + GetUnitFacing(hero2))
                    }
                })
            }

            //red hero normal rotation
            createTimer(0.01, true, () => {
                if(!heroBlueStarted){
                    startBlueHero()
                    heroBlueStarted = true
                }

                const oldAngle = GetUnitFacing(hero)
                const newAngle = oldAngle + 70 * sens
                SetUnitFacing(hero, newAngle)

                // const angleParcouru = AnglesDiff(GetUnitFacing(hero), oldAngle)
                // const speed = angleParcouru / 0.5
                // const turnsPerSecond = speed / 360
                //
                // print("angleParcouru : " + angleParcouru + " ; speed : " + speed + "° ; turnsPerSecond : " + turnsPerSecond)
            })

            //change sens
            createTimer(0.2, true, () => {
                sens = -sens
            })

        }

    })
}