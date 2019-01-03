//TESH.scrollpos=52
//TESH.alwaysfold=0
library Lives needs BasicFunctions


globals
    private player LIVES_PLAYER = Player(6) //GREEN
endglobals


struct Lives
	private integer nb
    private leaderboard lb
    
	
//leaderboard methods
    method display takes boolean show returns nothing
        call LeaderboardDisplay(.lb, show)
    endmethod
    
    method refresh takes nothing returns nothing
		call LeaderboardSetPlayerItemValueBJ(LIVES_PLAYER, .lb, .nb)
	endmethod
    
    method getLeaderboard takes nothing returns leaderboard
        return .lb
    endmethod
	

//creation methods
	static method create takes nothing returns Lives
        local Lives l = Lives.allocate()
        if (udg_levels.get(0) != 0) then
            set l.nb = udg_levels.get(0).getNbLives()
        else
            set l.nb = NB_LIVES_AT_BEGINNING
        endif
        set l.lb = CreateLeaderboardBJ(GetPlayersAll(), "")
        call LeaderboardAddItemBJ(Player(0), l.lb, "Game time", 0)
        call LeaderboardSetPlayerItemStyleBJ(Player(0), l.lb, true, false, false )
        call LeaderboardAddItemBJ(LIVES_PLAYER, l.lb, "Lives :", l.nb)
        call l.display(true)
        return l
    endmethod
    
    
	private method onDestroy takes nothing returns nothing
		call DestroyLeaderboard(.lb)
		set .lb = null
	endmethod

	
//lives methods
    method get takes nothing returns integer
        return .nb
    endmethod
	
	method setNb takes integer nbLives returns boolean
        local string wordLives
		if (nbLives < 0) then
			return false
		endif
		set .nb = nbLives
		call .refresh()
		if (nbLives > 1) then
            set wordLives = " lives."
        else
            set wordLives = " life."
        endif
		call Text_A(udg_colorCode[GetPlayerId(LIVES_PLAYER)] + "You have now " + I2S(nbLives) + wordLives)
        return true
	endmethod
    
    method add takes integer n returns nothing
        local string wordLives
        if (n > 1) then
            set wordLives = " lives !"
        else
            set wordLives = " life."
        endif
        set .nb = .nb + n
        call Text_A(udg_colorCode[1] + "You have earned " + I2S(n) + wordLives)
        call .refresh()
    endmethod
    
    method loseALife takes nothing returns nothing
        set .nb = .nb - 1
        if (.nb >= 0) then
            call .refresh()
        endif
    endmethod
endstruct




endlibrary



