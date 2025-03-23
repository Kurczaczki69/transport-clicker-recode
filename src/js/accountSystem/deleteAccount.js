import { deleteUser, signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebaseManager.js";
import { deleteDoc, doc } from "firebase/firestore";
import { showMsg, animateAppear, animateDisappear } from "../utilities.js";
import { banana } from "../langs.js";
import { playRandomMouseClick } from "../sounds.js";

const isGamePage = window.location.pathname.includes("game.html");

if (isGamePage) {
  // showing the window and hiding it
  const accDelBtn = document.getElementById("delete-account-btn");
  const cancelBtn = document.getElementById("are-you-sure-cancel-btn");

  const passWrapper = document.querySelector("#changePassWrapper");
  const areYouSureWrapper = document.querySelector("#areYouSureWrapper");

  if (accDelBtn) {
    accDelBtn.addEventListener("click", () => {
      playRandomMouseClick();
      animateAppear(areYouSureWrapper);
      animateDisappear(passWrapper);
    });
  }

  if (cancelBtn) {
    cancelBtn.addEventListener("click", () => {
      playRandomMouseClick();
      animateDisappear(areYouSureWrapper);
    });
  }

  // account deletion
  const confirmBtn = document.getElementById("are-you-sure-confirm-btn");

  confirmBtn.addEventListener("click", async (event) => {
    event.preventDefault();
    playRandomMouseClick();
    const user = auth.currentUser;
    const password = document.getElementById("are-you-sure-pass-input").value;
    const email = user.email;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("authentication success");

      await deleteDoc(doc(db, "users", user.uid));
      console.log("user data deleted successfully");

      await deleteUser(user);
      localStorage.setItem("loggedIn", false);
      localStorage.removeItem("loggedInUserId");
      localStorage.removeItem("previousLevel");
      window.alert(banana.i18n("delete-acc-success"));
      window.location.href = "index.html";
      console.log("account deleted successfully");
    } catch (error) {
      const errorCode = error.code;
      if (errorCode === "auth/invalid-credential") {
        showMsg(banana.i18n("wrong-password"), "input-msg");
        console.error("deletion unsuccesful - wrong password");
      } else if (errorCode === "auth/requires-recent-login") {
        showMsg(banana.i18n("delete-account-requires-recent-login"), "input-msg");
      } else if (errorCode === "auth/missing-password") {
        showMsg(banana.i18n("auth-login-missing-password"), "input-msg");
        console.log(errorCode);
      } else {
        showMsg(banana.i18n("error-occured"), "input-msg");
        console.error("deletion unsuccesful - error:", error);
        console.log(errorCode);
      }
    }
  });
}
