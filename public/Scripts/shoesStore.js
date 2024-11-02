async function confirmScreen(res, req) {
  window.location.href = "/completeOrder";
}

     document.getElementById('filter').addEventListener('change', function() {
  const selectedFilter = this.value;
  const genderFilter = document.getElementById('genderFilter').value;
  const currentPage = new URLSearchParams(window.location.search).get('page') || 1;
  
  window.location.href = `/store?page=${currentPage}&priceFilter=${selectedFilter}&genderFilter=${genderFilter}`;
});

document.getElementById('genderFilter').addEventListener('change', function() {
  const selectedGender = this.value;
  const priceFilter = document.getElementById('filter').value;
  const currentPage = new URLSearchParams(window.location.search).get('page') || 1;
  
  window.location.href = `/store?page=${currentPage}&priceFilter=${priceFilter}&genderFilter=${selectedGender}`;
});

const addCartBtn = document.querySelectorAll(".btn");
const userId = document.querySelector(".user-id") || 1;
addCartBtn.forEach((button) => {
  button.addEventListener("click", function () {
    if (userId === 1)
      createMessage(`Please log in to add items to your cart,<br> <a href="/login" style="text-decoration:underline;">Click here</a> to log in`, true);
  });
});

function createMessage(message, isError = false) {
  const messageEl = document.querySelector(".errorMessage");
  messageEl.innerHTML = message;
  messageEl.style.color = isError ? "red" : "green";
  messageEl.style.display = "block";
}

const addToCart = async (id, img, name, size, quantity, shoePrice) => {
  const basePrice = parseInt(shoePrice);
  const cartWindow = document.querySelector(".cart-window");
  const cart = document.querySelector("#cart-items");
  const emptyMsg = document.querySelector(".empty-cart");
  const errMsg = document.querySelector(".errorMessage");
  const checkOutBtn = document.querySelector(".checkOutBtn");
  const totalPriceBox = document.querySelector("#totalPrice");
  const priceEl = document.querySelector("#totalPrice").children[1];

  let found = false;
  cart.querySelectorAll(".cartItem").forEach((item) => {
    if (
      item.getAttribute("data-itemid") === id &&
      item.children[2].children[1].textContent === size
    ) {
      item.children[3].children[1].textContent =
        parseInt(item.children[3].children[1].textContent) + quantity;
      item.children[4].children[2].textContent =
        parseInt(item.children[4].children[2].textContent) +
        basePrice * quantity;
      priceEl.textContent =
        parseInt(priceEl.textContent) + basePrice * quantity;
      found = true;
      cartWindow.classList.add("show");
      saveCartToLocalStorage();
    }
  });

  if (found) return;
  if (size === "") {
    createMessage("Pick a shoe size", true);
  } else {
    cartWindow.classList.add("show");
    cartWindow.style.right = "125px";
    emptyMsg.style.display = "none";
    cartWindow.style.width = "550px";
    errMsg.style.display = "none";
    const newItem = document.createElement("div");
    checkOutBtn.style.display = "inline";
    totalPriceBox.style.display = "block";

    newItem.setAttribute("data-itemId", id);

    const imgItem = document.createElement("img");
    imgItem.src = img;
    imgItem.style.height = "96px";
    imgItem.style.width = "96px";
    newItem.appendChild(imgItem);

    const shoeName = document.createElement("p");
    shoeName.textContent = name;
    shoeName.style.fontWeight = "bold";
    newItem.appendChild(shoeName);

    const shoeSize = document.createElement("p");
    shoeSize.innerHTML = `<b>Size: </b> <span>${size}</span>`;
    newItem.appendChild(shoeSize);

    const shoeQuantity = document.createElement("p");
    shoeQuantity.innerHTML = `<b>Quantity: </b><span>${quantity}</span>`;
    newItem.appendChild(shoeQuantity);

    const price = document.createElement("p");
    price.innerHTML = `<b>Price: </b> <span>$</span><span>${
      basePrice * quantity
    }</span>`;
    newItem.appendChild(price);
    priceEl.textContent = parseInt(priceEl.textContent) + basePrice * quantity;

    const removeBtn = document.createElement("button");
    removeBtn.style.marginLeft = "auto";
    removeBtn.textContent = "X";
    removeBtn.style.cursor = "pointer";
    removeBtn.style.border = "none";

    removeBtn.addEventListener("click", () => {
      if (newItem.children[3].children[1].textContent >= 1) {
        newItem.children[3].children[1].textContent =
          parseInt(newItem.children[3].children[1].textContent) - 1;

        if (newItem.children[3].children[1].textContent == 0) {
          newItem.remove();
        }
        newItem.children[4].children[2].textContent =
          parseInt(newItem.children[4].children[2].textContent) - basePrice;
        priceEl.textContent = parseInt(priceEl.textContent) - basePrice;

        saveCartToLocalStorage();
      }
      if (cart.children.length === 1) {
        emptyMsg.style.display = "block";
        cartWindow.style.width = "200px";
        cartWindow.style.right = "310px";

        checkOutBtn.style.display = "none";
        totalPriceBox.style.display = "none";
      }
    });
    newItem.appendChild(removeBtn);

    newItem.style.display = "flex";
    newItem.style.padding = "8px";
    newItem.style.alignItems = "center";
    newItem.style.gap = "16px";
    newItem.style.fontSize = "14px";
    newItem.style.backgroundColor = "#f5f5f5";
    newItem.style.marginBottom = "12px";
    newItem.style.borderRadius = "8px";

    newItem.classList.add("cartItem");

    cart.prepend(newItem);
    saveCartToLocalStorage();
  }
};

