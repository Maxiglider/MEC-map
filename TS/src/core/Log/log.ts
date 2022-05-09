import { globals } from "../../../globals";
import { SyncSaveLoad } from "../../Utils/SaveLoad/TreeLib/SyncSaveLoad";

export const log = (str: string) => {
  print(str)
  globals.logStrings.push(str)
}

export const flushLogs = () => {
  const logFile = "MEC/MEC_log.txt";
  const syncSaveLoad = SyncSaveLoad();
  syncSaveLoad.writeFileWithoutPossibleLoading(logFile, globals.logStrings.join("\n"), false);
  print("Logs written in file " + logFile)
}
