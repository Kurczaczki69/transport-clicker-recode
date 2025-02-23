import { getTimedUpgrades } from "../data/timedUpgradeData.js";
import { getUpgrades } from "../data/upgradeData.js";
import { shortAbbreviateNumber } from "../utilities.js";
import { getVhcls } from "../data/vhclData.js";
import { banana } from "../langs.js";

const timedUpgrNames = document.querySelectorAll(".timedUpgrName");
const timedUpgrDescs = document.querySelectorAll(".timedUpgrDesc");
const timedupgrPrices = document.querySelectorAll(".timedUpgrPrice");

const upgrNames = document.querySelectorAll(".upgrName");
const upgrDescs = document.querySelectorAll(".upgrDesc");
const upgrPrices = document.querySelectorAll(".upgrPrice");

const vhclNames = document.querySelectorAll(".vhclName");
const vhclPrices = document.querySelectorAll(".vhclPrice");
const vhclIncomeBoosts = document.querySelectorAll(".vhclIncomeBoost");
const vhclClickMods = document.querySelectorAll(".vhclClickMod");
let index;

export function updateHtmlData() {
  if (window.location.href.includes("game.html")) {
    const timedUpgrades = getTimedUpgrades();
    const upgrades = getUpgrades();
    const vhcls = getVhcls();
    const maxLen = Math.max(timedUpgrades.length, upgrades.length, vhcls.length);
    for (index = 0; index < maxLen; index++) {
      if (index < timedUpgrades.length) {
        if (timedUpgrNames[index] && timedUpgrDescs[index] && timedupgrPrices[index]) {
          timedUpgrNames[index].innerHTML = timedUpgrades[index].name;
          timedUpgrDescs[index].innerHTML = timedUpgrades[index].desc;
          timedupgrPrices[index].innerHTML =
            timedUpgrades[index].price === 0
              ? banana.i18n("free-indicator")
              : shortAbbreviateNumber(timedUpgrades[index].price) + " $";
        }
      }
      if (index < upgrades.length) {
        if (upgrNames[index] && upgrDescs[index] && upgrPrices[index]) {
          upgrNames[index].innerHTML = upgrades[index].name;
          upgrDescs[index].innerHTML = upgrades[index].desc;
          upgrPrices[index].innerHTML =
            upgrades[index].price === 0
              ? banana.i18n("free-indicator")
              : shortAbbreviateNumber(upgrades[index].price) + " $";
        }
      }
      if (index < vhcls.length) {
        vhclNames[index].innerHTML = vhcls[index].name;
        vhclPrices[index].innerHTML = shortAbbreviateNumber(vhcls[index].price) + " $";
        vhclIncomeBoosts[index].innerHTML =
          "+" + shortAbbreviateNumber(vhcls[index].incomemod) + "$/" + banana.i18n("time-seconds");
        vhclClickMods[index].innerHTML =
          "+" + shortAbbreviateNumber(vhcls[index].clickmod) + "$/" + banana.i18n("click");
      }
    }
    console.log("html upgrade data updated");
  }
}
