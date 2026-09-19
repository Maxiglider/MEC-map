/**
 * Adds custom text triggers to a map's triggers as the World Editor keeps them (Reforged format, war3map.wtg
 * 0x80000004 sub-version 7 and war3map.wct 0x80000004 sub-version 1), so that they show in the editor and survive
 * a save from it. The existing triggers, GUI ones included, are left as they are: new elements are appended at the
 * end of the tree, which is also where their texts go in war3map.wct (one text per trigger, in tree order).
 *
 * war3map.wtg, as read from MEC's base map (the layout HiveWE reads):
 * - "WTG!", format 0x80000004, sub-version 7;
 * - for each element kind (map, library, category, trigger, comment, script, variable): the next id to give, then
 *   the count and ids of the deleted ones;
 * - two unknown ints, the trigger definition version, the variables (count, then each), the element count;
 * - the elements, each starting with its kind (1 map, 4 category, 8 GUI trigger, 16 comment, 32 custom text
 *   trigger, 64 variable). A category: id (0x02000000 + n), name, isComment, isExpanded, parent id. A custom text
 *   trigger: name, description, isComment, id (0x05000000 + n), isEnabled, isScript, isInitiallyOff,
 *   runOnMapInit, parent id, ECA count (0).
 */

const readInt = (b: Buffer, at: number) => b.readUInt32LE(at)

type WtgHeader = { categoryCounterAt: number; scriptCounterAt: number; elementCountAt: number }

const readWtgHeader = (b: Buffer): WtgHeader => {
    if (b.toString('latin1', 0, 4) !== 'WTG!' || readInt(b, 4) !== 0x80000004 || readInt(b, 8) !== 7) {
        throw new Error('war3map.wtg is not in the format this script knows (WTG! 0x80000004, sub-version 7)')
    }

    let o = 12
    const counters: number[] = []
    for (let kind = 0; kind < 7; kind++) {
        counters.push(o)
        o += 4
        const deleted = readInt(b, o)
        o += 4 + 4 * deleted
    }
    o += 12 // two unknown ints, trigger definition version

    const readString = () => {
        const end = b.indexOf(0, o)
        o = end + 1
    }
    const variables = readInt(b, o)
    o += 4
    for (let v = 0; v < variables; v++) {
        readString() // name
        readString() // type
        o += 4 * 4 // unknown, isArray, arraySize, isInitialized
        readString() // initial value
        o += 4 * 2 // id, parent id
    }

    return { categoryCounterAt: counters[2], scriptCounterAt: counters[5], elementCountAt: o }
}

const int = (v: number) => {
    const b = Buffer.alloc(4)
    b.writeUInt32LE(v >>> 0)
    return b
}
const str = (s: string) => Buffer.concat([Buffer.from(s, 'utf8'), Buffer.from([0])])

/** subCategory: the name of a category inside the new one to put it in ("Level 0"…), else at its root */
export type CustomTextTrigger = { name: string; description?: string; code: string; subCategory?: string }

/** Whether the map's triggers already hold a category of that name (a conversion baked before) */
export const hasCategory = (wtg: Buffer, name: string) => {
    const at = wtg.indexOf(Buffer.concat([str(name)]))
    return at !== -1 && wtg.readUInt32LE(at - 8) === 4
}

/**
 * The map's trigger files with a new category holding the given custom text triggers, at the end of the tree, the
 * ones with a subCategory in categories of that name inside it. Give the triggers of a sub-category one after
 * another: their texts go in war3map.wct in the order given, which must be the tree's.
 */
export const addCustomTextTriggers = (
    wtg: Buffer,
    wct: Buffer,
    categoryName: string,
    triggers: CustomTextTrigger[]
) => {
    const header = readWtgHeader(wtg)
    const firstCategoryNumber = readInt(wtg, header.categoryCounterAt)
    const firstScriptNumber = readInt(wtg, header.scriptCounterAt)

    const category = (name: string, parentId: number) => {
        const id = 0x02000000 + firstCategoryNumber + categories
        categories++
        elements.push(Buffer.concat([int(4), int(id), str(name), int(0), int(1), int(parentId)]))
        return id
    }
    let categories = 0
    const elements: Buffer[] = []
    const categoryId = category(categoryName, 0)
    const subCategoryIds = new Map<string, number>()

    triggers.forEach((t, i) => {
        let parentId = categoryId
        if (t.subCategory !== undefined) {
            if (!subCategoryIds.has(t.subCategory)) {
                if (subCategoryIds.size > 0 && triggers[i - 1].subCategory !== [...subCategoryIds.keys()].pop()) {
                    throw new Error('addCustomTextTriggers: the triggers of a sub-category must come one after another')
                }
                subCategoryIds.set(t.subCategory, category(t.subCategory, categoryId))
            } else if (triggers[i - 1].subCategory !== t.subCategory) {
                throw new Error('addCustomTextTriggers: the triggers of a sub-category must come one after another')
            }
            parentId = subCategoryIds.get(t.subCategory)!
        } else if (subCategoryIds.size > 0) {
            throw new Error('addCustomTextTriggers: the triggers at the root of the category must come first')
        }

        elements.push(
            Buffer.concat([
                int(32),
                str(t.name),
                str(t.description ?? ''),
                int(0), // isComment
                int(0x05000000 + firstScriptNumber + i),
                int(1), // isEnabled
                int(1), // isScript
                int(0), // isInitiallyOff
                int(0), // runOnMapInit
                int(parentId),
                int(0), // ECA count
            ])
        )
    })

    const out = Buffer.from(wtg)
    out.writeUInt32LE(firstCategoryNumber + categories, header.categoryCounterAt)
    out.writeUInt32LE(firstScriptNumber + triggers.length, header.scriptCounterAt)
    out.writeUInt32LE(readInt(wtg, header.elementCountAt) + elements.length, header.elementCountAt)

    // war3map.wct: after the header, one text per trigger in tree order (length with the final null, then text)
    if (readInt(wct, 0) !== 0x80000004 || readInt(wct, 4) !== 1) {
        throw new Error('war3map.wct is not in the format this script knows (0x80000004, sub-version 1)')
    }
    const texts = triggers.map(t => {
        const code = Buffer.from(t.code, 'utf8')
        return Buffer.concat([int(code.length + 1), code, Buffer.from([0])])
    })

    return { wtg: Buffer.concat([out, ...elements]), wct: Buffer.concat([wct, ...texts]) }
}
