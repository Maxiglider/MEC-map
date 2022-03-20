//TESH.scrollpos=124
//TESH.alwaysfold=0
library CommandShortcuts needs BasicFunctions


globals
    string array A_shortcutCommand
    string array Z_shortcutCommand
    string array E_shortcutCommand
    string array R_shortcutCommand
    string array Q_shortcutCommand
    string array S_shortcutCommand
    string array D_shortcutCommand
    string array F_shortcutCommand
endglobals



function InitShortcutSkills takes integer playerId returns nothing
    local unit hero = udg_escapers.get(playerId).getHero()
    
    //! textmacro InitShortcut takes shortcut
    if ($shortcut$_shortcutCommand[playerId] == null) then
        call UnitRemoveAbility(hero, 'SC$shortcut$o')
        call UnitAddAbility(hero, 'SC$shortcut$u')
    else
        call UnitRemoveAbility(hero, 'SC$shortcut$u')
        call UnitAddAbility(hero, 'SC$shortcut$o')
    endif
    //! endtextmacro

    //! runtextmacro InitShortcut("A")
    //! runtextmacro InitShortcut("Z")
    //! runtextmacro InitShortcut("E")
    //! runtextmacro InitShortcut("R")
    //! runtextmacro InitShortcut("Q")
    //! runtextmacro InitShortcut("S")
    //! runtextmacro InitShortcut("D")
    //! runtextmacro InitShortcut("F")
    
    set hero = null
endfunction



function AssignShortcut takes integer playerId, string shortcut, string command returns nothing
    local unit hero = udg_escapers.get(playerId).getHero()
    set shortcut = StringCase(shortcut, true)
    
    //! textmacro AssignShortcut takes shortcut
    if (shortcut == "$shortcut$") then
        if ($shortcut$_shortcutCommand[playerId] == null) then
            call UnitRemoveAbility(hero, 'SC$shortcut$u')
            call UnitAddAbility(hero, 'SC$shortcut$o')
        endif
        set $shortcut$_shortcutCommand[playerId] = "-" + command
        return
    endif
    //! endtextmacro

    //! runtextmacro AssignShortcut("A")
    //! runtextmacro AssignShortcut("Z")
    //! runtextmacro AssignShortcut("E")
    //! runtextmacro AssignShortcut("R")
    //! runtextmacro AssignShortcut("Q")
    //! runtextmacro AssignShortcut("S")
    //! runtextmacro AssignShortcut("D")
    //! runtextmacro AssignShortcut("F")
    
    set hero = null
endfunction


function UnassignShortcut takes integer playerId, string shortcut returns nothing
    local unit hero = udg_escapers.get(playerId).getHero()
    set shortcut = StringCase(shortcut, true)
    
    //! textmacro UnassignShortcut takes shortcut
    if (shortcut == "$shortcut$") then
        if ($shortcut$_shortcutCommand[playerId] != null) then
            call UnitRemoveAbility(hero, 'SC$shortcut$o')
            call UnitAddAbility(hero, 'SC$shortcut$u')
            set $shortcut$_shortcutCommand[playerId] = null
        endif
        return
    endif
    //! endtextmacro

    //! runtextmacro UnassignShortcut("A")
    //! runtextmacro UnassignShortcut("Z")
    //! runtextmacro UnassignShortcut("E")
    //! runtextmacro UnassignShortcut("R")
    //! runtextmacro UnassignShortcut("Q")
    //! runtextmacro UnassignShortcut("S")
    //! runtextmacro UnassignShortcut("D")
    //! runtextmacro UnassignShortcut("F")
    
    set hero = null
endfunction


function IsShortcut takes string S returns boolean
    set S = StringCase(S, true)
    //! textmacro IsShortcut takes shortcut
    if (S == "$shortcut$") then
        return true
    endif
    //! endtextmacro

    //! runtextmacro IsShortcut("A")
    //! runtextmacro IsShortcut("Z")
    //! runtextmacro IsShortcut("E")
    //! runtextmacro IsShortcut("R")
    //! runtextmacro IsShortcut("Q")
    //! runtextmacro IsShortcut("S")
    //! runtextmacro IsShortcut("D")
    //! runtextmacro IsShortcut("F")

    return false
endfunction



function GetStringAssignedFromCommand takes string command returns string
    local string outputStr
    local boolean spaceFound = false
    local integer cmdLength = StringLength(command)
    local integer charId = 3
    loop
        exitwhen (charId >= cmdLength)
            if (SubStringBJ(command, charId, charId) == " ") then
                if (not spaceFound) then
                    set spaceFound = true
                else
                    set outputStr = SubStringBJ(command, charId + 1, cmdLength)
                    if (SubStringBJ(outputStr, 1, 1) == "(" and SubStringBJ(outputStr, StringLength(outputStr), StringLength(outputStr)) == ")") then
                        set outputStr = SubStringBJ(outputStr, 2, StringLength(outputStr) - 1)
                    endif
                    return outputStr
                endif
            endif
        set charId = charId + 1
    endloop
    return null
endfunction



function DisplayShortcuts takes integer playerId returns nothing
    call Text_P(Player(playerId), " ")
    call Text_P(Player(playerId), udg_colorCode[playerId] + "Your shortcuts:")
    //! textmacro ShowShortcut takes shortcut
    if ($shortcut$_shortcutCommand[playerId] == null) then
        call Text_P(Player(playerId), udg_colorCode[playerId] + "$shortcut$: |r" + udg_colorCode[GREY] + "none")
    else
        call Text_P(Player(playerId), udg_colorCode[playerId] + "$shortcut$: |r" + $shortcut$_shortcutCommand[playerId])
    endif
    //! endtextmacro

    //! runtextmacro ShowShortcut("A")
    //! runtextmacro ShowShortcut("Z")
    //! runtextmacro ShowShortcut("E")
    //! runtextmacro ShowShortcut("R")
    //! runtextmacro ShowShortcut("Q")
    //! runtextmacro ShowShortcut("S")
    //! runtextmacro ShowShortcut("D")
    //! runtextmacro ShowShortcut("F")
endfunction



endlibrary
