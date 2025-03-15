import { playRandomMouseClick } from "../sounds.js";

const accWindow = document.querySelector("#accountbox");
const tint = document.querySelector("#window-tint");
const openWindowBtn = document.querySelector("#nav-item-account-page");
const closeWindowBtn = document.querySelector("#acc-menu-close-btn");

openWindowBtn.addEventListener("click", () => {
  playRandomMouseClick();
  tint.style.display = "block";
  accWindow.style.display = "block";
});

closeWindowBtn.addEventListener("click", () => {
  playRandomMouseClick();
  tint.style.display = "none";
  accWindow.style.display = "none";
});
