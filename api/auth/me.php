<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../config.php';
setCors();

session_start();

if (!isset($_SESSION['user_id'])) {
  http_response_code(401);
  echo json_encode(['error' => 'Not authorized']);
  exit;
}

try {
  $pdo = getDB();

  $stmt = $pdo->prepare("SELECT user_id, username, profile_picture FROM users WHERE user_id = ?");
  $stmt->execute([$_SESSION['user_id']]);
  $userData = $stmt->fetch(PDO::FETCH_ASSOC);

  if (!$userData) {
    http_response_code(401);
    echo json_encode(['error' => 'User not found']);
    exit;
  }

  echo json_encode([
    'success'         => true,
    'user_id'         => (int)$userData['user_id'],
    'username'        => $userData['username'],
    'profile_picture' => $userData['profile_picture'],
  ]);

} catch (PDOException $e) {
  http_response_code(500);
  echo json_encode(['error' => $e->getMessage()]);
}
