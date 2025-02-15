
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

// Order routes
$router->get('/orders', function() {
    require 'orders/list.php';
});

$router->post('/orders', function() {
    require 'orders/create.php';
});

$router->get('/orders/:id', function() {
    require 'orders/get.php';
});

$router->put('/orders/:id', function() {
    require 'orders/update.php';
});

// Admin routes
$router->get('/admin/users', function() {
    require 'admin/users/list.php';
});

$router->post('/admin/users', function() {
    require 'admin/users/create.php';
});

$router->put('/admin/users/:id', function() {
    require 'admin/users/update.php';
});

$router->delete('/admin/users/:id', function() {
    require 'admin/users/delete.php';
});

// File upload routes
$router->post('/uploads', function() {
    require 'uploads/upload.php';
});

$router->get('/uploads/:id', function() {
    require 'uploads/get.php';
});

$router->delete('/uploads/:id', function() {
    require 'uploads/delete.php';
});

// Handle the request
$method = $_SERVER['REQUEST_METHOD'];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = str_replace('/api/v1', '', $uri);

$router->handle($method, $uri);
?>
