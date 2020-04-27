<?php

require_once '../../vendor/autoload.php';

// Establish DB connection
$connection = db_connect();
// Obtain request contents
$request = get_json_request_body('POST');

// Verify integrity of request body
$attributes = array('username', 'password');
verify_request($request, $attributes);

// Username malformed
if (strlen($request->username) != 4) {
    http_response_code(401);
    exit(1);
}

$student = $connection->select(
    'student',
    ['names', 'first_lname', 'second_lname', 'group_id'],
    [
        'student_id' => $request->username,
        'password' => $request->password
    ]
);

if ($student == null) {
    http_response_code(401);
    exit(1);
}

echo json_encode($student[0]);
