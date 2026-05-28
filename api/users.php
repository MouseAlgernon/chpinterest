<?php
header('Content-Type: application/json');
require_once __DIR__ . '/config.php';
setCors();

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(200);
  exit;
}

try {
  $pdo    = getDB();
  $action = $_GET['action'] ?? null;

  if (!$action) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing action parameter']);
    exit;
  }

  // Search users by username for mentions and friend lookup.
  if ($action === 'search') {
    $q          = $_GET['q']          ?? '';
    $exclude_id = $_GET['exclude_id'] ?? null;

    if ($exclude_id !== null) {
      $stmt = $pdo->prepare("
        SELECT user_id, username, profile_picture
        FROM users
        WHERE username LIKE ?
          AND user_id != ?
        LIMIT 20
      ");
      $stmt->execute(['%' . $q . '%', $exclude_id]);
    } else {
      $stmt = $pdo->prepare("
        SELECT user_id, username, profile_picture
        FROM users
        WHERE username LIKE ?
        LIMIT 20
      ");
      $stmt->execute(['%' . $q . '%']);
    }

    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    exit;
  }

  // Build one profile payload with stats and pins.
  if ($action === 'profile') {
    $user_id = $_GET['user_id'] ?? null;

    if (!$user_id) {
      http_response_code(400);
      echo json_encode(['error' => 'Missing user_id']);
      exit;
    }

    // Load the basic user fields first.
    $stmtUser = $pdo->prepare("
      SELECT user_id, username, profile_picture
      FROM users
      WHERE user_id = ?
    ");
    $stmtUser->execute([$user_id]);
    $user = $stmtUser->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
      http_response_code(404);
      echo json_encode(['error' => 'User not found']);
      exit;
    }

    // Merge stored settings with defaults.
    $settStmt = $pdo->prepare(
        "SELECT setting_name, setting_value FROM usersettings WHERE user_id = ?"
    );
    $settStmt->execute([$user_id]);
    $settRows = $settStmt->fetchAll(PDO::FETCH_ASSOC);

    $defaults = [
        'friend_requests_from' => 'everyone',
        'messages_from'        => 'everyone',
        'follow_mode'          => 'open',
        'profile_visibility'   => 'public',
    ];
    $settings = $defaults;
    foreach ($settRows as $row) {
        $settings[$row['setting_name']] = $row['setting_value'];
    }
    $user['settings'] = $settings;

    // Keep stats separate for simple SQL and clear types.
    $stmtPinsCount = $pdo->prepare("SELECT COUNT(*) FROM pins WHERE user_id = ?");
    $stmtPinsCount->execute([$user_id]);
    $user['pins_count'] = (int)$stmtPinsCount->fetchColumn();

    $stmtFriendsCount = $pdo->prepare("
      SELECT COUNT(*) FROM friends WHERE user_id = ? AND status = 'accepted'
    ");
    $stmtFriendsCount->execute([$user_id]);
    $user['friends_count'] = (int)$stmtFriendsCount->fetchColumn();

    $stmtFollowersCount = $pdo->prepare("
      SELECT COUNT(*) FROM followers WHERE user_id = ?
    ");
    $stmtFollowersCount->execute([$user_id]);
    $user['followers_count'] = (int)$stmtFollowersCount->fetchColumn();

    // Load pins first, then attach media in one extra query.
    $stmtPins = $pdo->prepare("
      SELECT p.*, COUNT(DISTINCT l.like_id) AS likes_count
      FROM pins p
      LEFT JOIN likes l ON p.pin_id = l.pin_id
      WHERE p.user_id = ?
      GROUP BY p.pin_id
      ORDER BY p.created_at DESC
    ");
    $stmtPins->execute([$user_id]);
    $pins = $stmtPins->fetchAll(PDO::FETCH_ASSOC);

    if (!empty($pins)) {
      // Build one IN query for all pin ids.
      $pinIds      = array_column($pins, 'pin_id');
      $placeholders = implode(',', array_fill(0, count($pinIds), '?'));

      $stmtImages = $pdo->prepare("
        SELECT image_id, pin_id, image_path, image_type, sort_order
        FROM images
        WHERE pin_id IN ($placeholders)
        ORDER BY pin_id, sort_order ASC
      ");
      $stmtImages->execute($pinIds);
      $allImages = $stmtImages->fetchAll(PDO::FETCH_ASSOC);

      // Group media rows before attaching them back to pins.
      $imagesByPin = [];
      foreach ($allImages as $img) {
        $imagesByPin[(int)$img['pin_id']][] = $img;
      }

      foreach ($pins as &$pin) {
        $pin['likes_count'] = (int)$pin['likes_count'];
        $pin['images']      = $imagesByPin[(int)$pin['pin_id']] ?? [];
      }
      unset($pin);
    }

    $user['pins'] = $pins;

    echo json_encode($user);
    exit;
  }

  http_response_code(400);
  echo json_encode(['error' => 'Unknown action']);

} catch (PDOException $e) {
  http_response_code(500);
  echo json_encode(['error' => $e->getMessage()]);
}
