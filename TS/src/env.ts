export const PROD = compiletime(() => require('process').env.npm_lifecycle_event === 'build')
