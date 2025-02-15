
<?php
require_once '../../../core/Controller.php';

class ResetPasswordController extends Controller {
    public function handle() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            return $this->error('Method not allowed', 405);
        }

        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($data['email'])) {
            return $this->error('Email is required');
        }

        // For now return mock response, we'll implement actual reset later
        $this->json([
            'success' => true,
            'message' => 'Password reset instructions sent'
        ]);
    }
}

$controller = new ResetPasswordController();
$controller->handle();
?>
