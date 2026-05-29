import { getI18n } from "../utilities.js";

let routes = [];

const isGamePage = window.location.pathname.endsWith("game.html");

// routes are based on real life routes from the cities in-game
function initializeRoutes() {
    if (!isGamePage) return;
    routes = [
        {
            name: getI18n("route-sko-1"),
            id: "sko-1",
            city: ["sko"],
            cost: 0,
            type: "intracity",
            vehicles: ["city-buses", "hydrogen-buses"],
        },
        {
            name: getI18n("route-sko-2"),
            id: "sko-2",
            city: ["sko"],
            cost: 0,
            type: "intracity",
            vehicles: ["city-buses", "hydrogen-buses"],
        },
        {
            name: getI18n("route-sko-5"),
            id: "sko-5",
            city: ["sko"],
            cost: 0,
            type: "intracity",
            vehicles: ["city-buses", "hydrogen-buses"],
        }
    ];
}

function getRouteById(id) {
    return routes.find(route => route.id === id);
}

function getAllRoutes() {
    return routes;
}

function getRoutesForCity(cityId) {
    return routes.filter(route => route.city.includes(cityId));
}