//TESH.scrollpos=967
//TESH.alwaysfold=0
library CommandMake needs CommandsFunctions, ChangeOneTerrain, ChangeAllTerrains, ExchangeTerrains, RandomizeTerrains, Ascii





function ExecuteCommandMake takes Escaper escaper, string cmd returns boolean
	local string name = CmdName(cmd)
	local boolean noParam = NoParam(cmd) 
	local integer nbParam = NbParam(cmd)
	
	local integer n
	local integer i
	local integer j
	local integer k

	local boolean b

	local string str = ""
	local string str2 = ""

	local real x
	local real y
	local location point
 
	local string param

	local string param1 = CmdParam(cmd, 1)
	local string param2 = CmdParam(cmd, 2)
	local string param3 = CmdParam(cmd, 3)
	local string param4 = CmdParam(cmd, 4)
	
	local real speed
    local TerrainType terrainType
    local Level level


    


//-newWalk(neww) <label> <terrainType> [<walkSpeed>]   --> add a new kind of walk terrain
    if (name == "newWalk" or name == "neww") then
        if (nbParam < 2 or nbParam > 3) then
            return true
        endif
        if (nbParam == 3) then
            if (not IsPositiveInteger(param3) or S2R(param3) > 522) then
                call Text_erP(escaper.getPlayer(), "wrong speed value, should be a real between 0 and 522")
                return true
            endif
            set speed = S2R(param3)
        else
            set speed = HERO_WALK_SPEED
        endif
        if (StringContainsChar(param1, CACHE_SEPARATEUR_ITEM) or StringContainsChar(param1, CACHE_SEPARATEUR_PARAM) or StringContainsChar(param1, "\"")) then
            call Text_erP(escaper.getPlayer(), "characters \", " + CACHE_SEPARATEUR_ITEM + " and " + CACHE_SEPARATEUR_PARAM + " not allowed")
            return true
        endif
        if (udg_terrainTypes.newWalk(param1, TerrainTypeString2TerrainTypeId(param2), speed) == 0) then
            call Text_erP(escaper.getPlayer(), "impossible to add this new terrain type")
        else
            call Text_mkP(escaper.getPlayer(), "new terrain type \"" + param1 + "\" added")
        endif
        return true
    endif
    
    
//-newDeath(newd) <label> <terrainType> [<killingEffect> [<terrainTimeToKill>]]   --> add a new kind of death terrain
    if (name == "newDeath" or name == "newd") then
        if (nbParam < 2 or nbParam > 4) then
            return true
        endif
        if (nbParam >= 3) then
            set str = param3
            if (StringContainsChar(param3, CACHE_SEPARATEUR_ITEM) or StringContainsChar(param3, CACHE_SEPARATEUR_PARAM) or StringContainsChar(param3, "\"")) then
                call Text_erP(escaper.getPlayer(), "characters \", " + CACHE_SEPARATEUR_ITEM + " and " + CACHE_SEPARATEUR_PARAM + " not allowed")
                return true
            endif
        else
            set str = ""
        endif
        if (nbParam == 4) then
            if (param4 != "0" and S2R(param4) == 0) then
                return true
            endif
            set x = S2R(param4)
        else
            set x = TERRAIN_DEATH_TIME_TO_KILL
        endif
        if (StringContainsChar(param1, CACHE_SEPARATEUR_ITEM) or StringContainsChar(param1, CACHE_SEPARATEUR_PARAM) or StringContainsChar(param1, "\"")) then
            call Text_erP(escaper.getPlayer(), "characters \", " + CACHE_SEPARATEUR_ITEM + " and " + CACHE_SEPARATEUR_PARAM + " not allowed")
            return true
        endif
        if (udg_terrainTypes.newDeath(param1, TerrainTypeString2TerrainTypeId(param2), str, x, 0) == 0) then
            call Text_erP(escaper.getPlayer(), "impossible to add this new terrain type")
        else
            call Text_mkP(escaper.getPlayer(), "new terrain type \"" + param1 + "\" added")
        endif    
        return true
    endif
    

//-newSlide(news) <label> <terrainType> [<slideSpeed> [<canTurn>]]   --> add a new kind of slide terrain
    if (name == "newSlide" or name == "news") then
        if (nbParam < 2 or nbParam > 4) then
            return true
        endif
        if (nbParam >= 3) then
            if (not IsInteger(param3)) then
                call Text_erP(escaper.getPlayer(), "the slide speed must be an integer")
                return true
            endif
            set speed = S2R(param3)
        else
            set speed = HERO_SLIDE_SPEED
        endif
        if (nbParam == 4) then
            if (not IsBoolString(param4)) then
                call Text_erP(escaper.getPlayer(), "the property \"canTurn\" must be a boolean (true or false)")
                return true
            endif
            set b = S2B(param4)
        else
            set b = true //can turn
        endif
        if (StringContainsChar(param1, CACHE_SEPARATEUR_ITEM) or StringContainsChar(param1, CACHE_SEPARATEUR_PARAM) or StringContainsChar(param1, "\"")) then
            call Text_erP(escaper.getPlayer(), "characters \", " + CACHE_SEPARATEUR_ITEM + " and " + CACHE_SEPARATEUR_PARAM + " not allowed")
            return true
        endif
        if (udg_terrainTypes.newSlide(param1, TerrainTypeString2TerrainTypeId(param2), speed, b) == 0) then
            call Text_erP(escaper.getPlayer(), "impossible to add this new terrain type")
        else
            call Text_mkP(escaper.getPlayer(), "new terrain type \"" + param1 + "\" added")
        endif    
        return true
    endif
    
    
//-setTerrainLabel(settl) <oldTerrainLabel> <newTerrainLabel>
    if (name == "setTerrainLabel" or name == "settl") then
        if (not(nbParam == 2)) then
            return true
        endif
        set b = (udg_terrainTypes.get(param1) != 0)
        if (b) then
            set b = (not udg_terrainTypes.isLabelAlreadyUsed(param2))
        endif
        if (b) then
            if (StringContainsChar(param2, CACHE_SEPARATEUR_ITEM) or StringContainsChar(param2, CACHE_SEPARATEUR_PARAM) or StringContainsChar(param2, "\"")) then
                call Text_erP(escaper.getPlayer(), "characters \", " + CACHE_SEPARATEUR_ITEM + " and " + CACHE_SEPARATEUR_PARAM + " not allowed")
                return true
            endif
            call udg_terrainTypes.get(param1).setLabel(param2)
            call Text_mkP(escaper.getPlayer(), "label changed to \"" + param2 + "\"")
        else
            call Text_erP(escaper.getPlayer(), "impossible to change label")
        endif
        return true
    endif
    
    
//-setTerrainAlias(setta) <terrainLabel> <alias>   --> an alias is a shortcut which can be used like a label
    if (name == "setTerrainAlias" or name == "setta") then
        if (not(nbParam == 2)) then
            return true
        endif
        set b = (udg_terrainTypes.get(param1) != 0)
        if (b) then
            set b = (not udg_terrainTypes.isLabelAlreadyUsed(param2))
        endif
        if (b) then
            if (StringContainsChar(param2, CACHE_SEPARATEUR_ITEM) or StringContainsChar(param2, CACHE_SEPARATEUR_PARAM) or StringContainsChar(param2, "\"")) then
                call Text_erP(escaper.getPlayer(), "characters \", " + CACHE_SEPARATEUR_ITEM + " and " + CACHE_SEPARATEUR_PARAM + " not allowed")
                return true
            endif
            call udg_terrainTypes.get(param1).setAlias(param2)
            call Text_mkP(escaper.getPlayer(), "alias changed to \"" + param2 + "\"")
        else
            call Text_erP(escaper.getPlayer(), "impossible to change alias")
        endif
        return true
    endif
    
    
//-setTerrainWalkSpeed(settws) <walkTerrainLabel> <walkSpeed>   --> max walk speed : 522
    if (name == "setTerrainWalkSpeed" or name == "settws") then
        if (not(nbParam == 2)) then
            return true
        endif
        set terrainType = udg_terrainTypes.get(param1)
        if (terrainType == 0) then
            call Text_erP(escaper.getPlayer(), "unknown terrain")
            return true
        endif
        if (terrainType.getKind() != "walk") then
            call Text_erP(escaper.getPlayer(), "the terrain must be of walk type")
            return true
        endif
        if (not IsPositiveInteger(param2) or S2R(param2) > 522) then
            call Text_erP(escaper.getPlayer(), "wrong speed value, should be a real between 0 and 522")
            return true
        endif
        call TerrainTypeWalk(integer(terrainType)).setWalkSpeed(S2R(param2))
        call Text_mkP(escaper.getPlayer(), "terrain walk speed changed")
        return true
    endif
    
    
//-setTerrainKillEffect(settke) <deathTerrainLabel> <killingEffect>   --> special effect appearing when a hero touch the death terrain
    if (name == "setTerrainKillEffect" or name == "settke") then
        if (not(nbParam == 2)) then
            return true
        endif
        set terrainType = udg_terrainTypes.get(param1)
        if (terrainType == 0) then
            call Text_erP(escaper.getPlayer(), "unknown terrain")
            return true
        endif
        if (terrainType.getKind() != "death") then
            call Text_erP(escaper.getPlayer(), "the terrain must be of death type")
            return true
        endif
        if (StringContainsChar(param2, CACHE_SEPARATEUR_ITEM) or StringContainsChar(param2, CACHE_SEPARATEUR_PARAM) or StringContainsChar(param2, "\"")) then
            call Text_erP(escaper.getPlayer(), "characters \", " + CACHE_SEPARATEUR_ITEM + " and " + CACHE_SEPARATEUR_PARAM + " not allowed")
            return true
        endif
        call TerrainTypeDeath(integer(terrainType)).setKillingEffectStr(param2)
        call Text_mkP(escaper.getPlayer(), "terrain kill effect changed")
        return true
    endif
        
        
