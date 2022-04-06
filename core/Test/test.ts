import {ExecuteCommand} from "../../TS/src/core/06_COMMANDS/COMMANDS_vJass/Command_execution";
import {getUdgEscapers} from "../../TS/globals";
import {makingRightsToAll} from "../../TS/src/core/06_COMMANDS/Rights/manage_rights";

export const init_Test = () => {
    makingRightsToAll()
    ExecuteCommand(getUdgEscapers().get(0), "-va, news slide 'Nsnw', newd death 1 Abilities\\Spells\\NightElf\\EntanglingRoots\\EntanglingRootsTarget.mdl, neww walk 97")
}