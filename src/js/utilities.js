import anime from "animejs";
import { banana } from "./langs.js";
import { playRandomMouseClick } from "./sounds.js";

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
  const messageDiv = document.querySelector(`#${divId}`);
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

  const newCloseBtn = alertCloseBtn.cloneNode(true);
  alertCloseBtn.parentNode.replaceChild(newCloseBtn, alertCloseBtn);

  tint.style.display = "block";
  alertSpan.textContent = message;
  alertWindow.style.display = "flex";
  animateWindowOpen(alertWindow, true, tint);

  const closeTimeout = setTimeout(() => {
    animateWindowClose(alertWindow, true, tint);
    setTimeout(() => {
      alertSpan.textContent = "";
    }, 250);
  }, 10000);

  newCloseBtn.addEventListener("click", () => {
    clearTimeout(closeTimeout);
    playRandomMouseClick();
    animateWindowClose(alertWindow, true, tint);
    setTimeout(() => {
      alertSpan.innerText = "";
    }, 250);
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
  const roundedNum = Math.round(num);

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

  const suffix = getI18n(suffixes[order]);
  const scaled = roundedNum / Math.pow(10, order * 3);

  // Use Intl.NumberFormat for locale-specific number formatting
  const formatter = new Intl.NumberFormat(lang, {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  });

  const formatted = formatter.format(scaled);

  return `${formatted}${suffix}`;
}

// abbreviates large numbers to human readable format
// but in a shorter format(use this for prices and other things that logically should be short)
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
      return getI18n("free-indicator");
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
    days > 0 ? `${days} ${getI18n("time-days")}` : "",
    hours > 0 ? `${hours} ${getI18n("time-hours")}` : "",
    minutes > 0 ? `${minutes} ${getI18n("time-minutes")}` : "",
    seconds > 0 ? `${seconds} ${getI18n("time-seconds")}` : "",
  ]
    .filter(Boolean)
    .join(" ");

  return formattedTime || `0 ${getI18n("time-seconds")}`;
}

let defaultTranslations = {};

fetch("dist/lang/en.json")
  .then((response) => response.json())
  .then((messages) => {
    defaultTranslations = messages;
  });

let translation = "";

/**
 * @function getI18n
 * @description Gets a translation from the current language's dictionary.
 * If the translation doesn't exist, it will default to the english translation.
 * @param {string} key The key of the translation to get.
 * @param {string} [val1] An optional value to replace placeholders in the translation.
 * @param {string} [val2] An optional value to replace placeholders in the translation.
 * @param {string} [val3] An optional value to replace placeholders in the translation.
 * @returns {string} The translated string.
 */
export function getI18n(key, val1, val2, val3) {
  translation = "";
  if (!key) return key;
  translation = banana.i18n(key, val1, val2, val3);
  if (!translation || translation == "") {
    banana.setLocale("en");
    translation = banana.i18n(key, val1, val2, val3);
    banana.setLocale(localStorage.getItem("lang") || "en");
  }
  return translation;
}

// converts decimal number to percentage in income boosts etc. (so 0.5 becomes -50 and 1.5 becomes +50)
//  (the percent sign is added in the language files)
export function convertDecimalBoostToPercent(value) {
  if (value < 1) return "-" + (100 - value * 100).toFixed(0);
  else return "+" + (value * 100 - 100).toFixed(0);
}

// regular percentage conversion (0.5 becomes 50)
//  (the percent sign is added in the language files)
export function convertDecimalToPercent(value) {
  return (value * 100).toFixed(0);
}

// animates a window opening
// element - the element you wanna animate
// isTint - if you want a tint to appear behind the window
// tint - the tint element
export function animateWindowOpen(element, isTint, tint) {
  const isLowPerf = localStorage.getItem("lowPerfPreference") || "off";
  if (isTint) {
    tint.style.display = "block";
    if (isLowPerf === "on") {
      tint.style.opacity = 1;
    } else {
      anime({
        targets: [tint],
        opacity: [0, 1],
        duration: 200,
        easing: "easeOutCubic",
      });
    }
  }

  element.style.opacity = 0;
  element.style.transform = "translate(-50%, -50%) scale(0.8)";

  if (isLowPerf === "on") {
    element.style.opacity = 1;
    element.style.transform = "translate(-50%, -50%) scale(1)";
  } else {
    anime({
      targets: [element],
      opacity: [0, 1],
      scale: [0.8, 1],
      duration: 150,
      easing: "easeOutCubic",
    });
  }
}

// animates a window closing
// element - the element you wanna animate
// isTint - if you want a tint to disappear behind the window
// tint - the tint element
export function animateWindowClose(element, isTint, tint) {
  const isLowPerf = localStorage.getItem("lowPerfPreference") || "off";
  if (isTint) {
    if (isLowPerf === "on") {
      tint.style.opacity = 0;
    } else {
      anime({
        targets: [tint],
        opacity: [1, 0],
        duration: 200,
        easing: "easeInCubic",
      });
    }
  }
  if (isLowPerf === "on") {
    element.style.display = "none";
    element.style.opacity = 0;
    element.style.transform = "translate(-50%, -50%) scale(0.8)";
    if (isTint) {
      tint.style.display = "none";
    }
  } else {
    anime({
      targets: element,
      opacity: [1, 0],
      scale: [1, 0.8],
      duration: 150,
      easing: "easeInCubic",
      complete: () => {
        element.style.display = "none";
        if (isTint) {
          tint.style.display = "none";
        }
      },
    });
  }
}

// animates an element appearing
// el - the element you wanna animate
// display - the css display property of the element
export function animateAppear(el, display) {
  el.style.opacity = 0;
  if (!display) {
    el.style.display = "block";
  } else {
    el.style.display = display;
  }
  anime({
    targets: el,
    opacity: 1,
    duration: 125,
    easing: "easeInOutQuad",
  });
}

// animates an element disappearing
// el - the element you wanna animate
export function animateDisappear(el) {
  el.style.opacity = 1;
  anime({
    targets: el,
    opacity: 0,
    duration: 125,
    easing: "easeInOutQuad",
    complete: () => {
      el.style.display = "none";
    },
  });
}
