export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function isEmpty(value) {
  // also checks for zero
  return value == null || (typeof value === "string" && value.trim().length === 0) || value == 0;
}

export function showMsg(message, divId) {
  var messageDiv = document.getElementById(divId);
  messageDiv.style.display = "block";
  messageDiv.innerHTML = message;
  messageDiv.style.opacity = 1;
  sleep(1000 * 20).then(() => {
    messageDiv.style.opacity = 0;
  });
}

export function clearMsg(divId) {
  var messageDiv = document.getElementById(divId);
  messageDiv.style.display = "none";
}

export function showAlert(message) {
  const alertSpan = document.getElementById("alert-message");
  const alertWindow = document.getElementById("alert-window");
  const alertCloseBtn = document.getElementById("accept-alert-btn");
  alertSpan.innerText = message;
  alertWindow.style.display = "flex";

  alertCloseBtn.addEventListener(
    "click",
    () => {
      alertWindow.style.display = "none";
      alertSpan.innerText = "";
    },
    false
  );
}

export function abbreviateNumber(num) {
  // Create a new Intl.NumberFormat object with options
  const formatter = new Intl.NumberFormat("en", {
    notation: "compact",
    compactDisplay: "short",
    maximumSignificantDigits: 4,
  });

  // Format the number and return the result
  return formatter.format(num);
}
