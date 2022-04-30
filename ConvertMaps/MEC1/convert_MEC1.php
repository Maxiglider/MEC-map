<?php
/**
 * Créé avec PhpStorm.
 * Auteur: Max
 * Date: 23/04/2022
 * Heure: 12:16
 */


/**
 * Get the jass content to parse
 */
$workingDir = __DIR__ . "/peonSlide";

if (isset($argv[1])) {
    $workingDir = $argv[1];
}

if (!is_dir($workingDir)) {
    die("folder \"$workingDir\" not found");
}

$allJass = "";

$files = scandir($workingDir);
foreach ($files as $file) {
    if (preg_match("/\.j$/", $file)) {
        $allJass .= file_get_contents($workingDir . "/" . $file) . "\n";
    }
}

if ($allJass === "") {
    die("no jass found to parse");
}

$lines = preg_split("/[\r\n]+/", $allJass);


/**
 * Prepare variables for output
 */

$gameData = (object)[
    "levels" => [],
    "casterTypes" => [],
    "monsterTypes" => [],
    "terrainTypesMec" => [],
];


/**
 * Functions
 */

function removeQuotes($str)
{
    return preg_replace("/['\"]/", '', $str);
}

function getArgs($argsStr)
{
    $args = explode(',', $argsStr);
    foreach ($args as $n => $arg) {
        $args[$n] = trim($arg);
    }
    return $args;
}

function delGetTypes($line)
{
    return preg_replace('/udg_[a-zA-Z]+Types\.get\((.*?)\)/', '$1', $line);
}


/**
 * Parse the jass code
 */

$level = null;
$nextMMPxArr = [];
$nextMMPyArr = [];

$nbMonstersWithId0 = 0; //id more than one, we remove ids

