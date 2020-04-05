<?php

require_once '../../vendor/autoload.php';

// Establish DB connection
$connection = db_connect();
// Obtain request contents
$request = get_json_request_body('PUT');

// Verify integrity of request body
$attributes = array(
    'class_id',
    'start_hour',
    'end_hour',
    'weekday',
    'classroom_name',
    'course_id'
);
verify_request($request, $attributes);

// Professor is already scheduled at that time
$overlap_professor = $connection->query('SELECT <c.class_id> FROM <class> <c>
NATURAL JOIN <course> NATURAL JOIN <professor>
WHERE <professor_id> = (SELECT <professor_id> FROM <course> WHERE <course_id> = :course_id)
AND !(<c.end_hour> <= :start_hour OR <c.start_hour> >= :end_hour)
AND <weekday> = :weekday
AND <c.class_id> <> :class_id;', [
    ':course_id' => $request->course_id,
    ':start_hour' => $request->start_hour,
    ':end_hour' => $request->end_hour,
    ':weekday' => $request->weekday,
    ':class_id' => $request->class_id
])->fetchAll();
// Time overlap 409 error
if (count($overlap_professor) >= 1) {
    http_response_code(409);
    exit(1);
}

// Classroom is already scheduled at that time
$overlap_classroom = $connection->query('SELECT <c.class_id> FROM <class> <c>
NATURAL JOIN <classroom> <cr>
WHERE <cr.name> = :classroom_name
AND !(<c.end_hour> <= :start_hour OR <c.start_hour> >= :end_hour)
AND <weekday> = :weekday
AND <c.class_id> <> :class_id;', [
    ':classroom_name' => $request->classroom_name,
    ':start_hour' => $request->start_hour,
    ':end_hour' => $request->end_hour,
    ':weekday' => $request->weekday,
    ':class_id' => $request->class_id
])->fetchAll();
// Time overlap 409 error
if (count($overlap_classroom) >= 1) {
    http_response_code(409);
    exit(1);
}

// Update class
$classroom_id = $connection->select(
    'classroom',
    ['classroom_id'],
    ['name' => $request->classroom_name]
)[0]['classroom_id'];
$connection->update('class', [
    'start_hour' => $request->start_hour,
    'end_hour' => $request->end_hour,
    'weekday' => $request->weekday,
    'classroom_id' => $classroom_id,
    'course_id' => $request->course_id
], ['class_id' => $request->class_id]);

http_response_code(204);
