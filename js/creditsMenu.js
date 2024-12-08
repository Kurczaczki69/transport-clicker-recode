const creditsWindow = document.getElementById("credits-window");
const creditsBtn = document.getElementById("credits-btn");
const closeCreditsBtn = document.getElementById("close-credits-window-btn");

creditsBtn.addEventListener("click", () => {
  creditsWindow.style.display = "block";
});

closeCreditsBtn.addEventListener("click", () => {
  creditsWindow.style.display = "none";
});
