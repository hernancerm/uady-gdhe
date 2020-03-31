<?php

function verify_request($request, $attributes)
{
    if (is_req_body_malformed($request, $attributes)) {
        http_response_code(400);
        exit(1);
    }
}

function is_req_body_malformed($request, $attributes)
{
    foreach ($attributes as $attribute)
        if (!isset($request->$attribute))
            return true;
    return false;
}
