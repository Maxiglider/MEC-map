//TESH.scrollpos=6
//TESH.alwaysfold=0
function Trig_adding_quests_Actions takes nothing returns nothing

//GAUCHE

    //Commands1
    call CreateQuestBJ( bj_QUESTTYPE_REQ_DISCOVERED, "Commands 1", Commands1, "ReplaceableTextures\\CommandButtons\\BTNEnt.blp" )
    call CreateQuestItemBJ( GetLastCreatedQuestBJ(), Commands1Requirement1 )
    call CreateQuestItemBJ( GetLastCreatedQuestBJ(), Commands1Requirement2 )
    call CreateQuestItemBJ( GetLastCreatedQuestBJ(), Commands1Requirement3 )

    //Commands2
    call CreateQuestBJ( bj_QUESTTYPE_REQ_DISCOVERED, "Commands 2", Commands2, "ReplaceableTextures\\CommandButtons\\BTNEnt.blp" )
    call CreateQuestItemBJ( GetLastCreatedQuestBJ(), Commands2Requirement1 )
    call CreateQuestItemBJ( GetLastCreatedQuestBJ(), Commands2Requirement2 )
    call CreateQuestItemBJ( GetLastCreatedQuestBJ(), Commands2Requirement3 )
    
    // Colors
    call CreateQuestBJ( bj_QUESTTYPE_REQ_DISCOVERED, "Colors", Colors, "ReplaceableTextures\\CommandButtons\\BTNAmbush.blp" )
    call CreateQuestItemBJ( GetLastCreatedQuestBJ(), ColorsRequirement1 )
    call CreateQuestItemBJ( GetLastCreatedQuestBJ(), ColorsRequirement2 )
    call CreateQuestItemBJ( GetLastCreatedQuestBJ(), ColorsRequirement3 )
    
    // Effects
    call CreateQuestBJ( bj_QUESTTYPE_REQ_DISCOVERED, "Effects", Effects, "ReplaceableTextures\\CommandButtons\\BTNDevotion.blp" )
    call CreateQuestItemBJ( GetLastCreatedQuestBJ(), EffectsRequirement1 )
    call CreateQuestItemBJ( GetLastCreatedQuestBJ(), EffectsRequirement2 )
    call CreateQuestItemBJ( GetLastCreatedQuestBJ(), EffectsRequirement3 )

    // Red commands
    call CreateQuestBJ( bj_QUESTTYPE_REQ_DISCOVERED, "Red commands", RedCommands, "ReplaceableTextures\\CommandButtons\\BTNAncientOfLore.blp" )
    call CreateQuestItemBJ( GetLastCreatedQuestBJ(), RedCommandsRequirement1 )
    call CreateQuestItemBJ( GetLastCreatedQuestBJ(), RedCommandsRequirement2 )
    call CreateQuestItemBJ( GetLastCreatedQuestBJ(), RedCommandsRequirement3 )
    

    
    
//DROITE

    // Map description
    call CreateQuestBJ( bj_QUESTTYPE_OPT_DISCOVERED, "Map description", MapDescription, "ReplaceableTextures\\CommandButtons\\BTNCOP.blp" )
    call CreateQuestItemBJ( GetLastCreatedQuestBJ(), MapDescriptionRequirement1 )
    call CreateQuestItemBJ( GetLastCreatedQuestBJ(), MapDescriptionRequirement2 )
    
    // Contact
    call CreateQuestBJ( bj_QUESTTYPE_OPT_DISCOVERED, "Contact", Contact, "ReplaceableTextures\\CommandButtons\\BTNEvilIllidan.blp" )
    call CreateQuestItemBJ( GetLastCreatedQuestBJ(), ContactRequirement1 )
    call CreateQuestItemBJ( GetLastCreatedQuestBJ(), ContactRequirement2 )
    
    //Command shortcuts
    call CreateQuestBJ( bj_QUESTTYPE_OPT_DISCOVERED, "Command shortcuts", CommandShortcuts, "ReplaceableTextures\\CommandButtons\\BTNImmolationOff.blp" )
    call CreateQuestItemBJ( GetLastCreatedQuestBJ(), CommandShortcutsRequirement1 )
    call CreateQuestItemBJ( GetLastCreatedQuestBJ(), CommandShortcutsRequirement2 )
    
    
endfunction

//===========================================================================
function InitTrig_Adding_quests takes nothing returns nothing
    set gg_trg_Adding_quests = CreateTrigger(  )
    call TriggerAddAction( gg_trg_Adding_quests, function Trig_adding_quests_Actions )
endfunction
