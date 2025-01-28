import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getFirestore, getDoc, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import { sleep, isEmpty, showAlert, abbreviateNumber, showMsg } from "./utilities.js";
import { vhcls, a20 } from "./data/busData.js";
import { getCodes } from "./codes.js";
import { timedUpgrades } from "./data/timedUpgradeData.js";
import { getActiveTimedUpgrades } from "./upgradeSystem/timedUpgrades.js";

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
let chosenBus = "";
let bghtUpgrs = [];

const navItemSaveGame = document.getElementById("nav-item-save-game");
navItemSaveGame.addEventListener("click", saveGame);

document.addEventListener("DOMContentLoaded", async () => {
  const loggedInUserId = localStorage.getItem("loggedInUserId");
  if (loggedInUserId) {
    const userDoc = await getDoc(doc(db, "users", loggedInUserId));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      if (
        userData.balance == null ||
        userData.income == null ||
        userData.clickmod == null ||
        userData.bghta20 == null
      ) {
        await setDoc(doc(db, "users", loggedInUserId), {
          email: userData.email,
          username: userData.username,
          balance: bal,
          income: income,
          clickmod: clickmod,
          bghta20: bghta20,
          bghtUpgrs: bghtUpgrs,
        });
        console.log("saved data to server");
        console.log(bghtUpgrs);
        sleep(700).then(() => {
          $("#loader-wrapper").fadeOut("slow");
        });
      } else {
        bal = userData.balance;
        income = userData.income;
        clickmod = userData.clickmod;
        bghta20 = userData.bghta20;
        bghtUpgrs = userData.bghtUpgrs;
        console.log("data loaded from server");
        if (auth.currentUser.emailVerified) {
          console.log("email is verified");
          getCodes()
            .then(() => {
              console.log("codes loaded from server");
              sleep(700).then(() => {
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
          showMsg(
            "Twój adres email nie jest zweryfikowany więc<br> zostałeś wylogowany/a. Proszę zalogować się ponownie <br>aby móc wysłać link do weryfikacji.",
            "errorMsgLogin"
          );
        }
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
  };
  setDoc(docRef, userDatatoSave, { merge: true })
    .then(() => {
      console.log("saved data to server");
      showAlert("Zapisano grę!");
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
const manA20Btn = document.getElementById("mana20");
manA20Btn.addEventListener("click", buyMana20);

function buyMana20() {
  if (bal >= a20[0].price) {
    if (bghta20 == false) {
      bal = bal - a20[0].price;
      console.log("bought a20");
      clickmod = clickmod + a20[0].clickmod;
      bghta20 = true;
      showAlert("Kupiono MAN A20");
      silentSaveGame();
    } else {
      showAlert("Już wykorzystałeś swoje kupno darmowego autobusu!");
    }
  } else if (bal < a20[0].price) {
    showAlert("Nie stać cię!");
  }
}

// bus buy logic

const menu = document.getElementById("buy-menu");
const finishBtn = document.getElementById("finish-operation-btn");

function buyBus(busCode) {
  chosenBus = busCode;
  menu.style.display = "block";
  finishBtn.removeEventListener("click", buyBusChecker);
  finishBtn.addEventListener("click", buyBusChecker, { once: true });
}

// closing the buy menu
const busCntGUIBtn = document.getElementById("closebuymenu");
busCntGUIBtn.addEventListener("click", () => {
  const busCntGUI = document.getElementById("buy-menu");
  inputEl.value = "";
  chosenBus = "";
  updateTotal();
  busCntGUI.style.display = "none";
});

function buyBusChecker() {
  console.log("executing buyBusChecker");

  if (isEmpty(inputEl.value)) {
    console.log("from buyBusChecker: improper value input");
    showAlert("Wprowadź prawidłową ilość!");
    resetBuyMenu();
    return;
  }

  if (bal >= buyTotal) {
    buyBusRight();
  } else {
    console.log("from buyBusChecker: not enough money");
    showAlert("Nie stać cię!");
    resetBuyMenu();
  }
}

function resetBuyMenu() {
  inputEl.value = "";
  updateTotal();
  chosenBus = "";
  menu.style.display = "none";
  finishBtn.removeEventListener("click", buyBusChecker);
}

function buyBusRight() {
  console.log("executing buyBusRight");
  let bus = vhcls.find((bus) => bus.code === chosenBus);
  console.log(`from buyBusRight: ${chosenBus}`);
  const busProp = bus;

  bal -= buyTotal;
  income += parseInt(busProp.incomemod) * parseInt(inputEl.value);
  clickmod += parseInt(busProp.clickmod) * parseInt(inputEl.value);

  console.log(`from buyBusRight: bought ${bus.name} x${parseInt(inputEl.value)}`);
  showAlert(`Kupiono autobusy ${bus.name}`);
  silentSaveGame();
  inputEl.value = "0";
  updateTotal();
  chosenBus = "";
  menu.style.display = "none";
}

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
    showAlert("Musisz kupić ulepszenie Autobusy Miejskie!");
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

const totalEl = document.getElementById("show-full-cost");
const inputEl = document.getElementById("small-input");

// updating the total in bus buy window
function updateTotal() {
  const busData = vhcls.find((bus) => bus.code === chosenBus);
  const price = busData ? busData.price : 0;
  const maxQuantity = busData ? busData.maxQuantity : Infinity;

  // Handle maximum quantity if needed
  if (inputEl.value > maxQuantity) {
    inputEl.value = maxQuantity;
  }

  buyTotal = inputEl.value * price;
  totalEl.innerHTML = abbreviateNumber(buyTotal);
}

inputEl.addEventListener("input", () => {
  inputEl.value = !!inputEl.value && Math.abs(inputEl.value) >= 0 ? Math.abs(inputEl.value) : null;
  updateTotal();
});

function getTotalIncomeBoost(timedUpgrs) {
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

const clickspace = document.getElementById("clicker");
clickspace.addEventListener("click", clicker);

function getTotalClickBoost(timedUpgrs) {
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

  console.log(clickmod * totalBoost, totalBoost);
  bal += clickmod * totalBoost;
  displaybal();
}

// displaying player data on main game screen
function displaybal() {
  document.getElementById("bal-show").innerHTML = abbreviateNumber(bal);
  document.getElementById("income-show").innerHTML = abbreviateNumber(income);
  document.getElementById("click-show").innerHTML = abbreviateNumber(clickmod);
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
window.addEventListener("beforeunload", function (event) {
  event.preventDefault();
  event.returnValue = "";
});

// getter and setter functions for upgrades
export function getBal() {
  return bal;
}

export function setBal(newBal) {
  bal = newBal;
}

export function getBghtUpgrs() {
  return bghtUpgrs;
}

export function setBghtUpgrs(newBghtUpgrs) {
  bghtUpgrs = newBghtUpgrs;
}

// Get all bus elements
const busEls = document.querySelectorAll(".vhcl-menu-btn");

// Loop over the bus elements and attach an event listener to each one
busEls.forEach((busEl) => {
  busEl.addEventListener("click", () => {
    buyBus(busEl.id);
  });
});
