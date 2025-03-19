import { getCities, getCityEvents } from "./data/cityData.js";
import {
  shortAbbreviateNumber,
  showAlert,
  convertDecimalBoostToPercent,
  convertDecimalToPercent,
} from "./utilities.js";
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
import { getLevel } from "./levelSystem.js";
import { addBuildListener } from "./buildings.js";
import { playRandomCash, playRandomMouseClick } from "./sounds.js";

const citiesWindow = document.querySelector("#cities-window");
const tint = document.querySelector("#window-tint");

const openBtn = document.querySelector("#nav-item-city-menu");
const closeBtn = document.querySelector("#cities-menu-close-btn");

const isGamePage = window.location.pathname.endsWith("game.html");

if (isGamePage) {
  openBtn.addEventListener("click", () => {
    playRandomMouseClick();
    populateCitiesGrid();
    citiesWindow.style.display = "block";
    tint.style.display = "block";
  });

  closeBtn.addEventListener("click", () => {
    playRandomMouseClick();
    citiesWindow.style.display = "none";
    tint.style.display = "none";
  });
}

function createCityCard(city) {
  const card = document.createElement("div");
  const calculatedBoost = calculateCityBoost(city);
  const calculatedClickBoost = calculateCityClickMod(city);
  card.className = "city-card";

  card.innerHTML = `
    <img src="${city.imgPath}" alt="${city.name}" class="city-card-image">
    <div class="city-card-content">
      <div class="city-card-title">${city.name}</div>
      <div class="city-card-info">
        <span>${banana.i18n("cities-population", shortAbbreviateNumber(city.population))}</span>
        <span>${banana.i18n("cities-area", shortAbbreviateNumber(city.area))}</span>
        <span>${banana.i18n("cities-boost", convertDecimalBoostToPercent(calculatedBoost))}</span>
        <span>${banana.i18n("cities-click-boost", convertDecimalBoostToPercent(calculatedClickBoost))}</span>
        <span>${banana.i18n("cities-price", shortAbbreviateNumber(city.cost, "price"))}</span>
      </div>
      <div id="city-btns-wrapper">
        <button class="city-card-btn" id="${city.id}"></button>
        <button class="city-card-details-btn btns" id="details-${city.id}" data-city-id="${city.id}"></button>
      </div>
    </div>
  `;

  return card;
}

export async function populateCitiesGrid() {
  const cities = getCities();
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
  if (!isGamePage) return;
  let totalBoost = city.baseboost;

  const densityBoost = (city.density / 1000) * 0.1;
  const areaBoost = (city.area / 100) * 0.05;
  const tourismBoost = city.tourismFactor * 0.5;
  const pollutionPenalty = city.pollutionLevel * 0.2;

  totalBoost += densityBoost + areaBoost + tourismBoost - pollutionPenalty;

  activeEvents.forEach((event) => {
    totalBoost *= event.boost;
  });
  return Math.max(0.25, Math.min(4.0, totalBoost));
}

export function calculateCityClickMod(city) {
  if (!isGamePage) return;
  let totalBoost = city.clickMod || 1;

  return Math.max(0.25, Math.min(4.0, totalBoost));
}

function increaseSwitchCost() {
  const costEl = document.querySelector("#cities-switch-cost");
  costEl.textContent = banana.i18n("cities-switch-cost", shortAbbreviateNumber(getCitySwitchCost(), "price"));
  const switchCost = getCitySwitchCost();
  return Math.round(switchCost * 1.05);
}

async function unlockCity(city) {
  const cities = getCities();
  const cityToUnlock = cities.find((c) => c.id === city);
  const unlockCost = cityToUnlock.cost;
  const unlockedCities = getUnlockedCities();

  if (!unlockedCities.includes(cityToUnlock.id)) {
    if (getBal() >= unlockCost) {
      playRandomCash();
      setBal(getBal() - unlockCost);
      unlockedCities.push(cityToUnlock.id);
      showAlert(banana.i18n("city-unlocked", cityToUnlock.name));
      populateCitiesGrid();
      saveGame(true);
    } else {
      showAlert(banana.i18n("cant-afford"));
    }
  } else {
    switchCity(cityToUnlock.id);
  }
}