//-setTerrainKillDelay(settkd) <deathTerrainLabel> <killingDelay>   --> time before which the hero dies when he touch the death terrain
    if (name == "setTerrainKillDelay" or name == "settkd") then
        if (not(nbParam == 2)) then
            return true
        endif
        set terrainType = udg_terrainTypes.get(param1)
        if (terrainType == 0) then
            call Text_erP(escaper.getPlayer(), "unknown terrain")
            return true
        endif
        if (terrainType.getKind() != "death") then
            call Text_erP(escaper.getPlayer(), "the terrain must be of death type")
            return true
        endif
        if (param2 != "0" and S2R(param2) == 0) then
            call Text_erP(escaper.getPlayer(), "wrong delay value")
            return true
        endif
        call TerrainTypeDeath(integer(terrainType)).setTimeToKill(S2R(param2))
        call Text_mkP(escaper.getPlayer(), "terrain kill delay changed")
        return true
    endif
        
        
//-setTerrainKillTolerance(settkt) <deathTerrainLabel> <tolerance dist>   --> max distance to the closest non death terrain, where heroes won't die
    if (name == "setTerrainKillTolerance" or name == "settkt") then
        if (not(nbParam == 2)) then
            return true
        endif
        set terrainType = udg_terrainTypes.get(param1)
        if (terrainType == 0) then
            call Text_erP(escaper.getPlayer(), "unknown terrain")
            return true
        endif
        if (terrainType.getKind() != "death") then
            call Text_erP(escaper.getPlayer(), "the terrain must be of death type")
            return true
        endif
        if (param2 != "0" and S2R(param2) == 0) then
            call Text_erP(escaper.getPlayer(), "wrong tolerance value")
            return true
        endif
        if (TerrainTypeDeath(integer(terrainType)).setToleranceDist(S2R(param2))) then
            call Text_mkP(escaper.getPlayer(), "tolerance distance changed")
        else
            call Text_erP(escaper.getPlayer(), "tolerance must be between 0 and " + R2S(DEATH_TERRAIN_MAX_TOLERANCE))
        endif
        return true
    endif
    
    
//-setTerrainSlideSpeed(settss) <slideTerrainLabel> <slideSpeed>
    if (name == "setTerrainSlideSpeed" or name == "settss") then
        if (not(nbParam == 2)) then
            return true
        endif
        set terrainType = udg_terrainTypes.get(param1)
        if (terrainType == 0) then
            call Text_erP(escaper.getPlayer(), "unknown terrain")
            return true
        endif
        if (terrainType.getKind() != "slide") then
            call Text_erP(escaper.getPlayer(), "the terrain must be of slide type")
            return true
        endif
        if (not IsInteger(param2)) then
            call Text_erP(escaper.getPlayer(), "wrong speed value")
            return true
        endif
        call TerrainTypeSlide(integer(terrainType)).setSlideSpeed(S2R(param2))
        call Text_mkP(escaper.getPlayer(), "terrain slide speed changed")
        return true
    endif
    
    
//-setTerrainCanTurn(settct) <slideTerrainLabel> <canTurn>
    if (name == "setTerrainCanTurn" or name == "settct") then
        if (not(nbParam == 2)) then
            return true
        endif
        set terrainType = udg_terrainTypes.get(param1)
        if (terrainType == 0) then
            call Text_erP(escaper.getPlayer(), "unknown terrain")
            return true
        endif
        if (terrainType.getKind() != "slide") then
            call Text_erP(escaper.getPlayer(), "the terrain must be of slide type")
            return true
        endif
        if (not IsBoolString(param2)) then
            call Text_erP(escaper.getPlayer(), "the property \"canTurn\" must be a boolean (true or false)")
            return true
        endif
        if (TerrainTypeSlide(integer(terrainType)).setCanTurn(S2B(param2))) then
            if (S2B(param2)) then
                call Text_mkP(escaper.getPlayer(), "the heroes can now turn on this slide terrain")
            else
                call Text_mkP(escaper.getPlayer(), "the heroes can't turn on this slide terrain anymore")
            endif
        else
            if (S2B(param2)) then
                call Text_erP(escaper.getPlayer(), "the heroes can already turn on this slide terrain")
            else
                call Text_erP(escaper.getPlayer(), "the heroes already can't turn on this slide terrain")
            endif
        endif
        return true
    endif
    
    
//-changeTerrain(cht) <terrainLabel> <newTerrainType>   --> examples of terrain types : 'Nice', 46
    if (name == "changeTerrain" or name == "cht") then
        if (not(nbParam == 2)) then
            return true
        endif
        call DisplayLineToPlayer(escaper.getPlayer())
        set str = ChangeOneTerrain(param1, param2)
        if (str != null) then
            call Text_mkP(escaper.getPlayer(), "changed to " + udg_colorCode[RED] + str)
        else
            call Text_erP(escaper.getPlayer(), "couldn't change terrain")
        endif
        return true
    endif
    
    
//-changeAllTerrains(chat) [known(k)|notKnown(nk)]
    if (name == "changeAllTerrains" or name == "chat") then        
        if (noParam) then
            set str = "normal"
        else        
            if (nbParam == 1) then
                if (param1 == "known" or param1 == "k") then
                    set str = "known"
                else
                    if (param1 == "notKnown" or param1 == "nk") then
                        set str = "notKnown"
                    else
                        return true
                    endif
                endif            
            endif    
        endif
        if (not ChangeAllTerrains(str)) then
            call Text_erP(escaper.getPlayer(), "couldn't change terrains")
        endif
        return true
    endif    
    
    
//-changeAllTerrainsAtRevive(chatar) <boolean change>
    if (name == "changeAllTerrainsAtRevive" or name == "chatar") then
        if (nbParam == 1 and IsBoolString(param1) and S2B(param1) != udg_changeAllTerrainsAtRevive) then
            set udg_changeAllTerrainsAtRevive = S2B(param1)
            call Text_mkP(escaper.getPlayer(), "change all terrains at revive " + StringCase(param1, true))
        endif
        return true
    endif
        
    
//-exchangeTerrains(excht) [<terrainLabelA> <terrainLabelB>]   --> without parameter, click on the terrains to exchange them
    if (name == "exchangeTerrains" or name == "excht") then
        if (noParam) then
                call escaper.makeExchangeTerrains()
                call Text_mkP(escaper.getPlayer(), "exchange terrains on")
            return true
        endif
        if (not(nbParam == 2)) then
            return true
        endif
        if (ExchangeTerrains(param1, param2)) then
            call Text_mkP(escaper.getPlayer(), "terrains exchanged")
        else
            call Text_erP(escaper.getPlayer(), "couldn't exchange terrains")
        endif
        return true
    endif
    
    
//-randomizeTerrains(rdmt)
    if (name == "randomizeTerrains" or name == "rdmt") then        
        if (noParam) then
            call RandomizeTerrains()
        endif
        return true
    endif


//-createTerrain(crt) <terrainLabel>   --> create the terrain on the map, by clicking
    if (name == "createTerrain" or name == "crt") then
        if (not(nbParam == 1)) then
            return true
        endif
        if (udg_terrainTypes.get(param1) == 0) then
            call Text_erP(escaper.getPlayer(), "terrain \"" + param1 + "\" doesn't exist")
        else
            call escaper.makeCreateTerrain(udg_terrainTypes.get(param1))
            call Text_mkP(escaper.getPlayer(), "creating terrain on")
        endif
        return true
    endif
    
    
//-copyPasteTerrain(cpt)   --> copy paste a rectangle of terrain on the map
    if (name == "copyPasteTerrain" or name == "cpt") then
        if (noParam) then
            call escaper.makeTerrainCopyPaste()
            call Text_mkP(escaper.getPlayer(), "copy/paste terrain on")
        endif
        return true
    endif
    
    
//-verticalSymmetryTerrain(vst)   --> transform a rectangle of terrain by a vertical symmetry
    if (name == "verticalSymmetryTerrain" or name == "vst") then
        if (noParam) then
            call escaper.makeTerrainVerticalSymmetry()
            call Text_mkP(escaper.getPlayer(), "vertical symmetry terrain on")
        endif
        return true
    endif
    
    
//-horizontalSymmetryTerrain(hst)   --> transform a rectangle of terrain by an horizontal symmetry
    if (name == "horizontalSymmetryTerrain" or name == "hst") then
        if (noParam) then
            call escaper.makeTerrainHorizontalSymmetry()
            call Text_mkP(escaper.getPlayer(), "horizontal symmetry terrain on")
        endif
        return true
    endif
    
    
//-terrainHeight(th) [<terrainRadius> [<height>]]   --> apply a terrain height at chosen places ; default radius 100, default height 100
    if (name == "terrainHeight" or name == "th") then
        if (not(nbParam <= 2)) then
            return true
        endif
        if (nbParam == 2) then
            set y = S2R(param2)
            if (y == 0 and param2 != "0") then
                call Text_erP(escaper.getPlayer(), "param2 (height) must be a real")
                return true
            endif
            if (y == 0) then
                call Text_erP(escaper.getPlayer(), "param2 (height) can't be 0")
                return true
            endif
        else
            set y = 100
        endif
        if (nbParam >= 1) then
            set x = S2R(param1)
            if (x == 0 and param1 != "0") then
                call Text_erP(escaper.getPlayer(), "param1 (radius) must be a real")
                return true
            endif
            if (x <= 0) then
                call Text_erP(escaper.getPlayer(), "param1 (radius) must be higher than 0")
                return true
            endif
        else
            set x = 100
        endif
        call escaper.makeTerrainHeight(x, y)
        call Text_mkP(escaper.getPlayer(), "terrain height making")
        return true
    endif
    
    
