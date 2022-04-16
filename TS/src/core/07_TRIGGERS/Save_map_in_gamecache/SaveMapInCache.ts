import {
    getUdgCasterTypes,
    getUdgEscapers,
    getUdgLevels,
    getUdgMonsterTypes,
    getUdgTerrainTypes
} from "../../../../globals";
import {Text} from "../../01_libraries/Text";
import {PushTerrainDataIntoJson} from "./Save_terrain";

export class SaveMapInCache {

    private static gameAsJson = () => {
        const json: {[x: string]: any} = {}

        //terrain config
        Object.assign(json, getUdgTerrainTypes().toJson())
        Text.A('terrain configuration saved')

        //terrain types, order, height
        PushTerrainDataIntoJson(json)

        //monster types
        json.monsterTypes = getUdgMonsterTypes().toJson()
        Text.A('monster types saved')

        //caster types
        json.casterTypes = getUdgCasterTypes().toJson()
        Text.A('caster types saved')

        //destroy makes and saved actions to avoid deleted monsters to recreate
        getUdgEscapers().forMainEscapers(escaper => {
            escaper.destroyMake()
            escaper.destroyAllSavedActions()
        })

        //save levels
        json.levels = getUdgLevels().toJson()
    }

    public static smic = () => {

    }
}
