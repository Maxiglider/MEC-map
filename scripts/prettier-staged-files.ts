import { execSync } from 'node:child_process'
import 'dotenv/config'

const enabled = process.env.DISABLE_PRETTIER_STAGED_FILES !== 'true'

if (enabled) {
    execSync('yarn run lint-staged')
    console.log('Prettier staged files complete')
}
