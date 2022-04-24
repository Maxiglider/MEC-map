<?php
/**
 * Créé avec PhpStorm.
 * Auteur: Max
 * Date: 20/04/2022
 * Heure: 22:21
 */


$content = file_get_contents(__DIR__."/scriptMumu.j");


$levels = [];

for($levelNum = 0; $levelNum <= 8; $levelNum++){ //the 8 is the hidden
    //init
    $level = (object) [
        "id" => $levelNum,
        "start" => "",
        "end" => "",
        "visibilities" => [],
        "meteors" => [],
        "monsters" => [],
        "monsterSpawns" => [],
    ];

    //lives
    if($levelNum == 0){
        $level->nbLives = 5;
    }else{
        $level->nbLives = floor($levelNum / 3) + 1;
    }

    $levels[] = $level;
}


preg_match_all("/set gg_rct_(.+?)=Rect\((.+?)\)/", $content, $matches, PREG_SET_ORDER);

$rects = [];

foreach($matches as $match){
    $name = $match[1];

    $dataCoords = str_replace(' ', '', $match[2]);
    $coords = explode(',', $dataCoords);

    $rects[$name] = (object) [
        "minX" => intval($coords[0]),
        "minY" => intval($coords[1]),
        "maxX" => intval($coords[2]),
        "maxY" => intval($coords[3])
    ];

    $rects[$name]->centerX = ($rects[$name]->minX + $rects[$name]->maxX) / 2;
    $rects[$name]->centerY = ($rects[$name]->minY + $rects[$name]->maxY) / 2;
}

foreach($rects as $name => $coords){
    //start
    if(preg_match('/departLvl_(\d+)/', $name, $match)){
        $levelNum = $match[1];
        $levels[$levelNum]->start = $coords;
    }

    //end
    if(preg_match('/finLvl_(\d+)/', $name, $match)){
        $levelNum = $match[1];
        $levels[$levelNum]->end = $coords;
    }

    //visibilities
    if(preg_match('/visionLvl_(\d+)_a/', $name, $match)){
        $levelNum = $match[1];
        $secondName = 'visionLvl_'.$levelNum.'_b';
        if(isset($rects[$secondName])){
            $levels[$levelNum]->visibilities[] = [
                "x1" => $coords->centerX,
                "y1" => $coords->centerY,
                "x2" => $rects[$secondName]->centerX,
                "y2" => $rects[$secondName]->centerY,
            ];
        }
    }

    //meteors
    if(preg_match('/lvl(\d+)_meteor/', $name, $match)){
        $levelNum = $match[1];
        $levels[$levelNum]->meteors[] = [
            "x" => $coords->centerX,
            "y" => $coords->centerY
        ];
    }

    //murlocs
    if(preg_match('/lvl(\d+)_murloc_(\d+)_a/', $name, $match)){
        $levelNum = $match[1];
        $secondName = 'lvl'.$levelNum.'_murloc_'.$match[2].'_b';
        if(isset($rects[$secondName])){
            $levels[$levelNum]->monsters[] = [
                "monsterClassName" => "MonsterSimplePatrol",
                "monsterTypeLabel" => "murloc",
                "x1" => $coords->centerX,
                "y1" => $coords->centerY,
                "x2" => $rects[$secondName]->centerX,
                "y2" => $rects[$secondName]->centerY,
            ];
        }
    }

    //bushes
    if(preg_match('/lvl(\d+)_vigneEpineuse/', $name, $match)){
        $levelNum = $match[1];
        $levels[$levelNum]->monsters[] = [
            "monsterClassName" => "MonsterNoMove",
            "monsterTypeLabel" => "bush",
            "x" => $coords->centerX,
            "y" => $coords->centerY,
            "angle" => -1
        ];
    }

    //nagas
    if(preg_match('/lvl(\d+)_gardeRoyalNaga/', $name, $match)){
        $levelNum = $match[1];
        $levels[$levelNum]->monsters[] = [
            "monsterClassName" => "MonsterNoMove",
            "monsterTypeLabel" => "naga",
            "x" => $coords->centerX,
            "y" => $coords->centerY,
            "angle" => -1
        ];
    }
}


//spawns level 3
$levels[3]->monsterSpawns[] = [
    "label" => "murlocs_utd",
    "monsterTypeLabel" => "murloc",
    "sens" => "upToDown",
    "frequence" => 3.33,
    "minX" => $rects['lvl3_disparition_murloc_bas']->minX,
    "minY" => $rects['lvl3_disparition_murloc_bas']->centerY,
    "maxX" => $rects['lvl3_apparition_murloc_haut']->maxX,
    "maxY" => $rects['lvl3_apparition_murloc_haut']->centerY,
];

