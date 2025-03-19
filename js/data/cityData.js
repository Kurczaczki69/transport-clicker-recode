import { banana } from "../langs.js";
import { getCurrentCity, getUserCityData } from "../scr.js";
import { convertDecimalBoostToPercent } from "../utilities.js";

let cities = [];
let cityEvents = [];
const isGamePage = window.location.pathname.endsWith("game.html");

async function initializeCities() {
  if (!isGamePage) return;

  const userCityData = getUserCityData();

  cities = [
    {
      name: banana.i18n("city-name-skarzysko"),
      id: "sko",
      population: 41793,
      density: 649,
      area: 64,
      baseboost: 0.85,
      clickMod: 0.95,
      cost: 0,
      vehicles: ["city-buses", "hydrogen-buses", "intercity-buses"],
      weather: ["sunny", "rainy", "snowy", "stormy", "snowstorm"],
      buildings: ["gas-station"],
      unlockLevel: 0,
      pollutionLevel: 0.75,
      tourismFactor: 0.03,
      imgPath: "img/cities/skarzysko_01.jpg",
    },
    {
      name: banana.i18n("city-name-tychy"),
      id: "tyc",
      population: 121472,
      density: 1482,
      area: 81,
      baseboost: 0.87,
      clickMod: 1,
      cost: 400000,
      vehicles: ["city-buses", "hydrogen-buses", "intercity-buses", "trolleybuses"],
      weather: ["sunny", "rainy", "snowy", "stormy", "snowstorm"],
      buildings: ["gas-station"],
      unlockLevel: 15,
      pollutionLevel: 0.85,
      tourismFactor: 0.05,
      imgPath: "img/cities/tychy_01.jpg",
    },
    {
      name: banana.i18n("city-name-lublin"),
      id: "lub",
      population: 328868,
      density: 2230,
      area: 147,
      baseboost: 0.93,
      clickMod: 1.05,
      cost: 1500000,
      vehicles: ["city-buses", "hydrogen-buses", "intercity-buses", "trolleybuses"],
      weather: ["sunny", "rainy", "snowy", "stormy", "snowstorm"],
      buildings: ["gas-station"],
      unlockLevel: 40,
      pollutionLevel: 0.6,
      tourismFactor: 0.13,
      imgPath: "img/cities/lublin_01.jpg",
    },
    {
      name: banana.i18n("city-name-grudziadz"),
      id: "gru",
      population: 88658,
      density: 1541,
      area: 57,
      baseboost: 0.94,
      clickMod: 1.1,
      cost: 12000000,
      vehicles: ["city-buses", "hydrogen-buses", "intercity-buses", "trolleybuses", "trams"],
      weather: ["sunny", "rainy", "snowy", "stormy", "snowstorm"],
      buildings: ["gas-station"],
      unlockLevel: 85,
      pollutionLevel: 0.6,
      tourismFactor: 0.15,
      imgPath: "img/cities/grudziadz_01.jpg",
    },
    {
      name: banana.i18n("city-name-lodz"),
      id: "lod",
      population: 648711,
      density: 2212,
      area: 293,
      baseboost: 0.98,
      clickMod: 1.13,
      cost: 105000000,
      vehicles: ["city-buses", "hydrogen-buses", "intercity-buses", "trolleybuses", "trams", "modern-trams"],
      weather: ["sunny", "rainy", "snowy", "stormy", "snowstorm"],
      buildings: ["gas-station"],
      unlockLevel: 120,
      pollutionLevel: 0.7,
      tourismFactor: 0.55,
      imgPath: "img/cities/lodz_01.jpg",
    },
  ];

  cities = cities.map((city) => {
    if (userCityData[city.id]) {
      return {
        ...city,
        ...userCityData[city.id],
      };
    }
    return city;
  });
}

