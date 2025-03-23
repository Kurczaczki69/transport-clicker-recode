import { onAuthStateChanged, signOut } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import { auth, db } from "../firebaseManager.js";
import { banana } from "../langs.js";
import { playRandomMouseClick } from "../sounds.js";

const isGamePage = window.location.pathname.includes("game.html");

if (isGamePage) {
  onAuthStateChanged(auth, (user) => {
    const loggedInUserId = localStorage.getItem("loggedInUserId");
    if (loggedInUserId) {
      const docRef = doc(db, "users", loggedInUserId);
      getDoc(docRef)
        .then((docSnap) => {
          if (docSnap.exists()) {
            const userData = docSnap.data();
            document.getElementById("accName").innerText = userData.username;
            document.getElementById("accEmail").innerText = userData.email;
          } else {
            console.log("no document found matching id");
          }
        })
        .catch((error) => {
          console.log("error getting document", error);
        });
    } else {
      const accWindow = document.getElementById("accountbox");
      accWindow.innerHTML = banana.i18n(
        "acc-not-logged-in",
        "<h2 id='accWelcome'>",
        "</h2><br><div id='acc-btn-wrapper'><a href='index.html'><button id='gotologin-btn' class='btns-acc-window'>",
        "</button></a></div>"
      );
      console.log("User Id not found in local storage");
      window.location.href = "index.html";
    }
  });

  const logOutBtn = document.getElementById("logout-btn");
  logOutBtn.addEventListener("click", () => {
    playRandomMouseClick();
    localStorage.removeItem("loggedInUserId");
    localStorage.removeItem("previousLevel");
    localStorage.removeItem("activeTimedUpgrades");
    localStorage.removeItem("activeEvents");
    localStorage.removeItem("soundPreference");
    localStorage.setItem("loggedIn", false);
    signOut(auth)
      .then(() => {
        window.location.href = "index.html";
      })
      .catch((error) => {
        console.error("error signing out", error);
      });
  });
}
