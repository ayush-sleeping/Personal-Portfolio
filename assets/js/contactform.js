// --------------------------------------------------------------------------------------
//                Contact Form - script
const contactForm = document.getElementById("contact-form"),
  contactName = document.getElementById("contact-name"),
  contactEmail = document.getElementById("contact-email"),
  Message = document.getElementById("message"),
  contactMessage = document.getElementById("contact-message");

const sendEmail = (e) => {
  e.preventDefault();

  // Check if all fields have values
  if (contactName.value === "" || contactEmail.value === "" || Message.value === "") {
    // Add and remove color to indicate error
    contactMessage.classList.remove("color-light");
    contactMessage.classList.add("color-dark");
    // Show message
    contactMessage.textContent = "Please fill in all fields.";
  } else {
    // Send email via EmailJS
    emailjs
      .sendForm(
        "service_g3vv0sw",   // Service ID
        "template_wg7j2k6",  // Template ID
        "#contact-form",     // Form selector
        "0Vtn0gI9c1Ks3SZnC"  // Public Key
      )
      .then(
        () => {
          // Show success message and change color
          contactMessage.classList.remove("color-dark");
          contactMessage.classList.add("color-light");
          contactMessage.textContent = "Message successfully sent ✔";

          // Remove the message after 5 seconds
          setTimeout(() => {
            contactMessage.textContent = "";
          }, 5000);

          // Clear input fields after submission
          contactName.value = "";
          contactEmail.value = "";
          Message.value = "";
        },
        (error) => {
          // Log the error in the console for debugging
          console.error("Error sending email:", error);
          // Show error message and change color
          contactMessage.classList.remove("color-light");
          contactMessage.classList.add("color-dark");
          contactMessage.textContent = "Oops! Something went wrong. Please try again.";
        }
      );
  }
};

// Event listener for form submission
contactForm.addEventListener("submit", sendEmail);
