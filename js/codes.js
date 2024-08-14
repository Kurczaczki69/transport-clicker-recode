// elements

const codesMenu = document.getElementById("codes-menu");
const closeGuiBtn = document.getElementById("close-codes-gui-btn");
const openGuiBtn = document.getElementById("nav-item-codes-menu");

// listeners

openGuiBtn.addEventListener("click", openGui, false);
closeGuiBtn.addEventListener("click", closeGui, false);

function openGui() {
    codesMenu.style.display = "block";
}

function closeGui() {
    codesMenu.style.display = "none";
}