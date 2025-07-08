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
    {
      id: "first_1000",
      name: getI18n("achievement-first-1000"),
      desc: getI18n("achievement-first-1000-desc"),
      check: (game) => game.getBal() >= 1000,
    },
    {
      id: "first_10000",
      name: getI18n("achievement-first-10000"),
      desc: getI18n("achievement-first-10000-desc"),
      check: (game) => game.getBal() >= 10000,
    },
    {
      id: "10_income",
      name: getI18n("achievement-10-income"),
      desc: getI18n("achievement-10-income-desc"),
      check: (game) => game.getIncome() >= 10,
    },
    {
      id: "10_clickmod",
      name: getI18n("achievement-10-clickmod"),
      desc: getI18n("achievement-10-clickmod-desc"),
      check: (game) => game.getClickMod() >= 10,
    },
    {
      id: "100_income",
      name: getI18n("achievement-100-income"),
      desc: getI18n("achievement-100-income-desc"),
      check: (game) => game.getIncome() >= 100,
    },
    {
      id: "100_clickmod",
      name: getI18n("achievement-100-clickmod"),
      desc: getI18n("achievement-100-clickmod-desc"),
      check: (game) => game.getClickMod() >= 100,
    },
    {
      id: "first_city_unlocked",
      name: getI18n("achievement-first-city"),
      desc: getI18n("achievement-first-city-desc"),
      check: (game) => (game.getUnlockedCities() || []).length > 1,
    },
    {
      id: "city_explorer",
      name: getI18n("achievement-city-explorer"),
      desc: getI18n("achievement-city-explorer-desc"),
      check: (game) => (game.getUnlockedCities() || []).length >= 3,
    },
    {
      id: "city_collector",
      name: getI18n("achievement-city-collector"),
      desc: getI18n("achievement-city-collector-desc"),
      check: (game) => (game.getUnlockedCities() || []).length >= 5,
    },
    {
      id: "upgrade_buyer",
      name: getI18n("achievement-upgrade-buyer"),
      desc: getI18n("achievement-upgrade-buyer-desc"),
      check: (game) => (game.getBghtUpgrs() || []).length >= 1,
    },
    {
      id: "upgrade_enthusiast",
      name: getI18n("achievement-upgrade-enthusiast"),
      desc: getI18n("achievement-upgrade-enthusiast-desc"),
      check: (game) => (game.getBghtUpgrs() || []).length >= 10,
    },
    {
      id: "fuel_hoarder",
      name: getI18n("achievement-fuel-hoarder"),
      desc: getI18n("achievement-fuel-hoarder-desc"),
      check: (game) => {
        const fuel = game.getFuelLevels();
        return fuel.diesel >= 10000 || fuel.hydrogen >= 10000 || fuel.electric >= 10000;
      },
    },
    {
      id: "vehicle_tycoon",
      name: getI18n("achievement-vehicle-tycoon"),
      desc: getI18n("achievement-vehicle-tycoon-desc"),
      check: (game) => {
        const amounts = game.getVhclAmounts();
        let total = 0;
        for (const key in amounts) total += amounts[key];
        return total >= 100;
      },
    },
    {
      id: "company_named",
      name: getI18n("achievement-company-named"),
      desc: getI18n("achievement-company-named-desc"),
      check: (game) => game.getCompanyName && game.getCompanyName() !== "My Transport Company",
    },
    {
      id: "millionaire",
      name: getI18n("achievement-millionaire"),
      desc: getI18n("achievement-millionaire-desc"),
      check: (game) => game.getBal() >= 1000000,
    },
    {
      id: "max_fuel",
      name: getI18n("achievement-max-fuel"),
      desc: getI18n("achievement-max-fuel-desc"),
      check: (game) => {
        const fuel = game.getFuelLevels();
        return (
          fuel.diesel >= game.getMaxFuel() && fuel.hydrogen >= game.getMaxFuel() && fuel.electric >= game.getMaxFuel()
        );
      },
    },
    {
      id: "starter_fleet",
      name: getI18n("achievement-starter-fleet"),
      desc: getI18n("achievement-starter-fleet-desc"),
      check: (game) => {
        const amounts = game.getVhclAmounts();
        let types = 0;
        for (const key in amounts) if (amounts[key] > 0) types++;
        return types >= 3;
      },
    },
    {
      id: "clicker_novice",
      name: getI18n("achievement-clicker-novice"),
      desc: getI18n("achievement-clicker-novice-desc"),
      check: (game) => game.getClickMod() >= 50,
    },
    {
      id: "income_boom",
      name: getI18n("achievement-income-boom"),
      desc: getI18n("achievement-income-boom-desc"),
      check: (game) => game.getIncome() >= 1000,
    },
    {
      id: "big_spender",
      name: getI18n("achievement-big-spender"),
      desc: getI18n("achievement-big-spender-desc"),
      check: (game) => game.getBal() <= 0,
    },
    {
      id: "big_earnings",
      name: getI18n("achievement-big-earnings"),
      desc: getI18n("achievement-big-earnings-desc"),
      check: (game) => game.getIncome() >= 10000,
    },
    {
      id: "city_loyalist",
      name: getI18n("achievement-city-loyalist"),
      desc: getI18n("achievement-city-loyalist-desc"),
      check: (game) => (game.getUnlockedCities() || []).length === 1 && game.getBal() >= 50000,
    },
    {
      id: "mega_clicker",
      name: getI18n("achievement-mega-clicker"),
      desc: getI18n("achievement-mega-clicker-desc"),
      check: (game) => game.getClickMod() >= 10000,
    },
    {
      id: "billionaire",
      name: getI18n("achievement-billionaire"),
      desc: getI18n("achievement-billionaire-desc"),
      check: (game) => game.getBal() >= 1000000000,
    },
    {
      id: "income_master",
      name: getI18n("achievement-income-master"),
      desc: getI18n("achievement-income-master-desc"),
      check: (game) => game.getIncome() >= 1000000,
    },
    {
      id: "clicking_king",
      name: getI18n("achievement-clicking-king"),
      desc: getI18n("achievement-clicking-king-desc"),
      check: (game) => game.getClickMod() >= 1000000,
    },
    {
      id: "trillionaire",
      name: getI18n("achievement-trillionaire"),
      desc: getI18n("achievement-trillionaire-desc"),
      check: (game) => game.getBal() >= 1000000000000,
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
