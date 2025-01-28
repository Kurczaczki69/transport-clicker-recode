import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  doc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
import { showMsg, clearMsg } from "./utilities.js";
import { getBal, setBal, silentSaveGame } from "./scr.js";
import { grantUpgrade } from "./upgradeSystem/timedUpgrades.js";

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

// elements

const codesMenu = document.getElementById("codes-menu");
const tint = document.querySelector("#window-tint");
const closeGuiBtn = document.getElementById("close-codes-gui-btn");
const openGuiBtn = document.getElementById("nav-item-codes-menu");

// listeners

openGuiBtn.addEventListener("click", () => {
  tint.style.display = "block";
  codesMenu.style.display = "block";
  clearMsg("code-menu-msgbox");
});

closeGuiBtn.addEventListener("click", () => {
  tint.style.display = "none";
  codesMenu.style.display = "none";
  clearMsg("code-menu-msgbox");
});

// accessing codes from database

let codes = [];

function useCode(code) {
  let codeData = codes.find((codeData) => codeData.code === code);
  getUsedCodes();
  if (codeData) {
    applyCodeBoosts(codeData);
  } else {
    console.log("invalid code");
    showMsg("Nieprawidłowy kod!", "code-menu-msgbox");
  }
}

async function applyCodeBoosts(code) {
  let usedCodes = await getUsedCodes();
  let codeData = usedCodes.includes(code.code);
  if (codeData) {
    console.log("code already used");
    showMsg("Już użyłeś tego kodu!", "code-menu-msgbox");
  } else {
    const expireDate = new Date(code.expireDate.seconds * 1000);
    if (Date.now() > expireDate.getTime()) {
      console.log("code expired");
      showMsg("Ten kod wygasł!", "code-menu-msgbox");
    } else {
      let bal = getBal();
      bal = bal + code.moneyReward;
      setBal(bal);
      grantUpgrade(code.boostReward);
      usedCodes.push(code.code);
      await setUsedCodes(usedCodes);
      console.log("code used");
      showMsg("Wykorzystano kod!", "code-menu-msgbox");
    }
  }
}

export async function getUsedCodes() {
  const loggedInUserId = localStorage.getItem("loggedInUserId");
  const userDoc = await getDoc(doc(db, "users", loggedInUserId));
  let usedCodes = [];
  usedCodes = userDoc.data().usedCodes || [];
  return usedCodes;
}

async function setUsedCodes(usedCodes) {
  const loggedInUserId = localStorage.getItem("loggedInUserId");
  const userDoc = doc(db, "users", loggedInUserId);
  await setDoc(
    userDoc,
    {
      usedCodes: usedCodes,
    },
    { merge: true }
  );
  silentSaveGame();
}

export async function getCodes() {
  const codesRef = collection(db, "codes");
  const querySnapshot = await getDocs(codesRef);
  codes = [];
  querySnapshot.forEach((doc) => {
    codes.push(doc.data());
  });
}

const codeInput = document.getElementById("code-menu-input");
const confirmBtn = document.getElementById("code-menu-confirm-btn");
confirmBtn.addEventListener("click", () => {
  useCode(codeInput.value);
  codeInput.value = "";
});
