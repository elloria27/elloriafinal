
<?php
session_start();
require_once '../config/config.php';

// Installation steps
$steps = [
    1 => 'System Requirements',
    2 => 'Database Configuration',
    3 => 'Admin Account Setup',
    4 => 'License Verification',
    5 => 'Finish'
];

$currentStep = isset($_GET['step']) ? (int)$_GET['step'] : 1;

function checkSystemRequirements() {
    $requirements = [
        'PHP Version (>= 8.0)' => version_compare(PHP_VERSION, '8.0.0', '>='),
        'PDO Extension' => extension_loaded('pdo'),
        'PostgreSQL Extension' => extension_loaded('pgsql'),
        'JSON Extension' => extension_loaded('json'),
        'FileInfo Extension' => extension_loaded('fileinfo'),
        'OpenSSL Extension' => extension_loaded('openssl'),
        'Mbstring Extension' => extension_loaded('mbstring'),
        'Storage Directory Writable' => is_writable(STORAGE_PATH)
    ];
    
    return $requirements;
}

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Install <?php echo APP_NAME; ?></title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
</head>
<body class="bg-gray-100">
    <div class="container mx-auto px-4 py-8">
        <div class="max-w-3xl mx-auto">
            <h1 class="text-3xl font-bold text-center mb-8"><?php echo APP_NAME; ?> Installation</h1>
            
            <!-- Progress bar -->
            <div class="mb-8">
                <div class="flex justify-between mb-2">
                    <?php foreach ($steps as $step => $name): ?>
                    <div class="text-sm <?php echo $step <= $currentStep ? 'text-blue-600' : 'text-gray-400'; ?>">
                        Step <?php echo $step; ?>
                    </div>
                    <?php endforeach; ?>
                </div>
                <div class="h-2 bg-gray-200 rounded-full">
                    <div class="h-2 bg-blue-600 rounded-full" style="width: <?php echo ($currentStep / count($steps)) * 100; ?>%"></div>
                </div>
            </div>

            <!-- Content -->
            <?php if ($currentStep === 1): ?>
                <div class="bg-white rounded-lg shadow p-6">
                    <h2 class="text-xl font-semibold mb-4">System Requirements</h2>
                    <?php
                    $requirements = checkSystemRequirements();
                    $allPassed = true;
                    foreach ($requirements as $requirement => $passed):
                        $allPassed = $allPassed && $passed;
                    ?>
                    <div class="flex justify-between items-center mb-2">
                        <span><?php echo $requirement; ?></span>
                        <span class="<?php echo $passed ? 'text-green-500' : 'text-red-500'; ?>">
                            <?php echo $passed ? '✓' : '✗'; ?>
                        </span>
                    </div>
                    <?php endforeach; ?>
                    
                    <?php if ($allPassed): ?>
                    <div class="mt-6">
                        <a href="?step=2" class="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                            Continue to Database Setup
                        </a>
                    </div>
                    <?php else: ?>
                    <div class="mt-6 text-red-600">
                        Please fix the requirements before continuing.
                    </div>
                    <?php endif; ?>
                </div>
            <?php endif; ?>
            
        </div>
    </div>
</body>
</html>
