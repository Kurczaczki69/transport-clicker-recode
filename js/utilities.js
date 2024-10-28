export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function isEmpty(value) {
  return value == null || (typeof value === "string" && value.trim().length === 0) || value == 0;
}

export function showMsg(message, divId) {
  var messageDiv = document.getElementById(divId);
  messageDiv.style.display = "block";
  messageDiv.innerHTML = message;
  messageDiv.style.opacity = 1;
  sleep(20000).then(() => {
    messageDiv.style.opacity = 0;
  });
}

export function clearMsg(divId) {
  var messageDiv = document.getElementById(divId);
  messageDiv.style.display = "none";
}
