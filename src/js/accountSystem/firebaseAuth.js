import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { auth, db } from "../firebaseManager.js";
import { showMsg, getI18n } from "../utilities.js";

const RegisterBtn = document.querySelector("#register-btn");
if (RegisterBtn) {
  RegisterBtn.addEventListener("click", (event) => {
    event.preventDefault();
    const username = document.getElementById("username-input reg-name").value;
    const email = document.getElementById("email-input reg-email").value;
    const password = document.getElementById("password-input reg-pass").value;

    // check if all fields are filled out
    if (username === "" || email === "" || password === "") {
      showMsg(getI18n("auth-empty-fields"), "errorMsgRegister");
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
          showMsg(getI18n("auth-success"), "errorMsgRegister");
          // after creating user, save data to db
          const docRef = doc(db, "users", user.uid);
          setDoc(docRef, userData)
            // after saving user data to db, send verification email
            .then(() => {
              sendEmailVerification(auth.currentUser)
                .then(() => {
                  showMsg(getI18n("auth-verification-email-sent"), "errorMsgRegister");
                })
                .catch((error) => {
                  console.log(error);
                  console.log(error.code);
                  showMsg(getI18n("error-occured"), "errorMsgRegister");
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
            showMsg(getI18n("auth-email-already-in-use"), "errorMsgRegister");
            console.log(errorCode);
          } else if (errorCode == "auth/password-does-not-meet-requirements") {
            showMsg(getI18n("auth-password-doesnt-meet-requirements", "<br>"), "errorMsgRegister");
            console.log(errorCode);
          } else if (errorCode == "auth/invalid-email") {
            showMsg(getI18n("auth-invalid-email"), "errorMsgRegister");
            console.log(errorCode);
          } else {
            showMsg(getI18n("error-occured"), "errorMsgRegister");
            console.log(errorCode);
          }
        });
    }
  });
}
