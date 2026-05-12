<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(200);
  exit;
}

$host = '127.0.0.1';
$db   = '!saygex';
$user = 'root';
$pass = '';

try {
  $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4", $user, $pass);
  $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

  $action = $_GET['action'] ?? null;
  $pin_id = $_GET['pin_id'] ?? null;
  $user_id = $_GET['user_id'] ?? null;

  if (!$action || !$pin_id || !$user_id) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required parameters']);
    exit;
  }

  // Like/Unlike pin
  if ($action === 'toggle-like') {
    $checkStmt = $pdo->prepare("SELECT like_id FROM likes WHERE pin_id = ? AND user_id = ?");
    $checkStmt->execute([$pin_id, $user_id]);
    $existing = $checkStmt->fetch();

    if ($existing) {
      $deleteStmt = $pdo->prepare("DELETE FROM likes WHERE like_id = ?");
      $deleteStmt->execute([$existing['like_id']]);
      echo json_encode(['liked' => false]);
    } else {
      $insertStmt = $pdo->prepare("INSERT INTO likes (pin_id, user_id, created_at) VALUES (?, ?, NOW())");
      $insertStmt->execute([$pin_id, $user_id]);
      echo json_encode(['liked' => true]);
    }
  }

  // Save/Unsave pin
  elseif ($action === 'toggle-save') {
    $checkStmt = $pdo->prepare("SELECT save_id FROM savedpins WHERE pin_id = ? AND user_id = ?");
    $checkStmt->execute([$pin_id, $user_id]);
    $existing = $checkStmt->fetch();

    if ($existing) {
      $deleteStmt = $pdo->prepare("DELETE FROM savedpins WHERE save_id = ?");
      $deleteStmt->execute([$existing['save_id']]);
      echo json_encode(['saved' => false]);
    } else {
      $insertStmt = $pdo->prepare("INSERT INTO savedpins (pin_id, user_id, saved_at) VALUES (?, ?, NOW())");
      $insertStmt->execute([$pin_id, $user_id]);
      echo json_encode(['saved' => true]);
    }
  }

  // Get likes count and user's like status
  elseif ($action === 'get-likes') {
    $countStmt = $pdo->prepare("SELECT COUNT(*) as count FROM likes WHERE pin_id = ?");
    $countStmt->execute([$pin_id]);
    $countResult = $countStmt->fetch();

    $userLikeStmt = $pdo->prepare("SELECT like_id FROM likes WHERE pin_id = ? AND user_id = ?");
    $userLikeStmt->execute([$pin_id, $user_id]);
    $userLike = $userLikeStmt->fetch();

    echo json_encode([
      'count' => (int)$countResult['count'],
      'liked' => !empty($userLike)
    ]);
  }

  // Check if pin is saved by user
  elseif ($action === 'get-save-status') {
    $stmt = $pdo->prepare("SELECT save_id FROM savedpins WHERE pin_id = ? AND user_id = ?");
    $stmt->execute([$pin_id, $user_id]);
    $result = $stmt->fetch();
    echo json_encode(['saved' => !empty($result)]);
  }

} catch (PDOException $e) {
  http_response_code(500);
  echo json_encode(['error' => $e->getMessage()]);
}
