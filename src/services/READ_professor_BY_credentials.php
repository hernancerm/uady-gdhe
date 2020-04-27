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

$professor = $connection->select(
    'professor',
    ['names', 'first_lname', 'second_lname', 'professor_id'],
    [
        'professor_id' => $request->username,
        'password' => $request->password
    ]
);

if ($professor == null) {
    http_response_code(401);
    exit(1);
}

echo json_encode($professor[0]);
