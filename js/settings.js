import { themes } from "./data/themeData.js";
import { banana } from "./langs.js";

const settingsWindow = document.querySelector("#settings-menu");
const tint = document.querySelector("#window-tint");
const openWindowBtn = document.querySelector("#nav-item-settings-page");
const closeWindowBtn = document.querySelector("#settings-menu-close-btn");

openWindowBtn.addEventListener("click", () => {
  populateThemeOptions();
  tint.style.display = "block";
  settingsWindow.style.display = "block";
});

closeWindowBtn.addEventListener("click", () => {
  tint.style.display = "none";
  settingsWindow.style.display = "none";
});

function updateColorScheme(colors) {
  localStorage.setItem("colorScheme", JSON.stringify(colors));
  const root = document.documentElement;

  // Update color variables
  root.style.setProperty("--colorscheme1", colors.color1 || "#062925");
  root.style.setProperty("--colorscheme2", colors.color2 || "#044a42");
  root.style.setProperty("--colorscheme3", colors.color3 || "#3a9188");
  root.style.setProperty("--colorscheme4", colors.color4 || "#b8e1dd");
}

function retrieveColorScheme() {
  const colorScheme = localStorage.getItem("colorScheme");
  if (colorScheme) {
    const colors = JSON.parse(colorScheme);
    updateColorScheme(colors);
  }
}

export function populateThemeOptions() {
  const themeWrapper = document.querySelector("#settings-theme-items");
  themeWrapper.innerHTML = "";

  themes.forEach((theme) => {
    const themeItem = document.createElement("div");
    const themeName = document.createElement("p");
    themeName.textContent = banana.i18n("theme-" + theme.name);
    themeName.classList.add("settings-theme-name");
    themeItem.appendChild(themeName);
    themeItem.classList.add("settings-theme-item");
    themeItem.style.backgroundColor = theme.color3;

    themeItem.addEventListener("click", () => {
      updateColorScheme(theme);
    });

    themeWrapper.appendChild(themeItem);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  retrieveColorScheme();
});