//-displayTerrains(dt) [<terrainLabel>]   --> displays the characteristics of the terrains added by the maker(s)
    if (name == "displayTerrains" or name == "dt") then
        if (not(nbParam <= 1)) then
            return true
        endif
        if (nbParam == 1) then
            if (udg_terrainTypes.isLabelAlreadyUsed(param1)) then
                call udg_terrainTypes.get(param1).displayForPlayer(escaper.getPlayer())
            else
                call Text_erP(escaper.getPlayer(), "unknown terrain")
            endif
        else
            call udg_terrainTypes.displayForPlayer(escaper.getPlayer())
        endif
        return true
    endif
    
    
//-newMonster(newm) <label> <unitTypeId> [<immolationRadius> [<speed> [<scale> [<isClickable>]]]]
    if (name == "newMonster" or name == "newm") then
        if (nbParam < 2 or nbParam > 6) then
            return true
        endif
        //checkParam1
        if (udg_monsterTypes.isLabelAlreadyUsed(param1)) then
            call Text_erP(escaper.getPlayer(), "label \"" + param1 + "\" already used")
            return true
        endif
        //checkParam2
        if (not(StringLength(param2) == 6 and SubStringBJ(param2, 1, 1) == "'" and SubStringBJ(param2, 6, 6) == "'")) then
            call Text_erP(escaper.getPlayer(), "wrong unit type id (exemple : 'hfoo')")
            return true
        endif
        //checkParam3
        if (nbParam >= 3) then
            set x = S2R(param3)
            if (not((x/5) == I2R(R2I(x/5))) or x < 0 or x > 400) then
                call Text_erP(escaper.getPlayer(), "wrong immolation radius ; should be an integer divisible by 5 and between 0 and 400")
                return true
            endif
            //checkParam4
            if (nbParam >= 4) then
                set str = CmdParam(cmd, 4)
                if (not(IsPositiveInteger(str)) or S2I(str) > MAX_MOVE_SPEED) then
                    call Text_erP(escaper.getPlayer(), "wrong speed value ; should be a positive integer between 0 and 522")
                    return true
                endif
                set speed = S2R(str)
                //checkParam5
                if (nbParam >= 5) then
                    set str = CmdParam(cmd, 5)
                    if (S2R(str) <= 0 and str != "default" and str != "d") then
                        call Text_erP(escaper.getPlayer(), "wrong scale value ; should be a real upper than 0 or \"default\" or \"d\"")
                        return true
                    endif
                    if (str == "default" or str == "d") then
                        set x = -1
                    else
                        set x = S2R(str)
                    endif
                    //checkParam6
                    if (nbParam == 6) then
                        set str = CmdParam(cmd, 6)
                        if (not IsBoolString(str)) then
                            call Text_erP(escaper.getPlayer(), "wrong \"is clickable\" value ; should be 'true', 'false', '0' or '1'")
                            return true
                        endif
                        set b = S2B(str)
                    else
                        set b = false
                    endif
                else
                    set x = -1
                    set b = false
                endif
            else
                set speed = DEFAULT_MONSTER_SPEED
                set x = -1
                set b = false
            endif 
        else
            set param3 = "0"
            set speed = DEFAULT_MONSTER_SPEED
            set x = -1
            set b = false
        endif
        if (StringContainsChar(param1, CACHE_SEPARATEUR_ITEM) or StringContainsChar(param1, CACHE_SEPARATEUR_PARAM) or StringContainsChar(param1, "\"")) then
            call Text_erP(escaper.getPlayer(), "characters \", " + CACHE_SEPARATEUR_ITEM + " and " + CACHE_SEPARATEUR_PARAM + " not allowed")
            return true
        endif 
        if (udg_monsterTypes.new(param1, String2Ascii(SubStringBJ(param2, 2, 5)), x, S2R(param3), speed, b) == 0) then
            call Text_erP(escaper.getPlayer(), "couldn't create the monster type")
        else
            call Text_mkP(escaper.getPlayer(), "monster type \"" + param1 + "\" created")
        endif
        return true
    endif
    
    
//-setMonsterLabel(setml) <oldMonsterLabel> <newMonsterLabel>
    if (name == "setMonsterLabel" or name == "setml") then
        if (not(nbParam == 2)) then
            return true
        endif
        set b = (udg_monsterTypes.get(param1) != 0)
        if (b) then
            set b = (not udg_monsterTypes.isLabelAlreadyUsed(param2))
        endif
        if (b) then
            if (StringContainsChar(param2, CACHE_SEPARATEUR_ITEM) or StringContainsChar(param2, CACHE_SEPARATEUR_PARAM) or StringContainsChar(param2, "\"")) then
                call Text_erP(escaper.getPlayer(), "characters \", " + CACHE_SEPARATEUR_ITEM + " and " + CACHE_SEPARATEUR_PARAM + " not allowed")
                return true
            endif
            call udg_monsterTypes.get(param1).setLabel(param2)
            call Text_mkP(escaper.getPlayer(), "label changed to \"" + param2 + "\"")
        else
            call Text_erP(escaper.getPlayer(), "impossible to change label")
        endif
        return true
    endif
    
    
//-setMonsterAlias(setma) <monsterLabel> <alias>
    if (name == "setMonsterAlias" or name == "setma") then
        if (not(nbParam == 2)) then
            return true
        endif
        set b = (udg_monsterTypes.get(param1) != 0)
        if (b) then
            set b = (not udg_monsterTypes.isLabelAlreadyUsed(param2))
        endif
        if (b) then
            if (StringContainsChar(param2, CACHE_SEPARATEUR_ITEM) or StringContainsChar(param2, CACHE_SEPARATEUR_PARAM) or StringContainsChar(param2, "\"")) then
                call Text_erP(escaper.getPlayer(), "characters \", " + CACHE_SEPARATEUR_ITEM + " and " + CACHE_SEPARATEUR_PARAM + " not allowed")
                return true
            endif
            call udg_monsterTypes.get(param1).setAlias(param2)
            call Text_mkP(escaper.getPlayer(), "alias changed to \"" + param2 + "\"")
        else
            call Text_erP(escaper.getPlayer(), "impossible to change alias")
        endif
        return true
    endif
    
    
//-setMonsterUnit(setmu) <monsterLabel> <unitType>   --> example of unit type : 'ewsp'
    if (name == "setMonsterUnit" or name == "setmu") then
        if (not(nbParam == 2)) then
            return true
        endif
        //checkParam1
        if (not udg_monsterTypes.isLabelAlreadyUsed(param1)) then
            call Text_erP(escaper.getPlayer(), "unknown monster type")
            return true
        endif
        //checkParam2
        if (not(StringLength(param2) == 6 and SubStringBJ(param2, 1, 1) == "'" and SubStringBJ(param2, 6, 6) == "'")) then
            call Text_erP(escaper.getPlayer(), "wrong unit type id (exemple : 'hfoo')")
            return true
        endif
        if (udg_monsterTypes.get(param1).setUnitTypeId(String2Ascii(SubStringBJ(param2, 2, 5)))) then
            call Text_mkP(escaper.getPlayer(), "unit type changed")
        else
            call Text_erP(escaper.getPlayer(), "this unit type doesn't exist")
        endif
        return true
    endif
    
    
//-setMonsterImmolation(setmi) <monsterLabel> <immolationRadius>   --> immolation between 5 and 400, divisible by 5
    if (name == "setMonsterImmolation" or name == "setmi") then
        if (not(nbParam == 2)) then
            return true
        endif
        //checkParam1
        if (not udg_monsterTypes.isLabelAlreadyUsed(param1)) then
            call Text_erP(escaper.getPlayer(), "unknown monster type")
            return true
        endif
        //checkParam2
        set x = S2R(param2)
        if (not((x/5) == I2R(R2I(x/5))) or x < 0 or x > 400) then
            call Text_erP(escaper.getPlayer(), "wrong immolation radius ; should be an integer divisible by 5 and between 0 and 400")
            return true
        endif
        if (udg_monsterTypes.get(param1).setImmolation(x)) then
            call Text_mkP(escaper.getPlayer(), "immolation changed")
        else
            call Text_erP(escaper.getPlayer(), "couldn't change immolation")
        endif
        return true
    endif
    
    
//-setMonsterMoveSpeed(setmms) <monsterLabel> <speed>
    if (name == "setMonsterMoveSpeed" or name == "setmms") then
        if (not(nbParam == 2)) then
            return true
        endif
        //checkParam1
        if (not udg_monsterTypes.isLabelAlreadyUsed(param1)) then
            call Text_erP(escaper.getPlayer(), "unknown monster type")
            return true
        endif
        //checkParam2
        if (not(IsPositiveInteger(param2)) or S2I(param2) > MAX_MOVE_SPEED) then
            call Text_erP(escaper.getPlayer(), "wrong speed value ; should be a positive integer between 0 and 522")
            return true
        endif
        if (udg_monsterTypes.get(param1).setUnitMoveSpeed(S2R(param2))) then
            call Text_mkP(escaper.getPlayer(), "move speed changed")
        else
            call Text_erP(escaper.getPlayer(), "couldn't change move speed")
        endif
        return true
    endif
    
    
//-setMonsterScale(setms) <monsterLabel> <scale>   --> affects the size of this kind of monster
    if (name == "setMonsterScale" or name == "setms") then
        if (not(nbParam == 2)) then
            return true
        endif
        //checkParam1
        if (not udg_monsterTypes.isLabelAlreadyUsed(param1)) then
            call Text_erP(escaper.getPlayer(), "unknown monster type")
            return true
        endif
        //checkParam2
        if (S2R(param2) <= 0 and param2 != "default" and param2 != "d") then
            call Text_erP(escaper.getPlayer(), "wrong scale value ; should be a real upper than 0 or \"default\" or \"d\"")
            return true
        endif
        if (param2 == "default" or param2 == "d") then
            set x = -1
        else
            set x = S2R(param2)
        endif
        if (udg_monsterTypes.get(param1).setScale(x)) then
            call Text_mkP(escaper.getPlayer(), "scale changed")
        else
            call Text_erP(escaper.getPlayer(), "couldn't change scale, probably because the old value is the same")
        endif
        return true
    endif
    
    
