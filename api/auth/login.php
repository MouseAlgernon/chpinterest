<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../config.php';
setCors();

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(200);
  exit;
}

session_start();

$data     = json_decode(file_get_contents('php://input'), true);
$username = trim($data['username'] ?? '');
$password = $data['password'] ?? '';

if (!$username || !$password) {
  http_response_code(400);
  echo json_encode(['error' => 'Заполни все поля']);
  exit;
}

try {
  $pdo = getDB();

  $stmt = $pdo->prepare("SELECT * FROM users WHERE username = ? LIMIT 1");
  $stmt->execute([$username]);
  $user = $stmt->fetch(PDO::FETCH_ASSOC);

  if (!$user || !password_verify($password, $user['password'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Неверный логин или пароль']);
    exit;
  }

  $_SESSION['user_id']  = $user['user_id'];
  $_SESSION['username'] = $user['username'];

  echo json_encode([
    'success'         => true,
    'user_id'         => $user['user_id'],
    'username'        => $user['username'],
    'profile_picture' => $user['profile_picture'],
  ]);

} catch (PDOException $e) {
  http_response_code(500);
  echo json_encode(['error' => $e->getMessage()]);
}
