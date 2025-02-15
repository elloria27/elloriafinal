
<?php
class Router {
    private $routes = [];
    
    public function add($method, $path, $handler) {
        $this->routes[] = [
            'method' => $method,
            'path' => $path,
            'handler' => $handler
        ];
    }
    
    public function get($path, $handler) {
        $this->add('GET', $path, $handler);
    }
    
    public function post($path, $handler) {
        $this->add('POST', $path, $handler);
    }
    
    public function handle($method, $uri) {
        foreach ($this->routes as $route) {
            if ($route['method'] === $method && $route['path'] === $uri) {
                return call_user_func($route['handler']);
            }
        }
        
        http_response_code(404);
        echo '404 Not Found';
    }
}
?>
