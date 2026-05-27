# Notification System Tester

A testing utility for quickly testing different notification types in the game.

This will display all available testing commands
```javascript
window.testNotifs.help()
```

## Available Commands

### Test Individual Notification Types

```javascript
window.testNotifs.testFuelNotif()           // Test fuel notification
window.testNotifs.testAchievementNotif()    // Test achievement notification
window.testNotifs.testRewardNotif()         // Test reward notification
window.testNotifs.testTimedUpgradeNotif()   // Test timed upgrade notification
```

### Test Timed Upgrade Updates & Removal

```javascript
// Create a timed upgrade notification and store its ID
const id = window.testNotifs.testTimedUpgradeNotif()

// Update the text of that notification
window.testNotifs.testUpdateTimedUpgrNotif(id)

// Remove the notification
window.testNotifs.testRemoveNotif(id)
```

### Batch Testing

```javascript
window.testNotifs.testAllNotifs()      // Display all notification types at once
window.testNotifs.testStress(10)       // Display 10 notifications rapidly (stress test)
window.testNotifs.clearAll()           // Remove all notifications
window.testNotifs.getCount()           // Show how many notifications are currently displayed
```
