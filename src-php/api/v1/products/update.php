
<?php
require_once '../../../core/Controller.php';

class ProductUpdateController extends Controller {
    public function handle() {
        if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
            return $this->error('Method not allowed', 405);
        }

        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($data['id'])) {
            return $this->error('Product ID is required');
        }

        // For now return mock response, we'll implement actual update later
        $this->json([
            'success' => true,
            'product' => array_merge(['id' => $data['id']], $data)
        ]);
    }
}

$controller = new ProductUpdateController();
$controller->handle();
?>
