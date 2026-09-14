# Rotation en slide

_English: [SLIDE_TURN.md](./SLIDE_TURN.md)_

Comment un héros en slide tourne vers l'angle demandé en mode de slide `max` : le modèle de rotation physique, ses réglages (vitesse de rotation, degrés d'accélération, degrés de freinage, inertie) et leur combinaison, ce que fait le `SetUnitFacing` natif d'après les mesures, les rayons de debug de `-debugSlideInertia`, et les cas dont les réglages doivent rester éloignés, avec des bornes encore à décider.

Tous les chiffres ci-dessous ont été calculés en exécutant le module compilé `SlidingMax` de `dist/map.w3x/war3map.lua` en Lua 5.3, période par période, à la vitesse de rotation par défaut (0,9549 tour par seconde) sauf mention contraire.

## Où se fait la rotation

- À chaque période de slide (`Constants.SLIDE_PERIOD`, 0,0075 s), le slide d'un héros en mode `max` appelle `computeSlideTurnForOnePeriod` (`src/core/07_TRIGGERS/Slide_and_CheckTerrain_triggers/SlidingMax.ts`) avec les degrés restant à tourner, le maximum qu'une période peut tourner (la vitesse de rotation, en degrés par période), la rotation par période atteinte jusque-là et l'inertie. Il tourne le héros de ce qu'elle répond.
- Les degrés restants valent `AnglesDiff(angle demandé, orientation)`, par le chemin le plus court, entre -180 et 180. Un clic droit les fixe une fois ; la rotation automatique (`src/core/Async_slide/AutoTurn.ts`) les refixe à chaque période d'après le curseur.
- Un héros en slide async : sa propre machine tourne l'effet, et chaque machine fait avancer l'unité depuis le dernier paquet de mouvement avec la même fonction. L'inertie voyage dans les paquets ; les réglages de `-physicalTurn` et `-legacySlideInertia` sont changés par des commandes, que toutes les machines reçoivent au même moment. La fonction ne prend et ne rend que des nombres : toutes les machines tournent l'unité pareil.

## Les réglages

| Réglage                                   | Défaut                               | Donné par                                                                                                     |
| ----------------------------------------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------- |
| Vitesse de rotation, en tours par seconde | `HERO_ROTATION_SPEED` = 0,9549       | terrain de slide (`-setTerrainRotationSpeed`), ou forcée par héros (`-rotationSpeed`, `-normalRotationSpeed`) |
| Degrés d'accélération                     | `PHYSICAL_ACCELERATION_DEGREES` = 25 | `-physicalTurn`, pour tous les héros                                                                          |
| Degrés de freinage                        | `PHYSICAL_BRAKING_DEGREES` = 80      | `-physicalTurn`, pour tous les héros                                                                          |
| Inertie, un facteur                       | `SLIDE_INERTIA_FACTOR` = 1           | terrain de slide (`-setTerrainSlideInertia`), ou forcée par héros (`-slideInertia`, `-normalSlideInertia`)    |
| Rotation legacy                           | désactivée                           | `-legacySlideInertia`                                                                                         |

## La rotation physique

Avec `m` le maximum qu'une période peut tourner, `A` et `B` les degrés d'accélération et de freinage, et `I` l'inertie :

- `c = m² / (2·A·I)` : le maximum dont la rotation par période peut changer en une période, **dans les deux sens**.
- `b = m² / (2·B·I)` : la décélération avec laquelle le héros freine à l'arrivée.
- Tourner `s` degrés en une période, puis `s - b`, `s - 2b`… jusqu'à l'arrêt couvre environ `s² / 2b + s / 2` degrés. La rotation par période la plus rapide qui s'arrête encore sur l'angle est donc `s_b = -b/2 + √(b²/4 + 2·b·|degrés restants|)`.
- La rotation vise `min(m, s_b)` vers l'angle, s'en rapproche d'au plus `c`, et ne dépasse jamais l'angle : la dernière période est coupée aux degrés restants.

Passer de l'arrêt à `m` par pas de `c` fait tourner d'environ `m² / 2c` degrés, soit `A·I`. C'est pour ça que les réglages sont en degrés plutôt qu'en secondes :

- atteindre la vitesse de rotation max prend toujours `A·I` degrés ;
- le freinage commence toujours environ `B·I` degrés avant l'angle ;
- quelle que soit la vitesse de rotation du terrain ou du héros. En secondes, une rotation plus rapide freinait sur plus de degrés, et un curseur immobile faisait tourner en cercle sous la vitesse max.

