<?php

require_once '../../vendor/autoload.php';

// Establish DB connection
$connection = db_connect();
// Obtain group_id
$professor_id;
if (isset($_GET['professor_id']))
    $professor_id = $_GET['professor_id'];
else {
    http_response_code(400);
    exit(1);
}

$weekdays = array(
    'mon', 'tue', 'wed', 'thu', 'fri'
);

// Professor not found
$professor = $connection->select('professor', 'professor_id', ['professor_id' => $professor_id]);
if (count($professor) == 0) {
    http_response_code(404);
    echo json_encode([
        'error' => 'Professor not found.'
    ]);
    exit(1);
}

$response = array();
foreach ($weekdays as $weekday) {
    $response[] = [
        'weekday' => $weekday,
        'classes' => $connection->query(
            'SELECT 
                <s.name> AS subject_name,
                DATE_FORMAT(<c.start_hour>, \'%k:%i\') AS start_hour,
                DATE_FORMAT(<c.end_hour>, \'%k:%i\') AS end_hour,
                <cr.name> AS classroom
            FROM <class> <c>
                INNER JOIN <course> <co> ON <co.course_id> = <c.course_id>
                INNER JOIN subject <s> ON <s.subject_id> = <co.subject_id>
                INNER JOIN <classroom> <cr> ON <cr.classroom_id> = <c.classroom_id>
            WHERE <co.professor_id> = :professor_id AND <c.weekday> = :weekday ORDER BY <c.start_hour> ASC;',
            [
                ':professor_id' => $professor_id,
                ':weekday' => $weekday
            ]
        )->fetchAll()
    ];
}

echo json_encode($response);
