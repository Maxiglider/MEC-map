import { IsBoolString, S2B } from 'core/01_libraries/Basic_functions'
import { NB_ESCAPERS } from 'core/01_libraries/Constants'
import { IsInteger, IsPositiveInteger } from 'core/01_libraries/Functions_on_numbers'
import { Text } from 'core/01_libraries/Text'
import { Escaper } from 'core/04_STRUCTURES/Escaper/Escaper'
import { GetMirrorEscaper } from 'core/04_STRUCTURES/Escaper/Escaper_functions'
import { METEOR_CHEAT } from 'core/04_STRUCTURES/Meteor/Meteor'
import { Gravity } from 'core/07_TRIGGERS/Slide_and_CheckTerrain_triggers/Gravity'
import { ServiceManager } from 'Services'
import { getUdgEscapers, getUdgLevels, globals } from '../../../../globals'
import { runInTrigger } from '../../../Utils/mapUtils'
import { getUdgViewAll } from '../../03_view_all_hide_all/View_all_hide_all'
import { MeteorFunctions } from '../../04_STRUCTURES/Meteor/Meteor_functions'
import { Trig_InvisUnit_is_getting_damage } from '../../08_GAME/Death/InvisUnit_is_getting_damage'
import { isPlayerId, resolvePlayerId, resolvePlayerIds } from './Command_functions'
import { ActivateTeleport } from './Teleport'

