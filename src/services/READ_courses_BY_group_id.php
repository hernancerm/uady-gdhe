<?php

require_once '../../vendor/autoload.php';

// Establish DB connection
$connection = db_connect();
// Obtain request contents
$request = json_decode($_GET['data']);

// Verify integrity of request body
$attributes = array('group_id');
verify_request($request, $attributes);

$courses = $connection->select('course', [
    '[><]professor' => 'professor_id', '[><]subject' => 'subject_id'
], [
    'course.course_id',
    'subject.required_class_hours',
    'subject.name',
    'professor.names',
    'professor.first_lname',
    'professor.second_lname'
], ['course.group_id' => $request->group_id]);

echo json_encode($courses);
