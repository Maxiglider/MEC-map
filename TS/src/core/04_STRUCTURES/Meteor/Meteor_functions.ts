import { udg_terrainTypes } from '../../../../globals'
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

    const HeroComingToSlide_CheckItem = (hero: unit) => {
        meteor = UnitItemInSlot(hero, 0)
        if (meteor !== null) {
            SetItemDroppable(meteor, false)
        }
    }

    const HeroComingOutFromSlide_CheckItem = (hero: unit) => {
        meteor = UnitItemInSlot(hero, 0)
        if (meteor !== null) {
            SetItemDroppable(meteor, true)
        }
    }

    const ExecuteRightClicOnUnit = (hero: unit, u: unit) => {
        let itemCarried = UnitItemInSlot(hero, 0)
        let itemCarriedType = GetItemTypeId(itemCarried)
        if ((itemCarriedType == METEOR_NORMAL || itemCarriedType == METEOR_CHEAT) && GetWidgetLife(u) > 0) {
            UnitUseItemTarget(hero, itemCarried, u)
        } else {
            StopUnit(hero)
        }
        ;(itemCarried as any) = null
    }

    return { HeroAddCheatMeteor, HeroComingToSlide_CheckItem, HeroComingOutFromSlide_CheckItem, ExecuteRightClicOnUnit }
}

export const MeteorFunctions = initMeteorFunctions()
