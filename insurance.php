<?php

  if (isset($_GET["mode"])) {
    $mode = $_GET["mode"];
    if ($mode !== "event" && $mode !== "player") {
      display_error("Error: Please provide a valid mode (event, player).1");
    } else if ($mode === "event") {
      // Set your CSV events
      $events = "data/step_event.csv";
      // Do it
      $data = csvJSON($events);
      // Print it out as JSON
      echo json_encode($data);
    } else if ($mode === "player") {
      $player = "data/player_wage_age/p1.csv";
      $data = csvJSON($player);
      echo json_encode($data);
    }
  } else {
    display_error("Error: Please provide a valid mode (event, player).2");
  }

  function csvJSON($data) {
    // open csv file
    if (!($fp = fopen($data, 'r'))) {
        display_error("Can't open file...");
    }

    //read csv headers
    $key = fgetcsv($fp, "1024", ",");

    // parse csv rows into array
    $json = array();
        while ($row = fgetcsv($fp, "1024", ",")) {
        $json[] = array_combine($key, $row);
        // $json[trim($row[0])] = array_combine($key, $row);
    }
    // release file handle
    fclose($fp);
    return $json;
  }

  /* Displays the 400 invalid request message. */
  function display_error($text) {
    header("HTTP/1.1 400 Invalid Request");
    header("Content-type: text/plain");
    echo $text;
  }

?>
