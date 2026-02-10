import { getUdgEscapers } from '../../../../globals'
import { errorHandler } from '../../../Utils/mapUtils'
import { SUCCESS_TEXT_COLORCODE, Text } from 'core/01_libraries/Text'
import { ServiceManager } from '../../../Services'
import { ClearText } from '../../01_libraries/Basic_functions'

export type E2EAction = {
    command?: string
    function?: () => void
    waitAfter?: number
}

export type E2ETest = {
    shortName: string
    name: string
    actions: E2EAction[]
    abortFunction?: () => void
}

const settings = {
    speed: 1,
    executing: false,
}

let currentTest: E2ETest | null = null

function executeActions(actions: E2EAction[], testName: string) {
    const firstEscaper = getUdgEscapers().getFirst()
    if (!firstEscaper) {
        print('No escaper found, cannot execute e2e actions')
        return
    }

    // We need a timer for TriggerSleepAction to work, so we create one that executes immediately
    const trigger = CreateTrigger()
    TriggerRegisterTimerEventSingle(trigger, 0)
    TriggerAddAction(trigger, () => {
        ClearText()

        Text.mkA_timed(-1, `Starting ${testName} test`)

        for (const action of actions) {
            ClearText()

            if (action.command) {
                Text.mkA_timed(-1, `Executing:|r ${action.command}`)
                ServiceManager.getService('Cmd').ExecuteCommand(firstEscaper, action.command)
            }

            if (action.function) {
                errorHandler(() => action.function?.())()
            }

            if (!currentTest) {
                // In case of aborted test
                return
            }

            if (action.waitAfter) {
                const waitTime = action.waitAfter * settings.speed
                Text.mkA_timed(-1, `Waiting for ${waitTime}s...`)

                TriggerSleepAction(action.waitAfter * settings.speed)

                if (!currentTest) {
                    // In case of aborted test
                    return
                }
            }
        }

        ClearText()
        Text.ForAll_timed_withColorCode(-1, SUCCESS_TEXT_COLORCODE, `${testName} test ended.`)

        currentTest = null
    })
}

function setSpeed(newSpeed: number) {
    if (newSpeed < 0) {
        Text.erA('Wrong e2e speed "' + newSpeed + '" (has to be a positive percentage')
    }

    settings.speed = 1 / (newSpeed / 100)
    Text.mkA(`E2E test speed set to ${newSpeed}%`)
}

const e2eTests = new Map<string, E2ETest>()

function registerTest(test: E2ETest) {
    e2eTests.set(test.shortName, test)
}

function startTest(name: string) {
    const test = e2eTests.get(name)
    if (!test) {
        Text.erA(`e2e test "${name}" doesn't exist`)
        return
    }

    stop()

    currentTest = test
    executeActions(test.actions, name)
}

function stop() {
    if (currentTest) {
        currentTest.abortFunction?.()
        Text.mkA(`Test "${currentTest.name}" stopped.`)
        currentTest = null
    } else {
        Text.erA('No e2e test is currently running')
    }
}

export const e2e = {
    setSpeed,
    registerTest,
    startTest,
    stop,
}
