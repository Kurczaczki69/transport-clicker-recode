import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebaseManager.js";
import { showMsg } from "../utilities.js";
import { banana } from "../langs.js";
import { playRandomMouseClick } from "../sounds.js";

const isGamePage = window.location.pathname.includes("game.html");

if (isGamePage) {
  const forgotPassBtnAtPassChange = document.querySelector("#dont-remember-pass-link");

  forgotPassBtnAtPassChange.addEventListener("click", (event) => {
    event.preventDefault();
    playRandomMouseClick();
    const user = auth.currentUser;
    const email = user.email;
    sendPasswordResetEmail(auth, email)
      .then(() => {
        showMsg(banana.i18n("auth-password-reset-sent"), "input-msg-change-pass");
        console.log("password reset email sent");
      })
      .catch((error) => {
        const errorCode = error.code;
        if (errorCode === "auth/missing-email") {
          showMsg(banana.i18n("auth-missing-email"), "input-msg-change-pass");
          console.log(errorCode);
        } else if (errorCode === "auth/invalid-email") {
          showMsg(banana.i18n("auth-invalid-email"), "input-msg-change-pass");
        } else if (errorCode === "auth/requires-recent-login") {
          showMsg(banana.i18n("delete-acc-requires-recent-login"), "input-msg-change-pass");
        } else {
          showMsg(banana.i18n("error-occured"), "input-msg-change-pass");
          console.log(errorCode);
        }
      });
  });
}
