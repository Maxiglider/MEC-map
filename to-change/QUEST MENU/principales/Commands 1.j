//TESH.scrollpos=0
//TESH.alwaysfold=0
globals

    constant string Commands1 = "-cameraField(cf) x
changes the camera field (height), default is 2500

-resetCamera(rc)
puts the camera back like chosen field

-resetCameraInit(rci)
changes the camera field back to its default value (2500)

-animation(an) <string>
makes your hero doing an animation. ex : -an attack

-mapNbMonsters(mnbm) [moving(m)|all(a)|notMoving(nm)]
displays the number of monsters in the map, of the chosen kind. \"Moving\" is the default kind. ex : -mnbm nm

-levelNbMonsters(lnbm) [moving(m)|all(a)|notMoving(nm)]
displays the number of monsters in the current level, of the chosen kind

-disco(d) [off|1~30]
chooses the number of color changes in ten seconds, or stop color changing (without parameter : once a second)

-clearText(clr)
removes the text on the screen

-getCurrentLevel(getcl)
displays the number of the current level (first one is number 0)

-leaderboard(ldb) on|off
displays or hides the lives leaderboard"


//===========================================================================
    constant string Commands1Requirement1 = "Here is the first part of various commands you can use in game"
    constant string Commands1Requirement2 = ""
    constant string Commands1Requirement3 = "cf, rc, rci, an, mnbm, lnbm, kl, kc, d, clr, getcl"

endglobals

