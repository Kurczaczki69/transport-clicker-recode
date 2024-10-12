// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import {
  getFirestore,
  setDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

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

function showMsg(message, divId) {
  var messageDiv = document.getElementById(divId);
  messageDiv.style.display = "block";
  messageDiv.innerHTML = message;
  messageDiv.style.opacity = 1;
  setTimeout(function () {
    messageDiv.style.opacity = 1;
  }, 5000);
}

const RegisterBtn = document.querySelector("#register-btn");
RegisterBtn.addEventListener("click", (event) => {
  event.preventDefault();
  const username = document.getElementById("username-input reg-name").value;
  const email = document.getElementById("email-input reg-email").value;
  const password = document.getElementById("password-input reg-pass").value;

  const auth = getAuth();
  const db = getFirestore();

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      const userData = {
        email: email,
        username: username,
      };
      showMsg("Konto utworzone pomyślnie!", "errorMsgRegister");
      const docRef = doc(db, "users", user.uid);
      setDoc(docRef, userData)
        .then(() => {
          window.location.href = "index.html";
        })
        .catch((error) => {
          console.error("error writing document", error);
        });
    })
    .catch((error) => {
      const errorCode = error.code;
      if (errorCode == "auth/email-already-in-use") {
        showMsg("Istnieje już konto z tym adresem email!", "errorMsgRegister");
      } else if (errorCode == "auth/password-does-not-meet-requirements") {
        showMsg(
          "Hasło musi mieć conajmniej 8 znaków,<br> zawierać dużą i małą literę oraz cyfrę",
          "errorMsgRegister"
        );
        console.log(errorCode);
      } else {
        showMsg("Wystąpił błąd!", "errorMsgRegister");
        console.log(errorCode);
      }
    });
});
