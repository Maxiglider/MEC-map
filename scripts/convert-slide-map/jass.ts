/**
 * A tolerant reader of the war3map.j of an old slide map, protected or not: it only needs one statement
 * per line, which even protected maps keep (they strip indentation and comments, not line breaks, though
 * some use CR alone). It does not parse JASS: it finds the shapes the World Editor writes.
 */

export type JassFunction = { name: string; takes: string; returns: string; body: string[]; line: number }

export type TriggerEvent = { kind: string; args: string[]; line: string }

export type JassTrigger = {
    name: string
    events: TriggerEvent[]
    conditionFunctions: string[]
    actionFunctions: string[]
    initiallyDisabled: boolean
    /** every function the conditions and actions reach, in the order they appear in the script */
    reachedFunctions: string[]
    /** the lines that use it besides its creation and registrations (TriggerExecute, EnableTrigger…), by function */
    referencedBy: { fn: string; line: string }[]
}

/** Where the World Editor sets triggers up; protectors often inline every InitTrig_ into main */
const isInitFunction = (name: string) => /^(InitTrig_\w+|InitCustomTriggers|RunInitializationTriggers|main)$/.test(name)

export type ScriptUnit = {
    variable?: string
    typeId: string
    owner: string
    x: number
    y: number
    facing: number
    createdIn: string
}

export type ScriptItem = { variable?: string; typeId: string; x: number; y: number; createdIn: string }

/** The characters JASS needs no space around: an operator, a bracket or a comma */
const JASS_PUNCTUATION = new Set('()[],+-*/=<>!'.split(''))

/**
 * A script as the protected maps write it, with no space around operators, brackets and commas: `SetCameraBounds(-7680.0+
 * GetCameraMargin(...)` rather than `SetCameraBounds(- 7680.0 + GetCameraMargin(...)`. The first three old maps came
 * compact out of an optimizer, and every pattern here was written against that; Aerial Slide v1.2c, saved by the
 * World Editor through JassHelper, spaces everything out, down to its negative numbers. Strings and comments are kept
 * as they are, and a space between two minus signs stays, so that no `--` appears in a line copied into Lua.
 */
const compactJass = (script: string) => {
    // The pieces are gathered and joined once, and the last character written is kept aside: read back from a
    // string built with +=, it flattened the whole string again at every run of spaces, and Alpha Slide's 4.4 MB
    // script took 400 s to compact (2026-09-25).
    const out: string[] = []
    let last: string | undefined = undefined
    const write = (piece: string) => {
        if (piece === '') return
        out.push(piece)
        last = piece[piece.length - 1]
    }
    // a string literal may run over several lines (Slide Is Magic's quest texts): the script is read as one text
    let inString: string | null = null
    let inComment = false
    for (let i = 0; i < script.length; i++) {
        const c = script[i]
        if (inComment) {
            write(c)
            if (c === '\n') inComment = false
            continue
        }
        if (inString) {
            write(c)
            if (c === '\\') write(script[++i] ?? '')
            else if (c === inString) inString = null
            continue
        }
        if (c === '/' && script[i + 1] === '/') {
            inComment = true
            write(c)
            continue
        }
        if (c === '"' || c === "'") {
            inString = c
            write(c)
            continue
        }
        if (c === ' ' || c === '\t') {
            let j = i
            while (script[j] === ' ' || script[j] === '\t') j++
            const before: string | undefined = last
            const after = script[j]
            const leading = before === undefined || before === '\n'
            if (!leading && (JASS_PUNCTUATION.has(before) || JASS_PUNCTUATION.has(after))) {
                if (before === '-' && after === '-') write(' ')
            } else {
                write(script.substring(i, j))
            }
            i = j - 1
            continue
        }
        write(c)
    }
    return out.join('')
}

/**
 * A JASS string literal's escapes undone: `\n` is a line break, not the letter n (the Contact quest of Aerial Slide
 * read "on battle.netnHow to contact..." until this; user's report, 2026-09-24), `\\` one backslash, and anything
 * else the character itself.
 */
export const jassUnescape = (literal: string) =>
    literal.replace(/\\(.)/g, (_, c: string) => (c === 'n' ? '\n' : c === 'r' ? '\r' : c === 't' ? '\t' : c))

export const normalizeScript = (raw: string) => compactJass(raw.replace(/^﻿/, '').replace(/\r\n?/g, '\n'))

/** Splits the arguments of a call, keeping nested calls and strings whole */
export const splitArgs = (inner: string): string[] => {
    const args: string[] = []
    let depth = 0
    let current = ''
    let inString: string | null = null

    for (let i = 0; i < inner.length; i++) {
        const c = inner[i]

        if (inString) {
            current += c
            if (c === '\\') {
                current += inner[++i] ?? ''
            } else if (c === inString) {
                inString = null
            }
            continue
        }

        if (c === '"' || c === "'") {
            inString = c
            current += c
        } else if (c === '(') {
            depth++
            current += c
        } else if (c === ')') {
            depth--
            current += c
        } else if (c === ',' && depth === 0) {
            args.push(current.trim())
            current = ''
        } else {
            current += c
        }
    }

    if (current.trim() !== '') {
        args.push(current.trim())
    }

    return args
}

