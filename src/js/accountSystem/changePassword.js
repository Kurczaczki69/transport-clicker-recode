import { signInWithEmailAndPassword, updatePassword } from "firebase/auth";
import { auth } from "../firebaseManager.js";
import { showMsg, animateAppear, animateDisappear, getI18n } from "../utilities.js";
import { playRandomMouseClick } from "../sounds.js";

const isGamePage = window.location.pathname.includes("game.html");

if (isGamePage) {
  const changePassBtn = document.querySelector("#change-pass-btn");
  const oldPassInput = document.querySelector("#change-pass-old-input");
  const newPassInput = document.querySelector("#change-pass-new-input");
  const cancelBtn = document.querySelector("#change-pass-cancel-btn");
  const confirmBtn = document.querySelector("#change-pass-confirm-btn");

  const passWrapper = document.querySelector("#changePassWrapper");
  const areYouSureWrapper = document.querySelector("#areYouSureWrapper");

  changePassBtn.addEventListener("click", () => {
    playRandomMouseClick();
    if (passWrapper.style.display === "none" || passWrapper.style.display === "") {
      animateAppear(passWrapper);
      animateDisappear(areYouSureWrapper);
    }
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
      showMsg(getI18n("change-pass-fill-in-both-fields"), "input-msg-change-pass");
    } else {
      const user = auth.currentUser;
      const email = user.email;

      if (oldPass === newPass) {
        showMsg(getI18n("change-pass-passwords-same"), "input-msg-change-pass");
      } else {
        signInWithEmailAndPassword(auth, email, oldPass)
          .then((userCredential) => {
            updatePassword(user, newPass)
              .then(() => {
                showMsg(getI18n("change-pass-success"), "input-msg-change-pass");
                oldPassInput.value = "";
                newPassInput.value = "";
                console.log("password changed successfully");
              })
              .catch((error) => {
                const errorCode = error.code;
                if (errorCode == "auth/password-does-not-meet-requirements") {
                  showMsg(getI18n("change-pass-doesnt-meet-requirements"), "input-msg-change-pass");
                  console.log(errorCode);
                } else {
                  showMsg(getI18n("error-occured"), "input-msg-change-pass");
                  console.error("password change failed - error occured:", error);
                  console.log(errorCode);
                }
              });
          })
          .catch((error) => {
            const errorCode = error.code;
            if (errorCode === "auth/invalid-credential") {
              console.error("password change failed - wrong old password");
              showMsg(getI18n("change-pass-wrong-old-password"), "input-msg-change-pass");
            } else {
              console.error("password change failed - error occured:", error);
              console.log(errorCode);
              showMsg(getI18n("error-occured"), "input-msg-change-pass");
            }
          });
      }
    }
  });
}

export function isEmpty(str) {
  return !str.trim().length;
}
