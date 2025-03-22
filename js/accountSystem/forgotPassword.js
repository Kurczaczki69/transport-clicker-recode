import { sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import { auth } from "../firebaseManager.js";
import { showMsg } from "../utilities.js";
import { banana } from "../langs.js";

const forgotPassBtn = document.querySelector("#forgot-pass-link");

forgotPassBtn.addEventListener("click", (event) => {
  event.preventDefault();
  const email = document.querySelector("#email-input-login").value;
  sendPasswordResetEmail(auth, email)
    .then(() => {
      showMsg(banana.i18n("auth-password-reset-sent"), "errorMsgLogin");
      console.log("password reset email sent");
    })
    .catch((error) => {
      const errorCode = error.code;
      if (errorCode === "auth/missing-email") {
        showMsg(banana.i18n("auth-missing-email"), "errorMsgLogin");
        console.log(errorCode);
      } else if (errorCode === "auth/invalid-email") {
        showMsg(banana.i18n("auth-invalid-email"), "errorMsgLogin");
      } else if (errorCode === "auth/requires-recent-login") {
        showMsg(banana.i18n("delete-acc-requires-recent-login"), "errorMsgLogin");
      } else {
        showMsg(banana.i18n("error-occured"), "errorMsgLogin");
        console.log(errorCode);
      }
    });
});
