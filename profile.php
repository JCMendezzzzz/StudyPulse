<?php
session_start();
header('Content-Type: application/json');
require_once 'db_connect.php'; // Your DB connection file

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'User not logged in']);
    exit;
}

$user_id = $_SESSION['user_id'];

// Handle POST request for profile update
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $first_name = $_POST['first_name'] ?? null;
    $last_name = $_POST['last_name'] ?? null;

    if (!$first_name || !$last_name) {
        echo json_encode(['success' => false, 'message' => 'First and last name are required']);
        exit;
    }

    // File upload handling
    $photo_url = null;
    if (isset($_FILES['photo']) && $_FILES['photo']['error'] === UPLOAD_ERR_OK) {
        $uploadDir = 'uploads/profile_photos/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }

        $fileTmpPath = $_FILES['photo']['tmp_name'];
        $fileName = basename($_FILES['photo']['name']);
        $fileExt = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
        $allowedExts = ['jpg', 'jpeg', 'png', 'gif'];

        if (!in_array($fileExt, $allowedExts)) {
            echo json_encode(['success' => false, 'message' => 'Invalid file type. Only JPG, PNG, GIF allowed.']);
            exit;
        }

        $newFileName = 'user_' . $user_id . '.' . $fileExt;
        $destPath = $uploadDir . $newFileName;

        if (move_uploaded_file($fileTmpPath, $destPath)) {
            $photo_url = $destPath;
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to move uploaded file.']);
            exit;
        }
    }

    // Update user info in DB
    require_once 'db_connect.php'; // Adjust path accordingly

    $pdo = getPDO(); // Assuming getPDO() returns PDO connection

    try {
        if ($photo_url) {
            $stmt = $pdo->prepare("UPDATE users SET first_name = ?, last_name = ?, photo = ? WHERE id = ?");
            $stmt->execute([$first_name, $last_name, $photo_url, $user_id]);
        } else {
            $stmt = $pdo->prepare("UPDATE users SET first_name = ?, last_name = ? WHERE id = ?");
            $stmt->execute([$first_name, $last_name, $user_id]);
        }
        echo json_encode(['success' => true, 'photo_url' => $photo_url]);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => 'Database update failed: ' . $e->getMessage()]);
    }

} else if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Fetch user info for display
    $pdo = getPDO();

    $stmt = $pdo->prepare("SELECT first_name, last_name, email, photo FROM users WHERE id = ?");
    $stmt->execute([$user_id]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        echo json_encode(['success' => true, 'user' => $user]);
    } else {
        echo json_encode(['success' => false, 'message' => 'User not found']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Unsupported request method']);
}
?>
