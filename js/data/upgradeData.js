// table containing all upgrades
export const upgrades = [
  {
    category: "vehicleType",
    id: "citybus",
    name: "Autobusy Miejskie",
    price: 0,
    isAvailable: true,
    unlockcategory: "citybus",
    incomeboost: 0,
    clickboost: 0,
  },
  {
    category: "vehicleType",
    id: "hydrogenbus",
    name: "Autobusy Wodorowe",
    price: 25000,
    isAvailable: true,
    unlockcategory: "hydrogenbus",
    incomeboost: 0,
    clickboost: 0,
  },
  {
    category: "vehicleType",
    id: "intercitybus",
    name: "Autobusy Międzymiastowe",
    price: 50000,
    isAvailable: true,
    unlockcategory: "intercitybus",
    incomeboost: 0,
    clickboost: 0,
  },
  {
    category: "vehicleType",
    id: "trolleybus",
    name: "Trolejbusy",
    price: 250000,
    isAvailable: false,
    unlockcategory: "trolleybus",
    incomeboost: 0,
    clickboost: 0,
  },
  {
    category: "vehicleType",
    id: "tram",
    name: "Tramwaje",
    price: 500000,
    isAvailable: false,
    unlockcategory: "tram",
    incomeboost: 0,
    clickboost: 0,
  },
];

// table containg all upgrade categories
export const upgradeCategories = [
  {
    id: "vehicleType",
    name: "Typy pojazdów",
    isAvailable: true,
  },
  {
    id: "clickUpgrade",
    name: "Ulepszenia klikania",
    isAvailable: false,
  },
  {
    id: "incomeUpgrade",
    name: "Ulepszenia zarobków",
    isAvailable: false,
  },
  {
    id: "routeUpgrade",
    name: "Trasy",
    isAvailable: false,
  },
  {
    id: "timeUpgrade",
    name: "Ulepszenia czasowe",
    isAvailable: false,
  },
];
