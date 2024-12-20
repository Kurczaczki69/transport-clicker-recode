import { timedUpgrades } from "../data/timedUpgradeData.js";
import { getBal } from "../scr.js";
import { showMsg, clearMsg, formatTime } from "../utilities.js";

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
      activeTimedUpgrades.push(upgradeToBuy);
      bal -= upgradeToBuy.price;
      showMsg("Ulepszenie aktywowane na " + formatTime(upgradeToBuy.time) + "!", "msg-confirm-upgrade");
      // TODO: add functionality to display active timed upgrades in UI
    } else {
      showMsg("Możesz mieć tylko" + activeTimedUpgradeLimit + " aktywnych ulepszeń!", "msg-confirm-upgrade");
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

  confirmBtn.addEventListener("click", () => {
    buyTimedUpgrade(upgradetobuy);
  });

  cancelBtn.addEventListener("click", () => {
    confirmationDialog.style.display = "none";
  });
}

timedUpgrEls.forEach((timedUpgrEl) => {
  timedUpgrEl.addEventListener("click", () => {
    confirmTimedUpgrade(timedUpgrEl.id);
  });
});
