import * as fs from 'fs-extra'

const initMain = () => {
    if (!fs.existsSync(process.argv[2])) {
        console.log('File does not exist')
        return
    }

    const file = fs.readFileSync(process.argv[2]).toString()

    const matches = file.matchAll(new RegExp('call Preload\\( "(.*?)" \\)', 'g'))
    const json: string[] = []

    for (const match of matches) {
        json.push(match[1])
    }

    fs.writeFileSync(
        process.argv[2].replace('.txt', '.json'),
        JSON.stringify(JSON.stringify(JSON.parse(json.join('')).gameData))
    )
}

initMain()
