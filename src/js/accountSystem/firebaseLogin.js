import { signInWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth } from "../firebaseManager.js";
import { showMsg, getI18n } from "../utilities.js";

const loginBtn = document.querySelector("#login-btn");
if (loginBtn) {
  loginBtn.addEventListener("click", (event) => {
    console.log("btn clicked");
    event.preventDefault();
    const email = document.querySelector("#email-input-login").value;
    const password = document.querySelector("#password-input-login").value;

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        if (auth.currentUser.emailVerified) {
          console.log("login successful");
          showMsg(getI18n("auth-login-success"), "errorMsgLogin");
          const user = userCredential.user;
          localStorage.setItem("loggedInUserId", user.uid);
          localStorage.setItem("loggedIn", true);
          window.location.href = "game.html";
        } else {
          showMsg(
            getI18n("auth-login-verify-email", "<br>", "<span id='send-verification-again'>", "</span>"),
            "errorMsgLogin"
          );
          const sendVerificationBtn = document.querySelector("#send-verification-again");
          sendVerificationBtn.addEventListener("click", () => {
            sendEmailVerification(auth.currentUser)
              .then(() => {
                showMsg(getI18n("auth-verification-email-sent"), "errorMsgLogin");
              })
              .catch((error) => {
                console.log(error);
                console.log(error.code);
                showMsg(getI18n("error-occured"), "errorMsgLogin");
              });
          });
        }
      })
      .catch((error) => {
        const errorCode = error.code;
        if (errorCode === "auth/invalid-credential") {
          console.log("invalid credential");
          showMsg(getI18n("auth-login-invalid-credentials"), "errorMsgLogin");
        } else if (errorCode === "auth/user-disabled") {
          showMsg(getI18n("auth-login-account-banned"), "errorMsgLogin");
        } else if (errorCode === "auth/invalid-email") {
          showMsg(getI18n("auth-invalid-email"), "errorMsgLogin");
        } else if (errorCode === "auth/unverified-email") {
          showMsg(
            getI18n("auth-login-verify-email", "<br>", "<span id='send-verification-again'>", "</span>"),
            "errorMsgLogin"
          );
        } else if (errorCode === "auth/missing-password") {
          showMsg(getI18n("auth-login-missing-password"), "errorMsgLogin");
        } else if (errorCode === "auth/too-many-requests") {
          showMsg(getI18n("auth-login-too-many-requests"), "errorMsgLogin");
        } else {
          console.log("login failed");
          showMsg(getI18n("error-occured"), "errorMsgLogin");
          console.log(error);
          console.log(error.code);
        }
      });
  });
}
