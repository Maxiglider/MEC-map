declare function strings(): {
    replaceAll(toReplace: string, replacement: string, str: string): string
    escapeDoubleQuotes(str: string): string
    replaceBackslahsesInLinks(str: string): string
    stringContainsChar(str: string, char: string): boolean
}
