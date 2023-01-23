import * as fs from 'fs-extra'
import War3Map from 'mdx-m3-viewer/dist/cjs/parsers/w3x/map'

const targetDir = 'C:/Users/Stan/Documents/Warcraft III/Maps/Maps/Ts/MecTest'
const coreStart = '-- Max Escape Creation'
const coreEnd = 'onGlobalInit(initMEC_core)'

const main = () => {
    const files = fs.readdirSync(targetDir)
    const targetFile = files?.[0]

    if (!targetFile) {
        console.warn('No target file found')
        return
    }

    const war3Map = new War3Map()
    war3Map.load(fs.readFileSync(`${targetDir}/${targetFile}`).buffer)

    const luaFile = war3Map.archive.files.find(f => f.name === 'war3map.lua')

    if (!luaFile) {
        console.warn('war3map.lua not found')
        return
    }

    const oldLua = luaFile.text()
    const newLua = fs
        .readFileSync(__dirname + '/../../bin/final-we.lua')
        .toString()
        // For some reason the final-we.lua contains double %%
        .replace(new RegExp('%%', 'g'), '%')

    if (oldLua.indexOf(coreStart) === -1) {
        console.warn('coreStart not found')
        return
    }

    if (oldLua.indexOf(coreEnd) === -1) {
        console.warn('coreEnd not found')
        return
    }

    const mergedLua =
        oldLua.substring(0, oldLua.indexOf(coreStart)) +
        newLua +
        oldLua.substring(oldLua.indexOf(coreEnd) + coreEnd.length)

    const setFile = luaFile.set(Buffer.from(mergedLua, 'utf-8'))

    if (!setFile) {
        console.log(`Failed to modify war3map.lua`)
        return
    }

    const out = war3Map.save()
    fs.writeFileSync(`${targetDir}/${targetFile}`, out)

    const newFile =
        targetFile.substring(0, targetFile.lastIndexOf('_') + 1) +
        new Date().getTime() +
        targetFile.substring(targetFile.indexOf('.', targetFile.lastIndexOf('_') + 1))

    fs.renameSync(`${targetDir}/${targetFile}`, `${targetDir}/${newFile}`)
    console.log(`Updated: ${targetDir}/${newFile}`)
}

main()
