<?php

require_once '../../vendor/autoload.php';

// Establish DB connection
$connection = db_connect();
// Obtain class_id
$class_id;
if (isset($_GET['class_id']))
    $class_id = $_GET['class_id'];
else {
    http_response_code(400);
    exit(1);
}

$data = $connection->delete(
    'class',
    ['class_id' => $class_id]
);

if ($data->rowCount() > 0)
    // 204 No Content
    http_response_code(204);
else
    // 404 Not Found
    http_response_code(404);
