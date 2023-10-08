// Retrieve the URL parameters
const urlParams = new URLSearchParams(window.location.search);
const docId = urlParams.get("docId");
const policyName = decodeURIComponent(urlParams.get("policyName"));
const policyHolder = decodeURIComponent(urlParams.get("policyHolderID"));
const policyPremium = decodeURIComponent(urlParams.get("policyPremium"));
const policyAmount = decodeURIComponent(urlParams.get("policyAmount"));

console.log(docId);
console.log(policyName);
console.log(policyHolder);
console.log(policyPremium);
console.log(policyAmount);

const premiumLabel = document.getElementById("premium");
premiumLabel.textContent = policyAmount;

const policyNameLabel = document.getElementById("policy-name");
policyNameLabel.textContent = policyName;

var db = firebase.firestore();

// Reference to the "policyholders" collection in Firestore
var userRef = db.collection("policyholders");

// Retrieve the user data based on the user ID
userRef.doc(policyHolder).get().then((doc) => {
    if (doc.exists) {
        var data = doc.data();
        const name = document.getElementById("name");
        const address = document.getElementById("address");
        const nic = document.getElementById("nic");
        const mobile = document.getElementById("mobile");
        const email = document.getElementById("email");
        name.textContent = data.firstName +" "+ data.lastName;
        address.textContent = data.address;
        nic.textContent = data.NIC;
        mobile.textContent = data.phoneNumber;
        email.textContent = data.email;
    } else {
        console.log("User not found");
    }
}).catch((error) => {
    console.error("Error getting user data:", error);
});

const backButtonElements = document.querySelectorAll(".back-link");

// Iterate through the selected elements and add the event listener to each
backButtonElements.forEach(function(backButton) {
    backButton.addEventListener("click", function(event) {
        event.preventDefault(); // Prevent the default behavior of following the link
        
        // Generate the URL for the "profile.html" page with the policyHolder ID as a parameter
        const profileUrl = `./profile.html?docId=${policyHolder}`;
        
        // Navigate to the "profile.html" page with the policyHolder ID as a parameter
        window.location.href = profileUrl;
    });
});

// Retrieve payment data based on policyholder id
var payRef = db.collection("payments");

payRef
    .where('policyHolderID', '==', policyHolder)
    .get()
    .then(function (querySnapshot) {
        // Initialize the table body
        var tableBody = document.getElementById("payment-table-body");

        querySnapshot.forEach(function (doc) {
            // Get payment data from the document
            var paymentData = doc.data();

            // Check if policyName matches
            if (paymentData.policyName === policyName) {
                // Create a table row
                var row = document.createElement("tr");

                // Create table data cells 
                var paymentIdCell = document.createElement("td");
                var dateCell = document.createElement("td");
                // var amountCell = document.createElement("td");

                // Set the text content of the cells
                paymentIdCell.textContent = doc.id;
                dateCell.textContent = paymentData.date; 
                // amountCell.textContent = paymentData.amount; 

                row.appendChild(paymentIdCell);
                row.appendChild(dateCell);
                // row.appendChild(amountCell);
                tableBody.appendChild(row);
            }
        });
    });


// Stripe payment API
var stripe = Stripe(
        "pk_test_51NmXHzFQdjrXavZE6WhKznq0BZ4w2xS3cWAVjymuLIGZbHVjV4xCQeZRc82Gz3PWS0rWlwCIdSp51Px6bnDwybAN00dCVJCyrY"
)

document.getElementById("checkout").addEventListener("click", function(){
    // Get the current date as a timestamp
    const currentTimestamp = firebase.firestore.Timestamp.now();

    // Extract the current year and month from the current date
    const currentYear = currentTimestamp.toDate().getFullYear();
    const currentMonth = currentTimestamp.toDate().getMonth() + 1; // Months are zero-based, so add 1
    

    // Create a string for the current month in "YYYY-MM" format
    const currentMonthString = `${currentYear}-${currentMonth.toString().padStart(2, '0')}`;
    console.log(currentMonthString);

    // Reference to the "payments" collection in Firestore
    var paymentsRef = db.collection("payments");

    // Check for existing payment records for the current month and year
    paymentsRef
        .where("date", ">=", `${currentMonthString}-01`)
        .where("date", "<=", `${currentMonthString}-31`)
        .where("policyHolderID", "==", policyHolder)
        .where("policyName", "==", policyName)
        .get()
        .then(function(querySnapshot) {
            // If records are found, display an alert
            if (!querySnapshot.empty) {
                alert("Premium Payment for this month is already made.");
            } else {
                // If no records are found, proceed to Stripe
                const successUrl = `http://127.0.0.1:5500/success.html?policyHolder=${policyHolder}&policyPremium=${policyPremium}&policyName=${policyName}`;
        
                
                //stripe
                stripe.redirectToCheckout({
                    lineItems: [
                        {
                            price: policyPremium,
                            quantity: 1,
                        },
                    ],
                    mode: "payment",
                    successUrl: successUrl,
                    cancelUrl: document.referrer,
                })

                .then(function(result) {
                   
                   
                });
            }
        })
        .catch(function(error) {
            console.error("Error checking for payments:", error);
        });
})



//Get notification for due payment

document.addEventListener("DOMContentLoaded", function () {

    const currentTimestamp = firebase.firestore.Timestamp.now();

    // Extract the current year and month from the current date
    const currentYear = currentTimestamp.toDate().getFullYear();
    const currentMonth = currentTimestamp.toDate().getMonth() + 1; // Months are zero-based, so add 1
    

    // Create a string for the current month in "YYYY-MM" format
    const currentMonthString = `${currentYear}-${currentMonth.toString().padStart(2, '0')}`;
    console.log(currentMonthString);

    // Reference to the "payments" collection in Firestore
    var paymentsRef = db.collection("payments");
  
    // Check for existing payment records for the current month and year
    paymentsRef
      .where("date", ">=", `${currentMonthString}-01`)
      .where("date", "<=", `${currentMonthString}-31`)
      .where("policyHolderID", "==", policyHolder)
      .where("policyName", "==", policyName)
      .get()
      .then(function (querySnapshot) {
        // If no records are found, display a notification
        if (querySnapshot.empty) {
          // Check if the browser supports notifications
          if ("Notification" in window) {
            // Check if the user has granted notification permission
            if (Notification.permission === "granted") {
              // Display a notification
              var notification = new Notification("Payment Due", {
                body: "You have a premium payment due for this month.",
                icon: "./assets/img/logo-nobg.png",
              });
              let utterance = new SpeechSynthesisUtterance("Payment Due");
              speechSynthesis.speak(utterance);

            } else if (Notification.permission !== "denied") {
              // Request notification permission from the user
              Notification.requestPermission().then(function (permission) {
                if (permission === "granted") {
                  // Display a notification
                  var notification = new Notification("Payment Due", {
                    body: "You have a premium payment due for this month.",
                    icon: "./assets/img/logo-nobg.png",
                  });
                  let utterance = new SpeechSynthesisUtterance("Payment Due");
                  speechSynthesis.speak(utterance);
                }
              });
            }
          }
        } else {
          
        }
      })
      .catch(function (error) {
        console.error("Error checking for payments:", error);
      });
  });

 
  
