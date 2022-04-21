<?php
/**
 * Créé avec PhpStorm.
 * Auteur: Max
 * Date: 20/04/2022
 * Heure: 22:21
 */


$content = file_get_contents(__DIR__."/scriptMumu.j");


$levels = [];

for($levelNum = 0; $levelNum <= 7; $levelNum++){
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



$output = json_encode($levels);

file_put_contents(__DIR__."/output.js", "test = ".$output);
file_put_contents(__DIR__."/output.json", json_encode($output));


//gg_rct_departLvl_0
//gg_rct_finLvl_0

//gg_rct_lvl0_murloc_01_a
//gg_rct_lvl0_murloc_01_b

//gg_rct_lvl0_vigneEpineuse_00

//gg_rct_lvl6_gardeRoyalNaga_00

//gg_rct_lvl2_meteor_0

//gg_rct_visionLvl_0_a
//gg_rct_visionLvl_0_b

//gg_rct_lvl3_apparition_murloc_bas
//gg_rct_lvl3_apparition_murloc_haut
//gg_rct_lvl3_disparition_murloc_bas
//gg_rct_lvl3_disparition_murloc_haut

/**
 * Todomax still need to handle these
 *
    gg_rct_lvl7_random_murlocs_droite_0
    gg_rct_lvl7_random_murlocs_droite_1
    gg_rct_lvl7_random_murlocs_droite_2
    gg_rct_lvl7_random_murlocs_gauche_0
    gg_rct_lvl7_random_murlocs_gauche_1
    gg_rct_lvl7_random_murlocs_gauche_2
 */