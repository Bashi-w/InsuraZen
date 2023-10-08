const form = document.getElementById('contactForm');

form.addEventListener('submit', async (evt) => {
    console.log('message button clicked')
    evt.preventDefault(); // Prevent the default form submission behavior
  
    // Validate the inputs
    const name = form.name.value;
    const email = form.email.value;
    const subject = form.subject.value;
    const message = form.message.value;
  
    if (!name || !email || !subject || !message) {
      // Check if any field is empty and display an error message
      alert('All fields are required. Please fill them out.');
      return;
    }
  
    const msg = {
      name: form.name.value,
      email: form.email.value,
      subject: form.subject.value,
      message: form.message.value,
    };
  

    // Save the message data to Firestore
    db.collection('messages')
      .add(msg)
      .then((docRef) => {
        console.log('Message sent with ID: ', docRef.id);
        window.alert('Message sent successfully.')
        window.location.href = '/';
      })
      .catch((err) => console.error('Error saving message: ', err));
  });
  