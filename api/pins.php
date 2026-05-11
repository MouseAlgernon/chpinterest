<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$host = '127.0.0.1';
$db   = '!saygex';
$user = 'root';
$pass = '';

try {
  $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4", $user, $pass);
  $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

  // получаем пины с юзером и количеством лайков
  $stmt = $pdo->query("
    SELECT 
      p.*,
      u.username,
      COUNT(DISTINCT l.like_id) as likes_count
    FROM pins p
    LEFT JOIN users u ON p.user_id = u.user_id
    LEFT JOIN likes l ON p.pin_id = l.pin_id
    GROUP BY p.pin_id
    ORDER BY p.created_at DESC
  ");
  $pins = $stmt->fetchAll(PDO::FETCH_ASSOC);

  // для каждого пина подгружаем images
  $imgStmt = $pdo->prepare("
    SELECT * FROM images 
    WHERE pin_id = ? 
    ORDER BY sort_order ASC
  ");

  foreach ($pins as &$pin) {
    $imgStmt->execute([$pin['pin_id']]);
    $pin['images'] = $imgStmt->fetchAll(PDO::FETCH_ASSOC);
    $pin['likes_count'] = (int)$pin['likes_count'];
  }

  echo json_encode($pins);

} catch (PDOException $e) {
  http_response_code(500);
  echo json_encode(['error' => $e->getMessage()]);
}