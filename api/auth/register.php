<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../config.php';
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

session_start();

// FormData (multipart) — because of avatar upload
$username = trim($_POST['username'] ?? '');
$email    = trim($_POST['email']    ?? '');
$password = $_POST['password']      ?? '';
$bio      = trim($_POST['bio']      ?? '') ?: null;

// ── Validation ───────────────────────────────────────────────────────────────
if (!$username || !$email || !$password) {
    http_response_code(400);
    echo json_encode(['error' => 'Fill in all required fields']);
    exit;
}

if (strlen($username) < 3) {
    http_response_code(400);
    echo json_encode(['error' => 'Username must be at least 3 characters']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid email address']);
    exit;
}

if (strlen($password) < 6) {
    http_response_code(400);
    echo json_encode(['error' => 'Password must be at least 6 characters']);
    exit;
}

try {
    $pdo = getDB();

    // ── Uniqueness check ─────────────────────────────────────────────────────
    $check = $pdo->prepare(
        "SELECT user_id, username, email FROM users WHERE username = ? OR email = ? LIMIT 1"
    );
    $check->execute([$username, $email]);
    $existing = $check->fetch(PDO::FETCH_ASSOC);
    if ($existing) {
        http_response_code(409);
        $msg = $existing['username'] === $username
            ? 'Username already taken'
            : 'Email already registered';
        echo json_encode(['error' => $msg]);
        exit;
    }

    // ── Avatar upload (optional) ─────────────────────────────────────────────
    $profilePicture = null;
    if (!empty($_FILES['avatar']['name']) && $_FILES['avatar']['error'] === UPLOAD_ERR_OK) {
        $file    = $_FILES['avatar'];
        $allowed = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
        $ext     = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));

        if (!in_array($ext, $allowed)) {
            http_response_code(400);
            echo json_encode(['error' => 'Avatar must be an image (jpg, png, gif, webp)']);
            exit;
        }

        $uploadDir = __DIR__ . '/../../assets/uploads/avatars/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }

        $filename = 'avatar_' . uniqid() . '_' . bin2hex(random_bytes(8)) . '.' . $ext;
        move_uploaded_file($file['tmp_name'], $uploadDir . $filename);
        $profilePicture = '/assets/uploads/avatars/' . $filename;
    }

    // ── Insert user ──────────────────────────────────────────────────────────
    $hash = password_hash($password, PASSWORD_BCRYPT);
    $stmt = $pdo->prepare("
        INSERT INTO users (username, email, password, profile_picture, bio)
        VALUES (?, ?, ?, ?, ?)
    ");
    $stmt->execute([$username, $email, $hash, $profilePicture, $bio]);
    $newId = (int)$pdo->lastInsertId();

    $_SESSION['user_id']  = $newId;
    $_SESSION['username'] = $username;

    echo json_encode([
        'success'         => true,
        'user_id'         => $newId,
        'username'        => $username,
        'profile_picture' => $profilePicture,
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
