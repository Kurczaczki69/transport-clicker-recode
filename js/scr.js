import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getFirestore, getDoc, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import { sleep, isEmpty, showAlert, abbreviateNumber, showMsg } from "./utilities.js";
import { getVhcls, a20 } from "./data/vhclData.js";
import { getCodes } from "./codes.js";
import { getTimedUpgrades } from "./data/timedUpgradeData.js";
import { getActiveTimedUpgrades } from "./upgradeSystem/timedUpgrades.js";
import { banana } from "./langs.js";
import { updateHtmlData } from "./upgradeSystem/insertDataIntoHtml.js";

const firebaseConfig = {
  apiKey: "AIzaSyAlr1B-qkg66Zqkr423UyFrNSLPmScZGIU",
  authDomain: "transport-clicker-f0d1c.firebaseapp.com",
  projectId: "transport-clicker-f0d1c",
  storageBucket: "transport-clicker-f0d1c.appspot.com",
  messagingSenderId: "177489808647",
  appId: "1:177489808647:web:b54aeae2843f31ba02c9a2",
  measurementId: "G-CP6HMGD0N1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore();
const auth = getAuth();

let clickmod = 1;
let bghta20 = false;
let bal = 0;
let income = 0;

let buyTotal = 0;
let chosenVhcl = "";
let bghtUpgrs = [];

let vhclAmounts = {};
let vhclPrices = {};

const isGamePage = window.location.pathname.endsWith("game.html");

if (isGamePage) {
  const navItemSaveGame = document.getElementById("nav-item-save-game");
  navItemSaveGame.addEventListener("click", saveGame);
}

document.addEventListener("DOMContentLoaded", async () => {
  const loggedInUserId = localStorage.getItem("loggedInUserId");
  if (loggedInUserId) {
    const userDoc = await getDoc(doc(db, "users", loggedInUserId));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      // loads existing data from server or sets default value if no data is found
      bal = userData.balance || bal;
      income = userData.income || income;
      clickmod = userData.clickmod || clickmod;
      bghta20 = userData.bghta20 || bghta20;
      bghtUpgrs = userData.bghtUpgrs || bghtUpgrs;
      vhclAmounts = userData.vhclAmounts || {};
      vhclPrices = userData.vhclPrices || {};

      // data is saved to server only if it is a new account
      if (!userData.balance && !userData.income && !userData.clickmod) {
        await setDoc(doc(db, "users", loggedInUserId), {
          email: userData.email,
          username: userData.username,
          balance: bal,
          income: income,
          clickmod: clickmod,
          bghta20: bghta20,
          bghtUpgrs: bghtUpgrs,
          vhclAmounts: vhclAmounts,
          vhclPrices: vhclPrices,
        });
      }
      console.log("data loaded from server");
      if (auth.currentUser.emailVerified) {
        console.log("email is verified");
        if (vhclPrices == undefined || vhclPrices == null) {
          vhclPrices = {};
        }
        if (vhclAmounts == undefined || vhclAmounts == null) {
          vhclAmounts = {};
        }
        getCodes()
          .then(() => {
            console.log("codes loaded from server");
            sleep(700).then(() => {
              syncVehiclePrices();
              $("#loader-wrapper").fadeOut("slow");
            });
          })
          .catch((error) => {
            console.error("error getting codes:", error);
          });
      } else {
        console.log("email is not verified");
        window.location.href = "index.html";
        localStorage.removeItem("loggedInUserId");
        localStorage.setItem("loggedIn", false);
        showMsg(banana.i18n("email-not-verified-logged-out", "<br>"), "errorMsgLogin");
      }
    }
  }
});

function saveGame() {
  const loggedInUserId = localStorage.getItem("loggedInUserId");
  const docRef = doc(db, "users", loggedInUserId);
  const userDatatoSave = {
    balance: bal,
    income: income,
    clickmod: clickmod,
    bghta20: bghta20,
    bghtUpgrs: bghtUpgrs,
    vhclAmounts: vhclAmounts,
    vhclPrices: vhclPrices,
  };
  setDoc(docRef, userDatatoSave, { merge: true })
    .then(() => {
      console.log("saved data to server");
      showAlert(banana.i18n("alert-game-saved"));
    })
    .catch((error) => {
      console.error("error writing document", error);
      window.location.href = "index.html";
    });
}

