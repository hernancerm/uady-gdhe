<?php

require_once '../../vendor/autoload.php';

// Establish DB connection
$connection = db_connect();
// Obtain request contents
$request = json_decode($_GET['data']);

// Verify integrity of request body
$attributes = array('group_id');
verify_request($request, $attributes);

// Courses assigned to the specified group
$courses = array_values($connection->select(
    'course',
    ['course_id'],
    ['group_id' => $request->group_id]
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
