# NOW

- TBD

# 2023-01-28

- When a player dies on a StaticSlide their circle now keeps going until the end
- Fixed a -restart bug
- Added new monsterspawn commands: -setmsso, -setmsfsob, -setmsfsom
- Added new cmd -summon to teleport someone towards you
- When players are dead a revive timer is started, now it'll only revive allied players
- -ss now persists after being revived
- Speededit and noobedit can now be enabled for specific players (-ss on blue)

# 2023-01-23

- Added new cmd: hideChat
- The all dead trigger now ignores players with autorevive turned on
- unit recycler now resets after -setmsm has been used
- -lc now remains active when triggering a new level or restart
- -rto now allows you to tp to dead people and revives you like rpos
- fpc faster rotation and a little more smooth
- fpc now supports walking on terrain. Special thanks to @Wrda ❤️
- Ally system, -(un)ally; Allows you to only coop revive specific players (when levelprogression is set to allied)
- Changed -pcor none to also include portals. Its not really 'onRevive' but w/e, nobody plays like this anyway.. except @Andy. ..
- Solo mode option at start no longer crashes, old leaderboard does not work because of -ui command
- Added -setMonsterJumpPadEffect
- Scoreboard now maintains visibility state when someone leaves
- Disabled the classic leaderboard for now since it conflicts with -ui and everyone prefers -ui
- You can no longer finish the game multiple times by patrolling over the end region
- [EXPERIMENTAL] -setLevelProgression all|allied|solo. Makes only you/allied team/all go to the next lvl, can cause lag when levels are too big so use with caution
