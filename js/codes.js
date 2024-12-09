// elements

const codesMenu = document.getElementById("codes-menu");
const closeGuiBtn = document.getElementById("close-codes-gui-btn");
const openGuiBtn = document.getElementById("nav-item-codes-menu");

// listeners

openGuiBtn.addEventListener("click", () => {
  codesMenu.style.display = "block";
});

closeGuiBtn.addEventListener("click", () => {
  codesMenu.style.display = "none";
});
