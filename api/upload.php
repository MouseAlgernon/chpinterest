<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['error' => 'Method not allowed']);
  exit;
}

$host = '127.0.0.1';
$db   = '!saygex';
$user = 'root';
$pass = '';

try {
  $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4", $user, $pass);
  $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$title       = $_POST['title'] ?? '';
$description = $_POST['description'] ?? '';
$board_id    = $_POST['board_id'] ?? 1;
$user_id     = $_POST['user_id'] ?? 1;
$link_url    = $_POST['link_url'] ?? null;
$category    = $_POST['category'] ?? 'Other'; 

  // вставляем пин
  $stmt = $pdo->prepare("
    INSERT INTO pins (board_id, user_id, title, description, image_url, link_url, created_at)
    VALUES (?, ?, ?, ?, '', ?, NOW())
  ");
  $stmt->execute([$board_id, $user_id, $title, $description, $link_url]);
  $pin_id = $pdo->lastInsertId();

  $first_image = '';
  $uploadDir = __DIR__ . '/../assets/uploads/';
  if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);

  // сохраняем файлы
  if (!empty($_FILES['media']['name'][0])) {
    $files = $_FILES['media'];
    foreach ($files['name'] as $i => $name) {
      if ($files['error'][$i] !== UPLOAD_ERR_OK) continue;

      $ext      = strtolower(pathinfo($name, PATHINFO_EXTENSION));
      $filename = 'img_' . uniqid() . '_' . bin2hex(random_bytes(8)) . '.' . $ext;
      $path     = $uploadDir . $filename;
      $webPath  = '/assets/uploads/' . $filename;

      move_uploaded_file($files['tmp_name'][$i], $path);

      $stmt = $pdo->prepare("
  INSERT INTO pins (board_id, user_id, title, description, image_url, link_url, category, created_at)
  VALUES (?, ?, ?, ?, '', ?, ?, NOW())
");
$stmt->execute([$board_id, $user_id, $title, $description, $link_url, $category]);

      if ($i === 0) $first_image = $webPath;
    }
  }

  // обновляем image_url первым фото
  if ($first_image) {
    $pdo->prepare("UPDATE pins SET image_url = ? WHERE pin_id = ?")
        ->execute([$first_image, $pin_id]);
  }

  echo json_encode(['success' => true, 'pin_id' => $pin_id]);

} catch (PDOException $e) {
  http_response_code(500);
  echo json_encode(['error' => $e->getMessage()]);
}