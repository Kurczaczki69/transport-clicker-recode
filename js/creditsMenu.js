const creditsWindow = document.getElementById("credits-window");
const tint = document.querySelector("#window-tint");
const creditsBtn = document.getElementById("credits-btn");
const closeCreditsBtn = document.getElementById("close-credits-window-btn");

creditsBtn.addEventListener("click", () => {
  tint.style.display = "block";
  creditsWindow.style.display = "block";
});

closeCreditsBtn.addEventListener("click", () => {
  tint.style.display = "none";
  creditsWindow.style.display = "none";
});

// switching categories in credits menu

const contributorsBtn = document.getElementById("credits-menu-authors-btn");
const translatorsBtn = document.getElementById("credits-menu-translators-btn");

contributorsBtn.addEventListener("click", () => {
  document.getElementById("credits-menu-authors-section").style.display = "block";
  document.getElementById("credits-menu-translators-section").style.display = "none";
});

translatorsBtn.addEventListener("click", () => {
  document.getElementById("credits-menu-authors-section").style.display = "none";
  document.getElementById("credits-menu-translators-section").style.display = "block";
});
