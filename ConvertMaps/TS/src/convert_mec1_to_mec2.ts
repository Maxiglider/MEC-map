import { copyFileSync, existsSync, readFileSync, renameSync, writeFileSync } from 'fs'
import { copySync } from 'fs-extra'
import Import from 'mdx-m3-viewer/dist/cjs/parsers/w3x/imp/import'
import War3Map from 'mdx-m3-viewer/dist/cjs/parsers/w3x/map'
import path, { normalize } from 'path'
import { simpleExec } from './Utils/SimpleExec'

const initMain = async () => {
    const originalFile = process.argv[2]

    if (!existsSync(originalFile)) {
        console.log('File does not exist')
        return
    }

    const targetPath = originalFile.replace(new RegExp(' ', 'g'), '_')
    const targetName = path.basename(targetPath).replace(new RegExp('\\.w3[mx]', 'g'), '')
    const templateDir = 'C:/Users/Stan/Desktop/Warcraft/__TEMPLATE'
    const workDir = normalize(`${templateDir}/../${targetName}`)

    const outExt = path.extname(targetPath)
    const outFile = normalize(`${workDir}/${targetName}_M2${outExt}`)

    switch (true) {
        case !existsSync(`${workDir}/init_levels.j`): {
            copySync(templateDir, workDir)
            console.log('[1/4] Copied template; Please fill all .j files manually')
            return
        }

        case !existsSync(`${workDir}/Set_game_data.lua`): {
            const cmd = `php ${normalize(`${__dirname}./../../MEC1/convert_MEC1.php`)} ${workDir}`
            const out = await simpleExec({ cmd })

            if (out.code !== 0) {
                console.log(`Error while executing: ${cmd}`)
                return
            }

            console.log('[2/4] created Set_game_data.lua')
            console.log('!! Remember to copy over the set_game_data.lua to the MEC2 map !!')
            // Fall through
        }

        case !existsSync(outFile): {
            if (!existsSync(`${workDir}/MEC2_Template.w3m`)) {
                copyFileSync(`${templateDir}/MEC2_Template.w3m`, `${workDir}/MEC2_Template.w3m`)
            }

            renameSync(`${workDir}/MEC2_Template.w3m`, outFile)

            const transferFiles = [
                // Required
                'war3map.shd',
                'war3map.w3e',
                'war3map.w3r',

                // FOR NON MEC1 UNCOMMENT ALL BELOW

                // Extra
                // 'war3mapUnits.doo', // => Crashes
                // 'war3map.doo', // => Crashes
                'war3map.w3c',
                'war3map.w3s',
                'war3map.w3u',
                'war3map.w3t',
                'war3map.w3a',
                'war3map.w3b',
                'war3map.w3d',
                'war3map.w3q',
                'war3map.w3h',
                'war3map.imp',
                'war3map.wpm',

                // Info
                'war3map.mmp',
                'war3mapMap.blp',
                'war3mapMap.b00',
                'war3mapMap.tga',
                'war3mapPreview.tga',
            ]

            const importedFileTypes: { [importedFile: string]: number } = {}
            const fileData: { [transferFile: string]: ArrayBuffer } = {}

            // Extract
            {
                const war3Map = new War3Map()
                war3Map.load(readFileSync(originalFile).buffer)

                for (const file of war3Map.imports.entries.values()) {
                    if (file.isCustom === 10 || file.isCustom === 13) {
                        transferFiles.push(file.path)
                        importedFileTypes[file.path] = file.isCustom
                    } else if (file.path) {
                        const path = `war3mapImported\\${file.path}`

                        transferFiles.push(path)
                        importedFileTypes[path] = file.isCustom
                    }
                }

                let nbExtractedFiles = 0

                for (const file of transferFiles) {
                    const mpqFile = war3Map.get(file)

                    if (mpqFile) {
                        try {
                            fileData[file] = mpqFile.arrayBuffer()
                            nbExtractedFiles++
                        } catch (e) {
                            console.log(`Error while extracting: ${file}`)
                            // console.log(e)
                        }
                    }
                }

                if (nbExtractedFiles === 0) {
                    console.log('No files extracted')
                    return
                }
            }

            // Import
            {
                const war3Map = new War3Map()
                war3Map.load(readFileSync(outFile).buffer)

                for (const file of transferFiles) {
                    if (fileData[file]) {
                        if (importedFileTypes[file]) {
                            if (war3Map.archive.set(file, fileData[file])) {
                                const entry = new Import()
                                entry.isCustom = importedFileTypes[file]
                                entry.path = file
                                war3Map.imports.entries.set(file, entry)
                            }
                        } else {
                            if (!war3Map.import(file, fileData[file])) {
                                console.log(`Error while importing ${file}`)
                            }
                        }
                    }
                }

                const out = war3Map.save()

                if (out === null) {
                    console.log('Error while saving')
                    return
                }

                writeFileSync(outFile, out)

                console.log('[3/4] Imported files')
            }

            // Fall through
        }

        default: {
            console.log('[4/4] Done')
            return
        }
    }
}

initMain()
