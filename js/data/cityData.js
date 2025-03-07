import { banana } from "../langs.js";
import { getCurrentCity } from "../scr.js";
import { convertDecimalBoostToPercent } from "../utilities.js";

let cities = [];
let cityEvents = [];
const isGamePage = window.location.pathname.endsWith("game.html");

function initializeCities() {
  if (!isGamePage) return;
  cities = [
    {
      name: banana.i18n("city-name-skarzysko"),
      id: "sko",
      population: 41793,
      density: 649,
      area: 64,
      baseboost: 0.85,
      cost: 0,
      vehicles: ["city-buses", "hydrogen-buses", "intercity-buses"],
      weather: ["sunny", "rainy", "snowy", "stormy", "snowstorm"],
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
      cost: 150000,
      vehicles: ["city-buses", "hydrogen-buses", "intercity-buses", "trolleybuses"],
      weather: ["sunny", "rainy", "snowy", "stormy", "snowstorm"],
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
      cost: 450000,
      vehicles: ["city-buses", "hydrogen-buses", "intercity-buses", "trolleybuses"],
      weather: ["sunny", "rainy", "snowy", "stormy", "snowstorm"],
      unlockLevel: 40,
      pollutionLevel: 0.6,
      tourismFactor: 0.13,
      imgPath: "img/cities/lublin_01.jpg",
    },
  ];

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
  ];
}

function getCities() {
  initializeCities();
  return cities;
}

function getCityEvents() {
  initializeCities();
  return cityEvents;
}

export { initializeCities, getCities, getCityEvents };
