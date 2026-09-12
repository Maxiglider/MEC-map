/**
 * Why a hero died, for -desyncProbe: written where the death is decided, and handed over when the
 * hero dies for real. The death of a hero sliding as an effect is decided by its own machine, the
 * only one knowing why: the others only hear where it died, and say so.
 *
 * Nothing here belongs to the game. It is text for a log, which may differ from one machine to
 * another, and os.clock, which is the clock of this machine, only tells how long ago the cause was
 * written.
 */
type DeathCause = { text: string; time: number }

const causes: { [escaperId: number]: DeathCause | undefined } = {}

type HeroDeathListener = (escaperId: number, x: number, y: number, cause: string) => void

let heroDeathListener: HeroDeathListener | undefined

/** What is about to kill that hero, replacing whatever was written before */
export const setDeathCause = (escaperId: number, text: string) => {
    causes[escaperId] = { text, time: os.clock() }
}

/** What is about to kill that hero, unless something more precise was already written */
export const setDeathCauseIfUnknown = (escaperId: number, text: string) => {
    if (causes[escaperId] === undefined) {
        setDeathCause(escaperId, text)
    }
}

/** Where the death was decided, as a stack trace, unless its cause was already written */
export const setDeathOriginIfUnknown = (escaperId: number, origin: string) => {
    if (causes[escaperId] === undefined) {
        setDeathCause(escaperId, `${origin}: ${info().GetStackTrace()}`)
    }
}

/** What was about to kill that hero did not, after all */
export const clearDeathCause = (escaperId: number) => {
    delete causes[escaperId]
}

/** Called once the hero is dead: hands its cause over to whoever listens, and forgets it */
export const reportHeroDeath = (escaperId: number, x: number, y: number) => {
    const cause = causes[escaperId]

    delete causes[escaperId]

    heroDeathListener?.(
        escaperId,
        x,
        y,
        cause === undefined
            ? 'unknown (killed without going through MEC)'
            : string.format('%s (written %.2fs before)', cause.text, os.clock() - cause.time)
    )
}

export const setHeroDeathListener = (listener: HeroDeathListener | undefined) => {
    heroDeathListener = listener
}
