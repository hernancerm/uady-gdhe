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

// Courses assigned to the specified group
$courses = array_values($connection->select(
    'course',
    ['course_id'],
    ['group_id' => $group_id]
));

$response = array();
foreach ($courses as $course) {
    $response[$course['course_id']] = $connection->select('class', [
        '[><]classroom' => 'classroom_id',
    ], [
        'class.class_id', 'class.start_hour', 'class.end_hour', 'class.weekday', 'classroom.name'
    ], ['class.course_id' => $course['course_id']]);
}

echo json_encode($response);
