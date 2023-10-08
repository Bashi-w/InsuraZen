// Function to handle bookmarking a plan and saving it to local storage
function handleBookmarkClick(event) {
    const planName = event.target.getAttribute("data-plan"); // Get the plan name from the data-plan attribute
    const planLink = event.target.getAttribute("data-link");
    console.log(planName);

    // Check if a user is logged in
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            const isEmailPasswordProvider = user.providerData.some(provider => provider.providerId === "password");
            const isGoogleProvider = user.providerData.some(provider => provider.providerId === "google.com");

            if (isEmailPasswordProvider || isGoogleProvider) {
                // User is signed in with email/password, log the user's ID to the console
                console.log("User ID:", user.uid);

                // Initialize the plans array from local storage
                let savedPlans = [];
                if ("savedPlans" in localStorage) {
                    savedPlans = JSON.parse(localStorage.getItem("savedPlans"));
                }

                // Check if the plan is already saved
                const existingPlanIndex = savedPlans.findIndex(plan => plan.planName === planName && plan.userId === user.uid);

                if (existingPlanIndex === -1) {
                    // If the plan is not already saved, add it to the array
                    savedPlans.push({ planName,planLink, userId: user.uid });

                    // Save the updated plans array to local storage
                    localStorage.setItem("savedPlans", JSON.stringify(savedPlans));

                    // Change the color of the bookmark (you can customize this)
                    changeBookmarkColor(planName);

                    alert('Plan bookmarked successfully.');
                } else {
                    // Plan is already bookmarked, remove it from local storage and reset the button color
                    savedPlans.splice(existingPlanIndex, 1);
                    localStorage.setItem("savedPlans", JSON.stringify(savedPlans));

                    // Change the color of the bookmark button back to default (ghostwhite)
                    resetBookmarkColor(planName);

                    alert('Plan removed from bookmarks.');
                }
            } else {
                // User is signed in with a different method
                console.log("User is signed in with a different provider");
                window.location.href = "login.html";
            }
        } else {
            // User is not logged in, display an alert
            alert("Please log in to My Insurazen.");
        }
    });
}

// Function to change the color of the bookmark button
function changeBookmarkColor(planName) {
    // Change the color of the bookmark button (you can customize this)
    const bookmarkButtons = document.querySelectorAll(".bookmark");
    bookmarkButtons.forEach(button => {
        const buttonPlanName = button.getAttribute("data-plan");
        if (buttonPlanName === planName) {
            button.style.backgroundColor = "#c3e0c4"; 
        }
    });
}

// Function to reset the bookmark button color to default (ghostwhite)
function resetBookmarkColor(planName) {
    // Reset the color of the bookmark button to default (ghostwhite)
    const bookmarkButtons = document.querySelectorAll(".bookmark");
    bookmarkButtons.forEach(button => {
        const buttonPlanName = button.getAttribute("data-plan");
        if (buttonPlanName === planName) {
            button.style.backgroundColor = "ghostwhite"; // Set to default color
        }
    });
}

    // Attach event listeners to bookmark buttons
    const bookmarkButtons = document.querySelectorAll(".bookmark");
    bookmarkButtons.forEach(button => {
        button.addEventListener("click", handleBookmarkClick);
    });



    // Function to load saved plans and set background colors
function loadSavedPlans() {
    // Initialize the plans array from local storage
    let savedPlans = [];
    if ("savedPlans" in localStorage) {
        savedPlans = JSON.parse(localStorage.getItem("savedPlans"));
    }

    // Change the background color of bookmark buttons for saved plans
    savedPlans.forEach(savedPlan => {
        changeBookmarkColor(savedPlan.planName);
    });
}

// Call the function to load saved plans when the page loads
window.addEventListener("load", loadSavedPlans);