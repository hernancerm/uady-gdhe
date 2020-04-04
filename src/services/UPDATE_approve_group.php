<?php

require_once '../../vendor/autoload.php';

// Establish DB connection
$connection = db_connect();
// Obtain request contents
$request = get_json_request_body('PUT');

// Verify integrity of request body
$attributes = array('approved', 'group_id');
verify_request($request, $attributes);

$connection->update('group', [
    'approved' => $request->approved
], ['group_id' => $request->group_id]);

http_response_code(204);
