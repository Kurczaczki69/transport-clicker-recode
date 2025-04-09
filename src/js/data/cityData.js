import { getCurrentCity, getUserCityData } from "../scr.js";
import { convertDecimalBoostToPercent, getI18n } from "../utilities.js";
import skoImg from "../../img/cities/skarzysko_01.webp";
import tycImg from "../../img/cities/tychy_01.webp";
import lubImg from "../../img/cities/lublin_01.webp";
import gruImg from "../../img/cities/grudziadz_01.webp";
import lodImg from "../../img/cities/lodz_01.webp";

let cities = [];
let cityEvents = [];
const isGamePage = window.location.pathname.endsWith("game.html");

async function initializeCities() {
  if (!isGamePage) return;

  const userCityData = getUserCityData() || {};

  cities = [
    {
      name: getI18n("city-name-skarzysko"),
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
      imgPath: skoImg,
    },
    {
      name: getI18n("city-name-tychy"),
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
      imgPath: tycImg,
    },
    {
      name: getI18n("city-name-lublin"),
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
      imgPath: lubImg,
    },
    {
      name: getI18n("city-name-grudziadz"),
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
      imgPath: gruImg,
    },
    {
      name: getI18n("city-name-lodz"),
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
      imgPath: lodImg,
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
      name: getI18n("city-event-carnival"),
      description: getI18n("city-event-carnival-desc", currentCityData.name, convertDecimalBoostToPercent(1.2)),
      id: "carnival",
      boost: 1.2,
      duration: 900000,
      cities: ["lub"],
    },
    {
      name: getI18n("city-event-concert"),
      description: getI18n("city-event-concert-desc", currentCityData.name, convertDecimalBoostToPercent(1.45)),
      id: "concert",
      boost: 1.45,
      duration: 480000,
      requiresLevel: 12,
    },
    {
      name: getI18n("city-event-road-construction"),
      description: getI18n(
        "city-event-road-construction-desc",
        currentCityData.name,
        convertDecimalBoostToPercent(0.75)
      ),
      id: "road-construction",
      boost: 0.75,
      duration: 600000,
    },
    {
      name: getI18n("city-event-crash"),
      description: getI18n("city-event-crash-desc", currentCityData.name, convertDecimalBoostToPercent(0.4)),
      id: "crash",
      boost: 0.4,
      duration: 180000,
      requiresLevel: 25,
    },
    {
      name: getI18n("city-event-protest"),
      description: getI18n("city-event-protest-desc", currentCityData.name, convertDecimalBoostToPercent(0.65)),
      id: "protest",
      boost: 0.65,
      duration: 180000,
      cities: ["lub"],
    },
    {
      name: getI18n("city-event-film-shooting"),
      description: getI18n("city-event-film-shooting-desc", currentCityData.name, convertDecimalBoostToPercent(1.15)),
      id: "film-shooting",
      boost: 1.15,
      duration: 900000,
    },
    {
      name: getI18n("city-event-forest-fire"),
      description: getI18n("city-event-forest-fire-desc", currentCityData.name, convertDecimalBoostToPercent(0.6)),
      id: "forest-fire",
      boost: 0.6,
      duration: 200000,
    },
    {
      name: getI18n("city-event-tourist-season"),
      description: getI18n("city-event-tourist-season-desc", currentCityData.name, convertDecimalBoostToPercent(1.35)),
      id: "tourist-season",
      boost: 1.35,
      duration: 300000,
      requiredBuildings: ["tourist-center"],
    },
    {
      name: getI18n("city-event-city-tour"),
      description: getI18n("city-event-city-tour-desc", currentCityData.name, convertDecimalBoostToPercent(1.2)),
      id: "city-tour",
      boost: 1.2,
      duration: 150000,
      requiredBuildings: ["tourist-center"],
    },
    {
      name: getI18n("city-event-photo-tour"),
      description: getI18n("city-event-photo-tour-desc", currentCityData.name, convertDecimalBoostToPercent(1.25)),
      id: "photo-tour",
      boost: 1.25,
      duration: 150000,
      requiredBuildings: ["sightseeing-platform"],
    },
    {
      name: getI18n("city-event-sunset-tour"),
      description: getI18n("city-event-sunset-tour-desc", currentCityData.name, convertDecimalBoostToPercent(1.35)),
      id: "sunset-tour",
      boost: 1.35,
      duration: 150000,
      requiredBuildings: ["sightseeing-platform"],
    },
    {
      name: getI18n("city-event-museum-exhibition"),
      description: getI18n(
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
      name: getI18n("city-event-vintage-vehicle-show"),
      description: getI18n(
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
      name: getI18n("city-event-world-cup"),
      description: getI18n("city-event-world-cup-desc", currentCityData.name, convertDecimalBoostToPercent(1.6)),
      id: "world-cup",
      boost: 1.6,
      duration: 300000,
      requiredBuildings: ["stadium"],
    },
    {
      name: getI18n("city-event-football-match"),
      description: getI18n("city-event-football-match-desc", currentCityData.name, convertDecimalBoostToPercent(1.4)),
      id: "football-match",
      boost: 1.4,
      duration: 180000,
      requiredBuildings: ["stadium"],
    },
    {
      name: getI18n("city-event-school-trip"),
      description: getI18n("city-event-school-trip-desc", currentCityData.name, convertDecimalBoostToPercent(1.05)),
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
