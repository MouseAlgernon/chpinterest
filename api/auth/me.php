<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Credentials: true');

session_start();

if (isset($_SESSION['user_id'])) {
  // Fetch user data from database to get profile_picture
  $host = '127.0.0.1';
  $db   = '!saygex';
  $user = 'root';
  $pass = '';

  try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $stmt = $pdo->prepare("SELECT user_id, username, profile_picture FROM users WHERE user_id = ?");
    $stmt->execute([$_SESSION['user_id']]);
    $userData = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($userData) {
      echo json_encode([
        'success'         => true,
        'user_id'         => (int)$userData['user_id'],
        'username'        => $userData['username'],
        'profile_picture' => $userData['profile_picture'],
      ]);
    } else {
      http_response_code(401);
      echo json_encode(['error' => 'User not found']);
    }
  } catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
  }
} else {
  http_response_code(401);
  echo json_encode(['error' => 'Not authorized']);
}