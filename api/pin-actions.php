<?php
header('Content-Type: application/json');
require_once __DIR__ . '/config.php';
setCors();

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(200);
  exit;
}

try {
  $pdo = getDB();

  $action  = $_GET['action']  ?? null;
  $pin_id  = $_GET['pin_id']  ?? null;
  $user_id = $_GET['user_id'] ?? null;

  if (!$action || !$pin_id || !$user_id) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required parameters']);
    exit;
  }

  // Toggle a like row for this user and pin.
  if ($action === 'toggle-like') {
    $checkStmt = $pdo->prepare("SELECT like_id FROM likes WHERE pin_id = ? AND user_id = ?");
    $checkStmt->execute([$pin_id, $user_id]);
    $existing = $checkStmt->fetch();

    if ($existing) {
      $pdo->prepare("DELETE FROM likes WHERE like_id = ?")->execute([$existing['like_id']]);
      echo json_encode(['liked' => false]);
    } else {
      $pdo->prepare("INSERT INTO likes (pin_id, user_id, created_at) VALUES (?, ?, NOW())")
          ->execute([$pin_id, $user_id]);
      echo json_encode(['liked' => true]);
    }

  // Toggle a saved pin row for this user and pin.
  } elseif ($action === 'toggle-save') {
    $checkStmt = $pdo->prepare("SELECT save_id FROM savedpins WHERE pin_id = ? AND user_id = ?");
    $checkStmt->execute([$pin_id, $user_id]);
    $existing = $checkStmt->fetch();

    if ($existing) {
      $pdo->prepare("DELETE FROM savedpins WHERE save_id = ?")->execute([$existing['save_id']]);
      echo json_encode(['saved' => false]);
    } else {
      $pdo->prepare("INSERT INTO savedpins (pin_id, user_id, saved_at) VALUES (?, ?, NOW())")
          ->execute([$pin_id, $user_id]);
      echo json_encode(['saved' => true]);
    }

  // Return the like count and the current user state.
  } elseif ($action === 'get-likes') {
    $countStmt = $pdo->prepare("SELECT COUNT(*) as count FROM likes WHERE pin_id = ?");
    $countStmt->execute([$pin_id]);
    $countResult = $countStmt->fetch();

    $userLikeStmt = $pdo->prepare("SELECT like_id FROM likes WHERE pin_id = ? AND user_id = ?");
    $userLikeStmt->execute([$pin_id, $user_id]);
    $userLike = $userLikeStmt->fetch();

    echo json_encode([
      'count' => (int)$countResult['count'],
      'liked' => !empty($userLike),
    ]);

  // Return only the save state for this user.
  } elseif ($action === 'get-save-status') {
    $stmt = $pdo->prepare("SELECT save_id FROM savedpins WHERE pin_id = ? AND user_id = ?");
    $stmt->execute([$pin_id, $user_id]);
    echo json_encode(['saved' => !empty($stmt->fetch())]);
  }

} catch (PDOException $e) {
  http_response_code(500);
  echo json_encode(['error' => $e->getMessage()]);
}
