# How to convert MEC1 maps to MEC2

- Make sure this folder exists: `C:\Users\Stan\Desktop\Warcraft`
  - Create the folder: `C:\Users\Stan\Desktop\Warcraft\__TEMPLATE\`
  - With the files:
    - `MEC2_Template.w3m` (Request from ImNotCrazy)
    - `init_levels.j` (Empty file)
    - `init_monster_and_caster_types.j` (Empty file)
    - `init_terrain_types.j` (Empty file)
- Put the Mec1 map in: `C:\Users\Stan\Desktop\Warcraft`
- Run: `ts-node .\src\convert_mec1_to_mec2.ts "C:\Users\Stan\Desktop\Warcraft\OLDMEC1MAP.w3x"`
- Follow the steps from the script
