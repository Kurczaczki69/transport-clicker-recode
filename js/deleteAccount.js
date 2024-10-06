// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-analytics.js";
import {
  getAuth,
  deleteUser,
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

// showing the window and hiding it
const accDelWindow = document.getElementById("areYouSureWrapper");
const accDelBtn = document.getElementById("delete-account-btn");
const cancelBtn = document.getElementById("are-you-sure-cancel-btn");
accDelBtn.addEventListener(
  "click",
  function () {
    accDelWindow.style.display = "block";
  },
  false
);

cancelBtn.addEventListener(
  "click",
  function () {
    accDelWindow.style.display = "none";
  },
  false
);

function showMsg(message, divId) {
  var messageDiv = document.getElementById(divId);
  messageDiv.style.display = "block";
  messageDiv.innerHTML = message;
  messageDiv.style.opacity = 1;
  setTimeout(function () {
    messageDiv.style.opacity = 1;
  }, 5000);
}

const confirmBtn = document.getElementById("are-you-sure-confirm-btn");

confirmBtn.addEventListener("click", (event) => {
  event.preventDefault();
  const auth = getAuth();
  const user = auth.currentUser;
  const password = document.getElementById("are-you-sure-pass-input").value;
  const email = user.email;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      console.log("deletion success");
      deleteUser(user)
        .then(() => {
          localStorage.setItem("loggedIn", false);
          localStorage.removeItem("loggedInUserId");
          window.alert("Usunięto konto pomyślnie!");
          window.location.href = "index.html";
          console.log("account deleted succesfully");
        })
        .catch((error) => {
          showMsg("Wystąpił błąd!", "input-msg");
          console.error("deletion unsuccesful - error:", error);
        });
    })
    .catch((error) => {
      const errorCode = error.code;
      if (errorCode === "auth/invalid-credential") {
        showMsg("Niepoprawne hasło!", "input-msg");
        console.error("deletion unsuccesful - wrong password");
      } else {
        showMsg("Wystąpił błąd!", "input-msg");
        console.error("deletion unsuccesful - error:", error);
      }
    });
});
