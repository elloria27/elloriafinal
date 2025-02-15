
<?php
require_once '../../../core/Controller.php';

class ProductCreateController extends Controller {
    public function handle() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            return $this->error('Method not allowed', 405);
        }

        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($data['name']) || !isset($data['price'])) {
            return $this->error('Name and price are required');
        }

        // For now return mock response, we'll implement actual creation later
        $this->json([
            'success' => true,
            'product' => [
                'id' => rand(1, 1000),
                'name' => $data['name'],
                'price' => $data['price'],
                'created_at' => date('Y-m-d H:i:s')
            ]
        ]);
    }
}

$controller = new ProductCreateController();
$controller->handle();
?>
