
<?php
define('APP_NAME', 'Elloria');
define('APP_VERSION', '1.0.0');
define('DEBUG_MODE', true);

// Database configuration
define('DB_TYPE', 'pgsql');
define('DB_HOST', '');  // To be set during installation
define('DB_NAME', '');  // To be set during installation
define('DB_USER', '');  // To be set during installation
define('DB_PASS', '');  // To be set during installation
define('DB_PORT', '5432');

// Application paths
define('BASE_PATH', dirname(__DIR__));
define('PUBLIC_PATH', BASE_PATH . '/public');
define('STORAGE_PATH', BASE_PATH . '/storage');
define('VIEWS_PATH', BASE_PATH . '/views');
?>
