// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import { getFirestore, getDoc, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

let clickmod = 1;
let bghta20 = false;
let bal = 0;
let income = 0;

let buyTotal = 0;
let chosenBus = "";

const navItemSaveGame = document.getElementById("nav-item-save-game");
navItemSaveGame.addEventListener("click", saveGame, false);

document.addEventListener("DOMContentLoaded", () => {
  const loggedInUserId = localStorage.getItem("loggedInUserId");
  if (loggedInUserId) {
    const docRef = doc(db, "users", loggedInUserId);
    getDoc(docRef)
      .then((docSnap) => {
        if (docSnap.exists()) {
          const userData = docSnap.data();
          if (
            userData.balance == null ||
            userData.income == null ||
            userData.clickmod == null ||
            userData.bghta20 == null
          ) {
            const userDatatoSave = {
              email: userData.email,
              username: userData.username,
              balance: bal,
              income: income,
              clickmod: clickmod,
              bghta20: bghta20,
            };
            setDoc(docRef, userDatatoSave)
              .then(() => {
                console.log("saved data to server");
                sleep(700).then(() => {
                  $("#loader-wrapper").fadeOut("slow");
                });
              })
              .catch((error) => {
                console.error("error writing document", error);
              });
          } else {
            bal = userData.balance;
            income = userData.income;
            clickmod = userData.clickmod;
            bghta20 = userData.bghta20;
            console.log("data loaded from server");
            sleep(700).then(() => {
              $("#loader-wrapper").fadeOut("slow");
            });
          }
        } else {
          console.log("no document found matching id");
          localStorage.removeItem("loggedInUserId");
          localStorage.setItem("loggedIn", false);
          window.location.href = "index.html";
          console.log("no document found matching id");
        }
      })
      .catch((error) => {
        console.log("error getting document", error);
      });
  } else {
    window.location.href = "index.html";
  }
});

function saveGame() {
  const loggedInUserId = localStorage.getItem("loggedInUserId");
  const docRef = doc(db, "users", loggedInUserId);
  getDoc(docRef)
    .then((docSnap) => {
      if (docSnap.exists()) {
        const userData = docSnap.data();
        const userDatatoSave = {
          email: userData.email,
          username: userData.username,
          balance: bal,
          income: income,
          clickmod: clickmod,
          bghta20: bghta20,
        };
        setDoc(docRef, userDatatoSave)
          .then(() => {
            console.log("saved data to server");
            window.alert("Zapisano grę!");
          })
          .catch((error) => {
            console.error("error writing document", error);
            window.location.href = "index.html";
          });
      }
    })
    .catch((error) => {
      console.log("error getting document", error);
    });
}

function silentSaveGame() {
  const loggedInUserId = localStorage.getItem("loggedInUserId");
  const docRef = doc(db, "users", loggedInUserId);
  getDoc(docRef)
    .then((docSnap) => {
      if (docSnap.exists()) {
        const userData = docSnap.data();
        const userDatatoSave = {
          email: userData.email,
          username: userData.username,
          balance: bal,
          income: income,
          clickmod: clickmod,
          bghta20: bghta20,
        };
        setDoc(docRef, userDatatoSave)
          .then(() => {
            console.log("saved data to server silently");
          })
          .catch((error) => {
            console.error("error writing document", error);
            window.location.href = "index.html";
          });
      }
    })
    .catch((error) => {
      console.log("error getting document", error);
    });
}

// JAK DODAĆ AUTOBUS
// 1. Dodaj do tabeli objektów "buses" z jego: kodem, nazwą, ceną, modyfikatorami, wymaganymi ulepszeniami
// 2. Dodaj go do tabeli busPrices
// 3. Stwórz listener na dole skryptu

