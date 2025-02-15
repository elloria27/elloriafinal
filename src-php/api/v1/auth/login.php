
<?php
require_once '../../../core/Controller.php';

class LoginController extends Controller {
    public function handle() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            return $this->error('Method not allowed', 405);
        }

        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($data['email']) || !isset($data['password'])) {
            return $this->error('Email and password are required');
        }

        // For now return mock response, we'll implement actual auth later
        $this->json([
            'success' => true,
            'token' => 'mock_token',
            'user' => [
                'id' => 1,
                'email' => $data['email']
            ]
        ]);
    }
}

$controller = new LoginController();
$controller->handle();
?>
