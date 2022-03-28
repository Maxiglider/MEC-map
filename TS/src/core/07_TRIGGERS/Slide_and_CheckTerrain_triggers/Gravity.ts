import { SLIDE_PERIOD } from 'core/01_libraries/Constants'

const initGravity = () => {
    let gravity = -45 * SLIDE_PERIOD

    const SetGravity = (newGravity: number) => {
        gravity = newGravity * SLIDE_PERIOD
    }

    const GetGravity = (): number => {
        return gravity
    }

    const GetRealGravity = (): number => {
        return gravity / SLIDE_PERIOD
    }

    return { SetGravity, GetGravity, GetRealGravity }
}

export const Gravity = initGravity()
