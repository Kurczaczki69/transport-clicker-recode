import { banana } from "../langs.js";

let upgrades = [];

// array containing all upgrades
function initializeUpgrades() {
  upgrades = [
    {
      category: "vehicleType",
      id: "citybus",
      name: banana.i18n("city-buses"),
      desc: banana.i18n("city-buses-desc"),
      requiredLevel: 0,
      price: 0,
      isAvailable: true,
      unlockcategory: "citybus",
      incomeboost: 0,
      clickboost: 0,
    },
    {
      category: "vehicleType",
      id: "hydrogenbus",
      name: banana.i18n("hydrogen-buses"),
      desc: banana.i18n("hydrogen-buses-desc"),
      requiredLevel: 5,
      price: 50000,
      isAvailable: true,
      unlockcategory: "hydrogenbus",
      incomeboost: 0,
      clickboost: 0,
    },
    {
      category: "vehicleType",
      id: "intercitybus",
      name: banana.i18n("intercity-buses"),
      desc: banana.i18n("intercity-buses-desc"),
      requiredLevel: 20,
      price: 125000,
      isAvailable: true,
      unlockcategory: "intercitybus",
      incomeboost: 0,
      clickboost: 0,
    },
    {
      category: "vehicleType",
      id: "trolleybus",
      name: banana.i18n("trolleybuses"),
      desc: banana.i18n("trolleybuses-desc"),
      requiredLevel: 35,
      price: 275000,
      isAvailable: false,
      unlockcategory: "trolleybus",
      incomeboost: 0,
      clickboost: 0,
    },
    {
      category: "vehicleType",
      id: "longtrolleybus",
      name: banana.i18n("trolleybuses-long"),
      desc: banana.i18n("trolleybuses-long-desc"),
      requiredLevel: 50,
      price: 350000,
      isAvailable: false,
      unlockcategory: "longtrolleybus",
      incomeboost: 0,
      clickboost: 0,
    },
    {
      category: "vehicleType",
      id: "tram",
      name: banana.i18n("trams"),
      desc: banana.i18n("trams-desc"),
      requiredLevel: 75,
      price: 600000,
      isAvailable: false,
      unlockcategory: "tram",
      incomeboost: 0,
      clickboost: 0,
    },
  ];
}

function getUpgrades() {
  return upgrades;
}

export { initializeUpgrades, getUpgrades };
