import * as React from 'w3ts-jsx/dist/src/index'
import { Interface, InterfaceProps } from './Interface'

export const renderInterface = (props: InterfaceProps) => {
    BlzLoadTOCFile('war3mapImported\\TerrainPreview.toc')

    React.render(<Interface {...props} />, BlzGetFrameByName('ConsoleUIBackdrop', 0))
}
