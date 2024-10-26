function checkPassword() {
  const password = document.querySelector("#signPassword").value;
  const message = document.querySelector(".registerMessage");
  const submitButton = document.querySelector(".btnSubmit");
  const regex = /[!@#$%^&*(),.?":{}|<>]/;

  if (password.length < 6 || !regex.test(password)) {
    message.textContent =
      "Password must be at least 6 characters long and contain one special character.";
    message.style.color = "red";
    message.style.display = "block";
    submitButton.disabled = true;
  } else {
    message.style.display = "none";
    validatePassword(); // Call to check if passwords match after checking complexity
  }
}

function validatePassword() {
  const password = document.querySelector("#signPassword").value;
  const confirmPassword = document.querySelector("#confirm-password").value;
  const message = document.querySelector(".registerMessage");
  const submitButton = document.querySelector(".btnSubmit");

  if (password !== confirmPassword) {
    message.textContent = "Passwords do not match.";
    message.style.color = "red";
    message.style.display = "block";
    submitButton.disabled = true;
  } else {
    message.style.display = "none";
    submitButton.disabled = false;
    checkPassword();
  }
}

document
  .querySelector("#signPassword")
  .addEventListener("input", checkPassword);
document
  .querySelector("#confirm-password")
  .addEventListener("input", validatePassword);

async function register(event) {
  event.preventDefault(); // Prevent default form submission behavior
  try {
    const firstName = document.querySelector("#first-name").value;
    const lastName = document.querySelector("#last-name").value;
    const email = document.querySelector("#emailRegister").value;
    const password = document.querySelector("#signPassword").value;
    const marketing = document.querySelector("#marketing").checked;
    const messageBox = document.querySelector(".registerMessage");
    const formData = {
      firstName,
      lastName,
      email,
      password,
      marketing, // Include the checkbox value in your data
    };

    const response = await fetch("/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const result = await response.json();
    if (response.ok) {
      messageBox.textContent = result.message;
      messageBox.style.color = "green";
      messageBox.style.display = "block";
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    } else {
      messageBox.textContent = result.message;
      messageBox.style.color = "red";
      messageBox.style.display = "block";
    }
  } catch (error) {
    console.error("Error:", error);
  }
}
