// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-analytics.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import {
  getFirestore,
  setDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

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
const analytics = getAnalytics(app);

function showMsg(message, divId) {
  var messageDiv = document.getElementById(divId);
  messageDiv.style.display = "block";
  messageDiv.innerHTML = message;
  messageDiv.style.opacity = 1;
  setTimeout(function () {
    messageDiv.style.opacity = 1;
  }, 5000);
}

const LoginBtn = document.querySelector("#login-btn");
LoginBtn.addEventListener("click", (event) => {
  console.log("btn clicked");
  event.preventDefault();
  const email = document.getElementById("email-input-login").value;
  const password = document.getElementById("password-input-login").value;
  const auth = getAuth();

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      console.log("login successfull");
      showMsg("Zalogowano pomyślnie!", "errorMsgLogin");
      const user = userCredential.user;
      localStorage.setItem("loggedInUserId", user.uid);
      localStorage.setItem("loggedIn", true);
      console.log("saved user id: " + user.uid);
      window.location.href = "game.html";
    })
    .catch((error) => {
      const errorCode = error.code;
      if (errorCode === "auth/invalid-credential") {
        console.log("invalid credential");
        showMsg("Niepoprawny email lub hasło", "errorMsgLogin");
      } else {
        console.log("login failed");
        showMsg("Konto nie istnieje", "errorMsgLogin");
      }
    });
});
