(function() {
  "use strict";

  let ended = false;
  let totalStep = 7;
  const sideRound = 3;

  // Player step count
  let stepCount = 0;
  let sideCount = 0;



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
    id("start-view").classList.add("hidden");
    id("insurance-type").classList.add("hidden");
    id("plan-selection").classList.add("hidden");
    id("saving-plan").classList.add("hidden");
    id("roll-page").classList.remove("hidden");
    id("game-view").classList.remove("hidden");
    id("roll-dice").addEventListener("click", rollDice);


    id("buy-yes").addEventListener("click", buyYes);
    id("buy-no").addEventListener("click", noButton);
    //id("save-yes").addEventListener("click", saveYes);
    id("save-no").addEventListener("click", noButton)
  }

  /**
   * Menu button takes the user back to start page from game page.
   */
  function backToMenu() {
    ended = true;
    id("start-view").classList.remove("hidden");
    id("game-view").classList.add("hidden");
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

  /**
   * Move the player randomly from 1 to 3 spaces.
   */
  function rollDice() {
    let step = Math.floor(Math.random() * 3) + 1;
    let element = id("man3");
    const style = window.getComputedStyle(element, null);
    const matrix = style.transform || style.webkitTransform || style.mozTransform;
    const matrixValues = matrix.match(/matrix.*\((.+)\)/)[1].split(', ')
    let x = parseInt(matrixValues[4]);
    let y = parseInt(matrixValues[5]);
    if (stepCount < totalStep && stepCount + step <= totalStep) {
      x = 153 * step + x;
    } else if (stepCount < totalStep && stepCount + step > totalStep) {
      let xStep = totalStep - stepCount;
      x = 153 * xStep + x;
      let yStep = step - xStep;
      y = 73 * yStep + y;
      console.log(yStep);
      console.log(y);
    } else if (stepCount = totalStep) {
      y = 73 * step + y;
    }
    stepCount += step;
    id("man3").style.transform = "translate("+x+"px,"+y+"px)";
    qs("#rolled-number").innerText = step;
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
    id("insurance-type").classList.add("hidden");
    id("saving-plan").classList.add("hidden");
    id("roll-page").classList.remove("hidden");
    //id("roll-dice").addEventListener("click", rollDice);
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
})();
