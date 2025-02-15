
<?php
require_once '../../../core/Controller.php';

class ProductListController extends Controller {
    public function handle() {
        if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
            return $this->error('Method not allowed', 405);
        }

        // For now return mock data, we'll implement actual product listing later
        $this->json([
            'success' => true,
            'products' => [
                [
                    'id' => 1,
                    'name' => 'Product 1',
                    'price' => 99.99,
                    'description' => 'Sample product 1'
                ],
                [
                    'id' => 2,
                    'name' => 'Product 2',
                    'price' => 149.99,
                    'description' => 'Sample product 2'
                ]
            ]
        ]);
    }
}

$controller = new ProductListController();
$controller->handle();
?>
