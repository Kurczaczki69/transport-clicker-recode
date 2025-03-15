import { getUpgrades } from "../data/upgradeData.js";
import { getBal, setBal, getBghtUpgrs, setBghtUpgrs, saveGame } from "../scr.js";
import { showAlert } from "../utilities.js";
import { banana } from "../langs.js";
import { getLevel } from "../levelSystem.js";
import { checkTimedUpgrLevel } from "./timedUpgrades.js";
import { playRandomCash, playRandomMouseClick } from "../sounds.js";

// REGULAR UPGRADES ONLY (so no timed upgrades)

const notReadySection = document.querySelector("#upgr-menu-other-categories");
const vehicleTypeSection = document.querySelector("#upgr-menu-vehicle-type-category");
const timedUpgrSection = document.querySelector("#upgr-menu-timed-upgrades-category");
const dropdown = document.querySelector("#upgr-menu-category-dropdown");

const isGamePage = window.location.pathname.includes("game.html");

// upgrade menu category dropdown
if (isGamePage) {
  dropdown.addEventListener("change", () => {
    if (dropdown.value === "0") {
      notReadySection.style.display = "none";
      vehicleTypeSection.style.display = "block";
      timedUpgrSection.style.display = "none";
    } else if (dropdown.value === "1") {
      checkTimedUpgrLevel();
      timedUpgrSection.style.display = "block";
      vehicleTypeSection.style.display = "none";
      notReadySection.style.display = "none";
    } else {
      notReadySection.style.display = "block";
      vehicleTypeSection.style.display = "none";
      timedUpgrSection.style.display = "none";
    }
  });
}

// opening upgrade menu
const navItemUpgrMenu = document.querySelector("#nav-item-upgr-menu");
const upgradeGUI = document.querySelector("#upgrades");
const tint = document.querySelector("#window-tint");
const upgrMenuCloseBtn = document.querySelector("#upgr-menu-close-btn");

if (isGamePage) {
  navItemUpgrMenu.addEventListener("click", () => {
    checkLevelUpgr();
    checkTimedUpgrLevel();
    playRandomMouseClick();
    tint.style.display = "block";
    upgradeGUI.style.display = "flex";
  });

  // closing upgrade menu
  upgrMenuCloseBtn.addEventListener("click", () => {
    playRandomMouseClick();
    tint.style.display = "none";
    upgradeGUI.style.display = "none";
  });
}

// buy upgrade after confirming it
function buyUpgrade(upgrade) {
  const upgrades = getUpgrades();
  const upgradeToBuy = upgrades.find((u) => u.id === upgrade);
  const confirmationDialog = document.querySelector("#confirm-upgrade-dialog");
  let bal = getBal();
  let bghtUpgrs = getBghtUpgrs();
  if (upgradeToBuy.isAvailable) {
    if (!bghtUpgrs.includes(upgradeToBuy.id)) {
      if (bal <= upgradeToBuy.price) {
        confirmationDialog.style.display = "none";
        showAlert(banana.i18n("cant-afford"));
      } else {
        bghtUpgrs.push(upgradeToBuy.id);
        setBal((bal -= upgradeToBuy.price));
        setBghtUpgrs(bghtUpgrs);
        confirmationDialog.style.display = "none";
        showAlert(banana.i18n("upgrade-success"));
        saveGame(true);
      }
    } else {
      confirmationDialog.style.display = "none";
      showAlert(banana.i18n("upgrade-already-bought"));
    }
  } else {
    confirmationDialog.style.display = "none";
    showAlert(banana.i18n("upgrade-not-available"));
  }
}

// confirm if the user wants to buy the upgrade
function confirmUpgrade(upgradetobuy) {
  const upgrades = getUpgrades();
  const upgradeToBuy = upgrades.find((u) => u.id === upgradetobuy);
  const confirmationDialog = document.querySelector("#confirm-upgrade-dialog");
  const confirmBtn = document.querySelector("#confirm-upgr-btn");
  const cancelBtn = document.querySelector("#cancel-upgr-btn");
  const upgradeName = document.querySelector("#confirm-upgrade-dialog-text-name");
  upgradeName.textContent = upgradeToBuy.name;
  confirmationDialog.style.display = "block";

  const newConfirmBtn = confirmBtn.cloneNode(true);
  const newCancelBtn = cancelBtn.cloneNode(true);
  confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
  cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);

  newConfirmBtn.addEventListener("click", () => {
    playRandomCash();
    buyUpgrade(upgradetobuy);
  });

  newCancelBtn.addEventListener("click", () => {
    playRandomMouseClick();
    confirmationDialog.style.display = "none";
  });
}

function blockUpgrade(upgradetobuy, reason) {
  const upgrades = getUpgrades();
  const upgradeToBuy = upgrades.find((u) => u.id === upgradetobuy);

  if (reason == "level") {
    showAlert(banana.i18n("upgrade-blocked-level", upgradeToBuy.requiredLevel));
  }
}

export function checkLevelUpgr() {
  const upgrEls = document.querySelectorAll(".upgr-menu-vehicle-type-item-btn");
  const upgrTextEls = document.querySelectorAll(".upgr-menu-vehicle-type-item-btn-text");
  const upgrades = getUpgrades();
  const level = getLevel();

  upgrEls.forEach((upgrEl, index) => {
    const upgrade = upgrades.find((u) => u.id === upgrEl.id);
    if (upgrade && upgrade.requiredLevel > level) {
      upgrTextEls[index].textContent = "";
      upgrTextEls[index].classList.add("tabler--lock-filled");
      upgrEl.classList.remove("upgr-menu-vehicle-type-item-btn");
      upgrEl.classList.add("upgr-btn-disabled");
      upgrEl.removeEventListener("click", () => {});
      upgrEl.addEventListener("click", () => {
        playRandomMouseClick();
        blockUpgrade(upgrEl.id, "level");
      });
    } else if (upgrade && upgrade.requiredLevel == level) {
      upgrEl.removeEventListener("click", () => {});
      upgrEl.addEventListener("click", () => {
        playRandomMouseClick();
        confirmUpgrade(upgrEl.id);
      });
    } else {
      upgrEl.removeEventListener("click", () => {});
      upgrEl.addEventListener("click", () => {
        playRandomMouseClick();
        confirmUpgrade(upgrEl.id);
      });
    }
  });
}
