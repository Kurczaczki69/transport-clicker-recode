const startTime = performance.now();
import { getDoc, setDoc, doc } from "firebase/firestore";
import anime from "animejs";
import { db, auth } from "./firebaseManager.js";
import {
  sleep,
  isEmpty,
  showAlert,
  abbreviateNumber,
  shortAbbreviateNumber,
  showMsg,
  animateWindowClose,
  animateWindowOpen,
  getI18n,
} from "./utilities.js";
import { getVhcls, vhclMaxQuantity } from "./data/vhclData.js";
import { getCodes } from "./codes.js";
import { getActiveTimedUpgrades } from "./upgradeSystem/timedUpgrades.js";
import { getLevel } from "./levelSystem.js";
import { setPageTitle } from "./langs.js";
import { populateUpgrData, populateVhclData, updateHtmlData } from "./upgradeSystem/insertDataIntoHtml.js";
import { calculateCityBoost, calculateCityClickMod } from "./cities.js";
import { getCities, initializeCities } from "./data/cityData.js";
import { startTimedUpgrades } from "./upgradeSystem/timedUpgrades.js";
import { initializeBuildings } from "./data/buildingData.js";
import { getTimedUpgrades } from "./data/timedUpgradeData.js";
import { showNotif } from "./notifs.js";
import { playRandomCash, playRandomMouseClick } from "./sounds.js";
import { initFuelSystem, getFuelLevel } from "./fuel.js";
import "./vhclMenu.js";
import "./utilities.js";
import "./supabaseConfig.js";
import "./stats.js";
import "./supabaseConfig.js";
import "./sounds.js";
import "./settings.js";
import "./notifs.js";
import "./levelSystem.js";
import "./langs.js";
import "./firebaseManager.js";
import "./creditsMenu.js";
import "./cities.js";
import "./codes.js";
import "./buildings.js";
import "./favicon.js";
import "./fuel.js";
import "./upgradeSystem/insertDataIntoHtml.js";
import "./upgradeSystem/timedUpgrades.js";
import "./upgradeSystem/upgrades.js";
import "./data/vhclData.js";
import "./data/cityData.js";
import "./data/buildingData.js";
import "./data/timedUpgradeData.js";
import "./data/upgradeData.js";
import "./accountSystem/accountWindow.js";
import "./accountSystem/changePassword.js";
import "./accountSystem/deleteAccount.js";
import "./accountSystem/firebaseAuth.js";
import "./accountSystem/firebaseLogin.js";
import "./accountSystem/forgotPasswordAtPassChange.js";
import "./accountSystem/forgotPassword.js";
import "./accountSystem/infoDisplay.js";
import "./accountSystem/redirectIfLoggedIn.js";

let clickmod = 1;
let bal = 0;
let income = 0;

let buyTotal = 0;
let chosenVhcl = "";
let bghtUpgrs = [];

let timedUpgrsPrices = {};

let vhclAmounts = {};
let vhclPrices = {};
let vhclStats = {};

let unlockedCities = ["sko"];
let citySwitchCost = 20000;
let currentCity = "sko";

let fuelLevels = { diesel: 1000, hydrogen: 1000, electric: 1000 };
let maxFuel = 1000;

let lastSaveTime = 0;

let userCityData = {};

const GAME_VERSION = "b1.2.0";
const isGamePage = window.location.pathname.endsWith("game.html");

