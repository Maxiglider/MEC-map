import * as fs from 'fs-extra'
import * as path from 'path'

interface CommandInfo {
    name: string
    alias: string[]
    group: string
    argDescription: string
    description: string
    filePath: string
    lineNumber: number
}

class CommandParser {
    private commands: CommandInfo[] = []
    private srcPath: string

    constructor(srcPath: string) {
        this.srcPath = srcPath
    }

    /**
     * Recursively get all TypeScript files
     */
    private getAllTsFiles(dir: string): string[] {
        const files: string[] = []

        try {
            const entries = fs.readdirSync(dir, { withFileTypes: true })

            for (const entry of entries) {
                const fullPath = path.join(dir, entry.name)

                if (entry.isDirectory()) {
                    files.push(...this.getAllTsFiles(fullPath))
                } else if (entry.isFile() && entry.name.endsWith('.ts')) {
                    files.push(fullPath)
                }
            }
        } catch (error) {
            console.error(`Error reading directory ${dir}:`, error)
        }

        return files
    }

    /**
     * Parse TypeScript files to find registerCommand calls
     */
    async parseCommands(): Promise<void> {
        const typeScriptFiles = this.getAllTsFiles(this.srcPath)
        console.log(`Found ${typeScriptFiles.length} TypeScript files to analyze`)

        for (const filePath of typeScriptFiles) {
            await this.parseFile(filePath)
        }
    }

    /**
     * Parse a single TypeScript file for registerCommand calls
     */
    private async parseFile(filePath: string): Promise<void> {
        try {
            const content = fs.readFileSync(filePath, 'utf8')
            const lines = content.split('\n')

            for (let i = 0; i < lines.length; i++) {
                const line = lines[i].trim()

                // Look for registerCommand calls
                if (line.includes('registerCommand(')) {
                    const command = this.extractCommandInfo(content, i, filePath)
                    if (command) {
                        this.commands.push(command)
                        console.log(`Found command: ${command.name} (${command.group})`)
                    }
                }
            }
        } catch (error) {
            console.error(`Error parsing file ${filePath}:`, error)
        }
    }

