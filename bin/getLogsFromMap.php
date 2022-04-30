<?php
/**
 * Cr�� avec PhpStorm.
 * Auteur: Max
 * Date: 26/03/2022
 * Heure: 00:57
 */



const DATA_FILE = "C:\SaveSurDrive\OneDrive\Documents\Warcraft III\CustomMapData\MEC\MEC_log.txt";
const OUT_FILE = __DIR__."/MEC_outLog.txt";
const GAME_DATA_OUT_FILE = __DIR__."/mec_game_data.txt";


if(!is_file(DATA_FILE)){
    die("File \"MEC_outLog.txt\" missing");
}


$content = file_get_contents(DATA_FILE);


preg_match_all('/call BlzSendSyncData\(".*?",".{16}(.+?)"/', $content, $matches, PREG_SET_ORDER);

$base64 = "";
foreach($matches as $match) {
    $base64 .= $match[1];
}

$uncodedContent = base64_decode($base64);


file_put_contents(OUT_FILE, $uncodedContent);

