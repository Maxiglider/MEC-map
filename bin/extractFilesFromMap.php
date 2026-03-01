<?php
if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
    $mpqtool = __DIR__ . "/windows/mpqtool.exe";
} else {
    $mpqtool = __DIR__ . "/linux/mpqcli";
}

if (!is_file($mpqtool)) {
    die("MPQ tool missing");
}

if ($argc < 2) {
    die("Usage: php extractFilesFromMap.php <map_path>");
}

$mapPath = $argv[1];

if (!is_file($mapPath)) {
    die("Map file not found");
}

if(!is_dir(__DIR__ . "/extractedMaps")) {
    mkdir(__DIR__ . "/extractedMaps");
}

$mapFolderName = date("Y-m-d_H-i-s", time()) . "_" . uniqid();

$tempFolder = __DIR__ . "/extractedMaps/" . $mapFolderName;

echo shell_exec("\"$mpqtool\" extract \"$mapPath\" -o \"$tempFolder\" 2>&1");

echo "\nFiles extracted to: $tempFolder\n";
