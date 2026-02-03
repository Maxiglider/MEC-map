import { writeFileSync } from 'fs'
// @ts-ignore
import tsconfig from '../tsconfig.js'

const tsconfigJson = JSON.stringify(tsconfig, null, 2)

writeFileSync(process.env.PROJECT_ROOT_DIR + '/tsconfig.json', tsconfigJson)
