
<?php
require_once '../../../core/Controller.php';

class FileUploadController extends Controller {
    public function handle() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            return $this->error('Method not allowed', 405);
        }

        if (!isset($_FILES['file'])) {
            return $this->error('No file uploaded');
        }

        $file = $_FILES['file'];
        $maxSize = 5 * 1024 * 1024; // 5MB limit

        if ($file['size'] > $maxSize) {
            return $this->error('File size exceeds limit');
        }

        $allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
        if (!in_array($file['type'], $allowedTypes)) {
            return $this->error('Invalid file type');
        }

        // For now return mock response, we'll implement actual upload later
        $this->json([
            'success' => true,
            'file' => [
                'id' => rand(1, 1000),
                'name' => $file['name'],
                'type' => $file['type'],
                'size' => $file['size'],
                'url' => '/uploads/' . $file['name']
            ]
        ]);
    }
}

$controller = new FileUploadController();
$controller->handle();
?>
