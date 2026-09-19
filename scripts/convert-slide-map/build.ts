/**
 * Steps 4 to 6 of the conversion of an old slide map to MEC in one go (see .claude/skills/convert-slide-map/SKILL.md),
 * once conversion-work/<map>/conversion.json is written: the rebase on the MEC base map, then the game data and
 * custom triggers baked into it. Run `yarn release` before, for the MEC core of this repo.
 *
 * yarn convert-slide-map:build "<map file name in original-maps/>" [--keep-base-core]
 */
import { spawnSync } from 'child_process'
import * as path from 'path'

const args = process.argv.slice(2)
const mapFileName = args.find(a => !a.startsWith('--'))
if (!mapFileName) {
    throw new Error('Usage: yarn convert-slide-map:build "<map file name in original-maps/>" [--keep-base-core]')
}

const run = (script: string, scriptArgs: string[]) => {
    const result = spawnSync('npx', ['ts-node', '--transpile-only', path.join(__dirname, script), ...scriptArgs], {
        stdio: 'inherit',
    })
    if (result.status !== 0) {
        process.exit(result.status ?? 1)
    }
}

run('rebase.ts', [mapFileName, ...args.filter(a => a === '--keep-base-core')])
run('gamedata.ts', [mapFileName])
