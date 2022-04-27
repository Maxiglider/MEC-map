import {createTimer} from "../../Utils/mapUtils";
import {getUdgEscapers} from "../../../globals";
import {AnglesDiff} from "../01_libraries/Basic_functions";


export const init_measureSpeed = () => {
    createTimer(10, false, () => {
        const hero = getUdgEscapers().get(0)?.getHero()

        if (hero) {
            const oldAngle = GetUnitFacing(hero)
            const newAngle = oldAngle + 170
            SetUnitFacing(hero, newAngle)

            createTimer(0.5, false, () => {
                const angleParcouru = AnglesDiff(GetUnitFacing(hero), oldAngle)
                const speed = angleParcouru / 0.5
                const turnsPerSecond = speed / 360

                print("angleParcouru : " + angleParcouru + " ; speed : " + speed + "° ; turnsPerSecond : " + turnsPerSecond)
            })
        }

    })
}