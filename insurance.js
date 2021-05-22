// version 1.0.0
(function() {
  "use strict";

  let ended = false;
  let positive = true;
  let rolled = false;
  let index = 0;                                              // index of array MAXSTEP
  let stepCount = 0;
  let age = 0;
  let wage = 0;
  let totalWage = 0;
  let smokeRisk = 0;
  let unemployed = 0;
  let firstSave = [[],[],[],[]];                             // first time buying saving plan
  let spAsset = 0;
  let planNum = 0;
  let totalExpense = 0;
  let totalCashOnHand = 0;
  let totalInsurance = 0;
  let totalSaving = 0;
  let claimedAmount = 0;
  let stepID = "";
  let capName = "";
  let choices = new Array(20).fill(0);

  // expenses & expPlanNum & coverage could be combined into one array of objects {{exp, plan#, covrage}, {exp, plan#, coverage}, ...}
  let expenses = new Array(5).fill(0);
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
    qs("#roll-btn button").disabled = false;
    id("start-view").classList.add("hidden");
    id("insurance-type").classList.add("hidden");
    id("plan-selection").classList.add("hidden");
    id("save-selection").classList.add("hidden");
    id("saving-plan").classList.add("hidden");
    id("roll-page").classList.remove("hidden");
    id("game-view").classList.remove("hidden");
    id("roll-dice").addEventListener("click", rollDice);
    id("buy-yes").addEventListener("click", buyYes);
    id("buy-no").addEventListener("click", noButton);
    id("save-yes").addEventListener("click", saveYes);
    id("save-no").addEventListener("click", noButton)
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

  function endGame() {
    ended = true;
    positive = true;
    stepCount = 0;
    index = 0;
    totalExpense = 0;
    totalCashOnHand = 0;
    totalSaving = 0;
    totalWage = 0;
    totalInsurance = 0;
    claimedAmount = 0;
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
    for (let i = 0; i < 5; i++) {
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
    id("endResult").style.display = "none";
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

  function fetchPlayer() {
    fetch(BASEURL + "?mode=player")
      .then(checkStatus)
      .then(JSON.parse)
      .then(playerDetail)
      .catch();
  }

  function playerDetail(info) {
    age = info[stepCount].age;
    if (unemployed <= 1) {
      wage = parseInt(info[stepCount].wage);
    } else {
      wage = 0;
    }
    totalWage += wage;
    totalCashOnHand += wage - totalExpense;
    id("age").innerText = age;
    id("annual-wage").innerText = wage;
    id("wage").innerText = wage;
    id("exps-amount").innerText = totalExpense;
    id("net-cash-flow").innerText = wage - totalExpense;
    id("cash-on-hand").innerText = totalCashOnHand;
  }

  /**
   * Move the player randomly from 1 to 3 grid.
   */
  function rollDice() {
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
    unemployed -= step;
    fetchEvent();
    fetchPlayer();
    if (firstSave[0].length !== 0 || firstSave[1].length !== 0 ||
                           firstSave[2].length !== 0 || firstSave[3].length !== 0) {
      fetchSaving("sp");
    }
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
    } else if (stepID === "sp") {
      id("saving-plan").classList.remove("hidden");
      id("save-img").appendChild(img);
      id("save-des").innerText = info[stepCount].reg_des;
    } else if (stepID === "die") {
      id("roll-page").classList.remove("hidden");
      qs("#roll-btn button").disabled = true;
      qs("#roll-page h2").innerText = "R.I.P.";
      id("roll-des").innerText = info[stepCount].reg_des;
      showResult();
    } else {
      id("roll-page").classList.remove("hidden");
      id("event-img").appendChild(img);
      qs("#roll-page h2").innerText = capName;
      id("roll-des").innerText = info[stepCount].reg_des;
      if (stepID === "smk" || stepID === "ca" || stepID === "nk" || stepID === "lb" ||
          stepID === "ue" || stepID === "tf" || stepID === "nc" || stepID === "nh" ||
          stepID === "tra" || stepID === "div" || stepID === "sl") eventExpenses();
    }
  }

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
   * Also updates the Cash Flor section
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
      return;
    }
    if (stepID === "div") { // Divorce
      totalCashOnHand /= 2;
      return;
    }
    if (stepID === "sl") { // Stock Loss
      totalCashOnHand *= 0.8;
      return;
    }

    let payment;
    if (stepID === "nk") { // New Kid
      payment = Math.ceil(wage * 0.1, 10);
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
        payment *= (1 - qmCoverage);
        claimedAmount += payment * qmCoverage;
      }
      if (expenses[1] != 0 && payment > 0) { // Accident Protection
        payment -= coverages[expPlanNum[1]];
        claimedAmount += coverages[expPlanNum[1]];
      }
      if (payment === 90000) {
        id("roll-msg").innerText = "Unfortunately, you don't have any insurance coverage. You have to pay full amount...";
      } else if (payment > 0) {
        id("roll-msg").innerText = "Yay! You have insurance coverage for a portion of the payment. You only need to pay $" + payment + "!";
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
        if (payment > 0) {
          id("roll-msg").innerText = "Yay! You have insurance coverage for a portion of the payment. You only need to pay $" + payment + "!";
        } else {
          id("roll-msg").innerText = "Yay! The insurance got full coverage for you! No payment needed!";
          return;
        }
      } else {
        id("roll-msg").innerText = "Unfortunately, you don't have any insurance coverage. You have to pay full amount...";
      }
    }

    if (stepID === "mt") { // Medical Treatment
      payment = wage * 0.05;
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
        payment *= (1 - qmCoverage);
        claimedAmount += payment * qmCoverage;
        if (payment > 0) {
          id("roll-msg").innerText = "Yay! You have insurance coverage for a portion of the payment. You only need to pay $" + payment + "!";
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
        payment *= (1 - qmCoverage);
        claimedAmount += payment * qmCoverage;
      }
      if (expenses[2] != 0 && payment > 0) { // Critical Illness
        payment -= coverages[expPlanNum[2]];
        claimedAmount += coverages[expPlanNum[2]];
      }
      if (payment === 1800000) {
        id("roll-msg").innerText = "Unfortunately, you don't have any insurance coverage. You have to pay full amount...";
      } else if (payment > 0) {
        id("roll-msg").innerText = "Yay! You have insurance coverage for a portion of the payment. You only need to pay $" + payment + "!";
      } else {
        id("roll-msg").innerText = "Yay! The insurance got full coverage for you! No payment needed!";
        return;
      }
    }

    pa.innerText = payment;
    totalExpense += payment;
    totalCashOnHand -= payment;
    pa.setAttribute('id', capName);
    div.appendChild(pn);
    div.appendChild(pa);
    id("other-exps").appendChild(div);
    updateCashFlow();
  }

  // update saving amount for each choices.
  function fetchSaving(id) {
    fetch(BASEURL + "?mode=" + id)
    .then(checkStatus)
    .then(JSON.parse)
    .then(updateSaving)
    .catch(displayError);
  }

  /**
   * Updates the saving expense and asset. Expense would be subtracted when reached 25 steps.
   * @param  {[type]} info Fetched information from csv file.
   */
  function updateSaving(info) {
    if (!id(capName) && capName === "Saving") {
      spAsset += parseInt(info[stepCount - firstSave[planNum][firstSave[planNum].length-1]]["choice_" + (planNum+1)]);
      expenses[4] += parseInt(info[0]["choice_" + (planNum+1)]);
      totalExpense += expenses[4];
      totalInsurance += expenses[4];
      totalSaving += expenses[4];
      addAsset(spAsset);
    } else {
      spAsset = 0;
      totalExpense -= expenses[4];
      totalCashOnHand += expenses[4];
      totalInsurance -= totalSaving;
      expenses[4] = 0;
      totalSaving = 0;
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < firstSave[i].length; j++) {
          let spStep = stepCount - firstSave[i][j];
          let n = 1;
          if (spStep > 24) {
            spStep = 24;
            n = 0;
          }
          totalSaving += parseInt(info[0]["choice_" + (i + 1)]);
          expenses[4] += parseInt(info[0]["choice_" + (i + 1)]) * n;
          spAsset += parseInt(info[spStep]["choice_" + (i + 1)]);
        }
      }
      totalInsurance += totalSaving;
    }
    totalCashOnHand -= expenses[4];
    id("Saving").innerText = spAsset;
    id("sp-exps").innerText = expenses[4];
    updateCashFlow();
  }

  function updateCashFlow() {
    id("exps-amount").innerText = totalExpense;
    id("net-cash-flow").innerText = wage - totalExpense;
    id("cash-on-hand").innerText = totalCashOnHand;
    if (totalCashOnHand < 0) {
      qs("#roll-btn button").disabled = true;
      id("roll-page").classList.remove("hidden");
      qs("#roll-page h2").innerText = "R.I.P.";
      id("roll-msg").innerText = "I'm sorry, you have a negative cash flow. You died from debt.";
      showResult();
    }
  }

  function showResult() {
    id("endResult").style.display = "block";
    document.getElementsByClassName("resultClose")[0].addEventListener("click", closePop);
    let lifeInsurance = 0;
    if (expenses[3] != 0) lifeInsurance = coverages[expPlanNum[3]];
    id("death_age").innerText = age;
    id("total_wage_earned").innerText = totalWage;
    id("claimed_amount").innerText = claimedAmount;
    id("total_ins").innerText = totalInsurance;
    id("amount_saved").innerText = 0;
    id("cash_left").innerText = totalCashOnHand;
    id("life_ins").innerText = lifeInsurance;
    id("end_total").innerText = totalCashOnHand + lifeInsurance;
  }

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
        i = 4;
      }
    }
    return i;
  }

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
   * @param {INTEGER} amount amount of the asset
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

  function fetchChoice(id) {
    fetch(BASEURL + "?mode=" + id)
    .then(checkStatus)
    .then(JSON.parse)
    .then(choiceDetail)
    .catch();
  }

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
      id("i1").innerText = "Choice1: $" + Math.ceil(info[age-20].choice_1 * (1 + smokeRisk)) + " Coverage: " + info[age-20].coverage_1;
      id("i2").innerText = "Choice2: $" + Math.ceil(info[age-20].choice_2 * (1 + smokeRisk)) + " Coverage: " + info[age-20].coverage_2;
      id("i3").innerText = "Choice3: $" + Math.ceil(info[age-20].choice_3 * (1 + smokeRisk)) + " Coverage: " + info[age-20].coverage_3;
      id("i4").innerText = "Choice4: $" + Math.ceil(info[age-20].choice_4 * (1 + smokeRisk)) + " Coverage: " + info[age-20].coverage_4;
    } else {
      if (rolled) rolled = false;
      id("s1").innerText = "Choice1: $12000";
      id("s2").innerText = "Choice2: $18000";
      id("s3").innerText = "Choice3: $24000";
      id("s4").innerText = "Choice4: $30000";
    }
  }

  function planBack() {
    id("insurance-type").classList.remove("hidden");
    id("plan-selection").classList.add("hidden");
  }

  function saveBack() {
    id("saving-plan").classList.remove("hidden");
    id("save-selection").classList.add("hidden");
  }

  function noButton() {
    qs("#roll-btn button").disabled = false;
    id("insurance-type").classList.add("hidden");
    id("saving-plan").classList.add("hidden");
    id("roll-page").classList.remove("hidden");
    qs("#roll-page h2").innerText = "Roll for next move";
    id("roll-des").innerText = "";
    removeImg();
  }

  function removeImg() {
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
