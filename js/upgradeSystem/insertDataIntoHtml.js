import { timedUpgrades } from "../data/timedUpgradeData.js";
import { upgrades } from "../data/upgradeData.js";
import { abbreviateNumber } from "../utilities.js";
import { vhcls } from "../data/busData.js";

const timedUpgrNames = document.querySelectorAll(".timedupgrName");
const timedUpgrDescs = document.querySelectorAll(".timedupgrDesc");
const timedupgrPrices = document.querySelectorAll(".timedupgrPrice");

const upgrNames = document.querySelectorAll(".upgrName");
const upgrDescs = document.querySelectorAll(".upgrDesc");
const upgrPrices = document.querySelectorAll(".upgrPrice");

const vhclNames = document.querySelectorAll(".vhclName");
const vhclPrices = document.querySelectorAll(".vhclPrice");
const vhclIncomeBoosts = document.querySelectorAll(".vhclIncomeBoost");
const vhclClickMods = document.querySelectorAll(".vhclClickMod");
let index = 0;

export function updateHtmlData() {
  const maxLen = Math.max(timedUpgrades.length, upgrades.length, vhcls.length);
  for (let index = 0; index < maxLen; index++) {
    if (index < timedUpgrades.length) {
      if (timedUpgrNames[index] && timedUpgrDescs[index] && timedupgrPrices[index]) {
        timedUpgrNames[index].innerHTML = timedUpgrades[index].name;
        timedUpgrDescs[index].innerHTML = timedUpgrades[index].desc;
        timedupgrPrices[index].innerHTML =
          timedUpgrades[index].price === 0 ? "DARMO" : abbreviateNumber(timedUpgrades[index].price) + " $";
      }
    }
    if (index < upgrades.length) {
      if (upgrNames[index] && upgrDescs[index] && upgrPrices[index]) {
        upgrNames[index].innerHTML = upgrades[index].name;
        upgrDescs[index].innerHTML = upgrades[index].desc;
        upgrPrices[index].innerHTML =
          upgrades[index].price === 0 ? "DARMO" : abbreviateNumber(upgrades[index].price) + " $";
      }
    }
    if (index < vhcls.length) {
      vhclNames[index].innerHTML = vhcls[index].name;
      vhclPrices[index].innerHTML = abbreviateNumber(vhcls[index].price) + " $";
      vhclIncomeBoosts[index].innerHTML = "+" + abbreviateNumber(vhcls[index].incomemod) + "$/sek.";
      vhclClickMods[index].innerHTML = "+" + abbreviateNumber(vhcls[index].clickmod) + "$/klik.";
    }
  }
  console.log("html upgrade data updated");
}

document.addEventListener("DOMContentLoaded", updateHtmlData);
