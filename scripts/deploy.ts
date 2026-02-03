/**
 * Build then deploy the file to the target specified in .env file
 */

import 'dotenv/config'

const target = process.env.DEPLOY_TARGET_FILE || null
if (target === null) {
    console.error('DEPLOY_TARGET_FILE is not set in the .env file')
    process.exit(1)
}

// Build the project
import './build.ts'

import { copyFileSync } from 'fs'
import { IProjectConfig, loadJsonFile, logger } from './utils'

const config: IProjectConfig = loadJsonFile('config.json')

const filemap = `${config.outputFolder}/${config.mapFolder}`

copyFileSync(filemap, target)

logger.info(`Deployed to "${target}"`)
