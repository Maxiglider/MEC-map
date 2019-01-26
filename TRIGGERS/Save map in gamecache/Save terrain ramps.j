library SaveTerrainRamps needs Text, SaveWater


globals
    private real y
    private boolean array ramps
    private constant real DECAL_TEST_PATH = 10
endglobals


/*
takes a ramp (ramp center + direction of the ramp)
returns if the ramp middle is raised
a ramp middle is not raised in some cases, depending of the cliff level around the ramp :
here is the ramp : (R = ramp tilepoint, N = near ramp tilepoint, T = basic tilepoint)
TNNNT
TRRRT
TNNNT
the middle R is at cliff level CL
if one of the N tilepoints is at a cliff level different than CL or CL+1, the ramp middle isn't raised
*/
private function isRampMiddleRaised takes real x, real y, boolean isRampDirectionX returns boolean
    local integer middleRampcliffLevel = GetTerrainCliffLevel(x, y)
    local integer diffCliffLevel
    local integer sens = -1
    local integer diff
    local real x2
    local real y2
    local boolean isRampMiddleRaisedB = true

    //call CreateUnit(Player(0), 'hpea', x, y, 0)

    loop
        exitwhen sens > 1
            set diff = -1
            loop
                exitwhen diff > 1
                    if (isRampDirectionX) then
                        set x2 = x + diff * LARGEUR_CASE
                        set y2 = y + sens * LARGEUR_CASE
                    else
                        set x2 = x + sens * LARGEUR_CASE
                        set y2 = y + diff * LARGEUR_CASE
                    endif
                    set diffCliffLevel = GetTerrainCliffLevel(x2, y2) - middleRampcliffLevel
                    if (diffCliffLevel < 0 or diffCliffLevel > 1) then
                        set isRampMiddleRaisedB = false
                    endif
                set diff = diff + 1
            endloop
        set sens = sens + 2        
    endloop

    return isRampMiddleRaisedB
endfunction


