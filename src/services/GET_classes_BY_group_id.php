<?php

use GDHE\Utility\DBConnector;

require_once '../../vendor/autoload.php';

$db_connector = new DBConnector;
$connection = $db_connector->connect();

$request = json_decode($_GET['data']);

$response = $connection->select('class', [
    '[><]classroom' => 'classroom_id',
    '[><]course' => 'course_id',
], [
    'class.start_hour', 'class.end_hour', 'class.weekday', 'class.course_id', 'classroom.name'
], ['course.group_id' => $request->group_id]);

echo json_encode($response);
