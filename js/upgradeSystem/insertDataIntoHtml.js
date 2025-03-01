import { getTimedUpgrades } from "../data/timedUpgradeData.js";
import { getUpgrades } from "../data/upgradeData.js";
import { shortAbbreviateNumber } from "../utilities.js";
import { getVhcls } from "../data/vhclData.js";
import { checkLevel, getVhclPrices, syncVehiclePrices } from "../scr.js";
import { banana } from "../langs.js";
import { checkLevelUpgr } from "./upgrades.js";
import { checkTimedUpgrLevel } from "./timedUpgrades.js";

let index;
const isGamePage = window.location.pathname.endsWith("game.html");

export function updateHtmlData() {
  if (!isGamePage) return;
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
  }
}

export function populateVhclData() {
  if (!isGamePage) return;
  const vhcls = getVhcls();
  const vhclPrices = getVhclPrices();
  const cityBusCategory = document.querySelector("#vhcl-menu-citybus-table");
  const hydrogenBusCategory = document.querySelector("#vhcl-menu-hydrogenbus-table");
  const intercityBusCategory = document.querySelector("#vhcl-menu-intercitybus-table");
  const trolleyBusCategory = document.querySelector("#vhcl-menu-trolleybus-table");
  cityBusCategory.innerHTML = "";
  hydrogenBusCategory.innerHTML = "";
  intercityBusCategory.innerHTML = "";
  trolleyBusCategory.innerHTML = "";

  vhcls.forEach((vhcl) => {
    const row = `
      <tr>
        <th class="vhcl-menu-name">
          <h4><span class="vhclName">${vhcl.name}</span></h4>
        </th>
        <th class="vhcl-menu-price">
          <span id="vhcl-menu-price-item">
            <b><span class="vhclPrice">${shortAbbreviateNumber(vhclPrices[vhcl.code])} $</span></b>
          </span>
        </th>
        <th class="vhcl-menu-citybus-income-boost">
          <span class="vhclIncomeBoost">+${shortAbbreviateNumber(vhcl.incomemod, "vhcls")}$/${banana.i18n(
      "time-seconds"
    )}</span>
        </th>
        <th class="vhcl-menu-citybus-clickmod-boost">
          <span class="vhclClickMod">+${shortAbbreviateNumber(vhcl.clickmod, "vhcls")}$/${banana.i18n("click")}</span>
        </th>
        <th class="vhcl-menu-btn-wrapper">
          <button class="vhcl-menu-btn" id="${vhcl.code}">
            <div class="vhcl-btn-content" data-lang="btn-buy">${banana.i18n("btn-buy")}</div>
          </button>
        </th>
      </tr>
    `;

    switch (vhcl.category) {
      case "citybus":
        cityBusCategory.innerHTML += row;
        break;
      case "hydrogenbus":
        hydrogenBusCategory.innerHTML += row;
        break;
      case "intercitybus":
        intercityBusCategory.innerHTML += row;
        break;
      case "trolleybus":
        trolleyBusCategory.innerHTML += row;
        break;
    }
  });

  checkLevel();
  syncVehiclePrices();
}

export function populateUpgrData() {
  if (!isGamePage) return;
  const upgrades = getUpgrades();
  const timedUpgrades = getTimedUpgrades();
  const upgradeContent = document.querySelector("#upgr-menu-vehicle-type-table");
  const timedUpgrContent = document.querySelector("#upgr-menu-timed-upgrades-table");
  upgradeContent.innerHTML = "";
  timedUpgrContent.innerHTML = "";

  upgrades.forEach((upgrade) => {
    const row = `
    <tr>
              <th class="upgr-menu-vehicle-type-item-header">
                <h4><span id="upgr${upgrade.num}" class="upgrName">${upgrade.name}</span></h4>
                <div class="upgrDesc-wrapper">
                  <span id="upgr${upgrade.num}-desc" class="upgrDesc">${upgrade.desc}</span>
                </div>
              </th>
              <th class="upgr-menu-vehicle-type-item-is-avaible">
                <span style="display: ${checkAvailability(upgrade)}" data-lang="unavailable">${banana.i18n(
      "unavailable"
    )}</span>
              </th>
              <th class="upgr-menu-vehicle-type-item-price">
                <span id="upgr-menu-vehicle-type-item-price-item1"
                  ><b><span id="upgr${upgrade.num}-price" class="upgrPrice">${shortAbbreviateNumber(
      upgrade.price,
      "upgrs"
    )}</span></b
                ></span>
              </th>
              <th class="upgr-menu-vehicle-type-item-btn-wrapper">
                <button class="upgr-menu-vehicle-type-item-btn btns" id="${upgrade.id}">
                  <div class="upgr-menu-vehicle-type-item-btn-text" data-lang="btn-buy">${banana.i18n("btn-buy")}</div>
                </button>
              </th>
            </tr>
    `;
    upgradeContent.innerHTML += row;
  });

  checkLevelUpgr();

  timedUpgrades.forEach((upgr) => {
    const row = `
    <tr>
              <th class="upgr-menu-vehicle-type-item-header">
                <h4><span id="timed-upgr${upgr.num}" class="timedUpgrName">${upgr.name}</span></h4>
                <div class="upgrDesc-wrapper">
                  <span id="timed-upgr${upgr.num}-desc" class="timedUpgrDesc">${upgr.desc}</span>
                </div>
              </th>
              <th class="upgr-menu-vehicle-type-item-is-avaible">
                <span style="display: none" data-lang="unavailable">${banana.i18n("unavailable")}</span>
              </th>
              <th class="upgr-menu-vehicle-type-item-price">
                <span id="upgr-menu-vehicle-type-item-price-item1"
                  ><b><span class="timedUpgrPrice">${shortAbbreviateNumber(upgr.price, "upgrs")}</span></b
                ></span>
              </th>
              <th class="upgr-menu-vehicle-type-item-btn-wrapper">
                <button class="upgr-menu-timed-upgr-item-btn btns" id="${upgr.id}">
                  <div class="upgr-menu-timed-upgr-item-btn-text" data-lang="btn-buy">${banana.i18n("btn-buy")}</div>
                </button>
              </th>
            </tr>
    `;
    timedUpgrContent.innerHTML += row;
  });

  checkTimedUpgrLevel();
}

function checkAvailability(upgr) {
  if (upgr.isAvailable) {
    return "none";
  } else {
    return "block";
  }
}
