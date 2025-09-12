import { getVhcls, DEFAULT_CAPACITY } from "./data/vhclData.js";
import { getVhclAmounts } from "./scr.js";

let defaultFarePerPax = 2.5;

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
    const fare = typeof farePerPax === "number" ? farePerPax : defaultFarePerPax;
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
    const ratio = Math.max(fare / defaultFarePerPax, 0.01);

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