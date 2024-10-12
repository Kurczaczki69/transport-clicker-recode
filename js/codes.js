// elements

const codesMenu = document.getElementById("codes-menu");
const closeGuiBtn = document.getElementById("close-codes-gui-btn");
const openGuiBtn = document.getElementById("nav-item-codes-menu");

// listeners

openGuiBtn.addEventListener(
  "click",
  function () {
    codesMenu.style.display = "block";
  },
  false
);
closeGuiBtn.addEventListener(
  "click",
  function () {
    codesMenu.style.display = "none";
  },
  false
);
