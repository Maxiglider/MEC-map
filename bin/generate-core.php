<?php
/**
 * Créé avec PhpStorm.
 * Auteur: Max
 * Date: 20/03/2022
 * Heure: 09:17
 */



const CORE_DIR = __DIR__ . "/../core/";
const CORE_OUTPUT_PATH = __DIR__."/core.j";


function getJFilesRecursively($rootDir, $currentdir = ''){
	$jFiles = [];

	$files = scandir($rootDir.$currentdir);

	foreach($files as $file){
		if($file != '.' && $file != '..'){
			if(is_dir($rootDir.$currentdir.$file)){
				$jFiles = array_merge($jFiles, getJFilesRecursively($rootDir, $currentdir.$file.'/'));
			}elseif(preg_match('/\.j(\.php)?$/', $rootDir.$currentdir.$file)){
				$jFiles[] = $currentdir.$file;
			}
		}
	}

	return $jFiles;
}

$jFiles = getJFilesRecursively(CORE_DIR);


ob_start();

foreach($jFiles as $jFile){
	$jFileLibelle = preg_replace('/\.j(\.php)$/', '', $jFile);

	echo "//START FILE \"$jFileLibelle\"\n\n";
	include CORE_DIR.$jFile;
	echo "\n\n//END FILE \"$jFileLibelle\"\n\n\n\n";
}

file_put_contents(CORE_OUTPUT_PATH, ob_get_clean());