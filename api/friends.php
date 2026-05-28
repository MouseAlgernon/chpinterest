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

  // Read friend lists or one relation status.
  if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $user_id    = $_GET['user_id']    ?? null;
    $check_with = $_GET['check_with'] ?? null;

    if (!$user_id) {
      http_response_code(400);
      echo json_encode(['error' => 'Missing user_id']);
      exit;
    }

    // Return the relation between two users.
    if ($check_with !== null) {
      $stmt = $pdo->prepare("
        SELECT status, user_id
        FROM friends
        WHERE (user_id = ? AND friend_user_id = ?)
           OR (user_id = ? AND friend_user_id = ?)
        LIMIT 1
      ");
      $stmt->execute([$user_id, $check_with, $check_with, $user_id]);
      $row = $stmt->fetch(PDO::FETCH_ASSOC);

      if (!$row) {
        echo json_encode(['status' => 'none', 'is_sender' => false]);
      } else {
        echo json_encode([
          'status'    => $row['status'],
          'is_sender' => (int)$row['user_id'] === (int)$user_id,
        ]);
      }
      exit;
    }

    // Return accepted, incoming, and sent lists for one user.
    $fields = "u.user_id, u.username, u.profile_picture, f.created_at";

    // Accepted friends from rows where this user is the owner side.
    $stmtFriends = $pdo->prepare("
      SELECT $fields
      FROM friends f
      JOIN users u ON u.user_id = f.friend_user_id
      WHERE f.user_id = ? AND f.status = 'accepted'
      ORDER BY f.created_at DESC
    ");
    $stmtFriends->execute([$user_id]);
    $friends = $stmtFriends->fetchAll(PDO::FETCH_ASSOC);

    // Incoming pending requests from other users.
    $stmtIncoming = $pdo->prepare("
      SELECT $fields
      FROM friends f
      JOIN users u ON u.user_id = f.user_id
      WHERE f.friend_user_id = ? AND f.status = 'pending'
      ORDER BY f.created_at DESC
    ");
    $stmtIncoming->execute([$user_id]);
    $incoming = $stmtIncoming->fetchAll(PDO::FETCH_ASSOC);

    // Outgoing pending requests sent by this user.
    $stmtSent = $pdo->prepare("
      SELECT $fields
      FROM friends f
      JOIN users u ON u.user_id = f.friend_user_id
      WHERE f.user_id = ? AND f.status = 'pending'
      ORDER BY f.created_at DESC
    ");
    $stmtSent->execute([$user_id]);
    $sent = $stmtSent->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
      'friends'  => $friends,
      'incoming' => $incoming,
      'sent'     => $sent,
    ]);
    exit;
  }

  // Apply one friend action.
  if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data      = json_decode(file_get_contents('php://input'), true);
    $action    = $data['action']    ?? null;
    $user_id   = $data['user_id']   ?? null;
    $friend_id = $data['friend_id'] ?? null;

    if (!$action || !$user_id || !$friend_id) {
      http_response_code(400);
      echo json_encode(['error' => 'Missing required fields']);
      exit;
    }

    switch ($action) {

      // Create a new pending request if no row exists yet.
      case 'send':
        $check = $pdo->prepare("
          SELECT friend_id FROM friends
          WHERE (user_id = ? AND friend_user_id = ?)
             OR (user_id = ? AND friend_user_id = ?)
        ");
        $check->execute([$user_id, $friend_id, $friend_id, $user_id]);
        if ($check->fetch()) {
          http_response_code(409);
          echo json_encode(['error' => 'Request already exists']);
          exit;
        }
        $pdo->prepare("
          INSERT INTO friends (user_id, friend_user_id, status)
          VALUES (?, ?, 'pending')
        ")->execute([$user_id, $friend_id]);
        echo json_encode(['success' => true]);
        break;

      // Accept the incoming request and create the reverse row.
      case 'accept':
        // Mark the original sender row as accepted.
        $pdo->prepare("
          UPDATE friends
          SET status = 'accepted'
          WHERE user_id = ? AND friend_user_id = ? AND status = 'pending'
        ")->execute([$friend_id, $user_id]);

        // Ensure the reverse direction exists too.
        $pdo->prepare("
          INSERT INTO friends (user_id, friend_user_id, status)
          VALUES (?, ?, 'accepted')
          ON DUPLICATE KEY UPDATE status = 'accepted'
        ")->execute([$user_id, $friend_id]);

        echo json_encode(['success' => true]);
        break;

      // Reject by deleting the pending sender row.
      case 'reject':
        $pdo->prepare("
          DELETE FROM friends
          WHERE user_id = ? AND friend_user_id = ? AND status = 'pending'
        ")->execute([$friend_id, $user_id]);
        echo json_encode(['success' => true]);
        break;

      // Cancel an outgoing pending request.
      case 'cancel':
        $pdo->prepare("
          DELETE FROM friends
          WHERE user_id = ? AND friend_user_id = ? AND status = 'pending'
        ")->execute([$user_id, $friend_id]);
        echo json_encode(['success' => true]);
        break;

      // Remove both accepted rows at once.
      case 'remove':
        $pdo->prepare("
          DELETE FROM friends
          WHERE (user_id = ? AND friend_user_id = ?)
             OR (user_id = ? AND friend_user_id = ?)
        ")->execute([$user_id, $friend_id, $friend_id, $user_id]);
        echo json_encode(['success' => true]);
        break;

      default:
        http_response_code(400);
        echo json_encode(['error' => 'Unknown action']);
    }
    exit;
  }

  http_response_code(405);
  echo json_encode(['error' => 'Method not allowed']);

} catch (PDOException $e) {
  http_response_code(500);
  echo json_encode(['error' => $e->getMessage()]);
}
