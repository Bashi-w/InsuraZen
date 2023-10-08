
const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");


const nicInput = document.getElementById("nic");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const emailInputl = document.getElementById("lemail");
const passwordInputl = document.getElementById("lpassword");

sign_up_btn.addEventListener("click", () => {
container.classList.add("sign-up-mode");

});

sign_in_btn.addEventListener("click", () => {
container.classList.remove("sign-up-mode");

});

// Initialize Firebase
firebase.initializeApp(firebaseConfig);


function register() {
    console.log('register button clicked');
    const nic = nicInput.value;
    const email = emailInput.value;
    const password = passwordInput.value;
  
    console.log(nic);
    console.log(email);
    console.log(password);
  
    // Clear any previous error messages
    clearErrorMessages();
  
    let isValid = true; // A flag to track if all validations pass
  
    if (!validate_field(nic)) {
      displayErrorMessage("nicError", "NIC cannot be empty");
      isValid = false;
    }
  
    if (!validate_email(email)) {
      displayErrorMessage("emailError", "Please enter a valid email address");
      console.log('invalid email');
      isValid = false;
    }
  
    if (!validate_password(password)) {
      displayErrorMessage("passwordError", "Password must be at least 6 characters long");
      isValid = false;
    }
  
    if (!isValid) {
      // If any of the validations fail, return without further processing
      return;
    }
  
    // Check if email is already registered with Google
    firebase.auth().fetchSignInMethodsForEmail(email)
      .then((signInMethods) => {
        if (signInMethods.includes('google.com')) {
          // Email is already registered with Google, display an error message
          alert('This email address is already registered with Google. Please sign in with Google.');
          window.location.href = "login.html";

        } else {
          // Email is not registered with Google, proceed with registration
          var db = firebase.firestore();
          var policyholdersRef = db.collection('policyholders');
  
          // Checking if entered NIC is valid and registered
          policyholdersRef.where('NIC', '==', nic)
            .get()
            .then(function (querySnapshot) {
              if (!querySnapshot.empty) {
                const policyholderData = querySnapshot.docs[0].data();
                const policyholderEmail = policyholderData.email;
  
                if (email === policyholderEmail) {
                  firebase.auth().createUserWithEmailAndPassword(email, password)
                    .then((userCredential) => {
                      // User registered successfully
                      const user = userCredential.user;
                      console.log('User registered:', user);
                      window.location.href = "login.html";
                    })
                    .catch((error) => {
                      // Handle errors during registration
                      const errorCode = error.code;
                      const errorMessage = error.message;
                      console.error('Registration error:', errorMessage);
                    });
                } else {
                  // Email doesn't match the policyholder's email
                  alert("The entered email does not match the policyholder's email.");
                }
              } else {
                // NIC not found in the database, show an error message
                alert("This NIC does not belong to a valid policyholder at InsuraZen");
              }
            })
            .catch(function (error) {
              console.error("Error checking NIC in the database: ", error);
            });
        }
      })
      .catch((error) => {
        // Handle errors during email check
        console.error('Email check error:', error);
      });
  }
  

  function login() {
    console.log('login button clicked');
    const email = emailInputl.value;
    const password = passwordInputl.value;
  
    console.log(email);
    console.log(password);
  
    // Clear any previous error messages
    clearErrorMessages();
  
    let isValid = true; // A flag to track if all validations pass
  
    if (!validate_email(email)) {
      displayErrorMessage("emailErrorl", "Please enter a valid email address");
      console.log('invalid email');
      isValid = false;
    }
  
    if (!isValid) {
      // If any of the validations fail, return without further processing
      return;
    }
  
    // Attempt to sign in with email and password
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(function (userCredential) {
        // User logged in successfully
        const user = userCredential.user;
        console.log('User logged in:', user);
  
        //retrieve the policyholder's document ID based on the entered email
        const db = firebase.firestore();
        const policyholdersRef = db.collection('policyholders');
  
        policyholdersRef.where('email', '==', email)
          .get()
          .then(function (querySnapshot) {
            if (!querySnapshot.empty) {
              const docId = querySnapshot.docs[0].id; // Get the document ID
              // Pass the docId as a query parameter to profile.html
              window.location.href = `profile.html?docId=${docId}`;
            } else {
              // Email not found in policyholders
              alert("Email not found in our records.");
            }
          })
          .catch(function (error) {
            console.error("Error retrieving document ID: ", error);
          });
      })
      .catch(function (error) {
        // Handle errors during login
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error('Login error:', errorMessage);
  
        // If the error message indicates an invalid email or password, display a custom message
        if (errorCode === "auth/wrong-password" || errorCode === "auth/user-not-found") {
          // Check if the email is associated with a Google account
          firebase.auth().fetchSignInMethodsForEmail(email)
            .then((signInMethods) => {
              if (signInMethods.includes('google.com')) {
                // Email is associated with a Google account, show a custom alert
                alert("This email is registered with Google. Please log in using Google.");
              } else {
                // For other errors, display a general error message
                displayErrorMessage("credentialError", "Invalid email or password. Please try again.");
              }
            })
            .catch((error) => {
              console.error('Email check error:', error);
            });
        } else {
          // For other errors, display a general error message
          displayErrorMessage("credentialError", "An error occurred. Please try again later.");
        }
      });
  }
  
  