Les deux valeurs ne jouent pas le même rôle :

- **L'accélération** est une capacité : à quelle vitesse le héros peut changer sa vitesse de rotation. Elle sert à démarrer un virage, et aussi à contre-braquer, puisque `c` limite le changement dans les deux sens.
- **Le freinage** est une douceur choisie pour l'arrivée. Il ne fonctionne que si le héros peut le tenir, c'est-à-dire si `B ≥ A` (alors `b ≤ c`). Sinon le héros ne peut pas ralentir comme la courbe de freinage le demande, arrive vite et s'arrête net sur l'angle.

### Comportement avec les valeurs par défaut

| Situation                                       | Résultat                                                                      |
| ----------------------------------------------- | ----------------------------------------------------------------------------- |
| Vitesse de rotation max atteinte, départ arrêté | après 0,15 s                                                                  |
| Un virage de 90° départ arrêté                  | 0,56 s, la dernière période à 7,8°/s                                          |
| Un curseur maintenu à 20° / 45° / 90°           | 170 / 256 / 343°/s (le max est 343,8°/s)                                      |
| À pleine vitesse, curseur à 90° de l'autre côté | continue 23,7° dans l'ancien sens, puis revient ; sur le curseur après 0,74 s |

Un curseur immobile en caméra fixe fait tourner le héros en cercle autour de lui, à 90° : il tourne donc à la vitesse max tant que `B·I` reste sous environ 88°. Une caméra verrouillée sur le héros garde le curseur devant lui : le héros va tout droit.

## L'inertie

Une seule inertie multiplie les deux valeurs en degrés. C'est la physique d'une rotation : pour passer d'une vitesse de rotation `ω` à l'arrêt, ou de l'arrêt à `ω`, un corps d'inertie `I` soumis à un couple `τ` tourne de `ω²·I / 2τ`. L'inertie appartient au corps (le héros sur ce terrain) ; les deux valeurs en degrés représentent deux couples, celui qui lance la rotation et celui qui la freine.

- Les deux valeurs grandissent du même facteur : leur rapport est conservé, et donc une arrivée douce (`B ≥ A`), quel que soit le terrain.
- Les responsabilités se séparent bien : les degrés règlent le ressenti de la rotation, l'inertie la lourdeur voulue par le mapmaker pour un terrain.
- Une seule inertie ne peut pas donner un terrain « dérapant », qui démarre vite mais peine à s'arrêter de tourner. Il faudrait un facteur de freinage propre au terrain, en gardant le freinage au moins égal à l'accélération.
- Un écart assumé par rapport à la physique : en degrés, les distances ne grandissent pas avec la vitesse de rotation, comme si le couple grandissait avec elle. Les réglages restent lisibles et les cercles à pleine vitesse.

Valeurs par défaut (25° / 80°) sous différentes inerties :

| Inertie | A / B effectifs | Virage de 90° départ arrêté | Curseur maintenu à 90° | Contre-braquage, curseur à 90° de l'autre côté |
| ------- | --------------- | --------------------------- | ---------------------- | ---------------------------------------------- |
| 0,5     | 12,5° / 40°     | 0,41 s                      | 343°/s                 | continue 11,2°, sur le curseur après 0,50 s    |
| 1       | 25° / 80°       | 0,56 s                      | 343°/s                 | continue 23,7°, 0,74 s                         |
| 1,1     | 27,5° / 88°     | 0,58 s                      | 343°/s                 | continue 26,2°, 0,79 s                         |
| 1,5     | 37,5° / 120°    | 0,67 s                      | 295°/s                 | continue 36,2°, 0,99 s                         |
| 2       | 50° / 160°      | 0,78 s                      | 256°/s                 | continue 48,7°, 1,23 s                         |
| 3       | 75° / 240°      | 0,96 s                      | 209°/s                 | continue 73,7°, 1,70 s                         |

## Ce que fait SetUnitFacing

Mesuré avec `-measureTurn` (`src/core/Log/TurnMeasure.ts`, une commande admin temporaire) : le héros enchaîne seul des virages simples et des curseurs maintenus à un écart, et chaque changement de son orientation est écrit dans `CustomMapData/MEC/turn_measure.txt`.

