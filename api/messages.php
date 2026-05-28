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

  // Read conversation list or one message thread.
  if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $action  = $_GET['action']   ?? null;
    $user_id = $_GET['user_id']  ?? null;

    if (!$action || !$user_id) {
      http_response_code(400);
      echo json_encode(['error' => 'Missing required parameters']);
      exit;
    }

    // Build one latest row per partner.
    if ($action === 'conversations') {
      $stmt = $pdo->prepare("
        SELECT
          m.message_id,
          m.sender_id,
          m.receiver_id,
          m.content,
          m.created_at,
          u.user_id   AS partner_id,
          u.username  AS partner_username,
          u.profile_picture AS partner_picture
        FROM messages m
        JOIN users u ON u.user_id = CASE
          WHEN m.sender_id   = ? THEN m.receiver_id
          WHEN m.receiver_id = ? THEN m.sender_id
        END
        WHERE m.sender_id = ? OR m.receiver_id = ?
        ORDER BY m.created_at DESC
      ");
      $stmt->execute([$user_id, $user_id, $user_id, $user_id]);
      $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

      // Rows are already sorted, so keep the first partner hit.
      $seen          = [];
      $conversations = [];
      foreach ($rows as $row) {
        $pid = (int)$row['partner_id'];
        if (isset($seen[$pid])) continue;
        $seen[$pid] = true;
        $conversations[] = [
          'partner_id'      => $pid,
          'partner_username'=> $row['partner_username'],
          'partner_picture' => $row['partner_picture'],
          'last_message'    => $row['content'],
          'last_at'         => $row['created_at'],
          'sender_id'       => (int)$row['sender_id'],
        ];
      }

      echo json_encode($conversations);
      exit;
    }

    // Return the full thread between two users.
    if ($action === 'messages') {
      $other_id = $_GET['other_id'] ?? null;
      if (!$other_id) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing other_id']);
        exit;
      }

      $stmt = $pdo->prepare("
        SELECT
          m.message_id,
          m.sender_id,
          m.receiver_id,
          m.content,
          m.created_at,
          u.username,
          u.profile_picture
        FROM messages m
        JOIN users u ON u.user_id = m.sender_id
        WHERE (m.sender_id = ? AND m.receiver_id = ?)
           OR (m.sender_id = ? AND m.receiver_id = ?)
        ORDER BY m.created_at ASC
      ");
      $stmt->execute([$user_id, $other_id, $other_id, $user_id]);
      $messages = $stmt->fetchAll(PDO::FETCH_ASSOC);

      foreach ($messages as &$msg) {
        $msg['message_id'] = (int)$msg['message_id'];
        $msg['sender_id']  = (int)$msg['sender_id'];
        $msg['receiver_id']= (int)$msg['receiver_id'];
      }

      echo json_encode($messages);
      exit;
    }

    http_response_code(400);
    echo json_encode(['error' => 'Unknown action']);
    exit;
  }

  // Insert a message and return the created row.
  if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data        = json_decode(file_get_contents('php://input'), true);
    $sender_id   = $data['sender_id']   ?? null;
    $receiver_id = $data['receiver_id'] ?? null;
    $content     = $data['content']     ?? null;

    if (!$sender_id || !$receiver_id || !isset($content) || $content === '') {
      http_response_code(400);
      echo json_encode(['error' => 'Missing required fields']);
      exit;
    }

    $pdo->prepare("
      INSERT INTO messages (sender_id, receiver_id, content, created_at)
      VALUES (?, ?, ?, NOW())
    ")->execute([$sender_id, $receiver_id, $content]);

    $newId = $pdo->lastInsertId();

    $stmt = $pdo->prepare("
      SELECT
        m.message_id,
        m.sender_id,
        m.receiver_id,
        m.content,
        m.created_at,
        u.username,
        u.profile_picture
      FROM messages m
      JOIN users u ON u.user_id = m.sender_id
      WHERE m.message_id = ?
    ");
    $stmt->execute([$newId]);
    $message = $stmt->fetch(PDO::FETCH_ASSOC);

    $message['message_id']  = (int)$message['message_id'];
    $message['sender_id']   = (int)$message['sender_id'];
    $message['receiver_id'] = (int)$message['receiver_id'];

    echo json_encode($message);
    exit;
  }

  http_response_code(405);
  echo json_encode(['error' => 'Method not allowed']);

} catch (PDOException $e) {
  http_response_code(500);
  echo json_encode(['error' => $e->getMessage()]);
}
