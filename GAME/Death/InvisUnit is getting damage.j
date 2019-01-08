//TESH.scrollpos=32
//TESH.alwaysfold=0
//évènement ajouté à la création de l'unité invisible


globals
    real TAILLE_UNITE = 100
endglobals


function Trig_invisUnit_dies_Actions takes nothing returns nothing
    local unit invisUnit = GetTriggerUnit()
    local integer n = GetUnitUserData(invisUnit)
    local Escaper escaper = udg_escapers.get(n)
    local unit killingUnit = GetEventDamageSource()
    local ClearMob clearMob
    local MonsterOrCaster moc
    local string effectStr
    local effect eff
    local real x
    local real y
    local location heroPos = GetUnitLoc(escaper.getHero())
    local real hauteurHero = GetLocationZ(heroPos) + GetUnitFlyHeight(escaper.getHero())
    local location killingUnitPos = GetUnitLoc(killingUnit)
    local real hauteurKillingUnit = GetLocationZ(killingUnitPos) + GetUnitFlyHeight(killingUnit)
    
    call RemoveLocation(heroPos)
    call RemoveLocation(killingUnitPos)
    set heroPos = null
    set killingUnitPos = null
    
    if (not escaper.isAlive()) then
        set invisUnit = null
        set killingUnit = null
        return
    endif
    
    
    if (RAbsBJ(hauteurHero - hauteurKillingUnit) < TAILLE_UNITE) then
        if (GetUnitTypeId(killingUnit) == 'dcir') then //on vient de toucher un héros mort, on va le ressusciter
            call udg_escapers.get(GetUnitUserData(killingUnit)).coopReviveHero()
            set invisUnit = null
            set killingUnit = null 
            return
        else
            set clearMob = ClearTriggerMobId2ClearMob(GetUnitUserData(killingUnit))
            if (clearMob != 0) then //cas de l'activation d'un clear mob
                call clearMob.activate()
            elseif (escaper.isGodModeOn()) then //cas d'une immolation classique
                if (escaper.doesGodModeKills()) then
                    if(GetUnitUserData(killingUnit) != 0)then
                        set moc = MonsterOrCaster.create(GetUnitUserData(killingUnit))
                        call moc.killUnit() //on ne tue pas directement le monstre, pour pouvoir exécuter des actions secondaires
                        call moc.destroy()
                    else
                        call KillUnit(killingUnit) //c'est un simple monstre de spawn ou invoqué, on le tue directement
                    endif
                endif
                set x = GetUnitX(killingUnit)
                set y = GetUnitY(killingUnit)
                set eff = AddSpecialEffect(GM_KILLING_EFFECT, x, y)
                call DestroyEffect(eff)
                set eff = null
                set invisUnit = null
                set killingUnit = null
                return  
            endif

            if (not escaper.isCoopInvul()) then //don't kill if the escaper was just revived by a friend
                call escaper.kill()

                //effet de tuation du héros par le monstre, suivant le type du monstre
                set effectStr = udg_monsterTypes.monsterUnit2KillEffectStr(killingUnit)
                if (effectStr != null) then
                    set x = GetUnitX(invisUnit)
                    set y = GetUnitY(invisUnit)
                    set eff = AddSpecialEffect(effectStr, x, y)
                    call TriggerSleepAction(3)
                    call DestroyEffect(eff)
                    set eff = null
                endif
            endif
        endif
    endif

    set invisUnit = null
    set killingUnit = null
endfunction

//===========================================================================
function InitTrig_InvisUnit_is_getting_damage takes nothing returns nothing
    set gg_trg_InvisUnit_is_getting_damage = CreateTrigger()
    call TriggerAddAction(gg_trg_InvisUnit_is_getting_damage, function Trig_invisUnit_dies_Actions)
endfunction

