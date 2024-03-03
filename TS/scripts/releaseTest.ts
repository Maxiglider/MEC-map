import * as fs from 'fs-extra'
import War3Map from 'mdx-m3-viewer/dist/cjs/parsers/w3x/map'
import { simpleExec } from './Utils/SimpleExec'

const targetDir = 'C:/Users/Stan/Documents/Warcraft III/Maps/Maps/Ts/MecTest'
const coreStart = '-- Max Escape Creation'
const coreEnd = 'onGlobalInit(initMEC_core)'
const renameTargets = true

const main = async () => {
    console.time('Modified test maps')
    const files = fs.readdirSync(targetDir)

    const newLua = fs
        .readFileSync(__dirname + '/../../bin/final-we.lua')
        .toString()
        // For some reason the final-we.lua contains double %%
        .replace(new RegExp('%%', 'g'), '%')

    const versionDate = new Date()

    await Promise.all(
        files.map(async targetFile => {
            if (!targetFile.endsWith('.w3x') && !targetFile.endsWith('.w3m')) {
                console.info(`[${targetFile}] wrong file extension, ignoring`)
                return
            }

            const war3Map = new War3Map()
            war3Map.load(fs.readFileSync(`${targetDir}/${targetFile}`).buffer)

            const luaFile = war3Map.archive.files.find(f => f.name === 'war3map.lua')

            if (!luaFile) {
                console.info(`[${targetFile}] war3map.lua not found, ignoring`)
                return
            }

            const oldLua = luaFile.text()

            if (oldLua.indexOf(coreStart) === -1) {
                console.info(`[${targetFile}] coreStart not found, ignoring`)
                return
            }

            if (oldLua.indexOf(coreEnd) === -1) {
                console.info(`[${targetFile}] coreEnd not found, ignoring`)
                return
            }

            const mergedLua =
                oldLua.substring(0, oldLua.indexOf(coreStart)) +
                newLua +
                oldLua.substring(oldLua.indexOf(coreEnd) + coreEnd.length)

            const setFile = luaFile.set(Buffer.from(mergedLua, 'utf-8'))

            if (!setFile) {
                console.info(`[${targetFile}] Failed to modify war3map.lua, ignoring`)
                return
            }

            const out = war3Map.save()
            fs.writeFileSync(`${targetDir}/${targetFile}`, out)

            if (renameTargets) {
                if (targetFile.lastIndexOf('_') === -1) {
                    console.info(`[${targetFile}] Mapname does not contain _, ignoring`)
                    return
                }

                const newFile =
                    targetFile.substring(0, targetFile.lastIndexOf('_') + 1) +
                    versionDate.getTime() +
                    targetFile.substring(targetFile.indexOf('.', targetFile.lastIndexOf('_') + 1))

                fs.renameSync(`${targetDir}/${targetFile}`, `${targetDir}/${newFile}`)
            }

            console.info(`[${targetFile}] Updated`)
        })
    )

    if (process.argv[2] === '--publish') {
        await simpleExec({
            cmd: `cd "${targetDir.replace(
                new RegExp('/', 'g'),
                '\\'
            )}" && git add . && git commit -m "Updated to DEV core v${versionDate.toISOString()}" && git push`,
            verbose: true,
        })
    }

    console.timeEnd('Modified test maps')
}

main()
