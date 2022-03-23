import { createEvent, forRange } from 'Utils/mapUtils'

export type ICommandHandler = ReturnType<typeof CommandHandler>

export const CommandHandler = ({ commandTrigger }: { commandTrigger: string }) => {
    const commands: { cmd: string; desc?: string }[] = []

    const registerCommand = ({
        cmd,
        alias,
        desc,
        cb,
        exactMatchOnly,
    }: {
        cmd: string
        alias?: string[]
        desc?: string
        cb: () => void
        exactMatchOnly: boolean
    }) => {
        commands.push({ cmd, desc })

        createEvent({
            events: [
                t => {
                    forRange(bj_MAX_PLAYER_SLOTS, i =>
                        TriggerRegisterPlayerChatEvent(t, Player(i), `${commandTrigger}${cmd}`, exactMatchOnly)
                    )

                    if (alias) {
                        alias.forEach(alias => {
                            forRange(bj_MAX_PLAYER_SLOTS, i =>
                                TriggerRegisterPlayerChatEvent(
                                    t,
                                    Player(i),
                                    `${commandTrigger}${alias}`,
                                    exactMatchOnly
                                )
                            )
                        })
                    }
                },
            ],
            conditions: [() => GetEventPlayerChatString().indexOf(commandTrigger) === 0],
            actions: [() => cb()],
        })
    }

    registerCommand({
        cmd: 'help',
        exactMatchOnly: true,
        cb: () => {
            let s = 'Commands:\n'

            commands.forEach(c => {
                s += c.cmd

                if (c.desc) {
                    s += ' - ' + c.desc
                }

                s += '\n'
            })

            print(s)
        },
    })

    return { registerCommand }
}
