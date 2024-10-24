// Function to display both success and error messages
function createMessage(message, isError = false) {
  const messageEl = document.querySelector(".message");
  messageEl.textContent = message;
  messageEl.style.color = isError ? "red" : "green";
  messageEl.style.display = "block";
}

async function findUser() {
  try {
    const email = document.querySelector(".findUserInput");
    const response = await fetch("/find-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userEmail: email.value }),
    });

    const result = await response.json();
    if (response.ok) {
      if (result.array) displayUsers(result.user);
      else displayUsers([result.user]);
    } else {
      createMessage(result.message, true);
    }
    email.value = "";
  } catch (error) {
    console.error("Error fetching user", error);
  }
}

async function deleteUser(email) {
  const confirmation = confirm("Are you sure you want to delete this user?");
  if (!confirmation) return;

  try {
    const response = await fetch("/delete-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userEmail: email }),
    });
    const result = await response.json();

    if (response.ok) {
      const userEl = document.querySelector(`[data-email="${email}"]`);
      if (userEl) {
        userEl.remove();
        createMessage(result.message, false);
      }
    } else {
      createMessage(result.message || "Failed to delete the user.", true);
    }
  } catch (error) {
    console.error("Error:", error);
    createMessage("Failed to delete the user, please try again later", true);
  }
}

async function toggleAdmin(email) {
  const confirmation = confirm(
    "Are you sure you want to change the user's permissions?"
  );
  if (!confirmation) return;

  try {
    const response = await fetch("/toggle-admin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userEmail: email }),
    });

    const result = await response.json();
    if (response.ok) {
      createMessage(result.message, false);
      const userEl = document.querySelector(`[data-email="${email}"]`);
      const adminBox = userEl.children[2].children[1];
      if (result.admin) {
        userEl.children[0].children[0].style.fontWeight = 600;
        adminBox.textContent = "Yes";
      } else {
        userEl.children[0].children[0].style.fontWeight = 500;

        adminBox.textContent = "No";
      }
    } else {
      createMessage(
        result.message || "Failed to change user's permissions",
        true
      );
    }
  } catch (error) {
    console.error("Error:", error);
    createMessage(
      "Failed to change user's permissions, please try again later",
      true
    );
  }
}

async function toggleMarketing(email) {
  const confirmation = confirm(
    "Are you sure you want to change the user's preferences?"
  );
  if (!confirmation) return;
  try {
    const response = await fetch("/toggle-marketing", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userEmail: email }),
    });

    const result = await response.json();

    if (response.ok) {
      createMessage(result.message, false);
      const userEl = document.querySelector(`[data-email="${email}"]`);
      const marketing = userEl.children[3].children[0].children[1];
      if (result.marketing) marketing.textContent = "Yes";
      else marketing.textContent = "No";
    } else {
      createMessage(
        result.message || "Failed to change user's preferences",
        true
      );
    }
  } catch (error) {
    console.error("Error:", error);
    createMessage(
      "Failed to change user's preferences, please try again later",
      true
    );
  }
}
async function getAllUsers(isFirst = false) {
  try {
    const response = await fetch("/getUsers", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = await response.json();
    if (response.ok) {
      displayUsers(result.users);
      if (!isFirst) createMessage(result.message, false);
    } else {
      createMessage(result.message || "Failed to fetch all users", true);
    }
  } catch (error) {
    createMessage("Failed to fetch all users, please try again later", true);
  }
}

function displayUsers(users) {
  const userContainer = document.querySelector(".users-container"); // Replace with your actual container ID
  userContainer.innerHTML = ""; // Clear any existing content
  if (users && users.length > 0) {
    users.forEach((user) => {
      // Create the user-box element
      const userBox = document.createElement("div");
      userBox.classList.add("user-box");
      userBox.setAttribute("data-email", user.email);

      // Create the name-box element
      const nameBox = document.createElement("div");
      nameBox.classList.add("name-box");
      nameBox.innerHTML = `
        <p>
          <span>${user.firstName}</span> <span>${user.lastName}</span>
        </p>
      `;
      if (user.admin) {
        nameBox.style.fontWeight = 600;
      }
      // Create email, admin, and marketing fields
      const emailField = document.createElement("p");
      emailField.innerHTML = `<b>Email:</b><br />${user.email}`;

      const adminField = document.createElement("p");
      adminField.innerHTML = `<b>Admin:</b> <span>${
        user.admin ? "Yes" : "No"
      }</span>`;

      const marketingField = document.createElement("div");
      marketingField.style.display = "flex";
      marketingField.style.alignItems = "center";
      marketingField.innerHTML = `
        <p><b>Marketing:</b> <span>${user.marketing ? "Yes" : "No"}</span></p>
        <button class="btnMarketing" onclick="toggleMarketing('${user.email}')">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6" style="height: 18px; width: 18px; cursor: pointer">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3" />
          </svg>
        </button>
      `;

      // Create buttons for delete and toggle admin
      const btnBox = document.createElement("div");
      btnBox.classList.add("btn-box");
      btnBox.innerHTML = `
        <button class="btn btnDelete" onclick="deleteUser('${user.email}')">Delete User</button>
        <button class="btn btnUpdate" onclick="toggleAdmin('${user.email}')">Toggle Admin</button>
      `;

      // Append all elements to userBox
      userBox.appendChild(nameBox);
      userBox.appendChild(emailField);
      userBox.appendChild(adminField);
      userBox.appendChild(marketingField);
      userBox.appendChild(btnBox);

      // Append userBox to the main container
      userContainer.appendChild(userBox);
    });
  }
}
document.getElementById("users-form").addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent the default form submission
  findUser(); // Call the function to find the user
});
window.onload = function () {
  getAllUsers(true);
};
