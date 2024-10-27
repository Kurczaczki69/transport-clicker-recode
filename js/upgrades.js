import { upgrades, upgradeCategories } from "./data/upgradeData.js";
import { getBal, setBal, getBghtUpgrs, setBghtUpgrs } from "./scr.js";

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

function buyUpgrade(upgrade) {
  const upgradeToBuy = upgrades.find((u) => u.id === upgrade);
  let bal = getBal();
  let bghtUpgrs = getBghtUpgrs();
  if (upgradeToBuy.isAvailable) {
    if (bal >= upgradeToBuy.price) {
      bghtUpgrs.push(upgradeToBuy);
      setBal((bal -= upgradeToBuy.price));
      setBghtUpgrs(bghtUpgrs);
      console.log(bghtUpgrs);
    } else {
      window.alert("Nie stać cię!");
    }
  } else {
    window.alert("To ulepszenie będzie dostępne w następnych aktualizacjach!");
  }
}

// listeners for different upgrades

const cityBusBtn = document.getElementById("citybus");
const hydrogenBusBtn = document.getElementById("hydrogenbus");
const intercityBusBtn = document.getElementById("intercitybus");
const trolleybusBtn = document.getElementById("trolleybus");
const tramBtn = document.getElementById("tram");

cityBusBtn.addEventListener("click", () => {
  buyUpgrade("citybus");
});

hydrogenBusBtn.addEventListener("click", () => {
  buyUpgrade("hydrogenbus");
});

intercityBusBtn.addEventListener("click", () => {
  buyUpgrade("intercitybus");
});

trolleybusBtn.addEventListener("click", () => {
  buyUpgrade("trolleybus");
});

tramBtn.addEventListener("click", () => {
  buyUpgrade("tram");
});
