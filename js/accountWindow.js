const accWindow = document.getElementById("accountbox");
const openWindowBtn = document.getElementById("nav-item-account-page");
const closeWindowBtn = document.getElementById("acc-menu-close-btn");

openWindowBtn.addEventListener(
  "click",
  function () {
    accWindow.style.display = "block";
  },
  false
);

closeWindowBtn.addEventListener(
  "click",
  function () {
    accWindow.style.display = "none";
  },
  false
);
