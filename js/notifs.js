let notifCount = 0;

export function getNotifCount() {
  return notifCount;
}

export function showNotif(title, smalltext, type) {
  // creating notification text elements
  const notifTitle = document.createElement("span");
  const notifSmallText = document.createElement("span");
  const notifBtnWrapper = document.createElement("div");
  const notifBtnIcon = document.createElement("span");
  notifTitle.classList.add("notif-text");
  notifSmallText.classList.add("notif-small-text");
  notifTitle.textContent = title;
  notifSmallText.textContent = smalltext;
  if (!type === "notif-timed-upgr") {
    notifBtnWrapper.classList.add("notif-close-btn");
    notifBtnIcon.classList.add("tabler--x");
  }

  // creating main notification container
  const notif = document.createElement("div");
  notif.classList.add("notif");
  notif.classList.add(type);
  notif.id = "notif" + notifCount;
  notifCount++;
  if (type === "notif-timed-upgr") {
    notifSmallText.id = "notif-small-text" + notifCount;
    notifTitle.id = "notif-title" + notifCount;
  }

  // appending everything together
  notif.appendChild(notifTitle);
  notif.appendChild(notifSmallText);
  document.querySelector("#notif-wrapper").appendChild(notif);
  if (!type === "notif-timed-upgr") {
    notifBtnWrapper.appendChild(notifBtnIcon);
    notif.appendChild(notifBtnWrapper);
  }

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

export function updateTimedUpgrNotif(notif) {
  const notifEl = document.getElementById(notif.id);
  notifEl.querySelector(".notif-small-text").textContent = notif.text;
}

const isGamePage = window.location.pathname.endsWith("game.html");

if (isGamePage) {
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
}
