<?php

require_once '../../vendor/autoload.php';

// Establish DB connection
$connection = db_connect();
// Obtain group_id
$group_id;
if (isset($_GET['group_id']))
    $group_id = $_GET['group_id'];
else {
    http_response_code(400);
    exit(1);
}

echo json_encode($connection->select('group', ['[><]major' => 'major_id'], [
    'group.approved[Bool]', 'group.group_letter', 'group.semester[Int]', 'major.name'
], ['group.group_id' => $group_id])[0]);
