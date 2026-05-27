import { getVhcls, DEFAULT_CAPACITY } from "./data/vhclData.js";
import { getVhclAmounts, saveGame } from "./scr.js";
import { animateWindowOpen, animateWindowClose } from "./utilities.js";
import { playRandomMouseClick } from "./sounds.js";
import { getI18n, showAlert } from "./utilities.js";

const DEFAULT_FARE_PER_PAX = 2.5; // Constant baseline for calculations
let currentFarePerPax = 2.5; // User's current fare setting

export function getFarePerPax() {
    return currentFarePerPax;
}

export function setFarePerPax(newFare) {
    if (typeof newFare === "number" && newFare > 0) {
        currentFarePerPax = Math.round(newFare * 100) / 100;
        return true;
    }
    return false;
}

export function calculateTotalCapacity() {
    const vhcls = getVhcls();
    const vhclAmounts = getVhclAmounts();
    let totalCapacity = 0;
    Object.entries(vhclAmounts).forEach(([code, amount]) => {
        const vehicle = vhcls.find(v => v.code === code);
        // console.log("Vehicle:", vehicle, "Code:", code, "Amount:", amount);
        if (vehicle) {
            totalCapacity += (vehicle.capacity || DEFAULT_CAPACITY) * (amount || 0);
        }
    });
    return totalCapacity;
}

export function calculateSpawnRateBasedOnFares(farePerPax) {
    const fare = typeof farePerPax === "number" ? farePerPax : currentFarePerPax;
    const totalCapacity = calculateTotalCapacity();
    if (!totalCapacity || totalCapacity <= 0) return 0;

    // this is pasted straight from chatgpt 😔

    // base passengers spawned per second = seats * baseSpawnPerSeatPerSec
    // e.g. 0.005 => 0.5% of total seats per second
    const baseSpawnPerSeatPerSec = 0.005;
    const baseSpawn = totalCapacity * baseSpawnPerSeatPerSec;

    // fare effect: exponential decay so higher fare quickly reduces spawn rate
    // sensitivity controls how strongly fare affects spawning (larger => stronger reduction)
    const sensitivity = 1.0;

    // use ratio to default fare (avoid division by zero)
    const ratio = Math.max(fare / DEFAULT_FARE_PER_PAX, 0.01);

    // multiplier decreases when ratio > 1, increases when ratio < 1
    const multiplier = Math.exp(-sensitivity * (ratio - 1));

    // final spawn rate (passengers per second)
    const spawnRate = baseSpawn * multiplier;

    // clamp to reasonable bounds
    const maxMultiplier = 5; // optional: cap growth for very low fares
    const minSpawn = 0;
    const finalSpawn = Math.max(minSpawn, Math.min(baseSpawn * maxMultiplier, spawnRate));

    // console.log(`Fare: $${fare.toFixed(2)}, Ratio: ${ratio.toFixed(2)}, Multiplier: ${multiplier.toFixed(3)}, Spawn Rate: ${finalSpawn.toFixed(2)} pax/sec`);
    return finalSpawn;
}


const isGamePage = window.location.pathname.endsWith("game.html");
const budgetWindow = document.querySelector("#budgeting-window");
const tint = document.querySelector("#window-tint");

const openBtn = document.querySelector("#nav-item-budget-menu");
const closeBtn = document.querySelector("#budgeting-menu-close-btn");

if (isGamePage) {
  openBtn.addEventListener("click", () => {
    playRandomMouseClick();
    budgetWindow.style.display = "block";
    animateWindowOpen(budgetWindow, true, tint);
    displayCurrentFare();
  });

  closeBtn.addEventListener("click", () => {
    playRandomMouseClick();
    animateWindowClose(budgetWindow, true, tint);
  });

  // Fare change handlers
  const fareInput = document.querySelector("#budget-fare-global-input");
  const fareConfirmBtn = document.querySelector("#budget-global-fare-confirm-btn");

  if (fareInput && fareConfirmBtn) {
    fareConfirmBtn.addEventListener("click", () => {
      playRandomMouseClick();
      const newFare = parseFloat(fareInput.value);
      
      if (isNaN(newFare) || newFare <= 0) {
        showAlert(getI18n("budget-fare-invalid"));
        return;
      }

      if (setFarePerPax(newFare)) {
        showAlert(getI18n("budget-fare-changed", newFare.toFixed(2)));
        fareInput.value = "";
        displayCurrentFare();
        saveGame(true);
      }
    });

    // Allow Enter key to confirm
    fareInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        fareConfirmBtn.click();
      }
    });
  }
}

function displayCurrentFare() {
  const fareInput = document.querySelector("#budget-fare-global-input");
  if (fareInput) {
    fareInput.placeholder = `$${currentFarePerPax.toFixed(2)}`;
  }
}
