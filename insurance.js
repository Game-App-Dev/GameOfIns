(function() {
  "use strict";

  let ended = false;
  let positive = true;
  let index = 0;                                        // index of array MAXSTEP
  let stepCount = 0;
  const MAXSTEP = [7, 7, 0, 1, 6, 6, 1, 2, 5, 5, 2, 3]; // maximum steps can be made on each side (x / y).
  const BASEURL = "insurance.php";


  /**
   * Add a function that will be called when the window is loaded.
   */
  window.addEventListener("load", init);

  /**
   * Calls the corresponding functions when buttons clicked.
   */
  function init() {
    id("start").addEventListener("click", startGame);
    id("startRules").addEventListener("click", startRule);
    id("menu").addEventListener("click", backToMenu);
    id("info").addEventListener("click", showInfo);
    id("rules").addEventListener("click", showRule);
  }

  /**
   * Start button clicked and directs to menu page where displays rooms availability.
   */
  function startGame() {
    ended = false;
    qs("#roll-btn button").disabled = false;
    id("start-view").classList.add("hidden");
    id("insurance-type").classList.add("hidden");
    id("plan-selection").classList.add("hidden");
    id("saving-plan").classList.add("hidden");
    id("roll-page").classList.remove("hidden");
    id("game-view").classList.remove("hidden");
    id("roll-dice").addEventListener("click", rollDice);

    id("buy-yes").addEventListener("click", buyYes);
    id("buy-no").addEventListener("click", noButton);
    // id("save-yes").addEventListener("click", saveYes);
    id("save-no").addEventListener("click", noButton)
    fetchPlayer();
  }

  /**
   * Menu button takes the user back to start page from game page.
   */
  function backToMenu() {
    stepCount = 0;
    index = 0;
    ended = false;
    positive = true;
    id("exit-confirm").style.display = "block";
    id("exit-yes").addEventListener("click", endGame);
    id("exit-no").addEventListener("click", function() {
      id("exit-confirm").style.display = "none";
    });
  }

  function endGame() {
    ended = true;
    positive = true;
    index = 0;
    id("man3").style.transform = "translate(100px, 50px)";
    id("start-view").classList.remove("hidden");
    id("game-view").classList.add("hidden");
    id("exit-confirm").style.display = "none";
    let iimg = qs("#ins-img img");
    let simg = qs("#save-img img");
    let eimg = qs("#event-img img");
    if (iimg != null) {
      id("ins-img").removeChild(iimg);
    }
    if (simg != null) {
      id("save-img").removeChild(simg);
    }
    if (eimg != null) {
      id("event-img").removeChild(eimg);
    }
  }

  function startRule() {
    id("strtRules").style.display = "block";
    document.getElementsByClassName("close")[0].addEventListener("click", closePop);
  }

  // Display information page/window
  function showInfo() {
    id("myInfo").style.display = "block";
    document.getElementsByClassName("close")[1].addEventListener("click", closePop);
  }

  function showRule() {
    id("myRules").style.display = "block";
    document.getElementsByClassName("close")[2].addEventListener("click", closePop);
  }

  // When the user clicks on <span> (x), close the popup
  function closePop() {
    id("myInfo").style.display = "none";
    id("myRules").style.display = "none";
    id("strtRules").style.display = "none";
  }

  // When the user clicks anywhere outside of the modal, close srtRules page
  window.addEventListener("click", function(event) {
    if (event.target == id("strtRules")) {
      id("strtRules").style.display = "none";
    }
  });

  // When the user clicks anywhere outside of the modal, close myInfo page
  window.addEventListener("click", function(event) {
    if (event.target == id("myInfo")) {
      id("myInfo").style.display = "none";
    }
  });

  // When the user clicks anywhere outside of the modal, close myRules page
  window.addEventListener("click", function(event) {
    if (event.target == id("myRules")) {
      id("myRules").style.display = "none";
    }
  });

  fetchPlayer() {
    fetch(BASEURL + "?mode=player")
      .then(checkStatus)
      .then(JSON.parse)
      .then(eventDetail)
      .catch();
  }

  /**
   * Move the player randomly from 1 to 3 grid.
   */
  function rollDice() {
    let eimg = qs("#event-img img");
    if (eimg != null) {
      id("event-img").removeChild(eimg);
    }
    qs("#roll-btn button").disabled = true;
    let element = id("man3");
    const style = window.getComputedStyle(element, null);
    const matrix = style.transform || style.webkitTransform || style.mozTransform;
    const matrixValues = matrix.match(/matrix.*\((.+)\)/)[1].split(', ')
    let x = parseInt(matrixValues[4]);
    let y = parseInt(matrixValues[5]);
    let x_step = MAXSTEP[index];
    let y_step = MAXSTEP[index+1];
    let max_x = 113 * x_step + 100;
    let max_y = 67 * y_step + 50;

    let step = Math.floor(Math.random() * 3) + 1;
    if (index === 10 && x === max_x && y === max_y + 2 * 67) {
      step = Math.floor(Math.random() * 2) + 1;
    } else if (index === 10 && y === max_y + 67) {
      step = 1;
    }

    if (positive) {
      [x, y] = helperRoll(x, y, 1, step, max_x, max_y);
    } else {
      [x, y] = helperRoll(x, y, -1, step, max_x, max_y);
    }
    id("man3").style.transform = "translate("+x+"px,"+y+"px)";
    stepCount += step;
    fetchEvent();
  }

  /**
   * helper function for rollDice()
   * @param  {[type]} x     position x
   * @param  {[type]} y     position y
   * @param  {[type]} a     if not positive, then pass in -1; otherwise, 1
   * @param  {[type]} step  dice number rolled
   * @param  {[type]} max_x maximum x position the chess can go
   * @param  {[type]} max_y maximum y position the chess can go
   * @return {[type]}       returns new x and y coordinate.
   */
  function helperRoll(x, y, a, step, max_x, max_y) {
    if (a*x < a*max_x) {
      if (a*(x + a*(113 * step)) > a*max_x) {
        let extra_length = a*(x + a*(113 * step)) - a*max_x;
        x = max_x;
        let extra_step = extra_length / 113;
        y = y + a*(67 * extra_step);
      } else {
        x = x + a*(113 * step);
      }
    } else {
      if (a*(y + a*(67 * step)) > a*max_y) {
        let extra_length = a*(y + a*(67 * step)) - a*max_y;
        y = max_y;
        let extra_step = extra_length / 67;
        x = max_x - a*(113 * extra_step);
        positive = !positive;
        index += 2;
      } else {
        y = y + a*(67 * step);
      }
    }
    return [x, y];
  }

  function fetchEvent() {
    fetch(BASEURL + "?mode=event")
      .then(checkStatus)
      .then(JSON.parse)
      .then(eventDetail)
      .catch();
  }

  function eventDetail(info) {
    qs("#roll-btn button").disabled = false;
    id("saving-plan").classList.add("hidden");
    id("roll-page").classList.add("hidden");
    id("insurance-type").classList.add("hidden");
    let stepID = info[stepCount].id;
    let fullName = info[stepCount].name;
    let img = document.createElement("img");
    img.src = "img/" + fullName + ".jpg";
    img.alt = fullName;
    let splitName = fullName.split("_");
    for (let i = 0; i < splitName.length; i++) {
      splitName[i] = splitName[i].charAt(0).toUpperCase() + splitName[i].substring(1);
    }
    let capName = splitName.join(" ");
    if (stepID === "qm" || stepID === "ap" || stepID === "ci" || stepID === "li") {
      id("insurance-type").classList.remove("hidden");
      id("ins-img").appendChild(img);
      qs("#insurance-type h2").innerText = capName + " Insurance";
      id("ins-des").innerText = info[stepCount].reg_des;
    } else if (stepID === "sp") {
      id("saving-plan").classList.remove("hidden");
      id("save-img").appendChild(img);
      id("save-des").innerText = info[stepCount].reg_des;
    } else if (stepID === "die") {
      id("roll-page").classList.remove("hidden");
      qs("#roll-btn button").disabled = true;
      qs("#roll-page h2").innerText = "R.I.P.";
      id("roll-des").innerText = info[stepCount].reg_des;
    } else {
      id("roll-page").classList.remove("hidden");
      id("event-img").appendChild(img);
      qs("#roll-page h2").innerText = capName;
      id("roll-des").innerText = info[stepCount].reg_des;
    }
  }

  function buyYes() {
    id("insurance-type").classList.add("hidden");
    id("plan-selection").classList.remove("hidden");
    // id("plan-one").addEventListener("click", planOne);
    // id("plan-two").addEventListener("click", planTwo);
    // id("plan-three").addEventListener("click", planThree);
    // id("plan-four").addEventListener("click", planFour);
    id("plan-back").addEventListener("click", planBack);
  }

  function noButton() {
    qs("#roll-btn button").disabled = false;
    id("insurance-type").classList.add("hidden");
    id("saving-plan").classList.add("hidden");
    id("roll-page").classList.remove("hidden");
    qs("#roll-page h2").innerText = "Roll for next move";
    id("roll-des").innerText = "";
    let iimg = qs("#ins-img img");
    let simg = qs("#save-img img");
    let eimg = qs("#event-img img");
    if (iimg != null) {
      id("ins-img").removeChild(iimg);
    }
    if (simg != null) {
      id("save-img").removeChild(simg);
    }
    if (eimg != null) {
      id("event-img").removeChild(eimg);
    }
  }

  function planBack() {
    id("insurance-type").classList.remove("hidden");
    id("plan-selection").classList.add("hidden");
  }



  /* ------------------------------ Helper Functions  ------------------------------ */
  // Note: You may use these in your code, but do remember that your code should not have
  // any functions defined that are unused.

  /**
   * Returns the element that has the ID attribute with the specified value.
   * @param {string} idName - element ID
   * @returns {object} DOM object associated with id.
   */
  function id(idName) {
    return document.getElementById(idName);
  }

  /**
   * Returns the first element that matches the given CSS selector.
   * @param {string} selector - CSS query selector.
   * @returns {object} The first DOM object matching the query.
   */
  function qs(selector) { // less common, but you may find it helpful
    return document.querySelector(selector);
  }

  /**
   * Returns all the element that matches the given css selector.
   * @param  {[type]} selector - CSS query selector.
   * @return {[type]} All DOM object matching the query.
   */
  function qsa(selector) {
    return document.querySelectorAll(selector);
  }

  /**
   * Displays the error message when the fetch did not pass successfully.
   */
  function displayError() {
    id("error-text").innerText = "Something went wrong with the request. Please try again later.";
    id("error-text").classList.remove("hidden");
  }

  /**
  *  Function to check the status of an Ajax call, boiler plate code to include,
  *  based on: https://developers.google.com/web/updates/2015/03/introduction-to-fetch
  *  updated from
  *  https://stackoverflow.com/questions/29467426/fetch-reject-promise-with-json-error-object
  *  @param {Object} response the response text from the url call
  *  @return {Object} did we succeed or not, so we know whether or not to continue with the
  *  handling of this promise
  */
  function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
      return response.text();
    } else {
      return Promise.reject(new Error(response.status + ": " + response.statusText));
    }
  }
})();
