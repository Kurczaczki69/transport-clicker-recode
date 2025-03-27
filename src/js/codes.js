import { collection, getDocs, getDoc, doc, setDoc } from "firebase/firestore";
import { db } from "./firebaseManager.js";
import { animateWindowOpen, animateWindowClose, showAlert } from "./utilities.js";
import { getBal, setBal, saveGame } from "./scr.js";
import { grantUpgrade } from "./upgradeSystem/timedUpgrades.js";
import { banana } from "./langs.js";
import { playRandomMouseClick } from "./sounds.js";

// listeners

const isGamePage = window.location.pathname.endsWith("game.html");
const codesMenu = document.querySelector("#codes-menu");
const tint = document.querySelector("#window-tint");

if (isGamePage) {
  const closeGuiBtn = document.querySelector("#close-codes-gui-btn");
  const openGuiBtn = document.querySelector("#nav-item-codes-menu");

  openGuiBtn.addEventListener("click", () => {
    playRandomMouseClick();
    codesMenu.style.display = "block";
    animateWindowOpen(codesMenu, true, tint);
  });

  closeGuiBtn.addEventListener("click", () => {
    playRandomMouseClick();
    animateWindowClose(codesMenu, true, tint);
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
    showAlert(banana.i18n("codes-invalid-code"));
    animateWindowClose(codesMenu, true, tint);
  }
}

async function applyCodeBoosts(code) {
  let usedCodes = await getUsedCodes();
  let codeData = usedCodes.includes(code.code);
  if (codeData) {
    console.log("code already used");
    showAlert(banana.i18n("codes-code-already-used"));
    animateWindowClose(codesMenu, true, tint);
  } else {
    const expireDate = new Date(code.expireDate.seconds * 1000);
    if (Date.now() > expireDate.getTime()) {
      console.log("code expired");
      showAlert(banana.i18n("codes-code-expired"));
      animateWindowClose(codesMenu, true, tint);
    } else {
      let bal = getBal();
      bal = bal + code.moneyReward;
      setBal(bal);
      grantUpgrade(code.boostReward);
      usedCodes.push(code.code);
      await setUsedCodes(usedCodes);
      console.log("code used");
      showAlert(banana.i18n("codes-success"));
      animateWindowClose(codesMenu, true, tint);
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