//-setMonsterClickable(setmc) <monsterLabel> <boolean clickable>   --> sets if locust or not for this kind of monster
    if (name == "setMonsterClickable" or name == "setmc") then
        if (not(nbParam == 2)) then
            return true
        endif
        //checkParam1
        if (not udg_monsterTypes.isLabelAlreadyUsed(param1)) then
            call Text_erP(escaper.getPlayer(), "unknown monster type")
            return true
        endif
        //checkParam2
        if (not IsBoolString(param2)) then
            call Text_erP(escaper.getPlayer(), "wrong \"is clickable\" value ; should be 'true', 'false', '0' or '1'")
            return true
        endif
        if (udg_monsterTypes.get(param1).setIsClickable(S2B(param2))) then
            if (S2B(param2)) then
                call Text_mkP(escaper.getPlayer(), "this monster type is now clickable")
            else
                call Text_mkP(escaper.getPlayer(), "this monster type is now unclickable")
            endif
        else
            if (S2B(param2)) then
                call Text_erP(escaper.getPlayer(), "this monster type is already clickable")
            else
                call Text_erP(escaper.getPlayer(), "this monster type is already unclickable")
            endif
        endif
        return true
    endif
    
    
//-setMonsterKillEffect(setmke) <monsterLabel> <killingEffect>
    if (name == "setMonsterKillEffect" or name == "setmke") then
        if (not(nbParam == 2)) then
            return true
        endif
        //checkParam1
        if (not udg_monsterTypes.isLabelAlreadyUsed(param1)) then
            call Text_erP(escaper.getPlayer(), "unknown monster type")
            return true
        endif 
        if (StringContainsChar(param2, CACHE_SEPARATEUR_ITEM) or StringContainsChar(param2, CACHE_SEPARATEUR_PARAM) or StringContainsChar(param2, "\"")) then
            call Text_erP(escaper.getPlayer(), "characters \", " + CACHE_SEPARATEUR_ITEM + " and " + CACHE_SEPARATEUR_PARAM + " not allowed")
            return true
        endif 
        call udg_monsterTypes.get(param1).setKillingEffectStr(param2)
        call Text_mkP(escaper.getPlayer(), "kill effect changed for this monster type")
        return true
    endif
    
    
//-setMonsterMeteorsToKill(setmmtk) <monsterLabel> <meteorNumber>
    if (name == "setMonsterMeteorsToKill" or name == "setmmtk") then
        if (not(nbParam == 2)) then
            return true
        endif
        //checkParam1
        if (not udg_monsterTypes.isLabelAlreadyUsed(param1)) then
            call Text_erP(escaper.getPlayer(), "unknown monster type")
            return true
        endif
        //checkParam2
        if (not(IsPositiveInteger(param2) and S2I(param2) > 0 and S2I(param2) < 10)) then
            call Text_erP(escaper.getPlayer(), "param2 must be an integer between 1 and 9")
            return true
        endif
        call udg_monsterTypes.get(param1).setNbMeteorsToKill(S2I(param2))
        call Text_mkP(escaper.getPlayer(), "number of meteors to kill changed for this monster type")
        return true
    endif
    
    
//-setMonsterHeight(setmh) <monsterLabel> <height>|default|d
    if (name == "setMonsterHeight" or name == "setmh") then
        if (not(nbParam == 2)) then
            return true
        endif
        //checkParam1
        if (not udg_monsterTypes.isLabelAlreadyUsed(param1)) then
            call Text_erP(escaper.getPlayer(), "unknown monster type")
            return true
        endif
        //checkParam2
        if (param2 == "default" or param2 == "d") then
            set x = -1
        elseif (S2R(param2) > 0 or param2 == "0") then
            set x = S2R(param2)
        else
            call Text_erP(escaper.getPlayer(), "wrong height ; should be a positive real or \"default\" or \"d\"")
            return true
        endif
        if (udg_monsterTypes.get(param1).setHeight(x)) then
            call Text_mkP(escaper.getPlayer(), "height changed for this monster type")
        else
            call Text_erP(escaper.getPlayer(), "the height is already set to this value")
        endif
        return true
    endif        
    
    
//-createMonsterImmobile(crmi) <monsterLabel> [<facingAngle>]   --> if facing angle not specified, random angles will be chosen
    if (name == "createMonsterImmobile" or name == "crmi") then
        if (nbParam < 1 or nbParam > 2) then
            return true
        endif
        //checkParam1
        if (not udg_monsterTypes.isLabelAlreadyUsed(param1)) then
            call Text_erP(escaper.getPlayer(), "unknown monster type")
            return true
        endif
        //checkParam2
        if (nbParam == 2) then
            if (S2R(param2) == 0 and param2 != "0") then
                call Text_erP(escaper.getPlayer(), "wrong angle value ; should be a real (-1 for random angle)")
                return true
            endif
            set x = S2R(param2)
        else
            set x = -1
        endif
        call escaper.makeCreateNoMoveMonsters(udg_monsterTypes.get(param1), x)
        call Text_mkP(escaper.getPlayer(), "monster making on")
        return true
    endif
    
//-createMonster(crm) <monsterLabel>   --> simple patrols (2 locations)   
    if (name == "createMonster" or name == "crm") then
        if (not(nbParam == 1)) then
            return true
        endif
        //checkParam1
        if (not udg_monsterTypes.isLabelAlreadyUsed(param1)) then
            call Text_erP(escaper.getPlayer(), "unknown monster type")
            return true
        endif
        call escaper.makeCreateSimplePatrolMonsters("normal", udg_monsterTypes.get(param1))
        call Text_mkP(escaper.getPlayer(), "monster making on")
        return true
    endif
    
//-createMonsterString(crms) <monsterLabel>   --> simple patrols where the second loc of a monster is the first loc of the next one
    if (name == "createMonsterString" or name == "crms") then
        if (not(nbParam == 1)) then
            return true
        endif
        //checkParam1
        if (not udg_monsterTypes.isLabelAlreadyUsed(param1)) then
            call Text_erP(escaper.getPlayer(), "unknown monster type")
            return true
        endif
        call escaper.makeCreateSimplePatrolMonsters("string", udg_monsterTypes.get(param1))
        call Text_mkP(escaper.getPlayer(), "monster making on")
        return true
    endif
    
//-createMonsterAuto(crma) <monsterLabel>  --> simple patrols created with only one click (click on a slide terrain)
    if (name == "crma") then
        if (not(nbParam == 1)) then
            return true
        endif
        //checkParam1
        if (not udg_monsterTypes.isLabelAlreadyUsed(param1)) then
            call Text_erP(escaper.getPlayer(), "unknown monster type")
            return true
        endif
        call escaper.makeCreateSimplePatrolMonsters("auto", udg_monsterTypes.get(param1))
        call Text_mkP(escaper.getPlayer(), "monster making on")
        return true
    endif
    
    
//-setAutoDistOnTerrain(setadot) <newDist>   --> for patrol monsters created in one click, distance between locations and slide terrain
    if (name == "setAutoDistOnTerrain" or name == "setadot") then
        if (not(nbParam == 1 and (S2R(param1) != 0 or param1 == "0" or param1 == "default" or param1 == "d"))) then
            return true
        endif
        if (param1 == "default" or param1 == "d") then
            call MakeSimplePatrolAuto_ChangeDistOnTerrainDefault()
        else
            if (not MakeSimplePatrolAuto_ChangeDistOnTerrain(S2R(param1))) then
                call Text_erP(escaper.getPlayer(), "distance specified out of bounds")
                return true
            endif
        endif
        call Text_mkP(escaper.getPlayer(), "distance on terrain changed")
        return true
    endif
    
    
//-createMonsterMultiPatrols(crmmp) <monsterLabel>   --> patrols until 20 locations
    if (name == "createMonsterMultiPatrols" or name == "crmmp") then
        if (not(nbParam == 1)) then
            return true
        endif
        //checkParam1
        if (not udg_monsterTypes.isLabelAlreadyUsed(param1)) then
            call Text_erP(escaper.getPlayer(), "unknown monster type")
            return true
        endif
        call escaper.makeCreateMultiplePatrolsMonsters("normal", udg_monsterTypes.get(param1))
        call Text_mkP(escaper.getPlayer(), "monster making on")
        return true
    endif
    
//-createMonsterMultiPatrolsString(crmmps) <monsterLabel>   --> patrols until 20 locations, with come back at last location
    if (name == "createMonsterMultiPatrolsString" or name == "crmmps") then
        if (not(nbParam == 1)) then
            return true
        endif
        //checkParam1
        if (not udg_monsterTypes.isLabelAlreadyUsed(param1)) then
            call Text_erP(escaper.getPlayer(), "unknown monster type")
            return true
        endif
        call escaper.makeCreateMultiplePatrolsMonsters("string", udg_monsterTypes.get(param1))
        call Text_mkP(escaper.getPlayer(), "monster making on")
        return true
    endif
    
    
