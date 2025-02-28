import { getVhcls } from "./data/vhclData.js";
import { getVhclAmounts } from "./scr.js";
import { abbreviateNumber } from "./utilities.js";
import { banana } from "./langs.js";

const statsTable = document.querySelector("#vhcl-stats-table");

export function displayStats() {
  const vhcls = getVhcls();
  const vhclAmounts = getVhclAmounts();

  statsTable.innerHTML = "";

  const headerRow = document.createElement("tr");

  const nameHeader = document.createElement("th");
  nameHeader.textContent = banana.i18n("vhcl-stats-name");
  headerRow.appendChild(nameHeader);

  const amountHeader = document.createElement("th");
  amountHeader.textContent = banana.i18n("vhcl-stats-amount");
  headerRow.appendChild(amountHeader);

  statsTable.appendChild(headerRow);

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
