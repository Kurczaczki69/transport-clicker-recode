import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebaseManager.js";
import { showMsg, getI18n } from "../utilities.js";
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
        showMsg(getI18n("auth-password-reset-sent"), "input-msg-change-pass");
        console.log("password reset email sent");
      })
      .catch((error) => {
        const errorCode = error.code;
        if (errorCode === "auth/missing-email") {
          showMsg(getI18n("auth-missing-email"), "input-msg-change-pass");
          console.log(errorCode);
        } else if (errorCode === "auth/invalid-email") {
          showMsg(getI18n("auth-invalid-email"), "input-msg-change-pass");
        } else if (errorCode === "auth/requires-recent-login") {
          showMsg(getI18n("delete-acc-requires-recent-login"), "input-msg-change-pass");
        } else {
          showMsg(getI18n("error-occured"), "input-msg-change-pass");
          console.log(errorCode);
        }
      });
  });
}
