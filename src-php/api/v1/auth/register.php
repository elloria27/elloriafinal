
<?php
require_once '../../../core/Controller.php';

class RegisterController extends Controller {
    public function handle() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            return $this->error('Method not allowed', 405);
        }

        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($data['email']) || !isset($data['password']) || !isset($data['full_name'])) {
            return $this->error('Email, password and full name are required');
        }

        // For now return mock response, we'll implement actual registration later
        $this->json([
            'success' => true,
            'message' => 'Registration successful'
        ]);
    }
}

$controller = new RegisterController();
$controller->handle();
?>
