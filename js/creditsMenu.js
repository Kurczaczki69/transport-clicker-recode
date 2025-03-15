import { playRandomMouseClick } from "./sounds.js";

const creditsWindow = document.querySelector("#credits-window");
const tint = document.querySelector("#window-tint");
const creditsBtn = document.querySelector("#credits-btn");
const closeCreditsBtn = document.querySelector("#close-credits-window-btn");

creditsBtn.addEventListener("click", () => {
  playRandomMouseClick();
  tint.style.display = "block";
  creditsWindow.style.display = "block";
});

closeCreditsBtn.addEventListener("click", () => {
  playRandomMouseClick();
  tint.style.display = "none";
  creditsWindow.style.display = "none";
});

// switching categories in credits menu

const contributorsBtn = document.querySelector("#credits-menu-authors-btn");
const translatorsBtn = document.querySelector("#credits-menu-translators-btn");

contributorsBtn.addEventListener("click", () => {
  playRandomMouseClick();
  document.getElementById("credits-menu-authors-section").style.display = "block";
  document.getElementById("credits-menu-translators-section").style.display = "none";
});

translatorsBtn.addEventListener("click", () => {
  playRandomMouseClick();
  document.getElementById("credits-menu-authors-section").style.display = "none";
  document.getElementById("credits-menu-translators-section").style.display = "block";
});
