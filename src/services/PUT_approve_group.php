<?php

use GDHE\Utility\DBConnector;
use GDHE\Utility\RequestVerifier;

require_once '../../vendor/autoload.php';

// Establish DB connection
$db_connector = new DBConnector;
$connection = $db_connector->connect();

// Create request verifier
$verifier = new RequestVerifier;

$request; // Request body

// Obtain request body
$method = $_SERVER['REQUEST_METHOD'];
if ('PUT' === $method)
    $request = json_decode(file_get_contents('php://input'));

// Verify integrity of request body
if ($verifier->is_malformed($request, array('approved', 'group_id'))) {
    http_response_code(400);
    exit(1);
}

$connection->update('group', [
    'approved' => $request->approved
], ['group_id' => $request->group_id]);
