import { getBghtUpgrs } from "./scr.js";
import { showAlert } from "./utilities.js";
import { banana } from "./langs.js";

// subcategories for buses
const dropdown1 = document.getElementById("vhcl-menu-subcategory-dropdown-1");
const dropdown3 = document.getElementById("vhcl-menu-subcategory-dropdown-3");
const cityBusSection = document.getElementById("vhcl-menu-bus-sub-citybus-category");
const hydrogenBusSection = document.getElementById("vhcl-menu-bus-sub-hydrogen-category");
const intercityBusSection = document.getElementById("vhcl-menu-bus-sub-intercity-category");

dropdown1.addEventListener("change", () => {
  let bghtUpgrs = getBghtUpgrs();
  if (dropdown1.value === "0") {
    if (bghtUpgrs.includes("citybus")) {
      cityBusSection.style.display = "block";
      hydrogenBusSection.style.display = "none";
      intercityBusSection.style.display = "none";
    } else {
      showAlert(banana.i18n("vhcl-category-locked", banana.i18n("city-buses")));
      $("#vhcl-menu-subcategory-dropdown-1").val("0");
    }
  } else if (dropdown1.value === "1") {
    if (bghtUpgrs.includes("hydrogenbus")) {
      hydrogenBusSection.style.display = "block";
      cityBusSection.style.display = "none";
      intercityBusSection.style.display = "none";
    } else {
      showAlert(banana.i18n("vhcl-category-locked", banana.i18n("hydrogen-buses")));
      $("#vhcl-menu-subcategory-dropdown-1").val("0");
    }
  } else if (dropdown1.value === "2") {
    if (bghtUpgrs.includes("intercitybus")) {
      intercityBusSection.style.display = "block";
      cityBusSection.style.display = "none";
      hydrogenBusSection.style.display = "none";
    } else {
      showAlert(banana.i18n("vhcl-category-locked", banana.i18n("intercity-buses")));
      $("#vhcl-menu-subcategory-dropdown-1").val("0");
    }
  }
});

const trolleybusSection = document.getElementById("vhcl-menu-trolleybus-category");
const otherSections = document.getElementById("vhcl-menu-other-categories");

dropdown3.addEventListener("change", () => {
  if (dropdown3.value === "0") {
    trolleybusSection.style.display = "block";
    otherSections.style.display = "none";
  } else if (dropdown3.value === "1") {
    trolleybusSection.style.display = "none";
    otherSections.style.display = "block";
  }
});

// main categories for vehicle menu
const dropdown = document.getElementById("vhcl-menu-category-dropdown");
const busSection = document.getElementById("vhcl-menu-bus-category");

const subDropdownCityBus = document.getElementById("vhcl-menu-subcategory-dropdown-1");
const subDropdownOthers = document.getElementById("vhcl-menu-subcategory-dropdown-2");
const subDropdownTrolleybus = document.getElementById("vhcl-menu-subcategory-dropdown-3");

dropdown.addEventListener("change", () => {
  if (dropdown.value === "0") {
    busSection.style.display = "block";
    trolleybusSection.style.display = "none";
    otherSections.style.display = "none";

    subDropdownCityBus.style.display = "block";
    subDropdownOthers.style.display = "none";
    subDropdownTrolleybus.style.display = "none";
  } else if (dropdown.value === "1") {
    if (getBghtUpgrs().includes("trolleybus")) {
      busSection.style.display = "none";
      trolleybusSection.style.display = "block";
      otherSections.style.display = "none";

      subDropdownCityBus.style.display = "none";
      subDropdownOthers.style.display = "none";
      subDropdownTrolleybus.style.display = "block";
    } else {
      showAlert(banana.i18n("vhcl-category-locked", banana.i18n("trolleybuses")));
      $("#vhcl-menu-category-dropdown").val("0");
    }
  } else if (dropdown.value === "2") {
    busSection.style.display = "none";
    trolleybusSection.style.display = "none";
    otherSections.style.display = "block";

    subDropdownCityBus.style.display = "none";
    subDropdownOthers.style.display = "block";
    subDropdownTrolleybus.style.display = "none";
  }
});
