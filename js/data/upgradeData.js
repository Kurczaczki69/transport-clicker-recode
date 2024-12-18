// array containing all upgrades
export const upgrades = [
  {
    category: "vehicleType",
    id: "citybus",
    name: "Autobusy Miejskie",
    desc: "Odblokowuje autobusy w menu pojazdów",
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
    desc: "Odblokowuje autobusy wodorowe w menu pojazdów",
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
    desc: "Odblokowuje autobusy międzymiastowe w menu pojazdów",
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
    desc: "Odblokowuje trolejbusy w menu pojazdów",
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
    desc: "Odblokowuje tramwaje w menu pojazdów",
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
    id: "timedUpgrades",
    name: "Ulepszenia czasowe",
    isAvailable: true,
  },
  {
    id: "routeUpgrades",
    name: "Trasy",
    isAvailable: false,
  },
];
