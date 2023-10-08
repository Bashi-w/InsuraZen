
  // Add a click event listener to the "My InsuraZen" link
  const myInsuraZenLink = document.getElementById("my-insurazen-link");
  if (myInsuraZenLink) {
    myInsuraZenLink.addEventListener("click", handleMyInsuraZenClick);
  }

 // Function to handle the link click
 function handleMyInsuraZenClick() {
    // Check if a user is logged in
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        const isEmailPasswordProvider = user.providerData.some(provider => provider.providerId === "password");
        const isGoogleProvider = user.providerData.some(provider => provider.providerId === "google.com");

        if (isEmailPasswordProvider || isGoogleProvider) {
          // User is signed in with email/password, log the user's ID to the console
          console.log("User ID:", user.uid);

          const db = firebase.firestore();
        const policyholdersRef = db.collection('policyholders');
          policyholdersRef.where('email', '==', user.email)
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
          // window.location.href = "profile.html";
        } else {
          // User is signed in with a different method
          console.log("User is signed in with a different provider");
          window.location.href = "login.html";
          
        }
      } else {
        // User is not signed in, redirect to login.html
        window.location.href = "login.html";
      }
    });
  }