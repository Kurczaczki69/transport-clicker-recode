import { timedUpgrades } from "../data/timedUpgradeData.js";
import { upgrades } from "../data/upgradeData.js";
import { abbreviateNumber } from "../utilities.js";

const timedUpgrNames = document.querySelectorAll(".timedupgrName");
const timedUpgrDescs = document.querySelectorAll(".timedupgrDesc");
const timedupgrPrices = document.querySelectorAll(".timedupgrPrice");
let index = 0;

export function updateHtmlData() {
  timedUpgrNames.forEach((upgrName, index) => {
    upgrName.innerHTML = timedUpgrades[index].name;
    index++;
  });
  timedUpgrDescs.forEach((upgrDesc, index = 0) => {
    upgrDesc.innerHTML = timedUpgrades[index].desc;
    index++;
  });
  timedupgrPrices.forEach((upgrPrice, index = 0) => {
    if (timedUpgrades[index].price === 0) {
      upgrPrice.innerHTML = "DARMO";
    } else {
      upgrPrice.innerHTML = abbreviateNumber(timedUpgrades[index].price) + " $";
    }
    index++;
  });
  console.log("html upgrade data updated");
}

document.addEventListener("DOMContentLoaded", updateHtmlData);
