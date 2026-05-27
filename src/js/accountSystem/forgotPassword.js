import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebaseManager.js";
import { showMsg, getI18n } from "../utilities.js";

const forgotPassBtn = document.querySelector("#forgot-pass-link");

if (forgotPassBtn) {
  forgotPassBtn.addEventListener("click", (event) => {
    event.preventDefault();
    const email = document.querySelector("#email-input-login").value;
    sendPasswordResetEmail(auth, email)
      .then(() => {
        showMsg(getI18n("auth-password-reset-sent"), "errorMsgLogin");
        console.log("password reset email sent");
      })
      .catch((error) => {
        const errorCode = error.code;
        if (errorCode === "auth/missing-email") {
          showMsg(getI18n("auth-missing-email"), "errorMsgLogin");
          console.log(errorCode);
        } else if (errorCode === "auth/invalid-email") {
          showMsg(getI18n("auth-invalid-email"), "errorMsgLogin");
        } else if (errorCode === "auth/requires-recent-login") {
          showMsg(getI18n("delete-acc-requires-recent-login"), "errorMsgLogin");
        } else {
          showMsg(getI18n("error-occured"), "errorMsgLogin");
          console.log(errorCode);
        }
      });
  });
}
