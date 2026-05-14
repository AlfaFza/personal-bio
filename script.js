const form = document.querySelector("#feedbackForm");
const helperText = document.querySelector("#helperText");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!form.checkValidity()) {
    helperText.textContent = "Please fill in your name, email, and message.";
    form.reportValidity();
    return;
  }

  const formData = new FormData(form);
  const payload = {
    name: formData.get("name").trim(),
    email: formData.get("email").trim(),
    mood: formData.get("mood"),
    message: formData.get("message").trim(),
  };

  helperText.textContent = "Saving your message...";

  try {
    const response = await fetch("/api/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Message could not be saved.");
    }

    form.reset();
    helperText.textContent = "Thank you. Your message was saved.";
  } catch (error) {
    helperText.textContent =
      "Message could not be saved. Please make sure the backend server is running.";
  }
});
