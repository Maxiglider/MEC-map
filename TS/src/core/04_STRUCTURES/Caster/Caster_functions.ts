import { BasicFunctions } from 'core/01_libraries/Basic_functions'
import { Escaper } from '../Escaper/Escaper'
import { EscaperFunctions } from '../Escaper/Escaper_functions'
import { Caster } from './Caster'

const initCasterFunctions = () => {
    let escaper: Escaper
    let caster: Caster
    const PRECISION_TIR = 40
    const PRECISION_DIFF_POS_HERO = 20
    const ECART_CHECK = 0.05

    let x1: number
    let y1: number
    let angleSlider: number
    let sliderSpeed: number
    let x2: number
    let y2: number
    let x3: number
    let y3: number
    let k1: number
    let k2: number
    let Xk1: number
    let Yk1: number
    let Xk2: number
    let Yk2: number
    let XintersectionDevantHeros: number
    let YintersectionDevantHeros: number

    const CalculerPointsIntersections = () => {
        let decalSurX = 50
        let a: number
        let b: number
        let c: number
        let discriminant: number
        if (sliderSpeed >= 0) {
            angleSlider = GetUnitFacing(escaper.getHero())
        } else {
            angleSlider = GetUnitFacing(escaper.getHero()) + 180
        }
        x2 = x1 + decalSurX
        y2 = y1 + TanBJ(angleSlider) * decalSurX
        a = (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1)
        b = 2 * ((x2 - x1) * (x1 - x3) + (y2 - y1) * (y1 - y3))
        c = x3 * x3 + y3 * y3 + x1 * x1 + y1 * y1 - 2 * (x3 * x1 + y3 * y1) - caster.getRange() * caster.getRange()
        discriminant = b * b - 4 * a * c
        if (discriminant < 0) {
            k1 = 0
            k2 = 0
        } else {
            k1 = (-b + SquareRoot(b * b - 4 * a * c)) / (2 * a)
            Xk1 = x1 + k1 * (x2 - x1)
            Yk1 = y1 + k1 * (y2 - y1)
            k2 = (-b - SquareRoot(b * b - 4 * a * c)) / (2 * a)
            Xk2 = x1 + k2 * (x2 - x1)
            Yk2 = y1 + k2 * (y2 - y1)
        }
    }

    const TrouverTempsIdeal = (tempsMax: number): number => {
        let diffTemps = PRECISION_DIFF_POS_HERO / sliderSpeed
        let temps = 0
        let xHero: number
        let yHero: number
        let xBoule: number
        let yBoule: number
        let angleBouleHero: number
        let distHeroBoule: number
        let distHeroBouleMin = 99999999999
        let tempsIdeal = 0
        while (true) {
            if (temps >= tempsMax) break
            xHero = x1 + sliderSpeed * CosBJ(angleSlider) * temps
            yHero = y1 + sliderSpeed * SinBJ(angleSlider) * temps
            angleBouleHero = Atan2BJ(yHero - y3, xHero - x3)
            xBoule = x3 + caster.getProjectileSpeed() * CosBJ(angleBouleHero) * temps
            yBoule = y3 + caster.getProjectileSpeed() * SinBJ(angleBouleHero) * temps
            distHeroBoule = SquareRoot((xHero - xBoule) * (xHero - xBoule) + (yHero - yBoule) * (yHero - yBoule))
            if (distHeroBoule < distHeroBouleMin) {
                distHeroBouleMin = distHeroBoule
                tempsIdeal = temps
            }
            temps = temps + diffTemps
        }
        if (distHeroBouleMin > PRECISION_TIR) {
            tempsIdeal = -1
        }
        return tempsIdeal
    }

    const CasterTryToShoot = () => {
        let xHero: number
        let yHero: number
        let tempsMax: number
        let tempsIdeal: number
        let angleDeTir: number
        let sensPoint1positif: boolean
        let sensPoint2positif: boolean
        let tempsPoint1: number
        let tempsPoint2: number
        let escapersToShoot: Escaper[] = []
        let nbRemainingEscapersToShoot: number
        let i: number
        let tirOk = false
        let estShootable: boolean
        let numEscaper: number

        //récupération du caster et vérification qu'il existe toujours
        caster = Caster(LoadInteger(Caster_casterHashtable, 1, GetHandleId(GetExpiredTimer())))
        if (caster.casterUnit == null) {
            return
        }

        //détermination des escapers à viser
        i = 0
        while (true) {
            if (i >= caster.nbEscapersInRange) break
            escapersToShoot[i] = caster.escapersInRange[i]
            i = i + 1
        }
        nbRemainingEscapersToShoot = caster.nbEscapersInRange

        while (true) {
            if (tirOk || nbRemainingEscapersToShoot === 0) break
            //choix d'un escaper au hasard
            numEscaper = GetRandomInt(0, nbRemainingEscapersToShoot - 1)
            escaper = escapersToShoot[numEscaper]
            //vérification que l'escaper est shootable (vivant et à portée de tir)
            estShootable = false
            if (escaper.isAlive()) {
                x1 = GetUnitX(escaper.getHero())
                y1 = GetUnitY(escaper.getHero())
                x3 = caster.getX()
                y3 = caster.getY()
                //vérification que le héros est à portée de tir
                estShootable = SquareRoot((x1 - x3) * (x1 - x3) + (y1 - y3) * (y1 - y3)) <= caster.getRange()
            }
            if (!estShootable) {
                caster.escaperOutOfRangeOrDead(escaper)
                i = numEscaper
                while (true) {
                    if (i === nbRemainingEscapersToShoot - 1) break
                    escapersToShoot[i] = escapersToShoot[i + 1]
                    i = i + 1
                }
                nbRemainingEscapersToShoot = nbRemainingEscapersToShoot - 1
            } else {
                //tir si possible
                if (escaper.isSliding()) {
                    sliderSpeed = escaper.getRealSlideSpeed()
                } else if (GetUnitCurrentOrder(escaper.getHero()) != 0) {
                    sliderSpeed = escaper.getWalkSpeed()
                } else {
                    sliderSpeed = 0
                }
                if (sliderSpeed === 0) {
                    xHero = x1
                    yHero = y1
                    tirOk = true
                } else {
                    CalculerPointsIntersections()
                    if (sliderSpeed < 0) {
                        sliderSpeed = -sliderSpeed
                    }
                    if (k1 === 0 && k2 === 0) {
                        return
                    }
                    //sens points
                    if (CosBJ(angleSlider) !== 0) {
                        sensPoint1positif = (Xk1 - x1) * CosBJ(angleSlider) > 0
                        sensPoint2positif = (Xk2 - x1) * CosBJ(angleSlider) > 0
                    } else {
                        sensPoint1positif = (Yk1 - y1) * SinBJ(angleSlider) > 0
                        sensPoint2positif = (Yk2 - y1) * SinBJ(angleSlider) > 0
                    }
                    //déterminer lequel des deux points d'intersection est devant le héros
                    if (sensPoint1positif === sensPoint2positif) {
                        //calcul du temps pour chaque point pour trouver le plus éloigné qui est le bon
                        tempsPoint1 = SquareRoot((x1 - Xk1) * (x1 - Xk1) + (y1 - Yk1) * (y1 - Yk1)) / sliderSpeed
                        tempsPoint2 = SquareRoot((x1 - Xk2) * (x1 - Xk2) + (y1 - Yk2) * (y1 - Yk2)) / sliderSpeed
                        if (tempsPoint1 > tempsPoint2) {
                            XintersectionDevantHeros = Xk1
                            YintersectionDevantHeros = Yk1
                            tempsMax = tempsPoint1
                        } else {
                            XintersectionDevantHeros = Xk2
                            YintersectionDevantHeros = Yk2
                            tempsMax = tempsPoint2
                        }
                    } else {
                        if (sensPoint1positif) {
                            XintersectionDevantHeros = Xk1
                            YintersectionDevantHeros = Yk1
                            tempsMax = SquareRoot((x1 - Xk1) * (x1 - Xk1) + (y1 - Yk1) * (y1 - Yk1)) / sliderSpeed
                        } else {
                            XintersectionDevantHeros = Xk2
                            YintersectionDevantHeros = Yk2
                            tempsMax = SquareRoot((x1 - Xk2) * (x1 - Xk2) + (y1 - Yk2) * (y1 - Yk2)) / sliderSpeed
                        }
                    }

                    //trouver temps idéal
                    if (BasicFunctions.IsOnGround(escaper.getHero())) {
                        tempsIdeal = TrouverTempsIdeal(tempsMax)
                    } else {
                        tempsIdeal = -1
                    }
                    if (tempsIdeal !== -1) {
                        xHero = x1 + sliderSpeed * CosBJ(angleSlider) * tempsIdeal
                        yHero = y1 + sliderSpeed * SinBJ(angleSlider) * tempsIdeal
                        tirOk = true
                    }
                }
                if (tirOk) {
                    if (caster.isEnabled()) {
                        angleDeTir = Atan2BJ(yHero - y3, xHero - x3)
                        SetUnitFacing(caster.getCasterUnit(), angleDeTir)
                        SetUnitAnimation(caster.getCasterUnit(), caster.getAnimation())
                        CasterShot.create(
                            caster.getProjectileMonsterType(),
                            x3,
                            y3,
                            angleDeTir,
                            caster.getProjectileSpeed(),
                            caster.getRange()
                        )
                    }
                } else {
                    //on retire l'escaper du pick aléatoire
                    i = numEscaper
                    while (true) {
                        if (i === nbRemainingEscapersToShoot - 1) break
                        escapersToShoot[i] = escapersToShoot[i + 1]
                        i = i + 1
                    }
                    nbRemainingEscapersToShoot = nbRemainingEscapersToShoot - 1
                    tirOk = false
                }
            }
            //pas de n = n + 1
        }
        if (tirOk) {
            //on attend que le temps soit écoulé pour un autre tir
            TimerStart(caster.t, caster.getLoadTime(), false, CasterTryToShoot)
            caster.canShoot = false
        } else if (caster.nbEscapersInRange == 0) {
            //plus aucun héros à portée, on stoppe tout
            caster.canShoot = true
        } else {
            //héros à portée mais impossible de tirer, on attend un peu et on réessaie
            TimerStart(caster.t, ECART_CHECK, false, CasterTryToShoot)
        }
    }

    const CasterUnitWithinRange_Actions = () => {
        let escaperInRange = EscaperFunctions.Hero2Escaper(GetTriggerUnit())
        if (escaperInRange === null) {
            return
        }
        caster = Caster(LoadInteger(Caster_casterHashtable, 0, GetHandleId(GetTriggeringTrigger())))
        caster.escapersInRange[caster.nbEscapersInRange] = escaperInRange
        caster.nbEscapersInRange = caster.nbEscapersInRange + 1
        if (caster.canShoot) {
            TimerStart(caster.t, 0, false, CasterTryToShoot)
        }
    }

    return { CasterUnitWithinRange_Actions }
}

export const CasterFunctions = initCasterFunctions()
