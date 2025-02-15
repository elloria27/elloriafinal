
<?php
require_once '../../../../core/Controller.php';

class UserListController extends Controller {
    public function handle() {
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            return $this->error('Method not allowed', 405);
        }

        // For now return mock data, we'll implement actual listing later
        $this->json([
            'success' => true,
            'users' => [
                [
                    'id' => 1,
                    'email' => 'user1@example.com',
                    'name' => 'User One',
                    'role' => 'user'
                ],
                [
                    'id' => 2,
                    'email' => 'admin@example.com',
                    'name' => 'Admin User',
                    'role' => 'admin'
                ]
            ]
        ]);
    }
}

$controller = new UserListController();
$controller->handle();
?>
