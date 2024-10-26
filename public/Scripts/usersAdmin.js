// Function to display both success and error messages
function createMessage(message, isError = false) {
  const messageEl = document.querySelector(".message");
  messageEl.textContent = message;
  messageEl.style.color = isError ? "red" : "green";
  messageEl.style.display = "block";
}

function openModal(email) {
  const modalEl = document.querySelector(".modal");
  const modelTitleEl = document.querySelector("#modalTitle");
  const modalHeader = modalEl.querySelector(".title h2");
  const btnEl = document.querySelector(".btnUpdateUser");

  if (email) {
    document.querySelector("#emailModal").value = email;
    const userName = document.querySelector(`[data-email="${email}"]`);
    modelTitleEl.textContent =
      userName.children[0].children[0].children[0].textContent +
      " " +
      userName.children[0].children[0].children[1].textContent;
    modalHeader.textContent = "Update User";
    btnEl.textContent = "Update User";

    btnEl.setAttribute("onclick", "checkModalUpdateUser()");
  } else {
    document.querySelector("#userName").required = true;
    document.querySelector("#userLastName").required = true;
    document.querySelector("#userEmail").required = true;
    document.querySelector("#userAdmin").required = true;
    document.querySelector("#marketing").required = true;
    modelTitleEl.textContent = "";
    modalHeader.textContent = "Add User";
    btnEl.textContent = "Add User +";
    btnEl.setAttribute("onclick", "checkModalAddUser()");
  }

  modalEl.style.display = "block";
}

function closeModal() {
  const modalEl = document.querySelector(".modal");
  const userName = document.querySelector("#userName");
  const userLastName = document.querySelector("#userLastName");
  const userEmail = document.querySelector("#userEmail");
  const userAdmin = document.querySelector("#userAdmin");
  const marketing = document.querySelector("#marketing");
  const errorMessageEl = document.querySelector(".errorModal");

  userName.value = "";
  userLastName.value = "";
  userEmail.value = "";
  userAdmin.value = "";
  marketing.value = "";
  userPassword.value = "";

  errorMessageEl.style.display = "none";
  modalEl.style.display = "none";
}

async function checkModalUpdateUser() {
  console.log("enter");

  const userName = document.querySelector("#userName");
  const userLastName = document.querySelector("#userLastName");
  const userEmail = document.querySelector("#userEmail");
  const userAdmin = document.querySelector("#userAdmin");
  const userPassword = document.querySelector("#userPassword");
  const marketing = document.querySelector("#marketing");
  const errorMessageEl = document.querySelector(".errorModal");
  const regex = /[!@#$%^&*(),.?":{}|<>]/;

  if (
    userName.value === "" &&
    userLastName.value === "" &&
    userEmail.value === "" &&
    userAdmin.value === "" &&
    userPassword.value === "" &&
    marketing.value === ""
  ) {
    createMessage("No change was made", false);
    const message = document.querySelector(".message");
    message.style.color = "orange";
    closeModal();
    return;
  } else if (userPassword.value !== "" && (userPassword.value.length < 6 || !regex.test(userPassword.value))) {
    console.log("2");
    errorMessageEl.textContent =
      "Password must be at least 6 characters long and contain one special character.";
    errorMessageEl.style.color = "red";
    errorMessageEl.style.display = "block";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail.value) && userEmail.value !== ""
  ) {
    console.log("3");
    errorMessageEl.textContent = "Please enter a valid email address.";
    errorMessageEl.style.color = "red";
    errorMessageEl.style.display = "block";
    return;
  } else {
    console.log("4");
    const confirmation = confirm("Are you sure you want to update this user?");
    if (!confirmation) return;
    updateUser();
  }
}
async function updateUser(req,res) {
  try {
    const userUpdateEmail = document.querySelector("#emailModal").value;
    const userName = document.querySelector("#userName").value;
    const userLastName = document.querySelector("#userLastName").value;
    const userEmail = document.querySelector("#userEmail").value;

    const userPassword = document.querySelector("#userPassword").value;
    let userAdmin = document.querySelector("#userAdmin").value;
    if(userAdmin === "admin" || userAdmin=== "notAdmin"){
      userAdmin = (document.querySelector("#userAdmin").value === "admin")? true:false;
    }
    let marketing = document.querySelector("#marketing").value;
    if(marketing === "Yes" || marketing=== "No"){
      marketing = (document.querySelector("#marketing").value === "Yes")? true:false;
    }
    const message = document.querySelector(".errorModal");
    const submitButton = document.querySelector(".btnUpdateUser");

    const updatedData = {};

    if (userName) updatedData.firstName = userName;
    if (userLastName) updatedData.lastName = userLastName;
    if (userEmail) updatedData.email = userEmail;
    if (userPassword) updatedData.password = userPassword;
    if (userAdmin!=="") updatedData.admin = userAdmin;
    if (marketing!=="") updatedData.marketing = marketing;
    console.log("the data:",updatedData)

    const response = await fetch("/updateUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        updatedData: updatedData,
        email: userUpdateEmail,
      }),
    });

    const result = await response.json();

    if (response.ok) {
      createMessage(result.message, false);
      closeModal();
      getAllUsers(true);
     
      
    } else {
      message.textContent = result.message;
      message.style.color = "red";
      message.style.display = "block";
    }
  } catch (error) {
    console.log(error);
    createMessage("An error occurred while updating the user.", true);
    closeModal();
  }
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
      `;

      // Create buttons for delete and toggle admin
      const btnBox = document.createElement("div");
      btnBox.classList.add("btnUserAdminBox");
      btnBox.innerHTML = `
          <button class="btn btnUserAdminDelete" onclick="deleteUser('${user.email}')">Delete User</button>
          <button class="btn btnUserAdminUpdate" onclick="openModal('${user.email}')">Update User</button>
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

document
  .getElementById("users-form")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the default form submission
    findUser(); // Call the function to find the user
  });
window.onload = function () {
  getAllUsers(true);
};