$levels[3]->monsterSpawns[] = [
    "label" => "murlocs_dtu",
    "monsterTypeLabel" => "murloc",
    "sens" => "downToUp",
    "frequence" => 3.33,
    "minX" => $rects['lvl3_apparition_murloc_bas']->minX,
    "minY" => $rects['lvl3_apparition_murloc_bas']->centerY,
    "maxX" => $rects['lvl3_disparition_murloc_haut']->maxX,
    "maxY" => $rects['lvl3_disparition_murloc_haut']->centerY,
];


//hidden
$levelNum = 8;
$hiddenContent = file_get_contents(__DIR__."/hidden.j");
$lines = preg_split('/[\r\n]+/', $hiddenContent);

foreach($lines as $line){

    //lives
    $levels[$levelNum]->nbLives = 20;

    //murlocs
    if(preg_match('/GetRandomMurloc\(\), (.+?), (.+?), (.+?), (.+?),/', $line, $match)){
        $levels[$levelNum]->monsters[] = [
            "monsterClassName" => "MonsterSimplePatrol",
            "monsterTypeLabel" => "murloc",
            "x1" => intval($match[1]),
            "y1" => intval($match[2]),
            "x2" => intval($match[3]),
            "y2" => intval($match[4]),
        ];
    }

    //bushes
    if(preg_match('/GetRandomVigne\(\), (.+?), (.+?)\)/', $line, $match)){
        $levels[$levelNum]->monsters[] = [
            "monsterClassName" => "MonsterNoMove",
            "monsterTypeLabel" => "bush",
            "x" => intval($match[1]),
            "y" => intval($match[2]),
            "angle" => -1
        ];
    }

    //start
    if(preg_match('/hiddenLevelStartRect = Rect\((.+?), (.+?), (.+?), (.+?)\)/', $line, $match)){
        $levels[$levelNum]->start = [
            "minX" => intval($match[1]),
            "minY" => intval($match[2]),
            "maxX" => intval($match[3]),
            "maxY" => intval($match[4])
        ];
    }

    //end
    if(preg_match('/hiddenLevelEndRect = Rect\((.+?), (.+?), (.+?), (.+?)\)/', $line, $match)){
        $levels[$levelNum]->end = [
            "minX" => intval($match[1]),
            "minY" => intval($match[2]),
            "maxX" => intval($match[3]),
            "maxY" => intval($match[4])
        ];
    }
}



$output = json_encode($levels);

file_put_contents(__DIR__."/output.js", "test = ".$output);
file_put_contents(__DIR__."/output.json", json_encode($output));

$contentLevelJson = substr(json_encode($output), 1, strlen(json_encode($output)) - 2);

//set game data lua
ob_start();
?>
function setGameData()
MEC_core.setGameData("{\"levels\":<?= $contentLevelJson ?>,\"casterTypes\":[],\"monsterTypes\":[{\"unitTypeId\":\"h006\",\"label\":\"bush\",\"isClickable\":false,\"height\":-1,\"alias\":\"b\",\"immolationRadius\":80,\"scale\":-1,\"speed\":400,\"nbMeteorsToKill\":1},{\"unitTypeId\":\"n100\",\"label\":\"naga\",\"isClickable\":true,\"height\":-1,\"alias\":\"n\",\"immolationRadius\":200,\"scale\":-1,\"speed\":400,\"nbMeteorsToKill\":1},{\"unitTypeId\":\"h000\",\"label\":\"murloc\",\"isClickable\":false,\"height\":-1,\"alias\":\"m\",\"immolationRadius\":65,\"scale\":-1,\"speed\":400,\"nbMeteorsToKill\":1}],\"terrainTypesMec\":[{\"terrainTypeId\":\"Avin\",\"label\":\"death\",\"orderId\":0,\"kind\":\"death\",\"killingEffet\":\"Abilities\\\\Spells\\\\NightElf\\\\EntanglingRoots\\\\EntanglingRootsTarget.mdl\",\"alias\":\"d\",\"toleranceDist\":0,\"timeToKill\":2,\"cliffClassId\":1},{\"alias\":\"w2\",\"cliffClassId\":1,\"terrainTypeId\":\"Ngrs\",\"label\":\"walk2\",\"orderId\":0,\"walkSpeed\":522,\"kind\":\"walk\"},{\"canTurn\":true,\"alias\":\"s\",\"cliffClassId\":1,\"slideSpeed\":550,\"label\":\"slide\",\"orderId\":0,\"terrainTypeId\":\"Nsnw\",\"kind\":\"slide\"},{\"alias\":\"w\",\"cliffClassId\":1,\"terrainTypeId\":\"Yblm\",\"label\":\"walk\",\"orderId\":0,\"walkSpeed\":522,\"kind\":\"walk\"}]}")
end

onGlobalInit(setGameData)

<?php
file_put_contents(__DIR__."/Set_game_data.lua", ob_get_clean());