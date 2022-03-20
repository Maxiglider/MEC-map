//TESH.scrollpos=0
//TESH.alwaysfold=0
library MeteorDeleteActions needs BasicFunctions, Escaper


function MeteorDelete_Actions takes nothing returns nothing

//modes : oneByOne, twoClics

    local Escaper escaper = Hero2Escaper(GetTriggerUnit())
    local Make mkGeneral = escaper.getMake()
	local MakeDeleteMeteors mk = MakeDeleteMeteors(integer(mkGeneral))
    local Meteor meteor
    local hashtable suppressionHashTable = InitHashtable()
    local integer nbMeteorsRemoved = 0
    local real x = GetOrderPointX()
    local real y = GetOrderPointY()
	local integer i

    if (not IsIssuedOrder("smart")) then
        call FlushParentHashtable(suppressionHashTable)
        set suppressionHashTable = null
        return
    endif
    call StopUnit(mk.maker)
    
    
    if (mk.getMode() == "oneByOne") then
        if (GetItemTypeId(GetOrderTargetItem()) != METEOR_NORMAL) then
            call FlushParentHashtable(suppressionHashTable)
            set suppressionHashTable = null
            return
        endif        
        set meteor = Meteor(GetItemUserData(GetOrderTargetItem()))
        if (meteor != 0 and meteor.getItem() != null) then
            call meteor.removeMeteor()
            call SaveInteger(suppressionHashTable, 0, nbMeteorsRemoved, integer(meteor))
            set nbMeteorsRemoved = 1
        endif
    else
        //mode twoClics
        if (not mk.isLastLocSavedUsed()) then
            call mk.saveLoc(x, y)
            call FlushParentHashtable(suppressionHashTable)
            set suppressionHashTable = null
            return
        endif
        
        set i = 0
        loop
            exitwhen (i > escaper.getMakingLevel().meteors.getLastInstanceId())
                set meteor = escaper.getMakingLevel().meteors.get(i)
                if (meteor != 0 and meteor.getItem() != null and IsItemBetweenLocs(meteor.getItem(), mk.lastX, mk.lastY, x, y)) then
                    call meteor.removeMeteor()
                    call SaveInteger(suppressionHashTable, 0, nbMeteorsRemoved, integer(meteor))
                    set nbMeteorsRemoved = nbMeteorsRemoved + 1
                endif
            set i = i + 1
        endloop
    endif
    
    if (nbMeteorsRemoved <= 1) then
        call Text_mkP(mk.makerOwner, I2S(nbMeteorsRemoved) + " meteor removed.")
    else
        call Text_mkP(mk.makerOwner, I2S(nbMeteorsRemoved) + " meteors removed.")
    endif
    
	if (nbMeteorsRemoved > 0) then
		call escaper.newAction(MakeDeleteMeteorsAction.create(escaper.getMakingLevel(), suppressionHashTable))
	endif
    
    call mk.unsaveLocDefinitely()
    
    call FlushParentHashtable(suppressionHashTable)
    set suppressionHashTable = null
endfunction



endlibrary

