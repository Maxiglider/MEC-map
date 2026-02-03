import 'dotenv/config'
const rootDir = process.env.PROJECT_ROOT_DIR || null
if (rootDir === null) {
    throw new Error('PROJECT_ROOT_DIR environment variable is not set.')
}

export default {
    compilerOptions: {
        allowJs: false,
        baseUrl: './src',
        outDir: '.',
        forceConsistentCasingInFileNames: true,
        target: 'ESNext',
        lib: ['ESNext'],
        noImplicitAny: true,
        strict: true,
        moduleResolution: 'node',
        paths: {
            '@objectdata/*': ['./node_modules/war3-objectdata-th/dist/cjs/generated/constants/*'],
        },
        plugins: [
            {
                transform: 'war3-transformer',
                mapDir: `${rootDir}/maps/map.w3x`,
                entryFile: `${rootDir}/src/main.ts`,
                outputDir: `${rootDir}/dist/map.w3x`,
            },
        ],
        types: [
            '@typescript-to-lua/language-extensions',
            'lua-types/core/coroutine',
            'lua-types/core/global',
            'lua-types/core/math',
            'lua-types/core/metatable',
            'lua-types/core/modules',
            'lua-types/core/string',
            'lua-types/core/table',
            'lua-types/core/os',
            'lua-types/special/5.3',
            'war3-types-strict/1.33.0',
            'war3-transformer/types',
            'war3-objectdata-th/dist/cjs/objectdata',
        ],
        skipLibCheck: true,
    },
    include: ['src'],
    exclude: [],
    tstl: {
        luaTarget: '5.3',
        noHeader: true,
        luaLibImport: 'require',
        noImplicitSelf: true,
        luaBundle: 'dist/tstl_output.lua',
        luaBundleEntry: './src/main.ts',
        sourceMapTraceback: false,
        noResolvePaths: ['typescript', 'typescript-to-lua'],
    },
}
