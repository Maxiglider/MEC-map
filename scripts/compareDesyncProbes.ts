/**
 * Compares the `-desyncProbe` files of several machines and says where they first disagree.
 *
 * The probe writes, five times a second, values that must be identical on every machine
 * (src/core/Log/DesyncProbe.ts). After a desync, the files of every player are collected and read
 * side by side: the first field that differs is where to look. Doing that by eye over files holding
 * a minute of probes is what this script takes over.
 *
 * Usage:
 *   yarn compare-desync-probes <dirOrFileA> <dirOrFileB> [...]
 *
 * An argument is either a probe file, or a folder holding the files of one machine, in which case
 * `desync_probe_p<N>.txt` and `desync_probe_p<N>_last.txt` are read together: the `_last` file holds
 * the final seconds a dropped machine never wrote to the other one.
 *
 * What is never compared, being different by design (see docs/CAUSES_OF_DESYNCS.md):
 * - `hid`, the id of a handle just made, which drifts by thousands in games that do not desync
 * - any field written `*`, and `fx*`: what a hero sliding as an effect only its own machine knows
 * - the `[probe N death]` lines, whose cause is written where the death was decided
 * - the `[probe N sites]` lines of `--verbose`, which name where this machine made its agents from
 */
import * as fs from 'fs'
import * as path from 'path'

type Probe = { tick: number; line: string }
type Machine = { name: string; probes: Map<number, string> }

const IGNORED_FIELDS = ['hid']

/** The fields the probe writes for each hero, longest first so that "ss" is never read as "s" */
const HERO_FIELDS = ['abs', 'afk', 'cam', 'ck', 'fx', 'inv', 'iv', 'pc', 'sp', 'ss', 'tt', 'a', 'e', 'f', 'h', 'l', 's']

