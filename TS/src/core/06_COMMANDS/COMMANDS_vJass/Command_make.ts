import { String2Ascii } from 'core/01_libraries/Ascii'
import { IsBoolString, S2B, StringContainsChar, tileset2tilesetString } from 'core/01_libraries/Basic_functions'
import {
    DEFAULT_MONSTER_SPEED,
    HERO_SLIDE_SPEED,
    HERO_WALK_SPEED,
    MAX_MOVE_SPEED,
    RED,
    TERRAIN_DEATH_TIME_TO_KILL,
} from 'core/01_libraries/Constants'
import { udg_colorCode } from 'core/01_libraries/Init_colorCodes'
import { Text } from 'core/01_libraries/Text'
import { Escaper } from 'core/04_STRUCTURES/Escaper/Escaper'
import { Level } from 'core/04_STRUCTURES/Level/Level'
import { PORTAL_MOB_MAX_FREEZE_DURATION } from 'core/04_STRUCTURES/Monster_properties/PortalMob'
import { TerrainType } from 'core/04_STRUCTURES/TerrainType/TerrainType'
import { DEATH_TERRAIN_MAX_TOLERANCE, TerrainTypeDeath } from 'core/04_STRUCTURES/TerrainType/TerrainTypeDeath'
import { TerrainTypeSlide } from 'core/04_STRUCTURES/TerrainType/TerrainTypeSlide'
import { TerrainTypeWalk } from 'core/04_STRUCTURES/TerrainType/TerrainTypeWalk'
import { ExchangeTerrains } from 'core/07_TRIGGERS/Triggers_to_modify_terrains/Exchange_terrains'
import { RandomizeTerrains } from 'core/07_TRIGGERS/Triggers_to_modify_terrains/Randomize_terrains'
import { getUdgCasterTypes, getUdgLevels, getUdgMonsterTypes, getUdgTerrainTypes } from '../../../../globals'
import { IsInteger, IsPositiveInteger } from '../../01_libraries/Functions_on_numbers'
import {
    DEFAULT_CASTER_ANIMATION,
    DEFAULT_CASTER_LOAD_TIME,
    DEFAULT_CASTER_PROJECTILE_SPEED,
    DEFAULT_CASTER_RANGE,
    MIN_CASTER_LOAD_TIME,
    MIN_CASTER_PROJECTILE_SPEED,
} from '../../04_STRUCTURES/Caster/CasterType'
import { MONSTER_TELEPORT_PERIOD_MAX, MONSTER_TELEPORT_PERIOD_MIN } from '../../04_STRUCTURES/Monster/MonsterTeleport'
import { CLEAR_MOB_MAX_DURATION, FRONT_MONTANT_DURATION } from '../../04_STRUCTURES/Monster_properties/ClearMob'
import { MakeMonsterSimplePatrol } from '../../05_MAKE_STRUCTURES/Make_create_monsters/MakeMonsterSimplePatrol'
import { TerrainTypeFromString } from '../../07_TRIGGERS/Modify_terrain_Functions/Terrain_type_from_string'
import {
    CACHE_SEPARATEUR_ITEM,
    CACHE_SEPARATEUR_PARAM,
} from '../../07_TRIGGERS/Save_map_in_gamecache/struct_StringArrayForCache'
import { ChangeAllTerrains } from '../../07_TRIGGERS/Triggers_to_modify_terrains/Change_all_terrains'
import { ChangeOneTerrain } from '../../07_TRIGGERS/Triggers_to_modify_terrains/Change_one_terrain'
import { CmdName, CmdParam, NbParam, NoParam } from './Command_functions'

