<?php
header('Content-Type: application/json');
require_once __DIR__ . '/config.php';
setCors();

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(200);
  exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['error' => 'Method not allowed']);
  exit;
}

try {
  $pdo = getDB();

  $title       = trim($_POST['title'] ?? '');
  $description = trim($_POST['description'] ?? '');
  $board_id    = (int)($_POST['board_id'] ?? 1);
  $user_id     = (int)($_POST['user_id'] ?? 1);
  $link_url    = ($_POST['link_url'] ?? '') ?: null;
  $category    = $_POST['category'] ?? 'Other';

  if (!$title) {
    http_response_code(400);
    echo json_encode(['error' => 'Title is required']);
    exit;
  }

  // Создаём пин один раз
  $stmt = $pdo->prepare("
    INSERT INTO pins (board_id, user_id, title, description, image_url, link_url, category, created_at)
    VALUES (?, ?, ?, ?, '', ?, ?, NOW())
  ");
  $stmt->execute([$board_id, $user_id, $title, $description, $link_url, $category]);
  $pin_id = $pdo->lastInsertId();

  $first_image = '';
  $uploadDir   = __DIR__ . '/../assets/uploads/';
  if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
  }

  // Сохраняем файлы и пишем в таблицу images
  if (!empty($_FILES['media']['name'][0])) {
    $files   = $_FILES['media'];
    $imgStmt = $pdo->prepare("
      INSERT INTO images (pin_id, image_path, image_type, sort_order)
      VALUES (?, ?, 'upload', ?)
    ");

    foreach ($files['name'] as $i => $name) {
      if ($files['error'][$i] !== UPLOAD_ERR_OK) continue;

      $ext      = strtolower(pathinfo($name, PATHINFO_EXTENSION));
      $filename = 'img_' . uniqid() . '_' . bin2hex(random_bytes(8)) . '.' . $ext;
      $path     = $uploadDir . $filename;
      $webPath  = '/assets/uploads/' . $filename;

      move_uploaded_file($files['tmp_name'][$i], $path);
      $imgStmt->execute([$pin_id, $webPath, $i]);

      if ($i === 0) {
        $first_image = $webPath;
      }
    }
  }

  // Обновляем превью пина первым изображением
  if ($first_image) {
    $pdo->prepare("UPDATE pins SET image_url = ? WHERE pin_id = ?")
        ->execute([$first_image, $pin_id]);
  }

  echo json_encode(['success' => true, 'pin_id' => $pin_id]);

} catch (PDOException $e) {
  http_response_code(500);
  echo json_encode(['error' => $e->getMessage()]);
}
