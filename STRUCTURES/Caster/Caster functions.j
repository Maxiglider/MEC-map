//TESH.scrollpos=198
//TESH.alwaysfold=0
library CasterFunctions needs EscaperFunctions


globals
    private Escaper escaper
    private Caster caster
    private constant real PRECISION_TIR = 40 //distance max entre la boule et le héros au moment de l'impact
    private constant real PRECISION_DIFF_POS_HERO = 20
    private constant real ECART_CHECK = 0.05 //temps entre deux check lorsque le caster ne peut pas tirer alors que des héros sont à portée et que le temps de chargement est écoulé
    
    private real x1 //xSlider
    private real y1 //ySlider
    private real angleSlider
    private real sliderSpeed
    private real x2
    private real y2
    private real x3 //xCaster
    private real y3 //yCaster
    private real k1
    private real k2
    private real Xk1
    private real Yk1
    private real Xk2
    private real Yk2
    private real XintersectionDevantHeros
    private real YintersectionDevantHeros
endglobals


private function CalculerPointsIntersections takes nothing returns nothing
    local real decalSurX = 50
    local real a
    local real b
    local real c
    local real discriminant
    if (sliderSpeed >= 0) then
        set angleSlider = GetUnitFacing(escaper.getHero())
    else
        set angleSlider = GetUnitFacing(escaper.getHero()) + 180
    endif
    set x2 = x1 + decalSurX
    set y2 = y1 + TanBJ(angleSlider) * decalSurX
    set a = (x2 - x1)*(x2 - x1) + (y2 - y1)*(y2 - y1)
    set b = 2*((x2 - x1)*(x1 - x3) + (y2 - y1)*(y1 - y3))
    set c = x3 * x3 + y3 * y3 + x1 * x1 + y1 * y1 - 2*(x3 * x1 + y3 * y1) - caster.getRange() * caster.getRange()
    set discriminant = b * b - 4 * a * c
    if (discriminant < 0) then
        set k1 = 0
        set k2 = 0
    else
        set k1 = (-b + SquareRoot(b * b - 4 * a * c)) / (2 * a)
        set Xk1 = x1 + k1 * (x2 - x1)
        set Yk1 = y1 + k1 * (y2 - y1)
        set k2 = (-b - SquareRoot(b * b - 4 * a * c)) / (2 * a)
        set Xk2 = x1 + k2 * (x2 - x1)
        set Yk2 = y1 + k2 * (y2 - y1)
    endif
endfunction



private function TrouverTempsIdeal takes real tempsMax returns real
    local real diffTemps = PRECISION_DIFF_POS_HERO / sliderSpeed
    local real temps = 0
    local real xHero
    local real yHero
    local real xBoule
    local real yBoule
    local real angleBouleHero
    local real distHeroBoule
    local real distHeroBouleMin = 99999999999
    local real tempsIdeal = 0
    loop
        exitwhen temps >= tempsMax
            set xHero = x1 + sliderSpeed * CosBJ(angleSlider) * temps
            set yHero = y1 + sliderSpeed * SinBJ(angleSlider) * temps
            set angleBouleHero = Atan2BJ(yHero - y3, xHero - x3)
            set xBoule = x3 + caster.getProjectileSpeed() * CosBJ(angleBouleHero) * temps
            set yBoule = y3 + caster.getProjectileSpeed() * SinBJ(angleBouleHero) * temps
            set distHeroBoule = SquareRoot((xHero - xBoule) * (xHero - xBoule) + (yHero - yBoule) * (yHero - yBoule))
            if (distHeroBoule < distHeroBouleMin) then
                set distHeroBouleMin = distHeroBoule
                set tempsIdeal = temps
            endif
        set temps = temps + diffTemps
    endloop
    if (distHeroBouleMin > PRECISION_TIR) then
        set tempsIdeal = -1
    endif
    return tempsIdeal
endfunction