foreach ($lines as $line) {

    //terrain type slide
    if (preg_match('/newSlide\((.+?)\)(\.setCliffClassId\((.+?)\))?/', $line, $match)) {
        $args = getArgs($match[1]);

        $gameData->terrainTypesMec[] = [
            "canTurn" => !isset($args[3]) || $args[3] == "true",
            "alias" => "",
            "cliffClassId" => isset($match[3]) ? intval($match[3]) : 1,
            "slideSpeed" => intval($args[2]),
            "label" => removeQuotes($args[0]),
            "orderId" => 0,
            "terrainTypeId" => removeQuotes($args[1]),
            "kind" => "slide"
        ];
    }

    //terrain type walk
    if (preg_match('/newWalk\((.+?)\)(\.setCliffClassId\((.+?)\))?/', $line, $match)) {
        $args = getArgs($match[1]);

        $gameData->terrainTypesMec[] = [
            "alias" => "",
            "cliffClassId" => isset($match[3]) ? intval($match[3]) : 1,
            "walkSpeed" => intval($args[2]),
            "label" => removeQuotes($args[0]),
            "orderId" => 0,
            "terrainTypeId" => removeQuotes($args[1]),
            "kind" => "walk"
        ];
    }

    //terrain type death
    if (preg_match('/newDeath\((.+?)\)(\.setCliffClassId\((.+?)\))?/', $line, $match)) {
        $args = getArgs($match[1]);

        $gameData->terrainTypesMec[] = [
            "alias" => "",
            "cliffClassId" => isset($match[3]) ? intval($match[3]) : 1,
            "label" => removeQuotes($args[0]),
            "orderId" => 0,
            "terrainTypeId" => removeQuotes($args[1]),
            "kind" => "death",
            "killingEffet" => stripslashes(removeQuotes($args[2])),
            "timeToKill" => floatval($args[3]),
            "toleranceDist" => floatval($args[4]),
        ];
    }

    //monster types
    if (preg_match('/udg_monsterTypes\.new\((.+?)\)(\.setKillingEffectStr\((.+?)\))?/', $line, $match)) {
        $args = getArgs($match[1]);

        $gameData->monsterTypes[] = [
            "unitTypeId" => removeQuotes($args[1]),
            "label" => removeQuotes($args[0]),
            "isClickable" => $args[5] == "true",
            "height" => -1,
            "immolationRadius" => intval($args[3]),
            "scale" => floatval($args[2]),
            "speed" => floatval($args[4]),
            "nbMeteorsToKill" => 1,
            "killingEffect" => isset($match[3]) ? stripslashes(stripslashes(removeQuotes($match[3]))) : ''
        ];
    }

    //caster types
    if (preg_match('/udg_casterTypes\.new/', $line)) {
        $line = delGetTypes($line);

        if (preg_match('/udg_casterTypes\.new\((.+?)\)/', $line, $match)) {
            $args = getArgs($match[1]);

            $gameData->casterTypes[] = [
                "alias" => "",
                "label" => removeQuotes($args[0]),
                "casterMonsterTypeLabel" => removeQuotes($args[1]),
                "projectileMonsterTypeLabel" => removeQuotes($args[2]),
                "range" => floatval($args[3]),
                "projectileSpeed" => floatval($args[4]),
                "loadTime" => floatval($args[5]),
                "animation" => removeQuotes($args[6]),
            ];
        }
    }


    /**
     * Levels
     */

    //level init
    if (preg_match('/^function Init_level(\d+)_Actions/', $line, $match)) {
        $levelNum = intval($match[1]);
        $level = $gameData->levels[$levelNum] = (object)[
            "id" => $levelNum,
            "start" => null,
            "end" => null,
            "visibilities" => [],
            "meteors" => [],
            "monsters" => [],
            "monsterSpawns" => [],
        ];
    }

    //lives earned
    if (preg_match('/level.setNbLivesEarned\((\d+)\)/', $line, $match)) {
        $level->nbLives = intval($match[1]);
    }

    //start location
    if ($level && $level->id != 0 && preg_match('/level\.newStart\((.+?)\)/', $line, $match)) {
        $args = getArgs($match[1]);

        $level->start = [
            "minX" => floatval($args[0]),
            "minY" => floatval($args[1]),
            "maxX" => floatval($args[2]),
            "maxY" => floatval($args[3]),
        ];
    }

    //end location
    if (preg_match('/level\.newEnd\((.+?)\)/', $line, $match)) {
        $args = getArgs($match[1]);

        $level->end = [
            "minX" => floatval($args[0]),
            "minY" => floatval($args[1]),
            "maxX" => floatval($args[2]),
            "maxY" => floatval($args[3]),
        ];
    }

    //visibilities
    if (preg_match('/level\.newVisibilityModifier\((.+?)\)/', $line, $match)) {
        $args = getArgs($match[1]);

        $level->visibilities[] = [
            "x1" => floatval($args[0]),
            "y1" => floatval($args[1]),
            "x2" => floatval($args[2]),
            "y2" => floatval($args[3]),
        ];
    }

    //monsters no move
    if (preg_match('/level.monstersNoMove.new/', $line)) {
        $line = delGetTypes($line);

        if (preg_match('/level\.monstersNoMove\.new\((.+?)\)(\.setId\((\d+)\))?/', $line, $match)) {
            $args = getArgs($match[1]);
            $id = isset($match[3]) ? intval($match[3]) : 0;
            if($id == 0) $nbMonstersWithId0++;

            $level->monsters[] = [
                "id" => $id,
                "monsterClassName" => "MonsterNoMove",
                "monsterTypeLabel" => removeQuotes($args[0]),
                "x" => intval($args[1]),
                "y" => intval($args[2]),
                "angle" => intval($args[3]),
            ];
        }
    }

    //monsters simple patrol
    if (preg_match('/level.monstersSimplePatrol.new/', $line)) {
        $line = delGetTypes($line);

        if (preg_match('/level\.monstersSimplePatrol\.new\((.+?)\)(\.setId\((\d+)\))?/', $line, $match)) {
            $args = getArgs($match[1]);
            $id = isset($match[3]) ? intval($match[3]) : 0;
            if($id == 0) $nbMonstersWithId0++;

            $level->monsters[] = [
                "id" => $id,
                "monsterClassName" => "MonsterSimplePatrol",
                "monsterTypeLabel" => removeQuotes($args[0]),
                "x1" => intval($args[1]),
                "y1" => intval($args[2]),
                "x2" => intval($args[3]),
                "y2" => intval($args[4]),
            ];
        }
    }

    //monsters multiple patrols location
    if (preg_match('/MonsterMultiplePatrols.storeNewLoc\((.+?)\)/', $line, $match)) {
        $args = getArgs($match[1]);

        $nextMMPxArr[] = intval($args[0]);
        $nextMMPyArr[] = intval($args[1]);
    }

    //monsters multiple patrols
    if (preg_match('/level.monstersMultiplePatrols.new/', $line)) {
        $line = delGetTypes($line);

        if (preg_match('/level\.monstersMultiplePatrols\.new\((.+?)\)(\.setId\((\d+)\))?/', $line, $match)) {
            $args = getArgs($match[1]);
            $id = isset($match[3]) ? intval($match[3]) : 0;
            if($id == 0) $nbMonstersWithId0++;

            $level->monsters[] = [
                "id" => $id,
                "monsterClassName" => "MonsterMultiplePatrols",
                "monsterTypeLabel" => removeQuotes($args[0]),
                "mode" => removeQuotes($args[1]),
                "xArr" => $nextMMPxArr,
                "yArr" => $nextMMPyArr
            ];

            $nextMMPxArr = [];
            $nextMMPyArr = [];
        }
    }

    //monster spawns
    if (preg_match('/level.monsterSpawns.new/', $line)) {
        $line = delGetTypes($line);

        if (preg_match('/level\.monsterSpawns\.new\((.+?)\)/', $line, $match)) {
            $args = getArgs($match[1]);

            $level->monsterSpawns[] = [
                "label" => removeQuotes($args[0]),
                "monsterTypeLabel" => removeQuotes($args[1]),
                "sens" => removeQuotes($args[2]),
                "frequence" => floatval($args[3]),
                "minX" => intval($args[4]),
                "minY" => intval($args[5]),
                "maxX" => intval($args[6]),
                "maxY" => intval($args[7]),
            ];
        }
    }

    //meteors
    if (preg_match('/level\.meteors\.new\((.+?)\)/', $line, $match)) {
        $args = getArgs($match[1]);

        $level->meteors[] = [
            "x" => intval($args[0]),
            "y" => intval($args[1]),
        ];
    }

    //casters
    if (preg_match('/level\.casters\.new/', $line)) {
        $line = delGetTypes($line);

        if (preg_match('/level\.casters\.new\((.+?)\)(\.setId\((\d+)\))?/', $line, $match)) {
            $args = getArgs($match[1]);
            $id = isset($match[3]) ? intval($match[3]) : 0;
            if($id == 0) $nbMonstersWithId0++;

            $level->monsters[] = [
                "id" => $id,
                "monsterClassName" => "Caster",
                "casterTypeLabel" => removeQuotes($args[0]),
                "x" => intval($args[1]),
                "y" => intval($args[2]),
                "angle" => intval($args[3]),
            ];
        }
    }

}


//remove monster ids if they all got id 0
if($nbMonstersWithId0 > 1){
    foreach($gameData->levels as $level){
        foreach($level->monsters as $numMonster => $monster){
            unset($level->monsters[$numMonster]['id']);
        }
    }
}


//print_r($gameData);

file_put_contents($workingDir . "/output.js", "test = " . json_encode($gameData));


$output = json_encode($gameData);

file_put_contents($workingDir."/output.js", "test = ".$output);
file_put_contents($workingDir."/output.json", json_encode($output));


ob_start();
?>
function setGameData()
MEC_core.setGameData(<?= json_encode($output) ?>)
end

onGlobalInit(setGameData)

<?php
file_put_contents($workingDir."/Set_game_data.lua", ob_get_clean());