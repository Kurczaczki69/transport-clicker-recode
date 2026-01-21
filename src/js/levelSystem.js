import { getClickMod, getBal, setBal, syncVehiclePrices, checkLevel } from "./scr.js";
import { abbreviateNumber, animateWindowClose, animateWindowOpen, getI18n } from "./utilities.js";
import { calculateTotalCapacity, getFarePerPax } from "./paxUtils.js";
import { showNotif } from "./notifs.js";
import { displayStats } from "./stats.js";
import { populateUpgrData, populateVhclData } from "./upgradeSystem/insertDataIntoHtml.js";
import { playRandomMouseClick } from "./sounds.js";

// window close and open

const isGamePage = window.location.pathname.endsWith("game.html");

if (isGamePage) {
  const statsWindow = document.querySelector("#stats-window");
  const statsWindowCloseBtn = document.querySelector("#close-stats-btn");
  const statsWindowOpenBtn = document.querySelector("#nav-item-open-stats");
  const tint = document.querySelector("#window-tint");

  statsWindowOpenBtn.addEventListener("click", () => {
    playRandomMouseClick();
    displayData();
    displayStats();
    statsWindow.style.display = "flex";
    animateWindowOpen(statsWindow, true, tint);
  });

  statsWindowCloseBtn.addEventListener("click", () => {
    playRandomMouseClick();
    animateWindowClose(statsWindow, true, tint);
  });
}

// all the math etc.

function calculateXP(totalCapacity, farePerPax, clickMod) {
  const xpFromCapacity = totalCapacity;
  
  const xpFromFare = farePerPax * 5;
  
  const xpFromClickMod = clickMod * 6;
  
  return xpFromCapacity + xpFromFare + xpFromClickMod;
}

let previousLevel = localStorage.getItem("previousLevel") || 0;

function calculateLevelProgress(xp) {
  let level = 0;
  let xpRequirement = 100;
  let previousXpRequirement = 0;

  while (xp >= xpRequirement) {
    level++;
    xp -= xpRequirement;
    previousXpRequirement = xpRequirement;
    xpRequirement = Math.floor(xpRequirement * 1.17); // increase by 17%
  }

  if (previousLevel == 0 || previousLevel == null || previousLevel == undefined) {
    previousLevel = level;
  }

  if (previousLevel >= level) {
  } else {
    while (previousLevel < level) {
      previousLevel++;
      const moneyReward = calculateMoneyReward(previousLevel);
      let bal = getBal();
      bal += moneyReward;
      setBal(bal);
      showNotif(
        getI18n("notif-reward-title"),
        getI18n("notif-reward-text", abbreviateNumber(moneyReward), previousLevel),
        "notif-reward"
      );
      populateVhclData();
      populateUpgrData();
      syncVehiclePrices();
      checkLevel();
    }
  }

  const levelProgress = (xp / xpRequirement) * 100;
  const xpToNextLevel = xpRequirement - xp;
  previousLevel = level;
  localStorage.setItem("previousLevel", previousLevel);
  return { level, levelProgress, xpRequirement, previousXpRequirement, xpToNextLevel };
}

function calculateMoneyReward(level) {
  const baseReward = 100;
  return baseReward * Math.pow(1.12, level - 1);
}

function displayData() {
  const totalCapacity = calculateTotalCapacity();
  const farePerPax = getFarePerPax();
  const clickMod = getClickMod();
  const xp = calculateXP(totalCapacity, farePerPax, clickMod);
  const { level, levelProgress, xpRequirement, previousXpRequirement, xpToNextLevel } = calculateLevelProgress(xp);

  document.querySelector("#user-level-value").textContent = level;
  document.querySelector("#user-xp-value").textContent = abbreviateNumber(xp);
  document.querySelector("#level-bar-filled").style.width = `${levelProgress}%`;
  document.querySelector("#to-next-level-value").textContent = getI18n(
    "stats-xp-needed",
    abbreviateNumber(xpToNextLevel)
  );
}

export function getLevel() {
  const totalCapacity = calculateTotalCapacity();
  const farePerPax = getFarePerPax();
  const clickMod = getClickMod();
  const xp = calculateXP(totalCapacity, farePerPax, clickMod);
  const { level } = calculateLevelProgress(xp);

  return level;
}