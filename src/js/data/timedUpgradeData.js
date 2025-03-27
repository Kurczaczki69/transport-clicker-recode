import { banana } from "../langs.js";

let timedUpgrades = [];

function initializeTimedUpgrades() {
  timedUpgrades = [
    {
      name: banana.i18n("gold-fuel-10min-name"),
      id: "goldfuel10min",
      type: "goldfuel",
      desc: banana.i18n("gold-fuel-10min-desc"),
      requiredLevel: 7,
      price: 45000,
      priceGold: 100,
      duration: 600000,
      incomeboost: 5,
      clickboost: 0,
      num: 1,
    },
    {
      name: banana.i18n("gold-fuel-30min-name"),
      id: "goldfuel30min",
      type: "goldfuel",
      desc: banana.i18n("gold-fuel-30min-desc"),
      requiredLevel: 12,
      price: 100000,
      priceGold: 300,
      duration: 1800000,
      incomeboost: 5,
      clickboost: 0,
      num: 2,
    },
    {
      name: banana.i18n("gold-fuel-1h-name"),
      id: "goldfuel1h",
      type: "goldfuel",
      desc: banana.i18n("gold-fuel-1h-desc"),
      requiredLevel: 17,
      price: 200000,
      priceGold: 600,
      duration: 3600000,
      incomeboost: 5,
      clickboost: 0,
      num: 3,
    },
    {
      name: banana.i18n("super-mouse-5min-name"),
      id: "supermouse5min",
      type: "supermouse",
      desc: banana.i18n("super-mouse-5min-desc"),
      requiredLevel: 25,
      price: 35000,
      priceGold: 75,
      duration: 300000,
      incomeboost: 0,
      clickboost: 5,
      num: 4,
    },
    {
      name: banana.i18n("super-mouse-20min-name"),
      id: "supermouse20min",
      type: "supermouse",
      desc: banana.i18n("super-mouse-20min-desc"),
      requiredLevel: 30,
      price: 90000,
      priceGold: 225,
      duration: 1200000,
      incomeboost: 0,
      clickboost: 5,
      num: 5,
    },
    {
      name: banana.i18n("turbo-engine-10min-name"),
      id: "turboengine10min",
      type: "turboengine",
      desc: banana.i18n("turbo-engine-10min-desc"),
      requiredLevel: 50,
      price: 450000,
      priceGold: 1500,
      duration: 600000,
      incomeboost: 7,
      clickboost: 3,
      num: 6,
    },
  ];
}

function getTimedUpgrades() {
  return timedUpgrades;
}

export { initializeTimedUpgrades, getTimedUpgrades };
