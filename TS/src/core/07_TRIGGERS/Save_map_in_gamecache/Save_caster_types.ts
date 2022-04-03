import { Text } from 'core/01_libraries/Text'
import { udg_casterTypes } from '../../../../globals'
//import { SaveLevels } from './Save_levels'

const initSaveCasterTypes = () => {
    const StartSaveCasterTypes = () => {
        udg_casterTypes.saveInCache()
        Text.A('caster types saved')
        //SaveLevels.StartSaveLevels()
    }

    return { StartSaveCasterTypes }
}

export const SaveCasterTypes = initSaveCasterTypes()
