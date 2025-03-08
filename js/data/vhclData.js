// HOW TO ADD A VEHICLE
// 1. Add to vhcls array with all data neccesary

let vhcls = [];

export function initializeVehicles() {
  vhcls = [
    {
      code: "solu8",
      name: "Solaris Urbino 8",
      clickmod: 0,
      incomemod: 1,
      price: 500,
      requiredLevel: 0,
      maxLevel: 30,
      category: "citybus",
      maxQuantity: 10000000000,
    },
    {
      code: "solu9",
      name: "Solaris Urbino 9",
      clickmod: 0,
      incomemod: 2,
      price: 1500,
      requiredLevel: 1,
      maxLevel: 35,
      category: "citybus",
      maxQuantity: 10000000000,
    },
    {
      code: "solu105",
      name: "Solaris Urbino 10.5",
      clickmod: 1,
      incomemod: 1,
      price: 3500,
      requiredLevel: 2,
      maxLevel: 35,
      category: "citybus",
      maxQuantity: 10000000000,
    },
    {
      code: "solu12",
      name: "Solaris Urbino 12",
      clickmod: 2,
      incomemod: 1,
      price: 7000,
      requiredLevel: 3,
      maxLevel: 35,
      category: "citybus",
      maxQuantity: 10000000000,
    },
    {
      code: "sola86",
      name: "Solaris Alpino 8.6",
      clickmod: 3,
      incomemod: 3,
      price: 12000,
      requiredLevel: 5,
      maxLevel: 35,
      category: "citybus",
      maxQuantity: 10000000000,
    },
    {
      code: "solu18",
      name: "Solaris Urbino 18",
      clickmod: 1,
      incomemod: 4,
      price: 18000,
      requiredLevel: 6,
      maxLevel: 40,
      category: "citybus",
      maxQuantity: 10000000000,
    },
    {
      code: "solu24",
      name: "Solaris Urbino 24",
      clickmod: 5,
      incomemod: 1,
      price: 25000,
      requiredLevel: 7,
      maxLevel: 55,
      category: "citybus",
      maxQuantity: 10000000000,
    },
    {
      code: "manlion",
      name: "MAN Lion's City",
      clickmod: 6,
      incomemod: 2,
      price: 32000,
      requiredLevel: 9,
      maxLevel: 60,
      category: "citybus",
      maxQuantity: 10000000000,
    },
    {
      code: "jelczm121m",
      name: "Jelcz M121M",
      clickmod: 2,
      incomemod: 6,
      price: 38000,
      requiredLevel: 10,
      maxLevel: 75,
      category: "citybus",
      maxQuantity: 10000000000,
    },
    {
      code: "manlioncig",
      name: "MAN Lion's City GXL",
      clickmod: 8,
      incomemod: 4,
      price: 45000,
      requiredLevel: 12,
      maxLevel: 90,
      category: "citybus",
      maxQuantity: 10000000000,
    },
    {
      code: "solu12h",
      name: "Solaris Urbino 12 Hydrogen",
      clickmod: 7,
      incomemod: 3,
      price: 50000,
      requiredLevel: 13,
      maxLevel: 100,
      category: "hydrogenbus",
      maxQuantity: 10000000000,
    },
    {
      code: "solu18h",
      name: "Solaris Urbino 18 Hydrogen",
      clickmod: 8,
      incomemod: 4,
      price: 65000,
      requiredLevel: 15,
      maxLevel: 100,
      category: "hydrogenbus",
      maxQuantity: 10000000000,
    },
    {
      code: "toyotafc",
      name: "Toyota FC Bus",
      clickmod: 10,
      incomemod: 10,
      price: 85000,
      requiredLevel: 17,
      maxLevel: 125,
      category: "hydrogenbus",
      maxQuantity: 10000000000,
    },
    {
      code: "toyotasora",
      name: "Toyota Sora",
      clickmod: 12,
      incomemod: 12,
      price: 120000,
      requiredLevel: 19,
      maxLevel: 150,
      category: "hydrogenbus",
      maxQuantity: 10000000000,
    },
    {
      code: "mercedesecitaro",
      name: "Mercedes-Benz eCitaro",
      clickmod: 13,
      incomemod: 13,
      price: 150000,
      requiredLevel: 21,
      maxLevel: 170,
      category: "hydrogenbus",
      maxQuantity: 10000000000,
    },
    {
      code: "vacanza12",
      name: "Solaris Vacanza 12",
      clickmod: 5,
      incomemod: 8,
      price: 55000,
      requiredLevel: 14,
      maxLevel: 150,
      category: "intercitybus",
      maxQuantity: 10000000000,
    },
    {
      code: "vacanza13",
      name: "Solaris Vacanza 13",
      clickmod: 10,
      incomemod: 10,
      price: 90000,
      requiredLevel: 18,
      maxLevel: 175,
      category: "intercitybus",
      maxQuantity: 10000000000,
    },
    {
      code: "solint12",
      name: "Solaris InterUrbino 12",
      clickmod: 17,
      incomemod: 20,
      price: 150000,
      requiredLevel: 22,
      maxLevel: 250,
      category: "intercitybus",
      maxQuantity: 10000000000,
    },
    {
      code: "volvo9700",
      name: "Volvo 9700",
      clickmod: 20,
      incomemod: 22,
      price: 200000,
      requiredLevel: 25,
      maxLevel: 275,
      category: "intercitybus",
      maxQuantity: 10000000000,
    },
    {
      code: "volvo9700double",
      name: "Volvo 9700 Double Decker",
      clickmod: 25,
      incomemod: 25,
      price: 250000,
      requiredLevel: 30,
      maxLevel: 310,
      category: "intercitybus",
      maxQuantity: 10000000000,
    },
    {
      code: "soltroll12",
      name: "Solaris Trollino 12",
      clickmod: 20,
      incomemod: 20,
      price: 200000,
      requiredLevel: 25,
      maxLevel: 320,
      category: "trolleybus",
      maxQuantity: 10000000000,
    },
    {
      code: "soltroll18",
      name: "Solaris Trollino 18",
      clickmod: 30,
      incomemod: 32,
      price: 380000,
      requiredLevel: 37,
      maxLevel: 325,
      category: "trolleybus",
      maxQuantity: 10000000000,
    },
    {
      code: "soltroll24",
      name: "Solaris Trollino 24",
      clickmod: 38,
      incomemod: 42,
      price: 475000,
      requiredLevel: 45,
      maxLevel: 400,
      category: "trolleybus",
      maxQuantity: 10000000000,
    },
    {
      code: "mercedes530",
      name: "Mercedes-Benz O530L",
      clickmod: 45,
      incomemod: 48,
      price: 575000,
      requiredLevel: 55,
      maxLevel: 500,
      category: "trolleybus",
      maxQuantity: 10000000000,
    },
    {
      code: "mercedescitaro2",
      name: "Mercedes-Benz Citaro 2",
      clickmod: 50,
      incomemod: 57,
      price: 675000,
      requiredLevel: 63,
      maxLevel: 550,
      category: "trolleybus",
      maxQuantity: 10000000000,
    },
    {
      code: "exquicity18",
      name: "ExquiCity 18",
      clickmod: 60,
      incomemod: 64,
      price: 825000,
      requiredLevel: 67,
      maxLevel: 600,
      category: "trolleybus",
      maxQuantity: 10000000000,
    },
    {
      code: "exquicity24",
      name: "ExquiCity 24",
      clickmod: 70,
      incomemod: 74,
      price: 1000000,
      requiredLevel: 75,
      maxLevel: 650,
      category: "trolleybus",
      maxQuantity: 10000000000,
    },
    {
      code: "newflyerxt60",
      name: "New Flyer XT60",
      clickmod: 80,
      incomemod: 84,
      price: 1100000,
      requiredLevel: 85,
      maxLevel: 700,
      category: "trolleybus",
      maxQuantity: 10000000000,
    },
  ];
}

export function getVhcls() {
  return vhcls;
}

export function setVhcls(vhcls) {
  vhcls = vhcls;
}
