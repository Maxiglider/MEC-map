import { readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'

const targetFile = resolve('./dist/map.w3x/war3map.lua')

let contents = readFileSync(targetFile).toString()
let counter = 0

contents = contents.replace(new RegExp('while true do', 'gmi'), () => {
    return `while true do\nprint("Loop: #${counter++}")\n`
})

writeFileSync(targetFile, contents)

console.log('OK')
