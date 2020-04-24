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

$weekdays = array(
    'mon', 'tue', 'wed', 'thu', 'fri'
);

$response = array();
foreach ($weekdays as $weekday) {
    $response[] = [
        'weekday' => $weekday,
        'classes' => $connection->select('class', [
            '[><]course' => 'course_id',
            '[><]subject' => 'subject_id',
            '[><]classroom' => 'classroom_id',
        ], [
            'subject.name(subject_name)', 'class.start_hour', 'class.end_hour', 'classroom.name(classroom)'
        ], [
            'course.group_id' => $group_id,
            'class.weekday' => $weekday,
            'ORDER' => ['class.start_hour' => 'ASC']
        ])
    ];
}

echo json_encode($response);
