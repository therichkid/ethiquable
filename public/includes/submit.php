<?php
  $_POST = json_decode(file_get_contents("php://input"), true);
  $data = $_POST["data"];

  // Validity checks
  if (!is_array($data) || isset($data["_hp"]) || $data["_timer"] < 5000) {
    throw new Exception("Validitätsprüfung nicht überstanden. Bitte versuchen Sie es noch einmal.");
  }
  unset($data["_hp"]);
  unset($data["_timer"]);

  // Set type specific values
  if ($_POST["type"] === "contact") {
    $id = 4247;
  } else if ($_POST["type"] === "trade") {
    $id = 4998;
  } else {
    throw new Exception("Unbekannter POST-Typ.");
  }
  $header = "Content-Type: application/x-www-form-urlencoded";
  $content = http_build_query($data);
  $base_url = "http://admin.ethiquable.de/wp-json/";
  $path = "contact-form-7/v1/contact-forms/" . $id . "/feedback";
  $url = $base_url . $path;

  // stream_context_create
  $options = array(
		"http" => array(
      "header" => $header . PHP_EOL,
			"method" => "POST",
			"content" => $content
		)
	);
	$context = stream_context_create($options);
	$response = file_get_contents($url, false, $context);

  echo $response;
