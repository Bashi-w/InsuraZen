
// Function to get URL parameters by name
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// Get the policyholderId from the URL parameter
var policyholderId = getUrlParameter('policyholderId');


console.log('Policyholder ID:', policyholderId);

// Multi step claim form

const prevBtns = document.querySelectorAll(".btn-prev");
const nextBtns = document.querySelectorAll(".btn-next");
const progress = document.getElementById("progress");
const formSteps = document.querySelectorAll(".form-step");
const progressSteps = document.querySelectorAll(".progress-step");

let formStepsNum = 0;

nextBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    formStepsNum++;
    updateFormSteps();
    updateProgressbar();
  });
});

prevBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    formStepsNum--;
    updateFormSteps();
    updateProgressbar();
  });
});

function updateFormSteps() {
  formSteps.forEach((formStep) => {
    formStep.classList.contains("form-step-active") &&
      formStep.classList.remove("form-step-active");
  });

  formSteps[formStepsNum].classList.add("form-step-active");
}

function updateProgressbar() {
  progressSteps.forEach((progressStep, idx) => {
    if (idx < formStepsNum + 1) {
      progressStep.classList.add("progress-step-active");
    } else {
      progressStep.classList.remove("progress-step-active");
    }
  });

  const progressActive = document.querySelectorAll(".progress-step-active");

  progress.style.width =
    ((progressActive.length - 1) / (progressSteps.length - 1)) * 100 + "%";
}


const storage = firebase.storage();

//Storing claim to firestore
const form = document.getElementById('claimForm');
form.addEventListener('submit', async (evt) => {
  console.log('clicked')
  evt.preventDefault(); // Prevent the default form submission behavior

  // Validate the inputs
  const nic = form.nic.value;
  const pnum = form.pnum.value;
  const email = form.email.value;
  const date = form.date.value;
  const time = form.time.value;
  const location = form.location.value;
  const description = form.description.value;

  if (!nic || !pnum || !email || !date || !time || !location || !description) {
    // Check if any field is empty and display an error message
    alert('All fields are required. Please fill them out.');
    return;
  }

  const claim = {
    nic: form.nic.value,
    policyNumber: form.pnum.value,
    policyHolderID : policyholderId,
    email: form.email.value,
    date: form.date.value,
    time: form.time.value,
    location: form.location.value,
    description: form.description.value,
    comment: form.comment.value,
    Status: 'Pending',
  };

    // Upload documents to Firebase Storage
    const docFiles = document.getElementById('doc').files; // Get all selected files
  const docUrls = [];

  for (let i = 0; i < docFiles.length; i++) {
    const docFile = docFiles[i];
    const docStorageRef = storage.ref('claim_documents/' + docFile.name);
    await docStorageRef.put(docFile);
    const docUrl = await docStorageRef.getDownloadURL();
    docUrls.push(docUrl);
  }

  claim.documentUrls = docUrls; // Store an array of document URLs

  // Upload media files to Firebase Storage

  const mediaFiles = document.getElementById('media').files; // Get all selected files
  const mediaUrls = [];

  for (let i = 0; i < mediaFiles.length; i++) {
    const mediaFile = mediaFiles[i];
    const mediaStorageRef = storage.ref('claim_media/' + mediaFile.name);
    await mediaStorageRef.put(mediaFile);
    const mediaUrl = await mediaStorageRef.getDownloadURL();
    mediaUrls.push(mediaUrl);
  }

  claim.mediaUrls = mediaUrls; // Store an array of media URLs

  // Save the claim data to Firestore
  db.collection('claims')
    .add(claim)
    .then((docRef) => {
      console.log('Claim saved with ID: ', docRef.id);
      window.alert('Claim saved successfully.')
      window.location.href = '/';
    })
    .catch((err) => console.error('Error saving claim: ', err));
});



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

//Geolocation 
function geoFindMe() {
    const status = document.querySelector("#status");
    const mapLink = document.querySelector("#map-link");

    mapLink.href = "";
    mapLink.textContent = "";

    function success(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    status.textContent = "";
    mapLink.href = `https://www.google.com/maps?q=${latitude},${longitude}`;
    mapLink.textContent = `Latitude: ${latitude} °, Longitude: ${longitude} °`;
    }

    function error() {
    status.textContent = "Unable to retrieve your location";
    }

    if (!navigator.geolocation) {
    status.textContent = "Geolocation is not supported by your browser";
    } else {
    status.textContent = "Locating…";
    navigator.geolocation.getCurrentPosition(success, error, { enableHighAccuracy: true });
    }
}

document.querySelector("#find-me").addEventListener("click", geoFindMe);

