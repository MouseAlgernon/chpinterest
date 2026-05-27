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

  $action = $_GET['action'] ?? null;
  $pin_id = $_GET['pin_id'] ?? null;

  if (!$action) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing action parameter']);
    exit;
  }

  // Получить комментарии к пину
  if ($action === 'get-comments' && $pin_id) {
    $stmt = $pdo->prepare("
      SELECT
        c.comment_id,
        c.pin_id,
        c.user_id,
        c.content,
        c.created_at,
        u.username,
        u.profile_picture,
        COUNT(DISTINCT cl.comment_like_id) as likes_count
      FROM comments c
      LEFT JOIN users u ON c.user_id = u.user_id
      LEFT JOIN comment_likes cl ON c.comment_id = cl.comment_id
      WHERE c.pin_id = ?
      GROUP BY c.comment_id
      ORDER BY c.created_at DESC
    ");
    $stmt->execute([$pin_id]);
    $comments = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($comments as &$comment) {
      $comment['likes_count'] = (int)$comment['likes_count'];
    }

    echo json_encode($comments);

  // Добавить комментарий
  } elseif ($action === 'add-comment') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (!isset($data['pin_id'], $data['user_id'], $data['content'])) {
      http_response_code(400);
      echo json_encode(['error' => 'Missing required fields']);
      exit;
    }

    $pdo->prepare("
      INSERT INTO comments (pin_id, user_id, content, created_at)
      VALUES (?, ?, ?, NOW())
    ")->execute([$data['pin_id'], $data['user_id'], $data['content']]);

    $commentId = $pdo->lastInsertId();

    $getStmt = $pdo->prepare("
      SELECT
        c.comment_id, c.pin_id, c.user_id, c.content, c.created_at,
        u.username, u.profile_picture,
        0 as likes_count
      FROM comments c
      LEFT JOIN users u ON c.user_id = u.user_id
      WHERE c.comment_id = ?
    ");
    $getStmt->execute([$commentId]);
    echo json_encode($getStmt->fetch(PDO::FETCH_ASSOC));

  // Лайк / анлайк комментария
  } elseif ($action === 'toggle-comment-like') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (!isset($data['comment_id'], $data['user_id'])) {
      http_response_code(400);
      echo json_encode(['error' => 'Missing required fields']);
      exit;
    }

    $checkStmt = $pdo->prepare("SELECT comment_like_id FROM comment_likes WHERE comment_id = ? AND user_id = ?");
    $checkStmt->execute([$data['comment_id'], $data['user_id']]);
    $existing = $checkStmt->fetch();

    if ($existing) {
      $pdo->prepare("DELETE FROM comment_likes WHERE comment_like_id = ?")->execute([$existing['comment_like_id']]);
      echo json_encode(['liked' => false]);
    } else {
      $pdo->prepare("INSERT INTO comment_likes (comment_id, user_id, created_at) VALUES (?, ?, NOW())")
          ->execute([$data['comment_id'], $data['user_id']]);
      echo json_encode(['liked' => true]);
    }

  // Кол-во лайков + статус
  } elseif ($action === 'get-comment-likes') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (!isset($data['comment_id'], $data['user_id'])) {
      http_response_code(400);
      echo json_encode(['error' => 'Missing required fields']);
      exit;
    }

    $countStmt = $pdo->prepare("SELECT COUNT(*) as count FROM comment_likes WHERE comment_id = ?");
    $countStmt->execute([$data['comment_id']]);
    $countResult = $countStmt->fetch();

    $userLikeStmt = $pdo->prepare("SELECT comment_like_id FROM comment_likes WHERE comment_id = ? AND user_id = ?");
    $userLikeStmt->execute([$data['comment_id'], $data['user_id']]);
    $userLike = $userLikeStmt->fetch();

    echo json_encode([
      'count' => (int)$countResult['count'],
      'liked' => !empty($userLike),
    ]);
  }

} catch (PDOException $e) {
  http_response_code(500);
  echo json_encode(['error' => $e->getMessage()]);
}
