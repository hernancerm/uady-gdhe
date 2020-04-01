<?php

require_once '../../vendor/autoload.php';

$connection = db_connect();

echo json_encode($connection->select('classroom', 'name'));