- L'orientation change une fois par tick de jeu de 0,03 s.
- Le maximum est de 10,3124° par tick : 343,75°/s, soit 0,9549 tour par seconde, devenu `HERO_ROTATION_SPEED`.
- Il atteint ce maximum en environ 0,108 s.
- Il freine en fonction des degrés restants, bien plus doucement qu'il n'accélère, avec une longue traîne : un curseur maintenu à 5° fait tourner l'unité à 35°/s, à 45° à 267°/s.
- Changer la vitesse de rotation (turn rate) de l'unité en cours de partie ne change rien, pas plus que déplacer l'unité pendant qu'elle tourne.

La rotation physique est partie d'un ajustement sur ces mesures, à environ un degré près sur les virages simples. Ses valeurs par défaut ont ensuite été réglées en jeu pour le ressenti plutôt que pour coller à `SetUnitFacing` : les joueurs de cartes de slide jouent aujourd'hui surtout sur des cartes MEC, où la rotation peut être plus agréable que la rotation native.

## Rotation legacy

`-legacySlideInertia on` remet la rotation d'avant le modèle physique, inchangée (`computeLegacySlideTurnForOnePeriod`) :

- elle accélère vers le maximum en `HERO_ROTATION_TIME_FOR_MAXIMUM_SPEED` (0,11 s) fois l'inertie ;
- sous 51° fois l'inertie de l'angle, elle ralentit selon la table `SPEED_AT_LEAST_THAN_50_DEGREES`, lue aux degrés restants divisés par l'inertie.

Un curseur maintenu à moins de 51° ne laisse jamais le héros atteindre sa vitesse max, et une inertie plus forte élargit les cercles.

## Rayons de debug : -debugSlideInertia

`-debugSlideInertia` (`debsi`) `<boolean>` (`src/core/Async_slide/SlideTurnDebug.ts`) trace deux rayons depuis ton héros en slide, longs de 700, à `A·I` degrés de chaque côté de sa direction : de combien le héros tourne, départ arrêté, avant d'atteindre sa vitesse de rotation max.

- **Rouges** quand ton curseur est entre les deux, **verts** sinon.
- **Aucun** quand la position du curseur n'est pas connue (curseur async pas encore retrouvé, souris non lue), hors du mode `max`, ou en `-legacySlideInertia on`.
- Les lightnings sont des agents : la commande, que toutes les machines reçoivent, crée et détruit une paire verte et une paire rouge, repliées en un point sous le terrain. Seule ta machine déplie la bonne paire le long des rayons.
- Une paire par couleur plutôt que `SetLightningColor`. Les codes de lightning de `Draw_lines` ont tous une texture blanche, colorée par `LightningData.slk`, et `SetLightningColor` remplace cette couleur : les rayons devenaient blancs.

## Les cas à éviter