export async function blockCityUnlock(city, reason) {
  const cities = getCities();
  const cityToBlock = cities.find((c) => c.id === city);

  if (reason == "level") {
    showAlert(banana.i18n("city-blocked-level", cityToBlock.unlockLevel));
  }
}

async function switchCity(city) {
  const cities = getCities();
  const switchCost = getCitySwitchCost();
  const currentCity = getCurrentCity();
  const cityToSwitch = cities.find((c) => c.id === city);

  if (currentCity !== cityToSwitch.id) {
    if (getBal() >= switchCost) {
      playRandomCash();
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
    playRandomMouseClick();
    showAlert(banana.i18n("city-already-current-city"));
  }
}

async function addListeners() {
  const cities = getCities();
  const unlockBtns = document.querySelectorAll(".city-card-btn");
  const detailsBtns = document.querySelectorAll(".city-card-details-btn");
  const unlockedCities = getUnlockedCities();
  unlockBtns.forEach((btn) => {
    const city = cities.find((c) => c.id === btn.id);
    if (unlockedCities.includes(city.id)) {
      btn.textContent = banana.i18n("btn-switch-city");
      btn.addEventListener("click", () => {
        switchCity(city.id);
      });
    } else {
      if (getLevel() >= city.unlockLevel) {
        btn.textContent = banana.i18n("btn-unlock");
        btn.addEventListener("click", () => {
          unlockCity(city.id);
        });
      } else {
        btn.textContent = "";
        const iconSpan = document.createElement("span");
        iconSpan.classList.add("tabler--lock-filled");
        btn.appendChild(iconSpan);
        btn.addEventListener("click", () => {
          playRandomMouseClick();
          blockCityUnlock(city.id, "level");
        });
      }
    }
  });

  detailsBtns.forEach((btn) => {
    const cityId = btn.getAttribute("data-city-id");
    const city = cities.find((c) => c.id === cityId);
    btn.textContent = banana.i18n("btn-details");
    btn.addEventListener("click", () => {
      playRandomMouseClick();
      showCityDetails(city);
    });
  });
}

const cityDetailsCloseBtn = document.querySelector("#city-details-close-btn");
const cityDetails = document.querySelector("#city-details");
const cityDetailsTitle = document.querySelector("#city-details-title");
const cityDetailsStatVehicles = document.querySelector("#city-vehicles");
const cityDetailsStatBuildings = document.querySelector("#city-buildings");
const cityDetailsStatPollution = document.querySelector("#city-pollution");
const cityDetailsStatTourism = document.querySelector("#city-tourism");
const cityBuildBtn = document.querySelector("#city-details-buildings-btn");

if (isGamePage) {
  cityDetailsCloseBtn.addEventListener("click", () => {
    playRandomMouseClick();
    cityDetails.style.display = "none";
    cityBuildBtn.setAttribute("data-city-id", "");
  });
}

export function showCityDetails(city) {
  const vehiclesList = city.vehicles.map((vehicle) => banana.i18n(vehicle)).join(", ");
  const buildingsList = city.buildings.map((building) => banana.i18n(`building-${building}`)).join(", ");

  cityDetailsTitle.textContent = banana.i18n("city-details-title", city.name);
  cityDetailsStatVehicles.textContent = banana.i18n("city-details-stat-vehicles", vehiclesList);
  cityDetailsStatBuildings.textContent = banana.i18n("city-details-stat-buildings", buildingsList);
  cityDetailsStatPollution.textContent = banana.i18n(
    "city-details-stat-pollution",
    convertDecimalToPercent(city.pollutionLevel)
  );
  cityDetailsStatTourism.textContent = banana.i18n(
    "city-details-stat-tourism",
    convertDecimalToPercent(city.tourismFactor)
  );

  cityBuildBtn.setAttribute("data-city-id", city.id);
  addBuildListener();
  cityDetails.style.display = "block";
}

// city events section

let activeEvents = [];

function startRandomEvents() {
  activeEvents = localStorage.getItem("activeEvents") ? JSON.parse(localStorage.getItem("activeEvents")) : [];
  activeEvents = activeEvents.filter((event) => event.endTime > Date.now());
  activeEvents.forEach((event) => {
    setTimeout(() => {
      removeEvent(event.id);
    }, event.endTime - Date.now());
  });
  setInterval(() => {
    const chance = Math.random();
    if (chance < 0.1 && activeEvents.length < 3) {
      triggerRandomEvent();
    }
  }, 35000);
}

/**
 * Triggers a random city event.
 *
 * This function first checks if there are any possible events that can be triggered.
 * If there are, it randomly selects one from the pool, taking into account the level requirement.
 * The event is then added to the active events array and a timeout is set to remove it
 * after the event's duration.
 * Finally, the cities grid is updated to reflect the new active events.
 *
 * @return {void}
 */
function triggerRandomEvent() {
  const events = getCityEvents();
  const currentLevel = getLevel();
  const currentCityId = getCurrentCity();
  const cities = getCities();
  const currentCity = cities.find((c) => c.id === currentCityId);

  // checks for level
  const availableEvents = events.filter(
    (event) =>
      (!event.requiresLevel || event.requiresLevel <= currentLevel) &&
      !activeEvents.some((active) => active.id === event.id)
  );

  // checks for buildings
  const possibleEvents = availableEvents.filter((event) => {
    if (!event.requiredBuildings || event.requiredBuildings.length === 0) {
      return true;
    }
    return event.requiredBuildings.every((building) => currentCity.buildings.includes(building));
  });

  if (possibleEvents.length === 0) return;

  // events split into positive and negative
  const positiveEvents = possibleEvents.filter((event) => event.boost >= 1);
  const negativeEvents = possibleEvents.filter((event) => event.boost < 1);

  // 45% chance of positive, 55% chance of negative
  const isPositive = Math.random() < 0.45;
  const eventPool = isPositive ? positiveEvents : negativeEvents;

  // if chosen pool is empty use all
  const finalPool = eventPool.length > 0 ? eventPool : possibleEvents;
  const randomEvent = finalPool[Math.floor(Math.random() * finalPool.length)];

  const newActiveEvent = {
    ...randomEvent,
    startTime: Date.now(),
    endTime: Date.now() + randomEvent.duration,
  };

  activeEvents.push(newActiveEvent);
  localStorage.setItem("activeEvents", JSON.stringify(activeEvents));
  showAlert(randomEvent.description);

  setTimeout(() => {
    removeEvent(newActiveEvent.id);
  }, randomEvent.duration);

  populateCitiesGrid();
}

function removeEvent(eventId) {
  const eventIndex = activeEvents.findIndex((event) => event.id === eventId);
  if (eventIndex !== -1) {
    const removedEvent = activeEvents[eventIndex];
    activeEvents.splice(eventIndex, 1);
    localStorage.setItem("activeEvents", JSON.stringify(activeEvents));
    populateCitiesGrid();
  }
}

function timeFormat(timeLeft) {
  return `${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, "0")}`;
}

function updateActiveEventsDisplay() {
  const eventsContainer = document.querySelector("#active-events-container");
  if (!eventsContainer) return;

  eventsContainer.innerHTML = "";

  activeEvents.forEach((event) => {
    const eventElement = document.createElement("div");
    eventElement.className = "active-event";
    const timeLeft = Math.ceil((event.endTime - Date.now()) / 1000);

    eventElement.innerHTML = `
      <div class="event-info">
        <div class="event-name">${banana.i18n(`city-event-${event.id}`)}</div>
        <div class="event-boost">${banana.i18n("cities-boost", convertDecimalBoostToPercent(event.boost))}</div>
        <div class="event-timer">${banana.i18n("timed-upgr-notif", timeFormat(timeLeft))}</div>
      </div>
    `;

    eventsContainer.appendChild(eventElement);
  });
}

// updates the events display every second
if (isGamePage) {
  setInterval(updateActiveEventsDisplay, 1000);
}

if (isGamePage) {
  startRandomEvents();
}

export function getActiveEvents() {
  return activeEvents;
}
