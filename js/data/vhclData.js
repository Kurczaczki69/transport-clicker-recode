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
      requiredLevel: 0,
      category: "citybus",
      maxQuantity: 10000000,
    },
    {
      code: "solu9",
      name: "Solaris Urbino 9",
      clickmod: 0,
      incomemod: 2,
      price: 1500,
      requiredLevel: 1,
      category: "citybus",
      maxQuantity: 10000000,
    },
    {
      code: "solu105",
      name: "Solaris Urbino 10.5",
      clickmod: 1,
      incomemod: 1,
      price: 3500,
      requiredLevel: 2,
      category: "citybus",
      maxQuantity: 10000000,
    },
    {
      code: "solu12",
      name: "Solaris Urbino 12",
      clickmod: 2,
      incomemod: 1,
      price: 7000,
      requiredLevel: 3,
      category: "citybus",
      maxQuantity: 10000000,
    },
    {
      code: "sola86",
      name: "Solaris Alpino 8.6",
      clickmod: 3,
      incomemod: 3,
      price: 12000,
      requiredLevel: 5,
      category: "citybus",
      maxQuantity: 10000000,
    },
    {
      code: "solu18",
      name: "Solaris Urbino 18",
      clickmod: 1,
      incomemod: 4,
      price: 18000,
      requiredLevel: 6,
      category: "citybus",
      maxQuantity: 10000000,
    },
    {
      code: "solu24",
      name: "Solaris Urbino 24",
      clickmod: 5,
      incomemod: 1,
      price: 25000,
      requiredLevel: 7,
      category: "citybus",
      maxQuantity: 10000000,
    },
    {
      code: "manlion",
      name: "MAN Lion's City",
      clickmod: 6,
      incomemod: 2,
      price: 32000,
      requiredLevel: 9,
      category: "citybus",
      maxQuantity: 10000000,
    },
    {
      code: "jelczm121m",
      name: "Jelcz M121M",
      clickmod: 2,
      incomemod: 6,
      price: 38000,
      requiredLevel: 10,
      category: "citybus",
      maxQuantity: 10000000,
    },
    {
      code: "manlioncig",
      name: "MAN Lion's City GXL",
      clickmod: 8,
      incomemod: 4,
      price: 45000,
      requiredLevel: 12,
      category: "citybus",
      maxQuantity: 10000000,
    },
    {
      code: "solu12h",
      name: "Solaris Urbino 12 Hydrogen",
      clickmod: 7,
      incomemod: 3,
      price: 50000,
      requiredLevel: 13,
      category: "hydrogenbus",
      maxQuantity: 10000000,
    },
    {
      code: "solu18h",
      name: "Solaris Urbino 18 Hydrogen",
      clickmod: 8,
      incomemod: 4,
      price: 65000,
      requiredLevel: 15,
      category: "hydrogenbus",
      maxQuantity: 10000000,
    },
    {
      code: "toyotafc",
      name: "Toyota FC Bus",
      clickmod: 10,
      incomemod: 10,
      price: 85000,
      requiredLevel: 17,
      category: "hydrogenbus",
      maxQuantity: 10000000,
    },
    {
      code: "toyotasora",
      name: "Toyota Sora",
      clickmod: 12,
      incomemod: 12,
      price: 120000,
      requiredLevel: 19,
      category: "hydrogenbus",
      maxQuantity: 10000000,
    },
    {
      code: "vacanza12",
      name: "Solaris Vacanza 12",
      clickmod: 5,
      incomemod: 8,
      price: 55000,
      requiredLevel: 14,
      category: "intercitybus",
      maxQuantity: 10000000,
    },
    {
      code: "vacanza13",
      name: "Solaris Vacanza 13",
      clickmod: 10,
      incomemod: 10,
      price: 90000,
      requiredLevel: 18,
      category: "intercitybus",
      maxQuantity: 10000000,
    },
    {
      code: "solint12",
      name: "Solaris InterUrbino 12",
      clickmod: 17,
      incomemod: 20,
      price: 150000,
      requiredLevel: 22,
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