/** The arguments of the first call to `name` in `line`, or undefined */
export const callArgs = (line: string, name: string): string[] | undefined => {
    const start = line.indexOf(name + '(')
    if (start === -1) return undefined

    let depth = 0
    let inString: string | null = null
    const open = start + name.length

    for (let i = open; i < line.length; i++) {
        const c = line[i]

        if (inString) {
            if (c === '\\') i++
            else if (c === inString) inString = null
            continue
        }

        if (c === '"' || c === "'") inString = c
        else if (c === '(') depth++
        else if (c === ')') {
            depth--
            if (depth === 0) return splitArgs(line.substring(open + 1, i))
        }
    }

    return undefined
}

export const parseFunctions = (script: string): Map<string, JassFunction> => {
    const functions = new Map<string, JassFunction>()
    const lines = script.split('\n')
    let current: JassFunction | null = null

    lines.forEach((rawLine, index) => {
        const line = rawLine.trim()
        const header = /^(?:constant\s+)?function\s+(\w+)\s+takes\s+(.*?)\s+returns\s+(\w+)/.exec(line)

        if (header) {
            current = { name: header[1], takes: header[2], returns: header[3], body: [], line: index + 1 }
            functions.set(current.name, current)
        } else if (line === 'endfunction') {
            current = null
        } else if (current && line !== '') {
            current.body.push(line)
        }
    })

    return functions
}

export const parseGlobals = (script: string) => {
    const start = script.indexOf('\nglobals')
    const end = script.indexOf('\nendglobals')
    const globals: { type: string; name: string; isArray: boolean; value?: string }[] = []

    if (start === -1 || end === -1) return globals

    for (const rawLine of script.substring(start + 8, end).split('\n')) {
        const line = rawLine.trim()
        const m = /^(?:constant\s+)?(\w+)\s+(array\s+)?(\w+)\s*(?:=\s*(.*))?$/.exec(line)
        if (m) globals.push({ type: m[1], name: m[3], isArray: !!m[2], value: m[4] })
    }

    return globals
}

export const parseRects = (script: string) => {
    const rects: { [name: string]: { minX: number; minY: number; maxX: number; maxY: number } } = {}

    for (const m of script.matchAll(/set\s+(gg_rct_\w+)\s*=\s*Rect\(([^)]*)\)/g)) {
        const [minX, minY, maxX, maxY] = splitArgs(m[2]).map(Number)
        rects[m[1]] = { minX, minY, maxX, maxY }
    }

    return rects
}

const toNumber = (s: string) => {
    const n = Number(s)
    return isNaN(n) ? NaN : n
}

/** The units the World Editor writes into CreateUnitsForPlayerN / CreateNeutral… when the units file is gone */
export const parseScriptUnits = (functions: Map<string, JassFunction>): ScriptUnit[] => {
    const units: ScriptUnit[] = []

    for (const fn of functions.values()) {
        let playerVar: { [name: string]: string } = {}

        for (const line of fn.body) {
            const playerAssign = /^(?:local\s+player\s+|set\s+)(\w+)\s*=\s*(Player\(\d+\))/.exec(line)
            if (playerAssign) {
                playerVar[playerAssign[1]] = playerAssign[2]
                continue
            }

            for (const native of ['BlzCreateUnitWithSkin', 'CreateUnit']) {
                const args = callArgs(line, native)
                if (!args || args.length < 5 || !/^'\w{4}'$/.test(args[1])) continue

                const variable = /^set\s+(\w+)\s*=/.exec(line)?.[1]
                units.push({
                    variable: variable && variable !== 'u' && variable !== 'bj_lastCreatedUnit' ? variable : undefined,
                    typeId: args[1].slice(1, -1),
                    owner: playerVar[args[0]] ?? args[0],
                    x: toNumber(args[2]),
                    y: toNumber(args[3]),
                    facing: toNumber(args[4]),
                    createdIn: fn.name,
                })
                break
            }
        }
    }

    return units.filter(u => !isNaN(u.x) && !isNaN(u.y))
}

export const parseScriptItems = (functions: Map<string, JassFunction>): ScriptItem[] => {
    const items: ScriptItem[] = []

    for (const fn of functions.values()) {
        for (const line of fn.body) {
            const args = callArgs(line, 'CreateItem')
            if (!args || args.length < 3 || !/^'\w{4}'$/.test(args[0])) continue

            const x = toNumber(args[1])
            const y = toNumber(args[2])
            if (isNaN(x) || isNaN(y)) continue

            items.push({
                variable: /^set\s+(gg_item_\w+)\s*=/.exec(line)?.[1],
                typeId: args[0].slice(1, -1),
                x,
                y,
                createdIn: fn.name,
            })
        }
    }

    return items
}

