import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import { setDoc, doc } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
import { auth, db } from "../firebaseManager.js";
import { showMsg } from "../utilities.js";
import { banana } from "../langs.js";

const RegisterBtn = document.querySelector("#register-btn");
RegisterBtn.addEventListener("click", (event) => {
  event.preventDefault();
  const username = document.getElementById("username-input reg-name").value;
  const email = document.getElementById("email-input reg-email").value;
  const password = document.getElementById("password-input reg-pass").value;

  // check if all fields are filled out
  if (username === "" || email === "" || password === "") {
    showMsg(banana.i18n("auth-empty-fields"), "errorMsgRegister");
    console.error("one or more empty fields");
  } else {
    createUserWithEmailAndPassword(auth, email, password)
      // create user
      .then((userCredential) => {
        const user = userCredential.user;
        const userData = {
          email: email,
          username: username,
        };
        showMsg(banana.i18n("auth-success"), "errorMsgRegister");
        // after creating user, save data to db
        const docRef = doc(db, "users", user.uid);
        setDoc(docRef, userData)
          // after saving user data to db, send verification email
          .then(() => {
            sendEmailVerification(auth.currentUser)
              .then(() => {
                showMsg(banana.i18n("auth-verification-email-sent"), "errorMsgRegister");
              })
              .catch((error) => {
                console.log(error);
                console.log(error.code);
                showMsg(banana.i18n("error-occured"), "errorMsgRegister");
              });
          })
          .catch((error) => {
            console.error("error writing document", error);
          });
      })
      .catch((error) => {
        const errorCode = error.code;
        // handling different error codes
        if (errorCode == "auth/email-already-in-use") {
          showMsg(banana.i18n("auth-email-already-in-use"), "errorMsgRegister");
          console.log(errorCode);
        } else if (errorCode == "auth/password-does-not-meet-requirements") {
          showMsg(banana.i18n("auth-password-doesnt-meet-requirements", "<br>"), "errorMsgRegister");
          console.log(errorCode);
        } else if (errorCode == "auth/invalid-email") {
          showMsg(banana.i18n("auth-invalid-email"), "errorMsgRegister");
          console.log(errorCode);
        } else {
          showMsg(banana.i18n("error-occured"), "errorMsgRegister");
          console.log(errorCode);
        }
      });
  }
});
