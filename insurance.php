<?php

  if (isset($_GET["mode"])) {
    $mode = $_GET["mode"];
    if ($mode !== "event") {
      display_error("Error: Please provide a mode of event.");
    } else {
      // Set your CSV events
      $events = "data/step_event.csv";
      // Do it
      $data = csvJSON($events);
      // Print it out as JSON
      echo json_encode($data);
    }
  } else {
    display_error("Error: Please provide a mode of event.");
  }

  function csvJSON($events) {
    // open csv file
    if (!($fp = fopen($events, 'r'))) {
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
