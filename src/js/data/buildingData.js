import { getI18n } from "../utilities.js";
import gasStationImg from "../../img/buildings/gas_station.webp";
import hydrogenStationImg from "../../img/buildings/hydrogen_station.webp";
import busTerminalImg from "../../img/buildings/bus_terminal.webp";
import parkImg from "../../img/buildings/park.webp";
import touristCenterImg from "../../img/buildings/tourist_center.webp";
import sightseeingPlatformImg from "../../img/buildings/sightseeing_platform.webp";
import transportMuseumImg from "../../img/buildings/transport_museum.webp";
import stadiumImg from "../../img/buildings/stadium.webp";
import roadsWithTreesImg from "../../img/buildings/roads_with_trees.webp";
import largeBusTerminalImg from "../../img/buildings/large_bus_terminal.webp";
import smallMallImg from "../../img/buildings/small_mall.webp";
import hotelImg from "../../img/buildings/hotel.webp";
import mallImg from "../../img/buildings/mall.webp";
import threeStarHotelImg from "../../img/buildings/3_star_hotel.webp";
import fuelRefineryImg from "../../img/buildings/fuel_refinery.webp";
import hydrogenPlantImg from "../../img/buildings/hydrogen_plant.webp";
import solarFarmImg from "../../img/buildings/solar_farm.webp";

let buildings = [];
const isGamePage = window.location.pathname.includes("game.html");

function initializeBuildings() {
  if (!isGamePage) return;
  buildings = [
    {
      name: getI18n("building-gas-station"),
      desc: getI18n("building-gas-station-desc"),
      id: "gas-station",
      requiredLevel: 0,
      cost: 0,
      imgPath: gasStationImg,
      boostType: "special",
      boostValue: 0.0,
      fuelType: "diesel",
      events: [],
    },
    {
      name: getI18n("building-hydrogen-station"),
      desc: getI18n("building-hydrogen-station-desc"),
      id: "hydrogen-station",
      requiredLevel: 5,
      cost: 100000,
      imgPath: hydrogenStationImg,
      boostType: "special",
      boostValue: 0.0,
      fuelType: "hydrogen",
      events: [],
    },
    {
      name: getI18n("building-bus-terminal"),
      desc: getI18n("building-bus-terminal-desc"),
      id: "bus-terminal",
      requiredLevel: 15,
      cost: 250000,
      imgPath: busTerminalImg,
      boostType: "income",
      boostValue: 1.05,
      events: [],
    },
    {
      name: getI18n("building-park"),
      desc: getI18n("building-park-desc"),
      id: "park",
      requiredLevel: 20,
      cost: 300000,
      imgPath: parkImg,
      boostType: "pollution",
      boostValue: -0.05,
      events: [],
    },
    {
      name: getI18n("building-tourist-center"),
      desc: getI18n("building-tourist-center-desc"),
      id: "tourist-center",
      requiredLevel: 35,
      cost: 2000000,
      imgPath: touristCenterImg,
      boostType: "tourism",
      boostValue: 0.08,
      events: ["tourist-season", "city-tour"],
    },
    {
      name: getI18n("building-sightseeing-platform"),
      desc: getI18n("building-sightseeing-platform-desc"),
      id: "sightseeing-platform",
      requiredLevel: 45,
      cost: 5000000,
      imgPath: sightseeingPlatformImg,
      boostType: "tourism",
      boostValue: 0.12,
      events: ["photo-tour", "sunset-tour"],
    },
    {
      name: getI18n("building-transport-museum"),
      desc: getI18n("building-transport-museum-desc"),
      id: "transport-museum",
      requiredLevel: 60,
      cost: 10000000,
      imgPath: transportMuseumImg,
      boostType: "tourism",
      boostValue: 0.19,
      events: ["museum-exhibition", "vintage-vehicle-show"],
    },
    {
      name: getI18n("building-stadium"),
      desc: getI18n("building-stadium-desc"),
      id: "stadium",
      requiredLevel: 75,
      cost: 25000000,
      imgPath: stadiumImg,
      boostType: "tourism",
      boostValue: 0.23,
      events: ["world-cup", "football-match"],
    },
    {
      name: getI18n("building-roads-with-trees"),
      desc: getI18n("building-roads-with-trees-desc"),
      id: "roads-with-trees",
      requiredLevel: 85,
      cost: 50000000,
      imgPath: roadsWithTreesImg,
      boostType: "pollution",
      boostValue: -0.15,
      events: [],
    },
    {
      name: getI18n("building-large-bus-terminal"),
      desc: getI18n("building-large-bus-terminal-desc"),
      id: "large-bus-terminal",
      requiredLevel: 100,
      cost: 60000000,
      imgPath: largeBusTerminalImg,
      boostType: "clickmod",
      boostValue: 1.1,
      events: [],
    },
    {
      name: getI18n("building-small-mall"),
      desc: getI18n("building-small-mall-desc"),
      id: "small-mall",
      requiredLevel: 100,
      cost: 75000000,
      imgPath: smallMallImg,
      boostType: "clickmod",
      boostValue: 1.15,
      events: [],
    },
    {
      name: getI18n("building-hotel"),
      desc: getI18n("building-hotel-desc"),
      id: "hotel",
      requiredLevel: 125,
      cost: 100000000,
      imgPath: hotelImg,
      boostType: "tourism",
      boostValue: 0.25,
      events: ["school-trip"],
    },
    {
      name: getI18n("building-mall"),
      desc: getI18n("building-mall-desc"),
      id: "mall",
      requiredLevel: 140,
      cost: 200000000,
      imgPath: mallImg,
      boostType: "clickmod",
      boostValue: 1.25,
      events: [],
    },
    {
      name: getI18n("building-3-star-hotel"),
      desc: getI18n("building-3-star-hotel-desc"),
      id: "3-star-hotel",
      requiredLevel: 155,
      cost: 550000000,
      imgPath: threeStarHotelImg,
      boostType: "income",
      boostValue: 1.25,
      events: [],
    },
    {
      name: getI18n("building-fuel-refinery"),
      desc: getI18n("building-fuel-refinery-desc"),
      id: "fuel-refinery",
      requiredLevel: 175,
      cost: 20000000000,
      imgPath: fuelRefineryImg,
      boostType: "fuel-generation",
      fuelType: "diesel",
      generationRate: 1.1,
      events: [],
    },
    {
      name: getI18n("building-hydrogen-plant"),
      desc: getI18n("building-hydrogen-plant-desc"),
      id: "hydrogen-plant",
      requiredLevel: 210,
      cost: 35000000000,
      imgPath: hydrogenPlantImg,
      boostType: "fuel-generation",
      fuelType: "hydrogen",
      generationRate: 0.6,
      events: [],
    },
    {
      name: getI18n("building-solar-farm"),
      desc: getI18n("building-solar-farm-desc"),
      id: "solar-farm",
      requiredLevel: 255,
      cost: 15000000000000,
      imgPath: solarFarmImg,
      boostType: "fuel-generation",
      fuelType: "electric",
      generationRate: 0.7,
      events: [],
    },
  ];
}

function getBuildings() {
  return buildings;
}

export { initializeBuildings, getBuildings };
