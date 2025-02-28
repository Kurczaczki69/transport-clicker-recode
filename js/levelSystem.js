import { getIncome, getClickMod, getBal, setBal } from "./scr.js";
import { abbreviateNumber } from "./utilities.js";
import { showNotif } from "./notifs.js";
import { displayStats } from "./stats.js";
import { banana } from "./langs.js";

// window close and open

const isGamePage = window.location.pathname.endsWith("game.html");

if (isGamePage) {
  const statsWindow = document.querySelector("#stats-window");
  const statsWindowCloseBtn = document.querySelector("#close-stats-btn");
  const statsWindowOpenBtn = document.querySelector("#nav-item-open-stats");
  const tint = document.querySelector("#window-tint");

  statsWindowOpenBtn.addEventListener("click", () => {
    displayData();
    displayStats();
    tint.style.display = "block";
    statsWindow.style.display = "flex";
  });

  statsWindowCloseBtn.addEventListener("click", () => {
    tint.style.display = "none";
    statsWindow.style.display = "none";
  });
}

// all the math etc.

function calculateXP(income, clickMod) {
  const xpFromIncome = income * 4;
  const xpFromClickMod = clickMod * 6;
  let xp;
  xp = xpFromIncome + xpFromClickMod;
  return xp;
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
    xpRequirement = Math.floor(xpRequirement * 1.1); // increase by 10%
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
        banana.i18n("notif-reward-title"),
        banana.i18n("notif-reward-text", abbreviateNumber(moneyReward), previousLevel),
        "notif-reward"
      );
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
  const income = getIncome();
  const clickMod = getClickMod();
  const xp = calculateXP(income, clickMod);
  const { level, levelProgress, xpRequirement, previousXpRequirement, xpToNextLevel } = calculateLevelProgress(xp);

  document.querySelector("#user-level-value").textContent = level;
  document.querySelector("#user-xp-value").textContent = abbreviateNumber(xp);
  document.querySelector("#level-bar-filled").style.width = `${levelProgress}%`;
  document.querySelector("#to-next-level-value").textContent = banana.i18n(
    "stats-xp-needed",
    abbreviateNumber(xpToNextLevel)
  );
}

export function getLevel() {
  const income = getIncome();
  const clickMod = getClickMod();
  const xp = calculateXP(income, clickMod);
  const { level, levelProgress, xpRequirement, previousXpRequirement, xpToNextLevel } = calculateLevelProgress(xp);

  return level;
}
