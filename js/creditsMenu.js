const creditsWindow = document.getElementById("credits-window");
const creditsBtn = document.getElementById("credits-btn");
const closeCreditsBtn = document.getElementById("close-credits-window-btn");

creditsBtn.addEventListener("click", () => {
  creditsWindow.style.display = "block";
});

closeCreditsBtn.addEventListener("click", () => {
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
