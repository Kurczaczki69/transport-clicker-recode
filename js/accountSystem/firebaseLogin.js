import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  sendEmailVerification,
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
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

const LoginBtn = document.querySelector("#login-btn");
LoginBtn.addEventListener("click", (event) => {
  console.log("btn clicked");
  event.preventDefault();
  const email = document.getElementById("email-input-login").value;
  const password = document.getElementById("password-input-login").value;
  const auth = getAuth();

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      if (auth.currentUser.emailVerified) {
        console.log("login successful");
        showMsg("Zalogowano pomyślnie!", "errorMsgLogin");
        const user = userCredential.user;
        localStorage.setItem("loggedInUserId", user.uid);
        localStorage.setItem("loggedIn", true);
        console.log("saved user id: " + user.uid);
        window.location.href = "game.html";
      } else {
        showMsg(
          "Proszę zweryfikować swój adres email!<br> <span id='send-verification-again'>Wyślij nowy link</span>",
          "errorMsgLogin"
        );
        const sendVerificationBtn = document.getElementById("send-verification-again");
        sendVerificationBtn.addEventListener("click", () => {
          sendEmailVerification(auth.currentUser)
            .then(() => {
              showMsg("Wysłano email do weryfikacji konta", "errorMsgLogin");
            })
            .catch((error) => {
              console.log(error);
              console.log(error.code);
              showMsg("Wystąpił błąd!", "errorMsgLogin");
            });
        });
      }
    })
    .catch((error) => {
      const errorCode = error.code;
      if (errorCode === "auth/invalid-credential") {
        console.log("invalid credential");
        showMsg("Niepoprawny email lub hasło", "errorMsgLogin");
      } else if (errorCode === "auth/user-disabled") {
        showMsg("Twoje konto jest zablokowane!", "errorMsgLogin");
      } else if (errorCode === "auth/invalid-email") {
        showMsg("Niepoprawny email!", "errorMsgLogin");
      } else if (errorCode === "auth/unverified-email") {
        showMsg("Proszę zweryfikować swój adres email!", "errorMsgLogin");
      } else {
        console.log("login failed");
        showMsg("Wystąpił błąd!", "errorMsgLogin");
        console.log(error);
        console.log(error.code);
      }
    });
});
