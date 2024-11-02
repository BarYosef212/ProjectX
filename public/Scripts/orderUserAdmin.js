const errMsgModal = document.querySelector(".errMsgModal");
const userIdStorage = localStorage.getItem("userId");

function calculateTotalPrice() {
  const data = document.querySelectorAll(".update-item");
  let totalPrice = 0;
  let found = false;
  data.forEach((item) => {
    const price = parseInt(
      item.querySelector(".item-info").children[1].textContent.slice(1)
    );
    const quantity = parseInt(item.querySelector(".quantity-input").value);
    if (quantity < 1) {
      errMsgModal.textContent = "Quantity cannot be less then 1";
      found = true;
      return totalPrice;
    }
    totalPrice += price * quantity;
  });
  if (found === true) {
    return -1;
  }
  return totalPrice;
}

const userName = localStorage.getItem("userFullName");
document.querySelector("title").textContent = `Orders: ${userName}`;
document.querySelector(".ordersOfTitle").textContent = `Orders: ${userName}`;

async function getOrdersUser(userId) {
  const response = await fetch("/getOrders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId: userId }),
  });

  const result = await response.json();

  if (response.ok) {
    document.querySelector(".ordersNotFound").style.display = "none";
    document.querySelector(".ordersExist").style.display = "block";
    displayOrders(result.orders, true);
  } else {
    createMessage("The user has no orders", true);
    document.querySelector(".ordersNotFound").style.display = "block";
    document.querySelector(".ordersNotFound").style.height = "50vh";
    document.querySelector(".ordersNotFound").style.padding = "180px";
    document.querySelector(".ordersExist").style.display = "none";
  }
}

function createMessage(message, isError = false) {
  const messageEl = document.querySelector(".errMsg");
  messageEl.innerHTML = message;
  messageEl.style.color = isError ? "red" : "green";
  messageEl.style.display = "block";

  // Auto-hide message after 3 seconds
  setTimeout(() => {
    messageEl.style.display = "none";
  }, 3000);
}

document
  .querySelector("#orderSearch")
  .addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      findOrder();
    }
  });

async function findOrder() {
  const userId = userIdStorage;
  const orderId = document.querySelector("#orderSearch").value;
  if (orderId === "") {
    getOrdersUser(userId);
    return;
  }
  const response = await fetch("/getOrders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId: userId }),
  });

  const result = await response.json();

  let orderFound;
  if (response.ok) {
    result.orders.forEach((order) => {
      if (order._id === orderId) {
        orderFound = order;
      }
    });
    if (!orderFound) {
      document.querySelector(".errMsgSearch").textContent = "No order found";
      return;
    }

    document.querySelector(".errMsgSearch").textContent = "";

    displayOrders([orderFound]);
  } else {
    createMessage(result.message, true);
  }
}

const resetButton = document.querySelector(".reset-button");
if (resetButton) {
  resetButton.addEventListener("click", () => {
    document.querySelector("#orderSearch").value = "";
  });
}

