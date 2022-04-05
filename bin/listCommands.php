<?php
/**
 * Créé avec PhpStorm.
 * Auteur: Max
 * Date: 22/03/2022
 * Heure: 18:18
 */


const COMMANDS_DIR = __DIR__."/../core/06_COMMANDS/COMMANDS_vJass/";


$commandsRubrics = [
	"ALL" => "Command_all.j.php",
	"FIRST PLAYER" => "Command_first_player.j",
	"CHEATS" => "Command_cheat.j",
	"MAKE" => "Command_make.j",
	"ADMIN" => "Command_admin.j",
	"SUPERADMIN" => "Command_superadmin.j"
];

$output = "";

foreach($commandsRubrics as $rubric => $file){
	$output .= "<h2>$rubric</h2>\n\n";

	$fp = fopen(COMMANDS_DIR.$file, "r");
	if ($fp) {
		$commands = [];

		while (($line = fgets($fp, 4096)) !== false) {
			if(preg_match('#^//(-[a-zA-Z\d<\[\]_].+)#', $line, $match)){
				$commands[] = $match[1];
			}
		}

		sort($commands);
		foreach($commands as $command){
			$command = str_replace('<','[INF_CHAR]',  $command);
			$command = str_replace('>','[SUP_CHAR]',  $command);

			$command = htmlspecialchars($command);

			if(preg_match('/^-([a-zA-Z\d<>]+)(\((.+?)\))?(.+)/', $command, $match)){
				$command = '-<b>'.$match[1].'</b>(<b>'.$match[3].'</b>)'.$match[4];
			}

			$command = str_replace('[INF_CHAR]', '&lt;', $command);
			$command = str_replace('[SUP_CHAR]', '&gt;', $command);

			$output .= "<p>$command</p>\n";
		}

		if (!feof($fp)) {
			echo "Erreur: fgets() a échoué\n";
		}
		fclose($fp);

		$output .= "\n\n";
	}

}

file_put_contents(__DIR__."/commandsList.html", $output);