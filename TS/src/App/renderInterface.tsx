import * as React from 'w3ts-jsx/dist/src/index'
import { Interface, InterfaceProps } from './Interface'

export const renderInterface = (props: InterfaceProps) => {
    BlzLoadTOCFile('war3mapImported\\TerrainPreview_1x1.toc')
    BlzLoadTOCFile('war3mapImported\\TerrainPreview_2x1.toc')

    React.render(<Interface {...props} />, BlzGetFrameByName('ConsoleUIBackdrop', 0))
}
