import { getTimedUpgrades } from "../data/timedUpgradeData.js";
import { getBal, setBal } from "../scr.js";
import { clearMsg, formatTime, showAlert } from "../utilities.js";
import { showNotif, getNotifCount, removeNotif } from "../notifs.js";
import { banana } from "../langs.js";
import { getLevel } from "../levelSystem.js";

let activeTimedUpgrades = [];
const activeTimedUpgradeLimit = 2;
const isGamePage = window.location.pathname.endsWith("game.html");

export function startTimedUpgrades() {
  if (!isGamePage) return;
  let activeUpgrs = getActiveTimedUpgrades();
  activeUpgrs = activeUpgrs.filter((upgr) => upgr.endTime > Date.now());
  activeUpgrs.forEach((upgr) => {
    showNotif(upgr.name, banana.i18n("timed-upgr-notif", formatTime(upgr.endTime - Date.now())), "notif-timed-upgr");
    const notifSmallText = document.querySelector(`#notif-small-text${getNotifCount()}`);
    notifSmallText.id = "notif-small-text" + upgr.id;
    const notifTitle = document.querySelector(`#notif-title${getNotifCount()}`);
    notifTitle.id = "notif-title" + upgr.id;
    runUpgrade(upgr);
  });
  setActiveTimedUpgrades(activeUpgrs);
}

// timed upgrade buy logic

function buyTimedUpgrade(upgrId) {
  let timedUpgrades = getTimedUpgrades();
  const upgradeToBuy = timedUpgrades.find((u) => u.id === upgrId);
  const confirmationDialog = document.querySelector("#confirm-upgrade-dialog");
  let bal = getBal();
  if (bal < upgradeToBuy.price) {
    confirmationDialog.style.display = "none";
    showAlert(banana.i18n("cant-afford"));
  } else {
    if (activeTimedUpgrades.length < activeTimedUpgradeLimit) {
      if (!checkUpgradeByType(upgradeToBuy.type)) {
        let activeUpgrs = getActiveTimedUpgrades();
        const newActiveUpgr = {
          ...upgradeToBuy,
          startTime: Date.now(),
          endTime: Date.now() + upgradeToBuy.duration,
        };
        activeUpgrs.push(newActiveUpgr);
        console.log(activeUpgrs);
        setActiveTimedUpgrades(activeUpgrs);
        bal -= upgradeToBuy.price;
        setBal(bal);
        confirmationDialog.style.display = "none";
        showAlert(banana.i18n("timed-upgr-activated", formatTime(upgradeToBuy.duration)));
        showNotif(
          upgradeToBuy.name,
          banana.i18n("timed-upgr-notif", formatTime(upgradeToBuy.duration)),
          "notif-timed-upgr"
        );
        const notifSmallText = document.querySelector(`#notif-small-text${getNotifCount()}`);
        notifSmallText.id = "notif-small-text" + upgradeToBuy.id;
        const notifTitle = document.querySelector(`#notif-title${getNotifCount()}`);
        notifTitle.id = "notif-title" + upgradeToBuy.id;
        runUpgrade(newActiveUpgr);
      } else {
        confirmationDialog.style.display = "none";
        showAlert(banana.i18n("timed-upgr-already-active"));
      }
    } else {
      confirmationDialog.style.display = "none";
      showAlert(banana.i18n("timed-upgr-limit-reached", activeTimedUpgradeLimit));
    }
  }
}

function checkUpgradeByType(upgrT) {
  return activeTimedUpgrades.some((activeUpgr) => {
    return activeUpgr.type === upgrT;
  });
}

function confirmTimedUpgrade(upgradetobuy) {
  let timedUpgrades = getTimedUpgrades();
  const upgradeToBuy = timedUpgrades.find((u) => u.id === upgradetobuy);
  const confirmationDialog = document.querySelector("#confirm-upgrade-dialog");
  const confirmBtn = document.querySelector("#confirm-upgr-btn");
  const cancelBtn = document.querySelector("#cancel-upgr-btn");
  const upgradeName = document.querySelector("#confirm-upgrade-dialog-text-name");
  upgradeName.textContent = upgradeToBuy.name;
  clearMsg("msg-confirm-upgrade");
  confirmationDialog.style.display = "block";

  // Remove any existing event listeners
  const newConfirmBtn = confirmBtn.cloneNode(true);
  const newCancelBtn = cancelBtn.cloneNode(true);
  confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
  cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);

  // Add new event listeners
  newConfirmBtn.addEventListener("click", () => {
    buyTimedUpgrade(upgradetobuy);
  });

  newCancelBtn.addEventListener("click", () => {
    confirmationDialog.style.display = "none";
  });
}

