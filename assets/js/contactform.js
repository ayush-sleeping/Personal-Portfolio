
// --------------------------------------------------------------------------------------
//                Contact Form - script

const contactForm = document.getElementById("contact-form"),
  contactName = document.getElementById("contact-name"),
  contactEmail = document.getElementById("contact-email"),
  Message = document.getElementById("message"),
  contactMessage = document.getElementById("contact-message");

const sendEmail = (e) => {
  e.preventDefault();

  // check if the field has a value
  if (
    contactName.value === "" ||
    contactEmail.value === "" ||
    Message.value === ""
  ) {
    // add and remove color
    contactMessage.classList.remove("color-Light");
    contactMessage.classList.add("color-dark");

    //show message
    contactMessage.textContent = "Write all input fields";
  } else {
    // serviceID - templateID - #form - publickey
    emailjs
      .sendForm(
        "service_g3vv0sw",
        "template_wg7j2k6",
        "#contact-form",
        "J3Z0vr8I1YhFxVstT"
      )
      .then(
        () => {
          //show message and add color
          contactMessage.classList.add("color-light");
          contactMessage.textContent = "Message successfully sent ✔";

          //remove message after 5 seconds
          setTimeout(() => {
            contactMessage.textContent = "";
          }, 5000);
        },
        (error) => {
          alert("OOPs! Something went wrong...", error);
        }
      );

    // clear input fields
    contactName.value = "";
    contactEmail.value = "";
    Message.value = "";
  }
};

contactForm.addEventListener("submit", sendEmail);