if (isGamePage) {
  const navItemSaveGame = document.querySelector("#nav-item-save-game");
  navItemSaveGame.addEventListener("click", () => {
    playRandomMouseClick();
    saveGame(false);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const verDisplays = document.querySelectorAll(".ver-display");

  verDisplays.forEach((display) => {
    display.textContent = GAME_VERSION;
  });
});

document.addEventListener("DOMContentLoaded", async () => {
  const loggedInUserId = localStorage.getItem("loggedInUserId");

  if (!loggedInUserId) return;

  try {
    const userDoc = await getDoc(doc(db, "users", loggedInUserId));
    if (!userDoc.exists() || !auth.currentUser.emailVerified) {
      handleInvalidUser();
      return;
    }

    await Promise.all([initializeUserData(userDoc.data()), initializeGameSystems()]);
    startCoreSystems();

    requestAnimationFrame(() => {
      initializeSecondaryFeatures();
    });
  } catch (error) {
    console.error("Error during game initialization:", error);
    window.alert(getI18n("error-loading-game"));
  }
});

function handleInvalidUser() {
  window.location.href = "index.html";
  localStorage.removeItem("loggedInUserId");
  localStorage.setItem("loggedIn", false);
  showMsg(getI18n("email-not-verified-logged-out", "<br>"), "errorMsgLogin");
}

async function initializeUserData(userData) {
  bal = userData.balance || 0;
  income = userData.income || 0;
  clickmod = userData.clickmod || 1;
  bghtUpgrs = userData.bghtUpgrs || [];
  citySwitchCost = userData.citySwitchCost || 20000;
  unlockedCities = userData.unlockedCities || ["sko"];
  currentCity = userData.currentCity || "sko";
  vhclAmounts = userData.vhclAmounts || {};
  vhclPrices = userData.vhclPrices || {};
  userCityData = userData.userCityData || {};
  vhclStats = userData.vhclStats || {};
  timedUpgrsPrices = userData.timedUpgrsPrices || {};
  fuelLevels = userData.fuelLevels || { diesel: 1000, hydrogen: 1000, electric: 1000 };
  maxFuel = userData.maxFuel || 1000;
  lastSaveTime = userData.lastSaveTime || Date.now();

  if (!userData.balance && !userData.income && !userData.clickmod) {
    await saveInitialUserData(userData);
  }
}

async function initializeGameSystems() {
  const [codesData, citiesData] = await Promise.all([getCodes(), initializeCities()]);

  startTimedUpgrades();
  displayStats();
  startGameLoop();
}

function startCoreSystems() {
  gameSaver();
  const currentPage = document.body.getAttribute("data-page");
  setPageTitle(currentPage);
}

function initializeSecondaryFeatures() {
  initializeBuildings();
  populateVhclData();
  populateUpgrData();
  syncVehiclePrices();
  syncTimedUpgrPrices();
  initFuelSystem();

  const loader = document.querySelector("#loader-wrapper");
  anime({
    targets: loader,
    translateZ: 0,
    opacity: 0,
    duration: 400,
    easing: "easeOutQuad",
    begin: () => {
      loader.style.willChange = "opacity";
      loader.style.backfaceVisibility = "hidden";
    },
    complete: () => {
      loader.style.display = "none";
      loader.style.willChange = "auto";
      const loadTime = performance.now() - startTime;
      console.log(`Game loaded in ${loadTime.toFixed(2)} ms`);

      const lastLogoutTime = parseInt(localStorage.getItem("lastLogoutTime")) || Date.now();
      const offlineDuration = (Date.now() - lastLogoutTime) / 1000; // in seconds
      const offlineIncome = Math.floor((offlineDuration / 10) * (income / 25));

      bal += offlineIncome;
      localStorage.setItem("lastLogoutTime", Date.now());
      showAlert(getI18n("offline-income-earned", abbreviateNumber(offlineIncome)));
    },
  });
}

window.addEventListener("beforeunload", async (event) => {
  localStorage.setItem("lastLogoutTime", Date.now());
});

async function saveInitialUserData(userData) {
  const loggedInUserId = localStorage.getItem("loggedInUserId");
  await setDoc(
    doc(db, "users", loggedInUserId),
    {
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
      timedUpgrsPrices: timedUpgrsPrices,
      fuelLevels: fuelLevels,
      maxFuel: maxFuel,
      version: GAME_VERSION,
      lastSaveTime: Date.now(),
    },
    { merge: true }
  );
}

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
    timedUpgrsPrices: timedUpgrsPrices,
    fuelLevels: fuelLevels,
    maxFuel: maxFuel,
    version: GAME_VERSION,
    lastSaveTime: Date.now(),
  };
  setDoc(docRef, userDatatoSave, { merge: true })
    .then(() => {
      if (!isSilent) {
        console.log("saved data to server");
        showAlert(getI18n("alert-game-saved"));
      } else {
        console.log("saved data to server silently");
      }
    })
    .catch((error) => {
      console.error("error writing document", error);
      showAlert(getI18n("alert-game-save-fail"));
    });
}

// vehicle buy logic

const menu = document.querySelector("#buy-menu");
const finishBtn = document.querySelector("#finish-operation-btn");

function buyVhcl(vhclCode) {
  chosenVhcl = vhclCode;
  menu.style.display = "block";
  animateWindowOpen(menu, false);
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
      clonedEl.classList.add("vhcl-menu-btn-locked");
      clonedEl.classList.remove("vhcl-menu-btn");
      clonedEl.addEventListener("click", () => {
        playRandomMouseClick();
        blockVhcl(clonedEl.id, "level");
      });
    } else if (vhcl && vhcl.maxLevel < level) {
      clonedTextEl.textContent = "";
      clonedTextEl.classList.add("tabler--lock-filled");
      clonedEl.classList.add("vhcl-menu-btn-locked");
      clonedEl.classList.remove("vhcl-menu-btn");
      clonedEl.addEventListener("click", () => {
        playRandomMouseClick();
        blockVhcl(clonedEl.id, "max-level");
      });
    } else {
      clonedTextEl.classList.remove("tabler--lock-filled");
      if (!clonedTextEl.textContent) {
        clonedTextEl.textContent = getI18n("btn-buy");
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
    message = getI18n("vhcl-unlock-level", vhcl.requiredLevel);
  } else if (reason === "max-level") {
    message = getI18n("vhcl-unlock-max-level", vhcl.maxLevel);
  }
  showAlert(message);
}

// closing the buy menu
if (isGamePage) {
  const busCntGUIBtn = document.querySelector("#closebuymenu");
  busCntGUIBtn.addEventListener("click", () => {
    playRandomMouseClick();
    animateWindowClose(menu, false);
    resetBuyMenu();
  });
}

