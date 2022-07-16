export const PROD: boolean = compiletime(() => require('process').env.npm_lifecycle_event === 'build')
