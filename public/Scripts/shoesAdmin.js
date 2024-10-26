function createMessage(message, isError = false) {
  const messageEl = document.querySelector(".message");
  messageEl.textContent = message;
  messageEl.style.color = isError ? "red" : "green";
  messageEl.style.display = "block";
}

function closeModal() {
  const modalEl = document.querySelector(".modal");
  const shoeName = document.querySelector("#shoeName");
  const shoeTitle = document.querySelector("#shoeTitle");
  const shoePrice = document.querySelector("#shoePrice");
  const shoeImage = document.querySelector("#shoeImage");
  const shoeGender = document.querySelector("#shoeGender");
  const errorMessageEl = document.querySelector(".errorModal");
  checkModalAddShoe;
  shoeName.value = "";
  shoeTitle.value = "";
  shoePrice.value = "";
  shoeImage.value = "";
  shoeGender.value = "";

  errorMessageEl.style.display = "none";
  modalEl.style.display = "none";
}

async function checkModalAddShoe() {
  const shoeName = document.querySelector("#shoeName");
  const shoeTitle = document.querySelector("#shoeTitle");
  const shoePrice = document.querySelector("#shoePrice");
  const shoeImage = document.querySelector("#shoeImage");
  const shoeGender = document.querySelector("#shoeGender");

  const errorMessageEl = document.querySelector(".errorModal");

  if (
    shoeName.value === "" ||
    shoeTitle.value === "" ||
    shoePrice.value === "" ||
    shoeImage.value === "" ||
    shoeGender.value === ""
  ) {
    errorMessageEl.textContent = "Please fill out all fields before submitting";
    errorMessageEl.style.color = "red";
    errorMessageEl.style.display = "block";
    errorMessageEl.style.textAlign = "left";
  } else if (shoePrice.value <= 0) {
    errorMessageEl.textContent = "Price cannot be non positive";
    errorMessageEl.style.color = "red";
    errorMessageEl.style.display = "block";
    errorMessageEl.style.textAlign = "left";
  } else if (
    shoeName.value !== "" &&
    shoeTitle.value !== "" &&
    shoePrice.value !== "" &&
    shoeImage.value !== "" &&
    shoeGender.value !== ""
  ) {
    const confirmation = confirm("Are you sure you want to add this shoe?");
    if (!confirmation) return;
    await addShoe(
      shoeName.value,
      shoeTitle.value,
      shoePrice.value,
      shoeImage.value,
      shoeGender.value
    );
  }
}

async function checkModalUpdateShoe() {
  const shoeName = document.querySelector("#shoeName");
  const shoeTitle = document.querySelector("#shoeTitle");
  const shoePrice = document.querySelector("#shoePrice");
  const shoeImage = document.querySelector("#shoeImage");
  const shoeGender = document.querySelector("#shoeGender");

  const errorMessageEl = document.querySelector(".errorModal");

  if (shoePrice.value <= 0 && shoePrice.value !== "") {
    errorMessageEl.textContent = "Price cannot be non positive";
    errorMessageEl.style.color = "red";
    errorMessageEl.style.display = "block";
    errorMessageEl.style.textAlign = "left";
  } else if (
    shoeName.value === "" &&
    shoeTitle.value === "" &&
    shoePrice.value === "" &&
    shoeImage.value === "" &&
    shoeGender.value === ""
  ) {
    createMessage("No change was made", false);
    const message = document.querySelector(".message");
    message.style.color = "orange";
    closeModal();
    return;
  } else {
    const confirmation = confirm("Are you sure you want to update this shoe?");
    if (!confirmation) return;
    updateShoe();
  }
}

function openModal(id) {
  const modalEl = document.querySelector(".modal");
  const modelTitleEl = document.querySelector("#modalTitle");
  const shoeId = document.querySelector("#shoeId");
  const modalHeader = modalEl.querySelector(".title h2");
  const btnEl = document.querySelector(".btnUpdateShoe");

  if (id !== 0) {
    const shoeName = document.querySelector(`[data-id="${id}"] h3`).textContent;
    shoeId.value = id;
    modelTitleEl.textContent = shoeName;
    modalHeader.textContent = "Update Shoe";
    btnEl.textContent = "Update Shoe";

    btnEl.setAttribute("onclick", "checkModalUpdateShoe()");
  } else {
    document.querySelector("#shoeName").required = true;
    document.querySelector("#shoeTitle").required = true;
    document.querySelector("#shoePrice").required = true;
    document.querySelector("#shoeImage").required = true;
    document.querySelector("#shoeGender").required = true;
    console.log("hihi")


    shoeId.value = "";
    modelTitleEl.textContent = "";
    modalHeader.textContent = "Add Shoe";
    btnEl.textContent = "Add Shoe +";
    btnEl.setAttribute("onclick", "checkModalAddShoe()");
  }

  modalEl.style.display = "block";
}

async function addShoe(shoeName, shoeTitle, shoePrice, shoeImage, shoeGender) {
  try {
    const response = await fetch("/addShoe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        shoeName,
        shoeTitle,
        shoeImage,
        shoePrice,
        shoeGender,
      }),
    });
    const result = await response.json();
    if (response.ok) {
      createMessage(result.message, false);
      closeModal();
      getAllShoes();
    } else {
      createMessage(result.message, true);
      closeModal();
    }
  } catch (error) {
    console.log(error);
    createMessage(result.message, true);
    closeModal();
  }
}

