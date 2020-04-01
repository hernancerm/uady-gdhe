<?php

require_once '../../vendor/autoload.php';

// Establish DB connection
$connection = db_connect();
// Obtain request contents
$request = json_decode($_GET['data']);

// Verify integrity of request body
$attributes = array('group_id');
verify_request($request, $attributes);

$response = $connection->select('class', [
    '[><]classroom' => 'classroom_id',
    '[><]course' => 'course_id',
], [
    'class.start_hour', 'class.end_hour', 'class.weekday', 'class.course_id', 'classroom.name'
], ['course.group_id' => $request->group_id]);

echo json_encode($response);
