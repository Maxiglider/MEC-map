//TESH.scrollpos=12
//TESH.alwaysfold=0
library MakeClearMob needs Make, ClearMob



struct MakeClearMob extends Make
    private real disableDuration
    private ClearMob clearMob
    private integer array clickedMobs[500]
    private integer lastClickedMobInd
    private integer pointeurClickedMob
	
	static method create takes unit maker, real disableDuration returns MakeClearMob
        local MakeClearMob m
		if (maker == null or (disableDuration != 0 and (disableDuration > CLEAR_MOB_MAX_DURATION or disableDuration < ClearMob_FRONT_MONTANT_DURATION))) then
			return 0
		endif
        set m = MakeClearMob.allocate()
        set m.maker = maker
		set m.makerOwner = GetOwningPlayer(maker)
        set m.kind = "createClearMob"
        set m.t = CreateTrigger()
        call TriggerAddAction(m.t, Make_GetActions(m.kind))
        call TriggerRegisterUnitEvent(m.t, maker, EVENT_UNIT_ISSUED_POINT_ORDER)
        set m.lastClickedMobInd = -1
        set m.pointeurClickedMob = -1
        set m.disableDuration = disableDuration
        set m.clearMob = 0
        return m
    endmethod
    
    method onDestroy takes nothing returns nothing
		call DestroyTrigger(.t)
		set .t = null
		set .maker = null
	endmethod
    
    method clickMade takes integer monsterOrCasterId returns nothing
        local Escaper escaper = Hero2Escaper(.maker)
        if (.pointeurClickedMob == -1) then
            if (ClearTriggerMobId2ClearMob(monsterOrCasterId) != 0) then //le mob est déjà trigger mob d'un clear mob
                call Text_erP(.makerOwner, "this monster is already a trigger mob of a clear mob")
                return
            else
                set .clearMob = escaper.getMakingLevel().clearMobs.new(monsterOrCasterId, .disableDuration, true)
                call Text_mkP(.makerOwner, "trigger mob added for a new clear mob")
            endif
        else //le trigger mob est créé, essai d'ajout d'un block mob
            //vérification que le clear mob existe toujours
            if (.clearMob.getTriggerMob() == 0) then
                call Text_erP(.makerOwner, "the clear mob you are working on has been removed")
                call escaper.destroyMake()
                return
            endif
            if (.clearMob.getBlockMobs().containsMob(monsterOrCasterId)) then //le mob est déjà block mob du clear mob
                call Text_erP(.makerOwner, "this monster is already a block mob of this clear mob")
                return
            else
                call .clearMob.addBlockMob(monsterOrCasterId)
                call Text_mkP(.makerOwner, "block mob added")
            endif                
        endif
        set .pointeurClickedMob = .pointeurClickedMob + 1
        set .lastClickedMobInd = .pointeurClickedMob
    endmethod
	
	method cancelLastAction takes nothing returns boolean
		if (.pointeurClickedMob > 0) then //cas où un block mob doit être annulé
            if (.clearMob.removeLastBlockMob()) then
                call Text_mkP(.makerOwner, "last block mob removed")
            else
                call Text_erP(.makerOwner, "error, couldn't remove the last block mob")
            endif
        elseif (.pointeurClickedMob == 0) then //cas où le trigger mob est à supprimer, et donc le clear mob en entier
            call .clearMob.destroy()
            call Text_mkP(.makerOwner, "clear mob removed")
        else
            return false
        endif
        set .pointeurClickedMob = .pointeurClickedMob - 1
        return true
	endmethod
	
	method redoLastAction takes nothing returns boolean
        local Escaper escaper = Hero2Escaper(.maker)
        if (.pointeurClickedMob == .lastClickedMobInd) then
            return false
        endif
        set .pointeurClickedMob = .pointeurClickedMob + 1
		if (.pointeurClickedMob > 0) then //cas où un block mob doit être annulé
            if (.clearMob.addBlockMob(.clickedMobs[.pointeurClickedMob])) then
                call Text_mkP(.makerOwner, "block mob added")
            else
                call Text_erP(.makerOwner, "error, couldn't add the block mob")
            endif
        else //cas où le trigger mob est à recréer, et donc le clear mob en entier
            set .clearMob = escaper.getMakingLevel().clearMobs.new(.clickedMobs[.pointeurClickedMob], .disableDuration, true)
            call Text_mkP(.makerOwner, "trigger mob added for a new clear mob")
        endif
        return true
	endmethod	
endstruct
	
	
	
endlibrary