private function CasterTryToShoot takes nothing returns nothing
    local real xHero
    local real yHero
    local real tempsMax
    local real tempsIdeal
    local real angleDeTir
    local boolean sensPoint1positif
    local boolean sensPoint2positif
    local real tempsPoint1
    local real tempsPoint2
    local Escaper array escapersToShoot
    local integer nbRemainingEscapersToShoot
    local integer i
    local boolean tirOk = false
    local boolean estShootable
    local integer numEscaper
    
    //récupération du caster et vérification qu'il existe toujours
    set caster = Caster(LoadInteger(Caster_casterHashtable, 1, GetHandleId(GetExpiredTimer())))
    if (caster.casterUnit == null) then
        return
    endif
    
    //détermination des escapers à viser
    set i = 0
    loop
        exitwhen (i >= caster.nbEscapersInRange)
            set escapersToShoot[i] = caster.escapersInRange[i]
        set i = i + 1
    endloop
    set nbRemainingEscapersToShoot = caster.nbEscapersInRange
    
    loop
        exitwhen (tirOk or nbRemainingEscapersToShoot == 0)
            //choix d'un escaper au hasard
            set numEscaper = GetRandomInt(0, nbRemainingEscapersToShoot - 1)
            set escaper = escapersToShoot[numEscaper]
            //vérification que l'escaper est shootable (vivant et à portée de tir)
            set estShootable = false
            if (escaper.isAlive()) then
                set x1 = GetUnitX(escaper.getHero())
                set y1 = GetUnitY(escaper.getHero())
                set x3 = caster.getX()
                set y3 = caster.getY()
                //vérification que le héros est à portée de tir
                set estShootable = SquareRoot((x1 - x3)*(x1 - x3) + (y1 - y3)*(y1 - y3)) <= caster.getRange()
            endif
            if (not estShootable) then
                call caster.escaperOutOfRangeOrDead(escaper)
                set i = numEscaper
                loop
                    exitwhen (i == nbRemainingEscapersToShoot - 1)
                        set escapersToShoot[i] = escapersToShoot[i + 1]
                    set i = i + 1
                endloop
                set nbRemainingEscapersToShoot = nbRemainingEscapersToShoot - 1
            else            
                //tir si possible
                if (escaper.isSliding()) then
                    set sliderSpeed = escaper.getRealSlideSpeed()
                elseif (GetUnitCurrentOrder(escaper.getHero()) != 0) then
                    set sliderSpeed = escaper.getWalkSpeed()
                else
                    set sliderSpeed = 0
                endif    
                if (sliderSpeed == 0) then
                    set xHero = x1
                    set yHero = y1
                    set tirOk = true
                else
                    call CalculerPointsIntersections()
                    if (sliderSpeed < 0) then
                        set sliderSpeed = -sliderSpeed
                    endif
                    if (k1 == 0 and k2 == 0) then
                        return
                    endif
                    //sens points
                    if (CosBJ(angleSlider) != 0) then
                        set sensPoint1positif = (Xk1 - x1) * CosBJ(angleSlider) > 0
                        set sensPoint2positif = (Xk2 - x1) * CosBJ(angleSlider) > 0
                    else
                        set sensPoint1positif = (Yk1 - y1) * SinBJ(angleSlider) > 0
                        set sensPoint2positif = (Yk2 - y1) * SinBJ(angleSlider) > 0
                    endif
                    //déterminer lequel des deux points d'intersection est devant le héros
                    if (sensPoint1positif == sensPoint2positif) then //cas exceptionnel où le point d'intersection le plus proche du héros apparaît être placé après le héros, comme l'autre point
                        //calcul du temps pour chaque point pour trouver le plus éloigné qui est le bon
                        set tempsPoint1 = SquareRoot((x1 - Xk1) * (x1 - Xk1) + (y1 - Yk1) * (y1 - Yk1)) / sliderSpeed
                        set tempsPoint2 = SquareRoot((x1 - Xk2) * (x1 - Xk2) + (y1 - Yk2) * (y1 - Yk2)) / sliderSpeed
                        if (tempsPoint1 > tempsPoint2) then
                            set XintersectionDevantHeros = Xk1
                            set YintersectionDevantHeros = Yk1
                            set tempsMax = tempsPoint1
                        else
                            set XintersectionDevantHeros = Xk2
                            set YintersectionDevantHeros = Yk2
                            set tempsMax = tempsPoint2
                        endif
                    else
                        if (sensPoint1positif) then
                            set XintersectionDevantHeros = Xk1
                            set YintersectionDevantHeros = Yk1
                            set tempsMax = SquareRoot((x1 - Xk1) * (x1 - Xk1) + (y1 - Yk1) * (y1 - Yk1)) / sliderSpeed
                        else
                            set XintersectionDevantHeros = Xk2
                            set YintersectionDevantHeros = Yk2
                            set tempsMax = SquareRoot((x1 - Xk2) * (x1 - Xk2) + (y1 - Yk2) * (y1 - Yk2)) / sliderSpeed
                        endif
                    endif   
                    
                    //trouver temps idéal
                    if (IsOnGround(escaper.getHero())) then
                        set tempsIdeal = TrouverTempsIdeal(tempsMax)
                    else
                        set tempsIdeal = -1
                    endif
                    if (tempsIdeal != -1) then
                        set xHero = x1 + sliderSpeed * CosBJ(angleSlider) * tempsIdeal
                        set yHero = y1 + sliderSpeed * SinBJ(angleSlider) * tempsIdeal
                        set tirOk = true
                    endif
                endif
                if (tirOk) then
                    if (caster.isEnabled()) then
                        set angleDeTir = Atan2BJ(yHero - y3, xHero - x3)
                        call SetUnitFacing(caster.getCasterUnit(), angleDeTir)
                        call SetUnitAnimation(caster.getCasterUnit(), caster.getAnimation())
                        call CasterShot.create(caster.getProjectileMonsterType(), x3, y3, angleDeTir, caster.getProjectileSpeed(), caster.getRange())
                    endif
                else
                    //on retire l'escaper du pick aléatoire
                    set i = numEscaper
                    loop
                        exitwhen (i == nbRemainingEscapersToShoot - 1)
                            set escapersToShoot[i] = escapersToShoot[i + 1]
                        set i = i + 1
                    endloop
                    set nbRemainingEscapersToShoot = nbRemainingEscapersToShoot - 1
                    set tirOk = false
                endif
            endif
        //pas de n = n + 1
    endloop
    if (tirOk) then
        //on attend que le temps soit écoulé pour un autre tir
        call TimerStart(caster.t, caster.getLoadTime(), false, function CasterTryToShoot)
        set caster.canShoot = false
    elseif (caster.nbEscapersInRange == 0) then
        //plus aucun héros à portée, on stoppe tout
        set caster.canShoot = true
    else
        //héros à portée mais impossible de tirer, on attend un peu et on réessaie
        call TimerStart(caster.t, ECART_CHECK, false, function CasterTryToShoot)
    endif    
endfunction



function CasterUnitWithinRange_Actions takes nothing returns nothing
    local Escaper escaperInRange = Hero2Escaper(GetTriggerUnit())
    if (escaperInRange == 0) then
        return
    endif
    set caster = Caster(LoadInteger(Caster_casterHashtable, 0, GetHandleId(GetTriggeringTrigger())))
    set caster.escapersInRange[caster.nbEscapersInRange] = escaperInRange
    set caster.nbEscapersInRange = caster.nbEscapersInRange + 1
    if (caster.canShoot) then
        call TimerStart(caster.t, 0, false, function CasterTryToShoot)
    endif
endfunction






endlibrary