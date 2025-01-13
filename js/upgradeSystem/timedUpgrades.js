import { timedUpgrades } from "../data/timedUpgradeData.js";
import { getBal, setBal } from "../scr.js";
import { showMsg, clearMsg, formatTime } from "../utilities.js";
import { showNotif } from "../notifs.js";

let activeTimedUpgrades = [];
const activeTimedUpgradeLimit = 2;

// timed upgrade buy logic
const timedUpgrEls = document.querySelectorAll(".upgr-menu-timed-upgr-item-btn");

function buyTimedUpgrade(upgrId) {
  const upgradeToBuy = timedUpgrades.find((u) => u.id === upgrId);
  let bal = getBal();
  if (bal <= upgradeToBuy.price) {
    showMsg("Nie stać cię!", "msg-confirm-upgrade");
  } else {
    if (activeTimedUpgrades.length < activeTimedUpgradeLimit) {
      activeTimedUpgrades.push(upgradeToBuy.id);
      bal -= upgradeToBuy.price;
      console.log(activeTimedUpgrades);
      setBal(bal);
      showMsg("Ulepszenie aktywowane na " + formatTime(upgradeToBuy.time) + "!", "msg-confirm-upgrade");
      showNotif(upgradeToBuy.name, "Pozostały czas: " + formatTime(upgradeToBuy.time), "notif-timed-upgr");
    } else {
      console.log(activeTimedUpgrades);
      showMsg("Możesz mieć tylko " + activeTimedUpgradeLimit + " aktywnych ulepszeń!", "msg-confirm-upgrade");
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
  activeTimedUpgrades = upgrades;
}
