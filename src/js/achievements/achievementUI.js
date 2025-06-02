import { playRandomMouseClick } from "../sounds.js";
import { animateWindowOpen, animateWindowClose } from "../utilities.js";
import { getAllAchievements } from "../data/achievementsData.js";
import { getUnlockedAchievements } from "../scr.js";

const isGamePage = window.location.pathname.endsWith("game.html");

if (isGamePage) {
  const achievementsWindow = document.querySelector("#achievements-window");
  const achievementsOpenBtn = document.querySelector("#nav-item-achievements");
  const achievementsCloseBtn = document.querySelector("#achievements-menu-close-btn");
  const tint = document.querySelector("#window-tint");

  achievementsOpenBtn.addEventListener("click", () => {
    achievementsWindow.style.display = "block";
    playRandomMouseClick();
    animateWindowOpen(achievementsWindow, true, tint);
  });

  achievementsCloseBtn.addEventListener("click", () => {
    playRandomMouseClick();
    animateWindowClose(achievementsWindow, true, tint);
  });
}

export function populateAchievementGrid() { 
  const achGrid = document.querySelector("#achievements-grid");
  const achievements = getAllAchievements();

  achGrid.innerHTML = "";
  achievements.forEach((achievement) => {
    const achDiv = document.createElement("div");
    let status = checkAchievementStatus(achievement.id) ? "unlocked" : "locked";
    let statusEmoji = checkAchievementStatus(achievement.id) ? "✅" : "❌";
    achDiv.innerHTML = `
      <div class="achievement-card ${status}" id="ach-${achievement.id}">
        <div class="achievement-status">${statusEmoji}</div>
        <div class="achievement-name">${achievement.name}</div>
        <div class="achievement-desc">${achievement.desc}</div>
      </div>
    `;
    achGrid.appendChild(achDiv);
  });
}

export function checkAchievementStatus(achievementId) {
  const achievement = getAllAchievements().find((ach) => ach.id === achievementId);
  if (!achievement) return;

  if (getUnlockedAchievements().includes(achievementId)) {
    return true;
  } else {
    return false;
  }
}
