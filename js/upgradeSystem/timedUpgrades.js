import { timedUpgrades } from "../data/timedUpgradeData.js";
import { getBal, setBal } from "../scr.js";
import { clearMsg, formatTime, showAlert } from "../utilities.js";
import { showNotif, getNotifCount, removeNotif } from "../notifs.js";

let activeTimedUpgrades = [];
const activeTimedUpgradeLimit = 2;

// timed upgrade buy logic
const timedUpgrEls = document.querySelectorAll(".upgr-menu-timed-upgr-item-btn");

function buyTimedUpgrade(upgrId) {
  const upgradeToBuy = timedUpgrades.find((u) => u.id === upgrId);
  const confirmationDialog = document.querySelector("#confirm-upgrade-dialog");
  let bal = getBal();
  if (bal < upgradeToBuy.price) {
    confirmationDialog.style.display = "none";
    showAlert("Nie stać cię!");
  } else {
    if (activeTimedUpgrades.length < activeTimedUpgradeLimit) {
      let activeUpgrs = getActiveTimedUpgrades();
      activeUpgrs.push(upgradeToBuy.id);
      setActiveTimedUpgrades(activeUpgrs);
      bal -= upgradeToBuy.price;
      setBal(bal);
      confirmationDialog.style.display = "none";
      showAlert("Ulepszenie aktywowane na " + formatTime(upgradeToBuy.duration) + "!");
      showNotif(upgradeToBuy.name, "Pozostały czas: " + formatTime(upgradeToBuy.duration), "notif-timed-upgr");
      const notifSmallText = document.querySelector(`#notif-small-text${getNotifCount()}`);
      notifSmallText.id = "notif-small-text" + upgradeToBuy.id;
      runUpgrade(upgradeToBuy);
    } else {
      confirmationDialog.style.display = "none";
      if (activeTimedUpgradeLimit === 1) {
        showAlert("Możesz mieć tylko jedno aktywne ulepszenie!");
      } else if (activeTimedUpgradeLimit > 1) {
        showAlert("Możesz mieć tylko " + activeTimedUpgradeLimit + " aktywnych ulepszeń!");
      }
    }
  }
}

function confirmTimedUpgrade(upgradetobuy) {
  const upgradeToBuy = timedUpgrades.find((u) => u.id === upgradetobuy);
  const confirmationDialog = document.querySelector("#confirm-upgrade-dialog");
  const confirmBtn = document.querySelector("#confirm-upgr-btn");
  const cancelBtn = document.querySelector("#cancel-upgr-btn");
  const upgradeName = document.querySelector("#confirm-upgrade-dialog-text-name");
  upgradeName.textContent = upgradeToBuy.name;
  clearMsg("msg-confirm-upgrade");
  confirmationDialog.style.display = "block";

  confirmBtn.addEventListener(
    "click",
    () => {
      buyTimedUpgrade(upgradetobuy);
    },
    { once: true }
  );

  cancelBtn.addEventListener("click", () => {
    confirmationDialog.style.display = "none";
  });
}

timedUpgrEls.forEach((timedUpgrEl) => {
  timedUpgrEl.addEventListener("click", () => {
    confirmTimedUpgrade(timedUpgrEl.id);
  });
});

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
  const upgradeToGrant = timedUpgrades.find((u) => u.id === upgrId);
  if (!upgradeToGrant) {
    console.log(`Upgrade with ID ${upgrId} does not exist.`);
    return;
  }
  let activeUpgrs = getActiveTimedUpgrades();
  activeUpgrs.push(upgradeToGrant.id);
  setActiveTimedUpgrades(activeUpgrs);

  showNotif(upgradeToGrant.name, "Pozostały czas: " + formatTime(upgradeToGrant.duration), "notif-timed-upgr");
  const notifSmallText = document.querySelector(`#notif-small-text${getNotifCount()}`);
  notifSmallText.id = "notif-small-text" + upgradeToGrant.id;
  runUpgrade(upgradeToGrant);
}

function updateTimerDisplay(upgrade, remainingTime) {
  const timerEl = document.querySelector(`#notif-small-text${upgrade.id}`);
  if (timerEl) {
    timerEl.textContent = `Pozostały czas: ${formatTime(remainingTime)}`;
  }
}
