import { blockCityUnlock, populateCitiesGrid, showCityDetails } from "./cities.js";
import { getBuildings } from "./data/buildingData.js";
import { getCities } from "./data/cityData.js";
import { banana } from "./langs.js";
import { getLevel } from "./levelSystem.js";
import {
  convertDecimalToPercent,
  convertDecimalBoostToPercent,
  shortAbbreviateNumber,
  showAlert,
  animateWindowClose,
  animateWindowOpen,
} from "./utilities.js";
import { getBal, saveGame, setBal, getUserCityData, updateCityProperty } from "./scr.js";
import { playRandomCash, playRandomMouseClick } from "./sounds.js";

let chosenCity = "";

const isGamePage = window.location.pathname.includes("game.html");

function buildInCity(cityId, buildingId) {
  const userCityData = getUserCityData();
  const cities = getCities();
  const city = cities.find((c) => c.id === cityId);
  const building = getBuildings().find((b) => b.id === buildingId);
  const cityData = userCityData[cityId] || {};
  const userBuildings = cityData.buildings || [...city.buildings];

  if (!userBuildings.includes(buildingId)) {
    if (getBal() >= building.cost) {
      playRandomCash();
      setBal(getBal() - building.cost);
      userBuildings.push(buildingId);
      cityData.buildings = userBuildings;
      updateCityProperty(cityId, "buildings", userBuildings);
      switch (building.boostType) {
        case "income":
          let val1 = city.baseboost * building.boostValue;
          updateCityProperty(cityId, "baseboost", Math.round(val1 * 100) / 100);
          break;
        case "pollution":
          let val2 = city.pollutionLevel + building.boostValue;
          updateCityProperty(cityId, "pollutionLevel", Math.round(val2 * 100) / 100);
          break;
        case "tourism":
          let val3 = city.tourismFactor + building.boostValue;
          updateCityProperty(cityId, "tourismFactor", Math.round(val3 * 100) / 100);
          break;
        case "clickmod":
          let val4 = city.clickMod * building.boostValue;
          updateCityProperty(cityId, "clickMod", Math.round(val4 * 100) / 100);
          break;
      }
      populateCitiesGrid();
      showAlert(banana.i18n("building-built", banana.i18n(`building-${building.id}`), city.name));
      saveGame(true);
    } else {
      playRandomMouseClick();
      showAlert(banana.i18n("cant-afford"));
    }
  } else {
    playRandomMouseClick();
    showAlert(banana.i18n("building-already-built"));
  }
}

export function populateBuildingsGrid() {
  const searchBar = document.querySelector("#buildings-search");
  searchBar.value = "";
  const buildings = getBuildings();
  const grid = document.querySelector("#buildings-grid");
  grid.innerHTML = "";
  const buildingData = buildings;

  buildingData.forEach((building) => {
    const buildingCard = createBuildingCard(building);
    grid.appendChild(buildingCard);
  });

  addBuildingListeners();
}

function createBuildingCard(building) {
  const card = document.createElement("div");
  card.className = "building-card";

  const boostValue =
    building.boostType === "income" || building.boostType === "clickmod"
      ? convertDecimalBoostToPercent(building.boostValue)
      : convertDecimalToPercent(building.boostValue);

  let buildingEvents = building.events.map((event) => banana.i18n(`city-event-${event}`)).join(", ");
  if (buildingEvents === "") {
    buildingEvents = banana.i18n("none");
  }

  card.innerHTML = `
      <img src="${building.imgPath}" alt="${banana.i18n(`building-${building.id}`)}" class="building-card-image">
    <div class="building-card-content">
      <div class="building-card-title">${banana.i18n(`building-${building.id}`)}</div>
      <div class="building-card-desc">${banana.i18n(`building-${building.id}-desc`)}</div>
      <div class="building-card-info">
        <span>${banana.i18n("buildings-boost-type", banana.i18n(`building-boost-${building.boostType}`))}</span>
        <span>${banana.i18n("buildings-boost", boostValue)}</span>
        <span>${banana.i18n("cities-price", shortAbbreviateNumber(building.cost, "price"))}</span>
        <span>${banana.i18n("buildings-events", buildingEvents)}</span>
      </div>
      <button class="building-card-btn btns" id="${building.id}"></button>
    </div>
  `;

  return card;
}

