export const DisableInterface = function(){
    BlzHideOriginFrames(true)
    BlzFrameSetVisible(BlzGetFrameByName("ConsoleUIBackdrop",0), false)
    BlzFrameSetVisible(BlzGetFrameByName("ConsoleUI", 0), false)
}

export const EnableInterface = function(){
    BlzHideOriginFrames(false)
    BlzFrameSetVisible(BlzGetFrameByName("ConsoleUIBackdrop",0), true)
    BlzFrameSetVisible(BlzGetFrameByName("ConsoleUI", 0), true)
}