export const ExecuteCommandMake = (escaper: Escaper, cmd: string): boolean => {
    let name = CmdName(cmd)
    let noParam = NoParam(cmd)
    let nbParam = NbParam(cmd)

    let n: number

    let b: boolean

    let str: string | null = ''

    let x: number
    let y: number

    let param1 = CmdParam(cmd, 1)
    let param2 = CmdParam(cmd, 2)
    let param3 = CmdParam(cmd, 3)
    let param4 = CmdParam(cmd, 4)

    let speed: number
    let terrainType: TerrainType | null
    let level: Level | null

    //-newWalk(neww) <label> <terrainType> [<walkSpeed>]   --> add a new kind of walk terrain
    if (name === 'newWalk' || name === 'neww') {
        if (nbParam < 2 || nbParam > 3) {
            return true
        }
        if (nbParam === 3) {
            if (!IsPositiveInteger(param3) || S2R(param3) > 522) {
                Text.erP(escaper.getPlayer(), 'wrong speed value, should be a real between 0 and 522')
                return true
            }
            speed = S2R(param3)
        } else {
            speed = HERO_WALK_SPEED
        }
        if (
            StringContainsChar(param1, CACHE_SEPARATEUR_ITEM) ||
            StringContainsChar(param1, CACHE_SEPARATEUR_PARAM) ||
            StringContainsChar(param1, '"')
        ) {
            Text.erP(
                escaper.getPlayer(),
                'characters ", ' + CACHE_SEPARATEUR_ITEM + ' and ' + CACHE_SEPARATEUR_PARAM + ' not allowed'
            )
            return true
        }

        getUdgTerrainTypes().newWalk(param1, TerrainTypeFromString.TerrainTypeString2TerrainTypeId(param2), speed)

        Text.mkP(escaper.getPlayer(), 'New terrain type "' + param1 + '" added')

        return true
    }

    //-newDeath(newd) <label> <terrainType> [<killingEffect> [<terrainTimeToKill>]]   --> add a new kind of death terrain
    if (name === 'newDeath' || name === 'newd') {
        if (nbParam < 2 || nbParam > 4) {
            return true
        }
        if (nbParam >= 3) {
            str = param3
            if (
                StringContainsChar(param3, CACHE_SEPARATEUR_ITEM) ||
                StringContainsChar(param3, CACHE_SEPARATEUR_PARAM) ||
                StringContainsChar(param3, '"')
            ) {
                Text.erP(
                    escaper.getPlayer(),
                    'characters ", ' + CACHE_SEPARATEUR_ITEM + ' and ' + CACHE_SEPARATEUR_PARAM + ' not allowed'
                )
                return true
            }
        } else {
            str = ''
        }
        if (nbParam === 4) {
            if (param4 !== '0' && S2R(param4) === 0) {
                return true
            }
            x = S2R(param4)
        } else {
            x = TERRAIN_DEATH_TIME_TO_KILL
        }
        if (
            StringContainsChar(param1, CACHE_SEPARATEUR_ITEM) ||
            StringContainsChar(param1, CACHE_SEPARATEUR_PARAM) ||
            StringContainsChar(param1, '"')
        ) {
            Text.erP(
                escaper.getPlayer(),
                'characters ", ' + CACHE_SEPARATEUR_ITEM + ' and ' + CACHE_SEPARATEUR_PARAM + ' not allowed'
            )
            return true
        }

        getUdgTerrainTypes().newDeath(param1, TerrainTypeFromString.TerrainTypeString2TerrainTypeId(param2), str, x, 0)

        Text.mkP(escaper.getPlayer(), 'New terrain type "' + param1 + '" added')

        return true
    }

    //-newSlide(news) <label> <terrainType> [<slideSpeed> [<canTurn>]]   --> add a new kind of slide terrain
    if (name === 'newSlide' || name === 'news') {
        if (nbParam < 2 || nbParam > 4) {
            return true
        }
        if (nbParam >= 3) {
            if (!IsInteger(param3)) {
                Text.erP(escaper.getPlayer(), 'the slide speed must be an integer')
                return true
            }
            speed = S2R(param3)
        } else {
            speed = HERO_SLIDE_SPEED
        }
        if (nbParam === 4) {
            if (!IsBoolString(param4)) {
                Text.erP(escaper.getPlayer(), 'the property "canTurn" must be a boolean (true or false)')
                return true
            }
            b = S2B(param4)
        } else {
            b = true
        }
        if (
            StringContainsChar(param1, CACHE_SEPARATEUR_ITEM) ||
            StringContainsChar(param1, CACHE_SEPARATEUR_PARAM) ||
            StringContainsChar(param1, '"')
        ) {
            Text.erP(
                escaper.getPlayer(),
                'characters ", ' + CACHE_SEPARATEUR_ITEM + ' and ' + CACHE_SEPARATEUR_PARAM + ' not allowed'
            )
            return true
        }

        getUdgTerrainTypes().newSlide(param1, TerrainTypeFromString.TerrainTypeString2TerrainTypeId(param2), speed, b)

        Text.mkP(escaper.getPlayer(), 'New terrain type "' + param1 + '" added')

        return true
    }

    //-setTerrainLabel(settl) <oldTerrainLabel> <newTerrainLabel>
    if (name === 'setTerrainLabel' || name === 'settl') {
        if (!(nbParam === 2)) {
            return true
        }
        b = !!getUdgTerrainTypes().get(param1)
        if (b) {
            b = !getUdgTerrainTypes().isLabelAlreadyUsed(param2)
        }
        if (b) {
            if (
                StringContainsChar(param2, CACHE_SEPARATEUR_ITEM) ||
                StringContainsChar(param2, CACHE_SEPARATEUR_PARAM) ||
                StringContainsChar(param2, '"')
            ) {
                Text.erP(
                    escaper.getPlayer(),
                    'characters ", ' + CACHE_SEPARATEUR_ITEM + ' and ' + CACHE_SEPARATEUR_PARAM + ' not allowed'
                )
                return true
            }
            getUdgTerrainTypes().get(param1)?.setLabel(param2)
            Text.mkP(escaper.getPlayer(), 'label changed to "' + param2 + '"')
        } else {
            Text.erP(escaper.getPlayer(), 'impossible to change label')
        }
        return true
    }

    //-setTerrainAlias(setta) <terrainLabel> <alias>   --> an alias is a shortcut which can be used like a label
    if (name === 'setTerrainAlias' || name === 'setta') {
        if (!(nbParam === 2)) {
            return true
        }
        b = !!getUdgTerrainTypes().get(param1)
        if (b) {
            b = !getUdgTerrainTypes().isLabelAlreadyUsed(param2)
        }
        if (b) {
            if (
                StringContainsChar(param2, CACHE_SEPARATEUR_ITEM) ||
                StringContainsChar(param2, CACHE_SEPARATEUR_PARAM) ||
                StringContainsChar(param2, '"')
            ) {
                Text.erP(
                    escaper.getPlayer(),
                    'characters ", ' + CACHE_SEPARATEUR_ITEM + ' and ' + CACHE_SEPARATEUR_PARAM + ' not allowed'
                )
                return true
            }
            getUdgTerrainTypes().get(param1)?.setAlias(param2)
            Text.mkP(escaper.getPlayer(), 'Alias changed to "' + param2 + '"')
        } else {
            Text.erP(escaper.getPlayer(), 'Impossible to change alias')
        }
        return true
    }

    //-setTerrainWalkSpeed(settws) <walkTerrainLabel> <walkSpeed>   --> max walk speed : 522
    if (name === 'setTerrainWalkSpeed' || name === 'settws') {
        if (!(nbParam === 2)) {
            return true
        }
        terrainType = getUdgTerrainTypes().get(param1)
        if (!terrainType) {
            Text.erP(escaper.getPlayer(), 'Unknown terrain')
            return true
        }
        if (!(terrainType instanceof TerrainTypeWalk)) {
            Text.erP(escaper.getPlayer(), 'The terrain must be of walk type')
            return true
        }
        if (!IsPositiveInteger(param2) || S2R(param2) > 522) {
            Text.erP(escaper.getPlayer(), 'Wrong speed value, should be a real between 0 and 522')
            return true
        }
        terrainType.setWalkSpeed(S2R(param2))
        Text.mkP(escaper.getPlayer(), 'Terrain walk speed changed')
        return true
    }

    //-setTerrainKillEffect(settke) <deathTerrainLabel> <killingEffect>   --> special effect appearing when a hero touch the death terrain
    if (name === 'setTerrainKillEffect' || name === 'settke') {
        if (!(nbParam === 2)) {
            return true
        }
        terrainType = getUdgTerrainTypes().get(param1)
        if (!terrainType) {
            Text.erP(escaper.getPlayer(), 'Unknown terrain')
            return true
        }
        if (!(terrainType instanceof TerrainTypeDeath)) {
            Text.erP(escaper.getPlayer(), 'The terrain must be of death type')
            return true
        }
        if (
            StringContainsChar(param2, CACHE_SEPARATEUR_ITEM) ||
            StringContainsChar(param2, CACHE_SEPARATEUR_PARAM) ||
            StringContainsChar(param2, '"')
        ) {
            Text.erP(
                escaper.getPlayer(),
                'Characters ", ' + CACHE_SEPARATEUR_ITEM + ' and ' + CACHE_SEPARATEUR_PARAM + ' not allowed'
            )
            return true
        }
        terrainType.setKillingEffectStr(param2)
        Text.mkP(escaper.getPlayer(), 'Terrain kill effect changed')
        return true
    }

    //-setTerrainKillDelay(settkd) <deathTerrainLabel> <killingDelay>   --> time before which the hero dies when he touch the death terrain
    if (name === 'setTerrainKillDelay' || name === 'settkd') {
        if (!(nbParam === 2)) {
            return true
        }
        terrainType = getUdgTerrainTypes().get(param1)
        if (!terrainType) {
            Text.erP(escaper.getPlayer(), 'unknown terrain')
            return true
        }
        if (!(terrainType instanceof TerrainTypeDeath)) {
            Text.erP(escaper.getPlayer(), 'the terrain must be of death type')
            return true
        }
        if (param2 !== '0' && S2R(param2) === 0) {
            Text.erP(escaper.getPlayer(), 'wrong delay value')
            return true
        }
        terrainType.setTimeToKill(S2R(param2))
        Text.mkP(escaper.getPlayer(), 'terrain kill delay changed')
        return true
    }

    //-setTerrainKillTolerance(settkt) <deathTerrainLabel> <tolerance dist>   --> max distance to the closest non death terrain, where heroes won't die
    if (name === 'setTerrainKillTolerance' || name === 'settkt') {
        if (!(nbParam === 2)) {
            return true
        }
        terrainType = getUdgTerrainTypes().get(param1)
        if (!terrainType) {
            Text.erP(escaper.getPlayer(), 'unknown terrain')
            return true
        }
        if (!(terrainType instanceof TerrainTypeDeath)) {
            Text.erP(escaper.getPlayer(), 'the terrain must be of death type')
            return true
        }
        if (param2 !== '0' && S2R(param2) === 0) {
            Text.erP(escaper.getPlayer(), 'wrong tolerance value')
            return true
        }
        if (terrainType.setToleranceDist(S2R(param2))) {
            Text.mkP(escaper.getPlayer(), 'tolerance distance changed')
        } else {
            Text.erP(escaper.getPlayer(), 'tolerance must be between 0 and ' + R2S(DEATH_TERRAIN_MAX_TOLERANCE))
        }
        return true
    }

    //-setTerrainSlideSpeed(settss) <slideTerrainLabel> <slideSpeed>
    if (name === 'setTerrainSlideSpeed' || name === 'settss') {
        if (!(nbParam === 2)) {
            return true
        }
        terrainType = getUdgTerrainTypes().get(param1)
        if (!terrainType) {
            Text.erP(escaper.getPlayer(), 'unknown terrain')
            return true
        }
        if (!(terrainType instanceof TerrainTypeSlide)) {
            Text.erP(escaper.getPlayer(), 'the terrain must be of slide type')
            return true
        }
        if (!IsInteger(param2)) {
            Text.erP(escaper.getPlayer(), 'wrong speed value')
            return true
        }
        terrainType.setSlideSpeed(S2R(param2))
        Text.mkP(escaper.getPlayer(), 'terrain slide speed changed')
        return true
    }

    //-setTerrainCanTurn(settct) <slideTerrainLabel> <canTurn>
    if (name === 'setTerrainCanTurn' || name === 'settct') {
        if (!(nbParam === 2)) {
            return true
        }
        terrainType = getUdgTerrainTypes().get(param1)
        if (!terrainType) {
            Text.erP(escaper.getPlayer(), 'unknown terrain')
            return true
        }
        if (!(terrainType instanceof TerrainTypeSlide)) {
            Text.erP(escaper.getPlayer(), 'the terrain must be of slide type')
            return true
        }
        if (!IsBoolString(param2)) {
            Text.erP(escaper.getPlayer(), 'the property "canTurn" must be a boolean (true or false)')
            return true
        }
        if (terrainType.setCanTurn(S2B(param2))) {
            if (S2B(param2)) {
                Text.mkP(escaper.getPlayer(), 'the heroes can now turn on this slide terrain')
            } else {
                Text.mkP(escaper.getPlayer(), "the heroes can't turn on this slide terrain anymore")
            }
        } else {
            if (S2B(param2)) {
                Text.erP(escaper.getPlayer(), 'the heroes can already turn on this slide terrain')
            } else {
                Text.erP(escaper.getPlayer(), "the heroes already can't turn on this slide terrain")
            }
        }
        return true
    }

    //-changeTerrain(cht) <terrainLabel> <newTerrainType>   --> examples of terrain types : 'Nice', 46
    if (name === 'changeTerrain' || name === 'cht') {
        if (!(nbParam === 2)) {
            return true
        }
        Text.DisplayLineToPlayer(escaper.getPlayer())
        str = ChangeOneTerrain.ChangeOneTerrain(param1, param2)
        if (str !== null) {
            Text.mkP(escaper.getPlayer(), 'changed to ' + udg_colorCode[RED] + str)
        } else {
            Text.erP(escaper.getPlayer(), "couldn't change terrain")
        }
        return true
    }

    //-changeAllTerrains(chat) [known(k)|notKnown(nk)]
    if (name === 'changeAllTerrains' || name === 'chat') {
        if (noParam) {
            str = 'normal'
        } else {
            if (nbParam === 1) {
                if (param1 === 'known' || param1 === 'k') {
                    str = 'known'
                } else {
                    if (param1 === 'notKnown' || param1 === 'nk') {
                        str = 'notKnown'
                    } else {
                        return true
                    }
                }
            }
        }
        if (!ChangeAllTerrains.ChangeAllTerrains(str)) {
            Text.erP(escaper.getPlayer(), "couldn't change terrains")
        }
        return true
    }

    //-changeAllTerrainsAtRevive(chatar) <boolean change>
    if (name === 'changeAllTerrainsAtRevive' || name === 'chatar') {
        if (nbParam === 1 && IsBoolString(param1) && S2B(param1) !== ChangeAllTerrains.udg_changeAllTerrainsAtRevive) {
            ChangeAllTerrains.udg_changeAllTerrainsAtRevive = S2B(param1)
            Text.mkP(escaper.getPlayer(), 'change all terrains at revive ' + StringCase(param1, true))
        }
        return true
    }

    //-exchangeTerrains(excht) [<terrainLabelA> <terrainLabelB>]   --> without parameter, click on the terrains to exchange them
    if (name === 'exchangeTerrains' || name === 'excht') {
        if (noParam) {
            escaper.makeExchangeTerrains()
            Text.mkP(escaper.getPlayer(), 'exchange terrains on')
            return true
        }
        if (!(nbParam === 2)) {
            return true
        }
        if (ExchangeTerrains(param1, param2)) {
            Text.mkP(escaper.getPlayer(), 'terrains exchanged')
        } else {
            Text.erP(escaper.getPlayer(), "couldn't exchange terrains")
        }
        return true
    }

    //-randomizeTerrains(rdmt)
    if (name === 'randomizeTerrains' || name === 'rdmt') {
        if (noParam) {
            RandomizeTerrains.RandomizeTerrains()
        }
        return true
    }

    //-createTerrain(crt) <terrainLabel>   --> create the terrain on the map, by clicking
    if (name === 'createTerrain' || name === 'crt') {
        if (!(nbParam === 1)) {
            return true
        }

        const terrainType = getUdgTerrainTypes().get(param1)
        if (!terrainType) {
            Text.erP(escaper.getPlayer(), 'terrain "' + param1 + '" doesn\'t exist')
        } else {
            escaper.makeCreateTerrain(terrainType)
            Text.mkP(escaper.getPlayer(), 'creating terrain on')
        }
        return true
    }

    //-copyPasteTerrain(cpt)   --> copy paste a rectangle of terrain on the map
    if (name === 'copyPasteTerrain' || name === 'cpt') {
        if (noParam) {
            escaper.makeTerrainCopyPaste()
            Text.mkP(escaper.getPlayer(), 'copy/paste terrain on')
        }
        return true
    }

    //-verticalSymmetryTerrain(vst)   --> transform a rectangle of terrain by a vertical symmetry
    if (name === 'verticalSymmetryTerrain' || name === 'vst') {
        if (noParam) {
            escaper.makeTerrainVerticalSymmetry()
            Text.mkP(escaper.getPlayer(), 'vertical symmetry terrain on')
        }
        return true
    }

    //-horizontalSymmetryTerrain(hst)   --> transform a rectangle of terrain by an horizontal symmetry
    if (name === 'horizontalSymmetryTerrain' || name === 'hst') {
        if (noParam) {
            escaper.makeTerrainHorizontalSymmetry()
            Text.mkP(escaper.getPlayer(), 'horizontal symmetry terrain on')
        }
        return true
    }

    //-terrainHeight(th) [<terrainRadius> [<height>]]   --> apply a terrain height at chosen places ; default radius 100, default height 100
    if (name === 'terrainHeight' || name === 'th') {
        if (!(nbParam <= 2)) {
            return true
        }
        if (nbParam === 2) {
            y = S2R(param2)
            if (y === 0 && param2 !== '0') {
                Text.erP(escaper.getPlayer(), 'param2 (height) must be a real')
                return true
            }
            if (y === 0) {
                Text.erP(escaper.getPlayer(), "param2 (height) can't be 0")
                return true
            }
        } else {
            y = 100
        }
        if (nbParam >= 1) {
            x = S2R(param1)
            if (x === 0 && param1 !== '0') {
                Text.erP(escaper.getPlayer(), 'param1 (radius) must be a real')
                return true
            }
            if (x <= 0) {
                Text.erP(escaper.getPlayer(), 'param1 (radius) must be higher than 0')
                return true
            }
        } else {
            x = 100
        }
        escaper.makeTerrainHeight(x, y)
        Text.mkP(escaper.getPlayer(), 'terrain height making')
        return true
    }

    //-displayTerrains(dt) [<terrainLabel>]   --> displays the characteristics of the terrains added by the maker(s)
    if (name === 'displayTerrains' || name === 'dt') {
        if (!(nbParam <= 1)) {
            return true
        }
        if (nbParam === 1) {
            if (getUdgTerrainTypes().isLabelAlreadyUsed(param1)) {
                getUdgTerrainTypes().get(param1)?.displayForPlayer(escaper.getPlayer())
            } else {
                Text.erP(escaper.getPlayer(), 'unknown terrain')
            }
        } else {
            getUdgTerrainTypes().displayForPlayer(escaper.getPlayer())
        }
        return true
    }

    //-newMonster(newm) <label> <unitTypeId> [<immolationRadius> [<speed> [<scale> [<isClickable>]]]]
    if (name === 'newMonster' || name === 'newm') {
        if (nbParam < 2 || nbParam > 6) {
            return true
        }
        //checkParam1
        if (getUdgMonsterTypes().isLabelAlreadyUsed(param1)) {
            Text.erP(escaper.getPlayer(), 'Label "' + param1 + '" already used')
            return true
        }
        //checkParam2
        if (!(StringLength(param2) === 6 && SubStringBJ(param2, 1, 1) === "'" && SubStringBJ(param2, 6, 6) === "'")) {
            Text.erP(escaper.getPlayer(), "Wrong unit type id (exemple : 'hfoo')")
            return true
        }
        //checkParam3
        if (nbParam >= 3) {
            x = S2I(param3)
            if (x % 5 != 0 || x < 0 || x > 400) {
                Text.erP(
                    escaper.getPlayer(),
                    'Wrong immolation radius ; should be an integer divisible by 5 and between 0 and 400'
                )
                return true
            }
            //checkParam4
            if (nbParam >= 4) {
                str = CmdParam(cmd, 4)
                if (!IsPositiveInteger(str) || S2I(str) > MAX_MOVE_SPEED) {
                    Text.erP(escaper.getPlayer(), 'Wrong speed value ; should be a positive integer between 0 and 522')
                    return true
                }
                speed = S2R(str)
                //checkParam5
                if (nbParam >= 5) {
                    str = CmdParam(cmd, 5)
                    if (S2R(str) <= 0 && str !== 'default' && str !== 'd') {
                        Text.erP(
                            escaper.getPlayer(),
                            'Wrong scale value ; should be a real upper than 0 or "default" or "d"'
                        )
                        return true
                    }
                    if (str === 'default' || str === 'd') {
                        x = -1
                    }

                    //checkParam6
                    if (nbParam === 6) {
                        str = CmdParam(cmd, 6)
                        if (!IsBoolString(str)) {
                            Text.erP(
                                escaper.getPlayer(),
                                "Wrong \"is clickable\" value ; should be 'true', 'false', '0' or '1'"
                            )
                            return true
                        }
                        b = S2B(str)
                    } else {
                        b = false
                    }
                } else {
                    x = -1
                    b = false
                }
            } else {
                speed = DEFAULT_MONSTER_SPEED
                x = -1
                b = false
            }
        } else {
            param3 = '0'
            speed = DEFAULT_MONSTER_SPEED
            x = -1
            b = false
        }
        if (
            StringContainsChar(param1, CACHE_SEPARATEUR_ITEM) ||
            StringContainsChar(param1, CACHE_SEPARATEUR_PARAM) ||
            StringContainsChar(param1, '"')
        ) {
            Text.erP(
                escaper.getPlayer(),
                'Characters ", ' + CACHE_SEPARATEUR_ITEM + ' and ' + CACHE_SEPARATEUR_PARAM + ' not allowed'
            )
            return true
        }

        getUdgMonsterTypes().new(param1, String2Ascii(SubStringBJ(param2, 2, 5)), x, S2R(param3), speed, b)

        Text.mkP(escaper.getPlayer(), 'Monster type "' + param1 + '" created')

        return true
    }

    //-setMonsterLabel(setml) <oldMonsterLabel> <newMonsterLabel>
    if (name === 'setMonsterLabel' || name === 'setml') {
        if (!(nbParam === 2)) {
            return true
        }
        b = !!getUdgMonsterTypes().get(param1)
        if (b) {
            b = !getUdgMonsterTypes().isLabelAlreadyUsed(param2)
        }
        if (b) {
            if (
                StringContainsChar(param2, CACHE_SEPARATEUR_ITEM) ||
                StringContainsChar(param2, CACHE_SEPARATEUR_PARAM) ||
                StringContainsChar(param2, '"')
            ) {
                Text.erP(
                    escaper.getPlayer(),
                    'characters ", ' + CACHE_SEPARATEUR_ITEM + ' and ' + CACHE_SEPARATEUR_PARAM + ' not allowed'
                )
                return true
            }
            getUdgMonsterTypes().get(param1)?.setLabel(param2)
            Text.mkP(escaper.getPlayer(), 'label changed to "' + param2 + '"')
        } else {
            Text.erP(escaper.getPlayer(), 'impossible to change label')
        }
        return true
    }

    //-setMonsterAlias(setma) <monsterLabel> <alias>
    if (name === 'setMonsterAlias' || name === 'setma') {
        if (!(nbParam === 2)) {
            return true
        }
        b = !!getUdgMonsterTypes().get(param1)
        if (b) {
            b = !getUdgMonsterTypes().isLabelAlreadyUsed(param2)
        }
        if (b) {
            if (
                StringContainsChar(param2, CACHE_SEPARATEUR_ITEM) ||
                StringContainsChar(param2, CACHE_SEPARATEUR_PARAM) ||
                StringContainsChar(param2, '"')
            ) {
                Text.erP(
                    escaper.getPlayer(),
                    'characters ", ' + CACHE_SEPARATEUR_ITEM + ' and ' + CACHE_SEPARATEUR_PARAM + ' not allowed'
                )
                return true
            }
            getUdgMonsterTypes().get(param1)?.setAlias(param2)
            Text.mkP(escaper.getPlayer(), 'alias changed to "' + param2 + '"')
        } else {
            Text.erP(escaper.getPlayer(), 'impossible to change alias')
        }
        return true
    }

    //-setMonsterUnit(setmu) <monsterLabel> <unitType>   --> example of unit type : 'ewsp'
    if (name === 'setMonsterUnit' || name === 'setmu') {
        if (!(nbParam === 2)) {
            return true
        }
        //checkParam1
        if (!getUdgMonsterTypes().isLabelAlreadyUsed(param1)) {
            Text.erP(escaper.getPlayer(), 'unknown monster type')
            return true
        }
        //checkParam2
        if (!(StringLength(param2) === 6 && SubStringBJ(param2, 1, 1) === "'" && SubStringBJ(param2, 6, 6) === "'")) {
            Text.erP(escaper.getPlayer(), "wrong unit type id (exemple : 'hfoo')")
            return true
        }
        if (
            getUdgMonsterTypes()
                .get(param1)
                ?.setUnitTypeId(String2Ascii(SubStringBJ(param2, 2, 5)))
        ) {
            Text.mkP(escaper.getPlayer(), 'unit type changed')
        } else {
            Text.erP(escaper.getPlayer(), "this unit type doesn't exist")
        }
        return true
    }

    //-setMonsterImmolation(setmi) <monsterLabel> <immolationRadius>   --> immolation between 5 and 400, divisible by 5
    if (name === 'setMonsterImmolation' || name === 'setmi') {
        if (!(nbParam === 2)) {
            return true
        }
        //checkParam1
        if (!getUdgMonsterTypes().isLabelAlreadyUsed(param1)) {
            Text.erP(escaper.getPlayer(), 'unknown monster type')
            return true
        }
        //checkParam2
        x = S2I(param2)
        if (x % 5 != 0 || x < 0 || x > 400) {
            Text.erP(
                escaper.getPlayer(),
                'wrong immolation radius ; should be an integer divisible by 5 and between 0 and 400'
            )
            return true
        }
        if (getUdgMonsterTypes().get(param1)?.setImmolation(x)) {
            Text.mkP(escaper.getPlayer(), 'immolation changed')
        } else {
            Text.erP(escaper.getPlayer(), "couldn't change immolation")
        }
        return true
    }

    //-setMonsterMoveSpeed(setmms) <monsterLabel> <speed>
    if (name === 'setMonsterMoveSpeed' || name === 'setmms') {
        if (!(nbParam === 2)) {
            return true
        }
        //checkParam1
        if (!getUdgMonsterTypes().isLabelAlreadyUsed(param1)) {
            Text.erP(escaper.getPlayer(), 'unknown monster type')
            return true
        }
        //checkParam2
        if (!IsPositiveInteger(param2) || S2I(param2) > MAX_MOVE_SPEED) {
            Text.erP(escaper.getPlayer(), 'wrong speed value ; should be a positive integer between 0 and 522')
            return true
        }
        if (getUdgMonsterTypes().get(param1)?.setUnitMoveSpeed(S2R(param2))) {
            Text.mkP(escaper.getPlayer(), 'move speed changed')
        } else {
            Text.erP(escaper.getPlayer(), "couldn't change move speed")
        }
        return true
    }

    //-setMonsterScale(setms) <monsterLabel> <scale>   --> affects the size of this kind of monster
    if (name === 'setMonsterScale' || name === 'setms') {
        if (!(nbParam === 2)) {
            return true
        }
        //checkParam1
        if (!getUdgMonsterTypes().isLabelAlreadyUsed(param1)) {
            Text.erP(escaper.getPlayer(), 'unknown monster type')
            return true
        }
        //checkParam2
        if (S2R(param2) <= 0 && param2 !== 'default' && param2 !== 'd') {
            Text.erP(escaper.getPlayer(), 'wrong scale value ; should be a real upper than 0 or "default" or "d"')
            return true
        }
        if (param2 === 'default' || param2 === 'd') {
            x = -1
        } else {
            x = S2R(param2)
        }
        if (getUdgMonsterTypes().get(param1)?.setScale(x)) {
            Text.mkP(escaper.getPlayer(), 'scale changed')
        } else {
            Text.erP(escaper.getPlayer(), "couldn't change scale, probably because the old value is the same")
        }
        return true
    }

    //-setMonsterClickable(setmc) <monsterLabel> <boolean clickable>   --> sets if locust or not for this kind of monster
    if (name === 'setMonsterClickable' || name === 'setmc') {
        if (!(nbParam === 2)) {
            return true
        }
        //checkParam1
        if (!getUdgMonsterTypes().isLabelAlreadyUsed(param1)) {
            Text.erP(escaper.getPlayer(), 'unknown monster type')
            return true
        }
        //checkParam2
        if (!IsBoolString(param2)) {
            Text.erP(escaper.getPlayer(), "wrong \"is clickable\" value ; should be 'true', 'false', '0' or '1'")
            return true
        }
        if (getUdgMonsterTypes().get(param1)?.setIsClickable(S2B(param2))) {
            if (S2B(param2)) {
                Text.mkP(escaper.getPlayer(), 'this monster type is now clickable')
            } else {
                Text.mkP(escaper.getPlayer(), 'this monster type is now unclickable')
            }
        } else {
            if (S2B(param2)) {
                Text.erP(escaper.getPlayer(), 'this monster type is already clickable')
            } else {
                Text.erP(escaper.getPlayer(), 'this monster type is already unclickable')
            }
        }
        return true
    }

    //-setMonsterKillEffect(setmke) <monsterLabel> <killingEffect>
    if (name === 'setMonsterKillEffect' || name === 'setmke') {
        if (!(nbParam === 2)) {
            return true
        }
        //checkParam1
        if (!getUdgMonsterTypes().isLabelAlreadyUsed(param1)) {
            Text.erP(escaper.getPlayer(), 'unknown monster type')
            return true
        }
        if (
            StringContainsChar(param2, CACHE_SEPARATEUR_ITEM) ||
            StringContainsChar(param2, CACHE_SEPARATEUR_PARAM) ||
            StringContainsChar(param2, '"')
        ) {
            Text.erP(
                escaper.getPlayer(),
                'characters ", ' + CACHE_SEPARATEUR_ITEM + ' and ' + CACHE_SEPARATEUR_PARAM + ' not allowed'
            )
            return true
        }
        getUdgMonsterTypes().get(param1)?.setKillingEffectStr(param2)
        Text.mkP(escaper.getPlayer(), 'kill effect changed for this monster type')
        return true
    }

    //-setMonsterMeteorsToKill(setmmtk) <monsterLabel> <meteorNumber>
    if (name === 'setMonsterMeteorsToKill' || name === 'setmmtk') {
        if (!(nbParam === 2)) {
            return true
        }
        //checkParam1
        if (!getUdgMonsterTypes().isLabelAlreadyUsed(param1)) {
            Text.erP(escaper.getPlayer(), 'unknown monster type')
            return true
        }
        //checkParam2
        if (!(IsPositiveInteger(param2) && S2I(param2) > 0 && S2I(param2) < 10)) {
            Text.erP(escaper.getPlayer(), 'param2 must be an integer between 1 and 9')
            return true
        }
        getUdgMonsterTypes().get(param1)?.setNbMeteorsToKill(S2I(param2))
        Text.mkP(escaper.getPlayer(), 'number of meteors to kill changed for this monster type')
        return true
    }

    //-setMonsterHeight(setmh) <monsterLabel> <height>|default|d
    if (name === 'setMonsterHeight' || name === 'setmh') {
        if (!(nbParam === 2)) {
            return true
        }
        //checkParam1
        if (!getUdgMonsterTypes().isLabelAlreadyUsed(param1)) {
            Text.erP(escaper.getPlayer(), 'unknown monster type')
            return true
        }
        //checkParam2
        if (param2 === 'default' || param2 === 'd') {
            x = -1
        } else if (S2R(param2) > 0 || param2 === '0') {
            x = S2R(param2)
        } else {
            Text.erP(escaper.getPlayer(), 'wrong height ; should be a positive real or "default" or "d"')
            return true
        }
        if (getUdgMonsterTypes().get(param1)?.setHeight(x)) {
            Text.mkP(escaper.getPlayer(), 'height changed for this monster type')
        } else {
            Text.erP(escaper.getPlayer(), 'the height is already to this value')
        }
        return true
    }

    //-createMonsterImmobile(crmi) <monsterLabel> [<facingAngle>]   --> if facing angle not specified, random angles will be chosen
    if (name === 'createMonsterImmobile' || name === 'crmi') {
        if (nbParam < 1 || nbParam > 2) {
            return true
        }
        //checkParam1
        if (!getUdgMonsterTypes().isLabelAlreadyUsed(param1)) {
            Text.erP(escaper.getPlayer(), 'unknown monster type')
            return true
        }
        //checkParam2
        if (nbParam === 2) {
            if (S2R(param2) === 0 && param2 !== '0') {
                Text.erP(escaper.getPlayer(), 'wrong angle value ; should be a real (-1 for random angle)')
                return true
            }
            x = S2R(param2)
        } else {
            x = -1
        }

        const monsterType = getUdgMonsterTypes().get(param1)
        monsterType && escaper.makeCreateNoMoveMonsters(monsterType, x)

        Text.mkP(escaper.getPlayer(), 'monster making on')
        return true
    }

    //-createMonster(crm) <monsterLabel>   --> simple patrols (2 locations)
    if (name === 'createMonster' || name === 'crm') {
        if (!(nbParam === 1)) {
            return true
        }
        //checkParam1
        if (!getUdgMonsterTypes().isLabelAlreadyUsed(param1)) {
            Text.erP(escaper.getPlayer(), 'unknown monster type')
            return true
        }

        const monsterType = getUdgMonsterTypes().get(param1)
        monsterType && escaper.makeCreateSimplePatrolMonsters('normal', monsterType)

        Text.mkP(escaper.getPlayer(), 'monster making on')
        return true
    }

    //-createMonsterString(crms) <monsterLabel>   --> simple patrols where the second loc of a monster is the first loc of the next one
    if (name === 'createMonsterString' || name === 'crms') {
        if (!(nbParam === 1)) {
            return true
        }
        //checkParam1
        if (!getUdgMonsterTypes().isLabelAlreadyUsed(param1)) {
            Text.erP(escaper.getPlayer(), 'unknown monster type')
            return true
        }

        const monsterType = getUdgMonsterTypes().get(param1)
        monsterType && escaper.makeCreateSimplePatrolMonsters('string', monsterType)

        Text.mkP(escaper.getPlayer(), 'monster making on')
        return true
    }

    //-createMonsterAuto(crma) <monsterLabel>  --> simple patrols created with only one click (click on a slide terrain)
    if (name === 'crma') {
        if (!(nbParam === 1)) {
            return true
        }
        //checkParam1
        if (!getUdgMonsterTypes().isLabelAlreadyUsed(param1)) {
            Text.erP(escaper.getPlayer(), 'unknown monster type')
            return true
        }

        const monsterType = getUdgMonsterTypes().get(param1)
        monsterType && escaper.makeCreateSimplePatrolMonsters('auto', monsterType)

        Text.mkP(escaper.getPlayer(), 'monster making on')
        return true
    }

    //-setAutoDistOnTerrain(setadot) <newDist>   --> for patrol monsters created in one click, distance between locations and slide terrain
    if (name === 'setAutoDistOnTerrain' || name === 'setadot') {
        if (!(nbParam === 1 && (S2R(param1) !== 0 || param1 === '0' || param1 === 'default' || param1 === 'd'))) {
            return true
        }
        if (param1 === 'default' || param1 === 'd') {
            MakeMonsterSimplePatrol.changeDistOnTerrainDefault()
        } else {
            if (!MakeMonsterSimplePatrol.changeDistOnTerrain(S2R(param1))) {
                Text.erP(escaper.getPlayer(), 'distance specified out of bounds')
                return true
            }
        }
        Text.mkP(escaper.getPlayer(), 'distance on terrain changed')
        return true
    }

    //-createMonsterMultiPatrols(crmmp) <monsterLabel>   --> patrols until 20 locations
    if (name === 'createMonsterMultiPatrols' || name === 'crmmp') {
        if (!(nbParam === 1)) {
            return true
        }
        //checkParam1
        if (!getUdgMonsterTypes().isLabelAlreadyUsed(param1)) {
            Text.erP(escaper.getPlayer(), 'unknown monster type')
            return true
        }

        const monsterType = getUdgMonsterTypes().get(param1)
        monsterType && escaper.makeCreateMultiplePatrolsMonsters('normal', monsterType)

        Text.mkP(escaper.getPlayer(), 'monster making on')
        return true
    }

    //-createMonsterMultiPatrolsString(crmmps) <monsterLabel>   --> patrols until 20 locations, with come back at last location
    if (name === 'createMonsterMultiPatrolsString' || name === 'crmmps') {
        if (!(nbParam === 1)) {
            return true
        }
        //checkParam1
        if (!getUdgMonsterTypes().isLabelAlreadyUsed(param1)) {
            Text.erP(escaper.getPlayer(), 'unknown monster type')
            return true
        }

        const monsterType = getUdgMonsterTypes().get(param1)
        monsterType && escaper.makeCreateMultiplePatrolsMonsters('string', monsterType)
        Text.mkP(escaper.getPlayer(), 'monster making on')
        return true
    }

    //-createMonsterTeleport(crmt) <monsterLabel> <period> <angle>   --> teleport monster until 20 locations
    if (name === 'createMonsterTeleport' || name === 'crmt') {
        if (!(nbParam === 3)) {
            return true
        }
        //checkParam1
        if (!getUdgMonsterTypes().isLabelAlreadyUsed(param1)) {
            Text.erP(escaper.getPlayer(), 'unknown monster type')
            return true
        }
        //checkParam2
        x = S2R(param2)
        if (x < MONSTER_TELEPORT_PERIOD_MIN || x > MONSTER_TELEPORT_PERIOD_MAX) {
            Text.erP(
                escaper.getPlayer(),
                'the period must be between ' +
                    R2S(MONSTER_TELEPORT_PERIOD_MIN) +
                    ' and ' +
                    R2S(MONSTER_TELEPORT_PERIOD_MAX)
            )
            return true
        }
        //checkParam3
        if (S2R(param3) === 0 && param3 !== '0') {
            Text.erP(escaper.getPlayer(), 'wrong angle value ; should be a real (-1 for random angle)')
            return true
        }

        const monsterType = getUdgMonsterTypes().get(param1)
        monsterType && escaper.makeCreateTeleportMonsters('normal', monsterType, x, S2R(param3))

        Text.mkP(escaper.getPlayer(), 'monster making on')
        return true
    }

    //-createMonsterTeleportStrings(crmts) <monsterLabel> <period> <angle>   --> teleport monster until 20 locations
    if (name === 'createMonsterTeleport' || name === 'crmts') {
        if (!(nbParam === 3)) {
            return true
        }
        //checkParam1
        if (!getUdgMonsterTypes().isLabelAlreadyUsed(param1)) {
            Text.erP(escaper.getPlayer(), 'unknown monster type')
            return true
        }
        //checkParam2
        x = S2R(param2)
        if (x < MONSTER_TELEPORT_PERIOD_MIN || x > MONSTER_TELEPORT_PERIOD_MAX) {
            Text.erP(
                escaper.getPlayer(),
                'the period must be between ' +
                    R2S(MONSTER_TELEPORT_PERIOD_MIN) +
                    ' and ' +
                    R2S(MONSTER_TELEPORT_PERIOD_MAX)
            )
            return true
        }
        //checkParam3
        if (S2R(param3) === 0 && param3 !== '0') {
            Text.erP(escaper.getPlayer(), 'wrong angle value ; should be a real (-1 for random angle)')
            return true
        }

        const monsterType = getUdgMonsterTypes().get(param1)
        monsterType && escaper.makeCreateTeleportMonsters('string', monsterType, x, S2R(param3))

        Text.mkP(escaper.getPlayer(), 'monster making on')
        return true
    }

    //-next(n)   --> finalize the current multi patrols or teleport monster and start the next one
    if (name === 'next' || name === 'n') {
        if (!noParam) {
            return true
        }
        if (escaper.makeMmpOrMtNext()) {
            Text.mkP(escaper.getPlayer(), 'next')
        } else {
            Text.erP(escaper.getPlayer(), "you're not making multipatrol or teleport monsters")
        }
        return true
    }

    //-monsterTeleportWait(mtw)   --> ajoute une période d'attente le MonsterTeleport en train d'être créé
    if (name === 'monsterTeleportWait' || name === 'mtw') {
        if (!noParam) {
            return true
        }
        if (escaper.makeMonsterTeleportWait()) {
            Text.mkP(escaper.getPlayer(), 'wait period added')
        } else {
            Text.erP(escaper.getPlayer(), 'impossible to add a wait period')
        }
        return true
    }

    //-monsterTeleportHide(mth)   --> ajoute une période où le MonsterTeleport est caché et ne tue pas
    if (name === 'monsterTeleportHide' || name === 'mth') {
        if (!noParam) {
            return true
        }
        if (escaper.makeMonsterTeleportHide()) {
            Text.mkP(escaper.getPlayer(), 'hide period added')
        } else {
            Text.erP(escaper.getPlayer(), 'impossible to add a hide period')
        }
        return true
    }

    //-setUnitTeleportPeriod(setutp) <period>
    if (name === 'setUnitTeleportPeriod' || name === 'setutp') {
        if (nbParam !== 1) {
            return true
        }
        //checkParam1
        x = S2R(param1)
        if (x < MONSTER_TELEPORT_PERIOD_MIN || x > MONSTER_TELEPORT_PERIOD_MAX) {
            Text.erP(
                escaper.getPlayer(),
                'the period must be between ' +
                    R2S(MONSTER_TELEPORT_PERIOD_MIN) +
                    ' and ' +
                    R2S(MONSTER_TELEPORT_PERIOD_MAX)
            )
            return true
        }
        //apply command
        escaper.makeSetUnitTeleportPeriod('oneByOne', x)
        Text.mkP(escaper.getPlayer(), 'setting unit teleport period on')
        return true
    }

    //-setUnitTeleportPeriodBetweenPoints(setutpbp) <period>
    if (name === 'setUnitTeleportPeriodBetweenPoints' || name === 'setutpbp') {
        if (nbParam !== 1) {
            return true
        }
        //checkParam1
        x = S2R(param1)
        if (x < MONSTER_TELEPORT_PERIOD_MIN || x > MONSTER_TELEPORT_PERIOD_MAX) {
            Text.erP(
                escaper.getPlayer(),
                'the period must be between ' +
                    R2S(MONSTER_TELEPORT_PERIOD_MIN) +
                    ' and ' +
                    R2S(MONSTER_TELEPORT_PERIOD_MAX)
            )
            return true
        }
        //apply command
        escaper.makeSetUnitTeleportPeriod('twoClics', x)
        Text.mkP(escaper.getPlayer(), 'setting unit teleport period on')
        return true
    }

    //-getUnitTeleportPeriod(getutp)
    if (name === 'getUnitTeleportPeriod' || name === 'getutp') {
        if (!noParam) {
            return true
        }
        //apply command
        escaper.makeGetUnitTeleportPeriod()
        Text.mkP(escaper.getPlayer(), 'getting unit teleport period on')
        return true
    }

    //-setUnitTeleportPeriod(setutp) <period>
    if (name === 'setUnitTeleportPeriod' || name === 'setutp') {
        if (nbParam !== 1) {
            return true
        }
        //checkParam1
        x = S2R(param1)
        if (x < MONSTER_TELEPORT_PERIOD_MIN || x > MONSTER_TELEPORT_PERIOD_MAX) {
            Text.erP(
                escaper.getPlayer(),
                'the period must be between ' +
                    R2S(MONSTER_TELEPORT_PERIOD_MIN) +
                    ' and ' +
                    R2S(MONSTER_TELEPORT_PERIOD_MAX)
            )
            return true
        }
        //apply command
        escaper.makeSetUnitTeleportPeriod('oneByOne', x)
        Text.mkP(escaper.getPlayer(), 'setting unit teleport period on')
        return true
    }

    //-setUnitMonsterType(setumt) <monsterLabel>
    if (name === 'setUnitMonsterType' || name === 'setumt') {
        if (nbParam !== 1) {
            return true
        }
        //checkParam1
        if (!getUdgMonsterTypes().isLabelAlreadyUsed(param1)) {
            Text.erP(escaper.getPlayer(), 'unknown monster type')
            return true
        }
        //apply command
        const monsterType = getUdgMonsterTypes().get(param1)
        monsterType && escaper.makeSetUnitMonsterType('oneByOne', monsterType)
        Text.mkP(escaper.getPlayer(), 'setting unit monster type on')
        return true
    }

    //-setUnitMonsterTypeBetweenPoints(setumtbp) <monsterLabel>
    if (name === 'setUnitMonsterTypeBetweenPoints' || name === 'setumtbp') {
        if (nbParam !== 1) {
            return true
        }
        //checkParam1
        if (!getUdgMonsterTypes().isLabelAlreadyUsed(param1)) {
            Text.erP(escaper.getPlayer(), 'unknown monster type')
            return true
        }
        //apply command
        const monsterType = getUdgMonsterTypes().get(param1)
        monsterType && escaper.makeSetUnitMonsterType('twoClics', monsterType)
        Text.mkP(escaper.getPlayer(), 'setting unit monster type on')
        return true
    }

    //-displayMonsters(dm) [<monsterLabel>]   --> displays the characteristics of the kinds of monsters added by the maker(s)
    if (name === 'displayMonsters' || name === 'dm') {
        if (!(nbParam <= 1)) {
            return true
        }
        if (nbParam === 1) {
            if (getUdgMonsterTypes().isLabelAlreadyUsed(param1)) {
                getUdgMonsterTypes().get(param1)?.displayTotalForPlayer(escaper.getPlayer())
            } else {
                Text.erP(escaper.getPlayer(), 'unknown monster type')
            }
        } else {
            getUdgMonsterTypes().displayForPlayer(escaper.getPlayer())
        }
        return true
    }

    //-deleteMonstersBetweenPoints(delmbp) [<deleteMode>]   --> delete monsters in a rectangle formed with two clicks
    if (name === 'deleteMonstersBetweenPoints' || name === 'delmbp') {
        //delete modes : all, noMove, move, simplePatrol, multiplePatrols
        if (!(nbParam <= 1)) {
            return true
        }
        if (nbParam === 1) {
            if (param1 === 'all' || param1 === 'a') {
                str = 'all'
            } else {
                if (param1 === 'noMove' || param1 === 'nm') {
                    str = 'noMove'
                } else {
                    if (param1 === 'move' || param1 === 'm') {
                        str = 'move'
                    } else {
                        if (param1 === 'simplePatrol' || param1 === 'sp') {
                            str = 'simplePatrol'
                        } else {
                            if (param1 === 'multiplePatrols' || param1 === 'mp') {
                                str = 'multiplePatrols'
                            } else {
                                return true
                            }
                        }
                    }
                }
            }
        } else {
            str = 'all'
        }
        escaper.makeDeleteMonsters(str)
        Text.mkP(escaper.getPlayer(), 'monsters deleting on')
        return true
    }

    //-deleteMonster(delm)   --> delete the monsters clicked by the player
    if (name === 'deleteMonster' || name === 'delm') {
        if (noParam) {
            escaper.makeDeleteMonsters('oneByOne')
            Text.mkP(escaper.getPlayer(), 'monster deleting on')
        }
        return true
    }

    //-createMonsterSpawn(crmsp) <monsterSpawnLabel> <monsterLabel> <direction> [<frequency>]   --> default frequency is 2, minimum is 0.1, maximum is 30
    if (name === 'createMonsterSpawn' || name === 'crmsp') {
        if (!(nbParam >= 3 && nbParam <= 4)) {
            Text.erP(escaper.getPlayer(), 'uncorrect number of parameters')
            return true
        }
        if (escaper.getMakingLevel().monsterSpawns.getFromLabel(param1)) {
            Text.erP(escaper.getPlayer(), 'a monster spawn with label "' + param1 + '" already exists for this level')
            return true
        }

        const monsterType = getUdgMonsterTypes().get(param2)
        if (!monsterType) {
            Text.erP(escaper.getPlayer(), 'unknown monster type "' + param2 + '"')
            return true
        }
        if (param3 === 'leftToRight' || param3 === 'ltr') {
            str = 'leftToRight'
        } else if (param3 === 'upToDown' || param3 === 'utd') {
            str = 'upToDown'
        } else if (param3 === 'rightToLeft' || param3 === 'rtl') {
            str = 'rightToLeft'
        } else if (param3 === 'downToUp' || param3 === 'dtu') {
            str = 'downToUp'
        } else {
            Text.erP(
                escaper.getPlayer(),
                'param 3 should be direction : leftToRight, upToDown, rightToLeft or downToUp'
            )
            return true
        }
        if (nbParam === 4) {
            x = S2R(param4)
            if (x < 0.1 || x > 30) {
                Text.erP(escaper.getPlayer(), 'frequency must be a real between 0.1 and 30')
                return true
            }
        } else {
            x = 2
        }
        escaper.makeCreateMonsterSpawn(param1, monsterType, str, x)
        Text.mkP(escaper.getPlayer(), 'monster spawn making on')
        return true
    }

    //-setMonsterSpawnLabel(setmsl) <oldMonsterSpawnLabel> <newMonsterSpawnLabel>
    if (name === 'setMonsterSpawnLabel' || name === 'setmsl') {
        if (!(nbParam === 2)) {
            return true
        }
        if (escaper.getMakingLevel().monsterSpawns.changeLabel(param1, param2)) {
            Text.mkP(escaper.getPlayer(), 'label changed')
        } else {
            Text.erP(escaper.getPlayer(), "couldn't change label")
        }
        return true
    }

    //-setMonsterSpawnMonster(setmsm) <monsterSpawnLabel> <monsterLabel>
    if (name === 'setMonsterSpawnMonster' || name === 'setmsm') {
        if (!(nbParam === 2)) {
            return true
        }

        const monsterSpawn = escaper.getMakingLevel().monsterSpawns.getFromLabel(param1)
        if (!monsterSpawn) {
            Text.erP(escaper.getPlayer(), 'unknown monster spawn "' + param1 + '" in this level')
            return true
        }

        const monsterType = getUdgMonsterTypes().get(param2)
        if (!monsterType) {
            Text.erP(escaper.getPlayer(), 'unknown monster type "' + param2 + '"')
            return true
        }

        monsterSpawn.setMonsterType(monsterType)
        Text.mkP(escaper.getPlayer(), 'monster type changed')
        return true
    }

    //-setMonsterSpawnDirection(setmsd) <monsterSpawnLabel> <direction>   --> leftToRight(ltr), upToDown(utd), rightToLeft(rtl), downToUp(dtu)
    if (name === 'setMonsterSpawnDirection' || name === 'setmsd') {
        if (!(nbParam === 2)) {
            return true
        }

        const monsterSpawn = escaper.getMakingLevel().monsterSpawns.getFromLabel(param1)
        if (!monsterSpawn) {
            Text.erP(escaper.getPlayer(), 'unknown monster spawn "' + param1 + '" in this level')
            return true
        }
        if (param2 === 'leftToRight' || param2 === 'ltr') {
            str = 'leftToRight'
        } else if (param2 === 'upToDown' || param2 === 'utd') {
            str = 'upToDown'
        } else if (param2 === 'rightToLeft' || param2 === 'rtl') {
            str = 'rightToLeft'
        } else if (param2 === 'downToUp' || param2 === 'dtu') {
            str = 'downToUp'
        } else {
            Text.erP(escaper.getPlayer(), 'direction should be leftToRight, upToDown, rightToLeft or downToUp')
            return true
        }

        monsterSpawn.setSens(str)
        Text.mkP(escaper.getPlayer(), 'direction changed')
        return true
    }

    //-setMonsterSpawnFrequency(setmsf) <monsterSpawnLabel> <frequency>   --> maximum 20 mobs per second
    if (name === 'setMonsterSpawnFrequency' || name === 'setmsf') {
        if (!(nbParam === 2)) {
            return true
        }

        const monsterSpawn = escaper.getMakingLevel().monsterSpawns.getFromLabel(param1)
        if (!monsterSpawn) {
            Text.erP(escaper.getPlayer(), 'unknown monster spawn "' + param1 + '" in this level')
            return true
        }
        x = S2R(param2)
        if (x < 0.1 || x > 30) {
            Text.erP(escaper.getPlayer(), 'frequency must be a real between 0.1 and 30')
            return true
        }

        monsterSpawn.setFrequence(x)
        Text.mkP(escaper.getPlayer(), 'frequency changed')
        return true
    }

    //-displayMonsterSpawns(dms)
    if (name === 'displayMonsterSpawns' || name === 'dms') {
        if (!noParam) {
            return true
        }
        escaper.getMakingLevel().monsterSpawns.displayForPlayer(escaper.getPlayer())
        return true
    }

    //-deleteMonsterSpawn(delms) <monsterSpawnLabel>
    if (name === 'deleteMonsterSpawn' || name === 'delms') {
        if (!(nbParam === 1)) {
            return true
        }
        if (escaper.getMakingLevel().monsterSpawns.clearMonsterSpawn(param1)) {
            Text.mkP(escaper.getPlayer(), 'monster spawn deleted')
        } else {
            Text.erP(escaper.getPlayer(), 'unknown monster spawn for this level')
        }
        return true
    }

    //createKey(crk)   --> create meteors used to kill clickable monsters
    if (name === 'createKey' || name === 'crk') {
        if (noParam) {
            escaper.makeCreateMeteor()
            Text.mkP(escaper.getPlayer(), 'meteor making on')
        }
        return true
    }

    //-deleteKeysBetweenPoints(delkbp)   --> delete meteors in a rectangle formed with two clicks
    if (name === 'deleteKeysBetweenPoints' || name === 'delkbp') {
        if (noParam) {
            escaper.makeDeleteMeteors('twoClics')
            Text.mkP(escaper.getPlayer(), 'meteors deleting on')
        }
        return true
    }

    //-deleteKey(delk)   --> delete the meteors clicked by the player
    if (name === 'deleteKey' || name === 'delk') {
        if (noParam) {
            escaper.makeDeleteMeteors('oneByOne')
            Text.mkP(escaper.getPlayer(), 'meteors deleting on')
        }
        return true
    }

    //-createStart(crs) [next(n)]   --> create the start (a rectangle formed with two clicks) of the current level or the next one if specified
    if (name === 'createStart' || name === 'crs') {
        if (!(nbParam <= 1)) {
            return true
        }
        //checkParam1
        if (nbParam === 1) {
            if (!(param1 === 'next' || param1 === 'n')) {
                Text.erP(escaper.getPlayer(), 'param1 should be "next" or "n"')
                return true
            }
            b = true
        } else {
            b = false
        }
        escaper.makeCreateStart(b) //b signifie si le "Start" est créé pour le niveau suivant (sinon pour le niveau en cours de mapping pour l'escaper)
        Text.mkP(escaper.getPlayer(), 'start making on')
        return true
    }

    //-createEnd(cre)   --> create the end (a rectangle formed with two clicks) of the current level
    if (name === 'createEnd' || name === 'cre') {
        if (!noParam) {
            return true
        }
        escaper.makeCreateEnd()
        Text.mkP(escaper.getPlayer(), 'end making on')
        return true
    }

    //-getMakingLevel(getmkl)   --> displays the id of the level the player is creating (the first one is id 0)
    if (name === 'getMakingLevel' || name === 'getmkl') {
        if (!noParam) {
            return true
        }
        if (getUdgLevels().getCurrentLevel() == escaper.getMakingLevel()) {
            str = ' (same as current level)'
        } else {
            str = ''
        }
        Text.P(escaper.getPlayer(), 'the level you are making is number ' + I2S(escaper.getMakingLevel().getId()) + str)
        return true
    }

    //-setMakingLevel(setmkl) <levelId> | current(c)   --> sets the level the players chose to continue creating
    if (name === 'setMakingLevel' || name === 'setmkl') {
        if (!(nbParam === 1)) {
            return true
        }
        if (IsPositiveInteger(param1)) {
            n = S2I(param1)
            if (getUdgLevels().getLastLevelId() < n) {
                if (n - getUdgLevels().getLastLevelId() == 1) {
                    if (getUdgLevels().new()) {
                        Text.mkP(escaper.getPlayer(), 'level number ' + I2S(n) + ' created')
                    } else {
                        Text.erP(escaper.getPlayer(), 'nombre maximum de niveaux atteint')
                        return true
                    }
                } else {
                    Text.erP(escaper.getPlayer(), "this level doesn't exist")
                    return true
                }
            }

            const level = getUdgLevels().get(n)
            if (level && escaper.setMakingLevel(level)) {
                Text.mkP(escaper.getPlayer(), 'you are now making level ' + I2S(n))
            } else {
                Text.erP(escaper.getPlayer(), 'you are already making this level')
            }
        } else {
            if (param1 === 'current' || param1 === 'c') {
                if (escaper.setMakingLevel(null)) {
                    Text.mkP(
                        escaper.getPlayer(),
                        'you are now making current level (which is at the moment number ' +
                            I2S(getUdgLevels().getCurrentLevel().getId()) +
                            ')'
                    )
                } else {
                    Text.erP(escaper.getPlayer(), 'you are already making current level')
                }
            } else {
                Text.erP(escaper.getPlayer(), 'param1 should be a level id or "current"')
            }
        }
        return true
    }

    //-newLevel(newl)   --> creates a new level after the last one
    if (name === 'newLevel' || name === 'newl') {
        if (noParam) {
            if (getUdgLevels().new()) {
                Text.mkP(escaper.getPlayer(), 'level number ' + I2S(getUdgLevels().getLastLevelId()) + ' created')
            } else {
                Text.erP(escaper.getPlayer(), 'nombre maximum de niveaux atteint')
            }
        }
        return true
    }

    //-setLivesEarned(setle) <livesNumber> [<levelID>]   --> the number of lives earned at the specified level
    if (name === 'setLivesEarned' || name === 'setle') {
        if (!(nbParam >= 1 && nbParam <= 2)) {
            return true
        }
        //check param1
        if (!IsPositiveInteger(param1)) {
            Text.erP(escaper.getPlayer(), 'the number of lives must be a positive integer')
            return true
        }
        //check param2
        if (nbParam === 2) {
            if (!IsPositiveInteger(param2)) {
                Text.erP(escaper.getPlayer(), 'the level number must be a positive integer')
                return true
            }
            level = getUdgLevels().get(S2I(param2))
            if (!level) {
                Text.erP(escaper.getPlayer(), 'level number ' + param2 + " doesn't exist")
                return true
            }
        } else {
            level = escaper.getMakingLevel()
        }
        level.setNbLivesEarned(S2I(param1))
        if (level.getId() > 0) {
            Text.mkP(
                escaper.getPlayer(),
                'the number of lives earned at level ' + I2S(level.getId()) + ' is now ' + param1
            )
        } else {
            Text.mkP(escaper.getPlayer(), 'the number of lives at the beginning of the game is now ' + param1)
        }
        return true
    }

    //-createVisibility(crv)   --> create visibility rectangles for the current level
    if (name === 'createVisibility' || name === 'crv') {
        if (noParam) {
            escaper.makeCreateVisibilityModifier()
            Text.mkP(escaper.getPlayer(), 'visibility making on')
        }
        return true
    }

    //-removeVisibilities(remv) [<levelId>]   --> remove all visibility rectangles made for the current level
    if (name === 'removeVisibilities' || name === 'remv') {
        if (!(noParam || nbParam === 1)) {
            return true
        }
        //check param1
        if (nbParam === 1) {
            if (!IsPositiveInteger(param1)) {
                Text.erP(escaper.getPlayer(), 'the level number must be a positive integer')
                return true
            }
            level = getUdgLevels().get(S2I(param2))
            if (!level) {
                Text.erP(escaper.getPlayer(), 'level number ' + param1 + " doesn't exist")
                return true
            }
        } else {
            level = escaper.getMakingLevel()
        }
        level.removeVisibilities()
        Text.mkP(escaper.getPlayer(), 'visibilities removed for level ' + I2S(level.getId()))
        return true
    }

    //-setStartMessage(setsm) [<message>]   --> sets the start message of the current level (spaces allowed)
    if (name === 'setStartMessage' || name === 'setsm') {
        escaper.getMakingLevel().setStartMessage(CmdParam(cmd, 0))
        Text.mkP(escaper.getPlayer(), 'start message for level ' + I2S(escaper.getMakingLevel().getId()) + ' changed')
        return true
    }

    //-getStartMessage(getsm)   --> displays the start message of the current level
    if (name === 'getStartMessage' || name === 'getsm') {
        str = escaper.getMakingLevel().getStartMessage()
        if (str === '' || str === null) {
            Text.mkP(
                escaper.getPlayer(),
                'start message for level ' + I2S(escaper.getMakingLevel().getId()) + ' is not defined'
            )
        } else {
            Text.mkP(
                escaper.getPlayer(),
                'start message for level ' + I2S(escaper.getMakingLevel().getId()) + ' is "' + str + '"'
            )
        }
        return true
    }

    //-cancel(z)   --> cancel the last action made on the map
    if (name === 'cancel' || name === 'z') {
        if (noParam) {
            if (!escaper.cancelLastAction()) {
                Text.erP(escaper.getPlayer(), 'nothing to cancel')
            }
        }
        return true
    }

    //-redo(y)   --> redo the last action cancelled
    if (name === 'redo' || name === 'y') {
        if (noParam) {
            if (!escaper.redoLastAction()) {
                Text.erP(escaper.getPlayer(), 'nothing to redo')
            }
        }
        return true
    }

    //-nbLevels(nbl)   --> display the number of levels that are currently in the map
    if (name === 'nbLevels' || name === 'nbl') {
        if (noParam) {
            n = getUdgLevels().count()
            if (n > 1) {
                Text.P(escaper.getPlayer(), 'there are currently ' + I2S(n) + ' levels in the map')
            } else {
                Text.P(escaper.getPlayer(), 'there is currently ' + I2S(n) + ' level in the map')
            }
        }
        return true
    }

    //-newCaster(newc) <label> <casterMonsterType> <projectileMonsterType> [<range> [<projectileSpeed> [<loadTime>]]]
    if (name === 'newCaster' || name === 'newc') {
        if (nbParam < 3 || nbParam > 6) {
            return true
        }
        //checkParam1
        if (getUdgCasterTypes().isLabelAlreadyUsed(param1)) {
            Text.erP(escaper.getPlayer(), 'Label "' + param1 + '" already used')
            return true
        }
        //checkParam2
        if (!getUdgMonsterTypes().isLabelAlreadyUsed(param2)) {
            Text.erP(escaper.getPlayer(), 'Unknown monster type "' + param2 + '"')
            return true
        }
        //checkParam3
        if (!getUdgMonsterTypes().isLabelAlreadyUsed(param3)) {
            Text.erP(escaper.getPlayer(), 'Unknown monster type "' + param3 + '"')
            return true
        }
        //checkParam4 range
        if (nbParam >= 4) {
            if (S2R(param4) <= 0) {
                Text.erP(escaper.getPlayer(), 'The range must be a real higher than 0')
                return true
            }
            x = S2R(param4)
            //checkParam5 projectile speed
            if (nbParam >= 5) {
                if (S2R(CmdParam(cmd, 5)) < MIN_CASTER_PROJECTILE_SPEED) {
                    Text.erP(
                        escaper.getPlayer(),
                        'The projectile speed must be a real higher or equals to ' + R2S(MIN_CASTER_PROJECTILE_SPEED)
                    )
                    return true
                }
                speed = S2R(CmdParam(cmd, 5))
                //checkParam6 load time
                if (nbParam === 6) {
                    if (S2R(CmdParam(cmd, 6)) < MIN_CASTER_LOAD_TIME) {
                        Text.erP(
                            escaper.getPlayer(),
                            'The load time must be a real higher or equals to ' + R2S(MIN_CASTER_LOAD_TIME)
                        )
                        return true
                    }
                    y = S2R(CmdParam(cmd, 6))
                } else {
                    y = DEFAULT_CASTER_LOAD_TIME
                }
            } else {
                y = DEFAULT_CASTER_LOAD_TIME
                speed = DEFAULT_CASTER_PROJECTILE_SPEED
            }
        } else {
            y = DEFAULT_CASTER_LOAD_TIME
            speed = DEFAULT_CASTER_PROJECTILE_SPEED
            x = DEFAULT_CASTER_RANGE
        }
        //apply command
        if (
            StringContainsChar(param1, CACHE_SEPARATEUR_ITEM) ||
            StringContainsChar(param1, CACHE_SEPARATEUR_PARAM) ||
            StringContainsChar(param1, '"')
        ) {
            Text.erP(
                escaper.getPlayer(),
                'characters ", ' + CACHE_SEPARATEUR_ITEM + ' and ' + CACHE_SEPARATEUR_PARAM + ' not allowed'
            )
            return true
        }

        const casterMonsterType = getUdgMonsterTypes().get(param2)
        const projectileMonsterType = getUdgMonsterTypes().get(param3)

        casterMonsterType &&
            projectileMonsterType &&
            getUdgCasterTypes().new(
                param1,
                casterMonsterType,
                projectileMonsterType,
                x,
                speed,
                y,
                DEFAULT_CASTER_ANIMATION
            )
        Text.mkP(escaper.getPlayer(), 'new caster type "' + param1 + '" created')
        return true
    }

    //-setCasterLabel(setcl) <oldCasterLabel> <newCasterLabel>
    if (name === 'setCasterLabel' || name === 'setcl') {
        if (!(nbParam === 2)) {
            return true
        }
        b = !!getUdgCasterTypes().get(param1)
        if (b) {
            b = !getUdgCasterTypes().isLabelAlreadyUsed(param2)
        }
        if (b) {
            if (
                StringContainsChar(param2, CACHE_SEPARATEUR_ITEM) ||
                StringContainsChar(param2, CACHE_SEPARATEUR_PARAM) ||
                StringContainsChar(param2, '"')
            ) {
                Text.erP(
                    escaper.getPlayer(),
                    'characters ", ' + CACHE_SEPARATEUR_ITEM + ' and ' + CACHE_SEPARATEUR_PARAM + ' not allowed'
                )
                return true
            }
            getUdgCasterTypes().get(param1)?.setLabel(param2)
            Text.mkP(escaper.getPlayer(), 'label changed to "' + param2 + '"')
        } else {
            Text.erP(escaper.getPlayer(), 'impossible to change label')
        }
        return true
    }

    //-setCasterAlias(setca) <casterLabel> <alias>
    if (name === 'setCasterAlias' || name === 'setca') {
        if (!(nbParam === 2)) {
            return true
        }
        b = !!getUdgCasterTypes().get(param1)
        if (b) {
            b = !getUdgCasterTypes().isLabelAlreadyUsed(param2)
        }
        if (b) {
            if (
                StringContainsChar(param2, CACHE_SEPARATEUR_ITEM) ||
                StringContainsChar(param2, CACHE_SEPARATEUR_PARAM) ||
                StringContainsChar(param2, '"')
            ) {
                Text.erP(
                    escaper.getPlayer(),
                    'characters ", ' + CACHE_SEPARATEUR_ITEM + ' and ' + CACHE_SEPARATEUR_PARAM + ' not allowed'
                )
                return true
            }
            getUdgCasterTypes().get(param1)?.setAlias(param2)
            Text.mkP(escaper.getPlayer(), 'alias changed to "' + param2 + '"')
        } else {
            Text.erP(escaper.getPlayer(), 'impossible to change alias')
        }
        return true
    }

    //-setCasterCaster(setcc) <casterLabel> <casterMonsterType>
    if (name === 'setCasterCaster' || name === 'setcc') {
        if (nbParam !== 2) {
            return true
        }
        //checkParam 1
        if (!getUdgCasterTypes().isLabelAlreadyUsed(param1)) {
            Text.erP(escaper.getPlayer(), 'unknown caster type "' + param1 + '"')
            return true
        }
        //checkParam 2
        if (!getUdgMonsterTypes().isLabelAlreadyUsed(param2)) {
            Text.erP(escaper.getPlayer(), 'unknown monster type "' + param2 + '"')
            return true
        }
        //apply command
        const monsterType = getUdgMonsterTypes().get(param2)
        monsterType && getUdgCasterTypes().get(param1)?.setCasterMonsterType(monsterType)
        Text.mkP(escaper.getPlayer(), 'caster monster type changed')
        return true
    }

    //-setCasterProjectile(setcp) <casterLabel> <projectileMonsterType>
    if (name === 'setCasterProjectile' || name === 'setcp') {
        if (nbParam !== 2) {
            return true
        }
        //checkParam 1
        if (!getUdgCasterTypes().isLabelAlreadyUsed(param1)) {
            Text.erP(escaper.getPlayer(), 'unknown caster type "' + param1 + '"')
            return true
        }
        //checkParam 2
        if (!getUdgMonsterTypes().isLabelAlreadyUsed(param2)) {
            Text.erP(escaper.getPlayer(), 'unknown monster type "' + param2 + '"')
            return true
        }
        //apply command
        const monsterType = getUdgMonsterTypes().get(param2)
        monsterType && getUdgCasterTypes().get(param1)?.setProjectileMonsterType(monsterType)
        Text.mkP(escaper.getPlayer(), 'projectile monster type changed')
        return true
    }

    //-setCasterRange(setcr) <casterLabel> <range>
    if (name === 'setCasterRange' || name === 'setcr') {
        if (nbParam !== 2) {
            return true
        }
        //checkParam 1
        if (!getUdgCasterTypes().isLabelAlreadyUsed(param1)) {
            Text.erP(escaper.getPlayer(), 'unknown caster type "' + param1 + '"')
            return true
        }
        //checkParam 2
        if (S2R(param2) <= 0) {
            Text.erP(escaper.getPlayer(), 'the range must be a real higher than 0')
            return true
        }
        //apply command
        getUdgCasterTypes().get(param1)?.setRange(S2R(param2))
        Text.mkP(escaper.getPlayer(), 'range changed')
        return true
    }

    //-setCasterSpeed(setcs) <casterLabel> <projectileSpeed>
    if (name === 'setCasterSpeed' || name === 'setcs') {
        if (nbParam !== 2) {
            return true
        }
        //checkParam 1
        if (!getUdgCasterTypes().isLabelAlreadyUsed(param1)) {
            Text.erP(escaper.getPlayer(), 'unknown caster type "' + param1 + '"')
            return true
        }
        //checkParam 2
        if (S2R(param2) < MIN_CASTER_PROJECTILE_SPEED) {
            Text.erP(
                escaper.getPlayer(),
                'the projectile speed must be a real higher or equals to ' + R2S(MIN_CASTER_PROJECTILE_SPEED)
            )
            return true
        }
        //apply command
        getUdgCasterTypes().get(param1)?.setProjectileSpeed(S2R(param2))
        Text.mkP(escaper.getPlayer(), 'projectile speed changed')
        return true
    }

    //-setCasterLoadtime(setclt) <casterLabel> <loadTime>
    if (name === 'setCasterLoadTime' || name === 'setclt') {
        if (nbParam !== 2) {
            return true
        }
        //checkParam 1
        if (!getUdgCasterTypes().isLabelAlreadyUsed(param1)) {
            Text.erP(escaper.getPlayer(), 'unknown caster type "' + param1 + '"')
            return true
        }
        //checkParam 2
        if (S2R(param2) < MIN_CASTER_LOAD_TIME) {
            Text.erP(
                escaper.getPlayer(),
                'the load time must be a real higher or equals to ' + R2S(MIN_CASTER_LOAD_TIME)
            )
            return true
        }
        //apply command
        getUdgCasterTypes().get(param1)?.setLoadTime(S2R(param2))
        Text.mkP(escaper.getPlayer(), 'load time changed')
        return true
    }

    //-setCasterAnimation(setcan) <casterLabel> <animation>
    if (name === 'setCasterAnimation' || name === 'setcan') {
        if (!(nbParam >= 2)) {
            return true
        }
        //checkParam 1
        if (!getUdgCasterTypes().isLabelAlreadyUsed(param1)) {
            Text.erP(escaper.getPlayer(), 'unknown caster type "' + param1 + '"')
            return true
        }
        //checkParam 2
        n = StringLength(name) + StringLength(param1) + 4
        str = SubStringBJ(cmd, n, StringLength(cmd))
        //apply command
        getUdgCasterTypes().get(param1)?.setAnimation(str)
        Text.mkP(escaper.getPlayer(), 'caster animation changed')
        return true
    }

    //-createCaster(crc) <casterLabel> [<facingAngle>]
    if (name === 'createCaster' || name === 'crc') {
        if (nbParam < 1 || nbParam > 2) {
            return true
        }
        //checkParam 1
        if (!getUdgCasterTypes().isLabelAlreadyUsed(param1)) {
            Text.erP(escaper.getPlayer(), 'unknown caster type "' + param1 + '"')
            return true
        }
        //checkParam2
        if (nbParam === 2) {
            if (S2R(param2) === 0 && param2 !== '0') {
                Text.erP(escaper.getPlayer(), 'wrong angle value ; should be a real (-1 for random angle)')
                return true
            }
            x = S2R(param2)
        } else {
            x = -1
        }
        //apply command
        const casterType = getUdgCasterTypes().get(param1)
        casterType && escaper.makeCreateCaster(casterType, x)
        Text.mkP(escaper.getPlayer(), 'casters making on')
        return true
    }

    //-deleteCastersBetweenPoints(delcbp)   --> delete casters in a rectangle formed with two clicks
    if (name === 'deleteCastersBetweenPoints' || name === 'delcbp') {
        if (noParam) {
            escaper.makeDeleteCasters('twoClics')
            Text.mkP(escaper.getPlayer(), 'casters deleting on')
        }
        return true
    }

    //-deleteCaster(delc)   --> delete the casters clicked by the player
    if (name === 'deleteCaster' || name === 'delc') {
        if (noParam) {
            escaper.makeDeleteCasters('oneByOne')
            Text.mkP(escaper.getPlayer(), 'casters deleting on')
        }
        return true
    }

    //-displayCasters(dc) [<casterLabel>]
    if (name === 'displayCasters' || name === 'dc') {
        if (!(nbParam <= 1)) {
            return true
        }
        if (nbParam === 1) {
            if (getUdgCasterTypes().isLabelAlreadyUsed(param1)) {
                getUdgCasterTypes().get(param1)?.displayForPlayer(escaper.getPlayer())
            } else {
                Text.erP(escaper.getPlayer(), 'unknown caster type')
            }
        } else {
            getUdgCasterTypes().displayForPlayer(escaper.getPlayer())
        }
        return true
    }

    //-createClearMob(crcm) <disableDuration>
    if (name === 'createClearMob' || name === 'crcm') {
        if (!(nbParam === 1)) {
            return true
        }
        x = S2R(param1)
        if (x !== 0 && (x > CLEAR_MOB_MAX_DURATION || x < FRONT_MONTANT_DURATION)) {
            Text.erP(
                escaper.getPlayer(),
                'the disable duration must be a real between ' +
                    R2S(FRONT_MONTANT_DURATION) +
                    ' and ' +
                    R2S(CLEAR_MOB_MAX_DURATION)
            )
            return true
        }
        escaper.makeCreateClearMobs(x)
        Text.mkP(escaper.getPlayer(), 'clear mob making on')
        return true
    }

    //-deleteClearMob(delcm)
    if (name === 'deleteClearMob' || name === 'delcm') {
        if (!noParam) {
            return true
        }
        escaper.makeDeleteClearMobs()
        Text.mkP(escaper.getPlayer(), 'clear mobs deleting on')
        return true
    }

    //-createPortalMob(crpm) <freezeDuration>
    if (name === 'createPortalMob' || name === 'crpm') {
        if (!(nbParam === 1)) {
            return true
        }
        x = S2R(param1)
        if (x !== 0 && (x > PORTAL_MOB_MAX_FREEZE_DURATION || x < 0)) {
            Text.erP(
                escaper.getPlayer(),
                'the disable duration must be a real between ' + R2S(0) + ' and ' + R2S(PORTAL_MOB_MAX_FREEZE_DURATION)
            )
            return true
        }
        escaper.makeCreatePortalMobs(x)
        Text.mkP(escaper.getPlayer(), 'portal mob making on')
        return true
    }

    //-deletePortalMob(delpm)
    if (name === 'deletePortalMob' || name === 'delpm') {
        if (!noParam) {
            return true
        }
        escaper.makeDeletePortalMobs()
        Text.mkP(escaper.getPlayer(), 'portal mobs deleting on')
        return true
    }

    //-getTerrainCliffClass(gettcc) <terrainLabel>
    if (name === 'getTerrainCliffClass' || name === 'gettcc') {
        if (nbParam !== 1) {
            return true
        }
        //checkParam 1
        const terrainType = getUdgTerrainTypes().get(param1)
        b = !!terrainType
        if (!b) {
            return true
        }

        //apply command
        terrainType &&
            Text.mkP(escaper.getPlayer(), 'cliff class for that terrain is ' + I2S(terrainType.getCliffClassId()))
        return true
    }

    //-getMainTileset
    if (name === 'getMainTileset') {
        if (!noParam) {
            return true
        }
        if (getUdgTerrainTypes().getMainTileset() == 'auto') {
            Text.mkP(escaper.getPlayer(), 'main tile: auto')
        } else {
            Text.mkP(
                escaper.getPlayer(),
                'main tile: ' +
                    getUdgTerrainTypes().getMainTileset() +
                    ' = ' +
                    tileset2tilesetString(getUdgTerrainTypes().getMainTileset())
            )
        }
        return true
    }

    // -setClickGrid <value>
    if ((name === 'setClickGrid' || name === 'setcg') && nbParam === 1) {
        escaper.roundToGrid = S2I(param1) > 1 && S2I(param1) <= 128 ? S2I(param1) : null

        if (escaper.roundToGrid) {
            Text.mkP(escaper.getPlayer(), `Now rounding clicks to: '${escaper.roundToGrid}'`)
        } else {
            Text.erP(escaper.getPlayer(), `Disabled rounding clicks`)
        }

        return true
    }

    return false
}
