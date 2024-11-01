function createMessage(message, isError = false) {
  const messageEl = document.querySelector(".errMsg");
  messageEl.textContent = message;
  messageEl.style.color = isError ? "red" : "green";
  messageEl.style.display = "block";
}

async function comfirmOrder() {
  const userId = document.querySelector("#userIdConfirm").value;
  const fullName = document.querySelector("#nameConfirm").value;
  const street = document.querySelector("#streetConfirm").value;
  const city = document.querySelector("#cityConfirm").value;
  let postalCode = document.querySelector("#postalCodeConfirm").value;
  const country = document.querySelector("#countryConfirm").value;
  const phone = document.querySelector("#phoneConfirm").value;
  const creditCard = document.querySelector("#credit-card").value;
  const cvv = document.querySelector("#cvv").value;
  const expDate = document.querySelector("#expiration-date").value;
  const messageEl = document.querySelector(".errMsg");
  const shoesConfirmContainer = document.querySelector(
    ".shoesConfirmContainer"
  );
  if (!fullName || !street || !city || !country || !phone || !creditCard || !cvv || !expDate) {
    createMessage("Please fill in all required fields", true);
    return;
  }
  else if (phone.length < 8) {
    createMessage("Phone number must contain at least 8 digits", true);
    return;
  } else if (creditCard.length !== 16) {

    createMessage("Card number must be 16 didgits only", true);
    return;
  } else if (cvv.length !== 3) {

    createMessage("CVV number must be 3 digits only", true);
    return;
  } else if (new Date(expDate) < new Date() || !expDate) {

    createMessage("Expiration date cannot be in the past", true);
    return;
  }else if(phone<0){
    createMessage("Phone number cannot be negative", true);

  } else {
    if (postalCode === "") postalCode = 0;
    messageEl.style.display = "none";
    data = {};
    data.user = {};
    data.user.userId = userId;
    data.user.orderFullName = fullName;
    data.items = [];
    document.querySelectorAll(".shoeConfirm").forEach((shoe) => {
      const item = {
        product: shoe.getAttribute("data-id"),
        size: shoe.querySelector("p:nth-of-type(2) span").textContent,
        quantity: shoe.querySelector("p:nth-of-type(3) span").textContent,
      };
      data.items.push(item);
    });
    data.shippingAddress = {};
    data.shippingAddress.street = street;
    data.shippingAddress.city = city;
    data.shippingAddress.postalCode = postalCode;
    data.shippingAddress.country = country;
    data.shippingAddress.phone = phone;
    data.creditCard = {};
    data.creditCard.number = creditCard;
    data.creditCard.cvv = cvv;
    data.creditCard.expirationDate = expDate;
    data.totalPrice = document
      .getElementById("totalPriceDisplay")
      .textContent.replace("$", "");

    const response = await fetch("/confirmOrder", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data }),
    });

    const result = await response.json();

    if (response.ok) {
        createMessage("Order confirmed...");
        await new Promise(resolve => setTimeout(resolve, 1500));
      // Clear the cart in local storage
      localStorage.removeItem("cart");
      document.querySelector(".makeOrder").style.display = "none";
      document.querySelector(".successOrder").style.display = "flex";
      const sucMsg = document.querySelector(".successOrder").children[0];
      sucMsg.innerHTML = `${result.message}<br>Order confirmation: ${result.orderId}`;
    } else {
      createMessage(result.message,true);
    }
  }
}

const displayShoesFromLocalStorage = () => {
  const shoesContainer = document.querySelector(".shoesConfirmContainer");
  const cartItems = JSON.parse(localStorage.getItem("cart") || "[]");
  let totalPrice = 0;
  
  if(cartItems.length === 0){
    window.location.href = "/store";
    return;
  }
  cartItems.forEach((item) => {
    const shoeItem = document.createElement("div");
    shoeItem.classList.add("shoeConfirm");

    const imgItem = document.createElement("img");
    imgItem.src = item.img;
    imgItem.style.height = "96px";
    imgItem.style.width = "96px";
    shoeItem.appendChild(imgItem);

    const shoeName = document.createElement("p");
    shoeName.textContent = item.name;
    shoeName.style.fontWeight = "bold";
    shoeItem.appendChild(shoeName);

    const shoeSize = document.createElement("p");
    shoeSize.innerHTML = `<b>Size: </b> <span>${item.size}</span>`;
    shoeItem.appendChild(shoeSize);

    const shoeQuantity = document.createElement("p");
    shoeQuantity.innerHTML = `<b>Quantity: </b><span>${item.quantity}</span>`;
    shoeItem.appendChild(shoeQuantity);

    const price = document.createElement("p");
    price.innerHTML = `<b>Price: </b> <span>$</span><span>${item.price}</span>`;
    shoeItem.appendChild(price);

    shoeItem.setAttribute("data-id", item.id);
    shoesContainer.appendChild(shoeItem);

    // Calculate total price
    totalPrice += item.price;
  });

  // Display total price
  document.getElementById(
    "totalPriceDisplay"
  ).textContent = `$${totalPrice.toFixed(2)}`;
};

window.onload = displayShoesFromLocalStorage;