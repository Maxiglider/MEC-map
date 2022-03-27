import { BasicFunctions } from 'core/01_libraries/Basic_functions'
import { METEOR_CHEAT, METEOR_NORMAL } from './Meteor'

const initMeteorFunctions = () => {
    let meteor: item

    const HeroAddCheatMeteor = (hero: unit): item => {
        meteor = UnitAddItemById(hero, METEOR_CHEAT)
        if (udg_terrainTypes.getTerrainType(GetUnitX(hero), GetUnitY(hero)).getKind() == 'slide') {
            SetItemDroppable(meteor, false)
        }
        return meteor
    }

    const HeroComingToSlide_CheckItem = (hero: unit): void => {
        meteor = UnitItemInSlot(hero, 0)
        if (meteor !== null) {
            SetItemDroppable(meteor, false)
        }
    }

    const HeroComingOutFromSlide_CheckItem = (hero: unit): void => {
        meteor = UnitItemInSlot(hero, 0)
        if (meteor !== null) {
            SetItemDroppable(meteor, true)
        }
    }

    const ExecuteRightClicOnUnit = (hero: unit, u: unit): void => {
        let itemCarried = UnitItemInSlot(hero, 0)
        let itemCarriedType = GetItemTypeId(itemCarried)
        if ((itemCarriedType == METEOR_NORMAL || itemCarriedType == METEOR_CHEAT) && GetWidgetLife(u) > 0) {
            UnitUseItemTarget(hero, itemCarried, u)
        } else {
            BasicFunctions.StopUnit(hero)
        }
        itemCarried = null
    }

    return { HeroAddCheatMeteor, HeroComingToSlide_CheckItem, HeroComingOutFromSlide_CheckItem, ExecuteRightClicOnUnit }
}

export const MeteorFunctions = initMeteorFunctions()
