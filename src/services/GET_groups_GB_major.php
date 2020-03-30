<?php

use GDHE\Utility\DBConnector;

require_once '../../vendor/autoload.php';

$db_connector = new DBConnector;
$connection = $db_connector->connect();

// Get major names
$major_names = $connection->select('major', 'name');

// Build response array
$response = array();
foreach ($major_names as $major_name) {
    $result = $connection->select('group', [
        '[><]major' => 'major_id'
    ], [
        'group_id', 'approved', 'group_letter', 'semester'
    ], [
        'major.name' => $major_name
    ]);

    $response[$major_name] = $result;
}

echo json_encode($response);
