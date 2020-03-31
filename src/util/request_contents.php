<?php

// Works with PUT and POST
function get_json_request_body($http_method)
{
    // Obtain request body
    $method = $_SERVER['REQUEST_METHOD'];
    if ($http_method === $method)
        return json_decode(file_get_contents('php://input'));
    http_response_code(400);
    exit(1);
}