//-createMonsterTeleport(crmt) <monsterLabel> <period> <angle>   --> teleport monster until 20 locations
    if (name == "createMonsterTeleport" or name == "crmt") then
        if (not(nbParam == 3)) then
            return true
        endif
        //checkParam1
        if (not udg_monsterTypes.isLabelAlreadyUsed(param1)) then
            call Text_erP(escaper.getPlayer(), "unknown monster type")
            return true
        endif
        //checkParam2
        set x = S2R(param2)
        if (x < MONSTER_TELEPORT_PERIOD_MIN or x > MONSTER_TELEPORT_PERIOD_MAX) then
            call Text_erP(escaper.getPlayer(), "the period must be between " + R2S(MONSTER_TELEPORT_PERIOD_MIN) + " and " + R2S(MONSTER_TELEPORT_PERIOD_MAX))
            return true
        endif
        //checkParam3
        if (S2R(param3) == 0 and param3 != "0") then
            call Text_erP(escaper.getPlayer(), "wrong angle value ; should be a real (-1 for random angle)")
            return true
        endif
        call escaper.makeCreateTeleportMonsters("normal", udg_monsterTypes.get(param1), x, S2R(param3))
        call Text_mkP(escaper.getPlayer(), "monster making on")
        return true
    endif
    
    
//-createMonsterTeleportStrings(crmts) <monsterLabel> <period> <angle>   --> teleport monster until 20 locations
    if (name == "createMonsterTeleport" or name == "crmts") then
        if (not(nbParam == 3)) then
            return true
        endif
        //checkParam1
        if (not udg_monsterTypes.isLabelAlreadyUsed(param1)) then
            call Text_erP(escaper.getPlayer(), "unknown monster type")
            return true
        endif
        //checkParam2
        set x = S2R(param2)
        if (x < MONSTER_TELEPORT_PERIOD_MIN or x > MONSTER_TELEPORT_PERIOD_MAX) then
            call Text_erP(escaper.getPlayer(), "the period must be between " + R2S(MONSTER_TELEPORT_PERIOD_MIN) + " and " + R2S(MONSTER_TELEPORT_PERIOD_MAX))
            return true
        endif
        //checkParam3
        if (S2R(param3) == 0 and param3 != "0") then
            call Text_erP(escaper.getPlayer(), "wrong angle value ; should be a real (-1 for random angle)")
            return true
        endif
        call escaper.makeCreateTeleportMonsters("string", udg_monsterTypes.get(param1), x, S2R(param3))
        call Text_mkP(escaper.getPlayer(), "monster making on")
        return true
    endif
    
    
//-next(n)   --> finalize the current multi patrols or teleport monster and start the next one
    if (name == "next" or name == "n") then
        if (not noParam) then
            return true
        endif
        if (escaper.makeMmpOrMtNext()) then
            call Text_mkP(escaper.getPlayer(), "next")
        else
            call Text_erP(escaper.getPlayer(), "you're not making multipatrol or teleport monsters")
        endif
        return true
    endif
    
    
//-monsterTeleportWait(mtw)   --> ajoute une période d'attente le MonsterTeleport en train d'être créé
    if (name == "monsterTeleportWait" or name == "mtw") then
        if (not noParam) then
            return true
        endif
        if (escaper.makeMonsterTeleportWait()) then
            call Text_mkP(escaper.getPlayer(), "wait period added")
        else
            call Text_erP(escaper.getPlayer(), "impossible to add a wait period")
        endif
        return true
    endif
    
    
//-monsterTeleportHide(mth)   --> ajoute une période où le MonsterTeleport est caché et ne tue pas
    if (name == "monsterTeleportHide" or name == "mth") then
        if (not noParam) then
            return true
        endif
        if (escaper.makeMonsterTeleportHide()) then
            call Text_mkP(escaper.getPlayer(), "hide period added")
        else
            call Text_erP(escaper.getPlayer(), "impossible to add a hide period")
        endif
        return true
    endif
    
    
//-setUnitTeleportPeriod(setutp) <period>
    if (name == "setUnitTeleportPeriod" or name == "setutp") then
        if (nbParam != 1) then
            return true
        endif
        //checkParam1
        set x = S2R(param1)
        if (x < MONSTER_TELEPORT_PERIOD_MIN or x > MONSTER_TELEPORT_PERIOD_MAX) then
            call Text_erP(escaper.getPlayer(), "the period must be between " + R2S(MONSTER_TELEPORT_PERIOD_MIN) + " and " + R2S(MONSTER_TELEPORT_PERIOD_MAX))
            return true
        endif
        //apply command
        call escaper.makeSetUnitTeleportPeriod("oneByOne", x)
        call Text_mkP(escaper.getPlayer(), "setting unit teleport period on")
        return true
    endif
    
    
//-setUnitTeleportPeriodBetweenPoints(setutpbp) <period>
    if (name == "setUnitTeleportPeriodBetweenPoints" or name == "setutpbp") then
        if (nbParam != 1) then
            return true
        endif
        //checkParam1
        set x = S2R(param1)
        if (x < MONSTER_TELEPORT_PERIOD_MIN or x > MONSTER_TELEPORT_PERIOD_MAX) then
            call Text_erP(escaper.getPlayer(), "the period must be between " + R2S(MONSTER_TELEPORT_PERIOD_MIN) + " and " + R2S(MONSTER_TELEPORT_PERIOD_MAX))
            return true
        endif
        //apply command
        call escaper.makeSetUnitTeleportPeriod("twoClics", x)
        call Text_mkP(escaper.getPlayer(), "setting unit teleport period on")
        return true
    endif
    
    
//-getUnitTeleportPeriod(getutp)
    if (name == "getUnitTeleportPeriod" or name == "getutp") then
        if (not noParam) then
            return true
        endif
        //apply command
        call escaper.makeGetUnitTeleportPeriod()
        call Text_mkP(escaper.getPlayer(), "getting unit teleport period on")
        return true
    endif


//-setUnitTeleportPeriod(setutp) <period>
    if (name == "setUnitTeleportPeriod" or name == "setutp") then
        if (nbParam != 1) then
            return true
        endif
        //checkParam1
        set x = S2R(param1)
        if (x < MONSTER_TELEPORT_PERIOD_MIN or x > MONSTER_TELEPORT_PERIOD_MAX) then
            call Text_erP(escaper.getPlayer(), "the period must be between " + R2S(MONSTER_TELEPORT_PERIOD_MIN) + " and " + R2S(MONSTER_TELEPORT_PERIOD_MAX))
            return true
        endif
        //apply command
        call escaper.makeSetUnitTeleportPeriod("oneByOne", x)
        call Text_mkP(escaper.getPlayer(), "setting unit teleport period on")
        return true
    endif
    
    
//-setUnitMonsterType(setumt) <monsterLabel>
    if (name == "setUnitMonsterType" or name == "setumt") then
        if (nbParam != 1) then
            return true
        endif
        //checkParam1
        if (not udg_monsterTypes.isLabelAlreadyUsed(param1)) then
            call Text_erP(escaper.getPlayer(), "unknown monster type")
            return true
        endif
        //apply command
        call escaper.makeSetUnitMonsterType("oneByOne", udg_monsterTypes.get(param1))
        call Text_mkP(escaper.getPlayer(), "setting unit monster type on")
        return true
    endif
    
    
//-setUnitMonsterTypeBetweenPoints(setumtbp) <monsterLabel>
    if (name == "setUnitMonsterTypeBetweenPoints" or name == "setumtbp") then
        if (nbParam != 1) then
            return true
        endif
        //checkParam1
        if (not udg_monsterTypes.isLabelAlreadyUsed(param1)) then
            call Text_erP(escaper.getPlayer(), "unknown monster type")
            return true
        endif
        //apply command
        call escaper.makeSetUnitMonsterType("twoClics", udg_monsterTypes.get(param1))
        call Text_mkP(escaper.getPlayer(), "setting unit monster type on")
        return true
    endif
    
    
//-displayMonsters(dm) [<monsterLabel>]   --> displays the characteristics of the kinds of monsters added by the maker(s)
    if (name == "displayMonsters" or name == "dm") then
        if (not(nbParam <= 1)) then
            return true
        endif
        if (nbParam == 1) then
            if (udg_monsterTypes.isLabelAlreadyUsed(param1)) then
                call udg_monsterTypes.get(param1).displayTotalForPlayer(escaper.getPlayer())
            else
                call Text_erP(escaper.getPlayer(), "unknown monster type")
            endif
        else
            call udg_monsterTypes.displayForPlayer(escaper.getPlayer())
        endif
        return true
    endif
    
    
//-deleteMonstersBetweenPoints(delmbp) [<deleteMode>]   --> delete monsters in a rectangle formed with two clicks
	if (name == "deleteMonstersBetweenPoints" or name == "delmbp") then
		//delete modes : all, noMove, move, simplePatrol, multiplePatrols
		if (not(nbParam <= 1)) then
			return true
		endif
		if (nbParam == 1) then
			if (param1 == "all" or param1 == "a") then
				set str = "all"
			else
				if (param1 == "noMove" or param1 == "nm") then
					set str = "noMove"
				else
					if (param1 == "move" or param1 == "m") then
						set str = "move"
					else
						if (param1 == "simplePatrol" or param1 == "sp") then
							set str = "simplePatrol"
						else
							if (param1 == "multiplePatrols" or param1 == "mp") then
								set str = "multiplePatrols"
							else
								return true
							endif
						endif
					endif
				endif
			endif
		else
			set str = "all"
		endif
		call escaper.makeDeleteMonsters(str)
        call Text_mkP(escaper.getPlayer(), "monsters deleting on")
		return true
	endif
    
    
//-deleteMonster(delm)   --> delete the monsters clicked by the player
    if (name == "deleteMonster" or name == "delm") then
        if (noParam) then
            call escaper.makeDeleteMonsters("oneByOne")
            call Text_mkP(escaper.getPlayer(), "monster deleting on")
        endif
        return true
    endif
    
    
