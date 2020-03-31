<?php

namespace GDHE\Utility;

class RequestVerifier
{
    public function is_malformed($request, $attributes)
    {
        foreach ($attributes as $attribute)
            if (!isset($request->$attribute))
                return true;
        return false;
    }
}
