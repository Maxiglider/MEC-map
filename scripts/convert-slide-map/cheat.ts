import MpqArchive from 'mdx-m3-viewer-th/dist/cjs/parsers/mpq/archive'

/**
 * A quick cheat in the old map itself, to play it through while converting it: what MEC's -t does (the hero is
 * teleported where its player next right-clicks, once), and -stop (-s) to cancel it. Written in the map's own
 * JASS, with the natives Reign of Chaos already had.
 */
const CHEAT_GLOBALS = ['boolean array mec_cheat_teleport']

const CHEAT_FUNCTIONS = `function MecCheat_Teleport takes nothing returns nothing
set mec_cheat_teleport[GetPlayerId(GetTriggerPlayer())]=true
call DisplayTextToPlayer(GetTriggerPlayer(),0,0,"|cffffd700Teleport: right-click where your hero goes (-s to cancel)|r")
endfunction
function MecCheat_Stop takes nothing returns nothing
if mec_cheat_teleport[GetPlayerId(GetTriggerPlayer())] then
set mec_cheat_teleport[GetPlayerId(GetTriggerPlayer())]=false
call DisplayTextToPlayer(GetTriggerPlayer(),0,0,"|cffffd700Teleport cancelled|r")
endif
endfunction
function MecCheat_Order takes nothing returns nothing
local unit u=GetTriggerUnit()
local integer id=GetPlayerId(GetOwningPlayer(u))
if mec_cheat_teleport[id] and GetIssuedOrderId()==OrderId("smart") and IsUnitType(u,UNIT_TYPE_HERO) then
set mec_cheat_teleport[id]=false
call SetUnitPosition(u,GetOrderPointX(),GetOrderPointY())
endif
set u=null
endfunction
function MecCheat_Init takes nothing returns nothing
local trigger teleport=CreateTrigger()
local trigger cancel=CreateTrigger()
local trigger order=CreateTrigger()
local integer i=0
loop
exitwhen i>11
call TriggerRegisterPlayerChatEvent(teleport,Player(i),"-t",true)
call TriggerRegisterPlayerChatEvent(teleport,Player(i),"-teleport",true)
call TriggerRegisterPlayerChatEvent(cancel,Player(i),"-s",true)
call TriggerRegisterPlayerChatEvent(cancel,Player(i),"-stop",true)
call TriggerRegisterPlayerUnitEvent(order,Player(i),EVENT_PLAYER_UNIT_ISSUED_POINT_ORDER,null)
set i=i+1
endloop
call TriggerAddAction(teleport,function MecCheat_Teleport)
call TriggerAddAction(cancel,function MecCheat_Stop)
call TriggerAddAction(order,function MecCheat_Order)
endfunction`

/** The script with the cheat in it: globals before endglobals, functions before main, their setup at main's end */
export const addCheatToScript = (script: string) => {
    const eol = script.includes('\r\n') ? '\r\n' : script.includes('\r') ? '\r' : '\n'
    const lines = script.split(/\r\n|\r|\n/)
    const trimmed = lines.map(l => l.trim())

    const endGlobals = trimmed.indexOf('endglobals')
    const main = trimmed.findIndex(l => /^function\s+main\s+takes\s+nothing\s+returns\s+nothing$/.test(l))
    const mainEnd = main === -1 ? -1 : trimmed.indexOf('endfunction', main)
    if (endGlobals === -1 || main === -1 || mainEnd === -1) {
        throw new Error('The old script has no endglobals or no main function: the cheat cannot be added')
    }
    if (trimmed.some(l => l.startsWith('function MecCheat_'))) {
        return script
    }

    const out = [
        ...lines.slice(0, endGlobals),
        ...CHEAT_GLOBALS,
        ...lines.slice(endGlobals, main),
        ...CHEAT_FUNCTIONS.split('\n'),
        ...lines.slice(main, mainEnd),
        'call MecCheat_Init()',
        ...lines.slice(mainEnd),
    ]
    return out.join(eol)
}

/**
 * The old map with the cheat, saved as a new file: the archive rewritten with every file it holds (the names
 * found by the extraction, as protected maps empty their listfile), behind the old map's own header.
 */
export const makeCheatedMap = (mapBytes: Buffer, knownNames: string[]) => {
    const archive = new MpqArchive()
    archive.load(new Uint8Array(mapBytes), false)
    archive.applyListfile(knownNames)

    const warnings: string[] = []
    const unresolved = archive.countUnresolved()
    if (unresolved > 0) warnings.push(`${unresolved} file(s) of unknown name may be missing from the cheated map`)

    let changed = 0
    for (const name of ['scripts\\war3map.j', 'war3map.j']) {
        const file = archive.get(name)
        const bytes = file?.bytes()
        if (!bytes) continue
        archive.set(name, Buffer.from(addCheatToScript(Buffer.from(bytes).toString('utf8')), 'utf8'))
        changed++
    }
    if (changed === 0) throw new Error('The old map has no JASS script: the cheat cannot be added')

    const saved = archive.save()
    if (!saved) throw new Error('The cheated map could not be saved')
    return { bytes: Buffer.concat([mapBytes.subarray(0, archive.headerOffset), Buffer.from(saved)]), warnings }
}
