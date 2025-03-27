import favicon from "../img/logo/favicon.ico";

document.addEventListener("DOMContentLoaded", () => {
  const link = document.createElement("link");
  link.rel = "icon";
  link.type = "image/x-icon";
  link.href = favicon;
  document.head.appendChild(link);
});
