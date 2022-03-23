<?php



const CORE_DIR = __DIR__ . "/../core/";


function renameFilesAndFolders($rootDir, $currentdir = ''){
    $files = scandir($rootDir.$currentdir);

    foreach($files as $file){
        if($file != '.' && $file != '..'){
            if(preg_match('/ /', $file)){
                $newFile = preg_replace('/ /', '_', $file);
                rename($rootDir.$currentdir.$file, $rootDir.$currentdir.$newFile);
                $file = $newFile;
            }
            if(str_contains($file, '_-_')){
                $newFile = str_replace('_-_', '_', $file);
                rename($rootDir.$currentdir.$file, $rootDir.$currentdir.$newFile);
                $file = $newFile;
            }

            if(is_dir($rootDir.$currentdir.$file)){
                renameFilesAndFolders($rootDir, $currentdir.$file.'/');
            }
        }
    }
}

renameFilesAndFolders(CORE_DIR);