async function displayOrders(data, admin = false) {
  const ordersContainer = document.querySelector(".orders-container");
  let count = 1;

  ordersContainer.innerHTML = "";

  data.forEach((order) => {
    const orderObj = document.createElement("div");
    orderObj.classList.add("order-card");
    orderObj.setAttribute("data-id", order._id);

    const orderDate = new Date(order.createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const maskedCard = "•••• •••• •••• " + order.creditCard.number.slice(-4);

    const itemsHtml = order.items
      .map(
        (item) => `
                <div class="order-item">
                    <div class="item-image-and-name">
                        <div class="item-image">
                            <img src="${item.product.primaryImage}" alt="${
          item.product.name
        }"
                                 onerror="this.src='/api/placeholder/150/150'">
                        </div>
                        <div class="item-details">
                            <span class="item-name">${item.product.name}</span>
                            <span class="item-id">Product ID: ${
                              item.product._id
                            }</span>
                            <span class="item-size">Size: ${
                              item.size || "N/A"
                            }</span>
                        </div>
                    </div>
                    <div class="item-price-info">
                        <span class="item-quantity">Quantity: ${
                          item.quantity
                        }</span>
                        <span class="item-price">$${item.product.price.toFixed(
                          2
                        )}</span>
                    </div>
                </div>
            `
      )
      .join("");

    orderObj.innerHTML = `
                <div class="order-header" onclick="toggleOrder(${count})">
                    <div class="order-summary">
                        <h2 class="order-title">Order #${count}</h2>
                        <span class="order-date">${orderDate}</span>
                        <span class="order-total-preview">$${order.totalPrice.toFixed(
                          2
                        )}</span>
                    </div>
                    <div style="display:flex; gap:12px;">
                        <button class="btn btnUpdateOrder" onclick="openModal('${
                          order._id
                        }')">Update Order</button>
                        <button class="btn btnDeleteOrder" onclick="deleteOrder('${
                          order._id
                        }')">Delete Order</button>
                        <span class="dropdown-arrow" style="display:flex;align-items:center;">▼</span>
                    </div>
                </div>

                <div class="order-details" id="order-${count}">
                    <div class="details-grid">
                        <div class="customer-info">
                            <h3>Customer Details</h3>
                            <p>Name on the order: ${
                              order.user.orderFullName
                            }</p>
                            <p>Customer name: ${order.user.userId.firstName} ${
      order.user.userId.lastName
    }</p>
                            <p class="text-muted">Order ID: ${order._id}</p>
                        </div>

                        <div class="shipping-info">
                            <h3>Shipping Address</h3>
                            <p>${order.shippingAddress.street}</p>
                            <p>${order.shippingAddress.city}</p>
                            <p>${order.shippingAddress.postalCode}</p>
                            <p>${order.shippingAddress.country}</p>
                            <p>${order.shippingAddress.phone}</p>
                        </div>

                        <div class="payment-info">
                            <h3>Payment Information</h3>
                            <p>Card: ${maskedCard}</p>
                            <p>Expires: ${order.creditCard.expirationDate}</p>
                        </div>
                    </div>

                    <div class="order-items">
                        <h3>Items</h3>
                        ${itemsHtml}
                    </div>

                    <div class="order-total">
                        <h3>Total Amount: $${order.totalPrice.toFixed(2)}</h3>
                    </div>
                </div>
            `;

    ordersContainer.appendChild(orderObj);
    count++;
  });

  toggleOrder(1);
}

function toggleOrder(orderNum) {
  const details = document.getElementById(`order-${orderNum}`);
  const arrow = details.previousElementSibling.querySelector(".dropdown-arrow");
  const isExpanded = details.classList.contains("expanded");

  document.querySelectorAll(".order-details").forEach((detail) => {
    if (detail.id !== `order-${orderNum}`) {
      detail.style.maxHeight = null;
      detail.classList.remove("expanded");
      detail.previousElementSibling.querySelector(
        ".dropdown-arrow"
      ).style.transform = "rotate(0deg)";
    }
  });

  if (isExpanded) {
    details.style.maxHeight = null;
    details.classList.remove("expanded");
    arrow.style.transform = "rotate(0deg)";
  } else {
    details.classList.add("expanded");
    details.style.maxHeight = details.scrollHeight + "px";
    arrow.style.transform = "rotate(180deg)";
  }
}

async function deleteOrder(id) {
  const confirmation = confirm("Are you sure you want to delete this order?");
  if (!confirmation) return;

  const orderItem = document.querySelector(`.order-card[data-id="${id}"]`);
  const response = await fetch("/deleteOrder", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ orderId: id }),
  });

  const result = await response.json();

  if (response.ok) {
    createMessage(result.message, false);
    orderItem.remove();
  } else {
    createMessage(result.message, true);
  }
}

let currentOrder = null;

function openModal(orderId) {
  event.stopPropagation();
  currentOrder = orderId;
  const orderElement = document.querySelector(
    `.order-card[data-id="${orderId}"]`
  );
  const orderData = getOrderDataFromElement(orderElement);

  document.getElementById("orderFullName").value = orderData.orderFullName;
  document.getElementById("street").value = orderData.address.street;
  document.getElementById("city").value = orderData.address.city;
  document.getElementById("postalCode").value = orderData.address.postalCode;
  document.getElementById("country").value = orderData.address.country;
  document.getElementById("phone").value = orderData.address.phone;

  const itemsContainer = document.getElementById("orderItems");
  itemsContainer.innerHTML = orderData.items
    .map(
      (item) => `
            <div class="update-item" data-product-id="${item.productId}">
                <img src="${item.image}" alt="${
        item.name
      }" onerror="this.src='/api/placeholder/150/150'">
                <div class="item-info">
                    <div>${item.name}</div>
                    <div>$${item.price}</div>
                </div>
                <div class="item-controls">
                    <select class="size-select">
                      <option value="37" ${
                        item.size === "37" ? "selected" : ""
                      }>37</option>
                      <option value="38" ${
                        item.size === "38" ? "selected" : ""
                      }>38</option>
                      <option value="39" ${
                        item.size === "39" ? "selected" : ""
                      }>39</option>
                      <option value="40" ${
                        item.size === "40" ? "selected" : ""
                      }>40</option>
                      <option value="41" ${
                        item.size === "41" ? "selected" : ""
                      }>41</option>
                      <option value="42" ${
                        item.size === "42" ? "selected" : ""
                      }>42</option>
                      <option value="43" ${
                        item.size === "43" ? "selected" : ""
                      }>43</option>
                      <option value="44" ${
                        item.size === "44" ? "selected" : ""
                      }>44</option>
                      <option value="45" ${
                        item.size === "45" ? "selected" : ""
                      }>45</option>
                      <option value="46" ${
                        item.size === "46" ? "selected" : ""
                      }>46</option>
                      <option value="47" ${
                        item.size === "47" ? "selected" : ""
                      }>47</option>
                      <option value="48" ${
                        item.size === "48" ? "selected" : ""
                      }>48</option>
                    </select>
                    <input type="number" class="quantity-input" value="${
                      item.quantity
                    }" min="1" max="99">
                    <span class="remove-item" onclick="removeItem(this)">🗑️</span>
                </div>
            </div>
        `
    )
    .join("");

  document.getElementById("updateOrderModal").style.display = "block";
  document
    .querySelector(".btnSaveChanges")
    .setAttribute("onclick", `updateOrder('${orderId}')`);
}

