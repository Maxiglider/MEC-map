import { IItem } from 'App/Interface'
import * as React from 'w3ts-jsx/dist/src/index'

export const Item = ({
    v,
    absPosition,
    visible,
    onClick,
}: {
    v: IItem
    absPosition: [AbsPos, AbsPos]
    visible: boolean
    onClick?: () => void
}) => (
    <container visible={visible}>
        <backdrop texture={{ texFile: v.texFile }} absPosition={absPosition} />

        <text text={v.title} absPosition={absPosition} onClick={onClick} />
    </container>
)
