import { getTimedUpgrades } from "../data/timedUpgradeData.js";
import { getBal, setBal } from "../scr.js";
import { clearMsg, formatTime, showAlert } from "../utilities.js";
import { showNotif, getNotifCount, removeNotif } from "../notifs.js";
import { banana } from "../langs.js";
import { getLevel } from "../levelSystem.js";

let activeTimedUpgrades = [];
const activeTimedUpgradeLimit = 2;

// timed upgrade buy logic
const timedUpgrEls = document.querySelectorAll(".upgr-menu-timed-upgr-item-btn");

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
        activeUpgrs.push(upgradeToBuy.id);
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
        runUpgrade(upgradeToBuy);
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
  let timedUpgrades = getTimedUpgrades();
  return activeTimedUpgrades.some((activeUpgr) => {
    let upgr = timedUpgrades.find((u) => u.id === activeUpgr);
    return upgr.type === upgrT;
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

const timedUpgrTextEls = document.querySelectorAll(".upgr-menu-timed-upgr-item-btn-text");

export function checkTimedUpgrLevel() {
  const upgrades = getTimedUpgrades();
  const level = getLevel();

  timedUpgrEls.forEach((upgrEl, index) => {
    const upgrade = upgrades.find((u) => u.id === upgrEl.id);
    if (upgrade && upgrade.requiredLevel > level) {
      timedUpgrTextEls[index].textContent = "";
      timedUpgrTextEls[index].classList.add("tabler--lock-filled");
      upgrEl.style.padding = "3%";
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
  return activeTimedUpgrades;
}

export function setActiveTimedUpgrades(upgrades) {
  upgrades.forEach((upgrade) => {
    // checks if the upgrade is already active
    if (!activeTimedUpgrades.some((activeUpgrade) => activeUpgrade.id === upgrade.id)) {
      activeTimedUpgrades.push(upgrade);
    }
  });
}

export async function runUpgrade(upgr) {
  let timedUpgrades = getTimedUpgrades();
  const upgrade = timedUpgrades.find((u) => u.id === upgr.id);
  let remainingTime = upgrade.duration;
  updateTimerDisplay(upgrade, remainingTime);
  while (remainingTime > 0) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    remainingTime -= 1000;
    updateTimerDisplay(upgrade, remainingTime);
  }
  removeUpgrade(upgr.id, upgrade);
  updateTimerDisplay(upgr, remainingTime);
}

export function removeUpgrade(upgr, upgrade) {
  const index = activeTimedUpgrades.indexOf(upgr);
  if (index > -1) {
    activeTimedUpgrades.splice(index, 1);
    const timerEl = document.querySelector(`#notif-small-text${upgrade.id}`);
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
  activeUpgrs.push(upgradeToGrant.id);
  setActiveTimedUpgrades(activeUpgrs);

  showNotif(upgradeToBuy.name, banana.i18n("timed-upgr-notif", formatTime(upgradeToBuy.duration)), "notif-timed-upgr");
  const notifSmallText = document.querySelector(`#notif-small-text${getNotifCount()}`);
  notifSmallText.id = "notif-small-text" + upgradeToGrant.id;
  runUpgrade(upgradeToGrant);
}

function updateTimerDisplay(upgrade, remainingTime) {
  const timerEl = document.querySelector(`#notif-small-text${upgrade.id}`);
  if (timerEl) {
    timerEl.textContent = banana.i18n("timed-upgr-notif", formatTime(remainingTime));
  }
}
