import { getVhcls } from "./data/vhclData.js";
import { getVhclAmounts, getVhclStats } from "./scr.js";
import { abbreviateNumber } from "./utilities.js";
import { banana } from "./langs.js";

const statsTable = document.querySelector("#vhcl-stats-table");

export function displayStats() {
  const vhcls = getVhcls();
  const vhclAmounts = getVhclAmounts();
  const vhclStats = getVhclStats();

  statsTable.innerHTML = "";

  const headerRow = document.createElement("tr");

  const nameHeader = document.createElement("th");
  nameHeader.textContent = banana.i18n("vhcl-stats-name");
  headerRow.appendChild(nameHeader);

  const amountHeader = document.createElement("th");
  amountHeader.textContent = banana.i18n("vhcl-stats-amount");
  headerRow.appendChild(amountHeader);

  const incomeHeader = document.createElement("th");
  incomeHeader.textContent = banana.i18n("vhcl-stats-income");
  headerRow.appendChild(incomeHeader);

  const clickmodHeader = document.createElement("th");
  clickmodHeader.textContent = banana.i18n("vhcl-stats-clickmod");
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

    const incomeCell = document.createElement("td");
    incomeCell.textContent = abbreviateNumber(vhclStats[vhcl.code]?.income || 0);
    row.appendChild(incomeCell);

    const clickmodCell = document.createElement("td");
    clickmodCell.textContent = abbreviateNumber(vhclStats[vhcl.code]?.clickmod || 0);
    row.appendChild(clickmodCell);

    statsTable.appendChild(row);
  });
}
