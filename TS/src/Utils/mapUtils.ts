import { Timer } from 'w3ts'

export const createEvent = ({
    events,
    conditions,
    actions,
}: {
    events: ((t: trigger) => void)[]
    conditions?: ((this: void) => boolean)[]
    actions: ((this: void) => void)[]
}) => {
    const t = CreateTrigger()

    events.forEach(event => event(t))

    if (conditions) {
        conditions.forEach(condition => TriggerAddCondition(t, Condition(condition)))
    }

    actions.forEach(action => TriggerAddAction(t, errorHandler(action)))

    return t
}

export const forRange = (j: number, cb: (i: number) => void) => {
    for (let i = 0; i < j; i++) {
        cb(i)
    }
}

export const createTimer = (timeout: number, periodic: boolean, handlerFunc: () => void) => {
    return new Timer().start(timeout, periodic, errorHandler(handlerFunc))
}

export const errorHandler = (cb: () => void, errorCb?: (e: any) => void) => {
    return () => {
        try {
            cb()
        } catch (e) {
            print(`Error caught: ${e}`)
            errorCb && errorCb(e)
        }
    }
}
