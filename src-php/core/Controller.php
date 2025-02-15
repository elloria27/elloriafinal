
<?php
abstract class Controller {
    protected $db;
    
    public function __construct() {
        $this->db = Database::getInstance();
    }
    
    protected function view($name, $data = []) {
        extract($data);
        require VIEWS_PATH . '/' . $name . '.php';
    }
    
    protected function json($data) {
        header('Content-Type: application/json');
        echo json_encode($data);
    }
    
    protected function error($message, $code = 400) {
        http_response_code($code);
        $this->json(['error' => $message]);
    }
}
?>
