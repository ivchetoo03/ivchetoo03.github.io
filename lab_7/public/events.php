<?php
header("Content-Type: application/json");
$eventsFile = 'events.json';

$method = $_SERVER['REQUEST_METHOD'];
$inputData = json_decode(file_get_contents('php://input'), true) ?? [];

// Підтримка CLI для Node.js
if (php_sapi_name() == 'cli') {
    global $argv;
    $method = $argv[1] ?? 'GET';
    $inputData = isset($argv[2]) ? json_decode($argv[2], true) : [];
}

if ($method === 'POST') {
    $events = file_exists($eventsFile) ? json_decode(file_get_contents($eventsFile), true) : [];
    $events[] = $inputData;
    file_put_contents($eventsFile, json_encode($events, JSON_PRETTY_PRINT));
    echo json_encode(['status' => 'success']);
} elseif ($method === 'GET') {
    if (file_exists($eventsFile)) {
        echo file_get_contents($eventsFile);
    } else {
        echo json_encode([]);
    }
} elseif ($method === 'DELETE') {
    if (file_exists($eventsFile)) {
        file_put_contents($eventsFile, json_encode([]));
        echo json_encode(['status' => 'success', 'message' => 'JSON очищено']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Файл не знайдено']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Непідтримуваний метод']);
}
?>