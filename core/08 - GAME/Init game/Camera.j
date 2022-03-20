function Trig_Camera_Actions takes nothing returns nothing
    call SetCameraField( CAMERA_FIELD_TARGET_DISTANCE, DEFAULT_CAMERA_FIELD, 0 )
endfunction

//===========================================================================
function InitTrig_Camera takes nothing returns nothing
    set gg_trg_Camera = CreateTrigger(  )
    call TriggerAddAction( gg_trg_Camera, function Trig_Camera_Actions )
endfunction

