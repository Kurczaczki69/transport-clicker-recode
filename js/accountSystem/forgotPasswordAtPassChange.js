import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getAuth, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import { showMsg } from "../utilities.js";
import { banana } from "../langs.js";
import { playRandomMouseClick } from "../sounds.js";

const firebaseConfig = {
  apiKey: "AIzaSyAlr1B-qkg66Zqkr423UyFrNSLPmScZGIU",
  authDomain: "transport-clicker-f0d1c.firebaseapp.com",
  projectId: "transport-clicker-f0d1c",
  storageBucket: "transport-clicker-f0d1c.appspot.com",
  messagingSenderId: "177489808647",
  appId: "1:177489808647:web:b54aeae2843f31ba02c9a2",
  measurementId: "G-CP6HMGD0N1",
};

const app = initializeApp(firebaseConfig);

const forgotPassBtnAtPassChange = document.querySelector("#dont-remember-pass-link");

forgotPassBtnAtPassChange.addEventListener("click", (event) => {
  event.preventDefault();
  playRandomMouseClick();
  const auth = getAuth();
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
