import { Text } from 'core/01_libraries/Text'
import { getUdgCasterTypes } from '../../../../globals'

//import { SaveLevels } from './Save_levels'

const initSaveCasterTypes = () => {
    const StartSaveCasterTypes = () => {
        getUdgCasterTypes().saveInCache()
        Text.A('caster types saved')
        //SaveLevels.StartSaveLevels()
    }

    return { StartSaveCasterTypes }
}

export const SaveCasterTypes = initSaveCasterTypes()
