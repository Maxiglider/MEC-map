library MakeDoNothingActions needs BasicFunctions


function StopTriggerUnit takes nothing returns nothing
    if (not IsLastOrderPause()) then
        call StopUnit(GetTriggerUnit())
    endif
endfunction

endlibrary