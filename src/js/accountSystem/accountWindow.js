import { playRandomMouseClick } from "../sounds.js";
import { animateWindowOpen, animateWindowClose } from "../utilities.js";

const isGamePage = window.location.pathname.includes("game.html");

if (isGamePage) {
  const accWindow = document.querySelector("#accountbox");
  const tint = document.querySelector("#window-tint");
  const openWindowBtn = document.querySelector("#nav-item-account-page");
  const closeWindowBtn = document.querySelector("#acc-menu-close-btn");

  openWindowBtn.addEventListener("click", () => {
    playRandomMouseClick();
    accWindow.style.display = "block";
    animateWindowOpen(accWindow, true, tint);
  });

  closeWindowBtn.addEventListener("click", () => {
    playRandomMouseClick();
    animateWindowClose(accWindow, true, tint);
  });
}
