//TESH.scrollpos=46
//TESH.alwaysfold=0
library Ascii

    globals
        private constant string TABLE_ASCII = " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~"
        private constant integer DEBUT_TABLE_ASCII = 32
        private constant integer TAILLE_TABLE_ASCII = StringLength(TABLE_ASCII)
    endglobals
   
    //Permet de convertir un caractère en son nombre Ascii correspondant.
    //@caractere string : Caractère a convertir. Ne doit contenir qu'un seul caractère !
    //@return integer : Code Ascii de caractere.
    //                  Ou -1, si caractere n'est pas conforme.
    private function CaractereVersAscii takes string caractere returns integer
        //Le caractère est recherché dans TABLE_ASCII, et son rang est renvoyé.
       
        local integer curseurSurTableAscii = 0
   
        loop
            exitwhen (curseurSurTableAscii >= TAILLE_TABLE_ASCII) or (SubString(TABLE_ASCII, curseurSurTableAscii, curseurSurTableAscii + 1) == caractere)
            set curseurSurTableAscii = curseurSurTableAscii + 1
        endloop
   
        if (curseurSurTableAscii < TAILLE_TABLE_ASCII) then
            return curseurSurTableAscii + DEBUT_TABLE_ASCII
        endif
       
        //Caractère non reconnue.
        return -1
    endfunction

    //Permet de convertir un code Ascii en son caractère correspondant.
    //@integer source : Code Ascii a convertir. Doit être entre 32 et 126.
    //@return string : Caractère correspondant au code Ascii de source.
    //                 Ou chaine vide, en cas d'erreur.
    private function AsciiVersCaractere takes integer source returns string
        //Le caractère de TABLE_ASCII correspondant au rang est renvoyé.
        if (source >= DEBUT_TABLE_ASCII) and (source <= (StringLength(TABLE_ASCII) - 1 + DEBUT_TABLE_ASCII)) then
            return SubString(TABLE_ASCII, source - DEBUT_TABLE_ASCII, source - (DEBUT_TABLE_ASCII - 1))
        endif
        //Code Ascii non reconnu.
        return ""
    endfunction
   
    function String2Ascii takes string source returns integer
        //La chaine est parcouru de gauche à droite et convertis en même temps.
        //En cas d'erreur, -1 est renvoyé.
   
        local integer resultat = 0
        local integer resultatIntermediaire = 0
        local integer curseurSurSource = 0
        local integer sourceTaille = StringLength(source)
   
        loop
            exitwhen (curseurSurSource >= sourceTaille) or (resultatIntermediaire == -1)
            set resultatIntermediaire = CaractereVersAscii(SubString(source, curseurSurSource, curseurSurSource + 1))
            set resultat = resultat*256 + resultatIntermediaire
            set curseurSurSource = curseurSurSource + 1
        endloop
       
        if (resultatIntermediaire != -1) then
            return resultat
        endif
       
        //Un caractère n'a pas été reconnue dans source.
        return -1
    endfunction
   
    function Ascii2String takes integer source returns string
        //source est divisé successivement par 256 et le reste est utilisé pour retrouver le caractère correspondant.
        //Le résultat est construit en même temps.
        //En cas d'erreur, "" est retourné.
       
        local string resultat = ""
        local string resultatIntermediaire = " "    //Pour éviter une initialisation à "".
        local integer modulo = 1                    //Pour éviter une initialisation à 0.
       
        loop
            exitwhen (resultatIntermediaire == "") or (modulo <= 0)
            set modulo = source - (source/256) * 256
            set resultatIntermediaire = AsciiVersCaractere(modulo)
            set resultat = resultatIntermediaire + resultat
            set source = source/256
        endloop
       
        if (modulo == 0) then
            return resultat
        endif
       
        //Le code n'a pas été reconnue.
        return ""
    endfunction

endlibrary