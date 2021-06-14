<?php

use PHPUnit\Framework\TestCase;
use GuzzleHttp\Client;

final class ServicesTest extends TestCase
{
    private static $client;

    // Create Guzzle HTTP client for test API calls
    public static function setUpBeforeClass(): void
    {
        $base_uri = 'http://localhost/htdocs_2020/GDHE/src/services/';
        self::$client = new Client(['base_uri' => $base_uri]);
    }

    public function test_READ_admin_BY_credentials()
    {
        $service = 'READ_admin_BY_credentials.php';
        $response = self::$client->request('POST', $service, [
            'json' => [
                'username' => '0001',
                'password' => '123'
            ]
        ]);

        $this->assertEquals(200, $response->getStatusCode());
        $body = json_decode($response->getBody(), true);

        $this->assertArrayHasKey('names', $body);
        $this->assertIsString($body['names']);

        $this->assertArrayHasKey('first_lname', $body);
        $this->assertIsString($body['first_lname']);

        $this->assertArrayHasKey('second_lname', $body);
        $this->assertIsString($body['second_lname']);
    }

    public function test_READ_student_BY_credentials()
    {
        $service = 'READ_student_BY_credentials.php';
        $response = self::$client->request('POST', $service, [
            'json' => [
                'username' => '0001',
                'password' => '123'
            ]
        ]);

        $this->assertEquals(200, $response->getStatusCode());
        $body = json_decode($response->getBody(), true);

        $this->assertArrayHasKey('names', $body);
        $this->assertIsString($body['names']);

        $this->assertArrayHasKey('first_lname', $body);
        $this->assertIsString($body['first_lname']);

        $this->assertArrayHasKey('second_lname', $body);
        $this->assertIsString($body['second_lname']);

        $this->assertArrayHasKey('group_id', $body);
        $this->assertIsInt($body['group_id']);
    }

    public function test_READ_professor_BY_credentials()
    {
        $service = 'READ_professor_BY_credentials.php';
        $response = self::$client->request('POST', $service, [
            'json' => [
                'username' => '0001',
                'password' => '123'
            ]
        ]);

        $this->assertEquals(200, $response->getStatusCode());
        $body = json_decode($response->getBody(), true);

        $this->assertEquals(200, $response->getStatusCode());
        $body = json_decode($response->getBody(), true);

        $this->assertArrayHasKey('names', $body);
        $this->assertIsString($body['names']);

        $this->assertArrayHasKey('first_lname', $body);
        $this->assertIsString($body['first_lname']);

        $this->assertArrayHasKey('second_lname', $body);
        $this->assertIsString($body['second_lname']);

        $this->assertArrayHasKey('professor_id', $body);
        $this->assertIsInt($body['professor_id']);
    }

    public function test_READ_groups_GB_major()
    {
        $service = 'READ_groups_GB_major.php';
        $response = self::$client->request('GET', $service);

        $this->assertEquals(200, $response->getStatusCode());
        $body = json_decode($response->getBody(), true);

        if (count($body) > 0) {
            $this->assertArrayHasKey('major', $body[0]);
            $this->assertIsString($body[0]['major']);

            $this->assertArrayHasKey('groups', $body[0]);
            $this->assertIsArray($body[0]['groups']);

            if (count($body[0]['groups']) > 0) {
                $group = $body[0]['groups'][0];

                $this->assertArrayHasKey('group_id', $group);
                $this->assertIsInt($group['group_id']);

                $this->assertArrayHasKey('approved', $group);
                $this->assertIsBool($group['approved']);

                $this->assertArrayHasKey('group_letter', $group);

                $this->assertArrayHasKey('semester', $group);
                $this->assertIsInt($group['semester']);
            }
        }
    }

    public function test_READ_classrooms()
    {
        $service = 'READ_classrooms.php';
        $response = self::$client->request('GET', $service);

        $this->assertEquals(200, $response->getStatusCode());
        $this->assertIsArray(json_decode($response->getBody(), true));
    }

    public function test_READ_group_BY_group_id()
    {
        $service = 'READ_group_BY_group_id.php';
        $response = self::$client->request('GET', $service, [
            'query' => ['group_id' => 1]
        ]);

        $this->assertEquals(200, $response->getStatusCode());
        $body = json_decode($response->getBody(), true);

        $this->assertArrayHasKey('approved', $body);
        $this->assertIsBool($body['approved']);

        $this->assertArrayHasKey('group_letter', $body);
        $this->assertIsString($body['group_letter']);

        $this->assertArrayHasKey('semester', $body);
        $this->assertIsInt($body['semester']);

        $this->assertArrayHasKey('major', $body);
        $this->assertIsString($body['major']);
    }

