import Banana from "banana-i18n";
import { updateHtmlData } from "./upgradeSystem/insertDataIntoHtml.js";
import { initializeTimedUpgrades } from "./data/timedUpgradeData.js";
import { initializeUpgrades } from "./data/upgradeData.js";
import { initializeVehicles } from "./data/vhclData.js";
import { syncVehiclePrices } from "./scr.js";
import { populateThemeOptions } from "./settings.js";
import { initializeCities } from "./data/cityData.js";
import { playRandomMouseClick } from "./sounds.js";
import { getI18n } from "./utilities.js";
import { populateAchievementGrid } from "./achievements/achievementUI.js";
import { initializeAchievements } from "./data/achievementsData.js";

const banana = new Banana();

let defaultTranslations = {};

// load the fallback language (English) first
fetch("dist/lang/en.json")
  .then((response) => response.json())
  .then((messages) => {
    defaultTranslations = messages;
    banana.load(defaultTranslations, "en");
  });

function updateLang(lang) {
  fetch(`dist/lang/${lang}.json`)
    .then((response) => response.json())
    .then((messages) => {
      banana.load(messages, lang);
      banana.setLocale(lang);
      updateLangInHtml();
      initializeTimedUpgrades();
      initializeUpgrades();
      initializeVehicles();
      initializeCities();
      initializeAchievements();
      populateThemeOptions();
      populateAchievementGrid();
      syncVehiclePrices();
      const currentPage = document.body.getAttribute("data-page");
      document.documentElement.setAttribute("lang", lang);
      setPageTitle(currentPage);
    });
}

function changeLang(lang) {
  updateLang(lang);
  localStorage.setItem("lang", lang);
}

function updateLangInHtml() {
  const elements = document.querySelectorAll("[data-lang]");
  elements.forEach((element) => {
    const key = element.getAttribute("data-lang");
    let translation = banana.i18n(key);

    if (!translation || translation == "") {
      translation = defaultTranslations[key] || key;
    }

    element.textContent = translation;
  });

  const placeholders = document.querySelectorAll("[data-lang-placeholder]");
  placeholders.forEach((element) => {
    const key = element.getAttribute("data-lang-placeholder");
    let translation = banana.i18n(key);

    if (!translation || translation == "") {
      translation = defaultTranslations[key] || key;
    }
    element.setAttribute("placeholder", translation);
  });

  updateHtmlData();
}

export function setPageTitle(page) {
  const titleKey = `page-title-${page}`;
  const title = getI18n(titleKey);
  if (title && title !== titleKey) {
    document.title = title;
  }
}

const langDropdowns = document.querySelectorAll("#lang-dropdown, #lang-dropdown-login");

langDropdowns.forEach((dropdown) => {
  dropdown.addEventListener("change", (event) => {
    const selectedLang = event.target.value;
    playRandomMouseClick();
    changeLang(selectedLang);
    langDropdowns.forEach((otherDropdown) => {
      otherDropdown.value = selectedLang;
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const userLang = localStorage.getItem("lang");
  const browserLang = navigator.language.split("-")[0];
  const langToUse = userLang || browserLang;

  langDropdowns.forEach((dropdown) => {
    dropdown.value = langToUse;
  });

  changeLang(langToUse);
  updateLangInHtml();
});

export { banana, updateLang };
