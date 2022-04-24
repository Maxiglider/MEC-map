import { arrayPush, jsonDecode, jsonEncode } from 'core/01_libraries/Basic_functions'
import { MEC_MSC_DATA_FILE } from 'core/01_libraries/Constants'
import { ServiceManager } from 'Services'
import { initSaveLoad } from '../../../Utils/SaveLoad/SaveLoad'
import { Escaper } from './Escaper'

const SaveLoad = initSaveLoad()

export class EscaperStartCommands {
    private startCommands: string[] = []
    private escaper: Escaper
    private executed = false
    private loaded = false

    constructor(escaper: Escaper) {
        this.escaper = escaper
    }

    loadStartCommands = () => {
        if (this.executed) {
            return
        }

        this.executed = true

        SaveLoad.readFile(MEC_MSC_DATA_FILE, this.escaper.getPlayer(), data => {
            if (data.length === 0) {
                return
            }

            const decodedData = jsonDecode<string[]>(data)

            if (typeof decodedData === 'object') {
                this.startCommands = decodedData

                for (const cmd of decodedData) {
                    ServiceManager.getService('Cmd').ExecuteCommand(this.escaper, '-' + cmd)
                }
            }

            this.loaded = true
        })
    }

    getStartCommands = () => this.startCommands

    addStartCommand = (startCommand: string) => {
        if (startCommand.startsWith('-')) {
            startCommand = startCommand.substring(1)
        }

        arrayPush(this.startCommands, startCommand)
        this.saveStartCommands()
    }

    removeStartCommand = (index: number) => {
        const removedElement = this.startCommands.splice(index, 1)
        this.saveStartCommands()
        return removedElement
    }

    saveStartCommands = () => {
        SaveLoad.saveFile(MEC_MSC_DATA_FILE, this.escaper.getPlayer(), jsonEncode(this.startCommands))
    }

    isLoaded = () => this.loaded
}
