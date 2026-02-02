export function assertDefined<T>(val: T | undefined, functionName: string): T {
    if (val === undefined) {
        BJDebugMsg(`${functionName} function returned undefined`)
        throw new Error(`${functionName} function returned undefined`)
    }
    return val
}
