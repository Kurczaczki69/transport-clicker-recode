import { themes } from "./data/themeData.js";
import { playRandomMouseClick } from "./sounds.js";
import { animateAppear, animateDisappear, animateWindowClose, animateWindowOpen, getI18n } from "./utilities.js";
import { displayCompanyName } from "./scr.js";
import defaultBg from "../img/bg/bg-1.png";
import defaultBus from "../img/other/bus-default.png";

const settingsWindow = document.querySelector("#settings-menu");
const tint = document.querySelector("#window-tint");
const openWindowBtn = document.querySelector("#nav-item-settings-page");
const closeWindowBtn = document.querySelector("#settings-menu-close-btn");

const isGamePage = window.location.pathname.endsWith("game.html");

if (isGamePage) {
  openWindowBtn.addEventListener("click", () => {
    const helpTranslateText = document.querySelector("#help-translate-text");
    helpTranslateText.innerHTML = getI18n("settings-help-translate", '<a href="https://hosted.weblate.org/projects/transport-clicker/" target="_blank" class="link">', "</a>");
    populateThemeOptions();
    playRandomMouseClick();
    displayCompanyName();
    settingsWindow.style.display = "block";
    animateWindowOpen(settingsWindow, true, tint);
  });

  closeWindowBtn.addEventListener("click", () => {
    playRandomMouseClick();
    animateWindowClose(settingsWindow, true, tint);
  });
}

// switching tabs
const generalTab = document.querySelector("#settings-general-tab");
const accountTab = document.querySelector("#settings-account-tab");
const generalTabBtn = document.querySelector("#settings-general-tab-btn");
const accountTabBtn = document.querySelector("#settings-account-tab-btn");

if (isGamePage) {
  generalTabBtn.addEventListener("click", () => {
    playRandomMouseClick();
    animateDisappear(accountTab);
    animateAppear(generalTab, "block");
    generalTabBtn.classList.add("settings-tab-active");
    accountTabBtn.classList.remove("settings-tab-active");
  });

  accountTabBtn.addEventListener("click", () => {
    playRandomMouseClick();
    animateDisappear(generalTab);
    animateAppear(accountTab, "block");
    generalTabBtn.classList.remove("settings-tab-active");
    accountTabBtn.classList.add("settings-tab-active");
  });
}

// themes

const clicker = document.querySelector("#clicker-img");
function updateColorScheme(colors) {
  localStorage.setItem("colorScheme", JSON.stringify(colors));
  const root = document.documentElement;
  const body = document.body;

  root.style.setProperty("--colorscheme1", colors.color1 || "#062925");
  root.style.setProperty("--colorscheme2", colors.color2 || "#044a42");
  root.style.setProperty("--colorscheme3", colors.color3 || "#3a9188");
  root.style.setProperty("--colorscheme4", colors.color4 || "#b8e1dd");
  root.style.setProperty("--colorscheme5", colors.color5 || "#66ada6");

  body.style.backgroundImage = `url(${colors.bgPath || defaultBg})`;

  if (clicker) {
    clicker.src = colors.busPath || defaultBus;
  }
}

function retrieveColorScheme() {
  const colorScheme = localStorage.getItem("colorScheme");
  if (colorScheme) {
    const colors = JSON.parse(colorScheme);
    updateColorScheme(colors);
  } else {
    clicker.src = defaultBus;
  }
}

export function populateThemeOptions() {
  if (!isGamePage) return;
  const themeWrapper = document.querySelector("#settings-theme-items");
  themeWrapper.innerHTML = "";

  themes.forEach((theme) => {
    const themeItem = document.createElement("div");
    const themeName = document.createElement("p");
    themeName.textContent = getI18n(`theme-${theme.name}`);
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
const lowPerfSwitch = document.querySelector("#low-perf-switch");
function retrieveSoundPreference() {
  if (!isGamePage) return;
  const soundPreference = localStorage.getItem("soundPreference") || "on";
  if (soundPreference === "on") {
    soundSwitch.checked = true;
    updateSoundPreference();
  }
}

function retrieveLowPerfPreference() {
  if (!isGamePage) return;
  const lowPerfPreference = localStorage.getItem("lowPerfPreference") || "off";
  if (lowPerfPreference === "on") {
    lowPerfSwitch.checked = true;
    updateLowPerfPreference();
  }
}

function updateSoundPreference() {
  const soundPreference = soundSwitch.checked ? "on" : "off";
  localStorage.setItem("soundPreference", soundPreference);
}

function updateLowPerfPreference() {
  const lowPerfPreference = lowPerfSwitch.checked ? "on" : "off";
  localStorage.setItem("lowPerfPreference", lowPerfPreference);
}

if (isGamePage) {
  soundSwitch.addEventListener("change", () => {
    updateSoundPreference();
    playRandomMouseClick();
  });

  lowPerfSwitch.addEventListener("change", () => {
    updateLowPerfPreference();
    playRandomMouseClick();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  retrieveColorScheme();
  retrieveSoundPreference();
  retrieveLowPerfPreference();
});
