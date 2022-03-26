import { Text } from 'core/01_libraries/Text'

const initSaveMonsterTypes = () => {
    // needs Text, SaveCasterTypes

    const StartSaveMonsterTypes = (): void => {
        udg_monsterTypes.saveInCache()
        Text.A('monster types saved')
        StartSaveCasterTypes()
    }
}

export const SaveMonsterTypes = initSaveMonsterTypes()
