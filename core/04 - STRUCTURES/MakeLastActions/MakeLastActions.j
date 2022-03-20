//TESH.scrollpos=93
//TESH.alwaysfold=0
library MakeLastActions needs Text


globals
    private constant integer NB_MAX_ACTIONS_SAVED = 30
endglobals



struct MakeLastActions
    private MakeAction array lastActions [NB_MAX_ACTIONS_SAVED]
    private integer lastActionId
    private integer lastActionEffective //anciennement appelé "pointeur"
    private Escaper owner
    
    static method create takes Escaper owner returns MakeLastActions
        local MakeLastActions la = MakeLastActions.allocate()
        set la.lastActionId = -1
        set la.lastActionEffective = -1
        set la.owner = owner
        return la
    endmethod   
    
    private method onDestroy takes nothing returns nothing
        local integer i = 0
        loop
            exitwhen (i > .lastActionId)
                call .lastActions[i].destroy()
            set i = i + 1
        endloop
    endmethod
    
    method newAction takes MakeAction action returns MakeAction
        local integer i
        if (.lastActionEffective < .lastActionId) then
            //suppression des actions annulées (à l'ajout d'une nouvelle action)
            set i = .lastActionEffective + 1
            loop
                exitwhen (i > .lastActionId)
                    call .lastActions[i].destroy()
                set i = i + 1
            endloop
        endif
        if (.lastActionEffective == NB_MAX_ACTIONS_SAVED - 1) then
            //suppression de la plus ancienne des actions et décalage de tout le tableau
            call .lastActions[0].destroy()
            set i = 0
            loop
                exitwhen (i == NB_MAX_ACTIONS_SAVED - 1)
                    set .lastActions[i] = .lastActions[i + 1]
                set i = i + 1
            endloop
        else
            set .lastActionEffective = .lastActionEffective + 1
        endif
        //sauvegarde de l'action
        set .lastActions[.lastActionEffective] = action
        set .lastActionId = .lastActionEffective
        //assignation du "owner" de l'action
        set action.owner = .owner
        return action
    endmethod
    
    method cancelLastAction takes nothing returns boolean
        if (.lastActionEffective < 0) then
            return false
        endif
        if (.lastActions[.lastActionEffective] == 0) then //action obsolète
            call Text_erP(.owner.getPlayer(), "action obsolète")
        else
            //annulation de l'action
            if (not .lastActions[.lastActionEffective].cancel()) then
                call Text_erA("error : action already cancelled for player " + I2S(GetPlayerId(.owner.getPlayer())))
            endif
        endif
        set .lastActionEffective = .lastActionEffective - 1
        return true
    endmethod
    
    method redoLastAction takes nothing returns boolean
        if (.lastActionEffective == .lastActionId) then
            return false
        endif
        set .lastActionEffective = .lastActionEffective + 1
        if (.lastActions[.lastActionEffective] == 0) then //action obsolète
            call Text_erP(.owner.getPlayer(), "action obsolète")
        else
            //réexécution de l'action
            if (not .lastActions[.lastActionEffective].redo()) then
                call Text_erA("error : action already redone for player " + I2S(GetPlayerId(.owner.getPlayer())))
            endif
        endif
        return true
    endmethod
    
    method deleteSpecificActionsForLevel takes Level level returns nothing
        //actions spécifiques à un niveau :
            //MakeMonsterAction
            //MakeDeleteMonstersAction
            //MakeVisibilityModifierAction
            //MakeMeteorAction
            //MakeDeleteMeteorsAction
            //MakeCasterAction
            //MakeDeleteCastersAction
        //////
        local integer i = 0
        loop
            exitwhen (i > .lastActionId)
                if (.lastActions[i].getType() == MakeMonsterAction.typeid) then
                    if (MakeMonsterAction(integer(.lastActions[i])).getLevel() == level) then
                        call .lastActions[i].destroy()
                        set .lastActions[i] = 0
                    endif
                elseif (.lastActions[i].getType() == MakeDeleteMonstersAction.typeid) then
                    if (MakeDeleteMonstersAction(integer(.lastActions[i])).getLevel() == level) then
                        call .lastActions[i].destroy()
                        set .lastActions[i] = 0
                    endif
                elseif (.lastActions[i].getType() == MakeVisibilityModifierAction.typeid) then
                    if (MakeVisibilityModifierAction(integer(.lastActions[i])).getLevel() == level) then
                        call .lastActions[i].destroy()
                        set .lastActions[i] = 0
                    endif
                elseif (.lastActions[i].getType() == MakeMeteorAction.typeid) then
                    if (MakeMeteorAction(integer(.lastActions[i])).getLevel() == level) then
                        call .lastActions[i].destroy()
                        set .lastActions[i] = 0
                    endif
                elseif (.lastActions[i].getType() == MakeDeleteMeteorsAction.typeid) then
                    if (MakeDeleteMeteorsAction(integer(.lastActions[i])).getLevel() == level) then
                        call .lastActions[i].destroy()
                        set .lastActions[i] = 0
                    endif
                elseif (.lastActions[i].getType() == MakeCasterAction.typeid) then
                    if (MakeCasterAction(integer(.lastActions[i])).getLevel() == level) then
                        call .lastActions[i].destroy()
                        set .lastActions[i] = 0
                    endif
                elseif (.lastActions[i].getType() == MakeDeleteCastersAction.typeid) then
                    if (MakeDeleteCastersAction(integer(.lastActions[i])).getLevel() == level) then
                        call .lastActions[i].destroy()
                        set .lastActions[i] = 0
                    endif
                endif
            set i = i + 1
        endloop
    endmethod
    
    method destroyCancelledActions takes nothing returns nothing
        if (.lastActionEffective == .lastActionId) then
            return
        endif
        loop
            exitwhen (.lastActionId <= .lastActionEffective)
                call .lastActions[.lastActionId].destroy()
            set .lastActionId = .lastActionId - 1
        endloop
    endmethod
    
    method destroyAllActions takes nothing returns nothing
        local integer i = 0
        loop
            exitwhen (i > .lastActionId)
                call .lastActions[i].destroy()
            set i = i + 1
        endloop
        set .lastActionId = -1
        set .lastActionEffective = -1
    endmethod
endstruct



endlibrary