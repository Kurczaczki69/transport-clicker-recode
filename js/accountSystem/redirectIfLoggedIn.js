document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("loggedIn") === "true") {
    window.location.href = "game.html";
  } else {
    window.location.href = "index.html";
  }
});
