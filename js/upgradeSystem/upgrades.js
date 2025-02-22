import { getUpgrades } from "../data/upgradeData.js";
import { getBal, setBal, getBghtUpgrs, setBghtUpgrs, silentSaveGame } from "../scr.js";
import { showAlert } from "../utilities.js";
import { banana } from "../langs.js";

// REGULAR UPGRADES ONLY (so no timed upgrades)

const notReadySection = document.getElementById("upgr-menu-other-categories");
const vehicleTypeSection = document.getElementById("upgr-menu-vehicle-type-category");
const timedUpgrSection = document.getElementById("upgr-menu-timed-upgrades-category");
const dropdown = document.getElementById("upgr-menu-category-dropdown");

// upgrade menu category dropdown
dropdown.addEventListener("change", () => {
  if (dropdown.value === "0") {
    notReadySection.style.display = "none";
    vehicleTypeSection.style.display = "block";
    timedUpgrSection.style.display = "none";
  } else if (dropdown.value === "1") {
    timedUpgrSection.style.display = "block";
    vehicleTypeSection.style.display = "none";
    notReadySection.style.display = "none";
  } else {
    notReadySection.style.display = "block";
    vehicleTypeSection.style.display = "none";
    timedUpgrSection.style.display = "none";
  }
});

// opening upgrade menu
const navItemUpgrMenu = document.getElementById("nav-item-upgr-menu");
const upgradeGUI = document.getElementById("upgrades");
const tint = document.querySelector("#window-tint");
const upgrMenuCloseBtn = document.getElementById("upgr-menu-close-btn");

navItemUpgrMenu.addEventListener("click", () => {
  tint.style.display = "block";
  upgradeGUI.style.display = "flex";
});

// closing upgrade menu
upgrMenuCloseBtn.addEventListener("click", () => {
  tint.style.display = "none";
  upgradeGUI.style.display = "none";
});

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
        silentSaveGame();
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

  confirmBtn.addEventListener("click", () => {
    buyUpgrade(upgradetobuy);
  });

  cancelBtn.addEventListener("click", () => {
    confirmationDialog.style.display = "none";
  });
}

const upgrEls = document.querySelectorAll(".upgr-menu-vehicle-type-item-btn");

// Loop over the bus elements and attach an event listener to each one
upgrEls.forEach((upgrEl) => {
  upgrEl.addEventListener("click", () => {
    confirmUpgrade(upgrEl.id);
  });
});
