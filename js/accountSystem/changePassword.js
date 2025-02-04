import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  updatePassword,
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import { showMsg } from "../utilities.js";
import { banana } from "../langs.js";

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

const changePassBtn = document.getElementById("change-pass-btn");
const oldPassInput = document.getElementById("change-pass-old-input");
const newPassInput = document.getElementById("change-pass-new-input");
const cancelBtn = document.getElementById("change-pass-cancel-btn");
const confirmBtn = document.getElementById("change-pass-confirm-btn");

changePassBtn.addEventListener("click", () => {
  document.getElementById("changePassWrapper").style.display = "block";
  document.getElementById("areYouSureWrapper").style.display = "none";
});

cancelBtn.addEventListener("click", () => {
  document.getElementById("changePassWrapper").style.display = "none";
});

confirmBtn.addEventListener("click", (event) => {
  event.preventDefault();
  const oldPass = oldPassInput.value;
  const newPass = newPassInput.value;
  if (isEmpty(oldPass) || isEmpty(newPass)) {
    showMsg(banana.i18n("change-pass-fill-in-both-fields"), "input-msg-change-pass");
  } else {
    const auth = getAuth();
    const user = auth.currentUser;
    const email = user.email;

    if (oldPass === newPass) {
      showMsg(banana.i18n("change-pass-passwords-same"), "input-msg-change-pass");
    } else {
      signInWithEmailAndPassword(auth, email, oldPass)
        .then((userCredential) => {
          updatePassword(user, newPass)
            .then(() => {
              showMsg(banana.i18n("change-pass-success"), "input-msg-change-pass");
              oldPassInput.value = "";
              newPassInput.value = "";
              console.log("password changed successfully");
            })
            .catch((error) => {
              const errorCode = error.code;
              if (errorCode == "auth/password-does-not-meet-requirements") {
                showMsg(banana.i18n("change-pass-doesnt-meet-requirements"), "input-msg-change-pass");
                console.log(errorCode);
              } else {
                showMsg(banana.i18n("error-occured"), "input-msg-change-pass");
                console.error("password change failed - error occured:", error);
                console.log(errorCode);
              }
            });
        })
        .catch((error) => {
          const errorCode = error.code;
          if (errorCode === "auth/invalid-credential") {
            console.error("password change failed - wrong old password");
            showMsg(banana.i18n("change-pass-wrong-old-password"), "input-msg-change-pass");
          } else {
            console.error("password change failed - error occured:", error);
            console.log(errorCode);
            showMsg(banana.i18n("error-occured"), "input-msg-change-pass");
          }
        });
    }
  }
});

function isEmpty(str) {
  return !str.trim().length;
}
