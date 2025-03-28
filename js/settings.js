import { themes } from "./data/themeData.js";
import { banana } from "./langs.js";
import { playRandomMouseClick } from "./sounds.js";
import { animateWindowClose, animateWindowOpen } from "./utilities.js";

const settingsWindow = document.querySelector("#settings-menu");
const tint = document.querySelector("#window-tint");
const openWindowBtn = document.querySelector("#nav-item-settings-page");
const closeWindowBtn = document.querySelector("#settings-menu-close-btn");

const isGamePage = window.location.pathname.endsWith("game.html");

if (isGamePage) {
  openWindowBtn.addEventListener("click", () => {
    populateThemeOptions();
    playRandomMouseClick();
    settingsWindow.style.display = "block";
    animateWindowOpen(settingsWindow, true, tint);
  });

  closeWindowBtn.addEventListener("click", () => {
    playRandomMouseClick();
    animateWindowClose(settingsWindow, true, tint);
  });
}

function updateColorScheme(colors) {
  localStorage.setItem("colorScheme", JSON.stringify(colors));
  const root = document.documentElement;
  const body = document.body;
  const clicker = document.querySelector("#clicker-img");

  // Update color variables
  root.style.setProperty("--colorscheme1", colors.color1 || "#062925");
  root.style.setProperty("--colorscheme2", colors.color2 || "#044a42");
  root.style.setProperty("--colorscheme3", colors.color3 || "#3a9188");
  root.style.setProperty("--colorscheme4", colors.color4 || "#b8e1dd");

  // Update background image
  body.style.backgroundImage = `url("${colors.bgPath || "img/bg/bg-2.png"}")`;

  // Update clicker image
  if (clicker) {
    clicker.src = colors.busPath || "img/other/bus-default.png";
  }
}

function retrieveColorScheme() {
  const colorScheme = localStorage.getItem("colorScheme");
  if (colorScheme) {
    const colors = JSON.parse(colorScheme);
    updateColorScheme(colors);
  }
}

export function populateThemeOptions() {
  if (!isGamePage) return;
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
      playRandomMouseClick();
      updateColorScheme(theme);
    });

    themeWrapper.appendChild(themeItem);
  });
}

const soundSwitch = document.querySelector("#sound-switch");
function retrieveSoundPreference() {
  if (!isGamePage) return;
  const soundPreference = localStorage.getItem("soundPreference") || "on";
  if (soundPreference === "on") {
    soundSwitch.checked = true;
    updateSoundPreference();
  }
}

function updateSoundPreference() {
  const soundPreference = soundSwitch.checked ? "on" : "off";
  localStorage.setItem("soundPreference", soundPreference);
}

if (isGamePage) {
  soundSwitch.addEventListener("change", () => {
    updateSoundPreference();
    playRandomMouseClick();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  retrieveColorScheme();
  retrieveSoundPreference();
});
