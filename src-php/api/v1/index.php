
<?php
require_once '../../config/config.php';
require_once '../../core/Router.php';

// Handle CORS preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    exit(0);
}

// Create router instance
$router = new Router();

// Auth routes
$router->post('/auth/login', function() {
    require 'auth/login.php';
});

$router->post('/auth/register', function() {
    require 'auth/register.php';
});

$router->post('/auth/reset-password', function() {
    require 'auth/reset-password.php';
});

// Product routes
$router->get('/products', function() {
    require 'products/list.php';
});

$router->post('/products', function() {
    require 'products/create.php';
});

$router->put('/products/:id', function() {
    require 'products/update.php';
});

// Handle the request
$method = $_SERVER['REQUEST_METHOD'];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = str_replace('/api/v1', '', $uri);

$router->handle($method, $uri);
?>
