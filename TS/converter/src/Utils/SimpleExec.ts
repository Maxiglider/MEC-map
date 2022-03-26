import { spawn } from 'child_process'

export const simpleExec = async ({ cmd, verbose }: { cmd: string; verbose?: boolean }) => {
    if (verbose) {
        console.log(`Executing: ${cmd}`)
    }

    return new Promise<string>(resolve => {
        const ls = spawn(cmd, [], { shell: true })

        const out: string[] = []

        ls.stdout.on('data', (data: string) => {
            if (verbose) {
                console.log('stdout: ' + data.toString())
            }

            out.push(data)
        })

        ls.stderr.on('data', data => {
            if (verbose) {
                console.log('stderr: ' + data.toString())
            }
        })

        ls.on('error', err => {
            throw err
        })

        ls.on('exit', code => {
            if (verbose) {
                console.log('child process exited with code ' + code)
            }

            resolve(out.join(''))
        })
    })
}
