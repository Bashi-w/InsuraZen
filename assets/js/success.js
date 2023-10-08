// Countdown function to redirect after a specified duration
function countdown() {
    var seconds = 5; 
    var countdownElement = document.getElementById('countdown');
    
    var interval = setInterval(function() {
      countdownElement.textContent = seconds;
      seconds--;

      if (seconds < 0) {
        clearInterval(interval);
        window.location.href = '/';
      }
    }, 1000); // 1000 milliseconds = 1 second
  }

  // Start the countdown when the page loads
  window.onload = countdown;

  const urlParams = new URLSearchParams(window.location.search);
  const policyHolder = urlParams.get("policyHolder");
  const policyPremium = urlParams.get("policyPremium");
  const policyName = urlParams.get("policyName");

  // Create a paymentData object
  const currentTimestamp = firebase.firestore.Timestamp.now();
  const dateObject = currentTimestamp.toDate();
  const formattedDate = dateObject.toISOString().split('T')[0]; // Format as "YYYY-MM-DD"

  const paymentData = {
    date: formattedDate,
    policyHolderID: policyHolder,
    amount: policyPremium,
    policyName: policyName,
  };

  // Reference to the "payments" collection in Firestore
  var paymentsRef = db.collection("payments");

  // Add the payment data to Firestore
  paymentsRef.add(paymentData)
    .then(function(docRef) {
      console.log("Payment details saved with ID: ", docRef.id);
    })
    .catch(function(error) {
      console.error("Error saving payment details:", error);
    });