import { readFileSync, writeFileSync } from 'fs'

const targetFile = __dirname + '/../node_modules/w3ts-jsx/dist/node_modules/basic-pragma/src/element.ts'
let content = readFileSync(targetFile).toString()
content = content.replace('props.children = flattenedChildren', 'props.children = flattenedChildren as any')
writeFileSync(targetFile, content)
