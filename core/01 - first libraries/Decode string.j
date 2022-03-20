//TESH.scrollpos=37
//TESH.alwaysfold=0
library DecodeString needs Text


private function DecodeChar takes string char returns string    
    //! textmacro DecodeChar takes in, out
    if (char == "$in$") then
        return "$out$"
    endif
    //! endtextmacro
    
    //! runtextmacro DecodeChar("A", "Z")
    //! runtextmacro DecodeChar("B", "A")
    //! runtextmacro DecodeChar("C", "B")
    //! runtextmacro DecodeChar("D", "C")
    //! runtextmacro DecodeChar("E", "D")
    //! runtextmacro DecodeChar("F", "E")
    //! runtextmacro DecodeChar("G", "F")
    //! runtextmacro DecodeChar("H", "G")
    //! runtextmacro DecodeChar("I", "H")
    //! runtextmacro DecodeChar("J", "I")
    //! runtextmacro DecodeChar("K", "J")
    //! runtextmacro DecodeChar("L", "K")
    //! runtextmacro DecodeChar("M", "L")
    //! runtextmacro DecodeChar("N", "M")
    //! runtextmacro DecodeChar("O", "N")
    //! runtextmacro DecodeChar("P", "O")
    //! runtextmacro DecodeChar("Q", "P")
    //! runtextmacro DecodeChar("R", "Q")
    //! runtextmacro DecodeChar("S", "R")
    //! runtextmacro DecodeChar("T", "S")
    //! runtextmacro DecodeChar("U", "T")
    //! runtextmacro DecodeChar("V", "U")
    //! runtextmacro DecodeChar("W", "V")
    //! runtextmacro DecodeChar("X", "W")
    //! runtextmacro DecodeChar("Y", "X")
    //! runtextmacro DecodeChar("Z", "Y")
    
    //! runtextmacro DecodeChar("a", "z")
    //! runtextmacro DecodeChar("b", "a")
    //! runtextmacro DecodeChar("c", "b")
    //! runtextmacro DecodeChar("d", "c")
    //! runtextmacro DecodeChar("e", "d")
    //! runtextmacro DecodeChar("f", "e")
    //! runtextmacro DecodeChar("g", "f")
    //! runtextmacro DecodeChar("h", "g")
    //! runtextmacro DecodeChar("i", "h")
    //! runtextmacro DecodeChar("j", "i")
    //! runtextmacro DecodeChar("k", "j")
    //! runtextmacro DecodeChar("l", "k")
    //! runtextmacro DecodeChar("m", "l")
    //! runtextmacro DecodeChar("n", "m")
    //! runtextmacro DecodeChar("o", "n")
    //! runtextmacro DecodeChar("p", "o")
    //! runtextmacro DecodeChar("q", "p")
    //! runtextmacro DecodeChar("r", "q")
    //! runtextmacro DecodeChar("s", "r")
    //! runtextmacro DecodeChar("t", "s")
    //! runtextmacro DecodeChar("u", "t")
    //! runtextmacro DecodeChar("v", "u")
    //! runtextmacro DecodeChar("w", "v")
    //! runtextmacro DecodeChar("x", "w")
    //! runtextmacro DecodeChar("y", "x")
    //! runtextmacro DecodeChar("z", "y")
    
    return char
endfunction


function DecodeString takes string strIn returns string
    local string strOut = ""
    local integer i = 1
    loop
        exitwhen (i > StringLength(strIn))
            set strOut = strOut + DecodeChar(SubStringBJ(strIn, i, i))
        set i = i + 1
    endloop
    //call Text_A("strIn : " + strIn + ", strOut : " + strOut)
    return strOut
endfunction




endlibrary