    public function test_READ_courses_BY_group_id()
    {
        $service = 'READ_courses_BY_group_id.php';
        $response = self::$client->request('GET', $service, [
            'query' => ['group_id' => 1]
        ]);

        $this->assertEquals(200, $response->getStatusCode());
        $body = json_decode($response->getBody(), true);

        if (count($body) > 0) {
            $this->assertArrayHasKey('course_id', $body[0]);
            $this->assertIsInt($body[0]['course_id']);

            $this->assertArrayHasKey('required_class_hours', $body[0]);
            $this->assertIsNumeric($body[0]['required_class_hours']);

            $this->assertArrayHasKey('professor_full_name', $body[0]);
            $this->assertIsString($body[0]['professor_full_name']);

            $this->assertArrayHasKey('subject_name', $body[0]);
            $this->assertIsString($body[0]['subject_name']);
        }
    }

    public function test_READ_classes_GB_course_id_BY_group_id()
    {
        $service = 'READ_classes_GB_course_id_BY_group_id.php';
        $response = self::$client->request('GET', $service, [
            'query' => ['group_id' => 1]
        ]);

        $this->assertEquals(200, $response->getStatusCode());
        $body = json_decode($response->getBody(), true);

        if (count($body) > 0) {
            $this->assertArrayHasKey('course_id', $body[0]);
            $this->assertIsInt($body[0]['course_id']);

            $this->assertArrayHasKey('classes', $body[0]);
            $this->assertIsArray($body[0]['classes']);

            if (count($body[0]['classes']) > 0) {
                $class = $body[0]['classes'][0];

                $this->assertArrayHasKey('class_id', $class);
                $this->assertIsInt($class['class_id']);

                $this->assertArrayHasKey('start_hour', $class);
                $this->assertIsString($class['start_hour']);

                $this->assertArrayHasKey('end_hour', $class);
                $this->assertIsString($class['end_hour']);

                $this->assertArrayHasKey('classroom_name', $class);
                $this->assertIsString($class['classroom_name']);

                $this->assertArrayHasKey('weekday', $class);
                $this->assertIsString($class['weekday']);
            }
        }
    }

    public function test_READ_classes_GB_weekday_BY_group_id()
    {
        $service = 'READ_classes_GB_weekday_BY_group_id.php';
        $response = self::$client->request('GET', $service, [
            'query' => ['group_id' => 1]
        ]);

        $this->assertEquals(200, $response->getStatusCode());
        $body = json_decode($response->getBody(), true);

        if (count($body) > 0) {
            $this->assertArrayHasKey('weekday', $body[0]);
            $this->assertIsString($body[0]['weekday']);

            $this->assertArrayHasKey('classes', $body[0]);
            $this->assertIsArray($body[0]['classes']);

            if (count($body[0]['classes']) > 0) {
                $class = $body[0]['classes'][0];

                $this->assertArrayHasKey('subject_name', $class);
                $this->assertIsString($class['subject_name']);

                $this->assertArrayHasKey('start_hour', $class);
                $this->assertIsString($class['start_hour']);

                $this->assertArrayHasKey('end_hour', $class);
                $this->assertIsString($class['end_hour']);

                $this->assertArrayHasKey('classroom', $class);
                $this->assertIsString($class['classroom']);
            }
        }
    }

    public function test_READ_classes_GB_weekday_BY_professor_id()
    {
        $service = 'READ_approved_classes_GB_weekday_BY_professor_id.php';
        $response = self::$client->request('GET', $service, [
            'query' => ['professor_id' => 1]
        ]);

        $this->assertEquals(200, $response->getStatusCode());
        $body = json_decode($response->getBody(), true);

        if (count($body) > 0) {
            $this->assertArrayHasKey('weekday', $body[0]);
            $this->assertIsString($body[0]['weekday']);

            $this->assertArrayHasKey('classes', $body[0]);
            $this->assertIsArray($body[0]['classes']);

            if (count($body[0]['classes']) > 0) {
                $class = $body[0]['classes'][0];

                $this->assertArrayHasKey('subject_name', $class);
                $this->assertIsString($class['subject_name']);

                $this->assertArrayHasKey('start_hour', $class);
                $this->assertIsString($class['start_hour']);

                $this->assertArrayHasKey('end_hour', $class);
                $this->assertIsString($class['end_hour']);

                $this->assertArrayHasKey('classroom', $class);
                $this->assertIsString($class['classroom']);
            }
        }
    }

    public function test_UPDATE_approve_group()
    {
        $service = 'UPDATE_approve_group.php';

        $group_id = 1;
        $response = self::$client->request('PUT', $service, [
            'json' => [
                'group_id' => $group_id,
                'approved' => false
            ]
        ]);

        $this->assertEquals(204, $response->getStatusCode());

        $service = 'UPDATE_approve_group.php';
        $response = self::$client->request('PUT', $service, [
            'json' => [
                'group_id' => $group_id,
                'approved' => true
            ]
        ]);

        $this->assertEquals(204, $response->getStatusCode());
    }
}
