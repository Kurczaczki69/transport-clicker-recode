import { banana } from "./langs.js";

// simple sleep function so you dont have to use setTimeout, the parameter is the time in milliseconds
export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// checks if value of a variable is empty or is zero
export function isEmpty(value) {
  return value == null || (typeof value === "string" && value.trim().length === 0) || value == 0;
}

// shows message in div specified in parameter
export function showMsg(message, divId) {
  var messageDiv = document.getElementById(divId);
  messageDiv.style.display = "block";
  messageDiv.innerHTML = message;
  messageDiv.style.opacity = 1;
  sleep(1000 * 20).then(() => {
    messageDiv.style.opacity = 0;
  });
}

// clears message from div specified in parameter
export function clearMsg(divId) {
  var messageDiv = document.getElementById(divId);
  messageDiv.style.display = "none";
}

// shows alert window with message specified in parameter
export function showAlert(message) {
  const alertSpan = document.getElementById("alert-message");
  const alertWindow = document.getElementById("alert-window");
  const alertCloseBtn = document.getElementById("accept-alert-btn");
  const tint = document.querySelector("#alert-tint");

  tint.style.display = "block";
  alertSpan.innerText = message;
  alertWindow.style.display = "flex";

  alertCloseBtn.addEventListener("click", () => {
    tint.style.display = "none";
    alertWindow.style.display = "none";
    alertSpan.innerText = "";
  });
}

// abbreviates number to human readable format
export function abbreviateNumber(num) {
  const formatter = new Intl.NumberFormat(localStorage.getItem("lang"), {
    notation: "compact",
    compactDisplay: "short",
    maximumSignificantDigits: 4,
  });

  return formatter.format(num);
}

export function shortAbbreviateNumber(num) {
  const formatter = new Intl.NumberFormat(localStorage.getItem("lang"), {
    notation: "compact",
    compactDisplay: "short",
    maximumSignificantDigits: 3,
  });

  return formatter.format(num);
}

// formats time from milliseconds to human readable format
export function formatTime(ms) {
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));

  const formattedTime = [
    days > 0 ? `${days} ${banana.i18n("time-days")}` : "",
    hours > 0 ? `${hours} ${banana.i18n("time-hours")}` : "",
    minutes > 0 ? `${minutes} ${banana.i18n("time-minutes")}` : "",
    seconds > 0 ? `${seconds} ${banana.i18n("time-seconds")}` : "",
  ]
    .filter(Boolean)
    .join(" ");

  return formattedTime || `0 ${banana.i18n("time-seconds")}`;
}
