import { IsBoolString, S2B } from 'core/01_libraries/Basic_functions'
import { NB_ESCAPERS, SLIDE_PERIOD } from 'core/01_libraries/Constants'
import { IsInteger, IsPositiveInteger } from 'core/01_libraries/Functions_on_numbers'
import { ColorString2Id } from 'core/01_libraries/Init_colorCodes'
import { Text } from 'core/01_libraries/Text'
import { Escaper } from 'core/04_STRUCTURES/Escaper/Escaper'
import { GetMirrorEscaper } from 'core/04_STRUCTURES/Escaper/Escaper_functions'
import { METEOR_CHEAT } from 'core/04_STRUCTURES/Meteor/Meteor'
import { Gravity } from 'core/07_TRIGGERS/Slide_and_CheckTerrain_triggers/Gravity'
import { getUdgEscapers, getUdgLevels } from '../../../../globals'
import { getUdgViewAll } from '../../03_view_all_hide_all/View_all_hide_all'
import { MeteorFunctions } from '../../04_STRUCTURES/Meteor/Meteor_functions'
import { Trig_InvisUnit_is_getting_damage } from '../../08_GAME/Death/InvisUnit_is_getting_damage'
import { CmdName, CmdParam, IsPlayerColorString, NbParam, NoParam } from './Command_functions'
import { ActivateTeleport } from './Teleport'

