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

// --------------------------------------------------------------------------------------
// For FAQs

// FAQ Smooth Animations
document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit to ensure Bootstrap is loaded
    setTimeout(() => {
        const faqQuestions = document.querySelectorAll('.faq-question');

        if (faqQuestions.length === 0) {
            console.log('No FAQ questions found');
            return;
        }

        console.log('FAQ initialized with', faqQuestions.length, 'questions');

        faqQuestions.forEach((question, index) => {
            question.addEventListener('click', function(e) {
                e.preventDefault();

                const target = this.getAttribute('data-bs-target');
                const answer = document.querySelector(target);
                const icon = this.querySelector('.faq-icon');

                if (!answer) {
                    console.log('Answer element not found for', target);
                    return;
                }

                // Check if Bootstrap is available
                if (typeof bootstrap === 'undefined') {
                    console.error('Bootstrap JS not loaded');
                    // Fallback: manual toggle
                    if (answer.style.display === 'none' || answer.style.display === '') {
                        answer.style.display = 'block';
                        answer.classList.add('show');
                        this.setAttribute('aria-expanded', 'true');
                    } else {
                        answer.style.display = 'none';
                        answer.classList.remove('show');
                        this.setAttribute('aria-expanded', 'false');
                    }
                    return;
                }

                // Use Bootstrap collapse
                let bsCollapse = bootstrap.Collapse.getInstance(answer);
                if (!bsCollapse) {
                    bsCollapse = new bootstrap.Collapse(answer, {
                        toggle: false
                    });
                }

                // Close other FAQs (optional)
                faqQuestions.forEach(otherQuestion => {
                    if (otherQuestion !== this) {
                        const otherTarget = otherQuestion.getAttribute('data-bs-target');
                        const otherAnswer = document.querySelector(otherTarget);

                        if (otherAnswer && otherAnswer.classList.contains('show')) {
                            let otherCollapse = bootstrap.Collapse.getInstance(otherAnswer);
                            if (otherCollapse) {
                                otherCollapse.hide();
                            }
                        }
                    }
                });

                // Toggle current FAQ
                bsCollapse.toggle();
            });
        });
    }, 100);
});