function validate_email(email){
    expression = /^[^@]+@\w+(\.\w+)+\w$/.test(email);

    if (expression == true){
        return true;
    }
    else{
        return false;
    }
}


function validate_password(password){
    if (password.length < 6){
        return false;
    }
    else{
        return true;
    }
}


function validate_field(field){
    if(field == null){
        return false
    }

    if (field.length <= 0){
        return false
    }
    else{
        return true
    }
}

function clearErrorMessages() {
    const errorElements = document.querySelectorAll(".error-message");
    errorElements.forEach((element) => {
      element.textContent = "";
    });
  }
  
  function displayErrorMessage(elementId, message) {
    const errorElement = document.getElementById(elementId);
    errorElement.textContent = message;
  }

  function signUpWithGoogle() {
    const googleProvider = new firebase.auth.GoogleAuthProvider();
  
    firebase.auth().signInWithPopup(googleProvider)
      .then((result) => {
        const user = result.user;
        const userEmail = user.email;
  
        // Now, check if the Google sign-up email is a valid policyholder's email
        const db = firebase.firestore();
        const policyholdersRef = db.collection('policyholders');
  
        policyholdersRef.where('email', '==', userEmail)
          .get()
          .then((querySnapshot) => {
            if (!querySnapshot.empty) {
              // Email is a valid policyholder's email, allow registration
              console.log('Valid policyholder email:', userEmail);
              const docId = querySnapshot.docs[0].id; // Get the document ID
                  // Pass the docId as a query parameter to profile.html
              window.location.href = `profile.html?docId=${docId}`;

            } else {
              // Email is not found in policyholders, display an error message
              console.error('Invalid policyholder email:', userEmail);
              alert("This email is not associated with a valid policyholder.");
            }
          })
          .catch((error) => {
            console.error('Error checking policyholder email:', error);
          });
      })
      .catch((error) => {
        // Handle errors during Google sign-in
        console.error('Google sign-in error', error);
      });
  }

  function signInWithGoogle() {
    const googleProvider = new firebase.auth.GoogleAuthProvider();
  
    firebase.auth().signInWithPopup(googleProvider)
      .then((result) => {
        const user = result.user;
        const userEmail = user.email;
  
        // Now, check if the Google sign-in email is a valid policyholder's email
        const db = firebase.firestore();
        const policyholdersRef = db.collection('policyholders');
  
        policyholdersRef.where('email', '==', userEmail)
          .get()
          .then((querySnapshot) => {
            if (!querySnapshot.empty) {
              // Email is a valid policyholder's email, allow login
              console.log('Valid policyholder email:', userEmail);
              const docId = querySnapshot.docs[0].id; // Get the document ID
              // Pass the docId as a query parameter to profile.html
              window.location.href = `profile.html?docId=${docId}`;
            } else {
              // Email is not found in policyholders, display an error message
              console.error('Invalid policyholder email:', userEmail);
              alert("This email is not associated with a valid policyholder.");
            }
          })
          .catch((error) => {
            console.error('Error checking policyholder email:', error);
          });
      })
      .catch((error) => {
        // Handle errors during Google sign-in
        console.error('Google sign-in error', error);
      });
  }
  
  