    /**
     * Extract command information from registerCommand call
     */
    private extractCommandInfo(content: string, startLine: number, filePath: string): CommandInfo | null {
        try {
            const lines = content.split('\n')
            let braceCount = 0
            let commandBlock = ''
            let i = startLine

            // Find the complete registerCommand block
            while (i < lines.length) {
                const line = lines[i]
                commandBlock += line + '\n'

                // Count braces to find the end of the command object
                for (const char of line) {
                    if (char === '{') braceCount++
                    if (char === '}') braceCount--
                }

                if (braceCount === 0 && line.includes('}')) {
                    break
                }
                i++
            }

            // Extract command properties using regex patterns
            const nameMatch = commandBlock.match(/name:\s*['"`]([^'"`]+)['"`]/)
            const aliasMatch = commandBlock.match(/alias:\s*\[([^\]]*)\]/)
            const groupMatch = commandBlock.match(/group:\s*['"`]([^'"`]+)['"`]/)
            const argDescMatch = commandBlock.match(/argDescription:\s*['"`]([^'"`]*)['"`]/)
            const descriptionMatch = commandBlock.match(/description:\s*['"`]([^'"`]*)['"`]/)

            if (!nameMatch) {
                // Try to match old-style cmd pattern
                const cmdMatch = commandBlock.match(/cmd:\s*['"`]([^'"`]+)['"`]/)
                if (!cmdMatch) return null

                return {
                    name: cmdMatch[1],
                    alias: [],
                    group: 'legacy',
                    argDescription: '',
                    description: '',
                    filePath: path.relative(this.srcPath, filePath),
                    lineNumber: startLine + 1,
                }
            }

            // Parse alias array
            let aliases: string[] = []
            if (aliasMatch) {
                const aliasString = aliasMatch[1]
                const aliasMatches = aliasString.match(/['"`]([^'"`]+)['"`]/g)
                if (aliasMatches) {
                    aliases = aliasMatches.map(match => match.replace(/['"`]/g, ''))
                }
            }

            return {
                name: nameMatch[1],
                alias: aliases,
                group: groupMatch ? groupMatch[1] : 'unknown',
                argDescription: argDescMatch ? argDescMatch[1] : '',
                description: descriptionMatch ? descriptionMatch[1] : '',
                filePath: path.relative(this.srcPath, filePath),
                lineNumber: startLine + 1,
            }
        } catch (error) {
            console.error(`Error extracting command info from ${filePath}:${startLine}:`, error)
            return null
        }
    }

    /**
     * Generate help documentation similar to the in-game help command
     */
    generateHelpDocs(): string {
        // Group commands by access level
        const groupedCommands: { [key: string]: CommandInfo[] } = {}

        for (const cmd of this.commands) {
            if (!groupedCommands[cmd.group]) {
                groupedCommands[cmd.group] = []
            }
            groupedCommands[cmd.group].push(cmd)
        }

        // Sort commands within each group alphabetically
        for (const group in groupedCommands) {
            groupedCommands[group].sort((a, b) => a.name.localeCompare(b.name))
        }

        let output = `# MEC Map Commands Documentation\n`
        output += `Generated on: ${new Date().toISOString()}\n`
        output += `Total commands found: ${this.commands.length}\n\n`

        // Define group order and descriptions
        const groupOrder = ['all', 'red', 'cheat', 'make', 'max', 'truemax', 'legacy']
        const groupDescriptions: { [key: string]: string } = {
            all: 'Available to all players',
            red: 'Available to red player (Player 1) when red rights are on, or players with cheat access',
            cheat: 'Available to players with cheat access',
            make: 'Available to players with make/cheat access',
            max: 'Available to Maximaxou and above',
            truemax: 'Available to TrueMaximaxou only',
            legacy: 'Legacy commands (old format)',
        }

        // Generate documentation for each group
        for (const group of groupOrder) {
            if (!groupedCommands[group] || groupedCommands[group].length === 0) continue

            output += `## ${group.toUpperCase()} Commands\n`
            output += `*${groupDescriptions[group] || 'Unknown access level'}*\n\n`

            for (const cmd of groupedCommands[group]) {
                output += this.formatCommand(cmd)
            }

            output += '\n'
        }

        // Handle any unknown groups
        for (const group in groupedCommands) {
            if (!groupOrder.includes(group)) {
                output += `## ${group.toUpperCase()} Commands\n\n`
                for (const cmd of groupedCommands[group]) {
                    output += this.formatCommand(cmd)
                }
                output += '\n'
            }
        }

        // Add summary statistics
        output += `## Summary\n\n`
        for (const group of [...groupOrder, ...Object.keys(groupedCommands).filter(g => !groupOrder.includes(g))]) {
            if (groupedCommands[group] && groupedCommands[group].length > 0) {
                output += `- **${group}**: ${groupedCommands[group].length} commands\n`
            }
        }

        return output
    }

    /**
     * Format a single command for documentation
     */
    private formatCommand(cmd: CommandInfo): string {
        let formatted = `### -${cmd.name}`

        if (cmd.alias.length > 0) {
            formatted += ` (${cmd.alias.map(a => `-${a}`).join(', ')})`
        }

        formatted += '\n\n'

        if (cmd.argDescription) {
            formatted += `**Usage:** \`-${cmd.name} ${cmd.argDescription}\`\n\n`
        }

        if (cmd.description) {
            formatted += `**Description:** ${cmd.description}\n\n`
        }

        return formatted
    }

    /**
     * Generate a simple text format similar to in-game help
     */
    generateSimpleHelp(): string {
        const sortedCommands = [...this.commands].sort((a, b) => a.name.localeCompare(b.name))

        let output = 'Commands:\n'

        for (const cmd of sortedCommands) {
            output += `-${cmd.name}`

            if (cmd.alias.length > 0) {
                output += `(${cmd.alias.join(' | ')})`
            }

            if (cmd.argDescription) {
                output += ` ${cmd.argDescription}`
            }

            if (cmd.description) {
                output += ` --> ${cmd.description}`
            }

            output += `\n`
        }

        return output
    }

    getCommands(): CommandInfo[] {
        return this.commands
    }
}

async function main() {
    console.log('🔍 Parsing MEC Map commands...')

    const srcPath = path.join(__dirname, '..', 'src')
    const binPath = path.join(__dirname, '..', '..', 'bin')

    console.log(`Source path: ${srcPath}`)
    console.log(`Output path: ${binPath}`)

    // Ensure bin directory exists
    if (!fs.existsSync(binPath)) {
        fs.mkdirSync(binPath, { recursive: true })
        console.log(`Created output directory: ${binPath}`)
    }

    const parser = new CommandParser(srcPath)
    await parser.parseCommands()

    const commands = parser.getCommands()
    console.log(`\n✅ Found ${commands.length} commands`)

    // Generate markdown documentation
    console.log('📝 Generating markdown documentation...')
    const markdownDocs = parser.generateHelpDocs()
    const markdownPath = path.join(binPath, 'commands-help.md')
    fs.writeFileSync(markdownPath, markdownDocs, 'utf8')
    console.log(`Generated: ${markdownPath}`)

    // Generate simple text help (similar to in-game)
    console.log('📄 Generating simple text help...')
    const simpleHelp = parser.generateSimpleHelp()
    const textPath = path.join(binPath, 'commands-help.txt')
    fs.writeFileSync(textPath, simpleHelp, 'utf8')
    console.log(`Generated: ${textPath}`)

    // Generate JSON for programmatic use
    console.log('📊 Generating JSON data...')
    const jsonPath = path.join(binPath, 'commands-data.json')
    fs.writeFileSync(jsonPath, JSON.stringify(commands, null, 2), 'utf8')
    console.log(`Generated: ${jsonPath}`)

    console.log('\n🎉 Command documentation generation complete!')

    // Display summary
    const groupCounts: { [key: string]: number } = {}
    for (const cmd of commands) {
        groupCounts[cmd.group] = (groupCounts[cmd.group] || 0) + 1
    }

    console.log('\n📈 Summary by group:')
    for (const [group, count] of Object.entries(groupCounts)) {
        console.log(`  ${group}: ${count} commands`)
    }
}

if (require.main === module) {
    main().catch(console.error)
}

export { CommandInfo, CommandParser }
