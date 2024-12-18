const accWindow = document.getElementById("accountbox");
const openWindowBtn = document.getElementById("nav-item-account-page");
const closeWindowBtn = document.getElementById("acc-menu-close-btn");

openWindowBtn.addEventListener("click", () => {
  accWindow.style.display = "block";
});

closeWindowBtn.addEventListener("click", () => {
  accWindow.style.display = "none";
});
