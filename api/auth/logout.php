<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../config.php';
setCors();

session_start();
session_destroy();

echo json_encode(['success' => true]);
