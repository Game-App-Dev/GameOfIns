// version 1.0.1
(function() {
  "use strict";

  let ended = false;
  let positive = true;
  let rolled = false;
  let index = 0;                                             // index of array MAXSTEP
  let stepCount = 0;
  let age = 0;
  let wage = 0;
  let original_wage = 0;                                     // wage for new kid when there's unemployment; stores the wage before unemployment
  let step = 0;
  let totalWage = 0;
  let smokeRisk = 0;
  let retired = 1;                                           // 1 is false (not retired); 0 is true (retired)
  let unemployed = 0;
  let firstSave = [[],[],[],[]];                             // first time buying saving plan
  let spAsset = 0;
  let planNum = 0;
  let totalExpense = 0;
  let totalCashOnHand = 0;
  let prevTCOH = 0;
  let totalInsurance = 0;
  let totalSaving = 0;
  let claimedAmount = 0;
  let stepID = "";
  let capName = "";
  let choices = new Array(20).fill(0);

  // expenses & expPlanNum & coverage could be combined into one array of objects {{exp, plan#, covrage}, {exp, plan#, coverage}, ...}
  let expenses = new Array(6).fill(0);
  let expPlanNum = new Array(5).fill(0);
  let coverages = [250000, 500000, 750000, 1000000];
  const MAXSTEP = [7, 7, 0, 1, 6, 6, 1, 2, 5, 5, 2, 3];      // maximum steps can be made on each side (x / y).
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
    id("result").addEventListener("click", showResult);
  }

  /**
   * Start button clicked and directs to menu page where displays rooms availability.
   */
  function startGame() {
    ended = false;
    qs(".prime-btn").style.marginLeft = "170px";
    qs("#roll-btn button").disabled = false;
    id("start-view").classList.add("hidden");
    id("insurance-type").classList.add("hidden");
    id("plan-selection").classList.add("hidden");
    id("save-selection").classList.add("hidden");
    // id("save-retrieve").classList.add("hidden");
    id("result").classList.add("hidden");
    id("saving-plan").classList.add("hidden");
    id("roll-page").classList.remove("hidden");
    id("game-view").classList.remove("hidden");
    id("roll-dice").addEventListener("click", rollDice);
    id("buy-yes").addEventListener("click", buyYes);
    id("buy-no").addEventListener("click", noButton);
    id("save-yes").addEventListener("click", saveYes);
    id("save-no").addEventListener("click", noButton);
    fetchPlayer();
  }

  /**
   * Menu button takes the user back to start page from game page.
   */
  function backToMenu() {
    ended = false;
    id("exit-confirm").style.display = "block";
    id("exit-yes").addEventListener("click", endGame);
    id("exit-no").addEventListener("click", function() {
      id("exit-confirm").style.display = "none";
    });
  }

  /**
   * Ends the game and restore variables to initial values
   */
  function endGame() {
    ended = true;
    positive = true;
    stepCount = 0;
    step = 0;
    index = 0;
    totalExpense = 0;
    totalCashOnHand = 0;
    totalSaving = 0;
    totalWage = 0;
    totalInsurance = 0;
    claimedAmount = 0;
    smokeRisk = 0;
    retired = 1;
    unemployed = 0;
    id("man3").style.transform = "translate(100px, 50px)";
    id("start-view").classList.remove("hidden");
    id("game-view").classList.add("hidden");
    id("exit-confirm").style.display = "none";
    id("roll-msg").innerText = "";
    id("roll-des").innerText = "";
    id("qm-exps").innerText = "0";
    id("ap-exps").innerText = "0";
    id("ci-exps").innerText = "0";
    id("li-exps").innerText = "0";
    id("sp-exps").innerText = "0";
    id("exps-amount").innerText = "0";
    id("net-cash-flow").innerText = "0";
    id("cash-on-hand").innerText = "0";
    id("exps-amount").innerText = "0";
    qs(".index-bar").style.width = "0%";
    qs("#roll-page h2").innerText = "Roll for next move";
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
    var divs = qsa("#other-exps > div");
    for (var i = 0; i < divs.length; i++) {
      id("other-exps").removeChild(divs[i]);
    }
    var as_divs = qsa("#asset-list > div");
    for (var i = 0; i < as_divs.length; i++) {
      id("asset-list").removeChild(as_divs[i]);
    }
    for (let i = 0; i < 20; i++) {
      choices[i] = 0;
    }
    for (let i = 0; i < 6; i++) {
      expenses[i] = 0;
      expPlanNum[i] = 0;
    }
    firstSave = [[],[],[],[]];

    id("death_age").innerText = "0";
    id("total_wage_earned").innerText = "0";
    id("claimed_amount").innerText = "0";
    id("total_ins").innerText = "0";
    id("amount_saved").innerText = "0";
    id("cash_left").innerText = "0";
    id("life_ins").innerText = "0";
    id("end_total").innerText = "0";
  }

  /**
   * Display home page rule pop up page/window
   */
  function startRule() {
    id("strtRules").style.display = "block";
    document.getElementsByClassName("close")[0].addEventListener("click", closePop);
  }

  /**
   * Display information page/window
   */
  function showInfo() {
    id("myInfo").style.display = "block";
    document.getElementsByClassName("close")[1].addEventListener("click", closePop);
  }

  /**
   * Display rule page/window in game view
   */
  function showRule() {
    id("myRules").style.display = "block";
    document.getElementsByClassName("close")[2].addEventListener("click", closePop);
  }

  /**
   * When the user clicks on <span> (x), close the popup
   */
  function closePop() {
    id("myInfo").style.display = "none";
    id("myRules").style.display = "none";
    id("strtRules").style.display = "none";
    id("endResult").style.display = "none";
    // id("save-retrieve").style.display = "none";
    removeImg;
  }

  /**
   * When the user clicks anywhere outside of the modal, close srtRules page
   */
  window.addEventListener("click", function(event) {
    if (event.target == id("strtRules")) {
      id("strtRules").style.display = "none";
    }
  });

  /**
   * When the user clicks anywhere outside of the modal, close myInfo page
   */
  window.addEventListener("click", function(event) {
    if (event.target == id("myInfo")) {
      id("myInfo").style.display = "none";
    }
  });

  /**
   * When the user clicks anywhere outside of the modal, close myRules page
   */
  window.addEventListener("click", function(event) {
    if (event.target == id("myRules")) {
      id("myRules").style.display = "none";
    }
  });

  /**
   * Requests player's information
   */
  function fetchPlayer() {
    fetch(BASEURL + "?mode=player", {
        headers : {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      })
      .then(checkStatus)
      .then(JSON.parse)
      .then(playerDetail)
      .catch();
  }

  /**
   * Updates players information (i.e. age, wage, total cash on hand, and etc)
   * @param {JSON} info
   */
  function playerDetail(info) {
    age = info[stepCount].age;
    original_wage = parseInt(info[stepCount].wage);
    wage = original_wage * retired;
    if (unemployed > 0) {
      wage = 0;
    }
    totalWage += wage;
    totalCashOnHand += wage;

    // adds wages from previous steps if rolled higher than 1
    for (let i = 1; i < step; i++) {
      totalWage += parseInt(info[stepCount - i].wage);
      totalCashOnHand += parseInt(info[stepCount - i].wage) - totalExpense;
      // checks if saving has ended in previous steps
      // adds expenses from previous steps
      for (let k = 0; k < 4; k++) {
        for (let j = 0; j < firstSave[k].length; j++) {
          let spStep = (stepCount - i) - firstSave[k][j];
          if (spStep <= 25) {
            if (k === 0) {
              totalCashOnHand += 12000;
            } else if (k === 1) {
              totalCashOnHand += 18000;
            } else if (k === 2) {
              totalCashOnHand += 24000;
            } else {
              totalCashOnHand += 30000;
            }
          }
        }
      }
    }
    updatePlayer();
  }

  /**
   * Update player information on the information page/window
   */
  function updatePlayer() {
    id("age").innerText = age;
    id("annual-wage").innerText = wage;
    id("wage").innerText = wage; // used to be wage
    id("exps-amount").innerText = totalExpense;
    id("net-cash-flow").innerText = wage - totalExpense;
    id("cash-on-hand").innerText = totalCashOnHand.toFixed(0);
  }

  /**
   * Moves the player randomly from 1 to 3 tile and updates the player according
   * to the events encountered
   */
  function rollDice() {
    clearOneTimeEvent();

    rolled = true;
    id("roll-msg").innerText = "";
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

    step = Math.floor(Math.random() * 3) + 1;
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
    unemployed -= step;
    prevTCOH = totalCashOnHand;
    if (stepID === "ret") {
      retired = 0;
    }
    fetchPlayer();
    fetchEvent();
    for (let i = 0; i <= 5; i++) {
      totalCashOnHand -= expenses[i];
    }
    updatePlayer();
    if (firstSave[0].length !== 0 || firstSave[1].length !== 0
                                  || firstSave[2].length !== 0
                                  || firstSave[3].length !== 0) {
      fetchSaving("sp");
    }
  }

  /**
   * Rolls the dice and calculates the x, y coordinates the player is stepping
   * on next
   * @param  {int} x          position x
   * @param  {int} y          position y
   * @param  {boolean} a      if not positive, then pass in -1; otherwise, 1
   * @param  {int} step       dice number rolled
   * @param  {int} max_x      maximum x position the chess can go
   * @param  {int} max_y      maximum y position the chess can go
   * @return {int[]}          returns new x and y coordinate.
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

  /**
   * Requests the event information
   */
  function fetchEvent() {
    fetch(BASEURL + "?mode=event")
      .then(checkStatus)
      .then(JSON.parse)
      .then(eventDetail)
      .catch();
  }

  /**
   * Displays the event details and image.
   * @param {JSON} info
   */
  function eventDetail(info) {
    qs("#roll-btn button").disabled = false;
    id("saving-plan").classList.add("hidden");
    id("roll-page").classList.add("hidden");
    id("insurance-type").classList.add("hidden");
    stepID = info[stepCount].id;
    let fullName = info[stepCount].name;
    let img = document.createElement("img");
    img.src = "img/" + fullName + ".jpg";
    img.alt = fullName;
    let splitName = fullName.split("_");
    for (let i = 0; i < splitName.length; i++) {
      splitName[i] = splitName[i].charAt(0).toUpperCase() + splitName[i].substring(1);
    }
    capName = splitName.join(" ");
    if (stepID === "qm" || stepID === "ap" || stepID === "ci" || stepID === "li") {
      id("insurance-type").classList.remove("hidden");
      id("ins-img").appendChild(img);
      qs("#insurance-type h2").innerText = capName + " Insurance";
      id("ins-des").innerText = info[stepCount].reg_des;
    }
    else if (stepID === "sp") {
      id("saving-plan").classList.remove("hidden");
      id("save-img").appendChild(img);
      id("save-des").innerText = info[stepCount].reg_des;
    }
    else if (stepID === "die") {
      id("roll-page").classList.remove("hidden");
      qs("#roll-btn button").disabled = true;
      qs("#roll-page h2").innerText = "R.I.P.";
      id("roll-des").innerText = info[stepCount].reg_des;
      showResult();
    }
    else {
      id("roll-page").classList.remove("hidden");
      id("event-img").appendChild(img);
      qs("#roll-page h2").innerText = capName;
      id("roll-des").innerText = info[stepCount].reg_des;
      eventExpenses();
    }
  }

  /**
   * Displays insurance buying options and updates information page/window
   * details.
   */
  function buyYes() {
    if (!id("insurance-type").classList.contains("hidden")) {
      id("insurance-type").classList.add("hidden");
    }
    id("plan-one").disabled = false;
    id("plan-two").disabled = false;
    id("plan-three").disabled = false;
    id("plan-four").disabled = false;
    id("plan-selection").classList.remove("hidden");
    id("plan-one").addEventListener("click", planOne);
    id("plan-two").addEventListener("click", planTwo);
    id("plan-three").addEventListener("click", planThree);
    id("plan-four").addEventListener("click", planFour);
    id("plan-back").addEventListener("click", planBack);
    let index = setIndex(0, false);
    if (expenses[index] != 0) {
      id("plan-one").disabled = true;
      id("plan-two").disabled = true;
      id("plan-three").disabled = true;
      id("plan-four").disabled = true;
    }
    fetchChoice(stepID);
  }

  /**
   * Displays saving options and updates saving information on information
   * page/window.
   */
  function saveYes() {
    if (!id("saving-plan").classList.contains("hidden")) {
      id("saving-plan").classList.add("hidden");
    }
    id("save-one").disabled = false;
    id("save-two").disabled = false;
    id("save-three").disabled = false;
    id("save-four").disabled = false;
    id("save-selection").classList.remove("hidden");
    id("save-one").addEventListener("click", planOne);
    id("save-two").addEventListener("click", planTwo);
    id("save-three").addEventListener("click", planThree);
    id("save-four").addEventListener("click", planFour);
    id("save-back").addEventListener("click", saveBack);
    fetchChoice(stepID);
  }

  /**
   * Player buys plan one and the expense will be updated.
   */
  function planOne() {
    hideSelection();
    id("roll-page").classList.remove("hidden");
    planNum = 0;
    if (stepID === 'sp') {
      firstSave[0].push(stepCount);
      fetchSaving(stepID);
    } else {
      nonSPexpense();
    }
    removeImg();
  }

  /**
   * Player buys plan two and the expense will be updated.
   */
  function planTwo() {
    hideSelection();
    id("roll-page").classList.remove("hidden");
    planNum = 1;
    if (stepID === 'sp') {
      firstSave[1].push(stepCount);
      fetchSaving(stepID);
    } else {
      nonSPexpense();
    }
    removeImg();
  }

  /**
   * Player buys plan three and the expense will be updated.
   */
  function planThree() {
    hideSelection();
    id("roll-page").classList.remove("hidden");
    planNum = 2;
    if (stepID === 'sp') {
      firstSave[2].push(stepCount);
      fetchSaving(stepID);
    } else {
      nonSPexpense();
    }
    removeImg();
  }

  /**
   * Player buys plan four and the expense will be updated.
   */
  function planFour() {
    hideSelection();
    id("roll-page").classList.remove("hidden");
    planNum = 3;
    if (stepID === 'sp') {
      firstSave[3].push(stepCount);
      fetchSaving(stepID);
    } else {
      nonSPexpense();
    }
    removeImg();
  }

  /**
   * Updates expense display on information page for Insurance other than Saving Plan.
   * Also updates the index bar by 25% of length when one of the insurance other than Saving plan in purchased.
   */
  function nonSPexpense() {
    let c_index = setIndex(planNum, true);
    let e_index = setIndex(0, false);
    let new_exp = Math.ceil(choices[c_index] * (1 + smokeRisk));

    expenses[e_index] += new_exp;
    expPlanNum[e_index] = planNum;
    totalInsurance += new_exp;

    id(stepID + "-exps").innerText = expenses[e_index];
    totalExpense += expenses[e_index];
    totalCashOnHand -= new_exp;

    let indexBar = 0;
    for (let i = 0; i < 4; i++) {
      if (expenses[i] > 0) indexBar += 25;
    }
    qs(".index-bar").style.width = indexBar + "%";
    updateCashFlow();
  }

  /**
   * Updates the expenses for events.
   * Also updates the Cash Flow section
   */
  function eventExpenses() {
    let div = document.createElement("div");
    let pn = document.createElement("p");
    let pa = document.createElement("p");
    div.style.clear = "both";
    pn.classList.add("alignleft");
    pa.classList.add("alignright");
    pn.innerText = capName;

    if (stepID === "smk") { // Smoking
      smokeRisk = 0.2;
      return;
    }
    if (stepID === "ue") { // Unemployed
      unemployed = 6;
      totalCashOnHand -= wage;
      wage = 0;
      updatePlayer();
      return;
    }
    if (stepID === "div") { // Divorce
      let divorce = prevTCOH / 2;
      totalCashOnHand -= divorce;
      updatePlayer();
      return;
    }
    if (stepID === "sl") { // Stock Loss
      let stockloss = prevTCOH * 0.2;
      totalCashOnHand -= stockloss;
      updatePlayer();
      return;
    }
    if (stepID === "ret") { // Retired
      totalCashOnHand -= wage;
      retired = 0;
      updatePlayer();
      return;
    }

    let payment = 0;
    if (stepID === "nk") { // New Kid
      payment = Math.ceil(original_wage * 0.1, 10);
    }
    if (stepID === "tf") { // Tuition Fee
      payment = 1000000;
    }
    if (stepID === "nc") { // New Car
      payment = 300000;
    }
    if (stepID === "nh") { // New House
      payment = 2000000;
    }
    if (stepID === "tra") { // Travel
      payment = 300000;
    }

    if (stepID === "ca") { // Car Accident
      payment = 90000;
      if (expenses[0] != 0) { // Quality Medical
        let qmCoverage;
        if (expPlanNum[0] === 0) {
          qmCoverage = 0.4;
        } else if (expPlanNum[0] === 1) {
          qmCoverage = 0.6;
        } else if (expPlanNum[0] === 2) {
          qmCoverage = 0.8;
        } else {
          qmCoverage = 1;
        }
        claimedAmount += payment * qmCoverage;
        payment *= (1 - qmCoverage);
      }
      if (expenses[1] != 0 && payment > 0) { // Accident Protection
        payment -= coverages[expPlanNum[1]];
        claimedAmount += coverages[expPlanNum[1]];
      }
      if (payment === 90000) {
        id("roll-msg").innerText = "Unfortunately, you don't have any insurance coverage. You have to pay full amount...";
      } else if (payment > 0) {
        id("roll-msg").innerText = "Yay! You have insurance coverage for a portion of the payment. You only need to pay $" + payment.toLocaleString('en-US') + "!";
      } else {
        id("roll-msg").innerText = "Yay! The insurance got full coverage for you! No payment needed!";
        return;
      }
    }

    if (stepID === "lb") { // Leg Broke
      payment = 120000;
      if (expenses[1] != 0) {
        payment -= coverages[expPlanNum[1]];
        claimedAmount += coverages[expPlanNum[1]];
      }
      if (payment === 120000) {
        id("roll-msg").innerText = "Unfortunately, you don't have any insurance coverage. You have to pay full amount...";
      } else if (payment > 0) {
        id("roll-msg").innerText = "Yay! You have insurance coverage for a portion of the payment. You only need to pay $" + payment.toLocaleString('en-US') + "!";
      } else {
        id("roll-msg").innerText = "Yay! The insurance got full coverage for you! No payment needed!";
        return;
      }
    }

    if (stepID === "mt") { // Medical Treatment
      payment = original_wage * 0.05;
      if (expenses[0] != 0) { // Quality Medical
        let qmCoverage;
        if (expPlanNum[0] === 0) {
          qmCoverage = 0.4;
        } else if (expPlanNum[0] === 1) {
          qmCoverage = 0.6;
        } else if (expPlanNum[0] === 2) {
          qmCoverage = 0.8;
        } else {
          qmCoverage = 1;
        }
        claimedAmount += payment * qmCoverage;
        payment *= (1 - qmCoverage);
        if (payment > 0) {
          id("roll-msg").innerText = "Yay! You have insurance coverage for a portion of the payment. You only need to pay $" + payment.toLocaleString('en-US') + "!";
        } else {
          id("roll-msg").innerText = "Yay! The insurance got full coverage for you! No payment needed!";
          return;
        }
      } else {
        id("roll-msg").innerText = "Unfortunately, you don't have any insurance coverage. You have to pay full amount...";
      }
    }

    if (stepID === "cn") { // Serious Sickness or Cancer
      payment = 1800000;
      if (expenses[0] != 0) { // Quality Medical
        let qmCoverage;
        if (expPlanNum[0] === 0) {
          qmCoverage = 0.4;
        } else if (expPlanNum[0] === 1) {
          qmCoverage = 0.6;
        } else if (expPlanNum[0] === 2) {
          qmCoverage = 0.8;
        } else {
          qmCoverage = 1;
        }
        claimedAmount += payment * qmCoverage;
        payment *= (1 - qmCoverage);
      }
      if (expenses[2] != 0 && payment > 0) { // Critical Illness
        payment -= coverages[expPlanNum[2]];
        claimedAmount += coverages[expPlanNum[2]];
      }
      if (payment === 1800000) {
        id("roll-msg").innerText = "Unfortunately, you don't have any insurance coverage. You have to pay full amount...";
      } else if (payment > 0) {
        id("roll-msg").innerText = "Yay! You have insurance coverage for a portion of the payment. You only need to pay $" + payment.toLocaleString('en-US') + "!";
      } else {
        id("roll-msg").innerText = "Yay! The insurance got full coverage for you! No payment needed!";
        return;
      }
    }

    pa.innerText = payment;
    totalExpense += payment;
    expenses[4] += payment;
    totalCashOnHand -= payment;

    div.setAttribute('id', stepID);
    pa.setAttribute('id', capName);
    div.appendChild(pn);
    div.appendChild(pa);
    id("other-exps").appendChild(div);
    updateCashFlow();
  }

  /**
   * Clears Car Accident, Leg Broke, Cancer, New Car, New House, Travel, and
   * Kid Tuition Fee events from 'Other Exenpses'
   */
  function clearOneTimeEvent() {
    if (id("ca")) { // Car Accident
      let caraccidentExp = parseInt(id("Car Accident").innerText);
      if (caraccidentExp > 0) {
        expenses[4] -= caraccidentExp;
        totalExpense -= caraccidentExp;
      }
      id("other-exps").removeChild(id("ca"));
    }
    if (id("lb")) { // Leg Broke
      let legbrokeExp = parseInt(id("Leg Broke").innerText);
      if (legbrokeExp > 0) {
        expenses[4] -= legbrokeExp;
        totalExpense -= legbrokeExp;
      }
      id("other-exps").removeChild(id("lb"));
    }
    if (id("cn")) { // Cancer
      let cancerExp = parseInt(id("Cancer").innerText);
      if (cancerExp > 0) {
        expenses[4] -= cancerExp;
        totalExpense -= cancerExp;
      }
      id("other-exps").removeChild(id("cn"));
    }
    if (id("nc")) { // New Car
      totalExpense -= 300000;
      expenses[4] -= 300000;
      id("other-exps").removeChild(id("nc"));
    }
    if (id("nh")) { // New House
      totalExpense -= 2000000;
      expenses[4] -= 2000000;
      id("other-exps").removeChild(id("nh"));
    }
    if (id("tra")) { // Travel
      totalExpense -= 300000;
      expenses[4] -= 300000;
      id("other-exps").removeChild(id("tra"));
    }
    if (id("tf")) { // Kid Tuition fee
      totalExpense -= 1000000;
      expenses[4] -= 1000000;
      id("other-exps").removeChild(id("tf"));
    }
  }

  /**
   * Updates saving amount for each choices.
   * @param {String} id
   */
  function fetchSaving(id) {
    fetch(BASEURL + "?mode=" + id)
    .then(checkStatus)
    .then(JSON.parse)
    .then(updateSaving)
    .catch(displayError);
  }

  /**
   * Updates the saving expense and asset. Expense would be subtracted when reached 25 steps.
   * @param  {JSON} info Fetched information from csv file.
   */
  function updateSaving(info) {
    if (!id(capName) && capName === "Saving") {
      spAsset += parseInt(info[stepCount - firstSave[planNum][firstSave[planNum].length-1]]["choice_" + (planNum+1)]);
      expenses[5] += parseInt(info[0]["choice_" + (planNum+1)]); // instead change it to saving expense array[]
      totalExpense += expenses[5];
      totalInsurance += expenses[5];
      totalSaving += expenses[5];
      addAsset(spAsset);
    } else {
      spAsset = 0;
      totalExpense -= expenses[5];
      totalCashOnHand += expenses[5];
      totalInsurance -= totalSaving;
      expenses[5] = 0;
      totalSaving = 0;
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < firstSave[i].length; j++) {
          let spStep = stepCount - firstSave[i][j];
          let n = 1;

          // if (spStep === 15 || spStep === 20) {
          //   let img = document.createElement("img");
          //   img.src = "img/saving.jpg";
          //   img.alt = "Saving Plan";
          //   id("retrieve-img").appendChild(img);
          //   id("save-retrieve").style.display = "block";
          //   id("retrieve-des").innerText = "You've reached " + spStep + " rounds of saving.";
          //   document.getElementsByClassName("close")[0].addEventListener("click", closePop);

          //   let retrieveYes = function() {
          //     totalCashOnHand += parseInt(info[spStep - 1]["choice_" + (i + 1)]);
          //     totalCashOnHand += parseInt(info[0]["choice_" + (i + 1)]);
          //     firstSave[i].splice(j, 1);
          //     // firstSave[i][j] = -10;
          //     expenses[5] = 0;
          //     id("Saving").innerText = parseInt(info[spStep - 1]["choice_" + (i + 1)]);
          //     id("sp-exps").innerText = expenses[5];
          //     spStep = 30; // random number set to bigger than 27
          //     updateCashFlow();
          //     closePop();
          //   };
          //   id("retrieve-yes").addEventListener("click", retrieveYes.bind(info, i));
          //   id("retrieve-no").addEventListener("click", closePop);
          // }

          // if (spStep === 20) {
          //   let img = document.createElement("img");
          //   img.src = "img/saving.jpg";
          //   img.alt = "Saving Plan";
          //   id("retrieve-img").appendChild(img);
          //   id("save-retrieve").style.display = "block";
          //   id("retrieve-des").innerText = "You've reached 20 rounds of saving.";
          //   document.getElementsByClassName("close")[0].addEventListener("click", closePop);

          //   let retrieveYes = function() {
          //     totalCashOnHand += parseInt(info[19]["choice_" + (i + 1)]);
          //     totalCashOnHand += parseInt(info[0]["choice_" + (i + 1)]);
          //     firstSave[i].splice(j, 1);
          //     spStep = 30; // random number set to bigger than 27
          //     expenses[5] = 0;
          //     id("Saving").innerText = parseInt(info[19]["choice_" + (i + 1)]);
          //     id("sp-exps").innerText = expenses[5];
          //     updateCashFlow();
          //     closePop();
          //   };
          //   id("retrieve-yes").addEventListener("click", retrieveYes.bind(info, i));
          //   id("retrieve-no").addEventListener("click", closePop);
          // }

          if (spStep === 25) {
            totalCashOnHand += parseInt(info[24]["choice_" + (i + 1)]);
            for (let k = 1; k < step; k++) {
              totalCashOnHand -= parseInt(info[0]["choice_" + (i + 1)]);
            }
          }

          if (spStep === 26 && (step === 2 || step === 3)) {
            totalCashOnHand += parseInt(info[24]["choice_" + (i + 1)]);
            if (step === 3) {
              totalCashOnHand -= parseInt(info[0]["choice_" + (i + 1)]);
            }
          }

          if (spStep === 27 && step === 3) {
            totalCashOnHand += parseInt(info[24]["choice_" + (i + 1)]);
            totalCashOnHand += parseInt(info[0]["choice_" + (i + 1)]);
          }

          if (spStep >= 25) {
            spStep = 24;
            n = 0;
          }
          totalSaving += parseInt(info[0]["choice_" + (i + 1)]);
          expenses[5] += parseInt(info[0]["choice_" + (i + 1)]) * n;
          spAsset += parseInt(info[spStep]["choice_" + (i + 1)]);
        }
      }
      totalExpense += expenses[5];
      totalInsurance += totalSaving;
    }
    for (let i = 0; i < step; i++) {
      totalCashOnHand -= expenses[5];
    }
    id("Saving").innerText = spAsset;
    id("sp-exps").innerText = expenses[5];
    updateCashFlow();
  }

  /**
   * Displays Expense Amount, Net Cash Flow, Cash on Hand on information page.
   * Player dies if Total Cash on Hand is below 0 (continues otherwise)
   */
  function updateCashFlow() {
    id("exps-amount").innerText = totalExpense;
    id("net-cash-flow").innerText = wage - totalExpense;
    id("cash-on-hand").innerText = totalCashOnHand.toFixed(0);
    if (totalCashOnHand < 0) {
      qs("#roll-btn button").disabled = true;
      id("roll-page").classList.remove("hidden");
      qs("#roll-page h2").innerText = "R.I.P.";
      id("roll-msg").innerText = "I'm sorry, you have a negative cash flow. You died from debt.";
      showResult();
    }
  }

  /**
   * Display the game result when the player dies.
   */
  function showResult() {
    id("result").classList.remove("hidden");
    qs(".prime-btn").style.marginLeft = "50px";
    id("endResult").style.display = "block";
    document.getElementsByClassName("resultClose")[0].addEventListener("click", closePop);
    let lifeInsurance = 0;
    if (expenses[3] != 0) lifeInsurance = coverages[expPlanNum[3]];
    id("death_age").innerText = age;
    id("total_wage_earned").innerText = totalWage;
    id("claimed_amount").innerText = claimedAmount;
    id("total_ins").innerText = totalInsurance;
    id("amount_saved").innerText = claimedAmount - totalInsurance;
    id("cash_left").innerText = totalCashOnHand.toFixed(0);
    id("life_ins").innerText = lifeInsurance;
    id("end_total").innerText = parseInt(totalCashOnHand.toFixed(0)) + lifeInsurance;
  }

  /**
   * Sets the index number of the arrays saving insurance details for the
   * according insurance plan
   * @param {int} i
   * @param {boolean} isChoices
   * @returns {int} index number
   */
  function setIndex(i, isChoices) {
    if (isChoices) {
      if (stepID === 'ap') {
        i += 4;
      } else if (stepID === 'ci') {
        i += 8;
      } else if (stepID === 'li') {
        i += 12;
      } else if (stepID === 'sp') {
        i += 16;
      }
    } else {
      if (stepID === 'ap') {
        i = 1;
      } else if (stepID === 'ci') {
        i = 2;
      } else if (stepID === 'li') {
        i = 3;
      } else if (stepID === 'sp') {
        i = 5;
      }
    }
    return i;
  }

  /**
   * Hides the saving or insurance plan selections.
   */
  function hideSelection() {
    if (!id("save-selection").classList.contains("hidden")) {
      id("save-selection").classList.add("hidden");
    }
    if (!id("plan-selection").classList.contains("hidden")) {
      id("plan-selection").classList.add("hidden");
    }
  }

  /**
   * Updates the asset section
   * @param {int} amount amount of the asset
   */
  function addAsset(amount) {
    let div = document.createElement("div");
    let pType = document.createElement("p");
    let pAmount = document.createElement("p");
    div.style.clear = "both";
    pType.classList.add("alignleft");
    pAmount.classList.add("alignright");
    pType.innerText = capName;
    pAmount.innerText = amount;
    pAmount.setAttribute('id', capName);
    div.appendChild(pType);
    div.appendChild(pAmount);
    id("asset-list").appendChild(div);
  }

  /**
   * Requests information of the insurance
   * @param {String} id event id
   */
  function fetchChoice(id) {
    fetch(BASEURL + "?mode=" + id)
    .then(checkStatus)
    .then(JSON.parse)
    .then(choiceDetail)
    .catch();
  }

  /**
   * Displays the insurance amount for each choice.
   * @param {JSON} info
   */
  function choiceDetail(info) {
    if (stepID != "sp") {
      if (rolled) {
        var iStart = setIndex(0, true);
        var iStop = iStart + 4;
        var num = 1;
        for (var i = iStart; i < iStop; i++) {
          choices[i] = parseInt(info[age-20]["choice_"+num]);
          num++;
        }
        rolled = false;
      }
      let cov1 = info[age-20].coverage_1;
      let cov2 = info[age-20].coverage_2;
      let cov3 = info[age-20].coverage_3;
      let cov4 = info[age-20].coverage_4;
      if (stepID != "qm") {
        parseInt(cov1).toLocaleString('en-US');
        parseInt(cov2).toLocaleString('en-US');
        parseInt(cov3).toLocaleString('en-US');
        parseInt(cov4).toLocaleString('en-US');
      }
      id("i1").innerText = "Choice1: $" + Math.ceil(info[age-20].choice_1 * (1 + smokeRisk)).toLocaleString('en-US') + " Coverage: " + cov1;
      id("i2").innerText = "Choice2: $" + Math.ceil(info[age-20].choice_2 * (1 + smokeRisk)).toLocaleString('en-US') + " Coverage: " + cov2;
      id("i3").innerText = "Choice3: $" + Math.ceil(info[age-20].choice_3 * (1 + smokeRisk)).toLocaleString('en-US') + " Coverage: " + cov3;
      id("i4").innerText = "Choice4: $" + Math.ceil(info[age-20].choice_4 * (1 + smokeRisk)).toLocaleString('en-US') + " Coverage: " + cov4;
    } else {
      if (rolled) rolled = false;
      id("s1").innerText = "Choice1: $12,000";
      id("s2").innerText = "Choice2: $18,000";
      id("s3").innerText = "Choice3: $24,000";
      id("s4").innerText = "Choice4: $30,000";
    }
  }

  /**
   * Hides selection page and shows insurance information when `Back` button clicked.
   */
  function planBack() {
    id("insurance-type").classList.remove("hidden");
    id("plan-selection").classList.add("hidden");
  }

  /**
   * Hides selection page and shows saving information when `Back` button clicked.
   */
  function saveBack() {
    id("saving-plan").classList.remove("hidden");
    id("save-selection").classList.add("hidden");
  }

  /**
   * Player decide not to purchase any insurance/saving plan, roll page shows up
   * for player to roll for next step.
   */
  function noButton() {
    qs("#roll-btn button").disabled = false;
    id("insurance-type").classList.add("hidden");
    id("saving-plan").classList.add("hidden");
    id("roll-page").classList.remove("hidden");
    qs("#roll-page h2").innerText = "Roll for next move";
    id("roll-des").innerText = "";
    removeImg();
  }

  /**
   * Removes the image on the event window.
   */
  function removeImg() {
    let iimg = qs("#ins-img img");
    let simg = qs("#save-img img");
    let eimg = qs("#event-img img");
    let rimg = qs("#retrieve-img img");
    if (iimg != null) {
      id("ins-img").removeChild(iimg);
    }
    if (simg != null) {
      id("save-img").removeChild(simg);
    }
    if (eimg != null) {
      id("event-img").removeChild(eimg);
    }
    if (rimg != null) {
      id("retrieve-img").removeChild(rimg);
    }
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
   * @param  {string} selector - CSS query selector.
   * @return {object} All DOM object matching the query.
   */
  function qsa(selector) {
    return document.querySelectorAll(selector);
  }

  /**
   * Displays the error message when the fetch did not pass successfully.
   */
  function displayError() {
    id("error-text").innerText = "Something went wrong with the Saving request. Please try again later.";
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
