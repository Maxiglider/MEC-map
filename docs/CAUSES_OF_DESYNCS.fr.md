# Causes des désynchronisations

_English: [CAUSES_OF_DESYNCS.md](./CAUSES_OF_DESYNCS.md)_

Ce qui désynchronise une partie de Warcraft III, lesquelles de ces causes MEC a rencontrées (et comment chacune a été corrigée, ou reste ouverte), et comment trouver la prochaine avec `-desyncProbe`.

## Ce qu'est une désynchronisation

Warcraft III fonctionne en **lockstep**. Aucune machine n'envoie l'état de la partie aux autres : chacune calcule elle-même toute la simulation, à partir du même point de départ et des mêmes entrées (ordres, chat, paquets de synchronisation), tour par tour. Tant que toutes les machines calculent exactement la même chose, elles voient toutes la même partie.

Une désynchronisation, c'est une machine qui calcule quelque chose de différent des autres. Le moteur s'en aperçoit un peu plus tard (en général en quelques secondes), coupe la partie en deux, et chaque camp voit l'autre « quitter la partie ». Rien n'indique _ce qui_ a divergé, et la cause précède souvent la coupure de plusieurs secondes.

La règle qui compte est donc : **tout ce qui modifie la partie doit se produire sur toutes les machines, à l'identique, au même tour.**

## Code local : ce qui est sûr et ce qui ne l'est pas

Du code tourne légitimement sur une seule machine : tout ce qui est derrière `GetLocalPlayer()`, la grille de souris asynchrone, le slide async d'un héros sur sa propre machine, la caméra, l'interface. Ce code peut **montrer** des choses différentes sur chaque machine, mais ne doit jamais **changer** ce qu'est la partie.

