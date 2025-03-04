import { cities } from "./data/cityData.js";
import { shortAbbreviateNumber, showAlert } from "./utilities.js";
import { banana } from "./langs.js";
import {
  getBal,
  setBal,
  getCitySwitchCost,
  getUnlockedCities,
  getCurrentCity,
  setCurrentCity,
  setCitySwitchCost,
  saveGame,
} from "./scr.js";

const citiesWindow = document.querySelector("#cities-window");
const tint = document.querySelector("#window-tint");

const openBtn = document.querySelector("#nav-item-city-menu");
const closeBtn = document.querySelector("#cities-menu-close-btn");

openBtn.addEventListener("click", () => {
  populateCitiesGrid();
  citiesWindow.style.display = "block";
  tint.style.display = "block";
});

closeBtn.addEventListener("click", () => {
  citiesWindow.style.display = "none";
  tint.style.display = "none";
});

function createCityCard(city) {
  const card = document.createElement("div");
  const calculatedBoost = calculateCityBoost(city);
  card.className = "city-card";

  const vehiclesList = city.vehicles.map((vehicle) => banana.i18n(vehicle)).join(", ");

  card.innerHTML = `
    <img src="${city.imgPath}" alt="${city.name}" class="city-card-image">
    <div class="city-card-content">
      <div class="city-card-title">${city.name}</div>
      <div class="city-card-info">
        <span>${banana.i18n("cities-population", shortAbbreviateNumber(city.population))}</span>
        <span>${banana.i18n("cities-area", shortAbbreviateNumber(city.area))}</span>
        <span>${banana.i18n("cities-boost", calculatedBoost.toFixed(2))}</span>
        <span>${banana.i18n("cities-price", shortAbbreviateNumber(city.cost, "price"))}</span>
        <span>${banana.i18n("cities-vehicles", vehiclesList)}</span>
      </div>
      <button class="city-card-btn" id="${city.id}"></button>
    </div>
  `;

  return card;
}

function populateCitiesGrid() {
  const cityData = cities;
  const grid = document.getElementById("cities-grid");
  grid.innerHTML = "";
  const costEl = document.querySelector("#cities-switch-cost");
  costEl.textContent = banana.i18n("cities-switch-cost", shortAbbreviateNumber(getCitySwitchCost(), "price"));
  const currentCityEl = document.querySelector("#cities-current");
  const currentCityId = getCurrentCity();
  const currentCity = cities.find((c) => c.id === currentCityId);
  currentCityEl.textContent = banana.i18n("cities-current", currentCity.name);
  if (!grid) return;

  cityData.forEach((city) => {
    const cityCard = createCityCard(city);
    grid.appendChild(cityCard);
  });
  addListeners();
}

export function calculateCityBoost(city) {
  let totalBoost = city.baseboost;

  const densityBoost = (city.density / 1000) * 0.1;
  const areaBoost = (city.area / 100) * 0.05;
  const tourismBoost = city.tourismFactor * 0.5;
  const pollutionPenalty = city.pollutionLevel * 0.2;

  totalBoost += densityBoost + areaBoost + tourismBoost - pollutionPenalty;
  return Math.max(0.25, Math.min(4.0, totalBoost));
}

function increaseSwitchCost() {
  const costEl = document.querySelector("#cities-switch-cost");
  costEl.textContent = banana.i18n("cities-switch-cost", shortAbbreviateNumber(getCitySwitchCost(), "price"));
  const switchCost = getCitySwitchCost();
  return Math.round(switchCost * 1.05);
}

function unlockCity(city) {
  const cityToUnlock = cities.find((c) => c.id === city);
  const unlockCost = cityToUnlock.cost;
  const unlockedCities = getUnlockedCities();

  if (!unlockedCities.includes(cityToUnlock.id)) {
    if (getBal() >= unlockCost) {
      setBal(getBal() - unlockCost);
      unlockedCities.push(cityToUnlock.id);
      showAlert(banana.i18n("city-unlocked", cityToUnlock.name));
      populateCitiesGrid();
      saveGame(true);
    }
  } else {
    switchCity(cityToUnlock.id);
  }
}

function switchCity(city) {
  console.log(city);
  const switchCost = getCitySwitchCost();
  const currentCity = getCurrentCity();
  const cityToSwitch = cities.find((c) => c.id === city);

  if (currentCity !== cityToSwitch.id) {
    if (getBal() >= switchCost) {
      const currentCityEl = document.querySelector("#cities-current");
      currentCityEl.textContent = banana.i18n("cities-current", cityToSwitch.name);
      setBal(getBal() - switchCost);
      setCurrentCity(cityToSwitch.id);
      let newSwitchCost = increaseSwitchCost();
      setCitySwitchCost(newSwitchCost);
      showAlert(banana.i18n("city-switched", cityToSwitch.name));
      populateCitiesGrid();
      saveGame(true);
    }
  } else {
    showAlert(banana.i18n("city-already-current-city"));
  }
}

function addListeners() {
  const unlockBtns = document.querySelectorAll(".city-card-btn");
  const unlockedCities = getUnlockedCities();
  console.log(unlockedCities);
  unlockBtns.forEach((btn) => {
    const city = cities.find((c) => c.id === btn.id);
    if (unlockedCities.includes(city.id)) {
      btn.textContent = banana.i18n("btn-switch-city");
      btn.addEventListener("click", () => {
        switchCity(city.id);
      });
    } else {
      btn.textContent = banana.i18n("btn-unlock");
      btn.addEventListener("click", () => {
        unlockCity(city.id);
      });
    }
  });
}
