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

$courses = $connection->select('course', [
    '[><]professor' => 'professor_id', '[><]subject' => 'subject_id'
], [
    'course.course_id',
    'subject.required_class_hours',
    'subject.name',
    'professor.names',
    'professor.first_lname',
    'professor.second_lname'
], ['course.group_id' => $group_id]);

echo json_encode(array_map('compose_course', $courses));

function compose_course($course)
{
    $full_name = "{$course['names']} {$course['first_lname']} {$course['second_lname']}";
    return [
        'course_id' => $course['course_id'],
        'required_class_hours' => $course['required_class_hours'],
        'professor_full_name' => $full_name,
        'subject_name' => $course['name']
    ];
}