export function silentSaveGame() {
  const loggedInUserId = localStorage.getItem("loggedInUserId");
  const docRef = doc(db, "users", loggedInUserId);
  const userDatatoSave = {
    balance: bal,
    income: income,
    clickmod: clickmod,
    bghta20: bghta20,
    bghtUpgrs: bghtUpgrs,
    vhclAmounts: vhclAmounts,
    vhclPrices: vhclPrices,
  };
  setDoc(docRef, userDatatoSave, { merge: true })
    .then(() => {
      console.log("saved data to server silently");
    })
    .catch((error) => {
      console.error("error writing document", error);
      window.location.href = "index.html";
    });
}

// buying mana20
if (isGamePage) {
  const manA20Btn = document.getElementById("mana20");
  manA20Btn.addEventListener("click", buyManA20);
}

function buyManA20() {
  if (bal >= a20[0].price) {
    if (bghta20 == false) {
      bal = bal - a20[0].price;
      clickmod = clickmod + a20[0].clickmod;
      bghta20 = true;
      showAlert(banana.i18n("vhcl-bought-a20"));
      silentSaveGame();
    } else {
      showAlert(banana.i18n("vhcl-already-used-a20"));
    }
  } else if (bal < a20[0].price) {
    showAlert(banana.i18n("cant-afford"));
  }
}

// bus buy logic

const menu = document.getElementById("buy-menu");
const finishBtn = document.getElementById("finish-operation-btn");

function buyVhcl(vhclCode) {
  chosenVhcl = vhclCode;
  menu.style.display = "block";
  finishBtn.removeEventListener("click", buyVhclChecker);
  finishBtn.addEventListener("click", buyVhclChecker, { once: true });
}

// closing the buy menu
if (isGamePage) {
  const busCntGUIBtn = document.getElementById("closebuymenu");
  busCntGUIBtn.addEventListener("click", () => {
    const busCntGUI = document.getElementById("buy-menu");
    busCntGUI.style.display = "none";
    resetBuyMenu();
  });
}

function buyVhclChecker() {
  if (isEmpty(inputEl.value)) {
    showAlert(banana.i18n("vhcl-invalid-quantity"));
    resetBuyMenu();
    return;
  }

  if (bal >= buyTotal) {
    buyVhclRight();
  } else {
    showAlert(banana.i18n("cant-afford"));
    resetBuyMenu();
  }
}

function resetBuyMenu() {
  inputEl.value = "";
  updateTotal();
  chosenVhcl = "";
  menu.style.display = "none";
  finishBtn.removeEventListener("click", buyVhclChecker);
}

function buyVhclRight() {
  const vhcls = getVhcls();
  let bus = vhcls.find((bus) => bus.code === chosenVhcl);
  const busProp = bus;
  const quantity = parseInt(inputEl.value);

  bal -= buyTotal;
  income += parseInt(busProp.incomemod) * quantity;
  clickmod += parseInt(busProp.clickmod) * quantity;

  // increase price for each vehicle purchased
  const basePrice = vhclPrices[busProp.code] || busProp.price;
  const priceMultiplier = 1 + 0.025 * Math.log10(quantity + 1);
  vhclPrices[busProp.code] = basePrice * priceMultiplier;

  if (vhclAmounts[busProp.code]) {
    vhclAmounts[busProp.code] += quantity;
  } else {
    vhclAmounts[busProp.code] = quantity;
  }

  showAlert(banana.i18n("vhcl-purchase-success", busProp.name, quantity));
  syncVehiclePrices();
  silentSaveGame();
  updateHtmlData();
  resetBuyMenu();
}

export function syncVehiclePrices() {
  if (!isGamePage) return;
  const vhcls = getVhcls();

  vhcls.forEach((vehicle) => {
    if (vhclPrices[vehicle.code]) {
      vehicle.price = vhclPrices[vehicle.code];
    } else {
      vhclPrices[vehicle.code] = vehicle.price;
    }
  });

  updateHtmlData();
  console.log("vehicle prices synchronized");
}

if (isGamePage) {
  // open vehicle menu
  const navItemBuy = document.getElementById("nav-item-buy");
  navItemBuy.addEventListener("click", () => {
    const buygui = document.getElementById("buy-vehicle");
    const tint = document.querySelector("#window-tint");
    if (bghtUpgrs.includes("citybus")) {
      tint.style.display = "block";
      buygui.style.display = "flex";
    } else {
      buygui.style.display = "none";
      showAlert(banana.i18n("vhcl-category-unavailable-citybus"));
    }
  });

  // close vehicle menu
  const closeBusGuiBtn = document.getElementById("close-bus-gui-btn");
  closeBusGuiBtn.addEventListener("click", () => {
    const buygui = document.getElementById("buy-vehicle");
    const tint = document.querySelector("#window-tint");
    tint.style.display = "none";
    buygui.style.display = "none";
  });
}

