// --------------------------------------------------------------------------------------
//                Contact Form - script

// Apps Script write path. Submissions are logged to the `contact_submissions`
// tab of the portfolio-cms sheet, in parallel with the EmailJS send.
//
// Both are deliberate: EmailJS gives a real-time inbox alert (200/mo free),
// the sheet gives a browsable history that outlives the inbox. Fill these in
// after deploying sheets/apps-script/Code.gs as a Web App. While
// APPS_SCRIPT_URL is empty the sheet logging is skipped and the form behaves
// exactly as it did before.
const APPS_SCRIPT_URL = "";              // e.g. https://script.google.com/macros/s/AKfyc.../exec
const SHARED_TOKEN    = "";              // must match the TOKEN script property

// Fire-and-forget: the sheet is a secondary record, so a failure here must
// never block or fail the visitor's submission.
function logToSheet(form) {
  if (!APPS_SCRIPT_URL) return;
  try {
    const fd = new FormData(form);
    fd.append("token", SHARED_TOKEN);
    fd.append("userAgent", navigator.userAgent);
    fd.append("page", location.pathname);
    // FormData sends multipart/form-data, a "simple request" — no CORS
    // preflight, which Apps Script handles badly. Do not switch to JSON.
    fetch(APPS_SCRIPT_URL, { method: "POST", body: fd, mode: "no-cors" })
      .catch(() => { /* secondary path — ignore */ });
  } catch (err) {
    console.warn("sheet log skipped:", err);
  }
}
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
    // Honeypot: hidden from real visitors, filled in by naive bots.
    const honey = contactForm.elements.honey;
    if (honey && honey.value !== "") return;

    // 1) Log to the sheet (non-blocking)
    logToSheet(contactForm);

    // 2) Send email via EmailJS (existing path, unchanged)
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
function initFaqAccordion() {
    // Wait a bit to ensure Bootstrap is loaded
    setTimeout(() => {
        const faqQuestions = document.querySelectorAll('.faq-question');

        if (faqQuestions.length === 0) {
            console.log('No FAQ questions found');
            return;
        }

        console.log('FAQ initialized with', faqQuestions.length, 'questions');

        faqQuestions.forEach((question, index) => {
            // Items re-rendered from the sheet must not stack duplicate handlers.
            if (question.dataset.faqBound === 'true') return;
            question.dataset.faqBound = 'true';

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
}

document.addEventListener('DOMContentLoaded', initFaqAccordion);

// FAQ items rendered from the sheet arrive after DOMContentLoaded, so bind again.
document.addEventListener('content:rendered', function (e) {
    if (e.detail && e.detail.name === 'faqs') initFaqAccordion();
});
