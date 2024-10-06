const changePassBtn = document.getElementById("change-pass-btn");
const oldPassInput = document.getElementById("change-pass-old-input");
const newPassInput = document.getElementById("change-pass-new-input");
const cancelBtn = document.getElementById("change-pass-cancel-btn");
const confirmBtn = document.getElementById("change-pass-confirm-btn");

changePassBtn.addEventListener("click", () => {
  document.getElementById("changePassWrapper").style.display = "block";
});

cancelBtn.addEventListener("click", () => {
  document.getElementById("changePassWrapper").style.display = "none";
});

confirmBtn.addEventListener("click", (event) => {
  event.preventDefault();
  const oldPass = oldPassInput.value;
  const newPass = newPassInput.value;
  if (isEmpty(oldPass) || isEmpty(newPass)) {
    showMsg("Musisz wypełnić oba pola!", "input-msg-change-pass");
  } else {
    showMsg("Hasło zostało zmienione pomyślnie!", "input-msg-change-pass");
  }
});

function isEmpty(str) {
  return !str.trim().length;
}

function showMsg(message, divId) {
  var messageDiv = document.getElementById(divId);
  messageDiv.style.display = "block";
  messageDiv.innerHTML = message;
  messageDiv.style.opacity = 1;
  setTimeout(function () {
    messageDiv.style.opacity = 1;
  }, 5000);
}
