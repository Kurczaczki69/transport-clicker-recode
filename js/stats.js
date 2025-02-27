import { getVhcls } from "./data/vhclData.js";
import { getVhclAmounts } from "./scr.js";
import { abbreviateNumber } from "./utilities.js";

const statsTable = document.querySelector("#vhcl-stats-table");

export function displayStats() {
  const vhcls = getVhcls();
  const vhclAmounts = getVhclAmounts();

  vhcls.forEach((vhcl) => {
    const row = document.createElement("tr");

    const nameCell = document.createElement("td");
    nameCell.textContent = vhcl.name;
    row.appendChild(nameCell);

    const amountCell = document.createElement("td");
    amountCell.textContent = abbreviateNumber(vhclAmounts[vhcl.code] || 0);
    row.appendChild(amountCell);

    statsTable.appendChild(row);
  });
}
