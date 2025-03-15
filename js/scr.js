import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getFirestore, getDoc, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import { sleep, isEmpty, showAlert, abbreviateNumber, showMsg } from "./utilities.js";
import { getVhcls, vhclMaxQuantity } from "./data/vhclData.js";
import { getCodes } from "./codes.js";
import { getActiveTimedUpgrades } from "./upgradeSystem/timedUpgrades.js";
import { getLevel } from "./levelSystem.js";
import { banana, setPageTitle } from "./langs.js";
import { populateUpgrData, populateVhclData, updateHtmlData } from "./upgradeSystem/insertDataIntoHtml.js";
import { calculateCityBoost } from "./cities.js";
import { getCities, initializeCities, setCities } from "./data/cityData.js";
import { startTimedUpgrades } from "./upgradeSystem/timedUpgrades.js";
import { initializeBuildings } from "./data/buildingData.js";
import { showNotif } from "./notifs.js";
import { playRandomCash, playRandomMouseClick } from "./sounds.js";

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
let bal = 0;
let income = 0;

let buyTotal = 0;
let chosenVhcl = "";
let bghtUpgrs = [];

let vhclAmounts = {};
let vhclPrices = {};
let vhclStats = {};

let unlockedCities = ["sko"];
let citySwitchCost = 20000;
let currentCity = "sko";

let userCityData = {};

const isGamePage = window.location.pathname.endsWith("game.html");

