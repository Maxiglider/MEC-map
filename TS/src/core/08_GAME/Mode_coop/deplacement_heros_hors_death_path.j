//TESH.scrollpos=0
//TESH.alwaysfold=0
library DeplacementHeroHorsDeathPath


globals
    private constant real GRADUATION_ANGLE = 5.
    private constant real VALEUR_DECALAGE = 60.
endglobals 


function DeplacementHeroHorsDeathPath takes unit hero returns nothing
    local real angle
    local real angleIdeal
    local real x
    local real y
    local real xDecal
    local real yDecal
    local real xHero = GetUnitX(hero)
    local real yHero = GetUnitY(hero)
    local integer nbPointsNonDeath
    local real anglesCumules
    local real premierAngleNonDeath = 0
    local real dernierAngleNonDeath = 0
    local real deuxiemePremierAngleNonDeath = 0
    local real deuxiemeDernierAngleNonDeath = 0
    local boolean angleNonDeathTrouveALInstant = false
    
    //vérification que le héros est sur le terrain qui tue
    if (udg_terrainTypes.getTerrainType(xHero, yHero).getKind() != "death") then
        return
    endif
    
    //parcours des angles pour voir où se situent les terrains non death
    set angle = 0
    loop
        exitwhen angle >= 360
            set x = xHero + VALEUR_DECALAGE * CosBJ(angle)
            set y = yHero + VALEUR_DECALAGE * SinBJ(angle)
            if (udg_terrainTypes.getTerrainType(x, y).getKind() != "death") then
                if (not angleNonDeathTrouveALInstant) then
                    if (dernierAngleNonDeath == 0) then //pas encore d'angle non death trouvé
                        set premierAngleNonDeath = angle
                        debug call BJDebugMsg("premier angle = " + R2S(premierAngleNonDeath))
                    else
                        set deuxiemePremierAngleNonDeath = angle
                        debug call BJDebugMsg("deuxieme premier angle = " + R2S(deuxiemePremierAngleNonDeath))
                    endif
                    set angleNonDeathTrouveALInstant = true
                endif
            else
                if (angleNonDeathTrouveALInstant) then //dernierAngleNonDeathTrouvé
                    if (dernierAngleNonDeath == 0) then
                        set dernierAngleNonDeath = angle - GRADUATION_ANGLE
                        debug call BJDebugMsg("dernier angle = " + R2S(dernierAngleNonDeath))
                    else
                        set deuxiemeDernierAngleNonDeath = angle - GRADUATION_ANGLE
                        debug call BJDebugMsg("deuxieme dernier angle = " + R2S(deuxiemeDernierAngleNonDeath))
                    endif
                    set angleNonDeathTrouveALInstant = false
                endif
            endif
        set angle = angle + GRADUATION_ANGLE
    endloop
    //ajout du dernier angle s'il est non death
    if (angleNonDeathTrouveALInstant) then
        if (dernierAngleNonDeath == 0) then
            set dernierAngleNonDeath = angle - GRADUATION_ANGLE
            debug call BJDebugMsg("dernier angle = " + R2S(dernierAngleNonDeath))
        else
            set deuxiemeDernierAngleNonDeath = angle - GRADUATION_ANGLE
            debug call BJDebugMsg("deuxieme dernier angle = " + R2S(deuxiemeDernierAngleNonDeath))
        endif
    endif
        
    //calcul de l'angle idéal
    //cas simple où l'ensemble des angles non death ne passe pas par 0
    if (deuxiemePremierAngleNonDeath == 0) then
        //cas aucun angle non death trouvé
        if (dernierAngleNonDeath == 0) then
            debug call BJDebugMsg("Pas de terrain non death proche trouvé !")
            return
        endif
        set angleIdeal = (dernierAngleNonDeath + premierAngleNonDeath) / 2
    else //cas où l'ensemble des angles non death passe par 0
        if (premierAngleNonDeath != 0 or deuxiemeDernierAngleNonDeath != 355) then //cas où l'on a deux ensembles d'angles distincts
            debug call BJDebugMsg("DEUX ENSEMBLES D'ANGLES DISTINCTS")
            if (dernierAngleNonDeath - premierAngleNonDeath > deuxiemeDernierAngleNonDeath - deuxiemePremierAngleNonDeath) then //on choisit l'ensemble d'angles le plus large
                set angleIdeal = (dernierAngleNonDeath + premierAngleNonDeath) / 2
            else
                set angleIdeal = (deuxiemeDernierAngleNonDeath + deuxiemePremierAngleNonDeath) / 2
            endif
        else //les deux ensembles d'angles se rejoignent
        set angleIdeal = ((dernierAngleNonDeath + deuxiemePremierAngleNonDeath) / 2) + 180
        endif
    endif
    debug call BJDebugMsg("angle idéal = " + R2S(angleIdeal))

    //déplacement du héros
    set xDecal = xHero + VALEUR_DECALAGE * CosBJ(angleIdeal)
    set yDecal = yHero + VALEUR_DECALAGE * SinBJ(angleIdeal)
    call SetUnitPosition(hero, xDecal, yDecal)
endfunction



endlibrary