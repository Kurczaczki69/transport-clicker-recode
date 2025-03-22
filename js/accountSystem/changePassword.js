import {
  signInWithEmailAndPassword,
  updatePassword,
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import { auth } from "../firebaseManager.js";
import { showMsg, animateAppear, animateDisappear } from "../utilities.js";
import { banana } from "../langs.js";
import { playRandomMouseClick } from "../sounds.js";

const changePassBtn = document.querySelector("#change-pass-btn");
const oldPassInput = document.querySelector("#change-pass-old-input");
const newPassInput = document.querySelector("#change-pass-new-input");
const cancelBtn = document.querySelector("#change-pass-cancel-btn");
const confirmBtn = document.querySelector("#change-pass-confirm-btn");

const passWrapper = document.querySelector("#changePassWrapper");
const areYouSureWrapper = document.querySelector("#areYouSureWrapper");

changePassBtn.addEventListener("click", () => {
  playRandomMouseClick();
  animateDisappear(areYouSureWrapper);
  animateAppear(passWrapper);
});

cancelBtn.addEventListener("click", () => {
  playRandomMouseClick();
  animateDisappear(passWrapper);
});

confirmBtn.addEventListener("click", (event) => {
  event.preventDefault();
  playRandomMouseClick();
  const oldPass = oldPassInput.value;
  const newPass = newPassInput.value;
  if (isEmpty(oldPass) || isEmpty(newPass)) {
    showMsg(banana.i18n("change-pass-fill-in-both-fields"), "input-msg-change-pass");
  } else {
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

export function isEmpty(str) {
  return !str.trim().length;
}
