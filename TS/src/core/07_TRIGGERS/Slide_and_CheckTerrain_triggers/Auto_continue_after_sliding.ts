import { NB_ESCAPERS } from 'core/01_libraries/Constants'
import { forRange } from 'Utils/mapUtils'
import { getUdgEscapers } from '../../../../globals'


const initAutoContinueAfterSliding = () => {
    let lastClickedX: number[] = []
    let lastClickedY: number[] = []
    let lastClickedWidgets: (widget | null)[] = []
    let isLastTargetALocation: boolean[] = []
    let udg_autoContinueAfterSliding: boolean[] = []

    forRange(NB_ESCAPERS, i => (udg_autoContinueAfterSliding[i] = true))

    const ECART_MAX_ANGLE = 45

    const AutoContinueAfterSliding = (n: number) => {
        const hero = getUdgEscapers().get(n)?.getHero()

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

    return {
        lastClickedX,
        lastClickedY,
        isLastTargetALocation,
        udg_autoContinueAfterSliding,
        AutoContinueAfterSliding,
        ClearLastClickSave,
    }
}

export const AutoContinueAfterSliding = initAutoContinueAfterSliding()
