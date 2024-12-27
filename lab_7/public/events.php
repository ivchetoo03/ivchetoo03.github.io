<?php
// Встановлення заголовків на початку
header('Content-Type: application/json');
header('Cache-Control: no-cache, no-store, must-revalidate');
header('Pragma: no-cache');
header('Expires: 0');

ini_set('display_errors', 0);
error_reporting(E_ALL);

$eventsFile = 'events.json';

if (php_sapi_name() == 'cli') {
    global $argv;
    $method = $argv[1] ?? 'GET';
    $inputData = isset($argv[2]) ? json_decode($argv[2], true) : [];
} else {
    $method = $_SERVER['REQUEST_METHOD'];
    $inputData = json_decode(file_get_contents('php://input'), true) ?? [];
}

if ($method === 'DELETE') {
    file_put_contents($eventsFile, json_encode([]));
    ob_clean();
    echo json_encode(['status' => 'success', 'message' => 'Events cleared']);
    exit;
}

if ($method === 'POST') {
    $events = file_exists($eventsFile) ? json_decode(file_get_contents($eventsFile), true) : [];
    $events[] = $inputData;
    file_put_contents($eventsFile, json_encode($events, JSON_PRETTY_PRINT));
    echo json_encode(['status' => 'success']);
    exit;
}