const readProbeFile = (file: string): Probe[] => {
    const text = fs.readFileSync(file, 'latin1')

    // the file is a Lua script of Preload("...") calls, each holding a slice of the probe text
    const chunks: string[] = []
    const preload = /Preload\(\s*"((?:[^"\\]|\\.)*)"\s*\)/g
    let match: RegExpExecArray | null

    while ((match = preload.exec(text)) !== null) {
        chunks.push(match[1].replace(/\\"/g, '"').replace(/\\\\/g, '\\'))
    }

    const probes: Probe[] = []

    for (const line of chunks.join('').split('\n')) {
        const tick = /^\[probe (\d+)(?: t[\d.]+)?\]/.exec(line.trim())

        // the death lines and the verbose "sites" lines are logs, not values every machine must match
        if (tick && !line.includes('death]') && !line.includes('sites]')) {
            probes.push({ tick: Number(tick[1]), line: line.trim() })
        }
    }

    return probes
}

const readMachine = (target: string): Machine => {
    const isDir = fs.statSync(target).isDirectory()
    const files = isDir
        ? fs
              .readdirSync(target)
              .filter(name => /^desync_probe_p\d+(_last)?\.txt$/.test(name))
              .map(name => path.join(target, name))
        : [target]

    if (files.length === 0) {
        throw new Error(`no probe file in ${target}`)
    }

    const probes = new Map<number, string>()

    for (const file of files) {
        for (const probe of readProbeFile(file)) {
            // a probe held by both files is the same one: the _last file only reaches further
            probes.set(probe.tick, probe.line)
        }
    }

    return { name: path.basename(target.replace(/\/$/, '')), probes }
}

/** `ag e164/86` and `1: 10775,-487` alike: a field is a name and what follows it */
const fieldsOf = (line: string): Map<string, string> => {
    const fields = new Map<string, string>()
    const body = line.replace(/^\[probe \d+(?: t[\d.]+)?\]\s*/, '')

    body.split('|').forEach((part, index) => {
        const tokens = part.trim().split(/\s+/).filter(Boolean)

        if (tokens.length === 0) {
            return
        }

        // after the first section, each one is a hero: "3: 11442,-2718 f89 h0 ..."
        const prefix = index === 0 ? '' : tokens[0].replace(':', '') + '.'
        const rest = index === 0 ? tokens : tokens.slice(1)

        if (index > 0) {
            fields.set(prefix + 'pos', rest[0] ?? '')
        }

        for (const token of index > 0 ? rest.slice(1) : rest) {
            // a hero's field may hold a word ("ttwalkCheckpoint"), so its name is matched against the ones the
            // probe writes rather than read as the letters the token starts with (DesyncProbe, describeEscaper).
            // Only inside a hero's section: in the first one, "li2544/2544" is the lightnings, not "l" then "i…".
            const known = index > 0 ? HERO_FIELDS.find(name => token.startsWith(name)) : undefined
            const named = known ? [token, known, token.slice(known.length)] : /^([a-zA-Z]+)(.*)$/.exec(token)

            if (named) {
                fields.set(prefix + named[1], named[2])
            }
        }
    })

    return fields
}

const isComparable = (name: string, values: string[]) =>
    !IGNORED_FIELDS.includes(name.replace(/^\d+\./, '')) && !values.some(value => value.includes('*'))

const main = () => {
    const targets = process.argv.slice(2)

    if (targets.length < 2) {
        console.error('usage: yarn compare-desync-probes <dirOrFileA> <dirOrFileB> [...]')
        process.exit(1)
    }

    const machines = targets.map(readMachine)

    machines.forEach(machine => {
        const ticks = [...machine.probes.keys()].sort((a, b) => a - b)
        console.log(`${machine.name}: ${machine.probes.size} probes, ${ticks[0]} to ${ticks[ticks.length - 1]}`)
    })

    const shared = [...machines[0].probes.keys()]
        .filter(tick => machines.every(machine => machine.probes.has(tick)))
        .sort((a, b) => a - b)

    if (shared.length === 0) {
        console.error('\nno probe number these files have in common: are they from the same game?')
        process.exit(1)
    }

    console.log(`\n${shared.length} probes in common, ${shared[0]} to ${shared[shared.length - 1]}\n`)

    // A field one machine never writes while another always does comes from a different build, not from the game
    // (docs/CAUSES_OF_DESYNCS.md: "a probe line without ag / mh comes from an older build"). Comparing those would
    // report every probe as differing, so they are named once and left out.
    const written = machines.map(
        machine => new Set(shared.flatMap(tick => [...fieldsOf(machine.probes.get(tick)!).keys()]))
    )
    const everywhere = [...new Set(written.flatMap(names => [...names]))]
    const missing = everywhere.filter(name => written.some(names => !names.has(name)))

    if (missing.length > 0) {
        console.log('these fields are missing from some of these files, and are left out of the comparison:')
        missing.forEach(name => {
            const absent = machines.filter((_, i) => !written[i].has(name)).map(machine => machine.name)
            console.log(`  ${name}: absent from ${absent.join(', ')}`)
        })
        console.log('a whole field missing means a machine played an older build, not that the game differed.\n')
    }

    for (const tick of shared) {
        const perMachine = machines.map(machine => fieldsOf(machine.probes.get(tick)!))
        const names = [...new Set(perMachine.flatMap(fields => [...fields.keys()]))]
        const differing = names.filter(name => {
            if (missing.includes(name)) {
                return false
            }

            const values = perMachine.map(fields => fields.get(name) ?? '<absent>')

            return isComparable(name, values) && new Set(values).size > 1
        })

        if (differing.length === 0) {
            continue
        }

        console.log(`first difference at probe ${tick}:\n`)

        for (const name of differing) {
            console.log(`  ${name}`)
            machines.forEach((machine, i) => {
                console.log(`    ${machine.name.padEnd(24)} ${perMachine[i].get(name) ?? '<absent>'}`)
            })
        }

        console.log('\nthe whole line on each machine:\n')
        machines.forEach(machine => console.log(`  ${machine.name}: ${machine.probes.get(tick)}`))

        return
    }

    console.log('no difference in any shared probe.')
    console.log('the desync came from something the probe does not read, or after the last shared probe:')
    console.log('read the _last file of the machine that was dropped for its final probes.')
}

main()
