// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import { getFirestore, getDoc, doc } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

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

const auth = getAuth();
const db = getFirestore();

onAuthStateChanged(auth, (user) => {
  const loggedInUserId = localStorage.getItem("loggedInUserId");
  if (loggedInUserId) {
    const docRef = doc(db, "users", loggedInUserId);
    getDoc(docRef)
      .then((docSnap) => {
        if (docSnap.exists()) {
          const userData = docSnap.data();
          document.getElementById("accName").innerText = userData.username;
          document.getElementById("accEmail").innerText = userData.email;
        } else {
          console.log("no document found matching id");
        }
      })
      .catch((error) => {
        console.log("error getting document", error);
      });
  } else {
    const accWindow = document.getElementById("accountbox");
    accWindow.innerHTML =
      "<h2 id='accWelcome'>Nie jesteś zalogowany!</h2><br><div id='acc-btn-wrapper'><a href='index.html'><button id='gotologin-btn' class='btns-acc-window'>Zaloguj się</button></a></div>";
    console.log("User Id not found in local storage");
    window.location.href = "index.html";
  }
});

const logOutBtn = document.getElementById("logout-btn");
logOutBtn.addEventListener("click", () => {
  localStorage.removeItem("loggedInUserId");
  localStorage.setItem("loggedIn", false);
  signOut(auth)
    .then(() => {
      window.location.href = "index.html";
    })
    .catch((error) => {
      console.error("error signing out", error);
    });
});