//-createMonsterSpawn(crmsp) <monsterSpawnLabel> <monsterLabel> <direction> [<frequency>]   --> default frequency is 2, minimum is 0.1, maximum is 30
    if (name == "createMonsterSpawn" or name == "crmsp") then
        if(not(nbParam >= 3 and nbParam <= 4))then
            call Text_erP(escaper.getPlayer(), "uncorrect number of parameters")
            return true
        endif
        if(escaper.getMakingLevel().monsterSpawns.getFromLabel(param1) != 0)then
            call Text_erP(escaper.getPlayer(), "a monster spawn with label \"" + param1 + "\" already exists for this level")
            return true
        endif
        if(udg_monsterTypes.get(param2) == 0)then
            call Text_erP(escaper.getPlayer(), "unknown monster type \"" + param2 + "\"")
            return true
        endif
        if(param3 == "leftToRight" or param3 == "ltr")then
            set str = "leftToRight"
        elseif(param3 == "upToDown" or param3 == "utd")then
            set str = "upToDown"
        elseif(param3 == "rightToLeft" or param3 == "rtl")then
            set str = "rightToLeft"
        elseif(param3 == "downToUp" or param3 == "dtu")then
            set str = "downToUp"
        else
            call Text_erP(escaper.getPlayer(), "param 3 should be direction : leftToRight, upToDown, rightToLeft or downToUp")
            return true
        endif
        if(nbParam == 4)then
            set x = S2R(param4)
            if(x < 0.1 or x > 30)then
                call Text_erP(escaper.getPlayer(), "frequency must be a real between 0.1 and 30")
                return true
            endif
        else
            set x = 2
        endif
        call escaper.makeCreateMonsterSpawn(param1, udg_monsterTypes.get(param2), str, x)
        call Text_mkP(escaper.getPlayer(), "monster spawn making on")
        return true
    endif

    
//-setMonsterSpawnLabel(setmsl) <oldMonsterSpawnLabel> <newMonsterSpawnLabel>
    if(name == "setMonsterSpawnLabel" or name == "setmsl")then
        if(not(nbParam == 2))then
            return true
        endif
        if(escaper.getMakingLevel().monsterSpawns.changeLabel(param1, param2))then
            call Text_mkP(escaper.getPlayer(), "label changed")
        else
            call Text_erP(escaper.getPlayer(), "couldn't change label")
        endif
        return true
    endif
    

//-setMonsterSpawnMonster(setmsm) <monsterSpawnLabel> <monsterLabel>
    if(name == "setMonsterSpawnMonster" or name == "setmsm")then
        if(not(nbParam == 2))then
            return true
        endif
        if(escaper.getMakingLevel().monsterSpawns.getFromLabel(param1) == 0)then
            call Text_erP(escaper.getPlayer(), "unknown monster spawn \"" + param1 + "\" in this level")
            return true
        endif
        if(udg_monsterTypes.get(param2) == 0)then
            call Text_erP(escaper.getPlayer(), "unknown monster type \"" + param2 + "\"")
            return true
        endif
        call escaper.getMakingLevel().monsterSpawns.getFromLabel(param1).setMonsterType(udg_monsterTypes.get(param2))
        call Text_mkP(escaper.getPlayer(), "monster type changed")
        return true
    endif


//-setMonsterSpawnDirection(setmsd) <monsterSpawnLabel> <direction>   --> leftToRight(ltr), upToDown(utd), rightToLeft(rtl), downToUp(dtu)
    if(name == "setMonsterSpawnDirection" or name == "setmsd")then
        if(not(nbParam == 2))then
            return true
        endif
        if(escaper.getMakingLevel().monsterSpawns.getFromLabel(param1) == 0)then
            call Text_erP(escaper.getPlayer(), "unknown monster spawn \"" + param1 + "\" in this level")
            return true
        endif
        if(param2 == "leftToRight" or param2 == "ltr")then
            set str = "leftToRight"
        elseif(param2 == "upToDown" or param2 == "utd")then
            set str = "upToDown"
        elseif(param2 == "rightToLeft" or param2 == "rtl")then
            set str = "rightToLeft"
        elseif(param2 == "downToUp" or param2 == "dtu")then
            set str = "downToUp"
        else
            call Text_erP(escaper.getPlayer(), "direction should be leftToRight, upToDown, rightToLeft or downToUp")
            return true
        endif
        call escaper.getMakingLevel().monsterSpawns.getFromLabel(param1).setSens(str)
        call Text_mkP(escaper.getPlayer(), "direction changed")
        return true
    endif


//-setMonsterSpawnFrequency(setmsf) <monsterSpawnLabel> <frequency>   --> maximum 20 mobs per second
    if(name == "setMonsterSpawnFrequency" or name == "setmsf") then
        if(not(nbParam == 2))then
            return true
        endif
        if(escaper.getMakingLevel().monsterSpawns.getFromLabel(param1) == 0)then
            call Text_erP(escaper.getPlayer(), "unknown monster spawn \"" + param1 + "\" in this level")
            return true
        endif
        set x = S2R(param2)
        if(x < 0.1 or x > 30)then
            call Text_erP(escaper.getPlayer(), "frequency must be a real between 0.1 and 30")
            return true
        endif
        call escaper.getMakingLevel().monsterSpawns.getFromLabel(param1).setFrequence(x)
        call Text_mkP(escaper.getPlayer(), "frequency changed")
        return true
    endif
        

//-displayMonsterSpawns(dms)
    if(name == "displayMonsterSpawns" or name == "dms")then
        if(not noParam)then
            return true
        endif
        call escaper.getMakingLevel().monsterSpawns.displayForPlayer(escaper.getPlayer())
        return true
    endif


//-deleteMonsterSpawn(delms) <monsterSpawnLabel> 
    if(name == "deleteMonsterSpawn" or name == "delms")then
        if(not(nbParam == 1))then
            return true
        endif
        if(escaper.getMakingLevel().monsterSpawns.clearMonsterSpawn(param1))then
            call Text_mkP(escaper.getPlayer(), "monster spawn deleted")
        else
            call Text_erP(escaper.getPlayer(), "unknown monster spawn for this level")
        endif
        return true
    endif    
    
    
//createKey(crk)   --> create meteors used to kill clickable monsters
    if (name == "createKey" or name == "crk") then
        if (noParam) then
            call escaper.makeCreateMeteor()
            call Text_mkP(escaper.getPlayer(), "meteor making on")
        endif
        return true
    endif
    
    
//-deleteKeysBetweenPoints(delkbp)   --> delete meteors in a rectangle formed with two clicks
	if (name == "deleteKeysBetweenPoints" or name == "delkbp") then
		if (noParam) then
            call escaper.makeDeleteMeteors("twoClics")
            call Text_mkP(escaper.getPlayer(), "meteors deleting on")
		endif
		return true
	endif
    
    
//-deleteKey(delk)   --> delete the meteors clicked by the player
    if (name == "deleteKey" or name == "delk") then
        if (noParam) then
            call escaper.makeDeleteMeteors("oneByOne")
            call Text_mkP(escaper.getPlayer(), "meteors deleting on")
        endif
        return true
    endif
    
    
//-createStart(crs) [next(n)]   --> create the start (a rectangle formed with two clicks) of the current level or the next one if specified
    if (name == "createStart" or name == "crs") then
        if (not(nbParam <= 1)) then
            return true
        endif
        //checkParam1
        if (nbParam == 1) then
            if (not(param1 == "next" or param1 == "n")) then
                call Text_erP(escaper.getPlayer(), "param1 should be \"next\" or \"n\"")
                return true
            endif
            set b = true
        else
            set b = false
        endif
        call escaper.makeCreateStart(b) //b signifie si le "Start" est créé pour le niveau suivant (sinon pour le niveau en cours de mapping pour l'escaper)
        call Text_mkP(escaper.getPlayer(), "start making on")
        return true
    endif
    
    
//-createEnd(cre)   --> create the end (a rectangle formed with two clicks) of the current level
    if (name == "createEnd" or name == "cre") then
        if (not noParam) then
            return true
        endif
        call escaper.makeCreateEnd()
        call Text_mkP(escaper.getPlayer(), "end making on")
        return true
    endif
    

//-getMakingLevel(getmkl)   --> displays the id of the level the player is creating (the first one is id 0)
    if (name == "getMakingLevel" or name == "getmkl") then
        if (not noParam) then
            return true
        endif
        if (udg_levels.getCurrentLevel() == escaper.getMakingLevel()) then
            set str = " (same as current level)"
        else
            set str = ""
        endif
        call Text_P(escaper.getPlayer(), "the level you are making is number " + I2S(escaper.getMakingLevel().getId()) + str)
        return true
    endif
    
    
//-setMakingLevel(setmkl) <levelId> | current(c)   --> sets the level the players chose to continue creating
    if (name == "setMakingLevel" or name == "setmkl") then  
        if (not(nbParam == 1)) then
            return true
        endif
        if (IsPositiveInteger(param1)) then
            set n = S2I(param1)
            if (udg_levels.getLastLevelId() < n) then
                if (n - udg_levels.getLastLevelId() == 1) then
                    if (udg_levels.new()) then
                        call Text_mkP(escaper.getPlayer(), "level number " + I2S(n) + " created")
                    else
                        call Text_erP(escaper.getPlayer(), "nombre maximum de niveaux atteint")
                        return true
                    endif
                else
                    call Text_erP(escaper.getPlayer(), "this level doesn't exist")
                    return true
                endif
            endif
            if (escaper.setMakingLevel(udg_levels.get(n))) then
                call Text_mkP(escaper.getPlayer(), "you are now making level " + I2S(n))
            else
                call Text_erP(escaper.getPlayer(), "you are already making this level")
            endif
        else
            if (param1 == "current" or param1 == "c") then
                if (escaper.setMakingLevel(0)) then
                    call Text_mkP(escaper.getPlayer(), "you are now making current level (which is at the moment number " + I2S(udg_levels.getCurrentLevel().getId()) + ")")
                else
                    call Text_erP(escaper.getPlayer(), "you are already making current level")
                endif
            else
                call Text_erP(escaper.getPlayer(), "param1 should be a level id or \"current\"")
            endif
        endif
        return true
    endif
    
    
