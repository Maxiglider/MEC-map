//TESH.scrollpos=0
//TESH.alwaysfold=0
library MonsterType initializer Init_MonsterType needs ImmolationSkills


struct MonsterType
    string label
    string theAlias
    private integer unitTypeId
    private real scale //influe sur la taille de l'unité ; 1.0 donne une taille normale
    private integer immolationSkill
    private real speed
    private boolean isClickableB
    private string killingEffectStr
    private integer maxLife
    private real height
    
    
	method setLabel takes string label returns nothing
		set .label = label
	endmethod
	
	method setAlias takes string theAlias returns MonsterType
		set .theAlias = theAlias
        return this
	endmethod

    static method create takes string label, integer unitTypeId, real scale, real immolationRadius, real speed, boolean isClickable returns MonsterType
        local MonsterType mt
        local unit testMonster
        if (speed <= 0 or speed > MAX_MOVE_SPEED or (scale <= 0 and scale != -1) or not((immolationRadius/5) == I2R(R2I(immolationRadius/5))) or immolationRadius < 0 or immolationRadius > 400) then
            return 0
        endif
        set testMonster = CreateUnit(NEUTRAL_PLAYER, unitTypeId, 0,0,0)
        if (testMonster == null) then
            return 0
        else
            call RemoveUnit(testMonster)
            set testMonster = null
        endif
        set mt = MonsterType.allocate()
        set mt.label = label
        set mt.theAlias = null
        set mt.unitTypeId = unitTypeId
        set mt.scale = scale
        set mt.immolationSkill = IMMOLATION_SKILLS[R2I(immolationRadius/5)]
        set mt.speed = speed
        set mt.isClickableB = isClickable
        set mt.killingEffectStr = null
        set mt.maxLife = 10000
        set mt.height = -1
        return mt
    endmethod
    
    method refresh takes nothing returns nothing //recrée les monstres correspondant au niveau actuel
        local Level array levelsMaking
        local Escaper escaper
        local integer i
        local integer j
        local boolean levelAlreadyChecked
        local integer nbLevelsMaking = 0
        local Level currentLevel = udg_levels.getCurrentLevel()
        call currentLevel.recreateMonstersOfType(this) 
        set i = 0
        loop
            exitwhen (i > 11)
                set escaper = udg_escapers.get(i)
                if (escaper != 0) then
                    if (escaper.getMakingLevel() != currentLevel) then
                        set levelAlreadyChecked = false
                        set j = 0
                        loop
                            exitwhen (j >= nbLevelsMaking)
                                if (escaper.getMakingLevel() == levelsMaking[j]) then
                                    set levelAlreadyChecked = true
                                endif
                            set j = j + 1
                        endloop
                        if (not levelAlreadyChecked) then
                            set levelsMaking[nbLevelsMaking] = escaper.getMakingLevel()
                            set nbLevelsMaking = nbLevelsMaking + 1
                        endif
                    endif
                endif
            set i = i + 1
        endloop
        set i = 0
        loop
            exitwhen (i >= nbLevelsMaking)
                call levelsMaking[i].recreateMonstersOfType(this)
            set i = i + 1
        endloop
    endmethod
    
    method onDestroy takes nothing returns nothing
        call udg_levels.removeMonstersOfType(this)
    endmethod
    
    method getUnitTypeId takes nothing returns integer
        return .unitTypeId
    endmethod
    
    method setUnitTypeId takes integer unitTypeId returns boolean
        local unit testMonster = CreateUnit(NEUTRAL_PLAYER, unitTypeId, 0,0,0)
        if (testMonster == null) then
            return false
        endif
        call RemoveUnit(testMonster)
        set testMonster = null
        set .unitTypeId = unitTypeId
        call .refresh()
        return true
    endmethod
    
    method getScale takes nothing returns real
        return .scale
    endmethod
    
    method setScale takes real scale returns boolean
        if ((scale <= 0 and scale != -1) or scale == .scale) then
            return false
        endif
        set .scale = scale
        call .refresh()
        return true
    endmethod
    
    method getImmolationSkill takes nothing returns integer
        return .immolationSkill
    endmethod
    
    method setImmolation takes real immolationRadius returns boolean
        if (not((immolationRadius/5) == I2R(R2I(immolationRadius/5))) or immolationRadius < 0 or immolationRadius > 400) then
            return false
        endif
        set .immolationSkill = IMMOLATION_SKILLS[R2I(immolationRadius/5)]
        call .refresh()
        return true
    endmethod
    
    method getUnitMoveSpeed takes nothing returns real
        return .speed
    endmethod
    
    method setUnitMoveSpeed takes real speed returns boolean
        if (speed <= 0 or speed > MAX_MOVE_SPEED) then
            return false
        endif
        set .speed = speed
        call .refresh()
        return true
    endmethod
    
    method isClickable takes nothing returns boolean
        return .isClickableB
    endmethod
    
    method setIsClickable takes boolean isClickable returns boolean
        if (.isClickableB == isClickable) then
            return false
        endif
        set .isClickableB = isClickable
        call .refresh()
        return true
    endmethod
    
    method getKillingEffectStr takes nothing returns string
        return .killingEffectStr
    endmethod
    
    method setKillingEffectStr takes string effectStr returns MonsterType
        set .killingEffectStr = effectStr
        return this
    endmethod
    
    method setNbMeteorsToKill takes integer nbMeteorsToKill returns MonsterType
        //nombre de météores qu'il faut pour tuer le monstre, sachant qu'une météore fait 10k de dégât
        if (nbMeteorsToKill < 1 or nbMeteorsToKill > 9) then
            return this
        endif
        set .maxLife = nbMeteorsToKill * 10000
        if (.isClickableB) then
            call .refresh()
        endif
        return this
    endmethod
    
    method getMaxLife takes nothing returns integer
        return .maxLife
    endmethod
    
    method getHeight takes nothing returns real
        return .height
    endmethod
    
    method setHeight takes real height returns boolean
        if (height != -1 and height < 0 and height != .height) then
            return false
        endif
        set .height = height
        call .refresh()
        return true
    endmethod
    
    method getImmolationRadiusStr takes nothing returns string
        local string immoStr = Ascii2String(.immolationSkill)
        set immoStr = SubStringBJ(immoStr, 2, 4)
        return I2S(S2I(immoStr))
    endmethod
    
    method displayForPlayer takes player p returns nothing
        local string space = "   "
        local string display = udg_colorCode[RED] + .label + " " + .theAlias + " : '"
        local string scaleDisplay
        local string heightDisplay
        if (.scale == -1) then
            set scaleDisplay = "default"
        else
            set scaleDisplay = R2S(.scale)
        endif
        if (.height == -1) then
            set heightDisplay = "default"
        else
            set heightDisplay = I2S(R2I(.height))
        endif
        set display = display + Ascii2String(.unitTypeId) + "'" + space + "'" + Ascii2String(.immolationSkill) + "'"
        set display = display + space + "speed_" + I2S(R2I(.speed)) + space + "scale_" + scaleDisplay + space + "height_" + heightDisplay
        if (.isClickableB) then
            set display = display + space + "clickable" + space + I2S(.maxLife / 10000)
        endif
        call Text_P_timed(p, TERRAIN_DATA_DISPLAY_TIME, display)
    endmethod
    
    method displayTotalForPlayer takes player p returns nothing
        local string space = "   "
        local string display = udg_colorCode[RED] + .label + " " + .theAlias + " : '"
        local string scaleDisplay
        local string heightDisplay
        if (.scale == -1) then
            set scaleDisplay = "default"
        else
            set scaleDisplay = R2S(.scale)
        endif
        if (.height == -1) then
            set heightDisplay = "default"
        else
            set heightDisplay = I2S(R2I(.height))
        endif
        set display = display + Ascii2String(.unitTypeId) + "'" + space + "'" + Ascii2String(.immolationSkill) + "'"
        set display = display + space + "speed_" + I2S(R2I(.speed)) + space + "scale_" + scaleDisplay + space + "height_" + heightDisplay + space + .killingEffectStr
        if (.isClickableB) then
            set display = display + space + "clickable" + space + I2S(.maxLife / 10000)
        endif
        call Text_P_timed(p, TERRAIN_DATA_DISPLAY_TIME, display)
    endmethod
    
    method toString takes nothing returns string
        local string str = .label + CACHE_SEPARATEUR_PARAM + .theAlias + CACHE_SEPARATEUR_PARAM
        set str = str + Ascii2String(.unitTypeId) + CACHE_SEPARATEUR_PARAM + R2S(.scale) + CACHE_SEPARATEUR_PARAM
        set str = str + .getImmolationRadiusStr() + CACHE_SEPARATEUR_PARAM + R2S(.speed) + CACHE_SEPARATEUR_PARAM
        set str = str + B2S(.isClickableB) + CACHE_SEPARATEUR_PARAM + .killingEffectStr + CACHE_SEPARATEUR_PARAM
        set str = str + I2S(.maxLife / 10000) + CACHE_SEPARATEUR_PARAM + R2S(.height)
        return str
    endmethod
endstruct



//===========================================================================
function Init_MonsterType takes nothing returns nothing
endfunction



endlibrary