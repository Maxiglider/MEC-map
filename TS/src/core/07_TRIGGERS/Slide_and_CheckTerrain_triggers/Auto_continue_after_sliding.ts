import { NB_ESCAPERS } from 'core/01_libraries/Constants'
import { udg_escapers } from 'core/08_GAME/Init_structures/Init_escapers'

const initAutoContinueAfterSliding = () => {
    let lastClickedX: number[] = []
    let lastClickedY: number[] = []
    let lastClickedWidgets: widget | null[] = []
    let isLastTargetALocation: boolean[] = []
    let udg_autoContinueAfterSliding: boolean[] = []

    const ECART_MAX_ANGLE = 45

    const AutoContinueAfterSliding = (n: number) => {
        const hero = udg_escapers.get(n).getHero()

        if (!hero) {
            return
        }

        //vérification de l'angle
        let angleHero2Target = Atan2(lastClickedY[n] - GetUnitY(hero), lastClickedX[n] - GetUnitX(hero)) * bj_RADTODEG
        let diffAngle = RAbsBJ(angleHero2Target - GetUnitFacing(hero))
        if (diffAngle > ECART_MAX_ANGLE && diffAngle < 360 - ECART_MAX_ANGLE) {
            return
        }

        //cas dernier clic : un point
        if (isLastTargetALocation[n]) {
            IssuePointOrder(hero, 'move', lastClickedX[n], lastClickedY[n])

            //cas dernier clic : pas un point
        } else {
            const lastClickedWidget = lastClickedWidgets[n]

            //dernier widget cliqué n'existe pas (donc aucun clic effectué pendant le slide)
            if (lastClickedWidget === null) {
                return
            } else {
                //cible n'a pas bougé
                if (
                    GetWidgetX(lastClickedWidget) === lastClickedX[n] &&
                    GetWidgetY(lastClickedWidget) === lastClickedY[n]
                ) {
                    //ordre clic droit vers cible
                    IssueTargetOrder(hero, 'smart', lastClickedWidget)
                } else {
                    //bouger vers ancien endroit du widget
                    IssuePointOrder(hero, 'move', lastClickedX[n], lastClickedY[n])
                }
            }
        }
    }

    const ClearLastClickSave = (n: number) => {
        isLastTargetALocation[n] = false
        lastClickedWidgets[n] = null
    }

    const Init_AutoContinueAfterSliding = () => {
        let i = 0
        while (true) {
            if (i >= NB_ESCAPERS) break
            udg_autoContinueAfterSliding[i] = true
            i = i + 1
        }
    }

    Init_AutoContinueAfterSliding()

    return { AutoContinueAfterSliding, ClearLastClickSave }
}

export const AutoContinueAfterSliding = initAutoContinueAfterSliding()
