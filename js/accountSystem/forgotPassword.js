// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import {
  getAuth,
  sendPasswordResetEmail,
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";

// Your web app's Firebase configuration
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
const forgotPassBtn = document.getElementById("forgot-pass-link");

forgotPassBtn.addEventListener("click", (event) => {
  event.preventDefault();
  const auth = getAuth();
  const email = document.getElementById("email-input-login").value;
  sendPasswordResetEmail(auth, email)
    .then(() => {
      showMsg(
        "Link do resetowania hasła został wysłany na podany email",
        "errorMsgLogin"
      );
    })
    .catch((error) => {
      const errorCode = error.code;
      console.log(error.code);
      showMsg("Wystąpił błąd!", "errorMsgLogin");
    });
});

function showMsg(message, divId) {
  var messageDiv = document.getElementById(divId);
  messageDiv.style.display = "block";
  messageDiv.innerHTML = message;
  messageDiv.style.opacity = 1;
  setTimeout(function () {
    messageDiv.style.opacity = 1;
  }, 5000);
}
