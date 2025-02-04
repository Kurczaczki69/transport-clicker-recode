import { banana } from "../langs.js";

let timedUpgrades = [];

function initializeTimedUpgrades() {
  timedUpgrades = [
    {
      name: banana.i18n("gold-fuel-10min-name"),
      id: "goldfuel10min",
      desc: banana.i18n("gold-fuel-10min-desc"),
      price: 45000,
      priceGold: 100,
      duration: 600000,
      incomeboost: 5,
      clickboost: 0,
    },
    {
      name: banana.i18n("gold-fuel-30min-name"),
      id: "goldfuel30min",
      desc: banana.i18n("gold-fuel-30min-desc"),
      price: 100000,
      priceGold: 300,
      duration: 1800000,
      incomeboost: 5,
      clickboost: 0,
    },
    {
      name: banana.i18n("gold-fuel-1h-name"),
      id: "goldfuel1h",
      desc: banana.i18n("gold-fuel-1h-desc"),
      price: 200000,
      priceGold: 600,
      duration: 3600000,
      incomeboost: 5,
      clickboost: 0,
    },
    {
      name: banana.i18n("super-mouse-5min-name"),
      id: "supermouse5min",
      desc: banana.i18n("super-mouse-5min-desc"),
      price: 35000,
      priceGold: 75,
      duration: 300000,
      incomeboost: 0,
      clickboost: 5,
    },
    {
      name: banana.i18n("super-mouse-20min-name"),
      id: "supermouse20min",
      desc: banana.i18n("super-mouse-20min-desc"),
      price: 90000,
      priceGold: 225,
      duration: 1200000,
      incomeboost: 0,
      clickboost: 5,
    },
  ];
}

function getTimedUpgrades() {
  return timedUpgrades;
}

export { initializeTimedUpgrades, getTimedUpgrades };
