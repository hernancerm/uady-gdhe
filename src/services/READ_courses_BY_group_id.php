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

echo json_encode($courses);
