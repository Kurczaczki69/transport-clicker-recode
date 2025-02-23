// HOW TO ADD A VEHICLE
// 1. Add to vhcls array with all data neccesary
// 2. Add to html

let vhcls = [];

function initializeVehicles() {
  vhcls = [
    {
      code: "solu8",
      name: "Solaris Urbino 8",
      clickmod: 0,
      incomemod: 1,
      price: 500,
      requiredUpgr: "none",
      category: "citybus",
      maxQuantity: 10000000,
    },
    {
      code: "solu9",
      name: "Solaris Urbino 9",
      clickmod: 0,
      incomemod: 2,
      price: 4000,
      requiredUpgr: "none",
      category: "citybus",
      maxQuantity: 10000000,
    },
    {
      code: "solu105",
      name: "Solaris Urbino 10.5",
      clickmod: 1,
      incomemod: 0,
      price: 6000,
      requiredUpgr: "none",
      category: "citybus",
      maxQuantity: 10000000,
    },
    {
      code: "solu12",
      name: "Solaris Urbino 12",
      clickmod: 2,
      incomemod: 0,
      price: 8000,
      requiredUpgr: "none",
      category: "citybus",
      maxQuantity: 10000000,
    },
    {
      code: "sola86",
      name: "Solaris Alpino 8.6",
      clickmod: 2,
      incomemod: 2,
      price: 15000,
      requiredUpgr: "none",
      category: "citybus",
      maxQuantity: 10000000,
    },
    {
      code: "solu18",
      name: "Solaris Urbino 18",
      clickmod: 0,
      incomemod: 4,
      price: 16000,
      requiredUpgr: "none",
      category: "citybus",
      maxQuantity: 10000000,
    },
    {
      code: "solu24",
      name: "Solaris Urbino 24",
      clickmod: 4,
      incomemod: 0,
      price: 21000,
      requiredUpgr: "none",
      category: "citybus",
      maxQuantity: 10000000,
    },
    {
      code: "manlion",
      name: "MAN Lion's City",
      clickmod: 6,
      incomemod: 0,
      price: 24000,
      requiredUpgr: "none",
      category: "citybus",
      maxQuantity: 10000000,
    },
    {
      code: "jelczm121m",
      name: "Jelcz M121M",
      clickmod: 0,
      incomemod: 6,
      price: 25500,
      requiredUpgr: "none",
      category: "citybus",
      maxQuantity: 10000000,
    },
    {
      code: "manlioncig",
      name: "MAN Lion's City GXL",
      clickmod: 8,
      incomemod: 4,
      price: 35000,
      requiredUpgr: "none",
      category: "citybus",
      maxQuantity: 10000000,
    },
    {
      code: "solu12h",
      name: "Solaris Urbino 12 Hydrogen",
      clickmod: 7,
      incomemod: 0,
      price: 24500,
      requiredUpgr: "none",
      category: "hydrogenbus",
      maxQuantity: 10000000,
    },
    {
      code: "solu18h",
      name: "Solaris Urbino 18 Hydrogen",
      clickmod: 8,
      incomemod: 0,
      price: 27500,
      requiredUpgr: "none",
      category: "hydrogenbus",
      maxQuantity: 10000000,
    },
    {
      code: "toyotafc",
      name: "Toyota FC Bus",
      clickmod: 8,
      incomemod: 10,
      price: 60000,
      requiredUpgr: "none",
      category: "hydrogenbus",
      maxQuantity: 10000000,
    },
    {
      code: "toyotasora",
      name: "Toyota Sora",
      clickmod: 12,
      incomemod: 10,
      price: 95000,
      requiredUpgr: "none",
      category: "hydrogenbus",
      maxQuantity: 10000000,
    },
    {
      code: "vacanza12",
      name: "Solaris Vacanza 12",
      clickmod: 0,
      incomemod: 8,
      price: 40000,
      requiredUpgr: "none",
      category: "intercitybus",
      maxQuantity: 10000000,
    },
    {
      code: "vacanza13",
      name: "Solaris Vacanza 13",
      clickmod: 10,
      incomemod: 8,
      price: 58000,
      requiredUpgr: "none",
      category: "intercitybus",
      maxQuantity: 10000000,
    },
    {
      code: "solint12",
      name: "Solaris InterUrbino 12",
      clickmod: 17,
      incomemod: 20,
      price: 120000,
      requiredUpgr: "none",
      category: "intercitybus",
      maxQuantity: 10000000,
    },
  ];
}

function getVhcls() {
  return vhcls;
}

function setVhcls(vhcls) {
  vhcls = vhcls;
}

export const a20 = [
  {
    code: "mana20",
    name: "MAN A20",
    price: 0,
    incomemod: 0,
    clickmod: 1,
    requiredUpgr: "none",
    category: "citybus",
  },
];

export { initializeVehicles, getVhcls, setVhcls };
