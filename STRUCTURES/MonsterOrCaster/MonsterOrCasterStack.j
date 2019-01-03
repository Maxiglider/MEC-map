//TESH.scrollpos=35
//TESH.alwaysfold=0
library MonsterOrCasterStack

globals
    private MonsterOrCaster udg_enumMoc
endglobals

function GetEnumMoc takes nothing returns MonsterOrCaster
    return udg_enumMoc
endfunction


struct MonsterOrCasterStack [100000]
    private MonsterOrCaster monsterOrCaster
    private MonsterOrCasterStack nextElement

    static method create takes MonsterOrCaster monsterOrCaster returns MonsterOrCasterStack
        local MonsterOrCasterStack mocs
        if (monsterOrCaster == 0) then
            return 0
        endif
        set mocs = MonsterOrCasterStack.allocate()
        set mocs.monsterOrCaster = monsterOrCaster
        set mocs.nextElement = 0
        return mocs
    endmethod
    
    method addMonsterOrCaster takes MonsterOrCaster monsterOrCaster returns boolean
        local MonsterOrCasterStack newElement
        if (monsterOrCaster == 0) then
            return false
        endif
        set newElement = .create(.monsterOrCaster)
        set newElement.nextElement = .nextElement
        set .monsterOrCaster = monsterOrCaster
        set .nextElement = newElement
        return true
    endmethod
    
    method onDestroy takes nothing returns nothing
        call .monsterOrCaster.destroy()
        if (.nextElement != 0) then
            call .nextElement.destroy()
        endif
    endmethod
    
    method executeForAll takes string functionName returns nothing
        set udg_enumMoc = .monsterOrCaster
        call ExecuteFunc(functionName)
        if (.nextElement != 0) then
            call .nextElement.executeForAll(functionName)
        endif
    endmethod
    
    method containsMob takes integer mobId returns boolean
        if (.monsterOrCaster.getId() == mobId) then
            return true
        elseif (.nextElement != 0) then
            return .nextElement.containsMob(mobId)
        else
            return false
        endif
    endmethod
    
    method getLast takes nothing returns MonsterOrCaster
        return .monsterOrCaster
    endmethod
    
    method removeLast takes nothing returns boolean
        local MonsterOrCasterStack oldNextElement = .nextElement
        if (.monsterOrCaster == 0) then
            return false
        endif
        call .monsterOrCaster.destroy()
        if (.nextElement != 0) then
            set .monsterOrCaster = .nextElement.getLast().copy()
            set .nextElement = .nextElement.nextElement
            set .nextElement.nextElement = 0
            call .nextElement.destroy()
        else
            set .monsterOrCaster = 0
        endif
        return true
    endmethod            
endstruct


endlibrary