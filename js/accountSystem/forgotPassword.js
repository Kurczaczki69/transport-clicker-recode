// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getAuth, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import { showMsg } from "../utilities.js";

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
const forgotPassBtn = document.getElementById("forgot-pass-link");

forgotPassBtn.addEventListener("click", (event) => {
  event.preventDefault();
  const auth = getAuth();
  const email = document.getElementById("email-input-login").value;
  sendPasswordResetEmail(auth, email)
    .then(() => {
      showMsg("Link do resetowania hasła został wysłany na podany email", "errorMsgLogin");
      console.log("password reset email sent");
    })
    .catch((error) => {
      const errorCode = error.code;
      if (errorCode === "auth/missing-email") {
        showMsg("Podaj email!", "errorMsgLogin");
        console.log(errorCode);
      } else if (errorCode === "auth/invalid-email") {
        showMsg("Niepoprawny email!", "errorMsgLogin");
      } else if (errorCode === "auth/requires-recent-login") {
        showMsg("Proszę kliknąć w przycisk ponownie!");
      } else {
        showMsg("Wystąpił bład!", "errorMsgLogin");
        console.log(errorCode);
      }
    });
});
