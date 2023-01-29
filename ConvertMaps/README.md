# How to convert MEC1 maps to MEC2

- Create a new folder that we're using as working directory
- Get a fresh copy of the latest MEC2 basemap from spermkagen#1773@Discord and copy it to `WORK_DIR/map.w3x`
- Now we need to acquire the gamedata from MEC1. There's multiple ways of achieving this. Pick one, sorted by difficulty.

  1. If the map is not protected open it with WE. Browse to 'JASS GENERATOR' and copy the contents of those files to separate files in our working directory.
  2. Use `-smic` ingame and run the .exe to recreate the .j files (If its not in create mode you might have to edit the map to allow -smic to be used, if the map is protected you'll have to hack it)

- After acquiring these files you'll end up with:

  - `WORK_DIR/init levels.j`
  - `WORK_DIR/init monster and caster types.j`
  - `WORK_DIR/init terrain types.j`

- Now you'll have to run `php ./convert_MEC1.php WORK_DIR`
- This will generate a `Set_game_data.lua`. Put this in the MEC_CORE trigger of `WORK_DIR/map.w3x`
- Copy over war3map.w3e, war3map.shd and war3map.w3r
- Save the map with worldedit

- Now the manual work starts. You'll have to copy over everything custom from the MEC1 map. E.g.:
  - Custom triggers
  - Custom texts, like map title/description/author
  - Import custom models (Needs to end up with the exact same ID as the original map..)
  - All other custom stuff..
