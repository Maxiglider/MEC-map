//TESH.scrollpos=14
//TESH.alwaysfold=0
library AutoContinueAfterSliding initializer Init_AutoContinueAfterSliding  //needs AddDelay



globals
    real array lastClickedX
    real array lastClickedY
    widget array lastClickedWidgets
    boolean array isLastTargetALocation
    boolean array udg_autoContinueAfterSliding
    
    private constant real ECART_MAX_ANGLE = 45.
endglobals


function AutoContinueAfterSliding takes integer n returns nothing
    local unit hero = udg_escapers.get(n).getHero()
//vérification de l'angle
    local real angleHero2Target = Atan2(lastClickedY[n] - GetUnitY(hero), lastClickedX[n] - GetUnitX(hero)) * bj_RADTODEG
    local real diffAngle = RAbsBJ(angleHero2Target - GetUnitFacing(hero))
    if (diffAngle > ECART_MAX_ANGLE and diffAngle < 360. - ECART_MAX_ANGLE) then //écart trop grand
        return
    endif
    
//cas dernier clic : un point
    if (isLastTargetALocation[n]) then 
        call IssuePointOrder(hero, "move", lastClickedX[n], lastClickedY[n])
        debug call BJDebugMsg("acas move to : " + R2S(lastClickedX[n]) + ", " + R2S(lastClickedY[n]))
        
//cas dernier clic : pas un point
    else
        //dernier widget cliqué n'existe pas (donc aucun clic effectué pendant le slide)
        if (lastClickedWidgets[n] == null) then
            return
        else
            //cible n'a pas bougé
            if (GetWidgetX(lastClickedWidgets[n]) == lastClickedX[n] and GetWidgetY(lastClickedWidgets[n]) == lastClickedY[n]) then
                //ordre clic droit vers cible
                call IssueTargetOrder(hero, "smart", lastClickedWidgets[n])
            else
                //bouger vers ancien endroit du widget
                call IssuePointOrder(hero, "move", lastClickedX[n], lastClickedY[n])
            endif
        endif
    endif
endfunction


function ClearLastClickSave takes integer n returns nothing
    set isLastTargetALocation[n] = false
    set lastClickedWidgets[n] = null
endfunction


//===========================================================================
function Init_AutoContinueAfterSliding takes nothing returns nothing
    local integer i = 0
    loop
        exitwhen (i >= NB_ESCAPERS)
            set udg_autoContinueAfterSliding[i] = true
        set i = i + 1
    endloop
endfunction


endlibrary