//TESH.scrollpos=0
//TESH.alwaysfold=0
globals
    integer udg_coop_index_son
    constant integer COOP_DUREE_SON = 280 //milisecondes
endglobals


function Trig_coop_init_sounds_Actions takes nothing returns nothing
    set udg_coop_index_son = DefineSound("war3mapImported\\goutte.wav", COOP_DUREE_SON, false, true)
endfunction

//===========================================================================
function InitTrig_coop_init_sounds takes nothing returns nothing
    set gg_trg_coop_init_sounds = CreateTrigger(  )
    call TriggerAddAction( gg_trg_coop_init_sounds, function Trig_coop_init_sounds_Actions )
endfunction

