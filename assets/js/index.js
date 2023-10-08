// Google translate API

function loadGoogleTranslate(){
  
  new google.translate.TranslateElement(
    {
      pageLanguage: 'en',
      includedLanguages: 'en,si,ta', //uncomment this to include all languages
    },
    'google_element'
  );
}

//reading categories from firebase

var categoriesRef = db.collection("categories");

// Reference to the container div where the divs will be created
var categoryContainer = document.getElementById("category-container");

// Fetch data from Firestore
categoriesRef.get().then((querySnapshot) => {
  querySnapshot.forEach((doc) => {
    var data = doc.data();
    
    // Create a new div for each category
    var categoryDiv = document.createElement("div");
    categoryDiv.className = "col-md-6";
    categoryDiv.setAttribute("data-aos", "fade-up");
    // categoryDiv.setAttribute("data-aos-delay", data.delay); 
    

    // <a href="/category-details.html?id=${encodeURIComponent(doc.id)}" style="color:black">
    // Create the content for the div
    categoryDiv.innerHTML = `
    <a href="${data.link}" style="color:black">
        <div class="icon-box">
          <i class="${data.icon}"></i>
          <h3>${data.name}</h3>
          <p>${data.description}</p>
        </div>
      </a>
    `;

    // Append the div to the container
    categoryContainer.appendChild(categoryDiv);
  });
});






// Get all elements with the class .get-quote-form
const quoteForms = document.querySelectorAll('.get-quote-form');

quoteForms.forEach(quoteForm => {
  quoteForm.addEventListener('submit', async (evt) => {
    console.log('button clicked')
    evt.preventDefault(); // Prevent the default form submission behavior
  
    // Validate the inputs
    const email = quoteForm.email.value;
  
    if (!email) {
      // Check if any field is empty and display an error message
      alert('Please enter email');
      return;
    }
  
    const request = {
      email: quoteForm.email.value,
    };
  
    // Save the claim data to Firestore
    db.collection('quote-requests')
      .add(request)
      .then((docRef) => {
        console.log('request sent with ID: ', docRef.id);
        window.alert('Thank you for your request! An agent will contact you soon to provide you with a personalized insurance quote.')
        window.location.href = '/';
      })
      .catch((err) => console.error('Error saving request: ', err));
  });
});

  


// Check if the browser supports notifications
if ("Notification" in window) {
    // Request permission to show notifications
    Notification.requestPermission().then(function (permission) {
        if (permission === "granted") {
              // Create a new notification after a 5-second delay
            setTimeout(function () {
              var notification = new Notification("Welcome!", {
                  body: "Click here to log in to your MyInsuraZen online account",
                  icon: "./assets/img/logo-nobg.png",
              });

              // Handle notification click event
              notification.onclick = function () {
                  // Navigate to login.html
                  window.location.href = "login.html";
              };
          }, 4000); // 5000 milliseconds (5 seconds) delay
        }
    });
}


        