if (isGamePage) {
  const navItemSaveGame = document.querySelector("#nav-item-save-game");
  navItemSaveGame.addEventListener("click", () => {
    playRandomMouseClick();
    saveGame(false);
  });
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
      bghtUpgrs = userData.bghtUpgrs || bghtUpgrs;
      citySwitchCost = userData.citySwitchCost || citySwitchCost;
      unlockedCities = userData.unlockedCities || unlockedCities;
      currentCity = userData.currentCity || currentCity;
      vhclAmounts = userData.vhclAmounts || {};
      vhclPrices = userData.vhclPrices || {};
      userCityData = userData.userCityData || {};
      vhclStats = userData.vhclStats || {};

      // data is saved to server only if it is a new account
      if (!userData.balance && !userData.income && !userData.clickmod) {
        await setDoc(doc(db, "users", loggedInUserId), {
          email: userData.email,
          username: userData.username,
          balance: bal,
          income: income,
          clickmod: clickmod,
          bghtUpgrs: bghtUpgrs,
          citySwitchCost: citySwitchCost,
          unlockedCities: unlockedCities,
          currentCity: currentCity,
          vhclAmounts: vhclAmounts,
          vhclPrices: vhclPrices,
          userCityData: userCityData,
          vhclStats: vhclStats,
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
              startTimedUpgrades();
              const currentPage = document.body.getAttribute("data-page");
              setPageTitle(currentPage);
              gameSaver();
              displayStats();
              startGameLoop();
              $("#loader-wrapper").fadeOut("slow");
              sleep(750).then(() => {
                initializeCities();
                initializeBuildings();
                populateVhclData();
                populateUpgrData();
              });
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

/**
 * Saves the current game state to the server.
 * @param {boolean} isSilent If true, doesn't show a success message.
 */
export function saveGame(isSilent) {
  const loggedInUserId = localStorage.getItem("loggedInUserId");
  const docRef = doc(db, "users", loggedInUserId);
  const userDatatoSave = {
    balance: Math.round(bal * 100) / 100,
    income: Math.round(income * 100) / 100,
    clickmod: Math.round(clickmod * 100) / 100,
    bghtUpgrs: bghtUpgrs,
    citySwitchCost: Math.round(citySwitchCost * 100) / 100,
    unlockedCities: unlockedCities,
    currentCity: currentCity,
    vhclAmounts: vhclAmounts,
    vhclPrices: vhclPrices,
    userCityData: userCityData,
    vhclStats: vhclStats,
  };
  setDoc(docRef, userDatatoSave, { merge: true })
    .then(() => {
      if (!isSilent) {
        console.log("saved data to server");
        showAlert(banana.i18n("alert-game-saved"));
      } else {
        console.log("saved data to server silently");
      }
    })
    .catch((error) => {
      console.error("error writing document", error);
      window.location.href = "index.html";
    });
}

// vehicle buy logic

const menu = document.querySelector("#buy-menu");
const finishBtn = document.querySelector("#finish-operation-btn");

function buyVhcl(vhclCode) {
  chosenVhcl = vhclCode;
  menu.style.display = "block";
  inputEl.focus();
  finishBtn.removeEventListener("click", buyVhclChecker);
  finishBtn.addEventListener("click", buyVhclChecker, { once: true });
}

export function checkLevel() {
  const vhclEls = document.querySelectorAll(".vhcl-menu-btn");
  const vhcls = getVhcls();
  const level = getLevel();

  vhclEls.forEach((vhclEl) => {
    const clonedEl = vhclEl.cloneNode(true);
    const clonedTextEl = clonedEl.querySelector(".vhcl-btn-content");

    const vhcl = vhcls.find((v) => v.code === clonedEl.id);
    if (vhcl && vhcl.requiredLevel > level) {
      clonedTextEl.textContent = "";
      clonedTextEl.classList.add("tabler--lock-filled");
      clonedEl.style.padding = "3%";
      clonedEl.addEventListener("click", () => {
        playRandomMouseClick();
        blockVhcl(clonedEl.id, "level");
      });
    } else if (vhcl && vhcl.maxLevel < level) {
      clonedTextEl.textContent = "";
      clonedTextEl.classList.add("tabler--lock-filled");
      clonedEl.style.padding = "3%";
      clonedEl.addEventListener("click", () => {
        playRandomMouseClick();
        blockVhcl(clonedEl.id, "max-level");
      });
    } else {
      clonedTextEl.classList.remove("tabler--lock-filled");
      if (!clonedTextEl.textContent) {
        clonedTextEl.textContent = banana.i18n("btn-buy");
      }
      clonedEl.style.padding = "";
      clonedEl.addEventListener("click", () => {
        playRandomMouseClick();
        buyVhcl(clonedEl.id);
      });
    }

    vhclEl.parentNode.replaceChild(clonedEl, vhclEl);
  });
}

function blockVhcl(vhclCode, reason) {
  const vhcls = getVhcls();
  const vhcl = vhcls.find((v) => v.code === vhclCode);
  let message = "";
  if (reason === "level") {
    message = banana.i18n("vhcl-unlock-level", vhcl.requiredLevel);
  } else if (reason === "max-level") {
    message = banana.i18n("vhcl-unlock-max-level", vhcl.maxLevel);
  }
  showAlert(message);
}

// closing the buy menu
if (isGamePage) {
  const busCntGUIBtn = document.querySelector("#closebuymenu");
  busCntGUIBtn.addEventListener("click", () => {
    playRandomMouseClick();
    menu.style.display = "none";
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
    playRandomCash();
    buyVhclRight();
  } else {
    playRandomMouseClick();
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
  const incomeIncrease = parseInt(busProp.incomemod) * quantity;
  const clickmodIncrease = parseInt(busProp.clickmod) * quantity;

  income += incomeIncrease;
  clickmod += clickmodIncrease;

  if (!vhclStats[busProp.code]) {
    vhclStats[busProp.code] = {
      income: 0,
      clickmod: 0,
    };
  }
  vhclStats[busProp.code].income += incomeIncrease;
  vhclStats[busProp.code].clickmod += clickmodIncrease;

  // increase price for each vehicle purchased
  const basePrice = vhclPrices[busProp.code] || busProp.price;
  const priceMultiplier = 1 + 0.025 * Math.log10(quantity + 1);
  vhclPrices[busProp.code] = Math.round(basePrice * priceMultiplier);

  if (vhclAmounts[busProp.code]) {
    vhclAmounts[busProp.code] += quantity;
  } else {
    vhclAmounts[busProp.code] = quantity;
  }

  showAlert(banana.i18n("vhcl-purchase-success", busProp.name, quantity));
  syncVehiclePrices();
  saveGame(true);
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

const totalEl = document.querySelector("#show-full-cost");
const inputEl = document.querySelector("#small-input");
const maxBtn = document.querySelector("#buy-menu-max-button");

if (isGamePage) {
  maxBtn.addEventListener("click", setInputToMax);
}

function setInputToMax() {
  playRandomMouseClick();
  const bal = getBal();
  const vhclPrice = vhclPrices[chosenVhcl] || 0;
  const maxQuantity = vhclMaxQuantity || Infinity;

  inputEl.value = Math.min(Math.floor(bal / vhclPrice), maxQuantity);
  updateTotal();
}

// updating the total in vhcl buy window
function updateTotal() {
  if (!isGamePage) return;
  const vhcls = getVhcls();
  const vhclData = vhcls.find((vhcl) => vhcl.code === chosenVhcl);
  const price = vhclData ? vhclData.price : 0;
  const maxQuantity = vhclMaxQuantity || Infinity;

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
  let totalBoost = 1;
  timedUpgrs.forEach((upgrade) => {
    if (upgrade && upgrade.hasOwnProperty("incomeboost")) {
      totalBoost += upgrade.incomeboost;
    }
  });
  return totalBoost;
}

let totalIncome = 0;
let shownNotif = false;
function checkForFuelStations(cityData) {
  if (!cityData || !cityData.buildings || !isGamePage) return;

  totalIncome = 0; // Start at 0 to avoid double counting

  if (income === 0 || bal <= 0) return;

  const vhcls = getVhcls();
  const fuelTypeMap = vhcls.reduce((map, vhcl) => {
    map[vhcl.code] = vhcl.fuelType;
    return map;
  }, {});

  const fuelIncomeMap = vhcls.reduce((map, vhcl) => {
    map[vhcl.code] = vhcl.incomemod;
    return map;
  }, {});

  for (const vhclCode in vhclAmounts) {
    if (!fuelTypeMap[vhclCode]) continue;

    const fuelType = fuelTypeMap[vhclCode];
    const stationType = fuelType === "diesel" ? "gas-station" : "hydrogen-station";
    const hasStation = cityData.buildings.includes(stationType);

    const incomeMod = fuelIncomeMap[vhclCode] * vhclAmounts[vhclCode];

    if (hasStation) {
      // console.log(`${fuelType} station found, adding ${incomeMod}`);
      totalIncome += incomeMod;
    } else {
      // console.log(`${fuelType} station not found, reducing ${incomeMod}`);
      if (!shownNotif) {
        shownNotif = true;
        showNotif(
          banana.i18n("notif-fuel-station"),
          banana.i18n("notif-fuel-station-text", banana.i18n(`fuel-type-${fuelType}`)),
          "notif-fuel-station"
        );
      }
      totalIncome -= incomeMod;
    }
  }

  // console.log(`Final totalIncome: ${totalIncome}`);
}

function add() {
  if (!isGamePage) return;
  const cities = getCities();
  const timedUpgrs = getActiveTimedUpgrades();
  const timedUpgrBoost = getTotalIncomeBoost(timedUpgrs);
  const currentCityData = cities.find((city) => city.id === currentCity);
  const cityBoost = calculateCityBoost(currentCityData);

  totalIncome = 0;
  checkForFuelStations(currentCityData);
  // console.log("Total income after fuel check:", totalIncome);

  bal += (totalIncome / 10) * timedUpgrBoost * cityBoost;
  // console.log(totalIncome * timedUpgrBoost * cityBoost);
  // console.log(income);
  displayStats();
}

function startGameLoop() {
  if (!isGamePage) return;
  setInterval(add, 100);
}

if (isGamePage) {
  const clickspace = document.querySelector("#clicker");
  clickspace.addEventListener("click", clicker);
}

function getTotalClickBoost(timedUpgrs) {
  let totalBoost = 1;
  timedUpgrs.forEach((upgrade) => {
    if (upgrade && upgrade.hasOwnProperty("clickboost")) {
      totalBoost += upgrade.clickboost;
    }
  });
  return totalBoost;
}

function clicker() {
  const timedUpgrs = getActiveTimedUpgrades();
  const totalBoost = getTotalClickBoost(timedUpgrs);

  bal += Math.floor(clickmod * totalBoost);
  playRandomMouseClick();
  // console.log(totalBoost, clickmod * totalBoost);
  displayStats();
}

// displaying player data on main game screen
const balShow = document.querySelector("#bal-show");
const incomeShow = document.querySelector("#income-show");
const clickShow = document.querySelector("#click-show");

function displayStats() {
  if (!isGamePage) return;
  const cities = getCities();
  const timedUpgrs = getActiveTimedUpgrades();
  const timedUpgrBoost = getTotalIncomeBoost(timedUpgrs);
  const totalClickBoost = getTotalClickBoost(timedUpgrs);
  const currentCityData = cities.find((city) => city.id === currentCity);
  const cityBoost = calculateCityBoost(currentCityData);
  balShow.textContent = abbreviateNumber(bal);
  incomeShow.textContent = abbreviateNumber(totalIncome * timedUpgrBoost * cityBoost);
  clickShow.textContent = abbreviateNumber(clickmod * totalClickBoost);
}

// saving game every 90 seconds to firestore
async function gameSaver() {
  await sleep(90 * 1000);
  saveGame(true);
  gameSaver();
}

updateTotal();

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

export function getCitySwitchCost() {
  return citySwitchCost;
}

export function setCitySwitchCost(newCitySwitchCost) {
  citySwitchCost = newCitySwitchCost;
}

export function getUnlockedCities() {
  return unlockedCities;
}

export function setUnlockedCities(newUnlockedCities) {
  unlockedCities = newUnlockedCities;
}

export function getCurrentCity() {
  return currentCity;
}

export function setCurrentCity(newCurrentCity) {
  currentCity = newCurrentCity;
}

export function getUserCityData() {
  return userCityData;
}

export function setUserCityData(newUserCityData) {
  userCityData = newUserCityData;
}

export function updateCityProperty(cityId, property, value) {
  if (!userCityData[cityId]) {
    userCityData[cityId] = {};
  }
  userCityData[cityId][property] = value;
}

export function getVhclStats() {
  return vhclStats;
}

export function setVhclStats(newVhclStats) {
  vhclStats = newVhclStats;
}