export const ExecuteCommandCheat = (escaper: Escaper, cmd: string): boolean => {
    let name = CmdName(cmd)
    let noParam = NoParam(cmd)
    let nbParam = NbParam(cmd)

    let n: number
    let i: number
    let j: number
    let k: number

    let b: boolean

    let str = ''
    let str2 = ''

    let x: number
    let y: number
    let point: location

    let param: string

    let param1 = CmdParam(cmd, 1)
    let param2 = CmdParam(cmd, 2)
    let param3 = CmdParam(cmd, 3)
    let param4 = CmdParam(cmd, 4)

    let speed: number

    //-slideSpeed(ss) <speed>   --> changes the slide speed of your hero, ignoring terrains
    if (name === 'setSlideSpeed' || name === 'ss') {
        if (!IsInteger(param1)) {
            return true
        }
        speed = S2R(param1) * SLIDE_PERIOD
        if (nbParam === 1) {
            escaper.absoluteSlideSpeed(speed)
            Text.P(escaper.getPlayer(), 'your slide speed is to ' + param1)
            return true
        }
        if (!(nbParam == 2 && escaper.isMaximaxou())) {
            return true
        }
        if (param2 === 'all' || param2 === 'a') {
            i = 0
            while (true) {
                if (i >= NB_ESCAPERS) break
                if (getUdgEscapers().get(i) != null) {
                    getUdgEscapers().get(i)?.absoluteSlideSpeed(speed)
                }
                i = i + 1
            }
            Text.P(escaper.getPlayer(), 'slide speed for all is to ' + param1)
            return true
        }
        if (IsPlayerColorString(param2)) {
            if (getUdgEscapers().get(ColorString2Id(param2)) != null) {
                getUdgEscapers().get(ColorString2Id(param2))?.absoluteSlideSpeed(speed)
                Text.P(escaper.getPlayer(), 'slide speed for player ' + param2 + ' is to ' + param1)
            }
        }
        return true
    }

    //-normalSlideSpeed(nss)   --> puts the slide speed back to normal (respecting terrains)
    if (name === 'normalSlideSpeed' || name === 'nss') {
        if (noParam) {
            escaper.stopAbsoluteSlideSpeed()
            Text.P(escaper.getPlayer(), 'your slide speed depends now on terrains')
            return true
        }
        if (!(nbParam == 1 && escaper.isMaximaxou())) {
            return true
        }
        if (param1 === 'all' || param1 === 'a') {
            i = 0
            while (true) {
                if (i >= NB_ESCAPERS) break
                if (getUdgEscapers().get(i) != null) {
                    getUdgEscapers().get(i)?.stopAbsoluteSlideSpeed()
                }
                i = i + 1
            }
            Text.P(escaper.getPlayer(), 'slide speed for all depends now on terrains')
            return true
        }
        if (IsPlayerColorString(param1)) {
            if (getUdgEscapers().get(ColorString2Id(param1)) != null) {
                getUdgEscapers().get(ColorString2Id(param1))?.stopAbsoluteSlideSpeed()
                Text.P(escaper.getPlayer(), 'slide speed for player ' + param1 + ' depends now on terrains')
            }
        }
        return true
    }

    //-walkSpeed(ws) <speed>   --> changes the walk speed of your hero, ignoring terrains
    if (name === 'setWalkSpeed' || name === 'ws') {
        if (!IsInteger(param1)) {
            return true
        }
        speed = S2R(param1)
        if (nbParam === 1) {
            escaper.absoluteWalkSpeed(speed)
            Text.P(escaper.getPlayer(), 'walk speed to ' + param1)
            return true
        }
        if (!(nbParam == 2 && escaper.isMaximaxou())) {
            return true
        }
        if (param2 === 'all' || param2 === 'a') {
            i = 0
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
        if (IsPlayerColorString(param2)) {
            if (getUdgEscapers().get(ColorString2Id(param2)) != null) {
                getUdgEscapers().get(ColorString2Id(param2))?.absoluteWalkSpeed(speed)
                Text.P(escaper.getPlayer(), 'walk speed for player ' + param2 + ' to ' + param1)
            }
        }
        return true
    }

    //-normalWalkSpeed(nws)   --> puts the walk speed back to normal (respecting terrains)
    if (name === 'normalWalkSpeed' || name === 'nws') {
        if (noParam) {
            escaper.stopAbsoluteWalkSpeed()
            Text.P(escaper.getPlayer(), 'walk speed depends now on terrains')
            return true
        }
        if (!(nbParam == 1 && escaper.isMaximaxou())) {
            return true
        }
        if (param1 === 'all' || param1 === 'a') {
            i = 0
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
        if (IsPlayerColorString(param1)) {
            if (getUdgEscapers().get(ColorString2Id(param1)) != null) {
                getUdgEscapers().get(ColorString2Id(param1))?.stopAbsoluteWalkSpeed()
                Text.P(escaper.getPlayer(), 'walk speed for player ' + param1 + ' depends now on terrains')
            }
        }
        return true
    }

    //-teleport(t)   --> teleports your hero at the next clic
    if (
        (name === 'teleport' || name === 't') &&
        (noParam || (nbParam === 1 && (param1 === '0' || S2R(param1) !== 0)))
    ) {
        const h1 = escaper.getHero()
        const h2 = GetMirrorEscaper(escaper)?.getHero()

        if (nbParam === 1) {
            h1 && SetUnitFacing(h1, S2R(param1))
            h2 && SetUnitFacing(h2, S2R(param1))
        }

        h1 && ActivateTeleport(h1, true)
        h2 && ActivateTeleport(h2, true)

        return true
    }

    //-revive(r)   --> revives your hero
    if (name === 'revive' || name === 'r') {
        if (noParam) {
            escaper.reviveAtStart()
            return true
        }
        if (!(nbParam == 1 && escaper.isMaximaxou())) {
            return true
        }
        if (param1 === 'all' || param1 === 'a') {
            i = 0
            while (true) {
                if (i >= NB_ESCAPERS) break
                if (getUdgEscapers().get(i) != null) {
                    getUdgEscapers().get(i)?.reviveAtStart()
                }
                i = i + 1
            }
            return true
        }
        if (IsPlayerColorString(param1)) {
            if (getUdgEscapers().get(ColorString2Id(param1)) != null) {
                getUdgEscapers().get(ColorString2Id(param1))?.reviveAtStart()
            }
        }
        return true
    }

    //-reviveTo(rto) <Pcolor>   --> revives your hero to an other hero, with the same facing angle
    if (name === 'reviveTo' || name === 'rto') {
        if (!(nbParam === 1 && IsPlayerColorString(param1))) {
            return true
        }
        n = ColorString2Id(param1)
        if (!getUdgEscapers().get(n)?.isAlive() || getUdgEscapers().get(n) == null) {
            return true
        }

        const hero = getUdgEscapers().get(n)?.getHero()

        if (!hero) {
            return true
        }

        escaper.revive(GetUnitX(hero), GetUnitY(hero))
        escaper.turnInstantly(GetUnitFacing(hero))
        GetMirrorEscaper(escaper)?.revive(GetUnitX(hero), GetUnitY(hero))
        GetMirrorEscaper(escaper)?.turnInstantly(GetUnitFacing(hero))

        return true
    }

    //-getInfiniteMeteors(gim)   --> puts in your inventory a meteor that doesn't disapear after being used
    if (name === 'getInfiniteMeteors' || name === 'gim') {
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
    }

    //-deleteInfiniteMeteors(dim)   --> remove the infinite meteor from your inventory if you have one
    if (name === 'deleteInfiniteMeteors' || name === 'dim') {
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
    }

    //-endLevel(el)   --> go to the end of the current level
    if (name === 'endLevel' || name === 'el') {
        if (noParam) {
            getUdgLevels().goToNextLevel()
        }
        return true
    }

    //-goToLevel(gotl) <levelId>   --> first level is number 0
    if (name === 'goToLevel' || name === 'gotl') {
        if (nbParam !== 1) {
            return true
        }

        if (!IsPositiveInteger(param1)) {
            Text.erP(escaper.getPlayer(), 'level number should be a positive integer')
            return true
        }

        n = S2I(param1)
        if (getUdgLevels().getCurrentLevel().getId() == n) {
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
    }

    //-viewAll(va)   --> displays the whole map
    if (name === 'viewAll' || name === 'va') {
        if (noParam) {
            FogModifierStart(getUdgViewAll())
        }
        return true
    }

    //-hideAll(ha)   --> puts the map view back to normal
    if (name === 'hideAll' || name === 'ha') {
        if (noParam) {
            FogModifierStop(getUdgViewAll())
        }
        return true
    }

    //-setGodMode(setgm) <boolean status>   --> activate or desactivate god mode for your hero
    if (name === 'setGodMode' || name === 'setgm') {
        if (!(nbParam === 1 || nbParam === 2)) {
            Text.erP(escaper.getPlayer(), 'one or two params for this command')
            return true
        }
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
            i = 0
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
        if (IsPlayerColorString(param2)) {
            n = ColorString2Id(param2)
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
    }

    //-setGodModeKills(setgmk) <boolean status>   --> if activated, monsters will be killed by your hero
    if (name === 'setGodModeKills' || name === 'setgmk') {
        if (!(nbParam === 1 || nbParam === 2)) {
            Text.erP(escaper.getPlayer(), 'one or two params for this command')
            return true
        }
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
            i = 0
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
        if (IsPlayerColorString(param2)) {
            n = ColorString2Id(param2)
            if (getUdgEscapers().get(n) != null) {
                getUdgEscapers().get(n)?.setGodModeKills(b)
                if (b) {
                    Text.P(escaper.getPlayer(), 'god mode of slider ' + param2 + ' now kills monsters (if activated)')
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
    }

    //-setGravity(setg) x
    if (name === 'setGravity' || name === 'setg') {
        if (!(nbParam === 1) || (S2R(param1) === 0 && param1 !== '0')) {
            return true
        }
        Gravity.SetGravity(S2R(param1))
        Text.P(escaper.getPlayer(), 'gravity changed')
        return true
    }

    //-getGravity(getg)
    if (name === 'getGravity' || name === 'getg') {
        if (noParam) {
            Text.P(escaper.getPlayer(), 'current gravity is ' + R2S(Gravity.GetRealGravity()))
        }
        return true
    }

    //-setHeight(seth)
    if (name === 'setHeight' || name === 'seth') {
        if (nbParam !== 1 || (S2R(param1) <= 0 && param1 !== '0')) {
            return true
        }

        const h1 = escaper.getHero()
        const h2 = GetMirrorEscaper(escaper)?.getHero()

        h1 && SetUnitFlyHeight(h1, S2R(param1), 0)
        h2 && SetUnitFlyHeight(h2, S2R(param1), 0)

        return true
    }

    //-setTailleUnit(settu)
    if (name === 'setTailleUnit' || name === 'settu') {
        if (nbParam !== 1 || (S2R(param1) <= 0 && param1 !== '0')) {
            return true
        }
        Trig_InvisUnit_is_getting_damage.TAILLE_UNITE = S2R(param1)
        return true
    }

    //-instantTurn
    if (name === 'instantTurn' || name === 'it') {
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
    }

    return false
}
