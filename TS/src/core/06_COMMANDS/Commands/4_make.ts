import { String2Ascii } from '../../01_libraries/Ascii'
import {
    arrayPush,
    convertAngleToDirection,
    convertTextToAngle,
    GetCurrentMonsterPlayer,
    IsBoolString,
    S2B,
    tileset2tilesetString,
} from '../../01_libraries/Basic_functions'
import { Constants } from '../../01_libraries/Constants'
import { udg_colorCode } from '../../01_libraries/Init_colorCodes'
import { Text } from '../../01_libraries/Text'
import { Level } from '../../04_STRUCTURES/Level/Level'
import { IMMOLATION_SKILLS } from '../../04_STRUCTURES/Monster/Immolation_skills'
import { ABILITY_ANNULER_VISION } from '../../04_STRUCTURES/Monster/Monster_functions'
import { MonsterMultiplePatrols } from '../../04_STRUCTURES/Monster/MonsterMultiplePatrols'
import { MonsterNoMove } from '../../04_STRUCTURES/Monster/MonsterNoMove'
import { MonsterSimplePatrol } from '../../04_STRUCTURES/Monster/MonsterSimplePatrol'
import { MonsterType } from '../../04_STRUCTURES/Monster/MonsterType'
import { PORTAL_MOB_MAX_FREEZE_DURATION } from '../../04_STRUCTURES/Monster_properties/PortalMob'
import { DEATH_TERRAIN_MAX_TOLERANCE, TerrainTypeDeath } from '../../04_STRUCTURES/TerrainType/TerrainTypeDeath'
import { TerrainTypeSlide } from '../../04_STRUCTURES/TerrainType/TerrainTypeSlide'
import { TerrainTypeWalk } from '../../04_STRUCTURES/TerrainType/TerrainTypeWalk'
import { ExchangeTerrains } from '../../07_TRIGGERS/Triggers_to_modify_terrains/Exchange_terrains'
import { RandomizeTerrains } from '../../07_TRIGGERS/Triggers_to_modify_terrains/Randomize_terrains'
import { ServiceManager } from '../../../Services'
import { createPoint } from '../../../Utils/Point'
import { getUdgCasterTypes, getUdgLevels, getUdgMonsterTypes, getUdgTerrainTypes, globals } from '../../../../globals'
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
import { HERO_ROTATION_SPEED } from '../../07_TRIGGERS/Slide_and_CheckTerrain_triggers/SlidingMax'
import { ChangeAllTerrains } from '../../07_TRIGGERS/Triggers_to_modify_terrains/Change_all_terrains'
import { ChangeOneTerrain } from '../../07_TRIGGERS/Triggers_to_modify_terrains/Change_one_terrain'
import { CmdParam } from '../Helpers/Command_functions'

