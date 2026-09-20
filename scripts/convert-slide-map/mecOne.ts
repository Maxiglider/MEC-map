/**
 * MEC 1 maps: the ones made with the vJass MEC of this repo's `v1-jass` tag, in the World Editor, their script
 * compiled to JASS. Their structures keep their names there (`s__Escaper_`, `s__Level_`…), so what the map holds is
 * read from its own calls: its terrain types, monster types, levels and monsters are the very calls a MEC 2 game
 * data is made of, and the rest of its triggers are the features of its own, to look at one by one.
 */

/** What only a map built on MEC 1 holds: its structures, as vJass compiles them */
const MEC_ONE_MARKERS = ['s__Escaper_', 's__Level_', 's__TerrainTypeArray_', 's__MonsterTypeArray_']

/** The triggers of MEC 1 itself (its `core/` at the v1-jass tag): every other trigger is the map's own */
export const MEC_ONE_CORE_TRIGGERS = [
    'A_hero_dies_check_if_all_dead_and_sounds',
    'A_player_leaves',
    'Afk_mode_ordre_recu',
    'Allways_day',
    'Autorevive',
    'Camera',
    'Camera_reset',
    'Effect_meteor_on_pick_down',
    'Effect_meteor_on_pick_up',
    'Forces_ally',
    'Init_escapers',
    'Init_lives',
    'Init_struct_levels',
    'Init_terrain_limit_variables',
    'InvisUnit_is_getting_damage',
    'Lose_a_life_and_res',
    'Meteor_being_used',
    'Right_click_on_widget',
    'Select_hero',
    'Sound_monster_dies',
    'Start_sound',
    'Stop_using_normal_meteor',
    'Teleport',
    'Unselect_hero',
    'Using_shortcut',
    'apparition_dialogue_et_fermeture_automatique',
    'appui_sur_bouton_dialogue',
    'coop_init_sounds',
    'creation_dialogue',
    // the MEC 1 map template's own GUI triggers, in every map made with it
    'Init_colorCodes',
    'Welcome_message',
    'Map_description',
    'Adding_quests',
    'Antisave',
    'Antisave_warning',
    'Colors',
    'Commands_2',
    'Command_shortcuts',
    'Effects',
    'Red_commands',
    'No_selection_circle',
]

/** The triggers a MEC 1 map's own data is written in, which the World Editor's maker fills in game */
const MEC_ONE_DATA_TRIGGERS = ['Init_terrain_types', 'Init_monster_and_caster_types', 'Init_levels']

export type MapKind = 'mec1' | 'homemade'

/** Whether the old map was made with MEC 1, or by hand */
export const detectMapKind = (script: string): MapKind =>
    MEC_ONE_MARKERS.every(marker => script.includes(marker)) ? 'mec1' : 'homemade'

/**
 * The cheat of a MEC 1 map: its escapers are made with the making rights rather than a teleport command of its own
 * (`isTrueMaximaxouB` and `canCheatB` true in the constructor), which gives every MEC 1 command, `-t` included.
 * Only the constructor is touched: the setters of those fields keep working.
 */
export const addMecOneCheat = (script: string) => {
    const start = script.search(/function\s+s__Escaper_create\s+takes/)
    if (start === -1) throw new Error('No s__Escaper_create in the MEC 1 script: the cheat cannot be added')
    const end = script.indexOf('endfunction', start)
    const constructor = script.substring(start, end)
    const cheated = constructor.replace(
        /(set\s+s__Escaper_(?:canCheatB|isTrueMaximaxouB)\s*\[\s*\w+\s*\]\s*=\s*)false/g,
        '$1true'
    )
    if (cheated === constructor) {
        throw new Error(
            "No canCheatB or isTrueMaximaxouB set in MEC 1's escaper constructor: the cheat cannot be added"
        )
    }
    return script.substring(0, start) + cheated + script.substring(end)
}

/** A call of a MEC 1 structure in the map's data, with its arguments as written */
export type MecOneCall = { fn: string; args: string; line: string }

/** What a MEC 1 map holds: the calls its data is made of, and the triggers of its own */
export const mecOneInventory = (script: string) => {
    const lines = script.split('\n')
    const calls: MecOneCall[] = []
    const triggers = new Set<string>()
    const dataTriggers = new Set<string>()

    let trigger: string | undefined
    for (const line of lines) {
        const fn = /^\s*function\s+(?:InitTrig_|Trig_)?([A-Za-z0-9_]+?)(?:_Actions|_Conditions|_Func\w*)?\s+takes/.exec(
            line
        )
        if (fn) trigger = fn[1]

        // a map's data is written in its init triggers alone (Init_terrain_types, Init_levels, Init_level3_part2…):
        // the same calls elsewhere are MEC 1 running
        if (!trigger || !/^init_/i.test(trigger)) continue

        for (const m of line.matchAll(/s__([A-Za-z]+)_([A-Za-z][A-Za-z0-9]*)\s*\(([^)]*)\)/g)) {
            const call = { fn: `${m[1]}.${m[2]}`, args: m[3].trim(), line: line.trim() }
            // what makes a map: its types, levels, monsters and their places, not MEC 1 running
            if (
                /^(TerrainTypeArray|MonsterTypeArray|CasterTypeArray|MonsterType|CasterType|Level|LevelArray|MonsterSimplePatrolArray|MonsterNoMoveArray|MonsterMultiplePatrolsArray|MonsterMultiplePatrols|MonsterSpawnArray|MeteorArray|VisibilityModifierArray)\.(new|create|set|store|newSlide|newWalk|newDeath)/.test(
                    call.fn
                ) ||
                /^(Level)\.(monsters|visibilities|meteors|monsterSpawns|newStart|newEnd|setNbLivesEarned)/.test(call.fn)
            ) {
                calls.push(call)
                trigger && dataTriggers.add(trigger)
            }
        }
    }

    for (const m of script.matchAll(/^function\s+InitTrig_([A-Za-z0-9_]+)\s+takes/gm)) triggers.add(m[1])

    const counts: { [fn: string]: number } = {}
    for (const c of calls) counts[c.fn] = (counts[c.fn] ?? 0) + 1

    const known = new Set([...MEC_ONE_CORE_TRIGGERS, ...MEC_ONE_DATA_TRIGGERS, ...dataTriggers])

    return {
        calls,
        counts,
        /** the map's data: terrain types, monster types, levels, monsters… */
        dataTriggers: [...dataTriggers].sort(),
        /** MEC 1 itself and its map template */
        coreTriggers: [...triggers].filter(t => MEC_ONE_CORE_TRIGGERS.includes(t)).sort(),
        /** the map's own features, to look at one by one: they have no MEC 2 equivalent yet */
        ownTriggers: [...triggers].filter(t => !known.has(t)).sort(),
    }
}