function initializeCityEvents() {
  const currentCity = getCurrentCity();
  const currentCityData = cities.find((city) => city.id === currentCity);
  cityEvents = [
    {
      name: banana.i18n("city-event-carnival"),
      description: banana.i18n("city-event-carnival-desc", currentCityData.name, convertDecimalBoostToPercent(1.2)),
      id: "carnival",
      boost: 1.2,
      duration: 900000,
      cities: ["lub"],
    },
    {
      name: banana.i18n("city-event-concert"),
      description: banana.i18n("city-event-concert-desc", currentCityData.name, convertDecimalBoostToPercent(1.45)),
      id: "concert",
      boost: 1.45,
      duration: 480000,
      requiresLevel: 12,
    },
    {
      name: banana.i18n("city-event-road-construction"),
      description: banana.i18n(
        "city-event-road-construction-desc",
        currentCityData.name,
        convertDecimalBoostToPercent(0.75)
      ),
      id: "road-construction",
      boost: 0.75,
      duration: 600000,
    },
    {
      name: banana.i18n("city-event-crash"),
      description: banana.i18n("city-event-crash-desc", currentCityData.name, convertDecimalBoostToPercent(0.4)),
      id: "crash",
      boost: 0.4,
      duration: 180000,
      requiresLevel: 25,
    },
    {
      name: banana.i18n("city-event-protest"),
      description: banana.i18n("city-event-protest-desc", currentCityData.name, convertDecimalBoostToPercent(0.65)),
      id: "protest",
      boost: 0.65,
      duration: 180000,
      cities: ["lub"],
    },
    {
      name: banana.i18n("city-event-film-shooting"),
      description: banana.i18n(
        "city-event-film-shooting-desc",
        currentCityData.name,
        convertDecimalBoostToPercent(1.15)
      ),
      id: "film-shooting",
      boost: 1.15,
      duration: 900000,
    },
    {
      name: banana.i18n("city-event-forest-fire"),
      description: banana.i18n("city-event-forest-fire-desc", currentCityData.name, convertDecimalBoostToPercent(0.6)),
      id: "forest-fire",
      boost: 0.6,
      duration: 200000,
    },
    {
      name: banana.i18n("city-event-tourist-season"),
      description: banana.i18n(
        "city-event-tourist-season-desc",
        currentCityData.name,
        convertDecimalBoostToPercent(1.35)
      ),
      id: "tourist-season",
      boost: 1.35,
      duration: 300000,
      requiredBuildings: ["tourist-center"],
    },
    {
      name: banana.i18n("city-event-city-tour"),
      description: banana.i18n("city-event-city-tour-desc", currentCityData.name, convertDecimalBoostToPercent(1.2)),
      id: "city-tour",
      boost: 1.2,
      duration: 150000,
      requiredBuildings: ["tourist-center"],
    },
    {
      name: banana.i18n("city-event-photo-tour"),
      description: banana.i18n("city-event-photo-tour-desc", currentCityData.name, convertDecimalBoostToPercent(1.25)),
      id: "photo-tour",
      boost: 1.25,
      duration: 150000,
      requiredBuildings: ["sightseeing-platform"],
    },
    {
      name: banana.i18n("city-event-sunset-tour"),
      description: banana.i18n("city-event-sunset-tour-desc", currentCityData.name, convertDecimalBoostToPercent(1.35)),
      id: "sunset-tour",
      boost: 1.35,
      duration: 150000,
      requiredBuildings: ["sightseeing-platform"],
    },
    {
      name: banana.i18n("city-event-museum-exhibition"),
      description: banana.i18n(
        "city-event-museum-exhibition-desc",
        currentCityData.name,
        convertDecimalBoostToPercent(1.15)
      ),
      id: "museum-exhibition",
      boost: 1.15,
      duration: 200000,
      requiredBuildings: ["transport-museum"],
    },
    {
      name: banana.i18n("city-event-vintage-vehicle-show"),
      description: banana.i18n(
        "city-event-vintage-vehicle-show-desc",
        currentCityData.name,
        convertDecimalBoostToPercent(1.2)
      ),
      id: "vintage-vehicle-show",
      boost: 1.2,
      duration: 200000,
      requiredBuildings: ["transport-museum"],
    },
    {
      name: banana.i18n("city-event-world-cup"),
      description: banana.i18n("city-event-world-cup-desc", currentCityData.name, convertDecimalBoostToPercent(1.6)),
      id: "world-cup",
      boost: 1.6,
      duration: 300000,
      requiredBuildings: ["stadium"],
    },
    {
      name: banana.i18n("city-event-football-match"),
      description: banana.i18n(
        "city-event-football-match-desc",
        currentCityData.name,
        convertDecimalBoostToPercent(1.4)
      ),
      id: "football-match",
      boost: 1.4,
      duration: 180000,
      requiredBuildings: ["stadium"],
    },
    {
      name: banana.i18n("city-event-school-trip"),
      description: banana.i18n("city-event-school-trip-desc", currentCityData.name, convertDecimalBoostToPercent(1.05)),
      id: "school-trip",
      boost: 1.05,
      duration: 200000,
      requiredBuildings: ["hotel"],
    },
  ];
}

function getCities() {
  initializeCities();
  return cities;
}

function setCities(newCities) {
  cities = newCities;
}

function getCityEvents() {
  initializeCityEvents();
  return cityEvents;
}

export { initializeCities, getCities, setCities, getCityEvents };
