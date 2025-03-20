import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  doc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
import { showMsg, clearMsg, animateWindowOpen, animateWindowClose } from "./utilities.js";
import { getBal, setBal, saveGame } from "./scr.js";
import { grantUpgrade } from "./upgradeSystem/timedUpgrades.js";
import { banana } from "./langs.js";
import { playRandomMouseClick } from "./sounds.js";

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

// listeners

const isGamePage = window.location.pathname.endsWith("game.html");

if (isGamePage) {
  const codesMenu = document.querySelector("#codes-menu");
  const tint = document.querySelector("#window-tint");
  const closeGuiBtn = document.querySelector("#close-codes-gui-btn");
  const openGuiBtn = document.querySelector("#nav-item-codes-menu");

  openGuiBtn.addEventListener("click", () => {
    playRandomMouseClick();
    codesMenu.style.display = "block";
    animateWindowOpen(codesMenu, true, tint);
    clearMsg("code-menu-msgbox");
  });

  closeGuiBtn.addEventListener("click", () => {
    playRandomMouseClick();
    animateWindowClose(codesMenu, true, tint);
    clearMsg("code-menu-msgbox");
  });
}

// accessing codes from database

let codes = [];

function useCode(code) {
  let codeData = codes.find((codeData) => codeData.code === code);
  getUsedCodes();
  if (codeData) {
    applyCodeBoosts(codeData);
  } else {
    console.log("invalid code");
    showMsg(banana.i18n("codes-invalid-code"), "code-menu-msgbox");
  }
}

async function applyCodeBoosts(code) {
  let usedCodes = await getUsedCodes();
  let codeData = usedCodes.includes(code.code);
  if (codeData) {
    console.log("code already used");
    showMsg(banana.i18n("codes-code-already-used"), "code-menu-msgbox");
  } else {
    const expireDate = new Date(code.expireDate.seconds * 1000);
    if (Date.now() > expireDate.getTime()) {
      console.log("code expired");
      showMsg(banana.i18n("codes-code-expired"), "code-menu-msgbox");
    } else {
      let bal = getBal();
      bal = bal + code.moneyReward;
      setBal(bal);
      grantUpgrade(code.boostReward);
      usedCodes.push(code.code);
      await setUsedCodes(usedCodes);
      console.log("code used");
      showMsg(banana.i18n("codes-success"), "code-menu-msgbox");
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
  saveGame(true);
}

export async function getCodes() {
  const codesRef = collection(db, "codes");
  const querySnapshot = await getDocs(codesRef);
  codes = [];
  querySnapshot.forEach((doc) => {
    codes.push(doc.data());
  });
}

if (isGamePage) {
  const codeInput = document.querySelector("#code-menu-input");
  const confirmBtn = document.querySelector("#code-menu-confirm-btn");
  confirmBtn.addEventListener("click", () => {
    playRandomMouseClick();
    useCode(codeInput.value);
    codeInput.value = "";
  });
}
