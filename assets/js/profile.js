
const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get("docId");
console.log(userId);

var db = firebase.firestore();

// Reference to the "policyholders" collection in Firestore
var userRef = db.collection("policyholders");

// Retrieve the user data based on the user ID
userRef.doc(userId).get().then((doc) => {
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


var claimRef = db.collection("claims");
claimRef.where('policyHolderID', '==', userId)
    .get()
    .then(function (querySnapshot) {
        // Initialize the table body
        var tableBody = document.getElementById("claim-table-body");

        // Loop through the query snapshot to populate the table
        querySnapshot.forEach(function (doc) {
            // Get claim data from the document
            var claimData = doc.data();
            // console.log(claimData);

            // Create a table row
            var row = document.createElement("tr");

            // Create table data cells for Claim ID and Status
            var claimIdCell = document.createElement("td");
            var statusCell = document.createElement("td");

            statusCell.classList.add("status-green");

            // Set the text content of the cells
            claimIdCell.textContent = doc.id;
            statusCell.textContent = claimData.Status; 

            // Append cells to the row
            row.appendChild(claimIdCell);
            row.appendChild(statusCell);

             // Add a click event listener to the row
             row.addEventListener("click", function () {
                // Extract the docId from the Claim ID cell's text content
                var clickedDocId = claimIdCell.textContent;
            
                // Log the docId to the console
                console.log("Clicked docId: " + clickedDocId);
            
                // Open the modal
                var modal = document.getElementById("myModal");
                var modalClaimId = document.getElementById("modalClaimId");
                var modalStatus = document.getElementById("modalStatus");
                var modalPolicy = document.getElementById("modalPolicy");
                var modalDate = document.getElementById("modalDate");
                var modalTime = document.getElementById("modalTime");
                var modalLocation = document.getElementById("modalLocation");
                var modalDesc = document.getElementById("modalDesc");
                var modalComment = document.getElementById("modalComment");
                
                modal.style.display = "block";
            
                // Retrieve the claim data and populate the modal
                claimRef.doc(clickedDocId).get().then((doc) => {
                    if (doc.exists) {
                        var claimData = doc.data();
                        modalClaimId.textContent = clickedDocId;
                        modalStatus.textContent = claimData.Status;
                        modalPolicy.textContent = claimData.policyNumber;
                        modalDate.textContent = claimData.date;
                        modalTime.textContent = claimData.time;
                        modalLocation.textContent = claimData.location;
                        modalDesc.textContent = claimData.description;
                        modalComment.textContent = claimData.comment;

                        console.log(claimData.mediaUrls);
                        console.log(claimData.documentUrls);
                        
                        displayMediaAndDocuments(claimData.mediaUrls, claimData.documentUrls);
                    } else {
                        console.log("Claim not found");
                    }
                }).catch((error) => {
                    console.error("Error getting claim data:", error);
                });
            
                // Add a click event listener to close the modal
                var closeModal = document.getElementById("closeModal");
                closeModal.addEventListener("click", function () {
                    modal.style.display = "none";
                });
            
                // Close the modal if the user clicks outside of it
                window.addEventListener("click", function (event) {
                    if (event.target == modal) {
                        modal.style.display = "none";
                    }
                });
            });
            


            // Append the row to the table body
            tableBody.appendChild(row);
        });
    })
    .catch(function (error) {
        console.error("Error retrieving claims:", error);
    });

    function displayMediaAndDocuments(mediaUrls, documentUrls) {
        const modalMedia = document.getElementById("modalMedia");
        const modalDocuments = document.getElementById("modalDocuments");
      
        // Clear any existing content
        modalMedia.innerHTML = "";
        modalDocuments.innerHTML = "";
      
       // Display media
  if (mediaUrls && mediaUrls.length > 0) {
    mediaUrls.forEach((mediaUrl) => {
      const mediaContainer = document.createElement("div");

      const mediaIcon = document.createElement("i");
      mediaIcon.classList.add("bi", "bi-card-image"); 

      // Create a link to view the media
      const mediaLink = document.createElement("a");
      mediaLink.href = mediaUrl;
      mediaLink.target = "_blank";
      mediaLink.textContent = "View Media";

      // Append the icon and link to the media container
      mediaContainer.appendChild(mediaIcon);
      mediaContainer.appendChild(mediaLink);

      modalMedia.appendChild(mediaContainer);
      modalMedia.appendChild(document.createElement("br"));
    });
  }
      
        // Display documents
        if (documentUrls && documentUrls.length > 0) {

      
          documentUrls.forEach((documentUrl) => {
            const docContainer = document.createElement("div");

            const docIcon = document.createElement("i");
            docIcon.classList.add("bi", "bi-file-earmark"); 
            const documentLink = document.createElement("a");
            documentLink.href = documentUrl;
            documentLink.target = "_blank";
            documentLink.textContent = "View Document";

            docContainer.appendChild(docIcon);
            docContainer.appendChild(documentLink);
            modalDocuments.appendChild(docContainer);
            modalDocuments.appendChild(document.createElement("br"));
          });
        }
      }
      

      var policyRef = db.collection("policies");
      policyRef.where('policyholderID', '==', userId)
          .get()
          .then(function (querySnapshot) {
              var policyContainer = document.getElementById("policy-container");
      
              // Loop through the query snapshot to populate
              querySnapshot.forEach(function (doc) {
                  // Get policy data from the document
                  var policyData = doc.data();
      
                  var card = document.createElement("div");
                  
                  card.className = "policy-card";
      
                  var policyName = document.createElement("p");
                  policyName.className = "policy-name";

                //   var viewBtn =  document.createElement("i");
                //   viewBtn.className = "policy-btn";
                //   viewBtn.textContent = "View";
                //   viewBtn.classList.add("bi", "bi-arrow-right-circle");
                  
      
                  // Split the policy name by spaces
                  var policyNameParts = policyData.name.split(' ');
      
                  // Check if the first word is "motor"
                  if (policyNameParts.length > 0 && policyNameParts[0].toLowerCase() === "motor") {
                      var carIcon = document.createElement("i");
                      carIcon.className = "bi bi-car-front-fill";
      
                      card.appendChild(carIcon)
                      policyName.textContent = policyData.name;
      
                  } else if(policyNameParts.length > 0 && policyNameParts[0].toLowerCase() === "protection") {
                      var shieldIcon = document.createElement("i");
                      shieldIcon.className = "bi bi-shield-check";
      
                      card.appendChild(shieldIcon)
                      policyName.textContent = policyData.name;
                  }
                  else if(policyNameParts.length > 0 && policyNameParts[0].toLowerCase() === "retirement") {
                    var rIcon = document.createElement("i");
                    rIcon.className = "bi bi-hourglass-split";
    
                    card.appendChild(rIcon)
                    policyName.textContent = policyData.name;
                }
                else if(policyNameParts.length > 0 && policyNameParts[0].toLowerCase() === "health") {
                    var healthIcon = document.createElement("i");
                    healthIcon.className = "bi bi-clipboard-pulse";
    
                    card.appendChild(healthIcon)
                    policyName.textContent = policyData.name;
                }
                  
      
                  // Append the policy name to the card
                  
                  card.appendChild(policyName);
                //   card.appendChild(viewBtn);

                  card.addEventListener("click", function () {
                    // Extract the docId from the card's data or any relevant source
                    var clickedDocId = doc.id; // Assuming doc.id contains the document ID
                    var policyName = policyData.name; // Get the policy name
                    var policyholderID = policyData.policyholderID; // Get the policy name
                    var policyPremium = policyData.premium;
                    var policyAmount = policyData.amount;
                
                    // Redirect to payment.html with URL parameters
                    window.location.href = "payment.html?docId=" + clickedDocId + "&policyName=" + encodeURIComponent(policyName) +"&policyHolderID=" + encodeURIComponent(policyholderID) + "&policyPremium=" + encodeURIComponent(policyPremium) + "&policyAmount=" + encodeURIComponent(policyAmount);
                });
      
                  // Append the card to the policy container
                  policyContainer.appendChild(card);
              });


              
          });
      






    