/** The user functions a function names, as `function X` or as a call X( */
const referencedFunctions = (fn: JassFunction, functions: Map<string, JassFunction>) => {
    const refs = new Set<string>()

    for (const line of fn.body) {
        for (const m of line.matchAll(/function\s+(\w+)/g)) refs.add(m[1])
        for (const m of line.matchAll(/(\w+)\(/g)) if (functions.has(m[1])) refs.add(m[1])
    }

    return refs
}

export const parseTriggers = (script: string, functions: Map<string, JassFunction>): JassTrigger[] => {
    // "set gg_trg_X=CreateTrigger()" in InitTrig_X, or "trigger gg_trg_X=CreateTrigger()" in the globals
    const names = [...new Set([...script.matchAll(/\bgg_trg_(\w+)\s*=\s*CreateTrigger\(\)/g)].map(m => m[1]))]
    const lines = script.split('\n').map(l => l.trim())

    return names.map(name => {
        const variable = 'gg_trg_' + name
        const mentions = new RegExp('\\b' + variable + '\\b')
        const events: TriggerEvent[] = []
        const conditionFunctions: string[] = []
        const actionFunctions: string[] = []

        for (const line of lines) {
            const register = /^call\s+(TriggerRegister\w+)\((\w+)\s*,/.exec(line)
            if (register && register[2] === variable) {
                const args = callArgs(line, register[1]) ?? []
                events.push({ kind: register[1].replace(/^TriggerRegister/, ''), args: args.slice(1), line })
            }

            if (line.startsWith('call TriggerAddCondition(' + variable + ',')) {
                const m = /function\s+(\w+)/.exec(line)
                m && conditionFunctions.push(m[1])
            }

            if (line.startsWith('call TriggerAddAction(' + variable + ',')) {
                const m = /function\s+(\w+)/.exec(line)
                m && actionFunctions.push(m[1])
            }
        }

        const reached = new Set<string>()
        const queue = [...conditionFunctions, ...actionFunctions]
        while (queue.length > 0) {
            const next = queue.shift()!
            const fn = functions.get(next)
            if (!fn || reached.has(next)) continue
            reached.add(next)
            referencedFunctions(fn, functions).forEach(r => queue.push(r))
        }

        const referencedBy: { fn: string; line: string }[] = []
        let initiallyDisabled = false

        for (const fn of functions.values()) {
            for (const line of fn.body) {
                if (
                    !mentions.test(line) ||
                    /CreateTrigger\(\)|^call\s+Trigger(Register\w+|AddCondition|AddAction)\(/.test(line)
                ) {
                    continue
                }

                if (isInitFunction(fn.name) && line === 'call DisableTrigger(' + variable + ')') {
                    initiallyDisabled = true
                } else {
                    referencedBy.push({ fn: fn.name, line })
                }
            }
        }

        return {
            name,
            events,
            conditionFunctions,
            actionFunctions,
            initiallyDisabled,
            reachedFunctions: [...functions.keys()].filter(f => reached.has(f)),
            referencedBy,
        }
    })
}

/** Order ids old GUI maps give as numbers, and what they mean */
export const ORDER_NAMES: { [id: string]: string } = {
    '851971': 'smart',
    '851972': 'stop',
    '851983': 'attack',
    '851984': 'attackground',
    '851986': 'move',
    '851988': 'AImove',
    '851990': 'patrol',
    '851993': 'holdposition',
}

/** Every order given to a unit by the script, with the function it is given in */
export const parseOrders = (functions: Map<string, JassFunction>) => {
    const orders: { fn: string; native: string; unit: string; order: string; target: string[]; line: string }[] = []

    for (const fn of functions.values()) {
        for (const line of fn.body) {
            const m = /(Issue\w*Order\w*)\(/.exec(line)
            if (!m) continue

            const args = callArgs(line, m[1])
            if (!args || args.length < 2) continue

            const order = args[1].replace(/^"(.*)"$/, '$1')
            orders.push({
                fn: fn.name,
                native: m[1],
                unit: args[0],
                order: ORDER_NAMES[order] ?? order,
                target: args.slice(2),
                line,
            })
        }
    }

    return orders
}

/** Fog of war and visibility calls, with the function they are in */
export const parseVisibility = (functions: Map<string, JassFunction>) => {
    const calls: { fn: string; line: string }[] = []
    const pattern =
        /(CreateFogModifier\w*|FogModifier(Start|Stop)|DestroyFogModifier|FogEnable\w*|FogMaskEnable\w*|SetFogState\w*|ALLIANCE_SHARED_VISION|SetPlayerAlliance\w*)/

    for (const fn of functions.values()) {
        // the World Editor's own team setup: allied players sharing vision, the same in every map
        if (/^(InitCustomTeams|InitAllyPriorities)$/.test(fn.name)) continue

        for (const line of fn.body) {
            if (pattern.test(line)) calls.push({ fn: fn.name, line })
        }
    }

    return calls
}

/** Each function's triggers: the triggers whose conditions or actions reach it */
export const functionOwners = (triggers: JassTrigger[]) => {
    const owners: { [fn: string]: string[] } = {}

    for (const trigger of triggers) {
        for (const fn of trigger.reachedFunctions) {
            ;(owners[fn] ??= []).push(trigger.name)
        }
    }

    return owners
}