//-newLevel(newl)   --> creates a new level after the last one
    if (name == "newLevel" or name == "newl") then
        if (noParam) then
            if (udg_levels.new()) then
                call Text_mkP(escaper.getPlayer(), "level number " + I2S(udg_levels.getLastLevelId()) + " created")
            else
                call Text_erP(escaper.getPlayer(), "nombre maximum de niveaux atteint")
            endif
        endif
        return true
    endif
    
    
//-setLivesEarned(setle) <livesNumber> [<levelID>]   --> set the number of lives earned at the specified level
    if (name == "setLivesEarned" or name == "setle") then
        if (not(nbParam >= 1 and nbParam <= 2)) then
            return true
        endif
        //check param1
        if (not IsPositiveInteger(param1)) then
            call Text_erP(escaper.getPlayer(), "the number of lives must be a positive integer")
            return true
        endif
        //check param2
        if (nbParam == 2) then
            if (not(IsPositiveInteger(param2))) then
                call Text_erP(escaper.getPlayer(), "the level number must be a positive integer")
                return true
            endif
            set level = udg_levels.get(S2I(param2))
            if (level == 0) then
                call Text_erP(escaper.getPlayer(), "level number " + param2 + " doesn't exist")
                return true
            endif
        else
            set level = escaper.getMakingLevel()
        endif
        call level.setNbLivesEarned(S2I(param1))
        if (level.getId() > 0) then
            call Text_mkP(escaper.getPlayer(), "the number of lives earned at level " + I2S(level.getId()) + " is now " + param1)
        else
            call Text_mkP(escaper.getPlayer(), "the number of lives at the beginning of the game is now " + param1)
        endif
        return true
    endif
    
    
//-createVisibility(crv)   --> create visibility rectangles for the current level
    if (name == "createVisibility" or name == "crv") then
        if (noParam) then
            call escaper.makeCreateVisibilityModifier()
            call Text_mkP(escaper.getPlayer(), "visibility making on")
        endif
        return true
    endif
    
    
//-removeVisibilities(remv) [<levelId>]   --> remove all visibility rectangles made for the current level
    if (name == "removeVisibilities" or name == "remv") then
        if (not(noParam or nbParam == 1)) then
            return true
        endif
        //check param1
        if (nbParam == 1) then
            if (not(IsPositiveInteger(param1))) then
                call Text_erP(escaper.getPlayer(), "the level number must be a positive integer")
                return true
            endif
            set level = udg_levels.get(S2I(param2))
            if (level == 0) then
                call Text_erP(escaper.getPlayer(), "level number " + param1 + " doesn't exist")
                return true
            endif
        else
            set level = escaper.getMakingLevel()
        endif
        call level.removeVisibilities()
        call Text_mkP(escaper.getPlayer(), "visibilities removed for level " + I2S(level.getId()))
        return true
    endif
    
    
//-setStartMessage(setsm) [<message>]   --> sets the start message of the current level (spaces allowed)
    if (name == "setStartMessage" or name == "setsm") then
        call escaper.getMakingLevel().setStartMessage(CmdParam(cmd, 0))
        call Text_mkP(escaper.getPlayer(), "start message for level " + I2S(escaper.getMakingLevel().getId()) + " changed")
        return true
    endif
    
    
//-getStartMessage(getsm)   --> displays the start message of the current level
    if (name == "getStartMessage" or name == "getsm") then
        set str = escaper.getMakingLevel().getStartMessage()
        if (str == "" or str == null) then
            call Text_mkP(escaper.getPlayer(), "start message for level " + I2S(escaper.getMakingLevel().getId()) + " is not defined")
        else
            call Text_mkP(escaper.getPlayer(), "start message for level " + I2S(escaper.getMakingLevel().getId()) + " is \"" + str + "\"")
        endif
        return true
    endif
    
    
//-cancel(z)   --> cancel the last action made on the map
    if (name == "cancel" or name == "z") then
        if (noParam) then
            if (not escaper.cancelLastAction()) then
                call Text_erP(escaper.getPlayer(), "nothing to cancel")
            endif
        endif
        return true
    endif
    
    
//-redo(y)   --> redo the last action cancelled
    if (name == "redo" or name == "y") then
        if (noParam) then
            if (not escaper.redoLastAction()) then
                call Text_erP(escaper.getPlayer(), "nothing to redo")
            endif
        endif
        return true
    endif
    
    
//-nbLevels(nbl)   --> display the number of levels that are currently in the map
    if (name == "nbLevels" or name == "nbl") then
        if (noParam) then
            set n = udg_levels.count()
            if (n > 1) then
                call Text_P(escaper.getPlayer(), "there are currently " + I2S(n) + " levels in the map")
            else
                call Text_P(escaper.getPlayer(), "there is currently " + I2S(n) + " level in the map")
            endif
        endif
        return true
    endif
    
    
//-newCaster(newc) <label> <casterMonsterType> <projectileMonsterType> [<range> [<projectileSpeed> [<loadTime>]]]
    if (name == "newCaster" or name == "newc") then
        if (nbParam < 3 or nbParam > 6) then
            return true
        endif
        //checkParam1
        if (udg_casterTypes.isLabelAlreadyUsed(param1)) then
            call Text_erP(escaper.getPlayer(), "label \"" + param1 + "\" already used")
            return true
        endif        
        //checkParam2
        if (not udg_monsterTypes.isLabelAlreadyUsed(param2)) then
            call Text_erP(escaper.getPlayer(), "unknown monster type \"" + param2 + "\"")
            return true
        endif       
        //checkParam3
        if (not udg_monsterTypes.isLabelAlreadyUsed(param3)) then
            call Text_erP(escaper.getPlayer(), "unknown monster type \"" + param3 + "\"")
            return true
        endif
        //checkParam4 range
        if (nbParam >= 4) then
            if (S2R(param4) <= 0) then
                call Text_erP(escaper.getPlayer(), "the range must be a real higher than 0")
                return true
            endif
            set x = S2R(param4)
            //checkParam5 projectile speed
            if (nbParam >= 5) then
                if (S2R(CmdParam(cmd, 5)) < MIN_CASTER_PROJECTILE_SPEED) then
                    call Text_erP(escaper.getPlayer(), "the projectile speed must be a real higher or equals to " + R2S(MIN_CASTER_PROJECTILE_SPEED))
                    return true
                endif
                set speed = S2R(CmdParam(cmd, 5))
                //checkParam6 load time
                if (nbParam == 6) then
                    if (S2R(CmdParam(cmd, 6)) < MIN_CASTER_LOAD_TIME) then
                        call Text_erP(escaper.getPlayer(), "the load time must be a real higher or equals to " + R2S(MIN_CASTER_LOAD_TIME))
                        return true
                    endif
                    set y = S2R(CmdParam(cmd, 6))
                else
                    set y = DEFAULT_CASTER_LOAD_TIME
                endif
            else
                set y = DEFAULT_CASTER_LOAD_TIME
                set speed = DEFAULT_CASTER_PROJECTILE_SPEED
            endif
        else
            set y = DEFAULT_CASTER_LOAD_TIME
            set speed = DEFAULT_CASTER_PROJECTILE_SPEED
            set x = DEFAULT_CASTER_RANGE
        endif
        //apply command
        if (StringContainsChar(param1, CACHE_SEPARATEUR_ITEM) or StringContainsChar(param1, CACHE_SEPARATEUR_PARAM) or StringContainsChar(param1, "\"")) then
            call Text_erP(escaper.getPlayer(), "characters \", " + CACHE_SEPARATEUR_ITEM + " and " + CACHE_SEPARATEUR_PARAM + " not allowed")
            return true
        endif
        call udg_casterTypes.new(param1, udg_monsterTypes.get(param2), udg_monsterTypes.get(param3), x, speed, y, DEFAULT_CASTER_ANIMATION)
        call Text_mkP(escaper.getPlayer(), "new caster type \"" + param1 + "\" created")
        return true
    endif
    
    
//-setCasterLabel(setcl) <oldCasterLabel> <newCasterLabel>
    if (name == "setCasterLabel" or name == "setcl") then
        if (not(nbParam == 2)) then
            return true
        endif
        set b = (udg_casterTypes.get(param1) != 0)
        if (b) then
            set b = (not udg_casterTypes.isLabelAlreadyUsed(param2))
        endif
        if (b) then
            if (StringContainsChar(param2, CACHE_SEPARATEUR_ITEM) or StringContainsChar(param2, CACHE_SEPARATEUR_PARAM) or StringContainsChar(param2, "\"")) then
                call Text_erP(escaper.getPlayer(), "characters \", " + CACHE_SEPARATEUR_ITEM + " and " + CACHE_SEPARATEUR_PARAM + " not allowed")
                return true
            endif
            call udg_casterTypes.get(param1).setLabel(param2)
            call Text_mkP(escaper.getPlayer(), "label changed to \"" + param2 + "\"")
        else
            call Text_erP(escaper.getPlayer(), "impossible to change label")
        endif
        return true
    endif
    
    