async function updateShoe() {
  try {
    const shoeId = document.querySelector("#shoeId").value;
    const shoeName = document.querySelector("#shoeName").value;
    const shoeTitle = document.querySelector("#shoeTitle").value;
    const shoePrice = document.querySelector("#shoePrice").value;
    const shoeImage = document.querySelector("#shoeImage").value;
    const shoeGender = document.querySelector("#shoeGender").value;

    const data = {
      shoeId,
      shoeName,
      shoeTitle,
      shoePrice,
      shoeImage,
      shoeGender,
    };

    const updatedData = {};

    if (shoeName) updatedData.name = shoeName;
    if (shoeTitle) updatedData.title = shoeTitle;
    if (shoeImage) updatedData.primaryImage = shoeImage;
    if (shoePrice) updatedData.price = shoePrice;
    if (shoePrice <= 0 && shoePrice !== "") {
      createMessage("Price cannot change to non-positive number", true);
      closeModal();
      return;
    }
    if (shoeGender) updatedData.gender = shoeGender;

    const response = await fetch("/updateShoe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ updatedData: updatedData, shoeId: shoeId }),
    });

    const result = await response.json();

    if (response.ok) {
      createMessage(result.message, false);
      closeModal();
      getAllShoes();
    } else {
      createMessage(result.message, true);
    }
  } catch (error) {
    console.log(error);
    createMessage(result.message, true);
  }
}

async function deleteShoe(shoeId) {
  try {
    const confirmation = confirm("Are you sure you want to delete this shoe?");
    if (!confirmation) return;
    const response = await fetch("/deleteShoe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ shoeId: shoeId }),
    });

    const result = await response.json();

    if (response.ok) {
      const shoe = document.querySelector(`[data-id = "${shoeId}"]`);
      if (shoe) {
        shoe.remove();
        createMessage(result.message, false);
      }
    } else {
      createMessage(result.message, true);
    }
  } catch (error) {
    console.log(error);
    createMessage(result.message, true);
  }
}

async function getAllShoes() {
  try {
    const response = await fetch("/getAllShoes", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    if (response.ok) {
      displayShoes(result.shoes);
    } else {
      createMessage(result.message, true);
    }
  } catch (error) {
    createMessage(result.message, true);
  }
}

async function findShoes() {
  try {
    const search = document.querySelector(".findInput").value;
    const response = await fetch("/findShoes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ search: search }),
    });

    const result = await response.json();

    if (response.ok) {
      createMessage(result.message, false);
      displayShoes(result.shoes);
    } else {
      createMessage(result.message, true);
    }
  } catch (error) {
    console.log(error);
    createMessage(result.message, true);
  }
}

function displayShoes(data) {
  const container = document.querySelector(".shoes-container");
  container.innerHTML = "";

  data.forEach((shoe) => {
    // Create the main shoe div
    const shoeDiv = document.createElement("div");
    shoeDiv.classList.add("shoe");
    shoeDiv.setAttribute("data-id", shoe._id);

    // Create and append the shoe image
    const shoeImage = document.createElement("img");
    shoeImage.src = shoe.primaryImage;
    shoeImage.alt = shoe.name;
    shoeDiv.appendChild(shoeImage);

    // Create and append the shoe name (h3)
    const shoeName = document.createElement("h3");
    shoeName.textContent = `${shoe.name} (${shoe.gender})`;
    shoeDiv.appendChild(shoeName);

    // Create and append the shoe title (p)
    const shoeTitle = document.createElement("p");
    shoeTitle.textContent = shoe.title;
    shoeDiv.appendChild(shoeTitle);

    // Create and append the price (p)
    const shoePrice = document.createElement("p");
    shoePrice.innerHTML = `<b>Price: </b>$${shoe.price}`;
    shoeDiv.appendChild(shoePrice);

    // Create the button container div
    const btnBox = document.createElement("div");
    btnBox.classList.add("btnShoesAdminBox");

    // Create delete button
    const deleteButton = document.createElement("button");
    deleteButton.classList.add("btnShoesAdmin", "btnShoesAdminDelete");
    deleteButton.textContent = "Delete Shoe";

    // Add event listener to delete button
    deleteButton.addEventListener("click", () => {
      deleteShoe(shoe._id);
    });

    btnBox.appendChild(deleteButton);

    // Create update button
    const updateButton = document.createElement("button");
    updateButton.classList.add("btnShoesAdmin", "btnShoesAdminUpdate");
    updateButton.textContent = "Update Shoe";

    // Set the onclick attribute to openModal with shoeId
    updateButton.setAttribute("onclick", `openModal('${shoe._id}')`);

    btnBox.appendChild(updateButton);

    // Append the button box to the shoe div
    shoeDiv.appendChild(btnBox);

    // Finally, append the shoe div to the container
    container.appendChild(shoeDiv);
  });
  
}

document.getElementById("shoes-form").addEventListener("submit", (event) => {
  event.preventDefault(); // Prevent default form submission
  findShoes(); // Call the findShoes function
});

window.onload = function () {
  getAllShoes();
};
