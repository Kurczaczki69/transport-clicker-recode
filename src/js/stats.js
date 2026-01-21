import { getVhcls } from "./data/vhclData.js";
import { getVhclAmounts, getVhclStats } from "./scr.js";
import { abbreviateNumber, getI18n } from "./utilities.js";

const statsTable = document.querySelector("#vhcl-stats-table");

export function displayStats() {
  const vhcls = getVhcls();
  const vhclAmounts = getVhclAmounts();
  const vhclStats = getVhclStats();

  statsTable.innerHTML = "";

  const headerRow = document.createElement("tr");

  const nameHeader = document.createElement("th");
  nameHeader.textContent = getI18n("vhcl-stats-name");
  headerRow.appendChild(nameHeader);

  const amountHeader = document.createElement("th");
  amountHeader.textContent = getI18n("vhcl-stats-amount");
  headerRow.appendChild(amountHeader);

  const clickmodHeader = document.createElement("th");
  clickmodHeader.textContent = getI18n("vhcl-stats-clickmod");
  headerRow.appendChild(clickmodHeader);

  statsTable.appendChild(headerRow);

  vhcls.forEach((vhcl) => {
    const row = document.createElement("tr");

    const nameCell = document.createElement("td");
    nameCell.textContent = vhcl.name;
    row.appendChild(nameCell);

    const amountCell = document.createElement("td");
    amountCell.textContent = abbreviateNumber(vhclAmounts[vhcl.code] || 0);
    row.appendChild(amountCell);

    const clickmodCell = document.createElement("td");
    clickmodCell.textContent = abbreviateNumber(vhclStats[vhcl.code]?.clickmod || 0);
    row.appendChild(clickmodCell);

    statsTable.appendChild(row);
  });
}
