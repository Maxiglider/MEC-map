//TESH.scrollpos=12
//TESH.alwaysfold=0
library StringArrayForCache needs Text


globals    
    constant string CACHE_SEPARATEUR_ITEM = "("
    constant string CACHE_SEPARATEUR_PARAM = ","
    
    private constant integer MAX_STRING_LENGTH = 200
    StringArrayForCache stringArrayForCache = 0
endglobals


struct StringArrayForCache [8000]
    private string array stringArray [8000]
    private integer lastStringId
    private string category
    private string variableName
    private boolean avecSeparateur
    
    static method create takes string category, string variableName, boolean avecSeparateur returns StringArrayForCache
        local StringArrayForCache sa
        if (stringArrayForCache != 0) then
            call stringArrayForCache.destroy()
        endif
        set sa = StringArrayForCache.allocate()
        set sa.lastStringId = -1
        set sa.category = category
        set sa.variableName = variableName
        set sa.avecSeparateur = avecSeparateur
        return sa
    endmethod
    
    private method nextString takes nothing returns nothing
        set .lastStringId = .lastStringId + 1
        set .stringArray[.lastStringId] = ""
    endmethod
    
    method push takes string str returns nothing
        local integer length
        local integer nbCharsDispoForCurrentString
        if (.lastStringId == -1) then
            call .nextString()
        else
            if (StringLength(.stringArray[.lastStringId]) == MAX_STRING_LENGTH) then
                call .nextString()
            endif
            if (.avecSeparateur) then
                set .stringArray[.lastStringId] = .stringArray[.lastStringId] + CACHE_SEPARATEUR_ITEM
            endif
        endif
        set nbCharsDispoForCurrentString = MAX_STRING_LENGTH - StringLength(.stringArray[.lastStringId])
        set length = StringLength(str)
        loop
            exitwhen (length == 0)
                if (length > nbCharsDispoForCurrentString) then
                    set .stringArray[.lastStringId] = .stringArray[.lastStringId] + SubStringBJ(str, 1, nbCharsDispoForCurrentString)
                    call .nextString()
                    set str = SubStringBJ(str, nbCharsDispoForCurrentString + 1, length)
                else
                    set .stringArray[.lastStringId] = .stringArray[.lastStringId] + str
                    set str = ""
                endif
                set nbCharsDispoForCurrentString = MAX_STRING_LENGTH - StringLength(.stringArray[.lastStringId])
            set length = StringLength(str)
        endloop
    endmethod
    
    method writeInCache takes nothing returns nothing
        local integer i
        if (.lastStringId > 0) then
            set i = 0
            loop
                exitwhen (i > .lastStringId)
                    call StoreString(saveMap_cache, .category, .variableName + I2S(i), .stringArray[i])
                    //call Text_A(I2S(i) + " : " + .stringArray[i])
                    //call Text_A("longueur chaîne : " + I2S(StringLength(.stringArray[i])))
                set i = i + 1
            endloop
        else
            if (.lastStringId == 0) then
                call StoreString(saveMap_cache, .category, .variableName, .stringArray[0])
                call Text_A(.stringArray[0])
                call Text_A("longueur chaîne : " + I2S(StringLength(.stringArray[0])))
            endif
        endif
        call Text_A(.category + ", " + .variableName + " : finish write in cache")
    endmethod
endstruct



endlibrary