export const DisableInterface = function(showMinimap: boolean = true){
    if(showMinimap){
        BlzHideOriginFrames(false)
        BlzFrameSetVisible(BlzGetOriginFrame(ORIGIN_FRAME_PORTRAIT, 0), false)
    }else{
        BlzHideOriginFrames(true)
    }

    BlzFrameSetVisible(BlzGetFrameByName("ConsoleUIBackdrop",0), false)
    BlzFrameSetVisible(BlzGetFrameByName("ConsoleUI", 0), false)
}

export const EnableInterface = function(){
    BlzHideOriginFrames(false)
    BlzFrameSetVisible(BlzGetFrameByName("ConsoleUIBackdrop",0), true)
    BlzFrameSetVisible(BlzGetFrameByName("ConsoleUI", 0), true)
    BlzFrameSetVisible(BlzGetOriginFrame(ORIGIN_FRAME_PORTRAIT, 0), true)
}
