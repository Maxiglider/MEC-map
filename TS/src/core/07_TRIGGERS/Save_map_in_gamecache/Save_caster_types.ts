import { Text } from 'core/01_libraries/Text'

const initSaveCasterTypes = () => {
    const StartSaveCasterTypes = (): void => {
        udg_casterTypes.saveInCache()
        Text.A('caster types saved')
        StartSaveLevels()
    }

    return { StartSaveCasterTypes }
}

export const SaveCasterTypes = initSaveCasterTypes()
