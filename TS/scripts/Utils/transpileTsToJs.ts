// @ts-ignore
import ts from 'typescript';

/**
 * Transpile a TypeScript string to JavaScript.
 * @param {string} tsCode - TypeScript code
 * @param {object} [compilerOptions] - facultative options of TypeScript compiler
 * @returns {string} - Javascript result code
 */
function tsToJs(tsCode: string, compilerOptions = {}) {
    const defaultOptions = {
        compilerOptions: {
            target: ts.ScriptTarget.ES2020,
            module: ts.ModuleKind.ESNext,
            jsx: ts.JsxEmit.Preserve,
            esModuleInterop: true,
            removeComments: false,
            ...compilerOptions,
        },
        fileName: 'file.ts',
        reportDiagnostics: true,
    }

    const res = ts.transpileModule(tsCode, defaultOptions)
    if (res.diagnostics && res.diagnostics.length) {
        // diagnostics silenciés ici ; on pourrait les afficher si nécessaire
    }
    return res.outputText
}

export { tsToJs }