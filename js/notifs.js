let notifCount = 0;

export function showNotif(title, smalltext, type) {
  // creating notification text elements
  const notifTitle = document.createElement("span");
  const notifSmallText = document.createElement("span");
  const notifBtnWrapper = document.createElement("div");
  const notifBtnIcon = document.createElement("span");
  notifTitle.classList.add("notif-text");
  notifSmallText.classList.add("notif-small-text");
  notifBtnWrapper.classList.add("notif-close-btn");
  notifBtnIcon.classList.add("tabler--x");
  notifTitle.textContent = title;
  notifSmallText.textContent = smalltext;

  // creating main notification container
  const notif = document.createElement("div");
  notif.classList.add("notif");
  notif.classList.add(type);
  notif.id = "notif" + notifCount;
  notifCount++;

  // appending everything together
  notifBtnWrapper.appendChild(notifBtnIcon);
  notif.appendChild(notifBtnWrapper);
  notif.appendChild(notifTitle);
  notif.appendChild(notifSmallText);
  document.querySelector("#notif-wrapper").appendChild(notif);

  // showing notif display
  const notifDisplay = document.querySelector("#notif-display");
  notifDisplay.style.display = "block";

  const notifCloseBtns = document.querySelectorAll(".notif-close-btn");
  notifCloseBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      removeNotif(btn.parentElement.id);
    });
  });
}

export function removeNotif(id) {
  document.getElementById(id).remove();
  notifCount--;
  if (document.querySelectorAll(".notif").length === 0) {
    const notifDisplay = document.querySelector("#notif-display");
    notifDisplay.style.display = "none";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  if (document.querySelectorAll(".notif").length === 0) {
    const notifDisplay = document.querySelector("#notif-display");
    notifDisplay.style.display = "none";
  }

  const notifCloseBtns = document.querySelectorAll(".notif-close-btn");

  notifCloseBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      removeNotif(btn.parentElement.id);
    });
  });
});
