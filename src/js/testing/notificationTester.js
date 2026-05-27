import { showNotif, removeNotif, updateTimedUpgrNotif, getNotifCount } from "../notifs.js";

const testNotifications = {
  testFuelNotif: () => {
    showNotif(
      "No Fuel!",
      "Your buses have run out of fuel. Buy more at the fuel station.",
      "notif-fuel",
      false
    );
    console.log("Fuel notification displayed");
  },

  testAchievementNotif: () => {
    showNotif(
      "Achievement Unlocked!",
      "First Steps - Buy your first bus",
      "notif-achievement",
      false
    );
    console.log("Achievement notification displayed");
  },

  testRewardNotif: () => {
    showNotif(
      "Reward Claimed!",
      "You received 500 coins",
      "notif-reward",
      false
    );
    console.log("Reward notification displayed");
  },

  testTimedUpgradeNotif: () => {
    const customId = "test-timed-" + Date.now();
    showNotif(
      "Speed Boost Active",
      "Remaining time: 5m 30s",
      "notif-timed-upgr",
      false,
      customId
    );
    console.log("Timed upgrade notification displayed");
    return customId;
  },

  testUpdateTimedUpgrNotif: (notifId) => {
    if (!notifId) {
      console.warn(
        "No notif ID provided. Call testTimedUpgradeNotif() first and use its return value"
      );
      return;
    }
    updateTimedUpgrNotif({
      id: "notif" + notifId,
      text: "Remaining time: 3m 45s"
    });
    console.log("Timed upgrade notification updated");
  },

  testRemoveNotif: (notifId) => {
    if (!notifId) {
      console.warn("No notif ID provided");
      return;
    }
    removeNotif("notif" + notifId);
    console.log("Notification removed");
  },

  testAllNotifs: () => {
    console.log("Testing all notification types...");
    testNotifications.testFuelNotif();
    setTimeout(() => testNotifications.testAchievementNotif(), 300);
    setTimeout(() => testNotifications.testRewardNotif(), 600);
    setTimeout(() => testNotifications.testTimedUpgradeNotif(), 900);
    console.log("All notifications queued for display");
  },

  testStress: (count = 5) => {
    console.log(`Stress testing with ${count} notifications...`);
    const types = ["notif-fuel", "notif-achievement", "notif-reward"];
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const type = types[i % types.length];
        showNotif(
          `Test Notif ${i + 1}`,
          `This is stress test notification number ${i + 1}`,
          type,
          false
        );
      }, i * 150);
    }
    console.log(`${count} notifications queued`);
  },

  clearAll: () => {
    const notifs = document.querySelectorAll(".notif");
    notifs.forEach((notif) => removeNotif(notif.id));
    console.log(`Cleared ${notifs.length} notifications`);
  },

  getCount: () => {
    const count = document.querySelectorAll(".notif").length;
    console.log(`Currently displayed notifications: ${count}`);
    return count;
  },

  help: () => {
    const helpText = `
╔════════════════════════════════════════════════════════════════╗
║           Notification Tester - Available Commands             ║
╚════════════════════════════════════════════════════════════════╝

  TEST INDIVIDUAL TYPES:
  window.testNotifs.testFuelNotif()           - Test fuel notification
  window.testNotifs.testAchievementNotif()    - Test achievement notification
  window.testNotifs.testRewardNotif()         - Test reward notification
  window.testNotifs.testTimedUpgradeNotif()   - Test timed upgrade notification

  TEST UPDATES & REMOVAL:
  const id = window.testNotifs.testTimedUpgradeNotif()
  window.testNotifs.testUpdateTimedUpgrNotif(id)  - Update the notification
  window.testNotifs.testRemoveNotif(id)           - Remove the notification

  BATCH TESTING:
  window.testNotifs.testAllNotifs()           - Display all types
  window.testNotifs.testStress(10)            - Display 10 rapid notifications
  window.testNotifs.clearAll()                - Clear all notifications
  window.testNotifs.getCount()                - Count displayed notifications

  window.testNotifs.help()                  - Show this help message
    `;
    console.log(helpText);
  }
};

// Make it globally available for testing
if (typeof window !== "undefined") {
  window.testNotifs = testNotifications;
}

export default testNotifications;
