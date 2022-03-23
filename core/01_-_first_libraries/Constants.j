//TESH.scrollpos=24
//TESH.alwaysfold=0
globals
    real MAP_MIN_X
    real MAP_MAX_X
    real MAP_MIN_Y
    real MAP_MAX_Y

	constant integer INVIS_UNIT_TYPE_ID = 'Einv' 
    constant integer HERO_TYPE_ID = 'E000'
    constant integer HERO_SECONDARY_TYPE_ID = 'D001'

	constant integer HERO_WALK_SPEED = 522
    
    constant real MAX_MOVE_SPEED = 522
    
    
    constant integer DEFAULT_MONSTER_SPEED = 400
    
	constant real HERO_SLIDE_SPEED = 550
	constant real SLIDE_PERIOD = 0.008 //120 FPS
	constant real CHECK_TERRAIN_PERIOD = 0.02
    constant real LOW_PERIOD_FOR_WORK = 0.005
    
    
    constant integer CRITICAL_LIVES_LIMIT = 2 //s'il y a au plus ce nombre de vies, on affiche les vies en rouge
    
    constant integer DEFAULT_CAMERA_FIELD = 2500
    
    
    constant integer LIMIT_NB_HERO_EFFECTS = 20
    
    
    constant integer PATROL_DISTANCE_MIN = 100
    
    
    constant integer MAX_NB_MONSTERS_BY_LEVEL = 1000
    
    
    constant real LARGEUR_CASE = 128
    
    
    constant real TERRAIN_DEATH_TIME_TO_KILL = 2
    
    
	constant player ENNEMY_PLAYER = Player(PLAYER_NEUTRAL_AGGRESSIVE)
	constant player NEUTRAL_PLAYER = Player(PLAYER_NEUTRAL_PASSIVE)
    
    
    constant player PLAYER_INVIS_UNIT = Player(12)
    
    
    constant string GM_TOUCH_DEATH_TERRAIN_EFFECT_STR = "Abilities\\Spells\\NightElf\\Blink\\BlinkCaster.mdl"
    constant string GM_KILLING_EFFECT = "Abilities\\Spells\\NightElf\\Blink\\BlinkCaster.mdl"
    constant string TERRAIN_KILL_EFFECT_BODY_PART = "origin"
    
    constant integer NB_MAX_OF_TERRAINS = 16
    constant real TERRAIN_DATA_DISPLAY_TIME = 15
    constant integer NB_MAX_TERRAIN_DATA_DISPLAY = 16
    constant integer NB_MAX_TILES_MODIFIED = 1000
    
    constant integer NB_LIVES_AT_BEGINNING = 5
    
    constant integer RED = 0
    constant integer BLUE = 1
    constant integer TEAL = 2
    constant integer PURPLE = 3
    constant integer YELLOW = 4
    constant integer ORANGE = 5
    constant integer GREEN = 6
    constant integer PINK = 7
    constant integer GREY = 8
    constant integer LIGHTBLUE = 9
    constant integer DARKGREEN = 10
    constant integer BROWN = 11
    
    constant boolean MOBS_VARIOUS_COLORS = false
    
    //coop
    constant integer POWER_CIRCLE = 'pcir'   
    constant integer DUMMY_POWER_CIRCLE = 'dcir'
    constant real COOP_REVIVE_DIST = 60.
    
    constant real SON_LAST_HOPE_INTERVALLE_MIN = 10.


    constant boolean CAN_TURN_IN_AIR = false

	constant integer NB_PLAYERS_MAX = 12 //number of players max of MEC
	constant integer NB_PLAYERS_MAX_REFORGED = 24 //number of players max of Reforged in general
    constant integer NB_ESCAPERS = 24
endglobals