//save terrain ramps
private function SaveTerrainRamps_Actions takes nothing returns nothing
    local real x
    local integer currentCliffLevel
    local integer otherCliffLevel
    local integer otherCliffLevel2
    local real otherX
    local real otherY
    local boolean ramp
    local boolean isRampMiddleRaisedB
    local string rampStr
    local boolean walkable
    local boolean walkable2
    local location loc1
    local location loc2
    local integer signX
    local integer signY

    if (y <= MAP_MAX_Y) then
        set x = MAP_MIN_X
        loop
            exitwhen (x > MAP_MAX_X)
                set ramp = false

                if (not IsNearBounds(x, y)) then //à cause de l'utilisation préalable de GetTerrainZ, GetTerrainCliffLevel plante sur les bords de la carte
                    set currentCliffLevel = GetTerrainCliffLevel(x, y)
                    set isRampMiddleRaisedB = false

                    if (not isRampMiddleRaisedB) then
                        //droite
                        set otherX = x + LARGEUR_CASE
                        set otherY = y
                        if (otherX <= MAP_MAX_X) then
                            set otherCliffLevel = GetTerrainCliffLevel(otherX, otherY)

                            set otherX = x + LARGEUR_CASE/2
                            set walkable = not IsTerrainPathable(otherX, otherY + DECAL_TEST_PATH, PATHING_TYPE_WALKABILITY) or not IsTerrainPathable(otherX, otherY - DECAL_TEST_PATH, PATHING_TYPE_WALKABILITY) //can't ça renvoie false, c'est walkable, c'est l'inverse de la logique

                            if (currentCliffLevel != otherCliffLevel) then
                                //il y a une falaise entre les deux ; si c'est walkable malgré tout, c'est qu'il y a une rampe
                                if (walkable) then
                                    set ramp = true
                                elseif (IAbsBJ(currentCliffLevel - otherCliffLevel) == 1) then //il ne peut y avoir de rampe que si la différence de niveau est de 1
                                    //ce n'est pas walkable, mais il y a peut-être une rampe, de largeur 1
                                    //si ce n'est pas walkable non plus en bas de la falaise, c'est qu'il y a une rampe
                                    if (currentCliffLevel > otherCliffLevel) then
                                        set otherX = x + 3 * LARGEUR_CASE/2
                                    else
                                        set otherX = x - LARGEUR_CASE/2
                                    endif
                                    set walkable2 = not IsTerrainPathable(otherX, otherY + DECAL_TEST_PATH, PATHING_TYPE_WALKABILITY) or not IsTerrainPathable(otherX, otherY - DECAL_TEST_PATH, PATHING_TYPE_WALKABILITY)
                                    if (not walkable2) then
                                        //il y a une rampe à condition que les deux points en bas de la falaise soient au même niveau de falaise et pas à la même hauteur
                                        if (currentCliffLevel < otherCliffLevel) then
                                            set loc1 = Location(x, y)
                                            set loc2 = Location(x - LARGEUR_CASE, y)
                                        else
                                            set loc1 = Location(otherX, y)
                                            set loc2 = Location(otherX + LARGEUR_CASE, y)
                                        endif
                                        if (GetLocationZ(loc1) != GetLocationZ(loc2) and GetTerrainCliffLevelBJ(loc1) == GetTerrainCliffLevelBJ(loc2)) then
                                            set ramp = true
                                        endif
                                        call RemoveLocation(loc1)
                                        call RemoveLocation(loc2)
                                    endif
                                endif
                                //s'il y a une rampe, on détermine si on est au milieu de la rampe
                                if (ramp) then
                                    if (currentCliffLevel < otherCliffLevel) then
                                        set isRampMiddleRaisedB = isRampMiddleRaised(x, y, true)
                                    endif
                                endif
                            else
                                //il n'y a pas de falaise entre les deux ; si ce n'est pas walkable, il y a une rampe de largeur 1 s'il y a une falaise ensuite vers le haut de différence 1
                                if (not walkable) then
                                    set otherX = x + LARGEUR_CASE*2
                                    set otherCliffLevel2 = GetTerrainCliffLevel(otherX, otherY)
                                    if (otherCliffLevel2 - currentCliffLevel == 1) then
                                        //il y a une rampe sauf si les deux points en bas de la falaise sont à la même hauteur
                                        set loc1 = Location(x, y)
                                        set loc2 = Location(x + LARGEUR_CASE, y)
                                        if (GetLocationZ(loc1) != GetLocationZ(loc2)) then
                                            set ramp = true
                                        endif
                                        call RemoveLocation(loc1)
                                        call RemoveLocation(loc2)
                                    endif
                                else
                                    //il peut y avoir une rampe s'il y a une falaise juste après, vers le haut et walkable
                                    set otherX = x + LARGEUR_CASE*2
                                    if (otherX <= MAP_MAX_X) then
                                        set otherCliffLevel2 = GetTerrainCliffLevel(otherX, otherY)
                                        if (currentCliffLevel < otherCliffLevel2) then
                                            set otherX = otherX - LARGEUR_CASE/2
                                            set walkable2 = not IsTerrainPathable(otherX, otherY + DECAL_TEST_PATH, PATHING_TYPE_WALKABILITY) or not IsTerrainPathable(otherX, otherY - DECAL_TEST_PATH, PATHING_TYPE_WALKABILITY)
                                            if (walkable2) then
                                                set ramp = true
                                            endif
                                        endif
                                    endif
                                endif
                            endif
                        endif          
                    endif  

                    if (not isRampMiddleRaisedB) then
                        //gauche
                        set otherX = x - LARGEUR_CASE
                        set otherY = y
                        if (otherX >= MAP_MIN_X) then
                            set otherCliffLevel = GetTerrainCliffLevel(otherX, otherY)

                            set otherX = x - LARGEUR_CASE/2
                            set walkable = not IsTerrainPathable(otherX, otherY + DECAL_TEST_PATH, PATHING_TYPE_WALKABILITY) or not IsTerrainPathable(otherX, otherY - DECAL_TEST_PATH, PATHING_TYPE_WALKABILITY) //can't ça renvoie false, c'est walkable, c'est l'inverse de la logique

                            if (currentCliffLevel != otherCliffLevel) then
                                //il y a une falaise entre les deux ; si c'est walkable malgré tout, c'est qu'il y a une rampe
                                if (walkable) then
                                    set ramp = true
                                elseif (IAbsBJ(currentCliffLevel - otherCliffLevel) == 1) then //il ne peut y avoir de rampe que si la différence de niveau est de 1
                                    //ce n'est pas walkable, mais il y a peut-être une rampe, de largeur 1
                                    //si ce n'est pas walkable non plus en bas de la falaise, c'est qu'il y a une rampe
                                    if (currentCliffLevel > otherCliffLevel) then
                                        set otherX = x - 3 * LARGEUR_CASE/2
                                    else
                                        set otherX = x + LARGEUR_CASE/2
                                    endif
                                    set walkable2 = not IsTerrainPathable(otherX, otherY + DECAL_TEST_PATH, PATHING_TYPE_WALKABILITY) or not IsTerrainPathable(otherX, otherY - DECAL_TEST_PATH, PATHING_TYPE_WALKABILITY)
                                    if (not walkable2) then
                                        //il y a une rampe à condition que les deux points en bas de la falaise soient au même niveau de falaise et pas à la même hauteur
                                        if (currentCliffLevel < otherCliffLevel) then
                                            set loc1 = Location(x, y)
                                            set loc2 = Location(x + LARGEUR_CASE, y)
                                        else
                                            set loc1 = Location(otherX, y)
                                            set loc2 = Location(otherX - LARGEUR_CASE, y)
                                        endif
                                        if (GetLocationZ(loc1) != GetLocationZ(loc2) and GetTerrainCliffLevelBJ(loc1) == GetTerrainCliffLevelBJ(loc2)) then
                                            set ramp = true
                                        endif
                                        call RemoveLocation(loc1)
                                        call RemoveLocation(loc2)
                                    endif
                                endif
                                //s'il y a une rampe, on détermine si on est au milieu de la rampe
                                if (ramp) then
                                    if (currentCliffLevel < otherCliffLevel) then
                                        set isRampMiddleRaisedB = isRampMiddleRaised(x, y, true)
                                    endif
                                endif
                            else
                                //il n'y a pas de falaise entre les deux ; si ce n'est pas walkable, il y a une rampe de largeur 1 s'il y a une falaise ensuite vers le haut de différence 1
                                if (not walkable) then
                                    set otherX = x - LARGEUR_CASE*2
                                    set otherCliffLevel2 = GetTerrainCliffLevel(otherX, otherY)
                                    if (otherCliffLevel2 - currentCliffLevel == 1) then
                                        //il y a une rampe sauf si les deux points en bas de la falaise sont à la même hauteur
                                        set loc1 = Location(x, y)
                                        set loc2 = Location(x - LARGEUR_CASE, y)
                                        if (GetLocationZ(loc1) != GetLocationZ(loc2)) then
                                            set ramp = true
                                        endif
                                        call RemoveLocation(loc1)
                                        call RemoveLocation(loc2)
                                    endif
                                else
                                    //il peut y avoir une rampe s'il y a une falaise juste après, vers le haut et walkable
                                    set otherX = x - LARGEUR_CASE*2
                                    if (otherX >= MAP_MIN_X) then
                                        set otherCliffLevel2 = GetTerrainCliffLevel(otherX, otherY)
                                        if (currentCliffLevel < otherCliffLevel2) then
                                            set otherX = otherX + LARGEUR_CASE/2
                                            set walkable2 = not IsTerrainPathable(otherX, otherY + DECAL_TEST_PATH, PATHING_TYPE_WALKABILITY) or not IsTerrainPathable(otherX, otherY - DECAL_TEST_PATH, PATHING_TYPE_WALKABILITY)
                                            if (walkable2) then
                                                set ramp = true
                                            endif
                                        endif
                                    endif
                                endif
                            endif
                        endif     
                    endif       

                    if (not isRampMiddleRaisedB) then
                        //haut
                        set otherX = x
                        set otherY = y + LARGEUR_CASE
                        if (otherY <= MAP_MAX_Y) then
                            set otherCliffLevel = GetTerrainCliffLevel(otherX, otherY)

                            set otherY = y + LARGEUR_CASE/2
                            set walkable = not IsTerrainPathable(otherX + DECAL_TEST_PATH, otherY, PATHING_TYPE_WALKABILITY) or not IsTerrainPathable(otherX - DECAL_TEST_PATH, otherY, PATHING_TYPE_WALKABILITY) //can't ça renvoie false, c'est walkable, c'est l'inverse de la logique

                            if (currentCliffLevel != otherCliffLevel) then
                                //il y a une falaise entre les deux ; si c'est walkable malgré tout, c'est qu'il y a une rampe
                                if (walkable) then
                                    set ramp = true
                                elseif (IAbsBJ(currentCliffLevel - otherCliffLevel) == 1) then //il ne peut y avoir de rampe que si la différence de niveau est de 1
                                    //ce n'est pas walkable, mais il y a peut-être une rampe, de largeur 1
                                    //si ce n'est pas walkable non plus en bas de la falaise, c'est qu'il y a une rampe
                                    if (currentCliffLevel > otherCliffLevel) then
                                        set otherY = y + 3 * LARGEUR_CASE/2
                                    else
                                        set otherY = y - LARGEUR_CASE/2
                                    endif
                                    set walkable2 = not IsTerrainPathable(otherX + DECAL_TEST_PATH, otherY, PATHING_TYPE_WALKABILITY) or not IsTerrainPathable(otherX - DECAL_TEST_PATH, otherY, PATHING_TYPE_WALKABILITY)
                                    if (not walkable2) then
                                        //il y a une rampe à condition que les deux points en bas de la falaise soient au même niveau de falaise et pas à la même hauteur
                                        if (currentCliffLevel < otherCliffLevel) then
                                            set loc1 = Location(x, y)
                                            set loc2 = Location(x, y - LARGEUR_CASE)
                                        else
                                            set loc1 = Location(x, otherY)
                                            set loc2 = Location(x, otherY + LARGEUR_CASE)
                                        endif
                                        if (GetLocationZ(loc1) != GetLocationZ(loc2) and GetTerrainCliffLevelBJ(loc1) == GetTerrainCliffLevelBJ(loc2)) then
                                            set ramp = true
                                        endif
                                        call RemoveLocation(loc1)
                                        call RemoveLocation(loc2)
                                    endif
                                endif
                                //s'il y a une rampe, on détermine si on est au milieu de la rampe
                                if (ramp) then
                                    if (currentCliffLevel < otherCliffLevel) then
                                        set isRampMiddleRaisedB = isRampMiddleRaised(x, y, false)
                                    endif
                                endif
                            else
                                //il n'y a pas de falaise entre les deux ; si ce n'est pas walkable, il y a une rampe de largeur 1 s'il y a une falaise ensuite vers le haut de différence 1
                                if (not walkable) then
                                    set otherY = y + LARGEUR_CASE*2
                                    set otherCliffLevel2 = GetTerrainCliffLevel(otherX, otherY)
                                    if (otherCliffLevel2 - currentCliffLevel == 1) then
                                        //il y a une rampe sauf si les deux points en bas de la falaise sont à la même hauteur
                                        set loc1 = Location(x, y)
                                        set loc2 = Location(x, y + LARGEUR_CASE)
                                        if (GetLocationZ(loc1) != GetLocationZ(loc2)) then
                                            set ramp = true
                                        endif
                                        call RemoveLocation(loc1)
                                        call RemoveLocation(loc2)
                                    endif
                                else
                                    //il peut y avoir une rampe s'il y a une falaise juste après, vers le haut et walkable
                                    set otherY = y + LARGEUR_CASE*2
                                    if (otherY <= MAP_MAX_Y) then
                                        set otherCliffLevel2 = GetTerrainCliffLevel(otherX, otherY)
                                        if (currentCliffLevel < otherCliffLevel2) then
                                            set otherY = otherY - LARGEUR_CASE/2
                                            set walkable2 = not IsTerrainPathable(otherX + DECAL_TEST_PATH, otherY, PATHING_TYPE_WALKABILITY) or not IsTerrainPathable(otherX - DECAL_TEST_PATH, otherY, PATHING_TYPE_WALKABILITY)
                                            if (walkable2) then
                                                set ramp = true
                                            endif
                                        endif
                                    endif
                                endif
                            endif
                        endif      
                    endif      

                    if (not isRampMiddleRaisedB) then
                        //bas
                        set otherX = x
                        set otherY = y - LARGEUR_CASE
                        if (otherY >= MAP_MIN_Y) then
                            set otherCliffLevel = GetTerrainCliffLevel(otherX, otherY)

                            set otherY = y - LARGEUR_CASE/2
                            set walkable = not IsTerrainPathable(otherX + DECAL_TEST_PATH, otherY, PATHING_TYPE_WALKABILITY) or not IsTerrainPathable(otherX - DECAL_TEST_PATH, otherY, PATHING_TYPE_WALKABILITY)

                            if (currentCliffLevel != otherCliffLevel) then
                                //il y a une falaise entre les deux ; si c'est walkable malgré tout, c'est qu'il y a une rampe
                                if (walkable) then
                                    set ramp = true
                                elseif (IAbsBJ(currentCliffLevel - otherCliffLevel) == 1) then //il ne peut y avoir de rampe que si la différence de niveau est de 1
                                    //ce n'est pas walkable, mais il y a peut-être une rampe, de largeur 1
                                    //si ce n'est pas walkable non plus en bas de la falaise, c'est qu'il y a une rampe
                                    if (currentCliffLevel > otherCliffLevel) then
                                        set otherY = y - 3 * LARGEUR_CASE/2
                                    else
                                        set otherY = y + LARGEUR_CASE/2
                                    endif
                                    set walkable2 = not IsTerrainPathable(otherX + DECAL_TEST_PATH, otherY, PATHING_TYPE_WALKABILITY) or not IsTerrainPathable(otherX - DECAL_TEST_PATH, otherY, PATHING_TYPE_WALKABILITY)
                                    if (not walkable2) then
                                        //il y a une rampe à condition que les deux points en bas de la falaise soient au même niveau de falaise et pas à la même hauteur
                                        if (currentCliffLevel < otherCliffLevel) then
                                            set loc1 = Location(x, y)
                                            set loc2 = Location(x, y + LARGEUR_CASE)
                                        else
                                            set loc1 = Location(x, otherY)
                                            set loc2 = Location(x, otherY - LARGEUR_CASE)
                                        endif
                                        if (GetLocationZ(loc1) != GetLocationZ(loc2) and GetTerrainCliffLevelBJ(loc1) == GetTerrainCliffLevelBJ(loc2)) then
                                            set ramp = true
                                        endif
                                        call RemoveLocation(loc1)
                                        call RemoveLocation(loc2)
                                    endif
                                endif
                                //s'il y a une rampe, on détermine si on est au milieu de la rampe
                                if (ramp) then
                                    if (currentCliffLevel < otherCliffLevel) then
                                        set isRampMiddleRaisedB = isRampMiddleRaised(x, y, false)
                                    endif
                                endif
                            else
                                //il n'y a pas de falaise entre les deux ; si ce n'est pas walkable, il y a une rampe de largeur 1 s'il y a une falaise ensuite vers le haut de différence 1
                                if (not walkable) then
                                    set otherY = y - LARGEUR_CASE*2
                                    set otherCliffLevel2 = GetTerrainCliffLevel(otherX, otherY)
                                    if (otherCliffLevel2 - currentCliffLevel == 1) then
                                        //il y a une rampe sauf si les deux points en bas de la falaise sont à la même hauteur
                                        set loc1 = Location(x, y)
                                        set loc2 = Location(x, y - LARGEUR_CASE)
                                        if (GetLocationZ(loc1) != GetLocationZ(loc2)) then
                                            set ramp = true
                                        endif
                                        call RemoveLocation(loc1)
                                        call RemoveLocation(loc2)
                                    endif
                                else
                                    //il peut y avoir une rampe s'il y a une falaise juste après, vers le haut et walkable
                                    set otherY = y - LARGEUR_CASE*2
                                    if (otherY >= MAP_MIN_Y) then
                                        set otherCliffLevel2 = GetTerrainCliffLevel(otherX, otherY)
                                        if (currentCliffLevel < otherCliffLevel2) then
                                            set otherY = otherY + LARGEUR_CASE/2
                                            set walkable2 = not IsTerrainPathable(otherX + DECAL_TEST_PATH, otherY, PATHING_TYPE_WALKABILITY) or not IsTerrainPathable(otherX - DECAL_TEST_PATH, otherY, PATHING_TYPE_WALKABILITY)
                                            if (walkable2) then
                                                set ramp = true
                                            endif
                                        endif
                                    endif
                                endif
                            endif
                        endif    
                    endif      

                    //rampes en diagonales
                    if (not ramp) then
                        set signY = -1
                        loop
                        exitwhen (ramp or signY > 1)
                            set signX = -1
                            loop
                            exitwhen (ramp or signX > 1)
                                set otherX = x + LARGEUR_CASE*signX
                                set otherY = y + LARGEUR_CASE*signY
                                set otherCliffLevel = GetTerrainCliffLevel(otherX, otherY)
                                //call BJDebugMsg("signX : " + R2S(signX) + " ; signY : " + R2S(signY) + " ; x : " + R2S(otherX) + " ; y : " + R2S(otherY))
                                //on ne prend en compte que si ça monte et que c'est walkable
                                if (currentCliffLevel < otherCliffLevel) then
                                    set otherX = x + LARGEUR_CASE*signX/2
                                    set otherY = y + LARGEUR_CASE*signY/2
                                    set walkable = not IsTerrainPathable(otherX, otherY, PATHING_TYPE_WALKABILITY)
                                    if (walkable) then
                                        set ramp = true
                                    else
                                    endif
                                endif
                                set signX = signX + 2
                            endloop
                            set signY = signY + 2
                        endloop
                    endif  
                endif 

                if (ramp) then
                    if (isRampMiddleRaisedB) then
                        //call CreateUnit(Player(0), 'hpea', x, y, 0)
                        set rampStr = "2" 
                    else
                        //call CreateUnit(Player(1), 'hpea', x, y, 0)
                        set rampStr = "1"
                    endif
                else
                    set rampStr = "0"
                endif

                call stringArrayForCache.push(rampStr)
            set x = x + LARGEUR_CASE
        endloop
        set y = y + LARGEUR_CASE
        set loc1 = null
        set loc2 = null
    else
        call DisableTrigger(GetTriggeringTrigger())
        call stringArrayForCache.writeInCache()
        call Text_A("terrain ramps saved")
        call StartSaveWater()
    endif
endfunction


function StartSaveTerrainRamps takes nothing returns nothing
    set y = MAP_MIN_Y
    set stringArrayForCache = StringArrayForCache.create("terrain", "terrainRamps", false)
    call TriggerClearActions(trigSaveMapInCache)
    call TriggerAddAction(trigSaveMapInCache, function SaveTerrainRamps_Actions)
    call EnableTrigger(trigSaveMapInCache)
endfunction

endlibrary