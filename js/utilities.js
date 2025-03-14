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
  var messageDiv = document.querySelector(`#${divId}`);
  messageDiv.style.display = "block";
  messageDiv.innerHTML = message;
  messageDiv.style.opacity = 1;
  sleep(1000 * 20).then(() => {
    messageDiv.style.opacity = 0;
  });
}

// clears message from div specified in parameter
export function clearMsg(divId) {
  var messageDiv = document.querySelector(`#${divId}`);
  messageDiv.style.display = "none";
}

// shows alert window with message specified in parameter
export function showAlert(message) {
  const alertSpan = document.querySelector("#alert-message");
  const alertWindow = document.querySelector("#alert-window");
  const alertCloseBtn = document.querySelector("#accept-alert-btn");
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

// abbreviates large numbers to human readable format
export function abbreviateNumber(num) {
  // suffixes for large numbers (keys for the language files)
  const suffixes = [
    "",
    "number-thousand",
    "number-million",
    "number-billion",
    "number-trillion",
    "number-quadrillion",
    "number-quintillion",
    "number-sextillion",
    "number-septillion",
    "number-octillion",
    "number-nonillion",
    "number-decillion",
  ];

  const lang = localStorage.getItem("lang") || "en";
  const roundedNum = Math.floor(num);

  // numbers less than one trillion use Intl.NumberFormat
  if (roundedNum < 1e12) {
    const formatter = new Intl.NumberFormat(lang, {
      notation: "compact",
      compactDisplay: "short",
      maximumFractionDigits: 2,
      minimumFractionDigits: 0,
    });
    return formatter.format(roundedNum);
  }

  // larger numbers use the custom suffixes from the language files
  const order = Math.floor(Math.log10(roundedNum) / 3);
  if (order >= suffixes.length) {
    return "∞";
  }

  const suffix = banana.i18n(suffixes[order]);
  const scaled = roundedNum / Math.pow(10, order * 3);

  // Use Intl.NumberFormat for locale-specific number formatting
  const formatter = new Intl.NumberFormat(lang, {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  });

  const formatted = formatter.format(scaled);

  return `${formatted} ${suffix}`;
}

export function shortAbbreviateNumber(num, location) {
  const bigNum = Math.floor(num);
  const lang = localStorage.getItem("lang") || "en";
  const formatter = new Intl.NumberFormat(lang, {
    notation: "compact",
    compactDisplay: "short",
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  });
  let formattedNum = formatter.format(bigNum);
  if (location == "vhcls") {
    return formattedNum;
  } else if (location == "upgrs" || location == "price") {
    if (num === 0) {
      return banana.i18n("free-indicator");
    } else {
      return formattedNum;
    }
  } else {
    return formattedNum;
  }
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

export function convertDecimalBoostToPercent(value) {
  if (value < 1) return "-" + (100 - value * 100).toFixed(0);
  else return "+" + (value * 100 - 100).toFixed(0);
}

export function convertDecimalToPercent(value) {
  return (value * 100).toFixed(0);
}
