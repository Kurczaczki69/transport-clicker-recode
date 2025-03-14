import { banana } from "../langs.js";

let buildings = [];
const isGamePage = window.location.pathname.includes("game.html");

function initializeBuildings() {
  if (!isGamePage) return;
  buildings = [
    {
      name: banana.i18n("building-gas-station"),
      desc: banana.i18n("building-gas-station-desc"),
      id: "gas-station",
      requiredLevel: 0,
      cost: 0,
      imgPath: "img/buildings/gas_station.jpg",
      boostType: "special",
      boostValue: 0.0,
      boostScale: 0.0,
      events: [],
    },
    {
      name: banana.i18n("building-bus-terminal"),
      desc: banana.i18n("building-bus-terminal-desc"),
      id: "bus-terminal",
      requiredLevel: 10,
      cost: 100000,
      imgPath: "img/buildings/bus_terminal.jpg",
      boostType: "income",
      boostValue: 1.05,
      boostScale: 0.05, // value in percent, shows how much the boost is increased per building level
      events: ["rush-hour"],
    },
    {
      name: banana.i18n("building-park"),
      desc: banana.i18n("building-park-desc"),
      id: "park",
      requiredLevel: 15,
      cost: 150000,
      imgPath: "img/buildings/park.jpg",
      boostType: "pollution",
      boostValue: -0.05,
      boostScale: 0.02,
      events: [],
    },
    {
      name: banana.i18n("building-tourist-center"),
      desc: banana.i18n("building-tourist-center-desc"),
      id: "tourist-center",
      requiredLevel: 25,
      cost: 350000,
      imgPath: "img/buildings/tourist_center.jpg",
      boostType: "tourism",
      boostValue: 0.08,
      boostScale: 0.03,
      events: ["tourist-season", "city-tour"],
    },
    {
      name: banana.i18n("building-sightseeing-platform"),
      desc: banana.i18n("building-sightseeing-platform-desc"),
      id: "sightseeing-platform",
      requiredLevel: 30,
      cost: 500000,
      imgPath: "img/buildings/sightseeing_platform.jpg",
      boostType: "tourism",
      boostValue: 0.12,
      boostScale: 0.05,
      events: ["photo-tour", "sunset-tour"],
    },
    {
      name: banana.i18n("building-transport-museum"),
      desc: banana.i18n("building-transport-museum-desc"),
      id: "transport-museum",
      requiredLevel: 35,
      cost: 750000,
      imgPath: "img/buildings/transport_museum.jpg",
      boostType: "tourism",
      boostValue: 0.19,
      boostScale: 0.06,
      events: ["museum-exhibition", "vintage-vehicle-show"],
    },
  ];
}

function getBuildings() {
  return buildings;
}

export { initializeBuildings, getBuildings };
