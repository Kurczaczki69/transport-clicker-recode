// JAK DODAĆ AUTOBUS
// 1. Dodaj do tabeli objektów "buses" z jego: kodem, nazwą, ceną, modyfikatorami, wymaganymi ulepszeniami
// 2. Dodaj go do tabeli busPrices
// 3. Stwórz listener na dole skryptu

export const buses = [
  {
    code: "solu8",
    name: "Solaris Urbino 8",
    clickmod: 0,
    incomemod: 1,
    price: 500,
    requiredUpgr: "none",
  },
  {
    code: "solu9",
    name: "Solaris Urbino 9",
    clickmod: 0,
    incomemod: 2,
    price: 4000,
    requiredUpgr: "none",
  },
  {
    code: "solu105",
    name: "Solaris Urbino 10.5",
    clickmod: 1,
    incomemod: 0,
    price: 6000,
    requiredUpgr: "none",
  },
  {
    code: "solu12",
    name: "Solaris Urbino 12",
    clickmod: 2,
    incomemod: 0,
    price: 8000,
    requiredUpgr: "none",
  },
  {
    code: "sola86",
    name: "Solaris Alpino 8.6",
    clickmod: 2,
    incomemod: 2,
    price: 15000,
    requiredUpgr: "none",
  },
  {
    code: "solu18",
    name: "Solaris Urbino 18",
    clickmod: 0,
    incomemod: 4,
    price: 16000,
    requiredUpgr: "none",
  },
  {
    code: "solu24",
    name: "Solaris Urbino 24",
    clickmod: 4,
    incomemod: 0,
    price: 21000,
    requiredUpgr: "none",
  },
  {
    code: "manlion",
    name: "MAN Lion's City",
    clickmod: 6,
    incomemod: 0,
    price: 24000,
    requiredUpgr: "none",
  },
  {
    code: "solu12h",
    name: "Solaris Urbino 12 Hydrogen",
    clickmod: 7,
    incomemod: 0,
    price: 24500,
    requiredUpgr: "none",
  },
  {
    code: "jelczm121m",
    name: "Jelcz M121M",
    clickmod: 0,
    incomemod: 6,
    price: 25500,
    requiredUpgr: "none",
  },
  {
    code: "solu18h",
    name: "Solaris Urbino 18 Hydrogen",
    clickmod: 8,
    incomemod: 0,
    price: 27500,
    requiredUpgr: "none",
  },
  {
    code: "manlioncig",
    name: "MAN Lion's City GXL",
    clickmod: 8,
    incomemod: 4,
    price: 35000,
    requiredUpgr: "none",
  },
  {
    code: "vacanza12",
    name: "Solaris Vacanza 12",
    clickmod: 0,
    incomemod: 8,
    price: 40000,
    requiredUpgr: "none",
  },
  {
    code: "vacanza13",
    name: "Solaris Vacanza 13",
    clickmod: 10,
    incomemod: 8,
    price: 58000,
    requiredUpgr: "none",
  },
];

export const a20 = [
  {
    code: "mana20",
    name: "MAN A20",
    price: 0,
    incomemod: 0,
    clickmod: 1,
    requiredUpgr: "none",
  },
];

// table with maximum quantity of each busS
// TODO: it can be done better but idk how
export const busPrices = {
  [buses[0].code]: { price: buses[0].price, maxQuantity: 1000 },
  [buses[1].code]: { price: buses[1].price, maxQuantity: 1000 },
  [buses[2].code]: { price: buses[2].price, maxQuantity: 1000 },
  [buses[3].code]: { price: buses[3].price, maxQuantity: 1000 },
  [buses[4].code]: { price: buses[4].price, maxQuantity: 1000 },
  [buses[5].code]: { price: buses[5].price, maxQuantity: 1000 },
  [buses[6].code]: { price: buses[6].price, maxQuantity: 1000 },
  [buses[7].code]: { price: buses[7].price, maxQuantity: 1000 },
  [buses[8].code]: { price: buses[8].price, maxQuantity: 1000 },
  [buses[9].code]: { price: buses[9].price, maxQuantity: 1000 },
  [buses[10].code]: { price: buses[10].price, maxQuantity: 1000 },
  [buses[11].code]: { price: buses[11].price, maxQuantity: 1000 },
  [buses[12].code]: { price: buses[12].price, maxQuantity: 1000 },
  [buses[13].code]: { price: buses[13].price, maxQuantity: 1000 },
};
