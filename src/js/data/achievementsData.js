import * as game from "../scr.js";
import { getI18n } from "../utilities.js";

let achievements = [];
const isGamePage = window.location.pathname.endsWith("game.html");

function initializeAchievements() {
  if (!isGamePage) return;

  achievements = [
    {
      id: "first_bus",
      name: getI18n("achievement-first-bus"),
      desc: getI18n("achievement-first-bus-desc"),
      check: (game) => (game.getVhclAmounts()["solu8"] || 0) >= 1,
    },
  ];

  console.log("achievements initialized");
}

function getAchievementById(id) {
  return achievements.find((achievement) => achievement.id === id);
}

function getAllAchievements() {
  return achievements;
}

export { achievements, initializeAchievements, getAchievementById, getAllAchievements };