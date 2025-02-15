
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
            
            <?php elseif ($currentStep === 2): ?>
                <div class="bg-white rounded-lg shadow p-6">
                    <h2 class="text-xl font-semibold mb-4">Database Configuration</h2>
                    <form action="?step=3" method="post" class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Database Host</label>
                            <input type="text" name="db_host" required
                                class="w-full px-3 py-2 border border-gray-300 rounded-md"
                                placeholder="localhost">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Database Name</label>
                            <input type="text" name="db_name" required
                                class="w-full px-3 py-2 border border-gray-300 rounded-md"
                                placeholder="elloria_db">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Database User</label>
                            <input type="text" name="db_user" required
                                class="w-full px-3 py-2 border border-gray-300 rounded-md"
                                placeholder="db_user">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Database Password</label>
                            <input type="password" name="db_password" required
                                class="w-full px-3 py-2 border border-gray-300 rounded-md">
                        </div>
                        <div class="flex justify-between pt-4">
                            <a href="?step=1" 
                               class="px-4 py-2 text-gray-600 bg-gray-100 rounded hover:bg-gray-200">
                                Back
                            </a>
                            <button type="submit" 
                                    class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                                Continue to Admin Setup
                            </button>
                        </div>
                    </form>
                </div>

            <?php elseif ($currentStep === 3): ?>
                <div class="bg-white rounded-lg shadow p-6">
                    <h2 class="text-xl font-semibold mb-4">Admin Account Setup</h2>
                    <form action="?step=4" method="post" class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Admin Email</label>
                            <input type="email" name="admin_email" required
                                class="w-full px-3 py-2 border border-gray-300 rounded-md"
                                placeholder="admin@example.com">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <input type="password" name="admin_password" required
                                class="w-full px-3 py-2 border border-gray-300 rounded-md"
                                minlength="8">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                            <input type="password" name="admin_password_confirm" required
                                class="w-full px-3 py-2 border border-gray-300 rounded-md"
                                minlength="8">
                        </div>
                        <div class="flex justify-between pt-4">
                            <a href="?step=2" 
                               class="px-4 py-2 text-gray-600 bg-gray-100 rounded hover:bg-gray-200">
                                Back
                            </a>
                            <button type="submit" 
                                    class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                                Continue to License Verification
                            </button>
                        </div>
                    </form>
                </div>

            <?php elseif ($currentStep === 4): ?>
                <div class="bg-white rounded-lg shadow p-6">
                    <h2 class="text-xl font-semibold mb-4">License Verification</h2>
                    <form action="?step=5" method="post" class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">License Key</label>
                            <input type="text" name="license_key" required
                                class="w-full px-3 py-2 border border-gray-300 rounded-md"
                                placeholder="XXXX-XXXX-XXXX-XXXX">
                            <p class="mt-1 text-sm text-gray-500">
                                Enter your license key to activate the software
                            </p>
                        </div>
                        <div class="flex justify-between pt-4">
                            <a href="?step=3" 
                               class="px-4 py-2 text-gray-600 bg-gray-100 rounded hover:bg-gray-200">
                                Back
                            </a>
                            <button type="submit" 
                                    class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                                Verify and Complete Installation
                            </button>
                        </div>
                    </form>
                </div>

            <?php elseif ($currentStep === 5): ?>
                <div class="bg-white rounded-lg shadow p-6 text-center">
                    <div class="mb-4">
                        <svg class="mx-auto h-12 w-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 class="text-xl font-semibold mb-2">Installation Complete!</h2>
                    <p class="text-gray-600 mb-6">
                        Congratulations! <?php echo APP_NAME; ?> has been successfully installed.
                    </p>
                    <div>
                        <a href="/" 
                           class="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                            Go to Homepage
                        </a>
                    </div>
                </div>
            <?php endif; ?>
            
        </div>
    </div>
</body>
</html>
