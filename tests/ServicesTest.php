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

    public function test_READ_groups_GB_major()
    {
        $service = 'READ_groups_GB_major.php';
        $response = self::$client->request('GET', $service);

        $this->assertEquals(200, $response->getStatusCode());

        $body = json_decode($response->getBody(), true);

        if (count($body) > 0) {
            $this->assertArrayHasKey('major', $body[0]);
            $this->assertArrayHasKey('groups', $body[0]);
        }
    }
}
