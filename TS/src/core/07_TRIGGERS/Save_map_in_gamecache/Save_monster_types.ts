import { Text } from 'core/01_libraries/Text'
import { udg_monsterTypes } from '../../../../globals'
import { SaveCasterTypes } from './Save_caster_types'

const initSaveMonsterTypes = () => {
    const StartSaveMonsterTypes = () => {
        udg_monsterTypes.saveInCache()
        Text.A('monster types saved')
        SaveCasterTypes.StartSaveCasterTypes()
    }

    return { StartSaveMonsterTypes }
}

export const SaveMonsterTypes = initSaveMonsterTypes()
