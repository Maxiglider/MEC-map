import { existsSync, lstatSync, readdirSync, renameSync } from 'fs'
import path from 'path'

const initMain = () => {
    const targetDir = process.argv[2]

    if (!existsSync(targetDir)) {
        console.log('Directory does not exist')
        return
    }

    if (!lstatSync(targetDir).isDirectory()) {
        console.log('Target is not a directory')
        return
    }

    for (const file of readdirSync(targetDir)) {
        const ext = path.extname(file)
        let newFile = path.basename(file, ext)

        newFile = newFile
            // Remove date format and timestamp
            .replace(new RegExp('[0-9]{6,}', 'g'), '')
            // Remove date format
            .replace(new RegExp('[0-9]{2,}[-:/\\][0-9]{2,}[-:/\\][0-9]{2,}', 'g'), '')
            // Remove M2 suffix
            .replace(new RegExp('_M2', 'g'), '')
            // Replace all underscores with spaces
            .replace(new RegExp('_', 'g'), ' ')
            // Remove double spaces
            .trim()
            // Remove spaces
            .replace(new RegExp(' ', 'g'), '_')

        // The releaseTest.ts script will replace `_123456` to a timestamp
        newFile = newFile + '_M2_123456' + ext

        if (`${targetDir}/${file}` !== `${targetDir}/${newFile}`) {
            console.log(`Renamed ${targetDir}/${file} to ${targetDir}/${newFile}`)
            renameSync(`${targetDir}/${file}`, `${targetDir}/${newFile}`)
        }
    }
}

initMain()