function buyVhclChecker() {
  if (isEmpty(inputEl.value)) {
    showAlert(getI18n("vhcl-invalid-quantity"));
    resetBuyMenu();
    return;
  }

  if (bal >= buyTotal) {
    playRandomCash();
    buyVhclRight();
  } else {
    playRandomMouseClick();
    showAlert(getI18n("cant-afford"));
    resetBuyMenu();
  }
}

function resetBuyMenu() {
  inputEl.value = "";
  updateTotal();
  chosenVhcl = "";
  animateWindowClose(menu, false);
  finishBtn.removeEventListener("click", buyVhclChecker);
}

function buyVhclRight() {
  let bus = getVhcls().find((bus) => bus.code === chosenVhcl);
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

  showAlert(getI18n("vhcl-purchase-success", busProp.name, quantity));
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

export function syncTimedUpgrPrices() {
  if (!isGamePage) return;
  const timedUpgrs = getTimedUpgrades();

  timedUpgrs.forEach((upgr) => {
    if (timedUpgrsPrices[upgr.id]) {
      upgr.price = timedUpgrsPrices[upgr.id];
    } else {
      timedUpgrsPrices[upgr.id] = upgr.price;
    }
  });

  updateHtmlData();
  console.log("timed upgrades prices synchronized");
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

  totalIncome = 0;

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
    const hasFuel = getFuelLevel(fuelType) > 0;
    const incomeMod = fuelIncomeMap[vhclCode] * vhclAmounts[vhclCode];

    if ((hasStation || fuelType === "electric") && hasFuel) {
      totalIncome += incomeMod;
    } else {
      if (!shownNotif) {
        shownNotif = true;
        const reason = !hasStation ? "notif-fuel-station" : "notif-no-fuel";
        showNotif(getI18n(reason), getI18n(`${reason}-text`, getI18n(`fuel-type-${fuelType}`)), "notif-fuel");
      }
      totalIncome -= incomeMod;
    }
  }
}

function add() {
  if (!isGamePage) return;
  const timedUpgrBoost = getTotalIncomeBoost(getActiveTimedUpgrades());
  const currentCityData = getCities().find((city) => city.id === currentCity);
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
  clickspace.addEventListener("click", (e) => {
    clicker(e);
  });
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

const clickspace = document.querySelector("#clicker-img");
let lastAnimated = Date.now();
function clicker(e) {
  const isLowPerf = localStorage.getItem("lowPerfPreference") || "off";
  const now = Date.now();
  if (lastAnimated + 120 < now) {
    lastAnimated = now;
    if (isLowPerf === "off") {
      anime({
        targets: clickspace,
        keyframes: [
          {
            scale: function () {
              return Math.random() * (1.05 - 1.02) + 1.02;
            },
            duration: 50,
          },
          { scale: 1, duration: 50 },
        ],
        easing: "easeInOutQuad",
        duration: 100,
      });
    }
  }
  const cities = getCities();
  const currentCityData = cities.find((city) => city.id === currentCity);
  const timedUpgrs = getActiveTimedUpgrades();

  let clickValue = Math.round(clickmod * getTotalClickBoost(timedUpgrs) * calculateCityClickMod(currentCityData));
  if (clickmod <= 2) clickValue = clickmod;

  bal += clickValue;
  if (isLowPerf === "off") {
    const indicator = document.createElement("div");
    indicator.id = "click-indicator";
    document.body.appendChild(indicator);
    indicator.style.left = `${e.clientX}px`;
    indicator.style.top = `${e.clientY - 75}px`;
    indicator.textContent = `+${shortAbbreviateNumber(clickValue)} $`;
    anime({
      targets: indicator,
      keyframes: [
        { translateY: 0, opacity: 1, scale: 1.2, duration: 100 },
        { translateY: -75, opacity: 0, scale: 0.8, duration: 250 },
      ],
      easing: "easeInOutCubic",
      duration: 500,
    });
    setTimeout(async () => {
      indicator.remove();
    }, 500);
  }
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
  const timedUpgrs = getActiveTimedUpgrades();
  const currentCityData = getCities().find((city) => city.id === currentCity);
  balShow.textContent = abbreviateNumber(bal);
  incomeShow.textContent = abbreviateNumber(
    Math.round(totalIncome * getTotalIncomeBoost(timedUpgrs) * calculateCityBoost(currentCityData))
  );
  clickShow.textContent = abbreviateNumber(
    Math.round(clickmod * getTotalClickBoost(timedUpgrs) * calculateCityClickMod(currentCityData))
  );
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

export function getTimedUpgrsPrices() {
  return timedUpgrsPrices;
}

export function getFuelLevels() {
  return fuelLevels;
}

export function setFuelLevels(newFuelLevels) {
  fuelLevels = newFuelLevels;
}

export function getMaxFuel() {
  return maxFuel;
}

export function setMaxFuel(newMaxFuel) {
  maxFuel = newMaxFuel;
}
