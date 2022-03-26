import { existsSync, lstatSync, readFileSync, unlinkSync, writeFileSync } from 'fs'
import { getAllFilesSync } from 'get-all-files'
import { resolve } from 'path'
import { replaceAll } from './Utils/replaceAll'
import { simpleExec } from './Utils/SimpleExec'

// When testing, put false
const revertJ = true

// Dumb comment filler, make sure this nowhere in the original code
const dumbComment = '// @@!!@@!!'

const reservedKeywords = [dumbComment, '@@BELOWIF', '@@BELOWELSEIF', '@@BELOWEXITWHEN']

const parseFile = async (inFile: string) => {
    const outFile = inFile.replace('.j', '.ts')

    if (!existsSync(inFile)) {
        console.log('File does not exist')
        return false
    }

    if (!inFile.endsWith('.j')) {
        console.log('Input file must be jass')
        return false
    }

    let content = readFileSync(inFile).toString()
    let initialContent = content

    for (const keyword of reservedKeywords) {
        if (content.includes(keyword)) {
            console.log(`File contains the keyword: '${keyword}', did you already run the script?`)
            return false
        }
    }

    // Make the content jass-to-ts compatible
    {
        // Cleanup
        content = content.replace(new RegExp('\\/\\/TESH.*', 'gmi'), '')

        // Comment out library keywords
        content = content.replace(new RegExp('([^\\/d]|^)library'), '//library')
        content = content.replace(new RegExp('([^\\/]|^)endlibrary'), '//endlibrary')

        // Comment out all method calls inside elseif statements while preserving the elseif statement in the comment above
        content = content.replace(
            new RegExp('^\\s*elseif(.*?[a-z0-9\\]\\)]+\\.[a-z0-9\\]\\)]+.*?)then', 'gmi'),
            `// @@BELOWELSEIF $1\nelseif true then`
        )

        // Comment out all method calls inside if statements while preserving the if statement in the comment above
        content = content.replace(
            new RegExp('^\\s*if(.*?[a-z0-9\\]\\)]+\\.[a-z0-9\\]\\)]+.*?)then', 'gmi'),
            `// @@BELOWIF $1\nif true then`
        )

        // Comment out all method calls inside exitwhen statements while preserving the exitwhen statement in the comment above
        content = content.replace(
            new RegExp('^\\s*exitwhen \\((.*?[a-z0-9\\]\\)]+\\.[a-z0-9\\]\\)]+.*)\\)', 'gmi'),
            `// @@BELOWEXITWHEN $1\nexitwhen true`
        )

        // Comment out all method calls
        content = content.replace(
            new RegExp('^\\s*(call|set|local|return)(.*?[a-z0-9\\]\\)]+\\.[a-z0-9\\]\\)]+.*?)', 'gmi'),
            `${dumbComment}$1$2`
        )

        // Comment out integer calls
        content = content.replace(new RegExp('(.*?integer\\()', 'gmi'), `${dumbComment}$1`)

        content = content.replace(new RegExp('^\\s*private', 'gmi'), '')
    }

    writeFileSync(inFile, content)

    const out = await simpleExec({
        cmd: `${process.cwd()}/node_modules/.bin/jass-to-ts ${inFile} > ${outFile}`,
        verbose: true,
    })

    if (readFileSync(outFile).toString().length < 10) {
        console.log('Error: jass-to-ts failed, reverting changes')
        console.log(out)
        unlinkSync(outFile)

        if (revertJ) {
            writeFileSync(inFile, initialContent)
        }

        return false
    }

    if (revertJ) {
        unlinkSync(inFile)
    }

    console.log('Ok: jass-to-ts success')

    content = readFileSync(outFile).toString()

    // Convert the earlier jass-to-ts compatible content to typescript
    {
        // Convert the library keywords
        content = content.replace(new RegExp('//library ([a-z0-9]+)', 'i'), 'const init$1 = () => { //')
        content = content.replace('//endlibrary', '}')

        // Restore the method calls
        content = replaceAll(content, dumbComment, '')

        // Remove all call keywords
        content = content.replace(new RegExp('^\\s*call', 'gmi'), '')

        // Restore the elseif statements using the comment above
        content = content.replace(
            new RegExp('\\/\\/ @@BELOWELSEIF (.*)\\n.*?else if \\(true\\)', 'gmi'),
            '} else if ($1)'
        )

        // Restore the if statements using the comment above
        content = content.replace(new RegExp('\\/\\/ @@BELOWIF (.*)\\n.*?if \\(true\\)', 'gmi'), 'if ($1)')

        // // Restore the exitwhen statements using the comment above
        content = content.replace(new RegExp('\\/\\/ @@BELOWEXITWHEN (.*)\\n.*?if \\(true\\)', 'gmi'), 'if ($1)')
    }

    // content = content.replace(new RegExp('then\\s*$', 'gmi'), '{')
    // content = content.replace(new RegExp('^\\s*else\\s*$', 'gmi'), '} else {')
    // content = content.replace(new RegExp('^\\s*endif', 'gmi'), '}')

    writeFileSync(outFile, content)
    return true
}

const main = async () => {
    const inFile = resolve(process.argv[2])
    const exitOnError = process.argv[3] !== 'ignore-error'

    let inFiles = []

    if (lstatSync(inFile).isDirectory()) {
        inFiles = getAllFilesSync(inFile)
            .toArray()
            .filter(f => f !== '.' && f !== '..')
            .filter(f => f.endsWith('.j'))
        // .map(f => normalize(`${inFile}/${f}`))
    } else {
        inFiles = [inFile]
    }

    if (!inFiles.length) {
        console.log('No files found')
        return
    }

    for (const inFile of inFiles) {
        if (!(await parseFile(inFile))) {
            if (exitOnError) {
                return
            }
        }
    }
}

main()
