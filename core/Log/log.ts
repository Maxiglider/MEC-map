import { globals } from "../../TS/globals";
import { SyncSaveLoad } from "../../TS/src/Utils/SaveLoad/TreeLib/SyncSaveLoad";

export const log = (str: string) => {
  print(str);
  globals.logStrings.push(str);
};

export const flushLogs = () => {
  const logFile = "MEC/MEC_log.txt";
  const syncSaveLoad = SyncSaveLoad(true);
  syncSaveLoad.writeFile(logFile, globals.logStrings.join("\n"));
  print("Logs written in file " + logFile);
};
