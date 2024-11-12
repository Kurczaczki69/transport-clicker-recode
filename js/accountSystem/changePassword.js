// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  updatePassword,
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import { showMsg } from "../utilities.js";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAlr1B-qkg66Zqkr423UyFrNSLPmScZGIU",
  authDomain: "transport-clicker-f0d1c.firebaseapp.com",
  projectId: "transport-clicker-f0d1c",
  storageBucket: "transport-clicker-f0d1c.appspot.com",
  messagingSenderId: "177489808647",
  appId: "1:177489808647:web:b54aeae2843f31ba02c9a2",
  measurementId: "G-CP6HMGD0N1",
};

// Initialize Firebase
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
    showMsg("Musisz wypełnić oba pola!", "input-msg-change-pass");
  } else {
    const auth = getAuth();
    const user = auth.currentUser;
    const email = user.email;

    if (oldPass === newPass) {
      showMsg("Hasła muszą się różnić!", "input-msg-change-pass");
    } else {
      signInWithEmailAndPassword(auth, email, oldPass)
        .then((userCredential) => {
          updatePassword(user, newPass)
            .then(() => {
              showMsg("Hasło zmienione pomyślnie!", "input-msg-change-pass");
              oldPassInput.value = "";
              newPassInput.value = "";
              console.log("password changed successfully");
            })
            .catch((error) => {
              const errorCode = error.code;
              if (errorCode == "auth/password-does-not-meet-requirements") {
                showMsg(
                  "Nowe hasło musi mieć conajmniej 8 znaków, zawierać dużą i małą literę oraz cyfrę",
                  "input-msg-change-pass"
                );
                console.log(errorCode);
              } else {
                showMsg("Wystąpił błąd!", "input-msg-change-pass");
                console.error("password change failed - error occured:", error);
                console.log(errorCode);
              }
            });
        })
        .catch((error) => {
          const errorCode = error.code;
          if (errorCode === "auth/invalid-credential") {
            console.error("password change failed - wrong old password");
            showMsg("Niepoprawne stare hasło!", "input-msg-change-pass");
          } else {
            console.error("password change failed - error occured:", error);
            console.log(errorCode);
            showMsg("Wystąpił błąd!", "input-msg-change-pass");
          }
        });
    }
  }
});

function isEmpty(str) {
  return !str.trim().length;
}