export const initExecuteCommandMake = () => {
    const { registerCommand } = ServiceManager.getService('Cmd')

    //-newWalk(neww) <label> <terrainType> [<walkSpeed>]   --> add a new kind of walk terrain
    registerCommand({
        name: 'newWalk',
        alias: ['neww'],
        group: 'make',
        argDescription: '<label> <terrainType> [<walkSpeed>]',
        description: 'Add a new kind of walk terrain',
        cb: ({ nbParam, param1, param2, param3 }, escaper) => {
            if (nbParam < 2 || nbParam > 3) {
                return true
            }

            let speed = 0

            if (nbParam === 3) {
                if (!IsPositiveInteger(param3) || S2R(param3) > 522) {
                    Text.erP(escaper.getPlayer(), 'wrong speed value, should be a real between 0 and 522')
                    return true
                }
                speed = S2R(param3)
            } else {
                speed = Constants.HERO_WALK_SPEED
            }

            getUdgTerrainTypes().newWalk(param1, TerrainTypeFromString.TerrainTypeString2TerrainTypeId(param2), speed)

            Text.mkP(escaper.getPlayer(), 'New terrain type "' + param1 + '" added')

            return true
        },
    })

    //-newDeath(newd) <label> <terrainType> [<killingEffect> [<terrainTimeToKill>]]   --> add a new kind of death terrain
    registerCommand({
        name: 'newDeath',
        alias: ['newd'],
        group: 'make',
        argDescription: '<label> <terrainType> [<killingEffect> [<terrainTimeToKill>]]',
        description: 'Add a new kind of death terrain',
        cb: ({ nbParam, param1, param2, param3, param4 }, escaper) => {
            if (nbParam < 2 || nbParam > 4) {
                return true
            }

            let str = ''
            let x = 0

            if (nbParam >= 3) {
                str = param3
            } else {
                str = ''
            }
            if (nbParam === 4) {
                if (param4 !== '0' && S2R(param4) === 0) {
                    return true
                }
                x = S2R(param4)
            } else {
                x = Constants.TERRAIN_DEATH_TIME_TO_KILL
            }

            getUdgTerrainTypes().newDeath(
                param1,
                TerrainTypeFromString.TerrainTypeString2TerrainTypeId(param2),
                str,
                x,
                0
            )

            Text.mkP(escaper.getPlayer(), 'New terrain type "' + param1 + '" added')

            return true
        },
    })

    //-newSlide(news) <label> <terrainType> [<slideSpeed> [<canTurn>]]   --> add a new kind of slide terrain
    registerCommand({
        name: 'newSlide',
        alias: ['news'],
        group: 'make',
        argDescription: '<label> <terrainType> [<slideSpeed> [<canTurn>]]',
        description: 'Add a new kind of slide terrain',
        cb: ({ nbParam, param1, param2, param3, param4 }, escaper) => {
            if (nbParam < 2 || nbParam > 4) {
                return true
            }

            let speed = 0
            let b = false

            if (nbParam >= 3) {
                if (!IsInteger(param3)) {
                    Text.erP(escaper.getPlayer(), 'the slide speed must be an integer')
                    return true
                }
                speed = S2R(param3)
            } else {
                speed = Constants.HERO_SLIDE_SPEED
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

            getUdgTerrainTypes().newSlide(
                param1,
                TerrainTypeFromString.TerrainTypeString2TerrainTypeId(param2),
                speed,
                b
            )

            Text.mkP(escaper.getPlayer(), 'New terrain type "' + param1 + '" added')

            return true
        },
    })

    //-setTerrainLabel(settl) <oldTerrainLabel> <newTerrainLabel>
    registerCommand({
        name: 'setTerrainLabel',
        alias: ['settl'],
        group: 'make',
        argDescription: '<oldTerrainLabel> <newTerrainLabel>',
        description: 'Change the label of a terrain type',
        cb: ({ nbParam, param1, param2 }, escaper) => {
            if (!(nbParam === 2)) {
                return true
            }
            let b = !!getUdgTerrainTypes().getByLabel(param1)
            if (b) {
                b = !getUdgTerrainTypes().isLabelAlreadyUsed(param2)
            }
            if (b) {
                getUdgTerrainTypes().getByLabel(param1)?.setLabel(param2)
                Text.mkP(escaper.getPlayer(), 'label changed to "' + param2 + '"')
            } else {
                Text.erP(escaper.getPlayer(), 'impossible to change label')
            }
            return true
        },
    })

    //-setTerrainAlias(setta) <terrainLabel> <alias>   --> an alias is a shortcut which can be used like a label
    registerCommand({
        name: 'setTerrainAlias',
        alias: ['setta'],
        group: 'make',
        argDescription: '<terrainLabel> <alias>',
        description: 'An alias is a shortcut which can be used like a label',
        cb: ({ nbParam, param1, param2 }, escaper) => {
            if (!(nbParam === 2)) {
                return true
            }
            let b = !!getUdgTerrainTypes().getByLabel(param1)
            if (b) {
                b = !getUdgTerrainTypes().isLabelAlreadyUsed(param2)
            }
            if (b) {
                getUdgTerrainTypes().getByLabel(param1)?.setAlias(param2)
                Text.mkP(escaper.getPlayer(), 'Alias changed to "' + param2 + '"')
            } else {
                Text.erP(escaper.getPlayer(), 'Impossible to change alias')
            }
            return true
        },
    })

    //-setTerrainWalkSpeed(settws) <walkTerrainLabel> <walkSpeed>   --> max walk speed : 522
    registerCommand({
        name: 'setTerrainWalkSpeed',
        alias: ['settws'],
        group: 'make',
        argDescription: '<walkTerrainLabel> <walkSpeed>',
        description: 'Max walk speed : 522',
        cb: ({ nbParam, param1, param2 }, escaper) => {
            if (!(nbParam === 2)) {
                return true
            }
            const terrainType = getUdgTerrainTypes().getByLabel(param1)
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
        },
    })

    //-setTerrainKillEffect(settke) <deathTerrainLabel> <killingEffect>   --> special effect appearing when a hero touch the death terrain
    registerCommand({
        name: 'setTerrainKillEffect',
        alias: ['settke'],
        group: 'make',
        argDescription: '<deathTerrainLabel> <killingEffect>',
        description: 'Special effect appearing when a hero touch the death terrain',
        cb: ({ nbParam, param1, param2 }, escaper) => {
            if (!(nbParam === 2)) {
                return true
            }
            const terrainType = getUdgTerrainTypes().getByLabel(param1)
            if (!terrainType) {
                Text.erP(escaper.getPlayer(), 'Unknown terrain')
                return true
            }
            if (!(terrainType instanceof TerrainTypeDeath)) {
                Text.erP(escaper.getPlayer(), 'The terrain must be of death type')
                return true
            }
            terrainType.setKillingEffectStr(param2)
            Text.mkP(escaper.getPlayer(), 'Terrain kill effect changed')
            return true
        },
    })

    //-setTerrainKillDelay(settkd) <deathTerrainLabel> <killingDelay>   --> time before which the hero dies when he touch the death terrain
    registerCommand({
        name: 'setTerrainKillDelay',
        alias: ['settkd'],
        group: 'make',
        argDescription: '<deathTerrainLabel> <killingDelay>',
        description: 'Time before which the hero dies when he touch the death terrain',
        cb: ({ nbParam, param1, param2 }, escaper) => {
            if (!(nbParam === 2)) {
                return true
            }
            const terrainType = getUdgTerrainTypes().getByLabel(param1)
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
        },
    })

    //-setTerrainKillTolerance(settkt) <deathTerrainLabel> <tolerance dist>   --> max distance to the closest non death terrain, where heroes won't die
    registerCommand({
        name: 'setTerrainKillTolerance',
        alias: ['settkt'],
        group: 'make',
        argDescription: '<deathTerrainLabel> <tolerance dist>',
        description: "max distance to the closest non death terrain, where heroes won't die",
        cb: ({ nbParam, param1, param2 }, escaper) => {
            if (!(nbParam === 2)) {
                return true
            }
            const terrainType = getUdgTerrainTypes().getByLabel(param1)
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
        },
    })

    //-setTerrainSlideSpeed(settss) <slideTerrainLabel> <slideSpeed>
    registerCommand({
        name: 'setTerrainSlideSpeed',
        alias: ['settss'],
        group: 'make',
        argDescription: '<slideTerrainLabel> <slideSpeed>',
        description: 'Max slide speed : 522',
        cb: ({ nbParam, param1, param2 }, escaper) => {
            if (!(nbParam === 2)) {
                return true
            }
            const terrainType = getUdgTerrainTypes().getByLabel(param1)
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
        },
    })

    //-setTerrainRotationSpeed(settrs) <slideTerrainLabel> <rotationSpeed>
    registerCommand({
        name: 'setTerrainRotationSpeed',
        alias: ['settrs'],
        group: 'make',
        argDescription: '<slideTerrainLabel> <rotationSpeed>',
        description:
            'You have to specify rounds per second. Example : 1.3. Normal speed is 1; You can specify "default" | "d".',
        cb: ({ nbParam, param1, param2 }, escaper) => {
            if (!(nbParam === 2)) {
                return true
            }
            const terrainType = getUdgTerrainTypes().getByLabel(param1)
            if (!terrainType) {
                Text.erP(escaper.getPlayer(), 'unknown terrain')
                return true
            }
            if (!(terrainType instanceof TerrainTypeSlide)) {
                Text.erP(escaper.getPlayer(), 'the terrain must be of slide type')
                return true
            }

            let speed: number
            if (param2 == 'd' || param2 == 'default') {
                speed = HERO_ROTATION_SPEED
            } else if (S2R(param2) <= 0) {
                Text.erP(escaper.getPlayer(), 'the rotation speed must be positive')
                return true
            } else {
                speed = S2R(param2)
            }

            terrainType.setRotationSpeed(speed)
            Text.mkP(escaper.getPlayer(), 'terrain rotation speed changed')
            return true
        },
    })

    //-setTerrainGravity(settg) <terrainLabel> <gravity>
    registerCommand({
        name: 'setTerrainGravity',
        alias: ['settg'],
        group: 'make',
        argDescription: '<terrainLabel> <gravity>',
        description: '',
        cb: ({ nbParam, param1, param2 }, escaper) => {
            if (!(nbParam === 2) || (S2R(param2) === 0 && param2 !== '0')) {
                return true
            }

            const terrainType = getUdgTerrainTypes().getByLabel(param1)

            if (!terrainType) {
                Text.erP(escaper.getPlayer(), 'unknown terrain')
                return true
            }

            terrainType.setGravity(S2R(param2))
            Text.mkP(escaper.getPlayer(), 'terrain gravity changed')
            return true
        },
    })

    //-setTerrainCanTurn(settct) <slideTerrainLabel> <canTurn>
    registerCommand({
        name: 'setTerrainCanTurn',
        alias: ['settct'],
        group: 'make',
        argDescription: '<slideTerrainLabel> <canTurn>',
        description: 'Can the hero turn when he slide on the terrain',
        cb: ({ nbParam, param1, param2 }, escaper) => {
            if (!(nbParam === 2)) {
                return true
            }
            const terrainType = getUdgTerrainTypes().getByLabel(param1)
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
        },
    })

    //-changeTerrain(cht) <terrainLabel> <newTerrainType>   --> examples of terrain types : 'Nice', 46
    registerCommand({
        name: 'changeTerrain',
        alias: ['cht'],
        group: 'make',
        argDescription: '<terrainLabel> <newTerrainType>',
        description: "change the terrain type of a terrain, examples of terrain types : 'Nice', 46",
        cb: ({ nbParam, param1, param2 }, escaper) => {
            if (!(nbParam === 2)) {
                return true
            }
            Text.DisplayLineToPlayer(escaper.getPlayer())
            const str = ChangeOneTerrain.ChangeOneTerrain(param1, param2)
            if (str !== null) {
                Text.mkP(escaper.getPlayer(), 'changed to ' + udg_colorCode[Constants.RED] + str)
            } else {
                Text.erP(escaper.getPlayer(), "couldn't change terrain")
            }
            return true
        },
    })

    //-changeAllTerrains(chat) [known(k)|notKnown(nk)]
    registerCommand({
        name: 'changeAllTerrains',
        alias: ['chat'],
        group: 'make',
        argDescription: '[known(k)|notKnown(nk)]',
        description: 'Change all terrains to a random terrain type, or to a terrain type known to the player',
        cb: ({ noParam, nbParam, param1 }, escaper) => {
            let str = ''

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
        },
    })

    //-changeAllTerrainsAtRevive(chatar) <boolean change>
    registerCommand({
        name: 'changeAllTerrainsAtRevive',
        alias: ['chatar'],
        group: 'make',
        argDescription: '<boolean change>',
        description: 'Change all terrains to a random terrain type',
        cb: ({ nbParam, param1 }, escaper) => {
            if (
                nbParam === 1 &&
                IsBoolString(param1) &&
                S2B(param1) !== ChangeAllTerrains.udg_changeAllTerrainsAtRevive
            ) {
                ChangeAllTerrains.udg_changeAllTerrainsAtRevive = S2B(param1)
                Text.mkP(escaper.getPlayer(), 'change all terrains at revive ' + StringCase(param1, true))
            }
            return true
        },
    })

    //-exchangeTerrains(excht) [<terrainLabelA> <terrainLabelB>]   --> without parameter, click on the terrains to exchange them
    registerCommand({
        name: 'exchangeTerrains',
        alias: ['excht'],
        group: 'make',
        argDescription: '[<terrainLabelA> <terrainLabelB>]',
        description: 'Exchange two terrains, without parameter, click on the terrains to exchange them',
        cb: ({ noParam, nbParam, param1, param2 }, escaper) => {
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
        },
    })

    //-randomizeTerrains(rdmt)
    registerCommand({
        name: 'randomizeTerrains',
        alias: ['rdmt'],
        group: 'make',
        argDescription: '',
        description: 'Randomize terrains',
        cb: ({ noParam }) => {
            if (noParam) {
                RandomizeTerrains.RandomizeTerrains()
            }
            return true
        },
    })

    //-createTerrain(crt) <terrainLabel> [<brushSize> [<shape>]]  --> create the terrain on the map, by clicking
    registerCommand({
        name: 'createTerrain',
        alias: ['crt'],
        group: 'make',
        argDescription: '<terrainLabel> [<brushSize> [<shape>]',
        description: 'Create the terrain on the map, by clicking',
        cb: ({ nbParam, param1, param2, param3 }, escaper) => {
            if (nbParam < 1 || nbParam > 3) {
                return true
            }

            const terrainType = getUdgTerrainTypes().getByLabel(param1)
            if (!terrainType) {
                Text.erP(escaper.getPlayer(), 'terrain "' + param1 + '" doesn\'t exist')
            } else {
                if (nbParam > 1) {
                    //brush mode
                    //param2 : brush size
                    const brushSize = S2I(param2)
                    if (brushSize < 1 || brushSize > 8) {
                        Text.erP(escaper.getPlayer(), 'brush size has to be between 1 and 8')
                    } else {
                        let shape: 'circle' | 'square' = 'square'
                        if (param3 == 'circle' || param3 == 'c') {
                            shape = 'circle'
                        }
                        escaper.makeCreateTerrainBrush(terrainType, brushSize, shape)
                    }
                } else {
                    //classic two clicks mode
                    escaper.makeCreateTerrain(terrainType)
                }
                Text.mkP(escaper.getPlayer(), 'creating terrain on')
            }
            return true
        },
    })

    //-setBrushSize <brushSize>
    registerCommand({
        name: 'setBrushSize',
        alias: ['setbs'],
        group: 'make',
        argDescription: '<brushSize>',
        description: 'Sets the brush size',
        cb: ({ nbParam, param1 }, escaper) => {
            if (nbParam != 1) {
                return true
            }

            const brushSize = S2I(param1)
            if (brushSize < 1 || brushSize > 8) {
                Text.erP(escaper.getPlayer(), 'brush size has to be between 1 and 8')
            } else {
                escaper.setBrushSize(brushSize)
                Text.mkP(escaper.getPlayer(), 'brush size set')
            }

            return true
        },
    })

    //-setGumTerrain <terrainLabel>
    registerCommand({
        name: 'setGumTerrain',
        alias: ['setgt'],
        group: 'make',
        argDescription: '<terrainLabel>',
        description: 'Sets the gum terrain',
        cb: ({ nbParam, param1 }, escaper) => {
            if (nbParam != 1) {
                return true
            }

            const terrainType = getUdgTerrainTypes().getByLabel(param1)
            if (!terrainType) {
                Text.erP(escaper.getPlayer(), 'terrain "' + param1 + '" doesn\'t exist')
            } else {
                escaper.setGumTerrain(terrainType)
                Text.mkP(escaper.getPlayer(), 'gum terrain set')
            }

            return true
        },
    })

    //-setGumBrushSize <brushSize>
    registerCommand({
        name: 'setGumBrushSize',
        alias: ['setgbs'],
        group: 'make',
        argDescription: '<brushSize>',
        description: 'Set the gum brush size',
        cb: ({ nbParam, param1 }, escaper) => {
            if (nbParam != 1) {
                return true
            }

            const brushSize = S2I(param1)
            if (brushSize < 1 || brushSize > 8) {
                Text.erP(escaper.getPlayer(), 'brush size has to be between 1 and 8')
            } else {
                escaper.setGumBrushSize(brushSize)
                Text.mkP(escaper.getPlayer(), 'gum brush size set')
            }

            return true
        },
    })

    //-copyPasteTerrain(cpt)   --> copy paste a rectangle of terrain on the map
    registerCommand({
        name: 'copyPasteTerrain',
        alias: ['cpt'],
        group: 'make',
        argDescription: '',
        description: 'Copy paste a rectangle of terrain on the map',
        cb: ({ noParam }, escaper) => {
            if (noParam) {
                escaper.makeTerrainCopyPaste()
                Text.mkP(escaper.getPlayer(), 'copy/paste terrain on')
            }
            return true
        },
    })

    //-verticalSymmetryTerrain(vst)   --> transform a rectangle of terrain by a vertical symmetry
    registerCommand({
        name: 'verticalSymmetryTerrain',
        alias: ['vst'],
        group: 'make',
        argDescription: '',
        description: 'Transform a rectangle of terrain by a vertical symmetry',
        cb: ({ noParam }, escaper) => {
            if (noParam) {
                escaper.makeTerrainVerticalSymmetry()
                Text.mkP(escaper.getPlayer(), 'vertical symmetry terrain on')
            }
            return true
        },
    })

    //-horizontalSymmetryTerrain(hst)   --> transform a rectangle of terrain by an horizontal symmetry
    registerCommand({
        name: 'horizontalSymmetryTerrain',
        alias: ['hst'],
        group: 'make',
        argDescription: '',
        description: 'Transform a rectangle of terrain by an horizontal symmetry',
        cb: ({ noParam }, escaper) => {
            if (noParam) {
                escaper.makeTerrainHorizontalSymmetry()
                Text.mkP(escaper.getPlayer(), 'horizontal symmetry terrain on')
            }
            return true
        },
    })

    //-terrainHeight(th) [<terrainRadius> [<height>]]   --> apply a terrain height at chosen places ; default radius 100, default height 100
    registerCommand({
        name: 'terrainHeight',
        alias: ['th'],
        group: 'make',
        argDescription: ' [<terrainRadius> [<height>]]',
        description: 'Apply a terrain height at chosen places ; default radius 100, default height 100',
        cb: ({ nbParam, param1, param2 }, escaper) => {
            if (!(nbParam <= 2)) {
                return true
            }

            let x = 0
            let y = 0

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
        },
    })

    //-displayTerrains(dt) [<terrainLabel>] [page]   --> displays the characteristics of the terrains added by the maker(s)
    registerCommand({
        name: 'displayTerrains',
        alias: ['dt'],
        group: 'make',
        argDescription: ' [<terrainLabel>] [page]',
        description: 'Displays the characteristics of the terrains added by the maker(s)',
        cb: ({ cmd }, escaper) => {
            getUdgTerrainTypes().displayPaginatedForPlayer(escaper.getPlayer(), cmd)
            return true
        },
    })

    //-newMonster(newm) <label> <unitTypeId> [<immolationRadius> [<speed> [<scale> [<isClickable>]]]]
    registerCommand({
        name: 'newMonster',
        alias: ['newm'],
        group: 'make',
        argDescription: '<label> <unitTypeId> [<immolationRadius> [<speed> [<scale> [<isClickable>]]]]',
        description: 'Add a new monster',
        cb: ({ cmd, nbParam, param1, param2, param3 }, escaper) => {
            if (nbParam < 2 || nbParam > 6) {
                return true
            }
            //checkParam1
            if (getUdgMonsterTypes().isLabelAlreadyUsed(param1)) {
                Text.erP(escaper.getPlayer(), 'Label "' + param1 + '" already used')
                return true
            }
            //checkParam2
            if (
                !(StringLength(param2) === 6 && SubStringBJ(param2, 1, 1) === "'" && SubStringBJ(param2, 6, 6) === "'")
            ) {
                Text.erP(escaper.getPlayer(), "Wrong unit type id (exemple : 'hfoo')")
                return true
            }

            let str = ''

            let immoRadius = 0
            let speed = Constants.DEFAULT_MONSTER_SPEED
            let scale = -1
            let clickable = false

            //checkParam3
            if (nbParam >= 3) {
                immoRadius = S2I(param3)
                if (immoRadius !== 0 && !IMMOLATION_SKILLS[immoRadius]) {
                    Text.erP(
                        escaper.getPlayer(),
                        'Wrong immolation radius ; should be an integer divisible by 5 and between 0 and 400'
                    )
                    return true
                }

                //checkParam4
                if (nbParam >= 4) {
                    str = CmdParam(cmd, 4)
                    if (!IsPositiveInteger(str) || S2I(str) > Constants.MAX_MOVE_SPEED) {
                        Text.erP(
                            escaper.getPlayer(),
                            'Wrong speed value ; should be a positive integer between 0 and 522'
                        )
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
                        if (str !== 'default' && str !== 'd') {
                            scale = S2R(str)
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
                            clickable = S2B(str)
                        }
                    }
                }
            }

            getUdgMonsterTypes().new(
                param1,
                String2Ascii(SubStringBJ(param2, 2, 5)),
                scale,
                immoRadius,
                speed,
                clickable
            )

            Text.mkP(escaper.getPlayer(), 'Monster type "' + param1 + '" created')

            return true
        },
    })

    //-setMonsterLabel(setml) <oldMonsterLabel> <newMonsterLabel>
    registerCommand({
        name: 'setMonsterLabel',
        alias: ['setml'],
        group: 'make',
        argDescription: '<oldMonsterLabel> <newMonsterLabel>',
        description: 'Change the label of a monster',
        cb: ({ nbParam, param1, param2 }, escaper) => {
            if (!(nbParam === 2)) {
                return true
            }
            let b = !!getUdgMonsterTypes().getByLabel(param1)
            if (b) {
                b = !getUdgMonsterTypes().isLabelAlreadyUsed(param2)
            }
            if (b) {
                getUdgMonsterTypes().getByLabel(param1)?.setLabel(param2)
                Text.mkP(escaper.getPlayer(), 'label changed to "' + param2 + '"')
            } else {
                Text.erP(escaper.getPlayer(), 'impossible to change label')
            }
            return true
        },
    })

    //-setMonsterAlias(setma) <monsterLabel> <alias>
    registerCommand({
        name: 'setMonsterAlias',
        alias: ['setma'],
        group: 'make',
        argDescription: '<monsterLabel> <alias>',
        description: 'Change the alias of a monster',
        cb: ({ nbParam, param1, param2 }, escaper) => {
            if (!(nbParam === 2)) {
                return true
            }
            let b = !!getUdgMonsterTypes().getByLabel(param1)
            if (b) {
                b = !getUdgMonsterTypes().isLabelAlreadyUsed(param2)
            }
            if (b) {
                getUdgMonsterTypes().getByLabel(param1)?.setAlias(param2)
                Text.mkP(escaper.getPlayer(), 'alias changed to "' + param2 + '"')
            } else {
                Text.erP(escaper.getPlayer(), 'impossible to change alias')
            }
            return true
        },
    })

    //-setMonsterUnit(setmu) <monsterLabel> <unitType>   --> example of unit type : 'ewsp'
    registerCommand({
        name: 'setMonsterUnit',
        alias: ['setmu'],
        group: 'make',
        argDescription: '<monsterLabel> <unitType>',
        description: 'Change the unit type of a monster',
        cb: ({ nbParam, param1, param2 }, escaper) => {
            if (!(nbParam === 2)) {
                return true
            }
            //checkParam1
            if (!getUdgMonsterTypes().isLabelAlreadyUsed(param1)) {
                Text.erP(escaper.getPlayer(), 'unknown monster type')
                return true
            }
            //checkParam2
            if (
                !(StringLength(param2) === 6 && SubStringBJ(param2, 1, 1) === "'" && SubStringBJ(param2, 6, 6) === "'")
            ) {
                Text.erP(escaper.getPlayer(), "wrong unit type id (exemple : 'hfoo')")
                return true
            }
            if (
                getUdgMonsterTypes()
                    .getByLabel(param1)
                    ?.setUnitTypeId(String2Ascii(SubStringBJ(param2, 2, 5)))
            ) {
                Text.mkP(escaper.getPlayer(), 'unit type changed')
            } else {
                Text.erP(escaper.getPlayer(), "this unit type doesn't exist")
            }
            return true
        },
    })

    //-setMonsterImmolation(setmi) <monsterLabel> <immolationRadius>   --> immolation between 5 and 400, divisible by 5
    registerCommand({
        name: 'setMonsterImmolation',
        alias: ['setmi'],
        group: 'make',
        argDescription: '<monsterLabel> <immolationRadius>',
        description: 'Change the immolation radius of a monster',
        cb: ({ nbParam, param1, param2 }, escaper) => {
            if (!(nbParam === 2)) {
                return true
            }
            //checkParam1
            if (!getUdgMonsterTypes().isLabelAlreadyUsed(param1)) {
                Text.erP(escaper.getPlayer(), 'unknown monster type')
                return true
            }
            //checkParam2
            const x = S2I(param2)
            if (x !== 0 && !IMMOLATION_SKILLS[x]) {
                Text.erP(
                    escaper.getPlayer(),
                    'wrong immolation radius ; should be an integer divisible by 5 and between 0 and 400'
                )
                return true
            }
            if (getUdgMonsterTypes().getByLabel(param1)?.setImmolation(x)) {
                Text.mkP(escaper.getPlayer(), 'immolation changed')
            } else {
                Text.erP(escaper.getPlayer(), "couldn't change immolation")
            }
            return true
        },
    })

    //-setMonsterMoveSpeed(setmms) <monsterLabel> <speed>
    registerCommand({
        name: 'setMonsterMoveSpeed',
        alias: ['setmms'],
        group: 'make',
        argDescription: '<monsterLabel> <speed>',
        description: 'Change the move speed of a monster',
        cb: ({ nbParam, param1, param2 }, escaper) => {
            if (!(nbParam === 2)) {
                return true
            }
            //checkParam1
            if (!getUdgMonsterTypes().isLabelAlreadyUsed(param1)) {
                Text.erP(escaper.getPlayer(), 'unknown monster type')
                return true
            }
            //checkParam2
            if (!IsPositiveInteger(param2) || S2I(param2) > Constants.MAX_MOVE_SPEED) {
                Text.erP(escaper.getPlayer(), 'wrong speed value ; should be a positive integer between 0 and 522')
                return true
            }
            if (getUdgMonsterTypes().getByLabel(param1)?.setUnitMoveSpeed(S2R(param2))) {
                Text.mkP(escaper.getPlayer(), 'move speed changed')
            } else {
                Text.erP(escaper.getPlayer(), "couldn't change move speed")
            }
            return true
        },
    })

    //-setMonsterScale(setms) <monsterLabel> <scale>   --> affects the size of this kind of monster
    registerCommand({
        name: 'setMonsterScale',
        alias: ['setms'],
        group: 'make',
        argDescription: '<monsterLabel> <scale>',
        description: 'Change the scale of a monster',
        cb: ({ nbParam, param1, param2 }, escaper) => {
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

            let x = 0

            if (param2 === 'default' || param2 === 'd') {
                x = -1
            } else {
                x = S2R(param2)
            }
            if (getUdgMonsterTypes().getByLabel(param1)?.setScale(x)) {
                Text.mkP(escaper.getPlayer(), 'scale changed')
            } else {
                Text.erP(escaper.getPlayer(), "couldn't change scale, probably because the old value is the same")
            }
            return true
        },
    })

    //-setMonsterCreateTerrain(setmct) <monsterLabel> <terrainLabel>   --> Create terrain
    registerCommand({
        name: 'setMonsterCreateTerrain',
        alias: ['setmct'],
        group: 'make',
        argDescription: '<monsterLabel> <terrainLabel>',
        description: 'Change the scale of a monster',
        cb: ({ nbParam, param1, param2 }, escaper) => {
            if (!(nbParam === 2)) {
                return true
            }

            const monsterType = getUdgMonsterTypes().getByLabel(param1)

            //checkParam1
            if (!monsterType) {
                Text.erP(escaper.getPlayer(), 'unknown monster type')
                return true
            }

            //checkParam2
            if (!getUdgTerrainTypes().getByLabel(param2)) {
                monsterType.setCreateTerrainLabel(undefined)
                Text.mkP(escaper.getPlayer(), 'Create terrain disabled')
                return true
            }

            monsterType.setCreateTerrainLabel(param2)
            Text.mkP(escaper.getPlayer(), `Create terrain changed to: ${param2}`)
            return true
        },
    })

    //-setMonsterClickable(setmc) <monsterLabel> <boolean clickable>   --> sets if locust or not for this kind of monster
    registerCommand({
        name: 'setMonsterClickable',
        alias: ['setmc'],
        group: 'make',
        argDescription: '<monsterLabel> <boolean clickable>',
        description: 'Sets if locust or not for this kind of monster',
        cb: ({ nbParam, param1, param2 }, escaper) => {
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
            if (getUdgMonsterTypes().getByLabel(param1)?.setIsClickable(S2B(param2))) {
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
        },
    })

    //-setMonsterKillEffect(setmke) <monsterLabel> <killingEffect>
    registerCommand({
        name: 'setMonsterKillEffect',
        alias: ['setmke'],
        group: 'make',
        argDescription: '<monsterLabel> <killingEffect>',
        description: 'Sets the killing effect of a monster',
        cb: ({ nbParam, param1, param2 }, escaper) => {
            if (!(nbParam === 2)) {
                return true
            }
            //checkParam1
            if (!getUdgMonsterTypes().isLabelAlreadyUsed(param1)) {
                Text.erP(escaper.getPlayer(), 'unknown monster type')
                return true
            }
            getUdgMonsterTypes().getByLabel(param1)?.setKillingEffectStr(param2)
            Text.mkP(escaper.getPlayer(), 'kill effect changed for this monster type')
            return true
        },
    })

    //-setMonsterMeteorsToKill(setmmtk) <monsterLabel> <meteorNumber>
    registerCommand({
        name: 'setMonsterMeteorsToKill',
        alias: ['setmmtk'],
        group: 'make',
        argDescription: '<monsterLabel> <meteorNumber>',
        description: 'Sets the number of meteors to kill for this monster type',
        cb: ({ nbParam, param1, param2 }, escaper) => {
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
            getUdgMonsterTypes().getByLabel(param1)?.setNbMeteorsToKill(S2I(param2))
            Text.mkP(escaper.getPlayer(), 'number of meteors to kill changed for this monster type')
            return true
        },
    })

    //-setMonsterHeight(setmh) <monsterLabel> <height>|default|d
    registerCommand({
        name: 'setMonsterHeight',
        alias: ['setmh'],
        group: 'make',
        argDescription: '<monsterLabel> <height>|default|d',
        description: 'Sets the height of a monster',
        cb: ({ nbParam, param1, param2 }, escaper) => {
            if (!(nbParam === 2)) {
                return true
            }
            //checkParam1
            if (!getUdgMonsterTypes().isLabelAlreadyUsed(param1)) {
                Text.erP(escaper.getPlayer(), 'unknown monster type')
                return true
            }

            let x = 0

            //checkParam2
            if (param2 === 'default' || param2 === 'd') {
                x = -1
            } else if (S2R(param2) > 0 || param2 === '0') {
                x = S2R(param2)
            } else {
                Text.erP(escaper.getPlayer(), 'wrong height ; should be a positive real or "default" or "d"')
                return true
            }
            if (getUdgMonsterTypes().getByLabel(param1)?.setHeight(x)) {
                Text.mkP(escaper.getPlayer(), 'height changed for this monster type')
            } else {
                Text.erP(escaper.getPlayer(), 'the height is already to this value')
            }
            return true
        },
    })

    //-createMonsterImmobile(crmi) <monsterLabel> [<facingAngle>]   --> if facing angle not specified, random angles will be chosen
    registerCommand({
        name: 'createMonsterImmobile',
        alias: ['crmi'],
        group: 'make',
        argDescription: '<monsterLabel> [<facingAngle>]',
        description:
            'creates a monster at the current location, facing the specified angle (or random if not specified)',
        cb: ({ nbParam, param1, param2 }, escaper) => {
            if (nbParam < 1 || nbParam > 2) {
                return true
            }
            //checkParam1
            if (!getUdgMonsterTypes().isLabelAlreadyUsed(param1)) {
                Text.erP(escaper.getPlayer(), 'unknown monster type')
                return true
            }

            let x = 0

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

            const monsterType = getUdgMonsterTypes().getByLabel(param1)
            monsterType && escaper.makeCreateNoMoveMonsters(monsterType, x)

            Text.mkP(escaper.getPlayer(), 'monster making on')
            return true
        },
    })

    //-createMonster(crm) <monsterLabel>   --> simple patrols (2 locations)
    registerCommand({
        name: 'createMonster',
        alias: ['crm'],
        group: 'make',
        argDescription: '<monsterLabel>',
        description: 'Creates a monster at the current location, patrolling between 2 locations',
        cb: ({ nbParam, param1 }, escaper) => {
            if (!(nbParam === 1)) {
                return true
            }
            //checkParam1
            if (!getUdgMonsterTypes().isLabelAlreadyUsed(param1)) {
                Text.erP(escaper.getPlayer(), 'unknown monster type')
                return true
            }

            const monsterType = getUdgMonsterTypes().getByLabel(param1)
            monsterType && escaper.makeCreateSimplePatrolMonsters('normal', monsterType)

            Text.mkP(escaper.getPlayer(), 'monster making on')
            return true
        },
    })

    //-createMonsterString(crms) <monsterLabel>   --> simple patrols where the second loc of a monster is the first loc of the next one
    registerCommand({
        name: 'createMonsterString',
        alias: ['crms'],
        group: 'make',
        argDescription: '<monsterLabel>',
        description:
            'creates a monster at the current location, patrolling between 2 locations, where the second loc of a monster is the first loc of the next one',
        cb: ({ nbParam, param1 }, escaper) => {
            if (!(nbParam === 1)) {
                return true
            }
            //checkParam1
            if (!getUdgMonsterTypes().isLabelAlreadyUsed(param1)) {
                Text.erP(escaper.getPlayer(), 'unknown monster type')
                return true
            }

            const monsterType = getUdgMonsterTypes().getByLabel(param1)
            monsterType && escaper.makeCreateSimplePatrolMonsters('string', monsterType)

            Text.mkP(escaper.getPlayer(), 'monster making on')
            return true
        },
    })

    //-createMonsterAuto(crma) <monsterLabel> [angle]  --> simple patrols created with only one click (click on a slide terrain)
    registerCommand({
        name: 'createMonsterAuto',
        alias: ['crma'],
        group: 'make',
        argDescription: '<monsterLabel> [angle]',
        description:
            'creates a monster at the current location, patrolling between 2 locations, created with only one click (click on a slide terrain)',
        cb: ({ nbParam, param1, param2 }, escaper) => {
            if (!(nbParam === 1) && !(nbParam === 2)) {
                return true
            }

            //checkParam1
            if (!getUdgMonsterTypes().isLabelAlreadyUsed(param1)) {
                Text.erP(escaper.getPlayer(), 'unknown monster type')
                return true
            }

            const angle = nbParam === 2 ? convertTextToAngle(param2) : undefined

            if (nbParam === 2 && angle === undefined) {
                Text.erP(escaper.getPlayer(), 'wrong angle value')
                return true
            }

            const monsterType = getUdgMonsterTypes().getByLabel(param1)
            monsterType && escaper.makeCreateSimplePatrolMonsters('auto', monsterType, angle)

            Text.mkP(escaper.getPlayer(), 'monster making on')
            return true
        },
    })

    //-setAutoDistOnTerrain(setadot) <newDist>   --> for patrol monsters created in one click, distance between locations and slide terrain
    registerCommand({
        name: 'setAutoDistOnTerrain',
        alias: ['setadot'],
        group: 'make',
        argDescription: '<newDist>',
        description: 'For patrol monsters created in one click, distance between locations and slide terrain',
        cb: ({ nbParam, param1 }, escaper) => {
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
        },
    })

    //-createMonsterMultiPatrols(crmmp) <monsterLabel>   --> patrols until 20 locations
    registerCommand({
        name: 'createMonsterMultiPatrols',
        alias: ['crmmp'],
        group: 'make',
        argDescription: '<monsterLabel>',
        description: 'Creates a monster at the current location, patrolling between 2 locations, until 20 locations',
        cb: ({ nbParam, param1 }, escaper) => {
            if (!(nbParam === 1)) {
                return true
            }
            //checkParam1
            if (!getUdgMonsterTypes().isLabelAlreadyUsed(param1)) {
                Text.erP(escaper.getPlayer(), 'unknown monster type')
                return true
            }

            const monsterType = getUdgMonsterTypes().getByLabel(param1)
            monsterType && escaper.makeCreateMultiplePatrolsMonsters('normal', monsterType)

            Text.mkP(escaper.getPlayer(), 'monster making on')
            return true
        },
    })

    //-createMonsterMultiPatrolsString(crmmps) <monsterLabel>   --> patrols until 20 locations, with come back at last location
    registerCommand({
        name: 'createMonsterMultiPatrolsString',
        alias: ['crmmps'],
        group: 'make',
        argDescription: '<monsterLabel>',
        description:
            'creates a monster at the current location, patrolling between 2 locations, until 20 locations, with come back at last location',
        cb: ({ nbParam, param1 }, escaper) => {
            if (!(nbParam === 1)) {
                return true
            }
            //checkParam1
            if (!getUdgMonsterTypes().isLabelAlreadyUsed(param1)) {
                Text.erP(escaper.getPlayer(), 'unknown monster type')
                return true
            }

            const monsterType = getUdgMonsterTypes().getByLabel(param1)
            monsterType && escaper.makeCreateMultiplePatrolsMonsters('string', monsterType)
            Text.mkP(escaper.getPlayer(), 'monster making on')
            return true
        },
    })

    //-createMonsterTeleport(crmt) <monsterLabel> <period> <angle>   --> teleport monster until 20 locations
    registerCommand({
        name: 'createMonsterTeleport',
        alias: ['crmt'],
        group: 'make',
        argDescription: '<monsterLabel> <period> <angle>',
        description: 'Creates a monster at the current location, patrolling between 2 locations, until 20 locations',
        cb: ({ nbParam, param1, param2, param3 }, escaper) => {
            if (!(nbParam === 3)) {
                return true
            }
            //checkParam1
            if (!getUdgMonsterTypes().isLabelAlreadyUsed(param1)) {
                Text.erP(escaper.getPlayer(), 'unknown monster type')
                return true
            }
            //checkParam2
            const x = S2R(param2)
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

            const monsterType = getUdgMonsterTypes().getByLabel(param1)
            monsterType && escaper.makeCreateTeleportMonsters('normal', monsterType, x, S2R(param3))

            Text.mkP(escaper.getPlayer(), 'monster making on')
            return true
        },
    })

    //-createMonsterTeleportStrings(crmts) <monsterLabel> <period> <angle>   --> teleport monster until 20 locations
    registerCommand({
        name: 'createMonsterTeleportStrings',
        alias: ['crmts'],
        group: 'make',
        argDescription: '<monsterLabel> <period> <angle>',
        description: 'Creates a monster at the current location, patrolling between 2 locations, until 20 locations',
        cb: ({ nbParam, param1, param2, param3 }, escaper) => {
            if (!(nbParam === 3)) {
                return true
            }
            //checkParam1
            if (!getUdgMonsterTypes().isLabelAlreadyUsed(param1)) {
                Text.erP(escaper.getPlayer(), 'unknown monster type')
                return true
            }
            //checkParam2
            const x = S2R(param2)
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

            const monsterType = getUdgMonsterTypes().getByLabel(param1)
            monsterType && escaper.makeCreateTeleportMonsters('string', monsterType, x, S2R(param3))

            Text.mkP(escaper.getPlayer(), 'monster making on')
            return true
        },
    })

    //-next(n)   --> finalize the current multi patrols or teleport monster and start the next one
    registerCommand({
        name: 'next',
        alias: ['n'],
        group: 'make',
        argDescription: '',
        description: 'Finalize the current multi patrols or teleport monster and start the next one',
        cb: ({ noParam }, escaper) => {
            if (!noParam) {
                return true
            }
            if (escaper.makeMmpOrMtNext()) {
                Text.mkP(escaper.getPlayer(), 'next')
            } else {
                Text.erP(escaper.getPlayer(), "you're not making multipatrol or teleport monsters")
            }
            return true
        },
    })

    //-monsterTeleportWait(mtw)   --> ajoute une période d'attente le MonsterTeleport en train d'être créé
    registerCommand({
        name: 'monsterTeleportWait',
        alias: ['mtw'],
        group: 'make',
        argDescription: '',
        description: 'A wait period for the monster teleport being created',
        cb: ({ noParam }, escaper) => {
            if (!noParam) {
                return true
            }
            if (escaper.makeMonsterTeleportWait()) {
                Text.mkP(escaper.getPlayer(), 'wait period added')
            } else {
                Text.erP(escaper.getPlayer(), 'impossible to add a wait period')
            }
            return true
        },
    })

    //-monsterTeleportHide(mth)   --> ajoute une période où le MonsterTeleport est caché et ne tue pas
    registerCommand({
        name: 'monsterTeleportHide',
        alias: ['mth'],
        group: 'make',
        argDescription: '',
        description: 'A hide period for the monster teleport being created',
        cb: ({ noParam }, escaper) => {
            if (!noParam) {
                return true
            }
            if (escaper.makeMonsterTeleportHide()) {
                Text.mkP(escaper.getPlayer(), 'hide period added')
            } else {
                Text.erP(escaper.getPlayer(), 'impossible to add a hide period')
            }
            return true
        },
    })

    //-setUnitTeleportPeriod(setutp) <period>
    registerCommand({
        name: 'setUnitTeleportPeriod',
        alias: ['setutp'],
        group: 'make',
        argDescription: '<period>',
        description: 'Set the period for the unit teleport being created',
        cb: ({ nbParam, param1 }, escaper) => {
            if (nbParam !== 1) {
                return true
            }
            //checkParam1
            const x = S2R(param1)
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
        },
    })

    //-setUnitTeleportPeriodBetweenPoints(setutpbp) <period>
    registerCommand({
        name: 'setUnitTeleportPeriodBetweenPoints',
        alias: ['setutpbp'],
        group: 'make',
        argDescription: '<period>',
        description: 'Set the period for the unit teleport being created',
        cb: ({ nbParam, param1 }, escaper) => {
            if (nbParam !== 1) {
                return true
            }
            //checkParam1
            const x = S2R(param1)
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
        },
    })

    //-getUnitTeleportPeriod(getutp)
    registerCommand({
        name: 'getUnitTeleportPeriod',
        alias: ['getutp'],
        group: 'make',
        argDescription: '',
        description: 'Displays the period of any teleporting unit you click',
        cb: ({ noParam }, escaper) => {
            if (!noParam) {
                return true
            }
            //apply command
            escaper.makeGetUnitTeleportPeriod()
            Text.mkP(escaper.getPlayer(), 'getting unit teleport period on')
            return true
        },
    })

    //-setUnitMonsterType(setumt) <monsterLabel>
    registerCommand({
        name: 'setUnitMonsterType',
        alias: ['setumt'],
        group: 'make',
        argDescription: '<monsterLabel>',
        description: '',
        cb: ({ nbParam, param1 }, escaper) => {
            if (nbParam !== 1) {
                return true
            }
            //checkParam1
            if (!getUdgMonsterTypes().isLabelAlreadyUsed(param1)) {
                Text.erP(escaper.getPlayer(), 'unknown monster type')
                return true
            }
            //apply command
            const monsterType = getUdgMonsterTypes().getByLabel(param1)
            monsterType && escaper.makeSetUnitMonsterType('oneByOne', monsterType)
            Text.mkP(escaper.getPlayer(), 'setting unit monster type on')
            return true
        },
    })

    //-setUnitMonsterTypeBetweenPoints(setumtbp) <monsterLabel>
    registerCommand({
        name: 'setUnitMonsterTypeBetweenPoints',
        alias: ['setumtbp'],
        group: 'make',
        argDescription: '<monsterLabel>',
        description: '',
        cb: ({ nbParam, param1 }, escaper) => {
            if (nbParam !== 1) {
                return true
            }
            //checkParam1
            if (!getUdgMonsterTypes().isLabelAlreadyUsed(param1)) {
                Text.erP(escaper.getPlayer(), 'unknown monster type')
                return true
            }
            //apply command
            const monsterType = getUdgMonsterTypes().getByLabel(param1)
            monsterType && escaper.makeSetUnitMonsterType('twoClics', monsterType)
            Text.mkP(escaper.getPlayer(), 'setting unit monster type on')
            return true
        },
    })

    //-displayMonsters(dm) [<monsterLabel>] [page]   --> displays the characteristics of the kinds of monsters added by the maker(s)
    registerCommand({
        name: 'displayMonsters',
        alias: ['dm'],
        group: 'make',
        argDescription: '[<monsterLabel>] [page]',
        description: 'Displays the characteristics of the kinds of monsters added by the maker(s)',
        cb: ({ cmd }, escaper) => {
            getUdgMonsterTypes().displayPaginatedForPlayer(escaper.getPlayer(), cmd)
            return true
        },
    })

    //-deleteMonstersBetweenPoints(delmbp) [<deleteMode>]   --> delete monsters in a rectangle formed with two clicks
    registerCommand({
        name: 'deleteMonstersBetweenPoints',
        alias: ['delmbp'],
        group: 'make',
        argDescription: '[<deleteMode>]',
        description: 'Delete monsters in a rectangle formed with two clicks',
        cb: ({ nbParam, param1 }, escaper) => {
            //delete modes : all, noMove, move, simplePatrol, multiplePatrols
            if (!(nbParam <= 1)) {
                return true
            }

            let str = ''

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
        },
    })

    //-deleteMonster(delm)   --> delete the monsters clicked by the player
    registerCommand({
        name: 'deleteMonster',
        alias: ['delm'],
        group: 'make',
        argDescription: '',
        description: 'Delete the monsters clicked by the player',
        cb: ({ noParam }, escaper) => {
            if (noParam) {
                escaper.makeDeleteMonsters('oneByOne')
                Text.mkP(escaper.getPlayer(), 'monster deleting on')
            }
            return true
        },
    })

    //-createMonsterSpawn(crmsp) <monsterSpawnLabel> <monsterLabel> <direction> [<frequency>]   --> default frequency is 2, minimum is 0.1, maximum is 30
    registerCommand({
        name: 'createMonsterSpawn',
        alias: ['crmsp'],
        group: 'make',
        argDescription: '<monsterSpawnLabel> <monsterLabel> <direction> [<frequency>]',
        description: 'Default frequency is 2, minimum is 0.1, maximum is 30',
        cb: ({ nbParam, param1, param2, param3, param4 }, escaper) => {
            if (!(nbParam >= 3 && nbParam <= 4)) {
                Text.erP(escaper.getPlayer(), 'uncorrect number of parameters')
                return true
            }
            if (escaper.getMakingLevel().monsterSpawns.getByLabel(param1)) {
                Text.erP(
                    escaper.getPlayer(),
                    'a monster spawn with label "' + param1 + '" already exists for this level'
                )
                return true
            }

            const monsterType = getUdgMonsterTypes().getByLabel(param2)
            if (!monsterType) {
                Text.erP(escaper.getPlayer(), 'unknown monster type "' + param2 + '"')
                return true
            }

            const str = convertTextToAngle(param3)

            if (!str) {
                Text.erP(
                    escaper.getPlayer(),
                    'param 3 should be direction : leftToRight, upToDown, rightToLeft or downToUp'
                )
                return true
            }

            let x = 0

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
        },
    })

    //-setMonsterSpawnLabel(setmsl) <oldMonsterSpawnLabel> <newMonsterSpawnLabel>
    registerCommand({
        name: 'setMonsterSpawnLabel',
        alias: ['setmsl'],
        group: 'make',
        argDescription: '<oldMonsterSpawnLabel> <newMonsterSpawnLabel>',
        description: 'Change the label of an existing monster spawn',
        cb: ({ nbParam, param1, param2 }, escaper) => {
            if (!(nbParam === 2)) {
                return true
            }
            if (escaper.getMakingLevel().monsterSpawns.changeLabel(param1, param2)) {
                Text.mkP(escaper.getPlayer(), 'label changed')
            } else {
                Text.erP(escaper.getPlayer(), "couldn't change label")
            }
            return true
        },
    })

    //-setMonsterSpawnMonster(setmsm) <monsterSpawnLabel> <monsterLabel>
    registerCommand({
        name: 'setMonsterSpawnMonster',
        alias: ['setmsm'],
        group: 'make',
        argDescription: '<monsterSpawnLabel> <monsterLabel>',
        description: 'Change which monster type a monster spawn will create',
        cb: ({ nbParam, param1, param2 }, escaper) => {
            if (!(nbParam === 2)) {
                return true
            }

            const monsterSpawn = escaper.getMakingLevel().monsterSpawns.getByLabel(param1)
            if (!monsterSpawn) {
                Text.erP(escaper.getPlayer(), 'unknown monster spawn "' + param1 + '" in this level')
                return true
            }

            const monsterType = getUdgMonsterTypes().getByLabel(param2)
            if (!monsterType) {
                Text.erP(escaper.getPlayer(), 'unknown monster type "' + param2 + '"')
                return true
            }

            monsterSpawn.setMonsterType(monsterType)
            Text.mkP(escaper.getPlayer(), 'monster type changed')
            return true
        },
    })

    //-setMonsterSpawnDirection(setmsd) <monsterSpawnLabel> <direction>   --> leftToRight(ltr), upToDown(utd), rightToLeft(rtl), downToUp(dtu)
    registerCommand({
        name: 'setMonsterSpawnDirection',
        alias: ['setmsd', 'setMonsterSpawnRotation', 'setmsr'],
        group: 'make',
        argDescription: '<monsterSpawnLabel> <direction>',
        description: 'LeftToRight(ltr), upToDown(utd), rightToLeft(rtl), downToUp(dtu), any angle in degrees',
        cb: ({ param1, param2 }, escaper) => {
            const monsterSpawn = escaper.getMakingLevel().monsterSpawns.getByLabel(param1)

            if (!monsterSpawn) {
                Text.erP(escaper.getPlayer(), 'unknown monster spawn "' + param1 + '" in this level')
                return true
            }

            let angle: number | undefined = undefined

            if (param2 !== '' && param2 !== '0') {
                angle = convertTextToAngle(param2)

                if (!angle) {
                    Text.erP(escaper.getPlayer(), 'Invalid angle')
                    return true
                }

                monsterSpawn.setRotation(angle)
                Text.mkP(escaper.getPlayer(), `Rotation changed to: ${angle}`)
            } else {
                Text.mkP(escaper.getPlayer(), 'Invalid rotation')
            }

            return true
        },
    })

    //-setMonsterSpawnFrequency(setmsf) <monsterSpawnLabel> <frequency>   --> maximum 20 mobs per second
    registerCommand({
        name: 'setMonsterSpawnFrequency',
        alias: ['setmsf'],
        group: 'make',
        argDescription: '<monsterSpawnLabel> <frequency>',
        description: 'Set how often monsters spawn (frequency between 0.1 and 30)',
        cb: ({ nbParam, param1, param2 }, escaper) => {
            if (!(nbParam === 2)) {
                return true
            }

            const monsterSpawn = escaper.getMakingLevel().monsterSpawns.getByLabel(param1)
            if (!monsterSpawn) {
                Text.erP(escaper.getPlayer(), 'unknown monster spawn "' + param1 + '" in this level')
                return true
            }
            const x = S2R(param2)
            if (x < 0.1 || x > 30) {
                Text.erP(escaper.getPlayer(), 'frequency must be a real between 0.1 and 30')
                return true
            }

            monsterSpawn.setFrequence(x)
            Text.mkP(escaper.getPlayer(), 'frequency changed')
            return true
        },
    })

    //-setMonsterSpawnAmount(setmsa) <label> <amount>
    registerCommand({
        name: 'setMonsterSpawnAmount',
        alias: ['setmsa'],
        group: 'make',
        argDescription: '<label> <amount>',
        description: 'Set how many monsters spawn simultaneously per spawn cycle (1-500)',
        cb: ({ param1, param2 }, escaper) => {
            const monsterSpawn = escaper.getMakingLevel().monsterSpawns.getByLabel(param1)

            if (!monsterSpawn) {
                Text.erP(escaper.getPlayer(), 'unknown monster spawn "' + param1 + '" in this level')
                return true
            }

            if (!(S2I(param2) > 0 && S2I(param2) <= 500)) {
                Text.erP(escaper.getPlayer(), 'Amount must be > 0 and <= 500')
                return true
            }

            monsterSpawn.setSpawnAmount(S2I(param2))
            Text.mkP(escaper.getPlayer(), 'spawnAmount changed')
            return true
        },
    })

    //-setMonsterSpawnOffset(setmso) <label> <offset>
    registerCommand({
        name: 'setMonsterSpawnOffset',
        alias: ['setmso'],
        group: 'make',
        argDescription: '<label> <offset>',
        description: 'Distance between each individual monster when spawnAmount > 1 (0-16384, 0 disables)',
        cb: ({ param1, param2 }, escaper) => {
            const monsterSpawn = escaper.getMakingLevel().monsterSpawns.getByLabel(param1)

            if (!monsterSpawn) {
                Text.erP(escaper.getPlayer(), 'unknown monster spawn "' + param1 + '" in this level')
                return true
            }

            if (S2I(param2) !== 0 && !(S2I(param2) > 0 && S2I(param2) <= 16384)) {
                Text.erP(escaper.getPlayer(), 'Offset must be > 0 and <= 16384')
                return true
            }

            monsterSpawn.setSpawnOffset(S2I(param2) === 0 ? undefined : S2I(param2))
            Text.mkP(escaper.getPlayer(), 'spawnOffset changed')
            return true
        },
    })

    //-setMonsterSpawnFixedSpawnOffset(setmsfso) <label> <offset>
    registerCommand({
        name: 'setMonsterSpawnFixedSpawnOffset',
        alias: ['setmsfso'],
        group: 'make',
        argDescription: '<label> <offset>',
        description: 'Distance between each spawn (0-16384, 0 disables)',
        cb: ({ param1, param2 }, escaper) => {
            const monsterSpawn = escaper.getMakingLevel().monsterSpawns.getByLabel(param1)

            if (!monsterSpawn) {
                Text.erP(escaper.getPlayer(), 'unknown monster spawn "' + param1 + '" in this level')
                return true
            }

            if (S2I(param2) !== 0 && !(S2I(param2) > 0 && S2I(param2) <= 16384)) {
                Text.erP(escaper.getPlayer(), 'Offset must be > 0 and <= 16384')
                return true
            }

            monsterSpawn.setFixedSpawnOffset(S2I(param2) === 0 ? undefined : S2I(param2))
            Text.mkP(escaper.getPlayer(), 'fixedSpawnOffset changed')
            return true
        },
    })

    //-setMonsterSpawnFixedSpawnOffsetBounce(setmsfsob) <label> <bounce>
    registerCommand({
        name: 'setMonsterSpawnFixedSpawnOffsetBounce',
        alias: ['setmsfsob'],
        group: 'make',
        argDescription: '<label> <bounce>',
        description: 'Toggle whether fixed spawn offset bounces back and forth (requires fixedSpawnOffset enabled)',
        cb: ({ param1, param2 }, escaper) => {
            const monsterSpawn = escaper.getMakingLevel().monsterSpawns.getByLabel(param1)

            if (!monsterSpawn) {
                Text.erP(escaper.getPlayer(), 'unknown monster spawn "' + param1 + '" in this level')
                return true
            }

            if (!monsterSpawn.getFixedSpawnOffset()) {
                Text.erP(escaper.getPlayer(), 'fixedSpawnOffset has to be enabled for this to work')
                return true
            }

            if (!IsBoolString(param2)) {
                Text.erP(escaper.getPlayer(), 'Bounce must be a boolean')
                return true
            }

            monsterSpawn.setFixedSpawnOffsetBounce(S2B(param2))
            Text.mkP(escaper.getPlayer(), 'fixedSpawnOffsetBounce changed')
            return true
        },
    })

    //-setMonsterSpawnFixedSpawnOffsetMirrored(setmsfsom) <label> <mirrored>
    registerCommand({
        name: 'setMonsterSpawnFixedSpawnOffsetMirrored',
        alias: ['setmsfsom'],
        group: 'make',
        argDescription: '<label> <mirrored>',
        description: 'Toggle whether fixed spawn offset mirrors on opposite side (requires fixedSpawnOffset enabled)',
        cb: ({ param1, param2 }, escaper) => {
            const monsterSpawn = escaper.getMakingLevel().monsterSpawns.getByLabel(param1)

            if (!monsterSpawn) {
                Text.erP(escaper.getPlayer(), 'unknown monster spawn "' + param1 + '" in this level')
                return true
            }

            if (!monsterSpawn.getFixedSpawnOffset()) {
                Text.erP(escaper.getPlayer(), 'fixedSpawnOffset has to be enabled for this to work')
                return true
            }

            if (!IsBoolString(param2)) {
                Text.erP(escaper.getPlayer(), 'Bounce must be a boolean')
                return true
            }

            monsterSpawn.setFixedSpawnOffsetMirrored(S2B(param2))
            Text.mkP(escaper.getPlayer(), 'fixedSpawnOffsetMirrored changed')
            return true
        },
    })

    //-setMonsterSpawnInitialDelay(setmsid) <label> <delay>
    registerCommand({
        name: 'setMonsterSpawnInitialDelay',
        alias: ['setmsid'],
        group: 'make',
        argDescription: '<label> <delay>',
        description: 'Set delay in seconds before monster spawn starts spawning (1-10)',
        cb: ({ param1, param2 }, escaper) => {
            const monsterSpawn = escaper.getMakingLevel().monsterSpawns.getByLabel(param1)

            if (!monsterSpawn) {
                Text.erP(escaper.getPlayer(), 'unknown monster spawn "' + param1 + '" in this level')
                return true
            }

            if (!(S2I(param2) > 0 && S2I(param2) <= 10)) {
                Text.erP(escaper.getPlayer(), 'Delay must be > 0 and <= 10')
                return true
            }

            monsterSpawn.setInitialDelay(S2I(param2))
            Text.mkP(escaper.getPlayer(), 'Delay changed')
            return true
        },
    })

    //-setMonsterSpawnTimedUnspawn(setmstu) <label> <time>
    registerCommand({
        name: 'setMonsterSpawnTimedUnspawn',
        alias: ['setmstu'],
        group: 'make',
        argDescription: '<label> <time>',
        description: 'Set time in seconds after which spawned monsters will automatically despawn (0 to disable)',
        cb: ({ param1, param2 }, escaper) => {
            const monsterSpawn = escaper.getMakingLevel().monsterSpawns.getByLabel(param1)

            if (!monsterSpawn) {
                Text.erP(escaper.getPlayer(), 'unknown monster spawn "' + param1 + '" in this level')
                return true
            }

            const time = S2R(param2)
            if (time < 0) {
                Text.erP(escaper.getPlayer(), 'Time must be >= 0')
                return true
            }

            monsterSpawn.setTimedUnspawn(time === 0 ? undefined : time)
            Text.mkP(
                escaper.getPlayer(),
                time === 0 ? 'Timed unspawn disabled' : 'Timed unspawn set to ' + R2S(time) + ' seconds'
            )
            return true
        },
    })

    //-setMonsterSpawnShape(setmssh) <label> <shape>
    registerCommand({
        name: 'setMonsterSpawnShape',
        alias: ['setmssh'],
        group: 'make',
        argDescription: '<label> <shape>',
        description:
            'set spawn shape (region=default, line, point) - line/point modes spawn at clicks and walk in direction (requires timedUnspawn)',
        cb: ({ param1, param2 }, escaper) => {
            const monsterSpawn = escaper.getMakingLevel().monsterSpawns.getByLabel(param1)

            if (!monsterSpawn) {
                Text.erP(escaper.getPlayer(), 'unknown monster spawn "' + param1 + '" in this level')
                return true
            }

            const shape = param2.toLowerCase()
            if (shape !== 'region' && shape !== 'line' && shape !== 'point') {
                Text.erP(escaper.getPlayer(), 'shape must be one of: region, line, point')
                return true
            }

            if (
                shape !== 'region' &&
                (monsterSpawn.getTimedUnspawn() === undefined || monsterSpawn.getTimedUnspawn()! <= 0)
            ) {
                Text.erP(
                    escaper.getPlayer(),
                    'Cannot set shape to "' +
                        shape +
                        '" without timedUnspawn set. Use setMonsterSpawnTimedUnspawn first.'
                )
                return true
            }

            monsterSpawn.setSpawnShape(shape as 'region' | 'line' | 'point')

            Text.mkP(escaper.getPlayer(), `Spawn shape set to: ${shape}`)
            return true
        },
    })

    //-displayMonsterSpawns(dms) [<monsterSpawnLabel>] [page]
    registerCommand({
        name: 'displayMonsterSpawns',
        alias: ['dms'],
        group: 'make',
        argDescription: '[<monsterSpawnLabel>] [page]',
        description: 'Displays the monster spawns for this level',
        cb: ({ cmd }, escaper) => {
            escaper.getMakingLevel().monsterSpawns.displayPaginatedForPlayer(escaper.getPlayer(), cmd)
            return true
        },
    })

    //-deleteMonsterSpawn(delms) <monsterSpawnLabel>
    registerCommand({
        name: 'deleteMonsterSpawn',
        alias: ['delms'],
        group: 'make',
        argDescription: '<monsterSpawnLabel>',
        description: '',
        cb: ({ nbParam, param1 }, escaper) => {
            if (!(nbParam === 1)) {
                return true
            }
            if (escaper.getMakingLevel().monsterSpawns.clearMonsterSpawn(param1)) {
                Text.mkP(escaper.getPlayer(), 'monster spawn deleted')
            } else {
                Text.erP(escaper.getPlayer(), 'unknown monster spawn for this level')
            }
            return true
        },
    })

    //-createRegion(crr) <regionLabel>
    registerCommand({
        name: 'createRegion',
        alias: ['crr'],
        group: 'make',
        argDescription: '<regionLabel>',
        description: 'Create a region',
        cb: ({ param1 }, escaper) => {
            if (param1.length === 0) {
                Text.erP(escaper.getPlayer(), 'regionLabel required')
                return true
            }

            if (escaper.getMakingLevel().monsterSpawns.getByLabel(param1)) {
                Text.erP(escaper.getPlayer(), 'a region with label "' + param1 + '" already exists for this level')
                return true
            }

            escaper.makeCreateRegion(param1)
            Text.mkP(escaper.getPlayer(), 'region making on')
            return true
        },
    })

    //-moveRegionPoint(mrp)
    registerCommand({
        name: 'moveRegionPoint',
        alias: ['mrp'],
        group: 'make',
        argDescription: '',
        description: 'Move a region point',
        cb: ({ noParam }, escaper) => {
            if (!noParam) {
                return true
            }
            escaper.makeMoveRegionPoint()
            Text.mkP(escaper.getPlayer(), 'region point moving on')
            return true
        },
    })

    //-displayRegions(drs) [<regionLabel>] [page]
    registerCommand({
        name: 'displayRegions',
        alias: ['drs'],
        group: 'make',
        argDescription: '[<regionLabel>] [page]',
        description: 'Displays the regions for this level',
        cb: ({ cmd }, escaper) => {
            escaper.getMakingLevel().regions.displayPaginatedForPlayer(escaper.getPlayer(), cmd)
            return true
        },
    })

    //-getRegionAtPoint(getr|getrap)
    registerCommand({
        name: 'getRegionAtPoint',
        alias: ['getr', 'getrap'],
        group: 'make',
        argDescription: '',
        description: '',
        cb: ({ noParam }, escaper) => {
            if (!noParam) {
                return true
            }
            escaper.makeGetRegionAtPoint()
            Text.mkP(escaper.getPlayer(), 'Getting region at point enabled')
            return true
        },
    })

    //-deleteRegion(delr) <regionLabel>
    registerCommand({
        name: 'deleteRegion',
        alias: ['delr'],
        group: 'make',
        argDescription: '<regionLabel>',
        description: '',
        cb: ({ nbParam, param1 }, escaper) => {
            if (!(nbParam === 1)) {
                return true
            }
            if (escaper.getMakingLevel().regions.clearRegion(param1)) {
                Text.mkP(escaper.getPlayer(), 'region deleted')
            } else {
                Text.erP(escaper.getPlayer(), 'unknown region for this level')
            }
            return true
        },
    })

    //-setRegionFlag(setrf) <regionLabel> <flag> <boolean>
    registerCommand({
        name: 'setRegionFlag',
        alias: ['setrf'],
        group: 'make',
        argDescription: '<regionLabel> <flag> <boolean>',
        description: '',
        cb: ({ nbParam, param1, param2, param3 }, escaper) => {
            if (!(nbParam === 3)) {
                return true
            }

            const targetRegion = getUdgLevels().getCurrentLevel(escaper).regions.getByLabel(param1)

            if (!targetRegion) {
                Text.erP(escaper.getPlayer(), 'unknown region')
                return true
            }

            if (!IsBoolString(param3)) {
                Text.erP(escaper.getPlayer(), "wrong \"flag boolean\" value ; should be 'true', 'false', '0' or '1'")
                return true
            }

            targetRegion.setFlag(param2, S2B(param3))
            Text.mkP(escaper.getPlayer(), `Region: ${targetRegion.getLabel()}, flag: ${param2}, value: ${param3}`)

            return true
        },
    })

    //-setMonsterWanderable(setmw) <monsterLabel> <boolean clickable>
    registerCommand({
        name: 'setMonsterWanderable',
        alias: ['setmw'],
        group: 'make',
        argDescription: '<monsterLabel> <boolean clickable>',
        description: '',
        cb: ({ nbParam, param1, param2 }, escaper) => {
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
                Text.erP(escaper.getPlayer(), "wrong \"is wanderable\" value ; should be 'true', 'false', '0' or '1'")
                return true
            }
            if (getUdgMonsterTypes().getByLabel(param1)?.setIsWanderable(S2B(param2))) {
                if (S2B(param2)) {
                    Text.mkP(escaper.getPlayer(), 'this monster type is now wanderable')
                } else {
                    Text.mkP(escaper.getPlayer(), 'this monster type is now unable to wander')
                }
            } else {
                if (S2B(param2)) {
                    Text.erP(escaper.getPlayer(), 'this monster type is already wanderable')
                } else {
                    Text.erP(escaper.getPlayer(), 'this monster type is already unable to wander')
                }
            }
            return true
        },
    })

    //createKey(crk)   --> create meteors used to kill clickable monsters
    registerCommand({
        name: 'createKey',
        alias: ['crk'],
        group: 'make',
        argDescription: '',
        description: 'Create meteors used to kill clickable monsters',
        cb: ({ noParam }, escaper) => {
            if (noParam) {
                escaper.makeCreateMeteor()
                Text.mkP(escaper.getPlayer(), 'meteor making on')
            }
            return true
        },
    })

    //-deleteKeysBetweenPoints(delkbp)   --> delete meteors in a rectangle formed with two clicks
    registerCommand({
        name: 'deleteKeysBetweenPoints',
        alias: ['delkbp'],
        group: 'make',
        argDescription: '',
        description: 'Delete meteors in a rectangle formed with two clicks',
        cb: ({ noParam }, escaper) => {
            if (noParam) {
                escaper.makeDeleteMeteors('twoClics')
                Text.mkP(escaper.getPlayer(), 'meteors deleting on')
            }
            return true
        },
    })

    //-deleteKey(delk)   --> delete the meteors clicked by the player
    registerCommand({
        name: 'deleteKey',
        alias: ['delk'],
        group: 'make',
        argDescription: '',
        description: 'Delete the meteors clicked by the player',
        cb: ({ noParam }, escaper) => {
            if (noParam) {
                escaper.makeDeleteMeteors('oneByOne')
                Text.mkP(escaper.getPlayer(), 'meteors deleting on')
            }
            return true
        },
    })

    //-createStart(crs) [next(n)]   --> create the start (a rectangle formed with two clicks) of the current level or the next one if specified
    registerCommand({
        name: 'createStart',
        alias: ['crs'],
        group: 'make',
        argDescription: '[current(c)|next(n)] [facing]',
        description:
            'create the start (a rectangle formed with two clicks) of the current level or the next one if specified',
        cb: ({ nbParam, param1, param2 }, escaper) => {
            let forNext = false
            let facing = param2 ? convertTextToAngle(param2) : undefined

            //checkParam1
            if (nbParam === 1 || nbParam === 2) {
                if (!(param1 === 'next' || param1 === 'n' || param1 === 'current' || param1 === 'c')) {
                    Text.erP(escaper.getPlayer(), 'param1 should be "next" or "n" or "current" or "c"')
                    return true
                }

                if (param1 === 'next' || param1 === 'n') {
                    forNext = true
                }
            } else {
                forNext = false
            }
            escaper.makeCreateStart(forNext, facing) //b signifie si le "Start" est créé pour le niveau suivant (sinon pour le niveau en cours de mapping pour l'escaper)
            Text.mkP(escaper.getPlayer(), 'start making on')
            return true
        },
    })

    //-createEnd(cre)   --> create the end (a rectangle formed with two clicks) of the current level
    registerCommand({
        name: 'createEnd',
        alias: ['cre'],
        group: 'make',
        argDescription: '',
        description: 'Create the end (a rectangle formed with two clicks) of the current level',
        cb: ({ noParam }, escaper) => {
            if (!noParam) {
                return true
            }
            escaper.makeCreateEnd()
            Text.mkP(escaper.getPlayer(), 'end making on')
            return true
        },
    })

    //-getMakingLevel(getmkl)   --> displays the id of the level the player is creating (the first one is id 0)
    registerCommand({
        name: 'getMakingLevel',
        alias: ['getmkl'],
        group: 'make',
        argDescription: '',
        description: 'Displays the id of the level the player is creating (the first one is id 0)',
        cb: ({ noParam }, escaper) => {
            if (!noParam) {
                return true
            }

            let str = ''

            if (getUdgLevels().getCurrentLevel() == escaper.getMakingLevel()) {
                str = ' (same as current level)'
            } else {
                str = ''
            }
            Text.P(
                escaper.getPlayer(),
                'the level you are making is number ' + I2S(escaper.getMakingLevel().getId()) + str
            )
            return true
        },
    })

    //-setMakingLevel(setmkl) <levelId> | current(c)   --> sets the level the players chose to continue creating
    registerCommand({
        name: 'setMakingLevel',
        alias: ['setmkl'],
        group: 'make',
        argDescription: '<levelId> | current(c)',
        description: 'Sets the level the players chose to continue creating',
        cb: ({ nbParam, param1 }, escaper) => {
            if (!(nbParam === 1)) {
                return true
            }
            if (IsPositiveInteger(param1)) {
                const n = S2I(param1)
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
        },
    })

    //-newLevel(newl)   --> creates a new level after the last one
    registerCommand({
        name: 'newLevel',
        alias: ['newl'],
        group: 'make',
        argDescription: '',
        description: 'Creates a new level after the last one',
        cb: ({ noParam }, escaper) => {
            if (noParam) {
                if (getUdgLevels().new()) {
                    Text.mkP(escaper.getPlayer(), 'level number ' + I2S(getUdgLevels().getLastLevelId()) + ' created')
                } else {
                    Text.erP(escaper.getPlayer(), 'nombre maximum de niveaux atteint')
                }
            }
            return true
        },
    })

    //-copyLevel
    registerCommand({
        name: 'copyLevel',
        alias: [],
        group: 'make',
        argDescription: '',
        description: 'Creates a new level after the last one by copying the current make level',
        cb: ({ noParam }, escaper) => {
            if (noParam) {
                const currentLevel = escaper.getMakingLevel()

                getUdgLevels().newFromJson([currentLevel.toJson()], true)

                Text.mkP(
                    escaper.getPlayer(),
                    `Copied level: ${currentLevel.getId()} to ${getUdgLevels().getLastLevelId()}`
                )
            }
            return true
        },
    })

    //-copyLevelPatrol <targetLvl>
    registerCommand({
        name: 'copyLevelPatrol',
        alias: ['clp'],
        group: 'make',
        argDescription: '<targetLvl>',
        description: '',
        cb: ({ param1 }, escaper) => {
            const targetLevel = getUdgLevels().get(S2I(param1))

            if (!targetLevel || param1 === '') {
                Text.erP(escaper.getPlayer(), 'Target level does not exist')
                return true
            }

            escaper.makeCopyLevelPatrol(targetLevel, 'oneByOne')
            Text.mkP(escaper.getPlayer(), `Click on a monster to copy to level: ${targetLevel.getId()}`)
            return true
        },
    })

    //-copyLevelPatrolBetweenPoints <targetLvl>
    registerCommand({
        name: 'copyLevelPatrolBetweenPoints',
        alias: ['clpbp'],
        group: 'make',
        argDescription: '<targetLvl>',
        description: '',
        cb: ({ param1 }, escaper) => {
            const targetLevel = getUdgLevels().get(S2I(param1))

            if (!targetLevel || param1 === '') {
                Text.erP(escaper.getPlayer(), 'Target level does not exist')
                return true
            }

            escaper.makeCopyLevelPatrol(targetLevel, 'all')
            Text.mkP(escaper.getPlayer(), `Click on a region to copy to level: ${targetLevel.getId()}`)
            return true
        },
    })

    //-setLivesEarned(setle) <livesNumber> [<levelID>]   --> the number of lives earned at the specified level
    registerCommand({
        name: 'setLivesEarned',
        alias: ['setle'],
        group: 'make',
        argDescription: '<livesNumber> [<levelID>]',
        description: 'The number of lives earned at the specified level',
        cb: ({ nbParam, param1, param2 }, escaper) => {
            if (!(nbParam >= 1 && nbParam <= 2)) {
                return true
            }
            //check param1
            if (!IsPositiveInteger(param1)) {
                Text.erP(escaper.getPlayer(), 'the number of lives must be a positive integer')
                return true
            }

            let level: Level | null = null

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
        },
    })

    //-createVisibility(crv)   --> create visibility rectangles for the current level
    registerCommand({
        name: 'createVisibility',
        alias: ['crv'],
        group: 'make',
        argDescription: '',
        description: 'Create visibility rectangles for the current level',
        cb: ({ noParam }, escaper) => {
            if (noParam) {
                escaper.makeCreateVisibilityModifier()
                Text.mkP(escaper.getPlayer(), 'visibility making on')
            }
            return true
        },
    })

    //-removeVisibilities(remv) [<levelId>]   --> remove all visibility rectangles made for the current level
    registerCommand({
        name: 'removeVisibilities',
        alias: ['remv'],
        group: 'make',
        argDescription: '[<levelId>]',
        description: 'Remove all visibility rectangles made for the current level',
        cb: ({ noParam, nbParam, param1, param2 }, escaper) => {
            if (!(noParam || nbParam === 1)) {
                return true
            }

            let level: Level | null = null

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
        },
    })

    //-setStartMessage(setsm) [<message>]   --> sets the start message of the current level (spaces allowed)
    registerCommand({
        name: 'setStartMessage',
        alias: ['setsm'],
        group: 'make',
        argDescription: '[<message>]',
        description: 'Sets the start message of the current level (spaces allowed)',
        cb: ({ cmd }, escaper) => {
            escaper.getMakingLevel().setStartMessage(CmdParam(cmd, 0))
            Text.mkP(
                escaper.getPlayer(),
                'start message for level ' + I2S(escaper.getMakingLevel().getId()) + ' changed'
            )
            return true
        },
    })

    //-getStartMessage(getsm)   --> displays the start message of the current level
    registerCommand({
        name: 'getStartMessage',
        alias: ['getsm'],
        group: 'make',
        argDescription: '',
        description: 'Displays the start message of the current level',
        cb: ({}, escaper) => {
            const str = escaper.getMakingLevel().getStartMessage()
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
        },
    })

    //-cancel(z)   --> cancel the last action made on the map
    registerCommand({
        name: 'cancel',
        alias: ['z'],
        group: 'make',
        argDescription: '',
        description: 'Cancel the last action made on the map',
        cb: ({ noParam }, escaper) => {
            if (noParam) {
                if (!escaper.cancelLastAction()) {
                    Text.erP(escaper.getPlayer(), 'nothing to cancel')
                }
            }
            return true
        },
    })

    //-redo(y)   --> redo the last action cancelled
    registerCommand({
        name: 'redo',
        alias: ['y'],
        group: 'make',
        argDescription: '',
        description: 'Redo the last action cancelled',
        cb: ({ noParam }, escaper) => {
            if (noParam) {
                if (!escaper.redoLastAction()) {
                    Text.erP(escaper.getPlayer(), 'nothing to redo')
                }
            }
            return true
        },
    })

    //-nbLevels(nbl)   --> display the number of levels that are currently in the map
    registerCommand({
        name: 'nbLevels',
        alias: ['nbl'],
        group: 'make',
        argDescription: '',
        description: 'Display the number of levels that are currently in the map',
        cb: ({ noParam }, escaper) => {
            if (noParam) {
                const n = getUdgLevels().count()

                if (n > 1) {
                    Text.P(escaper.getPlayer(), 'there are currently ' + I2S(n) + ' levels in the map')
                } else {
                    Text.P(escaper.getPlayer(), 'there is currently ' + I2S(n) + ' level in the map')
                }
            }
            return true
        },
    })

    //-newCaster(newc) <label> <casterMonsterType> <projectileMonsterType> [<range> [<projectileSpeed> [<loadTime>]]]
    registerCommand({
        name: 'newCaster',
        alias: ['newc'],
        group: 'make',
        argDescription:
            '<label> <casterMonsterType> <projectileMonsterType> [<range> [<projectileSpeed> [<loadTime>]]]',
        description: 'Create a new caster monster',
        cb: ({ cmd, nbParam, param1, param2, param3, param4 }, escaper) => {
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

            let x = 0
            let y = 0
            let speed = 0

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
                            'The projectile speed must be a real higher or equals to ' +
                                R2S(MIN_CASTER_PROJECTILE_SPEED)
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
            const casterMonsterType = getUdgMonsterTypes().getByLabel(param2)
            const projectileMonsterType = getUdgMonsterTypes().getByLabel(param3)

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
        },
    })

    //-setCasterLabel(setcl) <oldCasterLabel> <newCasterLabel>
    registerCommand({
        name: 'setCasterLabel',
        alias: ['setcl'],
        group: 'make',
        argDescription: '<oldCasterLabel> <newCasterLabel>',
        description: 'Change the label of a caster monster',
        cb: ({ nbParam, param1, param2 }, escaper) => {
            if (!(nbParam === 2)) {
                return true
            }
            let b = !!getUdgCasterTypes().getByLabel(param1)
            if (b) {
                b = !getUdgCasterTypes().isLabelAlreadyUsed(param2)
            }
            if (b) {
                getUdgCasterTypes().getByLabel(param1)?.setLabel(param2)
                Text.mkP(escaper.getPlayer(), 'label changed to "' + param2 + '"')
            } else {
                Text.erP(escaper.getPlayer(), 'impossible to change label')
            }
            return true
        },
    })

    //-setCasterAlias(setca) <casterLabel> <alias>
    registerCommand({
        name: 'setCasterAlias',
        alias: ['setca'],
        group: 'make',
        argDescription: '<casterLabel> <alias>',
        description: 'Change the alias of a caster monster',
        cb: ({ nbParam, param1, param2 }, escaper) => {
            if (!(nbParam === 2)) {
                return true
            }
            let b = !!getUdgCasterTypes().getByLabel(param1)
            if (b) {
                b = !getUdgCasterTypes().isLabelAlreadyUsed(param2)
            }
            if (b) {
                getUdgCasterTypes().getByLabel(param1)?.setAlias(param2)
                Text.mkP(escaper.getPlayer(), 'alias changed to "' + param2 + '"')
            } else {
                Text.erP(escaper.getPlayer(), 'impossible to change alias')
            }
            return true
        },
    })

    //-setCasterCaster(setcc) <casterLabel> <casterMonsterType>
    registerCommand({
        name: 'setCasterCaster',
        alias: ['setcc'],
        group: 'make',
        argDescription: '<casterLabel> <casterMonsterType>',
        description: 'Change the caster monster type of a caster monster',
        cb: ({ nbParam, param1, param2 }, escaper) => {
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
            const monsterType = getUdgMonsterTypes().getByLabel(param2)
            monsterType && getUdgCasterTypes().getByLabel(param1)?.setCasterMonsterType(monsterType)
            Text.mkP(escaper.getPlayer(), 'caster monster type changed')
            return true
        },
    })

    //-setCasterProjectile(setcp) <casterLabel> <projectileMonsterType>
    registerCommand({
        name: 'setCasterProjectile',
        alias: ['setcp'],
        group: 'make',
        argDescription: '<casterLabel> <projectileMonsterType>',
        description: 'Change the projectile monster type of a caster monster',
        cb: ({ nbParam, param1, param2 }, escaper) => {
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
            const monsterType = getUdgMonsterTypes().getByLabel(param2)
            monsterType && getUdgCasterTypes().getByLabel(param1)?.setProjectileMonsterType(monsterType)
            Text.mkP(escaper.getPlayer(), 'projectile monster type changed')
            return true
        },
    })

    //-setCasterRange(setcr) <casterLabel> <range>
    registerCommand({
        name: 'setCasterRange',
        alias: ['setcr'],
        group: 'make',
        argDescription: '<casterLabel> <range>',
        description: 'Change the range of a caster monster',
        cb: ({ nbParam, param1, param2 }, escaper) => {
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
            getUdgCasterTypes().getByLabel(param1)?.setRange(S2R(param2))
            Text.mkP(escaper.getPlayer(), 'range changed')
            return true
        },
    })

    //-setCasterSpeed(setcs) <casterLabel> <projectileSpeed>
    registerCommand({
        name: 'setCasterSpeed',
        alias: ['setcs'],
        group: 'make',
        argDescription: '<casterLabel> <projectileSpeed>',
        description: 'Change the speed of a caster monster',
        cb: ({ nbParam, param1, param2 }, escaper) => {
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
            getUdgCasterTypes().getByLabel(param1)?.setProjectileSpeed(S2R(param2))
            Text.mkP(escaper.getPlayer(), 'projectile speed changed')
            return true
        },
    })

    //-setCasterLoadtime(setclt) <casterLabel> <loadTime>
    registerCommand({
        name: 'setCasterLoadTime',
        alias: ['setclt'],
        group: 'make',
        argDescription: '<casterLabel> <loadTime>',
        description: 'Change the load time of a caster monster',
        cb: ({ nbParam, param1, param2 }, escaper) => {
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
            getUdgCasterTypes().getByLabel(param1)?.setLoadTime(S2R(param2))
            Text.mkP(escaper.getPlayer(), 'load time changed')
            return true
        },
    })

    //-setCasterAnimation(setcan) <casterLabel> <animation>
    registerCommand({
        name: 'setCasterAnimation',
        alias: ['setcan'],
        group: 'make',
        argDescription: '<casterLabel> <animation>',
        description: 'Change the animation of a caster monster',
        cb: ({ cmd, name, nbParam, param1 }, escaper) => {
            if (!(nbParam >= 2)) {
                return true
            }
            //checkParam 1
            if (!getUdgCasterTypes().isLabelAlreadyUsed(param1)) {
                Text.erP(escaper.getPlayer(), 'unknown caster type "' + param1 + '"')
                return true
            }
            //checkParam 2
            const n = StringLength(name) + StringLength(param1) + 4
            const str = SubStringBJ(cmd, n, StringLength(cmd))
            //apply command
            getUdgCasterTypes().getByLabel(param1)?.setAnimation(str)
            Text.mkP(escaper.getPlayer(), 'caster animation changed')
            return true
        },
    })

    //-createCaster(crc) <casterLabel> [<facingAngle>]
    registerCommand({
        name: 'createCaster',
        alias: ['crc'],
        group: 'make',
        argDescription: '<casterLabel> [<facingAngle>]',
        description: 'Create a caster monster',
        cb: ({ nbParam, param1, param2 }, escaper) => {
            if (nbParam < 1 || nbParam > 2) {
                return true
            }
            //checkParam 1
            if (!getUdgCasterTypes().isLabelAlreadyUsed(param1)) {
                Text.erP(escaper.getPlayer(), 'unknown caster type "' + param1 + '"')
                return true
            }

            let x = 0

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
            const casterType = getUdgCasterTypes().getByLabel(param1)
            casterType && escaper.makeCreateCaster(casterType, x)
            Text.mkP(escaper.getPlayer(), 'casters making on')
            return true
        },
    })

    //-deleteCastersBetweenPoints(delcbp)   --> delete casters in a rectangle formed with two clicks
    registerCommand({
        name: 'deleteCastersBetweenPoints',
        alias: ['delcbp'],
        group: 'make',
        argDescription: '',
        description: 'Delete casters in a rectangle formed with two clicks',
        cb: ({ noParam }, escaper) => {
            if (noParam) {
                escaper.makeDeleteCasters('twoClics')
                Text.mkP(escaper.getPlayer(), 'casters deleting on')
            }
            return true
        },
    })

    //-deleteCaster(delc)   --> delete the casters clicked by the player
    registerCommand({
        name: 'deleteCaster',
        alias: ['delc'],
        group: 'make',
        argDescription: '',
        description: 'Delete the casters clicked by the player',
        cb: ({ noParam }, escaper) => {
            if (noParam) {
                escaper.makeDeleteCasters('oneByOne')
                Text.mkP(escaper.getPlayer(), 'casters deleting on')
            }
            return true
        },
    })

    //-displayCasters(dc) [<casterLabel>] [page]
    registerCommand({
        name: 'displayCasters',
        alias: ['dc'],
        group: 'make',
        argDescription: '[<casterLabel>] [page]',
        description: 'Display the casters of the map',
        cb: ({ cmd }, escaper) => {
            getUdgCasterTypes().displayPaginatedForPlayer(escaper.getPlayer(), cmd)
            return true
        },
    })

    //-createClearMob(crcm) <disableDuration>
    registerCommand({
        name: 'createClearMob',
        alias: ['crcm'],
        group: 'make',
        argDescription: '<disableDuration>',
        description: 'Create a clear mob',
        cb: ({ nbParam, param1 }, escaper) => {
            if (!(nbParam === 1)) {
                return true
            }
            const x = S2R(param1)
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
        },
    })

    //-deleteClearMob(delcm)
    registerCommand({
        name: 'deleteClearMob',
        alias: ['delcm'],
        group: 'make',
        argDescription: '',
        description: 'Delete the clear mob',
        cb: ({ noParam }, escaper) => {
            if (!noParam) {
                return true
            }
            escaper.makeDeleteClearMobs()
            Text.mkP(escaper.getPlayer(), 'clear mobs deleting on')
            return true
        },
    })

    //-setClearMobEffect(setcme) <effectPath>
    registerCommand({
        name: 'setClearMobEffect',
        alias: ['setcme'],
        group: 'make',
        argDescription: '<effectPath>',
        description: 'Set special effect to play when stepping on clear mob trigger',
        cb: ({ nbParam, param1 }, escaper) => {
            if (!(nbParam === 1)) {
                return true
            }
            escaper.makeSetClearMobEffect(param1)
            Text.mkP(escaper.getPlayer(), 'Click on the trigger mob to set its effect')
            return true
        },
    })

    //-setBlockMobEffect(setbme) <effectPath>
    registerCommand({
        name: 'setBlockMobEffect',
        alias: ['setbme', 'setClearMobBlockMobEffect', 'setcmbme'],
        group: 'make',
        argDescription: '<effectPath>',
        description: 'Set special effect to play on block mobs when clear mob is triggered',
        cb: ({ nbParam, param1 }, escaper) => {
            if (!(nbParam === 1)) {
                return true
            }
            escaper.makeSetBlockMobEffect(param1)
            Text.mkP(escaper.getPlayer(), 'Click on the trigger mob to set its block mob effect')
            return true
        },
    })

    //-setClearMobDisableDuration(setcmdd) <disableDuration>
    registerCommand({
        name: 'setClearMobDisableDuration',
        alias: ['setcmdd'],
        group: 'make',
        argDescription: '<disableDuration>',
        description: 'Set the disable duration of the clear mob',
        cb: ({ nbParam, param1 }, escaper) => {
            if (!(nbParam === 1)) {
                return true
            }
            const x = S2R(param1)
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
            escaper.makeSetClearMobDisableDuration(x)
            Text.mkP(escaper.getPlayer(), 'clear mob disable duration setting on')
            return true
        },
    })

    //-createCircleMob [<speed> [<direction> [<radius>]]]
    registerCommand({
        name: 'createCircleMob',
        alias: ['crcim'],
        group: 'make',
        argDescription: '[<speed> [<direction> [<facing [<radius>]]]]',
        description: '',
        cb: ({ param1, param2, param3, param4 }, escaper) => {
            if (param1 !== '' && param1 !== '0' && S2I(param1) === 0) {
                Text.erP(escaper.getPlayer(), 'Speed must be > 0')
                return true
            }

            param2 = param2.toLowerCase()

            if (param2 !== '' && param2 !== 'cw' && param2 !== 'ccw') {
                Text.erP(escaper.getPlayer(), 'Direction must be "cw" or "ccw"')
                return true
            }

            if (param3 !== '' && param3 !== 'cw' && param3 !== 'ccw' && param3 !== 'in' && param3 !== 'out') {
                Text.erP(escaper.getPlayer(), 'Facing must be "cw", "ccw", "in" or "out"')
                return true
            }

            if (param4 !== '' && S2I(param4) === 0) {
                Text.erP(escaper.getPlayer(), 'Radius must be > 0')
                return true
            }

            Text.mkP(escaper.getPlayer(), 'Circle creation on. First click on the center mob')

            escaper.makeCreateCircleMob(
                param1 === '' ? null : S2I(param1),
                param2 === '' ? null : param2,
                param3 === '' ? null : param3,
                param4 === '' ? null : S2I(param4)
            )

            return true
        },
    })

    //-deleteCircleMob
    registerCommand({
        name: 'deleteCircleMob',
        alias: ['delcim'],
        group: 'make',
        argDescription: '',
        description: '',
        cb: ({ noParam }, escaper) => {
            if (!noParam) {
                return true
            }
            escaper.makeDeleteCircleMob()
            Text.mkP(escaper.getPlayer(), 'circles deleting on')
            return true
        },
    })

    //-setCircleMobSpeed(setcims) <speed>
    registerCommand({
        name: 'setCircleMobSpeed',
        alias: ['setcims'],
        group: 'make',
        argDescription: '<speed>',
        description: '',
        cb: ({ param1 }, escaper) => {
            if (param1 !== '0' && S2R(param1) == 0) {
                Text.erP(escaper.getPlayer(), 'Speed must be > 0')
                return true
            }

            escaper.makeSetCircleMobSpeed(S2R(param1))
            Text.mkP(escaper.getPlayer(), 'Click on the circle to apply')
            return true
        },
    })

    //-setCircleMobDirection(setcimd) <direction>
    registerCommand({
        name: 'setCircleMobDirection',
        alias: ['setcimd'],
        group: 'make',
        argDescription: 'cw | ccw',
        description: 'Clockwise of counter-clockwise',
        cb: ({ param1 }, escaper) => {
            param1 = param1.toLowerCase()
            if (param1 !== 'cw' && param1 !== 'ccw') {
                Text.erP(escaper.getPlayer(), 'Direction must be "cw" or "ccw"')
                return true
            }

            escaper.makeSetCircleMobDirection(param1)
            Text.mkP(escaper.getPlayer(), 'Click on the circle to apply')
            return true
        },
    })

    //-setCircleMobFacing(setcimf) <facing>
    registerCommand({
        name: 'setCircleMobFacing',
        alias: ['setcimf'],
        group: 'make',
        argDescription: 'cw | ccw | in | out',
        description: 'In or out of the circle',
        cb: ({ param1 }, escaper) => {
            param1 = param1.toLowerCase()
            if (param1 !== 'cw' && param1 !== 'ccw' && param1 !== 'in' && param1 !== 'out') {
                Text.erP(escaper.getPlayer(), 'Facing must be "cw", "ccw", "in" or "out"')
                return true
            }

            escaper.makeSetCircleMobFacing(param1)
            Text.mkP(escaper.getPlayer(), 'Click on the circle to apply')
            return true
        },
    })

    //-setCircleMobShape(setcimsh) <shape>
    registerCommand({
        name: 'setCircleMobShape',
        alias: ['setcimsh'],
        group: 'make',
        argDescription:
            'circle | square | triangle | pentagon | hexagon | octagon | eight | star | spiral | heart | infinity | rose | butterfly',
        description: 'Shape of the CircleMob formation',
        cb: ({ param1 }, escaper) => {
            param1 = param1.toLowerCase()
            const validShapes = [
                'circle',
                'square',
                'triangle',
                'pentagon',
                'hexagon',
                'octagon',
                'eight',
                'star',
                'spiral',
                'heart',
                'infinity',
                'rose',
                'butterfly',
            ]
            if (!validShapes.includes(param1)) {
                Text.erP(
                    escaper.getPlayer(),
                    'Shape must be one of: circle, square, triangle, pentagon, hexagon, octagon, eight, star, spiral, heart, infinity, rose, butterfly'
                )
                return true
            }

            escaper.makeSetCircleMobShape(param1 as any)
            Text.mkP(escaper.getPlayer(), 'Click on the circle to apply')
            return true
        },
    })

    //-setCircleMobInitialAngle(setcimia) <angle>
    registerCommand({
        name: 'setCircleMobInitialAngle',
        alias: ['setcimia'],
        group: 'make',
        argDescription: '<angle>',
        description: '',
        cb: ({ param1 }, escaper) => {
            const angle = convertTextToAngle(param1)

            if (!angle) {
                Text.erP(escaper.getPlayer(), 'Angle must be > 0 and <= 360')
                return true
            }

            escaper.makeSetCircleMobInitialAngle(angle)
            Text.mkP(escaper.getPlayer(), 'Click on the circle to apply')
            return true
        },
    })

    //-setCircleMobRadius(setcimr) <radius>
    registerCommand({
        name: 'setCircleMobRadius',
        alias: ['setcimr'],
        group: 'make',
        argDescription: '<radius>',
        description: '',
        cb: ({ param1 }, escaper) => {
            if (S2I(param1) <= 0) {
                Text.erP(escaper.getPlayer(), 'Radius must be > 0')
                return true
            }

            escaper.makeSetCircleMobRadius(S2I(param1))
            Text.mkP(escaper.getPlayer(), 'Click on the circle to apply')
            return true
        },
    })

    //-createStaticSlide(crss) <angle> <speed>
    registerCommand({
        name: 'createStaticSlide',
        alias: ['crss'],
        group: 'make',
        argDescription: '<angle> <speed>',
        description: '',
        cb: ({ param1, param2 }, escaper) => {
            const angle = convertTextToAngle(param1)

            if (!angle) {
                Text.erP(escaper.getPlayer(), 'Angle must be > 0 and <= 360')
                return true
            }

            if (!(S2I(param2) > 0 && S2I(param2) <= 1000)) {
                Text.erP(escaper.getPlayer(), 'Speed must be > 0 and <= 1000')
                return true
            }

            Text.mkP(escaper.getPlayer(), 'Static slide creation on. Click for regions')

            escaper.makeCreateStaticSlide(angle, S2I(param2))

            return true
        },
    })

    //-deleteStaticSlide
    registerCommand({
        name: 'deleteStaticSlide',
        alias: ['delss'],
        group: 'make',
        argDescription: '',
        description: '',
        cb: ({ noParam }, escaper) => {
            if (!noParam) {
                return true
            }
            escaper.makeDeleteStaticSlide()
            Text.mkP(escaper.getPlayer(), 'static slide deletion on')
            return true
        },
    })

    //-getStaticSlideInfo
    registerCommand({
        name: 'getStaticSlideInfo',
        alias: ['gssi', 'getssi'],
        group: 'make',
        argDescription: '',
        description: '',
        cb: ({ noParam }, escaper) => {
            if (!noParam) {
                return true
            }
            escaper.makeStaticSlideInfo()
            Text.mkP(escaper.getPlayer(), 'Click on a static slide')
            return true
        },
    })

    //-setStaticSlideSpeed(setsss) <speed>
    registerCommand({
        name: 'setStaticSlideSpeed',
        alias: ['setsss'],
        group: 'make',
        argDescription: '<speed>',
        description: '',
        cb: ({ param1 }, escaper) => {
            if (!(S2I(param1) > 0 && S2I(param1) <= 1000)) {
                Text.erP(escaper.getPlayer(), 'Speed must be > 0 and <= 1000')
                return true
            }

            escaper.makeSetStaticSlideSpeed(S2R(param1))
            Text.mkP(escaper.getPlayer(), 'Click on the staticSlide to apply')
            return true
        },
    })

    //-setStaticSlideAngle(setssa) <angle>
    registerCommand({
        name: 'setStaticSlideAngle',
        alias: ['setssa'],
        group: 'make',
        argDescription: '<angle>',
        description: '',
        cb: ({ param1 }, escaper) => {
            const angle = convertTextToAngle(param1)

            if (!angle) {
                Text.erP(escaper.getPlayer(), 'Angle must be > 0 and <= 360')
                return true
            }

            escaper.makeSetStaticSlideAngle(angle)
            Text.mkP(escaper.getPlayer(), 'Click on the staticSlide to apply')
            return true
        },
    })

    //-setStaticSlideCanTurnAngle(setsscta) <angle>
    registerCommand({
        name: 'setStaticSlideCanTurnAngle',
        alias: ['setsscta'],
        group: 'make',
        argDescription: '<angle>',
        description: '',
        cb: ({ param1 }, escaper) => {
            escaper.makeSetStaticSlideCanTurnAngle(convertTextToAngle(param1))
            Text.mkP(escaper.getPlayer(), 'Click on the staticSlide to apply')
            return true
        },
    })

    //-setMonsterJumpPad(setmjp) <jumpPadZ>
    registerCommand({
        name: 'setMonsterJumpPad',
        alias: ['setmjp'],
        group: 'make',
        argDescription: '<jumpPadZ>',
        description: '',
        cb: ({ param1 }, escaper) => {
            if (!(S2I(param1) > 0 && S2I(param1) <= 100)) {
                Text.erP(escaper.getPlayer(), 'JumpPad must be > 0 and <= 100')
                return true
            }

            escaper.makeSetMonsterJumpPad(S2I(param1) === 0 ? undefined : S2I(param1))

            Text.mkP(escaper.getPlayer(), 'Click on a monster to apply')
            return true
        },
    })

    //-setMonsterJumpPadEffect(setmjpe) <jumpPadEffect>
    registerCommand({
        name: 'setMonsterJumpPadEffect',
        alias: ['setmjpe'],
        group: 'make',
        argDescription: '[jumpPadEffect]',
        description: '',
        cb: ({ param1 }, escaper) => {
            escaper.makeSetMonsterJumpPadEffect(param1)

            Text.mkP(escaper.getPlayer(), 'Click on a monster to apply')
            return true
        },
    })

    //-setMonsterAttackGround(setmag) [<delay>]
    registerCommand({
        name: 'setMonsterAttackGround',
        alias: ['setmag'],
        group: 'make',
        argDescription: '[<delay>]',
        description: 'Set monster to attack ground with optional delay',
        cb: ({ param1 }, escaper) => {
            const delay = param1 ? S2R(param1) : 0

            if (param1 && (delay < 0 || delay > 60)) {
                Text.erP(escaper.getPlayer(), 'Delay must be between 0 and 60 seconds')
                return true
            }

            escaper.makeSetMonsterAttackGroundOrder(delay)

            Text.mkP(escaper.getPlayer(), 'Click on a monster to apply')
            return true
        },
    })

    //-debugRegions <active>
    registerCommand({
        name: 'debugRegions',
        alias: ['dr'],
        group: 'make',
        argDescription: '<active> [monsters]',
        description: '',
        cb: ({ param1, param2 }, escaper) => {
            if (!IsBoolString(param1)) {
                Text.erP(escaper.getPlayer(), 'the property "active" must be a boolean (true or false)')
                return true
            }

            if (param2.length > 0 && !IsBoolString(param2)) {
                Text.erP(escaper.getPlayer(), 'the property "monsters" must be a boolean (true or false)')
                return true
            }

            escaper
                .getMakingLevel()
                .setDebugRegionsVisible(
                    param2.length > 0
                        ? S2B(param1) && S2B(param2)
                            ? 'on_monsters'
                            : 'off'
                        : S2B(param1)
                          ? 'on'
                          : 'off'
                )
            Text.mkP(escaper.getPlayer(), `debugRegions ${S2B(param1) ? 'on' : 'off'}`)
            return true
        },
    })

    //-createPortalMob(crpm) <freezeDuration> [<portalEffect> [<portalEffectDuration>]]
    registerCommand({
        name: 'createPortalMob',
        alias: ['crpm'],
        group: 'make',
        argDescription: '<freezeDuration> [<portalEffect> [<portalEffectDuration>]]',
        description: 'Create a portal mob',
        cb: ({ nbParam, param1, param2, param3 }, escaper) => {
            if (!(nbParam === 1 || nbParam === 2 || nbParam === 3)) {
                return true
            }
            const x = S2R(param1)
            if (x !== 0 && (x > PORTAL_MOB_MAX_FREEZE_DURATION || x < 0)) {
                Text.erP(
                    escaper.getPlayer(),
                    'the disable duration must be a real between ' +
                        R2S(0) +
                        ' and ' +
                        R2S(PORTAL_MOB_MAX_FREEZE_DURATION)
                )
                return true
            }

            if (param3 !== '') {
                if (!(S2R(param3) > 0)) {
                    Text.erP(escaper.getPlayer(), 'the portal effect duration must be > 0')
                    return true
                }
            }

            escaper.makeCreatePortalMobs(x, param2, param3 === '' ? null : S2R(param3))
            Text.mkP(escaper.getPlayer(), 'portal mob making on')
            return true
        },
    })

    //-deletePortalMob(delpm)
    registerCommand({
        name: 'deletePortalMob',
        alias: ['delpm'],
        group: 'make',
        argDescription: '',
        description: 'Delete the portal mob',
        cb: ({ noParam }, escaper) => {
            if (!noParam) {
                return true
            }
            escaper.makeDeletePortalMobs()
            Text.mkP(escaper.getPlayer(), 'portal mobs deleting on')
            return true
        },
    })

    //-setPortalMobFreezeDuration(spmfd) <freezeDuration>
    registerCommand({
        name: 'setPortalMobFreezeDuration',
        alias: ['setpmfd'],
        group: 'make',
        argDescription: '<freezeDuration>',
        description: 'Set the freeze duration of the portal mob',
        cb: ({ nbParam, param1 }, escaper) => {
            if (!(nbParam === 1)) {
                return true
            }
            const x = S2R(param1)
            if (x !== 0 && (x > PORTAL_MOB_MAX_FREEZE_DURATION || x < 0)) {
                Text.erP(
                    escaper.getPlayer(),
                    'the disable duration must be a real between ' +
                        R2S(0) +
                        ' and ' +
                        R2S(PORTAL_MOB_MAX_FREEZE_DURATION)
                )
                return true
            }
            escaper.makeSetPortalMobFreezeDuration(x)
            Text.mkP(escaper.getPlayer(), 'portal mob freeze duration setting on')
            return true
        },
    })

    //-setPortalMobEffect(spme) <portalEffect>
    registerCommand({
        name: 'setPortalMobEffect',
        alias: ['setpme'],
        group: 'make',
        argDescription: '<portalEffect>',
        description: 'Set the portal effect of the portal mob',
        cb: ({ nbParam, param1 }, escaper) => {
            if (!(nbParam === 1)) {
                return true
            }

            escaper.makeSetPortalMobPortalEffect(param1)
            Text.mkP(escaper.getPlayer(), 'portal mob portal effect setting on')
            return true
        },
    })

    //-setPortalMobEffectDuration(spmed) <portalEffectDuration>
    registerCommand({
        name: 'setPortalMobEffectDuration',
        alias: ['setpmed'],
        group: 'make',
        argDescription: '<portalEffectDuration>',
        description: 'Set the portal effect duration of the portal mob',
        cb: ({ param1 }, escaper) => {
            if (param1 !== '') {
                if (!(S2R(param1) > 0)) {
                    Text.erP(escaper.getPlayer(), 'the portal effect duration must be > 0')
                    return true
                }
            }

            escaper.makeSetPortalMobPortalEffectDuration(param1 === '' ? null : S2R(param1))
            Text.mkP(escaper.getPlayer(), 'portal mob portal effect duration setting on')
            return true
        },
    })

    //-getTerrainCliffClass(gettcc) <terrainLabel>
    registerCommand({
        name: 'getTerrainCliffClass',
        alias: ['gettcc'],
        group: 'make',
        argDescription: '<terrainLabel>',
        description: 'Get the cliff class of the terrain',
        cb: ({ nbParam, param1 }, escaper) => {
            if (nbParam !== 1) {
                return true
            }

            //checkParam 1
            const terrainType = getUdgTerrainTypes().getByLabel(param1)

            if (!terrainType) {
                return true
            }

            //apply command
            terrainType &&
                Text.mkP(escaper.getPlayer(), 'cliff class for that terrain is ' + I2S(terrainType.getCliffClassId()))

            return true
        },
    })

    //-getMainTileset
    registerCommand({
        name: 'getMainTileset',
        alias: [],
        group: 'make',
        argDescription: '',
        description: 'Get the main tileset',
        cb: ({ noParam }, escaper) => {
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
        },
    })

    // -setClickGrid <value>
    registerCommand({
        name: 'setClickGrid',
        alias: ['setcg', 'snapClicks'],
        group: 'make',
        argDescription: '<value>',
        description: 'Snap clicks to nearest <value>',
        cb: ({ nbParam, param1 }, escaper) => {
            if (nbParam === 1) {
                escaper.roundToGrid = S2I(param1) > 1 && S2I(param1) <= 128 ? S2I(param1) : null

                if (escaper.roundToGrid) {
                    Text.mkP(escaper.getPlayer(), `Now snapping clicks to: '${escaper.roundToGrid}'`)
                } else {
                    Text.erP(escaper.getPlayer(), `Disabled snapping clicks`)
                }
            }

            return true
        },
    })

    const gridUnits: unit[] = []

    // -grid <boolean>
    registerCommand({
        name: 'grid',
        alias: [],
        group: 'make',
        argDescription: '<boolean>',
        description: 'Toggle grid',
        cb: ({ param1 }) => {
            const showGrid = param1 === '3' ? '3' : param1 === '2' ? '2' : S2B(param1)

            for (const unit of gridUnits) {
                RemoveUnit(unit)
            }

            if (showGrid) {
                const gridUnitWidth = 128 * 4

                for (let x = globals.MAP_MIN_X + gridUnitWidth; x < globals.MAP_MAX_X; x += gridUnitWidth) {
                    for (let y = globals.MAP_MIN_Y + gridUnitWidth; y < globals.MAP_MAX_Y; y += gridUnitWidth) {
                        const gridUnit = CreateUnit(GetCurrentMonsterPlayer(), FourCC('hgrd'), x, y, 0)
                        SetUnitUseFood(gridUnit, false)
                        UnitAddAbility(gridUnit, FourCC('Aloc'))
                        UnitAddAbility(gridUnit, ABILITY_ANNULER_VISION)
                        UnitRemoveType(gridUnit, UNIT_TYPE_PEON)

                        if (showGrid === '3') {
                            SetUnitAnimation(gridUnit, 'Stand Upgrade Second')
                        } else if (showGrid === '2') {
                            SetUnitAnimation(gridUnit, 'Stand Upgrade First')
                        } else {
                            SetUnitAnimation(gridUnit, 'Stand')
                        }

                        arrayPush(gridUnits, gridUnit)
                    }
                }
            }

            return true
        },
    })

    // -snapPatrolsToGrid <value>
    registerCommand({
        name: 'snapPatrolsToGrid',
        alias: ['sptg'],
        group: 'make',
        argDescription: '<value>',
        description: 'Snap all patrols to nearest <value>',
        cb: ({ nbParam, param1 }, escaper) => {
            if (nbParam === 1) {
                const roundToGrid = S2I(param1) > 1 && S2I(param1) <= 128 ? S2I(param1) : null

                // todo should turn this into a ctrl+z able action
                if (roundToGrid) {
                    for (const [_, level] of pairs(getUdgLevels().getAll())) {
                        for (const [_, monster] of pairs(level.monsters.getAll())) {
                            if (monster instanceof MonsterSimplePatrol) {
                                monster.x1 = Math.round(monster.x1 / roundToGrid) * roundToGrid + GetRandomInt(-4, 4)
                                monster.y1 = Math.round(monster.y1 / roundToGrid) * roundToGrid + GetRandomInt(-4, 4)
                                monster.x2 = Math.round(monster.x2 / roundToGrid) * roundToGrid + GetRandomInt(-4, 4)
                                monster.y2 = Math.round(monster.y2 / roundToGrid) * roundToGrid + GetRandomInt(-4, 4)
                            } else if (monster instanceof MonsterNoMove) {
                                monster.x = Math.round(monster.x / roundToGrid) * roundToGrid + GetRandomInt(-4, 4)
                                monster.y = Math.round(monster.y / roundToGrid) * roundToGrid + GetRandomInt(-4, 4)
                            } else if (monster instanceof MonsterMultiplePatrols) {
                                for (let i = 0; i < monster.x.length; i++) {
                                    monster.x[i] =
                                        Math.round(monster.x[i] / roundToGrid) * roundToGrid + GetRandomInt(-4, 4)
                                    monster.y[i] =
                                        Math.round(monster.y[i] / roundToGrid) * roundToGrid + GetRandomInt(-4, 4)
                                }
                            }
                        }
                    }
                }

                getUdgLevels().reloadAllLevels()

                Text.mkP(escaper.getPlayer(), `Snapped all monsters to: '${roundToGrid}'`)
            }

            return true
        },
    })

    const snapPatrolsToSlideOffsetMap: { [mt: string]: { angle: number; offset: number } | null } = {}

    // -snapPatrolsToSlideOffset [<mt> <angle> <offset>]
    registerCommand({
        name: 'snapPatrolsToSlideOffset',
        alias: ['sptso'],
        group: 'make',
        argDescription: '[<mt> <angle> <offset>]',
        description: '',
        cb: ({ nbParam, param1, param2, param3 }, escaper) => {
            if (nbParam === 0) {
                for (const [mt, item] of pairs(snapPatrolsToSlideOffsetMap)) {
                    Text.mkP(escaper.getPlayer(), `${mt}: ${convertAngleToDirection(item.angle)} ${item.offset}`)
                }

                return true
            } else {
                const mt = param1
                const angle = convertTextToAngle(param2)
                const offset = S2I(param3)

                if (!getUdgMonsterTypes().getByLabel(mt) && mt !== 'all') {
                    Text.erP(escaper.getPlayer(), `Invalid monster type`)
                    return true
                }

                if (!angle) {
                    snapPatrolsToSlideOffsetMap[mt] = null
                    Text.P(escaper.getPlayer(), `Disabled offset for ${mt}`)
                    return true
                }

                if (param3 === '' || offset < -256 || offset > 256) {
                    Text.erP(escaper.getPlayer(), `Offset must be between -256 and 256`)
                    return true
                }

                snapPatrolsToSlideOffsetMap[mt] = { angle, offset }

                Text.mkP(
                    escaper.getPlayer(),
                    `Set angle to ${convertAngleToDirection(angle)} and offset to ${offset} for ${mt}`
                )
                return true
            }
        },
    })

    // -snapPatrolsToSlide <value> [boolean fixStartOnSlidePatrols]
    registerCommand({
        name: 'snapPatrolsToSlide',
        alias: ['spts'],
        group: 'make',
        argDescription: '<value> [boolean fixStartOnSlidePatrols]',
        description: 'Snap all patrols to nearest slide terrain with an offset of <value>',
        cb: ({ nbParam, param1, param2 }, escaper) => {
            if (nbParam === 1 || nbParam === 2) {
                const snapToSlide = S2I(param1)

                if (snapToSlide > 256) {
                    Text.erP(escaper.getPlayer(), `Snap to slide value must be between -256 and 256`)
                    return true
                }

                const fixStartOnSlidePatrols = S2B(param2)

                // todo should turn this into a ctrl+z able action
                if (snapToSlide) {
                    const currentVtoto = globals.USE_VTOTO_SLIDE_LOGIC
                    globals.USE_VTOTO_SLIDE_LOGIC = true

                    for (const [_, level] of pairs(getUdgLevels().getAll())) {
                        for (const [_, monster] of pairs(level.monsters.getAll())) {
                            if (!monster.mt) {
                                continue
                            }

                            if (monster instanceof MonsterSimplePatrol) {
                                const p1 = snapPointToSlide(
                                    `${monster.id}_1`,
                                    monster.x1,
                                    monster.y1,
                                    monster.x2,
                                    monster.y2,
                                    snapToSlide,
                                    fixStartOnSlidePatrols,
                                    monster.mt
                                )

                                const p2 = snapPointToSlide(
                                    `${monster.id}_2`,
                                    monster.x2,
                                    monster.y2,
                                    monster.x1,
                                    monster.y1,
                                    snapToSlide,
                                    fixStartOnSlidePatrols,
                                    monster.mt
                                )

                                monster.x1 = p1.x
                                monster.y1 = p1.y
                                monster.x2 = p2.x
                                monster.y2 = p2.y

                                p1.__destroy()
                                p2.__destroy()
                            } else if (monster instanceof MonsterMultiplePatrols) {
                                for (let i = 0; i < monster.x.length; i++) {
                                    const nx = i + 1 > monster.x.length - 1 ? 0 : i + 1
                                    const ny = i + 1 > monster.y.length - 1 ? 0 : i + 1

                                    const p1 = snapPointToSlide(
                                        `${monster.id}_${i}`,
                                        monster.x[i],
                                        monster.y[i],
                                        monster.x[nx],
                                        monster.y[ny],
                                        snapToSlide,
                                        fixStartOnSlidePatrols,
                                        monster.mt
                                    )

                                    monster.setLocAt(i, p1.x, p1.y)
                                    p1.__destroy()
                                }
                            }
                        }
                    }

                    globals.USE_VTOTO_SLIDE_LOGIC = currentVtoto
                }

                getUdgLevels().reloadAllLevels()

                Text.mkP(escaper.getPlayer(), `Snapped all monsters to: '${snapToSlide}'`)
            }

            return true
        },
    })

    const snappedHistoryMap: { [historyId: string]: { x: number | undefined; y: number | undefined } } = {}

    const snapPointToSlide = (
        historyId: string,
        _x1: number,
        _y1: number,
        x2: number,
        y2: number,
        preferredDistance: number,
        fixStartOnSlidePatrols: boolean,
        mt: MonsterType
    ) => {
        const x1 = snappedHistoryMap[historyId]?.x || _x1
        const y1 = snappedHistoryMap[historyId]?.y || _y1

        if (!snappedHistoryMap[historyId]) {
            snappedHistoryMap[historyId] = { x: _x1, y: _y1 }
        }

        const currentTerrain = getUdgTerrainTypes().getTerrainType(x1, y1)
        let newX = x1
        let newY = y1

        if (currentTerrain?.kind === 'death') {
            const angle = Atan2(y2 - y1, x2 - x1)
            let currentX: number | undefined = undefined
            let currentY: number | undefined = undefined

            for (let i = 0; i <= 256; i++) {
                const testX = x1 + Math.cos(angle) * i
                const testY = y1 + Math.sin(angle) * i
                const tt = getUdgTerrainTypes().getTerrainType(testX, testY)

                if (tt?.kind === 'slide' || tt?.kind === 'walk') {
                    currentX = testX
                    currentY = testY
                    break
                }
            }

            if (currentX !== undefined && currentY !== undefined) {
                const oppositeAngle = angle + Math.PI

                newX = currentX + Math.cos(oppositeAngle) * (preferredDistance + GetRandomInt(-4, 4))
                newY = currentY + Math.sin(oppositeAngle) * (preferredDistance + GetRandomInt(-4, 4))
            }
        }

        if (fixStartOnSlidePatrols && (currentTerrain?.kind === 'slide' || currentTerrain?.kind === 'walk')) {
            const angle = Atan2(y2 - y1, x2 - x1) + Math.PI

            let currentX: number | undefined = undefined
            let currentY: number | undefined = undefined

            for (let i = 0; i <= 256; i++) {
                const testX = x1 + Math.cos(angle) * i
                const testY = y1 + Math.sin(angle) * i
                const tt = getUdgTerrainTypes().getTerrainType(testX, testY)

                if (tt?.kind === 'death') {
                    currentX = testX
                    currentY = testY
                    break
                }
            }

            if (currentX !== undefined && currentY !== undefined) {
                const oppositeAngle = angle

                newX = currentX + Math.cos(oppositeAngle) * (preferredDistance + GetRandomInt(-4, 4))
                newY = currentY + Math.sin(oppositeAngle) * (preferredDistance + GetRandomInt(-4, 4))
            }
        }

        const item = snapPatrolsToSlideOffsetMap[mt.label] || snapPatrolsToSlideOffsetMap['all']

        if (item) {
            newX += Math.cos(item.angle) * item.offset
            newY += Math.sin(item.angle) * item.offset
        }

        return createPoint(newX, newY)
    }
}
