import { upgrades, upgradeCategories } from "./data/upgradeData.js";
import { getBal, setBal, getBghtUpgrs, setBghtUpgrs, silentSaveGame } from "./scr.js";
import { showMsg, clearMsg } from "./utilities.js";

const notReadySection = document.getElementById("upgr-menu-other-categories");
const vehicleTypeSection = document.getElementById("upgr-menu-vehicle-type-category");
const dropdown = document.getElementById("upgr-menu-category-dropdown");

// upgrade menu category dropdown
dropdown.addEventListener("change", () => {
  if (dropdown.value === "0") {
    notReadySection.style.display = "none";
    vehicleTypeSection.style.display = "block";
  } else {
    notReadySection.style.display = "block";
    vehicleTypeSection.style.display = "none";
  }
});

// opening upgrade menu
const navItemUpgrMenu = document.getElementById("nav-item-upgr-menu");
const upgradeGUI = document.getElementById("upgrades");
const upgrMenuCloseBtn = document.getElementById("upgr-menu-close-btn");

navItemUpgrMenu.addEventListener(
  "click",
  function () {
    upgradeGUI.style.display = "flex";
  },
  false
);

// closing upgrade menu
upgrMenuCloseBtn.addEventListener(
  "click",
  function () {
    upgradeGUI.style.display = "none";
  },
  false
);

// buy upgrade after confirming it
function buyUpgrade(upgrade) {
  const upgradeToBuy = upgrades.find((u) => u.id === upgrade);
  let bal = getBal();
  let bghtUpgrs = getBghtUpgrs();
  if (upgradeToBuy.isAvailable) {
    if (!bghtUpgrs.includes(upgradeToBuy.id)) {
      if (bal <= upgradeToBuy.price) {
        showMsg("Nie stać cię!", "msg-confirm-upgrade");
      } else {
        bghtUpgrs.push(upgradeToBuy.id);
        setBal((bal -= upgradeToBuy.price));
        setBghtUpgrs(bghtUpgrs);
        showMsg("Kupiono ulepszenie!", "msg-confirm-upgrade");
        silentSaveGame();
      }
    } else {
      showMsg("Już kupiłeś to ulepszenie!", "msg-confirm-upgrade");
    }
  } else {
    showMsg("To ulepszenie będzie dostępne w następnych aktualizacjach!", "msg-confirm-upgrade");
  }
}

// confirm if the user wants to buy the upgrade
function confirmUpgrade(upgradetobuy) {
  const upgradeToBuy = upgrades.find((u) => u.id === upgradetobuy);
  const confirmationDialog = document.querySelector("#confirm-upgrade-dialog");
  const confirmBtn = document.querySelector("#confirm-upgr-btn");
  const cancelBtn = document.querySelector("#cancel-upgr-btn");
  const upgradeName = document.querySelector("#confirm-upgrade-dialog-text-name");
  upgradeName.textContent = upgradeToBuy.name;
  clearMsg("msg-confirm-upgrade");
  confirmationDialog.style.display = "block";

  confirmBtn.addEventListener("click", () => {
    buyUpgrade(upgradetobuy);
  });

  cancelBtn.addEventListener("click", () => {
    confirmationDialog.style.display = "none";
  });
}

// listeners for different upgrades

const cityBusBtn = document.getElementById("citybus");
const hydrogenBusBtn = document.getElementById("hydrogenbus");
const intercityBusBtn = document.getElementById("intercitybus");
const trolleybusBtn = document.getElementById("trolleybus");
const tramBtn = document.getElementById("tram");

cityBusBtn.addEventListener("click", () => {
  confirmUpgrade("citybus");
});

hydrogenBusBtn.addEventListener("click", () => {
  confirmUpgrade("hydrogenbus");
});

intercityBusBtn.addEventListener("click", () => {
  confirmUpgrade("intercitybus");
});

trolleybusBtn.addEventListener("click", () => {
  confirmUpgrade("trolleybus");
});

tramBtn.addEventListener("click", () => {
  confirmUpgrade("tram");
});
