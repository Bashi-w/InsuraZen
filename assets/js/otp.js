render();
function render(){
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
    recaptchaVerifier.render();
}

var coderesult;



//verifying phone number to check if it is a valid policy holders number
function phoneAuth() {
    var number = document.getElementById('number').value;
    var mnumber = document.getElementById('mnumber');
    mnumber.textContent = number;
    var db = firebase.firestore();
    var policyholdersRef = db.collection('policyholders');

    policyholdersRef.where('phoneNumber', '==', number)
        .get()
        .then(function (querySnapshot) {
            if (!querySnapshot.empty) {
                // Phone number exists in the database, retrieve the document ID
                querySnapshot.forEach(function (doc) {
                    var docId = doc.id;
                    window.policyholderId = docId;

                    // Proceed with sending OTP
                    firebase.auth().signInWithPhoneNumber(number, window.recaptchaVerifier)
                        .then(function (confirmationResult) {
                            coderesult = confirmationResult;
                            document.getElementById('sender').style.display = 'none';
                            document.getElementById('verifier').style.display = 'block';
                        })
                        .catch(function (error) {
                            alert(error.message);
                        });
                });
            } else {
                // Phone number not found in the database, show an error message
                alert("This mobile number is not registered with InsuraZen");
            }
        })
        .catch(function (error) {
            console.error("Error checking phone number in the database: ", error);
        });
}

//verify OTP code

function codeverifiy() {
var otpInputs = document.querySelectorAll('.otp-input'); // Select all OTP input fields
var code = Array.from(otpInputs).map(input => input.value).join(''); // Concatenate OTP values

coderesult.confirm(code)
.then(function () {
    document.getElementById('p-conf').style.display = 'block';
    document.getElementById('n-conf').style.display = 'none';

    // Redirect to the claim.html page with the policyholderId as a URL parameter
    var policyholderId = window.policyholderId;
    window.location.href = 'claim.html?policyholderId=' + policyholderId;
    console.log(policyholderId);
})
.catch(function () {
    document.getElementById('p-conf').style.display = 'none';
    document.getElementById('n-conf').style.display = 'block';
})
}

function handleOTPInput(currentInput, nextInput) {
    // Limit input to a single digit
    if (currentInput.value.length > 1) {
        currentInput.value = currentInput.value.slice(0, 1);
    }

    // Move cursor to the next input field
    if (currentInput.value.length === 1) {
        nextInput.focus();
    }
}

// Attach event listeners to OTP input fields
const otpInputs = document.querySelectorAll('.otp-input');
otpInputs.forEach(function (input, index, inputs) {
const nextInput = index < inputs.length - 1 ? inputs[index + 1] : null;
const prevInput = index > 0 ? inputs[index - 1] : null;

input.addEventListener('input', function () {
handleOTPInput(input, nextInput);
});

input.addEventListener('keydown', function (event) {
if (event.key === 'Backspace' && input.value === '' && prevInput) {
    prevInput.value = '';
    prevInput.focus();
}
});
});