| Sûr sur une seule machine                                                                                                                             | Désynchronise sur une seule machine                                                                                                                 |
| ----------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Natives de caméra (`SetCameraPosition`, champs)                                                                                                       | Créer ou détruire un agent (effet, unité, timer, déclencheur, groupe, point, rectangle, région, objet, éclair, force, destructible, son)            |
| Frames / interface, textes flottants, images (pas des agents)                                                                                         | Donner un ordre à une unité, la déplacer, la tuer, la ressusciter, la mettre en pause ; changer sa vie, son propriétaire, ses capacités, ses objets |
| Déplacer, animer, redimensionner, recolorer un effet **existant** (`BlzSetSpecialEffectPosition`, `BlzPlaySpecialEffect`, alpha, vitesse d'animation) | Tirer dans le générateur aléatoire du jeu (`GetRandomInt`, `GetRandomReal`)                                                                         |
| Couleur / transparence d'une unité, lueur d'équipe                                                                                                    | Prendre ou rendre une table de la réserve de `MemoryHandler`                                                                                        |
| Lire n'importe quoi                                                                                                                                   | Écrire un état Lua partagé que du code synchronisé lit ensuite pour agir                                                                            |
| Envoyer un paquet de synchronisation (`BlzSendSyncData`)                                                                                              | Démarrer, mettre en pause ou détruire un timer, activer un déclencheur                                                                              |

Un **agent** est la famille d'objets du moteur (unités, effets, timers…) que le moteur alloue et suit par identifiant de handle ; voir [le glossaire](#glossaire).

## Les causes, avec les cas de MEC

### 1. Un agent créé ou détruit par une seule machine

La plus fréquente. La machine a un objet que les autres n'ont pas, les identifiants de handles se décalent, et la partie diverge.

- **Effet de mort montré tout de suite sur la machine du joueur en slide async** (`src/core/08_GAME/Death/AsyncKillingEffects.ts`). On ne peut pas y créer un effet seul : au début du slide async, chaque machine crée donc, pour chaque joueur async, un effet par modèle d'effet de mort, rangé sous le sol. La machine du joueur ne fait que _déplacer_ et _rejouer_ l'un d'eux sur le héros au moment du contact. À la mort, chaque machine crée le vrai effet ; celle qui l'a déjà montré en crée un avec un modèle vide (un handle créé partout, rien d'affiché deux fois).
- **Effet du héros, ombre dessinée, météore à la main de l'effet** : créés avec le héros, ou quand la météore est ramassée, c'est-à-dire à partir d'événements que toutes les machines reçoivent, puis seulement déplacés en local.
- **Météore attachée pendant que le héros est un effet** (`Escaper.refreshMeteorEffects`) : détruite et recréée seulement quand le héros devient un effet ou redevient une unité, ce que toutes les machines font au même tour.

### 2. Un tirage aléatoire sur une seule machine

Le générateur aléatoire est partagé : un tirage de plus sur une machine change tous les tirages suivants.

- **Mode ivre dans le tournage automatique async** (`To_turn_on_slide.ts`, `isDrunkSwayPositive`) : le tournage automatique ne tourne que sur la machine du joueur, il alterne donc le balancement au lieu de tirer au sort.

### 3. La partie modifiée à partir d'une valeur que seule une machine connaît

Un objet synchronisé déplacé, tourné ou jugé à partir d'une valeur locale.

- **Unité d'un héros async** (`Escaper.moveHeroUnitToSyncedPos`, `advanceSyncedHeroUnit`) : jamais déplacée à partir de l'effet que le joueur dirige. Elle est placée depuis le dernier paquet de mouvement, puis prolongée entre deux paquets par toutes les machines avec le même calcul, à partir de ce seul paquet.
- **Qui touche quoi** : seul le propriétaire d'un héros async détecte ses contacts (lui seul sait où est le héros), et il les **annonce** à toutes les machines, qui les appliquent au même tour (`ContactCheck.ts`, `AsyncHeroSync.ts`). La hauteur du héros voyage dans le paquet, car chaque machine en mesurerait une différente.
- **Terrain sous un héros async** : lu par sa seule machine ; un sol marchable ou un terrain mortel est **rendu** par un paquet, et toutes les machines rejouent la vérification du terrain à partir de l'état contenu dans ce paquet.
- **Unité qui reprend sa place à l'effet** (`Escaper.setHeroAsEffect`) : elle prenait `heroPos`, l'endroit où chaque machine voit l'effet. Après un paquet, c'est le même partout, mais un redémarrage de niveau (`checkpointReviveHeroes_function.ts`) terminait l'effet sans paquet : la position de départ synchronisée écrasait x et y, pas l'orientation, et l'unité du propriétaire regardait ailleurs que sur les autres machines, jusqu'à ce qu'il se mette à marcher et soit éjecté. L'unité prend maintenant `syncedHeroPos`, et un redémarrage de niveau sort du mode effet avant de déplacer et tourner les héros.
- **Météore de triche** (`Meteor_functions.ts`) : savoir si elle peut être lâchée lit maintenant la position synchronisée.
- **Progression et effet « ditch »** (`ProgressionUtils.calculatePlayerProgression`, `Multiboard.handleDitchLogic`) : la progression était calculée depuis `getHeroX/Y`, et elle décide quel héros vivant reçoit l'effet « talk to me » au-dessus d'un coéquipier mort. Un joueur en slide async qui tournait autour d'un mort le croisait à un moment différent sur chaque machine, ce qui détruisait et recréait cet effet à des tours différents (visible comme `ag e…/…` différent d'une unité). La progression lit maintenant la position synchronisée et le static slide nommé par les paquets, et un héros en slide async n'est plus jugé sur le terrain lu par sa seule machine. `-lockcam progression` lit la même progression.
- **Casters** (`Caster.ts`, paquet `MEC_AHA`) : ils visaient depuis `getHeroX/Y`, l'endroit où chaque machine voit l'effet d'un héros async, donc le fait de tirer, l'angle et le rechargement différaient, et un projectile était créé sur certaines machines seulement. Pour un héros en slide async, seule sa machine calcule maintenant le tir, depuis l'effet lui-même, et l'annonce à toutes les machines, qui tirent ou non au même tour. Le caster attend cette réponse, et abandonne au bout de 2 s (son joueur est sans doute parti). Les héros qui sont des unités restent visés de la même façon par toutes les machines.

### 4. Les identifiants de handles, qui ne sont pas synchronisés en Lua

Depuis le patch 1.32, `collectgarbage` ne peut plus être appelé, et le ramasse-miettes de Lua libère les handles (et recycle leurs identifiants) à un moment différent sur chaque machine, d'autant plus quand du code ne tourne que sur une machine. **Les identifiants de handles diffèrent entre machines.**

- Ne jamais envoyer d'identifiant de handle dans un paquet de synchronisation.
- Ne jamais laisser un identifiant de handle décider d'un ordre : table indexée par identifiant parcourue avec `pairs`, ou triée par identifiant.
- Corrigé dans le commit `ed85ea5` : les monstres spawnés reçoivent un numéro d'enregistrement utilisé pour les contacts et les chunks (`globals.ts`, `ContactChunks.ts`), le recycleur d'unités utilise une simple file, les régions MEC et les ordres de déplacement longue distance sont parcourus dans l'ordre de création. Le scénario reproduit en LAN sur de gros spawns désynchronisait avant, et plus après.

### 5. L'ordre de parcours de `pairs`

`pairs` parcourt une table dans l'ordre de sa disposition interne, qui dépend de ses clés et de son historique. Parcourir les mêmes clés de la même table sur toutes les machines n'est sûr que si toutes les machines ont construit cette table à l'identique. Les tables indexées par des handles cassent ça (cause 4), tout comme les tables réutilisées d'une réserve avec un passé différent (cause 6). Préférer les tableaux et les compteurs de création dès que l'ordre a un effet.

### 6. La réserve de `MemoryHandler` utilisée par du code qui ne tourne que sur une machine

`MemoryHandler` distribue des tables recyclées. Une table réutilisée garde la disposition interne de sa vie précédente, donc un `pairs` dessus dépend de son historique. Si une machine prend ou rend une table que les autres ne prennent pas, toutes les machines distribuent ensuite des tables différentes.

- **Zones des static slides** : elles étaient construites à la demande par la machine d'un héros async (`createDiagonalRegions` prend des tables de la réserve) ; elles sont maintenant construites à l'activation du niveau, sur toutes les machines (`StaticSlide.activate`).
- Règle : le code qui ne tourne que sur une machine utilise des `{}` / `[]` simples, jamais `MemoryHandler`.
- **Latent** : un static slide ajouté pendant que son niveau est actif, autrement qu'en mode make, aurait encore ses zones construites à la demande.

### 7. Un état Lua partagé écrit par du code local et lu par du code synchronisé

Une variable de module ou un champ qu'un appel local écrit et qu'un appel synchronisé lit ensuite.

- **`canTurn` dans `To_turn_on_slide.ts`** était partagé entre les appels : le tournage automatique local pouvait le laisser à `false`, et un clic droit synchronisé tournait alors le héros sur certaines machines seulement. C'est maintenant une variable propre à chaque appel.
- **Trajets de static slide propres à la machine du héros** : la liste des passagers du couloir diffère entre machines, par conception. Du code synchronisé ne doit jamais la parcourir pour agir sur la partie. **Latent** : `StaticSlide.activate(false)` retire les passagers pendant qu'il parcourt la liste (il en saute un sur deux), ce qui, avec des listes différentes, pourrait libérer un héros synchronisé sur une seule machine.

### 8. Les horloges locales

`os.clock()` est l'horloge d'une machine. Elle peut décider de quelque chose de local (combien de temps un effet joue, si le propriétaire d'un héros async ne répond plus), jamais de quelque chose que fait la partie.

- La répétition des contacts est comptée en **vérifications** d'un timer démarré au même tour partout, pas en secondes.
- La protection contre le demi-tour après un changement de sens de slide lit un timer du jeu (`slideClock`), pas `os.clock`.

## Partager correctement une information locale

Utiliser un paquet de synchronisation : `BlzSendSyncData` depuis la machine qui sait, `BlzTriggerRegisterPlayerSyncEvent` sur toutes les machines. L'événement se déclenche au même tour partout, **expéditeur compris**, un aller-retour réseau plus tard. Tout appliquer à partir du contenu du paquet, pas de l'état local de la machine qui l'applique. Paquets du slide async de MEC (`AsyncHeroSync.ts`) : position `MEC_AHP`, remise du héros `MEC_AHT`, mort `MEC_AHD`, contact `MEC_AHC`, événement `MEC_AHE`, visée d'un caster `MEC_AHA`, activité afk `MEC_AHK`.

## Trouver une désynchronisation : `-desyncProbe`

`-desyncProbe true` (commande admin, reçue par toutes les machines) fait écrire à chaque machine, cinq fois par seconde, des valeurs qui doivent être identiques partout, dans deux fichiers de `Documents/Warcraft III/CustomMapData/MEC/` (N = numéro du joueur sur cette machine) :

- `desync_probe_p<N>.txt` : la dernière minute, écrite une fois par seconde. La probe s'arrête d'elle-même quand un joueur part, pour que les machines restées dans la partie terminent ce fichier sur la coupure. Elles ne la remarquent que quelques secondes après, d'où la minute entière.
- `desync_probe_p<N>_last.txt` : les 5 dernières secondes, écrites à chaque probe. La machine qu'une désynchronisation éjecte n'est prévenue d'aucun départ : sa partie s'arrête, et elle perd jusqu'à la dernière seconde du premier fichier, celle d'avant sa coupure, qu'elle seule peut montrer.

Après une désynchronisation, récupérer **les deux** fichiers de **chaque** joueur (y compris les joueurs morts) et comparer les lignes de même numéro de probe, en lisant le fichier `_last` de la machine éjectée pour ses dernières probes. Le premier champ qui diffère indique où chercher.

- `rng` : un tirage du générateur aléatoire partagé (cause 2, ou tout ce qui tire au sort en local).
- `hid` : identifiant d'un handle tout juste créé. **À ignorer** : il varie de plusieurs milliers dans des parties qui ne désynchronisent pas (cause 4).
- `mobs … face … ord` : sommes des positions, orientations et ordres des monstres.
- `ag e…/… t…/… u…/…` : agents créés/détruits par type depuis le démarrage de la probe, comptés en enveloppant chaque native qui en crée ou en détruit, quel que soit l'appelant (cause 1).
- `mh <distribuées>/<rendues>/<en réserve>` : compteurs de la réserve de `MemoryHandler` (cause 6).
- Par héros : position de l'unité, orientation, hauteur de vol, vie, vivant, slide en tant qu'effet (`e`), slide, static slide, terrain, vitesse, invulnérabilité coop, afk, cible de caméra, unité invisible, cercle de résurrection. Pour un héros en slide async, `ss`, `tt` et `sp` valent `*` et `fx*` est l'endroit où cette machine voit l'effet : ces valeurs diffèrent **par conception**.
- Les lignes `[probe N death]` donnent où un héros est mort et sa cause, notée là où la mort a été décidée (contact, terrain mortel, sortie latérale d'un static slide, ou une pile d'appels). Pour un héros async, seule sa propre machine connaît la cause. Non comparées.

La probe ne voit que ce qu'elle lit. Une désynchronisation sans aucun champ différent avant la coupure indique quelque chose qu'elle ne lit pas, ou les dernières 0,2 s.

## Reproduire en local

- Deux instances sur une même machine Linux peuvent jouer ensemble en LAN (voir les notes d'installation). À 0 ping, les écarts entre une machine et les autres n'apparaissent presque jamais : ajouter de la latence sur la boucle locale avec `lan-delay on 50` (50 ms dans chaque sens).
- Deux captures d'écran prises au même instant ne montrent pas le même moment de la partie : l'hôte avance légèrement devant les autres instances. Comparer les lignes de probe, écrites au même tour de jeu sur toutes les machines.
- Vérifier que chaque joueur utilise la carte construite à partir du code testé : une ligne de probe sans `ag` / `mh` vient d'un build plus ancien.

## Liste de contrôle pour du code qui ne tourne que sur une machine

- [ ] Aucun agent créé ou détruit (utiliser des effets créés à l'avance et rangés, ou l'astuce du modèle vide).
- [ ] Aucune unité ordonnée, déplacée, tuée, ressuscitée, mise en pause ; aucun timer démarré, aucun déclencheur activé.
- [ ] Aucun tirage aléatoire.
- [ ] Aucune table de `MemoryHandler` prise ou rendue.
- [ ] Aucune variable partagée écrite que du code synchronisé lit pour agir sur la partie.
- [ ] Tout ce que la partie doit savoir passe par un paquet de synchronisation, appliqué à partir de son contenu sur toutes les machines.
- [ ] Aucun identifiant de handle envoyé, et aucun ordre décidé par des identifiants de handles.

## Glossaire

- **Handle** : une référence à un objet du moteur, telle que les scripts la manipulent.
- **Agent** : les types de handles qui héritent de `agent` dans `common.j` (unités, objets, destructibles, effets, éclairs, sons, timers, déclencheurs, événements, groupes, points, rectangles, régions, forces…). Les joueurs, textes flottants, images et frames sont des handles mais pas des agents.
- **Table** : la seule structure de données de Lua ; chaque tableau, objet et instance de classe TypeScript est compilé en table.
- **Paquet de synchronisation** : données envoyées avec `BlzSendSyncData`, reçues par toutes les machines au même tour.