const totalEl = document.getElementById("show-full-cost");
const inputEl = document.getElementById("small-input");

// updating the total in vhcl buy window
function updateTotal() {
  if (!isGamePage) return;
  const vhcls = getVhcls();
  const busData = vhcls.find((bus) => bus.code === chosenVhcl);
  const price = busData ? busData.price : 0;
  const maxQuantity = busData ? busData.maxQuantity : Infinity;

  if (inputEl.value > maxQuantity) {
    inputEl.value = maxQuantity;
  }

  buyTotal = inputEl.value * price;
  totalEl.innerHTML = abbreviateNumber(buyTotal);
}

if (isGamePage) {
  inputEl.addEventListener("input", () => {
    inputEl.value = !!inputEl.value && Math.abs(inputEl.value) >= 0 ? Math.abs(inputEl.value) : null;
    updateTotal();
  });
}

function getTotalIncomeBoost(timedUpgrs) {
  let timedUpgrades = getTimedUpgrades();
  let totalBoost = 1;
  timedUpgrs.forEach((upgrade) => {
    let upgr = timedUpgrades.find((u) => u.id === upgrade);
    if (upgr && upgr.hasOwnProperty("incomeboost")) {
      totalBoost += upgr.incomeboost;
    }
  });
  return totalBoost;
}

async function add() {
  const timedUpgrs = getActiveTimedUpgrades();
  const totalBoost = getTotalIncomeBoost(timedUpgrs);

  await sleep(100);
  bal += (income / 10) * totalBoost;
  displaybal();
  add();
}

if (isGamePage) {
  const clickspace = document.getElementById("clicker");
  clickspace.addEventListener("click", clicker);
}

function getTotalClickBoost(timedUpgrs) {
  let timedUpgrades = getTimedUpgrades();
  let totalBoost = 1;
  timedUpgrs.forEach((upgrade) => {
    let upgr = timedUpgrades.find((u) => u.id === upgrade);
    if (upgr && upgr.hasOwnProperty("clickboost")) {
      totalBoost += upgr.clickboost;
    }
  });
  return totalBoost;
}

function clicker() {
  const timedUpgrs = getActiveTimedUpgrades();
  const totalBoost = getTotalClickBoost(timedUpgrs);

  bal += clickmod * totalBoost;
  displaybal();
}

// displaying player data on main game screen
function displaybal() {
  if (!isGamePage) return;
  document.querySelector("#bal-show").innerHTML = abbreviateNumber(bal);
  document.querySelector("#income-show").innerHTML = abbreviateNumber(income);
  document.querySelector("#click-show").innerHTML = abbreviateNumber(clickmod);
}

// saving game every 90 seconds to firestore
async function gameSaver() {
  await sleep(90 * 1000);
  silentSaveGame();
  gameSaver();
}

window.addEventListener("load", add);
window.addEventListener("load", gameSaver);
window.addEventListener("load", displaybal);
updateTotal();

// warn the user about saving the game before closing
if (isGamePage) {
  window.addEventListener("beforeunload", function (event) {
    event.preventDefault();
    event.returnValue = "";
  });
}
// getter and setter functions for variables
export function getBal() {
  return bal;
}

export function setBal(newBal) {
  bal = newBal;
}

export function getIncome() {
  return income;
}

export function getClickMod() {
  return clickmod;
}

export function getVhclAmounts() {
  return vhclAmounts;
}

export function setVhclAmounts(newVhclAmounts) {
  vhclAmounts = newVhclAmounts;
}

export function getVhclPrices() {
  return vhclPrices;
}

export function setVhclPrices(newVhclPrices) {
  vhclPrices = newVhclPrices;
}

export function getBghtUpgrs() {
  return bghtUpgrs;
}

export function setBghtUpgrs(newBghtUpgrs) {
  bghtUpgrs = newBghtUpgrs;
}

// Get all vhcl elements
const vhclEls = document.querySelectorAll(".vhcl-menu-btn");

// Loop over the vhcl elements and attach an event listener to each one
vhclEls.forEach((vhclEl) => {
  vhclEl.addEventListener("click", () => {
    buyVhcl(vhclEl.id);
  });
});
