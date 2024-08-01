<?php

class Api
{
   private $auth;
   public function __construct()
   {
      $this->auth = "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1Yzk4MTAxNjk0OTQ2MmE4NmJlNTA2NTc2Yjg1ZjZlNCIsInN1YiI6IjY2MjFkMDY1Y2NkZTA0MDE4ODA2NDA4MCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.xUExDZr1UbIizmXNPNqotICIYYKTQfRltq2uIgq9qjI";
   }

   public function handleRequest()
   {
      if (isset($_SERVER['REQUEST_METHOD'])) {
         switch ($_SERVER['REQUEST_METHOD']) {
            case 'GET':
               if (isset($_GET["query"]) && !empty($_GET["query"])) {

                  $query = trim($_GET["query"]);

                  $ch = curl_init("https://api.themoviedb.org/3/search/multi?query=" . $query . "&include_adult=false");
                  curl_setopt($ch, CURLOPT_HTTPGET, true);
                  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                  curl_setopt($ch, CURLOPT_HTTPHEADER, array("Authorization:" . $this->auth));

                  $response = curl_exec($ch);
                  curl_close($ch);

                  if ($response) {
                     http_response_code(200);
                     echo $response;
                  } else {
                     http_response_code(500);
                  }
               } else {
                  http_response_code(400);
               }
               break;
            default:
               http_response_code(405);
               break;
         }
      } else {
         http_response_code(400);
      }
   }
}

$api = new Api();
$api->handleRequest();
