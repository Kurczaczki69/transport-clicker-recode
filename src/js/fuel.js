import { getBal, setBal, getFuelLevels, setFuelLevels, getVhclAmounts, getMaxFuel } from "./scr.js";
import { shortAbbreviateNumber, showAlert } from "./utilities.js";
import { banana } from "./langs.js";
import { playRandomCash, playRandomMouseClick } from "./sounds.js";
import { animateWindowOpen, animateWindowClose } from "./utilities.js";
import { getVhcls } from "./data/vhclData.js";

let MAX_FUEL = 1000;
export let fuelLevels = { diesel: 1000, hydrogen: 1000, electric: 1000 };

const BASE_FUEL_PRICES = {
  diesel: 1,
  hydrogen: 2,
  electric: 0.5,
};

const BASE_CONSUMPTION_RATE = {
  diesel: 0.1,
  hydrogen: 0.05,
  electric: 0.2,
};

export function initFuelSystem() {
  const buyFuelBtn = document.querySelector("#buy-fuel-btn");
  const fuelShop = document.querySelector("#fuel-shop");
  const closeShopBtn = document.querySelector("#fuel-shop-close-btn");
  const buyButtons = document.querySelectorAll(".buy-fuel-item-btn");
  const maxBtn = document.querySelector(".fuel-shop-max-btn");
  const tint = document.querySelector("#window-tint");
  const buyAllBtn = document.querySelector(".fuel-shop-buy-all-btn");

  buyFuelBtn.addEventListener("click", () => {
    playRandomMouseClick();
    fuelShop.style.display = "block";
    animateWindowOpen(fuelShop, true, tint);
  });

  closeShopBtn.addEventListener("click", () => {
    playRandomMouseClick();
    animateWindowClose(fuelShop, true, tint);
  });

  maxBtn.addEventListener("click", () => {
    playRandomMouseClick();
    setFuelInputsToMax();
  });

  buyAllBtn.addEventListener("click", () => {
    buyAllFuel();
  });

  buyButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const fuelType = e.target.closest(".fuel-shop-item").dataset.fuel;
      const amount = parseInt(e.target.closest(".fuel-shop-item").querySelector(".fuel-amount-input").value);
      const inputEl = e.target.closest(".fuel-shop-item").querySelector(".fuel-amount-input");
      buyFuel(fuelType, amount, inputEl);
    });
  });

  fuelLevels = getFuelLevels();
  MAX_FUEL = getMaxFuel();
  setInterval(consumeFuel, 1000);
  setInterval(updateFuelBars, 1000);
  setInterval(updateFuelPrices, 1000);
}

function buyFuel(type, amount, el) {
  if (!amount || amount <= 0) {
    showAlert(banana.i18n("invalid-amount"));
    return;
  }

  const price = getScaledFuelPrice(type);
  const cost = amount * price;
  const bal = getBal();

  if (bal < cost) {
    showAlert(banana.i18n("cant-afford"));
    return;
  }

  if (fuelLevels[type] + amount > MAX_FUEL) {
    showAlert(banana.i18n("fuel-tank-full"));
    return;
  }

  setBal(bal - cost);
  fuelLevels[type] += amount;
  setFuelLevels(fuelLevels);
  el.value = "";
  let amountWithUnit = amount + banana.i18n("unit-liter");
  if (type == "electric") amountWithUnit = amount + banana.i18n("unit-kilowat");
  showAlert(banana.i18n("fuel-purchased", amountWithUnit, banana.i18n(`fuel-type-${type}`)));
  playRandomCash();
  updateFuelBars();
}

