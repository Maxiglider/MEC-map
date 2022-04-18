import {ExecuteCommand} from "../../TS/src/core/06_COMMANDS/COMMANDS_vJass/Command_execution";
import {getUdgEscapers} from "../../TS/globals";
import {makingRightsToAll} from "../../TS/src/core/06_COMMANDS/Rights/manage_rights";

export const init_Test = () => {
    makingRightsToAll()
    // ExecuteCommand(getUdgEscapers().get(0), "-va, news slide 'Nsnw', setta slide s, news reverse 5 -400, setta reverse rev, newd death 1 Abilities\\Spells\\NightElf\\EntanglingRoots\\EntanglingRootsTarget.mdl, setta death d, neww walk 97, setta walk w")
    //
    // ExecuteCommand(getUdgEscapers().get(0), "-newm caisse 'cais' 40, newm naga 'nnsw' 60, newm peon 'opeo' 40")
    // ExecuteCommand(getUdgEscapers().get(0), "-newCaster c naga peon")
}