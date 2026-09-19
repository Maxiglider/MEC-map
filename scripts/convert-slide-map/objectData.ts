import ModifiedObject from 'mdx-m3-viewer-th/dist/cjs/parsers/w3x/w3u/modifiedobject'

/**
 * The library writes object data of format 3 (Reforged) in the wrong order: the count of the modifications
 * before the flag of their set, where the game and its own reader put the flag first. Every other part of
 * its writer is right, so only this method is replaced. A base map's object data read and written back
 * comes out byte for byte the same with it.
 */
const fixedSave = function (this: any, stream: any, useOptionalInts: boolean, formatVersion: number) {
    this.oldId !== '\0\0\0\0' ? stream.writeBinary(this.oldId) : stream.writeUint32(0)
    this.newId !== '\0\0\0\0' ? stream.writeBinary(this.newId) : stream.writeUint32(0)

    if (formatVersion >= 3) {
        stream.writeUint32(this.sets)
    }

    for (let set = 0; set < this.sets; set++) {
        if (formatVersion >= 3) {
            stream.writeUint32(this.setsFlag[set] ?? 0)
        }

        stream.writeUint32(this.modifications.length)
        for (const modification of this.modifications) {
            modification.save(stream, useOptionalInts)
        }
    }
}

export const fixObjectDataWriter = () => {
    ;(ModifiedObject.prototype as any).save = fixedSave
}

// the official list of unit fields: their type, and whether they are "net safe", which is what the skin file
// (war3mapSkin.w3u) holds: how a unit looks, not how it plays
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { UnitProps } = require('war3-objectdata-th/dist/cjs/generated/units') as {
    UnitProps: { id: string; type: string; netsafe: string }[]
}
const unitFields = new Map(UnitProps.map(p => [p.id, p]))

/** Whether a unit field belongs to the skin file */
export const isSkinField = (id: string) => unitFields.get(id)?.netsafe === 'true'

/** The variable type a unit field is written with: 0 int, 1 real, 2 unreal, 3 string */
export const variableTypeOf = (id: string, value: unknown) => {
    const type = unitFields.get(id)?.type
    if (type === 'real') return 1
    if (type === 'unreal') return 2
    if (type && ['int', 'bool', 'attackBits', 'deathType', 'teamColor', 'versionFlags'].includes(type)) return 0
    if (type) return 3
    return typeof value === 'string' ? 3 : Number.isInteger(value) ? 0 : 1
}
