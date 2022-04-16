import {jsonDecode} from "../../01_libraries/Basic_functions";
import {Text} from "../../01_libraries/Text";
import {getUdgTerrainTypes} from "../../../../globals";


export class LoadMapFromCache {
    public static gameDataJsonString: string | null = null

    public static initializeGameData = () => {
        if(LoadMapFromCache.gameDataJsonString) {
            const gameData: any = jsonDecode(LoadMapFromCache.gameDataJsonString)

            if (!gameData || typeof gameData !== 'object') {
                Text.erA("invalid game data string")
            } else {

                //terrain types MEC
                if (gameData.terrainTypesMec) {
                    getUdgTerrainTypes().newFromJson(gameData.terrainTypesMec)
                }

                //monster types
                /*if(gameData.monsterTypes){
                    getUdgMonsterTypes().newFromJson(gameData.monsterTypes)
                }

                //caster types
                if(gameData.casterTypes){
                    getUdgCasterTypes().newFromJson(gameData.casterTypes)
                }

                //levels
                if(gameData.levels){
                    getUdgLevels().newFromJson(gameData.levels)
                }*/
            }
        }
    }
}