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
      price: 275000,
      isAvailable: false,
      unlockcategory: "trolleybus",
      incomeboost: 0,
      clickboost: 0,
    },
    {
      category: "vehicleType",
      id: "trolleybus",
      name: banana.i18n("trolleybuses-long"),
      desc: banana.i18n("trolleybuses-long-desc"),
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
