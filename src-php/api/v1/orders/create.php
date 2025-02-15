
<?php
require_once '../../../core/Controller.php';

class OrderCreateController extends Controller {
    public function handle() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            return $this->error('Method not allowed', 405);
        }

        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($data['items']) || !isset($data['total'])) {
            return $this->error('Items and total are required');
        }

        // For now return mock response, we'll implement actual creation later
        $this->json([
            'success' => true,
            'order' => [
                'id' => rand(1, 1000),
                'items' => $data['items'],
                'total' => $data['total'],
                'status' => 'pending',
                'created_at' => date('Y-m-d H:i:s')
            ]
        ]);
    }
}

$controller = new OrderCreateController();
$controller->handle();
?>
