<?php
/**
 * Créé avec PhpStorm.
 * Auteur: Max
 * Date: 16/04/2022
 * Heure: 19:50
 */


const LUA_FILE = __DIR__."/../TS/dist/tstl_output_extended.lua";
const WRAP_OUTPUT_FILE = __DIR__."/final-we.lua";

$v = file_get_contents(__DIR__."/../TS/src/MEC_core_version");

$MEC_VERSION = "Max Escape Creation v.$v - ".date("Y-m-d H:i:s");

$MEC_VERSION_quest_title = "MEC core v.$v";

ob_start();
?>
-- <?= $MEC_VERSION ?>


function get_MEC_core()

    [LUA_FILE]

end





-- Global Initialization 1.2 adds an onGameStart function.

do
local PRINT_CAUGHT_ERRORS = true
local errors = {}
local errorCount = 0

local gFuncs = {}
local gFuncCount = 0
local tFuncs = {}
local tFuncCount = 0
local iFuncs = {}
local iFuncCount = 0
local sFuncs = {}
local sFuncCount = 0

function onGlobalInit(func) -- Runs once all variables are instantiated.
gFuncCount = gFuncCount + 1
gFuncs[gFuncCount] = func
end

function onTriggerInit(func) -- Runs once all InitTrig_ are called
tFuncCount = tFuncCount + 1
tFuncs[tFuncCount] = func
end

function onInitialization(func) -- Runs once all Map Initialization triggers are run
iFuncCount = iFuncCount + 1
iFuncs[iFuncCount] = func
end

function onGameStart(func) -- Runs once the game has actually started
sFuncCount = sFuncCount + 1
sFuncs[sFuncCount] = func
end

local function handleError(where, error)
if PRINT_CAUGHT_ERRORS then
errorCount = errorCount + 1
errors[errorCount] = "Global Initialization: caught error in " .. where .. ": " .. error
end
end

local function startPrintErrorTimer()
if not PRINT_CAUGHT_ERRORS or errorCount == 0 then return end

TimerStart(
CreateTimer(),
1.00,
false,
function()
DestroyTimer(GetExpiredTimer())

print("|cffff0000Global Initialization: " .. errorCount .. " errors occured during Initialization.|r")
for i = 1, errorCount do
print(errors[i])
end

errors = nil
end
)
end

local function startOnGameStartTimer()
if sFuncCount < 1 then return end

TimerStart(
CreateTimer(),
0.00,
false,
function()
DestroyTimer(GetExpiredTimer())

for i = 1, sFuncCount do
local result, error = pcall(sFuncs[i])
if not result then
handleError("onGameStart", error)
end
end

sFuncs = nil
end
)
end

local function runInitialization()
for i = 1, iFuncCount do
local result, error = pcall(iFuncs[i])
if not result then
handleError("runInitialization", error)
end
end
iFuncs = nil
end

local function runTriggerInit()
for i = 1, tFuncCount do
local result, error = pcall(tFuncs[i])
if not result then
handleError("runTriggerInit", error)
end
end
tFuncs = nil

local old = RunInitializationTriggers
if old then
function RunInitializationTriggers()
old()
runInitialization()
end
else
runInitialization()
end
end

local function runGlobalInit()
for i = 1, gFuncCount do
local result, error = pcall(gFuncs[i])
if not result then
handleError("runGlobalInit", error)
end
end
gFuncs = nil

local old = InitCustomTriggers
if old then
function InitCustomTriggers()
old()
runTriggerInit()
end
else
runTriggerInit()
end
end

local oldBliz = InitBlizzard
function InitBlizzard()
oldBliz()

local old = InitGlobals
if old then
function InitGlobals()
old()
runGlobalInit()
end
else
runGlobalInit()
end

-- Start timer to call onGameStart functions
startOnGameStartTimer()

-- Start timer to print caught errors
startPrintErrorTimer()
end
end


MEC_core = nil

function initMEC_core()
    MEC_core = get_MEC_core()().MEC_core

    -- "quest" to tell the MEC core version
    local function QuestVersion_Actions()
        local q = CreateQuest()
        QuestSetIconPath(q, "ReplaceableTextures\\CommandButtonsDisabled\\DISBTNEvilIllidan.blp")
        QuestSetTitle(q, "<?= $MEC_VERSION_quest_title ?>")
        QuestSetDescription(q, "<?= addslashes($MEC_VERSION) ?>\ncreated by Maximaxou, joined by Stan since 2022\nhttps://mec.maxslid.com")
        QuestSetDiscovered(q, true)
        QuestSetRequired(q, false)
    end

    local trg = CreateTrigger()
    TriggerRegisterTimerEvent(trg, 0.01, false)
    TriggerAddAction(trg, QuestVersion_Actions)
end

onGlobalInit(initMEC_core)

<?php
$template = ob_get_clean();

$luaFileContent = str_replace('%', '%%', file_get_contents(LUA_FILE));
$content = str_replace('[LUA_FILE]', $luaFileContent, $template);
$content = str_replace('return require("TS.src.main", ...)', 'return ____modules["TS.src.main"]', $content);
$content = str_replace("addScriptHook(
    W3TS_HOOK.MAIN_AFTER,
    errorHandler(tsMain)
)", "errorHandler(tsMain)()", $content);

file_put_contents(WRAP_OUTPUT_FILE, $content);