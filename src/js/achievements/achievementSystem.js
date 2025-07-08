import * as game from "../scr.js";
import { getAllAchievements } from "../data/achievementsData.js";
import { showNotif } from "../notifs.js";
import { getI18n } from "../utilities.js";
import { displayAchievementsProgress } from "./achievementUI.js";

export function checkAchievements() {
    const achievements = getAllAchievements();
    const unlockedAchievements = game.getUnlockedAchievements();

    displayAchievementsProgress();
    achievements.forEach((achievement) => {
        if (unlockedAchievements.includes(achievement.id)) {
            const achDiv = document.querySelector(`#ach-${achievement.id}`);
            if (achDiv.classList.contains("locked")) {
                achDiv.classList.remove("locked");
                achDiv.classList.add("unlocked");
                const statusEmoji = achDiv.querySelector(".achievement-status");
                if (statusEmoji) {
                    statusEmoji.textContent = "✅";
                }
                showNotif(getI18n("notif-achievement-unlocked"), getI18n("notif-achievement-unlocked-text", achievement.name), "notif-achievement", true);
            }
        }
    });
}

export function unlockAchievement(achievementId) {
    const achievement = getAllAchievements().find((ach) => ach.id === achievementId);

    // check if achievement exists
    if (!achievement) {
        console.error(`Achievement with ID ${achievementId} not found.`);
        return;
    }

    // check if achievement is already unlocked
    if (game.getUnlockedAchievements().includes(achievementId)) {
        return;
    }

    // if all checks pass, unlock the achievement
    let newUnlockedAchievements = [...game.getUnlockedAchievements(), achievementId];
    game.setUnlockedAchievements(newUnlockedAchievements);
}

export function achievementConditionChecks() {
    const achievements = getAllAchievements();
    achievements.forEach((achievement) => {
        if (achievement.check && achievement.check(game)) {
            unlockAchievement(achievement.id);
        }
    });
}