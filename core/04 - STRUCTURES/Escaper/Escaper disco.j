//TESH.scrollpos=0
//TESH.alwaysfold=0
library Disco


function ApplyRandomColor takes integer n returns nothing   
    local Escaper esc = udg_escapers.get(n)
    call esc.setBaseColorDisco(GetRandomInt(0, 12))
    call esc.setVcRed(GetRandomPercentageBJ())
    call esc.setVcGreen(GetRandomPercentageBJ())
    call esc.setVcBlue(GetRandomPercentageBJ())
    call esc.setVcTransparency(GetRandomReal(0, 25))
    call SetUnitVertexColorBJ(esc.getHero(), esc.getVcRed(), esc.getVcGreen(), esc.getVcBlue(), esc.getVcTransparency())
endfunction


function Disco_Actions takes nothing returns nothing
    local integer n = 0
    loop
        exitwhen (udg_escapers.get(n).discoTrigger == GetTriggeringTrigger())
            if (n > 11) then
                return
            endif
        set n = n + 1
    endloop
    call ApplyRandomColor(n)
endfunction



endlibrary