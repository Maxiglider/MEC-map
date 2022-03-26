import { Text } from 'core/01_libraries/Text'
import { SaveCasterTypes } from './Save_caster_types'

const initSaveMonsterTypes = () => {
    const StartSaveMonsterTypes = (): void => {
        udg_monsterTypes.saveInCache()
        Text.A('monster types saved')
        SaveCasterTypes.StartSaveCasterTypes()
    }

    return { StartSaveMonsterTypes }
}

export const SaveMonsterTypes = initSaveMonsterTypes()
