import * as React from 'w3ts-jsx/dist/src/index'
import { Interface, InterfaceProps } from './Interface'

export const renderInterface = (props: InterfaceProps) => {
    React.render(<Interface {...props} />, BlzGetOriginFrame(ORIGIN_FRAME_GAME_UI, 0))
}
