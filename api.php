<?php
session_start();
$httpMethod = strtoupper($_SERVER['REQUEST_METHOD']);

switch($httpMethod) {
  case "OPTIONS":
    // Allows anyone to hit your API, not just this c9 domain
    header("Access-Control-Allow-Headers: X-ACCESS_TOKEN, Access-Control-Allow-Origin, Authorization, Origin, X-Requested-With, Content-Type, Content-Range, Content-Disposition, Content-Description");
    header("Access-Control-Allow-Methods: POST, GET");
    header("Access-Control-Max-Age: 3600");
    exit();
    
  case "GET":
    // Allow any client to access
    header("Access-Control-Allow-Origin: *");
    
    http_response_code(401);
    echo "Not Supported";
    
    break;
    
  case 'POST':
    $servername = 'localhost';
    $username = 'databaseaccess';
    $password = 'cst336';
    $database = 'final'; 
    
    $dbConn = new PDO("mysql:host=$servername;dbname=$database", $username, $password);
    $dbConn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); 
    
    $rawJsonString = file_get_contents("php://input");
    $postedJsonData = json_decode($rawJsonString, true);
    
    // Allow any client to access
    header("Access-Control-Allow-Origin: *");
    // Let the client know the format of the data being returned
    header("Content-Type: application/json");
    
    
    
    // Check if request is to get races, then execute
    if ($postedJsonData['requestType'] == "getRaces")
    {
      $whereSql = "SELECT `id`, `date`, `time`, `location`, `hidden` from `races`";
      
      // The prepare caches the SQL statement for N number of parameters imploded above
      $whereStmt = $dbConn->prepare($whereSql);
      $whereStmt->execute();
      
      $records = $whereStmt->fetchAll(PDO::FETCH_ASSOC);
      $results = $records;
    }
    
    
    else if ($postedJsonData['requestType'] == "getOneRace")
    {
      $whereSql = "SELECT * FROM `races` WHERE id=:raceId";
      
      // The prepare caches the SQL statement for N number of parameters imploded above
      $whereStmt = $dbConn->prepare($whereSql);
      $whereStmt->bindParam(":raceId", $postedJsonData['raceId']);
      $whereStmt->execute();
      
      $records = $whereStmt->fetchAll(PDO::FETCH_ASSOC);
      $results = $records[0];
    }
    
    
    
    else if ($postedJsonData['requestType'] == "createRace")
    {
      $whereSql = "INSERT INTO `races` (`date`, `time`, `location`, `password`) values(:date,:time,:location, :password)";
      
      // The prepare caches the SQL statement for N number of parameters imploded above
      $whereStmt = $dbConn->prepare($whereSql);
      $whereStmt->bindParam(":date", $postedJsonData['newDate']);
      $whereStmt->bindParam(":time", $postedJsonData['newTime']);
      $whereStmt->bindParam(":location", $postedJsonData['newLocation']);
      $whereStmt->bindParam(":password", $postedJsonData['newPassword']);
      $whereStmt->execute();
    }
    
    
    else if ($postedJsonData['requestType'] == "cancelRace")
    {
      $whereSql = "DELETE FROM `races` WHERE id=:raceId";
      
      // The prepare caches the SQL statement for N number of parameters imploded above
      $whereStmt = $dbConn->prepare($whereSql);
      $whereStmt->bindParam(":raceId", $postedJsonData['deleteId']);
      $whereStmt->execute();
    }
    
    
    
    
    // Sending back down as JSON
    echo json_encode($results);
    
    break;
    
    
    
    
  case 'PUT':
    // Allow any client to access
    header("Access-Control-Allow-Origin: *");
    
    http_response_code(401);
    echo "Not Supported";
    break;
  case 'DELETE':
    // Allow any client to access
    header("Access-Control-Allow-Origin: *");
    
    http_response_code(401);
    break;
}
?>
