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
  helperText.textContent = "Sending your message securely...";

  const formData = new FormData(form);

  const payload = {
    name: formData.get("name").trim(),
    email: formData.get("email").trim(),
    mood: formData.get("mood"),
    message: formData.get("message").trim(),
  };

  try {
    // Send to Web3Forms
    const web3Response = await fetch(
      "https://api.web3forms.com/submit",
      {
        method: "POST",
        body: formData,
      }
    );

    const web3Data = await web3Response.json();

    if (!web3Data.success) {
      throw new Error(web3Data.message || "Web3Forms failed.");
    }

    // Optional: Send to your own backend
    const backendResponse = await fetch("/api/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const backendData = await backendResponse.json();

    if (!backendResponse.ok) {
      throw new Error(
        backendData.error || "Backend save failed."
      );
    }

    helperText.textContent =
      "Thank you! Your message was sent and saved.";

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
