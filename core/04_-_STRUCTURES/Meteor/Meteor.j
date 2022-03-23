//TESH.scrollpos=0
//TESH.alwaysfold=0
library Meteor


globals
    constant integer METEOR_NORMAL = 'MND1'
    constant integer METEOR_CHEAT = 'MCD1'
endglobals



struct Meteor [5000] //100 météores * 50 niveaux
    private real x
    private real y
    private item meteor
    Level level
    integer arrayId
    
    method getItem takes nothing returns item
        return .meteor
    endmethod
    
    static method create takes real x, real y returns Meteor
        local Meteor m = Meteor.allocate()
        set m.x = x
        set m.y = y
        return m
    endmethod
    
    method removeMeteor takes nothing returns nothing
        if (.meteor != null) then
            call RemoveItem(.meteor)
            set .meteor = null
        endif
    endmethod
    
    method createMeteor takes nothing returns nothing
        if (.meteor != null) then
            call .removeMeteor()
        endif
        set .meteor = CreateItem(METEOR_NORMAL, .x, .y)
        if (udg_terrainTypes.getTerrainType(.x, .y).getKind() == "slide") then
            call SetItemDroppable(.meteor, false)
        endif
        call SetItemUserData(.meteor, integer(this))
    endmethod
    
    private method onDestroy takes nothing returns nothing
        if (.meteor != null) then
            call .removeMeteor()
            set .meteor = null
        endif
        call .level.meteors.setMeteorNull(.arrayId)
    endmethod
    
    method replace takes nothing returns nothing
        call SetItemPosition(.meteor, .x, .y)
    endmethod
    
    method toString takes nothing returns string
        return (I2S(R2I(.x)) + CACHE_SEPARATEUR_PARAM + I2S(R2I(.y)))
    endmethod
endstruct



endlibrary