const buses = [
  {
    code: "solu8",
    name: "Solaris Urbino 8",
    clickmod: 0,
    incomemod: 1,
    price: 500,
    requiredUpgr: "none",
  },
  {
    code: "solu9",
    name: "Solaris Urbino 9",
    clickmod: 0,
    incomemod: 2,
    price: 4000,
    requiredUpgr: "none",
  },
  {
    code: "solu105",
    name: "Solaris Urbino 10.5",
    clickmod: 1,
    incomemod: 0,
    price: 6000,
    requiredUpgr: "none",
  },
  {
    code: "solu12",
    name: "Solaris Urbino 12",
    clickmod: 2,
    incomemod: 0,
    price: 8000,
    requiredUpgr: "none",
  },
  {
    code: "sola86",
    name: "Solaris Alpino 8.6",
    clickmod: 2,
    incomemod: 2,
    price: 15000,
    requiredUpgr: "none",
  },
  {
    code: "solu18",
    name: "Solaris Urbino 18",
    clickmod: 0,
    incomemod: 4,
    price: 16000,
    requiredUpgr: "none",
  },
  {
    code: "solu24",
    name: "Solaris Urbino 24",
    clickmod: 4,
    incomemod: 0,
    price: 21000,
    requiredUpgr: "none",
  },
  {
    code: "manlion",
    name: "MAN Lion's City",
    clickmod: 6,
    incomemod: 0,
    price: 24000,
    requiredUpgr: "none",
  },
  {
    code: "solu12h",
    name: "Solaris Urbino 12 Hydrogen",
    clickmod: 7,
    incomemod: 0,
    price: 24500,
    requiredUpgr: "none",
  },
  {
    code: "jelczm121m",
    name: "Jelcz M121M",
    clickmod: 0,
    incomemod: 6,
    price: 25500,
    requiredUpgr: "none",
  },
  {
    code: "solu18h",
    name: "Solaris Urbino 18 Hydrogen",
    clickmod: 8,
    incomemod: 0,
    price: 27500,
    requiredUpgr: "none",
  },
  {
    code: "manlioncig",
    name: "MAN Lion's City GXL",
    clickmod: 8,
    incomemod: 4,
    price: 35000,
    requiredUpgr: "none",
  },
  {
    code: "vacanza12",
    name: "Solaris Vacanza 12",
    clickmod: 0,
    incomemod: 8,
    price: 40000,
    requiredUpgr: "none",
  },
  {
    code: "vacanza13",
    name: "Solaris Vacanza 13",
    clickmod: 10,
    incomemod: 8,
    price: 58000,
    requiredUpgr: "none",
  },
];

const a20 = [
  {
    code: "mana20",
    name: "MAN A20",
    price: 0,
    incomemod: 0,
    clickmod: 1,
    requiredUpgr: "none",
  },
];

// buying mana20
const manA20Btn = document.getElementById("mana20");
manA20Btn.addEventListener("click", buyMana20, false);

function buyMana20() {
  if (bal >= a20[0].price) {
    if (bghta20 == false) {
      bal = bal - a20[0].price;
      console.log("kupiono mana20");
      clickmod = clickmod + a20[0].clickmod;
      bghta20 = true;
      window.alert("Kupiono MAN A20");
      silentSaveGame();
    } else {
      window.alert("Już wykorzystałeś swoje kupno darmowego autobusu!");
    }
  } else if (bal < a20[0].price) {
    window.alert("Nie stać cię!");
  }
}

// bus buy logic

const menu = document.getElementById("buy-menu");
const finishBtn = document.getElementById("finish-operation-btn");

function buyBus(busCode) {
  console.log("executing buyBus");
  chosenBus = busCode;

  menu.style.display = "block";

  console.log("from buyBus: removing listener");
  finishBtn.removeEventListener("click", buyBusChecker);
  console.log("from buyBus: attaching listener");
  finishBtn.addEventListener(
    "click",
    function () {
      let isListenerFired = false;
      if (isListenerFired === false) {
        console.log(`from listener: executing listener code`);
        buyBusChecker();
        isListenerFired = true;
      } else {
        return;
      }
      console.log("from listener: removing listener");
      finishBtn.removeEventListener("click", this, true);
      return;
    },
    true
  );
}

function buyBusChecker() {
  console.log("executing buyBusChecker");
  let hasAlertedEmpty = false;
  if (isEmpty(inputEl.value)) {
    if (!hasAlertedEmpty) {
      console.log("from buyBusChecker: improper value input");
      finishBtn.removeEventListener("click", buyBusChecker);
      //   window.alert("Wprowadź poprawną wartość!"); - unused because works really buggy
      hasAlertedEmpty = true;
      inputEl.value = "";
      updateTotal();
      chosenBus = "";
      menu.style.display = "none";
      return;
    }
  } else {
    if (bal > buyTotal) {
      buyBusRight();
    } else if (bal < buyTotal) {
      console.log("from buyBusChecker: not enough money");
      window.alert("Nie stać cię!");
      inputEl.value = "";
      updateTotal();
      silentSaveGame();
      chosenBus = "";
      menu.style.display = "none";
    }
  }
  finishBtn.removeEventListener("click", buyBusChecker);
}

