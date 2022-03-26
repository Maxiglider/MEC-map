<?php
/**
 * Crיי avec PhpStorm.
 * Auteur: Max
 * Date: 26/03/2022
 * Heure: 00:57
 */



const DATA_FILE = __DIR__."/mec_data.txt";


if(!is_file(DATA_FILE)){
    die("File \"mec_data.txt\" missing");
}


$content = file_get_contents(DATA_FILE);



if(preg_match('/call BlzSendSyncData\(".*?","(.+?)"/', $content, $match)){
    $base64 = $match[1];
    $uncodedContent = base64_decode($base64);
    $finalString = preg_replace('/^.+?{/', '{', $uncodedContent);

    echo $finalString;
}else{
    echo "no content found";
}