function blockUpgrade(upgradetobuy, reason) {
  const upgrades = getTimedUpgrades();
  const upgradeToBuy = upgrades.find((u) => u.id === upgradetobuy);

  if (reason == "level") {
    showAlert(banana.i18n("upgrade-blocked-level", upgradeToBuy.requiredLevel));
  }
}

export function checkTimedUpgrLevel() {
  const timedUpgrTextEls = document.querySelectorAll(".upgr-menu-timed-upgr-item-btn-text");
  const timedUpgrEls = document.querySelectorAll(".upgr-menu-timed-upgr-item-btn");
  const upgrades = getTimedUpgrades();
  const level = getLevel();

  timedUpgrEls.forEach((upgrEl, index) => {
    const upgrade = upgrades.find((u) => u.id === upgrEl.id);
    if (upgrade && upgrade.requiredLevel > level) {
      timedUpgrTextEls[index].textContent = "";
      timedUpgrTextEls[index].classList.add("tabler--lock-filled");
      upgrEl.classList.remove("upgr-menu-timed-upgr-item-btn");
      upgrEl.classList.add("upgr-btn-disabled");
      upgrEl.addEventListener("click", () => {
        blockUpgrade(upgrEl.id, "level");
      });
    } else if (upgrade && upgrade.requiredLevel == level) {
      upgrEl.addEventListener("click", () => {
        confirmTimedUpgrade(upgrEl.id);
      });
    } else {
      upgrEl.addEventListener("click", () => {
        confirmTimedUpgrade(upgrEl.id);
      });
    }
  });
}

export function getActiveTimedUpgrades() {
  return localStorage.getItem("activeTimedUpgrades") ? JSON.parse(localStorage.getItem("activeTimedUpgrades")) : [];
}

export function setActiveTimedUpgrades(upgrades) {
  activeTimedUpgrades = upgrades;
  localStorage.setItem("activeTimedUpgrades", JSON.stringify(activeTimedUpgrades));
}

export async function runUpgrade(upgr) {
  let remainingTime = upgr.endTime - Date.now();
  updateTimerDisplay(upgr, remainingTime);
  while (upgr.endTime > Date.now()) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    remainingTime -= 1000;
    updateTimerDisplay(upgr, remainingTime);
  }
  removeUpgrade(upgr);
  updateTimerDisplay(upgr, remainingTime);
}

export function removeUpgrade(upgr) {
  const index = activeTimedUpgrades.indexOf(upgr);
  if (index > -1) {
    let activeUpgrs = getActiveTimedUpgrades();
    activeUpgrs.splice(index, 1);
    setActiveTimedUpgrades(activeUpgrs);
    const timerEl = document.querySelector(`#notif-small-text${upgr.id}`);
    const notif = timerEl.parentElement.id;
    removeNotif(notif);
  }
}

export function grantUpgrade(upgrId) {
  let timedUpgrades = getTimedUpgrades();
  const upgradeToGrant = timedUpgrades.find((u) => u.id === upgrId);
  if (!upgradeToGrant) {
    console.log(`Upgrade with ID ${upgrId} does not exist.`);
    return;
  }
  let activeUpgrs = getActiveTimedUpgrades();
  const newActiveUpgr = {
    ...upgradeToGrant,
    startTime: Date.now(),
    endTime: Date.now() + upgradeToGrant.duration,
  };
  activeUpgrs.push(newActiveUpgr);
  setActiveTimedUpgrades(activeUpgrs);

  showNotif(upgradeToBuy.name, banana.i18n("timed-upgr-notif", formatTime(upgradeToBuy.duration)), "notif-timed-upgr");
  const notifSmallText = document.querySelector(`#notif-small-text${getNotifCount()}`);
  notifSmallText.id = "notif-small-text" + upgradeToGrant.id;
  runUpgrade(newActiveUpgr);
}

function updateTimerDisplay(upgrade, remainingTime) {
  let timedUpgrs = getTimedUpgrades();
  const currentUpgrade = timedUpgrs.find((u) => u.id === upgrade.id);
  const timerEl = document.querySelector(`#notif-small-text${upgrade.id}`);
  const titleEl = document.querySelector(`#notif-title${upgrade.id}`);
  if (timerEl) {
    timerEl.textContent = banana.i18n("timed-upgr-notif", formatTime(remainingTime));
  }
  if (titleEl) {
    titleEl.textContent = currentUpgrade.name;
  }
}