function buyBusRight() {
  console.log("executing buyBusRight");
  let bus = buses.find((bus) => bus.code === chosenBus);
  console.log(`from buyBusRight: ${chosenBus}`);
  const busProp = bus;

  bal -= buyTotal;
  income += parseInt(busProp.incomemod) * parseInt(inputEl.value);
  clickmod += parseInt(busProp.clickmod) * parseInt(inputEl.value);

  console.log(`from buyBusRight: kupiono ${bus.name} w ilości ${parseInt(inputEl.value)}`);
  window.alert(`Kupiono autobusy ${bus.name}`);
  silentSaveGame();
  inputEl.value = "0";
  updateTotal();
  chosenBus = "";
  menu.style.display = "none";
}

// bus purcache menu opening script
const navItemBuy = document.getElementById("nav-item-buy");
navItemBuy.addEventListener(
  "click",
  function () {
    const buygui = document.getElementById("buy-bus");
    buygui.style.display = "flex";
  },
  false
);

// bus purcache menu closing script
const closeBusGuiBtn = document.getElementById("close-bus-gui-btn");
closeBusGuiBtn.addEventListener(
  "click",
  function () {
    const buygui = document.getElementById("buy-bus");
    buygui.style.display = "none";
  },
  false
);

// displaying data from local storage in main game screen
function displaybal() {
  document.getElementById("bal-show").innerHTML = bal;
  document.getElementById("income-show").innerHTML = income;
  document.getElementById("click-show").innerHTML = clickmod;
}

const totalEl = document.getElementById("show-full-cost");
const inputEl = document.getElementById("small-input");

// table with maximum quantity of each bus
// TODO: it can be done better but idk how
const busPrices = {
  [buses[0].code]: { price: buses[0].price, maxQuantity: 1000 },
  [buses[1].code]: { price: buses[1].price, maxQuantity: 1000 },
  [buses[2].code]: { price: buses[2].price, maxQuantity: 1000 },
  [buses[3].code]: { price: buses[3].price, maxQuantity: 1000 },
  [buses[4].code]: { price: buses[4].price, maxQuantity: 1000 },
  [buses[5].code]: { price: buses[5].price, maxQuantity: 1000 },
  [buses[6].code]: { price: buses[6].price, maxQuantity: 1000 },
  [buses[7].code]: { price: buses[7].price, maxQuantity: 1000 },
  [buses[8].code]: { price: buses[8].price, maxQuantity: 1000 },
  [buses[9].code]: { price: buses[9].price, maxQuantity: 1000 },
  [buses[10].code]: { price: buses[10].price, maxQuantity: 1000 },
  [buses[11].code]: { price: buses[11].price, maxQuantity: 1000 },
  [buses[12].code]: { price: buses[12].price, maxQuantity: 1000 },
  [buses[13].code]: { price: buses[13].price, maxQuantity: 1000 },
};

// updating the total in bus buy window
function updateTotal() {
  const busData = busPrices[chosenBus];
  const price = busData ? busData.price : 0;
  const maxQuantity = busData ? busData.maxQuantity : Infinity;

  // Handle maximum quantity if needed
  if (inputEl.value > maxQuantity) {
    inputEl.value = maxQuantity;
  }

  buyTotal = inputEl.value * price;
  totalEl.innerHTML = buyTotal;
}

inputEl.addEventListener(
  "input",
  () => {
    inputEl.value = !!inputEl.value && Math.abs(inputEl.value) >= 0 ? Math.abs(inputEl.value) : null;
    updateTotal();
  },
  false
);

async function add() {
  await sleep(1000);
  bal = bal + income;
  displaybal();
  add();
}

// saving game every 90 seconds to firestore
async function gameSaver() {
  await sleep(90000);
  silentSaveGame();
  gameSaver();
}

// opening navigation menu
const navopenBtn = document.getElementById("nav-open-btn");
navopenBtn.addEventListener("click", showNav, false);

async function showNav() {
  const navbar = document.getElementById("nav");

  navbar.style.display = "flex";
  navbar.style.transition = "opacity 0.3s";
  navbar.style.opacity = "1.0";
}

// closing navigation menu
const navItemCloseNav = document.getElementById("nav-item-close-nav");
navItemCloseNav.addEventListener(
  "click",
  function () {
    const navbar = document.getElementById("nav");
    navbar.style.display = "none";
  },
  false
);

const trolleySwitchBtn = document.getElementById("categ-trolley");
const busSwitchBtn = document.getElementById("categ-bus");
const tramSwitchBtn = document.getElementById("categ-tram");

