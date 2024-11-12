import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getFirestore, getDoc, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
import { sleep, isEmpty, showAlert, showMsg } from "./utilities.js";
import { buses, a20, busPrices } from "./data/busData.js";

// Your web app's Firebase configuration
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
let bghtUpgrs = [];

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
              bghtUpgrs: bghtUpgrs,
            };
            setDoc(docRef, userDatatoSave)
              .then(() => {
                console.log("saved data to server");
                console.log(bghtUpgrs);
                sleep(700).then(() => {
                  $("#loader-wrapper").fadeOut("slow");
                });
              })
              .catch((error) => {
                console.error("error writing document", error);
              });
          } else if (userData.bghtUpgrs == null) {
            console.log("bghtUpgrs is null");
            const userDatatoSave = {
              email: userData.email,
              username: userData.username,
              balance: userData.balance,
              income: userData.income,
              clickmod: userData.clickmod,
              bghta20: userData.bghta20,
              bghtUpgrs: bghtUpgrs,
            };
            setDoc(docRef, userDatatoSave)
              .then(() => {
                console.log("saved bghtUpgrs to server");
                sleep(700).then(() => {
                  $("#loader-wrapper").fadeOut("slow");
                  window.alert(
                    "Twoje konto zostało zaaktualizowane zgodnie z nową wersją gry. Proszę odświeżyć stronę aby grać"
                  );
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
            bghtUpgrs = userData.bghtUpgrs;
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
          bghtUpgrs: bghtUpgrs,
        };
        setDoc(docRef, userDatatoSave)
          .then(() => {
            console.log("saved data to server");
            showAlert("Zapisano grę!");
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

export function silentSaveGame() {
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
          bghtUpgrs: bghtUpgrs,
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
      showMsg("Kupiono MAN A20");
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
      showAlert("Nie stać cię!");
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
  showAlert(`Kupiono autobusy ${bus.name}`);
  silentSaveGame();
  inputEl.value = "0";
  updateTotal();
  chosenBus = "";
  menu.style.display = "none";
}

// open vehicle menu
const navItemBuy = document.getElementById("nav-item-buy");
navItemBuy.addEventListener(
  "click",
  function () {
    const buygui = document.getElementById("buy-bus");
    if (bghtUpgrs.includes("citybus")) {
      buygui.style.display = "flex";
    } else {
      buygui.style.display = "none";
      showAlert("Musisz kupić ulepszenie Autobusy Miejskie!");
    }
  },
  false
);

// close vehicle menu
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
navopenBtn.addEventListener(
  "click",
  function () {
    const navbar = document.getElementById("nav");

    navbar.style.display = "flex";
    navbar.style.opacity = "1.0";
  },
  false
);

// closing navigation menu (for some bizzare reason this works at applying the animation wtf)
const navItemCloseNav = document.getElementById("nav-item-close-nav");
navItemCloseNav.addEventListener(
  "click",
  function () {
    const navbar = document.getElementById("nav");
    navbar.classList.remove("animation-nav-show");
    navbar.classList.add("animation-nav-hide");
    sleep(275).then(() => {
      navbar.style.display = "none";
      navbar.style.opacity = "0.0";
      navbar.classList.remove("animation-nav-hide");
      sleep(300).then(() => {
        navbar.classList.add("animation-nav-show");
      });
    });
  },
  false
);

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

// getter and setter for upgrades
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
