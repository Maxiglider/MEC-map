import { spawn } from '../spawn'
import { e2e } from './e2e-tests-base'

export const init_E2ETests = () => {
    e2e.registerTest(spawn)
}
