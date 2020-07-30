(function() {
  "use strict";

  let ended = false;
  let positive = true;
  const MAXSTEP = [7, 7, 0, 1, 6, 6, 1, 2, 5, 5, 2, 3];
  let index = 0;



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

    let x_step = MAXSTEP[index];
    let y_step = MAXSTEP[index+1];
    if (positive) {
      let max_x = 153 * x_step + 100;
      let max_y = 73 * y_step + 50;
      if (x < max_x) {
        if ((x + 153 * step) > max_x) {
          let extra_length = (x + 153 * step) - max_x;
          x = max_x;
          let extra_step = extra_length / 153;
          y = y + 73 * extra_step;
        } else {
          x = x + 153 * step;
        }
      } else {
        if ((y + 73 * step) > max_y) {
          let extra_length = (y + 73 * step) - max_y;
          y = max_y;
          let extra_step = extra_length / 73;
          x = max_x - (153 * extra_step);
          positive = !positive;
          index += 2;
        } else {
          y = y + 73 * step;
        }
      }
    } else {
      let max_x = 153 * x_step + 100;
      let max_y = 73 * y_step + 50;
      if (x > max_x) {
        if ((x - 153 * step) < max_x) {
          let extra_length = max_x - (x - 153 * step);
          x = max_x;
          let extra_step = extra_length / 153;
          y = y - 73 * extra_step;
        } else {
          x = x - 153 * step;
        }
      } else {
        if ((y - 73 * step) < max_y) {
          let extra_length = max_y - (y - 73 * step);
          y = max_y;
          let extra_step = extra_length / 73;
          x = max_x + (153 * extra_step);
          positive = !positive;
          index += 2;
        } else {
          y = y - 73 * step;
        }
      }
    }
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
