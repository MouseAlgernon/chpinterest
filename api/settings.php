<?php
header('Content-Type: application/json');
require_once __DIR__ . '/config.php';
setCors();

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$validSettings = [
    'friend_requests_from' => ['everyone', 'nobody'],
    'messages_from'        => ['everyone', 'friends', 'nobody'],
    'follow_mode'          => ['open', 'approval'],
    'profile_visibility'   => ['public', 'friends'],
];

$defaults = [
    'friend_requests_from' => 'everyone',
    'messages_from'        => 'everyone',
    'follow_mode'          => 'open',
    'profile_visibility'   => 'public',
];

try {
    $pdo = getDB();

    // Return all settings merged with defaults.
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $userId = $_GET['user_id'] ?? null;

        if (!$userId) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing user_id']);
            exit;
        }

        $stmt = $pdo->prepare(
            "SELECT setting_name, setting_value FROM usersettings WHERE user_id = ?"
        );
        $stmt->execute([$userId]);
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $settings = $defaults;
        foreach ($rows as $row) {
            $settings[$row['setting_name']] = $row['setting_value'];
        }

        echo json_encode($settings);
        exit;
    }

    // Update or insert one setting row.
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $body = json_decode(file_get_contents('php://input'), true);

        $userId       = $body['user_id']       ?? null;
        $settingName  = $body['setting_name']  ?? null;
        $settingValue = $body['setting_value'] ?? null;

        if (!$userId || !$settingName || $settingValue === null) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing user_id, setting_name, or setting_value']);
            exit;
        }

        if (!array_key_exists($settingName, $validSettings)) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid setting_name: ' . $settingName]);
            exit;
        }

        if (!in_array($settingValue, $validSettings[$settingName], true)) {
            http_response_code(400);
            echo json_encode([
                'error'   => 'Invalid value for ' . $settingName,
                'allowed' => $validSettings[$settingName],
            ]);
            exit;
        }

        // Update first, then insert only when the row is missing.
        $stmtUpdate = $pdo->prepare(
            "UPDATE usersettings SET setting_value = ? WHERE user_id = ? AND setting_name = ?"
        );
        $stmtUpdate->execute([$settingValue, $userId, $settingName]);

        if ($stmtUpdate->rowCount() === 0) {
            $stmtInsert = $pdo->prepare(
                "INSERT INTO usersettings (user_id, setting_name, setting_value) VALUES (?, ?, ?)"
            );
            $stmtInsert->execute([$userId, $settingName, $settingValue]);
        }

        echo json_encode([
            'success'       => true,
            'setting_name'  => $settingName,
            'setting_value' => $settingValue,
        ]);
        exit;
    }

    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
