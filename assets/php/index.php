<?php
include 'secret.php';
header("Access-Control-Allow-Origin: {$allowedDomain}");
header("Access-Control-Allow-Methods: GET");

class API
{
   private $tmdbApiKey;
   private $allowedDomain;

   /**
    * Constructor to initialize the API with the TMDB API key and allowed domain
    * @param string $tmdb_api_key The TMDB API key
    * @param string $allowedDomain The domain that is allowed to access this API
    */
   private function __construct($tmdbApiKey, $allowedDomain)
   {
      $this->tmdbApiKey = $tmdbApiKey;
      $this->allowedDomain = $allowedDomain;
      $this->checkOrigin();
   }

   /**
    * Check the origin of the request
    */
   private function checkOrigin()
   {
      if (strpos($_SERVER['HTTP_REFERER'] ?? '', $this->allowedDomain) !== 0 && strpos($_SERVER['HTTP_ORIGIN'] ?? '', $this->allowedDomain) !== 0) {
         http_response_code(403);
         echo json_encode(['error' => 'Forbidden']);
         exit();
      }
   }

   /**
    * Handle the incoming request based on the HTTP method
    */
   public function handleRequest()
   {
      $method = $_SERVER['REQUEST_METHOD'];
      if ($method === 'GET') {
         if (!isset($_GET['type'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Bad Request: Missing type parameter']);
            exit();
         }
         $this->handleGetRequest();
      } else {
         http_response_code(405);
         echo json_encode(['error' => 'Method Not Allowed']);
      }
   }

   /**
    * Handle GET requests based on the 'type' parameter
    */
   private function handleGetRequest()
   {
      switch ($_GET['type']) {
         case 'search':
            $this->search();
            break;
         default:
            http_response_code(400);
            echo json_encode(['error' => 'Bad Request: Invalid type parameter']);
      }
   }

   /**
    * Get search results based on the provided query parameters
    */
   private function search()
   {
      $error = null;
      $httpCode = 200;
      $response = null;

      if (!isset($_GET['query'])) {
         $error = 'Bad Request: Missing query parameter';
         $httpCode = 400;
      } elseif (!isset($_GET['show_type'])) {
         $error = 'Bad Request: Missing show_type parameter';
         $httpCode = 400;
      } elseif (!isset($_GET['adult'])) {
         $error = 'Bad Request: Missing adult parameter';
         $httpCode = 400;
      } elseif (!isset($_GET['page'])) {
         $error = 'Bad Request: Missing page parameter';
         $httpCode = 400;
      } else {
         $query = urlencode($_GET['query']);
         $showType = $_GET['show_type'];
         $adult = $_GET['adult'];
         $page = $_GET['page'];

         $curl = curl_init();
         curl_setopt_array($curl, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER => [
               'Content-Type: application/json',
               "Authorization: {$this->tmdbApiKey}",
            ]
         ]);

         if ($showType === 'tv') {
            curl_setopt($curl, CURLOPT_URL, "https://api.themoviedb.org/3/search/tv?query={$query}&include_adult={$adult}&page={$page}");
         } elseif ($showType === 'movie') {
            curl_setopt($curl, CURLOPT_URL, "https://api.themoviedb.org/3/search/movie?query={$query}&include_adult={$adult}&page={$page}");
         } else {
            $error = 'Bad Request: Invalid show_type parameter';
            $httpCode = 400;
         }

         if (!$error) {
            $response = curl_exec($curl);
            curl_close($curl);

            if ($response === false) {
               $error = 'Internal Server Error';
               $httpCode = 500;
            }
         }
      }

      if ($error) {
         http_response_code($httpCode);
         echo json_encode(['error' => $error]);
      } else {
         echo $response;
      }
   }
}

$api = new API($tmdbApiKey, $allowedDomain);
