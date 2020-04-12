<?php

require_once '../../vendor/autoload.php';

// Establish DB connection
$connection = db_connect();

// Get major names
$major_names = $connection->select('major', 'name');

// Build response array
$response = array();
foreach ($major_names as $major_name) {
    $groups = $connection->select('group', [
        '[><]major' => 'major_id'
    ], [
        'group_id[Int]', 'approved[Bool]', 'group_letter', 'semester[Int]'
    ], [
        'major.name' => $major_name
    ]);

    $response[] = [
        'major' => $major_name,
        'groups' => $groups
    ];
}

echo json_encode($response);
