import { getUpgrades } from "../data/upgradeData.js";
import { getBal, setBal, getBghtUpgrs, setBghtUpgrs, saveGame, getMaxFuel, setMaxFuel } from "../scr.js";
import { animateWindowClose, animateWindowOpen, showAlert, getI18n } from "../utilities.js";
import { getLevel } from "../levelSystem.js";
import { checkTimedUpgrLevel } from "./timedUpgrades.js";
import { playRandomCash, playRandomMouseClick } from "../sounds.js";

// REGULAR UPGRADES ONLY (so no timed upgrades)

const notReadySection = document.querySelector("#upgr-menu-other-categories");
const vehicleTypeSection = document.querySelector("#upgr-menu-vehicle-type-category");
const timedUpgrSection = document.querySelector("#upgr-menu-timed-upgrades-category");
const fuelTankSection = document.querySelector("#upgr-menu-fuel-tank-category");
const othersSection = document.querySelector("#upgr-menu-others-category");
const dropdown = document.querySelector("#upgr-menu-category-dropdown");

const isGamePage = window.location.pathname.includes("game.html");

// upgrade menu category dropdown
if (isGamePage) {
  dropdown.addEventListener("change", () => {
    playRandomMouseClick();
    if (dropdown.value === "0") {
      notReadySection.style.display = "none";
      vehicleTypeSection.style.display = "block";
      timedUpgrSection.style.display = "none";
      fuelTankSection.style.display = "none";
      othersSection.style.display = "none";
    } else if (dropdown.value === "1") {
      checkTimedUpgrLevel();
      timedUpgrSection.style.display = "block";
      vehicleTypeSection.style.display = "none";
      notReadySection.style.display = "none";
      fuelTankSection.style.display = "none";
      othersSection.style.display = "none";
    } else if (dropdown.value === "2") {
      notReadySection.style.display = "none";
      vehicleTypeSection.style.display = "none";
      timedUpgrSection.style.display = "none";
      fuelTankSection.style.display = "block";
      othersSection.style.display = "none";
    } else if (dropdown.value === "3") {
      notReadySection.style.display = "none";
      vehicleTypeSection.style.display = "none";
      timedUpgrSection.style.display = "none";
      fuelTankSection.style.display = "none";
      othersSection.style.display = "block";
    } else {
      notReadySection.style.display = "block";
      vehicleTypeSection.style.display = "none";
      timedUpgrSection.style.display = "none";
      fuelTankSection.style.display = "none";
      othersSection.style.display = "none";
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
    upgradeGUI.style.display = "flex";
    animateWindowOpen(upgradeGUI, true, tint);
  });

  // closing upgrade menu
  upgrMenuCloseBtn.addEventListener("click", () => {
    playRandomMouseClick();
    animateWindowClose(upgradeGUI, true, tint);
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
        playRandomMouseClick();
        animateWindowClose(confirmationDialog, false);
        showAlert(getI18n("cant-afford"));
      } else {
        playRandomCash();
        bghtUpgrs.push(upgradeToBuy.id);
        setBal((bal -= upgradeToBuy.price));
        setBghtUpgrs(bghtUpgrs);

        if (upgradeToBuy.category === "fuelTank" && upgradeToBuy.tankBoost) {
          const currentMaxFuel = getMaxFuel();
          setMaxFuel(currentMaxFuel + upgradeToBuy.tankBoost);
        }

        animateWindowClose(confirmationDialog, false);
        showAlert(getI18n("upgrade-success"));
        saveGame(true);
      }
    } else {
      playRandomMouseClick();
      animateWindowClose(confirmationDialog, false);
      showAlert(getI18n("upgrade-already-bought"));
    }
  } else {
    playRandomMouseClick();
    animateWindowClose(confirmationDialog, false);
    showAlert(getI18n("upgrade-not-available"));
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
  animateWindowOpen(confirmationDialog, false);

  const newConfirmBtn = confirmBtn.cloneNode(true);
  const newCancelBtn = cancelBtn.cloneNode(true);
  confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
  cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);

  newConfirmBtn.addEventListener("click", () => {
    buyUpgrade(upgradetobuy);
  });

  newCancelBtn.addEventListener("click", () => {
    playRandomMouseClick();
    animateWindowClose(confirmationDialog, false);
  });
}

function blockUpgrade(upgradetobuy, reason) {
  const upgrades = getUpgrades();
  const upgradeToBuy = upgrades.find((u) => u.id === upgradetobuy);

  if (reason == "level") {
    showAlert(getI18n("upgrade-blocked-level", upgradeToBuy.requiredLevel));
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
