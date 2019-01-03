//TESH.scrollpos=0
//TESH.alwaysfold=0
library CasterShot initializer InitCasterShot needs MonsterCreationFunctions


globals
    private hashtable shotsHashtable //0 : CasterShot, 1 : triggers
    private constant real PERIOD = 0.01
endglobals



private function CasterShot_Actions takes nothing returns nothing
    local CasterShot shot = CasterShot(LoadInteger(shotsHashtable, 0, GetHandleId(GetTriggeringTrigger())))
    set shot.x = shot.x + shot.diffX
    set shot.y = shot.y + shot.diffY
    if (shot.x >= MAP_MIN_X and shot.x <= MAP_MAX_X) then
        call SetUnitX(shot.unite, shot.x)
    endif
    if (shot.y >= MAP_MIN_Y and shot.y <= MAP_MAX_Y) then
        call SetUnitY(shot.unite, shot.y)
    endif
    set shot.nbTeleportationsRestantes = shot.nbTeleportationsRestantes - 1
    if (shot.nbTeleportationsRestantes == 0) then
        call shot.destroy()
    endif
endfunction



struct CasterShot
    real x
    real y
    real diffX
    real diffY
    integer nbTeleportationsRestantes
    unit unite
    private trigger trig

    static method create takes MonsterType monsterType, real Xdep, real Ydep, real angle, real speed, real portee returns CasterShot
        local CasterShot t = CasterShot.allocate()
        set t.x = Xdep
        set t.y = Ydep
        set t.diffX = speed * CosBJ(angle) * PERIOD
        set t.diffY = speed * SinBJ(angle) * PERIOD
        set t.nbTeleportationsRestantes = R2I((portee / speed) / PERIOD)
        set t.unite = NewImmobileMonster(monsterType, Xdep, Ydep, angle)
        set t.trig = CreateTrigger()
        call TriggerRegisterTimerEvent(t.trig, PERIOD, true)
        call TriggerAddAction(t.trig, function CasterShot_Actions)
        call SaveInteger(shotsHashtable, 0, GetHandleId(t.trig), t)
        return t
    endmethod
        
    method onDestroy takes nothing returns nothing
        call RemoveUnit(.unite)
        set .unite = null
        call DestroyTrigger(.trig)
        set .trig = null
    endmethod
endstruct


//===========================================================================
function InitCasterShot takes nothing returns nothing 
    set shotsHashtable = InitHashtable()
endfunction



endlibrary