const saveCartToLocalStorage = () => {
  const cartItems = [];
  document.querySelectorAll(".cartItem").forEach((item) => {
    cartItems.push({
      id: item.getAttribute("data-itemid"),
      size: parseInt(item.children[2].children[1].textContent),
      quantity: parseInt(item.children[3].children[1].textContent),
      price: parseInt(item.children[4].children[2].textContent),
      img: item.children[0].src,
      name: item.children[1].textContent,
    });
  });
  localStorage.setItem("cart", JSON.stringify(cartItems));
};

const carton = document.querySelector(".cart-box");
carton.style.display = "block";

document.addEventListener("DOMContentLoaded", () => {
  loadCartFromLocalStorage();
});
const getExchangeRateILS = async (req, res) => {
  const response = await fetch(
    `https://v6.exchangerate-api.com/v6/9f9809c90629cbd5096bc36d/latest/USD`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const result = await response.json();

  if (response.ok) {
    return result.conversion_rates.ILS;
  } else {
    return null;
  }
};

const convertPriceCurrency = async (code = 1) => {
  const shoesContainerEl = document.querySelector(".shoes-container");
  const rate = parseFloat((await getExchangeRateILS()).toFixed(3));
  const coinSymbol = document.querySelector(".coinSymbol");
  shoesContainerEl.querySelectorAll(".shoe").forEach((shoe) => {
    const priceEl = shoe.children[3].children[2];
    const priceSymbol = shoe.children[3].children[1];

    const priceVal = parseFloat(priceEl.textContent.replace(/[^\d.]/g, ""));
    let newPrice = 0;
    if (!isNaN(priceVal)) {
      if (code === 1) {
        coinSymbol.textContent = "ILS";
        newPrice = (priceVal * rate).toFixed(2);
        priceEl.textContent = `${newPrice}`;
        priceSymbol.textContent = "₪";
      } else {
        coinSymbol.textContent = "USD";
        newPrice = (priceVal / rate).toFixed(2);
        priceEl.textContent = `${newPrice}`;
        priceSymbol.textContent = "$";
      }
    }
  });
};

const loadCartFromLocalStorage = () => {
  const cartItems = JSON.parse(localStorage.getItem("cart") || "[]");
  cartItems.forEach((item) => {
    addToCart(
      item.id,
      item.img,
      item.name,
      item.size,
      item.quantity,
      item.price / item.quantity
    );
  });
};
