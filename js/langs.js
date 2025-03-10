import Banana from "../node_modules/banana-i18n/dist/esm/banana-i18n.js";
import { updateHtmlData } from "./upgradeSystem/insertDataIntoHtml.js";
import { initializeTimedUpgrades } from "./data/timedUpgradeData.js";
import { initializeUpgrades } from "./data/upgradeData.js";
import { initializeVehicles } from "./data/vhclData.js";
import { syncVehiclePrices } from "./scr.js";
import { populateThemeOptions } from "./settings.js";
import { sleep } from "./utilities.js";
import { initializeCities } from "./data/cityData.js";

const banana = new Banana();

function updateLang(lang) {
  $("#loader-wrapper").fadeIn(350);
  sleep(360).then(() => {
    fetch(`lang/${lang}.json`)
      .then((response) => response.json())
      .then((messages) => {
        banana.load(messages, lang);
        banana.setLocale(lang);
        updateLangInHtml();
        initializeTimedUpgrades();
        initializeUpgrades();
        initializeVehicles();
        initializeCities();
        populateThemeOptions();
        syncVehiclePrices();
        const currentPage = document.body.getAttribute("data-page");
        document.documentElement.setAttribute("lang", lang);
        setPageTitle(currentPage);
        sleep(200).then(() => {
          $("#loader-wrapper").fadeOut("slow");
        });
      });
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
    element.textContent = banana.i18n(key);
  });

  const placeholders = document.querySelectorAll("[data-lang-placeholder]");
  placeholders.forEach((element) => {
    const key = element.getAttribute("data-lang-placeholder");
    element.setAttribute("placeholder", banana.i18n(key));
  });

  updateHtmlData();
}

export function setPageTitle(page) {
  const titleKey = `page-title-${page}`;
  const title = banana.i18n(titleKey);
  if (title) {
    document.title = title;
  }
}

const langDropdown = document.querySelector("#lang-dropdown");

if (langDropdown) {
  langDropdown.addEventListener("change", (event) => {
    const selectedLang = event.target.value;
    changeLang(selectedLang);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const userLang = localStorage.getItem("lang");
  if (langDropdown) {
    if (userLang) {
      changeLang(userLang);
      langDropdown.value = userLang;
    } else {
      const browserLang = navigator.language.split("-")[0];
      changeLang(browserLang);
      langDropdown.value = browserLang;
    }
  } else {
    if (userLang) {
      changeLang(userLang);
    } else {
      const browserLang = navigator.language.split("-")[0];
      changeLang(browserLang);
    }
  }
  updateLangInHtml();
});

export { banana, updateLang };
