
<?php
require_once '../config/config.php';
require_once '../config/database.php';
require_once '../core/Router.php';
require_once '../core/Controller.php';

// Enable error reporting in debug mode
if (DEBUG_MODE) {
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
}

// Create router instance
$router = new Router();

// Define routes
$router->get('/', function() {
    echo "Welcome to " . APP_NAME;
});

// Handle the request
$method = $_SERVER['REQUEST_METHOD'];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

$router->handle($method, $uri);
?>
