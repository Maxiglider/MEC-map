import { ILives } from 'core/04_STRUCTURES/Lives_and_game_time/Lives_and_game_time'
import { IMultiboard } from 'core/04_STRUCTURES/Lives_and_game_time/Multiboard'
import { ICommandExecution } from './core/06_COMMANDS/COMMANDS_vJass/Command_execution'

const initServiceManager = <TServices extends { [K in string]: TServices[K] }>() => {
    const services: TServices = {} as any

    const registerServices = (servicesIn: {
        [K in keyof TServices]: () => TServices[K]
    }) => {
        for (const [serviceName, service] of pairs(servicesIn)) {
            services[serviceName] = service()
        }
    }

    const getService = <T extends keyof TServices>(serviceName: T) => {
        const targetService = services[serviceName]

        if (!targetService) {
            throw `Service: '${serviceName}' not found`
        }

        return targetService
    }

    return { registerServices, getService }
}

export const ServiceManager = initServiceManager<{
    Lives: ILives
    Multiboard: IMultiboard
    Cmd: ICommandExecution
}>()