function blockBuilding(id, reason) {
  const building = getBuildings().find((b) => b.id === id);
  if (reason === "level") {
    showAlert(banana.i18n("building-blocked-level", building.requiredLevel, banana.i18n(`building-${building.id}`)));
  }
}

// search
const searchBar = document.querySelector("#buildings-search");
const searchBtn = document.querySelector("#buildings-search-btn");
const clearBtn = document.querySelector("#buildings-clear-search-btn");
const noResults = document.querySelector("#no-search-results-wrapper");

if (isGamePage) {
  searchBtn.addEventListener("click", () => {
    playRandomMouseClick();
    const searchQuery = searchBar.value.toLowerCase();
    const buildings = getBuildings();
    const filteredBuildings = buildings.filter((building) => {
      return banana.i18n(`building-${building.id}`).toLowerCase().includes(searchQuery);
    });
    if (filteredBuildings.length === 0) {
      noResults.style.display = "flex";
    } else {
      noResults.style.display = "none";
    }
    const grid = document.querySelector("#buildings-grid");
    grid.innerHTML = "";
    filteredBuildings.forEach((building) => {
      const buildingCard = createBuildingCard(building);
      grid.appendChild(buildingCard);
    });
    addBuildingListeners();
  });

  clearBtn.addEventListener("click", () => {
    playRandomMouseClick();
    noResults.style.display = "none";
    populateBuildingsGrid();
  });

  searchBar.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
      searchBtn.click();
    }
  });

  searchBar.addEventListener("click", () => {
    searchBar.value = "";
    playRandomMouseClick();
  });
}

function addBuildingListeners() {
  const buildings = getBuildings();
  const buildingBtns = document.querySelectorAll(".building-card-btn");
  buildingBtns.forEach((btn) => {
    if (getLevel() >= buildings.find((b) => b.id === btn.id).requiredLevel) {
      btn.textContent = banana.i18n("btn-build");
      btn.addEventListener("click", () => {
        buildInCity(chosenCity, btn.id);
      });
    } else {
      const iconSpan = document.createElement("span");
      iconSpan.classList.add("tabler--lock-filled");
      btn.appendChild(iconSpan);
      btn.addEventListener("click", () => {
        playRandomMouseClick();
        blockBuilding(btn.id, "level");
      });
    }
  });
}

const closeBtn = document.querySelector("#buildings-menu-close-btn");
const cityDetailsWindow = document.querySelector("#city-details");
const cityBuildBtn = document.querySelector("#city-details-buildings-btn");
const buildingsWindow = document.querySelector("#buildings-window");

export function addBuildListener() {
  const buildBtn = document.querySelector("#city-details-buildings-btn");
  const newBtn = buildBtn.cloneNode(true);
  buildBtn.parentNode.replaceChild(newBtn, buildBtn);

  const cityId = cityBuildBtn.getAttribute("data-city-id");
  const cities = getCities();
  const city = cities.find((c) => c.id === cityId);

  if (getLevel() < city.unlockLevel) {
    newBtn.textContent = "";
    const iconSpan = document.createElement("span");
    iconSpan.classList.add("tabler--lock-filled");
    newBtn.appendChild(iconSpan);
    newBtn.addEventListener("click", () => {
      playRandomMouseClick();
      blockCityUnlock(cityId, "level");
    });
  } else {
    newBtn.textContent = banana.i18n("btn-build");
    newBtn.addEventListener("click", () => {
      playRandomMouseClick();
      populateBuildingsGrid();
      chosenCity = cityBuildBtn.getAttribute("data-city-id");
      buildingsWindow.style.display = "block";
      animateWindowOpen(buildingsWindow, false);
      animateWindowClose(cityDetailsWindow, false);
    });
  }
}

if (isGamePage) {
  closeBtn.addEventListener("click", async () => {
    playRandomMouseClick();
    const cities = getCities();
    animateWindowClose(buildingsWindow, false);
    const city1 = cities.find((c) => c.id === chosenCity);
    showCityDetails(city1);
    chosenCity = "";
  });
}
