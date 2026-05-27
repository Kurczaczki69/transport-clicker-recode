document.addEventListener("DOMContentLoaded", () => {
  if (
    localStorage.getItem("loggedIn") === "true" &&
    (window.location.pathname.includes("index.html") || window.location.pathname.includes("register.html"))
  ) {
    window.location.href = "game.html";
  }
});
