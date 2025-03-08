import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-analytics.js";
import {
  getAuth,
  deleteUser,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import { getFirestore, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
import { showMsg } from "../utilities.js";
import { banana } from "../langs.js";

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
const db = getFirestore(app);

// showing the window and hiding it
const accDelBtn = document.getElementById("delete-account-btn");
const cancelBtn = document.getElementById("are-you-sure-cancel-btn");

accDelBtn.addEventListener("click", () => {
  document.getElementById("areYouSureWrapper").style.display = "block";
  document.getElementById("changePassWrapper").style.display = "none";
});

cancelBtn.addEventListener("click", () => {
  document.getElementById("areYouSureWrapper").style.display = "none";
});

const confirmBtn = document.getElementById("are-you-sure-confirm-btn");

confirmBtn.addEventListener("click", async (event) => {
  event.preventDefault();
  const auth = getAuth();
  const user = auth.currentUser;
  const password = document.getElementById("are-you-sure-pass-input").value;
  const email = user.email;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    console.log("authentication success");

    await deleteDoc(doc(db, "users", user.uid));
    console.log("user data deleted successfully");

    await deleteUser(user);
    localStorage.setItem("loggedIn", false);
    localStorage.removeItem("loggedInUserId");
    localStorage.removeItem("previousLevel");
    window.alert(banana.i18n("delete-acc-success"));
    window.location.href = "index.html";
    console.log("account deleted successfully");
  } catch (error) {
    const errorCode = error.code;
    if (errorCode === "auth/invalid-credential") {
      showMsg(banana.i18n("wrong-password"), "input-msg");
      console.error("deletion unsuccesful - wrong password");
    } else if (errorCode === "auth/requires-recent-login") {
      showMsg(banana.i18n("delete-account-requires-recent-login"), "input-msg");
    } else if (errorCode === "auth/missing-password") {
      showMsg(banana.i18n("auth-login-missing-password"), "input-msg");
      console.log(errorCode);
    } else {
      showMsg(banana.i18n("error-occured"), "input-msg");
      console.error("deletion unsuccesful - error:", error);
      console.log(errorCode);
    }
  }
});
