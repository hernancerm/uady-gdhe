<?php

require_once '../../vendor/autoload.php';

// Establish DB connection
$connection = db_connect();
// Obtain request contents
$request = get_json_request_body('POST');

// Verify integrity of request body
$attributes = array(
    'start_hour', 'end_hour', 'classroom_name', 'course_id', 'weekday'
);
verify_request($request, $attributes);

/* 
 * Verify class has no conflicts. A class has a conflict if any
 * of the following is true:
 *   - Professor is already scheduled at that time and day.
 *   - Classroom is already scheduled at that time and day.
 *   - Another class exists in the same group at the same time and day.
*/

// Professor is already scheduled at that time and day
$overlap_professor = $connection->query('SELECT <c.class_id> FROM <class> <c>
NATURAL JOIN <course> NATURAL JOIN <professor>
WHERE <professor_id> = (SELECT <professor_id> FROM <course> WHERE <course_id> = :course_id)
AND !(<c.end_hour> <= :start_hour OR <c.start_hour> >= :end_hour)
AND <weekday> = :weekday;', [
    ':course_id' => $request->course_id,
    ':start_hour' => $request->start_hour,
    ':end_hour' => $request->end_hour,
    ':weekday' => $request->weekday
])->fetchAll();
// Time overlap 409 error
if (count($overlap_professor) >= 1) {
    http_response_code(409);
    exit(1);
}

// Classroom is already scheduled at that time and day
$overlap_classroom = $connection->query('SELECT <c.class_id> FROM <class> <c>
NATURAL JOIN <classroom> <cr>
WHERE <cr.name> = :classroom_name
AND !(<c.end_hour> <= :start_hour OR <c.start_hour> >= :end_hour)
AND <weekday> = :weekday;', [
    ':classroom_name' => $request->classroom_name,
    ':start_hour' => $request->start_hour,
    ':end_hour' => $request->end_hour,
    ':weekday' => $request->weekday
])->fetchAll();
// Time overlap 409 error
if (count($overlap_classroom) >= 1) {
    http_response_code(409);
    exit(1);
}

// Day and time overlap on same group
$overlap_same_group = $connection->query('SELECT <c.class_id> FROM <class> <c>
NATURAL JOIN <course> <co>
WHERE <co.group_id> = (SELECT <group_id> FROM <course> WHERE <course.course_id> = :course_id)
AND !(<c.end_hour> <= :start_hour OR <c.start_hour> >= :end_hour)
AND <weekday> = :weekday;', [
    'course_id' => $request->course_id,
    ':start_hour' => $request->start_hour,
    ':end_hour' => $request->end_hour,
    ':weekday' => $request->weekday
])->fetchAll();
// Time overlap 409 error
if (count($overlap_same_group) >= 1) {
    http_response_code(409);
    exit(1);
}

// Create class
$classroom_id = $connection->select(
    'classroom',
    ['classroom_id'],
    ['name' => $request->classroom_name]
)[0]['classroom_id'];
$connection->insert('class', [
    'start_hour' => $request->start_hour,
    'end_hour' => $request->end_hour,
    'weekday' => $request->weekday,
    'course_id' => $request->course_id,
    'classroom_id' => $classroom_id
]);

// 201 Created
http_response_code(201);
