//TESH.scrollpos=11
//TESH.alwaysfold=0
globals
    integer udg_nbKilled = 0
endglobals


function Trig_a_hero_dies_Conditions takes nothing returns boolean
    return IsHero(GetTriggerUnit())
endfunction


function Trig_a_hero_dies_Actions takes nothing returns nothing
    local unit hero = GetTriggerUnit()
    local integer n = GetUnitUserData(hero)
    local integer nbAlive = 0
    local boolean last = false
    local integer i
    local real diffX
    local real diffY

    set udg_nbKilled = udg_nbKilled + 1
    if (udg_nbKilled == 3 and udg_tripleKillSoundOn) then
        call StartSound(gg_snd_multisquish)
        set udg_nbKilled = 0
    endif

    set i = 0
    loop
        exitwhen (i >= NB_ESCAPERS)
            if (udg_escapers.get(i).isAlive()) then
                set nbAlive = nbAlive + 1
            endif
        set i = i + 1
    endloop

    if (nbAlive == 0) then
        call TriggerExecute(gg_trg_Lose_a_life_and_res)
        call TriggerSleepAction(2)
        call StartSound(gg_snd_questFailed)
        set last = true
    else
        if (nbAlive == 1) then
            call StartSound( gg_snd_warning )
        endif
    endif
    
    if (isAfk[n]) then
        call DestroyTextTag(afkModeTextTags[n])
    else
        call PauseTimer(afkModeTimers[n])
    endif
    
    if (AreAllAliveHeroesAfk()) then
        call KillAllHeroesAfkInFiveSeconds()
    endif
        
    if (last) then //à cause du sleepAction plus haut
        call TriggerSleepAction( 3 )
    else
        //coop
        if (udg_coopModeActive) then
            call TriggerSleepAction( 1.3 )
            
            //si héros déjà vivant, inutile de le ressuciter
            if (IsUnitAliveBJ(hero)) then
                call TriggerSleepAction(3.7)
                set udg_nbKilled = udg_nbKilled - 1
                return
            endif
            
            //déplacement du héros si mort sur le death path
            if (udg_terrainTypes.getTerrainType(GetUnitX(hero), GetUnitY(hero)).getKind() == "death") then
                call DeplacementHeroHorsDeathPath(hero)
            endif
                
            //revive si autre héros (vivant) au même endroit
            set i = 0
            loop
                exitwhen i >= NB_ESCAPERS
                    if (i != n and udg_escapers.get(i).isAlive()) then
                        set diffX = GetUnitX(udg_escapers.get(i).getHero()) - GetUnitX(hero)
                        set diffY = GetUnitY(udg_escapers.get(i).getHero()) - GetUnitY(hero)
                        if (SquareRoot(diffX * diffX + diffY * diffY) < COOP_REVIVE_DIST) then
                            call udg_escapers.get(n).coopReviveHero()
                            call TriggerSleepAction(3.7)
                            set udg_nbKilled = udg_nbKilled - 1
                            return
                        endif
                    endif
                set i = i + 1
            endloop
                
            call udg_escapers.get(n).enableTrigCoopRevive()
            call TriggerSleepAction(3.7)
        else
            call TriggerSleepAction(5)
        endif
    endif

    call SetUnitAnimation(hero, "stand")
    set udg_nbKilled = udg_nbKilled - 1
endfunction

//===========================================================================
function InitTrig_A_hero_dies_check_if_all_dead_and_sounds takes nothing returns nothing
    set gg_trg_A_hero_dies_check_if_all_dead_and_sounds = CreateTrigger(  )
    call TriggerRegisterAnyUnitEventBJ( gg_trg_A_hero_dies_check_if_all_dead_and_sounds, EVENT_PLAYER_UNIT_DEATH )
    call TriggerAddCondition( gg_trg_A_hero_dies_check_if_all_dead_and_sounds, Condition( function Trig_a_hero_dies_Conditions ) )
    call TriggerAddAction( gg_trg_A_hero_dies_check_if_all_dead_and_sounds, function Trig_a_hero_dies_Actions )
endfunction

