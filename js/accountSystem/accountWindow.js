const accWindow = document.getElementById("accountbox");
const tint = document.querySelector("#window-tint");
const openWindowBtn = document.getElementById("nav-item-account-page");
const closeWindowBtn = document.getElementById("acc-menu-close-btn");

openWindowBtn.addEventListener("click", () => {
  tint.style.display = "block";
  accWindow.style.display = "block";
});

closeWindowBtn.addEventListener("click", () => {
  tint.style.display = "none";
  accWindow.style.display = "none";
});
