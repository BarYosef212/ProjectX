  async function updateBranch() {
    try {
      const branchId = document.querySelector("#branchId").value;
      const branchName = document.querySelector("#branchName").value;
      const bussinessHours = document.querySelector("#bussinessHour").value;
      const branchPhone = document.querySelector("#phoneNumber").value;
      const branchAddress = document.querySelector("#storeAddress").value;
      const coordinate_x = document.querySelector("#coordinate_x").value;
      const coordinate_y = document.querySelector("#coordinate_y").value;
      const data = {
        branchId,
        branchName,
        bussinessHours,
        branchAddress,
        branchPhone,
        coordinate_x,
        coordinate_y,
      };

      const updatedData = {};

      if (branchName) updatedData.branchName = branchName;
      if (bussinessHours) updatedData.bussinessHours = bussinessHours;
      if (branchAddress) updatedData.branchAddress = branchAddress;
      if (branchPhone) updatedData.branchPhone = branchPhone;
      if (coordinate_x || coordinate_y) {
        updatedData.location = {}; 
        if (coordinate_x) updatedData.location.coordinate_x = coordinate_x;
        if (coordinate_y) updatedData.location.coordinate_y = coordinate_y;
      }

      const response = await fetch("/updateBranch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ updatedData: updatedData, branchId: branchId }),
      });

      const result = await response.json();

      if (response.ok) {
        createMessage(result.message, false);
        closeModal();
        const branchEl = document.querySelector(`[data-id="${branchId}"]`);
        getAllBranches();
      } else {
        createMessage(result.message, true);
      }
    } catch (error) {
      console.log(error);
      createMessage(result.message, true);
    }
  }

  async function checkModalUpdateBranch() {
    const branchName = document.querySelector("#branchName");
    const bussinessHours = document.querySelector("#bussinessHour");
    const branchPhone = document.querySelector("#phoneNumber");
    const branchAddress = document.querySelector("#storeAddress");
    const coordinate_x = document.querySelector("#coordinate_x");
    const coordinate_y = document.querySelector("#coordinate_y");
    const errorMessageEl = document.querySelector(".errorModal");

    if (branchPhone.value <= 0 && branchPhone.value !== "") {
      errorMessageEl.textContent = "Phone number cannot be negative";
      errorMessageEl.style.color = "red";
      errorMessageEl.style.display = "block";
      errorMessageEl.style.textAlign = "left";
    } else if (branchPhone.value.length < 9 && branchPhone.value !== "") {
      errorMessageEl.textContent = "Phone number too short";
      errorMessageEl.style.color = "red";
      errorMessageEl.style.display = "block";
      errorMessageEl.style.textAlign = "left";
    } else if (
      branchName.value === "" &&
      bussinessHours.value === "" &&
      branchPhone.value === "" &&
      branchAddress.value === "" &&
      coordinate_x.value === "" &&
      coordinate_y.value === ""
    ) {
      createMessage("No change was made", false);
      const message = document.querySelector(".message");
      message.style.color = "orange";
      closeModal();
      return;
    } else {
      const confirmation = confirm(
        "Are you sure you want to update this branch?"
      );
      if (!confirmation) return;
      updateBranch();
    }
  }

  async function checkModalAddBranch() {
    const branchName = document.querySelector("#branchName");
    const bussinessHour = document.querySelector("#bussinessHour");
    const phoneNumber = document.querySelector("#phoneNumber");
    const storeAddress = document.querySelector("#storeAddress");
    const coordinate_x = document.querySelector("#coordinate_x");
    const coordinate_y = document.querySelector("#coordinate_y");
    const errorMessageEl = document.querySelector(".errorModal");

    if (
      branchName.value === "" ||
      bussinessHour.value === "" ||
      phoneNumber.value === "" ||
      storeAddress.value === "" ||
      coordinate_x.value === "" ||
      coordinate_y.value === ""
    ) {
      errorMessageEl.textContent =
        "Please fill out all fields before submitting";
      errorMessageEl.style.color = "red";
      errorMessageEl.style.display = "block";
      errorMessageEl.style.textAlign = "left";
    } else if (phoneNumber.value.length < 9) {
      errorMessageEl.textContent = "Phone number too short";
      errorMessageEl.style.color = "red";
      errorMessageEl.style.display = "block";
      errorMessageEl.style.textAlign = "left";
    } else if (phoneNumber.value < 0) {
      errorMessageEl.textContent = "Phone number cannot be negative";
      errorMessageEl.style.color = "red";
      errorMessageEl.style.display = "block";
      errorMessageEl.style.textAlign = "left";
    } else if (
      branchName.value !== "" &&
      bussinessHour.value !== "" &&
      phoneNumber.value !== "" &&
      storeAddress.value !== "" &&
      coordinate_x.value !== "" &&
      coordinate_y.value !== ""
    ) {
      errorMessageEl.style.display = "none";
      const confirmation = confirm("Are you sure you want to add this branch?");
      if (!confirmation) return;
      await addBranch(
        branchName.value,
        bussinessHour.value,
        storeAddress.value,
        phoneNumber.value,
        coordinate_x.value,
        coordinate_y.value
      );
    }
  }

  function openModal(id) {
    const modalEl = document.querySelector(".modal");
    const modelTitleEl = document.querySelector("#modalTitle");
    const branchId = document.querySelector("#branchId");
    const modalHeader = modalEl.querySelector(".title h2");
    const btnEl = document.querySelector(".btnUpdateBranch");

    if (id !== 0) {
      const branchName = document.querySelector(
        `[data-id="${id}"] h3`
      ).textContent;
      branchId.value = id;
      modelTitleEl.textContent = branchName;
      modalHeader.textContent = "Update Branch";
      btnEl.textContent = "Update Branch";

      btnEl.setAttribute("onclick", "checkModalUpdateBranch()");
    } else {
      document.querySelector("#branchName").required = true;
      document.querySelector("#bussinessHour").required = true;
      document.querySelector("#phoneNumber").required = true;
      document.querySelector("#storeAddress").required = true;
      document.querySelector("#coordinate_x").required = true;
      document.querySelector("#coordinate_y").required = true;
      branchId.value = "";
      modelTitleEl.textContent = "";
      modalHeader.textContent = "Add Branch";
      btnEl.textContent = "Add Branch +";
      btnEl.setAttribute("onclick", "checkModalAddBranch()");
    }
    modalEl.style.display = "block";
  }

  function closeModal() {
    const modalEl = document.querySelector(".modal");
    const branchName = document.querySelector("#branchName");
    const bussinessHour = document.querySelector("#bussinessHour");
    const phoneNumber = document.querySelector("#phoneNumber");
    const storeAddress = document.querySelector("#storeAddress");
    const coordinate_x = document.querySelector("#coordinate_x");
    const coordinate_y = document.querySelector("#coordinate_y");
    const errorMessageEl = document.querySelector(".errorModal");

    branchName.value = "";
    bussinessHour.value = "";
    phoneNumber.value = "";
    storeAddress.value = "";
    coordinate_x.value = "";
    coordinate_y.value = "";

    errorMessageEl.style.display = "none";
    modalEl.style.display = "none";
  }

  function createMessage(message, isError = false) {
    const messageEl = document.querySelector(".message");
    messageEl.textContent = message;
    messageEl.style.color = isError ? "red" : "green";
    messageEl.style.display = "block";
  }

  async function addBranch(
    branchName,
    branchHours,
    branchPhone,
    brachAddress,
    coordinate_x,
    coordinate_y
  ) {
    try {
      const response = await fetch("/addBranch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          branchName,
          branchHours,
          branchPhone,
          brachAddress,
          coordinate_x,
          coordinate_y,
        }),
      });
      const result = await response.json();
      if (response.ok) {
        const branches = await getAllBranches();
        createMessage(result.message, false);
        closeModal();
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

  async function deleteBranch(branchId) {
    try {
      const confirmation = confirm(
        "Are you sure you want to delete this branch?"
      );
      if (!confirmation) return;
      const response = await fetch("/deleteBranch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ branchId: branchId }),
      });

      const result = await response.json();

      if (response.ok) {
        const branch = document.querySelector(`[data-id = "${branchId}"]`);
        if (branch) {
          branch.remove();
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

  async function getAllBranches() {
    try {
      const response = await fetch("/getAllBranches", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();

      if (response.ok) {
        displayBranches(result.branches);
      } else {
        createMessage(result.message, true);
      }
    } catch (error) {
      createMessage(result.message, true);
    }
  }

  async function findBranches() {
    try {
      const search = document.querySelector(".findInput");
      const response = await fetch("/findBranches", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ search: search.value }),
      });

      const result = await response.json();

      if (response.ok) {
        createMessage(result.message, false);
        displayBranches(result.branches);
      } else {
        createMessage(result.message, true);
      }
    } catch (error) {
      console.log(error);
      createMessage(result.message, true);
    }
  }

  function displayBranches(data) {
    const container = document.querySelector(".branches-container");
    container.innerHTML = "";

    data.forEach((branch) => {
      // Create the main branch div
      const branchDiv = document.createElement("div");
      branchDiv.classList.add("branch");
      branchDiv.setAttribute("data-id", branch._id);

      // Create and append the branch name (h3)
      const branchName = document.createElement("h3");
      branchName.innerHTML = `<b>${branch.branchName}</b>`;
      branchDiv.appendChild(branchName);

      // Create and append the business hours (p)
      const businessHours = document.createElement("p");
      businessHours.innerHTML = `<b>Business Hours:</b> ${branch.bussinessHours}`;
      branchDiv.appendChild(businessHours);

      // Create and append the phone number (p)
      const phoneNumber = document.createElement("p");
      phoneNumber.innerHTML = `<b>Phone:</b> ${branch.branchPhone}`;
      branchDiv.appendChild(phoneNumber);

      // Create and append the store address (p)
      const storeAddress = document.createElement("p");
      storeAddress.innerHTML = `<b>Store Address:</b> ${branch.branchAddress}`;
      branchDiv.appendChild(storeAddress);

      // Create and append the coordinates (p)
      const coordinates = document.createElement("p");
      coordinates.innerHTML = `<b>Coordinates:</b> X: ${branch.location.coordinate_x}, Y: ${branch.location.coordinate_y}`;
      branchDiv.appendChild(coordinates);

      // Create the button container div
      const btnBox = document.createElement("div");
      btnBox.classList.add("btnBoxBranchAdmin");

      // Create delete button
      const deleteButton = document.createElement("button");
      deleteButton.classList.add("btnBranchAdminDelete", "btnBranchAdmin");
      deleteButton.textContent = "Delete Branch";
      deleteButton.setAttribute("onclick", `deleteBranch('${branch._id}')`);
      btnBox.appendChild(deleteButton);

      // Create update button
      const updateButton = document.createElement("button");
      updateButton.classList.add("btnBranchAdminUpdate", "btnBranchAdmin");
      updateButton.textContent = "Update Branch";
      updateButton.setAttribute("onclick", `openModal('${branch._id}')`);
      btnBox.appendChild(updateButton);

      // Append the button box to the branch div
      branchDiv.appendChild(btnBox);

      // Ensure the button box is at the bottom of the card
      branchDiv.style.display = "flex";
      branchDiv.style.flexDirection = "column";
      branchDiv.style.justifyContent = "space-between";

      // Finally, append the branch div to the container
      container.appendChild(branchDiv);
    });
  }

  document.getElementById("branch-form").addEventListener("submit", (event) => {
    event.preventDefault();
    findBranches();
  });

  window.onload = function () {
    getAllBranches();
  };