//-setCasterAlias(setca) <casterLabel> <alias>
    if (name == "setCasterAlias" or name == "setca") then
        if (not(nbParam == 2)) then
            return true
        endif
        set b = (udg_casterTypes.get(param1) != 0)
        if (b) then
            set b = (not udg_casterTypes.isLabelAlreadyUsed(param2))
        endif
        if (b) then
            if (StringContainsChar(param2, CACHE_SEPARATEUR_ITEM) or StringContainsChar(param2, CACHE_SEPARATEUR_PARAM) or StringContainsChar(param2, "\"")) then
                call Text_erP(escaper.getPlayer(), "characters \", " + CACHE_SEPARATEUR_ITEM + " and " + CACHE_SEPARATEUR_PARAM + " not allowed")
                return true
            endif
            call udg_casterTypes.get(param1).setAlias(param2)
            call Text_mkP(escaper.getPlayer(), "alias changed to \"" + param2 + "\"")
        else
            call Text_erP(escaper.getPlayer(), "impossible to change alias")
        endif
        return true
    endif
    
    
//-setCasterCaster(setcc) <casterLabel> <casterMonsterType>
    if (name == "setCasterCaster" or name == "setcc") then
        if (nbParam != 2) then
            return true
        endif
        //checkParam 1
        if (not udg_casterTypes.isLabelAlreadyUsed(param1)) then
            call Text_erP(escaper.getPlayer(), "unknown caster type \"" + param1 + "\"")
            return true
        endif
        //checkParam 2
        if (not udg_monsterTypes.isLabelAlreadyUsed(param2)) then
            call Text_erP(escaper.getPlayer(), "unknown monster type \"" + param2 + "\"")
            return true
        endif  
        //apply command
        call udg_casterTypes.get(param1).setCasterMonsterType(udg_monsterTypes.get(param2))
        call Text_mkP(escaper.getPlayer(), "caster monster type changed")
        return true
    endif
    
    
//-setCasterProjectile(setcp) <casterLabel> <projectileMonsterType>
    if (name == "setCasterProjectile" or name == "setcp") then
        if (nbParam != 2) then
            return true
        endif
        //checkParam 1
        if (not udg_casterTypes.isLabelAlreadyUsed(param1)) then
            call Text_erP(escaper.getPlayer(), "unknown caster type \"" + param1 + "\"")
            return true
        endif
        //checkParam 2
        if (not udg_monsterTypes.isLabelAlreadyUsed(param2)) then
            call Text_erP(escaper.getPlayer(), "unknown monster type \"" + param2 + "\"")
            return true
        endif  
        //apply command
        call udg_casterTypes.get(param1).setProjectileMonsterType(udg_monsterTypes.get(param2))
        call Text_mkP(escaper.getPlayer(), "projectile monster type changed")
        return true
    endif
    
    
//-setCasterRange(setcr) <casterLabel> <range>
    if (name == "setCasterRange" or name == "setcr") then
        if (nbParam != 2) then
            return true
        endif
        //checkParam 1
        if (not udg_casterTypes.isLabelAlreadyUsed(param1)) then
            call Text_erP(escaper.getPlayer(), "unknown caster type \"" + param1 + "\"")
            return true
        endif
        //checkParam 2
        if (S2R(param2) <= 0) then
            call Text_erP(escaper.getPlayer(), "the range must be a real higher than 0")
            return true
        endif
        //apply command
        call udg_casterTypes.get(param1).setRange(S2R(param2))
        call Text_mkP(escaper.getPlayer(), "range changed")
        return true
    endif
    
    
//-setCasterSpeed(setcs) <casterLabel> <projectileSpeed>
    if (name == "setCasterSpeed" or name == "setcs") then
        if (nbParam != 2) then
            return true
        endif
        //checkParam 1
        if (not udg_casterTypes.isLabelAlreadyUsed(param1)) then
            call Text_erP(escaper.getPlayer(), "unknown caster type \"" + param1 + "\"")
            return true
        endif
        //checkParam 2
        if (S2R(param2) < MIN_CASTER_PROJECTILE_SPEED) then
            call Text_erP(escaper.getPlayer(), "the projectile speed must be a real higher or equals to " + R2S(MIN_CASTER_PROJECTILE_SPEED))
            return true
        endif
        //apply command
        call udg_casterTypes.get(param1).setProjectileSpeed(S2R(param2))
        call Text_mkP(escaper.getPlayer(), "projectile speed changed")
        return true
    endif
    
    
//-setCasterLoadtime(setclt) <casterLabel> <loadTime>
    if (name == "setCasterLoadTime" or name == "setclt") then
        if (nbParam != 2) then
            return true
        endif
        //checkParam 1
        if (not udg_casterTypes.isLabelAlreadyUsed(param1)) then
            call Text_erP(escaper.getPlayer(), "unknown caster type \"" + param1 + "\"")
            return true
        endif
        //checkParam 2
        if (S2R(param2) < MIN_CASTER_LOAD_TIME) then
            call Text_erP(escaper.getPlayer(), "the load time must be a real higher or equals to " + R2S(MIN_CASTER_LOAD_TIME))
            return true
        endif
        //apply command
        call udg_casterTypes.get(param1).setLoadTime(S2R(param2))
        call Text_mkP(escaper.getPlayer(), "load time changed")
        return true
    endif
    
    
//-setCasterAnimation(setcan) <casterLabel> <animation>
    if (name == "setCasterAnimation" or name == "setcan") then
        if (not(nbParam >= 2)) then
            return true
        endif
        //checkParam 1
        if (not udg_casterTypes.isLabelAlreadyUsed(param1)) then
            call Text_erP(escaper.getPlayer(), "unknown caster type \"" + param1 + "\"")
            return true
        endif
        //checkParam 2
        set n = StringLength(name) + StringLength(param1) + 4
        set str = SubStringBJ(cmd, n, StringLength(cmd))
        //apply command
        call udg_casterTypes.get(param1).setAnimation(str)
        call Text_mkP(escaper.getPlayer(), "caster animation changed")
        return true
    endif
    
    
//-createCaster(crc) <casterLabel> [<facingAngle>]
    if (name == "createCaster" or name == "crc") then
        if (nbParam < 1 or nbParam > 2) then
            return true
        endif
        //checkParam 1
        if (not udg_casterTypes.isLabelAlreadyUsed(param1)) then
            call Text_erP(escaper.getPlayer(), "unknown caster type \"" + param1 + "\"")
            return true
        endif
        //checkParam2
        if (nbParam == 2) then
            if (S2R(param2) == 0 and param2 != "0") then
                call Text_erP(escaper.getPlayer(), "wrong angle value ; should be a real (-1 for random angle)")
                return true
            endif
            set x = S2R(param2)
        else
            set x = -1
        endif
        //apply command
        call escaper.makeCreateCaster(udg_casterTypes.get(param1), x)
        call Text_mkP(escaper.getPlayer(), "casters making on")
        return true
    endif
    
    
//-deleteCastersBetweenPoints(delcbp)   --> delete casters in a rectangle formed with two clicks
	if (name == "deleteCastersBetweenPoints" or name == "delcbp") then
		if (noParam) then
            call escaper.makeDeleteCasters("twoClics")
            call Text_mkP(escaper.getPlayer(), "casters deleting on")
		endif
		return true
	endif
    
    
//-deleteCaster(delc)   --> delete the casters clicked by the player
    if (name == "deleteCaster" or name == "delc") then
        if (noParam) then
            call escaper.makeDeleteCasters("oneByOne")
            call Text_mkP(escaper.getPlayer(), "casters deleting on")
        endif
        return true
    endif
    
    
//-displayCasters(dc) [<casterLabel>]
    if (name == "displayCasters" or name == "dc") then
        if (not(nbParam <= 1)) then
            return true
        endif
        if (nbParam == 1) then
            if (udg_casterTypes.isLabelAlreadyUsed(param1)) then
                call udg_casterTypes.get(param1).displayForPlayer(escaper.getPlayer())
            else
                call Text_erP(escaper.getPlayer(), "unknown caster type")
            endif
        else
            call udg_casterTypes.displayForPlayer(escaper.getPlayer())
        endif
        return true
    endif
    

//-createClearMob(crcm) <disableDuration>
    if (name == "createClearMob" or name == "crcm") then
        if (not(nbParam == 1)) then
            return true
        endif
        set x = S2R(param1)
        if (x != 0 and (x > CLEAR_MOB_MAX_DURATION or x < ClearMob_FRONT_MONTANT_DURATION)) then
            call Text_erP(escaper.getPlayer(), "the disable duration must be a real between " + R2S(ClearMob_FRONT_MONTANT_DURATION) + " and " + R2S(CLEAR_MOB_MAX_DURATION))
            return true
        endif
        call escaper.makeCreateClearMobs(x)
        call Text_mkP(escaper.getPlayer(), "clear mob making on")
        return true
    endif
    

//-deleteClearMob(delcm)
    if (name == "deleteClearMob" or name == "delcm") then
        if (not noParam) then
            return true
        endif
        call escaper.makeDeleteClearMobs()
        call Text_mkP(escaper.getPlayer(), "clear mobs deleting on")
        return true
    endif
    

//-getTerrainCliffClass(gettcc) <terrainLabel>
    if (name == "getTerrainCliffClass" or name == "gettcc") then
        if (nbParam != 1) then
            return true
        endif
        //checkParam 1
        set b = (udg_terrainTypes.get(param1) != 0)
        if (not b) then
            return true
        endif
        //apply command
        call Text_mkP(escaper.getPlayer(), "cliff class for that terrain is " + I2S(udg_terrainTypes.get(param1).getCliffClassId()))
        return true
    endif   


//-getMainTileset
    if (name == "getMainTileset") then
        if (not noParam) then
            return true
        endif
        if (udg_terrainTypes.getMainTileset() == "auto") then
            call Text_mkP(escaper.getPlayer(), "main tileset : auto")
        else
            call Text_mkP(escaper.getPlayer(), "main tileset : " + udg_terrainTypes.getMainTileset() + " = " + tileset2tilesetString(udg_terrainTypes.getMainTileset()))
        endif
        return true
    endif   

    
    
        
    return false
endfunction






endlibrary
