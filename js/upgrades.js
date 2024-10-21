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
