const form = document.querySelector("#feedbackForm");
const helperText = document.querySelector("#helperText");
const submitBtn = form.querySelector('button[type="submit"]');

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!form.checkValidity()) {
    helperText.textContent =
      "Please fill in your name, email, and message.";

    form.reportValidity();
    return;
  }

  const originalText = submitBtn.textContent;

  submitBtn.textContent = "Sending...";
  submitBtn.disabled = true;

  helperText.textContent =
    "Sending your message securely...";

  try {
    const formData = new FormData(form);

    const response = await fetch(
      "https://api.web3forms.com/submit",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();

    if (!data.success) {
      throw new Error(
        data.message || "Message sending failed."
      );
    }

    helperText.textContent =
      "Thank you! Your message was sent successfully.";

    alert("Success! Your message has been sent.");

    form.reset();

  } catch (error) {
    console.error(error);

    helperText.textContent =
      error.message || "Something went wrong.";

    alert(error.message || "Something went wrong.");

  } finally {
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }
});
