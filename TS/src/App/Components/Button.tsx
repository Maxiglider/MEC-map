import * as React from 'w3ts-jsx/dist/src/index'

export const Button = ({
    onClick,
    absPosition,
    text,
}: {
    onClick?: () => void
    absPosition: [AbsPos, AbsPos]
    text: string
}) => <gluetextbutton inherits="ScriptDialogButton" text={text} absPosition={absPosition} onClick={onClick} />