function buyAllFuel() {
  const inputs = document.querySelectorAll(".fuel-amount-input");
  let totalCost = 0;
  const purchases = [];

  inputs.forEach((input) => {
    const amount = parseInt(input.value) || 0;
    if (amount > 0) {
      const fuelType = input.closest(".fuel-shop-item").dataset.fuel;
      const price = getScaledFuelPrice(fuelType);
      totalCost += amount * price;

      if (fuelLevels[fuelType] + amount > MAX_FUEL) {
        showAlert(banana.i18n("fuel-tank-full"));
        return;
      }

      purchases.push({ type: fuelType, amount: amount });
    } else {
      showAlert(banana.i18n("invalid-amount"));
      return;
    }
  });

  const bal = getBal();
  if (bal < totalCost) {
    showAlert(banana.i18n("cant-afford"));
    return;
  }

  if (purchases.length > 0) {
    setBal(bal - totalCost);
    purchases.forEach((purchase) => {
      fuelLevels[purchase.type] += purchase.amount;
      const input = document.querySelector(`.fuel-shop-item[data-fuel="${purchase.type}"] .fuel-amount-input`);
      input.value = "";
    });
    setFuelLevels(fuelLevels);
    updateFuelBars();
    playRandomCash();
    showAlert(banana.i18n("fuel-purchased-multiple", shortAbbreviateNumber(totalCost)));
  }
}

function consumeFuel() {
  Object.keys(fuelLevels).forEach((type) => {
    if (fuelLevels[type] > 0) {
      const consumptionRate = getScaledConsumptionRate(type);
      fuelLevels[type] = Math.max(0, fuelLevels[type] - consumptionRate);
      setFuelLevels(fuelLevels);
    }
  });
}

function updateFuelPrices() {
  Object.keys(BASE_FUEL_PRICES).forEach((type) => {
    const priceElement = document.querySelector(`.fuel-shop-item[data-fuel="${type}"] .price-value`);
    if (priceElement) {
      priceElement.textContent = getScaledFuelPrice(type).toFixed(2);
    }
  });
}

function updateFuelBars() {
  Object.keys(fuelLevels).forEach((type) => {
    const fill = document.querySelector(`.fuel-bar-fill[data-fuel="${type}"]`);
    const amount = document.querySelector(`.fuel-type-label[data-fuel="${type}"] .fuel-amount`);
    const capacityDisplay = document.getElementById("fuel-tank-capacity-value");
    MAX_FUEL = getMaxFuel();

    fill.style.width = `${(fuelLevels[type] / MAX_FUEL) * 100}%`;
    amount.textContent = Math.round(fuelLevels[type]);
    capacityDisplay.textContent = MAX_FUEL;
  });
}

function getScaledFuelPrice(type) {
  const amounts = getVhclAmounts();
  const totalVehicles = Object.values(amounts || {}).reduce((a, b) => a + b, 0);
  const scaleFactor = Math.max(1, Math.log10(totalVehicles + 1) * 2);
  return BASE_FUEL_PRICES[type] * scaleFactor;
}

function getScaledConsumptionRate(type) {
  const vehicles = getVhcls();
  const amounts = getVhclAmounts();
  const vehiclesOfType = vehicles
    .filter((v) => v.fuelType === type)
    .reduce((total, v) => total + (amounts[v.code] || 0), 0);
  const scaleFactor = Math.max(1, Math.log10(vehiclesOfType + 1) * 1.5);
  return BASE_CONSUMPTION_RATE[type] * scaleFactor;
}

function setFuelInputsToMax() {
  const bal = getBal();
  const inputs = document.querySelectorAll(".fuel-amount-input");

  inputs.forEach((input) => {
    const fuelType = input.closest(".fuel-shop-item").dataset.fuel;
    const price = getScaledFuelPrice(fuelType);
    const currentFuel = fuelLevels[fuelType];
    const maxAffordable = Math.floor(bal / price);
    const spaceLeft = Math.floor(MAX_FUEL - currentFuel);
    const maxAmount = Math.floor(Math.min(maxAffordable, spaceLeft));
    input.value = Math.max(0, maxAmount);
  });
}

export function getFuelLevel(type) {
  return fuelLevels[type];
}
