//TESH.scrollpos=52
//TESH.alwaysfold=0
library MonsterOrCaster needs MonsterInterface


struct MonsterOrCaster [100000]
    private Monster monster
    private Caster caster
    
    static method create takes integer mobId returns MonsterOrCaster
        local MonsterOrCaster moc
        local Monster monster = MonsterId2Monster(mobId)
        local Caster caster
        if (monster != 0) then
            set moc = MonsterOrCaster.allocate()
            set moc.monster = monster
            set moc.caster = 0
        else
            set caster = CasterId2Caster(mobId)
            if (caster != 0) then
                set moc = MonsterOrCaster.allocate()
                set moc.monster = 0
                set moc.caster = caster
            else
                set moc = 0
            endif
        endif
        return moc
    endmethod
            
    method getId takes nothing returns integer
        if (.monster != 0) then
            return .monster.getId()
        elseif (.caster != 0) then
            return .caster.getId()
        endif
        return 0
    endmethod
    
    method killUnit takes nothing returns nothing
        if (.monster != 0) then
            call .monster.killUnit()
        elseif (.caster != 0) then
            call .caster.killUnit()
        endif
    endmethod
    
    method temporarilyDisable takes timer disablingTimer returns nothing
        if (.monster != 0) then
            call .monster.temporarilyDisable(disablingTimer)
        elseif (.caster != 0) then
            call .caster.temporarilyDisable(disablingTimer)
        endif
    endmethod
    
    method temporarilyEnable takes timer enablingTimer returns nothing
        if (.monster != 0) then
            call .monster.temporarilyEnable(enablingTimer)
        elseif (.caster != 0) then
            call .caster.temporarilyEnable(enablingTimer)
        endif
    endmethod
    
    method setBaseColor takes string colorString returns nothing
        if (.monster != 0) then
            call .monster.setBaseColor(colorString)
        elseif (.caster != 0) then
            call .caster.setBaseColor(colorString)
        endif
    endmethod
    
    method setVertexColor takes real vcRed, real vcGreen, real vcBlue returns nothing
        if (.monster != 0) then
            call .monster.setVertexColor(vcRed, vcGreen, vcBlue)
        elseif (.caster != 0) then
            call .caster.setVertexColor(vcRed, vcGreen, vcBlue)
        endif
    endmethod
    
    method reinitColor takes nothing returns nothing //on remet la couleur de départ et le vertex de départ à l'unité
        if (.monster != 0) then
            call .monster.reinitColor()
        elseif (.caster != 0) then
            call .caster.reinitColor()
        endif
    endmethod
        
    method getUnit takes nothing returns unit
        if (.monster != 0) then
            return .monster.u
        elseif (.caster != 0) then
            return .caster.casterUnit
        endif
        return null
    endmethod
    
    method copy takes nothing returns MonsterOrCaster
        return MonsterOrCaster.create(.getId())
    endmethod
    
    method getMonsterType takes nothing returns MonsterType
        if (.monster != 0) then
            return .monster.getMonsterType()
        elseif (.caster != 0) then
            return .caster.getCasterType().getCasterMonsterType()
        endif
        return 0
    endmethod
endstruct



endlibrary