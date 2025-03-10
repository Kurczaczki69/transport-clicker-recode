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
      num: 1,
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
      num: 2,
    },
    {
      category: "vehicleType",
      id: "intercitybus",
      name: banana.i18n("intercity-buses"),
      desc: banana.i18n("intercity-buses-desc"),
      requiredLevel: 20,
      price: 185000,
      isAvailable: true,
      unlockcategory: "intercitybus",
      incomeboost: 0,
      clickboost: 0,
      num: 3,
    },
    {
      category: "vehicleType",
      id: "trolleybus",
      name: banana.i18n("trolleybuses"),
      desc: banana.i18n("trolleybuses-desc"),
      requiredLevel: 35,
      price: 500000,
      isAvailable: true,
      unlockcategory: "trolleybus",
      incomeboost: 0,
      clickboost: 0,
      num: 4,
    },
    {
      category: "vehicleType",
      id: "tram",
      name: banana.i18n("trams"),
      desc: banana.i18n("trams-desc"),
      requiredLevel: 85,
      price: 9250000,
      isAvailable: true,
      unlockcategory: "tram",
      incomeboost: 0,
      clickboost: 0,
      num: 6,
    },
    {
      category: "vehicleType",
      id: "moderntram",
      name: banana.i18n("modern-trams"),
      desc: banana.i18n("modern-trams-desc"),
      requiredLevel: 110,
      price: 20500000,
      isAvailable: false,
      unlockcategory: "moderntram",
      incomeboost: 0,
      clickboost: 0,
      num: 7,
    },
  ];
}

function getUpgrades() {
  return upgrades;
}

export { initializeUpgrades, getUpgrades };
