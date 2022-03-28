import { Text } from 'core/01_libraries/Text'
import { SaveLevels } from './Save_levels'

const initSaveCasterTypes = () => {
    const StartSaveCasterTypes = (): void => {
        udg_casterTypes.saveInCache()
        Text.A('caster types saved')
        SaveLevels.StartSaveLevels()
    }

    return { StartSaveCasterTypes }
}

export const SaveCasterTypes = initSaveCasterTypes()