export const initExecuteCommandCheat = () => {
    const { registerCommand } = ServiceManager.getService('Cmd')

    const reviveCb = (escaper: Escaper) => escaper.reviveAtStart()

    const revivePositionCb = (escaper: Escaper) => {
        const hero = escaper.getHero()

        if (!hero) {
            return
        }

        if (!escaper.isAlive()) {
            runInTrigger(escaper.coopReviveHero)
        }
    }

    //-slideSpeed(ss) <speed>   --> changes the slide speed of your hero, ignoring terrains
    registerCommand({
        name: 'setSlideSpeed',
        alias: ['ss'],
        group: 'cheat',
        argDescription: '<speed>',
        description: 'Changes the slide speed of your hero, ignoring terrains',
        cb: ({ nbParam, param1, param2 }, escaper) => {
            if (!IsInteger(param1)) {
                return true
            }
            const speed = S2R(param1)
            if (nbParam === 1) {
                escaper.absoluteSlideSpeed(speed, true)
                Text.P(escaper.getPlayer(), 'your slide speed is set to ' + param1)
                return true
            }
            if (!(nbParam == 2 && escaper.isMaximaxou())) {
                return true
            }
            if (param2 === 'all' || param2 === 'a') {
                let i = 0
                while (true) {
                    if (i >= NB_ESCAPERS) break
                    if (getUdgEscapers().get(i) != null) {
                        getUdgEscapers().get(i)?.absoluteSlideSpeed(speed, true)
                    }
                    i = i + 1
                }
                Text.P(escaper.getPlayer(), 'slide speed for all is set to ' + param1)
                return true
            }
            if (isPlayerId(param2)) {
                if (getUdgEscapers().get(resolvePlayerId(param2)) != null) {
                    getUdgEscapers().get(resolvePlayerId(param2))?.absoluteSlideSpeed(speed, true)
                    Text.P(escaper.getPlayer(), 'slide speed for player ' + param2 + ' is set to ' + param1)
                }
            }
            return true
        },
    })

    //-normalSlideSpeed(nss)   --> puts the slide speed back to normal (respecting terrains)
    registerCommand({
        name: 'normalSlideSpeed',
        alias: ['nss'],
        group: 'cheat',
        argDescription: '',
        description: 'Puts the slide speed back to normal (respecting terrains)',
        cb: ({ noParam, nbParam, param1 }, escaper) => {
            if (noParam) {
                escaper.stopAbsoluteSlideSpeed(true)
                Text.P(escaper.getPlayer(), 'your slide speed depends now on terrains')
                return true
            }
            if (!(nbParam == 1 && escaper.isMaximaxou())) {
                return true
            }
            if (param1 === 'all' || param1 === 'a') {
                let i = 0
                while (true) {
                    if (i >= NB_ESCAPERS) break
                    if (getUdgEscapers().get(i) != null) {
                        getUdgEscapers().get(i)?.stopAbsoluteSlideSpeed(true)
                    }
                    i = i + 1
                }
                Text.P(escaper.getPlayer(), 'slide speed for all depends now on terrains')
                return true
            }
            if (isPlayerId(param1)) {
                if (getUdgEscapers().get(resolvePlayerId(param1)) != null) {
                    getUdgEscapers().get(resolvePlayerId(param1))?.stopAbsoluteSlideSpeed(true)
                    Text.P(escaper.getPlayer(), 'slide speed for player ' + param1 + ' depends now on terrains')
                }
            }
            return true
        },
    })

    //-rotationSpeed(rs) <speed>   --> changes the rotation speed of your hero, ignoring terrains
    registerCommand({
        name: 'rotationSpeed',
        alias: ['rs'],
        group: 'cheat',
        argDescription: '<roundsPerSecond>',
        description: 'Changes the rotation speed of your hero, ignoring terrains',
        cb: ({ nbParam, param1, param2 }, escaper) => {
            if (S2R(param1) <= 0) {
                Text.erP(escaper.getPlayer(), 'The rotation speed has to be positive')
                return true
            }
            const speed = S2R(param1)
            if (nbParam === 1) {
                escaper.absoluteRotationSpeed(speed)
                Text.P(escaper.getPlayer(), 'your rotation speed is set to ' + param1)
                return true
            }
            if (!(nbParam == 2 && escaper.isMaximaxou())) {
                return true
            }
            if (param2 === 'all' || param2 === 'a') {
                let i = 0
                while (true) {
                    if (i >= NB_ESCAPERS) break
                    if (getUdgEscapers().get(i) != null) {
                        getUdgEscapers().get(i)?.absoluteRotationSpeed(speed)
                    }
                    i = i + 1
                }
                Text.P(escaper.getPlayer(), 'rotation speed for all is set to ' + param1)
                return true
            }
            if (isPlayerId(param2)) {
                if (getUdgEscapers().get(resolvePlayerId(param2)) != null) {
                    getUdgEscapers().get(resolvePlayerId(param2))?.absoluteRotationSpeed(speed)
                    Text.P(escaper.getPlayer(), 'rotation speed for player ' + param2 + ' is set to ' + param1)
                }
            }
            return true
        },
    })

    //-normalRotationSpeed(nrs)   --> puts the rotation speed back to normal (respecting terrains)
    registerCommand({
        name: 'normalRotationSpeed',
        alias: ['nrs'],
        group: 'cheat',
        argDescription: '',
        description: 'Puts the rotation speed back to normal (respecting terrains)',
        cb: ({ noParam, nbParam, param1 }, escaper) => {
            if (noParam) {
                escaper.stopAbsoluteRotationSpeed()
                Text.P(escaper.getPlayer(), 'your rotation speed depends now on terrains')
                return true
            }
            if (!(nbParam == 1 && escaper.isMaximaxou())) {
                return true
            }
            if (param1 === 'all' || param1 === 'a') {
                let i = 0
                while (true) {
                    if (i >= NB_ESCAPERS) break
                    if (getUdgEscapers().get(i) != null) {
                        getUdgEscapers().get(i)?.stopAbsoluteRotationSpeed()
                    }
                    i = i + 1
                }
                Text.P(escaper.getPlayer(), 'rotation speed for all depends now on terrains')
                return true
            }
            if (isPlayerId(param1)) {
                if (getUdgEscapers().get(resolvePlayerId(param1)) != null) {
                    getUdgEscapers().get(resolvePlayerId(param1))?.stopAbsoluteRotationSpeed()
                    Text.P(escaper.getPlayer(), 'rotation speed for player ' + param1 + ' depends now on terrains')
                }
            }
            return true
        },
    })

    //-walkSpeed(ws) <speed>   --> changes the walk speed of your hero, ignoring terrains
    registerCommand({
        name: 'setWalkSpeed',
        alias: ['ws'],
        group: 'cheat',
        argDescription: '<speed>',
        description: 'Changes the walk speed of your hero, ignoring terrains',
        cb: ({ nbParam, param1, param2 }, escaper) => {
            if (!IsInteger(param1)) {
                return true
            }
            const speed = S2R(param1)
            if (nbParam === 1) {
                escaper.absoluteWalkSpeed(speed)
                Text.P(escaper.getPlayer(), 'walk speed to ' + param1)
                return true
            }
            if (!(nbParam == 2 && escaper.isMaximaxou())) {
                return true
            }
            if (param2 === 'all' || param2 === 'a') {
                let i = 0
                while (true) {
                    if (i >= NB_ESCAPERS) break
                    if (getUdgEscapers().get(i) != null) {
                        getUdgEscapers().get(i)?.absoluteWalkSpeed(speed)
                    }
                    i = i + 1
                }
                Text.P(escaper.getPlayer(), 'walk speed for all to ' + param1)
                return true
            }
            if (isPlayerId(param2)) {
                if (getUdgEscapers().get(resolvePlayerId(param2)) != null) {
                    getUdgEscapers().get(resolvePlayerId(param2))?.absoluteWalkSpeed(speed)
                    Text.P(escaper.getPlayer(), 'walk speed for player ' + param2 + ' to ' + param1)
                }
            }
            return true
        },
    })

    //-normalWalkSpeed(nws)   --> puts the walk speed back to normal (respecting terrains)
    registerCommand({
        name: 'normalWalkSpeed',
        alias: ['nws'],
        group: 'cheat',
        argDescription: '',
        description: 'Puts the walk speed back to normal (respecting terrains)',
        cb: ({ noParam, nbParam, param1 }, escaper) => {
            if (noParam) {
                escaper.stopAbsoluteWalkSpeed()
                Text.P(escaper.getPlayer(), 'walk speed depends now on terrains')
                return true
            }
            if (!(nbParam == 1 && escaper.isMaximaxou())) {
                return true
            }
            if (param1 === 'all' || param1 === 'a') {
                let i = 0
                while (true) {
                    if (i >= NB_ESCAPERS) break
                    if (getUdgEscapers().get(i) != null) {
                        getUdgEscapers().get(i)?.stopAbsoluteWalkSpeed()
                    }
                    i = i + 1
                }
                Text.P(escaper.getPlayer(), 'walk speed for all depends now on terrains')
                return true
            }
            if (isPlayerId(param1)) {
                if (getUdgEscapers().get(resolvePlayerId(param1)) != null) {
                    getUdgEscapers().get(resolvePlayerId(param1))?.stopAbsoluteWalkSpeed()
                    Text.P(escaper.getPlayer(), 'walk speed for player ' + param1 + ' depends now on terrains')
                }
            }
            return true
        },
    })

    //-teleport(t)   --> teleports your hero at the next clic
    registerCommand({
        name: 'teleport',
        alias: ['t'],
        group: 'cheat',
        argDescription: '',
        description: 'Teleports your hero at the next clic',
        enabled: ({ noParam, nbParam, param1 }) => {
            return noParam || (nbParam === 1 && (param1 === '0' || S2R(param1) !== 0))
        },
        cb: ({ nbParam, param1 }, escaper) => {
            const h1 = escaper.getHero()
            const h2 = GetMirrorEscaper(escaper)?.getHero()

            if (nbParam === 1) {
                h1 && SetUnitFacing(h1, S2R(param1))
                h2 && SetUnitFacing(h2, S2R(param1))
            }

            h1 && ActivateTeleport(h1, true)
            h2 && ActivateTeleport(h2, true)

            return true
        },
    })

    //-revive(r)   --> revives your hero
    registerCommand({
        name: 'revive',
        alias: ['r'],
        group: 'cheat',
        argDescription: '',
        description: 'Revives your hero',
        cb: ({ noParam, nbParam, param1 }, escaper) => {
            if (noParam) {
                reviveCb(escaper)
                return true
            }

            if (!(nbParam == 1 && escaper.isMaximaxou())) {
                return true
            }

            resolvePlayerIds(param1, reviveCb)
            return true
        },
    })

    //-revivePosition(rpos)   --> revives your hero
    registerCommand({
        name: 'revivePosition',
        alias: ['rpos'],
        group: 'cheat',
        argDescription: '',
        description: 'Revives your hero',
        cb: ({ noParam, nbParam, param1 }, escaper) => {
            if (noParam) {
                revivePositionCb(escaper)
                return true
            }

            if (!(nbParam == 1 && escaper.isMaximaxou())) {
                return true
            }

            resolvePlayerIds(param1, revivePositionCb)
            return true
        },
    })

    //-back
    registerCommand({
        name: 'back',
        alias: ['b'],
        group: 'cheat',
        argDescription: '',
        description: 'Teleports you to your previous location',
        cb: ({ noParam }, escaper) => {
            if (noParam) {
                if (escaper.lastPos) {
                    escaper.moveHero(escaper.lastPos[0], escaper.lastPos[1])
                    escaper.coopReviveHero()
                }

                return true
            }

            return true
        },
    })

    //-reviveTo(rto) <Pcolor>   --> revives your hero to an other hero, with the same facing angle
    registerCommand({
        name: 'reviveTo',
        alias: ['rto', 'rposto'],
        group: 'cheat',
        argDescription: '<Pcolor>',
        description: 'Revives your hero to an other hero, with the same facing angle',
        cb: ({ nbParam, param1 }, escaper) => {
            if (!(nbParam === 1 && isPlayerId(param1))) {
                return true
            }

            const n = resolvePlayerId(param1)

            if (getUdgEscapers().get(n) == null) {
                return true
            }

            const targetHero = getUdgEscapers().get(n)?.getHero()
            const hero = escaper.getHero()

            if (!targetHero || !hero) {
                return true
            }

            const x = GetUnitX(targetHero)
            const y = GetUnitY(targetHero)

            escaper.moveHero(x, y)
            escaper.turnInstantly(GetUnitFacing(targetHero))
            escaper.coopReviveHero()

            const escaperSecond = GetMirrorEscaper(escaper)
            if (escaperSecond) {
                if (escaperSecond.isAlive()) {
                    escaperSecond.moveHero(x, y)
                } else {
                    escaperSecond.revive(x, y, 'coop')
                }
            }

            return true
        },
    })

    //-summon(smn) <Pcolor>   --> revives other hero to your hero, with the same facing angle
    registerCommand({
        name: 'summon',
        alias: ['smn'],
        group: 'cheat',
        argDescription: '<Pcolor>',
        description: 'Revives another hero to yours, with the same facing angle',
        cb: ({ nbParam, param1 }, escaper) => {
            if (!(nbParam === 1 && isPlayerId(param1))) {
                return true
            }

            const n = resolvePlayerId(param1)

            if (getUdgEscapers().get(n) == null) {
                return true
            }

            const targetEscaper = getUdgEscapers().get(n)
            const targetHero = targetEscaper?.getHero()
            const hero = escaper.getHero()

            if (!targetEscaper || !targetHero || !hero) {
                return true
            }

            const x = GetUnitX(hero)
            const y = GetUnitY(hero)

            targetEscaper.moveHero(x, y)
            targetEscaper.turnInstantly(GetUnitFacing(hero))
            targetEscaper.coopReviveHero()

            const escaperSecond = GetMirrorEscaper(targetEscaper)
            if (escaperSecond) {
                if (escaperSecond.isAlive()) {
                    escaperSecond.moveHero(x, y)
                } else {
                    escaperSecond.revive(x, y, 'coop')
                }
            }

            return true
        },
    })

    //-getInfiniteMeteors(gim)   --> puts in your inventory a meteor that doesn't disapear after being used
    registerCommand({
        name: 'getInfiniteMeteors',
        alias: ['gim'],
        group: 'cheat',
        argDescription: '',
        description: "Puts in your inventory a meteor that doesn't disapear after being used",
        cb: ({ noParam }, escaper) => {
            if (noParam) {
                const hero = escaper.getHero()

                if (hero) {
                    if (UnitItemInSlot(hero, 0) == null) {
                        MeteorFunctions.HeroAddCheatMeteor(hero)
                        Text.P(escaper.getPlayer(), 'you get infinite meteors')
                    } else {
                        Text.erP(escaper.getPlayer(), 'inventory full')
                    }
                }
            }
            return true
        },
    })

    //-deleteInfiniteMeteors(dim)   --> remove the infinite meteor from your inventory if you have one
    registerCommand({
        name: 'deleteInfiniteMeteors',
        alias: ['dim'],
        group: 'cheat',
        argDescription: '',
        description: 'Remove the infinite meteor from your inventory if you have one',
        cb: ({ noParam }, escaper) => {
            if (noParam) {
                const hero = escaper.getHero()

                if (hero) {
                    if (GetItemTypeId(UnitItemInSlot(hero, 0)) == METEOR_CHEAT) {
                        RemoveItem(UnitItemInSlot(hero, 0))
                        Text.P(escaper.getPlayer(), 'infinite meteors removed')
                    } else {
                        Text.erP(escaper.getPlayer(), 'no infinite meteors to remove')
                    }
                }
            }
            return true
        },
    })

    //-endLevel(el)   --> go to the end of the current level
    registerCommand({
        name: 'endLevel',
        alias: ['el'],
        group: 'cheat',
        argDescription: '',
        description: 'Go to the end of the current level',
        cb: ({ noParam }) => {
            if (noParam) {
                getUdgLevels().goToNextLevel()
            }
            return true
        },
    })

    //-goToLevel(gotl) <levelId>   --> first level is number 0
    registerCommand({
        name: 'goToLevel',
        alias: ['gotl'],
        group: 'cheat',
        argDescription: '<levelId>',
        description: 'Go to the specified level',
        cb: ({ nbParam, param1 }, escaper) => {
            if (nbParam !== 1) {
                return true
            }

            if (!IsPositiveInteger(param1)) {
                Text.erP(escaper.getPlayer(), 'level number should be a positive integer')
                return true
            }

            const n = S2I(param1)
            if (getUdgLevels().getCurrentLevel(escaper).getId() == n) {
                Text.erP(escaper.getPlayer(), 'you already are in this level')
                return true
            }

            if (!getUdgLevels().goToLevel(undefined, n)) {
                Text.erP(
                    escaper.getPlayer(),
                    "this levels doesn't exist (level max : " + I2S(getUdgLevels().getLastLevelId()) + ')'
                )
            }

            return true
        },
    })

    //-viewAll(va)   --> displays the whole map
    registerCommand({
        name: 'viewAll',
        alias: ['va'],
        group: 'cheat',
        argDescription: '',
        description: 'Displays the whole map',
        cb: ({ noParam }) => {
            if (noParam) {
                FogModifierStart(getUdgViewAll())
            }
            return true
        },
    })

    //-hideAll(ha)   --> puts the map view back to normal
    registerCommand({
        name: 'hideAll',
        alias: ['ha'],
        group: 'cheat',
        argDescription: '',
        description: 'Puts the map view back to normal',
        cb: ({ noParam }) => {
            if (noParam) {
                FogModifierStop(getUdgViewAll())
            }
            return true
        },
    })

    //-setGodMode(setgm) <boolean status>   --> activate or desactivate god mode for your hero
    registerCommand({
        name: 'setGodMode',
        alias: ['setgm'],
        group: 'cheat',
        argDescription: '<boolean status>',
        description: 'Activate or desactivate god mode for your hero',
        cb: ({ nbParam, param1, param2 }, escaper) => {
            if (!(nbParam === 1 || nbParam === 2)) {
                Text.erP(escaper.getPlayer(), 'one or two params for this command')
                return true
            }

            let b = false

            if (IsBoolString(param1)) {
                b = S2B(param1)
            } else {
                Text.erP(escaper.getPlayer(), 'param1 must be a boolean')
                return true
            }
            if (nbParam === 1) {
                escaper.setGodMode(b)
                if (b) {
                    Text.P(escaper.getPlayer(), 'you are now invulnerable')
                } else {
                    Text.P(escaper.getPlayer(), 'you are now vulnerable')
                }
                return true
            }
            if (!escaper.isMaximaxou()) {
                Text.erP(escaper.getPlayer(), 'your rights are too weak')
                return true
            }
            if (param2 === 'all' || param2 === 'a') {
                let i = 0
                while (true) {
                    if (i >= NB_ESCAPERS) break
                    if (getUdgEscapers().get(i) != null) {
                        getUdgEscapers().get(i)?.setGodMode(b)
                    }
                    i = i + 1
                }
                if (b) {
                    Text.P(escaper.getPlayer(), 'all sliders are now invulnerable')
                } else {
                    Text.P(escaper.getPlayer(), 'all sliders are now vulnerable')
                }
                return true
            }
            if (isPlayerId(param2)) {
                let n = resolvePlayerId(param2)
                if (getUdgEscapers().get(n) != null) {
                    getUdgEscapers().get(n)?.setGodMode(b)
                    if (b) {
                        Text.P(escaper.getPlayer(), 'slider ' + param2 + ' is now invulnerable')
                    } else {
                        Text.P(escaper.getPlayer(), 'slider ' + param2 + ' is now vulnerable')
                    }
                } else {
                    Text.erP(escaper.getPlayer(), 'escaper ' + param2 + " doesn't exist")
                }
            } else {
                Text.erP(escaper.getPlayer(), 'param2 must be a player color or "all"')
            }
            return true
        },
    })

    //-setGodModeKills(setgmk) <boolean status>   --> if activated, monsters will be killed by your hero
    registerCommand({
        name: 'setGodModeKills',
        alias: ['setgmk'],
        group: 'cheat',
        argDescription: '<boolean status>',
        description: 'if activated, monsters will be killed by your hero',
        cb: ({ nbParam, param1, param2 }, escaper) => {
            if (!(nbParam === 1 || nbParam === 2)) {
                Text.erP(escaper.getPlayer(), 'one or two params for this command')
                return true
            }

            let b = false

            if (IsBoolString(param1)) {
                b = S2B(param1)
            } else {
                Text.erP(escaper.getPlayer(), 'param1 must be a boolean')
                return true
            }
            if (nbParam === 1) {
                escaper.setGodModeKills(b)
                if (b) {
                    Text.P(escaper.getPlayer(), 'your god mode now kills monsters (if activated)')
                } else {
                    Text.P(escaper.getPlayer(), "you god mode doesn't kill monsters anymore")
                }
                return true
            }
            if (!escaper.isMaximaxou()) {
                Text.erP(escaper.getPlayer(), 'your rights are too weak')
                return true
            }
            if (param2 === 'all' || param2 === 'a') {
                let i = 0
                while (true) {
                    if (i >= NB_ESCAPERS) break
                    if (getUdgEscapers().get(i) != null) {
                        getUdgEscapers().get(i)?.setGodModeKills(b)
                    }
                    i = i + 1
                }
                if (b) {
                    Text.P(escaper.getPlayer(), 'god mode of all sliders now kills monsters (if activated)')
                } else {
                    Text.P(escaper.getPlayer(), "god mode of all sliders doesn't kill monsters anymore")
                }
                return true
            }
            if (isPlayerId(param2)) {
                let n = resolvePlayerId(param2)
                if (getUdgEscapers().get(n) != null) {
                    getUdgEscapers().get(n)?.setGodModeKills(b)
                    if (b) {
                        Text.P(
                            escaper.getPlayer(),
                            'god mode of slider ' + param2 + ' now kills monsters (if activated)'
                        )
                    } else {
                        Text.P(escaper.getPlayer(), 'god mode of slider ' + param2 + " doesn't kill monsters anymore")
                    }
                } else {
                    Text.erP(escaper.getPlayer(), 'escaper ' + param2 + " doesn't exist")
                }
            } else {
                Text.erP(escaper.getPlayer(), 'param2 must be a player color or "all"')
            }
            return true
        },
    })

    //-setGravity(setg) x
    registerCommand({
        name: 'setGravity',
        alias: ['setg'],
        group: 'cheat',
        argDescription: 'x',
        description: 'set the gravity of the game',
        cb: ({ nbParam, param1 }, escaper) => {
            if (!(nbParam === 1) || (S2R(param1) === 0 && param1 !== '0')) {
                return true
            }
            Gravity.SetGravity(S2R(param1))
            Text.P(escaper.getPlayer(), 'gravity changed')
            return true
        },
    })

    //-getGravity(getg)
    registerCommand({
        name: 'getGravity',
        alias: ['getg'],
        group: 'cheat',
        argDescription: '',
        description: 'get the gravity of the game',
        cb: ({ noParam }, escaper) => {
            if (noParam) {
                Text.P(escaper.getPlayer(), 'current gravity is ' + R2S(Gravity.GetRealGravity()))
            }
            return true
        },
    })

    //-setVTOTODiagonalSlideLogic <boolean status>
    registerCommand({
        name: 'setVTOTODiagonalSlideLogic',
        alias: ['setvtoto'],
        group: 'cheat',
        argDescription: '<boolean status>',
        description: 'Allows you to slide diagonally',
        cb: ({ nbParam, param1 }, escaper) => {
            if (!(nbParam === 1)) {
                Text.erP(escaper.getPlayer(), 'one param for this command')
                return true
            }

            if (!IsBoolString(param1)) {
                Text.erP(escaper.getPlayer(), 'invalid boolean')
                return true
            }

            globals.USE_VTOTO_SLIDE_LOGIC = S2B(param1)
            Text.A((S2B(param1) ? 'Enabled' : 'Disabled') + ' vToto diagonal slide logic')
            return true
        },
    })

    //-getVTOTODiagonalSlideLogic(getvtoto)
    registerCommand({
        name: 'getVTOTODiagonalSlideLogic',
        alias: ['getvtoto'],
        group: 'cheat',
        argDescription: '',
        description: '',
        cb: ({ noParam }, escaper) => {
            if (noParam) {
                Text.P(escaper.getPlayer(), 'vToto is ' + (globals.USE_VTOTO_SLIDE_LOGIC ? 'enabled' : 'disabled'))
            }
            return true
        },
    })

    //-setCoopCircles <boolean status>
    registerCommand({
        name: 'setCoopCircles',
        alias: [],
        group: 'cheat',
        argDescription: '<boolean status>',
        description: 'Disables coop circles',
        cb: ({ nbParam, param1 }, escaper) => {
            if (!(nbParam === 1)) {
                Text.erP(escaper.getPlayer(), 'one param for this command')
                return true
            }

            if (!IsBoolString(param1)) {
                Text.erP(escaper.getPlayer(), 'invalid boolean')
                return true
            }

            globals.coopCircles = S2B(param1)
            Text.A((S2B(param1) ? 'Enabled' : 'Disabled') + ' coopCircles')
            return true
        },
    })

    //-getCoopCircles
    registerCommand({
        name: 'getCoopCircles',
        alias: [],
        group: 'cheat',
        argDescription: '',
        description: '',
        cb: ({ noParam }, escaper) => {
            if (noParam) {
                Text.P(escaper.getPlayer(), 'Coop circles are ' + (globals.coopCircles ? 'enabled' : 'disabled'))
            }
            return true
        },
    })

    //-setCanTurnInAir <boolean status>
    registerCommand({
        name: 'setCanTurnInAir',
        alias: [],
        group: 'cheat',
        argDescription: '<boolean status>',
        description: 'Allows you to turn in air',
        cb: ({ nbParam, param1 }, escaper) => {
            if (!(nbParam === 1)) {
                Text.erP(escaper.getPlayer(), 'one param for this command')
                return true
            }

            if (!IsBoolString(param1)) {
                Text.erP(escaper.getPlayer(), 'invalid boolean')
                return true
            }

            globals.CAN_TURN_IN_AIR = S2B(param1)
            Text.A((S2B(param1) ? 'Enabled' : 'Disabled') + ' canTurnInAir')
            return true
        },
    })

    //-getCanTurnInAir
    registerCommand({
        name: 'getCanTurnInAir',
        alias: [],
        group: 'cheat',
        argDescription: '',
        description: '',
        cb: ({ noParam }, escaper) => {
            if (noParam) {
                Text.P(escaper.getPlayer(), 'Can turn in air is ' + (globals.CAN_TURN_IN_AIR ? 'enabled' : 'disabled'))
            }
            return true
        },
    })

    //-setHeight(seth)
    registerCommand({
        name: 'setHeight',
        alias: ['seth'],
        group: 'cheat',
        argDescription: '',
        description: 'set the height of the game',
        cb: ({ nbParam, param1 }, escaper) => {
            if (nbParam !== 1 || (S2R(param1) <= 0 && param1 !== '0')) {
                return true
            }

            const h1 = escaper.getHero()
            const h2 = GetMirrorEscaper(escaper)?.getHero()

            h1 && SetUnitFlyHeight(h1, S2R(param1), 0)
            h2 && SetUnitFlyHeight(h2, S2R(param1), 0)

            return true
        },
    })

    //-setTailleUnit(settu)
    registerCommand({
        name: 'setTailleUnit',
        alias: ['settu'],
        group: 'cheat',
        argDescription: '',
        description: 'set the size of the units',
        cb: ({ nbParam, param1 }) => {
            if (nbParam !== 1 || (S2R(param1) <= 0 && param1 !== '0')) {
                return true
            }
            Trig_InvisUnit_is_getting_damage.setTailleUnite(S2R(param1))
            return true
        },
    })

    //-instantTurn
    registerCommand({
        name: 'instantTurn',
        alias: ['it'],
        group: 'cheat',
        argDescription: '',
        description: 'instant turn',
        cb: ({ nbParam, param1 }, escaper) => {
            if (nbParam === 1 && IsBoolString(param1)) {
                if (escaper.isAbsoluteInstantTurn() != S2B(param1)) {
                    escaper.setAbsoluteInstantTurn(S2B(param1))
                    if (S2B(param1)) {
                        Text.P(escaper.getPlayer(), 'instant turn on')
                    } else {
                        Text.P(escaper.getPlayer(), 'instant turn off')
                    }
                }
            }
            return true
        },
    })

    registerCommand({
        name: 'slidingMode',
        alias: [],
        group: 'all',
        argDescription: '[normal] | [max] | []',
        description: 'Run commands on start of the game',
        cb: ({ cmd, nbParam, param1 }, escaper) => {
            if (nbParam == 0) {
                Text.mkP(escaper.getPlayer(), 'your sliding mode is ' + escaper.slidingMode)
            }

            if (nbParam == 1) {
                if (param1 == 'max' || param1 == 'normal') {
                    escaper.slidingMode = param1
                    Text.mkP(escaper.getPlayer(), 'changed sliding mode')
                } else {
                    Text.erP(escaper.getPlayer(), 'wrong sliding mode')
                }
            }

            return true
        },
    })
}