trolleySwitchBtn.addEventListener("click", switchToTrolley, false);
busSwitchBtn.addEventListener("click", switchToBus, false);
tramSwitchBtn.addEventListener("click", switchToTram, false);

function switchToTrolley() {
  const bus = document.getElementById("bus-cnt");
  const trolley = document.getElementById("trolley-cnt");
  const tram = document.getElementById("tram-cnt");

  // bus.style.display = "none";
  // tram.style.display = "none";
  // trolley.style.display = "flex";
  window.alert("Trolejbusy będą dostępne w przyszłych aktualizacjach!");
}

function switchToBus() {
  const bus = document.getElementById("bus-cnt");
  const trolley = document.getElementById("trolley-cnt");
  const tram = document.getElementById("tram-cnt");

  bus.style.display = "flex";
  tram.style.display = "none";
  trolley.style.display = "none";
}

function switchToTram() {
  const bus = document.getElementById("bus-cnt");
  const trolley = document.getElementById("trolley-cnt");
  const tram = document.getElementById("tram-cnt");

  // bus.style.display = "none";
  // trolley.style.display = "none";
  // tram.style.display = "flex";
  window.alert("Tramwaje będą dostępne w przyszłych aktualizacjach!");
}

// hiding the gui with bus quantity(when clicking on a bus to buy it) etc.
function hideBusCntGUI() {
  const busCntGUI = document.getElementById("buy-menu");
  inputEl.value = "";
  chosenBus = "";
  updateTotal();
  busCntGUI.style.display = "none";
}

const clickspace = document.getElementById("clicker");
clickspace.addEventListener("click", clicker, false);

function clicker() {
  bal = bal + clickmod;
  displaybal();
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// checking if input is empty
// NOTE: also checks for strings and 0
function isEmpty(value) {
  return value == null || (typeof value === "string" && value.trim().length === 0) || value == 0;
}

const busCntGUIBtn = document.getElementById("closebuymenu");
busCntGUIBtn.addEventListener("click", hideBusCntGUI, false);
window.addEventListener("load", add, false);
window.addEventListener("load", gameSaver, false);
window.addEventListener("load", displaybal, false);
updateTotal();

// warn the user about saving the game before closing
window.addEventListener("beforeunload", function (event) {
  event.preventDefault();
  event.returnValue = "";
});

// event listeners and definitions for bus purchase menu

const u8El = document.getElementById("u8");
const u9El = document.getElementById("u95");
const u105El = document.getElementById("u105");
const u12El = document.getElementById("u12");
const alp86El = document.getElementById("alp86");
const u18El = document.getElementById("u18");
const u24El = document.getElementById("u24");
const manlionEl = document.getElementById("manlion");
const u12hydEl = document.getElementById("u12hyd");
const jelczm121mEl = document.getElementById("jelczm121m");
const u18hydEl = document.getElementById("u18hyd");
const manlionlongEl = document.getElementById("manlionlong");
const v12El = document.getElementById("vacanza12");
const v13El = document.getElementById("vacanza13");

// listeners here!

u8El.addEventListener(
  "click",
  function () {
    buyBus("solu8");
  },
  false
);
u9El.addEventListener(
  "click",
  function () {
    buyBus("solu9");
  },
  false
);
u105El.addEventListener(
  "click",
  function () {
    buyBus("solu105");
  },
  false
);
u12El.addEventListener(
  "click",
  function () {
    buyBus("solu12");
  },
  false
);
alp86El.addEventListener(
  "click",
  function () {
    buyBus("sola86");
  },
  false
);
u18El.addEventListener(
  "click",
  function () {
    buyBus("solu18");
  },
  false
);
u24El.addEventListener(
  "click",
  function () {
    buyBus("solu24");
  },
  false
);
manlionEl.addEventListener(
  "click",
  function () {
    buyBus("manlion");
  },
  false
);
u12hydEl.addEventListener(
  "click",
  function () {
    buyBus("solu12h");
  },
  false
);
jelczm121mEl.addEventListener(
  "click",
  function () {
    buyBus("jelczm121m");
  },
  false
);
u18hydEl.addEventListener(
  "click",
  function () {
    buyBus("solu18h");
  },
  false
);
manlionlongEl.addEventListener(
  "click",
  function () {
    buyBus("manlioncig");
  },
  false
);
v12El.addEventListener(
  "click",
  function () {
    buyBus("vacanza12");
  },
  false
);
v13El.addEventListener(
  "click",
  function () {
    buyBus("vacanza13");
  },
  false
);
