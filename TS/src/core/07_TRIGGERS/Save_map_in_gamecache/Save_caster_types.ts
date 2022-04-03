import { Text } from 'core/01_libraries/Text'
import { getUdgCasterTypes } from '../../../../globals'
const udg_casterTypes = getUdgCasterTypes()
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
