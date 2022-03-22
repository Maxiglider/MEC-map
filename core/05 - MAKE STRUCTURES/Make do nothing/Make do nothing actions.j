library MakeDoNothingActions needs BasicFunctions


function StopTriggerUnit takes nothing returns nothing
    call BJDebugMsg("stop unit")

    if (not IsLastOrderPause()) then
        call StopUnit(GetTriggerUnit())
    endif
endfunction

endlibrary