function closeModal() {
  document.getElementById("updateOrderModal").style.display = "none";
  currentOrder = null;
  errMsgModal.textContent = "";
}

function getOrderDataFromElement(orderElement) {
  const orderFullName = orderElement
    .querySelector(".customer-info p")
    .textContent.split(": ")[1];
  const address = {
    street: orderElement.querySelector(".shipping-info p:nth-child(2)")
      .textContent,
    city: orderElement.querySelector(".shipping-info p:nth-child(3)")
      .textContent,
    postalCode: orderElement.querySelector(".shipping-info p:nth-child(4)")
      .textContent,
    country: orderElement.querySelector(".shipping-info p:nth-child(5)")
      .textContent,
    phone: orderElement.querySelector(".shipping-info p:nth-child(6)")
      .textContent,
  };

  const items = Array.from(orderElement.querySelectorAll(".order-item")).map(
    (item) => ({
      productId: item.querySelector(".item-id").textContent.split(": ")[1],
      name: item.querySelector(".item-name").textContent,
      image: item.querySelector("img").src,
      price: parseFloat(item.querySelector(".item-price").textContent.slice(1)),
      quantity: parseInt(
        item.querySelector(".item-quantity").textContent.split(": ")[1]
      ),
      size: item.querySelector(".item-size").textContent.split(": ")[1],
    })
  );

  return {
    orderFullName,
    address,
    items,
  };
}

function removeItem(element) {
  const item = element.closest(".update-item");
  item.remove();
}

async function updateOrder(id) {
  //validations
  const phoneVal = document.getElementById("phone").value;
  const postalCodeVal = document.getElementById("postalCode").value;
  if (phoneVal.length < 8 || phoneVal < 0) {
    errMsgModal.textContent = "Phone number not valid";
    return;
  } else if (postalCodeVal < 0) {
    errMsgModal.textContent = "Postal Code not valid";
    return;
  }

  const updatedOrder = {
    user: {
      userId: userIdStorage,
      orderFullName: document.getElementById("orderFullName").value,
    },
    shippingAddress: {
      street: document.getElementById("street").value,
      city: document.getElementById("city").value,
      postalCode: postalCodeVal,
      country: document.getElementById("country").value,
      phone: phoneVal,
    },
    items: Array.from(document.querySelectorAll(".update-item")).map(
      (item) => ({
        product: item.dataset.productId,
        quantity: parseInt(item.querySelector(".quantity-input").value),
        size: item.querySelector(".size-select").value,
      })
    ),
    totalPrice: calculateTotalPrice(),
  };
  if (updatedOrder.totalPrice < 0) {
    return;
  }
  if (updatedOrder.items.length === 0) {
    deleteOrder(id);
    closeModal();
    return;
  }
  const confirmaton = confirm("Are you sure you want to update this order?");
  if (!confirmaton) return;
  try {
    const response = await fetch("/updateOrder", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ orderId: id, updatedOrder: updatedOrder }),
    });

    const result = await response.json();

    if (response.ok) {
      createMessage(result.message, false);
      closeModal();
      getOrdersUser(userIdStorage);
    } else {
      createMessage(result.message, true);
    }
  } catch (error) {
    console.error("Error:", error);
    createMessage("Error updating order", true);
  }
}

// Add phone validation
document.getElementById("phone").addEventListener("input", function (e) {
  let phone = this.value.replace(/\D/g, "");
  if (phone.length > 10) {
    phone = phone.substr(0, 10);
  }
  this.value = phone;
});

// Initialize the page
window.onload = getOrdersUser(userIdStorage);
