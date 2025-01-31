import Banana from "../node_modules/banana-i18n/dist/esm/banana-i18n.js";

const banana = new Banana();

function updateLang(lang) {
  fetch(`lang/${lang}.json`)
    .then((response) => response.json())
    .then((messages) => {
      banana.load(messages, lang);
      banana.setLocale(lang);
      updateLangInHtml();
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
}

const langDropdown = document.querySelector("#lang-dropdown");

langDropdown.addEventListener("change", (event) => {
  const selectedLang = event.target.value;
  changeLang(selectedLang);
});

document.addEventListener("DOMContentLoaded", () => {
  const userLang = localStorage.getItem("lang");
  if (userLang) {
    changeLang(userLang);
    langDropdown.value = userLang;
  } else {
    const browserLang = navigator.language.split("-")[0];
    changeLang(browserLang);
    langDropdown.value = browserLang;
  }
  updateLangInHtml();
});

export { banana };