Rien ne casse, quelles que soient les valeurs : pas de division par zéro (l'inertie est protégée, `-physicalTurn` refuse les valeurs non positives), jamais de dépassement de l'angle, pas d'oscillation, pas de désynchronisation. Mais trois comportements gâchent le jeu :

| Cas                                                                                                                                                                                                                                                                                                                                | Arrive quand                                                                                      | Mesuré                                                                             |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| **Le contre-braquage fait le tour complet.** À pleine vitesse, le héros continue environ `A·I` degrés avant de pouvoir revenir ; pendant ce temps, le chemin le plus court vers le curseur repasse de son côté, et il fait tout le tour. Seulement avec un pilotage qui refixe l'angle à chaque période (la rotation automatique). | `A·I` > environ 180° moins l'écart du curseur : environ 90° pour un curseur à 90° de l'autre côté | A = B = 90 : continue 88,7°, revient. A = B = 95 : fait 270° par l'autre côté      |
| **Arrivées sèches.** Le héros ne peut pas tenir le freinage, arrive vite et s'arrête d'un coup sur l'angle.                                                                                                                                                                                                                        | `B < A`, quelle que soit l'inertie                                                                | A = 180, B = 80 : 101°/s à la dernière période d'un virage de 90°, au lieu de 8°/s |
| **Cercles sous la vitesse max** avec un curseur immobile.                                                                                                                                                                                                                                                                          | `B·I` > environ 88°                                                                               | B·I = 90 : 340,5 sur 343,8°/s. 120 : 295. 160 : 256                                |

Les mêmes valeurs se dégradent ensemble. A = 60 et B = 90 :

| Inertie | Virage de 90° | Curseur maintenu à 90° | Contre-braquage, curseur à 90° de l'autre côté |
| ------- | ------------- | ---------------------- | ---------------------------------------------- |
| 1       | 0,66 s        | 340°/s                 | continue 59°, revient                          |
| 2       | 0,94 s        | 241°/s                 | 270° par l'autre côté                          |
| 3       | 1,15 s        | 197°/s                 | 270° par l'autre côté                          |
| 4       | 1,33 s        | 171°/s                 | 270° par l'autre côté                          |

Ces cas ne sont pas propres aux valeurs des joueurs : les valeurs par défaut sous une inertie de 4 donnent déjà `A·I` = 100°. Mais un mapmaker essaie une inertie avec les valeurs par défaut, et un joueur aux valeurs plus hautes les rencontrerait sur des terrains où le mapmaker ne les a jamais vus.

## En suspens : bornes et réglage joueur

`-physicalTurn` ressemble plus à une sensibilité de souris qu'à un cheat : il ne change ni la vitesse de rotation max ni la vitesse de slide, seulement la façon dont le héros suit le curseur. Contrairement à une sensibilité, il change pourtant ce qu'un héros peut faire : avec `-physicalTurn 1 1`, l'inertie disparaît presque, et les zigzags serrés deviennent plus faciles. L'idée en discussion :

- les deux valeurs en degrés deviennent un réglage propre à chaque joueur, dans les commandes `all`, toujours reçu par toutes les machines ;
- un `-physicalTurn` global reste en cheat, pour les tests et pour les valeurs par défaut de tout le monde ;
- des bornes gardent les valeurs des joueurs, avec une inertie maximale, à l'écart des cas ci-dessus.

Les bornes entrent en conflit avec le freinage testé en jeu : garantir les cercles à pleine vitesse impose `B·I ≤ 88°`, donc avec B = 80 une inertie d'au plus 1,1, ce qui permet d'alléger un terrain mais pas de l'alourdir. Il reste donc un choix :

1. **Garantir seulement le contre-braquage et les arrivées douces** (`A·I ≤ 90°`, `B ≥ A`), et accepter des cercles plus lents sur les terrains lourds, ce qui est le sens même de la lourdeur. Par exemple accélération de 10 à 45°, inertie max de 2 (45 × 2 = 90° ; A = B = 45 sous une inertie de 2 continue 88,7° et revient), B = 80 conservé.
2. **Tout garantir en baissant le freinage**, par exemple B d'au plus 60° et une inertie d'au plus 1,4 (84°).
3. **Tout garantir en gardant B = 80**, avec une inertie d'au plus environ 1,1.

Autre possibilité, en changeant le calcul plutôt que les valeurs : garder le côté choisi par un contre-braquage au lieu de basculer quand la dérive du héros inverse le chemin le plus court. Ça supprimerait le tour complet, même sous les fortes inerties choisies par un mapmaker.

## Commandes

| Commande                                                                                   | Groupe | Ce qu'elle fait                                                   |
| ------------------------------------------------------------------------------------------ | ------ | ----------------------------------------------------------------- |
| `-physicalTurn` (`pt`) `[<accelerationDegrees> <brakingDegrees> \| default]`               | cheat  | affiche ou change les deux valeurs en degrés, pour tous les héros |
| `-legacySlideInertia` (`lsi`) `<on\|off>`                                                  | cheat  | la rotation legacy                                                |
| `-rotationSpeed` (`rs`) `<roundsPerSecond> [all\|player]` / `-normalRotationSpeed` (`nrs`) | cheat  | force la vitesse de rotation d'un héros, ou la rend aux terrains  |
| `-slideInertia` (`si`) `<factor> [all\|player]` / `-normalSlideInertia` (`nsi`)            | cheat  | force l'inertie d'un héros, ou la rend aux terrains               |
| `-setTerrainRotationSpeed` (`settrs`) `<slideTerrainLabel> <rotationSpeed\|default>`       | make   | vitesse de rotation d'un terrain de slide                         |
| `-setTerrainSlideInertia` (`settsi`) `<slideTerrainLabel> <inertia\|default>`              | make   | inertie d'un terrain de slide                                     |
| `-debugSlideInertia` (`debsi`) `<boolean>`                                                 | all    | les rayons de debug                                               |
| `-measureTurn`                                                                             | admin  | mesure `SetUnitFacing` (temporaire)                               |
