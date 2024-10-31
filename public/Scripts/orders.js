function createMessage(message, isError = false) {
  console.log(message);
  const messageEl = document.querySelector(".errMsg");
  console.log(messageEl);
  messageEl.innerHTML = message;
  messageEl.style.color = isError ? "red" : "green";
  messageEl.style.display = "block";
}

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
    displayOrders(result.orders);
  } else {
    createMessage(result.message, true);
    document.querySelector(".ordersNotFound").style.display = "block";
    document.querySelector(".ordersNotFound").style.height = "50vh";
    document.querySelector(".ordersNotFound").style.padding = "180px";
    document.querySelector(".ordersExist").style.display = "none";
  }
}

async function displayOrders(data,admin = false) {
  const ordersContainer = document.querySelector(".orders-container");
  let count = 1;

  // Clear existing content
  ordersContainer.innerHTML = "";

  data.forEach((order) => {
    const orderObj = document.createElement("div");
    orderObj.classList.add("order-card");

    // Format date
    const orderDate = new Date(order.createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    // Format credit card number
    const maskedCard = "•••• •••• •••• " + order.creditCard.number.slice(-4);

    // Create items HTML with images
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
                    ${admin? `<span>a</span>`:``}
                </div>
                <span class="dropdown-arrow">▼</span>
            </div>

            <div class="order-details" id="order-${count}">
                <div class="details-grid">
                    <div class="customer-info">
                        <h3>Customer Details</h3>
                        <p>Name on the order: ${order.user.orderFullName}</p>
                        <p>Customer name: ${order.user.userId.firstName} ${order.user.userId.lastName}</p>
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

  // Close all other orders
  document.querySelectorAll(".order-details").forEach((detail) => {
    if (detail.id !== `order-${orderNum}`) {
      detail.style.maxHeight = null;
      detail.classList.remove("expanded");
      detail.previousElementSibling.querySelector(
        ".dropdown-arrow"
      ).style.transform = "rotate(0deg)";
    }
  });

  // Toggle current order
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

const id = document.querySelector(".user-id").getAttribute("data-id");
window.onload = getOrdersUser(id);
