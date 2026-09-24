import { createEvent } from 'Utils/mapUtils'
import { getUdgTerrainSaves, udg_monsters } from '../../../../globals'
import { Natives } from '../../wc3_natives_unsecured/Natives'

/**
 * Fires the monsterDeath terrain save events of a monster whose unit dies, whatever killed it (a meteor, god mode,
 * a trigger of the map). A monster's id is its unit's user data; the unit is checked against the monster's own, so
 * a unit of a spawn or of the map, which carries some other user data, fires nothing.
 */
export const InitTrig_Terrain_save_monster_death = () => {
    createEvent({
        events: [t => TriggerRegisterAnyUnitEventBJ(t, EVENT_PLAYER_UNIT_DEATH)],
        actions: [
            () => {
                const u = Natives.UGetTriggerUnit()
                const monster = udg_monsters[GetUnitUserData(u)]
                if (!monster || monster.u !== u) {
                    return
                }

                for (const event of getUdgTerrainSaves().findMonsterEventsByMonsterId(
                    'monsterDeath',
                    monster.getId()
                )) {
                    event.fire()
                }
            },
        ],
    })
}
