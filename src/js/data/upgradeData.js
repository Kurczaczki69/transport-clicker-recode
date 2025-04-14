import { getI18n } from "../utilities.js";

let upgrades = [];

// array containing all upgrades
function initializeUpgrades() {
  upgrades = [
    {
      category: "vehicleType",
      id: "citybus",
      name: getI18n("city-buses"),
      desc: getI18n("city-buses-desc"),
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
      name: getI18n("hydrogen-buses"),
      desc: getI18n("hydrogen-buses-desc"),
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
      name: getI18n("intercity-buses"),
      desc: getI18n("intercity-buses-desc"),
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
      name: getI18n("trolleybuses"),
      desc: getI18n("trolleybuses-desc"),
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
      name: getI18n("trams"),
      desc: getI18n("trams-desc"),
      requiredLevel: 85,
      price: 20000000,
      isAvailable: true,
      unlockcategory: "tram",
      incomeboost: 0,
      clickboost: 0,
      num: 6,
    },
    {
      category: "vehicleType",
      id: "moderntram",
      name: getI18n("modern-trams"),
      desc: getI18n("modern-trams-desc"),
      requiredLevel: 110,
      price: 110000000,
      isAvailable: true,
      unlockcategory: "moderntram",
      incomeboost: 0,
      clickboost: 0,
      num: 7,
    },
    {
      category: "fuelTank",
      id: "fueltank1",
      name: getI18n("upgr-fuel-tank-1"),
      desc: getI18n("upgr-fuel-tank-1-desc"),
      requiredLevel: 8,
      price: 25000,
      isAvailable: true,
      tankBoost: 500,
      incomeboost: 0,
      clickboost: 0,
      num: 8,
    },
    {
      category: "fuelTank",
      id: "fueltank2",
      name: getI18n("upgr-fuel-tank-2"),
      desc: getI18n("upgr-fuel-tank-2-desc"),
      requiredLevel: 15,
      price: 75000,
      isAvailable: true,
      tankBoost: 1000,
      incomeboost: 0,
      clickboost: 0,
      num: 9,
    },
    {
      category: "fuelTank",
      id: "fueltank3",
      name: getI18n("upgr-fuel-tank-3"),
      desc: getI18n("upgr-fuel-tank-3-desc"),
      requiredLevel: 25,
      price: 250000,
      isAvailable: true,
      tankBoost: 2500,
      incomeboost: 0,
      clickboost: 0,
      num: 10,
    },
    {
      category: "fuelTank",
      id: "fueltank4",
      name: getI18n("upgr-fuel-tank-4"),
      desc: getI18n("upgr-fuel-tank-4-desc"),
      requiredLevel: 40,
      price: 10000000,
      isAvailable: true,
      tankBoost: 5000,
      incomeboost: 0,
      clickboost: 0,
      num: 11,
    },
    {
      category: "fuelTank",
      id: "fueltank5",
      name: getI18n("upgr-fuel-tank-5"),
      desc: getI18n("upgr-fuel-tank-5-desc"),
      requiredLevel: 60,
      price: 50000000,
      isAvailable: true,
      tankBoost: 15000,
      incomeboost: 0,
      clickboost: 0,
      num: 12,
    },
    {
      category: "others",
      id: "autorefuel",
      name: getI18n("upgr-autorefuel"),
      desc: getI18n("upgr-autorefuel-desc"),
      requiredLevel: 115,
      price: 5000000000000,
      unlocks: "autorefuel",
      isAvailable: true,
      incomeboost: 0,
      clickboost: 0,
      num: 13,
    },
  ];
}

function getUpgrades() {
  return upgrades;
}

export { initializeUpgrades, getUpgrades };
